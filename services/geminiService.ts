import type { AuraAnalysis, AggregatedAuraAnalysis } from "../types";

export const analyzeJournalEntry = async (journalText: string): Promise<AuraAnalysis> => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ journalText }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get analysis from AI service.');
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching journal analysis:", error);
        throw error;
    }
};

export const analyzeTimePeriod = async (journalTexts: string[], period: string): Promise<AggregatedAuraAnalysis> => {
    try {
        const response = await fetch('/api/aggregate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ journalTexts, period }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get aggregated analysis from AI service.');
        }

        return await response.json();

    // FIX: Added curly braces to the catch block to correctly scope the error variable.
    } catch (error) {
        console.error("Error fetching aggregated analysis:", error);
        throw error;
    }
};
