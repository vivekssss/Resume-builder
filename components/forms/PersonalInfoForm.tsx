"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextarea } from "@/components/ui/rich-textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { aiService } from "@/lib/ai-service";

export function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resumeData;
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhanceSummary = async () => {
    if (!personalInfo.summary || !personalInfo.summary.trim()) {
      alert('Please enter a summary first before enhancing it.');
      return;
    }
    
    setIsEnhancing(true);
    try {
      const enhanced = await aiService.enhanceSummary(
        personalInfo.summary,
        "Software Developer"
      );
      
      if (enhanced && enhanced !== personalInfo.summary) {
        updatePersonalInfo({ summary: enhanced });
        console.log('Summary enhanced successfully!');
      } else {
        console.warn('No enhancement applied');
      }
    } catch (error) {
      console.error("Error enhancing summary:", error);
      alert('AI enhancement failed. Please try again or edit manually.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={personalInfo.fullName}
          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={personalInfo.location}
          onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin || ""}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={personalInfo.github || ""}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            placeholder="github.com/johndoe"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={personalInfo.website || ""}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            placeholder="johndoe.com"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEnhanceSummary}
            disabled={!personalInfo.summary || isEnhancing}
          >
            <Sparkles className="mr-2 h-3 w-3" />
            {isEnhancing ? "Enhancing..." : "AI Enhance"}
          </Button>
        </div>
        <RichTextarea
          value={personalInfo.summary}
          onChange={(value) => updatePersonalInfo({ summary: value })}
          placeholder="Results-driven professional with 5+ years of experience..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Write 3-4 sentences highlighting your key achievements and skills
        </p>
      </div>
    </div>
  );
}
