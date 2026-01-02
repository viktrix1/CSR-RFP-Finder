import React, { useState } from 'react';
import ConfigurationForm from './components/ConfigurationForm';
import ResultsTable from './components/ResultsTable';
import { generateScraperScript } from './services/geminiService';
import { ScraperConfig, AppStatus, Source, Opportunity } from './types';
import { Bot, AlertCircle, Search } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (config: ScraperConfig) => {
    setStatus(AppStatus.GENERATING);
    setError(null);
    setSources([]);
    setOpportunities([]);
    try {
      const result = await generateScraperScript(config);
      setOpportunities(result.opportunities);
      setSources(result.sources);
      setStatus(AppStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch opportunities. Please check your API Key and try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">CSR Opportunity Finder</h1>
            <p className="text-xs text-gray-500 font-medium">Powered by Gemini 3 Flash</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid lg:grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <ConfigurationForm 
            onGenerate={handleGenerate} 
            isGenerating={status === AppStatus.GENERATING} 
          />
        </div>

        {/* Right Panel: Result */}
        <div className="lg:col-span-9 h-full flex flex-col overflow-hidden">
          {status === AppStatus.IDLE && (
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Find Active Opportunities</h3>
              <p className="text-gray-500 max-w-md">
                Select your target sectors and regions on the left. Gemini will search live data for active RFPs, RFQs, and EOIs.
              </p>
            </div>
          )}

          {status === AppStatus.GENERATING && (
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center p-12">
               <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <Bot className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Searching the Web...</h3>
              <p className="text-gray-500 max-w-md animate-pulse">
                Finding live RFPs and extracting details from CSR portals.
              </p>
            </div>
          )}

          {status === AppStatus.ERROR && (
             <div className="flex-1 bg-red-50 rounded-xl shadow-sm border border-red-100 flex flex-col items-center justify-center text-center p-12">
             <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
             <h3 className="text-lg font-bold text-red-800 mb-2">Search Failed</h3>
             <p className="text-red-600 mb-6 max-w-lg mx-auto">{error}</p>
             <button 
               onClick={() => setStatus(AppStatus.IDLE)}
               className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
             >
               Try Again
             </button>
           </div>
          )}

          {status === AppStatus.COMPLETE && (
            <ResultsTable data={opportunities} sources={sources} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;