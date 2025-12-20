import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserRole, UserWithRole, roleDashboardRoutes } from '@/lib/roles';

interface AuthState {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userRole: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          const role = (userData?.role as UserRole) || 'superadmin'; // Default to superadmin if no role document exists

          setAuthState({
            user,
            userRole: role,
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error fetching user role:', error);
          setAuthState({
            user,
            userRole: null,
            isLoading: false,
            isAuthenticated: true,
          });
        }
      } else {
        setAuthState({
          user: null,
          userRole: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const getDashboardRoute = (): string => {
    if (!authState.userRole) return '/admin/login';
    return roleDashboardRoutes[authState.userRole];
  };

  return {
    ...authState,
    getDashboardRoute,
  };
};

export default useAuth;
