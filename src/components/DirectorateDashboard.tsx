import React, { useState } from 'react';
import { Language, DirectorateDistrictSummary, ScheduledStateExam } from '../types';
import { DIRECTORATE_DISTRICTS_DATA, STATE_CIRCULARS, TRADES, STATE_SCHEDULED_EXAMS } from '../data';
import { LiveExamMonitoring } from './LiveExamMonitoring';
import { ExamScheduler } from './ExamScheduler';
import {
  PassFailRateAnalytics,
  STATEWIDE_TRADE_PERFORMANCE,
  INSTITUTION_PERFORMANCE_RECORDS,
} from './PassFailRateAnalytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Landmark,
  TrendingUp,
  Award,
  Users,
  Building2,
  FileText,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  UploadCloud,
  FileSpreadsheet,
  BookOpen,
  FileUp,
  Layers,
  Send,
  PlusCircle,
  HelpCircle,
  Lock,
  Globe,
  Database,
  ExternalLink,
  Clock,
  Sparkles,
  Check,
  FileCode,
  School,
  AlertCircle,
  KeyRound,
  Timer,
  Smartphone,
  Radio,
  Zap,
} from 'lucide-react';

interface DirectorateDashboardProps {
  language: Language;
  onNavigateToTab: (tab: 'library' | 'cbt' | 'moodle' | 'hostinger') => void;
}

interface UploadedContentItem {
  id: string;
  title: { en: string; hi: string };
  tradeId: string;
  category: string;
  semester: string;
  format: string;
  fileSize: string;
  uploadedAt: string;
  downloadsCount: number;
  moodleStatus: 'Synced' | 'Pending';
  status: 'Published' | 'Draft';
  author: string;
}

export const DirectorateDashboard: React.FC<DirectorateDashboardProps> = ({
  language,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'pass_fail_analytics' | 'live_monitoring' | 'exam_scheduler' | 'upload_content' | 'upload_test' | 'workflow_guide' | 'circulars'>('overview');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'excellent' | 'normal' | 'attention'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Upload Content Form State
  const [contentTitleEn, setContentTitleEn] = useState('');
  const [contentTitleHi, setContentTitleHi] = useState('');
  const [contentTrade, setContentTrade] = useState('all');
  const [contentCategory, setContentCategory] = useState('NIMI Digital Textbook');
  const [contentSemester, setContentSemester] = useState('All Semesters');
  const [contentFormat, setContentFormat] = useState('PDF Document');
  const [contentFileName, setContentFileName] = useState('');
  const [contentScope, setContentScope] = useState('All 75 Districts & 3,165 ITIs');
  const [isUploadingContent, setIsUploadingContent] = useState(false);

  // Content Registry Data
  const [publishedContentList, setPublishedContentList] = useState<UploadedContentItem[]>([
    {
      id: 'doc-dte-01',
      title: {
        en: 'NIMI Electrician Trade Theory Volume 1 (NSQF Level 4 Revised)',
        hi: 'निमी इलेक्ट्रीशियन ट्रेड थ्योरी वॉल्यूम 1 (एनएसक्यूएफ लेवल 4 संशोधित)',
      },
      tradeId: 'electrician',
      category: 'NIMI Digital Textbook',
      semester: 'Semester 1',
      format: 'PDF Document',
      fileSize: '24.8 MB',
      uploadedAt: '2026-02-14',
      downloadsCount: 18450,
      moodleStatus: 'Synced',
      status: 'Published',
      author: 'DTE & NIMI Chennai',
    },
    {
      id: 'doc-dte-02',
      title: {
        en: 'Fitter Workshop Practical & Precision Measuring Tools Handbook',
        hi: 'फ़िटर कार्यशाला प्रायोगिक एवं परिशुद्ध मापन यंत्र मार्गदर्शिका',
      },
      tradeId: 'fitter',
      category: 'Practical Workshop Manual',
      semester: 'Semester 1 & 2',
      format: 'PDF Document',
      fileSize: '19.2 MB',
      uploadedAt: '2026-02-18',
      downloadsCount: 14210,
      moodleStatus: 'Synced',
      status: 'Published',
      author: 'SCVT State Curriculum Cell',
    },
    {
      id: 'doc-dte-03',
      title: {
        en: 'COPA Python & Database Management Multimedia Interactive Module',
        hi: 'कोपा पायथन एवं डेटाबेस प्रबंधन मल्टीमीडिया इंटरैक्टिव मॉड्यूल',
      },
      tradeId: 'copa',
      category: 'Interactive E-Learning Package',
      semester: 'Annual Course',
      format: 'SCORM 1.2 Package',
      fileSize: '65.4 MB',
      uploadedAt: '2026-02-21',
      downloadsCount: 8930,
      moodleStatus: 'Synced',
      status: 'Published',
      author: 'UP ITI Digital Lab Mission',
    },
    {
      id: 'doc-dte-04',
      title: {
        en: 'CTS Revised Employability Skills 120-Hours Curriculum & Question Bank',
        hi: 'संशोधित रोजगार कौशल्य (ES) 120 घंटे पाठ्यक्रम व प्रश्न बैंक 2026',
      },
      tradeId: 'employability-skills',
      category: 'Question Bank & Workbook',
      semester: 'Common 1st Year',
      format: 'PDF Document',
      fileSize: '15.5 MB',
      uploadedAt: '2026-02-22',
      downloadsCount: 22100,
      moodleStatus: 'Synced',
      status: 'Published',
      author: 'DGT / DTE Lucknow',
    },
  ]);

  // Upload / Schedule Test Form State
  const [testTitleEn, setTestTitleEn] = useState('UP SCVT State Pre-AITT Mock CBT Examination 2026 (Phase 2)');
  const [testTitleHi, setTestTitleHi] = useState('उत्तर प्रदेश एससीवीटी प्री-एआईटीटी राज्य स्तरीय सीबीटी मॉक परीक्षा 2026 (द्वितीय चरण)');
  const [testTrade, setTestTrade] = useState('electrician');
  const [testExamType, setTestExamType] = useState('Annual AITT State Mock');
  const [testStartDate, setTestStartDate] = useState('2026-03-05');
  const [testEndDate, setTestEndDate] = useState('2026-03-08');
  const [testActivationTime, setTestActivationTime] = useState('09:30');
  const [testDeactivationTime, setTestDeactivationTime] = useState('17:30');
  const [testShiftSlot, setTestShiftSlot] = useState('Shift 1: 09:30 AM - 11:30 AM & Shift 2: 02:00 PM - 04:00 PM');
  const [testRequireOtp, setTestRequireOtp] = useState<boolean>(true);
  const [testInvigilatorName, setTestInvigilatorName] = useState('Er. R. K. Srivastava (Exam Supdt)');
  const [testDuration, setTestDuration] = useState(120);
  const [testQuestionsCount, setTestQuestionsCount] = useState(75);
  const [testPasscode, setTestPasscode] = useState('SCVT-LKO-EXAM-9921');
  const [testQuestionsFile, setTestQuestionsFile] = useState<string>('');
  const [validatedQuestionsCount, setValidatedQuestionsCount] = useState<number | null>(null);
  const [isDeployingTest, setIsDeployingTest] = useState(false);

  // Scheduled Tests List initialized with central state registry
  const [scheduledExamsList, setScheduledExamsList] = useState<ScheduledStateExam[]>(STATE_SCHEDULED_EXAMS);

  // Circular issuance state
  const [circularNumber, setCircularNumber] = useState('DTE/CBT/2026/095');
  const [circularTitleEn, setCircularTitleEn] = useState('Mandatory Biometric Attendance & Central CBT Mock Participation Guidelines');
  const [circularTitleHi, setCircularTitleHi] = useState('अनिवार्य बायोमेट्रिक उपस्थिति एवं केंद्रीय सीबीटी मॉक परीक्षा में शत-प्रतिशत प्रतिभाग संबंधी निर्देश');
  const [circularCategory, setCircularCategory] = useState<'Examination' | 'Curriculum' | 'Administration'>('Examination');
  const [circularsList, setCircularsList] = useState(STATE_CIRCULARS);

  const filteredDistricts = DIRECTORATE_DISTRICTS_DATA.filter((d) => {
    const matchesSearch =
      d.district.toLowerCase().includes(searchDistrict.toLowerCase()) ||
      d.division.toLowerCase().includes(searchDistrict.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalEnrolled = DIRECTORATE_DISTRICTS_DATA.reduce((acc, d) => acc + d.enrolledStudents, 0);
  const totalTests = DIRECTORATE_DISTRICTS_DATA.reduce((acc, d) => acc + d.testsCompleted, 0);
  const avgPass = (
    DIRECTORATE_DISTRICTS_DATA.reduce((acc, d) => acc + d.passPercentage, 0) /
    DIRECTORATE_DISTRICTS_DATA.length
  ).toFixed(1);

  // Helper notification
  const triggerNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  // Download Sample Question Bank Template CSV
  const handleDownloadQuestionCSVTemplate = () => {
    const csvContent = `TradeCode,Subject,Difficulty,QuestionEn,QuestionHi,OptionA_En,OptionA_Hi,OptionB_En,OptionB_Hi,OptionC_En,OptionC_Hi,OptionD_En,OptionD_Hi,CorrectOption,NimiChapterRef,Marks
ELEC,Trade Theory,Easy,"What is the unit of electric current?","विद्युत धारा की इकाई क्या है?","Volt","वोल्ट","Ampere","एम्पीयर","Ohm","ओम","Watt","वाट","B","Chapter 1: Units & Electrical Quantities",2
ELEC,Trade Theory,Medium,"Which instrument is used to measure insulation resistance?","इंसुलेशन प्रतिरोध मापने के लिए किस यंत्र का उपयोग किया जाता है?","Megger","मेगर","Multimeter","मल्टीमीटर","Voltmeter","वोल्टमीटर","Ammeter","एमीटर","A","Chapter 4: Electrical Measurements",2
ELEC,Workshop Science,Medium,"What is the power formula for DC circuits?","डीसी परिपथ में शक्ति (Power) का सूत्र क्या है?","P = V x I","P = V x I","P = V / I","P = V / I","P = I / V","P = I / V","P = V^2 x I","P = V^2 x I","A","Chapter 8: Work Power and Energy",2
ELEC,Employability Skills,Easy,"What does 'RAM' stand for in computer systems?","कंप्यूटर प्रणाली में RAM का पूर्ण रूप क्या है?","Random Access Memory","रैंडम एक्सेस मेमोरी","Read Access Memory","रीड एक्सेस मेमोरी","Run Auto Memory","रन ऑटो मेमोरी","Real Action Memory","रियल एक्शन मेमोरी","A","Module 2: Digital Literacy",2`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UP_DTE_Question_Bank_Upload_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification(
      language === 'hi'
        ? 'निदेशालय मानकीकृत प्रश्न बैंक सीएसवी टेम्पलेट (द्विभाषी) डाउनलोड हो गया।'
        : 'Directorate standardized Question Bank CSV template (Bilingual) downloaded.'
    );
  };

  // Handle Question File Simulation / Parsing
  const handleSimulateQuestionFileParse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTestQuestionsFile(file.name);
      // Simulate realistic validation parse
      setTimeout(() => {
        setValidatedQuestionsCount(75);
        triggerNotification(
          language === 'hi'
            ? `फ़ाइल '${file.name}' सत्यापित: 75 प्रश्न (38 थ्योरी, 6 WCS, 6 ED, 25 ES) सफलतापूर्वक पार्स हुए!`
            : `File '${file.name}' validated: 75 questions (38 Theory, 6 WCS, 6 ED, 25 ES) successfully parsed!`
        );
      }, 400);
    }
  };

  // Handle Uploading Content
  const handleUploadContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitleEn) {
      alert('Please enter at least an English or Hindi Title.');
      return;
    }

    setIsUploadingContent(true);
    setTimeout(() => {
      const newItem: UploadedContentItem = {
        id: `doc-dte-${Date.now()}`,
        title: {
          en: contentTitleEn || 'Official SCVT Curriculum Material',
          hi: contentTitleHi || contentTitleEn || 'राजकीय एससीवीटी पाठ्यक्रम सामग्री',
        },
        tradeId: contentTrade,
        category: contentCategory,
        semester: contentSemester,
        format: contentFormat,
        fileSize: contentFileName ? '18.4 MB' : '12.0 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        downloadsCount: 0,
        moodleStatus: 'Synced',
        status: 'Published',
        author: 'DTE & SCVT UP Directorate',
      };

      setPublishedContentList([newItem, ...publishedContentList]);
      setIsUploadingContent(false);
      setContentTitleEn('');
      setContentTitleHi('');
      setContentFileName('');
      triggerNotification(
        language === 'hi'
          ? `सामग्री '${newItem.title.hi}' सफलतापूर्वक राज्य डिजिटल लाइब्रेरी व मूडल में प्रकाशित हो गई!`
          : `Material '${newItem.title.en}' published to State Digital Library & synced to Moodle LMS!`
      );
    }, 800);
  };

  // Handle Scheduling New State CBT Exam
  const handleDeployExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeployingTest(true);

    setTimeout(() => {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const startDateTime = `${testStartDate}T${testActivationTime}:00`;
      const endDateTime = `${testEndDate}T${testDeactivationTime}:00`;

      const newExam: ScheduledStateExam = {
        id: `exam-up-${Date.now()}`,
        title: {
          en: testTitleEn,
          hi: testTitleHi,
        },
        tradeId: testTrade,
        examType: testExamType,
        dateRange: `${testStartDate} to ${testEndDate}`,
        durationMinutes: Number(testDuration),
        totalQuestions: Number(testQuestionsCount),
        totalMarks: Number(testQuestionsCount) * 2,
        targetITIs: 'All 75 Districts & 3,165 ITIs',
        passcode: testPasscode || 'SCVT-UP-PASS-2026',
        status: 'Live',
        registeredCount: 42500,
        activationStartTime: startDateTime,
        activationEndTime: endDateTime,
        shiftTimeSlot: testShiftSlot,
        isActivatedNow: true,
        requiresOtpAuth: testRequireOtp,
        demoOtpCode: generatedOtp,
        invigilatorName: testInvigilatorName,
        otpCooldownSeconds: 60,
      };

      setScheduledExamsList([newExam, ...scheduledExamsList]);
      setIsDeployingTest(false);
      triggerNotification(
        language === 'hi'
          ? `राज्यव्यापी सीबीटी टेस्ट '${newExam.title.hi}' सक्रिय हुआ! सक्रिय समय: ${testActivationTime} IST | सुरक्षा OTP: ${generatedOtp}`
          : `State CBT Exam '${newExam.title.en}' activated! Activation Time: ${testActivationTime} IST | Secure OTP: ${generatedOtp}`
      );
    }, 1000);
  };

  // Handle Issuing New Circular
  const handleIssueCircularSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCir = {
      id: `cir-${Date.now()}`,
      number: circularNumber,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: {
        en: circularTitleEn,
        hi: circularTitleHi,
      },
      category: circularCategory,
      downloadSize: '1.2 MB',
      signedBy: 'Director, Training & Employment UP',
      isUrgent: true,
    };
    setCircularsList([newCir, ...circularsList]);
    triggerNotification(
      language === 'hi'
        ? `नया शासनादेश सं. ${circularNumber} सभी आईटीआई प्रधानाचार्यों व छात्रों को जारी किया गया!`
        : `New Circular No. ${circularNumber} broadcasted to all ITI Principals & Trainees!`
    );
  };

  // Export State Report CSV
  const handleExportStatewideCSV = () => {
    const headers = 'District,Division,Total ITIs,Enrolled Students,Tests Completed,Pass %,Top Trade,Attendance %,Status\n';
    const rows = DIRECTORATE_DISTRICTS_DATA.map(
      (d) =>
        `"${d.district}","${d.division}",${d.totalITIs},${d.enrolledStudents},${d.testsCompleted},${d.passPercentage}%,"${d.topTrade}",${d.averageAttendancePct}%,"${d.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UP_ITI_Directorate_CBT_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification(
      language === 'hi'
        ? 'राज्यस्तरीय जिलावार सीबीटी रिपोर्ट (CSV) सफलतापूर्वक डाउनलोड हो गई।'
        : 'Statewide District CBT Analytics CSV downloaded successfully.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Directorate Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white rounded-2xl p-6 sm:p-8 border border-amber-800/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                {language === 'hi' ? 'निदेशालय प्रशासनिक केंद्र' : 'Directorate Apex Desk'}
              </span>
              <span className="text-xs text-amber-200/80 bg-white/10 px-2.5 py-1 rounded-full font-mono">
                75 Districts • 315 Govt ITIs • 2,850 Pvt ITIs
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'hi'
                ? 'प्रशिक्षण एवं सेवायोजन निदेशालय, उत्तर प्रदेश'
                : 'Directorate of Training & Employment, Govt. of Uttar Pradesh'}
            </h1>
            <p className="text-sm text-amber-100/90 leading-relaxed">
              {language === 'hi'
                ? 'निमी आधारित डिजिटल सामग्री अपलोड, केंद्रीकृत सीबीटी परीक्षा निर्माण, जिलावार निगरानी एवं मूडल/होस्टिंगर सर्वर वितरण।'
                : 'Centralized NIMI E-Content uploading, state CBT exam scheduling, district analytics, and Moodle/Hostinger distribution.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-directorate-pass-fail-analytics"
              type="button"
              onClick={() => setActiveSubTab('pass_fail_analytics')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <Award className="w-4 h-4 text-emerald-200" />
              <span>{language === 'hi' ? 'उत्तीर्ण/अनुत्तीर्ण एनालिटिक्स' : 'Pass/Fail Rates'}</span>
            </button>
            <button
              id="btn-directorate-live-telemetry"
              type="button"
              onClick={() => setActiveSubTab('live_monitoring')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all animate-pulse"
            >
              <Radio className="w-4 h-4 text-white" />
              <span>{language === 'hi' ? 'लाइव परीक्षा मॉनिटर' : 'Live Exam Monitor'}</span>
            </button>
            <button
              id="btn-directorate-upload-content"
              type="button"
              onClick={() => setActiveSubTab('upload_content')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{language === 'hi' ? 'सामग्री अपलोड करें' : 'Upload Content'}</span>
            </button>
            <button
              id="btn-directorate-upload-test"
              type="button"
              onClick={() => setActiveSubTab('upload_test')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{language === 'hi' ? 'नया टेस्ट शेड्यूल करें' : 'Upload & Schedule Test'}</span>
            </button>
            <button
              id="btn-export-directorate-csv"
              type="button"
              onClick={handleExportStatewideCSV}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-all"
              title="Download Statewide CSV Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'hi' ? 'राज्य रिपोर्ट' : 'State CSV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Notification Toast */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs transition-all ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Directorate Sub-Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          id="btn-subtab-overview"
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'overview'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{language === 'hi' ? '1. राज्यीय समीक्षा व जनपद प्रगति' : '1. State Review & Districts'}</span>
        </button>

        <button
          type="button"
          id="btn-subtab-pass-fail-analytics"
          onClick={() => setActiveSubTab('pass_fail_analytics')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'pass_fail_analytics'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 hover:text-emerald-900'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? 'ट्रेडवार उत्तीर्ण/अनुत्तीर्ण दर' : 'Trade Pass/Fail Analytics'}</span>
          <span className="bg-emerald-200 text-emerald-950 px-1.5 py-0.2 rounded text-[10px] font-bold">
            Recharts
          </span>
        </button>

        <button
          type="button"
          id="btn-subtab-live-monitoring"
          onClick={() => setActiveSubTab('live_monitoring')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'live_monitoring'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xs'
              : 'text-red-700 bg-red-50/60 hover:bg-red-100 hover:text-red-800'
          }`}
        >
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <span>{language === 'hi' ? 'लाइव सीबीटी निगरानी' : 'Live Exam Telemetry'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        </button>

        <button
          type="button"
          id="btn-subtab-exam-scheduler"
          onClick={() => setActiveSubTab('exam_scheduler')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'exam_scheduler'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 hover:text-indigo-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>{language === 'hi' ? 'परीक्षा शेड्यूलर व केंद्र आवंटन' : 'Exam Scheduler & Branches'}</span>
          <span className="bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded text-[10px] font-bold">
            {scheduledExamsList.length}
          </span>
        </button>

        <button
          type="button"
          id="btn-subtab-upload-content"
          onClick={() => setActiveSubTab('upload_content')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'upload_content'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-amber-300" />
          <span>{language === 'hi' ? '2. सामग्री अपलोड एवं वितरण' : '2. Upload Content & Books'}</span>
          <span className="bg-amber-500/20 text-amber-900 px-1.5 py-0.2 rounded text-[10px]">
            {publishedContentList.length}
          </span>
        </button>

        <button
          type="button"
          id="btn-subtab-upload-test"
          onClick={() => setActiveSubTab('upload_test')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'upload_test'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-orange-400" />
          <span>{language === 'hi' ? '3. टेस्ट व प्रश्न बैंक अपलोड' : '3. Upload Tests & Exams'}</span>
          <span className="bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded text-[10px]">
            {scheduledExamsList.length} Live
          </span>
        </button>

        <button
          type="button"
          id="btn-subtab-workflow-guide"
          onClick={() => setActiveSubTab('workflow_guide')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'workflow_guide'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-indigo-300" />
          <span>{language === 'hi' ? '4. अपलोड प्रक्रिया मार्गदर्शिका' : '4. How Directorate Uploads'}</span>
        </button>

        <button
          type="button"
          id="btn-subtab-circulars"
          onClick={() => setActiveSubTab('circulars')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'circulars'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'hi' ? '5. शासनादेश व परिपत्र' : '5. Circulars & Orders'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: OVERVIEW & DISTRICT MATRIX */}
      {/* ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Statewide High-Level KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{language === 'hi' ? 'संबद्ध आईटीआई' : 'Affiliated ITIs'}</span>
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">3,165</div>
              <p className="text-[11px] text-slate-500 mt-1">315 Govt • 2,850 Private</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{language === 'hi' ? 'कुल नामांकित छात्र' : 'Enrolled Trainees'}</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalEnrolled.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ 8.4% from last session</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>{language === 'hi' ? 'सीबीटी टेस्ट संपन्न' : 'CBT Tests Taken'}</span>
                <Award className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalTests.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-slate-500 mt-1">82.8% of enrolled trainees</p>
            </div>

            <div
              onClick={() => setActiveSubTab('pass_fail_analytics')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/20 transition-all group"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span className="group-hover:text-emerald-800 font-bold">{language === 'hi' ? 'राज्य औसत उत्तीर्ण %' : 'State Avg Pass %'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black text-slate-900 group-hover:text-emerald-700">{avgPass}%</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center justify-between">
                <span>Benchmark target 80%</span>
                <span className="text-[10px] text-emerald-700 font-bold underline">Recharts →</span>
              </p>
            </div>
          </div>

          {/* Scheduled Exam Windows Showcase on Overview Dashboard */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    {language === 'hi' ? 'सक्रिय एवं निर्धारित सीबीटी परीक्षा विंडो' : 'Active & Scheduled CBT Test Windows'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'निर्धारित प्रारंभ/समाप्ति तिथियां एवं संबद्ध आईटीआई कंप्यूटर केंद्र'
                    : 'Allocated time slots, shift windows and assigned ITI exam centers'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveSubTab('exam_scheduler')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'hi' ? 'पूर्ण शेड्यूलर प्रबंधित करें' : 'Manage Full Scheduler'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scheduledExamsList.slice(0, 3).map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          exam.status === 'Live'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        }`}
                      >
                        {exam.status === 'Live' ? '● Live Window' : 'Scheduled'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {exam.durationMinutes}m
                      </span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                      {language === 'hi' ? exam.title.hi : exam.title.en}
                    </h4>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Window:</span>
                      <strong className="text-slate-800 font-mono">{exam.dateRange}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Center Allocation:</span>
                      <span className="text-indigo-700 font-bold truncate max-w-[130px]" title={exam.targetITIs}>
                        {exam.targetITIs.split('(')[0] || 'Govt ITI Centers'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                      OTP: {exam.demoOtpCode || '749210'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('live_monitoring')}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Telemetry</span>
                      <Radio className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VISUALIZING STUDENT PASS/FAIL RATES PER ITI TRADE & HIGH VS UNDERPERFORMING INSTITUTIONS (RECHARTS) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-slate-900">
                    {language === 'hi'
                      ? 'ट्रेडवार सीबीटी उत्तीर्ण/अनुत्तीर्ण दर एवं उच्च बनाम निम्न प्रदर्शनकारी आईटीआई'
                      : 'Trade Pass/Fail Rates & Institutional Performance Matrix'}
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Recharts Visualizer
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'प्रत्येक ट्रेड में उत्तीर्ण/अनुत्तीर्ण दरों का विश्लेषण एवं उत्कृष्ट बनाम सुधार-योग्य संस्थानों की पहचान'
                    : 'Compare pass/fail rates by ITI trade and pinpoint high-performing vs underperforming institutions'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('pass_fail_analytics')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'hi' ? 'विस्तृत ऑडिट व CSV निर्यात' : 'Full Trade & ITI Audit'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Stacked Recharts Bar Chart: Trade Pass vs Fail % */}
              <div className="lg:col-span-7 bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                    {language === 'hi' ? 'ट्रेडवार उत्तीर्ण व अनुत्तीर्ण प्रतिशत' : 'Trade Pass vs Fail Percentage (%)'}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Pass Rate (%)
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-rose-700">
                      <span className="w-2.5 h-2.5 rounded-xs bg-rose-400 inline-block" /> Fail Rate (%)
                    </span>
                  </div>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={STATEWIDE_TRADE_PERFORMANCE.map((t) => ({
                        name: language === 'hi' ? t.tradeNameHi : t.tradeNameEn,
                        passRate: t.passRate,
                        failRate: Number((100 - t.passRate).toFixed(1)),
                        appeared: t.totalAppeared,
                        passed: t.passedCount,
                        failed: t.failedCount,
                      }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 9.5, fill: '#475569', fontWeight: 600 }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        tickFormatter={(val) => `${val}%`}
                      />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-md border border-slate-700 text-xs space-y-1">
                                <p className="font-bold text-amber-300 text-xs">{label}</p>
                                <div className="flex justify-between gap-3 text-[11px]">
                                  <span className="text-emerald-400">Pass Rate:</span>
                                  <span className="font-mono font-bold">{d.passRate}% ({d.passed.toLocaleString()})</span>
                                </div>
                                <div className="flex justify-between gap-3 text-[11px]">
                                  <span className="text-rose-400">Fail Rate:</span>
                                  <span className="font-mono font-bold">{d.failRate}% ({d.failed.toLocaleString()})</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="passRate" stackId="a" fill="#10b981" radius={[0, 0, 3, 3]}>
                        {STATEWIDE_TRADE_PERFORMANCE.map((entry, idx) => (
                          <Cell
                            key={`ov-cell-${idx}`}
                            fill={entry.passRate >= 85 ? '#059669' : entry.passRate >= 80 ? '#10b981' : '#f59e0b'}
                          />
                        ))}
                      </Bar>
                      <Bar dataKey="failRate" stackId="a" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* High-Performing vs Underperforming Institutions Spotlights */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                {/* High Performing Lead */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-700" />
                      Top High-Performing Institutions
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800">
                      Target &gt;90% Pass
                    </span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {INSTITUTION_PERFORMANCE_RECORDS.filter((i) => i.performanceTier === 'High Performing')
                      .slice(0, 2)
                      .map((inst) => (
                        <div key={inst.code} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-emerald-100">
                          <div>
                            <div className="font-bold text-slate-900 truncate max-w-[190px]">{inst.name}</div>
                            <div className="text-[10px] text-slate-500">{inst.district} • {inst.topPerformingTrade}</div>
                          </div>
                          <span className="font-mono font-extrabold text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                            {inst.passRate}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Underperforming Flagged */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-700" />
                      Flagged Underperforming Institutions
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-800">
                      Critical &lt;70% Pass
                    </span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {INSTITUTION_PERFORMANCE_RECORDS.filter(
                      (i) => i.performanceTier === 'Critical Intervention' || i.performanceTier === 'Needs Attention'
                    )
                      .slice(0, 2)
                      .map((inst) => (
                        <div key={inst.code} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-rose-100">
                          <div>
                            <div className="font-bold text-slate-900 truncate max-w-[190px]">{inst.name}</div>
                            <div className="text-[10px] text-rose-700 font-medium">Deficit: {inst.underperformingTrade}</div>
                          </div>
                          <span className="font-mono font-extrabold text-xs text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded">
                            {inst.passRate}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Audit Action: 3 private ITIs under compliance notice for low trade pass rates.</span>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('pass_fail_analytics')}
                    className="font-bold text-indigo-700 hover:text-indigo-900 underline shrink-0 cursor-pointer ml-2"
                  >
                    View All 13 ITIs
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* District Performance Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  {language === 'hi' ? 'जनपदवार सीबीटी परीक्षा एवं प्रदर्शन समीक्षा' : 'District-wise CBT Assessment Matrix'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'उत्तर प्रदेश के प्रमुख जनपदों के राजकीय व निजी संस्थानों का सीबीटी प्रगति विवरण'
                    : 'Turnout, completion rate and pass percentages across key UP districts'}
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="search-district-input"
                    type="text"
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    placeholder={language === 'hi' ? 'जिला या मंडल खोजें...' : 'Search district or division...'}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 w-48 sm:w-56"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  <button
                    type="button"
                    onClick={() => setFilterStatus('all')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {language === 'hi' ? 'सभी' : 'All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('excellent')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      filterStatus === 'excellent' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {language === 'hi' ? 'उत्कृष्ट' : 'Excellent'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('attention')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      filterStatus === 'attention' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {language === 'hi' ? 'समीक्षा अपेक्षित' : 'Needs Action'}
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">{language === 'hi' ? 'जनपद / मंडल' : 'District / Division'}</th>
                    <th className="py-3 px-4 text-center">{language === 'hi' ? 'आईटीआई संख्या' : 'ITIs'}</th>
                    <th className="py-3 px-4 text-center">{language === 'hi' ? 'नामांकित छात्र' : 'Enrolled'}</th>
                    <th className="py-3 px-4 text-center">{language === 'hi' ? 'परीक्षार्थी' : 'CBT Taken'}</th>
                    <th className="py-3 px-4 text-center">{language === 'hi' ? 'उत्तीर्ण %' : 'Pass %'}</th>
                    <th className="py-3 px-4 text-center">{language === 'hi' ? 'प्रमुख ट्रेड' : 'Top Trade'}</th>
                    <th className="py-3 px-4 text-center">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredDistricts.map((item) => (
                    <tr key={item.district} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="text-sm font-bold text-slate-800">{item.district}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{item.division}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">{item.totalITIs}</td>
                      <td className="py-3 px-4 text-center font-mono">{item.enrolledStudents.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-900">
                        {item.testsCompleted.toLocaleString('en-IN')}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {((item.testsCompleted / item.enrolledStudents) * 100).toFixed(0)}% turnout
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
                            item.passPercentage >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.passPercentage >= 78
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.passPercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-800 font-medium">{item.topTrade}</td>
                      <td className="py-3 px-4 text-center">
                        {item.status === 'excellent' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            {language === 'hi' ? 'उत्कृष्ट' : 'Excellent'}
                          </span>
                        )}
                        {item.status === 'normal' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            {language === 'hi' ? 'सामान्य' : 'Normal'}
                          </span>
                        )}
                        {item.status === 'attention' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            {language === 'hi' ? 'निरीक्षण अपेक्षित' : 'Attention'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: PASS / FAIL RATE ANALYTICS PER ITI TRADE (RECHARTS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'pass_fail_analytics' && (
        <PassFailRateAnalytics language={language} />
      )}

      {/* ========================================================================= */}
      {/* VIEW: LIVE EXAM MONITORING TELEMETRY (RECHARTS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'live_monitoring' && (
        <LiveExamMonitoring
          language={language}
          onLaunchExamPreview={(tradeId) => onNavigateToTab('cbt')}
        />
      )}

      {/* ========================================================================= */}
      {/* VIEW: EXAM SCHEDULER & ITI BRANCH ALLOCATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'exam_scheduler' && (
        <ExamScheduler
          language={language}
          onLaunchExamPreview={(tradeId) => onNavigateToTab('cbt')}
          examsList={scheduledExamsList}
          onUpdateExamsList={(updated) => setScheduledExamsList(updated)}
        />
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: UPLOAD CONTENT & DIGITAL E-BOOKS */}
      {/* ========================================================================= */}
      {activeSubTab === 'upload_content' && (
        <div className="space-y-6">
          {/* Explanatory Header Box */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                {language === 'hi'
                  ? 'निदेशालय ई-कंटेंट अपलोड एवं केंद्रीय प्रकाशन कंसोल'
                  : 'Directorate Central E-Content Ingestion & Publishing Console'}
              </h3>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                {language === 'hi'
                  ? 'निमी (NIMI) ई-बुक्स, प्रायोगिक कार्यशाला नियमावली, एससीवीटी पाठ्यक्रम और वीडियो व्याख्यान अपलोड करें। स्वीकृत होने पर सामग्री राज्य के सभी 75 जिलों के 42,000+ छात्रों और मूडल कोर्सेस में तुरंत वितरित हो जाती है।'
                  : 'Upload NIMI E-textbooks, practical workshop manuals, syllabi, and video modules. Once approved, content automatically syncs to all 75 UP districts, 42,000+ trainees, and Moodle courses.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs bg-white px-3 py-1.5 rounded-lg border border-amber-300 font-mono text-amber-900 font-bold">
                Auth: DTE-UP-NCVT-SEAL
              </span>
            </div>
          </div>

          {/* Content Upload Form */}
          <form
            onSubmit={handleUploadContentSubmit}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-amber-600" />
                {language === 'hi' ? 'नई शिक्षण सामग्री / ई-बुक अपलोड करें' : 'Upload New Learning Resource / E-Book'}
              </h3>
              <span className="text-[11px] text-slate-500">Bilingual Metadata Supported</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'सामग्री का शीर्षक (अंग्रेजी)' : 'Content Title (English)'} *
                </label>
                <input
                  type="text"
                  required
                  value={contentTitleEn}
                  onChange={(e) => setContentTitleEn(e.target.value)}
                  placeholder="e.g. NIMI Fitter Trade Practical & Lathe Operations Vol 2"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'सामग्री का शीर्षक (हिंदी)' : 'Content Title (Hindi)'}
                </label>
                <input
                  type="text"
                  value={contentTitleHi}
                  onChange={(e) => setContentTitleHi(e.target.value)}
                  placeholder="उदा. निमी फ़िटर ट्रेड प्रायोगिक व लेथ मशीन संचालन खंड 2"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'लक्षित ट्रेड (Trade)' : 'Target Trade'} *
                </label>
                <select
                  value={contentTrade}
                  onChange={(e) => setContentTrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="all">Common for All Trades (सामान्य सभी ट्रेड्स)</option>
                  {TRADES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name.en} ({t.name.hi}) - {t.code}
                    </option>
                  ))}
                  <option value="workshop-calc-science">Workshop Calculation & Science (WCS)</option>
                  <option value="employability-skills">Employability Skills (रोजगार कौशल्य)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'सामग्री का प्रकार (Category)' : 'Content Category'} *
                </label>
                <select
                  value={contentCategory}
                  onChange={(e) => setContentCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="NIMI Digital Textbook">NIMI Digital Textbook (ई-पाठ्यपुस्तक)</option>
                  <option value="Practical Workshop Manual">Practical Workshop Manual (प्रायोगिक नियमावली)</option>
                  <option value="SCVT Official Syllabus">SCVT / NCVT Official Syllabus (पाठ्यक्रम)</option>
                  <option value="Question Bank & Workbook">Question Bank & Solved Papers (प्रश्न बैंक संग्रह)</option>
                  <option value="Interactive E-Learning Package">SCORM / Interactive Package (मल्टीमीडिया पैकेज)</option>
                  <option value="DTE Official Order / Circular">DTE Official Circular / Order (शासनादेश)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'सत्र / सेमेस्टर (Semester/Year)' : 'Semester / Year'}
                </label>
                <select
                  value={contentSemester}
                  onChange={(e) => setContentSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="All Semesters">All Semesters (सभी सेमेस्टर)</option>
                  <option value="Semester 1">Semester 1 (प्रथम सेमेस्टर)</option>
                  <option value="Semester 2">Semester 2 (द्वितीय सेमेस्टर)</option>
                  <option value="Semester 3">Semester 3 (तृतीय सेमेस्टर)</option>
                  <option value="Semester 4">Semester 4 (चतुर्थ सेमेस्टर)</option>
                  <option value="Common 1st Year">1st Year Annual (प्रथम वर्ष)</option>
                  <option value="2nd Year Annual">2nd Year Annual (द्वितीय वर्ष)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'वितरण का दायरा (Scope of Distribution)' : 'Distribution Scope'}
                </label>
                <select
                  value={contentScope}
                  onChange={(e) => setContentScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="All 75 Districts & 3,165 ITIs">Statewide: All 75 Districts & 3,165 ITIs</option>
                  <option value="315 Government ITIs Only">All 315 Government ITIs Only</option>
                  <option value="Division Pilots (Lucknow, Kanpur, Varanasi)">Pilot Divisions (Lucknow, Kanpur, Varanasi)</option>
                </select>
              </div>
            </div>

            {/* Document File Selector */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center">
              <FileUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">
                {contentFileName ? (
                  <span className="text-emerald-700">Selected File: {contentFileName} (Ready for Ingestion)</span>
                ) : (
                  <span>Choose file to upload (PDF, EPUB, MP4, SCORM ZIP)</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Standard NIMI Book files up to 200MB are supported. Auto-scanned for virus and integrity.
              </p>
              <div className="mt-3">
                <label
                  htmlFor="file-content-upload"
                  className="px-4 py-2 rounded-lg bg-white border border-slate-300 shadow-2xs text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 text-amber-600" />
                  <span>Browse Device / Cloud Storage</span>
                </label>
                <input
                  id="file-content-upload"
                  type="file"
                  accept=".pdf,.epub,.mp4,.zip"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setContentFileName(f.name);
                  }}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Auto-stamped with official SCVT UP digital signature on publish</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={isUploadingContent}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isUploadingContent ? (
                    <span>Publishing & Syncing...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{language === 'hi' ? 'प्रकाशित करें एवं मूडल में भेजें' : 'Publish & Sync to Moodle'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Active Directorate Content Registry */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {language === 'hi' ? 'निदेशालय द्वारा प्रकाशित डिजिटल सामग्री रजिस्टर' : 'Directorate Published E-Content Registry'}
                </h3>
                <p className="text-xs text-slate-500">Active documents available in Trainee Library & ITI terminals</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {publishedContentList.length} Active Items
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {publishedContentList.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.tradeId.toUpperCase()} • {item.semester}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                        <Check className="w-3 h-3" /> Moodle {item.moodleStatus}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {language === 'hi' ? item.title.hi : item.title.en}
                    </h4>

                    <p className="text-[11px] text-slate-500">
                      Author: {item.author} • Size: {item.fileSize} • Uploaded: {item.uploadedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="block text-xs font-mono font-bold text-slate-800">
                        {item.downloadsCount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500">Student Accesses</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateToTab('library')}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'hi' ? 'लाइब्रेरी में देखें' : 'View in Library'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: UPLOAD & SCHEDULE STATE TESTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'upload_test' && (
        <div className="space-y-6">
          {/* Quick Action Card Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3 border border-indigo-800/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  Method 1: Bulk Question Bank Upload
                </span>
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              </div>
              <h4 className="font-bold text-base">
                {language === 'hi' ? 'थोक प्रश्न बैंक अपलोड (CSV / XML)' : 'Bulk Question Ingestion (CSV / XML)'}
              </h4>
              <p className="text-xs text-indigo-200/90 leading-relaxed">
                Upload hundreds of bilingual questions mapped to NIMI modules with four options, answer keys, and explanations.
              </p>
              <div className="pt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQuestionCSVTemplate}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Standard CSV Template</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-900 to-slate-900 text-white space-y-3 border border-amber-800/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  Method 2: State CBT Scheduler
                </span>
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="font-bold text-base">
                {language === 'hi' ? 'राज्यस्तरीय सीबीटी परीक्षा बनाएं व लॉक करें' : 'Deploy Central State CBT Test'}
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Configure DGT 75-question blueprints, daily shift windows, and invigilator master unlock passcodes across 315 ITIs.
              </p>
              <div className="pt-1 flex flex-wrap gap-2">
                <span className="text-xs font-mono bg-white/10 text-amber-200 px-2.5 py-1 rounded">
                  DGT Blueprint: 38 TT + 6 WCS + 6 ED + 25 ES
                </span>
              </div>
            </div>
          </div>

          {/* Form: Schedule Centralized CBT Exam */}
          <form
            onSubmit={handleDeployExamSubmit}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-600" />
                  {language === 'hi' ? 'नया राज्यस्तरीय सीबीटी टेस्ट बनाएं एवं वितरित करें' : 'Create & Dispatch Statewide CBT Examination'}
                </h3>
                <p className="text-xs text-slate-500">
                  Instantly available on ITI computer lab terminals & student examination desks
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                SCVT Central Controller
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'परीक्षा का नाम (अंग्रेजी)' : 'Exam Title (English)'} *
                </label>
                <input
                  type="text"
                  required
                  value={testTitleEn}
                  onChange={(e) => setTestTitleEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'परीक्षा का नाम (हिंदी)' : 'Exam Title (Hindi)'} *
                </label>
                <input
                  type="text"
                  required
                  value={testTitleHi}
                  onChange={(e) => setTestTitleHi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'ट्रेड (Trade)' : 'Trade'} *
                </label>
                <select
                  value={testTrade}
                  onChange={(e) => setTestTrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  {TRADES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name.en} ({t.name.hi}) - {t.code}
                    </option>
                  ))}
                  <option value="workshop-calc-science">Workshop Calculation & Science (All Trades)</option>
                  <option value="copa">COPA (Computer Operator & Programming Assistant)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'परीक्षा का प्रकार (Exam Type)' : 'Examination Type'}
                </label>
                <select
                  value={testExamType}
                  onChange={(e) => setTestExamType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="Annual AITT State Mock">Annual AITT State Mock (वार्षिक एआईटीटी राज्य मॉक)</option>
                  <option value="SCVT Quarterly Assessment">SCVT Quarterly CBT Assessment (त्रैमासिक सीबीटी मूल्यांकन)</option>
                  <option value="Semester Mid-Term Diagnostic">Semester Mid-Term Diagnostic (मध्यावधि निदानात्मक)</option>
                  <option value="Monthly Practice Challenge">Monthly Practice Challenge (मासिक अभ्यास टेस्ट)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block flex items-center justify-between">
                  <span>{language === 'hi' ? 'परीक्षा विंडो (Start to End Date)' : 'Statewide Exam Window Dates'} *</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={testStartDate}
                    onChange={(e) => setTestStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  />
                  <input
                    type="date"
                    value={testEndDate}
                    onChange={(e) => setTestEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Statewide Activation Time Window */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>{language === 'hi' ? 'राज्यव्यापी टेस्ट सक्रिय समय (Activation Time)' : 'Statewide Daily Activation Time Window'} *</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Start Time (IST):</label>
                    <input
                      type="time"
                      value={testActivationTime}
                      onChange={(e) => setTestActivationTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">End Time (IST):</label>
                    <input
                      type="time"
                      value={testDeactivationTime}
                      onChange={(e) => setTestDeactivationTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white font-mono"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  ⚡ Test activates across all 75 districts simultaneously between these hours
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'hi' ? 'सक्रिय पाली (Shift Schedule)' : 'Shift Time Slot'}</span>
                </label>
                <select
                  value={testShiftSlot}
                  onChange={(e) => setTestShiftSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="Shift 1: 09:30 AM - 11:30 AM & Shift 2: 02:00 PM - 04:00 PM">
                    Two Shifts (Shift 1: 09:30 - 11:30 AM | Shift 2: 02:00 - 04:00 PM)
                  </option>
                  <option value="Shift 1: 09:30 AM - 11:30 AM Only">Shift 1 (09:30 AM - 11:30 AM) Only</option>
                  <option value="Shift 2: 02:00 PM - 04:00 PM Only">Shift 2 (02:00 PM - 04:00 PM) Only</option>
                  <option value="Continuous Lab Window: 09:00 AM - 05:00 PM">Full Day Window (09:00 AM - 05:00 PM)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'अवधि एवं प्रश्न संख्या' : 'Duration & Questions'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={testDuration}
                    onChange={(e) => setTestDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value={120}>120 Minutes (DGT Standard)</option>
                    <option value={90}>90 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                  <select
                    value={testQuestionsCount}
                    onChange={(e) => setTestQuestionsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value={75}>75 Questions (150 Marks)</option>
                    <option value={50}>50 Questions (100 Marks)</option>
                    <option value={25}>25 Questions (50 Marks)</option>
                  </select>
                </div>
              </div>

              {/* OTP Authentication & Center Lockdown Passcode */}
              <div className="p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 space-y-3 md:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-xs text-orange-950 uppercase tracking-wide">
                      {language === 'hi' ? 'ओटीपी एवं सुरक्षा प्रमाणीकरण (OTP Authentication)' : 'Two-Tier OTP & Passcode Authentication'}
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testRequireOtp}
                      onChange={(e) => setTestRequireOtp(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                    />
                    <span>{language === 'hi' ? 'ओटीपी सत्यापन अनिवार्य करें' : 'Enforce 6-Digit OTP Authentication'}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      {language === 'hi' ? 'लैब लॉक एवं सुरक्षा पासकोड' : 'Center Lab Lockdown Passcode'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={testPasscode}
                      onChange={(e) => setTestPasscode(e.target.value)}
                      placeholder="e.g. SCVT-LKO-EXAM-9921"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                    />
                    <span className="text-[10px] text-slate-500">Superintendent code to unlock browser fullscreen</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                      {language === 'hi' ? 'नोडल अधिकारी / केंद्र अधीक्षक' : 'Assigned Nodal Invigilator'}
                    </label>
                    <input
                      type="text"
                      value={testInvigilatorName}
                      onChange={(e) => setTestInvigilatorName(e.target.value)}
                      placeholder="e.g. Er. R. K. Srivastava (Exam Supdt)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                    />
                    <span className="text-[10px] text-slate-500">6-digit dynamic OTP will be dispatched to trainee/lab superintendent</span>
                  </div>
                </div>
              </div>

              {/* Upload Question File Attachment */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {language === 'hi' ? 'प्रश्न फ़ाइल अटैच करें (CSV / XML / GIFT)' : 'Attach Question Bank File'}
                </label>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="input-test-questions-file"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer truncate flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">{testQuestionsFile || 'Choose CSV / XML / GIFT file...'}</span>
                  </label>
                  <input
                    id="input-test-questions-file"
                    type="file"
                    accept=".csv,.xml,.txt,.json"
                    onChange={handleSimulateQuestionFileParse}
                    className="hidden"
                  />
                  {validatedQuestionsCount && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded shrink-0">
                      ✓ {validatedQuestionsCount} Qs
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Blueprint Section Breakdown Summary */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">
                Standard DGT Exam Blueprint Section Configuration:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white border border-slate-200 text-slate-700">
                  <span className="font-semibold block text-slate-900">Trade Theory</span>
                  <span className="font-mono text-emerald-700 font-bold">38 Qs (76 Marks)</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 text-slate-700">
                  <span className="font-semibold block text-slate-900">Workshop Calc (WCS)</span>
                  <span className="font-mono text-blue-700 font-bold">6 Qs (12 Marks)</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 text-slate-700">
                  <span className="font-semibold block text-slate-900">Engineering Drawing</span>
                  <span className="font-mono text-indigo-700 font-bold">6 Qs (12 Marks)</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 text-slate-700">
                  <span className="font-semibold block text-slate-900">Employability Skills</span>
                  <span className="font-mono text-amber-700 font-bold">25 Qs (50 Marks)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Pushes instantly to Moodle Quiz API and Hostinger Cloud database</span>
              </div>

              <button
                type="submit"
                disabled={isDeployingTest}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isDeployingTest ? (
                  <span>Deploying Test to ITIs...</span>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>{language === 'hi' ? 'राज्यव्यापी टेस्ट सक्रिय करें' : 'Deploy Statewide CBT Test'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Active Directorate Scheduled Exams Registry */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {language === 'hi' ? 'निदेशालय राज्य सीबीटी परीक्षा अनुसूची रजिस्टर' : 'Directorate Central CBT Schedule Registry'}
                </h3>
                <p className="text-xs text-slate-500">Live, upcoming, and scheduled tests across all UP ITI exam centers</p>
              </div>
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                {scheduledExamsList.length} Exams Managed
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {scheduledExamsList.map((exam) => (
                <div key={exam.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          exam.status === 'Live'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        ● {exam.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {exam.tradeId.toUpperCase()} • {exam.totalQuestions} Questions ({exam.totalMarks} Marks)
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                        Passcode: {exam.passcode}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {language === 'hi' ? exam.title.hi : exam.title.en}
                    </h4>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {exam.dateRange}
                      </span>
                      {exam.activationStartTime && (
                        <span className="flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-0.5 rounded font-mono font-bold">
                          <Clock className="w-3 h-3 text-orange-500" />
                          Active: {exam.activationStartTime.split('T')[1]?.slice(0, 5) || '09:30'} - {exam.activationEndTime?.split('T')[1]?.slice(0, 5) || '17:30'} IST
                        </span>
                      )}
                      {exam.shiftTimeSlot && (
                        <span className="text-slate-500 hidden sm:inline">
                          • {exam.shiftTimeSlot}
                        </span>
                      )}
                    </div>

                    {exam.requiresOtpAuth && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-amber-600" />
                          <span>OTP Auth Enforced</span>
                        </span>
                        {exam.demoOtpCode && (
                          <span className="text-[11px] font-mono font-black tracking-wider bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded shadow-xs">
                            Active OTP: {exam.demoOtpCode}
                          </span>
                        )}
                        {exam.invigilatorName && (
                          <span className="text-[10px] text-slate-500">
                            (Nodal: {exam.invigilatorName})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="block text-xs font-mono font-bold text-slate-800">
                        {exam.registeredCount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500">Registered Trainees</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateToTab('cbt')}
                      className="px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'सीबीटी में देखें' : 'Inspect CBT'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: WORKFLOW GUIDE ("HOW DIRECTORATE UPLOADS CONTENT & TEST") */}
      {/* ========================================================================= */}
      {activeSubTab === 'workflow_guide' && (
        <div className="space-y-6">
          {/* Hero Explanatory Banner */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 border border-indigo-800/40 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-2 max-w-3xl">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase inline-flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Directorate Operational Manual
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {language === 'hi'
                  ? 'निदेशालय द्वारा सामग्री एवं टेस्ट अपलोड करने की संपूर्ण प्रक्रिया'
                  : 'How Directorate Uploads Content & Tests: End-to-End Architecture'}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                {language === 'hi'
                  ? 'प्रशिक्षण एवं सेवायोजन निदेशालय (DTE) और राज्य व्यावसायिक प्रशिक्षण परिषद (SCVT UP) द्वारा डिजिटल पाठ्यपुस्तकों और ऑनलाइन सीबीटी परीक्षाओं को अपलोड, सत्यापित और 75 जनपदों में प्रसारित करने का 4-चरणीय आधिकारिक तंत्र।'
                  : 'Official 4-step workflow for Directorate of Training & Employment and SCVT UP to ingest, certify, and broadcast bilingual digital books and CBT exams across 75 districts.'}
              </p>
            </div>
          </div>

          {/* 4-Step Interactive Architecture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'सामग्री एवं प्रश्न निर्माण' : 'Content & Question Authoring'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NIMI Chennai digital books, Bharat Skills questions, and SCVT Subject Expert Committees prepare standardized bilingual files (English & Hindi).
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5" />
                <span>CSV / Moodle XML / PDF</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'निदेशालय केंद्रीय इनटेक' : 'Directorate Ingestion & Blueprint'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Directorate uploads via the <strong>Upload Content</strong> or <strong>Upload Test</strong> console, validating DGT 75-question blueprints, marks, and passing rules.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Digital Seal Authentication</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'मल्टी-चैनल स्वचालित वितरण' : 'Multi-Channel Auto-Sync'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Published assets push instantaneously through 3 pipelines: Trainee Digital Library, Moodle REST API courses, and Hostinger MySQL / ITI local lab caches.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Moodle & Hostinger Sync</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'समय-सक्रियण एवं ओटीपी प्रमाणीकरण' : 'Time Activation & OTP Auth'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'परीक्षा केवल राज्यव्यापी निर्धारित समय पर ही सक्रिय होती है। छात्र इनविजिलेटर पासकोड तथा 6-अंकीय ओटीपी द्वारा प्रमाणित होकर ही परीक्षा प्रारंभ कर सकते हैं।'
                  : 'Exams strictly activate during statewide time window (e.g. 09:30 AM). Students must authenticate with Center Passcode and dynamic 6-digit OTP before starting.'}
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Timed Window + 6-Digit OTP</span>
              </div>
            </div>
          </div>

          {/* Deep-Dive Technical Flow Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              {language === 'hi' ? 'तकनीकी प्रारूप एवं एकीकरण विवरण' : 'Technical Formats & Integration Matrix'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Item Type</th>
                    <th className="py-2.5 px-3">Supported Formats</th>
                    <th className="py-2.5 px-3">Destination Channels</th>
                    <th className="py-2.5 px-3">Security & Integrity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">E-Books & Practicals</td>
                    <td className="py-3 px-3 font-mono text-slate-600">PDF, EPUB, SCORM 1.2</td>
                    <td className="py-3 px-3 text-slate-700">Trainee Digital Library, Moodle Course Materials</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-emerald-700">SHA-256 Checksum Verified</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Question Banks</td>
                    <td className="py-3 px-3 font-mono text-slate-600">CSV, Moodle XML, GIFT, JSON</td>
                    <td className="py-3 px-3 text-slate-700">Centralized CBT Engine, Moodle Question Bank</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-emerald-700">Bilingual & Key Validation</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">CBT Exam Packages</td>
                    <td className="py-3 px-3 font-mono text-slate-600">Encrypted JSON, SQLite DB Cache</td>
                    <td className="py-3 px-3 text-slate-700">315 ITI Lab Terminal Servers, Student CBT Desk</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-emerald-700">Invigilator Passcode Lock</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Circulars & Orders</td>
                    <td className="py-3 px-3 font-mono text-slate-600">PDF, Official Digital Order</td>
                    <td className="py-3 px-3 text-slate-700">Directorate Notice Board, ITI Admin Broadcast</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-emerald-700">State DTE Digital Seal</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('upload_content')}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Go to Upload Content</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('upload_test')}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Go to Upload & Schedule Test</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: CIRCULARS & ORDERS */}
      {/* ========================================================================= */}
      {activeSubTab === 'circulars' && (
        <div className="space-y-6">
          {/* Issue New Circular Form */}
          <form
            onSubmit={handleIssueCircularSubmit}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                {language === 'hi' ? 'नया शासनादेश / परीक्षा परिपत्र जारी करें' : 'Issue Official Directorate Circular / Order'}
              </h3>
              <span className="text-xs text-slate-500">Instant Broadcast to all 3,165 ITIs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Circular / Order Number *</label>
                <input
                  type="text"
                  required
                  value={circularNumber}
                  onChange={(e) => setCircularNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-700">Subject / Title (English) *</label>
                <input
                  type="text"
                  required
                  value={circularTitleEn}
                  onChange={(e) => setCircularTitleEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-700">Subject / Title (Hindi)</label>
                <input
                  type="text"
                  value={circularTitleHi}
                  onChange={(e) => setCircularTitleHi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category</label>
                <select
                  value={circularCategory}
                  onChange={(e) => setCircularCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="Examination">Examination (परीक्षा)</option>
                  <option value="Curriculum">Curriculum (पाठ्यक्रम)</option>
                  <option value="Administration">Administration (प्रशासन)</option>
                  <option value="Admissions">Admissions (प्रवेश)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'परिपत्र जारी करें' : 'Broadcast Circular'}</span>
              </button>
            </div>
          </form>

          {/* List of Circulars */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'सक्रिय नीतिगत परिपत्र एवं आदेश सूची' : 'Active Policy Circulars & Orders'}
              </h3>
              <span className="text-xs font-bold text-slate-500">{circularsList.length} Circulars</span>
            </div>

            <div className="space-y-3">
              {circularsList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 bg-slate-50/50 hover:bg-white transition-all space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                        {item.number}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">{item.date}</span>
                    </div>
                    {item.isUrgent && (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Urgent / अतिमहत्वपूर्ण
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 leading-snug text-xs sm:text-sm">
                    {language === 'hi' ? item.title.hi : item.title.en}
                  </h4>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>Authorized by: {item.signedBy}</span>
                    <span className="font-mono">{item.downloadSize} PDF</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
