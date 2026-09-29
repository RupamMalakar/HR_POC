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
    KeepTogether,
)
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import shutil

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
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header line & label (pages > 1)
        if self._pageNumber > 1:
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 742, 612 - 54, 742)
            self.drawString(54, 748, "NEXUS ENTERPRISE HR POLICY REPOSITORY  |  CONFIDENTIAL & PROPRIETARY")

        # Footer line & text
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 50, 612 - 54, 50)

        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 38, footer_text)
        self.drawString(54, 38, "HR Operations & Compliance  •  Official Standard Operating Procedure")
        self.restoreState()


def build_pdf_document(
    filename: str,
    title: str,
    doc_id: str,
    category: str,
    effective_date: str,
    sections: list[dict],
) -> Path:
    """Builds a polished corporate HR Policy PDF document."""
    output_path = KB_DIR / filename

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=60,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
        alignment=0,
        spaceAfter=4,
    )
    meta_style = ParagraphStyle(
        "DocMeta",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0D9488"),
    )
    meta_val_style = ParagraphStyle(
        "DocMetaVal",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#475569"),
    )
    heading_style = ParagraphStyle(
        "DocHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )
    body_style = ParagraphStyle(
        "DocBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=7,
    )
    bullet_style = ParagraphStyle(
        "DocBullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4,
    )
    callout_style = ParagraphStyle(
        "DocCallout",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0F766E"),
    )

    story = []

    # Title & Metadata Card
    story.append(Paragraph(f"<b>NEXUS HR COMPLIANCE REPOSITORY</b> &bull; {doc_id}", meta_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 6))

    # Meta banner table
    meta_data = [
        [
            Paragraph("<b>CATEGORY</b>", meta_style),
            Paragraph(category, meta_val_style),
            Paragraph("<b>EFFECTIVE DATE</b>", meta_style),
            Paragraph(effective_date, meta_val_style),
            Paragraph("<b>REVIEW CYCLE</b>", meta_style),
            Paragraph("Annual / Q4", meta_val_style),
        ]
    ]
    meta_table = Table(meta_data, colWidths=[65, 105, 85, 95, 80, 74])
    meta_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ])
    )
    story.append(meta_table)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0D9488"), spaceAfter=10))

    # Content Sections
    for section_idx, sec in enumerate(sections):
        if sec.get("page_break_before", False):
            story.append(PageBreak())

        heading_text = f"Article {section_idx + 1}. {sec['title']}"
        story.append(Paragraph(heading_text, heading_style))

        # Content blocks
        for block in sec.get("paragraphs", []):
            if block.startswith("• ") or block.startswith("- "):
                clean_bullet = f"&bull;  {block[2:]}"
                story.append(Paragraph(clean_bullet, bullet_style))
            elif block.startswith("> "):
                # Callout note
                callout_data = [[Paragraph(f"<b>NOTE / REQUIREMENT:</b> {block[2:]}", callout_style)]]
                callout_table = Table(callout_data, colWidths=[504])
                callout_table.setStyle(
                    TableStyle([
                        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0FDFA")),
                        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#14B8A6")),
                        ("TOPPADDING", (0, 0), (-1, -1), 6),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                        ("LEFTPADDING", (0, 0), (-1, -1), 10),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ])
                )
                story.append(Spacer(1, 3))
                story.append(callout_table)
                story.append(Spacer(1, 5))
            else:
                story.append(Paragraph(block, body_style))

        story.append(Spacer(1, 6))

    doc.build(story, canvasmaker=NumberedCanvas)
    return output_path


def copy_to_frontends():
    """Copies generated PDFs to resources and frontend public assets so employees can view and download them."""
    for target_dir in [RESOURCES_DIR, FRONTEND_POLICIES_DIR, EMP_FRONTEND_POLICIES_DIR]:
        target_dir.mkdir(parents=True, exist_ok=True)
        for pdf_file in KB_DIR.glob("*.pdf"):
            shutil.copy2(pdf_file, target_dir / pdf_file.name)
    print(f"Copied policy PDFs to:\n - {RESOURCES_DIR}\n - {FRONTEND_POLICIES_DIR}\n - {EMP_FRONTEND_POLICIES_DIR}")


def generate_all():
    KB_DIR.mkdir(parents=True, exist_ok=True)
    print("Generating official HR Policy documents in knowledge_base/...")

    # 1. Employee Handbook
    build_pdf_document(
        filename="employee_handbook.pdf",
        title="Comprehensive Employee Handbook & Code of Conduct",
        doc_id="POL-HBK-2026-V3",
        category="General Guidelines & Workplace Standards",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "Welcome, Culture & Core Values",
                "paragraphs": [
                    "Nexus Corporation fosters an environment grounded in relentless customer focus, radical transparency, accountability, and psychological safety. All employees, contractors, and executives are expected to conduct themselves with the highest degree of integrity and professional excellence.",
                    "We are unequivocally committed to maintaining a diverse, inclusive, and harassment-free workplace. Any forms of verbal, visual, physical, or sexual discrimination or harassment are met with immediate zero tolerance, triggering rapid investigation and potential summary dismissal.",
                ],
            },
            {
                "title": "Working Hours, Core Collaboration & Time Tracking",
                "paragraphs": [
                    "The standard work week comprises 40 hours for full-time regular personnel, scheduled across Monday through Friday.",
                    "Core collaboration hours are established from 10:00 AM to 4:00 PM local time across our respective operational time zones. Employees must remain reachable via corporate Slack and email during core hours.",
                    "• Overtime and on-call rotations must be scheduled transparently and shared equitably among eligible team members.",
                    "• Non-exempt employees are entitled to 1.5x hourly overtime compensation for hours logged in excess of 40 weekly hours, requiring advance supervisor pre-authorization.",
                ],
            },
            {
                "title": "Remote Working Abroad & Extended Sabbaticals",
                "paragraphs": [
                    "Employees in good standing may work remotely abroad from an approved international jurisdiction for up to 20 business days per calendar year.",
                    "> Employees may work remotely abroad for up to 20 days annually upon manager and HR compliance sign-off. Compliance review guarantees tax residency safeguards and data export sovereignty.",
                    "• Applications must be submitted through the Employee Portal at least 30 calendar days before the anticipated departure date.",
                    "• High-risk travel destinations or countries under strict trade sanctions are ineligible for international remote work.",
                    "• Sabbaticals without pay may be granted for educational, personal, or public service purposes for up to 90 calendar days following 24 months of continuous service.",
                ],
            },
            {
                "title": "Professional Development & Educational Stipends",
                "paragraphs": [
                    "To support continuous mastery, each full-time employee receives an annual learning and development budget of $1,200.",
                    "• Reimbursable categories include industry conferences, accredited technical certifications, college coursework, and professional books or software subscriptions.",
                    "• Invoices and completion certificates must be submitted within 30 days of course completion via the expense workflow.",
                ],
            },
            {
                "title": "Conflict Resolution, Grievances & Ethics Hotline",
                "paragraphs": [
                    "Workplace disagreements should initially be addressed collaboratively between involved colleagues and their immediate manager.",
                    "If a conflict involves supervisory misconduct, retaliation, or illegal activity, employees are instructed to escalate directly to People Operations or report securely through the 24/7 Anonymous Ethics Hotline (ethics@nexus-corp.internal or 1-800-555-0199). Retaliation against whistleblowers is strictly prohibited by federal and corporate statute.",
                ],
            },
        ],
    )

    # 2. Leave Policy
    build_pdf_document(
        filename="leave_policy.pdf",
        title="Company Leave, PTO & Absence Management Policy",
        doc_id="POL-LEV-2026-V4",
        category="Leave & Time Off",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "Annual Paid Time Off (PTO) Entitlement & Accrual",
                "paragraphs": [
                    "Full-time permanent team members accrue 20 business days of paid annual vacation (PTO) per calendar year. Part-time employees receive pro-rated leave proportional to contracted weekly hours.",
                    "• Leave accrues on the final calendar day of each month at a rate of 1.67 business days per completed month of active service.",
                    "• Employees may carry forward up to 5 unused PTO days into the following calendar year, which must be utilized prior to March 31 (end of Q1). Any carryover days beyond 5 are forfeited without financial compensation.",
                    "• Planned leave of 3 or more consecutive business days must be requested through the Employee Portal at least 14 days in advance.",
                ],
            },
            {
                "title": "Sick Leave, Medical Documentation & Health Absences",
                "paragraphs": [
                    "Employees are allotted 10 fully paid sick days per calendar year, granted upfront on January 1st.",
                    "> Medical absence exceeding 3 consecutive working days requires a certified medical practitioner notice submitted directly to People Operations upon return to duty.",
                    "• Sick leave encompasses personal medical recovery, preventive healthcare appointments, and caring for an immediate family member experiencing acute illness.",
                    "• Chronic medical conditions requiring recurrent intermittent leave are accommodated in compliance with applicable statutory disability frameworks.",
                ],
            },
            {
                "title": "Parental & Primary Caregiver Leave",
                "paragraphs": [
                    "Nexus Corporation champions work-life integration for expanding families through comprehensive paid parental coverage.",
                    "• Primary Caregivers: Entitled to 16 weeks of 100% paid leave following the birth, adoption, or foster placement of a child.",
                    "• Secondary Caregivers: Entitled to 6 weeks of 100% paid parental leave.",
                    "• Eligibility begins upon completion of 180 consecutive days (6 months) of full-time employment prior to the anticipated qualifying event.",
                    "• Parental leave must be taken within the first 12 months following birth or legal adoption.",
                ],
            },
            {
                "title": "Bereavement, Civic Duty & Floating Holidays",
                "paragraphs": [
                    "• Bereavement Leave: Up to 5 consecutive paid days off following the death of an immediate family member (spouse, child, sibling, parent). Extended relatives qualify for 2 paid business days.",
                    "• Jury Duty & Civic Participation: Full base salary continuation for up to 10 working days of mandated jury or court witness summons.",
                    "• Floating Holidays: In addition to statutory public holidays, all staff receive 2 paid floating cultural holidays per year to observe personal religious or cultural traditions.",
                ],
            },
        ],
    )

    # 3. Benefits Guide
    build_pdf_document(
        filename="benefits_guide.pdf",
        title="Comprehensive Employee Health, Welfare & Retirement Benefits Guide",
        doc_id="POL-BEN-2026-V2",
        category="Benefits & Wellness",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "Medical, Dental & Vision Insurance Coverage",
                "paragraphs": [
                    "Full-time employees and their eligible legal dependents (spouses, domestic partners, and children up to age 26) are eligible for group healthcare benefits commencing on the first day of the calendar month following date of hire.",
                    "• Medical Plans: Choose between the Comprehensive PPO ($500 deductible, in-network preventative covered 100%) and High Deductible Health Plan with HSA (HDHP/HSA).",
                    "• Dental: Covers preventative exams and cleanings at 100%, basic restorative procedures at 80%, and major dental/orthodontia up to an annual maximum of $2,500.",
                    "• Vision: Annual comprehensive eye exam covered with $10 co-pay, with $200 annual hardware allowance for prescription frames or contacts.",
                ],
            },
            {
                "title": "Tax-Advantaged Accounts (HSA, FSA, DCFSA)",
                "paragraphs": [
                    "• Health Savings Account (HSA): For HDHP enrollees, the company contributes an annual seed of $750 for individual coverage or $1,500 for family plans.",
                    "• Flexible Spending Account (Healthcare FSA): Pre-tax deduction up to statutory limits for eligible out-of-pocket medical co-pays, dental, and prescription expenses.",
                    "• Dependent Care FSA (DCFSA): Pre-tax payroll deductions up to $5,000 annually for licensed daycare, preschool, and elder care costs.",
                ],
            },
            {
                "title": "Retirement Savings Plan: 401(k) Matching",
                "paragraphs": [
                    "Employees are eligible to participate in the company 401(k) retirement plan through Fidelity immediately upon hire.",
                    "> The company provides an immediate 100% employer matching contribution on employee salary deferrals up to 4% of eligible base salary. Employer matching funds vest immediately at 100%.",
                    "• Both Traditional pre-tax 401(k) and Roth post-tax 401(k) contribution elections are supported.",
                    "• Automatic enrollment initiates at 3% salary contribution upon 30 days of employment unless an alternate percentage or opt-out is elected.",
                ],
            },
            {
                "title": "Mental Health, Wellness Stipends & Employee Assistance (EAP)",
                "paragraphs": [
                    "• Employee Assistance Program (EAP): Provides 24/7 confidential counseling and crisis support, including up to 8 free clinical therapy sessions per issue per year via Modern Health.",
                    "• Monthly Wellness Reimbursement: Employees can claim up to $75 per month toward gym memberships, yoga studios, mental health apps (Headspace, Calm), or ergonomic fitness equipment.",
                    "• Life & Disability Insurance: Company-sponsored group term life insurance (2x annual salary) and long-term disability (60% salary replacement) provided at zero employee premium cost.",
                ],
            },
        ],
    )

    # 4. Remote Work Policy
    build_pdf_document(
        filename="remote_work_policy.pdf",
        title="Remote and Hybrid Work Operational Policy",
        doc_id="POL-REM-2026-V3",
        category="Workplace & IT",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "Hybrid Work Model & Attendance Cadence",
                "paragraphs": [
                    "Nexus Corporation operates under a flexible hybrid working framework. Eligible personnel whose roles do not require persistent on-site hardware access may work remotely up to 3 days per week.",
                    "• Mandatory Collaboration Days: Tuesdays and Thursdays are designated as mandatory in-office collaboration days for all personnel residing within 50 miles of a regional office.",
                    "• Fully Remote Arrangements: Employees situated outside commuting radius of an office must hold an approved Fully Remote Designation approved by their Vice President and Head of People.",
                    "• Core synchronous business hours are 10:00 AM to 4:00 PM local time. Remote employees must be accessible on Slack and respond to urgent pings within 60 minutes.",
                ],
            },
            {
                "title": "Home Office Ergonomic Stipend & Internet Allowance",
                "paragraphs": [
                    "Upon completion of the 90-day introductory probationary period, full-time hybrid and remote personnel are entitled to financial work-from-home infrastructure subsidies:",
                    "• Home Office Setup Stipend: One-time allowance up to $500 for ergonomic office furniture, external 4K displays, mechanical keyboards, mice, or standing desks.",
                    "• High-Speed Internet Allowance: Monthly recurring stipend of $50 disbursed directly through payroll to subsidize high-speed residential fiber/broadband connectivity.",
                    "• Expense reimbursement requests accompanied by itemized vendor receipts must be filed via the portal within 45 days of transaction date.",
                ],
            },
            {
                "title": "Information Security, VPN & Data Protection",
                "paragraphs": [
                    "> Remote employees must always connect through the corporate GlobalProtect VPN when accessing internal services, staging environments, databases, or production repositories.",
                    "• Workstations must be configured with full-disk BitLocker/FileVault encryption and CrowdStrike Falcon EDR endpoint protection.",
                    "• Unsecured public Wi-Fi networks (coffee shops, airport terminals) are strictly forbidden unless tethered via cellular hotspot or protected by encrypted corporate tunnel.",
                    "• Screens must be locked automatically after 5 minutes of inactivity.",
                ],
            },
        ],
    )

    # 5. Travel & Expense Policy
    build_pdf_document(
        filename="travel_expense_policy.pdf",
        title="Corporate Business Travel, Lodging & Expense Reimbursement Policy",
        doc_id="POL-TRV-2026-V3",
        category="Payroll & Expense Management",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "Travel Authorization & Advance Approval Workflow",
                "paragraphs": [
                    "All business travel requiring corporate expenditure must secure written authorization prior to ticket reservation or deposit commitment.",
                    "• Domestic Travel: Requires approval from the direct Department Head at least 14 days in advance of departure.",
                    "• International Travel: Requires Vice President (VP) and Finance Director pre-approval at least 30 calendar days in advance.",
                    "• Booking System: All commercial flights, rail, rental cars, and hotel reservations must be processed through Navan (corporate travel platform) to leverage negotiated rate schedules.",
                ],
            },
            {
                "title": "Commercial Air & Rail Travel Standards",
                "paragraphs": [
                    "• Standard Economy Class is the mandatory booking tier for domestic and short-haul international flights under 6 hours duration.",
                    "• Business Class booking is authorized strictly for continuous long-haul flight segments exceeding 6 hours in uninterrupted duration.",
                    "• Airline seat upgrades (e.g., extra legroom, preferred boarding) are reimbursable only when total airfare remains below standard economy ceiling.",
                ],
            },
            {
                "title": "Hotel Accommodations & Nightly Rate Limits",
                "paragraphs": [
                    "• Standard Tier Cities: Maximum reimbursable nightly rate is $200 per night (exclusive of mandatory municipal room taxes).",
                    "• Tier 1 High-Cost Metro Areas: For travel in New York City, San Francisco, London, Zurich, Tokyo, and Singapore, the nightly cap is elevated to $320.",
                    "• Airbnb / Short-term Rentals: Allowed when total cost is demonstrably equal to or lower than corporate hotel options and complies with corporate safety standards.",
                ],
            },
            {
                "title": "Daily Per Diem Meals & Client Entertainment Caps",
                "paragraphs": [
                    "• Daily Meal Per Diem: Fixed daily allowance of $75 per day for overnight business travel ($15 Breakfast, $25 Lunch, $35 Dinner).",
                    "> Itemized merchant receipts are strictly mandatory for any individual meal, rideshare, or incidental expense exceeding $25.",
                    "• Client Entertainment Dining: Reimbursable up to $100 per attendee including tax and gratuity (maximum 20% tip). Expense claims must itemize attendee names, job titles, and commercial business purpose.",
                ],
            },
            {
                "title": "Expense Submission Deadlines & Prohibited Charges",
                "paragraphs": [
                    "• Expense Submission Window: Expense reports must be submitted through the portal within 30 calendar days from the incurrence date.",
                    "> Expense reports submitted past 60 days will be rejected automatically and will not be reimbursed by Accounts Payable.",
                    "• Non-Reimbursable Expenses: Traffic/parking violations, airline lounge memberships, personal mini-bar items, personal streaming subscriptions, and companion travel expenses.",
                ],
            },
        ],
    )

    # 6. Expense Policy (Legacy Alias / Dedicated)
    build_pdf_document(
        filename="expense_policy.pdf",
        title="Corporate Expenditure & Employee Reimbursement Policy",
        doc_id="POL-EXP-2026-V2",
        category="Payroll & Tax",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "General Principles of Corporate Spending",
                "paragraphs": [
                    "Every expenditure incurred on behalf of Nexus Corporation must be legitimate, reasonable, directly related to corporate operational objectives, and documented with verifiable invoices.",
                    "Employees are stewards of corporate capital and must exercise prudent fiscal judgement when incurring reimbursable costs.",
                ],
            },
            {
                "title": "Client Entertainment, Team Events & Alcohol Policy",
                "paragraphs": [
                    "• Client Business Meals: Maximum allowance of $100 per participant including tax and gratuity.",
                    "• Alcohol: Eligible for reimbursement only during bona fide client entertainment dinners or quarterly company-sponsored milestone celebrations.",
                    "• Team Offsites: Requires advance budget sign-off from Finance and People Operations.",
                ],
            },
            {
                "title": "Corporate Credit Cards & Monthly Reconciliation",
                "paragraphs": [
                    "Corporate credit card holders must reconcile all transactions monthly within 10 business days of statement generation.",
                    "Inadvertent personal charges incurred on corporate credit lines must be flagged immediately and refunded to the company via direct payroll deduction or bank wire.",
                ],
            },
        ],
    )

    # 7. Travel Policy (Dedicated Alias)
    build_pdf_document(
        filename="travel_policy.pdf",
        title="Corporate Travel Guidelines & Duty of Care Standards",
        doc_id="POL-TRV-2026-V2",
        category="Workplace & IT",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "Travel Approvals & Duty of Care",
                "paragraphs": [
                    "Nexus Corporation maintains a high standard of duty of care for traveling workforce members. All travel itinerary details must be recorded in Navan for emergency localization.",
                    "• Domestic authorization: Department Head at least 14 days prior.",
                    "• International authorization: VP approval 30 days prior with international travel health insurance registration.",
                ],
            },
            {
                "title": "Transport & Accommodation Standards",
                "paragraphs": [
                    "• Economy airfare for flights under 6 hours; business class for continuous segments >6 hours.",
                    "• Hotel caps: $200/night for standard cities, $320/night for designated Tier 1 high-cost destinations.",
                    "• Ground transportation: Standard rideshare (Uber/Lyft) or public transit. Premium luxury transport (Uber Black) is non-reimbursable.",
                ],
            },
        ],
    )

    # 8. Security Policy
    build_pdf_document(
        filename="security_policy.pdf",
        title="Information Security, Data Protection & Acceptable Use Policy",
        doc_id="POL-SEC-2026-V4",
        category="Workplace & IT",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "Identity, Password Governance & Multi-Factor Authentication",
                "paragraphs": [
                    "Corporate access credentials are the front-line shield against unauthorized network intrusion and intellectual property compromise.",
                    "> Passwords must be at least 14 characters long and incorporate uppercase, lowercase, numeric, and symbol characters (!@#$%^&*). Passwords expire automatically every 90 days.",
                    "• Passwords must not repeat any of the previous 6 historical passwords.",
                    "• Multi-Factor Authentication (MFA) via company-provisioned hardware tokens (YubiKey) or Okta Verify push notifications is strictly mandatory across all Single Sign-On (SSO) systems. SMS-based 2FA is prohibited due to SIM-swapping vulnerabilities.",
                ],
            },
            {
                "title": "Workstation Security & Clean Desk Standard",
                "paragraphs": [
                    "Employees must lock their screens whenever stepping away from their workstation (Windows: Win + L; macOS: Ctrl + Cmd + Q).",
                    "• Unattended physical notebooks, customer records, and access badges must be stowed in locked cabinetry at the conclusion of the workday.",
                    "• Sensitive documents must be destroyed via locked shredding bins located on each corporate floor.",
                ],
            },
            {
                "title": "Removable Media & External Storage Prohibition",
                "paragraphs": [
                    "> Inserting unauthorized USB thumb drives, external unencrypted hard disks, or personal peripherals into corporate laptops is strictly prohibited.",
                    "• All data exchange must occur over encrypted cloud repositories (Google Drive Enterprise, GitHub Enterprise, or AWS S3 buckets).",
                    "• Security incidents and suspected phishing emails must be reported immediately via the PhishAlarm button or by emailing security-ops@nexus-corp.internal.",
                ],
            },
        ],
    )

    # 9. Performance & Career Growth Policy
    build_pdf_document(
        filename="performance_and_growth_policy.pdf",
        title="Performance Evaluation, Promotion & Career Progression Framework",
        doc_id="POL-PERF-2026-V1",
        category="General Guidelines & Workplace Standards",
        effective_date="January 1, 2026",
        sections=[
            {
                "title": "Biannual Performance Review Cycles",
                "paragraphs": [
                    "Nexus Corporation conducts formal 360-degree performance appraisals twice per calendar year: Mid-Year Review in June and Year-End Review in December.",
                    "Evaluations encompass self-assessment, peer feedback from a minimum of 3 cross-functional teammates, direct report evaluations for managers, and direct supervisor assessment.",
                    "• Merit-based compensation increments, stock grants, and promotional elevations take effect annually on February 1st following the year-end appraisal.",
                ],
            },
            {
                "title": "Performance Improvement Framework (PIP)",
                "paragraphs": [
                    "When an employee demonstrates persistent underperformance relative to their job tier expectations, a structured Performance Improvement Plan (PIP) may be initiated.",
                    "• Duration: Standard PIP timeline is 30, 60, or 90 days depending on role complexity.",
                    "• Specific, measurable milestones (SMART goals) are defined collaboratively between the direct manager and People Operations.",
                    "• Failure to satisfy documented criteria by conclusion of the PIP period will result in formal separation.",
                ],
            },
        ],
    )

    print("\nSuccessfully compiled 9 official HR policy PDFs in knowledge_base/!")
    copy_to_frontends()


if __name__ == "__main__":
    generate_all()
