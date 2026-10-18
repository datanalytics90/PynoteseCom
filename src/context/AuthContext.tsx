import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User } from '../firebaseClient';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPasscode: (passcode: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  loginWithGoogle: async () => {},
  loginWithPasscode: async () => false,
  logout: async () => {},
  getIdToken: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('pynotes_admin_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const profile = await res.json();
            setUserProfile(profile);
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      } else {
        const localAdminProfile = localStorage.getItem('pynotes_admin_profile');
        if (localAdminProfile) {
          try {
            setUserProfile(JSON.parse(localAdminProfile));
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign in error:', err);
      throw err;
    }
  };

  const loginWithPasscode = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('pynotes_admin_token', data.token);
        localStorage.setItem('pynotes_admin_profile', JSON.stringify(data.user));
        setUserProfile(data.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Passcode login failed:', e);
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem('pynotes_admin_token');
    localStorage.removeItem('pynotes_admin_profile');
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUserProfile(null);
  };

  const getIdToken = async (): Promise<string | null> => {
    const adminToken = localStorage.getItem('pynotes_admin_token');
    if (adminToken) return adminToken;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  };

  const isAdmin = userProfile?.role === 'owner' || userProfile?.role === 'manager' || userProfile?.role === 'editor';

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      isAdmin,
      loginWithGoogle,
      loginWithPasscode,
      logout,
      getIdToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
