import React, { useState } from 'react';
import { Language } from '../types';
import { 
  generateHostingerHtaccess, 
  generateHostingerPhpApi 
} from '../utils/moodleAndHostinger';
import { 
  Server, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  HelpCircle, 
  CheckCircle2, 
  Terminal, 
  Database,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface HostingerDeployPanelProps {
  language: Language;
}

export const HostingerDeployPanel: React.FC<HostingerDeployPanelProps> = ({ language }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const htaccessContent = generateHostingerHtaccess();
  const phpApiContent = generateHostingerPhpApi();

  const handleCopy = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 3000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
          <Server className="w-3.5 h-3.5" />
          {language === 'hi' ? 'होस्टिंगर (Hostinger) डिप्लॉयमेंट गाइड' : 'Hostinger Production Deployment Kit'}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          {language === 'hi'
            ? 'होस्टिंगर hPanel / LiteSpeed वेब सर्वर पर 1-क्लिक डिप्लॉय'
            : 'Deploy to Hostinger Premium / Business Web Hosting (LiteSpeed)'}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-3xl">
          {language === 'hi'
            ? 'यह पूरा पोर्टल होस्टिंगर के सामान्य शेयर्ड होस्टिंग प्लान पर आसानी से चलता है। आपको किसी महंगे क्लाउड सर्वर की आवश्यकता नहीं है। नीचे दिए गए कॉन्फ़िग फाइल्स और स्टेप-बाय-स्टेप गाइड का पालन करें।'
            : 'Built specifically for high performance on cost-effective Hostinger shared or cloud hosting. Utilizes pre-compiled static assets in `public_html` with a lightweight PHP 8.2 MySQL API for low RAM and high concurrent exam loads.'}
        </p>
      </div>

      {/* Step-by-Step Deployment Guide */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {language === 'hi' ? 'होस्टिंगर पर लाइव करने के 4 सरल चरण:' : '4 Steps to Deploy on Hostinger:'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h4 className="font-bold text-slate-900">Run Build</h4>
            <p className="text-slate-600 leading-relaxed">
              Run <code className="bg-slate-200 px-1 rounded font-mono">npm run build</code> in this workspace. It outputs production files inside <code className="bg-slate-200 px-1 rounded font-mono">dist/</code>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h4 className="font-bold text-slate-900">Upload to Hostinger</h4>
            <p className="text-slate-600 leading-relaxed">
              In Hostinger hPanel, open <strong>File Manager</strong>. Navigate to <code className="bg-slate-200 px-1 rounded font-mono">public_html</code> and upload all contents from <code className="bg-slate-200 px-1 rounded font-mono">dist/</code>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h4 className="font-bold text-slate-900">Place .htaccess</h4>
            <p className="text-slate-600 leading-relaxed">
              Upload the generated <code className="bg-slate-200 px-1 rounded font-mono">.htaccess</code> file directly to <code className="bg-slate-200 px-1 rounded font-mono">public_html/</code> for clean SPA routing and caching.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h4 className="font-bold text-slate-900">MySQL Setup</h4>
            <p className="text-slate-600 leading-relaxed">
              Create a database in Hostinger <strong>MySQL Databases</strong> and upload the provided <code className="bg-slate-200 px-1 rounded font-mono">submit_exam.php</code> to <code className="bg-slate-200 px-1 rounded font-mono">public_html/api/</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Generated Deploy Config Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* .htaccess */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-600" />
                Apache / LiteSpeed .htaccess
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                For public_html
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Ensures HTTPS redirects, GZIP compression for slow 3G/4G in rural UP, and SPA fallback.
            </p>
            <pre className="text-[11px] font-mono bg-slate-900 text-emerald-400 p-3 rounded-lg max-h-48 overflow-y-auto whitespace-pre-wrap">
              {htaccessContent}
            </pre>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleCopy('.htaccess', htaccessContent)}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
            >
              {copiedFile === '.htaccess' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === '.htaccess' ? 'Copied!' : 'Copy Config'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload('.htaccess', htaccessContent)}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .htaccess</span>
            </button>
          </div>
        </div>

        {/* submit_exam.php */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-teal-600" />
                PHP 8.2 MySQL API (submit_exam.php)
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded">
                For public_html/api/
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Ultra-lightweight script connecting to Hostinger MySQL with optional Moodle gradebook forwarding.
            </p>
            <pre className="text-[11px] font-mono bg-slate-900 text-teal-300 p-3 rounded-lg max-h-48 overflow-y-auto whitespace-pre-wrap">
              {phpApiContent}
            </pre>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleCopy('submit_exam.php', phpApiContent)}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
            >
              {copiedFile === 'submit_exam.php' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'submit_exam.php' ? 'Copied!' : 'Copy Script'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload('submit_exam.php', phpApiContent)}
              className="flex-1 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .php</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
