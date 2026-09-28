import React, { useState } from 'react';
import { Language, UserRole, AuthenticatedUser, PortalTheme } from '../types';
import {
  Home,
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
  Palette,
  ChevronDown,
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
  portalTheme: PortalTheme;
  setPortalTheme: (theme: PortalTheme) => void;
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
  portalTheme,
  setPortalTheme,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const rolesConfig: { id: UserRole; label: { en: string; hi: string }; icon: React.ReactNode }[] = [
    {
      id: 'directorate',
      label: { en: '1. Directorate', hi: '1. निदेशालय' },
      icon: <Landmark className="w-3.5 h-3.5" />,
    },
    {
      id: 'central_content',
      label: { en: '2. Central Content', hi: '2. सामग्री प्रकोष्ठ' },
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'iti_admin',
      label: { en: '3. ITI Institutes', hi: '3. आईटीआई संस्थान' },
      icon: <School className="w-3.5 h-3.5" />,
    },
    {
      id: 'trainee',
      label: { en: '4. Trainee Desk', hi: '4. छात्र डेस्क' },
      icon: <GraduationCap className="w-3.5 h-3.5" />,
    },
  ];

  const themeOptions: { id: PortalTheme; name: { en: string; hi: string }; previewColor: string }[] = [
    {
      id: 'imperial_navy',
      name: { en: 'Imperial Navy (शाही नेवी)', hi: 'शाही नेवी (सचिवालय)' },
      previewColor: 'bg-slate-900 border-amber-400',
    },
    {
      id: 'modern_emerald',
      name: { en: 'Civic Emerald (नागरिक हरा)', hi: 'नागरिक हरा (कौशल)' },
      previewColor: 'bg-emerald-950 border-emerald-400',
    },
    {
      id: 'executive_dark',
      name: { en: 'Executive Dark (डार्क कन्सोल)', hi: 'डार्क कन्सोल (कमांड)' },
      previewColor: 'bg-zinc-950 border-cyan-400',
    },
  ];

  // Dynamic header styles depending on selected theme
  const getHeaderBg = () => {
    switch (portalTheme) {
      case 'modern_emerald':
        return 'bg-[#06241D] text-slate-100 border-b border-emerald-900/60';
      case 'executive_dark':
        return 'bg-[#030712] text-slate-100 border-b border-zinc-800';
      case 'imperial_navy':
      default:
        return 'bg-[#0B1528] text-slate-100 border-b border-slate-800';
    }
  };

  return (
    <header className="sticky top-0 z-40 shadow-sm transition-colors duration-300">
      {/* 1. Sovereign National Tricolor Hairline Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-slate-100 to-emerald-600" />

      {/* 2. Master State Government Identity Masthead */}
      <div className={`${getHeaderBg()} px-4 sm:px-8 py-3 relative`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Official Emblem & Portal Moniker */}
          <div
            onClick={() => setCurrentTab('role_dashboard')}
            className="flex items-center gap-3.5 cursor-pointer group"
            title="Go to Dashboard / डैशबोर्ड पर जाएं"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex flex-col items-center justify-center text-amber-300 font-serif leading-none font-bold">
                <span className="text-[10px] tracking-widest text-amber-400">उ.प्र.</span>
                <span className="text-xs font-black tracking-tight text-white">SCVT</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 font-mono">
                  GOVERNMENT OF UTTAR PRADESH
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {language === 'hi' ? 'व्यावसायिक शिक्षा एवं कौशल विकास विभाग' : 'Department of Vocational Education'}
                </span>
              </div>

              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 group-hover:text-amber-300 transition-colors">
                <span>
                  {language === 'hi'
                    ? 'उ.प्र. आईटीआई डिजिटल लर्निंग एवं सीबीटी परीक्षा प्रणाली'
                    : 'UP ITI Digital Learning & CBT Examination System'}
                </span>
              </h1>

              {/* Clean Unboxed Metadata (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>3,165 ITIs (Govt & Pvt)</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>75 Districts</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>NCVT / SCVT Aligned</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400 font-medium">CERT-In Hardened (20k Load SLA)</span>
              </div>
            </div>
          </div>

          {/* Right Controls: Theme Customizer, Language Toggle & User Session */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end md:self-center">
            {/* Theme Selector (कलेवर चयन) */}
            <div className="relative">
              <button
                type="button"
                id="btn-portal-theme"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                title="Change Portal Theme / कलेवर बदलें"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  {language === 'hi' ? 'कलेवर' : 'Theme'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    {language === 'hi' ? 'पोर्टल थीम कलेवर चुनें' : 'Select Theme Appearance'}
                  </div>
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setPortalTheme(opt.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        portalTheme === opt.id
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{language === 'hi' ? opt.name.hi : opt.name.en}</span>
                      <span className={`w-3 h-3 rounded-full border ${opt.previewColor}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher (Segmented Control) */}
            <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                id="btn-lang-en"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
              <button
                type="button"
                id="btn-lang-hi"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* User Session Profile Button */}
            {currentUser ? (
              <button
                type="button"
                id="btn-user-session-pill"
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-700/80 text-emerald-300 hover:bg-emerald-900 transition-colors cursor-pointer text-xs font-semibold shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span className="font-mono">{currentUser.employeeOrRollId}</span>
                <span className="hidden sm:inline">({currentUser.name.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-header-login"
                onClick={() => onOpenLogin(currentRole)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors cursor-pointer text-xs shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लॉगिन' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Stakeholder Roles Segmented Toolbar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:inline">
              {language === 'hi' ? 'सक्रिय हितधारक भूमिका:' : 'Active Stakeholder Role:'}
            </span>

            {/* Segmented Role Switcher */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
              {rolesConfig.map((role) => {
                const isActive = currentRole === role.id && currentTab === 'role_dashboard';
                return (
                  <button
                    key={role.id}
                    id={`btn-role-${role.id}`}
                    type="button"
                    onClick={() => {
                      setCurrentRole(role.id);
                      setCurrentTab('role_dashboard');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{role.icon}</span>
                    <span>{language === 'hi' ? role.label.hi : role.label.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden md:block">
            {currentRole === 'directorate' && 'Level 1: State Directorate Apex Command'}
            {currentRole === 'central_content' && 'Level 2: NIMI Curriculum & Question Repository'}
            {currentRole === 'iti_admin' && 'Level 3: Institute Lab & Terminal Administration'}
            {currentRole === 'trainee' && 'Level 4: Candidate CBT Examination Desk'}
          </div>
        </div>
      </div>

      {/* 3. Primary Section Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {!examInProgress ? (
            <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
              {/* Dashboard */}
              <button
                id="nav-tab-role-dashboard"
                type="button"
                onClick={() => setCurrentTab('role_dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'role_dashboard'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span>
                  {currentRole === 'directorate' && (language === 'hi' ? 'निदेशालय डैशबोर्ड' : 'Directorate')}
                  {currentRole === 'central_content' && (language === 'hi' ? 'सामग्री प्रकोष्ठ' : 'Content Cell')}
                  {currentRole === 'iti_admin' && (language === 'hi' ? 'संस्थान प्रबंधन' : 'ITI Admin')}
                  {currentRole === 'trainee' && (language === 'hi' ? 'प्रशिक्षार्थी डेस्क' : 'Trainee Desk')}
                </span>
              </button>

              {/* Digital Library */}
              <button
                id="nav-tab-library"
                type="button"
                onClick={() => setCurrentTab('library')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'library'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>{language === 'hi' ? 'डिजिटल लाइब्रेरी' : 'Digital Library'}</span>
              </button>

              {/* CBT Engine */}
              <button
                id="nav-tab-cbt"
                type="button"
                onClick={() => setCurrentTab('cbt')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'cbt'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4 text-orange-600" />
                <span>{language === 'hi' ? 'सीबीटी टेस्ट पोर्टल' : 'CBT Exam'}</span>
              </button>

              {/* Moodle Integration */}
              <button
                id="nav-tab-moodle"
                type="button"
                onClick={() => setCurrentTab('moodle')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'moodle'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>{language === 'hi' ? 'मूडल ब्रिज' : 'Moodle Bridge'}</span>
              </button>

              {/* Hostinger Guide */}
              <button
                id="nav-tab-hostinger"
                type="button"
                onClick={() => setCurrentTab('hostinger')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'hostinger'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Server className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'होस्टिंगर गाइड' : 'Hostinger Export'}</span>
              </button>

              {/* VAPT & 20k Engine */}
              <button
                id="nav-tab-vapt-security"
                type="button"
                onClick={() => setCurrentTab('vapt_security')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentTab === 'vapt_security'
                    ? 'bg-slate-950 text-emerald-400 shadow-md ring-1 ring-emerald-500/50'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'VAPT / लोड तनाव परीक्षक' : 'VAPT & Stress Tester'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              </button>
            </nav>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping inline-block" />
              <span>{language === 'hi' ? 'सक्रिय सीबीटी परीक्षा मोड (Anti-Cheating Lockdown Active)' : 'Active CBT Exam Mode (Lockdown Engaged)'}</span>
            </div>
          )}

          {/* Quick Right Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>State Cluster: Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
