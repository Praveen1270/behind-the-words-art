
import React from 'react';
import { TextBehindEditor } from '@/components/TextBehindEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center py-12 px-4">
          <h1 className="text-6xl font-thin text-gray-900 mb-4 tracking-tight">
            TextBehind
          </h1>
          <p className="text-xl text-gray-600 mb-2 font-light">
            Create stunning magazine-style effects
          </p>
          <p className="text-gray-500 font-light">
            Place text behind any person or object with AI-powered precision
          </p>
        </div>
        
        <TextBehindEditor />
      </div>
    </div>
  );
};

export default Index;
