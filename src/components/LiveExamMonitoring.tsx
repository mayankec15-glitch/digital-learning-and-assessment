import React, { useState, useEffect } from 'react';
import { Language, ScheduledStateExam } from '../types';
import { STATE_SCHEDULED_EXAMS, TRADES } from '../data';
import {
  Activity,
  Users,
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Search,
  Radio,
  CheckCircle2,
  TrendingUp,
  Server,
  Filter,
  Maximize2,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface LiveExamMonitoringProps {
  language: Language;
  onLaunchExamPreview?: (tradeId: string) => void;
}

interface DistrictLiveLoad {
  district: string;
  division: string;
  activeTrainees: number;
  terminalCapacity: number;
  activeITIs: number;
  loadPct: number;
  anomalyCount: number;
  avgSubmissionMins: number;
}

interface TimeEngagementPoint {
  time: string;
  activeConcurrent: number;
  completedSubmissions: number;
  pendingUnlocks: number;
}

export const LiveExamMonitoring: React.FC<LiveExamMonitoringProps> = ({
  language,
  onLaunchExamPreview,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(STATE_SCHEDULED_EXAMS[0].id);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [lastHeartbeat, setLastHeartbeat] = useState<string>(new Date().toLocaleTimeString('en-IN'));
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('All');
  const [districtSearch, setDistrictSearch] = useState<string>('');

  const currentExam = STATE_SCHEDULED_EXAMS.find((e) => e.id === selectedExamId) || STATE_SCHEDULED_EXAMS[0];

  // Base state figures
  const [realtimeData, setRealtimeData] = useState({
    activeCandidates: 24890,
    totalCompleted: 11420,
    activeCentersCount: 312,
    syncRatePct: 99.8,
    averageSpeedQPM: 1.4,
    otpVerificationsPending: 420,
  });

  // Time engagement timeline data
  const [timelineData, setTimelineData] = useState<TimeEngagementPoint[]>([
    { time: '09:30 AM', activeConcurrent: 4200, completedSubmissions: 0, pendingUnlocks: 1800 },
    { time: '09:45 AM', activeConcurrent: 11800, completedSubmissions: 120, pendingUnlocks: 920 },
    { time: '10:00 AM', activeConcurrent: 19400, completedSubmissions: 680, pendingUnlocks: 550 },
    { time: '10:15 AM', activeConcurrent: 23600, completedSubmissions: 2340, pendingUnlocks: 480 },
    { time: '10:30 AM', activeConcurrent: 24890, completedSubmissions: 5120, pendingUnlocks: 420 },
    { time: '10:45 AM', activeConcurrent: 24100, completedSubmissions: 8940, pendingUnlocks: 310 },
    { time: '11:00 AM', activeConcurrent: 21300, completedSubmissions: 11420, pendingUnlocks: 190 },
  ]);

  // District distribution
  const [districtLoads, setDistrictLoads] = useState<DistrictLiveLoad[]>([
    { district: 'Lucknow', division: 'Lucknow', activeTrainees: 1840, terminalCapacity: 2100, activeITIs: 12, loadPct: 87.6, anomalyCount: 0, avgSubmissionMins: 48 },
    { district: 'Kanpur Nagar', division: 'Kanpur', activeTrainees: 1720, terminalCapacity: 1950, activeITIs: 10, loadPct: 88.2, anomalyCount: 1, avgSubmissionMins: 52 },
    { district: 'Varanasi', division: 'Varanasi', activeTrainees: 1540, terminalCapacity: 1700, activeITIs: 9, loadPct: 90.5, anomalyCount: 0, avgSubmissionMins: 46 },
    { district: 'Prayagraj', division: 'Prayagraj', activeTrainees: 1490, terminalCapacity: 1680, activeITIs: 8, loadPct: 88.6, anomalyCount: 0, avgSubmissionMins: 50 },
    { district: 'Gorakhpur', division: 'Gorakhpur', activeTrainees: 1380, terminalCapacity: 1600, activeITIs: 9, loadPct: 86.2, anomalyCount: 2, avgSubmissionMins: 54 },
    { district: 'Agra', division: 'Agra', activeTrainees: 1290, terminalCapacity: 1500, activeITIs: 8, loadPct: 86.0, anomalyCount: 0, avgSubmissionMins: 47 },
    { district: 'Meerut', division: 'Meerut', activeTrainees: 1210, terminalCapacity: 1420, activeITIs: 7, loadPct: 85.2, anomalyCount: 1, avgSubmissionMins: 49 },
    { district: 'Bareilly', division: 'Bareilly', activeTrainees: 1140, terminalCapacity: 1350, activeITIs: 7, loadPct: 84.4, anomalyCount: 0, avgSubmissionMins: 51 },
    { district: 'Aligarh', division: 'Aligarh', activeTrainees: 980, terminalCapacity: 1200, activeITIs: 6, loadPct: 81.6, anomalyCount: 0, avgSubmissionMins: 48 },
    { district: 'Moradabad', division: 'Moradabad', activeTrainees: 940, terminalCapacity: 1150, activeITIs: 6, loadPct: 81.7, anomalyCount: 0, avgSubmissionMins: 53 },
    { district: 'Ayodhya', division: 'Ayodhya', activeTrainees: 910, terminalCapacity: 1100, activeITIs: 5, loadPct: 82.7, anomalyCount: 0, avgSubmissionMins: 49 },
    { district: 'Jhansi', division: 'Jhansi', activeTrainees: 820, terminalCapacity: 1050, activeITIs: 5, loadPct: 78.0, anomalyCount: 0, avgSubmissionMins: 50 },
  ]);

  // Trade-wise distribution
  const tradeDistribution = [
    { name: 'Electrician', active: 10450, color: '#f59e0b' },
    { name: 'Fitter', active: 7820, color: '#3b82f6' },
    { name: 'COPA', active: 4120, color: '#10b981' },
    { name: 'Welder', active: 2500, color: '#8b5cf6' },
  ];

  // Shift & Server Load Status
  const serverClusters = [
    { cluster: 'UP-DTE Primary Cluster (Lucknow NIC)', status: 'Healthy', load: '64%', ping: '18ms' },
    { cluster: 'SCVT Nodal Secondary Gateway (Kanpur)', status: 'Healthy', load: '58%', ping: '24ms' },
    { cluster: 'AITT Moodle Sync Relay (Hostinger Cloud)', status: 'Active Sync', load: '49%', ping: '32ms' },
  ];

  // Simulated live pulse effect every 4 seconds
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setLastHeartbeat(new Date().toLocaleTimeString('en-IN'));
      // Slight fluctuation to simulate live incoming answers
      setRealtimeData((prev) => {
        const delta = Math.floor(Math.random() * 21) - 8;
        const newActive = Math.max(1000, prev.activeCandidates + delta);
        const newDone = prev.totalCompleted + Math.floor(Math.random() * 5);
        return {
          ...prev,
          activeCandidates: newActive,
          totalCompleted: newDone,
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Filtered district list
  const filteredDistricts = districtLoads.filter((d) => {
    const matchesDiv = selectedDivisionFilter === 'All' || d.division === selectedDivisionFilter;
    const matchesQuery = d.district.toLowerCase().includes(districtSearch.toLowerCase());
    return matchesDiv && matchesQuery;
  });

  const totalCapacity = districtLoads.reduce((sum, d) => sum + d.terminalCapacity, 0);
  const totalActive = districtLoads.reduce((sum, d) => sum + d.activeTrainees, 0);
  const stateOccupancyRate = ((totalActive / totalCapacity) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Live Exam Top Monitor Header */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 border border-indigo-900/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                {language === 'hi' ? 'सक्रिय सीबीटी टेलीमेट्री' : 'Live CBT Telemetry Stream'}
              </span>
              <span className="text-xs text-indigo-200/80 bg-white/10 px-2.5 py-1 rounded-full font-mono">
                Heartbeat: {lastHeartbeat} IST
              </span>
              <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-full font-mono">
                {currentExam.shiftTimeSlot || 'Shift 1: 09:30 AM - 11:30 AM'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{language === 'hi' ? 'राज्यव्यापी लाइव सीबीटी निगरानी डैशबोर्ड' : 'Statewide Live Exam Monitoring Console'}</span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'उत्तर प्रदेश के सभी 75 जनपदों एवं 315 राजकीय आईटीआई में चल रही ऑनलाइन सीबीटी परीक्षा में परीक्षार्थियों की वास्तविक समय उपस्थिति, समवर्ती सहभागिता एवं सुरक्षा ऑडिट।'
                : 'Real-time telemetry measuring candidate concurrency, terminal lock status, district load, and submission throughput across all UP ITI centers.'}
            </p>
          </div>

          {/* Test Selector and Stream Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">
                {language === 'hi' ? 'निगरानी हेतु परीक्षा चुनें:' : 'Select Active Exam:'}
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="bg-slate-900 text-white text-xs font-bold rounded-lg px-3 py-2 border border-slate-700 focus:outline-hidden"
              >
                {STATE_SCHEDULED_EXAMS.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {language === 'hi' ? exam.title.hi : exam.title.en} ({exam.targetITIs.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLiveStreaming
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isLiveStreaming ? (language === 'hi' ? 'पॉज़ करें' : 'Pause Live') : (language === 'hi' ? 'शुरू करें' : 'Resume')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLastHeartbeat(new Date().toLocaleTimeString('en-IN'));
                  setRealtimeData((p) => ({
                    ...p,
                    activeCandidates: p.activeCandidates + Math.floor(Math.random() * 10),
                  }));
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Refresh Stream Now"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Real-Time Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Concurrent Candidates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'समवर्ती सक्रिय परीक्षार्थी' : 'Active Concurrent'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              {realtimeData.activeCandidates.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'वर्तमान में लाइव सीबीटी स्क्रीन पर' : 'Active right now across 75 districts'}
          </p>
        </div>

        {/* Card 2: Completed Submissions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'पूर्ण परीक्षा प्रतियां' : 'Completed Tests'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              {realtimeData.totalCompleted.toLocaleString()}
            </span>
            <span className="text-xs text-indigo-600 font-semibold font-mono">
              / {currentExam.registeredCount.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'मूडल ग्रेडबुक में तुरंत सिंक' : 'Synchronized to Moodle Gradebook'}
          </p>
        </div>

        {/* Card 3: Terminal Occupancy & Capacity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'लैब टर्मिनल अधिभोग' : 'Lab Occupancy Rate'}
            </span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              {stateOccupancyRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({totalActive.toLocaleString()} / {totalCapacity.toLocaleString()} PCs)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? '315 राजकीय आईटीआई कंप्यूटर लैब्स' : 'Across 315 Government ITI Center Labs'}
          </p>
        </div>

        {/* Card 4: OTP Verification & Lab Passcode Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'ओटीपी सुरक्षा गेटवे' : 'OTP 2FA Security'}
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight font-mono">
              99.8%
            </span>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {realtimeData.otpVerificationsPending} in queue
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'hi' ? 'द्वि-स्तरीय उम्मीदवार प्रमाणीकरण चालू' : 'Active Candidate SIM & Invigilator Key'}
          </p>
        </div>
      </div>

      {/* Main Charts Row: Recharts Real-Time Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Time Series Area Chart of Concurrent Engagement */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  {language === 'hi'
                    ? 'वास्तविक समय समवर्ती परीक्षार्थी सहभागिता ग्राफ'
                    : 'Real-Time Trainee Concurrency & Submissions Timeline'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'परीक्षा सत्र के दौरान प्रत्येक 15 मिनट के अंतराल में परीक्षार्थियों का लोड'
                  : '15-minute interval metrics: Active test takers vs submitted test papers'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-orange-700 font-bold">
                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                Concurrent Test Takers
              </span>
              <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                Completed
              </span>
            </div>
          </div>

          {/* Recharts Area Graph */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="activeConcurrent"
                  name="Active Concurrent Trainees"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorActive)"
                />
                <Area
                  type="monotone"
                  dataKey="completedSubmissions"
                  name="Completed Submissions"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDone)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-500 text-[10px] uppercase block font-semibold">Peak Load Point</span>
              <strong className="text-slate-900 font-mono">10:30 AM (24,890)</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-500 text-[10px] uppercase block font-semibold">Throughput Pace</span>
              <strong className="text-slate-900 font-mono">~340 Submissions/min</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-500 text-[10px] uppercase block font-semibold">Terminal Health</span>
              <strong className="text-emerald-700 font-mono font-bold">100% Online</strong>
            </div>
          </div>
        </div>

        {/* Chart 2: Trade Breakdown Pie Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {language === 'hi' ? 'ट्रेड अनुसार समवर्ती सहभागिता' : 'Trade-wise Live Distribution'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi' ? 'शीर्ष इंजीनियरिंग व गैर-इंजीनियरिंग ट्रेड' : 'Top CTS Engineering trades active'}
            </p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="active"
                >
                  {tradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {tradeDistribution.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="font-semibold text-slate-700">{t.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {t.active.toLocaleString()} ({((t.active / realtimeData.activeCandidates) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Live Telemetry & Terminal Occupancy Bar Chart */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {language === 'hi'
                  ? 'जनपदवार सक्रिय परीक्षार्थी एवं कंप्यूटर लैब अधिभोग'
                  : 'District-wise Live Candidates & Terminal Capacity (Top Districts)'}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'प्रत्येक जनपद में सक्रिय परीक्षार्थी बनाम आवंटित कंप्यूटर क्षमता'
                : 'Comparing active concurrent test takers against available ITI terminal seats'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="Search District..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500 w-36 sm:w-48 bg-slate-50"
              />
            </div>

            <select
              value={selectedDivisionFilter}
              onChange={(e) => setSelectedDivisionFilter(e.target.value)}
              className="bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-slate-200 focus:outline-hidden"
            >
              <option value="All">All Divisions (सभी मंडल)</option>
              <option value="Lucknow">Lucknow Division</option>
              <option value="Kanpur">Kanpur Division</option>
              <option value="Varanasi">Varanasi Division</option>
              <option value="Meerut">Meerut Division</option>
              <option value="Agra">Agra Division</option>
            </select>
          </div>
        </div>

        {/* Recharts Bar Chart for District Load */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredDistricts.slice(0, 10)} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="district"
                tick={{ fontSize: 11, fill: '#475569' }}
                stroke="#cbd5e1"
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
              <Bar dataKey="activeTrainees" name="Active Trainees (वर्तमान परीक्षार्थी)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="terminalCapacity" name="Total PC Terminal Capacity (क्षमता)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* District Detail Table Matrix */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">District (जनपद)</th>
                <th className="p-3">Division (मंडल)</th>
                <th className="p-3 text-right">Active ITI Labs</th>
                <th className="p-3 text-right">Active Trainees</th>
                <th className="p-3 text-right">PC Capacity</th>
                <th className="p-3 text-right">Occupancy %</th>
                <th className="p-3 text-right">Avg Duration</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDistricts.map((item) => (
                <tr key={item.district} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{item.district}</td>
                  <td className="p-3 text-slate-600">{item.division}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{item.activeITIs} ITIs</td>
                  <td className="p-3 text-right font-mono font-bold text-amber-700">
                    {item.activeTrainees.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-500">
                    {item.terminalCapacity.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-mono font-bold text-slate-800">{item.loadPct}%</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-auto mt-1">
                      <div
                        className={`h-full rounded-full ${
                          item.loadPct > 88 ? 'bg-orange-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.loadPct}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono text-slate-600">{item.avgSubmissionMins}m</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Stream
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statewide State Server Clusters & Security Telemetry */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">
              {language === 'hi' ? 'राज्य स्तरीय सीबीटी सर्वर क्लस्टर स्वास्थ्य' : 'Statewide CBT Server Clusters & Moodle Relay'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> High Availability Cluster Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {serverClusters.map((cluster) => (
            <div key={cluster.cluster} className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 truncate">{cluster.cluster}</span>
                <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                  {cluster.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>CPU/Memory Load: <strong className="text-white">{cluster.load}</strong></span>
                <span>Latency: <strong className="text-emerald-400">{cluster.ping}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
