import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { saveQuizResult } from '../lib/supabase';

// Mock the supabase module
vi.mock('../lib/supabase', () => ({
  saveQuizResult: vi.fn()
}));

// Mock the questions data
vi.mock('../data/questions', () => ({
  questions: [
    {
      id: 1,
      question: 'Test question 1?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Test question 2?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1
    }
  ]
}));

// Mock the question utils to return predictable results
vi.mock('../lib/questionUtils', () => ({
  selectRandomQuestions: vi.fn((questions, count) => questions.slice(0, count))
}));

// Mock fetch for webhook calls
global.fetch = vi.fn();

describe('Weighted Scoring Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (saveQuizResult as any).mockResolvedValue(true);
    (global.fetch as any).mockResolvedValue({ ok: true });
    
    // Mock Date.now to control timing
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(0) // Start time
      .mockReturnValueOnce(60000); // End time (60 seconds later)
  });

  it('should calculate and save weighted score when quiz completes', async () => {
    render(<App />);
    
    // Enter email and start quiz
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/start quiz/i));

    // Answer first question correctly
    await waitFor(() => {
      expect(screen.getByText('Test question 1?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('A')); // Correct answer

    // Answer second question correctly (this should complete the quiz)
    await waitFor(() => {
      expect(screen.getByText('Test question 2?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('B')); // Correct answer

    // Verify weighted score calculation and database save
    await waitFor(() => {
      expect(saveQuizResult).toHaveBeenCalledWith({
        email: 'test@example.com',
        game: 'General Knowledge Quiz',
        score: 7.5, // (2/2)*5 + (60/120)*5 = 5 + 2.5 = 7.5
        correctAnswers: 2,
        timeUsed: 60
      });
    });

    // Verify results display shows weighted score
    await waitFor(() => {
      expect(screen.getByText('7.5/10')).toBeInTheDocument();
      expect(screen.getByText('Points: 5/5 | Time: 2.5/5')).toBeInTheDocument();
    });
  });

  it('should handle timeout scenario with weighted scoring', async () => {
    // Mock timer to simulate timeout
    vi.useFakeTimers();
    
    render(<App />);
    
    // Enter email and start quiz
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/start quiz/i));

    // Wait for quiz to start
    await waitFor(() => {
      expect(screen.getByText('Test question 1?')).toBeInTheDocument();
    });

    // Simulate timeout (120 seconds)
    vi.advanceTimersByTime(120000);

    // Verify timeout handling with weighted score
    await waitFor(() => {
      expect(saveQuizResult).toHaveBeenCalledWith({
        email: 'test@example.com',
        game: 'General Knowledge Quiz',
        score: 0, // (0/2)*5 + (0/120)*5 = 0 + 0 = 0
        correctAnswers: 0,
        timeUsed: 120
      });
    });

    vi.useRealTimers();
  });

  it('should send correct webhook payload with weighted scoring', async () => {
    render(<App />);
    
    // Complete quiz flow
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/start quiz/i));

    // Answer questions
    await waitFor(() => {
      expect(screen.getByText('Test question 1?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('A'));

    await waitFor(() => {
      expect(screen.getByText('Test question 2?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('B'));

    // Verify webhook payload
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://hook.eu1.make.com/4jtevja63bir17db4oqw267cvuxe5y98',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            element_id: '04',
            game_name: 'MCQ',
            location: 'surat',
            score: 7.5, // Weighted score
            correct_answers: 2,
            time_used: 60
          })
        }
      );
    });
  });

  it('should display score breakdown correctly', async () => {
    render(<App />);
    
    // Complete quiz with partial correct answers
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/start quiz/i));

    // Answer first question correctly, second incorrectly
    await waitFor(() => {
      expect(screen.getByText('Test question 1?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('A')); // Correct

    await waitFor(() => {
      expect(screen.getByText('Test question 2?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('A')); // Incorrect (correct is B)

    // Verify score breakdown display
    await waitFor(() => {
      // (1/2)*5 + (60/120)*5 = 2.5 + 2.5 = 5.0
      expect(screen.getByText('5/10')).toBeInTheDocument();
      expect(screen.getByText('Points: 2.5/5 | Time: 2.5/5')).toBeInTheDocument();
      expect(screen.getByText('1/2 correct answers in 1:00')).toBeInTheDocument();
    });
  });
});