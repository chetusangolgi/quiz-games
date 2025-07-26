import { describe, it, expect } from 'vitest';
import { calculateWeightedScore, ScoreComponents } from '../lib/scoreCalculation';

describe('calculateWeightedScore', () => {
  describe('Standard scoring scenarios', () => {
    it('should calculate correct score for standard performance (7/10 correct, 60s remaining)', () => {
      const result = calculateWeightedScore(7, 10, 60, 120);
      
      expect(result.pointsScore).toBe(3.5); // (7/10) * 5 = 3.5
      expect(result.timeScore).toBe(2.5);   // (60/120) * 5 = 2.5
      expect(result.finalScore).toBe(6.0);  // 3.5 + 2.5 = 6.0
      expect(result.correctAnswers).toBe(7);
      expect(result.totalQuestions).toBe(10);
      expect(result.timeUsed).toBe(60);     // 120 - 60 = 60
      expect(result.totalTime).toBe(120);
    });

    it('should calculate correct score for perfect performance (10/10 correct, 120s remaining)', () => {
      const result = calculateWeightedScore(10, 10, 120, 120);
      
      expect(result.pointsScore).toBe(5.0); // (10/10) * 5 = 5.0
      expect(result.timeScore).toBe(5.0);   // (120/120) * 5 = 5.0
      expect(result.finalScore).toBe(10.0); // 5.0 + 5.0 = 10.0
    });

    it('should calculate correct score for time pressure scenario (8/10 correct, 10s remaining)', () => {
      const result = calculateWeightedScore(8, 10, 10, 120);
      
      expect(result.pointsScore).toBe(4.0); // (8/10) * 5 = 4.0
      expect(result.timeScore).toBe(0.4);   // (10/120) * 5 = 0.416... rounded to 0.4
      expect(result.finalScore).toBe(4.4);  // 4.0 + 0.4 = 4.4
    });

    it('should calculate correct score for poor performance (2/10 correct, 30s remaining)', () => {
      const result = calculateWeightedScore(2, 10, 30, 120);
      
      expect(result.pointsScore).toBe(1.0); // (2/10) * 5 = 1.0
      expect(result.timeScore).toBe(1.3);   // (30/120) * 5 = 1.25 rounded to 1.3
      expect(result.finalScore).toBe(2.3);  // 1.0 + 1.3 = 2.3
    });
  });

  describe('Edge cases', () => {
    it('should handle timeout scenario (5/10 correct, 0s remaining)', () => {
      const result = calculateWeightedScore(5, 10, 0, 120);
      
      expect(result.pointsScore).toBe(2.5); // (5/10) * 5 = 2.5
      expect(result.timeScore).toBe(0.0);   // (0/120) * 5 = 0.0
      expect(result.finalScore).toBe(2.5);  // 2.5 + 0.0 = 2.5
      expect(result.timeUsed).toBe(120);    // All time used
    });

    it('should handle perfect speed scenario (0/10 correct, 120s remaining)', () => {
      const result = calculateWeightedScore(0, 10, 120, 120);
      
      expect(result.pointsScore).toBe(0.0); // (0/10) * 5 = 0.0
      expect(result.timeScore).toBe(5.0);   // (120/120) * 5 = 5.0
      expect(result.finalScore).toBe(5.0);  // 0.0 + 5.0 = 5.0
      expect(result.timeUsed).toBe(0);      // No time used
    });

    it('should handle zero score scenario (0/10 correct, 0s remaining)', () => {
      const result = calculateWeightedScore(0, 10, 0, 120);
      
      expect(result.pointsScore).toBe(0.0);
      expect(result.timeScore).toBe(0.0);
      expect(result.finalScore).toBe(0.0);
    });
  });

  describe('Input validation', () => {
    it('should handle negative correct answers', () => {
      const result = calculateWeightedScore(-5, 10, 60, 120);
      
      expect(result.correctAnswers).toBe(0); // Clamped to 0
      expect(result.pointsScore).toBe(0.0);
    });

    it('should handle correct answers exceeding total questions', () => {
      const result = calculateWeightedScore(15, 10, 60, 120);
      
      expect(result.correctAnswers).toBe(10); // Clamped to total questions
      expect(result.pointsScore).toBe(5.0);   // Perfect score
    });

    it('should handle negative time remaining', () => {
      const result = calculateWeightedScore(5, 10, -30, 120);
      
      expect(result.timeScore).toBe(0.0);     // Negative time treated as 0
      expect(result.timeUsed).toBe(120);      // All time used
    });

    it('should prevent division by zero with zero total questions', () => {
      const result = calculateWeightedScore(5, 0, 60, 120);
      
      expect(result.totalQuestions).toBe(1);  // Minimum 1 to prevent division by zero
      expect(result.pointsScore).toBe(5.0);   // 5/1 * 5 = 25, but capped at 5
    });

    it('should prevent division by zero with zero total time', () => {
      const result = calculateWeightedScore(5, 10, 30, 0);
      
      expect(result.totalTime).toBe(1);       // Minimum 1 to prevent division by zero
      expect(result.timeScore).toBe(5.0);     // 30/1 * 5 = 150, but capped at 5
    });
  });

  describe('Rounding and precision', () => {
    it('should round scores to 1 decimal place', () => {
      const result = calculateWeightedScore(3, 10, 37, 120);
      
      // (3/10) * 5 = 1.5, (37/120) * 5 = 1.541666...
      expect(result.pointsScore).toBe(1.5);
      expect(result.timeScore).toBe(1.5);     // Rounded from 1.541666...
      expect(result.finalScore).toBe(3.0);    // 1.5 + 1.5 = 3.0
    });

    it('should handle floating point precision issues', () => {
      const result = calculateWeightedScore(1, 3, 40, 120);
      
      // (1/3) * 5 = 1.666666..., (40/120) * 5 = 1.666666...
      expect(result.pointsScore).toBe(1.7);   // Rounded
      expect(result.timeScore).toBe(1.7);     // Rounded
      expect(result.finalScore).toBe(3.4);    // 1.7 + 1.7 = 3.4
    });

    it('should round time used to whole seconds', () => {
      const result = calculateWeightedScore(5, 10, 37.7, 120);
      
      expect(result.timeUsed).toBe(82);       // 120 - 37.7 = 82.3, rounded to 82
    });
  });
});