"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileText, Zap, Award, TrendingUp, Download } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AI Resume Builder</span>
        </div>
        <Button onClick={onGetStarted} size="lg">
          Get Started Free
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Professional Resumes with{" "}
            <span className="text-blue-600">AI Assistance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create ATS-optimized resumes that get you noticed by top companies like Amazon, Google, and Microsoft.
            AI-powered suggestions help you craft perfect bullet points and summaries.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={onGetStarted} size="lg" className="text-lg px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Building Now
            </Button>
            <Button onClick={onGetStarted} size="lg" variant="outline" className="text-lg px-8">
              View Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Land Your Dream Job
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>AI-Powered Content</CardTitle>
              <CardDescription>
                Get intelligent suggestions for professional summaries, job descriptions, and achievements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>ATS-Friendly Templates</CardTitle>
              <CardDescription>
                Choose from professionally designed templates optimized for Applicant Tracking Systems
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Smart Auto-Complete</CardTitle>
              <CardDescription>
                Save time with intelligent auto-complete that understands your role and industry
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Top Company Formats</CardTitle>
              <CardDescription>
                Templates used by successful candidates at FAANG and Fortune 500 companies
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>
                Get real-time feedback and scoring to improve your resume's effectiveness
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Export & Download</CardTitle>
              <CardDescription>
                Download your resume as PDF with perfect formatting and styling
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Professional Templates Trusted by Top Companies
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Modern Professional</CardTitle>
              <CardDescription>Clean, ATS-friendly design</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 border-2 border-gray-200 rounded aspect-[8.5/11]">
                <div className="space-y-2">
                  <div className="h-4 bg-blue-600 w-3/4"></div>
                  <div className="h-2 bg-gray-300 w-1/2"></div>
                  <div className="h-2 bg-gray-200 w-full mt-4"></div>
                  <div className="h-2 bg-gray-200 w-full"></div>
                  <div className="h-2 bg-gray-200 w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-blue-500 border-2">
            <CardHeader>
              <CardTitle>Amazon/FAANG Style</CardTitle>
              <CardDescription>Leadership principles focused</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 border-2 border-gray-200 rounded aspect-[8.5/11]">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-800 w-2/3"></div>
                  <div className="h-2 bg-gray-300 w-1/3"></div>
                  <div className="h-2 bg-gray-200 w-full mt-4"></div>
                  <div className="h-2 bg-gray-200 w-full"></div>
                  <div className="h-2 bg-gray-200 w-4/5"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Creative Modern</CardTitle>
              <CardDescription>Stands out while staying professional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 border-2 border-gray-200 rounded aspect-[8.5/11]">
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-blue-600 to-purple-600 w-3/4"></div>
                  <div className="h-2 bg-gray-300 w-1/2"></div>
                  <div className="h-2 bg-gray-200 w-full mt-4"></div>
                  <div className="h-2 bg-gray-200 w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to Build Your Perfect Resume?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of job seekers who landed their dream jobs with our AI-powered resume builder
        </p>
        <Button onClick={onGetStarted} size="lg" className="text-lg px-12">
          <Sparkles className="mr-2 h-5 w-5" />
          Create My Resume Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AI Resume Builder. Built with Next.js and AI.</p>
        </div>
      </footer>
    </div>
  );
}
