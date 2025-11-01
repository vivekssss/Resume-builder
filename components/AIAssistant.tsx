"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { aiService } from "@/lib/ai-service";
import { useResumeStore } from "@/lib/store";

export function AIAssistant() {
  const { resumeData } = useResumeStore();
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzResumeScore(resumeData);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI Resume Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
          {isAnalyzing ? "Analyzing..." : "Analyze My Resume"}
        </Button>

        {analysis && (
          <>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Resume Score</span>
                <span className="text-2xl font-bold text-blue-600">{analysis.score}/100</span>
              </div>
              <Progress value={analysis.score} className="h-2" />
            </div>

            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="text-xs text-green-700 flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  Suggestions for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion: string, idx: number) => (
                    <li key={idx} className="text-xs text-orange-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-semibold text-sm mb-2">Quick Tips</h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li>• Use action verbs (Led, Developed, Achieved)</li>
            <li>• Quantify achievements with numbers and metrics</li>
            <li>• Keep it concise - 1 page for &lt;10 years experience</li>
            <li>• Tailor your resume for each job application</li>
            <li>• Use ATS-friendly formatting (no tables, columns)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
