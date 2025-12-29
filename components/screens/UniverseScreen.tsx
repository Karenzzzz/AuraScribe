
import React from 'react';
import type { User, JournalEntry } from '../../types';
import { Auth } from '../Auth';
import { Profile } from '../Profile';

interface UniverseScreenProps {
  user: User | null;
  onLogin: (user: User) => void;
  onUpdateUser: (user: User) => void;
  journalEntries: JournalEntry[];
}

export const UniverseScreen: React.FC<UniverseScreenProps> = ({ user, onLogin, onUpdateUser, journalEntries }) => {
  return (
    <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl shadow-lg shadow-[#7B61FF]/10 p-6 md:p-8">
      {user ? (
        <Profile user={user} onUpdateUser={onUpdateUser} journalEntries={journalEntries} />
      ) : (
        <Auth onLogin={onLogin} />
      )}
    </div>
  );
};
