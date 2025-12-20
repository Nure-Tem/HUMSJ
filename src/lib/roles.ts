// User roles and permissions for HUMSJ subsectors

export type UserRole = 'superadmin' | 'qirat' | 'dawa' | 'charity';

export interface UserWithRole {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

// Define what each role can access
export const rolePermissions: Record<UserRole, string[]> = {
  superadmin: ['all'], // Can access everything
  qirat: ['posts', 'media'], // Qirat manages Quran recitation content
  dawa: ['posts', 'media', 'contacts'], // Dawa manages outreach and messages
  charity: ['helpRegistrations', 'childrenRegistrations', 'monthlyCharityRegistrations', 'charityDistributions'], // Charity manages all charity-related
};

// Dashboard routes for each role
export const roleDashboardRoutes: Record<UserRole, string> = {
  superadmin: '/admin/dashboard',
  qirat: '/admin/qirat',
  dawa: '/admin/dawa',
  charity: '/admin/charity',
};

// Role display names
export const roleDisplayNames: Record<UserRole, string> = {
  superadmin: 'Super Admin',
  qirat: 'Qirat Department',
  dawa: 'Dawa Department',
  charity: 'Charity Department',
};

// Check if a role has access to a specific resource
export const hasAccess = (role: UserRole, resource: string): boolean => {
  if (role === 'superadmin') return true;
  return rolePermissions[role].includes(resource);
};
