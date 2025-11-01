"use client";

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from '@/lib/redux/store';

// Google OAuth Client ID - Replace with your own from Google Cloud Console
const GOOGLE_CLIENT_ID = "542826558121-1464s19n4m97prm3dae4vcj8ih4ofl4i.apps.googleusercontent.com";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check for existing session on mount
    store.dispatch({ type: 'auth/checkSession' });
  }, []);

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </Provider>
  );
}
