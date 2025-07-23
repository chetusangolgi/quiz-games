export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  email: string;
  game: string;
  score: number;
  completed_at: string;
}