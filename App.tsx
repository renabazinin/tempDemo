import React, { useState, useCallback } from 'react';
import { generateContent } from './services/geminiService';
import TemperatureSlider from './components/TemperatureSlider';
import ScenarioCard from './components/ScenarioCard';
import { ScenarioType, ScenarioConfig } from './types';

// Define the two scenarios constants
const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
  [ScenarioType.CODER]: {
    id: ScenarioType.CODER,
    title: "The Coder",
    subtitle: "Strict Logic & Math",
    description: "Low temp (0.0-0.3) is critical here. High temperature often causes hallucinations in syntax, incorrect logic, or weird variable names.",
    prompt: "Write a Python function to calculate the Fibonacci sequence iteratively.",
    buttonLabel: "Generate Code",
    colorClass: "blue",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  },
  [ScenarioType.POET]: {
    id: ScenarioType.POET,
    title: "The Poet",
    subtitle: "Wild Creativity",
    description: "High temp (0.9+) is desired here. Low temperature results in repetitive, boring, and cliché responses lacking flair.",
    prompt: "Invent a brand new mythical creature. Describe its glowing colors, its habitat made of crystal, and its strange diet.",
    buttonLabel: "Generate Creative Idea",
    colorClass: "orange",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    )
  }
};

const App: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(0.5);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastScenario, setLastScenario] = useState<ScenarioType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  // State for editable prompts
  const [coderPrompt, setCoderPrompt] = useState<string>(SCENARIOS[ScenarioType.CODER].prompt);
  const [poetPrompt, setPoetPrompt] = useState<string>(SCENARIOS[ScenarioType.POET].prompt);

  const handleGenerate = useCallback(async (prompt: string, scenarioId: ScenarioType) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastScenario(scenarioId);

    try {
      const text = await generateContent(prompt, temperature, apiKey);
      setResult(text);
    } catch (err) {
      setError("Something went wrong with the generation.");
    } finally {
      setLoading(false);
    }
  }, [temperature, apiKey]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 flex flex-col items-center">

      {/* Header */}
      <header className="max-w-4xl w-full mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 mb-2 pb-1">
          TempCheck
        </h1>
        <p className="text-slate-400 text-lg mb-4">
          The Coder vs. The Poet: Visualizing LLM Temperature
        </p>

        {/* API Key Input */}
        <div className="max-w-md mx-auto mt-6">
          <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-2">
            Gemini API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {!apiKey && (
            <p className="mt-2 text-xs text-slate-500">
              Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Google AI Studio</a>
            </p>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full grid gap-8">

        {/* Section 1: Control Center */}
        <section>
          <TemperatureSlider value={temperature} onChange={setTemperature} disabled={loading} />
        </section>

        {/* Section 2: Dual Input Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScenarioCard
            config={SCENARIOS.CODER}
            currentTemperature={temperature}
            isLoading={loading}
            onGenerate={(prompt) => handleGenerate(prompt, ScenarioType.CODER)}
            isActive={temperature < 0.5}
            promptValue={coderPrompt}
            onPromptChange={setCoderPrompt}
          />
          <ScenarioCard
            config={SCENARIOS.POET}
            currentTemperature={temperature}
            isLoading={loading}
            onGenerate={(prompt) => handleGenerate(prompt, ScenarioType.POET)}
            isActive={temperature >= 1.2}
            promptValue={poetPrompt}
            onPromptChange={setPoetPrompt}
          />
        </section>

        {/* Section 3: Output Area */}
        <section className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[300px] flex flex-col">
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <span className="ml-3 text-sm font-mono text-slate-400 font-bold">Terminal Output</span>
            </div>
            {lastScenario && result && (
              <span className={`text-xs px-2 py-1 rounded border ${lastScenario === ScenarioType.CODER
                ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                : 'border-orange-500/30 text-orange-400 bg-orange-500/10'
                }`}>
                Generated at Temp: {temperature.toFixed(1)}
              </span>
            )}
          </div>

          <div className="p-6 font-mono text-sm md:text-base leading-relaxed text-slate-300 overflow-auto flex-grow relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="animate-pulse">Thinking at {temperature.toFixed(1)} temperature...</p>
              </div>
            ) : error ? (
              <div className="text-red-400 p-4 border border-red-900/50 bg-red-900/20 rounded-lg">
                {error}
              </div>
            ) : result ? (
              <div className="whitespace-pre-wrap">
                {result}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                Select a scenario above to generate output...
              </div>
            )}
          </div>
        </section>

      </main>

      <footer className="mt-12 text-slate-500 text-sm text-center">
        Powered by Google Gemini 2.5 Flash
      </footer>
    </div>
  );
};

export default App;