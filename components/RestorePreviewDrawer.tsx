"use client";

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Calendar, Briefcase, GraduationCap, FileText } from 'lucide-react';

interface SavedData {
  personalInfo?: any;
  experience?: any[];
  education?: any[];
  skills?: any;
  projects?: any[];
  certifications?: string[];
  achievements?: string[];
  timestamp?: string;
}

export function RestorePreviewDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [savedData, setSavedData] = useState<SavedData | null>(null);
  const [hasData, setHasData] = useState(false);
  const store = useResumeStore();

  const checkForSavedData = () => {
    try {
      const stored = localStorage.getItem('resume_data');
      const timestamp = localStorage.getItem('resume_timestamp');
      
      if (stored) {
        const data = JSON.parse(stored);
        setSavedData({ ...data, timestamp });
        setHasData(true);
        setIsOpen(true);
      } else {
        alert('❌ No saved data found in browser storage.');
      }
    } catch (error) {
      console.error('Error loading preview:', error);
      alert('❌ Error loading saved data.');
    }
  };

  const handleRestore = () => {
    if (!savedData) return;

    try {
      console.log('🔄 Restoring data...', savedData);
      
      // Restore all data
      if (savedData.personalInfo) {
        store.updatePersonalInfo(savedData.personalInfo);
        console.log('✅ Personal info restored');
      }
      
      if (savedData.experience && savedData.experience.length > 0) {
        savedData.experience.forEach((exp: any) => {
          store.addExperience(exp);
        });
        console.log('✅ Experience restored:', savedData.experience.length, 'items');
      }
      
      if (savedData.education && savedData.education.length > 0) {
        savedData.education.forEach((edu: any) => {
          store.addEducation(edu);
        });
        console.log('✅ Education restored:', savedData.education.length, 'items');
      }
      
      if (savedData.skills) {
        store.updateSkills(savedData.skills);
        console.log('✅ Skills restored');
      }
      
      if (savedData.projects && savedData.projects.length > 0) {
        savedData.projects.forEach((proj: any) => {
          store.addProject(proj);
        });
        console.log('✅ Projects restored:', savedData.projects.length, 'items');
      }
      
      if (savedData.certifications) {
        store.updateCertifications(savedData.certifications);
      }
      
      if (savedData.achievements) {
        store.updateAchievements(savedData.achievements);
      }
      
      setIsOpen(false);
      alert('✅ Resume data restored successfully! Check your form fields.');
      
      // Scroll to top to see the data
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error restoring data:', error);
      alert('❌ Error restoring data. Check console for details.');
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button 
        onClick={checkForSavedData} 
        variant="outline"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Load Saved Data
      </Button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center bg-blue-50">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">📦 Saved Resume Data Preview</h2>
                {savedData?.timestamp && (
                  <p className="text-sm text-blue-600 mt-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Last saved: {new Date(savedData.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Personal Info */}
              {savedData?.personalInfo && (
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Name:</strong> {savedData.personalInfo.fullName || 'N/A'}</div>
                    <div><strong>Email:</strong> {savedData.personalInfo.email || 'N/A'}</div>
                    <div><strong>Phone:</strong> {savedData.personalInfo.phone || 'N/A'}</div>
                    <div><strong>Location:</strong> {savedData.personalInfo.location || 'N/A'}</div>
                    {savedData.personalInfo.linkedin && (
                      <div className="col-span-2"><strong>LinkedIn:</strong> {savedData.personalInfo.linkedin}</div>
                    )}
                    {savedData.personalInfo.summary && (
                      <div className="col-span-2">
                        <strong>Summary:</strong>
                        <p className="mt-1 text-gray-700">{savedData.personalInfo.summary.substring(0, 200)}...</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Experience */}
              {savedData?.experience && savedData.experience.length > 0 && (
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                    Work Experience ({savedData.experience.length} entries)
                  </h3>
                  <div className="space-y-3">
                    {savedData.experience.slice(0, 3).map((exp: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-green-500 pl-3">
                        <div className="font-medium">{exp.position} at {exp.company}</div>
                        <div className="text-sm text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</div>
                        {exp.description && exp.description[0] && (
                          <div className="text-sm mt-1">• {exp.description[0].substring(0, 80)}...</div>
                        )}
                      </div>
                    ))}
                    {savedData.experience.length > 3 && (
                      <div className="text-sm text-gray-500">+ {savedData.experience.length - 3} more...</div>
                    )}
                  </div>
                </Card>
              )}

              {/* Education */}
              {savedData?.education && savedData.education.length > 0 && (
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                    Education ({savedData.education.length} entries)
                  </h3>
                  <div className="space-y-2">
                    {savedData.education.map((edu: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-purple-500 pl-3">
                        <div className="font-medium">{edu.degree} in {edu.field}</div>
                        <div className="text-sm text-gray-600">{edu.institution} - {edu.graduationDate}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Skills */}
              {savedData?.skills && (
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3">🛠️ Skills</h3>
                  <div className="space-y-2 text-sm">
                    {savedData.skills.technical && savedData.skills.technical.length > 0 && (
                      <div>
                        <strong>Technical:</strong> {savedData.skills.technical.join(', ')}
                      </div>
                    )}
                    {savedData.skills.soft && savedData.skills.soft.length > 0 && (
                      <div>
                        <strong>Soft Skills:</strong> {savedData.skills.soft.join(', ')}
                      </div>
                    )}
                    {savedData.skills.languages && savedData.skills.languages.length > 0 && (
                      <div>
                        <strong>Languages:</strong> {savedData.skills.languages.join(', ')}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Projects */}
              {savedData?.projects && savedData.projects.length > 0 && (
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3">🚀 Projects ({savedData.projects.length})</h3>
                  <div className="space-y-2">
                    {savedData.projects.slice(0, 2).map((proj: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <strong>{proj.name}</strong> - {proj.description?.substring(0, 60)}...
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Empty State */}
              {!savedData?.personalInfo && !savedData?.experience?.length && !savedData?.education?.length && (
                <Card className="p-6 text-center text-gray-500">
                  <p>No data found to preview</p>
                </Card>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {savedData && (
                  <span>
                    Found: {savedData.personalInfo ? '✓ Personal' : ''} 
                    {savedData.experience?.length ? ` ✓ ${savedData.experience.length} Jobs` : ''} 
                    {savedData.education?.length ? ` ✓ ${savedData.education.length} Education` : ''}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRestore} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Restore This Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
