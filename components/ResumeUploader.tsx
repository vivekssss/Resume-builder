"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { aiService } from "@/lib/ai-service";
import { useResumeStore } from "@/lib/store";

export function ResumeUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const { populateFromAI } = useResumeStore();

  const loadSampleResume = () => {
    const sampleData = {
      personalInfo: {
        fullName: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johnsmith",
        github: "github.com/johnsmith",
        summary: "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies with a proven track record of delivering high-impact projects."
      },
      experience: [
        {
          id: "1",
          company: "Tech Corp",
          position: "Senior Software Engineer",
          location: "San Francisco, CA",
          startDate: "Jan 2021",
          endDate: "Present",
          current: true,
          description: [
            "Led development of microservices architecture serving 10M+ users, improving system reliability by 40%",
            "Reduced deployment time by 60% through implementation of CI/CD pipelines",
            "Mentored team of 5 junior engineers, improving code quality and team velocity"
          ]
        }
      ],
      education: [
        {
          id: "1",
          institution: "University of California",
          degree: "Bachelor of Science",
          field: "Computer Science",
          graduationDate: "May 2019",
          gpa: "3.8/4.0",
          location: "Berkeley, CA"
        }
      ],
      skills: {
        technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
        soft: ["Leadership", "Problem Solving", "Communication"],
        languages: ["English (Native)", "Spanish (Fluent)"]
      },
      projects: [
        {
          id: "1",
          name: "E-commerce Platform",
          description: "Built full-stack platform processing $1M+ in monthly transactions",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"]
        }
      ],
      certifications: ["AWS Certified Solutions Architect"],
      achievements: ["Hackathon Winner 2022", "Employee of the Quarter Q3 2023"]
    };
    
    populateFromAI(sampleData);
    setUploadStatus("success");
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("idle");

    try {
      const text = await extractTextFromFile(file);
      
      if (!text || text.trim().length < 50) {
        console.warn('Extracted text too short, may need better parsing');
        setUploadStatus("error");
        return;
      }

      console.log('Extracted text length:', text.length);
      const parsedData = await aiService.parseResume(text);
      
      if (parsedData && parsedData.personalInfo) {
        populateFromAI(parsedData);
        setUploadStatus("success");
      } else {
        console.warn('AI parsing returned no data');
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  }, [populateFromAI]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      // Handle plain text files
      if (file.type === 'text/plain') {
        return await file.text();
      }
      
      // Handle PDF files with dynamic import
      if (file.type === 'application/pdf') {
        console.log('Extracting text from PDF...');
        const arrayBuffer = await file.arrayBuffer();
        
        // Dynamic import to avoid SSR issues
        const pdfjs = await import('pdfjs-dist');
        
        // Set worker path for PDF.js
        (pdfjs as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjs as any).version}/pdf.worker.min.js`;
        
        const pdf = await (pdfjs as any).getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        
        console.log('PDF text extracted, length:', fullText.length);
        return fullText;
      }
      
      // Handle DOCX files with dynamic import
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Extracting text from DOCX...');
        const arrayBuffer = await file.arrayBuffer();
        
        // Dynamic import to avoid SSR issues
        const mammothLib = await import('mammoth');
        const result = await (mammothLib as any).extractRawText({ arrayBuffer });
        
        console.log('DOCX text extracted, length:', result.value.length);
        return result.value;
      }
      
      // Handle DOC files (older Word format)
      if (file.type === 'application/msword') {
        console.log('Extracting text from DOC...');
        const arrayBuffer = await file.arrayBuffer();
        try {
          const mammothLib = await import('mammoth');
          const result = await (mammothLib as any).extractRawText({ arrayBuffer });
          return result.value;
        } catch (error) {
          console.warn('DOC parsing with mammoth failed, trying text extraction');
          // Fallback for older DOC files
          const text = await file.text();
          const readable = text.replace(/[^\x20-\x7E\n]/g, ' ').trim();
          return readable;
        }
      }
      
      // Fallback for unknown types
      console.warn('Unknown file type, attempting text extraction');
      return await file.text();
      
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('Failed to extract text from file');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Existing Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-600">Analyzing your resume...</p>
            </div>
          ) : uploadStatus === "success" ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <p className="text-sm font-medium text-green-700">✅ Resume imported successfully!</p>
              <p className="text-xs text-gray-500">Your information has been auto-filled. Check the forms below and edit as needed.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FileText className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports PDF, DOC, DOCX, TXT
                </p>
              </div>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>
          )}
          
          {uploadStatus === "error" && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium mb-1">
                ⚠️ Couldn't automatically parse your resume
              </p>
              <p className="text-xs text-yellow-700">
                <strong>Possible reasons:</strong>
              </p>
              <ul className="text-xs text-yellow-700 list-disc list-inside mt-1 space-y-0.5">
                <li>PDF is a scanned image (not selectable text)</li>
                <li>File is password protected or encrypted</li>
                <li>AI service is temporarily unavailable</li>
              </ul>
              <p className="text-xs text-yellow-700 mt-2">
                <strong>Try:</strong> Use the "Sample Resume" button below or fill forms manually.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p className="font-medium mb-1">AI will automatically extract:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Personal information & contact details</li>
            <li>Work experience with dates and descriptions</li>
            <li>Education history</li>
            <li>Skills and certifications</li>
            <li>Projects and achievements</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
