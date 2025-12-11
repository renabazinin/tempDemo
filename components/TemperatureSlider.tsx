import React from 'react';

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ value, onChange, disabled }) => {
  // Calculate color based on temperature (Blue -> Purple -> Red)
  const getGradientColor = (temp: number) => {
    if (temp <= 1.0) {
      // Blue to Purple
      const ratio = temp; // 0 to 1
      return `rgb(${100 * ratio}, ${100 + 50 * ratio}, ${255 - 100 * ratio})`;
    } else {
      // Purple to Red/Orange
      const ratio = temp - 1.0; // 0 to 1
      return `rgb(${100 + 155 * ratio}, ${150 - 100 * ratio}, ${155 - 155 * ratio})`;
    }
  };

  const currentColor = getGradientColor(value);

  return (
    <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
                </svg>
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Temperature Control</h2>
                <p className="text-xs text-slate-400">Controls randomness (0.0 = Deterministic, 2.0 = Chaotic)</p>
            </div>
        </div>
        <div 
            className="text-4xl font-mono font-bold transition-colors duration-300"
            style={{ color: currentColor }}
        >
          {value.toFixed(1)}
        </div>
      </div>

      <div className="relative pt-6 pb-2">
        <input
          type="range"
          min="0.0"
          max="2.0"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none"
          style={{
              accentColor: currentColor
          }}
        />
        
        {/* Labels under the slider */}
        <div className="flex justify-between mt-2 text-xs font-semibold uppercase tracking-wider">
          <span className="text-blue-400">Strict Logic (0.0)</span>
          <span className="text-purple-400">Balanced (1.0)</span>
          <span className="text-orange-400">Wild Creativity (2.0)</span>
        </div>
        
        {/* Dynamic description of current zone */}
        <div className="mt-4 text-center text-sm font-medium transition-all duration-300">
            {value <= 0.4 && <span className="text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/30">Zone: The Coder (Precision & Consistency)</span>}
            {value > 0.4 && value < 1.4 && <span className="text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">Zone: Balanced</span>}
            {value >= 1.4 && <span className="text-orange-300 bg-orange-900/30 px-3 py-1 rounded-full border border-orange-500/30">Zone: The Poet (Hallucination & Flair)</span>}
        </div>
      </div>
    </div>
  );
};

export default TemperatureSlider;