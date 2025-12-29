
import React, { useState, useCallback } from 'react';
import { JournalInput } from '../JournalInput';
import { AnalysisResult } from '../AnalysisResult';
import { analyzeJournalEntry } from '../../services/geminiService';
import type { AuraAnalysis, JournalEntry } from '../../types';

interface ScribeScreenProps {
  onAddEntry: (entry: JournalEntry) => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export const ScribeScreen: React.FC<ScribeScreenProps> = ({ onAddEntry }) => {
  const [journalText, setJournalText] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [analysis, setAnalysis] = useState<AuraAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!journalText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeJournalEntry(journalText);
      
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
          imageUrl = await fileToDataUrl(imageFile);
      }
      
      const newEntry: JournalEntry = {
          id: new Date().toISOString(),
          date,
          text: journalText,
          imageUrl,
          analysis: result,
      };
      
      onAddEntry(newEntry);
      setAnalysis(result);

    } catch (err) {
      console.error(err);
      setError('Failed to analyze the journal entry. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [journalText, date, imageFile, isLoading, onAddEntry]);

  const resetScribeScreen = () => {
    setJournalText('');
    setDate(getTodayDateString());
    setImageFile(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-2xl shadow-lg shadow-[#7B61FF]/10 p-6 md:p-8">
      {analysis ? (
        <AnalysisResult analysis={analysis} onReset={resetScribeScreen} />
      ) : (
        <JournalInput
          text={journalText}
          onTextChange={(e) => setJournalText(e.target.value)}
          date={date}
          onDateChange={(e) => setDate(e.target.value)}
          onImageChange={setImageFile}
          onSubmit={handleAnalyze}
          isLoading={isLoading}
        />
      )}

      {error && (
        <div className="mt-6 text-center text-red-700 bg-red-100/50 p-4 rounded-lg border border-red-200">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
