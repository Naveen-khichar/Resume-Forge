"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import UploadCard from "@/components/UploadCard";
import DashboardStats from "@/components/DashboardStats";
import { Analysis } from "@/types";

export default function Home() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleAnalysisComplete = (data: Analysis) => {
    setAnalysis(data);
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      {analysis ? (
        <div className="flex-1 mt-6">
          <DashboardStats analysis={analysis} onReset={handleReset} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <Hero />
          <UploadCard onAnalysisComplete={handleAnalysisComplete} />
        </div>
      )}
    </main>
  );
}