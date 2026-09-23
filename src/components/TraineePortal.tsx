import React, { useState } from 'react';
import { Language, TraineeAccount } from '../types';
import { SAMPLE_TRAINEE_ACCOUNTS, SAMPLE_MISTAKES_DATA, TRADES, UP_ITI_INSTITUTES, STATE_SCHEDULED_EXAMS } from '../data';
import { OTPVerificationModal } from './OTPVerificationModal';
import {
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  Download,
  AlertCircle,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  RotateCcw,
  Clock,
  KeyRound,
  ShieldCheck,
  Timer
} from 'lucide-react';

interface TraineePortalProps {
  language: Language;
  onLaunchCBT: (tradeId: string) => void;
  onOpenLibrary: (tradeId: string) => void;
}

export const TraineePortal: React.FC<TraineePortalProps> = ({
  language,
  onLaunchCBT,
  onOpenLibrary,
}) => {
  const [selectedTraineeId, setSelectedTraineeId] = useState<string>(SAMPLE_TRAINEE_ACCOUNTS[0].id);
  const [activeSubView, setActiveSubView] = useState<'overview' | 'mistakes' | 'admit_card'>('overview');
  const [admitCardDownloaded, setAdmitCardDownloaded] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [pendingLaunchTradeId, setPendingLaunchTradeId] = useState<string>(SAMPLE_TRAINEE_ACCOUNTS[0].tradeId);

  const trainee: TraineeAccount =
    SAMPLE_TRAINEE_ACCOUNTS.find((t) => t.id === selectedTraineeId) || SAMPLE_TRAINEE_ACCOUNTS[0];

  const tradeInfo = TRADES.find((t) => t.id === trainee.tradeId) || TRADES[0];
  const itiInfo = UP_ITI_INSTITUTES.find((i) => i.code === trainee.itiCode) || UP_ITI_INSTITUTES[0];

  const handleInitiateCBT = (tradeId: string) => {
    setPendingLaunchTradeId(tradeId);
    setShowOtpModal(true);
  };

  const handleDownloadAdmitCard = () => {
    setAdmitCardDownloaded(true);
    const slipText = `======================================================
GOVERNMENT OF UTTAR PRADESH
DIRECTORATE OF TRAINING & EMPLOYMENT
NCVT / SCVT CTS ALL INDIA TRADE TEST (AITT) ADMIT SLIP
======================================================
Candidate Name : ${trainee.fullName}
Roll Number    : ${trainee.rollNumber}
Father's Name  : ${trainee.fatherName}
Trade          : ${tradeInfo.name.en} (${tradeInfo.code})
ITI Center     : ${itiInfo.name}, ${itiInfo.district} (${itiInfo.code})
Semester       : Semester ${trainee.semester} (Batch ${trainee.registrationYear})
Exam Center    : Central CBT Lab 1, ${itiInfo.name}
Reporting Time : 09:00 AM IST
Security Code  : NCVT-UP-2026-AUTH-${trainee.id.toUpperCase()}
======================================================
Bring Original Photo ID Proof & CTS Trainee Identity Card.
======================================================`;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AITT_CBT_Admit_Card_${trainee.rollNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setAdmitCardDownloaded(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Trainee Profile & Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-blue-900/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md border border-blue-400/30 shrink-0">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase">
                  {language === 'hi' ? 'प्रशिक्षार्थी पोर्टल' : 'Trainee Learning Desk'}
                </span>
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                  Roll: {trainee.rollNumber}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {trainee.fullName}
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                {language === 'hi' ? tradeInfo.name.hi : tradeInfo.name.en} • {itiInfo.name} ({itiInfo.district})
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Trainee Persona Switcher */}
            <div className="bg-white/10 p-1.5 rounded-xl border border-white/20">
              <label className="block text-[10px] text-blue-200 font-semibold px-2 mb-0.5">
                {language === 'hi' ? 'प्रशिक्षार्थी प्रोफाइल बदलें' : 'Switch Demo Trainee'}
              </label>
              <select
                id="select-trainee-persona"
                value={selectedTraineeId}
                onChange={(e) => setSelectedTraineeId(e.target.value)}
                className="bg-slate-900 text-white text-xs font-bold rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-hidden"
              >
                {SAMPLE_TRAINEE_ACCOUNTS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.tradeId.toUpperCase()} - {t.rollNumber.slice(-4)})
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-launch-trainee-cbt"
              type="button"
              onClick={() => handleInitiateCBT(trainee.tradeId)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>{language === 'hi' ? 'लाइव सीबीटी मॉक शुरू करें' : 'Launch Mock CBT Exam'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleInitiateCBT(trainee.tradeId)}
          className="p-4 rounded-xl border border-orange-200 bg-orange-50/60 hover:bg-orange-100/80 transition-all text-left group flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">Exam Simulator</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                Live Active
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-950">
              {language === 'hi' ? 'एनसीवीटी सीबीटी टेस्ट' : 'NCVT CTS CBT Engine'}
            </h3>
            <p className="text-[11px] text-slate-500">Timed activation window & OTP protection</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenLibrary(trainee.tradeId)}
          className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-all text-left group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Digital Books</span>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-950">
              {language === 'hi' ? 'निमी डिजिटल लाइब्रेरी' : 'NIMI Trade E-Books'}
            </h3>
            <p className="text-[11px] text-slate-500">Theory, Practicals & WCS Books</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={handleDownloadAdmitCard}
          className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 transition-all text-left group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Official Pass</span>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-950">
              {admitCardDownloaded ? 'Admit Card Ready!' : language === 'hi' ? 'प्रवेश पत्र (Admit Card)' : 'AITT CBT Admit Slip'}
            </h3>
            <p className="text-[11px] text-slate-500">Download verified exam pass</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Download className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Trainee Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubView('overview')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubView === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{language === 'hi' ? 'प्रदर्शन एवं अंक तालिका' : 'Scorecard & Analytics'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView('mistakes')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubView === 'mistakes' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'hi' ? 'गलती सुधार नोटबुक' : 'Mistakes Revision Book'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView('admit_card')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubView === 'admit_card' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>{language === 'hi' ? 'प्रवेश पत्र विवरण' : 'Admit Card Verification'}</span>
        </button>
      </div>

      {/* VIEW 1: Overview & Scorecards */}
      {activeSubView === 'overview' && (
        <div className="space-y-6">
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-xs font-semibold block">Tests Completed</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{trainee.mockTestsTaken} Mock Tests</span>
              <span className="text-[11px] text-emerald-600 font-medium">100% attendance</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-xs font-semibold block">Average Score</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">{trainee.averageScore}%</span>
              <span className="text-[11px] text-emerald-600 font-medium">Qualified for AITT</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-xs font-semibold block">State Percentile</span>
              <span className="text-2xl font-black text-purple-600 mt-1 block">89th %ile</span>
              <span className="text-[11px] text-slate-500">Among 14,800 students</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-xs font-semibold block">Exam Status</span>
              <span className="text-lg font-black text-emerald-700 mt-1 block">Hall Ticket Ready</span>
              <span className="text-[11px] text-slate-500">Biometric verified</span>
            </div>
          </div>

          {/* Subject-Wise Competency Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              {language === 'hi' ? 'विषयवार दक्षता एवं अंक विश्लेषण' : 'Subject Competency Breakdown'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Trade Theory (व्यावसायिक सिद्धांत)</span>
                  <span className="font-mono text-emerald-700">88% (Proficient)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Workshop Calculation & Science (कार्यशाला गणना एवं विज्ञान)</span>
                  <span className="font-mono text-blue-700">82% (Good)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Engineering Drawing (इंजीनियरिंग ड्राइंग)</span>
                  <span className="font-mono text-indigo-700">85% (Proficient)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Employability Skills (रोजगार कौशल्य)</span>
                  <span className="font-mono text-amber-700">84% (Good)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Mistakes Revision Notebook */}
      {activeSubView === 'mistakes' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                {language === 'hi' ? 'व्यक्तिगत गलती सुधार नोटबुक' : 'Personalized Mistakes Revision Notebook'}
              </h3>
              <p className="text-xs text-slate-500">
                Review questions answered incorrectly in past CBT mock tests with official NIMI explanations.
              </p>
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              {SAMPLE_MISTAKES_DATA.length} Questions to Revise
            </span>
          </div>

          <div className="space-y-4">
            {SAMPLE_MISTAKES_DATA.map((item, idx) => (
              <div
                key={item.questionId}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-900 text-[11px]">
                    Mistake #{idx + 1} • {item.topic}
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 bg-white border border-rose-200 px-2 py-0.5 rounded">
                    Requires Review
                  </span>
                </div>

                <div className="font-semibold text-slate-900 leading-snug">
                  <p>{language === 'hi' ? item.questionText.hi : item.questionText.en}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white border border-rose-300 text-rose-900">
                    <span className="font-bold block text-rose-600">Your Answer:</span>
                    <span>{item.selectedOption}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900">
                    <span className="font-bold block text-emerald-700">Correct NIMI Answer:</span>
                    <span>{item.correctOption}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                  <span className="font-bold text-indigo-700 block mb-0.5">NIMI Textbook Reference & Solution:</span>
                  {language === 'hi' ? item.explanation.hi : item.explanation.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Admit Card Verification */}
      {activeSubView === 'admit_card' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                {language === 'hi' ? 'अखिल भारतीय व्यावसायिक परीक्षा (AITT) डिजिटल प्रवेश पत्र' : 'NCVT CTS Digital Admit Card'}
              </h3>
              <p className="text-xs text-slate-500">
                Directorate of Training & Employment, Govt. of Uttar Pradesh
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadAdmitCard}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Slip</span>
            </button>
          </div>

          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 font-mono text-xs text-slate-800 max-w-2xl mx-auto shadow-xs">
            <div className="text-center border-b border-slate-300 pb-3 space-y-1">
              <h4 className="font-bold text-sm text-slate-900 uppercase">State Council for Vocational Training, UP</h4>
              <p className="text-[11px] text-slate-600">AITT Computer Based Test (CBT) Examination 2026</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block">Candidate Name:</span>
                <span className="font-bold text-slate-900">{trainee.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Roll Number:</span>
                <span className="font-bold text-slate-900">{trainee.rollNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Father's Name:</span>
                <span className="font-bold text-slate-900">{trainee.fatherName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Trade:</span>
                <span className="font-bold text-slate-900">{tradeInfo.name.en} ({tradeInfo.code})</span>
              </div>
              <div>
                <span className="text-slate-500 block">ITI Institution:</span>
                <span className="font-bold text-slate-900">{itiInfo.name}, {itiInfo.district}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned CBT Lab:</span>
                <span className="font-bold text-emerald-800">Lab 1, Term 24 (Shift 1)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Statewide Activation Window:</span>
                <span className="font-bold text-orange-800">09:30 AM - 11:30 AM IST</span>
              </div>
              <div>
                <span className="text-slate-500 block">Authentication Protocol:</span>
                <span className="font-bold text-indigo-800">2-Tier (Lab Key + 6-Digit OTP)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
              <span>Security Stamp: VERIFIED-BY-DTE-UP</span>
              <span>Bar Code: |||| | ||||| |||| |||</span>
            </div>
          </div>
        </div>
      )}

      {/* Trainee Launch OTP Verification Modal */}
      <OTPVerificationModal
        language={language}
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          setShowOtpModal(false);
          onLaunchCBT(pendingLaunchTradeId);
        }}
        studentName={trainee.fullName}
        rollNumber={trainee.rollNumber}
        registeredMobile={trainee.mobile}
        expectedOtpCode="749210"
        examTitle={language === 'hi' ? 'उत्तर प्रदेश राज्य आईटीआई सीबीटी परीक्षा' : 'UP State ITI NCVT CBT Engine'}
        centerLabCode="SCVT-UP-LOCK-2026A"
      />
    </div>
  );
};
