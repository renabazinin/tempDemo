import React from 'react';
import { ScenarioConfig } from '../types';

interface ScenarioCardProps {
  config: ScenarioConfig;
  currentTemperature: number;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  isActive: boolean; // Visual hint if temp matches this card's strength
  promptValue: string;
  onPromptChange: (value: string) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ 
  config, 
  currentTemperature, 
  onGenerate, 
  isLoading,
  isActive,
  promptValue,
  onPromptChange
}) => {
  const isRecommended = isActive; 
  
  return (
    <div 
        className={`
            relative p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full
            ${isRecommended 
                ? `bg-slate-800 border-${config.colorClass}-500 shadow-lg shadow-${config.colorClass}-900/20` 
                : 'bg-slate-800/40 border-slate-700 opacity-80 hover:opacity-100 hover:bg-slate-800'}
        `}
    >
      {/* Recommended Badge */}
      <div className={`
        absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-slate-900
        transition-all duration-300
        ${isRecommended ? `text-${config.colorClass}-400 border-${config.colorClass}-500 opacity-100` : 'opacity-0 scale-90'}
      `}>
        Recommended for Temp {currentTemperature.toFixed(1)}
      </div>

      <div className="flex items-center gap-3 mb-4 mt-2">
        <div className={`p-3 rounded-lg bg-${config.colorClass}-500/10 text-${config.colorClass}-400`}>
            {config.icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">{config.title}</h3>
            <p className={`text-sm text-${config.colorClass}-400 font-medium`}>{config.subtitle}</p>
        </div>
      </div>

      <div className={`bg-slate-900/50 p-3 rounded-lg mb-4 border border-slate-700/50 focus-within:border-${config.colorClass}-500/50 transition-colors`}>
        <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Prompt Template (Editable)</label>
        <textarea 
            value={promptValue}
            onChange={(e) => onPromptChange(e.target.value)}
            className="w-full bg-transparent text-slate-300 font-mono text-sm italic focus:outline-none resize-y min-h-[80px]"
            placeholder="Enter your prompt here..."
        />
      </div>

      <p className="text-slate-400 text-sm mb-6 flex-grow">
        {config.description}
      </p>

      <button
        onClick={() => onGenerate(promptValue)}
        disabled={isLoading}
        className={`
            w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95
            flex items-center justify-center gap-2
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            bg-gradient-to-r from-${config.colorClass}-600 to-${config.colorClass}-500 hover:from-${config.colorClass}-500 hover:to-${config.colorClass}-400
        `}
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
            </>
        ) : (
            config.buttonLabel
        )}
      </button>
    </div>
  );
};

export default ScenarioCard;