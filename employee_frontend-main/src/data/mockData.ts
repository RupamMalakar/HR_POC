import { ASSETS } from './assets';
export { ASSETS };
import { EmployeeProfile, HrRequest, HolidayItem, LeaveBalance, PolicyItem, NotificationItem } from '../types';

export const CURRENT_USER: EmployeeProfile = {
  id: 'EMP-20491',
  name: 'Rupam Sharma',
  role: 'Lead Full-Stack Engineer',
  department: 'Core Platform & AI Systems',
  avatar: ASSETS.avatar,
  email: 'rupam.sharma@enterprise.org',
  workLocation: 'Bengaluru Tech Park / Hybrid',
  manager: 'Ananya Roy (Director of Engineering)',
  joiningDate: '15 March 2022',
  phone: '+91 98450 12384',
  bankName: 'HDFC Bank Ltd',
  accountNumberMasked: '•••• •••• •••• 4892',
  ifsc: 'HDFC0001245',
};

export const INITIAL_REQUESTS: HrRequest[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Welcome to your Employee Self-Service Desk',
    time: 'Just now',
    read: false,
    type: 'info',
  },
  {
    id: 'n2',
    title: 'New HR policy published: Hybrid Work Guidelines 2026',
    time: 'Yesterday',
    read: false,
    type: 'policy',
  },
  {
    id: 'n3',
    title: 'Upcoming Public Holiday: Gandhi Jayanti on 02 Oct',
    time: '3 days ago',
    read: true,
    type: 'info',
  },
];

export const UPCOMING_HOLIDAYS: HolidayItem[] = [
  {
    id: 'h1',
    dateNum: '02',
    monthText: 'OCT',
    name: 'Gandhi Jayanti',
    type: 'National Holiday',
    dayOfWeek: 'Friday',
    fullDate: '02 October 2026',
  },
  {
    id: 'h2',
    dateNum: '20',
    monthText: 'OCT',
    name: 'Diwali',
    type: 'Festival Holiday',
    dayOfWeek: 'Tuesday',
    fullDate: '20 October 2026',
  },
  {
    id: 'h3',
    dateNum: '25',
    monthText: 'DEC',
    name: 'Christmas',
    type: 'Public Holiday',
    dayOfWeek: 'Friday',
    fullDate: '25 December 2026',
  },
  {
    id: 'h4',
    dateNum: '01',
    monthText: 'JAN',
    name: 'New Year Day',
    type: 'Optional Holiday',
    dayOfWeek: 'Friday',
    fullDate: '01 January 2027',
  },
];

export const INITIAL_LEAVE_BALANCE: LeaveBalance = {
  casual: { remaining: 8, total: 12 },
  sick: { remaining: 6, total: 10 },
  earned: { remaining: 12, total: 18 },
};

export const POLICIES: PolicyItem[] = [
  {
    id: 'pol-1',
    title: 'Parental Leave Policy 2026',
    category: 'Leave & Family',
    summary: 'Updated paternity and adoption benefit guidelines effective starting this quarter.',
    image: ASSETS.parentalLeaveImg,
    tag: 'Featured Policy',
    featured: true,
    readTime: '4 min read',
    lastUpdated: '01 Aug 2026',
    content: [
      'The 2026 Parental Leave Policy expands coverage to all permanent full-time employees regardless of gender identity or family structure.',
      'Primary caregivers are entitled to 26 weeks of fully paid leave, which can be taken consecutively or split across the first 12 months after birth or adoption placement.',
      'Secondary caregivers receive 6 weeks of fully paid parental bonding leave, with an additional 2 weeks flexible return-to-work program.',
      'Employees returning from parental leave are guaranteed their prior role or an equivalent post with continuous performance rating protection.',
    ],
  },
  {
    id: 'pol-2',
    title: 'Annual Tax Declaration Guide',
    category: 'Payroll & Tax',
    summary: 'Submit proof of investment to prevent higher standard deductions for payroll.',
    image: ASSETS.taxDeclarationImg,
    tag: 'Self Service',
    featured: true,
    readTime: '6 min read',
    lastUpdated: '10 Sep 2026',
    content: [
      'Employees under the Old Tax Regime must submit Form 12BB along with proof of investment before 15 January 2027 to avoid elevated TDS deductions in Q4 pay cycles.',
      'Eligible exemptions include Section 80C (PPF, ELSS, Life Insurance up to ₹1,50,000), Section 80D (Health Insurance premiums up to ₹75,000 for family & senior parents), and Home Loan Interest under Section 24.',
      'If you have opted for the New Tax Regime (Default), standard deduction of ₹75,000 is applied automatically with no paperwork needed.',
      'Digitally signed receipts and policy schedules can be uploaded directly in the Employee Tax Portal.',
    ],
  },
  {
    id: 'pol-3',
    title: 'Hybrid Workplace Guidelines 2026',
    category: 'Workplace & IT',
    summary: 'Flexible work schedules, office desk booking, and remote collaboration standards.',
    readTime: '5 min read',
    lastUpdated: '15 Aug 2026',
    content: [
      'Employees are expected to work in-office an average of 2 to 3 days per week to support face-to-face team syncs and cross-functional whiteboarding.',
      'Core collaboration hours are 10:30 AM to 4:30 PM local time across all remote and hybrid offices.',
      'Employees traveling or temporarily working from an alternate domestic location may do so for up to 30 calendar days per fiscal year with manager pre-approval.',
    ],
  },
  {
    id: 'pol-4',
    title: 'Employee Medical & Health Insurance Plan',
    category: 'Benefits & Wellness',
    summary: 'Comprehensive hospitalization floater cover of ₹10,00,000 for self, spouse, and up to 2 children.',
    readTime: '8 min read',
    lastUpdated: '01 Jul 2026',
    content: [
      'Sum insured is ₹10 Lakhs base family floater with 0% co-pay at network hospitals nationwide.',
      'OPD consultation and dental/vision cover available up to ₹15,000 per financial year.',
      'Maternity hospitalization is covered up to ₹1,20,000 for normal and C-section deliveries with day-1 baby cover.',
      'Emergency cashless authorization helpline operates 24/7 via MediAssist TPA app or dial 1800-425-9449.',
    ],
  },
  {
    id: 'pol-5',
    title: 'Travel & Expense Reimbursement Policy',
    category: 'Finance & Payroll',
    summary: 'Per diem allowances, flight booking class rules, and meal reimbursement caps.',
    readTime: '7 min read',
    lastUpdated: '20 May 2026',
    content: [
      'All business travel bookings must be initiated via the Corporate Egencia Portal at least 14 days in advance for domestic travel.',
      'Daily meal allowance is capped at ₹2,200 for Metro cities (Tier 1) and ₹1,600 for Tier 2 cities without liquor expenses.',
      'Expense reports must be filed within 30 days of trip completion with original tax invoices attached.',
    ],
  },
];

export const KNOWLEDGE_FAQS = [
  {
    question: 'How do I claim medical insurance cashless reimbursement?',
    category: 'Benefits',
    answer: 'Show your MediAssist digital health card at the network hospital admission desk. For emergency hospitalization, inform the insurance desk within 24 hours. For non-network claims, collect all original discharge summaries, itemized bills, and submit a reimbursement claim in My Requests > Documents within 30 days.',
  },
  {
    question: 'What is the cutoff date for submitting monthly expense reimbursements?',
    category: 'Payroll',
    answer: 'Monthly claims submitted before the 20th of every month are disbursed along with that month’s salary on the last working day. Claims submitted after the 20th roll over to the following payroll cycle.',
  },
  {
    question: 'How can I request an experience or tenure certificate?',
    category: 'Documents',
    answer: 'Go to "Raise Request", select category "Documents", and choose "Employment Verification Letter" or "Experience Certificate". Digital certificates with cryptographic seals are dispatched within 2 business days.',
  },
  {
    question: 'What is the procedure for encashing unutilized earned leaves?',
    category: 'Leave',
    answer: 'Up to 30 earned leaves can be carried forward into the next calendar year. Any accumulated earned leave beyond 30 days is automatically encashed at basic salary rate during the March payroll cycle.',
  },
];
