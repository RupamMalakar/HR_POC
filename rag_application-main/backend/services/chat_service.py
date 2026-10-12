import logging
import re
import time
from typing import Optional, List, Tuple
from openai import APIError, AuthenticationError, RateLimitError
from langchain_core.messages import HumanMessage, AIMessage

from backend.config import settings, ConfigurationError
from backend.models import ChatRequest, ChatResponse, ChatMessage, SourceItem
from backend.rag.chain import (
    build_rag_prompt,
    extract_deduplicated_sources,
    format_context_documents,
    get_azure_chat_llm,
    get_rag_chat_llm,
)
from backend.rag.policy_store import get_policy_engine, PolicyArticle, SearchResult

# Suppress harmless pypdf startxref warnings on two-pass generated PDFs
logging.getLogger("pypdf").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)


class ChatServiceError(Exception):
    """General domain error for ChatService operations."""
    pass


# Circuit Breaker state to prevent waiting on timeouts when Azure OpenAI is offline
_azure_circuit_open_until: float = 0.0
_circuit_failure_reason: str = ""


class ChatService:
    """Service handling multi-turn conversation and grounded policy retrieval."""

    def __init__(self, top_k: Optional[int] = None):
        self.top_k = top_k or settings.TOP_K
        self.engine = get_policy_engine()

    def answer_question(self, request: ChatRequest) -> ChatResponse:
        """
        Executes the conversational RAG pipeline for a given user question:
        1. Checks for pure pleasantries/greetings.
        2. Retrieves relevant policy articles with multi-turn query resolution.
        3. If Azure/OpenAI LLM is available, passes grounded context and history to the LLM.
        4. Otherwise, generates a structured, high-precision grounded Markdown answer.
        """
        global _azure_circuit_open_until, _circuit_failure_reason
        question = request.question.strip()
        history = request.history or []
        logger.info(f"Processing question: '{question[:80]}...' (History depth: {len(history)})")

        # 1. Handle pure greetings and pleasantries
        if self.engine.is_pure_greeting(question):
            return ChatResponse(
                answer=(
                    "Hello! I am your TCS Enterprise HR Policy Copilot.\n\n"
                    "I am directly grounded in official Tata Consultancy Services policies & Ultimatix Global HR manuals, including:\n"
                    "- **Associate Leave Policy**: Earned Leave (16 days/yr, 45-day accumulation cap), Casual Leave (7 days), Sick Leave (10 days), Maternity (26 wks), Paternity (5 days), and Comp-Off rules\n"
                    "- **Workplace & Return to Office (RTO)**: 5-day in-office mandate, 85% monthly turnstile attendance, QPP variable linkage, and SBWS™ protocols\n"
                    "- **Total Rewards & Benefits**: Grade structure (Bands Y-C5), Bouquet of Benefits (BoB), TCS-HIS medical insurance (Rs 5L family floater + parent top-up), EPF, Gratuity, NPS, and Pet Insurance\n"
                    "- **Global Travel & Business Expenses**: Ultimatix GTS booking, economy air (>2.5h), Rs 1,500/day Metro DA, Rs 3,500 Ginger/Taj lodging caps, Rs 8/km mileage, and 15-day settlement\n"
                    "- **Information Security (ISMS ISO 27001)**: Ultimatix MFA, 14-character passwords, clean desk 3-min screen lock, USB storage ban, GenAI code pasting prohibition, 1-hr GSOC SLA\n"
                    "- **Tata Code of Conduct (TCoC)**: Anti-bribery, POSH ICC inquiry standards, strict ban on moonlighting/dual employment, professional dress code, and 90-day notice period\n"
                    "- **Performance Management (GEMS)**: Balanced Scorecard, 5-tier rating (Bands A-E), iEvolve 40-hr learning mandate, T-Factor score, and structured PIP enablement\n\n"
                    "How can I assist you with TCS associate policies today?"
                ),
                sources=[],
            )

        # 2. Retrieve grounded policy articles from the policy engine
        history_dicts = [{"role": m.role, "content": m.content} for m in history]
        results, is_match = self.engine.search(question, history=history_dicts, top_k=self.top_k)

        # 3. Handle out-of-scope queries with zero false citations
        if not is_match:
            return ChatResponse(
                answer=(
                    "I searched the TCS Global Policy Knowledge Base (covering Associate Leave, Workplace & Return to Office, "
                    f"Total Rewards & Benefits, Global Travel & Expenses, Information Security ISMS, Tata Code of Conduct, and Performance Management), but did not find an official corporate policy addressing **\"{question}\"**.\n\n"
                    "### Recommended Next Steps:\n"
                    "- If this is an exceptional accommodation or clarification request, please submit an inquiry on the Ultimatix Global Helpdesk.\n"
                    "- You can also reach your Unit HR (UHR) specialist or Delivery Manager directly."
                ),
                sources=[],
            )

        # 4. Check if external LLM is configured and reachable
        llm = get_rag_chat_llm()
        if llm is not None:
            now = time.time()
            if now >= _azure_circuit_open_until:
                try:
                    return self._generate_with_llm(llm, question, history, results)
                except Exception as e:
                    _azure_circuit_open_until = time.time() + 180.0
                    _circuit_failure_reason = str(e)
                    logger.warning(f"External LLM generation failed ({e}), falling back to grounded synthesis.")

        # 5. Synthesize grounded answer via Policy Knowledge Engine
        answer = self.engine.synthesize_grounded_answer(question, results, history=history_dicts)

        # Extract deduplicated sources with exact page numbers
        sources: List[SourceItem] = []
        seen = set()
        for res in results:
            art = res.article
            key = (art.doc_filename, art.page)
            if key not in seen:
                seen.add(key)
                sources.append(SourceItem(document=art.doc_filename, page=art.page))

        return ChatResponse(answer=answer, sources=sources)

    def _generate_with_llm(
        self, llm, question: str, history: List[ChatMessage], results: List[SearchResult]
    ) -> ChatResponse:
        """Invokes configured LLM with retrieved context documents and dialogue history."""
        # Format context documents from retrieved articles
        context_pieces = []
        sources: List[SourceItem] = []
        seen = set()

        for res in results:
            art = res.article
            key = (art.doc_filename, art.page)
            if key not in seen:
                seen.add(key)
                sources.append(SourceItem(document=art.doc_filename, page=art.page))

            table_str = ""
            if art.table_headers and art.table_rows:
                table_str = "\nTable:\n" + " | ".join(art.table_headers) + "\n"
                for row in art.table_rows:
                    table_str += " | ".join(row) + "\n"

            context_pieces.append(
                f"--- Document: {art.doc_filename} (Page {art.page}) ---\n"
                f"Title: {art.article_title}\n"
                f"Section: {art.subtitle}\n"
                f"Content: {art.text_content}\n"
                f"{table_str}"
                f"Bullets: {' '.join(art.bullets)}\n"
                f"Callout: {art.callout_label} {art.callout_text}\n"
            )

        formatted_context = "\n\n".join(context_pieces)

        # Build LangChain history
        lc_messages = []
        for item in history[-6:]:
            role = item.role.lower().strip()
            content = item.content.strip()
            if not content:
                continue
            if role in ("user", "human"):
                lc_messages.append(HumanMessage(content=content))
            elif role in ("assistant", "ai", "bot"):
                lc_messages.append(AIMessage(content=content))

        prompt = build_rag_prompt()
        messages = prompt.format_messages(
            context=formatted_context,
            history=lc_messages,
            question=question,
        )
        response = llm.invoke(messages)
        answer = response.content if hasattr(response, "content") else str(response)
        if isinstance(answer, list):
            answer = "".join(str(part) for part in answer)

        return ChatResponse(answer=answer.strip(), sources=sources)
