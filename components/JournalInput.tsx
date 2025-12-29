
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ImageUpload } from './ImageUpload';
import { CalendarIcon } from './icons/CalendarIcon';

interface JournalInputProps {
  text: string;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  date: string;
  onDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (file: File | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const JournalInput: React.FC<JournalInputProps> = ({ text, onTextChange, date, onDateChange, onImageChange, onSubmit, isLoading }) => {
  // The 'T00:00:00' is added to ensure the date is parsed in the local timezone, preventing off-by-one day errors.
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl text-center sm:text-left font-semibold text-[#7B61FF]">
          What's on your mind?
        </h2>
        <label
            htmlFor="journal-date-picker"
            title="Click to change date"
            aria-label={`Change date, current date is ${formattedDate}`}
            className="relative flex items-center gap-2 bg-white/50 border border-[#7B61FF]/30 rounded-lg px-3 py-2 text-slate-700 focus-within:ring-2 focus-within:ring-[#7B61FF] outline-none cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-[#7B61FF]/50"
        >
          <CalendarIcon />
          <span>{formattedDate}</span>
          <input
              id="journal-date-picker"
              type="date"
              value={date}
              onChange={onDateChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </div>
      <textarea
        value={text}
        onChange={onTextChange}
        placeholder="Pour your thoughts onto the page..."
        className="w-full h-64 p-4 bg-white/50 border border-[#7B61FF]/30 rounded-lg focus:ring-2 focus:ring-[#7B61FF] focus:border-[#7B61FF] outline-none transition-all duration-300 resize-none text-slate-800 placeholder-slate-400"
        disabled={isLoading}
      />
      <ImageUpload onImageChange={onImageChange} />
      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          disabled={isLoading || !text.trim()}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-[#7B61FF] to-[#FFB7B2] group-hover:from-[#7B61FF] group-hover:to-[#FFB7B2] focus:ring-4 focus:outline-none focus:ring-[#7B61FF]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          <span className="relative px-8 py-3 transition-all ease-in duration-75 bg-[#F0F4FF] text-[#7B61FF] rounded-md group-hover:bg-opacity-0 group-hover:text-white flex items-center gap-2">
            {isLoading ? (
              'Analyzing...'
            ) : (
              <>
                <SparklesIcon />
                Reveal My Aura
              </>
            )}
          </span>
        </button>
      </div>
       {isLoading && (
        <div className="text-center text-[#7B61FF] animate-pulse">
            <p>Consulting the cosmos... please wait.</p>
        </div>
      )}
    </div>
  );
};
