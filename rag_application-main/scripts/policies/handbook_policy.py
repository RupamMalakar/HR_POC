"""TCS Associate Handbook & Tata Code of Conduct (TCS-HR-POL-002) dense content module."""
from policies.common import make_article

def get_document():
    sections = [
        make_article(
            "Article 1. Tata Heritage, Core Values & Tata Code of Conduct (TCoC) Foundation",
            "1.1 Tata Values, Ethical Leadership & Binding Universal Code of Conduct",
            "Founded on the enduring legacy of Jamsetji Tata, Tata Consultancy Services (TCS) operates with an unwavering dedication "
            "to business ethics, institutional integrity, community welfare, and pioneering innovation. Our corporate culture is anchored "
            "in the five Core Tata Values: Integrity (fair, honest, and transparent dealings); Responsibility (integrating environmental "
            "and societal stewardship); Excellence (delivering the highest quality standards); Pioneering (courageous innovation); and "
            "Unity (collaborative strength across diverse global communities).",
            "The Tata Code of Conduct (TCoC) is the supreme ethical and operational charter governing all Tata Group enterprises. Every "
            "associate, consultant, and contractor across global operations is bound by the TCoC upon acceptance of employment. Compliance "
            "with the Code is non-negotiable; commercial expediency, revenue pressures, delivery milestones, or client demands can never "
            "justify a compromise on ethical principles. Associates must complete the mandatory annual TCoC certification on iEvolve.",
            ["Core Tata Value", "Operational Meaning in Daily Work", "Compliance Expectation", "Leadership Metric"],
            [
                ["Integrity", "Absolute honesty, truthfulness, and ethical transparency", "Zero compromise on ethics for delivery", "Reputational Standing"],
                ["Responsibility", "Commitment to associates, communities & environment", "Active participation in Maitree initiatives", "Social Contribution"],
                ["Excellence", "World-class engineering rigor & customer satisfaction", "Zero-defect delivery and technical mastery", "Delivery Quality Score"],
                ["Pioneering", "Continuous innovation and intellectual curiosity", "Patent generation & research contributions", "Innovation Index"],
                ["Unity", "Inclusive teamwork, mutual respect & global collaboration", "Diverse team empowerment & psychological safety", "Inclusion Feedback"],
            ],
            [110, 150, 145, 135],
            [
                "All new associates must sign a physical or digital Declaration of Adherence to the Tata Code of Conduct during onboarding.",
                "Annual refresher certifications on TCoC are tracked in iEvolve with a mandatory 100% completion requirement across all units.",
                "Breaches of ethical standards are investigated independently by the Corporate Ethics Committee and Global Chief Ethics Officer.",
            ],
            "TATA CODE OF CONDUCT (TCoC) SUPREME MANDATE:",
            "The Tata Code of Conduct transcends all contractual, operational, and financial targets. When faced with an ethical dilemma, "
            "associates must choose the path of integrity without hesitation and seek guidance from their Local Ethics Counselor."
        ),
        make_article(
            "Article 2. Anti-Bribery, Anti-Corruption & Business Gifts Governance",
            "2.1 Prohibition of Commercial Bribery, Facilitation Payments & Strict Gift Thresholds",
            "TCS maintains zero tolerance for bribery, commercial corruption, facilitation payments, kickbacks, or illicit inducements "
            "in any form, whether interacting with public officials, commercial clients, partner organizations, or vendor suppliers. "
            "No associate shall directly or indirectly offer, promise, authorize, or accept any financial advantage, gift, or favor intended "
            "to influence business decisions or secure preferential commercial treatment, in full compliance with the Prevention of Corruption "
            "Act, US Foreign Corrupt Practices Act (FCPA), and UK Bribery Act.",
            "Acceptance of gifts, hospitality, or entertainment from suppliers, clients, or business partners is strictly regulated. "
            "Associates may only accept nominal, customary advertising or promotional items (such as branded calendars, pens, or diaries) "
            "having an intrinsic commercial value not exceeding Rs 1,000 (or $25 equivalent). Any gift, hospitality invitation, or favor "
            "exceeding this threshold must be politely declined or immediately declared and surrendered to the Local Ethics Counselor (LEC) "
            "for entry in the Corporate Gift Register.",
            ["Gift / Hospitality Category", "Permissibility Threshold", "Reporting Protocol", "Governance Action"],
            [
                ["Nominal Promotional Items", "Value <= Rs 1,000 ($25 equivalent)", "Associate self-retention permitted", "No formal filing needed"],
                ["Gifts Exceeding Threshold", "Value > Rs 1,000 ($25 equivalent)", "Mandatory declaration to Ethics Counselor", "Surrendered for charitable raffle"],
                ["Cash / Cash Equivalents", "Strictly Prohibited (Zero Tolerance)", "Immediate escalation to Head of Ethics", "Treated as potential commercial bribe"],
                ["Vendor-Sponsored Meals", "Modest working business lunches only", "Permitted within ordinary business context", "Excessive hospitality prohibited"],
                ["Travel / Hotel Hospitality", "Strictly Prohibited from Vendors", "All travel must be funded by TCS", "Immediate rejection required"],
            ],
            [120, 135, 145, 140],
            [
                "Facilitation payments or speed money paid to expedite administrative routines are strictly prohibited under all circumstances.",
                "Third-party vendors, suppliers, and partners must execute the Tata Supplier Code of Conduct prior to contract onboarding.",
                "Any associate subjected to extortion or bribery solicitation must report the incident to the Ethics Counselor within 24 hours.",
            ],
            "ZERO-TOLERANCE ANTI-BRIBERY STANDARD:",
            "Engaging in commercial bribery, offering kickbacks, or accepting illicit vendor inducements results in immediate summary dismissal, "
            "forfeiture of retirement benefits, and immediate referral to statutory anti-corruption law enforcement authorities."
        ),
        make_article(
            "Article 3. Prevention of Sexual Harassment (POSH) & Workplace Respect",
            "3.1 Sexual Harassment of Women at Workplace Act 2013 Compliance & ICC Inquiries",
            "TCS is committed to providing a safe, respectful, and dignified work environment free from sexual harassment, intimidation, "
            "and gender-based discrimination. In strict accordance with the Sexual Harassment of Women at Workplace (Prevention, Prohibition "
            "and Redressal) Act 2013 and global workplace dignity standards, any unwelcome sexually determined behavior—whether verbal, "
            "physical, gestural, visual, or digital—is an act of gross misconduct subject to severe disciplinary sanctions.",
            "An independent Internal Complaints Committee (ICC) is formally constituted at every major TCS delivery campus, headed by a "
            "senior female Presiding Officer and comprising at least 50% women members and an external NGO/legal expert. Any aggrieved "
            "individual may submit a written complaint to the ICC or via the confidential POSH portal within 3 months of the incident. "
            "The ICC conducts confidential, unbiased, fair inquiries in accordance with principles of natural justice within 90 days. "
            "Strict anti-retaliation protections ensure zero adverse impact on the complainant's career standing.",
            ["POSH Process Stage", "Statutory Timeline / SLA", "Responsible Authority", "Operating Protocol"],
            [
                ["Complaint Initiation", "Within 3 Months of Incident", "Aggrieved Associate / Nominee", "Written complaint to ICC / Portal"],
                ["Conciliation Option", "Prior to formal inquiry (Optional)", "Internal Complaints Committee (ICC)", "No monetary settlement permitted"],
                ["Formal Fact-Finding Inquiry", "Completed within 90 Calendar Days", "ICC Multi-Member Panel", "Summoning witnesses & digital evidence"],
                ["Inquiry Report Submission", "Within 10 Days of Inquiry Completion", "ICC to Employer / Delivery Head", "Comprehensive findings & recommendations"],
                ["Disciplinary Implementation", "Within 60 Days of Report Receipt", "Corporate Disciplinary Committee", "Sanctions up to summary termination"],
            ],
            [120, 130, 145, 145],
            [
                "All inquiry proceedings, witness testimonies, and report details are maintained in absolute statutory confidentiality.",
                "Retaliation against a complainant, witness, or committee member triggers immediate summary termination under TCoC.",
                "Mandatory annual POSH awareness workshops are conducted on iEvolve for 100% of associates and people managers.",
            ],
            "STATUTORY WORKPLACE DIGNITY MANDATE:",
            "Sexual harassment undermines human dignity and professional safety. TCS maintains zero tolerance for misconduct; substantiated "
            "violations result in immediate termination, termination of service credentials, and statutory legal reporting."
        ),
        make_article(
            "Article 4. Conflict of Interest, Outside Employment & Prohibition of Moonlighting",
            "4.1 Secondary Employment Ban, Intellectual Property Protection & Outside Interests",
            "Associates must devote their entire professional attention, skill, energy, and working hours exclusively to the business "
            "interests of TCS. In accordance with the Certified Standing Orders and Tata Code of Conduct Clause 4, associates are strictly "
            "prohibited from engaging in secondary employment, part-time jobs, freelance consulting, gig economy work, side commercial "
            "ventures, or advisory directorships—commonly referred to as 'Moonlighting'—whether for remuneration or honorarium.",
            "Secondary employment compromises delivery confidentiality, degrades energy and focus, exposes customer intellectual property "
            "to unauthorized leakages, and creates profound legal and ethical conflicts of interest. Associates must not establish or invest "
            "in businesses that compete with TCS or supply goods/services to TCS without formal disclosure and written approval from the "
            "Corporate Ethics Committee and General Counsel. Engaging in moonlighting results in immediate summary dismissal for cause.",
            ["Conflict Category", "Policy Compliance Mandate", "Disclosure Requirement", "Enforcement Consequence"],
            [
                ["Dual Employment / Moonlighting", "Strict Zero Tolerance (Absolute Ban)", "Prohibited across all sectors", "Immediate summary termination"],
                ["Freelance IT / Software Consulting", "Strictly Prohibited", "Prohibited across all platforms", "Immediate summary termination & legal action"],
                ["Family Commercial Vendor Ties", "Permitted only with written clearance", "Mandatory Ultimatix conflict filing", "Recusal from vendor selection"],
                ["Academic Guest Lectures (Honorary)", "Permitted with Manager Concurrence", "Prior written approval from Unit HR", "Permitted up to 4 hours/month"],
                ["Non-Profit / Charitable Work", "Encouraged through TCS Maitree", "Informal notification to supervisor", "Permitted during non-working hours"],
            ],
            [130, 135, 135, 140],
            [
                "Regular audits cross-reference employee universal provident fund (UAN) dual-contribution records with EPFO data.",
                "Holding multiple active PF accounts or overlapping employment records triggers automated disciplinary inquiry.",
                "Associates must update their annual Conflict of Interest disclosure on Ultimatix during financial year-opening.",
            ],
            "DUAL EMPLOYMENT ZERO TOLERANCE:",
            "Moonlighting represents a fundamental breach of loyalty and ethical trust under the Tata Code of Conduct. TCS enforces strict "
            "monitoring; violators face immediate termination and permanent blacklisting from all Tata Group companies."
        ),
        make_article(
            "Article 5. Professional Dress Code, Campus Decorum & Workplace Conduct",
            "5.1 Business Formal Attire, Smart Business Casuals & Identity Badge Protocol",
            "TCS associates represent the premier global brand of the Tata Group and must project the highest standards of professional "
            "decorum, grooming, and attire across all client interactions, campus environments, and public business forums. On client-facing "
            "days, executive meetings, and formal presentations, associates must dress in Business Formals (tailored suits, formal collared "
            "shirts, formal trousers, ties, formal skirts, or formal Indian ethnic attire such as sarees or salwar kameez).",
            "On standard campus delivery days (Monday through Thursday), associates may wear Smart Business Casuals (collared shirts, formal "
            "polos, chinos, tailored trousers, formal blouses, and modest ethnic wear). Casual Fridays permit neat, non-distressed denim jeans "
            "paired with collared polo shirts or formal casuals. Athletic wear, gym clothing, flip-flops, torn/ripped jeans, and offensive "
            "graphic t-shirts are strictly prohibited on campus. The TCS Smartcard Identity Badge must be worn visibly on a lanyard at all times.",
            ["Day of Week / Context", "Approved Attire Standard", "Permitted Clothing Items", "Prohibited Clothing Items"],
            [
                ["Client Visits & Executive Meetings", "Business Formals", "Formal suits, dress shirts, formal trousers, sarees", "Casual shirts, polo t-shirts, jeans, sneakers"],
                ["Monday through Thursday", "Smart Business Casuals", "Collared shirts, chinos, formal trousers, kurtas", "Torn jeans, round-neck t-shirts, sportswear"],
                ["Casual Friday", "Business Casuals / Neat Denims", "Clean dark denims, collared polo shirts, loafers", "Frayed jeans, shorts, beachwear, flip-flops"],
                ["Identity Badge Mandate", "Mandatory Visible Display", "Official TCS Smartcard on corporate lanyard", "Badges kept in pockets or bags"],
            ],
            [125, 130, 140, 145],
            [
                "Security personnel at turnstile gates are authorized to deny campus entry to associates violating baseline dress standards.",
                "Associates working in specialized ODC banking bays must adhere to client-specific formal dress code mandates.",
                "Professional grooming standards apply equally to associates participating in video conference calls with global clients.",
            ],
            "PROFESSIONAL DECORUM & BRAND EXCELLENCE:",
            "Professional appearance and mutual courtesy reflect the collective excellence of TCS. Associates must maintain exemplary "
            "standards of respect, civility, and professionalism in all interactions."
        ),
        make_article(
            "Article 6. Separation Governance, 90-Day Notice Period & Relieving Protocols",
            "6.1 90-Day Notice Period, Handover Governance & Full & Final (F&F) Settlement",
            "To safeguard project delivery stability, facilitate seamless customer transitions, and ensure thorough knowledge handover, "
            "confirmed associates who voluntarily resign from TCS must serve a mandatory 90-Day (3 calendar months) Notice Period. "
            "The notice period commences on the date the formal resignation is logged in the Ultimatix Employee Self Service (ESS) portal "
            "and accepted by the reporting manager. Probationary associates must serve a 30-day notice period.",
            "Waiver or buyout of any portion of the notice period is strictly subject to the sole discretion of the Delivery Head (DH) and "
            "Unit HR Head (UHR), based entirely on business continuity and project handover milestones. Notice buyout cannot be claimed as "
            "a matter of right. During the notice period, associates must complete all assigned knowledge transfers, return all corporate "
            "assets (laptops, tokens, access cards), settle travel advances, and complete the exit clearance checklist to receive their "
            "Relieving Letter and Service Certificate.",
            ["Employment Category", "Mandatory Notice Span", "Notice Buyout Eligibility", "Exit Documentation SLA"],
            [
                ["Confirmed Permanent Associates", "90 Calendar Days (3 Months)", "Subject to Delivery Head written approval", "Relieving letter issued on LWD"],
                ["Probationary Associates (< 90 Days)", "30 Calendar Days (1 Month)", "Manager discretion based on handover", "Relieving letter issued on LWD"],
                ["Separation during Disciplinary Inquiry", "Notice rejected; Inquiry proceeds", "Disallowed (Ineligible for buyout)", "Separation subject to CDRC outcome"],
                ["Full & Final Settlement (F&F)", "Processed within 30 days of LWD", "Encashment of EL up to 45 days + gratuity", "Electronic bank credit via payroll"],
            ],
            [130, 125, 145, 140],
            [
                "Associates serving notice period are not permitted to avail extended Earned Leave unless approved by the Delivery Centre Head.",
                "All company intellectual property, client project documentation, and credentials must be transitioned to the designated successor.",
                "Exit interviews provide confidential feedback to Corporate HR to enhance organizational workplace culture and talent retention.",
            ],
            "SEPARATION INTEGRITY & RELIEVING PROTOCOL:",
            "Leaving without completing the mandatory 90-day notice period or failing to transition critical client deliverables results in "
            "summary termination for job abandonment, forfeiture of relieving credentials, and permanent negative industry reference."
        )
    ]

    return {
        "filename": "employee_handbook.pdf",
        "meta": {
            "id": "TCS-HR-POL-002",
            "title": "TCS Associate Handbook & Tata Code of Conduct (TCoC)",
            "category": "Corporate Governance | Ethics & Culture",
            "eff_date": "January 1, 2026",
        },
        "sections": sections
    }
