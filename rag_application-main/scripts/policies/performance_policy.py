"""TCS Performance Management, GEMS & Career Growth (TCS-HR-POL-007) dense content module."""
from policies.common import make_article

def get_document():
    sections = [
        make_article(
            "Article 1. Performance Management Philosophy & Balanced Scorecard Architecture",
            "1.1 Annual Appraisal Cycle, Balanced Scorecard & Key Result Areas (KRAs)",
            "Tata Consultancy Services (TCS) fosters an environment of meritocracy, continuous professional growth, customer centricity, "
            "and technical innovation. The Performance Management System is designed to align individual associate contributions with "
            "organizational strategic priorities, customer delivery commitments, and the Tata values of excellence and pioneering leadership. "
            "The performance cycle operates across the financial year (April 1 to March 31), comprising Annual Goal Setting, Mid-Year Reviews, "
            "Continuous Feedback, and the Annual Appraisal Assessment.",
            "Associate performance is evaluated using a comprehensive Balanced Scorecard structured across four strategic dimensions: "
            "Business & Delivery Excellence (milestone adherence, code quality, defect density); Customer Success (client satisfaction ratings, "
            "stakeholder feedback); Competency & Innovation (iEvolve learning hours, technology certifications, patent filings); and Process "
            "& TCoC Compliance (adherence to delivery frameworks, security standards, and 85% in-office turnstile attendance).",
            ["Scorecard Dimension", "Performance Metric & KPI", "Weightage Range", "Evaluation Mechanism"],
            [
                ["Business & Delivery Excellence", "SLA compliance, delivery velocity, zero critical defects", "35% - 45% Weightage", "PMS Metrics & JIRA Deliverables"],
                ["Customer Centricity & CSAT", "Client feedback scores, proactive value adds, stakeholder NPS", "20% - 25% Weightage", "Quarterly Client CSAT Audits"],
                ["Competency & Continuous Learning", "40+ iEvolve learning hours, T-Factor score, digital badges", "15% - 20% Weightage", "iEvolve Learning Records"],
                ["Process & TCoC Compliance", "ISMS adherence, turnstile RTO compliance, timecard accuracy", "15% - 20% Weightage", "Automated Turnstile & Audit Logs"],
            ],
            [125, 145, 135, 135],
            [
                "Goal setting must be completed on Ultimatix by May 15th for the active financial year in consultation with the project manager.",
                "Mid-Year Reviews conducted in October assess progress against milestones and provide structured coaching to course-correct.",
                "Performance ratings directly influence Annual Merit Increments, Quarterly Performance Pay (QPP), and grade progression.",
            ],
            "PERFORMANCE EXCELLENCE PHILOSOPHY:",
            "Performance evaluation at TCS is an objective, transparent, and continuous process. Objective metrics and peer collaboration "
            "ensure every associate has a clear pathway to high achievement and career fulfillment."
        ),
        make_article(
            "Article 2. 5-Tier Relative Rating Distribution, Calibration Governance & GEMS Framework",
            "2.1 5-Point Rating Scale, Guided Normalization Curve & Calibration Committee Oversight",
            "To ensure absolute fairness, equity, and consistency across diverse global business units, engineering practices, and client "
            "accounts, TCS utilizes a standardized 5-Tier Relative Performance Rating Scale. Ratings are finalized through structured "
            "Normalization and Calibration Committees comprising Delivery Center Heads, Unit HR Leaders, and independent moderation panels.",
            "The rating distribution follows a guided performance curve: Band A (Top 10-15%: Outstanding Role Model); Band B (30-40%: Consistently "
            "Exceeds Expectations); Band C (35-45%: Meets Expectations / Solid Contributor); Band D (5-10%: Partially Meets Expectations / Needs "
            "Development); and Band E (< 5%: Unsatisfactory Performance). Calibration committees review peer group metrics to eliminate "
            "evaluator leniency or bias before finalizing annual ratings in Ultimatix GEMS.",
            ["Rating Band / Level", "Performance Standard Definition", "Guided Distribution", "Compensation & Growth Impact"],
            [
                ["Band A (Outstanding)", "Role model performance; exceptional delivery & innovation", "10% - 15% of Unit", "Maximum increment, top QPP & fast-track promotion"],
                ["Band B (Exceeds Expectations)", "Consistently surpasses project SLAs; proactive contributor", "30% - 40% of Unit", "Strong increment, standard QPP & promotion eligibility"],
                ["Band C (Meets Expectations)", "Reliable delivery of assigned responsibilities; valued peer", "35% - 45% of Unit", "Market increment, standard QPP payout"],
                ["Band D (Needs Development)", "Inconsistent performance; misses delivery deadlines", "5% - 10% of Unit", "Minimal increment; mandatory Performance Improvement Plan"],
                ["Band E (Unsatisfactory)", "Fails critical delivery commitments; quality defects", "< 5% of Unit", "Zero increment; strict PIP or separation review"],
            ],
            [120, 140, 130, 150],
            [
                "Individual ratings are confidential between the associate, reporting manager, and corporate HR.",
                "Associates rated Band A or Band B are prioritized for high-visibility international projects and global client deputations.",
                "Associates dissatisfied with their appraisal rating may log a formal appeal with the Regional Talent Grievance Council within 14 days.",
            ],
            "CALIBRATION FAIRNESS & OBJECTIVITY MANDATE:",
            "Calibration committees ensure that high performance is recognized equitably across all technology practices. Objective deliverables, "
            "customer testimonials, and technical certifications substantiate all rating allocations."
        ),
        make_article(
            "Article 3. iEvolve Learning Framework, T-Factor Competency & Digital Badging",
            "3.1 40-Hour Annual Learning Mandate, T-Factor Readiness & Competency Assessments",
            "In an era of rapid technological disruption, generative AI advancement, cloud modernization, and evolving client ecosystems, "
            "continuous upskilling is essential for sustained professional relevance. Under the TCS iEvolve Learning Framework, every associate "
            "is required to complete a minimum of 40 verified learning hours per financial year across approved technical, architectural, "
            "domain, and professional development programs.",
            "TCS tracks associate technological readiness through the proprietary T-Factor Score, which measures multi-technology versatility, "
            "deep contextual knowledge, and mastery of emerging digital skills (Cloud, AI/ML, Cybersecurity, Enterprise Agility). Achieving a "
            "high T-Factor score is a mandatory prerequisite for promotion to senior engineering and leadership bands. Associates who complete "
            "external industry certifications (AWS, Azure, GCP, PMP, TOGAF) receive corporate reimbursement and milestone bonuses.",
            ["Learning Pillar", "Mandatory Annual Requirement", "Evaluation Metric", "Career Development Benefit"],
            [
                ["Annual Learning Hours", "Minimum 40 Verified Hours / Year", "iEvolve Automated Course Tracking", "Mandatory gate for annual appraisal"],
                ["T-Factor Competency Score", "Target T-Factor >= 1.5 - 2.5 by Band", "Multi-skill technology assessment", "Mandatory eligibility for promotion"],
                ["Digital Badges / Milestones", "Completion of specialized learning paths", "Verifiable digital credentials", "Priority allocation to flagship accounts"],
                ["External Industry Certifications", "Hyperscaler & professional credentials", "Corporate fee reimbursement", "Direct milestone incentive bonuses"],
                ["Leadership Development", "Executive modules for Bands C3+", "TCS Leadership Institute (TLI)", "Preparation for Delivery Manager roles"],
            ],
            [125, 140, 135, 140],
            [
                "iEvolve offers on-demand access to 10,000+ courses, virtual cloud labs, interactive sandboxes, and expert masterclasses.",
                "Completing mandatory statutory modules (TCoC, ISMS, POSH, Anti-Bribery) does not count toward the 40-hour technical requirement.",
                "Associates are entitled to dedicated learning hours during non-peak project hours with manager concurrence.",
            ],
            "IEVOLVE LIFELONG LEARNING COMMITMENT:",
            "Upskilling is central to the TCS associate value proposition. Continuous learning empowers our associates to remain industry leaders, "
            "drive digital innovation, and deliver extraordinary business outcomes for global customers."
        ),
        make_article(
            "Article 4. Performance Improvement Plan (PIP) & Performance Enablement Framework",
            "4.1 Structured 30-to-60 Day PIP, Weekly Milestones, Mentorship & Review Governance",
            "TCS is committed to supporting associates experiencing temporary performance challenges through structured performance enablement "
            "and professional coaching. Associates whose delivery velocity, technical quality, or appraisal rating falls into Band D or Band E "
            "are placed on a structured Performance Improvement Plan (PIP) designed to clarify role expectations, identify skill gaps, and "
            "provide intensive supervisory mentoring to restore performance to expected standards.",
            "The PIP operates for a structured duration of 30 to 60 calendar days. At the commencement of the PIP, a formal document outlining "
            "specific, measurable weekly deliverables, quality benchmarks, and turnaround milestones is drafted jointly by the Project Manager "
            "and Unit HR Specialist. The associate is paired with a designated senior technical mentor, and formal progress reviews are conducted "
            "weekly. If the associate demonstrates sustained improvement, the PIP is successfully concluded; failure to meet required benchmarks "
            "results in role reassignment or separation for performance incapacity.",
            ["PIP Stage / Milestone", "Timeframe / Cadence", "Responsible Stakeholders", "Outcome & Evaluation Criteria"],
            [
                ["PIP Initiation & Goal Setting", "Day 1 of Enablement Window", "Project Manager, Unit HR & Associate", "Signoff on weekly milestones & SLAs"],
                ["Weekly Mentoring Reviews", "Every Friday during PIP Window", "Designated Mentor & Associate", "Objective review of completed tickets & code"],
                ["Mid-Term HR Checkpoint", "Day 15 (30-day) or Day 30 (60-day)", "Unit HR Specialist & Delivery Lead", "Formal evaluation of trajectory and progress"],
                ["Final Performance Evaluation", "Day 30 / Day 60 (Conclusion)", "Delivery Centre Head & HR Panel", "Comprehensive assessment against benchmarks"],
                ["Successful Exit / Resolution", "Upon meeting all milestones", "Unit HR Signoff", "Re-instatement to regular project standing"],
            ],
            [120, 135, 140, 145],
            [
                "Associates placed on PIP must participate constructively in all scheduled mentoring sessions and code reviews.",
                "Turnstile attendance must remain at 100% compliance during the active PIP window; unapproved absences extend or terminate the plan.",
                "Associates unable to meet PIP benchmarks receive statutory notice pay and severance in accordance with their employment agreement.",
            ],
            "OBJECTIVE & TRANSPARENT ENABLEMENT:",
            "The Performance Improvement Plan is a genuine development opportunity designed to restore professional success. All milestones "
            "are transparent, objective, and supported by dedicated managerial guidance."
        ),
        make_article(
            "Article 5. Career Ladders, Technical Specialization Tracks & Promotion Cycles",
            "5.1 Dual-Track Career Progression, Technical Fellowships & Annual Promotion Windows",
            "TCS provides dynamic, multi-dimensional career paths that empower associates to achieve leadership excellence according to "
            "their individual passions and professional talents. Career progression is structured around two parallel, equally valued tracks: "
            "the Technical / Architecture Track (for software engineers, systems specialists, solutions architects, and Chief Technology Officers) "
            "and the Delivery / Management Track (for project managers, delivery leads, business relationship managers, and business unit heads).",
            "Annual promotions are evaluated during the April appraisal cycle by the Regional Talent Review Board. Eligibility criteria require "
            "a minimum tenure of 2 to 3 years in the current grade, consistent Band A or Band B performance ratings over the preceding two cycles, "
            "achievement of required T-Factor competency thresholds, 85% in-office turnstile attendance compliance, and completion of mandatory "
            "leadership development milestones on iEvolve. High-potential associates may be recommended for fast-track out-of-turn promotions.",
            ["Career Progression Track", "Grade Hierarchy Progression", "Core Focus & Key Competencies", "Key Evaluation Criteria"],
            [
                ["Engineering & Architecture", "ASE -> SE -> ITA -> Specialist -> Chief Architect", "Hands-on code mastery, architecture, patents", "Technical rigor, certifications & T-Factor"],
                ["Delivery & Operations Track", "Project Lead -> PM -> DM -> Practice Lead", "Client governance, P&L, agile delivery velocity", "CSAT, delivery margins & SLA track record"],
                ["Domain & Business Consulting", "Associate Consultant -> Senior Consultant -> Partner", "Industry domain expertise (BFSI, Retail, Health)", "Business development, thought leadership"],
                ["Fast-Track Out-of-Turn Track", "Accelerated 1-Year Grade Jump", "Exceptional patent / client transformational value", "Executive Leadership Board approval"],
            ],
            [120, 135, 145, 140],
            [
                "Promotion recommendations are initiated by delivery managers in Ultimatix GEMS and moderated by the Talent Review Board.",
                "Promoted associates receive revised compensation bands, new corporate designations, and enhanced variable pay ceilings.",
                "TCS promotes diversity and inclusion in all leadership talent pipelines, ensuring equitable representation across all practices.",
            ],
            "UNLIMITED GLOBAL CAREER HORIZONS:",
            "With operations across 55 countries and a global workforce of over 600,000 associates, TCS offers unmatched opportunities for "
            "cross-geography mobility, multidisciplinary career transitions, and visionary leadership development."
        )
    ]

    return {
        "filename": "performance_and_growth_policy.pdf",
        "meta": {
            "id": "TCS-HR-POL-007",
            "title": "TCS Performance Management, GEMS & Career Development",
            "category": "Talent Development | Performance Management",
            "eff_date": "January 1, 2026",
        },
        "sections": sections
    }
