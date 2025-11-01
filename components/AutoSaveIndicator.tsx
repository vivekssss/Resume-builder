"use client";

import { useEffect, useState, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Check, Cloud } from 'lucide-react';

export function AutoSaveIndicator() {
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const store = useResumeStore();
  const { resumeData } = store;
  const prevDataRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const hasLoadedRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (!hasLoadedRef.current) {
      try {
        const stored = localStorage.getItem('resume_data');
        if (stored) {
          const data = JSON.parse(stored);
          // Restore all data
          if (data.personalInfo) store.updatePersonalInfo(data.personalInfo);
          if (data.experience) {
            data.experience.forEach((exp: any) => {
              if (!resumeData.experience.find(e => e.id === exp.id)) {
                store.addExperience(exp);
              }
            });
          }
          if (data.education) {
            data.education.forEach((edu: any) => {
              if (!resumeData.education.find(e => e.id === edu.id)) {
                store.addEducation(edu);
              }
            });
          }
          if (data.skills) store.updateSkills(data.skills);
          if (data.projects) {
            data.projects.forEach((proj: any) => {
              if (!resumeData.projects.find(p => p.id === proj.id)) {
                store.addProject(proj);
              }
            });
          }
          console.log('✅ Resume data loaded from localStorage');
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      hasLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return; // Skip until initial load is done
    
    // Convert current state to string for comparison
    const currentData = JSON.stringify(resumeData);
    
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
  }, [resumeData]);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Check className="h-3 w-3 text-green-600" />
      <span>Auto-save enabled</span>
    </div>
  );
}
