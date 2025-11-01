"use client";

import { useEffect, useState } from 'react';
import { useResumeStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, X, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function DataRestoreButton() {
  const [hasData, setHasData] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const store = useResumeStore();

  useEffect(() => {
    // Check if there's stored data on mount
    const checkStoredData = () => {
      try {
        const stored = localStorage.getItem('resume_data');
        console.log('📦 Checking localStorage for resume_data:', stored ? 'Found' : 'Not found');
        
        if (stored) {
          const data = JSON.parse(stored);
          console.log('📄 Parsed data:', data);
          
          // Check if there's meaningful data
          const hasStored = !!(
            data.personalInfo?.fullName ||
            data.experience?.length > 0 ||
            data.education?.length > 0 ||
            data.skills?.technical?.length > 0
          );
          
          console.log('✅ Has meaningful data:', hasStored);
          setHasData(hasStored);
          
          if (hasStored) {
            setShowBanner(true);
            
            // Get last saved timestamp
            const timestamp = localStorage.getItem('resume_timestamp');
            if (timestamp) {
              const date = new Date(timestamp);
              setLastSaved(date.toLocaleString());
            }
          }
        }
      } catch (error) {
        console.error('Error checking stored data:', error);
      }
    };

    // Check immediately and also after a short delay
    checkStoredData();
    const timer = setTimeout(checkStoredData, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRestore = () => {
    try {
      const stored = localStorage.getItem('resume_data');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Restore all data
        if (data.personalInfo) store.updatePersonalInfo(data.personalInfo);
        if (data.experience) {
          data.experience.forEach((exp: any) => store.addExperience(exp));
        }
        if (data.education) {
          data.education.forEach((edu: any) => store.addEducation(edu));
        }
        if (data.skills) store.updateSkills(data.skills);
        if (data.projects) {
          data.projects.forEach((proj: any) => store.addProject(proj));
        }
        if (data.certifications) store.updateCertifications(data.certifications);
        if (data.achievements) store.updateAchievements(data.achievements);
        
        setShowBanner(false);
        alert('✅ Your resume data has been restored!');
      }
    } catch (error) {
      console.error('Error restoring data:', error);
      alert('❌ Error restoring data. Please try again.');
    }
  };

  const handleClear = () => {
    if (confirm('⚠️  Are you sure? This will permanently delete all your resume data!')) {
      localStorage.removeItem('resume_data');
      localStorage.removeItem('resume_timestamp');
      setHasData(false);
      setShowBanner(false);
      alert('🗑️  All data has been cleared.');
      window.location.reload();
    }
  };

  if (!hasData || !showBanner) {
    return null;
  }

  return (
    <Card className="mb-4 p-4 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900">Previous Resume Data Found</h3>
          <p className="text-sm text-blue-700 mt-1">
            We found your previous resume data{lastSaved ? ` saved on ${lastSaved}` : ''}.
            Would you like to restore it?
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleRestore}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Restore Data
            </Button>
            <Button
              onClick={() => setShowBanner(false)}
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
