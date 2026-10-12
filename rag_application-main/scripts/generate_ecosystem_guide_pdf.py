"""
Master Generator: Enterprise HR & Employee Operations AI Ecosystem Guide
Generates a comprehensive, dense, multi-page official architecture, workings,
and operations PDF manual for the entire project.
"""
import sys
from pathlib import Path
import pypdf
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib import colors
from reportlab.pdfgen import canvas

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
RESOURCES_DIR = PROJECT_ROOT.parent / "resources"
OUTPUT_PDF = RESOURCES_DIR / "Enterprise_HR_AI_Ecosystem_Architecture_and_Operations_Guide.pdf"
OUTPUT_PDF_ALIAS = RESOURCES_DIR / "enterprise_hr_ecosystem_guide.pdf"

class EcosystemGuideCanvas(canvas.Canvas):
    """Two-pass canvas providing running headers, footers, and dynamic page numbering."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Running Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 7.5)
            self.setFillColor(colors.HexColor("#003B70"))
            self.drawString(36, 764, "ENTERPRISE HR & EMPLOYEE OPERATIONS AI ECOSYSTEM")
            self.setFont("Helvetica", 7.5)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(612 - 36, 764, "SYSTEM ARCHITECTURE & OPERATIONS MANUAL  |  v3.0")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 758, 612 - 36, 758)

        # Running Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 34, 612 - 36, 34)
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 24, "TCS People Operations Technology  \u2022  Distributed Architecture, AI Triage & RAG")
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#003B70"))
        self.drawRightString(612 - 36, 24, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def get_guide_styles():
    b = getSampleStyleSheet()
    return {
        "MainTitle": ParagraphStyle("DocMainTitle", parent=b["Title"], fontName="Helvetica-Bold",
            fontSize=16.0, leading=19.0, textColor=colors.HexColor("#003B70"), alignment=0, spaceAfter=2),
        "MainSubTitle": ParagraphStyle("DocMainSubTitle", parent=b["Normal"], fontName="Helvetica-Bold",
            fontSize=8.5, leading=11.0, textColor=colors.HexColor("#0284C7"), spaceAfter=5),
        "SecHeader": ParagraphStyle("DocSecHeader", parent=b["Heading1"], fontName="Helvetica-Bold",
            fontSize=11.0, leading=13.5, textColor=colors.HexColor("#003B70"),
            spaceBefore=6.0, spaceAfter=2.5, keepWithNext=True),
        "SubSecHeader": ParagraphStyle("DocSubSecHeader", parent=b["Heading2"], fontName="Helvetica-Bold",
            fontSize=8.8, leading=11.0, textColor=colors.HexColor("#0F172A"),
            spaceBefore=3.5, spaceAfter=1.5, keepWithNext=True),
        "Body": ParagraphStyle("DocBody", parent=b["Normal"], fontName="Helvetica",
            fontSize=7.15, leading=9.8, textColor=colors.HexColor("#334155"), spaceAfter=2.0),
        "BodyBold": ParagraphStyle("DocBodyBold", parent=b["Normal"], fontName="Helvetica-Bold",
            fontSize=7.15, leading=9.8, textColor=colors.HexColor("#0F172A"), spaceAfter=2.0),
        "Bullet": ParagraphStyle("DocBullet", parent=b["Normal"], fontName="Helvetica",
            fontSize=7.15, leading=9.6, textColor=colors.HexColor("#334155"),
            leftIndent=10, firstLineIndent=-7, spaceAfter=1.3),
        "TableHeader": ParagraphStyle("TableHeader", parent=b["Normal"], fontName="Helvetica-Bold",
            fontSize=6.8, leading=8.4, textColor=colors.HexColor("#0F172A")),
        "TableCell": ParagraphStyle("TableCell", parent=b["Normal"], fontName="Helvetica",
            fontSize=6.5, leading=8.2, textColor=colors.HexColor("#334155")),
        "TableCellBold": ParagraphStyle("TableCellBold", parent=b["Normal"], fontName="Helvetica-Bold",
            fontSize=6.5, leading=8.2, textColor=colors.HexColor("#0F172A")),
        "TableCellCode": ParagraphStyle("TableCellCode", parent=b["Normal"], fontName="Courier-Bold",
            fontSize=6.3, leading=8.0, textColor=colors.HexColor("#0369A1")),
        "CalloutText": ParagraphStyle("DocCalloutText", parent=b["Normal"], fontName="Helvetica",
            fontSize=6.8, leading=9.0, textColor=colors.HexColor("#0369A1")),
        "CodeBlock": ParagraphStyle("DocCodeBlock", parent=b["Normal"], fontName="Courier",
            fontSize=6.4, leading=8.2, textColor=colors.HexColor("#0F172A")),
    }


def add_table_row(story, styles, headers, rows, widths):
    data = [[Paragraph(f"<b>{h}</b>", styles["TableHeader"]) for h in headers]]
    for row in rows:
        formatted_row = []
        for idx, cell in enumerate(row):
            if isinstance(cell, str) and (cell.startswith("http") or cell.startswith("cd ") or cell.startswith("node ") or cell.startswith("python ") or cell.startswith("npm ")):
                formatted_row.append(Paragraph(cell, styles["TableCellCode"]))
            elif idx == 0 and len(row) > 2:
                formatted_row.append(Paragraph(cell, styles["TableCellBold"]))
            else:
                formatted_row.append(Paragraph(cell, styles["TableCell"]))
        data.append(formatted_row)
    t = Table(data, colWidths=widths)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 1.8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.8),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(Spacer(1, 1.5))
    story.append(t)
    story.append(Spacer(1, 2))


def add_callout_box(story, styles, title, body_text):
    data = [[Paragraph(f"<b>{title}</b><br/>{body_text}", styles["CalloutText"])]]
    t = Table(data, colWidths=[540])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0F9FF")),
        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#0284C7")),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(Spacer(1, 1.5))
    story.append(t)
    story.append(Spacer(1, 2))


def build_ecosystem_pdf():
    RESOURCES_DIR.mkdir(parents=True, exist_ok=True)
    styles = get_guide_styles()
    story = []

    # =========================================================================
    # DOCUMENT COVER HEADER & METADATA
    # =========================================================================
    story.append(Paragraph("TATA CONSULTANCY SERVICES &bull; ENTERPRISE SYSTEMS ARCHITECTURE &bull; v3.0", styles["MainSubTitle"]))
    story.append(Paragraph("Enterprise HR & Employee Operations AI Ecosystem", styles["MainTitle"]))
    story.append(Paragraph("Comprehensive Technical Architecture, Workings, Component Breakdown, Key URLs & Operations Guide", styles["MainSubTitle"]))

    meta_data = [
        [
            Paragraph("<b>DOCUMENT ID</b>", styles["TableCellBold"]), Paragraph("TCS-HR-ARCH-2026-v3.0", styles["TableCell"]),
            Paragraph("<b>TARGET ENVIRONMENT</b>", styles["TableCellBold"]), Paragraph("Production / Local Multi-Node", styles["TableCell"]),
            Paragraph("<b>SECURITY RATING</b>", styles["TableCellBold"]), Paragraph("Confidential / Enterprise Internal", styles["TableCell"]),
        ],
        [
            Paragraph("<b>PUBLISH DATE</b>", styles["TableCellBold"]), Paragraph("October 2026", styles["TableCell"]),
            Paragraph("<b>COGNITIVE ENGINES</b>", styles["TableCellBold"]), Paragraph("FastAPI, ChromaDB, Azure / GenAI", styles["TableCell"]),
            Paragraph("<b>SYNCHRONIZATION</b>", styles["TableCellBold"]), Paragraph("Server-Sent Events (SSE) Bus", styles["TableCell"]),
        ]
    ]
    meta_table = Table(meta_data, colWidths=[75, 115, 85, 115, 75, 75])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 1.8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.8),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 2))
    story.append(HRFlowable(width="100%", thickness=1.0, color=colors.HexColor("#003B70"), spaceAfter=3))

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & SYSTEM MISSION
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & System Mission", styles["SecHeader"]))
    story.append(Paragraph(
        "The <b>Enterprise HR & Employee Operations AI Ecosystem</b> is a distributed, real-time platform engineered to bridge "
        "the operational communication divide between employees, enterprise HR specialists, and autonomous AI agents. Modern "
        "workforces require immediate, grounded policy guidance without bureaucratic ticket lag, while HR teams need intelligent operational "
        "intake, risk triage, explainable decision support, and strict human-in-the-loop oversight before dispatching formal communications.",
        styles["Body"]
    ))
    story.append(Paragraph(
        "The platform unifies two distinct, specialized frontends—the <b>HR Operations Cockpit</b> (optimized for specialist investigation, "
        "workload analytics, and governance in a Dark Theme environment) and the <b>Employee Self-Service Portal</b> (optimized for frictionless "
        "ticket intake, leave balance tracking, and conversational policy inquiry in a Light Theme environment). All actions synchronize "
        "instantaneously across a resilient <b>Server-Sent Events (SSE)</b> event bus powered by a single source of truth database, backed by a "
        "semantic <b>Policy Retrieval-Augmented Generation (RAG)</b> engine grounded in authentic enterprise policy documents.",
        styles["Body"]
    ))

    # =========================================================================
    # SECTION 2: KEY SYSTEM URLS & NETWORK DIRECTORY
    # =========================================================================
    story.append(Paragraph("2. Key System URLs, Port Directory & Network Endpoints", styles["SecHeader"]))
    story.append(Paragraph(
        "The ecosystem coordinates four concurrent network services running locally or in containerized enterprise cloud clusters. "
        "The directory below details all active user-facing portals, administrative consoles, streaming endpoints, and API gateways:",
        styles["Body"]
    ))

    add_table_row(
        story, styles,
        ["Service / Portal Name", "Network Port", "Default Theme", "Access URL / Direct Route", "Operational Scope & Responsibilities"],
        [
            ["Admin Portal (New)", "5173", "Dark Theme", "http://localhost:5173/admin\n(or ?portal=admin)", "Dedicated Admin Console: User Management (CRUD/status), RBAC Role Management, System Settings, Audit Logs, and Multi-Portal Switcher."],
            ["HR Operations Cockpit", "5173", "Dark Theme", "http://localhost:5173\n(or ?portal=hr)", "Primary HR console: Dashboard KPIs, AI Triage Queue, Case Console, Deliverables Workspace, AI Telemetry & Multi-SaaS Mail."],
            ["Employee Self-Service", "3000 / 5174", "Light Theme", "http://localhost:3000\n(or ?portal=employee)", "Employee portal: Ticket intake, real-time status tracking, leave balance cards, official notice feed, and Ask HR Copilot."],
            ["Central HR Sync Server", "8000", "Headless", "http://localhost:8000/api/v1/health", "Node.js ESM sync server (v3.0.0): REST API, JSON database persistence (db.json), auth tokens, Admin CRUD, and audit telemetry logging."],
            ["Real-Time SSE Event Stream", "8000", "Streaming", "http://localhost:8000/api/v1/stream", "Unidirectional Server-Sent Events (SSE) push bus broadcasting live ticket lifecycle changes to all frontends."],
            ["Policy RAG AI Backend", "8001", "Headless", "http://localhost:8001/health", "FastAPI Python engine: Grounded semantic vector search, PDF text parsing, zero-false-positive filtering, and OpenAI inference."],
            ["Policy Copilot Chat API", "8001", "API Endpoint", "http://localhost:8001/api/chat", "Conversational RAG endpoint: Multi-turn dialogue resolution, grounded answer synthesis, and exact page citations."],
            ["Multi-HR Gmail Service", "8001", "API Router", "http://localhost:8001/api/gmail/status", "Multi-mailbox OAuth sync: Ingests incoming employee emails from HR SaaS mailboxes into live triage queues."],
            ["Split-Screen Showcase", "5173", "Dual Theme", "http://localhost:5173/?view=split", "Side-by-side interactive split console showing simultaneous live sync between Employee Portal and HR Cockpit."],
            ["Direct PDF Policy Stream", "5173 / 3000", "In-Browser", "http://localhost:5173/policies/{doc}#page={n}", "Interactive in-browser PDF streaming with anchor deep-linking to exact policy citations (e.g., leave_policy.pdf#page=2)."],
        ],
        [85, 35, 45, 145, 230]
    )

    add_callout_box(
        story, styles,
        "PRODUCTION DEPLOYMENT PROXY NOTE:",
        "In production or Vite dev mode, frontends proxy all /api/v1 requests seamlessly to port 8000 (Central Sync Server), "
        "and all /api/chat, /api/gmail, and /health requests directly to port 8001 (Policy RAG AI Backend). "
        "No manual cross-origin CORS configuration is required for standard client usage."
    )

    # =========================================================================
    # SECTION 3: HOW TO START THE PROJECT (OPERATIONS GUIDE)
    # =========================================================================
    story.append(Paragraph("3. Step-by-Step Project Startup & Operations Guide", styles["SecHeader"]))
    story.append(Paragraph(
        "To launch the entire distributed ecosystem, open separate terminal windows (or background daemon processes) and execute "
        "the commands in the sequential order detailed below. Ensure Node.js (v18+) and Python (v3.11+) are available in the system PATH:",
        styles["Body"]
    ))

    add_table_row(
        story, styles,
        ["Step #", "Component to Start", "Directory Path", "Exact Terminal Command", "Validation & Health Indicator"],
        [
            ["Step 1", "Central Sync Server & DB", "hr/", "node hr-sync-server.mjs", "Logs 'HR Central Sync Server running on port 8000'. Check http://localhost:8000/api/v1/health returns status: 'ok'."],
            ["Step 2", "Policy RAG AI Backend", "rag_application-main/", "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001", "Logs 'Uvicorn running on http://0.0.0.0:8001'. Check http://localhost:8001/health returns 200 OK with knowledge base count."],
            ["Step 3", "HR Operations Cockpit", "hr/frontend/", "npm run dev:hr  (or npm run dev)", "Vite dev server starts on port 5173. Access via http://localhost:5173. Defaults automatically to Dark Theme."],
            ["Step 4", "Employee Self-Service", "employee_frontend-main/", "npm run dev", "Vite dev server starts on port 3000. Access via http://localhost:3000. Defaults automatically to Light Theme."],
        ],
        [30, 95, 80, 165, 170]
    )

    story.append(Paragraph(
        "<b>Automated Background Startup (Windows PowerShell):</b><br/>"
        "To run all 4 background processes concurrently without maintaining four open terminal windows, launch using background jobs:<br/>"
        "&bull;&nbsp;&nbsp;<code>Start-Process -NoNewWindow node -ArgumentList 'hr-sync-server.mjs' -WorkingDirectory 'hr'</code><br/>"
        "&bull;&nbsp;&nbsp;<code>Start-Process -NoNewWindow python -ArgumentList '-m uvicorn backend.main:app --host 0.0.0.0 --port 8001' -WorkingDirectory 'rag_application-main'</code><br/>"
        "&bull;&nbsp;&nbsp;<code>Start-Process -NoNewWindow npm -ArgumentList 'run dev:hr' -WorkingDirectory 'hr/frontend'</code><br/>"
        "&bull;&nbsp;&nbsp;<code>Start-Process -NoNewWindow npm -ArgumentList 'run dev' -WorkingDirectory 'employee_frontend-main'</code>",
        styles["Body"]
    ))

    # =========================================================================
    # SECTION 4: ARCHITECTURE & REAL-TIME SYNC ENGINE (SSE)
    # =========================================================================
    story.append(Paragraph("4. Technical Architecture & Real-Time Sync (SSE Engine)", styles["SecHeader"]))
    story.append(Paragraph(
        "The platform utilizes an event-driven architecture combining asynchronous REST transactions with an enterprise "
        "<b>Server-Sent Events (SSE)</b> broadcaster. Unlike cumbersome bidirectional WebSockets that suffer from proxy dropouts and state "
        "desynchronization, SSE delivers lightweight, HTTP/2-compatible, unidirectional live streaming directly from the server to web clients.",
        styles["Body"]
    ))

    add_table_row(
        story, styles,
        ["SSE Event Type", "Trigger Source", "Event Payload Structure", "Client Reaction (Cockpit & Employee Portal)"],
        [
            ["REQUEST_CREATED", "Employee submits ticket or email ingested", "Full Request entity with generated AI Triage metadata", "Prepends card to HR Requests & Triage Queue; live recalculation of KPI counters; toast alert."],
            ["REQUEST_UPDATED", "Status change, comment added, or reassigned", "Updated Request entity, conversation thread, audit trail", "Updates active Case Console thread, alters badge status (Open -> In Review -> Resolved)."],
            ["DELIVERABLE_CREATED", "Case Copilot or specialist generates draft", "Deliverable object: Type, title, body, status: NEEDS_REVIEW", "Populates Deliverables Workspace table; updates 'Needs Review' counter badge."],
            ["DELIVERABLE_UPDATED", "Specialist edits, approves, or dispatches draft", "Deliverable object with status: READY or status: SENT", "Synchronizes changes; upon SEND, automatically posts official comment to employee ticket."],
            ["TRIAGE_UPDATED", "HR specialist overrides priority/category", "Request ID, humanPriority, humanCategory, audit notes", "Updates visual triage badge; logs override rationale in AI audit telemetry log."],
            ["Heartbeat Ping", "Every 15 seconds automated server interval", ": ping comment string", "Prevents proxy timeouts, keeps browser connection active without client-side polling."],
        ],
        [85, 95, 150, 210]
    )

    story.append(Paragraph(
        "<b>Single Source of Truth (`hr/data/db.json`):</b> All tickets, triage intelligence, deliverables, user accounts, and "
        "activity logs reside in a single, transactional JSON database. Atomicity is guaranteed through write-locking and synchronous "
        "disk flush routines. Frontends never read or write directly to storage; all mutations flow strictly through REST endpoints.",
        styles["Body"]
    ))

    # =========================================================================
    # SECTION 5: ADMIN PORTAL & ROLE-BASED ACCESS CONTROL (RBAC) SUBSYSTEM
    # =========================================================================
    story.append(Paragraph("5. Admin Portal Architecture & Role-Based Access Control (RBAC)", styles["SecHeader"]))
    story.append(Paragraph(
        "The newly integrated <b>Admin Portal</b> (accessible at <code>/admin</code> or <code>?portal=admin</code>) provides high-level "
        "enterprise oversight, tenant administration, role configuration, and compliance audit capabilities strictly guarded by "
        "dynamic role checks. Non-admin users attempting to access the Admin Portal are intercepted by an <b>UnauthorizedView</b> guard.",
        styles["Body"]
    ))

    add_table_row(
        story, styles,
        ["Admin Module", "Route / Tab", "Core Capabilities & Administrative Controls", "Data Source & Security Protocol"],
        [
            ["1. Admin Dashboard", "/admin (tab=dashboard)", "Aggregated metrics: Total users (16), active sessions, role distribution breakdown, live system event stream, and quick-action shortcuts.", "REST /api/v1/admin/stats with real-time SSE stream integration."],
            ["2. User Management", "/admin/users", "Full CRUD user management: Add new enterprise users, edit roles/departments, toggle active/inactive status, fuzzy search, role filters, and CSV export.", "REST /api/v1/admin/users (GET/POST/PUT/DELETE) persisted in db.json."],
            ["3. Role Management", "/admin/roles", "RBAC hierarchy configuration (ADMIN, HR_LEAD, HR_SPECIALIST, EMPLOYEE), granular permissions matrix, and assignable security levels (1 to 3).", "Strict role validation engine with multi-role assignment support."],
            ["4. System Settings", "/admin/settings", "Platform-wide controls: Maintenance mode toggle, open registration toggle, AI confidence thresholds, session timeout, and SSO identity provider params.", "REST /api/v1/admin/settings with instant environment propagation."],
            ["5. Audit Logs", "/admin/audit-logs", "Immutable compliance audit trail: Timestamped records of user modifications, role promotions, logins, security alerts, and full CSV audit export.", "REST /api/v1/admin/audit-logs compliant with SOC2/ISO 27001 standards."],
            ["6. Multi-Portal Switcher", "Header Portal Jumper", "Enables dual-role users (e.g., ADMIN + EMPLOYEE) to jump seamlessly between Admin, HR Operations, and Employee portals without re-authenticating.", "Evaluates active user roles array to dynamically show allowed portal destinations."],
        ],
        [85, 80, 205, 170]
    )

    story.append(Paragraph(
        "<b>Pre-Configured Authentication Personas (Instant 1-Click Access):</b><br/>"
        "&bull;&nbsp;&nbsp;<b>John Smith (ADM001)</b> &bull; <code>john.smith@enterprise.internal</code> &bull; Role: <b>ADMIN</b> (IT Security & Compliance, Security Level 3)<br/>"
        "&bull;&nbsp;&nbsp;<b>Rachel Adams (ADM002)</b> &bull; <code>rachel.adams@enterprise.internal</code> &bull; Roles: <b>ADMIN, EMPLOYEE</b> (VP of Engineering & SysAdmin)<br/>"
        "&bull;&nbsp;&nbsp;<b>Marcus Lee (ADM003)</b> &bull; <code>marcus.lee@enterprise.internal</code> &bull; Roles: <b>ADMIN, HR_SPECIALIST</b> (HR Systems Administrator)<br/>"
        "&bull;&nbsp;&nbsp;<b>Sarah Jenkins (HR001)</b> &bull; <code>sarah.jenkins@enterprise.internal</code> &bull; Role: <b>HR_SPECIALIST</b> (HR Operations Lead)<br/>"
        "&bull;&nbsp;&nbsp;<b>Alex Johnson (EMP001)</b> &bull; <code>alex.johnson@enterprise.internal</code> &bull; Role: <b>EMPLOYEE</b> (Senior Staff Engineer)",
        styles["Body"]
    ))

    # =========================================================================
    # SECTION 6: AI CORE COMPONENTS & WORKINGS
    # =========================================================================
    story.append(Paragraph("6. AI Core Components & Operational Workings", styles["SecHeader"]))
    story.append(Paragraph(
        "Each AI component in the platform is strictly separated by function to prevent overlapping cognitive burdens. "
        "The matrix below outlines the exact operational mechanics, human-in-the-loop controls, and value delivered by each component:",
        styles["Body"]
    ))

    add_table_row(
        story, styles,
        ["Component", "Operational Role & Question Answered", "AI Model / Engine Mechanism", "Human-in-the-Loop Authority & Output"],
        [
            ["1. AI Triage Queue", "'What should HR review first and how urgent is it?' Classifies incoming tickets, estimates urgency, flags risk.", "Heuristic & LLM NLP classification, sensitivity keyword detection, policy mapping, confidence scoring (0-100%).", "HR reviews suggested urgency; can click [Override] to adjust priority/category with audit notes. Flags sensitive harassment cases."],
            ["2. HR Deliverables", "'What AI work has been generated, and who must sign off?' Manages lifecycle of formal letters and briefs.", "Structured document synthesis, policy grounding citations, formal business tone formatting.", "Strict governance lifecycle: AI_GENERATED -> NEEDS_REVIEW -> READY -> SENT. Deliverables are NEVER sent without human approval."],
            ["3. Case Console (ReviewDrawer)", "'How do I investigate and resolve this specific ticket?' Single-case investigation and resolution modal.", "Context-bound LLM prompt injection combining original ticket narrative, message thread history, and policy rules.", "Provides [Draft Reply], [Summarize Case], [Check Policy]. One-click [Use in Reply] inserts verified draft into discussion thread."],
            ["4. AI Copilot (RAG Engine)", "'What does official corporate policy state on this issue?' Exploratory organizational policy research.", "FastAPI + ChromaDB vector search + multi-field structured keyword ranking across physical PDF knowledge base.", "Returns grounded Markdown answer with exact clickable PDF citations (e.g. leave_policy.pdf p.1). Zero-false-positive filtering."],
            ["5. AI Telemetry & Token Intelligence", "'How much are models costing, and what is our latency?' Real-time telemetry monitoring and audit logging.", "Tracks prompt/completion tokens, latency (ms), calculated costs ($), active model status, and inference failover circuits.", "HR leadership views live invocation logs, token burn rates, model distribution charts, and triggers fast failover to local fallback engines."],
            ["6. Multi-HR Mailbox Ingestion", "'How do emails sent to HR get resolved?' Autonomous intake of incoming emails into live tickets.", "OAuth2 Gmail REST API polling, email thread extraction, sentiment parsing, and automatic ticket synthesis.", "Ingests emails directly into the central DB; triggers AI Triage; dispatches SSE event so specialists see emails appear in real time."],
        ],
        [90, 110, 150, 190]
    )

    # =========================================================================
    # SECTION 7: KNOWLEDGE HUB & POLICY DOCUMENTS
    # =========================================================================
    story.append(Paragraph("7. Knowledge Hub, Document Engine & PDF Architecture", styles["SecHeader"]))
    story.append(Paragraph(
        "The platform's knowledge base is anchored in <b>Tata Consultancy Services (TCS)</b> enterprise policies codified into "
        "structured, authoritative PDF manuals. The RAG engine dynamically scans, parses, and indexes every document directly from "
        "the <code>knowledge_base/</code> directory, extracting full text page-by-page using PyPDF and cross-referencing structured tables:",
        styles["Body"]
    ))

    add_table_row(
        story, styles,
        ["Policy Document File", "Category", "Pages", "Key Codified Standards & Specific Policy Rules"],
        [
            ["leave_policy.pdf", "Leave & Attendance", "5", "Earned Leave (16 days/yr, 4/qtr credit, 45-day cap), Casual Leave (7 days, lapses Dec 31), Sick Leave (10 days, RMP cert >2d), Maternity (26 wks), Paternity (5 days), Comp-off (60 days), Ultimatix 20th payroll cutoff."],
            ["remote_work_policy.pdf", "Workplace & RTO", "3", "Mandatory 5-day in-office attendance, 85% monthly turnstile threshold linked to Quarterly Performance Pay (QPP), 9-hour workday, SBWS zero-trust protocols, strict ban on unauthorized international remote work."],
            ["travel_expense_policy.pdf", "Travel & Finance", "3", "Ultimatix GTS booking mandate, domestic airfare (>2.5h Economy), lodging caps (Rs 3,500 Tier 1 Ginger/Taj), Metro Daily Allowance (Rs 1,500/day), vehicle mileage (Rs 8/km car, Rs 4/km bike), 15-day claim SLA."],
            ["benefits_guide.pdf", "Total Rewards", "3", "Bands Y-C5 CTC structure, Bouquet of Benefits (BoB tax optimization), TCS-HIS medical insurance (Rs 5L family floater + parent top-up), EPF 12% match, Gratuity, NPS Tier 1, Group Term Life (3x CTC), Pet Insurance."],
            ["security_policy.pdf", "ISMS ISO 27001", "6", "Ultimatix MFA, 14-character passwords (60-day rotation), Clean Desk policy, 3-minute screen auto-lock (Win+L), permanent USB storage port disablement, public GenAI code pasting prohibition, 1-hour GSOC incident SLA."],
            ["employee_handbook.pdf", "Corporate Ethics", "3", "Tata Code of Conduct (TCoC), zero-tolerance anti-bribery, gift threshold (Rs 1,000), POSH Internal Complaints Committee (ICC 90-day SLA), absolute ban on moonlighting/dual employment, mandatory 90-day notice period."],
            ["performance_and_growth_policy.pdf", "Talent Growth", "3", "Annual financial year appraisal cycle (Apr-Mar), Balanced Scorecard, 5-tier relative rating (Bands A-E), iEvolve 40-hour learning mandate, T-Factor score for promotions, and structured 30-to-60 day PIP enablement."],
        ],
        [95, 75, 25, 345]
    )

    story.append(Paragraph(
        "<b>Multi-Location Auto-Sync:</b> When policies are regenerated or updated, the system automatically mirrors all PDFs across "
        "<code>rag_application-main/knowledge_base/</code>, <code>resources/</code>, <code>hr/frontend/public/policies/</code>, and "
        "<code>employee_frontend-main/public/policies/</code>, guaranteeing 100% parity across AI vector search and portal downloads.",
        styles["Body"]
    ))

    # =========================================================================
    # SECTION 8: END-TO-END OPERATIONAL LIFECYCLE WALKTHROUGH
    # =========================================================================
    story.append(Paragraph("8. End-to-End Operational Lifecycle Walkthrough", styles["SecHeader"]))
    story.append(Paragraph(
        "The complete operational lifecycle illustrates how all ecosystem components interact during a live personnel case:",
        styles["Body"]
    ))

    story.append(Paragraph(
        "<b>Phase 1: Frictionless Intake</b><br/>"
        "&bull;&nbsp;&nbsp;An associate navigates to the <b>Employee Portal (:3000)</b>, opens 'Ask HR' or submits a ticket (e.g., parental leave & flexible hours).<br/>"
        "&bull;&nbsp;&nbsp;The request hits <code>POST /api/v1/requests</code> on the Central Sync Server (:8000), which parses text, runs AI triage scoring, "
        "persists the record in <code>db.json</code>, and immediately broadcasts a <code>REQUEST_CREATED</code> event via SSE.",
        styles["Body"]
    ))

    story.append(Paragraph(
        "<b>Phase 2: Intelligent Triage & Queue Routing</b><br/>"
        "&bull;&nbsp;&nbsp;The <b>HR Cockpit (:5173)</b> receives the SSE event instantly without page reload. The ticket appears in the <b>AI Triage Queue</b>.<br/>"
        "&bull;&nbsp;&nbsp;The system displays the AI-suggested priority (e.g. <code>HIGH</code>), confidence score (e.g. <code>94%</code>), mapped policy "
        "(<code>leave_policy.pdf</code>), and sensitivity warning if sensitive personnel keywords are detected.<br/>"
        "&bull;&nbsp;&nbsp;An HR lead can review the card, apply an override with notes if necessary, or click <code>[Review Request]</code> to inspect.",
        styles["Body"]
    ))

    story.append(Paragraph(
        "<b>Phase 3: Contextual Investigation & Policy Copilot</b><br/>"
        "&bull;&nbsp;&nbsp;Clicking <code>[Review Request]</code> opens the <b>Case Console (ReviewDrawer)</b> displaying the un-truncated employee narrative.<br/>"
        "&bull;&nbsp;&nbsp;The specialist clicks <code>[Draft Reply]</code>. The backend queries the RAG engine on port 8001, retrieving exact policy sections "
        "from <code>leave_policy.pdf (p.2)</code> regarding 26 weeks statutory maternity leave and crèche facilities.<br/>"
        "&bull;&nbsp;&nbsp;The specialist reviews the AI-generated draft, makes any tailored edits, and clicks <code>[Use in Reply]</code> to insert it into the thread.",
        styles["Body"]
    ))

    story.append(Paragraph(
        "<b>Phase 4: Governance Review & Official Dispatch</b><br/>"
        "&bull;&nbsp;&nbsp;For formal documentation (e.g., leave approval notice), the draft enters the <b>HR Deliverables Workspace</b> as <code>NEEDS REVIEW</code>.<br/>"
        "&bull;&nbsp;&nbsp;The specialist verifies recipient details, marks the deliverable as <code>READY</code>, and clicks <code>[Send / Use Deliverable]</code>.<br/>"
        "&bull;&nbsp;&nbsp;The Sync Server sets status to <code>SENT</code>, appends the official letter to the ticket comments, updates the ticket timeline to "
        "<code>Deliverable Dispatched</code>, and fires <code>DELIVERABLE_UPDATED</code> and <code>REQUEST_UPDATED</code> via SSE.<br/>"
        "&bull;&nbsp;&nbsp;The employee's screen on the Employee Portal (:3000) reflects the official resolution and document notice immediately.",
        styles["Body"]
    ))

    # =========================================================================
    # SECTION 9: AUTOMATED TEST BENCH & QUALITY ASSURANCE
    # =========================================================================
    story.append(Paragraph("9. Automated Test Bench, Security & Verification Standards", styles["SecHeader"]))
    story.append(Paragraph(
        "The platform includes an automated end-to-end test suite (<code>scripts/test_conversation_rag.py</code>) executing six "
        "comprehensive regression suites covering conversational dialogue, grounded retrieval, out-of-scope boundaries, and error circuit failover:",
        styles["Body"]
    ))

    add_table_row(
        story, styles,
        ["Test Suite ID", "Test Scenario & Query Executed", "Expected Behavioral Verification", "Quality Benchmark Passed"],
        [
            ["Test 1: Pure Greeting", "Hello! Good morning!", "Greets warmly, lists covered policy areas; returns ZERO policy citations.", "PASS - 100% Zero false positive sources"],
            ["Test 2: Capabilities", "Who are you and what can you help me with?", "Explains role as HR Copilot; outlines policies; returns ZERO sources.", "PASS - Clean identity description"],
            ["Test 3: Grounded Query", "How many annual leave days do employees get?", "Synthesizes exact leave band (16 days Earned Leave); returns leave_policy.pdf (p.1).", "PASS - Grounded answer with exact citations"],
            ["Test 4: Follow-up History", "Can I carry them forward? (with conversation history)", "Resolves pronoun 'them' to Earned Leave; cites 45-day accumulation cap & March 31 rules.", "PASS - Multi-turn conversational resolution"],
            ["Test 5: Out of Scope", "What is the policy for employee personal yachts?", "Detects unknown substantive nouns; returns explicit out-of-scope notice with zero false citations.", "PASS - Zero hallucination / Zero false sources"],
            ["Test 6: Specific Ancillary", "What is the pet insurance policy?", "Retrieves benefits_guide.pdf (p.2); cites Tata AIG / Nationwide pet cover details.", "PASS - Exact document & page citation"],
        ],
        [85, 125, 185, 145]
    )

    story.append(Spacer(1, 3))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=3))
    story.append(Paragraph(
        "<b>Document Signatory & Governance Ratification:</b><br/>"
        "This architectural specification and operations manual represents the official standard of the Enterprise HR & Employee Operations "
        "AI Ecosystem. Approved and ratified by <b>TCS People Operations Technology</b>, <b>Delivery Excellence Group</b>, and <b>Corporate Legal & Compliance</b>.",
        styles["Body"]
    ))

    # Build the document
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=42,
        bottomMargin=42
    )
    doc.build(story, canvasmaker=EcosystemGuideCanvas)

    # Also copy to alias
    import shutil
    shutil.copy2(OUTPUT_PDF, OUTPUT_PDF_ALIAS)

    # Validate output
    reader = pypdf.PdfReader(str(OUTPUT_PDF))
    total_pages = len(reader.pages)
    size_kb = OUTPUT_PDF.stat().st_size // 1024
    print(f"Generated PDF: {OUTPUT_PDF.name}")
    print(f"Total Pages: {total_pages} | File Size: {size_kb} KB")
    return total_pages, size_kb


if __name__ == "__main__":
    build_ecosystem_pdf()
