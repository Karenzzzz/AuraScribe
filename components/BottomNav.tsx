
import React from 'react';
// Correct the import path for the Screen type, which is defined in `types.ts`.
import type { Screen } from '../types';
import { QuillPenIcon } from './icons/QuillPenIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { PlanetIcon } from './icons/PlanetIcon';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isDarkTheme?: boolean;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isDarkTheme?: boolean;
}> = ({ label, icon, isActive, onClick, isDarkTheme }) => {
  const activeClass = isDarkTheme ? "text-white" : "text-[#7B61FF]";
  const inactiveClass = isDarkTheme ? "text-white/60 hover:text-white" : "text-[#7B61FF]/50 hover:text-[#7B61FF]/80";

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`}
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate, isDarkTheme }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/30 backdrop-blur-xl border-t border-white/50">
      <div className="max-w-md mx-auto h-full flex justify-around items-center px-4">
        <NavButton
          label="Scribe"
          icon={<QuillPenIcon />}
          isActive={activeScreen === 'scribe'}
          onClick={() => onNavigate('scribe')}
          isDarkTheme={isDarkTheme}
        />
        <NavButton
          label="Echoes"
          icon={<BookOpenIcon />}
          isActive={activeScreen === 'echoes'}
          onClick={() => onNavigate('echoes')}
          isDarkTheme={isDarkTheme}
        />
        <NavButton
          label="Universe"
          icon={<PlanetIcon />}
          isActive={activeScreen === 'universe'}
          onClick={() => onNavigate('universe')}
          isDarkTheme={isDarkTheme}
        />
      </div>
    </nav>
  );
};
