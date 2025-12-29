
import React from 'react';

interface TarotCardProps {
  card: string;
  insight: string;
}

// Generates a URL for a specific tarot card image from the new repository.
const getSpecificTarotImageUrl = (cardName: string): string => {
  // Convert card name to a filename-friendly format.
  // Example: "The Fool" -> "thefool"
  // Example: "Ten of Wands" -> "tenofwands"
  const imageName = cardName.toLowerCase().replace(/\s/g, '');
  return `https://raw.githubusercontent.com/krates98/tarotcardapi/main/images/${imageName}.jpeg`;
};


// Fallback function to generate a random image if the specific one fails.
const getRandomTarotImageUrl = (cardName: string): string => {
  const keywords = cardName
    .toLowerCase()
    .replace(/^(the|a|an)\s+/, '')
    .replace(/\s+of\s+/, ' ')
    .split(' ')
    .join(',');

  return `https://loremflickr.com/400/600/${keywords},tarot,mystical/all?lock=${Date.now()}`;
};


export const TarotCard: React.FC<TarotCardProps> = ({ card, insight }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    // Prevent an infinite loop if the fallback image also fails
    if (!target.src.includes('loremflickr')) {
        target.src = getRandomTarotImageUrl(card);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-800 rounded-lg shadow-xl overflow-hidden text-white">
      <img 
        src={getSpecificTarotImageUrl(card)} 
        alt={`Tarot card representing ${card}`}
        className="absolute inset-0 w-full h-full object-cover opacity-40" 
        key={card} // Add key to force re-render on card change
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-6 text-center">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-300">Your Card for the Day</h3>
        <h2 className="text-3xl font-bold text-white drop-shadow-md my-2">
          {card}
        </h2>
        <div className="w-16 h-0.5 bg-white/50 mx-auto rounded-full my-2"></div>
        <p className="text-md text-slate-200 leading-relaxed drop-shadow-sm">
          {insight}
        </p>
      </div>
    </div>
  );
};