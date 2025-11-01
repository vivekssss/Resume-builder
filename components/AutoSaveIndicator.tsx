"use client";

import { useEffect, useState, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Check, Cloud } from 'lucide-react';

export function AutoSaveIndicator() {
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const store = useResumeStore();
  const prevDataRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const hasLoadedRef = useRef(false);

  // Load from localStorage on mount - DISABLED
  // Auto-loading is now handled by preview drawer
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      console.log('ℹ️ Auto-load disabled. Use "Load Saved Data" button instead.');
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return; // Skip until initial load is done
    
    // Get store data - use the actual state object
    const storeState = store.resumeData || store;
    const currentData = JSON.stringify(storeState);
    
    // Only update if data actually changed (skip initial render)
    if (prevDataRef.current && prevDataRef.current !== currentData) {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Save to localStorage after debounce
      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem('resume_data', currentData);
          localStorage.setItem('resume_timestamp', new Date().toISOString());
          setLastSaved(new Date());
          console.log('💾 Auto-saved');
        } catch (error) {
          console.error('Auto-save error:', error);
        }
      }, 1000);
    }
    
    // Update ref for next comparison
    prevDataRef.current = currentData;
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [store]);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Check className="h-3 w-3 text-green-600" />
      <span>Auto-save enabled</span>
    </div>
  );
}
