import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
  KeyRound, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle, 
  RotateCcw, 
  Unlock, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Sparkles,
  Send,
  X
} from 'lucide-react';

export interface OTPVerificationModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentName: string;
  rollNumber: string;
  registeredMobile?: string;
  expectedOtpCode?: string;
  examTitle?: string;
  centerLabCode?: string;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  language,
  isOpen,
  onClose,
  onSuccess,
  studentName,
  rollNumber,
  registeredMobile = '+91 94150 •••••',
  expectedOtpCode = '749210',
  examTitle = 'UP State Centralized NCVT ITI CBT Examination',
  centerLabCode = 'SCVT-UP-LOCK-2026A',
}) => {
  // 6 digit separate inputs
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState<number>(45);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [smsDispatched, setSmsDispatched] = useState<boolean>(true);
  const [smsDeliveryToast, setSmsDeliveryToast] = useState<boolean>(true);
  const [activeOtp, setActiveOtp] = useState<string>(expectedOtpCode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationPassed, setVerificationPassed] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setErrorMsg(null);
      setAttemptsLeft(3);
      setVerificationPassed(false);
      setResendCountdown(45);
      setSmsDispatched(true);
      setSmsDeliveryToast(true);
      setActiveOtp(expectedOtpCode);

      // Auto-focus first digit on next tick
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

      // Auto dismiss simulated SMS push banner after 6 seconds
      const toastTimer = setTimeout(() => {
        setSmsDeliveryToast(false);
      }, 6000);

      return () => clearTimeout(toastTimer);
    }
  }, [isOpen, expectedOtpCode]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: any;
    if (isOpen && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, resendCountdown]);

  if (!isOpen) return null;

  // Handle single digit change
  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);
    const cleaned = value.replace(/\D/g, '');

    // If pasted whole 6 digits
    if (cleaned.length > 1) {
      const pastedChars = cleaned.slice(0, 6).split('');
      const newDigits = [...digits];
      pastedChars.forEach((ch, i) => {
        if (i < 6) newDigits[i] = ch;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pastedChars.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned.slice(-1);
    setDigits(newDigits);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace and Arrow keys
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleVerify();
    }
  };

  // Resend OTP Simulation
  const handleResend = () => {
    if (resendCountdown > 0 || isSendingOtp) return;
    setIsSendingOtp(true);
    setErrorMsg(null);

    // Generate new random 6-digit OTP
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setTimeout(() => {
      setActiveOtp(generated);
      setDigits(['', '', '', '', '', '']);
      setResendCountdown(60);
      setIsSendingOtp(false);
      setSmsDispatched(true);
      setSmsDeliveryToast(true);
      inputRefs.current[0]?.focus();

      setTimeout(() => {
        setSmsDeliveryToast(false);
      }, 6000);
    }, 700);
  };

  // Quick fill helper for testing / invigilators
  const handleAutoFill = () => {
    const chars = activeOtp.split('');
    setDigits(chars);
    setErrorMsg(null);
    inputRefs.current[5]?.focus();
  };

  // Submit and verify OTP
  const handleVerify = () => {
    const entered = digits.join('');
    if (entered.length < 6) {
      setErrorMsg(
        language === 'hi'
          ? 'कृपया पूरा 6-अंकीय ओटीपी प्रविष्ट करें।'
          : 'Please enter all 6 digits of the authentication OTP.'
      );
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (entered === activeOtp) {
        setVerificationPassed(true);
        setTimeout(() => {
          onSuccess();
        }, 600);
      } else {
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);

        if (nextAttempts <= 0) {
          setErrorMsg(
            language === 'hi'
              ? 'प्रयास सीमा समाप्त! कृपया परीक्षा अधीक्षक अथवा नोडल इनविजिलेटर से नया ओटीपी कोड प्राप्त करें।'
              : 'Max attempts reached! Please contact the Center Superintendent or Invigilator to unlock session.'
          );
        } else {
          setErrorMsg(
            language === 'hi'
              ? `गलत ओटीपी! कृपया पंजीकृत मोबाइल नंबर पर प्राप्त कोड जांचें। शेष प्रयास: ${nextAttempts}`
              : `Incorrect OTP! Please check the code sent to your registered mobile. Attempts left: ${nextAttempts}`
          );
        }
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-modal-title"
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold shadow-xs">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {language === 'hi' ? 'द्वि-स्तरीय प्रमाणीकरण' : 'Two-Tier CBT Security'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  SCVT • DTE UP
                </span>
              </div>
              <h2 id="otp-modal-title" className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {language === 'hi'
                  ? 'उम्मीदवार ओटीपी प्रमाणीकरण'
                  : 'Trainee OTP Authentication'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Simulated SMS Push Notification Banner */}
        {smsDeliveryToast && (
          <div className="mb-4 p-3 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">
                  SMS from <strong>VD-UPGOVT</strong> (OTP: <span className="font-mono font-bold text-amber-400">{activeOtp}</span>)
                </p>
                <p className="text-[11px] text-slate-400">
                  {`Do not share with anyone. Valid for UP ITI CBT login.`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-[11px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-md shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              {language === 'hi' ? 'स्वतः भरें' : 'Auto Fill'}
            </button>
          </div>
        )}

        {/* Trainee Roll & Exam Binding Details */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-semibold">Trainee Candidate</span>
              <span className="font-bold text-slate-900 truncate block">{studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-semibold">NCVT Roll Number</span>
              <span className="font-mono font-bold text-slate-900">{rollNumber}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>SMS Dispatched to: <strong className="text-slate-800 font-mono">{registeredMobile}</strong></span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {language === 'hi' ? 'पंजीकृत सिम सत्यापित' : 'SIM Verified'}
            </span>
          </div>
        </div>

        {/* OTP Input Fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-orange-600" />
              <span>{language === 'hi' ? '6-अंकीय ओटीपी प्रविष्ट करें:' : 'Enter 6-Digit Verification Code:'}</span>
            </label>
            <span className="text-[11px] text-slate-500">
              Demo OTP: <strong className="font-mono text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">{activeOtp}</strong>
            </span>
          </div>

          {/* 6 Digit Box Grid */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                id={`otp-input-digit-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isVerifying || verificationPassed || attemptsLeft <= 0}
                className={`w-full aspect-square text-center font-mono font-black text-xl sm:text-2xl rounded-xl border-2 transition-all outline-hidden ${
                  digit 
                    ? 'border-orange-500 bg-orange-50/30 text-slate-900 shadow-2xs' 
                    : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100'
                } ${errorMsg ? 'border-rose-300 bg-rose-50/20' : ''}`}
              />
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success State Notification */}
          {verificationPassed && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'hi'
                  ? 'ओटीपी सफलतापूर्वक सत्यापित! सीबीटी परीक्षा टर्मिनल अनलॉक हो रहा है...'
                  : 'OTP verified successfully! Initializing and unlocking CBT exam terminal...'}
              </span>
            </div>
          )}

          {/* Resend & Attempts Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="text-[11px]">
              {language === 'hi' ? 'शेष प्रयास: ' : 'Attempts allowed: '}
              <strong className={attemptsLeft <= 1 ? 'text-rose-600 font-bold' : 'text-slate-800 font-bold'}>
                {attemptsLeft} / 3
              </strong>
            </span>

            <div className="flex items-center gap-1.5">
              {resendCountdown > 0 ? (
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{language === 'hi' ? 'पुनः भेजें: ' : 'Resend OTP in: '}</span>
                  <strong className="font-mono text-slate-800 font-bold">{resendCountdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isSendingOtp || attemptsLeft <= 0}
                  className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'ओटीपी पुनः भेजें' : 'Resend OTP Code'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Invigilator Instructions & Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Encrypted with SCVT Nodal State Server Key</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying || verificationPassed || attemptsLeft <= 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...'}</span>
                </>
              ) : verificationPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>{language === 'hi' ? 'सत्यापित!' : 'Verified!'}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>{language === 'hi' ? 'सत्यापित कर सीबीटी शुरू करें' : 'Verify & Launch CBT'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
