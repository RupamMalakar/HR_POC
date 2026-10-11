export interface AppUser {
  id: string; // HR001, HR002, HR003, EMP001, EMP002, EMP003, EMP004, ADM001, etc.
  name: string;
  email: string;
  department: string;
  role: string;
  roles?: string[]; // Array of assigned multi-roles: ['ADMIN', 'EMPLOYEE', 'HR_LEAD', 'HR_SPECIALIST']
  systemRole?: 'ADMIN' | 'HR_LEAD' | 'HR_SPECIALIST' | 'EMPLOYEE';
  status?: 'active' | 'inactive';
  isHr: boolean;
  avatar: string;
  avatarUrl: string; // alias for compatibility
  title: string;     // alias for compatibility
  securityLevel?: number;
  tenure?: string;
}

export function getUserRoles(user: { roles?: string[]; role?: string; systemRole?: string; isHr?: boolean } | null | undefined): string[] {
  if (!user) return [];
  const set = new Set<string>();

  if (Array.isArray(user.roles)) {
    user.roles.forEach((r) => {
      if (r) {
        const norm = String(r).trim().toUpperCase();
        if (norm === 'HR_ADMIN') set.add('ADMIN');
        else if (['ADMIN', 'EMPLOYEE', 'HR_LEAD', 'HR_SPECIALIST'].includes(norm)) set.add(norm);
        else set.add(norm);
      }
    });
  }

  if (user.role) {
    const r = String(user.role).trim().toUpperCase();
    if (r === 'ADMIN' || r === 'HR_ADMIN') set.add('ADMIN');
    else if (r === 'EMPLOYEE') set.add('EMPLOYEE');
    else if (r === 'HR_LEAD') set.add('HR_LEAD');
    else if (r === 'HR_SPECIALIST') set.add('HR_SPECIALIST');
    else if (user.isHr) {
      if (r.includes('LEAD')) set.add('HR_LEAD');
      else if (r.includes('SPECIALIST')) set.add('HR_SPECIALIST');
    }
  }

  if (user.systemRole) {
    const sr = String(user.systemRole).trim().toUpperCase();
    if (sr === 'HR_ADMIN') set.add('ADMIN');
    else set.add(sr);
  }

  if (user.isHr && !set.has('HR_LEAD') && !set.has('HR_SPECIALIST') && !set.has('ADMIN')) {
    set.add('HR_SPECIALIST');
  }

  if (set.size === 0) {
    set.add(user.isHr ? 'HR_SPECIALIST' : 'EMPLOYEE');
  }

  return Array.from(set);
}

export type PortalType = 'admin' | 'hr' | 'employee';

/**
 * Authoritative portal priority resolver:
 * 1. ADMIN (or multi-role containing ADMIN) -> 'admin'
 * 2. HR_LEAD or HR_SPECIALIST -> 'hr'
 * 3. EMPLOYEE -> 'employee'
 */
export function determineDefaultPortal(user: { roles?: string[]; role?: string; systemRole?: string; isHr?: boolean } | null | undefined): PortalType {
  if (!user) return 'employee';
  const roles = getUserRoles(user);

  if (roles.includes('ADMIN')) {
    return 'admin';
  }

  if (roles.includes('HR_LEAD') || roles.includes('HR_SPECIALIST')) {
    return 'hr';
  }

  if (roles.includes('EMPLOYEE')) {
    return 'employee';
  }

  if (user.isHr) {
    return 'hr';
  }

  return 'employee';
}

/**
 * Strict role-based portal permission check:
 * - 'admin' requires ADMIN
 * - 'hr' requires HR_LEAD or HR_SPECIALIST
 * - 'employee' requires EMPLOYEE
 */
export function canAccessPortal(user: { roles?: string[]; role?: string; systemRole?: string; isHr?: boolean } | null | undefined, portal: PortalType): boolean {
  if (!user) return false;
  const roles = getUserRoles(user);

  if (portal === 'admin') {
    return roles.includes('ADMIN');
  }

  if (portal === 'hr') {
    return roles.includes('HR_LEAD') || roles.includes('HR_SPECIALIST') || !!user.isHr;
  }

  if (portal === 'employee') {
    return roles.includes('EMPLOYEE');
  }

  return false;
}

export const MOCK_USERS: AppUser[] = [
  // 1. HR Operations Users
  {
    id: 'HR001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@enterprise.internal',
    department: 'HR Operations',
    role: 'HR_SPECIALIST',
    systemRole: 'HR_SPECIALIST',
    roles: ['HR_SPECIALIST'],
    title: 'Senior HR Specialist',
    status: 'active',
    isHr: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    securityLevel: 2,
    tenure: '5 years'
  },
  {
    id: 'HR002',
    name: 'Marcus Vance',
    email: 'marcus.vance@enterprise.internal',
    department: 'HR Operations',
    role: 'HR_SPECIALIST',
    systemRole: 'HR_SPECIALIST',
    roles: ['HR_SPECIALIST'],
    title: 'Senior HR Benefits & Leave Specialist',
    status: 'active',
    isHr: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    securityLevel: 2,
    tenure: '3 years'
  },
  {
    id: 'HR003',
    name: 'Elena Rostova',
    email: 'elena.rostova@enterprise.internal',
    department: 'HR Operations',
    role: 'HR_SPECIALIST',
    systemRole: 'HR_SPECIALIST',
    roles: ['HR_SPECIALIST'],
    title: 'Payroll & Compliance Specialist',
    status: 'active',
    isHr: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    securityLevel: 2,
    tenure: '4 years'
  },

  // 2. Employees
  {
    id: 'EMP001',
    name: 'Alex Johnson',
    email: 'alex.johnson@enterprise.internal',
    department: 'Engineering',
    role: 'Senior Staff Engineer',
    systemRole: 'EMPLOYEE',
    roles: ['EMPLOYEE'],
    title: 'Senior Staff Engineer',
    status: 'active',
    isHr: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    securityLevel: 1,
    tenure: '4 years'
  },
  {
    id: 'EMP002',
    name: 'Rupam Sharma',
    email: 'rupam.sharma@enterprise.org',
    department: 'Product Engineering',
    role: 'Lead Full-Stack Engineer',
    systemRole: 'EMPLOYEE',
    roles: ['EMPLOYEE'],
    title: 'Lead Full-Stack Engineer',
    status: 'active',
    isHr: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    securityLevel: 1,
    tenure: '2 years'
  },
  {
    id: 'EMP003',
    name: 'Maya Patel',
    email: 'maya.patel@enterprise.internal',
    department: 'Design & Product',
    role: 'EMPLOYEE',
    systemRole: 'EMPLOYEE',
    roles: ['EMPLOYEE'],
    title: 'Product Manager',
    status: 'active',
    isHr: false,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
    securityLevel: 1,
    tenure: '3 years'
  },
  {
    id: 'EMP004',
    name: 'David Chen',
    email: 'david.chen@enterprise.internal',
    department: 'People Operations',
    role: 'HR_LEAD',
    systemRole: 'HR_LEAD',
    roles: ['HR_LEAD'],
    title: 'People Operations & HR Lead',
    status: 'active',
    isHr: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    securityLevel: 2,
    tenure: '3 years'
  },

  // 3. Multi-Role & Single-Role Test Personas
  {
    id: 'ADM001',
    name: 'John Smith',
    email: 'john.smith@enterprise.internal',
    department: 'IT Security & Compliance',
    role: 'ADMIN',
    systemRole: 'ADMIN',
    roles: ['ADMIN'],
    title: 'Infrastructure Administrator',
    status: 'active',
    isHr: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
    securityLevel: 3,
    tenure: '2 years'
  },
  {
    id: 'ADM002',
    name: 'Rachel Adams',
    email: 'rachel.adams@enterprise.internal',
    department: 'Engineering Leadership',
    role: 'ADMIN',
    systemRole: 'ADMIN',
    roles: ['ADMIN', 'EMPLOYEE'],
    title: 'VP of Engineering & System Administrator',
    status: 'active',
    isHr: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    securityLevel: 3,
    tenure: '4 years'
  },
  {
    id: 'ADM003',
    name: 'Marcus Lee',
    email: 'marcus.lee@enterprise.internal',
    department: 'People Operations',
    role: 'ADMIN',
    systemRole: 'ADMIN',
    roles: ['ADMIN', 'HR_SPECIALIST'],
    title: 'HR Systems Administrator & Specialist',
    status: 'active',
    isHr: true,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
    securityLevel: 3,
    tenure: '3 years'
  },
  {
    id: 'ALX001',
    name: 'Alex Johnson (Admin + Emp)',
    email: 'alex.admin.emp@enterprise.internal',
    department: 'Engineering',
    role: 'ADMIN',
    systemRole: 'ADMIN',
    roles: ['ADMIN', 'EMPLOYEE'],
    title: 'Lead Systems Architect & Employee',
    status: 'active',
    isHr: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    securityLevel: 3,
    tenure: '4 years'
  },
  {
    id: 'ALX002',
    name: 'Alex Johnson (Admin + HR Lead)',
    email: 'alex.admin.hr@enterprise.internal',
    department: 'People Operations',
    role: 'ADMIN',
    systemRole: 'ADMIN',
    roles: ['ADMIN', 'HR_LEAD'],
    title: 'Operations Director & HR Lead',
    status: 'active',
    isHr: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    securityLevel: 3,
    tenure: '4 years'
  },
  {
    id: 'ALX003',
    name: 'Alex Johnson (All Roles)',
    email: 'alex.all@enterprise.internal',
    department: 'Executive Governance',
    role: 'ADMIN',
    systemRole: 'ADMIN',
    roles: ['ADMIN', 'EMPLOYEE', 'HR_LEAD'],
    title: 'Executive Admin, HR Lead & Staff Engineer',
    status: 'active',
    isHr: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    securityLevel: 3,
    tenure: '4 years'
  }
];

export const ADMIN_USERS = MOCK_USERS.filter(u => getUserRoles(u).includes('ADMIN'));
export const HR_USERS = MOCK_USERS.filter(u => {
  const r = getUserRoles(u);
  return (r.includes('HR_LEAD') || r.includes('HR_SPECIALIST')) && !r.includes('ADMIN');
});
export const EMPLOYEE_USERS = MOCK_USERS.filter(u => {
  const r = getUserRoles(u);
  return r.includes('EMPLOYEE') && !r.includes('ADMIN') && !r.includes('HR_LEAD') && !r.includes('HR_SPECIALIST');
});

export function getUserById(id: string): AppUser | undefined {
  if (!id) return undefined;
  const normalized = id.trim().toUpperCase();
  return MOCK_USERS.find(u => u.id.toUpperCase() === normalized);
}

export function getUserByEmail(email: string): AppUser | undefined {
  if (!email) return undefined;
  const normalized = email.trim().toLowerCase();
  return MOCK_USERS.find(u => u.email.toLowerCase() === normalized);
}

export function findUserByQuery(query: string): AppUser | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  return MOCK_USERS.find(u => 
    u.id.toLowerCase() === q ||
    u.email.toLowerCase() === q ||
    u.name.toLowerCase().includes(q)
  );
}