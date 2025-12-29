
import React, { useState } from 'react';
import type { JournalEntry, ChartDataPoint, Metrics } from '../types';
import { RadarChartComponent } from './RadarChartComponent';
import { TarotCard } from './TarotCard';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface JournalDetailViewProps {
    entry: JournalEntry;
    onClose: () => void;
    onUpdateEntry: (entry: JournalEntry) => void;
    onDeleteEntry: (entryId: string) => void;
}

const mapMetricsToChartData = (metrics: Metrics): ChartDataPoint[] => {
    return [
        { subject: 'Lumina', value: metrics.lumina, fullMark: 10 },
        { subject: 'Bond', value: metrics.bond, fullMark: 10 },
        { subject: 'Pulse', value: metrics.pulse, fullMark: 10 },
        { subject: 'Serenity', value: metrics.serenity, fullMark: 10 },
        { subject: 'Vitality', value: metrics.vitality, fullMark: 10 },
        { subject: 'Depth', value: metrics.depth, fullMark: 10 },
    ];
};

export const JournalDetailView: React.FC<JournalDetailViewProps> = ({ entry, onClose, onUpdateEntry, onDeleteEntry }) => {
    const chartData = mapMetricsToChartData(entry.analysis.metrics);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(entry.text);
    const displayImageUrl = entry.imageUrl || `https://media.istockphoto.com/id/178149253/photo/deep-space-background.jpg?s=612x612&w=0&k=20&c=w1hb2H1C-blV918LoG9mGB02nJY6cLJpR5Szfg7sLqE=`;

    const handleSave = () => {
        onUpdateEntry({ ...entry, text: editedText });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
            onDeleteEntry(entry.id);
            onClose();
        }
    };
    
    const handleCancel = () => {
        setEditedText(entry.text);
        setIsEditing(false);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-[#F0F4FF]/90 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="flex-1 flex flex-col gap-4">
                    <p className="font-semibold text-lg text-[#7B61FF]">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                    </p>
                    <img src={displayImageUrl} alt="Journal entry" className="w-full h-64 object-cover rounded-lg shadow-md" />
                    <div className="prose max-w-none text-slate-700 leading-relaxed flex-grow">
                        {isEditing ? (
                             <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                className="w-full h-full min-h-[200px] p-2 bg-white/80 border border-[#7B61FF]/30 rounded-lg focus:ring-2 focus:ring-[#7B61FF] outline-none resize-none"
                            />
                        ) : (
                            <p>{entry.text}</p>
                        )}
                    </div>
                     <div className="flex items-center gap-2 mt-auto pt-4">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-[#7B61FF] rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
                                <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-200/80 rounded-lg hover:bg-slate-300/80 transition-colors">Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#7B61FF] bg-[#7B61FF]/10 rounded-lg hover:bg-[#7B61FF]/20 transition-colors">
                                    <EditIcon /> Edit
                                </button>
                                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 bg-slate-200/80 rounded-lg hover:bg-slate-300/80 transition-colors">
                                    <TrashIcon /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <div className="w-full h-80">
                       <RadarChartComponent data={chartData} />
                    </div>
                    <TarotCard card={entry.analysis.tarot.card} insight={entry.analysis.tarot.insight} />
                </div>
            </div>
        </div>
    );
};
