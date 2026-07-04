"use client";

import React, { useState, useRef } from "react";

import { Analysis } from "@/types";

export default function UploadCard({ 
  onAnalysisComplete 
}: { 
  onAnalysisComplete: (data: Analysis) => void 
}) {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File type validation constants
  const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
  const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const MAX_FILE_SIZE_MB = 5;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Check file size (5MB limit)
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
      alert("Invalid file format. Please upload a PDF or DOCX resume.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please paste a target job description.");
      return;
    }

    try {
      setLoading(true);
      console.log("Analyzing file:", file.name);

      // Create FormData to send binary file and job description text
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData, // Fetch automatically handles Content-Type boundaries for FormData
      });

      if (!response.ok) {
        let errorMessage = "Failed to analyze resume.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (_) {
          try {
            const errorText = await response.text();
            if (errorText.includes("<html") || errorText.includes("<!DOCTYPE")) {
              errorMessage = `Server error (${response.status}): The request timed out or the server failed to respond. Please check your database connection or try again.`;
            } else {
              errorMessage = errorText || errorMessage;
            }
          } catch (textErr) {
            errorMessage = `HTTP error ${response.status}`;
          }
        }
        alert(errorMessage);
        return;
      }

      const data = await response.json();
      console.log("Response from server:", data);
      
      if (data.success && data.data) {
        onAnalysisComplete(data.data);
      } else {
        alert(data.error || "Failed to analyze resume.");
      }
    } catch (error) {
      console.error("API error:", error);
      alert("An error occurred during resume analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-20 p-6 md:p-8 rounded-2xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">1</span>
        Upload Document & Target Job Description
      </h2>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={file ? undefined : triggerFileInput}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          file 
            ? "border-zinc-800 bg-zinc-950/20 cursor-default" 
            : dragActive
              ? "border-purple-500 bg-purple-500/5"
              : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/30"
        }`}
      >
        {!file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Drag & drop your resume file or <span className="text-purple-400 font-semibold hover:underline">browse</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1">Supports PDF or DOCX (Max 5MB)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-4">
            <div className="flex items-center gap-3 text-left">
              <div className="h-10 w-10 rounded-md bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200 truncate max-w-[250px] sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {(file.size / 1024).toFixed(1)} KB • {file.type.split("/")[1]?.toUpperCase() || "Document"}
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Job Description Textarea */}
      <div className="mt-6">
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Pasted Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description requirements here..."
          className="w-full min-h-[140px] p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 text-sm resize-y"
        />
        <div className="flex justify-between items-center mt-2 text-xs text-zinc-500">
          <span>Be descriptive for better AI analysis matching</span>
          <span>{jobDescription.length} characters</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`mt-8 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          loading
            ? "bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed"
            : "bg-white hover:bg-zinc-100 text-black shadow-lg hover:shadow-white/5 active:scale-[0.99]"
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Resume Content...
          </>
        ) : (
          <>
            Analyze Resume Match
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </>
        )}
      </button>
    </div>
  );
}