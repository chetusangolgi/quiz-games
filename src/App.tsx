import { useState, useEffect } from 'react';
import { EmailForm } from './components/EmailForm';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { questions } from './data/questions';
import { selectRandomQuestions } from './lib/questionUtils';
import { saveQuizResult } from './lib/supabase';
import { calculateWeightedScore } from './lib/scoreCalculation';
import { Question } from './types';

type GameState = 'email' | 'quiz' | 'results';

function App() {
  const [gameState, setGameState] = useState<GameState>('email');
  const [email, setEmail] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [timeUsed, setTimeUsed] = useState<number>(0);

  const handleEmailSubmit = (userEmail: string) => {
    setEmail(userEmail);
    setTimeLeft(120);
    // Select 10 random questions from the pool of 15
    const randomQuestions = selectRandomQuestions(questions, 10);
    setSelectedQuestions(randomQuestions);
    setStartTime(Date.now()); // Track quiz start time
    setGameState('quiz');
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  const saveResultsToSupabase = async (correctAnswers: number, timeUsedSeconds: number) => {
    try {
      // Ensure we have valid timing data
      const validTimeUsed = Math.max(0, Math.min(timeUsedSeconds, 120));
      const timeRemaining = Math.max(0, 120 - validTimeUsed);

      // Calculate weighted score with validated inputs
      const scoreComponents = calculateWeightedScore(correctAnswers, 10, timeRemaining, 120);

      const success = await saveQuizResult({
        email,
        game: 'General Knowledge Quiz',
        score: scoreComponents.finalScore,
        correctAnswers: correctAnswers,
        timeUsed: validTimeUsed
      });

      if (!success) {
        console.error('Failed to save quiz results to Supabase');
        // Continue execution - don't block user from seeing results
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
      // Continue execution - don't block user from seeing results
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
    }

    if (currentQuestionIndex + 1 < selectedQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed - calculate time used and save results
      const currentTime = Date.now();
      setEndTime(currentTime);
      const calculatedTimeUsed = Math.round((currentTime - startTime) / 1000);
      setTimeUsed(calculatedTimeUsed);
      saveResultsToSupabase(newScore, calculatedTimeUsed);
      setGameState('results');
    }
  };

  const handleTimeUp = () => {
    // Time's up - calculate time used and save current score
    const currentTime = Date.now();
    setEndTime(currentTime);
    const calculatedTimeUsed = Math.round((currentTime - startTime) / 1000);
    setTimeUsed(calculatedTimeUsed);
    saveResultsToSupabase(score, calculatedTimeUsed);
    setGameState('results');
  };

  const handleRestart = () => {
    setGameState('email');
    setEmail('');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(120);
    setSelectedQuestions([]); // Reset selected questions for new randomization
  };

  if (gameState === 'email') {
    return <EmailForm onSubmit={handleEmailSubmit} />;
  }

  if (gameState === 'quiz') {
    return (
      <QuizQuestion
        question={selectedQuestions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={10}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        onTimeUp={handleTimeUp}
        onAnswer={handleAnswer}
      />
    );
  }

  return (
    <QuizResults
      email={email}
      score={score}
      totalQuestions={10}
      timeUsed={timeUsed}
      onRestart={handleRestart}
    />
  );
}

export default App;