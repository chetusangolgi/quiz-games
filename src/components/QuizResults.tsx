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

  // Send results to webhook
  useEffect(() => {
    const sendResultsToAPI = async () => {
      try {
        const payload = {
          email,
          element_id: "04",
          game_name: "MCQ",
          location: "surat",
          score
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
    }, 1000000); // ← Increase or correct this value later

    return () => clearInterval(timer);
  }, [onRestart]);

  const isZeroScore = score === 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      {/* Foreground content */}
      {/* Foreground content */}
<div className="relative z-10 flex flex-col items-center mt-[230px]">
  <img
    src={isZeroScore ? '/luck.png' : '/congrats.png'}
    alt="Result Trophy"
    className="w-[700px] mb-0" // ← Removed margin below image
  />

  <div className="mt-[70px]"> {/* Added margin-top to text block */}
    {isZeroScore ? (
      <>
        <h1 className="text-[70px] font-extrabold text-white mb-2 leading-tight">
          Better luck next time!
        </h1>
        <p className="text-white text-[96px] font-bold mb-1 leading-none">
          {score}/{totalQuestions}
        </p>
      </>
    ) : (
      <>
        <h1 className="text-[70px] font-extrabold text-white mb-2 leading-[1.1]">
          CONGRATULATIONS!
        </h1>
        <p className="text-white text-[60px] mb-1 leading-[1.1]">You got!</p>
        <p className="text-white text-[96px] font-bold mb-1 leading-none">
          {score}/{totalQuestions}
        </p>
        <p className="text-white text-[60px] leading-[1.1]">Correct answers!</p>
      </>
    )}
  </div>
</div>

    </div>
  );
};
