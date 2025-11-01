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
import { Download, FileText, Sparkles, BarChart3, ArrowLeft, ChevronLeft, ChevronRight, Share2, FileImage, FileDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

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
    if (!element) {
      alert('❌ Resume preview not found. Please wait for the page to load.');
      return;
    }

    try {
      console.log('📄 Generating PDF...');
      toast.info('Generating PDF... Please wait');
      
      // Capture with moderate quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        windowHeight: 1600,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate to fit on ONE page with small margins
      const margin = 5; // 5mm margins
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgRatio = imgHeight / imgWidth;
      
      // Scale to fit width, then compress height if needed
      let finalWidth = availableWidth;
      let finalHeight = availableWidth * imgRatio;
      
      // If too tall, scale down to fit height
      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = finalHeight / imgRatio;
      }
      
      // Center on page
      const xPos = (pdfWidth - finalWidth) / 2;
      const yPos = margin;
      
      pdf.addImage(
        imgData,
        'PNG',
        xPos,
        yPos,
        finalWidth,
        finalHeight,
        undefined,
        'FAST' // Use FAST compression
      );
      
      const fileName = store.resumeData?.personalInfo?.fullName 
        ? `${store.resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'My_Resume.pdf';
      
      pdf.save(fileName);
      console.log('✅ PDF downloaded:', fileName);
      toast.success('PDF downloaded successfully! 📄');
    } catch (error) {
      console.error('❌ PDF generation error:', error);
      toast.error('Error generating PDF. Please try again.');
    }
  };

  const handleDownloadImage = async (format: 'png' | 'jpg' = 'png') => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      alert('❌ Resume preview not found.');
      return;
    }

    try {
      console.log(`📸 Generating ${format.toUpperCase()} image...`);
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = store.resumeData?.personalInfo?.fullName 
          ? `${store.resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.${format}`
          : `My_Resume.${format}`;
        
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        console.log(`✅ ${format.toUpperCase()} downloaded:`, fileName);
        toast.success(`${format.toUpperCase()} image downloaded! 🖼️`);
      }, `image/${format}`, 0.95);
    } catch (error) {
      console.error(`❌ ${format.toUpperCase()} generation error:`, error);
      toast.error(`Error generating ${format.toUpperCase()}. Please try again.`);
    }
  };

  const handleDownloadDOC = () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      alert('❌ Resume preview not found.');
      return;
    }

    try {
      console.log('📝 Generating DOC...');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #333; font-size: 24px; margin-bottom: 10px; }
            h2 { color: #555; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = store.resumeData?.personalInfo?.fullName 
        ? `${store.resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.doc`
        : 'My_Resume.doc';
      
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      console.log('✅ DOC downloaded:', fileName);
      toast.success('DOC file downloaded! 📝');
    } catch (error) {
      console.error('❌ DOC generation error:', error);
      toast.error('Error generating DOC. Please try again.');
    }
  };

  const handleShare = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      alert('❌ Resume preview not found.');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const fileName = store.resumeData?.personalInfo?.fullName 
          ? `${store.resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.png`
          : 'My_Resume.png';

        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'My Resume',
              text: 'Check out my resume!',
              files: [file],
            });
            console.log('✅ Resume shared successfully');
            toast.success('Resume shared successfully! 🔗');
          } catch (error) {
            if ((error as Error).name !== 'AbortError') {
              console.error('❌ Share error:', error);
              toast.error('Share cancelled');
              copyShareLink();
            }
          }
        } else {
          copyShareLink();
        }
      }, 'image/png');
    } catch (error) {
      console.error('❌ Share error:', error);
      copyShareLink();
    }
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard! 📋');
    }).catch(() => {
      toast.info('Share URL: ' + url);
    });
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
          
          {/* Download Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDownloadPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadDOC}>
                <FileDown className="mr-2 h-4 w-4" />
                Download as DOC
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDownloadImage('png')}>
                <FileImage className="mr-2 h-4 w-4" />
                Download as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadImage('jpg')}>
                <FileImage className="mr-2 h-4 w-4" />
                Download as JPG
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Resume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
