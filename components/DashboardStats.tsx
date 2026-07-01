"use client";

import React, { useState } from "react";
import { Analysis } from "@/types";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Copy, 
  Award, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  FileText, 
  ArrowLeft,
  Check
} from "lucide-react";

interface DashboardStatsProps {
  analysis: Analysis;
  onReset: () => void;
}

export default function DashboardStats({ analysis, onReset }: DashboardStatsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const {
    fileName,
    atsScore,
    scoreBreakdown,
    sectionsFound,
    detectedSkills,
    jdKeywords,
    missingKeywords,
    strengths,
    weaknesses,
    bulletSuggestions,
    interviewSuggestions,
  } = analysis;

  // Prepare radar chart data for score categories
  const radarData = [
    { subject: "Keywords Match", value: scoreBreakdown.keywordMatch, fullMark: 35 },
    { subject: "Sections", value: scoreBreakdown.sectionCompleteness, fullMark: 20 },
    { subject: "Action Verbs", value: scoreBreakdown.actionVerbs, fullMark: 15 },
    { subject: "Quantifiable Metrics", value: scoreBreakdown.quantifiableResults, fullMark: 15 },
    { subject: "Formatting & Size", value: scoreBreakdown.formattingLength, fullMark: 15 },
  ];

  // Helper to determine score feedback class and label
  const getScoreFeedback = (score: number) => {
    if (score >= 85) return { label: "Excellent Match", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" };
    if (score >= 70) return { label: "Strong Match", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" };
    if (score >= 50) return { label: "Fair Match", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" };
    return { label: "Needs Improvement", color: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5" };
  };

  const feedback = getScoreFeedback(atsScore);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      {/* Back Button and File info header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6 border-b border-zinc-900 mb-8">
        <div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-2 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Upload New Resume
          </button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
              {fileName}
            </h2>
          </div>
        </div>
        <div className="text-xs text-zinc-500 text-right">
          Report generated on {new Date(analysis.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Grid: Stats Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Main ATS Score */}
        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">ATS Compatibility Score</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-extrabold tracking-tight ${feedback.color}`}>{atsScore}</span>
              <span className="text-zinc-600 text-sm">/ 100</span>
            </div>
            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full border ${feedback.border} ${feedback.bg} px-2.5 py-0.5 text-xs font-semibold ${feedback.color}`}>
              {feedback.label}
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-6 leading-relaxed">
            Calculated using hard skill keyword match density, standard section headers, action verbs count, metrics, and word formatting constraints.
          </p>
        </div>

        {/* Card 2: Radar Score Breakdown */}
        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl lg:col-span-2 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
          <div className="flex-1 w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                <PolarRadiusAxis angle={30} domain={[0, 35]} stroke="#27272a" tick={false} />
                <Radar
                  name="Score Breakdown"
                  dataKey="value"
                  stroke="#a855f7"
                  fill="#c084fc"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-48 text-xs">
            <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px] mb-1">Score Breakdown</h4>
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">Keyword Match:</span>
              <span className="font-medium text-white">{scoreBreakdown.keywordMatch} <span className="text-zinc-600">/ 35</span></span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">Section Complete:</span>
              <span className="font-medium text-white">{scoreBreakdown.sectionCompleteness} <span className="text-zinc-600">/ 20</span></span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">Action Verbs:</span>
              <span className="font-medium text-white">{scoreBreakdown.actionVerbs} <span className="text-zinc-600">/ 15</span></span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1">
              <span className="text-zinc-500">Metrics Impact:</span>
              <span className="font-medium text-white">{scoreBreakdown.quantifiableResults} <span className="text-zinc-600">/ 15</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Formatting Check:</span>
              <span className="font-medium text-white">{scoreBreakdown.formattingLength} <span className="text-zinc-600">/ 15</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Layout Check & Keywords Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Section Verification Check */}
        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-400" />
            Standard Section Verifications
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-900/50 bg-zinc-950/20">
              {sectionsFound.experience ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="text-xs font-semibold text-zinc-300 block">Experience</span>
                <span className="text-[10px] text-zinc-500">{sectionsFound.experience ? "Verified" : "Missing header"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-900/50 bg-zinc-950/20">
              {sectionsFound.education ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="text-xs font-semibold text-zinc-300 block">Education</span>
                <span className="text-[10px] text-zinc-500">{sectionsFound.education ? "Verified" : "Missing header"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-900/50 bg-zinc-950/20">
              {sectionsFound.projects ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="text-xs font-semibold text-zinc-300 block">Projects</span>
                <span className="text-[10px] text-zinc-500">{sectionsFound.projects ? "Verified" : "Missing header"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-900/50 bg-zinc-950/20">
              {sectionsFound.skills ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="text-xs font-semibold text-zinc-300 block">Skills</span>
                <span className="text-[10px] text-zinc-500">{sectionsFound.skills ? "Verified" : "Missing header"}</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-4 leading-relaxed">
            Tip: ATS scanners look for literal headers (like "Experience" or "Projects"). Use clean, standard terminology rather than creative header titles.
          </p>
        </div>

        {/* Skills Gaps Card */}
        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-400" />
              JD Keyword Coverage & Gaps
            </h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
              {jdKeywords.map((keyword, i) => {
                const isMissing = missingKeywords.some(mk => mk.toLowerCase() === keyword.toLowerCase());
                return (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                      isMissing
                        ? "border-rose-500/20 bg-rose-500/5 text-rose-400"
                        : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                    }`}
                  >
                    {keyword}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-900/60 flex justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Detected
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Missing / Weak
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths Card */}
        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Key Resume Strengths
          </h3>
          <ul className="flex flex-col gap-3">
            {strengths.map((strength, i) => (
              <li key={i} className="flex gap-2 text-xs text-zinc-300 leading-relaxed">
                <span className="text-emerald-500 shrink-0 font-bold">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-rose-400 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Areas of Concern / Critical Gaps
          </h3>
          <ul className="flex flex-col gap-3">
            {weaknesses.map((weakness, i) => (
              <li key={i} className="flex gap-2 text-xs text-zinc-300 leading-relaxed">
                <span className="text-rose-500 shrink-0 font-bold">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Rewrite suggestions card */}
      <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl mb-8">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-purple-400" />
          AI-Powered Bullet Point Optimization
        </h3>

        <div className="flex flex-col gap-6">
          {bulletSuggestions.map((suggestion, i) => (
            <div key={i} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 text-xs relative group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Original Bullet Point</span>
                  <p className="text-zinc-400 italic font-mono bg-zinc-950 p-3 rounded-lg border border-zinc-900/50">
                    "{suggestion.original}"
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">Recommended ATS Rewrite</span>
                    <button
                      onClick={() => copyToClipboard(suggestion.suggested, i)}
                      className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white font-semibold"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Text
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-white font-medium bg-purple-500/5 p-3 rounded-lg border border-purple-500/20">
                    {suggestion.suggested}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-900/40 text-[11px] text-zinc-500">
                <span className="text-purple-400 font-semibold">Recruiting Logic:</span> {suggestion.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Mock Interview Suggestions */}
      <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-purple-400" />
          Targeted Interview Questions & Prep
        </h3>

        <div className="flex flex-col gap-6">
          {interviewSuggestions.map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 text-xs">
                <h4 className="font-semibold text-zinc-200 mb-1 leading-relaxed">
                  {item.question}
                </h4>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900/80 text-zinc-400 leading-relaxed mt-2">
                  <span className="text-purple-400 font-bold">Preparation Strategy: </span> 
                  {item.expectedAnswer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
