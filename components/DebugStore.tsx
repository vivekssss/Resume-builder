"use client";

import { useResumeStore } from "@/lib/store";

export function DebugStore() {
  const { resumeData } = useResumeStore();
  
  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm text-xs">
      <h4 className="font-semibold mb-2">Store Debug Info</h4>
      <div className="space-y-1">
        <p><strong>Name:</strong> {resumeData.personalInfo.fullName || 'Empty'}</p>
        <p><strong>Email:</strong> {resumeData.personalInfo.email || 'Empty'}</p>
        <p><strong>Experience:</strong> {resumeData.experience.length} items</p>
        <p><strong>Education:</strong> {resumeData.education.length} items</p>
        <p><strong>Technical Skills:</strong> {resumeData.skills.technical.length} items</p>
        <p><strong>Projects:</strong> {resumeData.projects.length} items</p>
      </div>
    </div>
  );
}
