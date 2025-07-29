import React, { useState } from 'react';

interface EmailFormProps {
  onSubmit: (email: string) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 relative gap-[50px]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      ></div>

      {/* Form Container */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10">
        {/* Title */}
        <h1 className="text-[48px] font-bold text-[#00B5DB] text-center mb-12">
          FBF Quizz Game
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-20">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[774px] h-[131px] px-6 py-4 text-[60px] text-white text-center placeholder-white bg-[#5E7CBA]/80 rounded-xl border-2 border-[#2B3990] focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter E-mail address"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            required
          />

          <button
            type="submit"
            className="w-[551px] h-[128px] text-[60px] font-semibold text-white bg-[#4126FF] rounded-full hover:bg-[#321AD9] shadow-md transition"
          >
            Play
          </button>

        </form>
      </div>
    </div>
  );
};
