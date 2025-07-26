export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  email: string;
  game: string;
  score: number;           // Weighted score out of 10
  correctAnswers: number;  // Raw correct count
  timeUsed: number;        // Time in seconds
  completed_at: string;
}

export interface WebhookPayload {
  email: string;
  element_id: string;
  game_name: string;
  location: string;
  score: number;           // Weighted score
  correct_answers: number;
  time_used: number;
}