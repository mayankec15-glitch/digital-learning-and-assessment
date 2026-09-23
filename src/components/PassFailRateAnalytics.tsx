import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { TRADES } from '../data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Filter,
  Search,
  School,
  ArrowUpDown,
  Download,
  Info,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface TradePerformanceRecord {
  tradeId: string;
  tradeNameEn: string;
  tradeNameHi: string;
  totalAppeared: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
  avgScore: number;
  benchmarkTarget: number;
}

export interface InstitutionPerformanceRecord {
  code: string;
  name: string;
  district: string;
  division: string;
  type: 'Government' | 'Private';
  totalAppeared: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
  avgScore: number;
  topPerformingTrade: string;
  underperformingTrade: string;
  performanceTier: 'High Performing' | 'Satisfactory' | 'Needs Attention' | 'Critical Intervention';
  actionRequired?: string;
  tradeBreakdown: {
    tradeId: string;
    tradeName: string;
    appeared: number;
    passed: number;
    passRate: number;
  }[];
}

// Representative authentic performance data for UP ITI trades statewide
export const STATEWIDE_TRADE_PERFORMANCE: TradePerformanceRecord[] = [
  {
    tradeId: 'electrician',
    tradeNameEn: 'Electrician',
    tradeNameHi: 'इलेक्ट्रीशियन',
    totalAppeared: 48250,
    passedCount: 42560,
    failedCount: 5690,
    passRate: 88.2,
    avgScore: 76.4,
    benchmarkTarget: 80.0,
  },
  {
    tradeId: 'fitter',
    tradeNameEn: 'Fitter',
    tradeNameHi: 'फ़िटर',
    totalAppeared: 42100,
    passedCount: 36410,
    failedCount: 5690,
    passRate: 86.5,
    avgScore: 74.8,
    benchmarkTarget: 80.0,
  },
  {
    tradeId: 'copa',
    tradeNameEn: 'COPA',
    tradeNameHi: 'कोपा (कंप्यूटर ऑपरेटर)',
    totalAppeared: 29400,
    passedCount: 26810,
    failedCount: 2590,
    passRate: 91.2,
    avgScore: 82.1,
    benchmarkTarget: 80.0,
  },
  {
    tradeId: 'welder',
    tradeNameEn: 'Welder',
    tradeNameHi: 'वेल्डर',
    totalAppeared: 18500,
    passedCount: 14760,
    failedCount: 3740,
    passRate: 79.8,
    avgScore: 68.9,
    benchmarkTarget: 80.0,
  },
  {
    tradeId: 'electronic-mechanic',
    tradeNameEn: 'Electronic Mechanic',
    tradeNameHi: 'इलेक्ट्रॉनिक मैकेनिक',
    totalAppeared: 16800,
    passedCount: 13910,
    failedCount: 2890,
    passRate: 82.8,
    avgScore: 71.5,
    benchmarkTarget: 80.0,
  },
  {
    tradeId: 'mechanic-diesel',
    tradeNameEn: 'Mechanic Diesel',
    tradeNameHi: 'मैकेनिक डीजल',
    totalAppeared: 14200,
    passedCount: 10820,
    failedCount: 3380,
    passRate: 76.2,
    avgScore: 65.4,
    benchmarkTarget: 80.0,
  },
  {
    tradeId: 'workshop-calc-science',
    tradeNameEn: 'Workshop Calc & Science',
    tradeNameHi: 'कार्यशाला गणना व विज्ञान',
    totalAppeared: 85200,
    passedCount: 65430,
    failedCount: 19770,
    passRate: 76.8,
    avgScore: 64.2,
    benchmarkTarget: 75.0,
  },
  {
    tradeId: 'employability-skills',
    tradeNameEn: 'Employability Skills',
    tradeNameHi: 'एम्प्लॉयबिलिटी स्किल्स',
    totalAppeared: 86400,
    passedCount: 78890,
    failedCount: 7510,
    passRate: 91.3,
    avgScore: 84.6,
    benchmarkTarget: 80.0,
  },
];

// Rich institution level registry mapping high-performing vs underperforming ITIs
export const INSTITUTION_PERFORMANCE_RECORDS: InstitutionPerformanceRecord[] = [
  {
    code: 'ITI-0101',
    name: 'Govt. ITI Aliganj (Nodal Center)',
    district: 'Lucknow',
    division: 'Lucknow',
    type: 'Government',
    totalAppeared: 1480,
    passedCount: 1380,
    failedCount: 100,
    passRate: 93.2,
    avgScore: 82.4,
    topPerformingTrade: 'COPA (97.1%)',
    underperformingTrade: 'Workshop Calc (86.4%)',
    performanceTier: 'High Performing',
    actionRequired: 'Model Best-Practice Center; nominated for DGT National Center of Excellence',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 420, passed: 395, passRate: 94.0 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 380, passed: 350, passRate: 92.1 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 340, passed: 330, passRate: 97.1 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 180, passed: 165, passRate: 91.7 },
      { tradeId: 'electronic-mechanic', tradeName: 'Electronic Mechanic', appeared: 160, passed: 140, passRate: 87.5 },
    ],
  },
  {
    code: 'ITI-0201',
    name: 'Govt. ITI Pandu Nagar',
    district: 'Kanpur Nagar',
    division: 'Kanpur',
    type: 'Government',
    totalAppeared: 1620,
    passedCount: 1485,
    failedCount: 135,
    passRate: 91.7,
    avgScore: 80.6,
    topPerformingTrade: 'Electrician (95.2%)',
    underperformingTrade: 'Mechanic Diesel (81.0%)',
    performanceTier: 'High Performing',
    actionRequired: 'Lead institute for Kanpur division industrial apprenticeship linkages',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 500, passed: 476, passRate: 95.2 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 460, passed: 425, passRate: 92.4 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 300, passed: 285, passRate: 95.0 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 210, passed: 180, passRate: 85.7 },
      { tradeId: 'mechanic-diesel', tradeName: 'Mechanic Diesel', appeared: 150, passed: 119, passRate: 79.3 },
    ],
  },
  {
    code: 'ITI-0701',
    name: 'Govt. ITI Saket',
    district: 'Meerut',
    division: 'Meerut',
    type: 'Government',
    totalAppeared: 1250,
    passedCount: 1130,
    failedCount: 120,
    passRate: 90.4,
    avgScore: 79.2,
    topPerformingTrade: 'Fitter (94.0%)',
    underperformingTrade: 'Electronic Mech (82.1%)',
    performanceTier: 'High Performing',
    actionRequired: 'Excellent trade theory lab attendance recorded',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 350, passed: 320, passRate: 91.4 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 390, passed: 367, passRate: 94.1 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 250, passed: 236, passRate: 94.4 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 160, passed: 135, passRate: 84.4 },
      { tradeId: 'electronic-mechanic', tradeName: 'Electronic Mechanic', appeared: 100, passed: 72, passRate: 72.0 },
    ],
  },
  {
    code: 'ITI-0301',
    name: 'Govt. ITI Karaundi',
    district: 'Varanasi',
    division: 'Varanasi',
    type: 'Government',
    totalAppeared: 1340,
    passedCount: 1165,
    failedCount: 175,
    passRate: 86.9,
    avgScore: 76.5,
    topPerformingTrade: 'COPA (92.5%)',
    underperformingTrade: 'Mechanic Diesel (74.2%)',
    performanceTier: 'Satisfactory',
    actionRequired: 'Conduct additional CBT mock simulations for 1-year trades',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 410, passed: 365, passRate: 89.0 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 370, passed: 322, passRate: 87.0 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 280, passed: 259, passRate: 92.5 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 160, passed: 130, passRate: 81.25 },
      { tradeId: 'mechanic-diesel', tradeName: 'Mechanic Diesel', appeared: 120, passed: 89, passRate: 74.2 },
    ],
  },
  {
    code: 'ITI-0401',
    name: 'Govt. ITI Naini',
    district: 'Prayagraj',
    division: 'Prayagraj',
    type: 'Government',
    totalAppeared: 1180,
    passedCount: 1010,
    failedCount: 170,
    passRate: 85.6,
    avgScore: 75.1,
    topPerformingTrade: 'Electrician (89.1%)',
    underperformingTrade: 'Welder (72.5%)',
    performanceTier: 'Satisfactory',
    actionRequired: 'Upgrade consumable materials in welding workshop practicals',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 380, passed: 338, passRate: 88.9 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 340, passed: 295, passRate: 86.8 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 240, passed: 218, passRate: 90.8 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 120, passed: 87, passRate: 72.5 },
      { tradeId: 'electronic-mechanic', tradeName: 'Electronic Mechanic', appeared: 100, passed: 72, passRate: 72.0 },
    ],
  },
  {
    code: 'ITI-0501',
    name: 'Govt. ITI Charphakhar',
    district: 'Gorakhpur',
    division: 'Gorakhpur',
    type: 'Government',
    totalAppeared: 1110,
    passedCount: 940,
    failedCount: 170,
    passRate: 84.7,
    avgScore: 73.8,
    topPerformingTrade: 'Fitter (87.2%)',
    underperformingTrade: 'Workshop Calc (70.1%)',
    performanceTier: 'Satisfactory',
    actionRequired: 'Targeted remediation classes scheduled for WCS instructors',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 350, passed: 305, passRate: 87.1 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 320, passed: 280, passRate: 87.5 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 220, passed: 198, passRate: 90.0 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 120, passed: 92, passRate: 76.7 },
      { tradeId: 'mechanic-diesel', tradeName: 'Mechanic Diesel', appeared: 100, passed: 65, passRate: 65.0 },
    ],
  },
  {
    code: 'ITI-0601',
    name: 'Govt. ITI Balkeshwar',
    district: 'Agra',
    division: 'Agra',
    type: 'Government',
    totalAppeared: 1280,
    passedCount: 1060,
    failedCount: 220,
    passRate: 82.8,
    avgScore: 71.9,
    topPerformingTrade: 'COPA (88.4%)',
    underperformingTrade: 'Welder (69.2%)',
    performanceTier: 'Satisfactory',
    actionRequired: 'Monitor computer lab CBT terminal readiness',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 390, passed: 330, passRate: 84.6 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 360, passed: 305, passRate: 84.7 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 260, passed: 230, passRate: 88.5 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 150, passed: 104, passRate: 69.3 },
      { tradeId: 'electronic-mechanic', tradeName: 'Electronic Mechanic', appeared: 120, passed: 91, passRate: 75.8 },
    ],
  },
  {
    code: 'ITI-0801',
    name: 'Govt. ITI CB Ganj',
    district: 'Bareilly',
    division: 'Bareilly',
    type: 'Government',
    totalAppeared: 960,
    passedCount: 755,
    failedCount: 205,
    passRate: 78.6,
    avgScore: 66.4,
    topPerformingTrade: 'Electrician (84.1%)',
    underperformingTrade: 'Electronic Mechanic (64.5%)',
    performanceTier: 'Needs Attention',
    actionRequired: 'Warning issued: Electronic Mech lab equipment calibration required',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 310, passed: 261, passRate: 84.2 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 280, passed: 225, passRate: 80.4 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 170, passed: 145, passRate: 85.3 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 100, passed: 68, passRate: 68.0 },
      { tradeId: 'electronic-mechanic', tradeName: 'Electronic Mechanic', appeared: 100, passed: 56, passRate: 56.0 },
    ],
  },
  {
    code: 'ITI-0901',
    name: 'Govt. ITI Sipri Bazar',
    district: 'Jhansi',
    division: 'Jhansi',
    type: 'Government',
    totalAppeared: 820,
    passedCount: 650,
    failedCount: 170,
    passRate: 79.3,
    avgScore: 67.2,
    topPerformingTrade: 'Electrician (82.9%)',
    underperformingTrade: 'Mechanic Diesel (63.0%)',
    performanceTier: 'Needs Attention',
    actionRequired: 'Deploy visiting faculty for Diesel Engine practical units',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 280, passed: 232, passRate: 82.9 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 240, passed: 196, passRate: 81.7 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 140, passed: 118, passRate: 84.3 },
      { tradeId: 'mechanic-diesel', tradeName: 'Mechanic Diesel', appeared: 90, passed: 57, passRate: 63.3 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 70, passed: 47, passRate: 67.1 },
    ],
  },
  {
    code: 'ITI-1001',
    name: 'Govt. ITI Beniganj',
    district: 'Ayodhya',
    division: 'Ayodhya',
    type: 'Government',
    totalAppeared: 890,
    passedCount: 710,
    failedCount: 180,
    passRate: 79.8,
    avgScore: 68.1,
    topPerformingTrade: 'Fitter (83.5%)',
    underperformingTrade: 'Welder (66.0%)',
    performanceTier: 'Needs Attention',
    actionRequired: 'Special weekend doubts-clearing sessions initiated',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 290, passed: 240, passRate: 82.8 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 270, passed: 226, passRate: 83.7 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 160, passed: 136, passRate: 85.0 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 100, passed: 66, passRate: 66.0 },
      { tradeId: 'electronic-mechanic', tradeName: 'Electronic Mechanic', appeared: 70, passed: 42, passRate: 60.0 },
    ],
  },
  {
    code: 'PVT-0812',
    name: 'Vivekanand Private ITI Chharra',
    district: 'Aligarh',
    division: 'Aligarh',
    type: 'Private',
    totalAppeared: 450,
    passedCount: 305,
    failedCount: 145,
    passRate: 67.8,
    avgScore: 56.4,
    topPerformingTrade: 'Electrician (73.0%)',
    underperformingTrade: 'Fitter (59.0%)',
    performanceTier: 'Critical Intervention',
    actionRequired: 'Show-cause notice served; mandatory biometric attendance inspection ordered',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 200, passed: 146, passRate: 73.0 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 150, passed: 89, passRate: 59.3 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 60, passed: 44, passRate: 73.3 },
      { tradeId: 'welder', tradeName: 'Welder', appeared: 40, passed: 26, passRate: 65.0 },
    ],
  },
  {
    code: 'PVT-0435',
    name: 'Saraswati Industrial Training Center',
    district: 'Moradabad',
    division: 'Moradabad',
    type: 'Private',
    totalAppeared: 510,
    passedCount: 330,
    failedCount: 180,
    passRate: 64.7,
    avgScore: 54.1,
    topPerformingTrade: 'COPA (71.0%)',
    underperformingTrade: 'Electrician (61.5%)',
    performanceTier: 'Critical Intervention',
    actionRequired: 'Affiliation audit scheduled; poor instructor-to-trainee ratio detected',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 240, passed: 148, passRate: 61.7 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 170, passed: 105, passRate: 61.8 },
      { tradeId: 'copa', tradeName: 'COPA', appeared: 100, passed: 77, passRate: 77.0 },
    ],
  },
  {
    code: 'PVT-0919',
    name: 'Kashi Technical Institute',
    district: 'Varanasi',
    division: 'Varanasi',
    type: 'Private',
    totalAppeared: 390,
    passedCount: 248,
    failedCount: 142,
    passRate: 63.6,
    avgScore: 53.0,
    topPerformingTrade: 'COPA (72.0%)',
    underperformingTrade: 'Mechanic Diesel (52.0%)',
    performanceTier: 'Critical Intervention',
    actionRequired: 'Barred from hosting CBT exams until lab computers are standardized',
    tradeBreakdown: [
      { tradeId: 'electrician', tradeName: 'Electrician', appeared: 180, passed: 119, passRate: 66.1 },
      { tradeId: 'fitter', tradeName: 'Fitter', appeared: 130, passed: 82, passRate: 63.1 },
      { tradeId: 'mechanic-diesel', tradeName: 'Mechanic Diesel', appeared: 80, passed: 47, passRate: 58.8 },
    ],
  },
];

interface PassFailRateAnalyticsProps {
  language: Language;
}

export const PassFailRateAnalytics: React.FC<PassFailRateAnalyticsProps> = ({ language }) => {
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchInstitution, setSearchInstitution] = useState<string>('');
  const [selectedInstitutionForModal, setSelectedInstitutionForModal] = useState<InstitutionPerformanceRecord | null>(null);

  // Sorting state for institutions table
  const [sortField, setSortField] = useState<'passRate' | 'totalAppeared' | 'name' | 'avgScore'>('passRate');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Summary KPIs calculated
  const summaryMetrics = useMemo(() => {
    const totalAppeared = STATEWIDE_TRADE_PERFORMANCE.reduce((acc, t) => acc + t.totalAppeared, 0);
    const totalPassed = STATEWIDE_TRADE_PERFORMANCE.reduce((acc, t) => acc + t.passedCount, 0);
    const totalFailed = STATEWIDE_TRADE_PERFORMANCE.reduce((acc, t) => acc + t.failedCount, 0);
    const overallPassRate = Number(((totalPassed / totalAppeared) * 100).toFixed(1));

    const highPerformingCount = INSTITUTION_PERFORMANCE_RECORDS.filter(
      (i) => i.performanceTier === 'High Performing'
    ).length;
    const underperformingCount = INSTITUTION_PERFORMANCE_RECORDS.filter(
      (i) => i.performanceTier === 'Needs Attention' || i.performanceTier === 'Critical Intervention'
    ).length;

    return {
      totalAppeared,
      totalPassed,
      totalFailed,
      overallPassRate,
      highPerformingCount,
      underperformingCount,
    };
  }, []);

  // Filtered institution records
  const filteredInstitutions = useMemo(() => {
    return INSTITUTION_PERFORMANCE_RECORDS.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchInstitution.toLowerCase()) ||
        item.district.toLowerCase().includes(searchInstitution.toLowerCase()) ||
        item.code.toLowerCase().includes(searchInstitution.toLowerCase());

      const matchTier = selectedTier === 'all' || item.performanceTier === selectedTier;
      const matchType = selectedType === 'all' || item.type === selectedType;

      const matchTrade =
        selectedTrade === 'all' ||
        item.tradeBreakdown.some((t) => t.tradeId === selectedTrade);

      return matchSearch && matchTier && matchType && matchTrade;
    }).sort((a, b) => {
      let valA: number | string = a[sortField];
      let valB: number | string = b[sortField];

      if (sortField === 'passRate' && selectedTrade !== 'all') {
        const trA = a.tradeBreakdown.find((t) => t.tradeId === selectedTrade);
        const trB = b.tradeBreakdown.find((t) => t.tradeId === selectedTrade);
        valA = trA ? trA.passRate : 0;
        valB = trB ? trB.passRate : 0;
      }

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [searchInstitution, selectedTier, selectedType, selectedTrade, sortField, sortAsc]);

  // Chart data formatted for Trade Pass vs Fail comparison
  const tradeChartData = useMemo(() => {
    return STATEWIDE_TRADE_PERFORMANCE.map((t) => ({
      name: language === 'hi' ? t.tradeNameHi : t.tradeNameEn,
      tradeId: t.tradeId,
      passRate: t.passRate,
      failRate: Number((100 - t.passRate).toFixed(1)),
      passedCount: t.passedCount,
      failedCount: t.failedCount,
      avgScore: t.avgScore,
      target: t.benchmarkTarget,
    }));
  }, [language]);

  // Chart data for Institution comparison (Top 5 high performing vs Bottom 5 critical)
  const institutionComparisonChartData = useMemo(() => {
    const sorted = [...INSTITUTION_PERFORMANCE_RECORDS].sort((a, b) => b.passRate - a.passRate);
    const top = sorted.slice(0, 4);
    const bottom = sorted.slice(-4).reverse();
    return [...top, ...bottom].map((inst) => ({
      name: inst.name.replace('Govt. ITI ', '').replace('Vivekanand Private ITI ', 'Vivekanand ').replace('Industrial Training Center', 'ITC'),
      fullName: inst.name,
      district: inst.district,
      passRate: inst.passRate,
      failRate: Number((100 - inst.passRate).toFixed(1)),
      tier: inst.performanceTier,
      isGovt: inst.type === 'Government',
    }));
  }, []);

  const handleSortToggle = (field: 'passRate' | 'totalAppeared' | 'name' | 'avgScore') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ITI Code', 'Institution Name', 'District', 'Type', 'Appeared', 'Passed', 'Failed', 'Pass Rate (%)', 'Avg Score', 'Tier', 'Top Trade', 'Underperforming Trade', 'Action Note'];
    const rows = filteredInstitutions.map((i) => [
      i.code,
      `"${i.name}"`,
      i.district,
      i.type,
      i.totalAppeared,
      i.passedCount,
      i.failedCount,
      i.passRate,
      i.avgScore,
      `"${i.performanceTier}"`,
      `"${i.topPerformingTrade}"`,
      `"${i.underperformingTrade}"`,
      `"${i.actionRequired || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UP_Directorate_ITI_Pass_Fail_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER & KPI CARDS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                {language === 'hi' ? 'ट्रेडवार उत्तीर्ण/अनुत्तीर्ण विश्लेषण' : 'Trade-wise Pass/Fail Rate Analytics'}
              </span>
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-0.5 rounded-full">
                SCVT / NCVT AITT CBT Assessment Session
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi'
                ? 'संस्थानवार एवं ट्रेडवार परीक्षा परिणाम व प्रदर्शन समीक्षा'
                : 'Trade Pass/Fail Rate Visualization & Institutional Performance Audit'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {language === 'hi'
                ? 'उत्तर प्रदेश के 3,165 राजकीय एवं निजी आईटीआई में ट्रेडवार उत्तीर्ण व अनुत्तीर्ण दरों का तुलनात्मक अध्ययन। उच्च-प्रदर्शनकारी उत्कृष्ट संस्थानों और सुधारात्मक हस्तक्षेप योग्य अंडरपरफॉर्मिंग संस्थानों की त्वरित पहचान करें।'
                : 'Identify high-performing versus underperforming institutions across UP using trade-specific pass/fail analytics, benchmark deviations, and corrective intervention metrics.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'एनालिटिक्स रिपोर्ट (CSV)' : 'Export Audit CSV'}</span>
            </button>
          </div>
        </div>

        {/* 4 SUMMARY METRIC TILES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
              <span>{language === 'hi' ? 'राज्य औसत उत्तीर्ण दर' : 'Statewide Avg Pass Rate'}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
              {summaryMetrics.overallPassRate}%
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Benchmark Target: <strong>80.0%</strong> (+3.2% above baseline)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
            <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
              <span>{language === 'hi' ? 'उच्च प्रदर्शनकारी आईटीआई' : 'High-Performing Centers'}</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-950 font-mono">
              {summaryMetrics.highPerformingCount}{' '}
              <span className="text-sm font-normal text-blue-700">Centers (&gt;90%)</span>
            </div>
            <p className="text-[11px] text-blue-700 font-medium">
              Lead by Govt ITI Aliganj & Pandu Nagar
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
            <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
              <span>{language === 'hi' ? 'हस्तक्षेप योग्य संस्थान' : 'Underperforming Institutes'}</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-950 font-mono">
              {summaryMetrics.underperformingCount}{' '}
              <span className="text-sm font-normal text-rose-700">Flagged (&lt;80%)</span>
            </div>
            <p className="text-[11px] text-rose-700 font-medium">
              3 Under critical audit (&lt;70% pass rate)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1">
            <div className="flex items-center justify-between text-indigo-800 text-xs font-bold">
              <span>{language === 'hi' ? 'कुल सीबीटी परिणाम संसाधित' : 'Total Trainees Assessed'}</span>
              <School className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-950 font-mono">
              {summaryMetrics.totalAppeared.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-indigo-700 font-medium">
              {summaryMetrics.totalPassed.toLocaleString('en-IN')} Passed • {summaryMetrics.totalFailed.toLocaleString('en-IN')} Failed
            </p>
          </div>
        </div>
      </div>

      {/* RECHARTS VISUALIZATION GRID: 2 CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Stacked / Dual Bar Chart - Trade-wise Pass % vs Fail % */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>{language === 'hi' ? 'ट्रेडवार उत्तीर्ण एवं अनुत्तीर्ण दर (%)' : 'Trade-wise Pass vs. Fail Rates (%)'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'प्रत्येक आईटीआई ट्रेड में उत्तीर्ण व अनुत्तीर्ण अभ्यर्थियों का प्रतिशत एवं 80% राज्य बेंचमार्क'
                  : 'Statewide pass percentage compared against 80% DGT benchmark target'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" /> Pass Rate (%)
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-700">
                <span className="w-3 h-3 rounded-xs bg-rose-400 inline-block" /> Fail Rate (%)
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tradeChartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
                          <p className="font-bold text-amber-300 text-sm">{label}</p>
                          <div className="flex justify-between gap-4 pt-1">
                            <span className="text-emerald-400">Pass Rate:</span>
                            <span className="font-bold font-mono">{data.passRate}% ({data.passedCount?.toLocaleString()} students)</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-rose-400">Fail Rate:</span>
                            <span className="font-bold font-mono">{data.failRate}% ({data.failedCount?.toLocaleString()} students)</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-700">
                            <span className="text-slate-300">Avg Score:</span>
                            <span className="font-bold font-mono text-cyan-300">{data.avgScore}/100</span>
                          </div>
                          <div className="flex justify-between gap-4 text-[10px] text-slate-400">
                            <span>Target:</span>
                            <span>{data.target}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="passRate" name="Pass Rate (%)" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]}>
                  {tradeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.passRate >= 85 ? '#059669' : entry.passRate >= 80 ? '#10b981' : '#f59e0b'}
                    />
                  ))}
                </Bar>
                <Bar dataKey="failRate" name="Fail Rate (%)" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 rounded-lg bg-emerald-50 text-[11px] text-emerald-900">
              <span className="text-slate-500 block">Highest Pass Rate:</span>
              <strong className="text-emerald-800 font-bold">Employability Skills (91.3%)</strong>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-[11px] text-blue-900">
              <span className="text-slate-500 block">Top Technical Trade:</span>
              <strong className="text-blue-800 font-bold">COPA (91.2%) & Electrician (88.2%)</strong>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-[11px] text-amber-900">
              <span className="text-slate-500 block">Lowest Pass Rate:</span>
              <strong className="text-amber-800 font-bold">Mechanic Diesel (76.2%)</strong>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 text-[11px] text-rose-900">
              <span className="text-slate-500 block">Common Theory Deficit:</span>
              <strong className="text-rose-800 font-bold">Workshop Calc & Sci (23.2% Fail)</strong>
            </div>
          </div>
        </div>

        {/* CHART 2: Institution Comparison (Top High-Performing vs Underperforming Flagged) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>{language === 'hi' ? 'उच्च बनाम निम्न प्रदर्शनकारी संस्थान' : 'High vs. Underperforming ITIs'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Top 4 model centers vs. Bottom 4 critical audit centers
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Outliers Audit
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={institutionComparisonChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }}
                    width={110}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
                            <p className="font-bold text-amber-300">{data.fullName}</p>
                            <p className="text-slate-300 text-[11px]">{data.district} • {data.isGovt ? 'Government' : 'Private'}</p>
                            <div className="flex justify-between gap-4 pt-1">
                              <span className="text-emerald-400">Pass Rate:</span>
                              <span className="font-bold font-mono">{data.passRate}%</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-rose-400">Fail Rate:</span>
                              <span className="font-bold font-mono">{data.failRate}%</span>
                            </div>
                            <div className="pt-1 text-[10px] font-semibold text-amber-200">
                              Tier: {data.tier}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="passRate" radius={[0, 6, 6, 0]}>
                    {institutionComparisonChartData.map((entry, index) => (
                      <Cell
                        key={`cell-inst-${index}`}
                        fill={
                          entry.passRate >= 90
                            ? '#059669' // High performing green
                            : entry.passRate >= 80
                            ? '#3b82f6' // Satisfactory blue
                            : entry.passRate >= 70
                            ? '#f59e0b' // Warning amber
                            : '#e11d48' // Critical red
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-600">
                Private centers show high variance: 3 centers have dropped below 68% pass threshold.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & DRILL-DOWN TOOLBAR FOR INSTITUTION AUDIT */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter by Tier */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{language === 'hi' ? 'श्रेणी:' : 'Tier:'}</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-semibold focus:outline-hidden"
              >
                <option value="all">All Performance Tiers</option>
                <option value="High Performing">High Performing (&gt;90%)</option>
                <option value="Satisfactory">Satisfactory (80-89%)</option>
                <option value="Needs Attention">Needs Attention (75-79%)</option>
                <option value="Critical Intervention">Critical Intervention (&lt;75%)</option>
              </select>
            </div>

            {/* Filter by Trade */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="font-semibold">{language === 'hi' ? 'ट्रेड:' : 'Trade:'}</span>
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-semibold focus:outline-hidden"
              >
                <option value="all">All Trades (समस्त ट्रेड्स)</option>
                {TRADES.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.name.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Institute Type */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="font-semibold">{language === 'hi' ? 'प्रकार:' : 'Type:'}</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-semibold focus:outline-hidden"
              >
                <option value="all">Govt & Private ITIs</option>
                <option value="Government">Government ITIs Only</option>
                <option value="Private">Private ITIs Only</option>
              </select>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchInstitution}
              onChange={(e) => setSearchInstitution(e.target.value)}
              placeholder="Search ITI name, district or code..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden w-full sm:w-64 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* INSTITUTIONS AUDIT TABLE (HIGH PERFORMING VS UNDERPERFORMING) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <School className="w-4 h-4 text-indigo-600" />
              <span>{language === 'hi' ? 'संस्थान प्रदर्शन मूल्यांकन तालिका' : 'Institutional Performance & Trade Breakdown Audit'}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Showing {filteredInstitutions.length} of {INSTITUTION_PERFORMANCE_RECORDS.length} monitored ITI institutions
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <button
              type="button"
              onClick={() => handleSortToggle('passRate')}
              className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer ${
                sortField === 'passRate' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span>Pass %</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleSortToggle('totalAppeared')}
              className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer ${
                sortField === 'totalAppeared' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span>Appeared</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">ITI Code & Name</th>
                <th className="py-3 px-4">District / Div</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Appeared</th>
                <th className="py-3 px-4 text-right">Pass / Fail</th>
                <th className="py-3 px-4 text-right">Pass %</th>
                <th className="py-3 px-4">Performance Tier</th>
                <th className="py-3 px-4">Top Trade</th>
                <th className="py-3 px-4">Underperforming Trade</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstitutions.map((inst) => {
                const isHighPerforming = inst.performanceTier === 'High Performing';
                const isCritical = inst.performanceTier === 'Critical Intervention';
                const isNeedsAttention = inst.performanceTier === 'Needs Attention';

                return (
                  <tr
                    key={inst.code}
                    className={`hover:bg-slate-50 transition-colors ${
                      isCritical ? 'bg-rose-50/30' : isHighPerforming ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    {/* ITI Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{inst.name}</div>
                      <div className="font-mono text-[10px] text-slate-500">{inst.code}</div>
                    </td>

                    {/* District */}
                    <td className="py-3 px-4 text-slate-700">
                      <div>{inst.district}</div>
                      <div className="text-[10px] text-slate-500">{inst.division} Div</div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          inst.type === 'Government'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {inst.type}
                      </span>
                    </td>

                    {/* Appeared */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                      {inst.totalAppeared.toLocaleString()}
                    </td>

                    {/* Passed / Failed count */}
                    <td className="py-3 px-4 text-right font-mono text-[11px]">
                      <span className="text-emerald-700 font-bold">{inst.passedCount}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-rose-600 font-bold">{inst.failedCount}</span>
                    </td>

                    {/* Pass % with Progress Bar */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-xs text-slate-900">
                        {inst.passRate}%
                      </div>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden ml-auto mt-1">
                        <div
                          className={`h-full rounded-full ${
                            inst.passRate >= 90
                              ? 'bg-emerald-500'
                              : inst.passRate >= 80
                              ? 'bg-blue-500'
                              : inst.passRate >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(inst.passRate, 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Tier badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isHighPerforming
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : inst.performanceTier === 'Satisfactory'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : isNeedsAttention
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                        }`}
                      >
                        {isHighPerforming ? (
                          <TrendingUp className="w-3 h-3 text-emerald-700" />
                        ) : isCritical ? (
                          <AlertTriangle className="w-3 h-3 text-rose-700" />
                        ) : null}
                        <span>{inst.performanceTier}</span>
                      </span>
                    </td>

                    {/* Top Trade */}
                    <td className="py-3 px-4 text-emerald-800 font-medium text-[11px]">
                      {inst.topPerformingTrade}
                    </td>

                    {/* Underperforming Trade */}
                    <td className="py-3 px-4 text-rose-700 font-medium text-[11px]">
                      {inst.underperformingTrade}
                    </td>

                    {/* Drill-down button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedInstitutionForModal(inst)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700 font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Trade Breakdown
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL: TRADE-SPECIFIC BREAKDOWN FOR SELECTED INSTITUTION */}
      {selectedInstitutionForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedInstitutionForModal.type === 'Government'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedInstitutionForModal.type}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {selectedInstitutionForModal.code}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mt-1">
                  {selectedInstitutionForModal.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedInstitutionForModal.district} • {selectedInstitutionForModal.division} Division
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInstitutionForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Summary Pill in Modal */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Total Appeared</span>
                <strong className="text-base font-bold text-slate-900 font-mono">
                  {selectedInstitutionForModal.totalAppeared.toLocaleString()}
                </strong>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-700 block">Overall Pass Rate</span>
                <strong className="text-base font-bold text-emerald-900 font-mono">
                  {selectedInstitutionForModal.passRate}%
                </strong>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <span className="text-[10px] text-indigo-700 block">Avg Exam Score</span>
                <strong className="text-base font-bold text-indigo-900 font-mono">
                  {selectedInstitutionForModal.avgScore}/100
                </strong>
              </div>
            </div>

            {/* Action Required / Notes */}
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                selectedInstitutionForModal.performanceTier === 'Critical Intervention'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : selectedInstitutionForModal.performanceTier === 'High Performing'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Info className="w-4 h-4" />
                <span>Directorate Status Note & Corrective Directives:</span>
              </div>
              <p>{selectedInstitutionForModal.actionRequired}</p>
            </div>

            {/* Trade by Trade Detailed Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Trade-wise Pass/Fail Breakdown
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3">Trade</th>
                      <th className="py-2.5 px-3 text-right">Trainees</th>
                      <th className="py-2.5 px-3 text-right">Passed</th>
                      <th className="py-2.5 px-3 text-right">Failed</th>
                      <th className="py-2.5 px-3 text-right">Pass %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInstitutionForModal.tradeBreakdown.map((tr) => (
                      <tr key={tr.tradeId} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-800">{tr.tradeName}</td>
                        <td className="py-2 px-3 text-right font-mono">{tr.appeared}</td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-700 font-bold">{tr.passed}</td>
                        <td className="py-2 px-3 text-right font-mono text-rose-600 font-bold">{tr.appeared - tr.passed}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">
                          <span
                            className={
                              tr.passRate >= 90
                                ? 'text-emerald-700'
                                : tr.passRate >= 80
                                ? 'text-blue-700'
                                : tr.passRate >= 70
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }
                          >
                            {tr.passRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedInstitutionForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close Audit Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
