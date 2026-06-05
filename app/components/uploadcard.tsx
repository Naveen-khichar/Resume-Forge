"use client";

import { useState } from "react";

export default function UploadCard() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const handleAnalyze = () => {
  console.log("Button clicked");

  if (!file) {
    alert("Upload a resume first");
    return;
  }

  if (!jobDescription.trim()) {
    alert("Paste a job description");
    return;
  }

  console.log(file.name);
  console.log(jobDescription);
};

  return (
    <div className="max-w-3xl mx-auto mt-20 p-8 border border-gray-800 rounded-2xl bg-zinc-900">
      <h2 className="text-2xl font-bold mb-6">
        Upload Your Resume
      </h2>
      <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center">
        <p className="text-gray-400">
          Drag & Drop Resume Here
        </p>

        <p className="text-gray-500 mt-2">
          PDF or DOCX
        </p>
      </div>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Please upload PDF or DOCX");
            return;
        }

        setFile(selectedFile);
        }}
        className="mb-4"
      />

      {file && (
        <p className="text-green-400 mb-4">
          Selected: {file.name}
        </p>
      )}

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste Job Description Here..."
        className="w-full p-4 rounded-xl bg-black border border-gray-700 h-40"
      />

      <button
        onClick={handleAnalyze}
        className="mt-6 w-full bg-white text-black py-3 rounded-xl font-semibold"
        >
        Analyze Resume
      </button>
    </div>
  );
}