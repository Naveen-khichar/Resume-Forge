import { NextResponse } from "next/server";
import { parseResume } from "@/lib/parser";
import { analyzeResumeWithGemini } from "@/lib/gemini";
import { calculateAtsScore } from "@/lib/scoring";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import AnalysisModel from "@/models/Analysis";
import { Analysis } from "@/types";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json(
        { success: false, error: "Target job description is required." },
        { status: 400 }
      );
    }

    // 1. Convert client file web stream to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;

    // 2. Extract raw text from the PDF/DOCX resume
    const parsedText = await parseResume(buffer, mimeType, file.name);

    if (!parsedText || parsedText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Could not extract readable text from the uploaded resume." },
        { status: 400 }
      );
    }

    console.log(`Parsed resume text successfully. Characters: ${parsedText.length}`);

    // Retrieve active session (if user is authenticated)
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (sessionErr) {
      console.warn("Could not retrieve active session:", sessionErr);
    }
    const userId = session?.user?.id;

    // Connect to database and save raw resume (if MONGODB_URI is configured)
    let savedResumeId: string | undefined;
    const isDbConfigured = !!process.env.MONGODB_URI;

    if (isDbConfigured) {
      try {
        await connectToDatabase();
        const newResume = await Resume.create({
          userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
          fileName: file.name,
          rawText: parsedText,
        });
        savedResumeId = newResume._id.toString();
        console.log("Resume document successfully saved to database. ID:", savedResumeId);
      } catch (dbError) {
        console.error("Database Resume storage error:", dbError);
      }
    }

    // 3. Query Gemini for AI-driven semantic analysis and keyword identification
    const aiAnalysis = await analyzeResumeWithGemini(parsedText, jobDescription);

    // 4. Compute deterministic mathematical ATS Score
    const scoringResult = calculateAtsScore(
      parsedText,
      aiAnalysis.detectedSkills,
      aiAnalysis.jdKeywords
    );

    // 5. Build full analysis response conforming to our TS schema
    const analysisReport: Analysis = {
      fileName: file.name,
      jobDescription,
      atsScore: scoringResult.score,
      scoreBreakdown: scoringResult.breakdown,
      sectionsFound: scoringResult.sectionsFound,
      detectedSkills: aiAnalysis.detectedSkills,
      jdKeywords: aiAnalysis.jdKeywords,
      missingKeywords: aiAnalysis.missingKeywords,
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      bulletSuggestions: aiAnalysis.bulletSuggestions,
      interviewSuggestions: aiAnalysis.interviewSuggestions,
      createdAt: new Date().toISOString(),
    };

    // Save computed analysis report (if MONGODB_URI and resume save succeeded)
    if (isDbConfigured && savedResumeId) {
      try {
        const savedAnalysis = await AnalysisModel.create({
          userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
          resumeId: new mongoose.Types.ObjectId(savedResumeId),
          jobDescription: analysisReport.jobDescription,
          atsScore: analysisReport.atsScore,
          scoreBreakdown: analysisReport.scoreBreakdown,
          sectionsFound: analysisReport.sectionsFound,
          detectedSkills: analysisReport.detectedSkills,
          jdKeywords: analysisReport.jdKeywords,
          missingKeywords: analysisReport.missingKeywords,
          strengths: analysisReport.strengths,
          weaknesses: analysisReport.weaknesses,
          bulletSuggestions: analysisReport.bulletSuggestions,
          interviewSuggestions: analysisReport.interviewSuggestions,
        });
        console.log("Analysis report successfully logged to database. ID:", savedAnalysis._id.toString());
      } catch (dbError) {
        console.error("Database Analysis storage error:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Resume analyzed successfully!",
      data: analysisReport
    });
  } catch (error: any) {
    console.error("Analysis Pipeline Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred during resume analysis." },
      { status: 500 }
    );
  }
}
