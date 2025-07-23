import { useState } from 'react';
import { EmailForm } from './components/EmailForm';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { questions } from './data/questions';
import { selectRandomQuestions } from './lib/questionUtils';
import { saveQuizResult } from './lib/supabase';
import { Question } from './types';

type GameState = 'email' | 'quiz' | 'results';

function App() {
  const [gameState, setGameState] = useState<GameState>('email');
  const [email, setEmail] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const handleEmailSubmit = (userEmail: string) => {
    setEmail(userEmail);
    setTimeLeft(120);
    // Select 10 random questions from the pool of 15
    const randomQuestions = selectRandomQuestions(questions, 10);
    setSelectedQuestions(randomQuestions);
    setGameState('quiz');
  };

  const saveResultsToSupabase = async (finalScore: number) => {
    try {
      const success = await saveQuizResult({
        email,
        game: 'General Knowledge Quiz',
        score: finalScore
      });

      if (!success) {
        console.error('Failed to save quiz results to Supabase');
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
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
      // Quiz completed - save results and show results screen
      saveResultsToSupabase(newScore);
      setGameState('results');
    }
  };

  const handleTimeUp = () => {
    // Time's up - save current score and show results screen
    saveResultsToSupabase(score);
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
      onRestart={handleRestart}
    />
  );
}

export default App;