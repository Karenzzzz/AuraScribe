
import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { ScribeScreen } from './components/screens/ScribeScreen';
import { EchoesScreen } from './components/screens/EchoesScreen';
import { UniverseScreen } from './components/screens/UniverseScreen';
import { StartingScreen } from './components/screens/StartingScreen';
import type { Screen } from './types';
import type { JournalEntry, User } from './types';

// Mock data for initial state
const MOCK_ENTRIES: JournalEntry[] = [
  ...Array.from({ length: 100 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const texts = [
        "Felt a spark of creativity today and started a new painting. It feels good to create.",
        "A long, stressful day at work. So many meetings. Glad it's over.",
        "Had a wonderful video call with family. It's so good to see their faces.",
        "Feeling a bit lost and uncertain about the future. Trying to trust the process.",
        "Spent the afternoon baking cookies. The whole house smells amazing.",
        "A sudden burst of inspiration led to a breakthrough on a difficult problem.",
        "Work was overwhelming. So many deadlines piling up at once.",
        "Reconnected with an old friend, and it was as if no time had passed at all.",
        "Woke up feeling anxious for no clear reason. A cloud seems to be following me.",
        "A simple, quiet day of reading and relaxing. It was just what I needed.",
        "Finally finished a major project. The sense of accomplishment is incredible.",
        "Feeling stuck in a rut. Every day feels the same lately.",
        "A difficult conversation left me feeling drained and emotional.",
        "The weather was beautiful, so I went for a long walk in nature. Felt so grounding.",
        "Started a new book and was instantly captivated. A perfect escape.",
        "A frustrating day of technical issues and setbacks. Patience is wearing thin.",
        "Celebrated a small win today. It's important to acknowledge progress.",
        "Felt a wave of nostalgia looking through old photos. So many good memories.",
        "Feeling restless and full of energy, but not sure where to direct it.",
        "A deep and meaningful conversation with my partner brought us closer.",
    ];
    const analyses = [
        { metrics: { lumina: 8, bond: 6, pulse: 4, serenity: 8, vitality: 7, depth: 8 }, tarot: { card: 'The Empress', insight: 'Creativity is flowing through you. Nurture this energy and allow it to manifest.' } },
        { metrics: { lumina: 4, bond: 5, pulse: 8, serenity: 2, vitality: 3, depth: 4 }, tarot: { card: 'Ten of Wands', insight: 'You are carrying a heavy burden. It is okay to ask for help or set some of it down.' } },
        { metrics: { lumina: 9, bond: 9, pulse: 3, serenity: 8, vitality: 7, depth: 6 }, tarot: { card: 'The Hierophant', insight: 'Connection to tradition and loved ones brings comfort and guidance. Cherish these bonds.' } },
        { metrics: { lumina: 3, bond: 4, pulse: 2, serenity: 3, vitality: 4, depth: 7 }, tarot: { card: 'The Moon', insight: 'The path ahead is unclear. Trust your intuition to guide you through the uncertainty.' } },
        { metrics: { lumina: 8, bond: 7, pulse: 3, serenity: 9, vitality: 6, depth: 5 }, tarot: { card: 'Page of Wands', insight: 'A new passion or hobby brings joy and a sense of playful exploration.' } },
        { metrics: { lumina: 9, bond: 6, pulse: 7, serenity: 8, vitality: 8, depth: 9 }, tarot: { card: 'The Star', insight: 'Hope and inspiration have arrived, illuminating your path forward. Believe in the possibilities.' } },
        { metrics: { lumina: 3, bond: 4, pulse: 9, serenity: 2, vitality: 2, depth: 4 }, tarot: { card: 'Nine of Wands', insight: 'You are resilient, but weary from the battle. Your perseverance will pay off, but rest is needed.' } },
        { metrics: { lumina: 8, bond: 9, pulse: 4, serenity: 9, vitality: 7, depth: 7 }, tarot: { card: 'Two of Cups', insight: 'A harmonious connection brings joy and mutual understanding. This partnership is a gift.' } },
        { metrics: { lumina: 4, bond: 5, pulse: 3, serenity: 3, vitality: 4, depth: 6 }, tarot: { card: 'Seven of Cups', insight: 'Indecision and illusion may be clouding your judgment. Focus on what is real and attainable.' } },
        { metrics: { lumina: 7, bond: 5, pulse: 1, serenity: 9, vitality: 6, depth: 8 }, tarot: { card: 'Four of Swords', insight: 'Rest and recuperation are not lazy, but necessary. Allow yourself this time to heal and recharge.' } },
        { metrics: { lumina: 9, bond: 8, pulse: 8, serenity: 7, vitality: 9, depth: 6 }, tarot: { card: 'The World', insight: 'A cycle is successfully completing. Celebrate your achievements and the integration of your lessons.' } },
        { metrics: { lumina: 5, bond: 5, pulse: 3, serenity: 5, vitality: 5, depth: 5 }, tarot: { card: 'Eight of Cups', insight: 'You may be feeling the need to walk away from something that no longer serves you. It is a difficult but necessary step.' } },
        { metrics: { lumina: 3, bond: 3, pulse: 6, serenity: 2, vitality: 3, depth: 8 }, tarot: { card: 'Three of Swords', insight: 'Painful words or truths have brought sorrow. Allow yourself to feel the grief in order to heal.' } },
        { metrics: { lumina: 8, bond: 7, pulse: 5, serenity: 9, vitality: 8, depth: 7 }, tarot: { card: 'Strength', insight: 'You possess a quiet inner strength and compassion. Use it to overcome challenges with grace.' } },
        { metrics: { lumina: 7, bond: 5, pulse: 2, serenity: 8, vitality: 6, depth: 8 }, tarot: { card: 'The High Priestess', insight: 'Look beyond the obvious. Your intuition holds deep secrets and wisdom for you to uncover.' } },
        { metrics: { lumina: 4, bond: 4, pulse: 7, serenity: 3, vitality: 4, depth: 5 }, tarot: { card: 'Five of Wands', insight: 'You are facing minor conflicts and competition. It is a chaotic but low-stakes struggle.' } },
        { metrics: { lumina: 8, bond: 7, pulse: 6, serenity: 7, vitality: 8, depth: 6 }, tarot: { card: 'Six of Wands', insight: 'Public recognition and victory are yours. Enjoy this moment of success you have earned.' } },
        { metrics: { lumina: 7, bond: 6, pulse: 3, serenity: 8, vitality: 7, depth: 8 }, tarot: { card: 'Ten of Cups', insight: 'A feeling of deep emotional fulfillment and happiness surrounds you and your loved ones.' } },
        { metrics: { lumina: 6, bond: 5, pulse: 8, serenity: 5, vitality: 8, depth: 5 }, tarot: { card: 'Knight of Wands', insight: 'A surge of energy propels you forward. You are ready for action, adventure, and change.' } },
        { metrics: { lumina: 8, bond: 9, pulse: 2, serenity: 9, vitality: 7, depth: 9 }, tarot: { card: 'The Lovers', insight: 'A deep connection, whether romantic or platonic, is based on shared values and authentic choices.' } },
    ];
    const randomIndex = i % texts.length;
    return {
      id: (i + 1).toString(),
      date: date.toISOString().split('T')[0],
      text: texts[randomIndex],
      analysis: analyses[randomIndex],
    };
  }),
];


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