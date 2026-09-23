import React, { useState } from 'react';
import { Language, ScheduledStateExam, ITIInstitute } from '../types';
import { TRADES, STATE_SCHEDULED_EXAMS } from '../data';
import {
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  Plus,
  Play,
  Pause,
  AlertTriangle,
  Lock,
  KeyRound,
  ShieldCheck,
  Search,
  Filter,
  Check,
  Trash2,
  Edit3,
  Users,
  Timer,
  ExternalLink,
  ChevronRight,
  Radio,
  FileCheck,
  Award,
} from 'lucide-react';

interface ExamSchedulerProps {
  language: Language;
  onLaunchExamPreview?: (tradeId: string) => void;
  examsList?: ScheduledStateExam[];
  onUpdateExamsList?: (exams: ScheduledStateExam[]) => void;
}

// Comprehensive registry of representative UP ITIs across divisions
export const STATE_ITI_BRANCHES = [
  { code: 'ITI-0101', name: 'Govt. ITI Aliganj (Nodal Center)', district: 'Lucknow', division: 'Lucknow', terminalCount: 160, superintendent: 'Er. R. K. Srivastava' },
  { code: 'ITI-0102', name: 'Govt. ITI Charbagh', district: 'Lucknow', division: 'Lucknow', terminalCount: 120, superintendent: 'Dr. Sudhir Saxena' },
  { code: 'ITI-0103', name: 'Govt. Women ITI Rae Bareli Road', district: 'Lucknow', division: 'Lucknow', terminalCount: 90, superintendent: 'Smt. Pratibha Misra' },
  { code: 'ITI-0201', name: 'Govt. ITI Pandu Nagar', district: 'Kanpur Nagar', division: 'Kanpur', terminalCount: 180, superintendent: 'Er. Arvind Tripathi' },
  { code: 'ITI-0202', name: 'Govt. ITI Ghatampur', district: 'Kanpur Nagar', division: 'Kanpur', terminalCount: 85, superintendent: 'Shri Dinesh Yadav' },
  { code: 'ITI-0301', name: 'Govt. ITI Karaundi', district: 'Varanasi', division: 'Varanasi', terminalCount: 150, superintendent: 'Er. Shailesh Upadhyay' },
  { code: 'ITI-0302', name: 'Govt. ITI Chandauli', district: 'Varanasi', division: 'Varanasi', terminalCount: 80, superintendent: 'Er. Manoj Tiwari' },
  { code: 'ITI-0401', name: 'Govt. ITI Naini', district: 'Prayagraj', division: 'Prayagraj', terminalCount: 140, superintendent: 'Er. Vijay Narayan' },
  { code: 'ITI-0402', name: 'Govt. ITI Phulpur', district: 'Prayagraj', division: 'Prayagraj', terminalCount: 75, superintendent: 'Shri Anand Shukla' },
  { code: 'ITI-0501', name: 'Govt. ITI Charphakhar', district: 'Gorakhpur', division: 'Gorakhpur', terminalCount: 130, superintendent: 'Er. Anand Swaroop' },
  { code: 'ITI-0601', name: 'Govt. ITI Balkeshwar', district: 'Agra', division: 'Agra', terminalCount: 140, superintendent: 'Er. Mukesh Agrawal' },
  { code: 'ITI-0701', name: 'Govt. ITI Saket', district: 'Meerut', division: 'Meerut', terminalCount: 135, superintendent: 'Er. Pankaj Rastogi' },
  { code: 'ITI-0801', name: 'Govt. ITI CB Ganj', district: 'Bareilly', division: 'Bareilly', terminalCount: 110, superintendent: 'Er. Tariq Ahmad' },
  { code: 'ITI-0901', name: 'Govt. ITI Sipri Bazar', district: 'Jhansi', division: 'Jhansi', terminalCount: 95, superintendent: 'Er. Harish Sen' },
  { code: 'ITI-1001', name: 'Govt. ITI Beniganj', district: 'Ayodhya', division: 'Ayodhya', terminalCount: 100, superintendent: 'Er. Deep Narayan' },
];

export const ExamScheduler: React.FC<ExamSchedulerProps> = ({
  language,
  onLaunchExamPreview,
  examsList: initialExamsList,
  onUpdateExamsList,
}) => {
  const [exams, setExams] = useState<ScheduledStateExam[]>(
    initialExamsList || STATE_SCHEDULED_EXAMS
  );

  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [filterTrade, setFilterTrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'Live' | 'Scheduled' | 'Completed'>('all');
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Form State
  const [titleEn, setTitleEn] = useState<string>('');
  const [titleHi, setTitleHi] = useState<string>('');
  const [tradeId, setTradeId] = useState<string>('electrician');
  const [examType, setExamType] = useState<string>('Statewide Pre-AITT Mock');
  const [startDate, setStartDate] = useState<string>('2026-03-15');
  const [startTime, setStartTime] = useState<string>('09:30');
  const [endDate, setEndDate] = useState<string>('2026-03-18');
  const [endTime, setEndTime] = useState<string>('17:30');
  const [shiftTimeSlot, setShiftTimeSlot] = useState<string>('Shift 1: 09:30 AM - 11:30 AM & Shift 2: 02:00 PM - 04:00 PM');
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [totalQuestions, setTotalQuestions] = useState<number>(75);
  const [totalMarks, setTotalMarks] = useState<number>(150);
  const [invigilatorName, setInvigilatorName] = useState<string>('State Directorate Exam Cell');
  const [requiresOtp, setRequiresOtp] = useState<boolean>(true);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    'ITI-0101',
    'ITI-0102',
    'ITI-0201',
    'ITI-0301',
    'ITI-0401',
  ]);
  const [selectAllBranches, setSelectAllBranches] = useState<boolean>(false);
  const [branchFilterDistrict, setBranchFilterDistrict] = useState<string>('All');

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleToggleBranch = (code: string) => {
    if (selectedBranches.includes(code)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== code));
    } else {
      setSelectedBranches([...selectedBranches, code]);
    }
  };

  const handleToggleAllBranches = () => {
    if (selectAllBranches) {
      setSelectedBranches([]);
      setSelectAllBranches(false);
    } else {
      setSelectedBranches(STATE_ITI_BRANCHES.map((b) => b.code));
      setSelectAllBranches(true);
    }
  };

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn && !titleHi) {
      alert(language === 'hi' ? 'कृपया परीक्षा का नाम दर्ज करें।' : 'Please enter an exam title.');
      return;
    }

    if (selectedBranches.length === 0) {
      alert(language === 'hi' ? 'कृपया कम से कम एक आईटीआई शाखा चुनें।' : 'Please assign at least one ITI branch.');
      return;
    }

    // Generate random 6-digit OTP code & passcode
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const generatedPasscode = `UP-CBT-${Math.floor(1000 + Math.random() * 9000)}`;

    const assignedBranchObjects = STATE_ITI_BRANCHES.filter((b) =>
      selectedBranches.includes(b.code)
    ).map((b) => ({
      code: b.code,
      name: b.name,
      district: b.district,
      terminalCount: b.terminalCount,
      supervisorName: b.superintendent,
      status: 'Ready' as const,
    }));

    const totalTerminals = assignedBranchObjects.reduce((sum, b) => sum + b.terminalCount, 0);

    const newExam: ScheduledStateExam = {
      id: `exam-up-${Date.now()}`,
      title: {
        en: titleEn || titleHi,
        hi: titleHi || titleEn,
      },
      tradeId,
      examType,
      dateRange: `${startDate} to ${endDate}`,
      durationMinutes: Number(durationMinutes),
      totalQuestions: Number(totalQuestions),
      totalMarks: Number(totalMarks),
      targetITIs: `${assignedBranchObjects.length} Assigned ITI Branches (${totalTerminals} Terminals)`,
      passcode: generatedPasscode,
      status: 'Scheduled',
      registeredCount: assignedBranchObjects.length * 120, // Estimated registration
      activationStartTime: `${startDate}T${startTime}:00`,
      activationEndTime: `${endDate}T${endTime}:00`,
      shiftTimeSlot,
      isActivatedNow: false,
      requiresOtpAuth: requiresOtp,
      demoOtpCode: generatedOtp,
      invigilatorName: invigilatorName || 'State Center Superintendent',
      otpCooldownSeconds: 60,
      assignedBranches: assignedBranchObjects,
    };

    const updated = [newExam, ...exams];
    setExams(updated);
    if (onUpdateExamsList) onUpdateExamsList(updated);

    // Reset Form
    setIsCreatingNew(false);
    setTitleEn('');
    setTitleHi('');
    triggerToast(
      language === 'hi'
        ? `नई परीक्षा विंडो सफलतापूर्वक निर्धारित हुई! ${assignedBranchObjects.length} आईटीआई शाखाएं संबद्ध की गईं।`
        : `New exam window scheduled successfully with ${assignedBranchObjects.length} assigned ITI branches!`
    );
  };

  const handleToggleExamStatus = (examId: string) => {
    const updated = exams.map((ex) => {
      if (ex.id === examId) {
        const nextStatus = ex.status === 'Live' ? 'Scheduled' : 'Live';
        return {
          ...ex,
          status: nextStatus as 'Live' | 'Scheduled',
          isActivatedNow: nextStatus === 'Live',
        };
      }
      return ex;
    });
    setExams(updated);
    if (onUpdateExamsList) onUpdateExamsList(updated);

    const target = updated.find((e) => e.id === examId);
    triggerToast(
      language === 'hi'
        ? `परीक्षा '${target?.title.hi}' की स्थिति अब ${target?.status === 'Live' ? 'लाइव (सक्रिय)' : 'शेड्यूल (प्रतीक्षारत)'} है!`
        : `Exam '${target?.title.en}' status updated to ${target?.status}!`,
      'info'
    );
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm(language === 'hi' ? 'क्या आप इस परीक्षा विंडो को हटाना चाहते हैं?' : 'Are you sure you want to remove this scheduled exam?')) {
      const updated = exams.filter((e) => e.id !== examId);
      setExams(updated);
      if (onUpdateExamsList) onUpdateExamsList(updated);
      triggerToast(
        language === 'hi' ? 'परीक्षा विंडो सूची से हटा दी गई।' : 'Scheduled exam removed from calendar.'
      );
    }
  };

  // Filtered list
  const filteredExams = exams.filter((e) => {
    const matchesTrade = filterTrade === 'all' || e.tradeId === filterTrade;
    const matchesStatus = activeStatusFilter === 'all' || e.status === activeStatusFilter;
    const matchesSearch =
      e.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.title.hi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.targetITIs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrade && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackToast && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs transition-all ${
            feedbackToast.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-indigo-50 border-indigo-300 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 border border-indigo-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {language === 'hi' ? 'परीक्षा समय-सारिणी एवं केंद्र आवंटन' : 'Exam Window Scheduler & ITI Allocation'}
            </span>
            <span className="text-xs text-indigo-200/80 bg-white/10 px-2.5 py-1 rounded-full font-mono">
              {exams.length} Test Windows Defined
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'hi' ? 'सीबीटी परीक्षा सारिणी विन्यास व आईटीआई केंद्र आवंटन' : 'Statewide CBT Exam Scheduler & Branch Allocations'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            {language === 'hi'
              ? 'परीक्षा की प्रारंभ व समाप्ति तिथि एवं शिफ्ट समय निर्धारित करें और राज्य के विशिष्ट राजकीय/निजी आईटीआई केंद्रों को परीक्षा विंडो से संबद्ध करें।'
              : 'Define test start/end time windows, configure multi-shift slots, and assign specific ITI branches across UP with terminal capacity verification.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>
            {isCreatingNew
              ? language === 'hi' ? 'फॉर्म बंद करें' : 'Close Scheduler'
              : language === 'hi' ? 'नया शेड्यूल बनाएं' : 'Define New Exam Window'}
          </span>
        </button>
      </div>

      {/* NEW EXAM SCHEDULER FORM (COLLAPSIBLE MODAL/DRAWER) */}
      {isCreatingNew && (
        <div className="bg-white rounded-2xl border-2 border-indigo-500/30 p-6 sm:p-7 shadow-lg space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {language === 'hi' ? 'नया सीबीटी परीक्षा समय-विंडो एवं आईटीआई आवंटन' : 'Configure New Exam Window & Branch Assignment'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'hi' ? 'सभी अनिवार्य फ़ील्ड भरें एवं लक्षित आईटीआई शाखाएं चुनें' : 'Fill start/end windows and select participating ITI centers'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateExamSubmit} className="space-y-6">
            {/* Step 1: Exam Basic Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>1.</span>
                <span>{language === 'hi' ? 'परीक्षा शीर्षक एवं ट्रेड विवरण' : 'Exam Details & Target Trade'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'hi' ? 'परीक्षा का नाम (अंग्रेजी में)' : 'Exam Title (English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. All UP ITI Electrician Mid-Term Exam 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'hi' ? 'परीक्षा का नाम (हिंदी में)' : 'Exam Title (Hindi)'}
                  </label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    placeholder="उदा. उत्तर प्रदेश आईटीआई इलेक्ट्रीशियन मध्यावधि परीक्षा 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'hi' ? 'लक्षित ट्रेड' : 'Target Trade'} *
                  </label>
                  <select
                    value={tradeId}
                    onChange={(e) => setTradeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  >
                    {TRADES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name.en} ({t.name.hi})
                      </option>
                    ))}
                    <option value="all-trades">Common (All Trades WCS / Employability Skills)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'hi' ? 'परीक्षा का प्रकार' : 'Exam Category'}
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  >
                    <option value="Statewide Pre-AITT Mock">Statewide Pre-AITT Mock Test</option>
                    <option value="Quarterly SCVT Assessment">Quarterly SCVT State Assessment</option>
                    <option value="Diagnostic Unit Test">Diagnostic / Unit Test</option>
                    <option value="Annual Final CBT">NCVT Annual CBT Exam</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'hi' ? 'अवधि एवं प्रश्न संख्या' : 'Duration & Questions'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      placeholder="Mins"
                      className="px-2.5 py-2 rounded-lg border border-slate-300 text-xs"
                      title="Minutes"
                    />
                    <input
                      type="number"
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                      placeholder="Q Count"
                      className="px-2.5 py-2 rounded-lg border border-slate-300 text-xs"
                      title="Questions"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Time Window Definition (Start/End Date & Time) */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>2.</span>
                <span>{language === 'hi' ? 'परीक्षा प्रारंभ व समाप्ति समय विंडो' : 'Start & End Time Window'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{language === 'hi' ? 'प्रारंभ तिथि' : 'Start Date'} *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{language === 'hi' ? 'प्रारंभ समय (IST)' : 'Start Time'} *</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'hi' ? 'समाप्ति तिथि' : 'End Date'} *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'hi' ? 'समाप्ति समय (IST)' : 'End Time'} *</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'hi' ? 'शिफ्ट स्लॉट विन्यास' : 'Shift Slot Schedule'}
                  </label>
                  <input
                    type="text"
                    value={shiftTimeSlot}
                    onChange={(e) => setShiftTimeSlot(e.target.value)}
                    placeholder="e.g. Shift 1: 09:30 AM - 11:30 AM & Shift 2: 02:00 PM - 04:00 PM"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'hi' ? 'पर्यवेक्षक / नोडल अधिकारी का नाम' : 'Center Superintendent / Invigilator'}
                  </label>
                  <input
                    type="text"
                    value={invigilatorName}
                    onChange={(e) => setInvigilatorName(e.target.value)}
                    placeholder="e.g. Er. R. K. Srivastava (Principal)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Assign Specific ITI Branches */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>3.</span>
                    <span>{language === 'hi' ? 'आईटीआई शाखाएं आवंटित करें' : 'Assign Specific ITI Branches'}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedBranches.length} branches selected • Total PC Capacity:{' '}
                    <strong>
                      {STATE_ITI_BRANCHES.filter((b) => selectedBranches.includes(b.code))
                        .reduce((sum, b) => sum + b.terminalCount, 0)
                        .toLocaleString()}{' '}
                      terminals
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={branchFilterDistrict}
                    onChange={(e) => setBranchFilterDistrict(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-700"
                  >
                    <option value="All">All Divisions (सभी मंडल)</option>
                    <option value="Lucknow">Lucknow Division</option>
                    <option value="Kanpur">Kanpur Division</option>
                    <option value="Varanasi">Varanasi Division</option>
                    <option value="Prayagraj">Prayagraj Division</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleToggleAllBranches}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {selectAllBranches ? 'Deselect All' : 'Select All 15 Centers'}
                  </button>
                </div>
              </div>

              {/* Grid of ITI Branches to Pick */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {STATE_ITI_BRANCHES.filter(
                  (b) => branchFilterDistrict === 'All' || b.division === branchFilterDistrict
                ).map((branch) => {
                  const isChecked = selectedBranches.includes(branch.code);
                  return (
                    <div
                      key={branch.code}
                      onClick={() => handleToggleBranch(branch.code)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-300 shadow-2xs text-indigo-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Building2 className={`w-3.5 h-3.5 ${isChecked ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className="font-bold">{branch.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {branch.district} ({branch.division} Div) • <span className="font-mono text-slate-700">{branch.code}</span>
                        </p>
                        <p className="text-[10px] text-indigo-700 font-semibold font-mono">
                          {branch.terminalCount} PC Terminals
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: OTP and Security Verification */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'उम्मीदवारों के लिए दो-चरणीय सुरक्षा OTP प्रमाणीकरण स्वतः सक्षम रहेगा।'
                    : 'Candidate 2-Factor OTP verification window will be automatically enforced during this test.'}
                </span>
              </div>
              <label className="flex items-center gap-2 font-bold cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={requiresOtp}
                  onChange={(e) => setRequiresOtp(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Mandatory OTP Gateway</span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'परीक्षा समय-सारिणी जारी करें' : 'Publish Scheduled Exam Window'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Buttons */}
          {(['all', 'Live', 'Scheduled', 'Completed'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeStatusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all'
                ? language === 'hi' ? 'सभी परीक्षाएं' : 'All Windows'
                : status}
            </button>
          ))}

          {/* Trade Filter */}
          <select
            value={filterTrade}
            onChange={(e) => setFilterTrade(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="all">All Trades (सभी ट्रेड्स)</option>
            {TRADES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name.en}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test name or ITI..."
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-hidden w-full sm:w-60 bg-slate-50"
          />
        </div>
      </div>

      {/* SCHEDULED EXAM CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => {
          const isLive = exam.status === 'Live';
          const assignedBranchesList = exam.assignedBranches || [
            { code: 'ITI-0101', name: 'Govt. ITI Aliganj (Nodal)', district: 'Lucknow', terminalCount: 160, supervisorName: 'Er. R. K. Srivastava', status: 'Ready' as const },
            { code: 'ITI-0201', name: 'Govt. ITI Pandu Nagar', district: 'Kanpur', terminalCount: 180, supervisorName: 'Er. Arvind Tripathi', status: 'Ready' as const },
            { code: 'ITI-0301', name: 'Govt. ITI Karaundi', district: 'Varanasi', terminalCount: 150, supervisorName: 'Er. Shailesh Upadhyay', status: 'Ready' as const },
          ];

          const totalAssignedTerminals = assignedBranchesList.reduce(
            (sum, b) => sum + b.terminalCount,
            0
          );

          return (
            <div
              key={exam.id}
              className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all hover:shadow-md flex flex-col justify-between space-y-4 relative ${
                isLive ? 'border-orange-300 ring-1 ring-orange-200' : 'border-slate-200'
              }`}
            >
              {/* Top Badge & Live Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isLive
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    }`}
                  >
                    {isLive && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                    <span>{exam.status === 'Live' ? 'Active Exam Window' : 'Scheduled Window'}</span>
                  </span>

                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {exam.examType}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {language === 'hi' ? exam.title.hi : exam.title.en}
                </h3>
              </div>

              {/* Time Window Information */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{language === 'hi' ? 'विंडो अवधि:' : 'Date Window:'}</span>
                  </span>
                  <span className="font-bold text-slate-900">{exam.dateRange}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'hi' ? 'शिफ्ट स्लॉट:' : 'Shift Slots:'}</span>
                  </span>
                  <span className="font-bold text-slate-900 truncate max-w-[160px]" title={exam.shiftTimeSlot}>
                    {exam.shiftTimeSlot ? exam.shiftTimeSlot.split('&')[0] : '09:30 AM - 11:30 AM'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Timer className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exam.durationMinutes} Mins • {exam.totalQuestions} Questions</span>
                  </span>
                  <span className="font-bold text-indigo-700 font-mono">{exam.totalMarks} Marks</span>
                </div>
              </div>

              {/* Assigned ITI Branches Pill & Capacity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Assigned ITI Branches:</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {totalAssignedTerminals} Terminals
                  </span>
                </div>

                {/* Display branch chips */}
                <div className="flex flex-wrap gap-1.5">
                  {assignedBranchesList.slice(0, 3).map((branch) => (
                    <span
                      key={branch.code}
                      className="text-[10px] bg-indigo-50/80 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200 font-medium truncate max-w-[140px]"
                      title={`${branch.name} (${branch.district})`}
                    >
                      {branch.name.split(' ')[1] || branch.district}
                    </span>
                  ))}
                  {assignedBranchesList.length > 3 && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      +{assignedBranchesList.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Security & Passcode Pill */}
              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>OTP: <strong className="font-mono">{exam.demoOtpCode || '749210'}</strong></span>
                </div>
                <span className="font-mono text-[11px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  {exam.passcode}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleExamStatus(exam.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isLive
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isLive ? 'Mark Scheduled' : 'Activate Live'}</span>
                </button>

                <div className="flex items-center gap-1">
                  {onLaunchExamPreview && (
                    <button
                      type="button"
                      onClick={() => onLaunchExamPreview(exam.tradeId)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                      title="Launch CBT Preview"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition-colors"
                    title="Delete Exam Window"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
