import React from 'react';
import { Download, ExternalLink, Globe, FileSpreadsheet, Building2, MapPin, Calendar, Target } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Opportunity, Source } from '../types';

interface ResultsTableProps {
  data: Opportunity[];
  sources: Source[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data, sources }) => {
  
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CSR Opportunities");
    XLSX.writeFile(wb, "csr_opportunities.xlsx");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <FileSpreadsheet className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Found Opportunities</h2>
            <p className="text-xs text-black">{data.length} active listings found</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={data.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Table Area */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-black p-8">
              <Target className="w-12 h-12 mb-3 opacity-20" />
              <p>No opportunities found yet. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider border-b border-gray-200">Opportunity</th>
                  <th className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider border-b border-gray-200">Organization</th>
                  <th className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider border-b border-gray-200">Details</th>
                  <th className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider border-b border-gray-200">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-black uppercase tracking-wider border-b border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-black line-clamp-2">{item.title}</div>
                      <div className="text-xs text-black mt-1 line-clamp-2">{item.brief}</div>
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-black font-medium">
                        <Building2 className="w-3.5 h-3.5 text-black" />
                        {item.organization}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold w-fit">
                          <Target className="w-3 h-3" /> {item.focusArea}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-black text-xs font-bold w-fit">
                          <MapPin className="w-3 h-3" /> {item.region}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                       <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-black font-medium">
                           <Calendar className="w-3.5 h-3.5 text-black" />
                           {item.deadline}
                        </div>
                        <div className={`text-xs font-bold px-2 py-0.5 rounded w-fit ${
                          item.type === 'RFP' ? 'bg-purple-100 text-purple-900' :
                          item.type === 'RFQ' ? 'bg-orange-100 text-orange-900' :
                          'bg-indigo-100 text-indigo-900'
                        }`}>
                          {item.type}
                        </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1 text-sm font-bold"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Sources Sidebar */}
        {sources.length > 0 && (
          <div className="w-64 border-l border-gray-200 bg-gray-50 overflow-y-auto custom-scrollbar flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> Source Data
              </h4>
            </div>
            <div className="p-3 space-y-3">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="text-xs font-bold text-blue-700 line-clamp-2 group-hover:text-blue-900 mb-1">
                    {source.title}
                  </div>
                  <div className="text-[10px] text-black flex items-center gap-1 truncate">
                    <ExternalLink className="w-2.5 h-2.5" />
                    {new URL(source.uri).hostname}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;