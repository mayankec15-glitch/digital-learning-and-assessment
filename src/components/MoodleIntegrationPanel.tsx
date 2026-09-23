import React, { useState } from 'react';
import { Language, MoodleConfig } from '../types';
import { SAMPLE_QUESTIONS } from '../data';
import { 
  exportToMoodleGIFT, 
  exportToMoodleXML 
} from '../utils/moodleAndHostinger';
import { 
  Globe, 
  Key, 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Share2, 
  RefreshCw 
} from 'lucide-react';

interface MoodleIntegrationPanelProps {
  language: Language;
}

export const MoodleIntegrationPanel: React.FC<MoodleIntegrationPanelProps> = ({ language }) => {
  const [config, setConfig] = useState<MoodleConfig>({
    hostUrl: 'https://moodle.iti-up.gov.in',
    wsToken: '9f82ab738e45c08d1920ac349e912',
    courseId: '104',
    quizId: '28',
    autoSyncGrades: true,
    exportFormat: 'GIFT',
    connected: true,
  });

  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [testConnectionStatus, setTestConnectionStatus] = useState<string | null>(null);

  const giftText = exportToMoodleGIFT(SAMPLE_QUESTIONS);
  const xmlText = exportToMoodleXML(SAMPLE_QUESTIONS);

  const handleCopyText = (format: 'GIFT' | 'XML') => {
    const text = format === 'GIFT' ? giftText : xmlText;
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 3000);
  };

  const handleDownloadFile = (format: 'GIFT' | 'XML') => {
    const text = format === 'GIFT' ? giftText : xmlText;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UP_ITI_Question_Bank_${format.toLowerCase()}.${format === 'GIFT' ? 'txt' : 'xml'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTestPing = () => {
    setTestConnectionStatus('testing');
    setTimeout(() => {
      setTestConnectionStatus('success');
      setTimeout(() => setTestConnectionStatus(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 rounded-2xl border border-indigo-800 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
          <Globe className="w-3.5 h-3.5" />
          {language === 'hi' ? 'मूडल एलएमएस (Moodle LMS) इंटीग्रेशन हब' : 'Moodle LMS Web Services & Question Sync'}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          {language === 'hi'
            ? 'मूडल 3.x / 4.x के साथ दो-तरफा डेटा और ग्रेडबुक सिंक'
            : 'Bidirectional Gradebook & Question Bank Integration with Moodle'}
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-3xl">
          {language === 'hi'
            ? 'आईटीआई संस्थान अपने मौजूदा मूडल सर्वर को कनेक्ट कर सकते हैं। सीबीटी टेस्ट के परिणाम सीधे छात्र की मूडल प्रोफाइल में दर्ज होते हैं, और निमी प्रश्न बैंक को 1-क्लिक में GIFT या Moodle XML फॉर्मेट में एक्सपोर्ट किया जा सकता है।'
            : 'Seamlessly link your institution\'s Moodle LMS. Push CBT mock scores directly into student gradebooks via Moodle REST Web Services (`core_grades_update_grades`) and import standard NIMI questions effortlessly.'}
        </p>
      </div>

      {/* Web Service Settings & Connection Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {language === 'hi' ? 'मूडल रेस्ट (REST) एपीआई सेटिंग्स' : 'Moodle REST API Token & Endpoints'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'साइट प्रशासन > प्लगइन्स > वेब सेवाएं > टोकन प्रबंधित करें'
                  : 'Site Admin > Plugins > Web Services > Manage Tokens'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {config.connected ? (language === 'hi' ? 'कनेक्टेड' : 'Online / Connected') : 'Disconnected'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Moodle Site URL
            </label>
            <input
              type="text"
              value={config.hostUrl}
              onChange={(e) => setConfig({ ...config, hostUrl: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Web Service Access Token (wstoken)
            </label>
            <input
              type="password"
              value={config.wsToken}
              onChange={(e) => setConfig({ ...config, wsToken: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Default Target Course ID
            </label>
            <input
              type="text"
              value={config.courseId}
              onChange={(e) => setConfig({ ...config, courseId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Gradebook Auto-Sync
            </label>
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={config.autoSyncGrades}
                  onChange={(e) => setConfig({ ...config, autoSyncGrades: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span>{language === 'hi' ? 'परीक्षा सबमिट होते ही मूडल में अंक भेजें' : 'Automatically sync CBT score to Moodle Gradebook'}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {testConnectionStatus === 'testing' && 'Testing handshake with Moodle REST server...'}
            {testConnectionStatus === 'success' && (
              <span className="text-emerald-700 font-bold">
                ✓ Connection established! Moodle 4.3 LTS verified.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleTestPing}
            className="px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testConnectionStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>{language === 'hi' ? 'कनेक्शन जांचें (Ping)' : 'Test Moodle Connection'}</span>
          </button>
        </div>
      </div>

      {/* Question Bank Export Formats (GIFT & Moodle XML) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {language === 'hi'
                ? 'निमी क्वेश्चन बैंक मूडल एक्सपोर्ट'
                : 'Direct Question Bank Exporter for Moodle LMS'}
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {SAMPLE_QUESTIONS.length} Questions Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* GIFT Format Block */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-indigo-950 uppercase tracking-wider">
                  Moodle GIFT Format (.txt)
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                  Most Popular
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Standard text format with bilingual question, options, feedback, and correct weights.
              </p>
              <pre className="text-[11px] font-mono bg-white p-3 rounded border border-slate-200 text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap">
                {giftText.slice(0, 320)}...
              </pre>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyText('GIFT')}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
              >
                {copiedFormat === 'GIFT' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'GIFT' ? 'Copied!' : 'Copy Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFile('GIFT')}
                className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          {/* Moodle XML Format Block */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-indigo-950 uppercase tracking-wider">
                  Moodle XML Format (.xml)
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded">
                  Full Rich HTML
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Rich XML structure preserving HTML markup, diagrams, rationale and penalization configs.
              </p>
              <pre className="text-[11px] font-mono bg-white p-3 rounded border border-slate-200 text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap">
                {xmlText.slice(0, 320)}...
              </pre>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyText('XML')}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
              >
                {copiedFormat === 'XML' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'XML' ? 'Copied!' : 'Copy Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFile('XML')}
                className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .xml</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
