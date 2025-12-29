
import React, { useState, useRef } from 'react';
import type { User, JournalEntry, Metrics, Tarot, ChartDataPoint } from '../types';
import { analyzeTimePeriod } from '../services/geminiService';
import { RadarChartComponent } from './RadarChartComponent';
import { TarotCard } from './TarotCard';

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

interface ProfileProps {
    user: User;
    onUpdateUser: (user: User) => void;
    journalEntries: JournalEntry[];
}

const mapMetricsToChartData = (metrics: Metrics): ChartDataPoint[] => {
    return [
        { subject: 'Lumina', value: parseFloat(metrics.lumina.toFixed(1)), fullMark: 10 },
        { subject: 'Bond', value: parseFloat(metrics.bond.toFixed(1)), fullMark: 10 },
        { subject: 'Pulse', value: parseFloat(metrics.pulse.toFixed(1)), fullMark: 10 },
        { subject: 'Serenity', value: parseFloat(metrics.serenity.toFixed(1)), fullMark: 10 },
        { subject: 'Vitality', value: parseFloat(metrics.vitality.toFixed(1)), fullMark: 10 },
        { subject: 'Depth', value: parseFloat(metrics.depth.toFixed(1)), fullMark: 10 },
    ];
};

type TimePeriod = 'weekly' | 'monthly' | 'yearly';
interface AggregatedData {
    metrics: Metrics;
    summary: string;
    tarot: Tarot;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, journalEntries }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [newProfilePicture, setNewProfilePicture] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activePeriod, setActivePeriod] = useState<TimePeriod | null>(null);
    const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const updatedUser = {
            ...user,
            name,
            profilePictureUrl: newProfilePicture || user.profilePictureUrl,
        };
        onUpdateUser(updatedUser);
        setIsEditing(false);
        setNewProfilePicture(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(user.name);
        setNewProfilePicture(null);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };
    
    const handlePeriodSelect = async (period: TimePeriod) => {
        if (isLoadingAnalysis && activePeriod === period) return;

        setActivePeriod(period);
        setIsLoadingAnalysis(true);
        setAggregatedData(null);
        setAnalysisError(null);
        setAnalysisMessage(null);

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const thresholds = {
            weekly: { days: 7, minEntries: 4, name: 'week' },
            monthly: { days: 30, minEntries: 16, name: 'month' },
            yearly: { days: 365, minEntries: 188, name: 'year' },
        };

        const { days, minEntries, name: periodName } = thresholds[period];
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        const filteredEntries = journalEntries.filter(entry => {
            const entryDate = new Date(entry.date + 'T00:00:00');
            return entryDate >= startDate && entryDate <= now;
        });

        if (filteredEntries.length < minEntries) {
            setAnalysisMessage(`You need at least ${minEntries} entries in the last ${days} days to generate a ${period} summary. You have ${filteredEntries.length}. Keep writing!`);
            setIsLoadingAnalysis(false);
            return;
        }

        try {
            const totalMetrics = filteredEntries.reduce((acc, entry) => {
                Object.keys(entry.analysis.metrics).forEach(key => {
                    acc[key as keyof Metrics] += entry.analysis.metrics[key as keyof Metrics];
                });
                return acc;
            }, { lumina: 0, bond: 0, pulse: 0, serenity: 0, vitality: 0, depth: 0 });

            const avgMetrics: Metrics = {
                lumina: totalMetrics.lumina / filteredEntries.length,
                bond: totalMetrics.bond / filteredEntries.length,
                pulse: totalMetrics.pulse / filteredEntries.length,
                serenity: totalMetrics.serenity / filteredEntries.length,
                vitality: totalMetrics.vitality / filteredEntries.length,
                depth: totalMetrics.depth / filteredEntries.length,
            };

            const journalTexts = filteredEntries.map(entry => `[${entry.date}]: ${entry.text}`);
            const aiAnalysis = await analyzeTimePeriod(journalTexts, periodName);

            setAggregatedData({
                metrics: avgMetrics,
                ...aiAnalysis,
            });

        } catch (e) {
            setAnalysisError("An error occurred while analyzing your journey. Please try again.");
            console.error(e);
        } finally {
            setIsLoadingAnalysis(false);
        }
    };


    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=C8A2C8&color=fff&size=128`;
    const profileImage = newProfilePicture || user.profilePictureUrl || defaultAvatar;
    
    const PeriodButton: React.FC<{period: TimePeriod, label: string}> = ({ period, label }) => {
        const isActive = activePeriod === period;
        return (
             <button 
                onClick={() => handlePeriodSelect(period)}
                disabled={isLoadingAnalysis}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 disabled:opacity-50 ${isActive ? 'bg-[#7B61FF] text-white shadow-md' : 'bg-white/50 text-[#7B61FF] hover:bg-white/80'}`}
            >
                {label}
            </button>
        )
    };

    return (
        <div className="flex flex-col gap-8">
            <input 
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full shadow-lg border-2 border-white object-cover" 
                    />
                    {isEditing && (
                        <button 
                            onClick={triggerFileSelect}
                            className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                            aria-label="Change profile picture"
                        >
                           <CameraIcon />
                        </button>
                    )}
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                    {isEditing ? (
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-3xl font-bold text-slate-800 bg-white/50 border-b-2 border-[#7B61FF] focus:outline-none"
                        />
                    ) : (
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#FFB7B2]">
                            {user.name}
                        </h2>
                    )}
                    <p className="text-slate-500">{journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'} so far</p>
                </div>
                {isEditing ? (
                     <div className="flex items-center gap-2">
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[#7B61FF] rounded-lg hover:opacity-90 transition-opacity">Save</button>
                        <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-[#7B61FF] bg-transparent rounded-lg hover:bg-[#7B61FF]/10 transition-colors">Cancel</button>
                     </div>
                ) : (
                     <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-[#7B61FF] bg-[#7B61FF]/10 rounded-lg hover:bg-[#7B61FF]/20 transition-colors">Edit Profile</button>
                )}
            </div>

            <div className="p-4 sm:p-6 bg-white/40 rounded-lg">
                <h3 className="text-2xl font-semibold text-center text-[#7B61FF]">Your Aura Insights</h3>
                 <div className="mt-4 flex justify-center gap-2 sm:gap-4">
                    <PeriodButton period="weekly" label="Weekly" />
                    <PeriodButton period="monthly" label="Monthly" />
                    <PeriodButton period="yearly" label="Yearly" />
                </div>
                <div className="mt-6 min-h-[350px] flex items-center justify-center">
                    {isLoadingAnalysis && (
                        <div className="text-center text-[#7B61FF] animate-pulse">
                            <p>Analyzing your cosmic journey...</p>
                        </div>
                    )}
                    {analysisError && (
                        <div className="text-center text-red-700 bg-red-100/50 p-4 rounded-lg border border-red-200">
                          <p>{analysisError}</p>
                        </div>
                    )}
                     {analysisMessage && (
                        <div className="text-center text-slate-600 bg-slate-100/50 p-4 rounded-lg border border-slate-200">
                          <p>{analysisMessage}</p>
                        </div>
                    )}
                    {!activePeriod && !isLoadingAnalysis && (
                         <div className="text-center text-slate-500">
                            <p>Select a time period to view your aura summary.</p>
                        </div>
                    )}
                    {aggregatedData && (
                        <div className="w-full flex flex-col lg:flex-row gap-8 items-center animate-fade-in">
                            <div className="w-full lg:w-1/2 h-80">
                               <RadarChartComponent data={mapMetricsToChartData(aggregatedData.metrics)} />
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                               <div className="text-center">
                                    <h4 className="text-lg font-semibold text-[#7B61FF]">Summary of Your {activePeriod}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">{aggregatedData.summary}</p>
                                </div>
                                <TarotCard card={aggregatedData.tarot.card} insight={aggregatedData.tarot.insight} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};