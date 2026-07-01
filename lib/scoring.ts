import { Analysis } from "@/types";

// Standard ATS Action Verbs list for matching
const ATS_ACTION_VERBS = [
  "accelerated", "accomplished", "achieved", "analyzed", "assembled", "built", 
  "collaborated", "conceived", "constructed", "created", "delivered", "designed", 
  "detected", "determined", "developed", "directed", "engineered", "established", 
  "executed", "expanded", "facilitated", "formulated", "generated", "guided", 
  "implemented", "improved", "increased", "initiated", "installed", "instituted", 
  "introduced", "invented", "launched", "led", "managed", "maximized", "mediated", 
  "minimized", "negotiated", "obtained", "operated", "optimized", "orchestrated", 
  "organized", "overhauled", "pioneered", "planned", "produced", "programmed", 
  "reconstructed", "redesigned", "reduced", "reorganized", "resolved", "restructured", 
  "spearheaded", "strengthened", "supervised", "trained", "transformed", "upgraded"
];

export interface DetailedScoreBreakdown {
  keywordMatch: number;      // Max 35
  sectionCompleteness: number; // Max 20
  actionVerbs: number;       // Max 15
  quantifiableResults: number; // Max 15
  formattingLength: number;  // Max 15
  total: number;
}

export interface ScoreOutput {
  score: number;
  breakdown: DetailedScoreBreakdown;
  sectionsFound: {
    education: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
  };
  metricsCount: number;
  verbsFound: string[];
}

/**
 * Calculates a realistic ATS score based on mathematical parameters.
 */
export function calculateAtsScore(
  rawResumeText: string,
  resumeSkills: string[],
  jdKeywords: string[]
): ScoreOutput {
  const text = rawResumeText.toLowerCase();

  // 1. Keyword Match Score (Max: 35)
  // Jaccard-like matching of extracted skills to job description keywords
  let keywordMatchScore = 0;
  if (jdKeywords.length > 0) {
    const matchedCount = jdKeywords.filter(keyword => 
      resumeSkills.some(skill => skill.toLowerCase() === keyword.toLowerCase()) || 
      text.includes(keyword.toLowerCase())
    ).length;
    keywordMatchScore = Math.round((matchedCount / jdKeywords.length) * 35);
  }

  // 2. Section Completeness Score (Max: 20)
  // Check for presence of crucial standard sections
  const sectionsFound = {
    education: /education|academic/i.test(text),
    experience: /experience|work history|employment|professional history/i.test(text),
    projects: /projects|academic projects/i.test(text),
    skills: /skills|technical skills|expertise/i.test(text)
  };
  
  let sectionCompletenessScore = 0;
  if (sectionsFound.education) sectionCompletenessScore += 5;
  if (sectionsFound.experience) sectionCompletenessScore += 5;
  if (sectionsFound.projects) sectionCompletenessScore += 5;
  if (sectionsFound.skills) sectionCompletenessScore += 5;

  // 3. Action Verbs Score (Max: 15)
  // Scan for industry action verbs
  const verbsFound: string[] = [];
  ATS_ACTION_VERBS.forEach(verb => {
    // Word boundary regex check for verb
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(text)) {
      verbsFound.push(verb);
    }
  });
  
  // Calculate score based on unique action verbs count (1 point per verb, max 15)
  const actionVerbsScore = Math.min(verbsFound.length, 15);

  // 4. Quantifiable Results Score (Max: 15)
  // Search for metrics: percentages (%), dollar values ($), numbers followed by x (e.g. 5x), or plain numbers
  // Example matches: "40%", "$10k", "increased by 25", "3x growth"
  const metricRegex = /\b\d+(?:\.\d+)?%\b|\$\s*\d+(?:,\d+)*(?:\s*[kKmMbB])?\b|\b\d+\s*x\b|\b(?:increased|reduced|saved|improved|grown)\s+\w+\s+\w+\s*(?:by)?\s*\d+\b/gi;
  const metricsMatches = text.match(metricRegex);
  const uniqueMetricsCount = metricsMatches ? new Set(metricsMatches.map(m => m.toLowerCase())).size : 0;
  
  // 3 points per unique metric matched (max 15)
  const quantifiableResultsScore = Math.min(uniqueMetricsCount * 3, 15);

  // 5. Formatting & Length Score (Max: 15)
  // Words count check: Ideal is 400-800 words
  const wordCount = rawResumeText.trim().split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount >= 400 && wordCount <= 900) {
    lengthScore = 10;
  } else if (wordCount > 900 && wordCount <= 1200) {
    lengthScore = 7;
  } else if (wordCount >= 200 && wordCount < 400) {
    lengthScore = 5;
  } else {
    lengthScore = 3;
  }

  // Formatting (PDF/DOCX validation bias - since we only parsed pdf/docx we give full points)
  const formatScore = 5;
  const formattingLengthScore = lengthScore + formatScore;

  // Total ATS Score Calculation
  const total = keywordMatchScore + sectionCompletenessScore + actionVerbsScore + quantifiableResultsScore + formattingLengthScore;

  return {
    score: total,
    breakdown: {
      keywordMatch: keywordMatchScore,
      sectionCompleteness: sectionCompletenessScore,
      actionVerbs: actionVerbsScore,
      quantifiableResults: quantifiableResultsScore,
      formattingLength: formattingLengthScore,
      total
    },
    sectionsFound,
    metricsCount: uniqueMetricsCount,
    verbsFound
  };
}
