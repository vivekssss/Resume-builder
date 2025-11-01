import { takeEvery, put, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { googleLogin, loginSuccess, loginFailure } from '../authSlice';

interface GoogleCredential {
  credential: string;
  clientId: string;
}

// Parse JWT token to get user info
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT parse error:', error);
    return null;
  }
}

// Handle Google Login
function* handleGoogleLogin(action: PayloadAction<GoogleCredential>) {
  try {
    const { credential } = action.payload;
    
    // Parse the JWT token to get user info
    const userInfo = parseJwt(credential);
    
    if (!userInfo) {
      throw new Error('Failed to parse user information');
    }
    
    // Extract user data
    const user = {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', credential);
    
    // Dispatch success
    yield put(loginSuccess({ user, accessToken: credential }));
    
    // Trigger load from cloud
    yield put({ type: 'auth/loadFromCloud', payload: credential });
    
    console.log('✅ Google login successful');
  } catch (error: any) {
    console.error('Google login error:', error);
    yield put(loginFailure(error.message || 'Login failed'));
  }
}

// Check for existing session on app load
export function* checkExistingSession() {
  try {
    const userStr = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    if (userStr && accessToken) {
      const user = JSON.parse(userStr);
      yield put(loginSuccess({ user, accessToken }));
      yield put({ type: 'auth/loadFromCloud', payload: accessToken });
      console.log('✅ Session restored from localStorage');
    }
  } catch (error) {
    console.error('Session restore error:', error);
  }
}

// Watchers
export function* watchGoogleLogin() {
  yield takeEvery(googleLogin.type, handleGoogleLogin);
}
