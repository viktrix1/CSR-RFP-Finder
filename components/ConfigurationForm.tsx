import React, { useState } from 'react';
import { ScraperConfig } from '../types';
import { Layers, MapPin, Calendar, Code, CheckCircle2, Sparkles } from 'lucide-react';

interface ConfigurationFormProps {
  onGenerate: (config: ScraperConfig) => void;
  isGenerating: boolean;
}

const SECTORS = [
  "Livelihood",
  "Women Empowerment",
  "Education",
  "Health",
  "Climate-resilient Agriculture",
  "Agriculture",
  "Skill Development",
  "Water & Sanitation"
];

const REGIONS = [
  "Pan-India",
  "Uttarakhand",
  "Himachal Pradesh",
  "North East India",
  "Aspirational Districts"
];

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ onGenerate, isGenerating }) => {
  const [config, setConfig] = useState<ScraperConfig>({
    sectors: ["Livelihood", "Women Empowerment", "Education", "Health", "Climate-resilient Agriculture", "Agriculture"],
    geography: ["Pan-India", "Uttarakhand", "Himachal Pradesh"],
    deadline: "2026-01-31",
    outputFormat: 'xlsx'
  });

  const toggleSector = (sector: string) => {
    setConfig(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const toggleRegion = (region: string) => {
    setConfig(prev => ({
      ...prev,
      geography: prev.geography.includes(region)
        ? prev.geography.filter(r => r !== region)
        : [...prev.geography, region]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(config);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          Configure Scraper
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Define parameters for your Python scraping bot.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Sectors */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Target Sectors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTORS.map(sector => (
              <label key={sector} className={`
                flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none
                ${config.sectors.includes(sector) 
                  ? 'bg-blue-50 border-blue-200 text-blue-800' 
                  : 'hover:bg-gray-50 border-gray-200 text-gray-600'}
              `}>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={config.sectors.includes(sector)}
                  onChange={() => toggleSector(sector)}
                />
                {config.sectors.includes(sector) ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span className="font-medium">{sector}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Geography */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Geographic Focus
          </h3>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(region => (
              <button
                key={region}
                type="button"
                onClick={() => toggleRegion(region)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors border
                  ${config.geography.includes(region)
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}
                `}
              >
                {region}
              </button>
            ))}
          </div>
        </section>

        {/* Deadline */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Deadline Limit
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <input
              type="date"
              value={config.deadline}
              onChange={(e) => setConfig(prev => ({ ...prev, deadline: e.target.value }))}
              className="px-4 py-2 rounded-lg border-2 border-blue-500 bg-white text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto shadow-sm"
            />
            <span className="text-sm text-gray-500">Only fetch opportunities closing before this date.</span>
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleSubmit}
          disabled={isGenerating}
          className={`
            w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all
            flex items-center justify-center gap-2
            ${isGenerating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl active:transform active:scale-[0.99]'}
          `}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Python Script...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Scraper Tool
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfigurationForm;