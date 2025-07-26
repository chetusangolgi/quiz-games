import React, { useEffect, useState } from 'react';
import { calculateWeightedScore } from '../lib/scoreCalculation';

interface QuizResultsProps {
  email: string;
  score: number;
  totalQuestions: number;
  timeUsed: number;
  onRestart: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  email,
  score,
  totalQuestions,
  timeUsed,
  onRestart
}) => {
  const [countdown, setCountdown] = useState(5);

  // Calculate weighted score components
  const timeRemaining = 120 - timeUsed;
  const scoreComponents = calculateWeightedScore(score, totalQuestions, timeRemaining, 120);

  // Send results to webhook
  useEffect(() => {
    const sendResultsToAPI = async () => {
      try {
        const payload = {
          email,
          element_id: "04",
          game_name: "MCQ",
          location: "surat",
          score: scoreComponents.finalScore,
          correct_answers: score,
          time_used: timeUsed
        };

        await fetch('https://hook.eu1.make.com/4jtevja63bir17db4oqw267cvuxe5y98', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error('Error sending results to webhook:', error);
      }
    };

    sendResultsToAPI();
  }, [email, score, scoreComponents.finalScore, timeUsed]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onRestart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // ← Increase or correct this value later

    return () => clearInterval(timer);
  }, [onRestart]);

  const isZeroScore = scoreComponents.finalScore === 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center mt-[230px]">
        <img
          src={isZeroScore ? '/luck.png' : '/congrats.png'}
          alt="Result Trophy"
          className="w-[700px] mb-0"
        />

        <div className="mt-[70px]">
          {isZeroScore ? (
            <>
              <h1 className="text-[70px] font-extrabold text-white mb-2 leading-tight">
                Better luck next time!
              </h1>
              <p className="text-white text-[96px] font-bold mb-1 leading-none">
                {scoreComponents.finalScore}/10
              </p>
              <p className="text-white text-[40px] leading-[1.1]">Final Score</p>
            </>
          ) : (
            <>
              <h1 className="text-[70px] font-extrabold text-white mb-2 leading-[1.1]">
                CONGRATULATIONS!
              </h1>
              <p className="text-white text-[60px] mb-1 leading-[1.1]">Your Score:</p>
              <p className="text-white text-[96px] font-bold mb-1 leading-none">
                {scoreComponents.finalScore}/10
              </p>
              <div className="text-white text-[32px] leading-[1.2] mt-4 space-y-1">
               
                <p>{score}/{totalQuestions} correct answers in {Math.floor(timeUsed / 60)}:{(timeUsed % 60).toString().padStart(2, '0')}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
