import json
import logging
import threading
import urllib.request

logger = logging.getLogger(__name__)


def record_invocation_async(
    service: str,
    model: str,
    prompt_text: str,
    response_text: str,
    latency_ms: int,
    status: str = "200_OK",
):
    """
    Asynchronously streams real-time AI token usage and latency metrics
    to the HR ecosystem sync server (port 8000). Runs in daemon thread to never block responses.
    """
    def _send():
        try:
            p_tok = max(10, round(len(prompt_text or "") / 3.8))
            c_tok = max(15, round(len(response_text or "") / 3.8))
            payload = {
                "service": service,
                "model": model,
                "promptTokens": p_tok,
                "completionTokens": c_tok,
                "latencyMs": max(1, int(latency_ms)),
                "queryPreview": (prompt_text or "")[:120].strip(),
                "status": status,
            }
            req = urllib.request.Request(
                "http://localhost:8000/api/v1/ai/telemetry/record",
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            urllib.request.urlopen(req, timeout=2.0)
        except Exception as e:
            # Telemetry logging is best-effort and will not disrupt request flow
            logger.debug(f"Silent telemetry stream note: {e}")

    thread = threading.Thread(target=_send, daemon=True)
    thread.start()
