export interface ScoreComponents {
  pointsScore: number;      // Out of 5
  timeScore: number;        // Out of 5
  finalScore: number;       // Out of 10
  correctAnswers: number;
  totalQuestions: number;
  timeUsed: number;         // In seconds
  totalTime: number;        // In seconds
}

/**
 * Calculates weighted score combining correctness (50%) and time efficiency (50%)
 * @param correctAnswers Number of correct answers
 * @param totalQuestions Total number of questions
 * @param timeRemaining Time remaining in seconds
 * @param totalTime Total time allocated in seconds
 * @returns ScoreComponents with detailed breakdown
 */
export function calculateWeightedScore(
  correctAnswers: number,
  totalQuestions: number,
  timeRemaining: number,
  totalTime: number
): ScoreComponents {
  // Input validation and edge case handling
  const validCorrectAnswers = Math.max(0, Math.min(correctAnswers, totalQuestions));
  const validTotalQuestions = Math.max(1, totalQuestions); // Prevent division by zero
  const validTimeRemaining = Math.max(0, timeRemaining);
  const validTotalTime = Math.max(1, totalTime); // Prevent division by zero
  const timeUsed = validTotalTime - validTimeRemaining;

  // Calculate points component (50% weight, out of 5)
  const pointsScore = (validCorrectAnswers / validTotalQuestions) * 5;

  // Calculate time component (50% weight, out of 5)
  const timeScore = (validTimeRemaining / validTotalTime) * 5;

  // Calculate final score (out of 10)
  const finalScore = pointsScore + timeScore;

  // Round scores to 1 decimal place for display-friendly results
  return {
    pointsScore: Math.round(pointsScore * 10) / 10,
    timeScore: Math.round(timeScore * 10) / 10,
    finalScore: Math.round(finalScore * 10) / 10,
    correctAnswers: validCorrectAnswers,
    totalQuestions: validTotalQuestions,
    timeUsed: Math.round(timeUsed),
    totalTime: validTotalTime
  };
}