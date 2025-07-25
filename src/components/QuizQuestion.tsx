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
      'w-full border-2 px-6 py-6 text-left rounded-xl transition-all duration-300 cursor-pointer text-[26px] font-semibold shadow-md';

    if (!showFeedback) {
      return `${base} border-[#00B5DB] hover:bg-[#EAF9FF] bg-white text-black`;
    }

    if (index === question.correctAnswer) {
      return `${base} bg-[#00FF11] border-[#00FF11] text-white font-bold`;
    }

    if (index === selectedOption && index !== question.correctAnswer) {
      return `${base} bg-[#FF1F27] border-[#FF1F27] text-white font-bold`;
    }

    return `${base} bg-white border-[#D9D9D9] text-[#A1A1A1]`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative px-4 py-10 font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      ></div>

      {/* Question Section */}
    {/* Question Section */}
<div className="w-full relative z-10 flex flex-col items-center">
  <div className="w-full max-w-[800px] text-center mb-10">
    <h2 className="text-[#00B5DB] text-[60px] font-bold mb-6">
      Question {questionNumber}:
    </h2>
    <p className="text-black text-[40px] font-semibold leading-snug">
      {question.question}
    </p>
  </div>

  {/* Options */}
  <div className="w-full max-w-2xl space-y-6 text-left">
    {question.options.map((option, index) => (
      <button
        key={index}
        onClick={() => handleOptionClick(index)}
        className={getOptionClassName(index)}
        disabled={selectedOption !== null}
      >
        <span>
          {String.fromCharCode(97 + index)}) {option}
        </span>
      </button>
    ))}
  </div>
</div>


      {/* Timer Section with Image */}
      <div
  className="absolute bottom-10 left-0 w-full  px-10 z-10 flex items-center justify-center gap-4 text-[40px] font-bold text-white"
  style={{
    background: 'linear-gradient(to right, #30c5e5 0%, rgba(48,197,229,0.1) 40%, rgba(6,50,185,0.1) 60%, #0632b9 100%)',
  }}
>
  <img src="/timer.png" alt="Timer" className="w-[74px] h-[74px]" />
  <span>{formatTime(timeLeft)}</span>
</div>



    </div>
  );
};
