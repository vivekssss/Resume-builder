"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import { ResumePreview } from "./preview/ResumePreview";
import { AIAssistant } from "./AIAssistant";
import { TemplateSelector } from "./TemplateSelector";
import { ResumeUploader } from "./ResumeUploader";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { DataRestoreButton } from "./DataRestoreButton";
import { RestorePreviewDrawer } from "./RestorePreviewDrawer";
import { Download, FileText, Sparkles, BarChart3, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeBuilderProps {
  onBack?: () => void;
}

export function ResumeBuilder({ onBack }: ResumeBuilderProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const store = useResumeStore();
  const { selectedTemplate } = store;
  const [showAI, setShowAI] = useState(false);

  const tabs = ["personal", "experience", "education", "skills", "projects"];
  const currentTabIndex = tabs.indexOf(activeTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-bold">AI Resume Builder</h1>
          <AutoSaveIndicator />
        </div>
        <div className="flex items-center gap-3">
          <RestorePreviewDrawer />
          <GoogleAuthButton />
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <DataRestoreButton />
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Forms */}
          <div className="space-y-6">
            <ResumeUploader />
            <TemplateSelector />

            <Card className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <PersonalInfoForm />
                </TabsContent>

                <TabsContent value="experience" className="mt-6">
                  <ExperienceForm />
                </TabsContent>

                <TabsContent value="education" className="mt-6">
                  <EducationForm />
                </TabsContent>

                <TabsContent value="skills" className="mt-6">
                  <SkillsForm />
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <ProjectsForm />
                </TabsContent>

                {/* Navigation Footer */}
                <div className="flex justify-between items-center pt-4 border-t mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentTabIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-500">
                    Step {currentTabIndex + 1} of {tabs.length}
                  </span>
                  
                  <Button
                    onClick={handleNext}
                    disabled={currentTabIndex === tabs.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Tabs>
            </Card>

            {showAI && <AIAssistant />}
          </div>

          {/* Right Side - Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
