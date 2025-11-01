"use client";

import { useState } from 'react';
import { useResumeStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';

export function ManualRestoreButton() {
  const [restored, setRestored] = useState(false);
  const store = useResumeStore();

  const handleRestore = () => {
    try {
      const stored = localStorage.getItem('resume_data');
      if (stored) {
        const data = JSON.parse(stored);
        
        // IMPORTANT: Clear existing data first to prevent duplicates
        console.log('🗑️  Clearing existing data to prevent duplicates...');
        store.clearAllData();
        console.log('🔄 Restoring data from localStorage...');
        
        // Restore all data
        if (data.personalInfo) {
          store.updatePersonalInfo(data.personalInfo);
          console.log('✅ Personal info restored');
        }
        if (data.experience) {
          data.experience.forEach((exp: any) => {
            store.addExperience(exp);
          });
          console.log('✅ Experience restored:', data.experience.length, 'items');
        }
        if (data.education) {
          data.education.forEach((edu: any) => {
            store.addEducation(edu);
          });
          console.log('✅ Education restored:', data.education.length, 'items');
        }
        if (data.skills) {
          store.updateSkills(data.skills);
          console.log('✅ Skills restored');
        }
        if (data.projects) {
          data.projects.forEach((proj: any) => {
            store.addProject(proj);
          });
          console.log('✅ Projects restored:', data.projects.length, 'items');
        }
        if (data.certifications) {
          store.updateCertifications(data.certifications);
        }
        if (data.achievements) {
          store.updateAchievements(data.achievements);
        }
        
        setRestored(true);
        setTimeout(() => setRestored(false), 3000);
        alert('✅ Resume data restored successfully!');
      } else {
        alert('❌ No saved data found in browser storage.');
      }
    } catch (error) {
      console.error('Error restoring data:', error);
      alert('❌ Error restoring data. Please try again.');
    }
  };

  return (
    <Button 
      onClick={handleRestore} 
      variant="outline"
      size="sm"
      className={restored ? 'bg-green-50 border-green-500' : ''}
    >
      {restored ? (
        <>
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          Restored!
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Load Saved Data
        </>
      )}
    </Button>
  );
}
