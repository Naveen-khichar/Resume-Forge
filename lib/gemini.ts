import { GoogleGenAI } from "@google/genai";

// Ensure the client is instantiated only if the API key is present
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "WARNING: GEMINI_API_KEY environment variable is not defined. ResumeForge will fall back to mock data."
  );
}

const ai = new GoogleGenAI({ apiKey: apiKey || "MOCK_KEY" });

export interface GeminiAnalysisResult {
  detectedSkills: string[];
  jdKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  bulletSuggestions: {
    original: string;
    suggested: string;
    reason: string;
  }[];
  interviewSuggestions: {
    question: string;
    expectedAnswer: string;
  }[];
}

/**
 * Sends parsed resume text and job description to Gemini AI and extracts structured insights.
 */
export async function analyzeResumeWithGemini(
  resumeText: string,
  jobDescription: string
): Promise<GeminiAnalysisResult> {
  // If API key is missing, fall back to high-quality mock data for testing
  if (!apiKey || apiKey === "MOCK_KEY") {
    return getMockAnalysis(resumeText, jobDescription);
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) recruiter and resume optimization AI.
Your job is to perform a detailed analysis of a candidate's resume text against a target Job Description.

Resume Text:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Analyze the candidate's resume against the Job Description and return a JSON object with the following fields:
1. "detectedSkills": Array of technical and soft skills found in the candidate's resume (strings).
2. "jdKeywords": Array of core keywords/technical skills required in the Job Description (strings).
3. "missingKeywords": Array of core keywords/technical skills required by the Job Description that are missing or weakly represented in the resume (strings).
4. "strengths": Array of 3 strings representing the key strengths of this resume relative to the JD.
5. "weaknesses": Array of 3 strings representing the key gaps/weaknesses of this resume relative to the JD.
6. "bulletSuggestions": Array of objects, each containing:
   - "original": A weak bullet point from the experience or project section.
   - "suggested": A rewritten bullet point that is stronger, uses action verbs, and incorporates quantifiable metrics if possible.
   - "reason": A brief explanation of why this change improves the ATS visibility.
7. "interviewSuggestions": Array of 3 objects, each containing:
   - "question": An interview question the candidate is likely to face for this role based on their gaps or background.
   - "expectedAnswer": A summary of the key points the candidate should focus on in their answer to impress the interviewer.

Ensure the response contains ONLY the valid JSON object. Do not include markdown tags or any other explanations outside the JSON structure.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsedResult = JSON.parse(responseText) as GeminiAnalysisResult;
    return parsedResult;
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    throw new Error(`AI Analysis failed: ${error.message || error}`);
  }
}

/**
 * High-quality fallback mock analysis data for developers running without API keys.
 */
function getMockAnalysis(resumeText: string, jobDescription: string): GeminiAnalysisResult {
  console.log("Using mock Gemini analysis data (GEMINI_API_KEY is not set)");
  
  return {
    detectedSkills: [
      "React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Git", "GitHub", 
      "REST APIs", "Node.js", "Express", "Software Engineering"
    ],
    jdKeywords: [
      "React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", 
      "REST APIs", "System Design", "Unit Testing", "CI/CD"
    ],
    missingKeywords: [
      "Next.js", "MongoDB", "Tailwind CSS", "Unit Testing", "CI/CD"
    ],
    strengths: [
      "Demonstrates strong foundational knowledge in core frontend technologies (React, JavaScript, HTML/CSS).",
      "Good familiarity with standard collaborative tools and repository practices (Git and GitHub).",
      "Basic backend exposure using Node.js and building RESTful APIs is clearly documented."
    ],
    weaknesses: [
      "Missing modern meta-framework experience like Next.js, which is explicitly requested in the job description.",
      "No database management experience mentioned (such as MongoDB, Postgres, or SQL databases).",
      "Lack of testing framework integration details (e.g. Jest, Cypress) or continuous integration (CI/CD) pipelines."
    ],
    bulletSuggestions: [
      {
        original: "Worked on building some frontend components using React.",
        suggested: "Engineered 12+ modular, reusable React UI components, improving page load speed by 24% and styling consistency across views.",
        reason: "Uses strong action verb ('Engineered') and injects a quantifiable metric (12+ components, 24% speedup) to demonstrate impact."
      },
      {
        original: "Made APIs in Node.js and tested them.",
        suggested: "Developed and documented robust backend REST APIs using Node.js, reducing server response latencies by 15% through optimized query handling.",
        reason: "Replaces weak phrasing ('Made', 'tested') with professional terminology and quantifies execution gains."
      }
    ],
    interviewSuggestions: [
      {
        question: "Your resume focuses heavily on Single Page Applications (SPAs) with standard React. Can you explain the difference between client-side rendering (CSR) in React and Server-Side Rendering (SSR) in Next.js?",
        expectedAnswer: "Focus on explaining initial page load latency advantages, Search Engine Optimization (SEO) crawlers visibility, automatic code-splitting in Next.js, and server-side resource fetching versus client-side waterfall loaders."
      },
      {
        question: "We see Node.js experience, but no databases listed. How would you design a MongoDB schema for a dynamic project tracking system?",
        expectedAnswer: "Talk about documents, embedding vs referencing subdocuments, using Mongoose for schema enforcement, creating index pathways on query filters, and handling relationships."
      }
    ]
  };
}
