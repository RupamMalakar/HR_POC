"""TCS Total Rewards & Associate Benefits Manual (TCS-HR-POL-003) dense content module."""
from policies.common import make_article

def get_document():
    sections = [
        make_article(
            "Article 1. Total Rewards Architecture, Grade Bands & Compensation Structure",
            "1.1 Grade Hierarchy, Cost to Company (CTC) Components & Bouquet of Benefits (BoB)",
            "Tata Consultancy Services (TCS) provides a market-competitive, transparent, and performance-driven Total Rewards "
            "framework designed to attract, motivate, and retain exceptional global talent. The compensation architecture is "
            "structured around associate grade bands—from Entry-level Trainees (Band Y) and Software Engineers (Bands C1/C2) to "
            "IT Analysts/Consultants (Bands C3A/C3B) and Senior Practice Leaders/Delivery Managers (Bands C4/C5).",
            "Annual Cost to Company (CTC) comprises three primary pillars: Guaranteed Cash (Basic Salary and House Rent Allowance - HRA); "
            "the flexible Bouquet of Benefits (BoB) allowing tax-optimized allocations (Food Coupons, Fuel/Vehicle Maintenance, LTA, "
            "Telephone/Broadband); and Performance Pay (Quarterly City Allowance and Variable Performance Pay linked to individual "
            "and unit ratings). Statutory retirement benefits (Provident Fund, Gratuity) are calculated strictly on Basic Salary.",
            ["Associate Grade / Band", "Corporate Designation Hierarchy", "Fixed Compensation Core", "Variable Performance Pay Scope"],
            [
                ["Band Y (Trainee / ASE)", "Assistant System Engineer Trainee", "Basic Salary + HRA + Core BoB", "Standard Quarterly Performance Pay"],
                ["Bands C1 & C2 (Engineer)", "System Engineer / IT Analyst", "Basic + HRA + Optimized BoB", "Quarterly City & Performance Pay"],
                ["Bands C3A & C3B (Specialist)", "Assistant Consultant / Associate Cons", "Basic + HRA + Executive BoB", "Enhanced Quarterly Performance Pay"],
                ["Bands C4 & C5 (Leader)", "Consultant / Principal Consultant", "Senior Executive Fixed Core", "Annual Strategic Bonus + High Variable"],
                ["Executive Tier (VP / CXO)", "Vice President / Global Practice Head", "Executive Fixed Structure", "Corporate Performance Linked Variable"],
            ],
            [120, 150, 140, 130],
            [
                "Monthly salary is disbursed on the last working day of each calendar month directly into the associate's corporate salary bank account.",
                "Salary slips and annual Tax Computation sheets (Form 16) are available electronically via Ultimatix Global HR (ESS).",
                "Associates may reconfigure their Bouquet of Benefits (BoB) tax allocation annually during the April financial year-opening window.",
            ],
            "TOTAL REWARDS PHILOSOPHY:",
            "TCS rewards consistent high performance, technical excellence, and dedication to client success. Variable compensation directly "
            "reflects project milestones, unit delivery velocity, and adherence to the Tata Code of Conduct."
        ),
        make_article(
            "Article 2. Healthcare & Medical Insurance: TCS Health Insurance Scheme (TCS-HIS)",
            "2.1 TCS-HIS Family Floater, Network Cashless Hospitalization & Parent Top-Up Scheme",
            "The health and well-being of associates and their families is supported through the comprehensive TCS Health Insurance Scheme "
            "(TCS-HIS), administered in partnership with leading Third Party Administrators (TPA - Medi Assist / Vidal Health). All confirmed "
            "and probationary associates are automatically enrolled from their date of joining with zero waiting period for pre-existing diseases.",
            "The base policy provides a Family Floater cover of Rs 5,00,000 per annum covering the associate, spouse, and up to two dependent "
            "children across a nationwide network of 10,000+ cashless hospitals. In addition, associates may voluntarily enroll their dependent "
            "parents or parents-in-law under the optional Parental Top-Up Scheme (with coverage options from Rs 3,00,000 to Rs 10,00,000 per year) "
            "via convenient monthly payroll premium deductions. Domiciliary (OPD) expenses and specialized consultations are covered under policy limits.",
            ["Insurance Benefit Tier", "Sum Insured / Annual Limit", "Covered Family Beneficiaries", "Premium Funding Model"],
            [
                ["TCS-HIS Base Hospitalization", "Rs 5,00,000 Family Floater / Year", "Self, Spouse, 2 Dependent Children", "100% TCS Corporate Funded"],
                ["Parental Top-Up Scheme", "Rs 3,00,000 to Rs 10,00,000 / Year", "Parents OR Parents-in-Law", "Voluntary Associate Payroll Deduction"],
                ["Critical Illness Buffer", "Rs 10,00,000 Additional Reserve", "Covered associates for severe critical care", "Corporate Welfare Fund Approval"],
                ["Maternity Hospitalization", "Up to Rs 75,000 Normal / Rs 1,00,000 C-Sec", "Female associate or spouse", "Integrated in TCS-HIS Base Plan"],
                ["Day-Care Surgical Procedures", "Covered up to Sum Insured (150+ procs)", "All enrolled family members", "Cashless via TPA E-Card"],
            ],
            [120, 140, 140, 140],
            [
                "Cashless hospitalization requires presenting the Ultimatix TPA E-Card and government photo ID at network hospital TPA desks.",
                "Emergency hospitalization must be notified to the TPA helpline within 24 hours of admission; planned admissions require 48h pre-auth.",
                "Reimbursement claims for non-network hospitals must be submitted in Ultimatix within 30 days of hospital discharge.",
            ],
            "TCS-HIS REGISTRATION & CASHLESS SERVICES:",
            "Associates must ensure all family dependents are registered in Ultimatix within 30 days of marriage or childbirth. Unregistered "
            "dependents cannot be covered under cashless hospital admission."
        ),
        make_article(
            "Article 3. Statutory Retirement Benefits: Employee Provident Fund (EPF), Gratuity & NPS",
            "3.1 Provident Fund (12% Match), Payment of Gratuity Act & National Pension System (NPS)",
            "TCS provides comprehensive long-term financial security through statutory retirement vehicles and voluntary pension schemes. "
            "All permanent associates participate in the Employees' Provident Fund (EPF) administered under the Employees' Provident Funds "
            "and Miscellaneous Provisions Act 1952. The associate contributes 12% of Basic Salary monthly, with an equal matching 12% contribution "
            "remitted by TCS (split between EPF and Employees' Pension Scheme - EPS).",
            "Gratuity is payable to associates upon separation after completing a minimum of 5 years of continuous service in accordance "
            "with the Payment of Gratuity Act 1972, calculated at 15 days of last drawn Basic Salary for every completed year of service. "
            "Additionally, TCS participates in the National Pension System (NPS Tier 1 Corporate Model), allowing associates to voluntarily "
            "allocate up to 10% of Basic Salary toward tax-deductible retirement pension wealth under Section 80CCD(2) of the Income Tax Act.",
            ["Retirement Benefit Pillar", "Governing Statutory Mandate", "Contribution Matrix", "Vesting / Payout SLA"],
            [
                ["Employees' Provident Fund (EPF)", "EPF & MP Act 1952", "12% Associate + 12% TCS Match", "Transferable via Universal Account Number (UAN)"],
                ["Employees' Pension Scheme (EPS)", "EPFO Statutory Framework", "8.33% of employer share (up to statutory wage ceiling)", "Monthly pension upon retirement at age 58"],
                ["Statutory Gratuity", "Payment of Gratuity Act 1972", "100% Employer Funded (15 days basic / year)", "5 Years continuous service threshold"],
                ["National Pension System (NPS)", "PFRDA Corporate Model", "Up to 10% Basic Salary voluntary payroll deduction", "Vested immediately; portable PRAN account"],
            ],
            [130, 130, 140, 140],
            [
                "Associates must link their Aadhaar and PAN with their Universal Account Number (UAN) on the EPFO portal to ensure seamless transfers.",
                "Gratuity settlements upon separation are processed automatically through the Ultimatix Full & Final (F&F) settlement engine.",
                "Voluntary PF (VPF) contributions above the statutory 12% may be initiated through Ultimatix during financial year-opening.",
            ],
            "RETIREMENT GOVERNANCE & TAX COMPLIANCE:",
            "All retirement funds are audited by external statutory auditors and government retirement bodies. Associates can monitor their "
            "UAN passbook and NPS PRAN account online 24/7."
        ),
        make_article(
            "Article 4. Group Term Life Insurance (GTLI) & Personal Accident Cover (GPA)",
            "4.1 Group Term Life (3x CTC Cover), 24x7 Worldwide Accident Cover & Disability Benefits",
            "To safeguard associates' families against unforeseen fatalities or catastrophic occupational hazards, TCS provides 100% "
            "company-funded Group Term Life Insurance (GTLI) and Group Personal Accident (GPA) insurance from day one of employment. "
            "GTLI provides life insurance protection equivalent to 3 times the associate's annual Cost to Company (CTC), payable in full "
            "to designated legal nominees in the tragic event of natural or accidental demise anywhere in the world.",
            "Group Personal Accident (GPA) insurance provides 24x7 worldwide coverage against accidental death, permanent total disability (PTD), "
            "and permanent partial disability (PPD) resulting from accidents during official duty, daily commute, or personal life. The GPA sum "
            "insured is equivalent to 4 times annual CTC, with structured weekly disability allowances for temporary total disablement.",
            ["Insurance Protection Plan", "Sum Insured Multiplier", "Coverage Scope", "Nomination Requirement"],
            [
                ["Group Term Life Insurance (GTLI)", "3x Annual Cost to Company (CTC)", "24x7 Worldwide coverage (all causes of demise)", "Mandatory electronic nomination in Ultimatix"],
                ["Group Personal Accident (GPA)", "4x Annual Cost to Company (CTC)", "Accidental death & permanent total disability (PTD)", "Mandatory electronic nomination in Ultimatix"],
                ["Permanent Partial Disability (PPD)", "Percentage of GPA Sum Insured", "Loss of limbs, eyesight, hearing per schedule", "Certified by government medical board"],
                ["Temporary Total Disablement (TTD)", "Weekly benefit up to Rs 25,000 / week", "Temporary accident confinement up to 52 weeks", "OHC Medical Officer certification"],
            ],
            [125, 135, 140, 140],
            [
                "All associates must maintain updated legal nominee details on Ultimatix; outdated nomination records delay claim disbursal.",
                "Accidental claims must be reported to the Corporate Insurance Desk within 14 calendar days with FIR and police panchnama.",
                "GTLI coverage terminates upon the effective date of separation from TCS.",
            ],
            "MANDATORY NOMINEE DESIGNATION:",
            "Associates must verify and validate their legal beneficiaries in the Ultimatix Insurance Nominee Portal annually. Claims are "
            "settled strictly in accordance with recorded electronic nominations."
        ),
        make_article(
            "Article 5. Voluntary Pet Insurance, Corporate Ancillary Perks & Concierge Services",
            "5.1 Pet Insurance Coverage (Tata AIG / Nationwide Tie-Up), Veterinary Care & Pet Wellness",
            "As part of our commitment to diverse associate families and holistic well-being, TCS offers voluntary ancillary benefits "
            "including corporate group-discounted Pet Insurance through tie-ups with Tata AIG General Insurance and global partner networks. "
            "Associates owning domestic companion animals (dogs and cats) can enroll their pets in specialized veterinary healthcare coverage "
            "via voluntary monthly payroll deductions at exclusive corporate group tariff rates.",
            "The pet insurance policy covers up to 70% of eligible veterinary medical costs—including unexpected illness treatment, surgical "
            "procedures, emergency hospitalizations, accidental trauma care, mandatory vaccinations, and routine wellness health check-ups. "
            "Coverage options provide annual medical limits from Rs 25,000 to Rs 75,000 per pet (or $1,500 to $4,000 for overseas associates) "
            "with convenient direct reimbursement against veterinary tax receipts uploaded in the Ultimatix Voluntary Benefits portal.",
            ["Pet Insurance Plan", "Annual Veterinary Limit", "Covered Veterinary Treatments", "Associate Premium Tariff"],
            [
                ["Standard Pet Care (Dogs/Cats)", "Up to Rs 25,000 / Year", "Emergency illness, accidental surgery, diagnostics", "Corporate group discounted monthly deduction"],
                ["Comprehensive Pet Wellness", "Up to Rs 50,000 / Year", "Surgeries, OPD illnesses, annual vaccinations", "Corporate group discounted monthly deduction"],
                ["Elite Pet Healthcare", "Up to Rs 75,000 / Year", "Full surgical, cancer therapy, dental trauma & OPD", "Corporate group discounted monthly deduction"],
                ["Global Overseas Pet Plan", "$1,500 - $4,000 / Year", "Nationwide Pet partner network hospitalization", "Local payroll deduction in deputation currency"],
            ],
            [120, 130, 145, 145],
            [
                "Pets must be legally registered with local municipal authorities and possess active microchipping and vaccination records.",
                "Pre-existing hereditary conditions are subject to standard policy waiting periods as defined in the insurer schedule.",
                "Claims are filed online with itemized veterinary consultation invoices and pharmacy cash memos.",
            ],
            "ASSOCIATE PET PARENT WELLBEING:",
            "Companion animals play a vital role in associate happiness and mental health. Voluntary pet coverage ensures associates can "
            "provide top-tier veterinary care without unexpected financial distress."
        )
    ]

    return {
        "filename": "benefits_guide.pdf",
        "meta": {
            "id": "TCS-HR-POL-003",
            "title": "TCS Total Rewards & Associate Benefits Manual",
            "category": "Compensation & Benefits | Total Rewards",
            "eff_date": "January 1, 2026",
        },
        "sections": sections
    }
