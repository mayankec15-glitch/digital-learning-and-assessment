import React, { useState } from 'react';
import { Trade, LibraryResource, Language, ResourceType } from '../types';
import { TRADES, LIBRARY_RESOURCES } from '../data';
import { 
  Book, 
  FileText, 
  Video, 
  Download, 
  Search, 
  Filter, 
  Bookmark, 
  Sparkles, 
  Check, 
  ExternalLink,
  BookOpen,
  HelpCircle,
  Eye,
  FileCheck
} from 'lucide-react';

interface LibraryViewProps {
  language: Language;
  onLaunchPracticeTest: (tradeId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  language,
  onLaunchPracticeTest,
}) => {
  const [selectedTradeId, setSelectedTradeId] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<LibraryResource | null>(null);

  // Filter resources
  const filteredResources = LIBRARY_RESOURCES.filter((res) => {
    const matchesTrade = selectedTradeId === 'all' || res.tradeId === selectedTradeId;
    const matchesSubject = selectedSubject === 'all' || res.subject === selectedSubject;
    const matchesType = selectedType === 'all' || res.type === selectedType;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === '' ||
      res.title.en.toLowerCase().includes(query) ||
      res.title.hi.toLowerCase().includes(query) ||
      res.tags.some((t) => t.toLowerCase().includes(query)) ||
      res.summary.en.toLowerCase().includes(query) ||
      res.summary.hi.toLowerCase().includes(query);

    return matchesTrade && matchesSubject && matchesType && matchesSearch;
  });

  const handleDownload = (res: LibraryResource) => {
    setDownloadNotice(res.title[language]);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 4000);
  };

  const currentTrade = TRADES.find((t) => t.id === selectedTradeId);

  return (
    <div className="space-y-6">
      {/* Banner / Stat Row */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? 'उत्तर प्रदेश राजकीय एवं निजी आईटीआई' : 'UP Govt & Private ITI Digital Library'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {language === 'hi'
              ? 'निमी (NIMI) एवं भारत स्किल्स प्रमाणित ई-संसाधन'
              : 'NIMI & Bharat Skills Certified Digital Learning Repository'}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {language === 'hi'
              ? 'ट्रेड थ्योरी, कार्यशाला प्रैक्टिकल मैनुअल, डब्ल्यूसीएस (WCS) और एम्प्लॉयबिलिटी स्किल्स की द्विभाषी (हिंदी/अंग्रेजी) पाठ्य सामग्री डाउनलोड करें और ऑनलाइन पढ़ें।'
              : 'Curated e-books, CTS practical job sheets, video lectures, and question banks aligned with the latest NCVT/SCVT curriculum for UP ITI trainees.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="block text-2xl font-bold text-amber-400">300+</span>
              <span className="text-xs text-slate-300">
                {language === 'hi' ? 'राजकीय आईटीआई' : 'Govt ITIs Connected'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="block text-2xl font-bold text-orange-400">2,500+</span>
              <span className="text-xs text-slate-300">
                {language === 'hi' ? 'निजी आईटीआई' : 'Private ITIs in UP'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="block text-2xl font-bold text-emerald-400">100%</span>
              <span className="text-xs text-slate-300">
                {language === 'hi' ? 'निमी पैटर्न सामग्री' : 'NIMI Standard CTS'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="block text-2xl font-bold text-sky-400">Offline</span>
              <span className="text-xs text-slate-300">
                {language === 'hi' ? 'कैश सपोर्ट' : 'Low-Bandwidth Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Selector Pills */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            {language === 'hi' ? 'ट्रेड का चयन करें' : 'Select Trade'}
          </label>
          {selectedTradeId !== 'all' && (
            <button
              onClick={() => setSelectedTradeId('all')}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              {language === 'hi' ? 'सभी ट्रेड्स देखें' : 'Show All Trades'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            id="trade-pill-all"
            type="button"
            onClick={() => setSelectedTradeId('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTradeId === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'hi' ? 'सभी ट्रेड्स (All)' : 'All Trades'}
          </button>
          {TRADES.map((trade) => {
            const isSelected = selectedTradeId === trade.id;
            return (
              <button
                id={`trade-pill-${trade.id}`}
                key={trade.id}
                type="button"
                onClick={() => setSelectedTradeId(trade.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{trade.name[language]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-900/60 text-amber-200' : 'bg-slate-200 text-slate-600'}`}>
                  {trade.code}
                </span>
              </button>
            );
          })}
        </div>

        {/* Trade Details Callout if Trade Selected */}
        {currentTrade && (
          <div className="mt-3 p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-semibold text-amber-950 text-sm mb-0.5">
                {currentTrade.name[language]} (Trade Code: {currentTrade.code})
              </p>
              <p className="text-amber-900/80">{currentTrade.description[language]}</p>
            </div>
            <button
              type="button"
              onClick={() => onLaunchPracticeTest(currentTrade.id)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-all shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'इस ट्रेड का टेस्ट दें' : 'Take CBT Mock Test'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-library-search"
            type="text"
            placeholder={
              language === 'hi'
                ? 'किताब का नाम, विषय या टॉपिक खोजें (उदा. Electrician, Vernier, Earthing)...'
                : 'Search textbooks, topics, or keywords (e.g., Electrician, Lathe, SQL)...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Subject Filter */}
        <div>
          <select
            id="select-subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label={language === 'hi' ? 'विषय फिल्टर' : 'Subject Filter'}
            className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-700 font-medium"
          >
            <option value="all">{language === 'hi' ? 'सभी विषय (All Subjects)' : 'All Subjects'}</option>
            <option value="Trade Theory">Trade Theory</option>
            <option value="Trade Practical">Trade Practical</option>
            <option value="Workshop Calculation & Science">Workshop Calculation &amp; Science</option>
            <option value="Employability Skills">Employability Skills</option>
          </select>
        </div>

        {/* Resource Type */}
        <div>
          <select
            id="select-type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label={language === 'hi' ? 'संसाधन प्रकार फिल्टर' : 'Resource Type Filter'}
            className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-700 font-medium"
          >
            <option value="all">{language === 'hi' ? 'सभी प्रकार (All Types)' : 'All Media Types'}</option>
            <option value="pdf">PDF E-Books</option>
            <option value="practical">Practical Job Sheets</option>
            <option value="video">Video Demonstrations</option>
          </select>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>{language === 'hi' ? 'डाउनलोड प्रारंभ:' : 'Download Started:'}</strong>{' '}
              {downloadNotice} ({language === 'hi' ? 'ऑफ़लाइन उपयोग हेतु सुरक्षित' : 'Cached for offline use'})
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            NIMI Certified PDF
          </span>
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-dashed border-slate-300">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {language === 'hi' ? 'कोई अध्ययन सामग्री नहीं मिली' : 'No Resources Found'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'कृपया अपने फ़िल्टर रीसेट करें या कोई भिन्न कीवर्ड खोजें।'
                : 'Try clearing your search query or selecting "All Trades".'}
            </p>
          </div>
        ) : (
          filteredResources.map((res) => {
            const tradeInfo = TRADES.find((t) => t.id === res.tradeId);
            return (
              <div
                key={res.id}
                id={`card-resource-${res.id}`}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-amber-300 transition-all hover:shadow-md flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                      {tradeInfo?.name[language] || res.subject}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-500">
                      {res.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-red-600" />}
                      {res.type === 'practical' && <FileCheck className="w-3.5 h-3.5 text-blue-600" />}
                      {res.type === 'video' && <Video className="w-3.5 h-3.5 text-purple-600" />}
                      <span className="uppercase text-[10px]">{res.type}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                    {res.title[language]}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {res.summary[language]}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {res.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500 font-medium">
                    {res.fileSize || res.duration || res.readTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewResource(res)}
                      className="px-2.5 py-1 rounded text-slate-700 hover:bg-slate-200 font-semibold flex items-center gap-1 transition-colors"
                      title={language === 'hi' ? 'देखें' : 'Preview'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'देखें' : 'Read'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(res)}
                      className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1 shadow-xs transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'डाउनलोड' : 'Get PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resource Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {previewResource.subject} • {previewResource.authorOrSource}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {previewResource.title[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 mb-2">
                {language === 'hi' ? 'अध्याय सारांश एवं प्रमुख विषय:' : 'Chapter Summary & Key Modules:'}
              </h4>
              <p className="mb-3">{previewResource.summary[language]}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div>
                  <strong>{language === 'hi' ? 'मानक स्रोत:' : 'Accreditation:'}</strong> {previewResource.authorOrSource}
                </div>
                <div>
                  <strong>{language === 'hi' ? 'आकार/अवधि:' : 'Size/Duration:'}</strong> {previewResource.fileSize || previewResource.duration || previewResource.readTime}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(previewResource);
                  setPreviewResource(null);
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                {language === 'hi' ? 'ऑफलाइन सेव करें' : 'Save for Offline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
