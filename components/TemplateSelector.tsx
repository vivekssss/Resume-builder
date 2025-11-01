"use client";

import { useResumeStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and ATS-friendly",
    preview: "bg-gradient-to-br from-blue-50 to-white",
  },
  {
    id: "amazon",
    name: "Amazon/FAANG",
    description: "Leadership-focused",
    preview: "bg-gradient-to-br from-gray-50 to-white",
  },
  {
    id: "google",
    name: "Google Style",
    description: "Colorful accents",
    preview: "bg-gradient-to-br from-blue-100 via-red-50 to-yellow-50",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Professional blue theme",
    preview: "bg-gradient-to-br from-blue-100 to-blue-50",
  },
  {
    id: "apple",
    name: "Apple Minimal",
    description: "Clean & minimalist",
    preview: "bg-gradient-to-br from-gray-100 to-white",
  },
  {
    id: "creative",
    name: "Creative Modern",
    description: "Stand out design",
    preview: "bg-gradient-to-br from-purple-50 to-blue-50",
  },
];

export function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useResumeStore();

  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Choose Template</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? "ring-2 ring-blue-600 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="relative">
              <div className={`h-24 rounded ${template.preview} mb-2`}></div>
              {selectedTemplate === template.id && (
                <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <h4 className="font-semibold text-xs">{template.name}</h4>
            <p className="text-xs text-muted-foreground">{template.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
