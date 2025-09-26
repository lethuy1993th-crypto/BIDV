export interface FormData {
  context: string;
  goal: string;
  platform: string;
  audience: string;
  tone: string;
}

export interface GenerationResult {
  title: string;
  post: string;
  hashtags: string[];
}

export interface HistoryInput extends FormData {
  fileName?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  inputs: HistoryInput;
  result: GenerationResult;
}