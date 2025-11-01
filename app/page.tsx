"use client";

import { useState } from "react";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <main>
      {showBuilder ? (
        <ResumeBuilder onBack={() => setShowBuilder(false)} />
      ) : (
        <LandingPage onGetStarted={() => setShowBuilder(true)} />
      )}
    </main>
  );
}
