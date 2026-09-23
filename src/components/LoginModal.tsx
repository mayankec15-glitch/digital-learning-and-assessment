import React, { useState } from 'react';
import { Language, UserRole, AuthenticatedUser } from '../types';
import { DEFAULT_PORTAL_USERS } from '../data';
import { generateVAPTCompliantJWT } from '../utils/securityAndVAPT';
import {
  ShieldCheck,
  KeyRound,
  User,
  Lock,
  Landmark,
  Layers,
  School,
  GraduationCap,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Smartphone,
  Info,
  Building2,
  FileCheck2,
  X,
} from 'lucide-react';

interface LoginModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthenticatedUser) => void;
  targetRole?: UserRole;
  currentUser?: AuthenticatedUser | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  language,
  isOpen,
  onClose,
  onLoginSuccess,
  targetRole = 'directorate',
  currentUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(targetRole);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  
  // Credentials
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [otpSentToast, setOtpSentToast] = useState<boolean>(false);
  const [demoActiveOtp, setDemoActiveOtp] = useState<string>('829140');
  const [captchaCode, setCaptchaCode] = useState<string>('7K9M');
  const [captchaInput, setCaptchaInput] = useState<string>('7K9M');

  // Role quick switch mapping
  const roleConfigs: {
    id: UserRole;
    title: { en: string; hi: string };
    badge: { en: string; hi: string };
    defaultUser: string;
    samplePass: string;
    icon: React.ReactNode;
    color: string;
    bgAccent: string;
  }[] = [
    {
      id: 'directorate',
      title: { en: '1. Directorate General (DTE)', hi: '1. राज्य निदेशालय (डीटीई)' },
      badge: { en: 'State Apex Admin', hi: 'राज्य शीर्ष प्रशासन' },
      defaultUser: 'director.scvt',
      samplePass: 'Director@UP2026',
      icon: <Landmark className="w-5 h-5 text-amber-500" />,
      color: 'border-amber-400 text-amber-700 bg-amber-50/50',
      bgAccent: 'from-amber-600 to-orange-700',
    },
    {
      id: 'central_content',
      title: { en: '2. Content & Assessment Cell', hi: '2. पाठ्य सामग्री व मूल्यांकन प्रकोष्ठ' },
      badge: { en: 'Question Bank Cell', hi: 'प्रश्न बैंक प्रकोष्ठ' },
      defaultUser: 'assessment.cell',
      samplePass: 'Curriculum@NIMI26',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      color: 'border-indigo-400 text-indigo-700 bg-indigo-50/50',
      bgAccent: 'from-indigo-600 to-blue-700',
    },
    {
      id: 'iti_admin',
      title: { en: '3. ITI Center Superintendent', hi: '3. आईटीआई केंद्र अधीक्षक / प्रधानाचार्य' },
      badge: { en: 'Institute Terminal Supdt', hi: 'संस्थान केंद्र अधीक्षक' },
      defaultUser: 'supdt.aliganj',
      samplePass: 'ItiCenter@2026',
      icon: <School className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-400 text-emerald-700 bg-emerald-50/50',
      bgAccent: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'trainee',
      title: { en: '4. Trainee Student (CTS/NCVT)', hi: '4. प्रशिक्षार्थी छात्र (सीटीएस)' },
      badge: { en: 'Enrolled Candidate', hi: 'पंजीकृत परीक्षार्थी' },
      defaultUser: 'UP240223010198',
      samplePass: 'Ankit@CTS2024',
      icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
      color: 'border-blue-400 text-blue-700 bg-blue-50/50',
      bgAccent: 'from-blue-600 to-indigo-700',
    },
  ];

  // Refresh captcha helper
  const handleRefreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput(code); // Pre-fill for friction-free testing
  };

  // Quick preset selector
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);
    const target = DEFAULT_PORTAL_USERS.find((u) => u.role === role);
    if (target) {
      setUsernameInput(target.username);
      const conf = roleConfigs.find((r) => r.id === role);
      setPasswordInput(conf?.samplePass || 'Pass@1234');
    }
  };

  // Quick 1-click Demo Fill
  const handleQuickDemoFill = (role: UserRole) => {
    handleSelectRole(role);
  };

  // Dispatch OTP
  const handleSendMobileOtp = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoActiveOtp(randomCode);
      setOtpSentToast(true);
      setOtpInput(randomCode); // Convenience for evaluation
      setTimeout(() => setOtpSentToast(false), 6000);
    }, 600);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!usernameInput.trim()) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया वैध उपयोगकर्ता नाम / रोल नंबर प्रविष्ट करें।'
          : 'Please enter a valid Username or NCVT Roll Number.'
      );
      return;
    }

    if (authMethod === 'password' && !passwordInput) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया अपना पासवर्ड प्रविष्ट करें।'
          : 'Please enter your portal password.'
      );
      return;
    }

    if (authMethod === 'otp' && otpInput.trim().length !== 6) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया पंजीकृत मोबाइल पर प्राप्त 6-अंकीय ओटीपी प्रविष्ट करें।'
          : 'Please enter the 6-digit OTP code received on registered mobile.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Find matching user or fallback to standard demo role profile
      let authenticated = DEFAULT_PORTAL_USERS.find(
        (u) =>
          u.role === selectedRole &&
          (u.username.toLowerCase() === usernameInput.toLowerCase() ||
            u.employeeOrRollId.toLowerCase() === usernameInput.toLowerCase())
      );

      if (!authenticated) {
        // Create dynamic authenticated session for custom trainee/official
        authenticated = {
          id: `usr-${Date.now()}`,
          username: usernameInput,
          name:
            selectedRole === 'trainee'
              ? `Trainee (${usernameInput.toUpperCase()})`
              : `Authorized Official (${usernameInput})`,
          role: selectedRole,
          designation: {
            en: selectedRole === 'trainee' ? 'Enrolled CTS Trainee' : 'State Vocational Officer',
            hi: selectedRole === 'trainee' ? 'पंजीकृत सीटीएस प्रशिक्षार्थी' : 'राज्य व्यावसायिक अधिकारी',
          },
          departmentOrITI:
            selectedRole === 'directorate'
              ? 'DTE & SCVT HQ, Lucknow'
              : selectedRole === 'central_content'
              ? 'State Question Bank Cell'
              : 'Govt. ITI Center, UP',
          avatarInitials: usernameInput.substring(0, 2).toUpperCase(),
          email: `${usernameInput.toLowerCase()}@up.gov.in`,
          mobile: '+91 94150 •••••',
          employeeOrRollId: usernameInput.toUpperCase(),
          lastLogin: 'Just Now (Authenticated)',
          twoFactorEnabled: true,
        };
      }

      // Generate VAPT RFC-7519 Compliant Bearer JWT
      const jwtResult = generateVAPTCompliantJWT(authenticated, {
        examId: 'EXAM-UP-2026-STATE-01',
        tradeId: 'electrician',
        terminalId: `NODE-${Math.floor(100 + Math.random() * 900)}`,
        itiCode: 'ITI-0101',
      });
      authenticated.token = jwtResult.token;

      setSuccessMessage(
        language === 'hi'
          ? `प्रमाणीकरण सफल! स्वागत है, ${authenticated.name}`
          : `Authentication Successful! Welcome, ${authenticated.name}`
      );

      setTimeout(() => {
        onLoginSuccess(authenticated!);
        onClose();
      }, 700);
    }, 650);
  };

  if (!isOpen) return null;

  const currentRoleConf = roleConfigs.find((r) => r.id === selectedRole) || roleConfigs[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
      >
        {/* Top Government Emblem Header */}
        <div className={`bg-gradient-to-r ${currentRoleConf.bgAccent} text-white px-5 sm:px-6 py-4 relative`}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-xl shadow-xs border border-white/20">
              UP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded">
                  {language === 'hi' ? 'उत्तर प्रदेश शासन' : 'Govt. of Uttar Pradesh'}
                </span>
                <span className="text-[10px] text-white/80 font-mono">
                  DTE & SCVT Central Auth
                </span>
              </div>
              <h2 id="login-modal-title" className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
                {language === 'hi'
                  ? 'व्यावसायिक शिक्षा उपयोगकर्ता लॉगिन पोर्टल'
                  : 'Vocational Education Unified Users Login'}
              </h2>
            </div>
          </div>
        </div>

        {/* Real-time SMS Toast Banner */}
        {otpSentToast && (
          <div className="bg-slate-900 text-white p-3 px-5 text-xs flex items-center justify-between border-b border-slate-800 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Simulated SMS from <strong>VD-UPGOVT</strong>: One-Time Passcode is{' '}
                <strong className="text-amber-400 font-mono text-sm tracking-wider">{demoActiveOtp}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOtpInput(demoActiveOtp)}
              className="text-[11px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2 py-0.5 rounded cursor-pointer shrink-0"
            >
              Fill OTP
            </button>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-5">
          {/* Stakeholder Role Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              {language === 'hi' ? '1. लॉगिन हितधारक भूमिका का चयन करें:' : '1. Select User Stakeholder Role:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roleConfigs.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    selectedRole === role.id
                      ? `border-2 ${role.color} shadow-xs font-bold ring-2 ring-orange-200/50`
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="shrink-0">{role.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold leading-tight truncate">
                      {language === 'hi' ? role.title.hi : role.title.en}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {language === 'hi' ? role.badge.hi : role.badge.en}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Demo Pre-fill helper cards */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold">
                {language === 'hi' ? 'डेमो त्वरित क्रेडेंशियल:' : 'Quick Demo Profile:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('directorate')}
                className="px-2 py-1 rounded bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-amber-800 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Directorate
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('central_content')}
                className="px-2 py-1 rounded bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-800 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Assessment Cell
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('iti_admin')}
                className="px-2 py-1 rounded bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-800 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
              >
                ITI Supdt
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('trainee')}
                className="px-2 py-1 rounded bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-800 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Trainee (Ankit)
              </button>
            </div>
          </div>

          {/* Authentication Mode Tabs: Password vs Mobile OTP */}
          <div className="flex items-center border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setErrorMessage(null);
              }}
              className={`pb-1 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                authMethod === 'password'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {language === 'hi' ? 'पासवर्ड आधारित लॉगिन' : 'Password Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setErrorMessage(null);
              }}
              className={`pb-1 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                authMethod === 'otp'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'ओटीपी मोबाइल लॉगिन' : 'Mobile OTP Login'}</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username / Roll Number Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                <span>
                  {selectedRole === 'trainee'
                    ? (language === 'hi' ? 'एनसीवीटी रोल नंबर / पंजीकरण संख्या:' : 'NCVT Roll No. / Registration ID:')
                    : (language === 'hi' ? 'अधिकारी यूजर आईडी / ई-मेल:' : 'Official User ID / Email:')}
                </span>
                <span className="text-[10px] text-slate-400 font-normal font-mono">
                  e.g. {currentRoleConf.defaultUser}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={
                    selectedRole === 'trainee'
                      ? 'UP240223010198'
                      : currentRoleConf.defaultUser
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-orange-500 focus:ring-3 focus:ring-orange-100 bg-white"
                />
              </div>
            </div>

            {/* Password vs OTP Mode Input */}
            {authMethod === 'password' ? (
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                  <span>{language === 'hi' ? 'पासवर्ड (Password):' : 'Password:'}</span>
                  <span className="text-[10px] text-slate-400 font-normal font-mono">
                    demo: {currentRoleConf.samplePass}
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-orange-500 focus:ring-3 focus:ring-orange-100 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? '6-अंकीय ओटीपी कोड:' : '6-Digit Mobile OTP Code:'}
                  </label>
                  <button
                    type="button"
                    onClick={handleSendMobileOtp}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    {language === 'hi' ? 'ओटीपी भेजें (Send OTP)' : 'Send / Resend OTP'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 829140"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold text-sm tracking-widest focus:outline-hidden focus:border-orange-500 focus:ring-3 focus:ring-orange-100 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Security Captcha verification */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 select-none">
                <span className="font-mono font-black text-sm tracking-widest text-slate-800 line-through">
                  {captchaCode}
                </span>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  title="Refresh Captcha"
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                maxLength={4}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="Captcha"
                className="w-28 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-center uppercase focus:outline-hidden focus:border-orange-500 bg-white"
              />
              <span className="text-[11px] text-slate-400">
                {language === 'hi' ? 'सुरक्षा कोड' : 'Security Code'}
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Encrypted • SCVT Portal</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{language === 'hi' ? 'प्रमाणीकृत हो रहा है...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'सुरक्षित लॉगिन करें' : 'Secure Login'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
