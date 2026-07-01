export interface Analysis {
  id?: string;
  userId?: string;
  fileName: string;
  jobDescription: string;
  atsScore: number;
  scoreBreakdown: {
    keywordMatch: number;
    sectionCompleteness: number;
    actionVerbs: number;
    quantifiableResults: number;
    formattingLength: number;
    total: number;
  };
  sectionsFound: {
    education: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
  };
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
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}
