
import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { ScribeScreen } from './components/screens/ScribeScreen';
import { EchoesScreen } from './components/screens/EchoesScreen';
import { UniverseScreen } from './components/screens/UniverseScreen';
import { StartingScreen } from './components/screens/StartingScreen';
import type { Screen } from './types';
import type { JournalEntry, User } from './types';

// Mock data for initial state has been removed.
const MOCK_ENTRIES: JournalEntry[] = [];


type EchoesViewMode = 'space' | 'timeline';

const App: React.FC = () => {
  const [showStartingScreen, setShowStartingScreen] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('universe');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [user, setUser] = useState<User | null>(null);
  const [echoesView, setEchoesView] = useState<EchoesViewMode>('space');

  useEffect(() => {
    const timer = setTimeout(() => setShowStartingScreen(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddEntry = (newEntry: JournalEntry) => {
    setJournalEntries(prevEntries => [newEntry, ...prevEntries]);
  };

  const handleUpdateEntry = (updatedEntry: JournalEntry) => {
    setJournalEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
    alert('Entry updated! Note: AI analysis has not been rerun.');
  };

  const handleDeleteEntry = (entryId: string) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setActiveScreen('scribe');
  };
  
  const handleUpdateUser = (updatedUserData: User) => {
    setUser(updatedUserData);
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'scribe':
        return <ScribeScreen onAddEntry={handleAddEntry} />;
      case 'echoes':
        return <EchoesScreen 
                    journalEntries={journalEntries} 
                    view={echoesView} 
                    setView={setEchoesView} 
                    onUpdateEntry={handleUpdateEntry}
                    onDeleteEntry={handleDeleteEntry}
                />;
      case 'universe':
        return <UniverseScreen user={user} onLogin={handleLogin} onUpdateUser={handleUpdateUser} journalEntries={journalEntries} />;
      default:
        return <ScribeScreen onAddEntry={handleAddEntry} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showStartingScreen && <StartingScreen />}
      <div className={`w-full max-w-4xl mx-auto flex-grow flex flex-col px-4 pt-4 sm:pt-6 lg:pt-8 ${activeScreen === 'echoes' ? 'static' : 'relative'}`}>
        {activeScreen === 'scribe' && (
            <header className="text-center mb-4 py-4">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8A2C8] to-[#FFD700]">
                AuraScribe
              </h1>
            </header>
        )}

        <main className={`flex-grow pb-24 ${activeScreen !== 'scribe' ? 'pt-8 md:pt-12' : ''} ${activeScreen === 'echoes' ? 'static' : 'relative'}`}>
           {renderScreen()}
        </main>
      </div>
      
      <BottomNav 
        activeScreen={activeScreen} 
        onNavigate={setActiveScreen} 
        isDarkTheme={activeScreen === 'echoes' && echoesView === 'space'} 
      />
    </div>
  );
};

export default App;