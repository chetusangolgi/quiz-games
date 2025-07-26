import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { saveQuizResult } from '../lib/supabase';
import { calculateWeightedScore } from '../lib/scoreCalculation';

// Mock the supabase module
vi.mock('../lib/supabase', () => ({
  saveQuizResult: vi.fn()
}));

// Mock questions with more variety for edge case testing
vi.mock('../data/questions', () => ({
  questions: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    question: `Test question ${i + 1}?`,
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0
  }))
}));

vi.mock('../lib/questionUtils', () => ({
  selectRandomQuestions: vi.fn((questions, count) => questions.slice(0, count))
}));

global.fetch = vi.fn();

describe('Edge Cases and Error Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (saveQuizResult as any).mockResolvedValue(true);
    (global.fetch as any).mockResolvedValue({ ok: true });
  });

  describe('Quiz timeout scenarios', () => {
    it('should handle complete timeout with zero score', async () => {
      vi.useFakeTimers();
      
      render(<App />);
      
      // Start quiz
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByText(/start quiz/i));

      // Wait for quiz to start
      await waitFor(() => {
        expect(screen.getByText('Test question 1?')).toBeInTheDocument();
      });

      // Simulate complete timeout without answering any questions
      vi.advanceTimersByTime(120000);

      // Verify timeout handling
      await waitFor(() => {
        expect(saveQuizResult).toHaveBeenCalledWith({
          email: 'test@example.com',
          game: 'General Knowledge Quiz',
          score: 0, // (0/10)*5 + (0/120)*5 = 0
          correctAnswers: 0,
          timeUsed: 120
        });
      });

      // Verify zero score display
      await waitFor(() => {
        expect(screen.getByText('0/10')).toBeInTheDocument();
        expect(screen.getByText(/better luck next time/i)).toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it('should handle partial completion before timeout', async () => {
      vi.useFakeTimers();
      
      render(<App />);
      
      // Start quiz
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByText(/start quiz/i));

      // Answer some questions before timeout
      await waitFor(() => {
        expect(screen.getByText('Test question 1?')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('A')); // Correct

      await waitFor(() => {
        expect(screen.getByText('Test question 2?')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('A')); // Correct

      // Simulate timeout after answering 2 questions
      vi.advanceTimersByTime(120000);

      // Verify partial score with timeout
      await waitFor(() => {
        expect(saveQuizResult).toHaveBeenCalledWith({
          email: 'test@example.com',
          game: 'General Knowledge Quiz',
          score: 1, // (2/10)*5 + (0/120)*5 = 1 + 0 = 1
          correctAnswers: 2,
          timeUsed: 120
        });
      });

      vi.useRealTimers();
    });
  });

  describe('Perfect score scenarios', () => {
    it('should handle perfect accuracy and perfect speed', () => {
      const result = calculateWeightedScore(10, 10, 120, 120);
      
      expect(result.pointsScore).toBe(5.0);
      expect(result.timeScore).toBe(5.0);
      expect(result.finalScore).toBe(10.0);
      expect(result.timeUsed).toBe(0);
    });

    it('should handle perfect accuracy with no time bonus', () => {
      const result = calculateWeightedScore(10, 10, 0, 120);
      
      expect(result.pointsScore).toBe(5.0);
      expect(result.timeScore).toBe(0.0);
      expect(result.finalScore).toBe(5.0);
      expect(result.timeUsed).toBe(120);
    });
  });

  describe('Zero correct answers scenarios', () => {
    it('should handle zero correct with remaining time', () => {
      const result = calculateWeightedScore(0, 10, 60, 120);
      
      expect(result.pointsScore).toBe(0.0);
      expect(result.timeScore).toBe(2.5);
      expect(result.finalScore).toBe(2.5);
    });

    it('should handle zero correct with no time remaining', () => {
      const result = calculateWeightedScore(0, 10, 0, 120);
      
      expect(result.pointsScore).toBe(0.0);
      expect(result.timeScore).toBe(0.0);
      expect(result.finalScore).toBe(0.0);
    });
  });

  describe('Graceful degradation scenarios', () => {
    it('should handle missing timing data gracefully', () => {
      // Test with invalid timing data
      const result = calculateWeightedScore(5, 10, -10, 0);
      
      // Should clamp negative time to 0 and prevent division by zero
      expect(result.timeScore).toBe(0.0);
      expect(result.totalTime).toBe(1); // Minimum to prevent division by zero
      expect(result.pointsScore).toBe(2.5);
      expect(result.finalScore).toBe(2.5);
    });

    it('should handle database save failures gracefully', async () => {
      (saveQuizResult as any).mockResolvedValue(false);
      
      render(<App />);
      
      // Complete a quiz
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByText(/start quiz/i));

      await waitFor(() => {
        expect(screen.getByText('Test question 1?')).toBeInTheDocument();
      });
      
      // Answer all questions quickly to complete quiz
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('A'));
        if (i < 9) {
          await waitFor(() => {
            expect(screen.getByText(`Test question ${i + 2}?`)).toBeInTheDocument();
          });
        }
      }

      // Should still show results even if save failed
      await waitFor(() => {
        expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
      });
    });

    it('should handle webhook failures gracefully', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));
      
      render(<App />);
      
      // Complete quiz
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByText(/start quiz/i));

      await waitFor(() => {
        expect(screen.getByText('Test question 1?')).toBeInTheDocument();
      });
      
      // Complete quiz quickly
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('A'));
        if (i < 9) {
          await waitFor(() => {
            expect(screen.getByText(`Test question ${i + 2}?`)).toBeInTheDocument();
          });
        }
      }

      // Should still show results even if webhook failed
      await waitFor(() => {
        expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
      });
    });
  });

  describe('Boundary value testing', () => {
    it('should handle minimum possible score', () => {
      const result = calculateWeightedScore(0, 10, 0, 120);
      expect(result.finalScore).toBe(0.0);
    });

    it('should handle maximum possible score', () => {
      const result = calculateWeightedScore(10, 10, 120, 120);
      expect(result.finalScore).toBe(10.0);
    });

    it('should handle single question quiz', () => {
      const result = calculateWeightedScore(1, 1, 60, 120);
      expect(result.pointsScore).toBe(5.0);
      expect(result.timeScore).toBe(2.5);
      expect(result.finalScore).toBe(7.5);
    });

    it('should handle very fast completion', () => {
      const result = calculateWeightedScore(10, 10, 119, 120);
      expect(result.timeScore).toBe(5.0); // Almost perfect time
      expect(result.timeUsed).toBe(1); // Only 1 second used
    });
  });
});