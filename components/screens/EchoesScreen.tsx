
import React, { useState } from 'react';
import type { JournalEntry } from '../../types';
import { GalaxyView } from '../GalaxyView';
import { JournalDetailView } from '../JournalDetailView';

type ViewMode = 'space' | 'timeline';

interface EchoesScreenProps {
  journalEntries: JournalEntry[];
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onUpdateEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

const TimelineCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
    const displayImageUrl = entry.imageUrl || `https://media.istockphoto.com/id/178149253/photo/deep-space-background.jpg?s=612x612&w=0&k=20&c=w1hb2H1C-blV918LoG9mGB02nJY6cLJpR5Szfg7sLqE=`;
    return (
        <div className="bg-white/50 p-4 rounded-lg shadow-md flex flex-col gap-3">
            <img src={displayImageUrl} alt="Journal entry" className="w-full h-40 object-cover rounded-md" />
            <p className="font-semibold text-[#7B61FF]">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
            <p className="text-slate-600 text-sm line-clamp-3">{entry.text}</p>
        </div>
    );
};

export const EchoesScreen: React.FC<EchoesScreenProps> = ({ journalEntries, view, setView, onUpdateEntry, onDeleteEntry }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const isSpace = view === 'space';

  const inactiveTextColor = isSpace ? 'text-white/70' : 'text-[#7B61FF]/70';
  const toggleBg = isSpace ? 'bg-white/20 backdrop-blur-sm' : 'bg-[#7B61FF]/10';

  const containerClass = isSpace
    ? "w-full h-full flex flex-col absolute inset-0"
    : "w-full h-full flex flex-col";

  return (
    <div className={containerClass}>
        {isSpace && <div className="absolute inset-0 z-0 bg-[#0c0a1a]" />}

        <div className="self-end p-4 z-10">
             <div className={`flex items-center gap-2 p-1 rounded-lg ${toggleBg}`}>
                <button onClick={() => setView('space')} className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${view === 'space' ? 'bg-white shadow-sm text-[#7B61FF]' : inactiveTextColor}`}>Space</button>
                <button onClick={() => setView('timeline')} className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${view === 'timeline' ? 'bg-white shadow-sm text-[#7B61FF]' : inactiveTextColor}`}>Timeline</button>
            </div>
        </div>

        <div className={`flex-grow flex flex-col ${!isSpace ? 'p-6 md:p-8' : ''}`}>
            {journalEntries.length === 0 ? (
                <p className={`text-center py-10 ${isSpace ? 'text-slate-400' : 'text-slate-600'}`}>
                    No entries yet. Start writing on the Scribe page!
                </p>
            ) : isSpace ? (
                <GalaxyView entries={journalEntries} onSelectEntry={setSelectedEntry} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
                    {journalEntries.map(entry => (
                        <div key={entry.id} onClick={() => setSelectedEntry(entry)} className="cursor-pointer">
                            <TimelineCard entry={entry} />
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {selectedEntry && (
            <JournalDetailView 
                entry={selectedEntry} 
                onClose={() => setSelectedEntry(null)} 
                onUpdateEntry={onUpdateEntry}
                onDeleteEntry={onDeleteEntry}
            />
        )}
    </div>
  );
};
