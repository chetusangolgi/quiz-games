import React, { useState } from 'react';

interface EmailFormProps {
  onSubmit: (email: string) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true); // Retaining isValid for email validation
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true); // New state to control initial screen

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
    onSubmit(email);
  };

  const handlePlayClick = () => {
    setShowWelcomeScreen(false); // Hide welcome screen and show email form
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 relative gap-[50px]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      ></div>

      {/* Content based on showWelcomeScreen state */}
      {showWelcomeScreen ? (
        // Initial Welcome Content
        <div className="text-center mb-16 transition-opacity duration-500 ease-in-out relative z-10">
          {/* Headings with increased font size and specific color */}
          <h3 className="text-8xl font-bold mb-4" style={{ color: '#00B5DB', lineHeight: '1' }}>Play More,</h3>
          <h3 className="text-8xl font-bold" style={{ color: '#00B5DB', lineHeight: '1' }}>Learn More</h3>

          {/* CTA Button with increased font, width, height, and specific background color */}
          <button
            onClick={handlePlayClick}
            className="text-white text-6xl font-semibold px-20 py-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl mt-20"
            style={{ backgroundColor: '#4315EF' }} // Applied direct style for specific background color
          >
            Click here to Play
          </button>
        </div>
      ) : (
        // Email Form Content
        <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10 transition-opacity duration-500 ease-in-out">
          {/* Title */}
          <h1 className="text-[48px] font-bold text-[#00B5DB] text-center mb-12">
            FBF Quizz Game
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-20">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsValid(true); // Reset validation on change
                }}
                className="w-[774px] h-[131px] px-6 py-4 text-[60px] text-white text-center placeholder-white bg-[#5E7CBA]/80 rounded-xl border-2 border-[#2B3990] focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter E-mail address"
                required
              />
              {!isValid && (
                <p className="text-red-300 text-sm mt-2">Please enter a valid email address</p>
              )}
            </div>

            <button
              type="submit"
              className="w-[551px] h-[128px] text-[60px] font-semibold text-white bg-[#4126FF] rounded-full hover:bg-[#321AD9] shadow-md transition"
            >
              Play
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
