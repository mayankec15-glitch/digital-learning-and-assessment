import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Question, 
  QuestionStatus, 
  ExamSession, 
  ExamResult, 
  ITIInstitute,
  ScheduledStateExam
} from '../types';
import { TRADES, SAMPLE_QUESTIONS, UP_ITI_INSTITUTES, STATE_SCHEDULED_EXAMS } from '../data';
import { OTPVerificationModal } from './OTPVerificationModal';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Send, 
  Award, 
  FileText, 
  Building2, 
  User, 
  ShieldCheck, 
  Sparkles,
  Printer,
  Globe,
  KeyRound,
  Lock,
  Unlock,
  Smartphone,
  Timer,
  Info,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface CBTExamEngineProps {
  language: Language;
  targetTradeId?: string;
  onExitExam: () => void;
  onSyncToMoodle?: (result: ExamResult) => void;
}

export const CBTExamEngine: React.FC<CBTExamEngineProps> = ({
  language,
  targetTradeId = 'electrician',
  onExitExam,
  onSyncToMoodle,
}) => {
  // Setup / Pre-exam State
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Rahul Verma');
  const [rollNumber, setRollNumber] = useState<string>('UPITI-2401-8932');
  const [selectedITI, setSelectedITI] = useState<string>('Govt. ITI Aliganj (Lucknow)');
  const [selectedTrade, setSelectedTrade] = useState<string>(targetTradeId);

  // Statewide Scheduled Exam Selection & Security State
  const [selectedExamId, setSelectedExamId] = useState<string>(STATE_SCHEDULED_EXAMS[0].id);
  const [passcodeAttempt, setPasscodeAttempt] = useState<string>('SCVT-UP-LOCK-2026A');
  const [otpAttempt, setOtpAttempt] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpTimerSeconds, setOtpTimerSeconds] = useState<number>(60);
  const [activeOtpCode, setActiveOtpCode] = useState<string>(STATE_SCHEDULED_EXAMS[0].demoOtpCode || '749210');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);

  // Current system simulated clock (in IST)
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  });

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // OTP Countdown timer when dispatched
  useEffect(() => {
    let otpInterval: any;
    if (otpSent && otpTimerSeconds > 0) {
      otpInterval = setInterval(() => {
        setOtpTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(otpInterval);
  }, [otpSent, otpTimerSeconds]);

  // Current scheduled exam object
  const currentScheduledExam = STATE_SCHEDULED_EXAMS.find((e) => e.id === selectedExamId) || STATE_SCHEDULED_EXAMS[0];

  // Whenever selected exam changes, update relevant defaults
  const handleSelectScheduledExam = (examId: string) => {
    setSelectedExamId(examId);
    const chosen = STATE_SCHEDULED_EXAMS.find((e) => e.id === examId);
    if (chosen) {
      setSelectedTrade(chosen.tradeId);
      setPasscodeAttempt(chosen.passcode);
      setActiveOtpCode(chosen.demoOtpCode || '749210');
      setOtpSent(false);
      setAuthError(null);
    }
  };

  // Dispatch/Resend OTP Simulation
  const handleSendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtpCode(newOtp);
    setOtpSent(true);
    setOtpTimerSeconds(60);
    setAuthError(null);
  };

  // Active Exam State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [statusMap, setStatusMap] = useState<Record<string, QuestionStatus>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(30 * 60); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<ExamResult | null>(null);

  // Validate Activation Time & Trigger OTP Verification Before Starting Exam
  const handleValidateAndStartExam = () => {
    setAuthError(null);

    // 1. Check Statewide Activation Window
    if (!currentScheduledExam.isActivatedNow) {
      setAuthError(
        language === 'hi'
          ? `यह परीक्षा अभी सक्रिय नहीं है। यह निर्धारित समय (${currentScheduledExam.dateRange} | ${currentScheduledExam.shiftTimeSlot}) पर राज्यव्यापी स्तर पर स्वतः सक्रिय होगी।`
          : `This exam is not active yet. It will automatically activate statewide at scheduled time (${currentScheduledExam.dateRange} | ${currentScheduledExam.shiftTimeSlot}).`
      );
      return;
    }

    // 2. Validate Center Lab Lockdown Passcode
    if (currentScheduledExam.passcode && passcodeAttempt.trim().toUpperCase() !== currentScheduledExam.passcode.toUpperCase()) {
      setAuthError(
        language === 'hi'
          ? `अमान्य केंद्र लैब सुरक्षा पासकोड! कृपया परीक्षा अधीक्षक या इनविजिलेटर से सही पासकोड प्राप्त करें।`
          : `Invalid Center Lab Passcode! Please verify the lab lockdown code with your Invigilator.`
      );
      return;
    }

    // 3. Open OTP Verification Modal for Two-Tier Authentication
    if (currentScheduledExam.requiresOtpAuth) {
      setShowOtpModal(true);
      return;
    }

    // Direct start if no OTP required
    startExam();
  };

  // Initialize Exam Questions
  const startExam = () => {
    // Filter questions by trade or include common
    let tradeQuestions = SAMPLE_QUESTIONS.filter(
      (q) => q.tradeId === selectedTrade || q.tradeId === 'employability-skills' || q.tradeId === 'workshop-calc-science'
    );
    if (tradeQuestions.length === 0) {
      tradeQuestions = SAMPLE_QUESTIONS;
    }

    const initialStatus: Record<string, QuestionStatus> = {};
    tradeQuestions.forEach((q, idx) => {
      initialStatus[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
    });

    setQuestions(tradeQuestions);
    setStatusMap(initialStatus);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemainingSeconds(tradeQuestions.length * 90); // 1.5 min per question
    setExamStarted(true);
    setIsSubmitted(false);
    setResult(null);
  };

  // Timer Tick
  useEffect(() => {
    if (!examStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isSubmitted]);

  // Handle Answer Selection
  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    const activeQ = questions[currentQuestionIndex];
    if (!activeQ) return;

    setUserAnswers((prev) => ({
      ...prev,
      [activeQ.id]: optionId,
    }));

    setStatusMap((prev) => {
      const current = prev[activeQ.id];
      if (current === 'marked_for_review' || current === 'answered_and_marked') {
        return { ...prev, [activeQ.id]: 'answered_and_marked' };
      }
      return { ...prev, [activeQ.id]: 'answered' };
    });
  };

  // Mark For Review
  const handleToggleMarkForReview = () => {
    const activeQ = questions[currentQuestionIndex];
    if (!activeQ) return;

    setStatusMap((prev) => {
      const hasAns = !!userAnswers[activeQ.id];
      const isCurrentlyMarked = prev[activeQ.id] === 'marked_for_review' || prev[activeQ.id] === 'answered_and_marked';

      if (isCurrentlyMarked) {
        return { ...prev, [activeQ.id]: hasAns ? 'answered' : 'not_answered' };
      } else {
        return { ...prev, [activeQ.id]: hasAns ? 'answered_and_marked' : 'marked_for_review' };
      }
    });
  };

  // Clear Response
  const handleClearResponse = () => {
    const activeQ = questions[currentQuestionIndex];
    if (!activeQ) return;

    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[activeQ.id];
      return next;
    });

    setStatusMap((prev) => ({
      ...prev,
      [activeQ.id]: 'not_answered',
    }));
  };

  // Navigation
  const navigateToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    const targetQ = questions[index];

    // Mark current as not answered if visited but unselected
    const currentQ = questions[currentQuestionIndex];
    if (currentQ && statusMap[currentQ.id] === 'not_visited') {
      setStatusMap((prev) => ({
        ...prev,
        [currentQ.id]: 'not_answered',
      }));
    }

    // Mark destination as not_answered if it was not_visited
    if (targetQ && statusMap[targetQ.id] === 'not_visited') {
      setStatusMap((prev) => ({
        ...prev,
        [targetQ.id]: 'not_answered',
      }));
    }

    setCurrentQuestionIndex(index);
  };

  // Submit & Calculate Scores
  const handleSubmitExam = () => {
    let correctCount = 0;
    const totalQ = questions.length;

    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOption) {
        correctCount += 1;
      }
    });

    const marksPerQuestion = 2; // NCVT CBT standard
    const score = correctCount * marksPerQuestion;
    const totalMarks = totalQ * marksPerQuestion;
    const percentage = Math.round((score / totalMarks) * 100);
    const passed = percentage >= 40; // NCVT passing threshold

    const calculatedResult: ExamResult = {
      examId: `CBT-${Date.now()}`,
      examTitle: 'UP State Centralized NCVT ITI Mock Examination',
      tradeName: TRADES.find((t) => t.id === selectedTrade)?.name.en || 'Electrician',
      studentName,
      rollNumber,
      itiName: selectedITI,
      totalQuestions: totalQ,
      attempted: Object.keys(userAnswers).length,
      correct: correctCount,
      incorrect: Object.keys(userAnswers).length - correctCount,
      score,
      totalMarks,
      percentage,
      timeTakenMinutes: Math.round(((totalQ * 90) - timeRemainingSeconds) / 60),
      passed,
      subjectBreakdown: [
        { subject: 'Trade Theory & Skills', total: totalQ, score: correctCount },
      ],
    };

    setResult(calculatedResult);
    setIsSubmitted(true);

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Formatting Time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const activeQuestion = questions[currentQuestionIndex];

  // Helper for Palette Status Counts
  const countStatus = (status: QuestionStatus) => {
    return Object.values(statusMap).filter((s) => s === status).length;
  };

  // 1. PRE-EXAM REGISTRATION SCREEN
  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {language === 'hi'
                  ? 'उ.प्र. आईटीआई केंद्रीकृत सीबीटी मॉक परीक्षा'
                  : 'UP ITI Centralized CBT Mock Examination'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'hi'
                  ? 'एनसीवीटी (NCVT) अखिल भारतीय व्यावसायिक परीक्षा (AITT) पैटर्न के अनुसार'
                  : 'Designed strictly according to NCVT / DGT All India Trade Test (AITT) CBT Standards'}
              </p>
            </div>
          </div>

          {/* Statewide Exam Selection & Activation Status Banner */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-slate-100">
                  {language === 'hi' ? 'उत्तर प्रदेश राज्य व्यावसायिक परीक्षा परिषद (SCVT)' : 'State Council for Vocational Training (SCVT UP)'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>State Server Time: {currentTimeStr} IST</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-amber-300 block">
                  {language === 'hi' ? 'राज्यव्यापी सीबीटी परीक्षा चुनें' : 'Select Statewide Scheduled CBT Exam'}
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => handleSelectScheduledExam(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  {STATE_SCHEDULED_EXAMS.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {language === 'hi' ? ex.title.hi : ex.title.en} ({ex.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-time State Activation Status */}
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">State Activation:</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      currentScheduledExam.isActivatedNow
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {currentScheduledExam.isActivatedNow ? '● ACTIVE NOW' : '⏳ SCHEDULED'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center gap-1 font-mono">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentScheduledExam.shiftTimeSlot || 'Shift 1: 09:30 AM - 11:30 AM'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  {language === 'hi' ? 'प्रशिक्षु का नाम' : 'Trainee Full Name'}
                </label>
                <input
                  id="input-cbt-student-name"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  {language === 'hi' ? 'रोल नंबर / रजिस्ट्रेशन नंबर' : 'NCVT Roll / Registration No.'}
                </label>
                <input
                  id="input-cbt-roll-no"
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  {language === 'hi' ? 'संस्थान (ITI College)' : 'ITI Institute / College'}
                </label>
                <select
                  id="select-cbt-iti"
                  value={selectedITI}
                  onChange={(e) => setSelectedITI(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                >
                  {UP_ITI_INSTITUTES.map((iti) => (
                    <option key={iti.code} value={`${iti.name} (${iti.district})`}>
                      {iti.code} - {iti.name} ({iti.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'hi' ? 'परीक्षा ट्रेड (Trade)' : 'Trade Exam'}
                </label>
                <select
                  id="select-cbt-trade"
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                >
                  {TRADES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.name[language]} ({t.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lab Lockdown Passcode Input */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <label className="block text-xs font-bold text-amber-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    {language === 'hi' ? 'कंप्यूटर लैब सुरक्षा पासकोड' : 'Center Lab Lockdown Passcode'}
                  </span>
                  <span className="text-[10px] text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded font-mono font-bold">
                    Official Key
                  </span>
                </label>
                <input
                  type="text"
                  value={passcodeAttempt}
                  onChange={(e) => setPasscodeAttempt(e.target.value)}
                  placeholder="e.g. SCVT-UP-LOCK-2026A"
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 block">
                  Provided by Examination Superintendent to unlock terminal
                </span>
              </div>
            </div>

            {/* Exam Instructions & OTP Preview Panel */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs text-slate-700 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-orange-600" />
                  {language === 'hi' ? 'महत्वपूर्ण परीक्षा निर्देश:' : 'Key Exam Guidelines (NCVT Rules):'}
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 leading-relaxed text-slate-600">
                  <li>
                    {language === 'hi'
                      ? 'प्रत्येक प्रश्न 2 अंक का है। कोई नकारात्मक अंकन (Negative Marking) नहीं है।'
                      : 'Each question carries 2 marks. There is NO negative marking for wrong answers.'}
                  </li>
                  <li>
                    {language === 'hi'
                      ? 'राज्यव्यापी सक्रियण समय: परीक्षा केवल आधिकारिक निर्धारित समय पर ही शुरू होगी।'
                      : 'Statewide Activation: Terminal unlocks strictly during designated shift window.'}
                  </li>
                  <li>
                    {language === 'hi'
                      ? 'ओटीपी सत्यापन: परीक्षा प्रारंभ करने हेतु 6-अंकीय ओटीपी प्रविष्ट करना अनिवार्य है।'
                      : 'OTP Authentication: 6-digit OTP verification is mandatory for biometric session binding.'}
                  </li>
                  <li>
                    {language === 'hi'
                      ? 'घड़ी समाप्त होते ही परीक्षा स्वतः सबमिट हो जाएगी।'
                      : 'Automatic submission when the countdown timer reaches zero.'}
                  </li>
                </ul>
              </div>

              {/* OTP Demonstration Badge */}
              <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 text-indigo-950 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-indigo-900">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <span>{language === 'hi' ? 'सत्यापित ओटीपी (SMS / Invigilator)' : 'Authenticated 6-Digit OTP'}</span>
                  </span>
                  <span className="font-mono text-xs bg-indigo-200/90 text-indigo-950 px-2 py-0.5 rounded font-black tracking-widest">
                    {activeOtpCode}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-700 leading-snug">
                  {currentScheduledExam.invigilatorName ? `Invigilator: ${currentScheduledExam.invigilatorName}` : 'Sent to student phone & center terminal console.'}
                </p>
              </div>

              <div className="p-2.5 bg-amber-100/60 rounded-lg border border-amber-200 text-amber-900 text-[11px] font-medium">
                {language === 'hi'
                  ? 'निमी (NIMI) क्वेश्चन बैंक आधारित नवीनतम 2024-2025 मानक।'
                  : 'Based on official NIMI CTS question bank standards.'}
              </div>
            </div>
          </div>

          {/* Validation Error Message */}
          {authError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <KeyRound className="w-4 h-4 text-orange-600" />
              <span>Two-tier verification: Center Passcode + Dynamic 6-digit OTP</span>
            </div>

            <button
              id="btn-start-exam-now"
              type="button"
              onClick={handleValidateAndStartExam}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{language === 'hi' ? 'ओटीपी सत्यापित कर परीक्षा शुरू करें' : 'Verify & Launch CBT Exam'}</span>
            </button>
          </div>
        </div>

        {/* 2-TIER OTP AUTHENTICATION MODAL COMPONENT */}
        <OTPVerificationModal
          language={language}
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          onSuccess={() => {
            setShowOtpModal(false);
            startExam();
          }}
          studentName={studentName}
          rollNumber={rollNumber}
          registeredMobile="+91 94150 •••••"
          expectedOtpCode={currentScheduledExam.demoOtpCode || activeOtpCode || '749210'}
          examTitle={language === 'hi' ? currentScheduledExam.title.hi : currentScheduledExam.title.en}
          centerLabCode={currentScheduledExam.passcode}
        />
      </div>
    );
  }

  // 2. EXAM RESULT SCREEN
  if (isSubmitted && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-slate-100 space-y-2">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center font-bold text-2xl ${
              result.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {result.passed ? '✓' : '✕'}
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              result.passed ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
            }`}>
              {result.passed 
                ? (language === 'hi' ? 'उत्तीर्ण (Passed NCVT Threshold)' : 'Qualified / Passed') 
                : (language === 'hi' ? 'पुनः प्रयास करें (Needs Practice)' : 'Needs Improvement')}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {language === 'hi' ? 'सीबीटी परीक्षा परिणाम रिपोर्ट' : 'NCVT CBT Examination Result Card'}
            </h2>
            <p className="text-xs text-slate-500">
              {result.examTitle} • {result.tradeName}
            </p>
          </div>

          {/* Student & Score Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'प्रशिक्षु नाम:' : 'Candidate Name:'}</span>
                <span className="font-bold text-slate-800">{result.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'रोल नंबर:' : 'Roll Number:'}</span>
                <span className="font-mono font-bold text-slate-800">{result.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'संस्थान:' : 'ITI College:'}</span>
                <span className="font-bold text-slate-800">{result.itiName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'hi' ? 'समय लिया:' : 'Time Spent:'}</span>
                <span className="font-bold text-slate-800">{result.timeTakenMinutes} Mins</span>
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-amber-900 font-semibold">{language === 'hi' ? 'कुल प्राप्तांक:' : 'Score Obtained:'}</span>
                <span className="font-extrabold text-amber-950 text-base">
                  {result.score} / {result.totalMarks} ({result.percentage}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{language === 'hi' ? 'कुल प्रश्न:' : 'Total Questions:'}</span>
                <span className="font-bold">{result.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">{language === 'hi' ? 'सही उत्तर:' : 'Correct Answers:'}</span>
                <span className="font-bold text-emerald-700">{result.correct}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-700 font-medium">{language === 'hi' ? 'गलत उत्तर:' : 'Incorrect Answers:'}</span>
                <span className="font-bold text-rose-700">{result.incorrect}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              id="btn-retake-exam"
              type="button"
              onClick={startExam}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {language === 'hi' ? 'पुनः परीक्षा दें' : 'Retake Exam'}
            </button>

            <div className="flex items-center gap-2">
              <button
                id="btn-print-result"
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                {language === 'hi' ? 'प्रिंट / सेव PDF' : 'Print Scorecard'}
              </button>

              {onSyncToMoodle && (
                <button
                  id="btn-push-moodle"
                  type="button"
                  onClick={() => onSyncToMoodle(result)}
                  className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'मूडल में अंक भेजें' : 'Push to Moodle LMS'}
                </button>
              )}

              <button
                id="btn-exit-exam"
                type="button"
                onClick={onExitExam}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                {language === 'hi' ? 'लाइब्रेरी पर लौटें' : 'Back to Library'}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Question Review & Solutions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {language === 'hi' ? 'प्रश्नवार समाधान एवं निमी व्याख्या' : 'Detailed Question Review & Explanations'}
          </h3>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const selectedAns = userAnswers[q.id];
              const isCorrect = selectedAns === q.correctOption;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                    isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Q{idx + 1}. {q.text[language]}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                    }`}>
                      {isCorrect ? 'Correct (+2)' : selectedAns ? 'Incorrect (0)' : 'Skipped (0)'}
                    </span>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt) => {
                      const isOptionSelected = selectedAns === opt.id;
                      const isOptionCorrect = opt.id === q.correctOption;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded border text-xs flex items-center justify-between ${
                            isOptionCorrect
                              ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-950'
                              : isOptionSelected
                              ? 'bg-rose-100 border-rose-300 text-rose-900'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{opt.id}) {opt.text[language]}</span>
                          {isOptionCorrect && <span className="text-[10px] text-emerald-700">✓ Correct</span>}
                          {isOptionSelected && !isOptionCorrect && <span className="text-[10px] text-rose-700">Your choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* NIMI Explanation */}
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200 text-slate-700">
                    <strong className="text-amber-900">
                      {language === 'hi' ? 'निमी मानक व्याख्या:' : 'NIMI Standard Rationale:'}
                    </strong>{' '}
                    {q.explanation[language]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. ACTIVE CBT EXAM INTERFACE (EXACT NCVT CBT LAYOUT)
  return (
    <div className="space-y-4">
      {/* Top Exam Header Status Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm border border-slate-800">
        <div>
          <span className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase block">
            NCVT AITT Computer Based Test Engine
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white">
            {TRADES.find((t) => t.id === selectedTrade)?.name[language]} • Roll: {rollNumber}
          </h2>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-700">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">{language === 'hi' ? 'समय शेष:' : 'Time Left:'}</span>
            <span className="text-base sm:text-lg font-mono font-bold text-white">
              {formatTime(timeRemainingSeconds)}
            </span>
          </div>

          <button
            id="btn-submit-exam-top"
            type="button"
            onClick={handleSubmitExam}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सबमिट करें' : 'Submit Test'}</span>
          </button>
        </div>
      </div>

      {/* Main Examination Grid: 2 Columns (Question Area + Question Palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 Columns: Active Question & Choices */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden min-h-[480px]">
          {/* Question Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-xs">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {activeQuestion?.module}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Marks: +2 / -0
            </span>
          </div>

          {/* Question Content */}
          <div className="p-4 sm:p-6 space-y-5 flex-1">
            {activeQuestion ? (
              <>
                <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                  <span className="text-amber-700 font-bold mr-1">Q.{currentQuestionIndex + 1}</span>
                  {activeQuestion.text[language]}
                </div>

                {/* Optional Bilingual Subtitle if Hindi selected or vice versa */}
                <div className="text-xs text-slate-500 italic">
                  {language === 'hi' ? activeQuestion.text.en : activeQuestion.text.hi}
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {activeQuestion.options.map((opt) => {
                    const isSelected = userAnswers[activeQuestion.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        id={`option-${activeQuestion.id}-${opt.id}`}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 text-xs sm:text-sm ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 text-slate-900 font-semibold'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="flex-1">
                          <p>{opt.text[language]}</p>
                          <p className="text-[11px] text-slate-400 font-normal">
                            {language === 'hi' ? opt.text.en : opt.text.hi}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>

          {/* Action Navigation Footer (Official NCVT CBT Controls) */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                id="btn-mark-review"
                type="button"
                onClick={handleToggleMarkForReview}
                className="px-3 py-2 rounded-lg bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-100 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  {statusMap[activeQuestion?.id || ''] === 'marked_for_review' ||
                  statusMap[activeQuestion?.id || ''] === 'answered_and_marked'
                    ? (language === 'hi' ? 'अनमार्क करें' : 'Unmark Review')
                    : (language === 'hi' ? 'मार्क फॉर रिव्यू' : 'Mark for Review')}
                </span>
              </button>

              <button
                id="btn-clear-response"
                type="button"
                onClick={handleClearResponse}
                className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200 font-semibold transition-colors"
              >
                {language === 'hi' ? 'उत्तर हटाएं' : 'Clear Response'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-prev-question"
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
              </button>

              <button
                id="btn-next-question"
                type="button"
                onClick={() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    navigateToQuestion(currentQuestionIndex + 1);
                  } else {
                    handleSubmitExam();
                  }
                }}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              >
                <span>
                  {currentQuestionIndex < questions.length - 1
                    ? (language === 'hi' ? 'सहेजें और अगला' : 'Save & Next')
                    : (language === 'hi' ? 'फाइनल सबमिट' : 'Final Submit')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Question Palette Legend & Grid */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
            {language === 'hi' ? 'प्रश्न पैलेट (Question Palette)' : 'Question Palette'}
          </h3>

          {/* Legend Counters */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                {countStatus('answered')}
              </span>
              <span>{language === 'hi' ? 'उत्तर दिया' : 'Answered'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold">
                {countStatus('not_answered')}
              </span>
              <span>{language === 'hi' ? 'उत्तर नहीं दिया' : 'Not Answered'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">
                {countStatus('marked_for_review') + countStatus('answered_and_marked')}
              </span>
              <span>{language === 'hi' ? 'रिव्यू हेतु' : 'Marked'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold">
                {countStatus('not_visited')}
              </span>
              <span>{language === 'hi' ? 'देखा नहीं' : 'Not Visited'}</span>
            </div>
          </div>

          {/* Palette Numbers Grid */}
          <div className="grid grid-cols-5 gap-2 pt-2 max-h-64 overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const status = statusMap[q.id];
              const isCurrent = idx === currentQuestionIndex;

              let btnClass = 'bg-slate-100 text-slate-700 border-slate-200';
              if (status === 'answered') {
                btnClass = 'bg-emerald-600 text-white border-emerald-700 font-bold';
              } else if (status === 'not_answered') {
                btnClass = 'bg-rose-500 text-white border-rose-600 font-bold';
              } else if (status === 'marked_for_review') {
                btnClass = 'bg-purple-600 text-white border-purple-700 font-bold';
              } else if (status === 'answered_and_marked') {
                btnClass = 'bg-purple-700 text-white border-purple-900 font-bold ring-2 ring-emerald-400';
              }

              return (
                <button
                  key={q.id}
                  id={`palette-btn-${idx + 1}`}
                  type="button"
                  onClick={() => navigateToQuestion(idx)}
                  className={`w-full aspect-square rounded-lg text-xs flex items-center justify-center transition-all border ${btnClass} ${
                    isCurrent ? 'ring-2 ring-amber-400 ring-offset-1 scale-105' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Emergency Submit Button */}
          <div className="pt-3 border-t border-slate-100">
            <button
              id="btn-emergency-submit"
              type="button"
              onClick={handleSubmitExam}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all text-center"
            >
              {language === 'hi' ? 'परीक्षा समाप्त एवं सबमिट करें' : 'Finish & Submit Test'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
