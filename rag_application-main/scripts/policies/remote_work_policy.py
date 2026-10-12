"""TCS Workplace & Return to Office Policy (TCS-HR-POL-004) dense content module."""
from policies.common import make_article

def get_document():
    sections = [
        make_article(
            "Article 1. Workplace Operating Framework & Return to Office (RTO) Governance",
            "1.1 Mandatory 5-Day Work from Office, 85% Turnstile Attendance & Campus Presence",
            "Tata Consultancy Services (TCS) recognizes that in-person collaboration, physical mentorship, collective problem-solving, "
            "and cross-functional teaming within our delivery campuses form the cornerstone of our organizational culture, associate "
            "professional development, and client delivery assurance. In accordance with executive leadership directives, all associates "
            "are mandated to work full-time (5 days per week) from their designated TCS delivery centres, base branch campuses, or assigned "
            "client delivery locations. Remote work and ad-hoc work from home (WFH) have been formally phased out as regular operating modes.",
            "Associates must maintain a minimum in-office attendance compliance of 85% of working days per calendar month, as registered "
            "by the automated turnstile access badge-in and badge-out telemetry at TCS campus gates and ODC security doors. Monthly turnstile "
            "attendance logs are reconciled electronically on the 1st of each month and transmitted to Delivery Heads (DH) and Unit HR (UHR). "
            "Attendance compliance directly governs eligibility for Quarterly Performance Pay (QPP), variable compensation allocations, annual "
            "merit increments, project bonus disbursements, and career promotion cycles.",
            ["Compliance Parameter", "Mandatory Operating Standard", "Tracking System", "Business Impact"],
            [
                ["In-Office Working Days", "5 Days / Week (Monday to Friday)", "Turnstile Access Gates", "Baseline condition of employment"],
                ["Monthly Turnstile Compliance", "Minimum 85% of Working Days", "Automated Turnstile Telemetry", "Eligibility for QPP & Variable Pay"],
                ["Core Working Shift Hours", "9 Hours / Day (including 1h breaks)", "Timesheet & Turnstile match", "Overtime & shift allowance tracking"],
                ["Ad-Hoc WFH Availability", "Phased Out (Disallowed by default)", "Ultimatix Gate Lockout", "Marked as Unauthorized / LOP if unapproved"],
                ["Annual Promotion Linkage", ">= 85% Annual In-Office Rate", "Talent Review Board", "Mandatory gate for grade progression"],
            ],
            [120, 135, 140, 145],
            [
                "Turnstile attendance records cannot be manually altered or overridden by immediate project managers.",
                "Proxy punching or using another associate's smartcard triggers immediate summary termination under TCoC Clause 4.",
                "Non-compliance with the 85% monthly attendance threshold results in automatic withholding of the associate's quarterly performance pay.",
            ],
            "MANDATORY RETURN TO OFFICE (RTO) ATTENDANCE MANDATE:",
            "Physical campus presence is an essential, non-negotiable term of employment across all TCS delivery units. Associates failing "
            "to report to assigned campuses without approved medical accommodations will be placed on formal administrative leave without pay."
        ),
        make_article(
            "Article 2. Standard Shift Hours, Turnstile Telemetry & Working Time Governance",
            "2.1 9-Hour Workday, 45-Hour Week, Shift Schedules & Core Collaboration Windows",
            "The standard operating schedule for full-time associates is 9 consecutive hours per working day (equivalent to 45 hours per "
            "standard working week), which includes 8 active delivery/working hours and 1 hour of cumulative meal and refreshment breaks. "
            "The standard general shift window operates from 09:00 to 18:00 hours (Monday through Friday). For teams operating across rotational, "
            "staggered, or 24x7 mission-critical client support rosters, shift schedules are defined in accordance with client Master Services "
            "Agreements (MSA) and approved by the Delivery Centre Head (DCH).",
            "To qualify as a full day's attendance, the duration between the associate's first morning turnstile badge-in and last evening "
            "badge-out must reflect a minimum span of 8 hours and 30 minutes on campus. A campus stay between 4.5 hours and 8.5 hours is "
            "classified as half-day attendance. Less than 4.5 hours on campus is marked as Absent / Loss of Pay (LOP) unless regularized "
            "with sanctioned half-day casual or sick leave on Ultimatix. Core collaboration hours (10:00 to 16:30) require mandatory presence.",
            ["Turnstile Stay Duration", "Attendance Classification", "Payroll Impact", "Ultimatix System Action"],
            [
                [">= 8 Hours 30 Minutes", "Full Working Day Present", "100% Full Daily Remuneration", "Standard Present marked"],
                ["4.5 Hours to 8.49 Hours", "Half Working Day Present", "0.5 Day Pay (Requires 0.5 Day Leave)", "Half-day warning alert triggered"],
                ["< 4.5 Hours on Campus", "Classified as Absent", "Loss of Pay (LOP) applied", "Automated Absence notification"],
                ["Shift 1 (Morning: 06:00 - 15:00)", "Rotational Client Rota", "Standard Shift Allowance added", "Shift roster code validation"],
                ["Shift 2 (Afternoon: 14:00 - 23:00)", "Rotational Client Rota", "Night Transport Cab provided", "Drop cab escort security"],
                ["Shift 3 (Night: 22:00 - 07:00)", "Mission Critical 24x7 Rota", "Enhanced Night Shift Allowance", "Mandatory female associate security escorts"],
            ],
            [120, 130, 140, 150],
            [
                "Turnstile records are synchronized nightly with the corporate SAP/Ultimatix payroll engine.",
                "Associates must swipe their own smartcard individually; tailgating through open turnstiles is an explicit security violation.",
                "Night shift transport is provided free of cost to associates working shifts extending beyond 20:00 or starting before 07:00.",
            ],
            "CAMPUS SAFETY & TURNSTILE GATE INTEGRITY:",
            "All physical entries and exits through campus security gates, ODC doors, and turnstiles must be logged via smartcard. Turnstile "
            "discrepancies must be reconciled within 48 hours via Ultimatix Attendance Regularization with managerial concurrence."
        ),
        make_article(
            "Article 3. Secure Borderless Workspaces (SBWS) Protocol & ODC Security Controls",
            "3.1 Zero-Trust Endpoint Architecture, ODC Clean Floor Policy & Device Governance",
            "The TCS Secure Borderless Workspaces (SBWS) framework governs all enterprise computing infrastructure across on-premise "
            "workstations, corporate laptops, virtual desktop environments (VDI), and cloud workstations. All corporate endpoints are locked "
            "down with centralized endpoint security agents—including Palo Alto GlobalProtect VPN, Symantec/Trellix Data Loss Prevention (DLP), "
            "CrowdStrike Falcon EDR, and strict device control policies. The use of unauthorized personal laptops, BYOD devices, external "
            "USB mass storage devices, personal hard drives, and mobile hotspot tethering is strictly prohibited.",
            "Within designated Offshore Development Centres (ODCs) and Dedicated Client Facilities (DCFs), associates must adhere strictly "
            "to the ODC Clean Floor Mandate. Mobile phones, personal cameras, audio recording devices, USB drives, smart watches with cellular "
            "data, and personal storage media must be deposited in secure external locker facilities prior to entering the ODC. Any attempt "
            "to photograph computer monitors, extract customer source code, or capture client proprietary data triggers immediate turnstile "
            "gate pass revocation and summary dismissal under TCoC Clause 5.",
            ["Security Domain", "Mandatory SBWS Protocol", "Monitoring Technology", "Enforcement Consequence"],
            [
                ["Endpoint USB Ports", "Hardware Disablement / Blocked", "Symantec / Trellix DLP", "Port disabled; alert sent to GSOC"],
                ["ODC Physical Floor", "Clean Floor (No mobiles / cameras)", "CCTV & Security Frisking", "Locker storage mandatory"],
                ["Network Access", "Corporate Wired LAN / Secured Wi-Fi", "802.1X Enterprise Certificate", "Rogue networks blocked"],
                ["Screen Inactivity", "Automatic Lock after 3 Minutes", "Group Policy Enforcement", "Screen lock (Win+L / Ctrl+Cmd+Q)"],
                ["Data Exfiltration", "Strictly Blocked across all channels", "DLP Cloud Shadow Monitoring", "Immediate security investigation"],
            ],
            [110, 145, 140, 145],
            [
                "Associates must never leave active sessions unlocked or unattended; screens must be locked whenever stepping away from desks.",
                "Customer proprietary IP must never be forwarded to personal email addresses or hosted on unapproved personal cloud drives.",
                "Physical security guards conduct random spot-checks at ODC turnstiles to verify compliance with the Clean Floor policy.",
            ],
            "ODC INTEGRITY & ZERO DATA LEAKAGE MANDATE:",
            "Customer trust is paramount. Bypassing ODC physical controls, bringing mobile recording devices onto the delivery floor, or "
            "attempting unauthorized code exfiltration constitutes criminal breach of trust and results in immediate legal prosecution."
        ),
        make_article(
            "Article 4. Temporary Medical Accommodations & Exceptional Telecommuting Approval",
            "4.1 Exceptional WFH Eligibility, Approval Matrix & Strict Time-Bound Limits",
            "In strictly defined circumstances where an associate suffers from acute temporary physical immobility (e.g., severe orthopedic "
            "fractures, major post-operative convalescence, high-risk pregnancy complications certified by an obstetrician, or contagious "
            "infections requiring medical isolation), a temporary, time-bound telecommuting exception may be requested. Exceptional WFH is "
            "not an entitlement and is granted solely upon formal medical validation and project delivery viability.",
            "Temporary WFH requests must be submitted through Ultimatix with supporting medical documentation from a Registered Medical "
            "Practitioner (RMP). Approval requires the dual concurrence of the Delivery Centre Head (DCH) and the Unit HR Head (UHR). "
            "The maximum duration for any single medical telecommuting approval is 15 consecutive working days. Extensions beyond 15 days "
            "require formal case review by the TCS Occupational Health Centre (OHC) Medical Board and Delivery Head (DH) signoff. In no "
            "circumstances may temporary WFH exceed 60 calendar days within a rolling 12-month period.",
            ["Medical / Accommodation Scenario", "Maximum WFH Span Allowed", "Required Medical Documentation", "Approval Authority"],
            [
                ["Acute Orthopedic Immobility", "Up to 15 Working Days", "Orthopedic Surgeon Hospital Certificate", "DCH & Unit HR Head"],
                ["High-Risk Pregnancy Bedrest", "Up to 30 Working Days", "Gynecologist Ultrasound & Clinical Report", "OHC Medical Board & DCH"],
                ["Severe Post-Operative Recovery", "Up to 15 Working Days", "Hospital Discharge Summary & Treatment Plan", "DCH & Unit HR Head"],
                ["Contagious Medical Quarantine", "Up to 7 Working Days", "OHC Certified Infectious Isolation Notice", "OHC Medical Officer"],
                ["Convenience / Commute Reasons", "Zero (Strictly Prohibited)", "Not Applicable (Inadmissible)", "Auto-rejected by Ultimatix"],
            ],
            [130, 120, 150, 140],
            [
                "Associates on approved temporary WFH must remain accessible via Microsoft Teams throughout standard core working hours.",
                "Working remotely from public cafes, hotel lobbies, unencrypted co-working spaces, or shared public Wi-Fi is strictly banned.",
                "Attendance during approved temporary medical WFH is mapped with full system telemetry and JIRA/timesheet deliverables.",
            ],
            "EXCEPTIONAL MEDICAL GOVERNANCE PROTOCOL:",
            "Requests citing commute distance, traffic congestion, personal convenience, or domestic routine are strictly ineligible for WFH. "
            "Such requests are automatically rejected by the Ultimatix workflow engine without supervisory review."
        ),
        make_article(
            "Article 5. Prohibition of International Remote Work & Data Sovereignty Mandate",
            "5.1 Cross-Border Telecommuting Ban, Tax Nexus Risk & Data Residency Legislation",
            "Associates are strictly prohibited from performing TCS or client professional duties from any foreign country or international "
            "jurisdiction outside their contracted employment location without formal overseas deputation (Global Deputation - GD). "
            "Work from Anywhere (WFA) abroad or unauthorized international telecommuting constitutes an illegal violation of international "
            "tax laws, creates permanent corporate establishment (PE) tax liabilities for TCS, and breaches client contractual data residency.",
            "Client Master Services Agreements (MSA) and international data privacy statutes—including the EU General Data Protection Regulation "
            "(GDPR), US HIPAA, and international export control regimes—strictly prohibit accessing customer production systems, source code "
            "repositories, or personally identifiable information (PII) from unapproved international IP addresses. Any associate found "
            "connecting to TCS networks or client systems via foreign IP addresses triggers automatic GlobalProtect VPN network blacklisting "
            "and immediate termination for cause under TCoC Clause 1.",
            ["Risk Category", "Statutory & Regulatory Driver", "TCS Policy Prohibition", "Corporate Liability"],
            [
                ["Corporate Tax Nexus", "International Permanent Establishment (PE)", "Absolute ban on foreign telecommuting", "Multi-million dollar corporate tax fines"],
                ["Data Sovereignty", "GDPR Art 44-50 / HIPAA / CCPA", "No unauthorized international data transit", "Severe regulatory penalties & MSA loss"],
                ["Immigration Compliance", "Foreign Tourist / Non-immigrant Visas", "Working on tourist visa strictly illegal", "Deportation & blacklisting by consulates"],
                ["Client Contractual Breach", "MSA Dedicated Delivery Location Clause", "Breach of ODC exclusivity covenants", "Contract termination & client damages"],
            ],
            [120, 140, 140, 140],
            [
                "Connecting to TCS corporate VPN from international foreign locations without approved GD letter triggers immediate GSOC alert.",
                "Associates traveling abroad for personal vacations must leave corporate laptops and hardware in secure custody at their base branch.",
                "Any associate traveling internationally with corporate assets without written Overseas Transit Authorization will be intercepted.",
            ],
            "DATA SOVEREIGNTY & EXPORT CONTROL ENFORCEMENT:",
            "Unauthorized international remote work places TCS and our enterprise clients in severe legal jeopardy under foreign tax and "
            "export control authorities. Violators face immediate summary dismissal, financial restitution, and legal referral."
        ),
        make_article(
            "Article 6. Workplace Ergonomics, Occupational Health & OHC Facility Standards",
            "6.1 Ergonomic Standards, OHC Campus Facilities & Health Risk Mitigation",
            "TCS is committed to maintaining world-class workplace ergonomics, health safety, and wellness infrastructure across all campuses. "
            "All delivery centres provide height-adjustable pneumatic task chairs, dual-monitor workstations with ergonomic viewing angles, "
            "anti-glare ambient lighting, central HVAC climate control with HEPA filtration, and designated ergonomic collaboration pods.",
            "Every major TCS campus features a fully staffed 24x7 Occupational Health Centre (OHC) with qualified medical doctors, nursing "
            "staff, emergency ICU ambulances, basic life support (BLS) equipment, and tie-ups with leading multi-speciality tertiary hospitals "
            "within a 5-kilometer radius. Associates experiencing physical discomfort, repetitive strain injury (RSI), or occupational stress "
            "may avail ergonomic posture assessments and preventive physiotherapy sessions at the OHC free of cost.",
            ["OHC Healthcare Service", "Campus Availability", "Operating Standard", "Emergency Protocols"],
            [
                ["General Medical Consultation", "24x7 across all major campuses", "Qualified MBBS Medical Officers", "Walk-in & scheduled appointment"],
                ["Emergency ICU Ambulance", "Dedicated on-campus vehicle", "Paramedic & oxygen support equipped", "Instant transit to tertiary hospital"],
                ["Ergonomic Posture Clinic", "Weekly specialist sessions", "Physiotherapist evaluation", "Workstation adjustments recommended"],
                ["Annual Health Check-Up", "Annual drive for all associates", "Comprehensive pathology & vitals", "Free under TCS-HIS wellness banner"],
                ["Fit4Life Fitness Facilities", "On-campus gymnasiums", "Certified fitness instructors", "Cardio, weights & yoga facilities"],
            ],
            [120, 130, 145, 145],
            [
                "Emergency response alarms and medical call buttons are installed across all delivery floors and ODCs.",
                "Associates are encouraged to take brief 5-minute eye relaxation breaks every 60 minutes of intensive monitor work.",
                "Campus cafeterias are audited monthly by food safety inspectors to ensure absolute nutritional quality and hygiene.",
            ],
            "FIT4LIFE ASSOCIATE WELLNESS INITIATIVE:",
            "TCS Fit4Life fosters a culture of fitness and preventive wellness. Associates are encouraged to participate in annual marathon "
            "events, corporate step challenges, and campus wellness sports leagues to promote active lifestyle habits."
        )
    ]

    return {
        "filename": "remote_work_policy.pdf",
        "meta": {
            "id": "TCS-HR-POL-004",
            "title": "TCS Workplace & Return to Office (RTO) Operating Framework",
            "category": "Workplace Management | Delivery Operations",
            "eff_date": "January 1, 2026",
        },
        "sections": sections
    }
