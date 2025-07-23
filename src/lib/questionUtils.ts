import { Question } from '../types';

/**
 * Selects a random subset of questions using the Fisher-Yates shuffle algorithm
 * @param questions - Array of questions to select from
 * @param count - Number of questions to select
 * @returns Array of randomly selected questions
 */
export function selectRandomQuestions(questions: Question[], count: number): Question[] {
  // Handle edge cases
  if (!questions || questions.length === 0) {
    return [];
  }
  
  if (count <= 0) {
    return [];
  }
  
  if (count >= questions.length) {
    // If requesting more questions than available, return all questions shuffled
    return shuffleArray([...questions]);
  }
  
  // Create a copy of the questions array to avoid mutating the original
  const questionsCopy = [...questions];
  
  // Apply Fisher-Yates shuffle to the entire array
  const shuffled = shuffleArray(questionsCopy);
  
  // Return the first 'count' questions from the shuffled array
  return shuffled.slice(0, count);
}

/**
 * Implements the Fisher-Yates shuffle algorithm
 * @param array - Array to shuffle
 * @returns Shuffled copy of the array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate random index between 0 and i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at i and randomIndex
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  
  return shuffled;
}