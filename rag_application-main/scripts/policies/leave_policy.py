"""TCS Associate Leave Policy (TCS-HR-POL-001) dense content module."""
from policies.common import make_article

def get_document():
    sections = [
        make_article(
            "Article 1. Preamble, Statutory Foundation & Tata Code of Conduct Alignment",
            "1.1 Policy Purpose, Global Scope & Ultimatix ESS Administration",
            "Tata Consultancy Services (TCS) is committed to fostering a balanced, equitable, and sustainable high-performance "
            "work environment across all global delivery centres, client premises, and corporate facilities. We recognize that "
            "restorative rest and planned personal time are fundamental prerequisites for associate wellness, operational delivery "
            "excellence, and customer trust. This Associate Leave Policy establishes uniform, standardized rules governing all categories "
            "of leave entitlement, accrual schedules, encashment parameters, and attendance regularization for all permanent and probationary "
            "associates across India and global operating entities.",
            "All leave entitlements are administered, recorded, and audited electronically through the TCS Ultimatix Global HR portal "
            "(Employee Self Service - ESS). Managers are strictly prohibited from maintaining informal, undocumented off-the-record leave "
            "arrangements. Fraudulent leave submission or misrepresentation of medical certifications constitutes a severe violation of the "
            "Tata Code of Conduct (TCoC) Clause 4 (Conflict of Interest and Integrity) and triggers immediate disciplinary proceedings "
            "under the Corporate Disciplinary Review Committee (CDRC).",
            ["Statutory & Governance Standard", "Jurisdictional Mandate", "TCS Policy Specification", "Audit Cadence"],
            [
                ["Factories Act & Shops & Establishments", "Pan-India Delivery Centers", "Mandatory statutory paid leave & weekly rest cycles", "Quarterly Compliance"],
                ["Maternity Benefit Amendment Act 2017", "India Operations", "26 Weeks paid leave for up to 2 surviving children", "Continuous Monitoring"],
                ["Tata Code of Conduct (TCoC)", "Global Operations", "Zero-tolerance for unauthorized absence & false reporting", "Annual Ethics Audit"],
                ["Working Time & Statutory Holidays", "Global Delivery Centers", "State-specific festival holidays & mandatory weekly off", "Biannual Review"],
                ["Industrial Employment Standing Orders", "All Certified Facilities", "Binding rules for casual, medical, and privilege leave", "Statutory Audit"],
            ],
            [130, 115, 185, 110],
            [
                "All leave requests must be submitted through Ultimatix Global HR prior to the scheduled date of absence.",
                "Leave balances, accruals, and approvals are reconciled monthly with automated biometric turnstile badge logs.",
                "Unapproved absence exceeding 8 consecutive working days is classified as job abandonment under the Standing Orders.",
            ],
            "TATA CODE OF CONDUCT (TCoC) ETHICAL COMPLIANCE MANDATE:",
            "Every associate must uphold absolute integrity when applying for leave. Medical certificates must be issued by a Registered "
            "Medical Practitioner (RMP) with valid council registration. Disciplinary action up to summary termination applies for falsified claims."
        ),
        make_article(
            "Article 2. Annual Earned Leave (EL) Framework, Quarterly Crediting & Carryover Governance",
            "2.1 Earned Leave Allocation Schedule, Quarterly Crediting & Accumulation Limits",
            "All permanent full-time associates receive an annual entitlement of 16 working days of Earned Leave (EL) (equivalent to 128 working hours) "
            "per calendar year. In accordance with TCS financial year governance, Earned Leave is credited to the associate's Ultimatix leave account "
            "on a quarterly basis at the rate of 4.0 working days per completed calendar quarter (credited on January 1, April 1, July 1, and October 1). "
            "Probationary associates accrue EL during their probation period, but eligibility to avail EL commences upon completion of the initial 90-day tenure.",
            "Associates may accumulate and carry forward unused Earned Leave up to a maximum cap of 45 working days (360 hours). Any leave balance "
            "exceeding 45 days at the end of the calendar year (December 31st) is subject to lapse, unless explicit delivery exigency prevented leave "
            "utilization and the Delivery Head (DH) and Unit HR (UHR) grant exceptional roll-over approval. Upon separation from TCS (resignation or "
            "retirement), accumulated Earned Leave up to 45 days is encashed based on the associate's last drawn Basic Salary component.",
            ["Associate Grade / Band", "Annual EL Entitlement", "Quarterly Crediting Rate", "Maximum Accumulation Ceiling", "Encashment Basis"],
            [
                ["Bands Y, C1, C2 (ASE / SE / ITA)", "16 Working Days (128 Hours)", "4.0 Days / Completed Quarter", "45 Days (360 Hours)", "Basic Salary Component"],
                ["Bands C3A, C3B (AST / ASC)", "16 Working Days (128 Hours)", "4.0 Days / Completed Quarter", "45 Days (360 Hours)", "Basic Salary Component"],
                ["Bands C4, C5 (Consultant / Sr. Cons)", "16 Working Days (128 Hours)", "4.0 Days / Completed Quarter", "45 Days (360 Hours)", "Basic Salary Component"],
                ["Executive Leadership Tier", "16 Working Days (128 Hours)", "4.0 Days / Completed Quarter", "45 Days (360 Hours)", "Basic Salary Component"],
                ["Probationary Associates (0-90 Days)", "Pro-rated Accrual Only", "Credit held until confirmation", "45 Days (360 Hours)", "Subject to Confirmation"],
            ],
            [110, 105, 110, 115, 100],
            [
                "Earned Leave must be applied at least 14 calendar days in advance on Ultimatix for planned vacations exceeding 3 working days.",
                "A minimum of 2 working days must be taken per EL request; EL cannot be availed in half-day fractions.",
                "Project delivery handovers must be documented in the Project Management System (PMS) prior to commencing EL.",
                "During critical client go-live or transition periods, delivery managers may request mutually agreed leave rescheduling.",
            ],
            "ANNUAL CARRYOVER & ENCASHMENT GOVERNANCE:",
            "Earned leave accumulation is strictly capped at 45 working days. Associates are encouraged to plan and utilize earned leave "
            "regularly throughout the year to maintain mental well-being and prevent involuntary leave lapse on December 31st."
        ),
        make_article(
            "Article 3. Casual Leave (CL) & Short-Term Unplanned Personal Absences",
            "3.1 Annual Casual Leave Bank, Availing Rules & Half-Day Permissions",
            "Every confirmed and probationary associate is allocated a bank of 7 working days of Casual Leave (CL) on January 1st of each calendar year. "
            "Casual Leave is specifically designated for urgent personal matters, domestic contingencies, family emergencies, or brief unplanned "
            "events that cannot be anticipated in advance. For associates joining TCS mid-year, Casual Leave is credited pro-rata based on the "
            "remaining completed quarters in the calendar year.",
            "Casual Leave cannot be availed for more than 3 consecutive working days in a single stretch. CL may be taken in half-day increments "
            "(First Half: 09:00 - 13:30 or Second Half: 13:30 - 18:00). Casual Leave lapses entirely at 23:59 on December 31st of each year and "
            "cannot be accumulated, carried forward to the subsequent year, or encashed under any circumstances. CL cannot be combined with "
            "Earned Leave or Compensatory Off without prior Unit HR signoff.",
            ["Leave Parameter", "Casual Leave (CL) Standard", "Audit Requirement", "Ultimatix System Action"],
            [
                ["Annual Allocation", "7 Days (Front-loaded Jan 1)", "Pro-rata for mid-year joiners", "Automatic credit on Jan 1"],
                ["Maximum Continuous Span", "3 Consecutive Working Days", "Supervisor notification required", "Hard block past 3 days"],
                ["Half-Day Eligibility", "Permitted (Forenoon / Afternoon)", "Must log exactly 4.5 hours", "Timecard flag in Ultimatix"],
                ["Annual Carryover", "Strict Zero Carryover (Lapses Dec 31)", "Annual balance clearance", "Auto-forfeiture Dec 31"],
                ["Combination with EL", "Prohibited in single stretch", "Exceptions require UHR signoff", "Workflow alert triggered"],
            ],
            [110, 140, 145, 145],
            [
                "In case of sudden emergency, notification must be sent via SMS, email, or Ultimatix within 2 hours of shift start.",
                "Casual Leave cannot be prefixed or suffixed to extended festival holiday stretches without prior manager approval.",
                "Falsely claiming CL to mask unauthorized absence or tardiness results in leave without pay (LWP) conversion.",
            ],
            "CASUAL LEAVE UTILIZATION GUIDELINE:",
            "Casual Leave is an essential provision for unforeseen emergencies. Associates must record unplanned CL within 48 hours of "
            "returning to office to ensure timely payroll and attendance regularization."
        ),
        make_article(
            "Article 4. Sick Leave (Medical Leave) & Health Certification Protocols",
            "4.1 Annual Sick Leave Allocation, Hospitalization & Registered Medical Practitioner Verification",
            "TCS provides all associates with 10 working days of paid Sick Leave (SL) per calendar year, front-loaded on January 1st. "
            "Sick Leave is intended exclusively for personal medical illness, temporary incapacity, scheduled surgical procedures, "
            "or medical convalescence. Sick Leave may be taken in half-day increments where medical consultations require partial absence.",
            "Whenever Sick Leave extends beyond 2 consecutive working days, the associate must upload a formal Medical Certificate issued "
            "by a Registered Medical Practitioner (RMP) holding a valid state medical council registration number. Upon recovery and resuming "
            "duties, a corresponding Medical Fitness Certificate must be submitted to the Occupational Health Centre (OHC) or Unit HR. "
            "Unused Sick Leave lapses at the end of the calendar year and cannot be carried forward or encashed.",
            ["Absence Duration", "Documentation Mandate", "Validation Authority", "Payroll Regularization SLA"],
            [
                ["1 - 2 Consecutive Days", "Associate self-declaration in Ultimatix", "Reporting Manager approval", "Within 48 hours of resume"],
                ["3 - 7 Consecutive Days", "RMP Medical Certificate with diagnosis & council reg", "OHC / Unit HR verification", "Within 3 business days"],
                ["8 - 14 Consecutive Days", "Hospital discharge summary / lab investigations", "TCS Medical Officer concurrence", "Prior to payroll cutoff"],
                ["> 15 Days (Prolonged Illness)", "Formal Medical Board evaluation & case review", "Global Chief Medical Officer", "Continuous monitoring"],
                ["Workplace Contagious Illness", "Immediate self-quarantine & OHC clearance", "OHC clearance certificate", "Mandatory before gate access"],
            ],
            [110, 150, 140, 140],
            [
                "Associates must notify their immediate supervisor by phone or email within 4 hours of standard shift commencement.",
                "All medical certificates are audited by the TCS Occupational Health Centre (OHC) to prevent fraudulent submissions.",
                "Falsified medical documents result in immediate disciplinary action under the Tata Code of Conduct Clause 4.",
            ],
            "STATUTORY MEDICAL CERTIFICATE MANDATE:",
            "Certificates from unregistered practitioners, alternative therapies without recognized medical registration, or online "
            "unverified tele-consultations without valid license numbers are strictly rejected. Submissions are verified with medical authorities."
        ),
        make_article(
            "Article 5. Statutory Maternity, Adoption, Surrogacy & Childcare Governance",
            "5.1 Maternity Benefit Act Compliance, 26 Weeks Full Paid Leave & Phased Return to Work",
            "Female associates are entitled to 26 calendar weeks (182 calendar days) of fully paid Maternity Leave in accordance with the "
            "Maternity Benefit Amendment Act 2017 for up to 2 surviving children. For associates with two or more surviving children, maternity "
            "leave entitlement is 12 calendar weeks (84 calendar days). Maternity leave may commence up to 8 weeks prior to the expected date "
            "of delivery, with the remaining period utilized postpartum.",
            "Female associates legally adopting an infant under three months of age or commissioning mothers under a surrogacy arrangement "
            "are entitled to 12 calendar weeks (84 calendar days) of fully paid adoption/surrogacy leave from the date the child is handed over. "
            "TCS also provides on-campus day-care (crèche) facilities or tied-up crèche services within a 500-meter radius across all major "
            "campuses for children up to 6 years of age, allowing 4 nursing breaks per day.",
            ["Maternity Category", "Entitlement Span", "Remuneration Level", "Required Statutory Documentation"],
            [
                ["Maternity Leave (<= 2 Children)", "26 Calendar Weeks (182 Days)", "100% of Fixed Monthly CTC", "Form B & Medical Delivery Notice"],
                ["Maternity Leave (> 2 Children)", "12 Calendar Weeks (84 Days)", "100% of Fixed Monthly CTC", "Form B & Obstetrician Certificate"],
                ["Adoption Leave (Infant < 3 Months)", "12 Calendar Weeks (84 Days)", "100% of Fixed Monthly CTC", "Court Adoption Deed & Birth Record"],
                ["Commissioning / Surrogacy Mother", "12 Calendar Weeks (84 Days)", "100% of Fixed Monthly CTC", "Surrogacy Agreement & Birth Certificate"],
                ["Miscarriage / Medical Termination", "6 Calendar Weeks (42 Days)", "100% of Fixed Monthly CTC", "Registered Gynecologist Certificate"],
            ],
            [110, 125, 140, 165],
            [
                "Maternity leave applications must be initiated on Ultimatix at least 30 days prior to the expected commencement date.",
                "Associates retain full healthcare coverage under the TCS Health Insurance Scheme (TCS-HIS) throughout maternity leave.",
                "Performance rating for the appraisal year is calibrated based on active tenure, with zero penalty for maternity absence.",
                "A phased return-to-work program is available upon request, subject to project alignment and Unit HR approval.",
            ],
            "STATUTORY CRÈCHE & NURSING BREAK MANDATE:",
            "As mandated by Section 11A of the Maternity Benefit Act, all TCS campuses with over 50 employees provide dedicated crèche "
            "facilities. Mothers are entitled to four visits per day, including rest intervals, until the child reaches 15 months of age."
        ),
        make_article(
            "Article 6. Paternity Leave, New Father Support & Primary Caregiver Provisions",
            "6.1 Paternity Leave Entitlement, Availing Tranches & Eligibility Rules",
            "All permanent male associates are entitled to 5 working days of paid Paternity Leave to support their spouse and bond with "
            "the newborn child. Paternity leave applies for the birth of up to two surviving children. The entitlement may be availed in a "
            "single continuous stretch of 5 working days or split into two distinct tranches (e.g., 3 days and 2 days) within 6 months "
            "from the date of childbirth.",
            "Paternity leave is also applicable in cases of legal adoption of an infant under one year of age. Paternity leave must be "
            "applied on Ultimatix along with a copy of the hospital birth certificate or official legal adoption documentation. Unused "
            "paternity leave automatically lapses upon completion of 6 months from the date of childbirth and cannot be encashed or carried forward.",
            ["Paternity Parameter", "Policy Entitlement", "Administrative Rule", "Ultimatix Verification Requirement"],
            [
                ["Eligible Associates", "Confirmed Male Associates", "Up to 2 surviving children", "Valid marriage / family record"],
                ["Leave Duration", "5 Working Days (40 Hours)", "100% Full Fixed Salary", "Ultimatix ESS submission"],
                ["Availing Window", "Within 6 Months of Childbirth", "Maximum 2 separate tranches", "Hospital discharge / Birth cert"],
                ["Adoption Equivalence", "5 Working Days for Infant < 1 Yr", "From legal handover date", "Court-certified adoption deed"],
                ["Carryover / Encashment", "Strict Zero Carryover / Lapse", "No cash value upon expiry", "Automatic system expiry"],
            ],
            [110, 135, 145, 150],
            [
                "Associates should notify their project manager at least 15 calendar days in advance of the expected delivery window.",
                "Emergency paternity leave can be applied retrospectively within 5 business days of child delivery.",
                "Paternity leave cannot be combined with long unapproved absences or unauthorized sabbaticals.",
            ],
            "NEW FATHER ENGAGEMENT & WELLNESS:",
            "TCS encourages new fathers to actively participate in early parental care. Paternity leave provides dedicated time without "
            "impacting annual earned leave or performance appraisal standing."
        ),
        make_article(
            "Article 7. Bereavement Leave & Compassionate Absence Provisions",
            "7.1 Compassionate Bereavement Allocation, Family Tiers & Travel Consideration",
            "TCS recognizes that the loss of an immediate family member is an emotionally challenging life event. All associates "
            "are entitled to paid Bereavement Leave to grieve, attend funeral rites, and fulfill domestic responsibilities. "
            "Bereavement leave is fully paid and does not deduct from the associate's Earned Leave or Casual Leave balances.",
            "Entitlement is categorized by family relationship tier: Tier 1 Immediate Family (Spouse, Children, Father, Mother, Brother, Sister, "
            "Father-in-law, Mother-in-law) provides up to 5 consecutive working days. Tier 2 Extended Family (Grandparents, Grandchildren) "
            "provides up to 3 working days. An additional 2 days may be sanctioned by the Unit HR where domestic or international travel "
            "exceeding 500 kilometers is necessary.",
            ["Relationship Tier", "Covered Family Members", "Paid Leave Entitlement", "Travel Extension Allowance"],
            [
                ["Tier 1 - Immediate Family", "Spouse, Children, Father, Mother, Brother, Sister", "5 Consecutive Working Days", "+2 Days for travel > 500 km"],
                ["Tier 1 - In-Laws", "Father-in-law, Mother-in-law, Daughter/Son-in-law", "5 Consecutive Working Days", "+2 Days for travel > 500 km"],
                ["Tier 2 - Extended Family", "Grandparents, Grandchildren, Legal Guardians", "3 Consecutive Working Days", "Manager discretion"],
                ["Stillbirth / Fetal Loss", "Spouse in case of stillbirth post-20 weeks", "5 Consecutive Working Days", "Medical verification"],
            ],
            [110, 175, 125, 130],
            [
                "Bereavement leave should be notified to the supervisor immediately and formalized in Ultimatix within 5 days of resume.",
                "Documentation such as death certificate or obituary notice may be requested by Unit HR for statutory audit records.",
                "Additional leave required beyond the bereavement entitlement may be combined with Earned Leave upon request.",
            ],
            "COMPASSIONATE SUPPORT SERVICES:",
            "Associates experiencing grief and bereavement may access confidential counseling services 24/7 through the TCS Employee "
            "Assistance Program (EAP) and Fit4Life wellness partner portals."
        ),
        make_article(
            "Article 8. Compensatory Off (Comp-Off) & Weekend Project Support Governance",
            "8.1 Comp-Off Eligibility, Weekend Shift Rules & 60-Day Utilization Window",
            "When exceptional project exigencies, critical production deployments, emergency system outages, or client go-lives require "
            "an associate in Band Y, C1, C2, or C3 to work on a scheduled weekly off day (Saturday/Sunday) or declared company holiday, "
            "the associate is eligible for a Compensatory Off (Comp-off) credit. Working on a holiday must have prior electronic pre-authorization "
            "from the Project Manager (PM) and Delivery Head (DH) in Ultimatix.",
            "To qualify for a full day Comp-off, the associate must log a minimum of 8 active working hours on the turnstile access system "
            "and project timesheet. Working between 4 and 8 hours entitles the associate to a half-day Comp-off. Comp-off credits must be "
            "utilized within 60 calendar days from the date of work. Unutilized Comp-off balances automatically expire after 60 days without "
            "encashment. A maximum of 2 Comp-off days may be availed in a single calendar month.",
            ["Shift Effort Logged", "Comp-Off Credit Entitlement", "Turnstile Validation Rule", "Validity SLA"],
            [
                [">= 8 Hours Active Work", "1.0 Full Working Day Comp-Off", "Verified by Turnstile Badge & Timesheet", "Strict 60 Calendar Days"],
                ["4.0 - 7.9 Hours Active Work", "0.5 Half Working Day Comp-Off", "Verified by Turnstile Badge & Timesheet", "Strict 60 Calendar Days"],
                ["< 4.0 Hours Active Work", "Not Eligible for Comp-Off", "Counted as general project overtime", "Not Applicable"],
                ["Emergency On-Call Support", "0.5 Day per 4 hours active ticket work", "ITSM incident logs required", "Strict 60 Calendar Days"],
            ],
            [120, 140, 140, 140],
            [
                "Pre-approval for weekend working must be submitted on Ultimatix at least 48 hours prior to the scheduled weekend shift.",
                "Comp-off cannot be accumulated beyond 3 days at any given time to prevent fatigue and ensure continuous associate rest.",
                "Comp-off cannot be encashed upon separation and carries zero cash equivalent.",
            ],
            "MANDATORY PRE-APPROVAL PROTOCOL:",
            "Retrospective comp-off claims submitted after weekend work without prior PM authorization are rejected by Unit HR. "
            "Turnstile badge-in and badge-out records must precisely substantiate all weekend hours logged."
        ),
        make_article(
            "Article 9. Sabbatical Leave, Higher Education & Career Break Policy",
            "9.1 Higher Education Sabbatical, Fellowship Programs & Long-Term Leave Framework",
            "TCS recognizes the importance of continuous learning, advanced research, and academic enhancement. Confirmed associates "
            "with a minimum of 3 years of continuous, uninterrupted service at TCS and a consistent performance rating of Band B or above "
            "over the preceding two appraisal cycles are eligible to apply for an Academic Sabbatical to pursue full-time higher education "
            "(Master's, M.Tech, MS, MBA, or PhD) at an accredited national or international institution of repute.",
            "Academic Sabbaticals are granted for a duration of 12 to 24 months as unpaid leave with continuity of service preserved. "
            "Associates must execute a Service Commitment Agreement pledging to serve TCS for a minimum period of 12 months post-resumption. "
            "During the sabbatical, healthcare insurance under TCS-HIS may be continued subject to associate premium contribution. "
            "Re-absorption into TCS is guaranteed at a grade and compensation commensurate with the advanced qualification acquired.",
            ["Sabbatical Category", "Minimum Service Required", "Maximum Duration", "Approval Hierarchy"],
            [
                ["Higher Education (TCS TGS / Fellowship)", "3 Years Continuous Service", "Up to 24 Calendar Months", "Delivery Head & Global HR Head"],
                ["Specialized Research / PhD", "4 Years Continuous Service", "Up to 36 Calendar Months", "TCS Research & Corporate HR Head"],
                ["Personal Health / Family Sabbatical", "5 Years Continuous Service", "Up to 12 Calendar Months", "Unit HR Head & Medical Officer"],
                ["Public Service / National Fellowship", "3 Years Continuous Service", "Up to 24 Calendar Months", "Tata Sons Ethics & Legal Head"],
            ],
            [125, 125, 140, 150],
            [
                "Sabbatical applications must be initiated at least 90 calendar days prior to the proposed program commencement date.",
                "Associates on sabbatical are strictly prohibited from engaging in commercial dual employment or consulting.",
                "Bi-annual academic progress reports must be submitted to the TCS Talent Development Council.",
            ],
            "RE-ABSORPTION & TALENT INTEGRATION:",
            "Upon successful completion of the academic program, associates must report to the Corporate Talent Allocation Group (TAG) "
            "within 15 calendar days with original degree certificates and transcripts for re-deployment."
        ),
        make_article(
            "Article 10. Public Holidays, Festival Calendar & Regional Holiday Administration",
            "10.1 Annual Holiday Quota, Statutory Declarations & Restricted Holiday (RH) Framework",
            "TCS declares an annual schedule of 10 to 12 public holidays per calendar year for each delivery centre in accordance with "
            "applicable state government gazette notifications, the National and Festival Holidays Act, and regional cultural observances. "
            "Three National Holidays—Republic Day (Jan 26), Independence Day (Aug 15), and Mahatma Gandhi Jayanti (Oct 2)—are mandatory "
            "paid non-working holidays across all Indian facilities without exception.",
            "In addition to declared statutory holidays, associates are entitled to avail up to 2 Restricted Holidays (RH) / Floating Holidays "
            "from an approved list of regional and cultural festivals published on Ultimatix at the start of each calendar year. Restricted "
            "holidays must be applied on Ultimatix at least 7 days in advance and approved by the reporting manager based on project shift staffing.",
            ["Holiday Category", "Annual Allotment", "Statutory Classification", "Operating Rules"],
            [
                ["National Holidays (Mandatory)", "3 Days (Jan 26, Aug 15, Oct 2)", "Compulsory under Central Statute", "Zero commercial operations in ODCs"],
                ["Regional Festival Holidays", "7 - 9 Days per State", "State Government Gazette", "Branch specific; delivery rota maintained"],
                ["Restricted / Floating Holidays", "2 Days per Associate", "Optional Cultural / Faith-based", "Subject to project team coverage"],
                ["Client-Aligned Holidays", "Project Specific Alignment", "Client MSA calendar agreement", "Comp-off provided for worked holidays"],
            ],
            [120, 120, 150, 150],
            [
                "Associates working on 24x7 mission-critical client support rotas on declared holidays receive Comp-off plus holiday allowance.",
                "Holiday schedules for each geographic delivery center are published on Ultimatix annually by December 15th.",
                "Holidays falling on Saturday or Sunday do not roll over to Monday unless mandated by state government notification.",
            ],
            "MISSION CRITICAL ROTATIONAL SUPPORT:",
            "Associates supporting live international financial or healthcare infrastructure on Indian public holidays must ensure "
            "designated standby coverage. Shift allowances and compensatory credits are processed through automated payroll."
        ),
        make_article(
            "Article 11. Unauthorized Absence, Loss of Pay (LOP) & Disciplinary Framework",
            "11.1 Abandonment of Service, Biometric Discrepancy & Standing Orders Enforcement",
            "Absence from work without prior approved leave on Ultimatix or failure to report for scheduled shift duties without "
            "intimating the reporting manager is classified as Unauthorized Absence and constitutes an act of gross misconduct under the "
            "TCS Certified Standing Orders and Tata Code of Conduct Clause 4. Unauthorized absence is marked as Loss of Pay (LOP) and "
            "results in proportional deduction from monthly salary, variable performance pay, and quarterly bonus allocation.",
            "If an associate remains absent without sanctioned leave or official communication for 8 consecutive working days, a formal "
            "Show Cause Notice is dispatched to the associate's registered address and personal email giving 7 calendar days to report. "
            "Failure to report or provide satisfactory medical explanation upon expiry of the notice period results in automated separation "
            "due to Voluntary Abandonment of Employment, forfeiture of notice pay, and issuance of negative separation credentials.",
            ["Absence Span", "Classification & System Status", "Administrative Action", "Disciplinary Consequence"],
            [
                ["1 - 2 Days Uninformed", "Unauthorized Absence / LOP", "Manager alert & LOP payroll flag", "Loss of pay for absent days"],
                ["3 - 7 Days Uninformed", "Continued Gross Misconduct", "Unit HR escalation & telephone reachout", "Written reprimand in personal file"],
                ["8 Consecutive Days", "Deemed Service Abandonment", "Registered Show Cause Notice issued", "Notice pay recovery initiated"],
                ["15 Days Post-Notice", "Formal Termination of Service", "Final dismissal letter dispatched", "Negative separation / Relieving withheld"],
                ["Biometric Badge Fraud", "Severe TCoC Ethical Breach", "Disciplinary Inquiry Committee", "Immediate summary termination"],
            ],
            [110, 140, 140, 150],
            [
                "Biometric badge-in records are matched daily with Ultimatix timesheet entries to detect proxy or fraudulent punching.",
                "Associates placed on Loss of Pay for more than 15 days in a calendar year forfeit pro-rated quarterly performance pay.",
                "Disciplinary appeals against LOP deductions must be submitted to the Regional Associate Relations Committee within 15 days.",
            ],
            "ZERO TOLERANCE FOR SERVICE ABANDONMENT:",
            "TCS maintains zero tolerance for unauthorized walkouts or mid-project disappearances. Service abandonment damages client "
            "delivery trust, triggers statutory recovery proceedings, and permanently disbars the candidate from Tata Group re-hire."
        ),
        make_article(
            "Article 12. Ultimatix Global HR Workflow, Leave Regularization & Approvals",
            "12.1 End-to-End ESS Workflow, Supervisory Delegation & Payroll Cutoff Timeline",
            "All leave transactions—including applications, modifications, cancellations, comp-off credits, and attendance regularizations—"
            "must be executed exclusively through the TCS Ultimatix Global HR web portal or the Ultimatix Mobile Application. "
            "Voice requests, verbal assurances, instant messenger communications, or informal email notices do not constitute valid leave "
            "authorization and will not prevent automated turnstile access disablement or Loss of Pay payroll deductions.",
            "Reporting managers must action pending leave applications within 48 business hours of receipt. If an approval remains un-actioned "
            "for more than 72 hours, the workflow automatically auto-escalates to the Project Delivery Manager (DM). The monthly payroll cutoff "
            "date is strictly the 20th of each calendar month. Any leave taken prior to the 20th that remains unapproved as of 23:59 on the 20th "
            "will reflect as Loss of Pay in the current month's salary, with adjustment deferred to the subsequent month's payroll cycle.",
            ["Workflow Stage", "Responsible Party", "System SLA", "Escalation Hierarchy"],
            [
                ["Leave Submission", "Associate (ESS)", "14 Days prior for EL; 2 hrs for CL/SL", "Ultimatix Global Portal / App"],
                ["Supervisory Review", "Reporting Manager / Project Lead", "48 Hours SLA", "Auto-escalates to Delivery Manager at 72h"],
                ["Medical Verification", "OHC / Unit HR Specialist", "3 Business Days SLA", "Escalates to Regional Medical Officer"],
                ["Monthly Payroll Cutoff", "Corporate Payroll Group", "20th of each calendar month", "Salary lock; LOP freeze at 23:59"],
                ["Retrospective Regularization", "Associate & Unit HR", "Within 30 days of occurrence", "Delivery Head approval required"],
            ],
            [110, 140, 140, 150],
            [
                "Delegation of leave approval authority must be configured in Ultimatix when a manager is scheduled to be on leave.",
                "Turnstile gate pass entries for personal mid-day exits exceeding 2 hours require manager regularization in Ultimatix.",
                "Annual leave audit trails are preserved in the SAP/Ultimatix core database for a statutory period of 7 years.",
            ],
            "MANDATORY DIGITAL COMPLIANCE STATEMENT:",
            "Compliance with Ultimatix digital leave administration is mandatory for all TCS associates globally. Transparent, timely "
            "reporting reinforces the core Tata values of integrity, responsibility, and excellence."
        )
    ]

    return {
        "filename": "leave_policy.pdf",
        "meta": {
            "id": "TCS-HR-POL-001",
            "title": "TCS Global Associate Leave Policy & Attendance Guidelines",
            "category": "Workforce Management | Leave Administration",
            "eff_date": "January 1, 2026",
        },
        "sections": sections
    }
