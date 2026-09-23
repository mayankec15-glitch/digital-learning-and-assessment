import React, { useState } from 'react';
import { Language, Question, AssessmentBlueprint } from '../types';
import { TRADES, SAMPLE_QUESTIONS, SAMPLE_ASSESSMENT_BLUEPRINTS } from '../data';
import { exportToMoodleGIFT, exportToMoodleXML } from '../utils/moodleAndHostinger';
import { LiveExamMonitoring } from './LiveExamMonitoring';
import { ExamScheduler } from './ExamScheduler';
import {
  Layers,
  PlusCircle,
  BookOpen,
  FileCode,
  Download,
  CheckCircle2,
  Filter,
  Check,
  Award,
  BookMarked,
  Sparkles,
  Radio,
  Calendar,
} from 'lucide-react';

interface CentralContentAssessmentViewProps {
  language: Language;
  onNavigateToTab: (tab: 'library' | 'cbt' | 'moodle' | 'hostinger') => void;
}

export const CentralContentAssessmentView: React.FC<CentralContentAssessmentViewProps> = ({
  language,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'author_question' | 'live_monitoring' | 'exam_scheduler' | 'blueprints' | 'moodle_exports'>('author_question');
  const [selectedTrade, setSelectedTrade] = useState<string>('electrician');
  const [questionsList, setQuestionsList] = useState<Question[]>(SAMPLE_QUESTIONS);
  const [blueprintsList] = useState<AssessmentBlueprint[]>(SAMPLE_ASSESSMENT_BLUEPRINTS);
  const [notification, setNotification] = useState<string | null>(null);

  // New Question Form State
  const [newModule, setNewModule] = useState('Transformers & AC Motors');
  const [textEn, setTextEn] = useState('');
  const [textHi, setTextHi] = useState('');
  const [optAEn, setOptAEn] = useState('');
  const [optAHi, setOptAHi] = useState('');
  const [optBEn, setOptBEn] = useState('');
  const [optBHi, setOptBHi] = useState('');
  const [optCEn, setOptCEn] = useState('');
  const [optCHi, setOptCHi] = useState('');
  const [optDEn, setOptDEn] = useState('');
  const [optDHi, setOptDHi] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanationEn, setExplanationEn] = useState('');
  const [explanationHi, setExplanationHi] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textEn || !textHi || !optAEn || !optBEn) {
      alert(language === 'hi' ? 'कृपया अंग्रेजी और हिंदी दोनों में अनिवार्य विवरण भरें।' : 'Please fill all required fields in both languages.');
      return;
    }

    const created: Question = {
      id: `q-custom-${Date.now()}`,
      tradeId: selectedTrade,
      module: newModule,
      questionNumber: questionsList.length + 1,
      text: { en: textEn, hi: textHi },
      options: [
        { id: 'A', text: { en: optAEn, hi: optAHi || optAEn } },
        { id: 'B', text: { en: optBEn, hi: optBHi || optBEn } },
        { id: 'C', text: { en: optCEn, hi: optCHi || optCEn } },
        { id: 'D', text: { en: optDEn, hi: optDHi || optDEn } },
      ],
      correctOption,
      explanation: {
        en: explanationEn || 'Verified as per NIMI Trade Theory curriculum standard.',
        hi: explanationHi || 'निमी व्यावसायिक पाठ्यक्रम मानकों के अनुसार सत्यापित।',
      },
      difficulty,
    };

    setQuestionsList([created, ...questionsList]);
    setNotification(
      language === 'hi'
        ? 'नया द्विभाषी प्रश्न सफलतापूर्वक केंद्रीकृत प्रश्न बैंक में जोड़ दिया गया!'
        : 'New bilingual question added successfully to the Centralized Question Bank!'
    );
    // Reset inputs
    setTextEn('');
    setTextHi('');
    setOptAEn('');
    setOptAHi('');
    setOptBEn('');
    setOptBHi('');
    setOptCEn('');
    setOptCHi('');
    setOptDEn('');
    setOptDHi('');
    setExplanationEn('');
    setExplanationHi('');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportGIFT = () => {
    const tradeQuestions = questionsList.filter((q) => q.tradeId === selectedTrade);
    const giftContent = exportToMoodleGIFT(tradeQuestions);
    const blob = new Blob([giftContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UP_ITI_${selectedTrade}_questions_GIFT.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setNotification(
      language === 'hi'
        ? `मूडल GIFT फाइल (${tradeQuestions.length} प्रश्न) डाउनलोड हो गई।`
        : `Moodle GIFT file exported for ${tradeQuestions.length} questions.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportXML = () => {
    const tradeQuestions = questionsList.filter((q) => q.tradeId === selectedTrade);
    const xmlContent = exportToMoodleXML(tradeQuestions);
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UP_ITI_${selectedTrade}_questions_MoodleXML.xml`;
    a.click();
    URL.revokeObjectURL(url);
    setNotification(
      language === 'hi'
        ? `मूडल XML फाइल (${tradeQuestions.length} प्रश्न) डाउनलोड हो गई।`
        : `Moodle XML file exported for ${tradeQuestions.length} questions.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Central Assessment Cell Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 border border-indigo-800/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                {language === 'hi' ? 'पाठ्यक्रम एवं मूल्यांकन प्रकोष्ठ' : 'Content & Assessment Cell'}
              </span>
              <span className="text-xs text-indigo-200/80 bg-white/10 px-2.5 py-1 rounded-full">
                NIMI / DGT Question Bank Authority
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'hi'
                ? 'केंद्रीकृत सामग्री, प्रश्न बैंक एवं सीबीटी परीक्षा प्रकोष्ठ'
                : 'Centralized Content, Question Bank & Assessment Cell'}
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              {language === 'hi'
                ? 'निमी आधारित डिजिटल पाठ्यपुस्तकों का संपादन, मानकीकृत द्विभाषी प्रश्न निर्माण, सीबीटी ब्लूप्रिंट एवं मूडल एलएमएस प्रश्न एक्सपोर्ट।'
                : 'Curating NIMI digital textbooks, authoring standardized bilingual question banks, configuring CBT blueprints and Moodle question exports.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateToTab('moodle')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <FileCode className="w-4 h-4" />
              <span>{language === 'hi' ? 'मूडल ब्रिज' : 'Moodle Bridge'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('library')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <span>{language === 'hi' ? 'लाइब्रेरी समीक्षा' : 'Curate Library'}</span>
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

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('author_question')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'author_question'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'hi' ? 'प्रश्न बैंक ऑथरिंग व ऑडिट' : 'Question Authoring & Audit'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('live_monitoring')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'live_monitoring'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xs'
              : 'text-red-700 bg-red-50/60 hover:bg-red-100 hover:text-red-800'
          }`}
        >
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <span>{language === 'hi' ? 'लाइव परीक्षा सहभागिता' : 'Live Exam Monitoring'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('exam_scheduler')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'exam_scheduler'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{language === 'hi' ? 'परीक्षा समय-सारिणी' : 'Exam Scheduler'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('blueprints')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'blueprints'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{language === 'hi' ? 'परीक्षा ब्लूप्रिंट विन्यास' : 'Exam Blueprints (DGT/NCVT)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('moodle_exports')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'moodle_exports'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{language === 'hi' ? 'बैच एक्सपोर्ट (GIFT / XML)' : 'Batch Exports (GIFT/XML)'}</span>
        </button>
      </div>

      {/* VIEW 1: Question Authoring & Audit */}
      {activeSubTab === 'author_question' && (
        <div className="space-y-6">
          {/* Active Scheduled Test Windows Showcase Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  {language === 'hi' ? 'सक्रिय सीबीटी परीक्षा विंडो एवं केंद्र आवंटन' : 'Active Scheduled Test Windows & Assigned ITIs'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('exam_scheduler')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'नया शेड्यूल बनाएं' : '+ Configure Exam Window'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                    ● Live Window
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">120m • 75 Qs</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">
                    Pre-AITT State Mock CBT Phase 1 (Electrician & Fitter)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">Feb 24 - Mar 10, 2026</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-indigo-100">
                  <span className="font-medium text-slate-600">Assigned Centers:</span>
                  <span className="font-bold text-indigo-700">All 315 Govt ITIs</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Scheduled Window
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">90m • 50 Qs</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">
                    COPA & 1-Year CTS Trades State CBT Assessment
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">Mar 12 - Mar 15, 2026</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200">
                  <span className="font-medium text-slate-600">Assigned Centers:</span>
                  <span className="font-bold text-indigo-700">75 District ITIs</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Scheduled Window
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">60m • 25 Qs</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">
                    Workshop Calc & Science Mid-Term Diagnostic CBT
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">Mar 22 - Mar 24, 2026</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200">
                  <span className="font-medium text-slate-600">Assigned Centers:</span>
                  <span className="font-bold text-indigo-700">All Affiliated ITIs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Question Form */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  {language === 'hi' ? 'नया निमी आधारित द्विभाषी प्रश्न जोड़ें' : 'Author New NIMI Bilingual Question'}
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Repository Sync
              </span>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'ट्रेड' : 'Trade'}
                  </label>
                  <select
                    value={selectedTrade}
                    onChange={(e) => setSelectedTrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {TRADES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {language === 'hi' ? t.name.hi : t.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'मॉड्यूल / अध्याय' : 'Module / Topic'}
                  </label>
                  <input
                    type="text"
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Safety & Tools"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'कठिनाई स्तर' : 'Difficulty'}
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Easy">Easy (सरल)</option>
                    <option value="Medium">Medium (मध्यम)</option>
                    <option value="Hard">Hard (कठिन)</option>
                  </select>
                </div>
              </div>

              {/* Question Text in English & Hindi */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Question Text in English <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={textEn}
                    onChange={(e) => setTextEn(e.target.value)}
                    placeholder="e.g. What is the working principle of a transformer?"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    हिंदी में प्रश्न विवरण <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={textHi}
                    onChange={(e) => setTextHi(e.target.value)}
                    placeholder="उदा. ट्रांसफार्मर किस सिद्धांत पर कार्य करता है?"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'hi' ? 'विकल्प (A, B, C, D)' : 'Options (A, B, C, D)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={optAEn}
                    onChange={(e) => setOptAEn(e.target.value)}
                    placeholder="Option A (English)"
                    className="p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                  <input
                    type="text"
                    value={optAHi}
                    onChange={(e) => setOptAHi(e.target.value)}
                    placeholder="विकल्प A (हिंदी)"
                    className="p-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={optBEn}
                    onChange={(e) => setOptBEn(e.target.value)}
                    placeholder="Option B (English)"
                    className="p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                  <input
                    type="text"
                    value={optBHi}
                    onChange={(e) => setOptBHi(e.target.value)}
                    placeholder="विकल्प B (हिंदी)"
                    className="p-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={optCEn}
                    onChange={(e) => setOptCEn(e.target.value)}
                    placeholder="Option C (English)"
                    className="p-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={optCHi}
                    onChange={(e) => setOptCHi(e.target.value)}
                    placeholder="विकल्प C (हिंदी)"
                    className="p-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={optDEn}
                    onChange={(e) => setOptDEn(e.target.value)}
                    placeholder="Option D (English)"
                    className="p-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={optDHi}
                    onChange={(e) => setOptDHi(e.target.value)}
                    placeholder="विकल्प D (हिंदी)"
                    className="p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Correct Option & Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'सही उत्तर' : 'Correct Option'}
                  </label>
                  <select
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-indigo-700 bg-white"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'hi' ? 'निमी व्याख्या (Explanation)' : 'NIMI Explanation'}
                  </label>
                  <input
                    type="text"
                    value={explanationEn}
                    onChange={(e) => setExplanationEn(e.target.value)}
                    placeholder="Explanation for students"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'hi' ? 'प्रश्न बैंक में प्रकाशित करें' : 'Commit to Central Question Bank'}</span>
              </button>
            </form>
          </div>

          {/* Current Question Bank Audit */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {language === 'hi' ? 'प्रश्न बैंक ऑडिट एवं सत्यापन' : 'Question Repository Audit'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {questionsList.length} questions registered across UP ITI trades
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="p-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                >
                  {TRADES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {language === 'hi' ? t.name.hi : t.name.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {questionsList
                .filter((q) => q.tradeId === selectedTrade || q.tradeId === 'workshop-calc-science')
                .map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-indigo-700 font-bold text-[11px]">
                        #{idx + 1} • {q.module}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-900 leading-snug">
                      <p>{language === 'hi' ? q.text.hi : q.text.en}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 font-normal">
                        {language === 'hi' ? q.text.en : q.text.hi}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-1.5 rounded border ${
                            opt.id === q.correctOption
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold mr-1">{opt.id}.</span>
                          <span>{language === 'hi' ? opt.text.hi : opt.text.en}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-500 bg-slate-100 p-2 rounded border border-slate-200/80">
                      <span className="font-semibold text-slate-700">Explanation:</span>{' '}
                      {language === 'hi' ? q.explanation.hi : q.explanation.en}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* VIEW: LIVE EXAM MONITORING TELEMETRY (RECHARTS) */}
      {activeSubTab === 'live_monitoring' && (
        <LiveExamMonitoring
          language={language}
          onLaunchExamPreview={(tradeId) => onNavigateToTab('cbt')}
        />
      )}

      {/* VIEW: EXAM SCHEDULER & ITI BRANCH ASSIGNMENTS */}
      {activeSubTab === 'exam_scheduler' && (
        <ExamScheduler
          language={language}
          onLaunchExamPreview={(tradeId) => onNavigateToTab('cbt')}
        />
      )}

      {/* VIEW 2: Exam Blueprints */}
      {activeSubTab === 'blueprints' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              {language === 'hi' ? 'डीजीटी / एनसीवीटी परीक्षा ब्लूप्रिंट एवं वेटेज विन्यास' : 'DGT / NCVT Examination Blueprints'}
            </h3>
            <p className="text-xs text-slate-500">
              Configured examination matrix for Annual AITT CBT and Semester tests across UP ITIs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blueprintsList.map((bp) => (
              <div
                key={bp.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-indigo-400 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {bp.examType}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Active
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">
                  {language === 'hi' ? bp.title.hi : bp.title.en}
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Total Questions</span>
                    <span className="font-bold text-slate-900">{bp.totalQuestions} Questions</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Total Marks</span>
                    <span className="font-bold text-slate-900">{bp.totalMarks} Marks</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Duration</span>
                    <span className="font-bold text-slate-900">{bp.durationMinutes} Minutes</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Pass Mark</span>
                    <span className="font-bold text-slate-900">{bp.passingPercentage}%</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px]">
                  <span className="font-bold text-slate-700 block">Sectional Breakdown:</span>
                  {bp.sections.map((sec, i) => (
                    <div key={i} className="flex justify-between text-slate-600">
                      <span>{sec.name}</span>
                      <span className="font-mono font-semibold">
                        {sec.questionCount} Q ({sec.questionCount * sec.marksPerQuestion} M)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Batch Exports */}
      {activeSubTab === 'moodle_exports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              {language === 'hi' ? 'मूडल एलएमएस एवं डेटाबेस एक्सपोर्ट हब' : 'Moodle LMS & Hostinger Database Export Hub'}
            </h3>
            <p className="text-xs text-slate-500">
              One-click batch generation of question banks ready for Moodle servers or web hosting deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GIFT Exporter */}
            <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <span>Moodle GIFT Format Exporter</span>
              </div>
              <p className="text-xs text-indigo-900/80 leading-relaxed">
                Standard Moodle quiz import syntax. Compatible with Moodle 3.9 through 4.5 LMS question bank imports.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="p-2 border border-indigo-300 rounded-lg text-xs bg-white font-semibold"
                >
                  {TRADES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {language === 'hi' ? t.name.hi : t.name.en}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleExportGIFT}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt (GIFT)</span>
                </button>
              </div>
            </div>

            {/* Moodle XML Exporter */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <BookMarked className="w-5 h-5 text-emerald-600" />
                <span>Moodle XML Format Exporter</span>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Rich XML structure preserving bilingual tags, mathematical notation, and NIMI explanations.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleExportXML}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xml (Moodle XML)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('hostinger')}
                  className="px-4 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1.5"
                >
                  <span>Hostinger Setup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
