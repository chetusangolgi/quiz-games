import React, { useEffect, useState } from 'react';

interface QuizResultsProps {
  email: string;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRestart
}) => {
  const [countdown, setCountdown] = useState(5);

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
    }, 1000);

    return () => clearInterval(timer);
  }, [onRestart]);

  const isZeroScore = score === 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <img
          src={isZeroScore ? '/luck.png' : '/congrats.png'}
          alt="Result Trophy"
          className="w-64 sm:w-72 mb-8"
        />

        {isZeroScore ? (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Better luck next time!
            </h1>
            <p className="text-white text-5xl sm:text-6xl font-bold mb-3">
              {score}/{totalQuestions}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              CONGRATULATIONS!
            </h1>
            <p className="text-white text-lg sm:text-xl mb-1">You got!</p>
            <p className="text-white text-5xl sm:text-6xl font-bold mb-3">
              {score}/{totalQuestions}
            </p>
            <p className="text-white text-lg sm:text-xl">Correct answers!</p>
          </>
        )}
      </div>
    </div>
  );
};
