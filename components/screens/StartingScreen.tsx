
import React from 'react';

export const StartingScreen: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes slow-pulse-text {
            0%, 100% {
                text-shadow: 0 0 8px rgba(230, 230, 250, 0.4);
            }
            50% {
                text-shadow: 0 0 16px rgba(230, 230, 250, 0.8);
            }
        }
        .animate-slow-pulse-text {
            animation: slow-pulse-text 4s ease-in-out infinite;
        }
      `}</style>
      <div className="fixed inset-0 bg-gradient-to-br from-[#7B61FF] to-[#FFB7B2] flex flex-col items-center justify-center text-white animate-fade-in z-50">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Raleway', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))' }}>
                AuraScribe
            </h1>
            <p className="text-xl text-white/90 animate-slow-pulse-text" style={{ fontFamily: 'Quicksand' }}>
                Unlock wisdom within your daily thoughts
            </p>
        </div>
      </div>
    </>
  );
};
