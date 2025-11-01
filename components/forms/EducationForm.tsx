"use client";

import { useState } from "react";
import { useResumeStore, Education } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export function EducationForm() {
  const { resumeData, addEducation, deleteEducation } = useResumeStore();
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: "",
    degree: "",
    field: "",
    location: "",
    graduationDate: "",
    gpa: "",
  });

  const handleAdd = () => {
    if (formData.institution && formData.degree) {
      const newEdu: Education = {
        id: Date.now().toString(),
        institution: formData.institution,
        degree: formData.degree,
        field: formData.field || "",
        location: formData.location || "",
        graduationDate: formData.graduationDate || "",
        gpa: formData.gpa,
      };
      addEducation(newEdu);
      setFormData({
        institution: "",
        degree: "",
        field: "",
        location: "",
        graduationDate: "",
        gpa: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Add Education</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="institution">Institution *</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="Stanford University"
            />
          </div>
          <div>
            <Label htmlFor="degree">Degree *</Label>
            <Input
              id="degree"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="Bachelor of Science"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="field">Field of Study</Label>
            <Input
              id="field"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <Label htmlFor="eduLocation">Location</Label>
            <Input
              id="eduLocation"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Stanford, CA"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="graduationDate">Graduation Date</Label>
            <Input
              id="graduationDate"
              value={formData.graduationDate}
              onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
              placeholder="May 2023"
            />
          </div>
          <div>
            <Label htmlFor="gpa">GPA (Optional)</Label>
            <Input
              id="gpa"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="3.8/4.0"
            />
          </div>
        </div>

        <Button onClick={handleAdd} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {/* Existing Education */}
      {resumeData.education.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Your Education</h3>
          {resumeData.education.map((edu) => (
            <Card key={edu.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">
                    {edu.field && `${edu.field} • `}{edu.institution}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {edu.graduationDate} • {edu.location}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteEducation(edu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
