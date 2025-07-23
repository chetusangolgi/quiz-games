import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  onTimeUp: () => void;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  setTimeLeft,
  onTimeUp,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const isCorrect = optionIndex === question.correctAnswer;

    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
      setShowFeedback(false);
    }, 1500);
  };

  const getOptionClassName = (index: number) => {
    const base =
      'w-full border-2 px-4 py-3 text-left rounded-xl transition-all duration-300 cursor-pointer text-base sm:text-lg';

    if (!showFeedback) {
      return `${base} border-[#00B5DB]  hover:bg-[#e6f8fb] text-black`;
    }

    if (index === question.correctAnswer) {
      return `${base} bg-[#00FF11] border-green-500 text-white font-semibold`;
    }

    if (index === selectedOption && index !== question.correctAnswer) {
      return `${base} bg-[#FF1F27] border-red-500 text-white font-semibold`;
    }

    return `${base} bg-white border-[#ccc] text-gray-400`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative px-4 py-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      ></div>

      {/* Content */}
      <div className="w-full max-w-xl text-center relative z-10">
        <h2 className="text-[#00B5DB] text-2xl font-bold mb-4">
          Question {questionNumber}:
        </h2>
        <p className="text-black text-lg font-medium mb-8">
          {question.question}
        </p>

        <div className="space-y-5 text-left">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={getOptionClassName(index)}
              disabled={selectedOption !== null}
            >
              <span className="font-medium">
                {String.fromCharCode(97 + index)}) {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timer Below */}
      <div className="mt-12 z-10 bg-yellow-400 text-[#3B2EDB] font-bold px-5 py-2 rounded-full flex items-center justify-center space-x-2 text-lg">
        <div className="w-3 h-3 bg-[#3B2EDB] rounded-full" />
        <span>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};
