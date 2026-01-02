import React from 'react';
import { Copy, Download, Terminal, Check, Globe, ExternalLink } from 'lucide-react';
import { Source } from '../types';

interface CodeViewerProps {
  code: string;
  sources?: Source[];
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, sources = [] }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scrape_csr_rfp.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl shadow-xl border border-gray-800 flex flex-col h-full overflow-hidden text-gray-300 font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="font-medium text-gray-200">scrape_csr_rfp.py</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-[#333] rounded-md transition-colors text-gray-400 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download .py
          </button>
        </div>
      </div>

      {/* Main Area with Sidebar for Sources if present */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Area */}
        <div className="flex-1 overflow-auto custom-scrollbar p-4 relative bg-[#1e1e1e]">
          <pre className="m-0 font-mono text-[13px] leading-6 tab-4">
            <code>{code}</code>
          </pre>
        </div>

        {/* Sources Sidebar */}
        {sources.length > 0 && (
          <div className="w-64 border-l border-[#333] bg-[#252526] overflow-y-auto custom-scrollbar flex flex-col">
            <div className="p-3 border-b border-[#333] bg-[#2d2d2e]">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-3 h-3" /> Found Portals
              </h4>
            </div>
            <div className="p-2 space-y-2">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-2 rounded bg-[#1e1e1e] border border-[#333] hover:border-blue-500/50 hover:bg-[#2a2a2a] group transition-all"
                >
                  <div className="text-xs font-medium text-blue-400 truncate pr-4 group-hover:text-blue-300">
                    {source.title}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate mt-1 flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" />
                    {new URL(source.uri).hostname}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="p-4 bg-[#252526] border-t border-[#333] text-xs text-gray-400 space-y-2">
        <p className="font-semibold text-gray-300">How to run:</p>
        <div className="bg-[#1e1e1e] p-2 rounded border border-[#333] font-mono">
          pip install requests beautifulsoup4 lxml openpyxl pandas
        </div>
        <div className="bg-[#1e1e1e] p-2 rounded border border-[#333] font-mono">
          python scrape_csr_rfp.py
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
