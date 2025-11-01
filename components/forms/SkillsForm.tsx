"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

export function SkillsForm() {
  const { resumeData, updateSkills, updateCertifications, updateAchievements } = useResumeStore();
  const [techInput, setTechInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [achieveInput, setAchieveInput] = useState("");

  const handleAddTech = () => {
    if (techInput.trim()) {
      updateSkills({ technical: [...resumeData.skills.technical, techInput.trim()] });
      setTechInput("");
    }
  };

  const handleRemoveTech = (index: number) => {
    updateSkills({
      technical: resumeData.skills.technical.filter((_, i) => i !== index),
    });
  };

  const handleAddSoft = () => {
    if (softInput.trim()) {
      updateSkills({ soft: [...resumeData.skills.soft, softInput.trim()] });
      setSoftInput("");
    }
  };

  const handleRemoveSoft = (index: number) => {
    updateSkills({
      soft: resumeData.skills.soft.filter((_, i) => i !== index),
    });
  };

  const handleAddLang = () => {
    if (langInput.trim()) {
      updateSkills({ languages: [...resumeData.skills.languages, langInput.trim()] });
      setLangInput("");
    }
  };

  const handleRemoveLang = (index: number) => {
    updateSkills({
      languages: resumeData.skills.languages.filter((_, i) => i !== index),
    });
  };

  const handleAddCert = () => {
    if (certInput.trim()) {
      updateCertifications([...resumeData.certifications, certInput.trim()]);
      setCertInput("");
    }
  };

  const handleRemoveCert = (index: number) => {
    updateCertifications(resumeData.certifications.filter((_, i) => i !== index));
  };

  const handleAddAchieve = () => {
    if (achieveInput.trim()) {
      updateAchievements([...resumeData.achievements, achieveInput.trim()]);
      setAchieveInput("");
    }
  };

  const handleRemoveAchieve = (index: number) => {
    updateAchievements(resumeData.achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Technical Skills */}
      <div>
        <Label>Technical Skills</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTech()}
            placeholder="e.g., React, Python, AWS"
          />
          <Button type="button" onClick={handleAddTech}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {resumeData.skills.technical.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {skill}
              <button
                onClick={() => handleRemoveTech(index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <Label>Soft Skills</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={softInput}
            onChange={(e) => setSoftInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSoft()}
            placeholder="e.g., Leadership, Communication"
          />
          <Button type="button" onClick={handleAddSoft}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {resumeData.skills.soft.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {skill}
              <button
                onClick={() => handleRemoveSoft(index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <Label>Languages</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddLang()}
            placeholder="e.g., English (Native), Spanish (Fluent)"
          />
          <Button type="button" onClick={handleAddLang}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {resumeData.skills.languages.map((lang, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {lang}
              <button
                onClick={() => handleRemoveLang(index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <Label>Certifications</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddCert()}
            placeholder="e.g., AWS Certified Solutions Architect"
          />
          <Button type="button" onClick={handleAddCert}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {resumeData.certifications.map((cert, index) => (
            <Badge key={index} variant="outline" className="px-3 py-1">
              {cert}
              <button
                onClick={() => handleRemoveCert(index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <Label>Achievements & Awards</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={achieveInput}
            onChange={(e) => setAchieveInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddAchieve()}
            placeholder="e.g., Won Best Innovation Award 2023"
          />
          <Button type="button" onClick={handleAddAchieve}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {resumeData.achievements.map((achieve, index) => (
            <Badge key={index} variant="outline" className="px-3 py-1">
              {achieve}
              <button
                onClick={() => handleRemoveAchieve(index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
