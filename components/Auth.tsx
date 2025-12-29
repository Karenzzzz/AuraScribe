
import React, { useState } from 'react';
import type { User } from '../types';

interface AuthProps {
    onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login action
        onLogin({
            name: 'Aura Explorer',
            profilePictureUrl: `https://ui-avatars.com/api/?name=Aura+Explorer&background=C8A2C8&color=fff&size=128`
        });
    }

    return (
        <div className="max-w-md mx-auto text-center flex flex-col gap-6">
            <h2 className="text-3xl font-semibold text-[#7B61FF]">
                {isLogin ? 'Welcome Back' : 'Join Your Universe'}
            </h2>
            <p className="text-slate-600">
                {isLogin ? 'Log in to see your cosmic journey.' : 'Create an account to save your entries and track your aura over time.'}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="email" placeholder="Email Address" required className="w-full p-3 bg-white/50 border border-[#7B61FF]/30 rounded-lg focus:ring-2 focus:ring-[#7B61FF] outline-none transition-colors" />
                <input type="password" placeholder="Password" required className="w-full p-3 bg-white/50 border border-[#7B61FF]/30 rounded-lg focus:ring-2 focus:ring-[#7B61FF] outline-none transition-colors" />
                {!isLogin && <input type="password" placeholder="Confirm Password" required className="w-full p-3 bg-white/50 border border-[#7B61FF]/30 rounded-lg focus:ring-2 focus:ring-[#7B61FF] outline-none transition-colors" />}

                <button type="submit" className="w-full px-6 py-3 text-white font-semibold bg-gradient-to-r from-[#7B61FF] to-[#FFB7B2] rounded-lg hover:opacity-90 transition-opacity">
                    {isLogin ? 'Log In' : 'Create Account'}
                </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-[#7B61FF] hover:underline">
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
            </button>
        </div>
    );
}
