"use client";

import { useResumeStore } from "@/lib/store";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { AmazonTemplate } from "@/components/templates/AmazonTemplate";
import { CreativeTemplate } from "@/components/templates/CreativeTemplate";
import { GoogleTemplate } from "@/components/templates/GoogleTemplate";
import { MicrosoftTemplate } from "@/components/templates/MicrosoftTemplate";
import { AppleTemplate } from "@/components/templates/AppleTemplate";

export function ResumePreview() {
  const { selectedTemplate } = useResumeStore();

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "amazon":
        return <AmazonTemplate />;
      case "google":
        return <GoogleTemplate />;
      case "microsoft":
        return <MicrosoftTemplate />;
      case "apple":
        return <AppleTemplate />;
      case "creative":
        return <CreativeTemplate />;
      case "modern":
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div id="resume-preview" className="bg-white">
        {renderTemplate()}
      </div>
    </div>
  );
}
