import { selectRandomQuestions } from '../questionUtils';
import { Question } from '../../types';

// Mock questions for testing
const mockQuestions: Question[] = [
  { id: 1, question: "Q1", options: ["A", "B", "C", "D"], correctAnswer: 0 },
  { id: 2, question: "Q2", options: ["A", "B", "C", "D"], correctAnswer: 1 },
  { id: 3, question: "Q3", options: ["A", "B", "C", "D"], correctAnswer: 2 },
  { id: 4, question: "Q4", options: ["A", "B", "C", "D"], correctAnswer: 3 },
  { id: 5, question: "Q5", options: ["A", "B", "C", "D"], correctAnswer: 0 },
];

describe('selectRandomQuestions', () => {
  beforeEach(() => {
    // Reset console.warn mock before each test
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns correct number of questions', () => {
    const result = selectRandomQuestions(mockQuestions, 3);
    expect(result).toHaveLength(3);
  });

  test('returns no duplicates', () => {
    const result = selectRandomQuestions(mockQuestions, 3);
    const ids = result.map(q => q.id);
    const uniqueIds = [...new Set(ids)];
    expect(uniqueIds).toHaveLength(ids.length);
  });

  test('returns all questions when count equals array length', () => {
    const result = selectRandomQuestions(mockQuestions, 5);
    expect(result).toHaveLength(5);
    
    // Should contain all original questions
    const resultIds = result.map(q => q.id).sort();
    const originalIds = mockQuestions.map(q => q.id).sort();
    expect(resultIds).toEqual(originalIds);
  });

  test('returns all questions when count exceeds array length', () => {
    const result = selectRandomQuestions(mockQuestions, 10);
    expect(result).toHaveLength(5); // Should return all 5 available questions
    expect(console.warn).toHaveBeenCalledWith(
      'selectRandomQuestions: Requested 10 questions but only 5 available, returning all questions'
    );
  });

  test('handles empty array', () => {
    const result = selectRandomQuestions([], 3);
    expect(result).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(
      'selectRandomQuestions: Empty question array provided'
    );
  });

  test('handles invalid count (zero)', () => {
    const result = selectRandomQuestions(mockQuestions, 0);
    expect(result).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(
      'selectRandomQuestions: Invalid count provided, returning empty array'
    );
  });

  test('handles invalid count (negative)', () => {
    const result = selectRandomQuestions(mockQuestions, -1);
    expect(result).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(
      'selectRandomQuestions: Invalid count provided, returning empty array'
    );
  });

  test('does not mutate original array', () => {
    const originalQuestions = [...mockQuestions];
    selectRandomQuestions(mockQuestions, 3);
    expect(mockQuestions).toEqual(originalQuestions);
  });

  test('produces different results on multiple calls (randomness test)', () => {
    const results: number[][] = [];
    
    // Run the function multiple times and collect the order of IDs
    for (let i = 0; i < 10; i++) {
      const result = selectRandomQuestions(mockQuestions, 3);
      results.push(result.map(q => q.id));
    }
    
    // Check that not all results are identical (very unlikely with proper randomization)
    const firstResult = results[0];
    const allIdentical = results.every(result => 
      result.length === firstResult.length && 
      result.every((id, index) => id === firstResult[index])
    );
    
    expect(allIdentical).toBe(false);
  });

  test('maintains question object structure', () => {
    const result = selectRandomQuestions(mockQuestions, 2);
    
    result.forEach(question => {
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(question).toHaveProperty('correctAnswer');
      expect(Array.isArray(question.options)).toBe(true);
      expect(question.options).toHaveLength(4);
      expect(typeof question.correctAnswer).toBe('number');
    });
  });
});