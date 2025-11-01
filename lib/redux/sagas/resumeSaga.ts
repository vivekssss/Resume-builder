import { takeEvery, put, select, debounce } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { autoSave, saveToCloud, loadResumeData } from '../resumeSlice';

// Storage service
class StorageService {
  // Session Storage - temporary, cleared when tab closes
  saveToSession(data: any) {
    try {
      sessionStorage.setItem('resume_draft', JSON.stringify(data));
      console.log('✅ Saved to session storage');
    } catch (error) {
      console.error('Session storage error:', error);
    }
  }

  loadFromSession() {
    try {
      const data = sessionStorage.getItem('resume_draft');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Session storage load error:', error);
      return null;
    }
  }

  // Local Storage - persistent across sessions
  saveToLocal(data: any, userId?: string) {
    try {
      const key = userId ? `resume_${userId}` : 'resume_data';
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
      console.log('✅ Saved to local storage');
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }

  loadFromLocal(userId?: string) {
    try {
      const key = userId ? `resume_${userId}` : 'resume_data';
      const data = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      
      if (data) {
        console.log(`📂 Loaded from local storage (Last saved: ${timestamp})`);
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Local storage load error:', error);
      return null;
    }
  }

  // Cloud Storage - Google Drive API (simplified version)
  async saveToGoogleDrive(data: any, accessToken: string) {
    try {
      // This would integrate with Google Drive API
      // For now, we'll use localStorage with a marker
      this.saveToLocal(data, 'cloud');
      console.log('☁️  Saved to cloud (Google Drive simulation)');
      
      // TODO: Actual Google Drive API integration
      // const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: 'resume_data.json',
      //     mimeType: 'application/json',
      //     content: btoa(JSON.stringify(data)),
      //   }),
      // });
      
      return { success: true };
    } catch (error) {
      console.error('Cloud save error:', error);
      return { success: false, error };
    }
  }

  async loadFromGoogleDrive(accessToken: string) {
    try {
      // Simulate loading from cloud
      const data = this.loadFromLocal('cloud');
      console.log('☁️  Loaded from cloud (Google Drive simulation)');
      return data;
      
      // TODO: Actual Google Drive API integration
    } catch (error) {
      console.error('Cloud load error:', error);
      return null;
    }
  }
}

const storageService = new StorageService();

// Auto-save saga (debounced to avoid excessive saves)
function* handleAutoSave(): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const resumeData = state.resume;
    const userId = state.auth.user?.id;
    
    // Save to both session and local storage
    storageService.saveToSession(resumeData);
    storageService.saveToLocal(resumeData, userId);
    
    console.log('💾 Auto-saved');
  } catch (error) {
    console.error('Auto-save error:', error);
  }
}

// Manual cloud save
function* handleSaveToCloud(): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const resumeData = state.resume;
    const accessToken = state.auth.accessToken;
    const userId = state.auth.user?.id;
    
    // Save to local storage
    storageService.saveToLocal(resumeData, userId);
    
    // If authenticated, save to cloud
    if (accessToken) {
      yield storageService.saveToGoogleDrive(resumeData, accessToken);
    }
    
    console.log('☁️  Manually saved to cloud');
  } catch (error) {
    console.error('Cloud save error:', error);
  }
}

// Load from cloud on login
export function* handleLoadFromCloud(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const accessToken = action.payload;
    const state: RootState = yield select();
    const userId = state.auth.user?.id;
    
    // Try to load from cloud first
    let data = null;
    if (accessToken) {
      data = yield storageService.loadFromGoogleDrive(accessToken);
    }
    
    // Fallback to local storage
    if (!data) {
      data = storageService.loadFromLocal(userId);
    }
    
    // Fallback to session storage
    if (!data) {
      data = storageService.loadFromSession();
    }
    
    if (data) {
      yield put(loadResumeData(data));
      console.log('✅ Resume data loaded successfully');
    }
  } catch (error) {
    console.error('Load from cloud error:', error);
  }
}

// Watchers
export function* watchAutoSave(): Generator<any, void, any> {
  // Debounce auto-save to every 2 seconds
  yield debounce(2000, autoSave.type, handleAutoSave);
}

export function* watchSaveToCloud(): Generator<any, void, any> {
  yield takeEvery(saveToCloud.type, handleSaveToCloud);
}

export function* watchLoadFromCloud(): Generator<any, void, any> {
  yield takeEvery('auth/loadFromCloud', handleLoadFromCloud);
}
