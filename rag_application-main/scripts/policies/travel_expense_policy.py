"""TCS Global Travel & Domestic Expense Policy (TCS-HR-POL-005) dense content module."""
from policies.common import make_article

def get_document():
    sections = [
        make_article(
            "Article 1. Business Travel Governance, Pre-Approval & Ultimatix GTS Integration",
            "1.1 Travel Authorizations, Global Travel System (GTS) Mandate & Approval Matrix",
            "Tata Consultancy Services (TCS) recognizes that business travel is critical for client project execution, business development, "
            "executive leadership reviews, and knowledge transition across our global enterprise. This policy establishes standardized rules, "
            "eligibility entitlements, per diem schedules, and expense settlement parameters for all domestic and international business travel "
            "undertaken by TCS associates. All business travel must be strictly necessitated by business exigencies and authorized prior to travel.",
            "All travel requisitions must be raised, routed, and ticketed exclusively through the TCS Ultimatix Global Travel System (GTS) / Concur "
            "platform. Self-booking via public retail travel websites, personal airline portals, or unauthorized agents is strictly prohibited "
            "and will not be reimbursed. Domestic travel requests must be approved by the Project Manager (PM) and Delivery Head (DH) at least "
            "7 calendar days in advance; international travel requests require Delivery Center Head (DCH) and Global Travel Desk signoff at least "
            "21 calendar days prior to departure.",
            ["Travel Classification", "Advance Notice SLA", "Required Approval Tier", "Ticketing Channel"],
            [
                ["Domestic Intra-State Travel", "Minimum 5 Calendar Days", "Project Manager & Delivery Lead", "Ultimatix GTS Portal Only"],
                ["Domestic Inter-State Travel", "Minimum 7 Calendar Days", "Delivery Head (DH) Approval", "Ultimatix GTS Portal Only"],
                ["Short-Term Overseas Travel (STT)", "Minimum 21 Calendar Days", "DCH & Overseas Business Head", "Corporate GTS Travel Desk"],
                ["Client-Billable Travel", "Minimum 7 Calendar Days", "Client SOW & Project Manager", "GTS with Client Billing Code"],
                ["Emergency Escalation Travel", "Minimum 24 Hours SLA", "Unit Delivery Head Direct Signoff", "Emergency Desk Ticketing"],
            ],
            [120, 130, 145, 145],
            [
                "Travel tickets booked outside Ultimatix GTS without explicit prior CFO dispensation will be rejected by corporate finance.",
                "Associates must ensure all project billability codes and customer accounting centres are accurately mapped in the travel requisition.",
                "Frequent Flyer Miles (FFM) earned during official travel may be retained by the associate for personal use, provided no additional cost is incurred.",
            ],
            "ULTIMATIX GTS BOOKING COMPLIANCE MANDATE:",
            "All flight, train, hotel, and car bookings must be processed through corporate travel tie-ups in Ultimatix. Any expense incurred "
            "through unauthorized travel portals without pre-trip approval is classified as non-reimbursable personal expenditure."
        ),
        make_article(
            "Article 2. Domestic Airfare, Train Travel & Ground Transportation Entitlements",
            "2.1 Travel Modes by Grade Band, Economy Class Standards & Rail Travel Classes",
            "Travel mode eligibility is structured according to the associate's grade band, travel distance, and transit duration. "
            "For all domestic travel within India, commercial air travel is permitted for flight sectors where the flight duration exceeds "
            "2.5 hours or the rail journey duration exceeds 6 hours. All domestic flights must be booked in Economy Class via the most direct, "
            "logical, and cost-effective commercial flight option available on the Ultimatix GTS portal.",
            "For rail travel, associates in Bands Y, C1, and C2 are entitled to AC 2-Tier / AC 3-Tier sleeper berths; associates in Bands C3, "
            "C4, and C5 are entitled to AC 1st Class or Executive Chair Car on Vande Bharat and Shatabdi Express services. Executive Leadership "
            "(Vice Presidents and above) are entitled to Economy Air for all domestic flights and Business Class on international flights "
            "where continuous flying time exceeds 8 hours.",
            ["Associate Grade / Band", "Domestic Air Entitlement", "Train Travel Entitlement", "International Flight Class"],
            [
                ["Bands Y, C1, C2 (ASE / SE / ITA)", "Economy Class (> 2.5h / > 500km)", "AC 2-Tier / AC 3-Tier / AC Chair Car", "Economy Class (Lowest Fare)"],
                ["Bands C3A, C3B (AST / ASC)", "Economy Class (All domestic flights)", "AC 1st Class / AC 2-Tier / Exec Chair Car", "Economy Class (Lowest Fare)"],
                ["Bands C4, C5 (Consultant / Sr. Cons)", "Economy Class (All domestic flights)", "AC 1st Class / Exec Chair Car", "Premium Economy (> 6h flight)"],
                ["Vice President / Global Heads", "Economy Class (Lowest Fare)", "AC 1st Class / Executive Chair Car", "Business Class (> 8h flight)"],
                ["Executive Leadership (CXO)", "Economy / Business Class", "AC 1st Class Executive", "Business Class (Direct Route)"],
            ],
            [120, 140, 140, 140],
            [
                "Flight tickets must be booked at least 14 days in advance wherever schedules permit to optimize corporate advance-purchase discounts.",
                "Airlines offering corporate web-check-in baggage allowances must be selected; excess personal baggage charges are not reimbursed.",
                "Airport transfers should utilize authorized TCS transport desks, pre-paid airport taxis, or corporate cab services.",
            ],
            "TRAVEL MODE GOVERNANCE PROTOCOL:",
            "Upgrades to business class or premium cabs at corporate expense are strictly prohibited without written approval from the "
            "Global Head of Delivery. Any unauthorized upgrade fare difference will be recovered directly from monthly payroll."
        ),
        make_article(
            "Article 3. Hotel Accommodations, Daily Allowances (DA) & Per Diem Rates",
            "3.1 City Tiers, Negotiated Corporate Stays & Daily Allowance Rates",
            "TCS maintains preferred corporate hospitality tie-ups with reputable hotel chains—including Ginger Hotels, Taj Group partner "
            "properties, Lemon Tree, and approved business hotel chains across India. All hotel accommodations must be booked through the "
            "Ultimatix GTS hotel portal at corporate negotiated rates. Direct walk-in hotel bookings are strictly prohibited.",
            "Daily Allowance (DA) covers meals (breakfast, lunch, dinner), incidentals, tips, and daily laundry during official tours. "
            "DA rates are categorized into Tier 1 Metro Cities (Mumbai, Delhi-NCR, Bangalore, Hyderabad, Chennai, Kolkata), Tier 2 Cities "
            "(Pune, Ahmedabad, Kochi, Chandigarh, Jaipur, Indore), and Tier 3 / Other Locations. If hotel accommodation includes complimentary "
            "breakfast, or if client-sponsored meals are provided, the daily allowance is reduced proportionally.",
            ["City Category / Location Tier", "Hotel Nightly Room Cap (excl. GST)", "Daily Allowance (DA) / Per Diem", "Conveyance Daily Cap"],
            [
                ["Tier 1 - Metro (Mumbai, Delhi, BLR, HYD, MAA)", "Up to Rs 3,500 / Night", "Rs 1,500 / Full Day", "Rs 1,000 / Day (Corporate Cab)"],
                ["Tier 2 - Non-Metro (Pune, CCU, COK, AMD, JAI)", "Up to Rs 2,500 / Night", "Rs 1,200 / Full Day", "Rs 800 / Day (Corporate Cab)"],
                ["Tier 3 - Other Urban Locations", "Up to Rs 1,800 / Night", "Rs 900 / Full Day", "Rs 600 / Day (Local Auto / Cab)"],
                ["International Travel - US / Europe ($ / €)", "Up to $180 / €160 per Night", "$75 / €70 per Diem (Full Day)", "Actual Local Transit"],
                ["International Travel - APAC / ME ($)", "Up to $140 / Night", "$60 per Diem (Full Day)", "Actual Local Transit"],
            ],
            [130, 130, 140, 140],
            [
                "Room service charges, in-room mini-bar consumables, and pay-per-view movies are personal expenses and will not be reimbursed.",
                "Itemized hotel tax invoices displaying the TCS Corporate GSTIN number must be collected upon checkout for input tax credit.",
                "For tours lasting less than 12 hours, 50% of the daily allowance is admissible; full DA applies for tours exceeding 12 hours.",
            ],
            "GST COMPLIANCE INVOICING MANDATE:",
            "All hotel and local travel bills must carry the exact legal name 'Tata Consultancy Services Limited' and the state-specific "
            "TCS GSTIN number. Bills lacking corporate GST details cannot be reimbursed under statutory Indian tax audit guidelines."
        ),
        make_article(
            "Article 4. Local Conveyance, Mileage Reimbursement & Corporate Cab Governance",
            "4.1 Corporate Cab Tie-Ups, Personal Vehicle Mileage & ODC Commute Rules",
            "Local conveyance during official tours or authorized inter-branch client visits must utilize TCS corporate cab tie-ups "
            "(Uber for Business / Ola Corporate / pre-paid airport taxi counters). The corporate profile must be selected during booking "
            "so that rides are billed directly to the project cost centre. Personal rides must never be billed to the corporate account.",
            "Where an associate utilizes their personal vehicle for pre-authorized business travel (e.g., attending client meetings or visiting "
            "sister delivery campuses where corporate transport is unavailable), mileage reimbursement is admissible at the rate of Rs 8.00 per km "
            "for four-wheelers (cars) and Rs 4.00 per km for two-wheelers (motorcycles/scooters). Mileage claims must be substantiated with toll "
            "receipts, odometer start/end readings, and precise Google Maps route printouts.",
            ["Conveyance Mode", "Reimbursement Rate / Cap", "Required Substantiating Document", "Approval SLA"],
            [
                ["Corporate Cab (Uber / Ola)", "Actual corporate rate billed", "Electronic trip receipt with business purpose", "Automated Billing"],
                ["Personal Four-Wheeler (Car)", "Rs 8.00 / Kilometer", "Odometer logs, toll receipts & route printout", "PM Approval Required"],
                ["Personal Two-Wheeler (Bike)", "Rs 4.00 / Kilometer", "Odometer logs & route printout", "PM Approval Required"],
                ["Airport Express Metro / Bus", "Actual fare incurred", "Original transit card receipt / e-ticket", "Fast-track Approval"],
                ["Daily Commute (Home to Office)", "Zero (Non-reimbursable personal cost)", "Not Applicable (Disallowed)", "Strict Auto-Rejection"],
            ],
            [120, 135, 145, 140],
            [
                "Daily commuting costs between the associate's residence and their base TCS campus are strictly personal and non-reimbursable.",
                "Traffic fines, parking violation penalties, and vehicle maintenance costs are the associate's sole personal liability.",
                "Toll charges incurred during authorized business mileage trips are reimbursed in full upon uploading FASTag/toll statements.",
            ],
            "VEHICLE MILEAGE GOVERNANCE:",
            "Associates claiming personal vehicle mileage must possess a valid driving license, active comprehensive vehicle insurance, "
            "and valid PUC certification. Claims for daily home-to-office commute under the guise of official travel trigger audit recovery."
        ),
        make_article(
            "Article 5. Expense Settlement Windows, Invoicing & Financial Reconciliation",
            "5.1 15-Day Expense Claim Submission, GST Mandate & Automated Audit Scanning",
            "All travel and business expense claims must be compiled, documented with itemized tax invoices, and submitted through the Ultimatix "
            "Expense Claim module within 15 calendar days of the completion of the business trip or expense incurrence. Claims submitted beyond "
            "15 days require written justification and Delivery Head (DH) approval; claims submitted beyond 45 days are strictly time-barred, "
            "forfeited, and automatically rejected by corporate finance.",
            "All uploaded vouchers undergo automated AI audit scanning and forensic duplicate-invoice checks. Original tax invoices displaying "
            "the merchant's GSTIN, invoice date, itemized description, and tax breakdown must be attached. Claims containing handwritten "
            "un-itemized slips exceeding Rs 250 are disallowed. Verified claims are disbursed electronically to the associate's salary bank "
            "account during the subsequent bi-weekly reimbursement payroll cycle.",
            ["Claim Stage", "Timeframe / Window", "Action Required", "Consequence of Non-Compliance"],
            [
                ["Standard Claim Submission", "Within 15 Calendar Days of Tour", "Submit e-claim in Ultimatix with all tax invoices", "Processed in next reimbursement cycle"],
                ["Delayed Submission Window", "16 to 45 Calendar Days", "Requires Delivery Head (DH) written dispensation", "Delayed reimbursement processing"],
                ["Strict Forfeiture Threshold", "> 45 Calendar Days from Tour", "Claim permanently locked & archived in Ultimatix", "100% Personal associate forfeiture"],
                ["Advance Reconciliation", "Within 15 Days of Tour Completion", "Surplus advance refund / expense offset", "Recovery from monthly salary if delayed"],
            ],
            [120, 130, 145, 145],
            [
                "Travel advances remaining unsettled past 30 days are automatically recovered from the associate's next monthly salary.",
                "Fraudulent or inflated expense claims result in immediate disciplinary dismissal under Tata Code of Conduct Clause 4.",
                "Corporate audit retains all digital expense vouchers and audit trails for a statutory retention period of 8 financial years.",
            ],
            "ZERO-TOLERANCE EXPENSE FRAUD POLICY:",
            "Submitting fabricated hotel bills, forged taxi receipts, or duplicate claims across multiple projects constitutes criminal "
            "fraud. Offenses are immediately referred to the Central Ethics Committee and result in summary dismissal and legal action."
        )
    ]

    return {
        "filename": "travel_expense_policy.pdf",
        "meta": {
            "id": "TCS-HR-POL-005",
            "title": "TCS Global Travel & Domestic Business Expense Policy",
            "category": "Finance & Global Mobility | Travel Administration",
            "eff_date": "January 1, 2026",
        },
        "sections": sections
    }
