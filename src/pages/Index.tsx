
import React from 'react';
import { TextBehindEditor } from '@/components/TextBehindEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TextBehind
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Create stunning magazine-style effects
          </p>
          <p className="text-slate-400">
            Place text behind any person or object with AI-powered precision
          </p>
        </div>
        <TextBehindEditor />
      </div>
    </div>
  );
};

export default Index;
