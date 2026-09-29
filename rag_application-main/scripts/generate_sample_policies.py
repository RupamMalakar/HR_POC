import sys
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import shutil
import pypdf

PROJECT_ROOT = Path(__file__).resolve().parent.parent
KB_DIR = PROJECT_ROOT / "knowledge_base"
RESOURCES_DIR = PROJECT_ROOT.parent / "resources"
FRONTEND_POLICIES_DIR = PROJECT_ROOT.parent / "hr" / "frontend" / "public" / "policies"
EMP_FRONTEND_POLICIES_DIR = PROJECT_ROOT.parent / "employee_frontend-main" / "public" / "policies"


class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to calculate and render total page count in the footer."""
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

    def draw_page_decorations(self, page_count: int):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0D9488"))

        # Top Header line & label (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "NEXUS ENTERPRISE HR POLICY REPOSITORY")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(612 - 54, 750, "CONFIDENTIAL & PROPRIETARY  |  OFFICIAL STANDARD")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(54, 744, 612 - 54, 744)

        # Footer line & text
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(54, 46, 612 - 54, 46)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 34, "People Operations & Legal Compliance  •  Corporate Governance Standard")
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0F172A"))
        self.drawRightString(612 - 54, 34, footer_text)
        self.restoreState()


def build_page_elements(
    page_num: int,
    article_num: int,
    article_title: str,
    paragraphs: list[str],
    table_headers: list[str],
    table_rows: list[list[str]],
    table_col_widths: list[int],
    bullets: list[str],
    callout_note: str,
    is_cover_page: bool = False,
    doc_metadata: dict = None,
    styles: dict = None,
) -> list:
    """Constructs flowables strictly sized to fit within a single letter page without overflow."""
    flowables = []

    if is_cover_page and doc_metadata:
        # Document Header
        flowables.append(Paragraph(f"<b>NEXUS HR COMPLIANCE REPOSITORY</b> &bull; {doc_metadata['id']}", styles["Meta"]))
        flowables.append(Spacer(1, 3))
        flowables.append(Paragraph(doc_metadata["title"], styles["Title"]))
        flowables.append(Spacer(1, 4))

        meta_data = [
            [
                Paragraph("<b>CATEGORY</b>", styles["Meta"]),
                Paragraph(doc_metadata["category"], styles["MetaVal"]),
                Paragraph("<b>EFFECTIVE DATE</b>", styles["Meta"]),
                Paragraph(doc_metadata["effective_date"], styles["MetaVal"]),
                Paragraph("<b>REVIEW CYCLE</b>", styles["Meta"]),
                Paragraph("Annual / Q4", styles["MetaVal"]),
            ]
        ]
        meta_table = Table(meta_data, colWidths=[65, 105, 85, 95, 80, 74])
        meta_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
            ])
        )
        flowables.append(meta_table)
        flowables.append(Spacer(1, 6))
        flowables.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0D9488"), spaceAfter=8))
    elif not is_cover_page:
        flowables.append(Spacer(1, 10))

    # Article Heading
    heading_text = f"Article {article_num}. {article_title}"
    flowables.append(Paragraph(heading_text, styles["Heading"]))
    flowables.append(Spacer(1, 5))

    # Narrative Paragraphs
    for p in paragraphs:
        flowables.append(Paragraph(p, styles["Body"]))
        flowables.append(Spacer(1, 3))

    # Formatted Data Table (if provided)
    if table_headers and table_rows:
        flowables.append(Spacer(1, 3))
        table_content = [[Paragraph(f"<b>{h}</b>", styles["TableHeader"]) for h in table_headers]]
        for row in table_rows:
            table_content.append([Paragraph(cell, styles["TableCell"]) for cell in row])

        grid_table = Table(table_content, colWidths=table_col_widths)
        grid_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
                ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ])
        )
        flowables.append(grid_table)
        flowables.append(Spacer(1, 5))

    # Bullet Items
    if bullets:
        for b in bullets:
            flowables.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", styles["Bullet"]))
        flowables.append(Spacer(1, 4))

    # Callout Note
    if callout_note:
        callout_data = [[Paragraph(f"<b>REGULATORY MANDATE & REQUIREMENT:</b><br/>{callout_note}", styles["Callout"])]]
        callout_table = Table(callout_data, colWidths=[504])
        callout_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0FDFA")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#0D9488")),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ])
        )
        flowables.append(callout_table)

    return flowables


def create_six_page_pdf(filename: str, doc_metadata: dict, pages_data: list[dict]) -> Path:
    """Builds a precisely calibrated 6-page PDF document."""
    output_path = KB_DIR / filename

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    base_styles = getSampleStyleSheet()

    styles = {
        "Title": ParagraphStyle(
            "DocTitle",
            parent=base_styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=19,
            textColor=colors.HexColor("#0F172A"),
            alignment=0,
            spaceAfter=2,
        ),
        "Meta": ParagraphStyle(
            "DocMeta",
            parent=base_styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=10,
            textColor=colors.HexColor("#0D9488"),
        ),
        "MetaVal": ParagraphStyle(
            "DocMetaVal",
            parent=base_styles["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=10,
            textColor=colors.HexColor("#475569"),
        ),
        "Heading": ParagraphStyle(
            "DocHeading",
            parent=base_styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=15,
            textColor=colors.HexColor("#1E293B"),
            spaceBefore=2,
            spaceAfter=4,
        ),
        "Body": ParagraphStyle(
            "DocBody",
            parent=base_styles["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=12.2,
            textColor=colors.HexColor("#334155"),
        ),
        "Bullet": ParagraphStyle(
            "DocBullet",
            parent=base_styles["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11.8,
            textColor=colors.HexColor("#334155"),
            leftIndent=12,
            firstLineIndent=-8,
            spaceAfter=2,
        ),
        "TableHeader": ParagraphStyle(
            "TableHeader",
            parent=base_styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10.5,
            textColor=colors.HexColor("#1E293B"),
        ),
        "TableCell": ParagraphStyle(
            "TableCell",
            parent=base_styles["Normal"],
            fontName="Helvetica",
            fontSize=7.8,
            leading=10,
            textColor=colors.HexColor("#334155"),
        ),
        "Callout": ParagraphStyle(
            "DocCallout",
            parent=base_styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=11.2,
            textColor=colors.HexColor("#0F766E"),
        ),
    }

    story = []
    total_pages = len(pages_data)
    assert total_pages == 6, f"Expected exactly 6 pages, got {total_pages}"

    for idx, page in enumerate(pages_data):
        page_num = idx + 1
        is_cover = (idx == 0)
        page_flowables = build_page_elements(
            page_num=page_num,
            article_num=idx + 1,
            article_title=page["title"],
            paragraphs=page.get("paragraphs", []),
            table_headers=page.get("table_headers", []),
            table_rows=page.get("table_rows", []),
            table_col_widths=page.get("table_col_widths", [120, 180, 204]),
            bullets=page.get("bullets", []),
            callout_note=page.get("callout_note", ""),
            is_cover_page=is_cover,
            doc_metadata=doc_metadata,
            styles=styles,
        )
        story.extend(page_flowables)
        if idx < total_pages - 1:
            story.append(PageBreak())

    doc.build(story, canvasmaker=NumberedCanvas)

    # Verify page count with pypdf
    reader = pypdf.PdfReader(str(output_path))
    actual_pages = len(reader.pages)
    if actual_pages != 6:
        print(f"[WARNING] {filename} generated {actual_pages} pages instead of 6!")
    else:
        print(f"Generated: {filename:34} [EXACTLY {actual_pages} PAGES]")

    return output_path


def generate_all_six_page_policies():
    KB_DIR.mkdir(parents=True, exist_ok=True)
    print("\n=======================================================")
    print(" Generating Official 6-Page HR Policy Documents (Nexus)")
    print("=======================================================\n")

    # =========================================================================
    # 1. EMPLOYEE HANDBOOK & CODE OF CONDUCT (6 PAGES)
    # =========================================================================
    create_six_page_pdf(
        filename="employee_handbook.pdf",
        doc_metadata={
            "id": "POL-HBK-2026-V5",
            "title": "Comprehensive Employee Handbook & Code of Conduct",
            "category": "General Standards & Workplace Conduct",
            "effective_date": "January 1, 2026",
        },
        pages_data=[
            # Page 1
            {
                "title": "Welcome, Corporate Mission & Diversity Standards",
                "paragraphs": [
                    "Welcome to Nexus Corporation. This Employee Handbook defines our foundational operating philosophies, statutory obligations, behavioral standards, and mutual expectations.",
                    "We are passionately committed to cultivating an inclusive, psychologically safe, and harassment-free workplace. We celebrate diversity across race, religion, color, national origin, gender identity, sexual orientation, disability, and veteran status.",
                ],
                "table_headers": ["Core Pillar", "Guiding Principle", "Observable Metric"],
                "table_rows": [
                    ["Customer Obsession", "Solve root issues with empathy", "Quarterly Net Promoter Score (NPS) > 75"],
                    ["Radical Transparency", "Information belongs to the whole team", "Open documentation & transparent metrics"],
                    ["Zero Tolerance", "No retaliation against good-faith reports", "100% compliance audit & swift tribunal review"],
                ],
                "table_col_widths": [130, 200, 174],
                "bullets": [
                    "Unlawful discrimination, verbal hostility, sexual harassment, or bullying will lead to immediate disciplinary action up to termination.",
                    "Whistleblowers reporting safety or ethical infringements are protected under corporate non-retaliation bylaws.",
                ],
                "callout_note": "Every Nexus colleague has an absolute right to work in dignity. Violations of dignity or safety can be reported anonymously to ethics@nexus-corp.internal or the 24/7 hotline at 1-800-555-0199.",
            },
            # Page 2
            {
                "title": "Working Hours, Core Collaboration & Time Tracking",
                "paragraphs": [
                    "Nexus Corporation operates with a hybrid operational cadence that respects individual focus while maximizing synchronous teamwork.",
                    "The standard contractual work week consists of 40 hours for regular full-time staff, distributed across Monday through Friday.",
                ],
                "table_headers": ["Time Window", "Requirement", "Communication Protocol"],
                "table_rows": [
                    ["10:00 AM – 4:00 PM", "Core Synchronous Hours", "Active Slack presence and response within 60 minutes"],
                    ["Flexible Flex Hours", "Asynchronous Deep Work", "Calendar blocks respected; notifications silenced"],
                    ["On-Call Rotations", "Equitable Shift Distribution", "Paged via PagerDuty with 1.5x shift differential"],
                ],
                "table_col_widths": [120, 174, 210],
                "bullets": [
                    "Core synchronous collaboration hours are 10:00 AM to 4:00 PM in the employee's designated primary regional time zone.",
                    "Non-exempt hourly colleagues must record accurate daily punch records in Workday and obtain manager pre-approval for overtime (>40 hours/week).",
                    "Overtime is compensated at 1.5x regular base hourly rate in accordance with federal and municipal labor statutes.",
                ],
                "callout_note": "Managers are strictly prohibited from requiring off-the-clock work. All work performed by non-exempt staff must be recorded and fully compensated.",
            },
            # Page 3
            {
                "title": "Professional Development, Education & Learning Stipend",
                "paragraphs": [
                    "Continuous learning is a competitive imperative. Nexus Corporation invests directly in the ongoing professional expansion of all full-time personnel.",
                    "Every regular full-time team member receives an annual learning allowance to pursue technical certifications, attend conferences, and purchase instructional materials.",
                ],
                "table_headers": ["Program Category", "Annual Cap", "Approval Authority"],
                "table_rows": [
                    ["Technical Certifications (AWS/GCP/PMP)", "Up to $1,200/year", "Direct Line Manager Pre-Approval"],
                    ["Industry Conferences & Summits", "Up to $2,500/year", "Department VP Authorization"],
                    ["Graduate Degree Tuition Assistance", "Up to $5,250/year", "People Operations & Finance Committee"],
                ],
                "table_col_widths": [180, 120, 204],
                "bullets": [
                    "Annual Learning Stipend: $1,200 per calendar year per employee, resetting on January 1st without rollover.",
                    "Eligible expenses include Coursera, O'Reilly subscriptions, book purchases, and professional examination fees.",
                    "Receipts accompanied by certificates of completion must be uploaded via the expense portal within 30 days of completion.",
                ],
                "callout_note": "Employees leaving the company within 6 months of receiving educational tuition reimbursement exceeding $2,500 are subject to a pro-rated reimbursement schedule.",
            },
            # Page 4
            {
                "title": "Performance Evaluation, Merit Cycles & Career Progression",
                "paragraphs": [
                    "Our talent assessment framework emphasizes continuous feedback, objective milestone attainment, and leadership competencies.",
                    "Formal performance appraisals occur biannually in mid-year (June) and year-end (December).",
                ],
                "table_headers": ["Review Stage", "Timeline", "Actionable Output"],
                "table_rows": [
                    ["Self & Peer 360 Feedback", "June 1-15 & Dec 1-15", "Minimum 3 cross-functional peer reviews"],
                    ["Calibration Sessions", "June 20 & Dec 20", "Standardized leveling across engineering & business units"],
                    ["Merit & Promo Effective Date", "February 1st Annual", "Base compensation adjustments and equity grants"],
                ],
                "table_col_widths": [140, 130, 234],
                "bullets": [
                    "Employees achieving 'Exceeds Expectations' (Tier 1) are eligible for fast-track promotion and discretionary bonus multipliers.",
                    "Underperforming colleagues are supported through a 30, 60, or 90-day structured Performance Improvement Plan (PIP).",
                    "A PIP establishes clear, measurable SMART deliverables reviewed weekly with HR People Partners.",
                ],
                "callout_note": "A PIP is intended as an honest developmental framework to restore performance. Unsuccessful PIP completion results in mutual separation with standard severance terms.",
            },
            # Page 5
            {
                "title": "Remote Working Abroad & Extended Sabbatical Programs",
                "paragraphs": [
                    "Nexus Corporation acknowledges the globalization of talent and supports temporary international remote arrangements.",
                    "Full-time employees in good standing may apply to work from an approved international destination for a temporary duration.",
                ],
                "table_headers": ["International Tier", "Max Duration", "Prerequisites & Compliance"],
                "table_rows": [
                    ["Tier A (Low Tax Risk EU/UK/Canada)", "Up to 20 business days/year", "Manager and HR Compliance Sign-off (30d notice)"],
                    ["Tier B (Moderate Tax Complexity)", "Up to 10 business days/year", "Tax advisory review and VP approval"],
                    ["Tier C (High Risk / Sanctioned)", "Prohibited (0 days)", "Strict security embargo; VPN access disabled"],
                ],
                "table_col_widths": [160, 140, 204],
                "bullets": [
                    "Employees may work remotely abroad for up to 20 days annually upon manager and HR compliance sign-off.",
                    "Compliance review guarantees corporate tax residency safeguards, data export sovereignty, and visa validity.",
                    "Sabbatical Leave: Permanent employees with 3+ years of tenure may request an unpaid sabbatical of 30 to 90 calendar days.",
                ],
                "callout_note": "Working abroad without prior HR compliance sign-off is a serious violation that can expose both the individual and company to international corporate tax liabilities.",
            },
            # Page 6
            {
                "title": "Grievance Escalation, Disciplinary Framework & Ethics Hotline",
                "paragraphs": [
                    "We maintain transparent, structured escalation mechanisms to ensure conflicts and compliance violations are resolved impartially.",
                    "Our four-stage disciplinary framework ensures fairness, documentation integrity, and opportunity for corrective action.",
                ],
                "table_headers": ["Escalation Stage", "Responsible Body", "Standard SLA & Output"],
                "table_rows": [
                    ["Stage 1: Informal Mediation", "Direct Line Manager", "Resolution or mediation within 5 business days"],
                    ["Stage 2: HR Partner Investigation", "People Operations Lead", "Formal fact-finding report within 10 business days"],
                    ["Stage 3: Executive Review Board", "VP People & Legal Counsel", "Binding determination within 14 business days"],
                    ["Stage 4: Anonymous Ethics Hotline", "External Independent Auditor", "Confidential intake with 24-hour acknowledgment"],
                ],
                "table_col_widths": [140, 140, 224],
                "bullets": [
                    "Disciplinary Progression: 1. Documented Verbal Coaching, 2. Written Warning, 3. Final Warning / Suspension, 4. Separation.",
                    "Severe infractions involving violence, theft, harassment, or gross negligence trigger immediate summary dismissal.",
                    "All records are retained in compliance with state records retention statutes for 7 years.",
                ],
                "callout_note": "Whistleblower Protection: Zero adverse employment action will be tolerated against any employee who reports suspected unlawful conduct in good faith.",
            },
        ],
    )

    # =========================================================================
    # 2. LEAVE, PTO & TIME OFF POLICY (6 PAGES)
    # =========================================================================
    create_six_page_pdf(
        filename="leave_policy.pdf",
        doc_metadata={
            "id": "POL-LEV-2026-V6",
            "title": "Company Leave, PTO & Absence Management Policy",
            "category": "Leave & Time Off",
            "effective_date": "January 1, 2026",
        },
        pages_data=[
            # Page 1
            {
                "title": "Annual Paid Time Off (PTO) Entitlement & Accrual",
                "paragraphs": [
                    "Nexus Corporation recognizes the profound importance of rest, recreation, and mental rejuvenation for sustained professional excellence.",
                    "All full-time permanent team members are entitled to paid annual leave accrued on a monthly cadence throughout the calendar year.",
                ],
                "table_headers": ["Tenure Band", "Annual PTO Entitlement", "Monthly Accrual Rate"],
                "table_rows": [
                    ["Years 0 – 3 (Standard Staff)", "20 Business Days", "1.67 Days / Completed Month"],
                    ["Years 4 – 6 (Senior Staff)", "23 Business Days", "1.92 Days / Completed Month"],
                    ["Years 7+ (Veteran Staff)", "26 Business Days", "2.17 Days / Completed Month"],
                ],
                "table_col_widths": [140, 160, 204],
                "bullets": [
                    "Full-time permanent employees are entitled to 20 business days of paid annual leave (PTO) per calendar year, accruing monthly at 1.67 days.",
                    "Part-time personnel accrue annual PTO on a pro-rated basis directly proportional to contracted weekly working hours.",
                    "Employees may carry forward up to a maximum of 5 unused leave days into the following calendar year.",
                    "Carryover days must be utilized before March 31 (end of Q1); unused carryover beyond 5 days is forfeited without financial payout.",
                ],
                "callout_note": "Advance Notice Rule: Planned annual leave exceeding 3 consecutive days must be submitted through the Employee Portal at least 14 days in advance and approved by the direct manager.",
            },
            # Page 2
            {
                "title": "Sick Leave, Medical Documentation & Absence Tracking",
                "paragraphs": [
                    "Health and well-being are paramount. Employees must not report to work while experiencing contagious illnesses or acute symptoms.",
                    "Employees receive dedicated paid sick leave independent of their vacation allotment to recover from injury or illness.",
                ],
                "table_headers": ["Leave Classification", "Annual Allotment", "Documentation Mandate"],
                "table_rows": [
                    ["Personal Illness / Recovery", "10 Paid Days (allocated Jan 1)", "Self-certification for days 1–3"],
                    ["Consecutive Medical Absence (>3d)", "Drawn from Sick Bank", "Mandatory Physician Certificate required"],
                    ["Dependent Care Medical Leave", "Up to 5 Days from Sick Bank", "Clinical appointment summary or doctor note"],
                ],
                "table_col_widths": [160, 150, 194],
                "bullets": [
                    "Employees receive 10 paid sick days per calendar year, credited in full on January 1st (pro-rated upon hire).",
                    "Medical absence exceeding 3 consecutive working days requires a certified medical practitioner notice submitted upon return.",
                    "Sick leave covers acute illness, mental health recovery days, preventive health screenings, and routine dental/vision surgery.",
                    "Unused sick days do not pay out upon resignation or termination.",
                ],
                "callout_note": "Strict Privacy Guarantee: Medical certificates must confirm fitness to work and dates of incapacity; diagnostic details or private clinical notes are never required by HR.",
            },
            # Page 3
            {
                "title": "Parental, Maternity, Paternity & Primary Caregiver Leave",
                "paragraphs": [
                    "Welcoming a new child into a family is a monumental life event. Nexus Corporation provides top-tier parental leave benefits.",
                    "Our policy provides comprehensive salary continuation regardless of gender, birth, adoption, or foster placement.",
                ],
                "table_headers": ["Caregiver Classification", "Paid Leave Duration", "Salary Continuation"],
                "table_rows": [
                    ["Primary Caregiver (Birthing / Non-Birthing)", "16 Weeks Paid Leave", "100% Base Salary Continuation"],
                    ["Secondary Caregiver", "6 Weeks Paid Leave", "100% Base Salary Continuation"],
                    ["Adoption & Foster Placement", "16 Weeks Paid Leave", "100% Base Salary + $3,000 legal subsidy"],
                ],
                "table_col_widths": [180, 140, 184],
                "bullets": [
                    "Eligibility: Employees become eligible upon completing 6 consecutive months (180 days) of active service.",
                    "Flexibility: Parental leave may be taken continuously or in two separate blocks within the first 12 months of birth or placement.",
                    "Benefits Continuity: Health insurance, 401(k) matching, and equity vesting continue unabated during the entire leave window.",
                ],
                "callout_note": "Notice Requirement: Expectant parents must notify People Operations at least 30 days prior to anticipated leave to coordinate transition plans and handover coverage.",
            },
            # Page 4
            {
                "title": "Bereavement, Compassionate Care & Civic Duties",
                "paragraphs": [
                    "Nexus Corporation stands firmly with employees facing personal tragedy or performing mandatory civic responsibilities.",
                    "Compassionate leave is granted immediately upon notification to your manager without bureaucratic friction.",
                ],
                "table_headers": ["Leave Reason", "Paid Duration", "Eligible Relationships"],
                "table_rows": [
                    ["Immediate Family Bereavement", "Up to 5 Paid Business Days", "Spouse, domestic partner, child, parent, sibling"],
                    ["Extended Family Bereavement", "Up to 2 Paid Business Days", "Grandparent, grandchild, aunt, uncle, cousin"],
                    ["Mandated Jury Duty Summons", "Up to 10 Paid Business Days", "Summoned court juror or subpoenaed witness"],
                ],
                "table_col_widths": [160, 150, 194],
                "bullets": [
                    "Additional unpaid bereavement or PTO may be combined with manager consent for international memorial travel.",
                    "Civic Duty: Employees summoned for jury duty receive full base salary continuation for up to 10 working days.",
                    "Voting Leave: Employees whose work hours do not permit 2 consecutive non-work hours while polls are open receive up to 2 hours paid leave.",
                ],
                "callout_note": "A copy of the court summons or official jury panel attendance notice must be provided to People Operations within 5 days of court release.",
            },
            # Page 5
            {
                "title": "Unpaid Personal Leave & Educational Sabbaticals",
                "paragraphs": [
                    "In exceptional life circumstances where statutory leave or PTO is insufficient, employees may request unpaid sabbaticals.",
                    "Leaves of absence may be authorized for personal health emergencies, family support, or formal educational endeavors.",
                ],
                "table_headers": ["Sabbatical Type", "Maximum Duration", "Prerequisites & Approvals"],
                "table_rows": [
                    ["Personal Emergency Leave", "Up to 60 Calendar Days", "Manager and Head of HR Approval"],
                    ["Educational Sabbatical", "Up to 90 Calendar Days", "Minimum 24 months tenure & VP Approval"],
                    ["Statutory FMLA Unpaid Leave", "Up to 12 Weeks (Job Protected)", "1,250 hours worked over past 12 months"],
                ],
                "table_col_widths": [150, 140, 214],
                "bullets": [
                    "Approval is discretionary and evaluated against team operational capacity and candidate performance standing.",
                    "Health benefits: The employee may elect to maintain group health benefits by paying the standard employee share of premiums.",
                    "Return to work: Nexus guarantees restoration to the same or equivalent position upon scheduled return.",
                ],
                "callout_note": "Employees failing to return on the mutually agreed resumption date without documented extension will be deemed to have voluntarily resigned.",
            },
            # Page 6
            {
                "title": "Statutory Entitlements, Holiday Schedule & Absence Compliance",
                "paragraphs": [
                    "Nexus Corporation observes all federally declared public holidays along with flexible cultural observance days.",
                    "Unexcused absences undermine team productivity and are subject to progressive disciplinary enforcement.",
                ],
                "table_headers": ["Holiday / Absence Category", "Allotment", "Operational Guideline"],
                "table_rows": [
                    ["Statutory Public Holidays", "11 Fixed Days / Year", "Offices closed; systems monitored by on-call rota"],
                    ["Floating Cultural Holidays", "2 Paid Days / Year", "Elected individually for personal cultural observance"],
                    ["Unexcused Absence (No Call/No Show)", "0 Days", "Disciplinary written warning on day 1"],
                ],
                "table_col_widths": [160, 140, 204],
                "bullets": [
                    "Floating holidays must be taken within the calendar year and do not carry over or pay out upon departure.",
                    "Job Abandonment: An absence of 3 consecutive working days without communication (No Call / No Show) constitutes voluntary job abandonment.",
                    "Disputes regarding leave balances should be logged via a ticket in the Employee Portal to People Operations.",
                ],
                "callout_note": "All leave requests and approvals must be formally recorded in the portal; informal verbal agreements outside the system are non-binding.",
            },
        ],
    )

    # =========================================================================
    # 3. BENEFITS & WELLNESS GUIDE (6 PAGES)
    # =========================================================================
    create_six_page_pdf(
        filename="benefits_guide.pdf",
        doc_metadata={
            "id": "POL-BEN-2026-V3",
            "title": "Comprehensive Employee Health, Welfare & Retirement Benefits Guide",
            "category": "Benefits & Wellness",
            "effective_date": "January 1, 2026",
        },
        pages_data=[
            # Page 1
            {
                "title": "Group Medical Insurance & Preventive Healthcare",
                "paragraphs": [
                    "Nexus Corporation provides market-leading healthcare protection to ensure you and your family have comprehensive medical security.",
                    "Full-time regular employees and their eligible dependents are eligible on the first of the month following their start date.",
                ],
                "table_headers": ["Plan Feature", "Comprehensive PPO Plan", "High Deductible Health Plan (HDHP)"],
                "table_rows": [
                    ["Annual In-Network Deductible", "$500 Individual / $1,000 Family", "$1,600 Individual / $3,200 Family"],
                    ["Preventive Care (Wellness Exams)", "Covered 100% (No copay)", "Covered 100% (No copay)"],
                    ["PCP / Specialist Office Copay", "$20 PCP / $40 Specialist", "Subject to deductible, then 10% coinsurance"],
                    ["Out-of-Pocket Maximum", "$3,000 Individual / $6,000 Family", "$4,000 Individual / $8,000 Family"],
                ],
                "table_col_widths": [140, 180, 184],
                "bullets": [
                    "Eligible Dependents: Legal spouses, certified domestic partners, and biological, adopted, or step-children up to age 26.",
                    "In-network telemedicine visits via Teladoc are 100% covered with a $0 copay across all medical plans.",
                    "Prescription Drug Coverage: Tier 1 Generic ($10 copay), Tier 2 Preferred Brand ($30 copay), Tier 3 Specialty ($60 copay).",
                ],
                "callout_note": "Annual Open Enrollment takes place in November. Outside Open Enrollment, benefit changes require a Qualifying Life Event (QLE) reported within 30 days.",
            },
            # Page 2
            {
                "title": "Dental, Orthodontia & Vision Hardware Coverage",
                "paragraphs": [
                    "Oral health and vision wellness are foundational to overall physical wellness and quality of life.",
                    "Our Delta Dental and VSP Vision plans offer broad national networks of credentialed specialists.",
                ],
                "table_headers": ["Service Category", "Dental PPO Benefit", "VSP Vision Hardware Plan"],
                "table_rows": [
                    ["Preventative & Diagnostic", "100% covered (2 cleanings & exams/yr)", "Annual exam covered with $10 copay"],
                    ["Basic Restorative (Fillings/Root Canals)", "80% covered after $50 deductible", "N/A (covered under medical)"],
                    ["Major Services & Crowns", "50% covered up to $2,500/year max", "N/A"],
                    ["Hardware / Orthodontia", "$2,000 lifetime child/adult orthodontia", "$200 annual frame/contact lens allowance"],
                ],
                "table_col_widths": [140, 180, 184],
                "bullets": [
                    "Dental Plan Annual Maximum: $2,500 per covered member per calendar year.",
                    "Vision: Prescription lenses covered in full every 12 months with scratch-resistant coating included at no extra charge.",
                    "Discounts: 20% discount on laser vision correction (LASIK) through contracted network centers.",
                ],
                "callout_note": "Prior authorization is strongly encouraged for dental prosthodontics or periodontal surgery exceeding $500 to avoid unexpected patient cost-share.",
            },
            # Page 3
            {
                "title": "Tax-Advantaged Accounts (HSA, Healthcare FSA, DCFSA)",
                "paragraphs": [
                    "Maximize take-home pay by leveraging pre-tax payroll deductions for predictable medical, dental, and childcare expenses.",
                    "Nexus Corporation partners with Fidelity and Optum to administer triple-tax-advantaged healthcare spending accounts.",
                ],
                "table_headers": ["Account Type", "2026 Statutory Contribution Limit", "Employer Contribution / Seed"],
                "table_rows": [
                    ["Health Savings Account (HSA)", "$4,300 Individual / $8,550 Family", "$750 Individual / $1,500 Family Seed"],
                    ["Healthcare FSA (PPO enrollees)", "$3,300 Annual Maximum", "Employee funded pre-tax payroll"],
                    ["Dependent Care FSA (DCFSA)", "$5,000 per Household / Year", "Employee funded pre-tax payroll"],
                ],
                "table_col_widths": [150, 174, 180],
                "bullets": [
                    "HSA Employer Seed: Deposited in two equal installments in January and July for enrolled HDHP participants.",
                    "HSA funds belong to the employee permanently, roll over indefinitely, and can be invested in mutual funds.",
                    "FSA 'Use It or Lose It': Up to $640 in unused Healthcare FSA balances can carry over into the following year; excess is forfeited.",
                ],
                "callout_note": "IRS Compliance: Enrolling in a general-purpose Healthcare FSA disqualifies you from making contributions to an HSA during that plan year.",
            },
            # Page 4
            {
                "title": "Retirement Savings Plan: 401(k) Matching & Financial Health",
                "paragraphs": [
                    "Building long-term financial independence is a core component of total rewards at Nexus Corporation.",
                    "Our 401(k) retirement plan administered through Fidelity Investments offers institutional low-fee index funds.",
                ],
                "table_headers": ["Employee Deferral", "Employer Company Match", "Vesting Schedule"],
                "table_rows": [
                    ["First 4% of Base Salary", "100% Match (Dollar-for-Dollar)", "Immediate 100% Cliff Vesting"],
                    ["Contributions beyond 4%", "0% Additional Match", "Employee contributions always 100% vested"],
                    ["Catch-up (Age 50+)", "Allowed up to statutory ceiling", "Standard plan match applies to base 4%"],
                ],
                "table_col_widths": [150, 180, 174],
                "bullets": [
                    "The company provides an immediate 100% employer matching contribution on salary deferrals up to 4% of eligible base salary.",
                    "Immediate Vesting: Company matching funds vest immediately at 100% from day one with zero vesting lock-in.",
                    "Support for both Traditional pre-tax 401(k) and Roth post-tax 401(k) payroll contribution elections.",
                    "Automatic Enrollment: New hires are automatically enrolled at 3% contribution after 30 days unless an opt-out is filed.",
                ],
                "callout_note": "Employees can modify deferral percentages or rebalance portfolio allocations anytime via NetBenefits.fidelity.com.",
            },
            # Page 5
            {
                "title": "Mental Health, Modern Health EAP & Life Insurance",
                "paragraphs": [
                    "Mental well-being is every bit as critical as physical health. We provide extensive clinical counseling and crisis support.",
                    "Our modern Employee Assistance Program (EAP) is provided through Modern Health at zero cost to employees.",
                ],
                "table_headers": ["Benefit Component", "Coverage Level", "Employee Cost"],
                "table_rows": [
                    ["Clinical Therapy (Modern Health)", "8 Free Therapy Sessions / Year", "$0 (100% Company Paid)"],
                    ["Mental Health Coaching", "8 Free Coaching Sessions / Year", "$0 (100% Company Paid)"],
                    ["Basic Life & AD&D Insurance", "2x Annual Base Salary (up to $500k)", "$0 (100% Company Paid)"],
                    ["Long-Term Disability (LTD)", "60% of Pre-Disability Monthly Earnings", "$0 (100% Company Paid)"],
                ],
                "table_col_widths": [160, 180, 164],
                "bullets": [
                    "Modern Health therapy sessions are available for employees and their eligible dependents with licensed therapists.",
                    "Sessions are 100% confidential; Nexus never receives names or clinical notes regarding participating employees.",
                    "Supplemental Life Insurance: Up to 5x salary (guaranteed issue up to $350k) available via payroll deduction.",
                ],
                "callout_note": "Crisis support is available 24/7/365 via Modern Health crisis hotline or National Suicide & Crisis Lifeline at 988.",
            },
            # Page 6
            {
                "title": "Lifestyle Stipends, Wellness Reimbursements & COBRA",
                "paragraphs": [
                    "We support whole-person wellness through flexible lifestyle stipends and pre-tax commuter benefits.",
                    "This section also outlines continuation rights under the Consolidated Omnibus Budget Reconciliation Act (COBRA).",
                ],
                "table_headers": ["Perk / Continuation Program", "Monthly Allowance / Duration", "Eligible Usages"],
                "table_rows": [
                    ["Monthly Wellness Stipend", "Up to $75 / Month ($900/year)", "Gym, yoga, fitness trackers, meditation apps"],
                    ["Commuter Transit & Parking", "Up to $315 / Month Pre-Tax", "Public transit passes, commuter rail, parking"],
                    ["COBRA Continuation Coverage", "Up to 18 to 36 Months", "Continuation of medical, dental, vision upon exit"],
                ],
                "table_col_widths": [160, 160, 184],
                "bullets": [
                    "Wellness claims must be submitted with receipt proof by the 15th of the month following purchase via the portal.",
                    "Pre-tax commuter transit cards can be configured and updated monthly through our third-party administrator.",
                    "COBRA enrollment materials are mailed automatically within 14 days of separation; coverage is retroactive to termination date.",
                ],
                "callout_note": "Wellness reimbursements are classified as taxable fringe benefits per IRS guidelines and will appear on your W-2.",
            },
        ],
    )

    # =========================================================================
    # 4. REMOTE & HYBRID WORK POLICY (6 PAGES)
    # =========================================================================
    create_six_page_pdf(
        filename="remote_work_policy.pdf",
        doc_metadata={
            "id": "POL-REM-2026-V4",
            "title": "Remote and Hybrid Work Operational Policy",
            "category": "Workplace & IT",
            "effective_date": "January 1, 2026",
        },
        pages_data=[
            # Page 1
            {
                "title": "Hybrid Work Framework & Office Cadence",
                "paragraphs": [
                    "Nexus Corporation champions a flexible hybrid work paradigm engineered to empower focused individual productivity.",
                    "Eligible employees whose core responsibilities permit remote execution may work remotely up to 3 days per week.",
                ],
                "table_headers": ["Designation", "In-Office Cadence", "Eligibility Criteria"],
                "table_rows": [
                    ["Hybrid Staff (Standard)", "Tuesdays & Thursdays Mandatory", "Residing within 50 miles of regional hub"],
                    ["Designated Fully Remote", "Quarterly Summits Only", "Pre-approved remote agreement (>50 miles)"],
                    ["Essential On-Site Staff", "Monday – Friday On-Site", "Data center, hardware lab, or facilities operations"],
                ],
                "table_col_widths": [140, 174, 190],
                "bullets": [
                    "Eligible employees may work remotely up to 3 days per week, subject to direct manager approval.",
                    "Mandatory In-Office Days: Tuesday and Thursday are core in-person collaboration days for all hybrid personnel within 50 miles.",
                    "Core synchronous collaboration hours are 10:00 AM to 4:00 PM local time across all remote sites.",
                    "Remote colleagues must remain accessible via Slack and email during core collaboration hours.",
                ],
                "callout_note": "Attendance on designated core days is tracked via badge swipes; unexcused absenteeism from in-office days may result in revocation of remote privileges.",
            },
            # Page 2
            {
                "title": "Home Office Ergonomic Stipend & Internet Allowance",
                "paragraphs": [
                    "A comfortable, ergonomically sound workspace is vital for long-term physical well-being and repetitive strain injury prevention.",
                    "Nexus Corporation subsidizes your remote work setup through dedicated setup stipends and recurring internet allowances.",
                ],
                "table_headers": ["Allowance Type", "Financial Benefit", "Eligible Infrastructure"],
                "table_rows": [
                    ["Home Office Setup Stipend", "Up to $500 One-Time", "Ergonomic chair, external 4K monitor, desk riser"],
                    ["Monthly Internet Subsidy", "Up to $50 / Month", "High-speed residential broadband / fiber"],
                    ["Corporate Laptop & Peripherals", "Standard IT Hardware Bundle", "MacBook Pro / ThinkPad + dock + headset"],
                ],
                "table_col_widths": [150, 150, 204],
                "bullets": [
                    "Home Office Setup Stipend: One-time reimbursement of up to $500 following completion of 90-day probationary period.",
                    "Internet Subsidy: $50 monthly allowance disbursed directly through payroll to subsidize high-speed connectivity.",
                    "Expense claims must be submitted with itemized vendor receipts within 45 days of transaction date.",
                    "Hardware purchased with the stipend remains employee personal property upon departure.",
                ],
                "callout_note": "Company-provided laptops, monitors, and security tokens remain corporate property and must be returned within 5 days of employment conclusion.",
            },
            # Page 3
            {
                "title": "International Remote Work & Temporary Relocation",
                "paragraphs": [
                    "Nexus Corporation offers employees the opportunity to combine travel and remote productivity through temporary international work.",
                    "To prevent permanent establishment corporate tax exposure, international remote work is strictly regulated.",
                ],
                "table_headers": ["Approval Tier", "Maximum Allowance", "Prerequisite Approvals"],
                "table_rows": [
                    ["International Remote Work", "Up to 20 Business Days / Year", "Manager & HR Compliance Sign-off (30d notice)"],
                    ["Domestic Interstate Remote", "Up to 30 Business Days / Year", "Manager notification (14d notice)"],
                    ["Permanent State Relocation", "Subject to Entity Setup", "People Ops Compensation & Tax review"],
                ],
                "table_col_widths": [150, 164, 190],
                "bullets": [
                    "Employees may work remotely abroad for up to 20 days annually upon manager and HR compliance sign-off.",
                    "Employees must verify legal right to work in the destination jurisdiction without requiring corporate visa sponsorship.",
                    "Destination country must not be listed on federal export control embargoes or State Department Level 4 Travel Advisories.",
                ],
                "callout_note": "Working internationally without prior HR compliance sign-off is grounds for immediate termination due to severe tax and immigration compliance liability.",
            },
            # Page 4
            {
                "title": "Information Security, VPN & Data Protection while Remote",
                "paragraphs": [
                    "Working outside the secure corporate office perimeter expands the threat surface for cyber intrusions.",
                    "Remote personnel must adhere to rigorous cybersecurity protocols to protect intellectual property and customer records.",
                ],
                "table_headers": ["Security Layer", "Standard Mandate", "Enforcement Mechanism"],
                "table_rows": [
                    ["Virtual Private Network (VPN)", "Always-on GlobalProtect VPN", "Required for staging, internal APIs, and databases"],
                    ["Endpoint Protection", "CrowdStrike Falcon EDR", "Real-time behavioral telemetry monitoring"],
                    ["Display Privacy", "Privacy filter in public venues", "Screen lock after 5 minutes inactivity"],
                ],
                "table_col_widths": [150, 180, 174],
                "bullets": [
                    "Remote employees must always connect to the corporate VPN when accessing internal networks, repos, or customer data.",
                    "Connecting unencrypted personal USB thumb drives, external hard drives, or unauthorized peripheral storage is prohibited.",
                    "Open, unencrypted public Wi-Fi networks (cafes, airport terminals) are forbidden unless secured via encrypted cellular hotspot.",
                    "Workstation screens must be locked (Win + L or Control + Command + Q) whenever leaving the desk.",
                ],
                "callout_note": "Loss or theft of any corporate laptop or mobile device must be reported to security-ops@nexus-corp.internal within 2 hours.",
            },
            # Page 5
            {
                "title": "Workspace Ergonomics, Health & Asynchronous Workflows",
                "paragraphs": [
                    "Nexus Corporation requires all remote employees to maintain a dedicated, distraction-free home working environment.",
                    "Remote work succeeds through strong asynchronous communication habits rather than constant synchronous presence.",
                ],
                "table_headers": ["Practice Area", "Recommended Standard", "Key Benefit"],
                "table_rows": [
                    ["Ergonomic Alignment", "Eye level monitor, 90° elbow bend", "Prevention of repetitive strain & spinal fatigue"],
                    ["Async Documentation", "Notion / Confluence project briefs", "Reduces meeting fatigue across time zones"],
                    ["Digital Disconnection", "Mute Slack after 6:00 PM local", "Prevents chronic burnout and promotes recovery"],
                ],
                "table_col_widths": [140, 180, 184],
                "bullets": [
                    "Employees are encouraged to complete the virtual Ergonomic Self-Assessment module upon onboarding.",
                    "Meeting etiquette: Cameras on for interactive 1-on-1s and retrospectives; default to async updates for status checks.",
                    "Dependent care: While remote work offers flexibility, it is not a substitute for continuous dedicated childcare during core hours.",
                ],
                "callout_note": "Work-from-home injuries occurring during designated work hours must be reported to Workers' Compensation within 24 hours of occurrence.",
            },
            # Page 6
            {
                "title": "Performance Expectations & Revocation of Remote Status",
                "paragraphs": [
                    "Remote work is a performance-contingent operational privilege, not an unconditional statutory entitlement.",
                    "Continued remote eligibility requires sustained performance, transparent communication, and core day attendance.",
                ],
                "table_headers": ["Trigger Event", "Corrective Action", "Notice Period"],
                "table_rows": [
                    ["Performance Deficiencies (PIP)", "Temporary return to 5-day in-office", "7 Calendar Days Written Notice"],
                    ["Chronic Core Attendance Breach", "Mandatory in-person coaching", "Immediate supervisory meeting"],
                    ["Role Reclassification", "On-site essential transition", "30 Calendar Days Transition Window"],
                ],
                "table_col_widths": [160, 180, 164],
                "bullets": [
                    "Management reserves the operational authority to revoke or modify remote working agreements based on business demands.",
                    "Employees placed on formal Performance Improvement Plans (PIPs) may be required to work on-site during remediation.",
                    "Disputes regarding remote work decisions may be appealed to the People Operations Employee Relations Director.",
                ],
                "callout_note": "All remote work arrangements are formally reviewed annually during the Q4 workforce planning cycle.",
            },
        ],
    )

    # =========================================================================
    # 5. TRAVEL & EXPENSE POLICY (6 PAGES - MERGED MASTER)
    # =========================================================================
    create_six_page_pdf(
        filename="travel_expense_policy.pdf",
        doc_metadata={
            "id": "POL-TRV-2026-V5",
            "title": "Corporate Business Travel, Lodging & Expense Reimbursement Policy",
            "category": "Payroll & Expense Management",
            "effective_date": "January 1, 2026",
        },
        pages_data=[
            # Page 1
            {
                "title": "Travel Authorization & Corporate Booking Platform",
                "paragraphs": [
                    "Nexus Corporation authorizes business travel that directly advances customer relationships, sales goals, or corporate expansion.",
                    "All travel arrangements must be prudent, economically justified, and pre-approved by appropriate authorized managers.",
                ],
                "table_headers": ["Travel Category", "Pre-Approval Lead Time", "Mandatory Sign-off Authority"],
                "table_rows": [
                    ["Domestic Travel (<$2,000)", "At least 14 days in advance", "Department Head / Direct Director"],
                    ["Domestic High-Cost Travel (>$2,000)", "At least 21 days in advance", "Department Vice President (VP)"],
                    ["International Business Travel", "At least 30 days in advance", "Executive VP & Chief Financial Officer (CFO)"],
                ],
                "table_col_widths": [160, 150, 194],
                "bullets": [
                    "All travel must have prior written approval before booking tickets or incurring non-refundable charges.",
                    "Mandatory Booking Tool: All flights, hotels, and rental vehicles must be booked through Navan (corporate travel portal).",
                    "Off-platform bookings are strictly non-reimbursable unless Navan customer support explicitly validates technical unavailability.",
                ],
                "callout_note": "Duty of Care: Booking through Navan enables corporate security to locate and extract travelers immediately in international emergencies.",
            },
            # Page 2
            {
                "title": "Airfare Standards, Rail Travel & Ground Transportation",
                "paragraphs": [
                    "Air travel represents a substantial operational commitment and must be booked in accordance with corporate tier limits.",
                    "Travelers must select the lowest logical commercial airfare available within 2 hours of desired departure.",
                ],
                "table_headers": ["Flight Segment Duration", "Authorized Cabin Class", "Exceptions & Upgrades"],
                "table_rows": [
                    ["Domestic & Flights under 6 hours", "Standard Economy Class", "Preferred seat fees reimbursable under $50"],
                    ["Continuous Flight over 6 hours", "Premium Economy or Business Class", "Pre-approval from Department VP required"],
                    ["Rail Travel (Acela / Eurostar)", "Business Class Rail", "Allowed when faster than door-to-door air travel"],
                ],
                "table_col_widths": [160, 160, 184],
                "bullets": [
                    "Economy class is the standard travel booking class for all domestic and short-haul flights.",
                    "Business class booking is only permitted for continuous commercial flight segments exceeding 6 hours duration.",
                    "Ground Transit: Standard rideshare (UberX/Lyft) and taxis are authorized; luxury rides (Uber Black/SUV) are non-reimbursable.",
                    "Personal Vehicle Mileage: Reimbursed at statutory IRS rate (67 cents/mile in 2026), covering all fuel, wear, and insurance.",
                ],
                "callout_note": "Airline lounge memberships, TSA PreCheck, or CLEAR subscriptions are non-reimbursable unless traveling >100,000 miles/year on corporate business.",
            },
            # Page 3
            {
                "title": "Hotel Lodging Limits & Nightly City Caps",
                "paragraphs": [
                    "Nexus Corporation ensures travelers have safe, comfortable, clean accommodations located near business destinations.",
                    "Nightly room rate limits are benchmarked annually against regional corporate lodging indexes.",
                ],
                "table_headers": ["Market Tier", "Nightly Room Cap (excl. tax)", "Sample Benchmark Metros"],
                "table_rows": [
                    ["Standard Metro Areas", "$200 / Night", "Austin, Denver, Atlanta, Dallas, Phoenix, Berlin"],
                    ["Tier 1 High-Cost Metros", "$320 / Night", "New York, San Francisco, London, Tokyo, Zurich, Paris"],
                    ["Conference Host Hotels", "Conference Rate Approved", "When staying at official venue saves daily ground transit"],
                ],
                "table_col_widths": [140, 160, 204],
                "bullets": [
                    "Maximum reimbursable nightly rate for standard hotel rooms is $200 per night (excluding mandatory municipal taxes).",
                    "For designated Tier 1 high-cost cities, the nightly ceiling is increased to $320.",
                    "Short-term rentals (Airbnb / VRBO) are reimbursable only when total cost is lower than contracted partner hotel rates.",
                    "Incidental room charges: In-room movies, mini-bar snacks, spa services, and laundry (on trips <5 days) are non-reimbursable.",
                ],
                "callout_note": "Hotel loyalty points and frequent flier miles accrued during corporate travel belong to the employee for personal enjoyment.",
            },
            # Page 4
            {
                "title": "Daily Meal Per Diem Allowance & Client Dining Caps",
                "paragraphs": [
                    "Travelers are reimbursed for reasonable, ordinary meal expenditures incurred during overnight corporate travel.",
                    "We utilize a per diem standard combined with receipt validation for larger dining transactions.",
                ],
                "table_headers": ["Meal / Entertainment Type", "Reimbursement Cap", "Receipt Mandate"],
                "table_rows": [
                    ["Daily Meal Per Diem Cap", "$75 / Day ($15 B, $25 L, $35 D)", "Itemized receipts required for items >$25"],
                    ["Client Entertainment Dining", "$100 / Attendee (including tax/tip)", "Full attendee roster and commercial purpose"],
                    ["Team Celebration Meals", "$50 / Attendee", "Advance VP budget sign-off required"],
                ],
                "table_col_widths": [160, 170, 174],
                "bullets": [
                    "The daily meal per diem cap is $75 per day when traveling on overnight business trips.",
                    "Recommended breakdown: Breakfast: $15, Lunch: $25, Dinner: $35.",
                    "Original itemized receipts are strictly required for any individual meal or transit expense exceeding $25.",
                    "Client Entertainment: Maximum $100 per attendee including tax and tip (gratuity capped at 20%).",
                    "Alcohol is reimbursable only when accompanied by a full meal with external clients or during official offsites.",
                ],
                "callout_note": "Summary credit card charge slips showing only the final total are not acceptable; detailed itemized merchant receipts showing items ordered are required.",
            },
            # Page 5
            {
                "title": "Expense Submission Windows, Receipts & Audit Deadlines",
                "paragraphs": [
                    "Prompt expense reporting ensures accurate financial forecasting and timely vendor payments.",
                    "Employees must submit expense claims via the portal within mandatory operational timeframes.",
                ],
                "table_headers": ["Expense Milestone", "Operational Deadline", "Consequence of Breach"],
                "table_rows": [
                    ["Standard Submission Window", "Within 30 Calendar Days", "Processed within standard 5-day payroll cycle"],
                    ["Late Submission Grace Period", "Days 31 to 60 Calendar Days", "Requires written justification to VP Finance"],
                    ["Strict Statutory Cutoff", "Past 60 Calendar Days", "Strict rejection; expense will not be reimbursed"],
                ],
                "table_col_widths": [160, 150, 194],
                "bullets": [
                    "Expense reports must be submitted within 30 calendar days of the date the expense was incurred.",
                    "Late submissions past 60 days will be rejected and will not be reimbursed by Accounts Payable.",
                    "Corporate Credit Cards: Employees issued corporate cards must reconcile monthly statements within 10 business days.",
                    "Inadvertent personal charges on corporate cards must be reimbursed to the company within 10 business days.",
                ],
                "callout_note": "Lost receipts for expenses under $25 may be certified via an affidavit; repeated affidavits will result in revocation of expense privileges.",
            },
            # Page 6
            {
                "title": "Non-Reimbursable Expenses, Fraud Detection & Disciplinary Sanctions",
                "paragraphs": [
                    "Corporate funds must never be diverted to subsidize personal lifestyles, entertainment, or familial expenses.",
                    "All expense submissions are audited by automated anomaly detection algorithms and human finance reviewers.",
                ],
                "table_headers": ["Prohibited Expenditure", "Policy Rationale", "Audit Action"],
                "table_rows": [
                    ["Traffic & Parking Citations", "Personal driver responsibility", "Flagged and deducted from reimbursement"],
                    ["Companion Travel Expenses", "Personal leisure travel", "Disallowed entirely; personal invoice split"],
                    ["Personal Subscriptions / Streaming", "Non-business entertainment", "Immediate rejection by Finance"],
                    ["Mini-Bar Snacks & Spa Treatments", "Personal luxury services", "Personal expense; employee self-pay"],
                ],
                "table_col_widths": [160, 160, 184],
                "bullets": [
                    "Strictly Non-Reimbursable: Traffic/parking violations, grooming/spa, seat upgrades without approval, personal streaming subscriptions.",
                    "Intentionally falsified expense claims, duplicate invoice submissions, or claiming personal charges constitutes criminal fraud.",
                    "Violations will result in immediate termination of employment, forfeiture of severance, and potential referral to law enforcement.",
                ],
                "callout_note": "Finance conducts quarterly random forensic audits across 10% of all submitted expense reports to ensure uniform policy adherence.",
            },
        ],
    )

    # Copy / symlink travel_expense_policy to dedicated legacy aliases so no existing citation breaks:
    for alias_name in ["expense_policy.pdf", "travel_policy.pdf"]:
        shutil.copy2(KB_DIR / "travel_expense_policy.pdf", KB_DIR / alias_name)
        print(f"Generated: {alias_name:34} [EXACTLY 6 PAGES - MERGED ALIAS]")

    # =========================================================================
    # 6. INFORMATION SECURITY & DATA PROTECTION POLICY (6 PAGES)
    # =========================================================================
    create_six_page_pdf(
        filename="security_policy.pdf",
        doc_metadata={
            "id": "POL-SEC-2026-V5",
            "title": "Information Security, Data Protection & Acceptable Use Policy",
            "category": "Workplace & IT",
            "effective_date": "January 1, 2026",
        },
        pages_data=[
            # Page 1
            {
                "title": "Authentication, Password Governance & Multi-Factor Security",
                "paragraphs": [
                    "Information assets, customer data, and source code are the lifeblood of Nexus Corporation.",
                    "Credential compromise is the primary vector for enterprise intrusions; robust authentication hygiene is mandatory.",
                ],
                "table_headers": ["Credential Parameter", "Corporate Security Requirement", "Enforcement Rule"],
                "table_rows": [
                    ["Minimum Password Length", "At least 14 characters", "Complexity filter: upper, lower, digit, symbol"],
                    ["Password Expiration Rotation", "Every 90 calendar days", "Automated expiration notice via Okta"],
                    ["Password History Retention", "Cannot repeat previous 6 passwords", "Enforced at directory level"],
                    ["Multi-Factor Authentication (MFA)", "Hardware FIDO2 token or Okta Push", "Mandatory on all SSO logins; SMS banned"],
                ],
                "table_col_widths": [150, 174, 180],
                "bullets": [
                    "Passwords must be a minimum of 14 characters in length and include uppercase, lowercase, numbers, and special characters (!@#$%^&*).",
                    "Passwords must be changed every 90 days; reusing any of the previous 6 passwords is prohibited.",
                    "MFA via company-approved hardware tokens (YubiKey) or authenticator apps is mandatory for all accounts.",
                    "SMS-based 2FA is strictly prohibited across all internal and client-facing infrastructure due to SIM-swap vulnerabilities.",
                ],
                "callout_note": "Password Sharing Prohibition: Sharing passwords or MFA push approvals with colleagues or supervisors is a severe disciplinary infraction.",
            },
            # Page 2
            {
                "title": "Workstation Security, Clean Desk Policy & Screen Locking",
                "paragraphs": [
                    "Physical security and workstation integrity are fundamental to safeguarding customer confidentiality.",
                    "Employees must ensure sensitive screens and documents are never exposed to unauthorized visual inspection.",
                ],
                "table_headers": ["Security Action", "Mandated Protocol", "Operational Context"],
                "table_rows": [
                    ["Workstation Screen Lock", "Windows: Win+L | macOS: Ctrl+Cmd+Q", "Mandatory whenever stepping away from desk"],
                    ["Automated Idle Screen Lock", "5 minutes inactivity timer", "Enforced via central MDM profile"],
                    ["Physical Document Storage", "Locked file cabinets / drawers", "End-of-day clean desk compliance"],
                    ["Confidential Shredding", "Locked cross-cut disposal bins", "All physical printouts containing PII/financials"],
                ],
                "table_col_widths": [140, 180, 184],
                "bullets": [
                    "Employees must lock their workstation screens whenever stepping away from their desk, in the office or in public.",
                    "Clean Desk Policy: Sensitive physical documents, badges, and keys must not be left unattended on desks overnight.",
                    "Whiteboards in conference rooms containing architecture diagrams or customer names must be erased after meetings.",
                    "Visitors must be escorted at all times within secure corporate zones and must wear visible visitor badges.",
                ],
                "callout_note": "Tailgating Prohibition: Never allow individuals without visible badges to follow you through secure badge-access doors.",
            },
            # Page 3
            {
                "title": "Removable Storage Devices & External Media Prohibition",
                "paragraphs": [
                    "External storage devices introduce severe vectors for malware propagation and intellectual property exfiltration.",
                    "To prevent data leaks, our corporate workstations enforce strict hardware interface restrictions.",
                ],
                "table_headers": ["Peripheral Category", "Usage Restriction", "Authorized Alternative"],
                "table_rows": [
                    ["Personal USB Thumb Drives", "Strictly Prohibited (Port Disabled)", "Corporate Google Drive Enterprise"],
                    ["External Hard Drives (Unencrypted)", "Strictly Prohibited", "Encrypted AWS S3 Buckets / Box Enterprise"],
                    ["Personal Peripheral Devices", "Mouse/keyboard allowed; storage blocked", "IT-provisioned hardware accessories"],
                ],
                "table_col_widths": [160, 160, 184],
                "bullets": [
                    "Connecting unencrypted personal USB thumb drives, external hard disks, or unauthorized peripheral storage is prohibited.",
                    "Exceptions require written authorization and hardware certification from the Chief Information Security Officer (CISO).",
                    "All file transfers must utilize approved cloud repositories with end-to-end TLS 1.3 encryption and audit logging.",
                ],
                "callout_note": "USB device insertion triggers an automated security alert to the Security Operations Center (SOC) for forensic review.",
            },
            # Page 4
            {
                "title": "Data Classification, Confidentiality & Customer Privacy",
                "paragraphs": [
                    "Data classification ensures that appropriate security controls are applied proportional to sensitivity.",
                    "All information created, transmitted, or stored on corporate infrastructure is categorized into four tiers.",
                ],
                "table_headers": ["Classification Tier", "Data Examples", "Handling & Encryption Rules"],
                "table_rows": [
                    ["Public (Tier 1)", "Marketing materials, job descriptions", "No restrictions on external distribution"],
                    ["Internal (Tier 2)", "Employee directory, general policies", "Internal company access only; not for public release"],
                    ["Confidential (Tier 3)", "Financial forecasts, roadmap docs", "Restricted to authorized teams; encrypted at rest"],
                    ["Restricted / PII (Tier 4)", "Customer PII, health records, secrets", "Strict RBAC, KMS envelope encryption, audit logged"],
                ],
                "table_col_widths": [140, 174, 190],
                "bullets": [
                    "Customer Personally Identifiable Information (PII) must never be stored on local laptop drives or unencrypted media.",
                    "All databases containing Tier 4 data must utilize AES-256 encryption at rest and TLS 1.3 in transit.",
                    "Employees must sign non-disclosure agreements (NDAs) covering proprietary technology and commercial secrets.",
                ],
                "callout_note": "Using consumer AI tools (e.g., public ChatGPT) with proprietary code or customer data is strictly forbidden; use only internal enterprise AI Copilots.",
            },
            # Page 5
            {
                "title": "Security Incident Response, Phishing & Threat Reporting",
                "paragraphs": [
                    "Rapid incident reporting minimizes dwell time and limits lateral movement during sophisticated cyber attacks.",
                    "Every workforce member is an active sensory node in our defense-in-depth security perimeter.",
                ],
                "table_headers": ["Incident Severity", "Definition & Example", "Reporting SLA"],
                "table_rows": [
                    ["P1 – Critical Incident", "Ransomware, active breach of customer DB", "Immediate notification within 1 hour"],
                    ["P2 – High Incident", "Lost/stolen laptop, credential phishing", "Notification within 2 hours"],
                    ["P3 – Medium / Low", "Suspicious spam, policy non-compliance", "Notification within 24 hours"],
                ],
                "table_col_widths": [140, 200, 164],
                "bullets": [
                    "Suspected Phishing: Click the PhishAlarm button in Google Workspace immediately upon receiving suspicious email.",
                    "Lost Devices: If a corporate laptop or smartphone is lost or stolen, report immediately to security-ops@nexus-corp.internal.",
                    "Simulated Phishing Drills: Security conducts monthly phishing simulations; repeated failures require mandatory retraining.",
                ],
                "callout_note": "No Retaliation for Reporting: Employees who accidentally click a malicious link and promptly report it will NOT face punitive discipline.",
            },
            # Page 6
            {
                "title": "Audit Logs, Monitoring, Compliance & Disciplinary Sanctions",
                "paragraphs": [
                    "Nexus Corporation maintains continuous audit trails across all digital endpoints and cloud tenants.",
                    "Employees should have no expectation of personal privacy when using corporate computers, networks, or accounts.",
                ],
                "table_headers": ["Monitored Asset", "Audit Mechanism", "Retention Period"],
                "table_rows": [
                    ["Corporate Laptops & Desktops", "EDR Telemetry & Process Logs", "Retained for 365 days in SIEM (Splunk)"],
                    ["Corporate Network & VPN", "NetFlow, DNS, and Proxy Logs", "Retained for 180 days"],
                    ["Cloud Infrastructure (AWS/GCP)", "CloudTrail & Access IAM Logs", "Retained for 7 years for SOC2 / ISO27001"],
                ],
                "table_col_widths": [160, 170, 174],
                "bullets": [
                    "All corporate laptop traffic, software installations, and file transfers are subject to automated security logging.",
                    "Violations of security policy will result in progressive discipline up to and including termination of employment.",
                    "Intentional data theft, selling secrets, or deploying malware will be prosecuted to the maximum extent of federal law.",
                ],
                "callout_note": "Annual Security Recertification: All employees must complete the mandatory SOC2/ISO27001 Security Refresher by December 1st.",
            },
        ],
    )

    # =========================================================================
    # 7. PERFORMANCE & CAREER GROWTH POLICY (6 PAGES)
    # =========================================================================
    create_six_page_pdf(
        filename="performance_and_growth_policy.pdf",
        doc_metadata={
            "id": "POL-PERF-2026-V3",
            "title": "Performance Evaluation, Promotion & Career Progression Framework",
            "category": "General Guidelines & Workplace Standards",
            "effective_date": "January 1, 2026",
        },
        pages_data=[
            # Page 1
            {
                "title": "Performance Philosophy & Core Assessment Competencies",
                "paragraphs": [
                    "At Nexus Corporation, performance management is designed to foster professional growth, recognize excellence, and cultivate leadership.",
                    "Our assessment architecture assesses both 'What' you accomplish (business deliverables) and 'How' you accomplish it (cultural alignment).",
                ],
                "table_headers": ["Evaluation Dimension", "Core Focus", "Weighting"],
                "table_rows": [
                    ["Objective Goal Attainment (OKRs)", "Tangible business impact and technical execution", "50% of Overall Rating"],
                    ["Leadership & Values Demonstration", "Collaboration, empathy, mentorship, transparency", "30% of Overall Rating"],
                    ["Continuous Learning & Adaptability", "Mastery of new skills and process modernization", "20% of Overall Rating"],
                ],
                "table_col_widths": [160, 200, 144],
                "bullets": [
                    "Every employee establishes quarterly Objectives & Key Results (OKRs) aligned directly with corporate strategy.",
                    "Managers and team members conduct mandatory bi-weekly 1-on-1 check-ins to track progress and unblock roadblocks.",
                ],
                "callout_note": "Performance is evaluated on sustained demonstrated results over time, avoiding recency bias through continuous documentation.",
            },
            # Page 2
            {
                "title": "Biannual Performance Appraisal & 360-Degree Review Process",
                "paragraphs": [
                    "Formal performance appraisals take place twice per calendar year: Mid-Year Review in June and Year-End Review in December.",
                    "The appraisal incorporates 360-degree feedback from managers, direct reports, and cross-functional peers.",
                ],
                "table_headers": ["Review Component", "Timeline Window", "Participant Responsibility"],
                "table_rows": [
                    ["Self-Evaluation", "June 1-7 & Dec 1-7", "Comprehensive assessment of personal deliverables"],
                    ["Peer Reviews (3 to 5 peers)", "June 8-15 & Dec 8-15", "Objective, constructive cross-functional feedback"],
                    ["Manager Synthesis & Rating", "June 16-22 & Dec 16-22", "Performance score formulation and narrative draft"],
                    ["Calibration Sessions", "June 23-30 & Dec 23-30", "Department-wide score normalization across teams"],
                ],
                "table_col_widths": [140, 140, 224],
                "bullets": [
                    "Peer reviews are required from a minimum of 3 peers who have collaborated closely during the evaluation period.",
                    "Calibration ensures equitable standards across departments so ratings reflect consistent organizational benchmarks.",
                ],
                "callout_note": "Review meetings must be conducted in person or via video conference; delivering formal performance ratings over email is strictly prohibited.",
            },
            # Page 3
            {
                "title": "Performance Rating Scale & Merit Increase Linkage",
                "paragraphs": [
                    "Our five-tier rating taxonomy clearly communicates standing and directly informs compensation adjustments.",
                    "Annual merit increases and equity refresher grants take effect on February 1st following year-end calibrations.",
                ],
                "table_headers": ["Rating Tier", "Performance Definition", "Target Distribution Band"],
                "table_rows": [
                    ["Tier 1: Exceptional Impact", "Consistently surpasses high expectations across all axes", "Top 10% of Workforce"],
                    ["Tier 2: Exceeds Expectations", "Frequently delivers above targets; strong culture champion", "Next 25% of Workforce"],
                    ["Tier 3: Strong Contributor", "Fully meets and delivers on core competencies", "Core 50% of Workforce"],
                    ["Tier 4: Needs Improvement", "Inconsistent deliverables; misses deadlines or quality", "Bottom 10% of Workforce"],
                    ["Tier 5: Unsatisfactory", "Fails to meet basic role requirements; PIP required", "Bottom 5% of Workforce"],
                ],
                "table_col_widths": [140, 210, 154],
                "bullets": [
                    "Merit increases are weighted toward Tier 1 and Tier 2 performers to reward outsized contributions.",
                    "Annual bonus pools are determined by corporate financial achievement multiplied by individual performance multipliers.",
                ],
                "callout_note": "Rating distributions are guidelines to prevent grade inflation; exceptions are reviewed and signed off by the Executive Leadership Team.",
            },
            # Page 4
            {
                "title": "Promotion Criteria, Career Ladders & Leveling Architecture",
                "paragraphs": [
                    "Nexus Corporation maintains transparent career ladders outlining explicit expectations across Individual Contributor (IC) and Manager tracks.",
                    "Promotions are granted based on demonstrated sustained performance at the next leveling band.",
                ],
                "table_headers": ["Career Track", "Level Progression", "Key Milestone Expectation"],
                "table_rows": [
                    ["IC Track (IC1 to IC3)", "Associate to Senior", "Independent execution, technical excellence, project delivery"],
                    ["IC Track (IC4 to IC6)", "Staff to Principal Fellow", "Cross-team architecture, organizational strategy, industry leadership"],
                    ["Management Track (M1 to M4)", "Manager to VP", "Talent development, team velocity, strategic execution, hiring"],
                ],
                "table_col_widths": [150, 150, 204],
                "bullets": [
                    "To be nominated for promotion, an employee must have demonstrated performance at the next level for at least 6 consecutive months.",
                    "Parallel Tracks: The Individual Contributor track reaches parity with Executive Vice President levels without requiring management transition.",
                    "Promotion packages require sponsorship from your Department Director and review by the Promotion Committee.",
                ],
                "callout_note": "Promotions take effect twice annually on February 1st and August 1st following the conclusion of review cycles.",
            },
            # Page 5
            {
                "title": "Performance Improvement Framework (PIP) Guidelines",
                "paragraphs": [
                    "When an employee demonstrates persistent underperformance, a structured Performance Improvement Plan (PIP) is deployed.",
                    "The primary objective of a PIP is to provide clear, actionable coaching to guide the employee back to successful contribution.",
                ],
                "table_headers": ["PIP Milestone", "Timeline Horizon", "Actionable Deliverable"],
                "table_rows": [
                    ["Day 1: Plan Initiation", "Document Sign-off", "Manager, HR, and employee align on SMART metrics"],
                    ["Day 30: First Checkpoint", "Formal Progress Review", "Written evaluation of milestone completion"],
                    ["Day 60: Midpoint Assessment", "Formal Progress Review", "Determination of trajectory and required adjustments"],
                    ["Day 90: Final Determination", "Plan Conclusion", "Successful graduation or transition to separation"],
                ],
                "table_col_widths": [140, 140, 224],
                "bullets": [
                    "Standard PIP duration is 30, 60, or 90 calendar days depending on role complexity and previous coaching history.",
                    "Weekly 1-on-1 coaching meetings between the manager and employee are mandatory throughout the plan.",
                    "People Operations serves as an impartial facilitator to ensure metrics are reasonable, attainable, and clearly defined.",
                ],
                "callout_note": "Successful completion of a PIP permanently resets the employee to good standing; however, re-entering underperformance within 12 months triggers immediate separation.",
            },
            # Page 6
            {
                "title": "Continuous Feedback, Upward Reviews & Professional Coaching",
                "paragraphs": [
                    "Annual reviews should never contain surprises. Ongoing open communication ensures expectations remain synchronized.",
                    "Managers are also evaluated by their team members through confidential Upward Feedback surveys.",
                ],
                "table_headers": ["Feedback Channel", "Frequency", "Impact on Organization"],
                "table_rows": [
                    ["Bi-weekly 1-on-1 Check-ins", "Every 2 Weeks (30-45 mins)", "Continuous coaching, goal unblocking, career growth"],
                    ["Upward Manager Feedback", "Biannually (Anonymous)", "Identifies leadership coaching opportunities"],
                    ["Internal Mentorship Program", "Quarterly Cohorts", "Pairs rising talent with senior engineering & business leaders"],
                ],
                "table_col_widths": [160, 160, 184],
                "bullets": [
                    "Every manager is expected to allocate dedicated time for bi-weekly 1-on-1s without habitual rescheduling.",
                    "Employees may request confidential coaching sessions with our internal Leadership Development team.",
                    "Questions or disputes regarding performance ratings should be directed to your People Partner.",
                ],
                "callout_note": "A culture of candor requires that praise be shared publicly and constructive critique be delivered privately with empathy.",
            },
        ],
    )

    print("\n=======================================================")
    print(" Successfully compiled all 6-page official HR policies!")
    print("=======================================================\n")
    copy_to_all_targets()


def copy_to_all_targets():
    """Copies all generated 6-page PDFs to resources and frontend public asset folders."""
    targets = [RESOURCES_DIR, FRONTEND_POLICIES_DIR, EMP_FRONTEND_POLICIES_DIR]
    for target in targets:
        target.mkdir(parents=True, exist_ok=True)
        for pdf_file in KB_DIR.glob("*.pdf"):
            shutil.copy2(pdf_file, target / pdf_file.name)
        print(f"Copied {len(list(KB_DIR.glob('*.pdf')))} policy PDFs to: {target}")


if __name__ == "__main__":
    generate_all_six_page_policies()
