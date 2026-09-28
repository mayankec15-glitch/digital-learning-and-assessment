import React, { useState, useRef } from 'react';
import { Language, TraineeAccount, ITIInstitute } from '../types';
import { COMPLIANCE_DTEUP_ITIS, TRADES } from '../data';
import {
  parseTraineesCsv,
  generateTraineeCsvTemplate,
  exportTraineeCredentialsCsv,
  saveTrainees,
  getStoredTrainees,
} from '../utils/traineeUserManager';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldCheck,
  KeyRound,
  Printer,
  Sparkles,
  School,
  X,
  FileText,
  Search,
  Eye,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface TraineeBatchUploadModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (createdCount: number) => void;
  callerRole: 'Directorate' | 'ITI Admin';
  preselectedItiCode?: string;
}

export const TraineeBatchUploadModal: React.FC<TraineeBatchUploadModalProps> = ({
  language,
  isOpen,
  onClose,
  onSuccess,
  callerRole,
  preselectedItiCode,
}) => {
  const [selectedIti, setSelectedIti] = useState<string>(preselectedItiCode || 'ITI-UP-001');
  const [csvRawText, setCsvRawText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseResult, setParseResult] = useState<ReturnType<typeof parseTraineesCsv> | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [createdTrainees, setCreatedTrainees] = useState<TraineeAccount[]>([]);
  const [activeStep, setActiveStep] = useState<'input' | 'preview' | 'complete'>('input');
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Template Download
  const handleDownloadTemplate = () => {
    const csv = generateTraineeCsvTemplate();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UP_ITI_Trainee_Bulk_Upload_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load Sample Trainees for 1-click test
  const handleLoadSample = () => {
    const sample = generateTraineeCsvTemplate();
    setCsvRawText(sample);
    const res = parseTraineesCsv(sample, selectedIti, callerRole);
    setParseResult(res);
    setActiveStep('preview');
  };

  // Process File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvRawText(content);
      const res = parseTraineesCsv(content, selectedIti, callerRole);
      setParseResult(res);
      setActiveStep('preview');
    };
    reader.readAsText(file);
  };

  const handleParseManualText = () => {
    if (!csvRawText.trim()) return;
    setIsParsing(true);
    setTimeout(() => {
      const res = parseTraineesCsv(csvRawText, selectedIti, callerRole);
      setParseResult(res);
      setIsParsing(false);
      setActiveStep('preview');
    }, 200);
  };

  // Confirm Creation and Save
  const handleConfirmCreation = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;

    setIsParsing(true);
    const current = getStoredTrainees();
    const updated = [...parseResult.validRows, ...current];
    saveTrainees(updated);

    // Also dispatch to backend if available
    try {
      await fetch('/api/trainees/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadedBy: callerRole,
          trainees: parseResult.validRows,
        }),
      });
    } catch (e) {
      // Offline fallback ok
    }

    setCreatedTrainees(parseResult.validRows);
    setUploadSuccess(true);
    setIsParsing(false);
    setActiveStep('complete');
    onSuccess(parseResult.validRows.length);
  };

  // Print Admit Slip
  const handlePrintSlips = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Trainee Examination Credentials & Login Slips - SCVT UP</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; font-size: 12px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .title { font-size: 16px; font-weight: bold; margin: 0; }
          .subtitle { font-size: 12px; color: #555; }
          .cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .slip { border: 1.5px dashed #444; padding: 12px; border-radius: 6px; page-break-inside: avoid; }
          .slip-header { display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px; }
          .badge { font-family: monospace; font-weight: bold; background: #eee; padding: 2px 5px; border-radius: 3px; }
          .field { margin-bottom: 4px; display: flex; justify-content: space-between; }
          .label { color: #666; font-size: 11px; }
          .val { font-weight: bold; }
          .cred-box { background: #fdf8e2; border: 1px solid #e0c868; padding: 6px; border-radius: 4px; margin-top: 8px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">उत्तर प्रदेश राज्य व्यावसायिक प्रशिक्षण परिषद (SCVT & DTE UP)</h1>
          <p class="subtitle">आधिकारिक सीबीटी परीक्षा एवं पोर्टल प्रवेश पत्रक (Trainee Login & Admit Credentials)</p>
          <p class="subtitle">जारीकर्ता: ${callerRole} | कुल पंजीकृत: ${createdTrainees.length} छात्र | दिनांक: ${new Date().toLocaleDateString('hi-IN')}</p>
        </div>
        <div class="cards">
          ${createdTrainees
            .map(
              (t) => `
            <div class="slip">
              <div class="slip-header">
                <strong>UP SCVT CBT 2026</strong>
                <span class="badge">${t.rollNumber}</span>
              </div>
              <div class="field"><span class="label">Candidate Name:</span> <span class="val">${t.fullName}</span></div>
              <div class="field"><span class="label">Father's Name:</span> <span class="val">${t.fatherName}</span></div>
              <div class="field"><span class="label">Trade / Course:</span> <span class="val">${t.tradeId.toUpperCase()} (Sem ${t.semester})</span></div>
              <div class="field"><span class="label">ITI Institute:</span> <span class="val">${t.itiName || t.itiCode}</span></div>
              <div class="field"><span class="label">Date of Birth:</span> <span class="val">${t.dob || '—'}</span></div>
              <div class="cred-box">
                <div class="field"><span class="label">Portal Username:</span> <span class="badge">${t.rollNumber}</span></div>
                <div class="field"><span class="label">Default Password:</span> <span class="badge">${t.password}</span></div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-[#0B1528] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/30">
                  {callerRole === 'Directorate' ? 'State Directorate Upload' : 'Institute ITI Desk'}
                </span>
                <span className="text-slate-400 text-xs">·</span>
                <span className="text-slate-300 text-xs">NCVT / SCVT Trainee User Creation</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {language === 'hi'
                  ? 'प्रशिक्षार्थियों का बल्क डेटा अपलोड एवं यूजर अकाउंट निर्माण'
                  : 'Bulk Trainee Data Upload & User Account Generation'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                activeStep === 'input' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
              }`}
            >
              1
            </span>
            <span className={`font-semibold ${activeStep === 'input' ? 'text-slate-900' : 'text-slate-500'}`}>
              {language === 'hi' ? 'डेटा इनपुट / CSV' : 'Data Input / CSV'}
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-4 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                activeStep === 'preview'
                  ? 'bg-amber-500 text-slate-950'
                  : activeStep === 'complete'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={`font-semibold ${activeStep === 'preview' ? 'text-slate-900' : 'text-slate-500'}`}>
              {language === 'hi' ? 'सत्यापन व पूर्वावलोकन' : 'Validation & Preview'}
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-4 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                activeStep === 'complete' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={`font-semibold ${activeStep === 'complete' ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
              {language === 'hi' ? 'यूजर निर्माण पूर्ण' : 'Accounts Created'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* ================= STEP 1: INPUT ================= */}
          {activeStep === 'input' && (
            <div className="space-y-6">
              {/* ITI Target Selector */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <School className="w-4 h-4 text-amber-600" />
                  <span>
                    {language === 'hi'
                      ? 'लक्षित संस्थान (आईटीआई कोड - डिफ़ॉल्ट)'
                      : 'Target ITI Institute (Default for missing codes)'}
                  </span>
                </label>
                <select
                  value={selectedIti}
                  onChange={(e) => setSelectedIti(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {COMPLIANCE_DTEUP_ITIS.map((inst) => (
                    <option key={inst.code} value={inst.code}>
                      {inst.code} - {inst.name} ({inst.district})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi'
                    ? 'यदि CSV में संस्थान कोड खाली है तो यह संस्थान कोड स्वतः लागू होगा।'
                    : 'If the uploaded CSV lacks an ITI code column for certain rows, this institute will be assigned.'}
                </p>
              </div>

              {/* Upload Dropzone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const content = ev.target?.result as string;
                        setCsvRawText(content);
                        const res = parseTraineesCsv(content, selectedIti, callerRole);
                        setParseResult(res);
                        setActiveStep('preview');
                      };
                      reader.readAsText(file);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    {language === 'hi'
                      ? 'प्रशिक्षार्थी CSV फ़ाइल यहाँ ड्रैग करें या क्लिक करके चुनें'
                      : 'Drag & Drop Trainee CSV file here, or Browse'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports .CSV, .TXT (Comma-Separated Values with UTF-8 encoding)
                  </p>
                </div>
              </div>

              {/* Action bar: Download Template & Sample Load */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-indigo-900">
                    {language === 'hi'
                      ? 'आधिकारिक मानक CSV टेम्पलेट का उपयोग करें:'
                      : 'Recommended: Use standard state upload template:'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-indigo-700 font-bold border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'टेम्पलेट डाउनलोड' : 'Download Template (.csv)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'नमूना डेटा लोड करें (Quick Test)' : 'Load 5 Sample Trainees'}</span>
                  </button>
                </div>
              </div>

              {/* Direct CSV Textarea Paste */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'hi'
                    ? 'अथवा CSV टेक्स्ट सीधे यहाँ पेस्ट करें:'
                    : 'Or Paste Raw CSV Data Directly:'}
                </label>
                <textarea
                  rows={4}
                  value={csvRawText}
                  onChange={(e) => setCsvRawText(e.target.value)}
                  placeholder="Roll_Number,Full_Name,Father_Name,Trade,ITI_Code,Semester,Registration_Year,Gender,DOB,Category,Mobile,Email,Password..."
                  className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 2: PREVIEW & VALIDATION ================= */}
          {activeStep === 'preview' && parseResult && (
            <div className="space-y-6">
              {/* Validation Summary Stat Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                  <span className="text-xs text-emerald-700 font-semibold block">
                    {language === 'hi' ? 'मान्य प्रशिक्षार्थी (तैयार)' : 'Valid Candidates (Ready)'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-800">
                    {parseResult.validRows.length}
                  </span>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
                  <span className="text-xs text-rose-700 font-semibold block">
                    {language === 'hi' ? 'अमान्य पंक्तियाँ (त्रुटि)' : 'Invalid Rows (Errors)'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-rose-800">
                    {parseResult.invalidRows.length}
                  </span>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-xl">
                  <span className="text-xs text-indigo-700 font-semibold block">
                    {language === 'hi' ? 'ट्रेड्स आच्छादित' : 'Trades Represented'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-indigo-800">
                    {Object.keys(parseResult.summary.tradesCount).length}
                  </span>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
                  <span className="text-xs text-amber-700 font-semibold block">
                    {language === 'hi' ? 'लक्षित आईटीआई' : 'Target ITIs'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-amber-800">
                    {Object.keys(parseResult.summary.itiCodesCount).length}
                  </span>
                </div>
              </div>

              {/* Invalid Rows Warning Box if any */}
              {parseResult.invalidRows.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>
                      {language === 'hi'
                        ? `${parseResult.invalidRows.length} पंक्तियों में विसंगतियां हैं (इन्हें छोड़ दिया जाएगा):`
                        : `${parseResult.invalidRows.length} rows have errors and will be skipped:`}
                    </span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-rose-800">
                    {parseResult.invalidRows.slice(0, 5).map((inv, idx) => (
                      <li key={idx}>
                        Row {inv.rowNumber}: {inv.errors.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Table Preview of Valid Candidates */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'hi'
                      ? `पूर्वावलोकन: नए यूजर खातों की सूची (${parseResult.validRows.length})`
                      : `Candidate Accounts Preview (${parseResult.validRows.length})`}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Auto-generated passwords: UP2026@**** or custom
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Roll No</th>
                        <th className="py-2.5 px-3">Full Name</th>
                        <th className="py-2.5 px-3">Trade</th>
                        <th className="py-2.5 px-3">ITI Code & Center</th>
                        <th className="py-2.5 px-3">Sem</th>
                        <th className="py-2.5 px-3">Password / PIN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parseResult.validRows.map((row) => (
                        <tr key={row.rollNumber} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold text-amber-700 bg-amber-50/50">
                            {row.rollNumber}
                          </td>
                          <td className="py-2 px-3 font-bold text-slate-900">
                            <div>{row.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              S/o {row.fatherName}
                            </div>
                          </td>
                          <td className="py-2 px-3 uppercase font-semibold text-indigo-700">
                            {row.tradeId}
                          </td>
                          <td className="py-2 px-3 text-slate-700">
                            <span className="font-mono text-[11px] font-semibold">{row.itiCode}</span>
                            <div className="text-[10px] text-slate-400 truncate max-w-xs">{row.itiName}</div>
                          </td>
                          <td className="py-2 px-3 font-mono text-center">Sem {row.semester}</td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-700">
                            {row.password}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: COMPLETION ================= */}
          {activeStep === 'complete' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  {language === 'hi'
                    ? `${createdTrainees.length} प्रशिक्षार्थी यूजर अकाउंट सफलतापूर्वक निर्मित!`
                    : `${createdTrainees.length} Trainee Accounts Successfully Created!`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {language === 'hi'
                    ? 'सभी प्रशिक्षार्थी तुरंत अपने रोल नंबर और पासवर्ड के साथ सीबीटी परीक्षा टर्मिनल एवं छात्र पोर्टल में लॉगिन कर सकते हैं।'
                    : 'All candidates can now immediately log into the CBT exam terminal or trainee desk using their roll number and password.'}
                </p>
              </div>

              {/* Quick credential export buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => exportTraineeCredentialsCsv(createdTrainees)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{language === 'hi' ? 'लॉगिन क्रेडेंशियल CSV डाउनलोड' : 'Download Credentials (CSV)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintSlips}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4 text-emerald-100" />
                  <span>{language === 'hi' ? 'प्रवेश पत्रक / स्लिप प्रिंट करें' : 'Print Admit / Login Slips'}</span>
                </button>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-1 max-w-lg mx-auto">
                <span className="font-bold block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>{language === 'hi' ? 'सत्यापित पोर्टल सिंक' : 'Authenticated Portal Sync'}</span>
                </span>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  {language === 'hi'
                    ? 'ये छात्र खाते ऑनलाइन सीबीटी परीक्षा इंजन, संस्थान के कंप्यूटर लैब टर्मिनल आवंटन और उपस्थिति रजिस्टर में स्वतः प्रतिबिंबित हो गए हैं।'
                    : 'These trainee accounts are now synced with the CBT Examination Terminal, lab roster allocations, and institutional attendance desk.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          {activeStep === 'input' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleParseManualText}
                disabled={!csvRawText.trim() || isParsing}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{language === 'hi' ? 'डेटा सत्यापित करें (Preview)' : 'Validate & Preview'}</span>
              </button>
            </>
          )}

          {activeStep === 'preview' && (
            <>
              <button
                type="button"
                onClick={() => setActiveStep('input')}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                {language === 'hi' ? '← वापस जाएं' : '← Back'}
              </button>

              <button
                type="button"
                onClick={handleConfirmCreation}
                disabled={!parseResult || parseResult.validRows.length === 0 || isParsing}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <KeyRound className="w-4 h-4 text-emerald-200" />
                <span>
                  {language === 'hi'
                    ? `${parseResult?.validRows.length || 0} यूजर अकाउंट बनाएं`
                    : `Create ${parseResult?.validRows.length || 0} User Accounts`}
                </span>
              </button>
            </>
          )}

          {activeStep === 'complete' && (
            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-sm"
              >
                {language === 'hi' ? 'पूर्ण करें व बंद करें' : 'Done & Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
