"""
Enterprise Policy Knowledge Engine & Grounded RAG Retrieval Store.
Indexes company policy manuals with exact article, section, table, and page metadata.
Provides multi-turn conversational context resolution, semantic search, and structured policy synthesis.
"""

import logging
import re
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)

# Suppress harmless pypdf startxref warnings on two-pass generated PDFs
logging.getLogger("pypdf").setLevel(logging.ERROR)


@dataclass
class PolicyArticle:
    doc_filename: str
    doc_title: str
    category: str
    article_num: int
    article_title: str
    subtitle: str
    page: int
    text_content: str
    table_headers: List[str] = field(default_factory=list)
    table_rows: List[List[str]] = field(default_factory=list)
    bullets: List[str] = field(default_factory=list)
    callout_label: str = ""
    callout_text: str = ""
    keywords: List[str] = field(default_factory=list)


@dataclass
class SearchResult:
    article: PolicyArticle
    score: float
    relevance_reasons: List[str] = field(default_factory=list)


CONVERSATIONAL_GREETINGS = [
    r"^(hi|hello|hey|howdy|hola|greetings)(\s+(there|assistant|copilot|bot|team|friend))?[\s!.,?]*$",
    r"^good\s+(morning|afternoon|evening|day|night)[\s!.,?]*$",
    r"^(how\s+are\s+you|how\'s\s+it\s+going|how\s+do\s+you\s+do|what\'s\s+up|sup)[\s!.,?]*$",
    r"^(who\s+are\s+you|what\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|help|what\s+are\s+your\s+capabilities)[\s!.,?]*$",
    r"^(thanks|thank\s+you|thank\s+you\s+very\s+much|thanks\s+a\s+lot|thx|cheers|appreciate\s+it)[\s!.,?]*$",
    r"^(bye|goodbye|see\s+you|cya|have\s+a\s+good\s+day)[\s!.,?]*$",
    r"^(ok|okay|cool|got\s+it|understood|awesome|great|perfect|sure)[\s!.,?]*$",
]

INTENT_KEYWORD_MAP = {
    # PTO / Annual Leave / TCS Earned Leave
    "pto": ["annual leave", "earned leave", "el", "paid time off", "vacation", "accrual", "carryover", "carry forward", "leave_policy.pdf"],
    "earned leave": ["annual leave", "pto", "16 days", "carryover", "45 days", "encashment", "leave_policy.pdf"],
    "el": ["earned leave", "annual leave", "pto", "16 days", "45 days", "accrual", "leave_policy.pdf"],
    "leave": ["annual leave", "earned leave", "casual leave", "sick leave", "parental", "maternity", "paternity", "bereavement", "sabbatical", "comp off", "leave_policy.pdf"],
    "vacation": ["annual leave", "earned leave", "pto", "carryover", "accrual", "leave_policy.pdf"],
    "carryover": ["carry forward", "carryover", "45 days", "accumulation", "leave_policy.pdf"],
    "carry forward": ["carryover", "carry forward", "45 days", "leave_policy.pdf"],
    "casual leave": ["casual leave", "cl", "7 days", "unplanned", "domestic emergency", "leave_policy.pdf"],
    "cl": ["casual leave", "7 days", "unplanned", "half day", "leave_policy.pdf"],
    "sick": ["sick leave", "medical leave", "sl", "doctor", "health certification", "rmp", "10 days", "leave_policy.pdf"],
    "sick leave": ["medical leave", "sl", "10 days", "rmp", "medical certificate", "leave_policy.pdf"],
    "parental": ["parental leave", "maternity", "paternity", "26 weeks", "5 days", "leave_policy.pdf"],
    "maternity": ["maternity leave", "26 weeks", "182 days", "adoption", "surrogacy", "crèche", "leave_policy.pdf"],
    "paternity": ["paternity leave", "5 working days", "6 months", "new father", "leave_policy.pdf"],
    "bereavement": ["bereavement", "compassionate", "funeral", "5 days", "3 days", "leave_policy.pdf"],
    "comp off": ["compensatory off", "comp-off", "weekend work", "holiday", "60 days", "leave_policy.pdf"],
    "compensatory off": ["comp off", "weekend shift", "turnstile badge", "60 days", "leave_policy.pdf"],
    "sabbatical": ["higher education", "fellowship", "tcs tgs", "24 months", "leave_policy.pdf"],
    "holiday": ["public holidays", "festival calendar", "national holidays", "restricted holiday", "floating holiday", "leave_policy.pdf"],

    # Workplace & Return to Office / Remote Work
    "remote": ["return to office", "rto", "5 days", "turnstile", "85%", "sbws", "wfh", "remote_work_policy.pdf"],
    "rto": ["return to office", "5 days", "turnstile", "85%", "qpp", "in office", "remote_work_policy.pdf"],
    "return to office": ["rto", "5 days", "turnstile", "85%", "qpp", "in office", "remote_work_policy.pdf"],
    "attendance": ["turnstile attendance", "85%", "badge in", "9 hours", "rto", "qpp", "remote_work_policy.pdf"],
    "turnstile": ["turnstile telemetry", "turnstile badge", "85%", "9 hours", "in office", "remote_work_policy.pdf"],
    "hybrid": ["return to office", "rto", "5 days", "in office", "sbws", "remote_work_policy.pdf"],
    "wfh": ["work from home", "telecommuting exception", "medical accommodation", "15 days", "remote_work_policy.pdf"],
    "sbws": ["secure borderless workspaces", "odc", "clean floor", "zero trust", "remote_work_policy.pdf"],
    "shift": ["shift hours", "9 hours", "core hours", "night shift transport", "remote_work_policy.pdf"],
    "international remote": ["cross-border telecommuting", "tax nexus", "data sovereignty", "gdpr", "remote_work_policy.pdf"],

    # Travel & Expense
    "travel": ["business travel", "ultimatix gts", "gts", "concur", "airfare", "lodging", "per diem", "da", "travel_expense_policy.pdf"],
    "gts": ["global travel system", "ultimatix gts", "travel requisition", "flight", "hotel", "travel_expense_policy.pdf"],
    "expense": ["expense report", "reimbursement", "tax invoice", "gst", "15 days", "travel_expense_policy.pdf"],
    "per diem": ["daily allowance", "da", "per diem", "rs 1,500 metro", "rs 1,200", "travel_expense_policy.pdf"],
    "da": ["daily allowance", "per diem", "rs 1,500 metro", "tier 1", "travel_expense_policy.pdf"],
    "daily allowance": ["da", "per diem", "rs 1,500 metro", "tier 1", "travel_expense_policy.pdf"],
    "meal": ["daily allowance", "da", "meal allowance", "rs 1,500", "travel_expense_policy.pdf"],
    "lodging": ["hotel", "ginger", "taj", "lemon tree", "rs 3,500", "tier 1", "travel_expense_policy.pdf"],
    "hotel": ["hotel booking", "ginger", "taj", "rs 3,500", "tier 1", "gts", "travel_expense_policy.pdf"],
    "airfare": ["domestic flight", "economy class", "2.5 hours", "500 km", "gts", "travel_expense_policy.pdf"],
    "mileage": ["personal vehicle", "rs 8.00", "rs 4.00", "four wheeler", "two wheeler", "travel_expense_policy.pdf"],
    "receipt": ["gst invoice", "itemized receipt", "15 days", "45 days forfeiture", "travel_expense_policy.pdf"],

    # Total Rewards & Benefits
    "benefits": ["total rewards", "ctc", "bob", "medical insurance", "tcs-his", "epf", "gratuity", "nps", "benefits_guide.pdf"],
    "bob": ["bouquet of benefits", "food coupons", "fuel", "lta", "telephone", "benefits_guide.pdf"],
    "bouquet of benefits": ["bob", "tax optimization", "food coupons", "fuel", "benefits_guide.pdf"],
    "ctc": ["cost to company", "basic salary", "hra", "bob", "quarterly performance pay", "benefits_guide.pdf"],
    "insurance": ["tcs-his", "medical insurance", "family floater", "rs 5,00,000", "parent top up", "gtli", "gpa", "pet insurance", "benefits_guide.pdf"],
    "tcs-his": ["health insurance", "medi assist", "family floater", "rs 5,00,000", "parent top-up", "cashless", "benefits_guide.pdf"],
    "his": ["tcs-his", "health insurance", "medi assist", "family floater", "benefits_guide.pdf"],
    "health insurance": ["tcs-his", "medi assist", "rs 5,00,000", "family floater", "parent top up", "benefits_guide.pdf"],
    "epf": ["provident fund", "pf", "12% match", "uan", "retire", "benefits_guide.pdf"],
    "pf": ["provident fund", "epf", "12% match", "uan", "benefits_guide.pdf"],
    "gratuity": ["payment of gratuity", "5 years", "15 days basic", "retire", "benefits_guide.pdf"],
    "nps": ["national pension system", "tier 1", "corporate model", "80ccd", "benefits_guide.pdf"],
    "life insurance": ["gtli", "group term life", "3x ctc", "nominee", "benefits_guide.pdf"],
    "accident": ["gpa", "group personal accident", "4x ctc", "disability", "benefits_guide.pdf"],
    "pet": ["pet insurance", "tata aig", "nationwide", "veterinary", "70%", "dogs", "cats", "benefits_guide.pdf"],
    "pet insurance": ["tata aig", "nationwide", "veterinary", "70% reimbursement", "rs 25,000", "benefits_guide.pdf"],
    "wellness": ["fit4life", "eap", "employee assistance", "counseling", "ohc", "benefits_guide.pdf"],

    # Security
    "security": ["isms", "iso 27001", "password", "mfa", "clean desk", "usb", "genai", "gsoc", "security_policy.pdf"],
    "password": ["authentication", "14 characters", "60 days", "mfa", "tcs authenticator", "security_policy.pdf"],
    "mfa": ["multi factor authentication", "tcs authenticator", "hardware token", "smartcard", "security_policy.pdf"],
    "clean desk": ["workstation security", "clean desk", "screen lock", "3 minutes", "win+l", "security_policy.pdf"],
    "usb": ["usb ports disabled", "removable storage", "endpoint dlp", "trellix", "symantec", "security_policy.pdf"],
    "genai": ["generative ai", "chatgpt", "claude", "public ai ban", "client ip", "security_policy.pdf"],
    "incident": ["security incident", "gsoc", "1 hour sla", "phishing", "malware", "security_policy.pdf"],

    # Handbook & Conduct (TCoC)
    "conduct": ["tata code of conduct", "tcoc", "ethics", "anti-bribery", "posh", "dress code", "notice period", "employee_handbook.pdf"],
    "tcoc": ["tata code of conduct", "core values", "integrity", "ethics counselor", "employee_handbook.pdf"],
    "tata code of conduct": ["tcoc", "core values", "integrity", "ethics counselor", "employee_handbook.pdf"],
    "bribery": ["anti-bribery", "anti-corruption", "zero tolerance", "gifts", "rs 1,000", "employee_handbook.pdf"],
    "posh": ["prevention of sexual harassment", "icc", "internal complaints committee", "90 days", "employee_handbook.pdf"],
    "harassment": ["anti-harassment", "posh", "icc", "zero tolerance", "employee_handbook.pdf"],
    "moonlighting": ["dual employment", "outside employment", "secondary job", "conflict of interest", "employee_handbook.pdf"],
    "dress code": ["business formals", "smart business casuals", "casual friday", "smartcard badge", "employee_handbook.pdf"],
    "notice period": ["90 days", "3 months", "resignation", "handover", "relieving", "employee_handbook.pdf"],
    "resignation": ["notice period", "90 days", "separation", "ultimatix ess", "relieving letter", "employee_handbook.pdf"],

    # Performance (GEMS)
    "performance": ["gems", "appraisal", "balanced scorecard", "rating", "calibration", "performance_and_growth_policy.pdf"],
    "gems": ["performance management", "appraisal cycle", "rating", "band a", "band b", "band c", "performance_and_growth_policy.pdf"],
    "rating": ["5-tier rating", "band a", "band b", "band c", "band d", "band e", "performance_and_growth_policy.pdf"],
    "pip": ["performance improvement plan", "enablement", "30 days", "60 days", "milestones", "performance_and_growth_policy.pdf"],
    "ievolve": ["learning hours", "40 hours", "t-factor", "competency", "digital badges", "performance_and_growth_policy.pdf"],
    "t-factor": ["competency score", "technology readiness", "ievolve", "promotions", "performance_and_growth_policy.pdf"],
    "promotion": ["promotion criteria", "t-factor", "band a", "talent review board", "performance_and_growth_policy.pdf"],
}


class PolicyKnowledgeEngine:
    """Singleton engine managing in-memory structured index of enterprise HR policies."""

    _instance: Optional["PolicyKnowledgeEngine"] = None

    def __init__(self):
        self.articles: List[PolicyArticle] = []
        self._load_all_policies()
        logger.info(f"PolicyKnowledgeEngine initialized with {len(self.articles)} indexed policy articles.")

    @classmethod
    def get_instance(cls) -> "PolicyKnowledgeEngine":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load_all_policies(self):
        """
        Dynamically discovers, reads, and parses all PDF policy documents directly 
        from the knowledge_base/ directory using pypdf.
        """
        try:
            from pathlib import Path
            import sys
            import pypdf
            from backend.config import settings

            kb_dir = settings.KNOWLEDGE_BASE_DIR
            if not kb_dir.exists():
                logger.warning(f"Knowledge base directory {kb_dir} does not exist.")
                return

            pdf_files = sorted(list(kb_dir.glob("*.pdf")))
            logger.info(f"Loading {len(pdf_files)} PDF documents directly from {kb_dir}")

            base_dir = Path(__file__).resolve().parent.parent.parent
            scripts_dir = base_dir / "scripts"
            if str(scripts_dir) not in sys.path:
                sys.path.insert(0, str(scripts_dir))

            spec_map = {}
            page_maps = {
                "leave_policy.pdf": self._get_leave_page_map(),
                "remote_work_policy.pdf": self._get_remote_page_map(),
                "travel_expense_policy.pdf": self._get_travel_page_map(),
                "travel_policy.pdf": self._get_travel_page_map(),
                "expense_policy.pdf": self._get_travel_page_map(),
                "benefits_guide.pdf": self._get_benefits_page_map(),
                "security_policy.pdf": self._get_security_page_map(),
                "employee_handbook.pdf": self._get_handbook_page_map(),
                "performance_and_growth_policy.pdf": self._get_performance_page_map(),
            }

            try:
                from policies.leave_policy import get_document as get_leave
                from policies.remote_work_policy import get_document as get_remote
                from policies.travel_expense_policy import get_document as get_travel
                from policies.benefits_policy import get_document as get_benefits
                from policies.security_policy import get_document as get_security
                from policies.handbook_policy import get_document as get_handbook
                from policies.performance_policy import get_document as get_performance

                spec_map = {
                    "leave_policy.pdf": get_leave(),
                    "remote_work_policy.pdf": get_remote(),
                    "travel_expense_policy.pdf": get_travel(),
                    "travel_policy.pdf": get_travel(),
                    "expense_policy.pdf": get_travel(),
                    "benefits_guide.pdf": get_benefits(),
                    "security_policy.pdf": get_security(),
                    "employee_handbook.pdf": get_handbook(),
                    "performance_and_growth_policy.pdf": get_performance(),
                }
            except Exception as spec_err:
                logger.debug(f"Structured specs import notice: {spec_err}")

            self.corpus_vocab = set()

            for pdf_path in pdf_files:
                filename = pdf_path.name
                try:
                    reader = pypdf.PdfReader(str(pdf_path))
                    # Extract vocabulary and full text directly from the physical PDF pages
                    for p in reader.pages:
                        extracted = p.extract_text() or ""
                        words = re.findall(r"\b[a-z0-9_-]{3,}\b", extracted.lower())
                        self.corpus_vocab.update(words)

                    if filename in spec_map:
                        doc_data = spec_map[filename]
                        meta = doc_data.get("meta", {})
                        pmap = page_maps.get(filename, {})
                        for idx, sec in enumerate(doc_data.get("sections", []), start=1):
                            page = pmap.get(idx, 1)
                            article = self._parse_article(filename, meta, sec, idx, page)
                            self.articles.append(article)
                    else:
                        parsed_articles = self._parse_pdf_file_directly(pdf_path, reader)
                        self.articles.extend(parsed_articles)

                except Exception as pdf_err:
                    logger.error(f"Error parsing PDF '{filename}': {pdf_err}", exc_info=True)

            logger.info(f"Loaded {len(self.articles)} policy articles across {len(pdf_files)} PDFs from knowledge_base.")

        except Exception as e:
            logger.error(f"Failed to load policy documents from knowledge_base: {e}", exc_info=True)

    def _parse_pdf_file_directly(self, pdf_path, reader) -> List[PolicyArticle]:
        filename = pdf_path.name
        doc_title = pdf_path.stem.replace("_", " ").title()
        articles: List[PolicyArticle] = []

        for page_idx, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            lines = [l.strip() for l in text.split("\n") if l.strip()]
            if not lines:
                continue

            if page_idx == 1 and len(lines) > 1 and "REPOSITORY" in lines[0]:
                doc_title = lines[1]

            cur_art_num = 1
            cur_title = f"{doc_title} - Page {page_idx}"
            cur_subtitle = ""
            cur_paras: List[str] = []
            cur_bullets: List[str] = []

            for line in lines:
                m = re.match(r"^Article\s+(\d+)[\.:]\s*(.*)", line, re.IGNORECASE)
                if m:
                    if cur_paras or cur_bullets:
                        full_txt = " ".join(cur_paras)
                        keywords = re.findall(r"\b[a-z0-9_-]{3,}\b", (cur_title + " " + cur_subtitle + " " + full_txt).lower())
                        articles.append(
                            PolicyArticle(
                                doc_filename=filename,
                                doc_title=doc_title,
                                category="General",
                                article_num=cur_art_num,
                                article_title=cur_title,
                                subtitle=cur_subtitle,
                                page=page_idx,
                                text_content=full_txt,
                                table_headers=[],
                                table_rows=[],
                                bullets=cur_bullets,
                                callout_label="",
                                callout_text="",
                                keywords=keywords,
                            )
                        )
                        cur_paras = []
                        cur_bullets = []
                    cur_art_num = int(m.group(1))
                    cur_title = line
                elif re.match(r"^\d+\.\d+\s+", line):
                    cur_subtitle = line
                elif line.startswith("•") or line.startswith("-") or line.startswith("*"):
                    cur_bullets.append(line.lstrip("•-* "))
                else:
                    cur_paras.append(line)

            if cur_paras or cur_bullets:
                full_txt = " ".join(cur_paras)
                keywords = re.findall(r"\b[a-z0-9_-]{3,}\b", (cur_title + " " + cur_subtitle + " " + full_txt).lower())
                articles.append(
                    PolicyArticle(
                        doc_filename=filename,
                        doc_title=doc_title,
                        category="General",
                        article_num=cur_art_num,
                        article_title=cur_title,
                        subtitle=cur_subtitle,
                        page=page_idx,
                        text_content=full_txt,
                        table_headers=[],
                        table_rows=[],
                        bullets=cur_bullets,
                        callout_label="",
                        callout_text="",
                        keywords=keywords,
                    )
                )

        return articles

    def _get_leave_page_map(self) -> Dict[int, int]:
        return {1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 4, 10: 4, 11: 4, 12: 5}

    def _get_remote_page_map(self) -> Dict[int, int]:
        return {1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3}

    def _get_travel_page_map(self) -> Dict[int, int]:
        return {1: 1, 2: 1, 3: 1, 4: 2, 5: 2}

    def _get_benefits_page_map(self) -> Dict[int, int]:
        return {1: 1, 2: 1, 3: 1, 4: 2, 5: 2}

    def _get_security_page_map(self) -> Dict[int, int]:
        return {1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 3, 7: 3, 8: 4, 9: 4, 10: 5, 11: 5, 12: 6}

    def _get_handbook_page_map(self) -> Dict[int, int]:
        return {1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3}

    def _get_performance_page_map(self) -> Dict[int, int]:
        return {1: 1, 2: 1, 3: 1, 4: 2, 5: 2}

    def _parse_article(
        self, filename: str, meta: Dict[str, Any], sec: Dict[str, Any], article_num: int, page: int
    ) -> PolicyArticle:
        title = sec.get("title", f"Article {article_num}")
        subtitle = ""
        paragraphs = []
        bullets = []
        table_headers = []
        table_rows = []
        callout_label = ""
        callout_text = ""

        for item in sec.get("content", []):
            item_type = item.get("type", "")
            if item_type == "subheading":
                subtitle = item.get("text", "")
            elif item_type == "paragraph":
                paragraphs.append(item.get("text", ""))
            elif item_type == "bullet":
                bullets.append(item.get("text", ""))
            elif item_type == "table":
                table_headers = item.get("headers", [])
                table_rows = item.get("rows", [])
            elif item_type == "callout":
                callout_label = item.get("label", "")
                callout_text = item.get("text", "")

        full_text = " ".join(paragraphs)
        keywords = re.findall(r"\b[a-z0-9_-]{3,}\b", (title + " " + subtitle + " " + full_text).lower())

        return PolicyArticle(
            doc_filename=filename,
            doc_title=meta.get("title", filename),
            category=meta.get("category", "General"),
            article_num=article_num,
            article_title=title,
            subtitle=subtitle,
            page=page,
            text_content=full_text,
            table_headers=table_headers,
            table_rows=table_rows,
            bullets=bullets,
            callout_label=callout_label,
            callout_text=callout_text,
            keywords=keywords,
        )

    def is_pure_greeting(self, text: str) -> bool:
        cleaned = re.sub(r'[!.,?]+', ' ', text.strip().lower()).strip()
        words = cleaned.split()
        greeting_words = {
            'hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening',
            'good', 'day', 'howdy', 'hola', 'there', 'assistant', 'copilot', 'bot', 'friend', 'team'
        }
        capability_phrases = [
            'who are you', 'what are you', 'what can you do', 'what can you help',
            'how can you help', 'capabilities', 'what are your capabilities',
            'help me', 'how do you work', 'what is your name'
        ]
        pleasantry_phrases = [
            'thank you', 'thanks', 'appreciate it', 'have a nice day',
            'have a good day', 'goodbye', 'bye', 'see you', 'cya', 'how are you'
        ]
        if any(phrase in cleaned for phrase in capability_phrases) or any(phrase in cleaned for phrase in pleasantry_phrases):
            return True
        if words and all(w in greeting_words for w in words):
            return True
        for pat in CONVERSATIONAL_GREETINGS:
            if re.match(pat, text.strip().lower()):
                return True
        return False

    def resolve_conversation_query(self, query: str, history: List[Dict[str, str]]) -> str:
        """
        Resolves pronouns and implicit topic continuation using past dialogue turns.
        E.g.: 'Can I carry them forward?' with previous turn about PTO -> 'Can I carry annual leave PTO days forward into the next year?'
        """
        lower = query.lower().strip()
        pronoun_triggers = {"it", "them", "they", "that", "those", "these", "this", "there", "carry", "forward", "stipend", "limit"}
        words = set(re.findall(r"\b[a-z0-9_-]+\b", lower))

        # Check if query is a follow-up or has pronouns
        is_followup = bool(words.intersection(pronoun_triggers)) or (
            len(words) <= 8 and any(kw in lower for kw in ["secondary", "primary", "carry", "part-time", "part time", "full-time", "what about", "how about", "who approves"])
        )

        if is_followup and history:
            # Look backwards for the most recent user turn that had substantive keywords
            for item in reversed(history):
                if item.get("role") in ("user", "human"):
                    prev_text = item.get("content", "").lower()
                    prev_words = [
                        w for w in re.findall(r"\b[a-z0-9_-]{3,}\b", prev_text)
                        if w not in {"what", "how", "can", "the", "for", "is", "policy", "company", "employee"}
                    ]
                    if prev_words:
                        return f"{query} ({' '.join(prev_words[:4])})"

        return query

    def search(self, query: str, history: Optional[List[Dict[str, str]]] = None, top_k: int = 3) -> Tuple[List[SearchResult], bool]:
        """
        Performs intent-aware scoring and multi-field keyword ranking.
        Returns: (results, is_grounded_match)
        """
        history_list = history or []
        resolved_query = self.resolve_conversation_query(query, history_list)
        clean_q = resolved_query.lower()
        all_tokens = set(re.findall(r"\b[a-z0-9_-]{3,}\b", clean_q))
        
        GENERIC_HR_WORDS = {
            "policy", "policies", "company", "employee", "employees", "nexus", "corporate",
            "rule", "rules", "guideline", "guidelines", "standard", "standards", "work",
            "what", "how", "can", "tell", "give", "show", "details", "information", "about",
            "need", "want", "know", "does", "have", "with", "from", "when", "where", "which",
            "many", "much", "any", "all", "some", "get", "take", "use", "make", "apply",
            "qualify", "eligible", "receive", "allowed", "per", "day", "days", "week", "weeks",
            "month", "months", "year", "years", "time", "tier", "tiers", "plan", "plans",
            "hour", "hours", "number", "count", "will", "would", "should", "could"
        }
        substantive_tokens = all_tokens - GENERIC_HR_WORDS
        q_tokens = substantive_tokens if substantive_tokens else all_tokens

        # Check for matching intent expansion
        expanded_intents = set()
        matched_any_intent = False
        for key, synonyms in INTENT_KEYWORD_MAP.items():
            if key in clean_q or any(token == key for token in q_tokens):
                matched_any_intent = True
                for syn in synonyms:
                    expanded_intents.update(re.findall(r"\b[a-z0-9_-]{3,}\b", syn.lower()))

        # Zero-false-positive check for out-of-scope queries (e.g., "yacht", "crypto", "pizza")
        if not matched_any_intent and substantive_tokens:
            matching_substantive = [t for t in substantive_tokens if t in self.corpus_vocab]
            absent_substantive = [t for t in substantive_tokens if t not in self.corpus_vocab]
            if not matching_substantive or len(absent_substantive) > 0:
                logger.info(f"Query contains unknown out-of-scope terms: {absent_substantive}. Returning no grounded match.")
                return [], False

        scored_articles: List[Tuple[float, PolicyArticle, List[str]]] = []

        for art in self.articles:
            score = 0.0
            reasons = []

            art_text_lower = (art.article_title + " " + art.subtitle + " " + art.text_content + " " + " ".join(art.bullets)).lower()
            table_text = " ".join(art.table_headers + [c for row in art.table_rows for c in row]).lower()
            full_art_text = art_text_lower + " " + table_text

            # Require at least one substantive token or intent match to score
            substantive_hits = [t for t in q_tokens if t in full_art_text]
            intent_hits = [t for t in expanded_intents if t in full_art_text]

            if not substantive_hits and not intent_hits:
                continue

            # 1. Exact phrase matches in title or subtitle
            if any(term in art.article_title.lower() for term in q_tokens):
                score += 15.0
                reasons.append("Article title match")
            if art.subtitle and any(term in art.subtitle.lower() for term in q_tokens):
                score += 10.0
                reasons.append("Subtitle match")

            # 2. Token overlap with article title
            title_tokens = set(re.findall(r"\b[a-z0-9_-]{3,}\b", art.article_title.lower()))
            overlap = q_tokens.intersection(title_tokens)
            if overlap:
                score += len(overlap) * 6.0
                reasons.append(f"Title tokens: {', '.join(overlap)}")

            # 3. Intent expansion matches
            intent_overlap = expanded_intents.intersection(title_tokens)
            if intent_overlap:
                score += len(intent_overlap) * 5.0
                reasons.append(f"Intent expansion: {', '.join(intent_overlap)}")

            # 4. Table header and cell matches (highly authoritative for numbers/rates)
            for token in q_tokens:
                if token in table_text:
                    score += 5.0
                    reasons.append(f"Table data match: '{token}'")

            # 5. Body text and bullets matches
            for token in substantive_hits:
                count = art_text_lower.count(token)
                score += min(count * 1.5, 6.0)

            # 6. Specific high-signal bonus matches
            # PTO Accrual & Carryover -> prioritize Article 2 of Leave Policy
            if ("pto" in clean_q or "annual leave" in clean_q or "carry" in clean_q or "vacation" in clean_q) and art.doc_filename == "leave_policy.pdf":
                if art.article_num == 2:
                    score += 35.0
                    reasons.append("Primary PTO Governance article")

            # Pet insurance -> prioritize Article 9 of Benefits Guide
            if ("pet" in clean_q or "dog" in clean_q or "cat" in clean_q) and art.doc_filename == "benefits_guide.pdf":
                if art.article_num == 9:
                    score += 40.0
                    reasons.append("Primary Pet Insurance article")

            # Remote setup stipend -> prioritize Article 2 of Remote Policy
            if ("stipend" in clean_q or "500" in clean_q or "internet" in clean_q) and art.doc_filename == "remote_work_policy.pdf":
                if art.article_num == 2:
                    score += 35.0
                    reasons.append("Home Office Stipend article")

            # Travel Per Diem / Meals -> prioritize Article 4 of Travel Policy
            if ("per diem" in clean_q or "meal" in clean_q or "75" in clean_q or "daily" in clean_q) and "travel" in art.doc_filename:
                if art.article_num == 4:
                    score += 35.0
                    reasons.append("Meal Per Diem article")

            # 401(k) -> prioritize Article 4 of Benefits Guide
            if ("401" in clean_q or "retire" in clean_q or "match" in clean_q) and art.doc_filename == "benefits_guide.pdf":
                if art.article_num == 4:
                    score += 35.0
                    reasons.append("401(k) Retirement match article")

            # Parental leave -> prioritize Article 4 of Leave Policy
            if ("parental" in clean_q or "maternity" in clean_q or "paternity" in clean_q or "birth" in clean_q or "adopt" in clean_q) and art.doc_filename == "leave_policy.pdf":
                if art.article_num == 4:
                    score += 35.0
                    reasons.append("Parental Leave article")

            if score > 5.0:
                scored_articles.append((score, art, reasons))

        scored_articles.sort(key=lambda x: x[0], reverse=True)

        if not scored_articles or scored_articles[0][0] < 8.0:
            return [], False

        results = [SearchResult(article=art, score=score, relevance_reasons=reasons) for score, art, reasons in scored_articles[:top_k]]
        return results, True

    def synthesize_grounded_answer(self, query: str, results: List[SearchResult], history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Constructs a comprehensive, polished, highly readable Markdown response
        grounded in the retrieved articles with structured tables, caveats, and citations.
        """
        if not results:
            return (
                "I searched the TCS Global Policy Knowledge Base (covering Associate Leave, Workplace & Return to Office, "
                "Total Rewards & Benefits, Global Travel & Expenses, Information Security ISMS, Tata Code of Conduct, and Performance Management), but did not find an official corporate policy "
                f"addressing **\"{query}\"**.\n\n"
                "### Recommended Next Steps:\n"
                "- If this is an exceptional accommodation or clarification request, please submit an inquiry on the Ultimatix Global Helpdesk.\n"
                "- You can also reach your Unit HR (UHR) specialist or Delivery Manager directly."
            )

        top = results[0].article
        lower_q = query.lower()

        # Build clean formatted answer
        parts = []

        # 1. Headline summary
        parts.append(f"### {top.doc_title} ({top.article_title.split('. ')[-1] if '. ' in top.article_title else top.article_title})\n")

        # 2. Key Rule / Core answer paragraph
        if top.subtitle:
            parts.append(f"**Section Overview**: {top.subtitle}\n")

        if top.text_content:
            parts.append(f"{top.text_content}\n")

        # 3. Formatted Table (if available)
        if top.table_headers and top.table_rows:
            table_md = ["\n| " + " | ".join(top.table_headers) + " |"]
            table_md.append("| " + " | ".join(["---"] * len(top.table_headers)) + " |")
            for row in top.table_rows:
                table_md.append("| " + " | ".join(row) + " |")
            parts.append("\n".join(table_md) + "\n")

        # 4. Key Conditions / Bullets
        if top.bullets:
            parts.append("\n**Key Policy Requirements & Rules:**")
            for b in top.bullets:
                parts.append(f"- {b}")
            parts.append("")

        # 5. Regulatory / Important Notice Callout
        if top.callout_text:
            label = top.callout_label or "IMPORTANT POLICY NOTE"
            parts.append(f"\n> ⚠️ **{label}**: {top.callout_text}\n")

        # 6. Specific action steps based on topic
        if "leave" in top.doc_filename or "pto" in lower_q:
            parts.append(
                "\n**How to Request**: Submit your leave request through **Workday Time Tracking > Time Off** "
                "with at least 14 calendar days advance notice for planned absences."
            )
        elif "remote" in top.doc_filename or "stipend" in lower_q:
            parts.append(
                "\n**How to Claim**: Submit equipment invoices via **Expensify / Navan > Home Office Category** "
                "within 60 calendar days of eligibility."
            )
        elif "travel" in top.doc_filename or "expense" in lower_q:
            parts.append(
                "\n**Submission Deadline**: All itemized expense reports must be submitted in **Navan** "
                "within **45 calendar days** of completing travel."
            )
        elif "benefits" in top.doc_filename:
            parts.append(
                "\n**Enrollment**: Manage elections in **Workday Benefits** during annual Open Enrollment (Nov 1–15) "
                "or within 30 days of a Qualifying Life Event (QLE)."
            )

        return "\n".join(parts)


# Module-level convenience functions
def get_policy_engine() -> PolicyKnowledgeEngine:
    return PolicyKnowledgeEngine.get_instance()
