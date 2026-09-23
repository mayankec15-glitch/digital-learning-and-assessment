import React from 'react';
import { Language, UserRole, AuthenticatedUser } from '../types';
import {
  BookOpen,
  Award,
  Globe,
  Server,
  CheckCircle2,
  Landmark,
  Layers,
  School,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  User,
  ShieldCheck,
  Lock,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'role_dashboard' | 'library' | 'cbt' | 'moodle' | 'hostinger' | 'vapt_security';
  setCurrentTab: (tab: 'role_dashboard' | 'library' | 'cbt' | 'moodle' | 'hostinger' | 'vapt_security') => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  examInProgress: boolean;
  currentUser: AuthenticatedUser | null;
  onOpenLogin: (role?: UserRole) => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  language,
  setLanguage,
  examInProgress,
  currentUser,
  onOpenLogin,
  onOpenProfile,
}) => {
  const rolesConfig: { id: UserRole; label: { en: string; hi: string }; icon: React.ReactNode; color: string }[] = [
    {
      id: 'directorate',
      label: { en: '1. Directorate', hi: '1. निदेशालय' },
      icon: <Landmark className="w-3.5 h-3.5" />,
      color: 'text-amber-400',
    },
    {
      id: 'central_content',
      label: { en: '2. Central Content / Test', hi: '2. सामग्री व मूल्यांकन' },
      icon: <Layers className="w-3.5 h-3.5" />,
      color: 'text-indigo-400',
    },
    {
      id: 'iti_admin',
      label: { en: '3. ITIs', hi: '3. आईटीआई संस्थान' },
      icon: <School className="w-3.5 h-3.5" />,
      color: 'text-emerald-400',
    },
    {
      id: 'trainee',
      label: { en: '4. Trainees', hi: '4. प्रशिक्षार्थी' },
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      color: 'text-blue-400',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Government Portal Identity Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-emerald-700 text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider">
              GOVT. OF UTTAR PRADESH
            </span>
            <span className="hidden sm:inline text-amber-100">
              व्यावसायिक शिक्षा, कौशल विकास और उद्यमशीलता विभाग
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden md:inline text-amber-200">
              NCVT / SCVT CTS Standards • NIMI Aligned
            </span>
            {/* Language Switcher */}
            <div className="flex items-center bg-black/20 rounded p-0.5 border border-white/20">
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                id="btn-lang-hi"
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  language === 'hi'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher Toolbar (Dedicated 4 User Stakeholders) */}
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] hidden lg:inline">
              {language === 'hi' ? 'सक्रिय उपयोगकर्ता भूमिका:' : 'Active User Stakeholder:'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {rolesConfig.map((role) => (
                <button
                  key={role.id}
                  id={`btn-role-${role.id}`}
                  type="button"
                  onClick={() => {
                    setCurrentRole(role.id);
                    setCurrentTab('role_dashboard');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentRole === role.id && currentTab === 'role_dashboard'
                      ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-300'
                      : currentRole === role.id
                      ? 'bg-slate-800 text-amber-300 border border-slate-700'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={currentRole === role.id && currentTab === 'role_dashboard' ? 'text-slate-950' : role.color}>
                    {role.icon}
                  </span>
                  <span>{language === 'hi' ? role.label.hi : role.label.en}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
            <span className="hidden md:inline">Role-Based Access:</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[10px]">
              {currentRole === 'directorate' && 'Apex State Oversight'}
              {currentRole === 'central_content' && 'SCVT Question Repository'}
              {currentRole === 'iti_admin' && 'Institute Terminal Center'}
              {currentRole === 'trainee' && 'Candidate Examination Desk'}
            </span>

            {/* Quick Login / Profile Pill in Subheader */}
            {currentUser ? (
              <button
                type="button"
                id="btn-user-session-pill"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold hover:bg-emerald-900 transition-colors cursor-pointer text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">{currentUser.employeeOrRollId}</span>
                <span className="hidden sm:inline">({currentUser.name.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-header-login"
                onClick={() => onOpenLogin(currentRole)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors cursor-pointer text-xs shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'उपयोगकर्ता लॉगिन' : 'User Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white font-black text-xl shadow-md border border-amber-500/30">
            <span className="tracking-tighter">UP</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                {language === 'hi'
                  ? 'उ.प्र. आईटीआई डिजिटल लाइब्रेरी एवं सीबीटी पोर्टल'
                  : 'UP ITI Digital Library & CBT Portal'}
              </h1>
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" /> State Centralized
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'hi'
                ? 'निमी आधारित पाठ्यक्रम • सेंट्रलाइज्ड ऑनलाइन टेस्ट • 4 हितधारक भूमिकाएं'
                : 'NIMI Aligned Digital Repository • Centralized CBT • 4 Stakeholder Roles'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        {!examInProgress ? (
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
            <button
              id="nav-tab-role-dashboard"
              type="button"
              onClick={() => setCurrentTab('role_dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'role_dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>
                {currentRole === 'directorate' && (language === 'hi' ? 'निदेशालय डैशबोर्ड' : 'Directorate')}
                {currentRole === 'central_content' && (language === 'hi' ? 'सामग्री प्रकोष्ठ' : 'Content Cell')}
                {currentRole === 'iti_admin' && (language === 'hi' ? 'संस्थान प्रबंधन' : 'ITI Admin')}
                {currentRole === 'trainee' && (language === 'hi' ? 'प्रशिक्षार्थी डेस्क' : 'Trainee Desk')}
              </span>
            </button>

            <button
              id="nav-tab-library"
              type="button"
              onClick={() => setCurrentTab('library')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'library'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? 'डिजिटल लाइब्रेरी' : 'Digital Library'}</span>
            </button>

            <button
              id="nav-tab-cbt"
              type="button"
              onClick={() => setCurrentTab('cbt')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'cbt'
                  ? 'bg-orange-50 text-orange-900 border border-orange-300 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-orange-600" />
              <span>{language === 'hi' ? 'सीबीटी टेस्ट पोर्टल' : 'CBT Engine'}</span>
            </button>

            <button
              id="nav-tab-moodle"
              type="button"
              onClick={() => setCurrentTab('moodle')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'moodle'
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-300 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>{language === 'hi' ? 'मूडल ब्रिज' : 'Moodle Bridge'}</span>
            </button>

            <button
              id="nav-tab-hostinger"
              type="button"
              onClick={() => setCurrentTab('hostinger')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'hostinger'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Server className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'होस्टिंगर गाइड' : 'Hostinger Export'}</span>
            </button>

            <button
              id="nav-tab-vapt-security"
              type="button"
              onClick={() => setCurrentTab('vapt_security')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                currentTab === 'vapt_security'
                  ? 'bg-slate-950 text-emerald-400 border border-emerald-500/50 shadow-md ring-1 ring-emerald-400/40'
                  : 'text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'VAPT / JWT (20K लोड)' : 'VAPT & 20k Engine'}</span>
              <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                CERT-In
              </span>
            </button>

            {/* Direct Login Button in Main Nav */}
            <div className="pl-2 border-l border-slate-200">
              {currentUser ? (
                <button
                  type="button"
                  id="btn-nav-user-profile"
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-[11px]">
                    {currentUser.avatarInitials}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="leading-tight text-[11px] font-bold text-slate-900 truncate max-w-[120px]">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-mono">
                      {currentUser.role}
                    </p>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-nav-login"
                  onClick={() => onOpenLogin(currentRole)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'hi' ? 'लॉगइन' : 'Sign In'}</span>
                </button>
              )}
            </div>
          </nav>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            {language === 'hi' ? 'परीक्षा चालू है (Exam Mode Active)' : 'Live NCVT CBT Exam Mode'}
          </div>
        )}
      </div>
    </header>
  );
};
