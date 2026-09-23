import React, { useState } from 'react';
import { Language, ITIBatch, ITILabSession, ITIInstitute } from '../types';
import { UP_ITI_INSTITUTES, SAMPLE_ITI_BATCHES, SAMPLE_LAB_SESSIONS, SAMPLE_TRAINEE_ACCOUNTS, TRADES, STATE_SCHEDULED_EXAMS } from '../data';
import {
  School,
  Users,
  Monitor,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Search,
  Clock,
  UserCheck,
  Plus,
  Zap,
  KeyRound,
  ShieldCheck,
  Timer,
  Lock,
} from 'lucide-react';

interface ITIAdminPortalProps {
  language: Language;
  onLaunchPracticeTest: (tradeId: string) => void;
  onNavigateToTab: (tab: 'library' | 'cbt' | 'moodle' | 'hostinger') => void;
}

export const ITIAdminPortal: React.FC<ITIAdminPortalProps> = ({
  language,
  onLaunchPracticeTest,
  onNavigateToTab,
}) => {
  const [selectedItiCode, setSelectedItiCode] = useState<string>('ITI-0101');
  const [activeTab, setActiveTab] = useState<'batches' | 'labs' | 'trainees'>('batches');
  const [searchTrainee, setSearchTrainee] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const currentIti: ITIInstitute =
    UP_ITI_INSTITUTES.find((i) => i.code === selectedItiCode) || UP_ITI_INSTITUTES[0];

  const [batches] = useState<ITIBatch[]>(SAMPLE_ITI_BATCHES);
  const [labSessions, setLabSessions] = useState<ITILabSession[]>(SAMPLE_LAB_SESSIONS);
  const [showAddLabModal, setShowAddLabModal] = useState(false);

  // New Lab Slot Form State
  const [newLabName, setNewLabName] = useState('Computer Lab 2');
  const [newLabPCs, setNewLabPCs] = useState('40');
  const [newLabTrade, setNewLabTrade] = useState('Electrician');
  const [newLabShift, setNewLabShift] = useState<ITILabSession['shift']>('Morning (09:30 - 11:30)');
  const [newLabInvigilator, setNewLabInvigilator] = useState('Er. Alok Verma');

  const filteredTrainees = SAMPLE_TRAINEE_ACCOUNTS.filter(
    (t) =>
      t.fullName.toLowerCase().includes(searchTrainee.toLowerCase()) ||
      t.rollNumber.toLowerCase().includes(searchTrainee.toLowerCase())
  );

  const handleAddLabSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: ITILabSession = {
      id: `lab-${Date.now()}`,
      itiCode: selectedItiCode,
      labName: newLabName,
      totalPCs: parseInt(newLabPCs, 10) || 30,
      activeTrade: newLabTrade,
      shift: newLabShift,
      scheduledDate: 'Upcoming Shift',
      status: 'Ready',
      invigilator: newLabInvigilator,
    };
    setLabSessions([...labSessions, newSession]);
    setShowAddLabModal(false);
    setNotification(
      language === 'hi'
        ? `नया सीबीटी कंप्यूटर लैब स्लॉट (${newLabName}) सफलतापूर्वक निर्धारित हो गया!`
        : `New CBT Lab slot (${newLabName}) scheduled successfully!`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownloadOfflineLabZip = () => {
    const offlineManifest = JSON.stringify(
      {
        institute: currentIti,
        batches: batches,
        exportDate: new Date().toISOString(),
        offlinePackageVersion: '2026.1-UP-ITI',
        cbtTestServerConfig: {
          localHostPort: 8080,
          fallbackMode: 'Local-LAN-Cache',
        },
      },
      null,
      2
    );
    const blob = new Blob([offlineManifest], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UP_ITI_Local_LAN_Exam_Package_${currentIti.code}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotification(
      language === 'hi'
        ? `${currentIti.name} हेतु स्थानीय कंप्यूटर लैब सीबीटी ऑफलाइन पैकेज डाउनलोड हो गया।`
        : `Local LAN CBT Package downloaded for ${currentIti.name}.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* ITI Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-900 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" />
                {language === 'hi' ? 'आईटीआई संस्थान प्रबंधन पोर्टल' : 'ITI Institute Admin Desk'}
              </span>
              <span className="text-xs text-emerald-200/80 bg-white/10 px-2.5 py-1 rounded-full">
                Code: {currentIti.code} • {currentIti.type}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {currentIti.name}, {currentIti.district}
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {language === 'hi'
                ? 'ट्रेनी बैच प्रबंधन, कंप्यूटर लैब स्लॉट निर्धारण, उपस्थिति, सीबीटी रोल लिस्ट एवं स्थानीय प्रदर्शन सुधार।'
                : 'Trainee batch management, CBT computer lab slot scheduling, attendance, roll rosters, and remedial performance analytics.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Institute Dropdown Selector */}
            <div className="bg-white/10 p-1.5 rounded-xl border border-white/20">
              <label className="block text-[10px] text-emerald-200 font-semibold px-2 mb-0.5">
                {language === 'hi' ? 'संस्थान चुनें' : 'Select ITI Institute'}
              </label>
              <select
                id="select-iti-institution"
                value={selectedItiCode}
                onChange={(e) => setSelectedItiCode(e.target.value)}
                className="bg-slate-900 text-white text-xs font-bold rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-hidden"
              >
                {UP_ITI_INSTITUTES.map((inst) => (
                  <option key={inst.code} value={inst.code}>
                    {inst.name} ({inst.district})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleDownloadOfflineLabZip}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'hi' ? 'ऑफलाइन लैब पैकेज' : 'Offline Lab Package'}</span>
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Institutional KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>{language === 'hi' ? 'सक्रिय ट्रेनी बैच' : 'Active Trade Batches'}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{batches.length} Batches</div>
          <p className="text-[11px] text-slate-500 mt-1">200 Enrolled Trainees</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>{language === 'hi' ? 'सीबीटी कंप्यूटर टर्मिनल्स' : 'CBT Lab Terminals'}</span>
            <Monitor className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">130 PCs</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">3 Certified CBT Labs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>{language === 'hi' ? 'संस्थान औसत सीबीटी अंक' : 'Avg Mock Test Score'}</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">84.7%</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Top 10% in District</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>{language === 'hi' ? 'एआईटीटी प्रवेश पत्र स्थिति' : 'Admit Card Readiness'}</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">192 / 200</div>
          <p className="text-[11px] text-slate-500 mt-1">96% Biometrically Verified</p>
        </div>
      </div>

      {/* Remedial Class Alert for Institute Instructors */}
      <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 flex items-start gap-3 text-xs">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900 text-sm">
            {language === 'hi'
              ? 'अनुदेशक उपचारात्मक कक्षा सूचना (Remedial Advisory)'
              : 'Instructor Remedial Class Advisory'}
          </h4>
          <p className="text-amber-800 leading-relaxed">
            {language === 'hi'
              ? 'इलेक्ट्रीशियन बैच 2024-26 के 28% छात्रों ने हालिया सीबीटी मॉक में "डीसी मोटर्स एवं वाइंडिंग" में कम अंक प्राप्त किए हैं। कृपया डिजिटल लाइब्रेरी से निमी प्रैक्टिकल वीडियो शीट 14 का संदर्भ लेकर विशेष अभ्यास सत्र आयोजित करें।'
              : '28% of Electrician Batch 2024-26 scored below benchmark in the "DC Motors & Winding" module in recent mock tests. Recommended to conduct a hands-on remedial session using NIMI Practical Sheet 14.'}
          </p>
        </div>
      </div>

      {/* ITI Center Superintendent: Statewide CBT Exam Activation & OTP Terminal Console */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {language === 'hi'
                  ? 'निदेशालय राज्यव्यापी सीबीटी परीक्षा सक्रियण एवं ओटीपी नोडल कंसोल'
                  : 'Directorate Statewide CBT Activation & Invigilator OTP Console'}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'लखनऊ सर्वर द्वारा अधिकृत सक्रियण समय और केंद्र अधीक्षकों के लिए लाइव 6-अंकीय ओटीपी कोड।'
                : 'Central Lucknow Server sync: Real-time time-window status and dynamic OTP codes for center authentication.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-800 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>State Timed Window: Active</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATE_SCHEDULED_EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    exam.isActivatedNow
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  ● {exam.isActivatedNow ? 'ACTIVE STATEWIDE' : 'SCHEDULED'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {exam.tradeId.toUpperCase()} • {exam.durationMinutes} mins
                </span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                  {language === 'hi' ? exam.title.hi : exam.title.en}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{exam.shiftTimeSlot || '09:30 AM - 11:30 AM'}</span>
                  <span>• {exam.dateRange}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Lab Passcode:</span>
                  <span className="font-mono font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {exam.passcode}
                  </span>
                </div>

                {exam.requiresOtpAuth && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-orange-400" />
                      Candidate OTP:
                    </span>
                    <span className="font-mono font-black tracking-widest text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                      {exam.demoOtpCode || '749210'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation tabs for ITI portal */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('batches')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'batches' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'hi' ? 'ट्रेड बैच रोस्टर' : 'Trade Batches & Rosters'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('labs')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'labs' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>{language === 'hi' ? 'कंप्यूटर लैब व सीबीटी स्लॉट' : 'Lab Scheduling & Slots'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trainees')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'trainees' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{language === 'hi' ? 'प्रशिक्षार्थी सत्यापन सूची' : 'Trainee Verification List'}</span>
        </button>
      </div>

      {/* TAB 1: Batches Roster */}
      {activeTab === 'batches' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'संस्थान के सक्रिय ट्रेड बैच' : 'Active Trade Batches at this ITI'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentIti.name} • Session 2024-2026 & 2025-2026
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('library')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>{language === 'hi' ? 'पाठ्यक्रम संसाधन देखें' : 'View Trade Curriculum'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Batch {b.section} • Sem {b.semester}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{b.batchYear}</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 capitalize">{b.tradeId}</h4>
                  <p className="text-[11px] text-slate-500">Instructor: {b.instructorName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Trainees</span>
                    <span className="font-bold text-slate-800">{b.totalTrainees} Students</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">CBT Avg Score</span>
                    <span className="font-bold text-emerald-700">{b.averageScorePct}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Eligible for CBT: <span className="font-bold text-slate-800">{b.cbtEligibleCount}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onLaunchPracticeTest(b.tradeId)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Start Test →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Labs & Slot Scheduling */}
      {activeTab === 'labs' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'कंप्यूटर लैब एवं सीबीटी परीक्षा स्लॉट अनुसूची' : 'CBT Lab Shift Schedules'}
              </h3>
              <p className="text-xs text-slate-500">
                Manage shifts, terminal allocation, and invigilator duties
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddLabModal(!showAddLabModal)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'नया स्लॉट जोड़ें' : 'Add Shift Slot'}</span>
            </button>
          </div>

          {showAddLabModal && (
            <form onSubmit={handleAddLabSlot} className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-3 text-xs">
              <div className="font-bold text-emerald-900">
                {language === 'hi' ? 'नया सीबीटी शिफ्ट स्लॉट विन्यास' : 'Schedule New CBT Shift Slot'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lab Name</label>
                  <input
                    type="text"
                    value={newLabName}
                    onChange={(e) => setNewLabName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Terminals (PCs)</label>
                  <input
                    type="number"
                    value={newLabPCs}
                    onChange={(e) => setNewLabPCs(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Trade</label>
                  <input
                    type="text"
                    value={newLabTrade}
                    onChange={(e) => setNewLabTrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shift Time</label>
                  <select
                    value={newLabShift}
                    onChange={(e) => setNewLabShift(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Morning (09:30 - 11:30)">Morning (09:30 - 11:30)</option>
                    <option value="Afternoon (12:30 - 02:30)">Afternoon (12:30 - 02:30)</option>
                    <option value="Evening (03:30 - 05:30)">Evening (03:30 - 05:30)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <input
                  type="text"
                  value={newLabInvigilator}
                  onChange={(e) => setNewLabInvigilator(e.target.value)}
                  placeholder="Invigilator Name"
                  className="p-2 border border-slate-300 rounded-lg text-xs bg-white w-64"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLabModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                  >
                    Save Slot
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {labSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Monitor className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{session.labName}</h4>
                    <p className="text-slate-500 font-medium">
                      {session.activeTrade} • <span className="text-emerald-700 font-bold">{session.totalPCs} Functional PCs</span>
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Invigilators: {session.invigilator}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {session.shift}
                    </span>
                    <span className="text-[11px] text-slate-500">{session.scheduledDate}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Trainees Roster */}
      {activeTab === 'trainees' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'प्रशिक्षार्थी नामांकन एवं सीबीटी तत्परता सूची' : 'Trainee Enrollment & CBT Readiness'}
              </h3>
              <p className="text-xs text-slate-500">
                Verified against State SCVT/NCVT Portal Database
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTrainee}
                onChange={(e) => setSearchTrainee(e.target.value)}
                placeholder="Search trainee name or roll..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 w-56"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Roll Number</th>
                  <th className="py-2.5 px-3">Trainee Name</th>
                  <th className="py-2.5 px-3">Trade</th>
                  <th className="py-2.5 px-3 text-center">Semester</th>
                  <th className="py-2.5 px-3 text-center">Tests Taken</th>
                  <th className="py-2.5 px-3 text-center">Avg Score</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTrainees.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{t.rollNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      <div>{t.fullName}</div>
                      <div className="text-[10px] text-slate-400">S/o {t.fatherName}</div>
                    </td>
                    <td className="py-2.5 px-3 capitalize font-semibold text-emerald-800">{t.tradeId}</td>
                    <td className="py-2.5 px-3 text-center font-mono">Sem {t.semester}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{t.mockTestsTaken}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {t.averageScore}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
