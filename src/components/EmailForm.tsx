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
    <div className="min-h-screen flex items-center justify-center px-6 py-10 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      ></div>

      {/* Form Container */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#00B5DB] text-center mb-12">
          FBF Quizz
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 text-lg text-white text-center placeholder-white bg-[#5E7CBA]/80 border border-[#5E7CBA] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter E-mail address"
            required
          />
          <button
            type="submit"
            className="w-full py-4 text-xl font-semibold text-white bg-[#4126FF] rounded-full hover:bg-[#321AD9] transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
