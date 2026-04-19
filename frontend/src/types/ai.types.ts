export interface Analysis {
  overall_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface AIResponse {
  message: string;
  data: {
    mode: string;
    message: string | null;
    analysis: Analysis | null;
    field_suggest: Record<string, string[]> | null;
  }
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string | null;
  analysis?: Analysis | null;
  timestamp: Date;
}