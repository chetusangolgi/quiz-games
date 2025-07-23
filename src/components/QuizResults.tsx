import React, { useEffect, useState } from 'react';

interface QuizResultsProps {
  email: string;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  email,
  score,
  totalQuestions,
  onRestart
}) => {
  const [countdown, setCountdown] = useState(5);

  // Send results to webhook API
  useEffect(() => {
    console.log('QuizResults component mounted with:', { email, score, totalQuestions });

    const sendResultsToAPI = async () => {
      console.log('Starting API call...');
      try {
        const payload = {
          "email": email,
          "element_id": "04",
          "game_name": "MCQ",
          "location": "surat",
          "score": score
        };

        console.log('Sending JSON payload:', JSON.stringify(payload, null, 2));

        const response = await fetch('https://hook.eu1.make.com/4jtevja63bir17db4oqw267cvuxe5y98', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
          console.log('Results sent successfully to webhook');
        } else {
          console.error('Failed to send results to webhook:', response.status);
        }
      } catch (error) {
        console.error('Error sending results to webhook:', error);
      }
    };

    // Send results immediately when component mounts
    sendResultsToAPI();
  }, [email, score]);

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
