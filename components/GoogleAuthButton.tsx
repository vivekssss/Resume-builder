"use client";

import { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { loginSuccess, logout } from '@/lib/redux/authSlice';
import { Button } from '@/components/ui/button';
import { LogOut, Cloud, User } from 'lucide-react';

export function GoogleAuthButton() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Debug log
  console.log('🔍 Auth state:', { isAuthenticated, user });

  // Load saved login on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('google_auth');
    if (savedAuth && !isAuthenticated) {
      try {
        const authData = JSON.parse(savedAuth);
        // Check if it's old format and convert
        if (authData.token && !authData.accessToken) {
          const converted = {
            user: {
              id: authData.email,
              email: authData.email,
              name: authData.name,
              picture: authData.picture,
            },
            accessToken: authData.token,
          };
          dispatch(loginSuccess(converted));
          localStorage.setItem('google_auth', JSON.stringify(converted));
        } else {
          dispatch(loginSuccess(authData));
        }
        console.log('✅ Google login restored from localStorage');
      } catch (error) {
        console.error('Error restoring login:', error);
        localStorage.removeItem('google_auth');
      }
    }
  }, [dispatch, isAuthenticated]);

  const handleLoginSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        // Decode JWT to get user info
        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const userData = JSON.parse(jsonPayload);
        
        const authData = {
          user: {
            id: userData.sub || userData.email,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
          },
          accessToken: credentialResponse.credential,
        };
        
        console.log('🔑 Login data:', authData);
        
        // Save to localStorage (save the whole object)
        localStorage.setItem('google_auth', JSON.stringify(authData));
        
        // Dispatch to Redux with correct structure
        dispatch(loginSuccess(authData));
        
        console.log('✅ Logged in with Google:', authData.user.name);
      } catch (error) {
        console.error('❌ Login error:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('google_auth');
    dispatch(logout());
    console.log('🚪 Logged out');
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
          {user.picture && (
            <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" />
          )}
          <div className="text-sm">
            <p className="font-medium text-green-900">{user.name}</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Cloud className="h-3 w-3" />
              Auto-saving to cloud
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-9"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-gray-600">
        <User className="h-4 w-4 inline mr-1" />
        Login to save to cloud
      </div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.error('Login Failed');
        }}
        useOneTap
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
}
