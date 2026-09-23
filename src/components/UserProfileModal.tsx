import React, { useState } from 'react';
import { Language, AuthenticatedUser } from '../types';
import {
  User,
  ShieldCheck,
  Building,
  Mail,
  Smartphone,
  Calendar,
  LogOut,
  CheckCircle2,
  KeyRound,
  ExternalLink,
  ChevronDown,
  X,
} from 'lucide-react';

interface UserProfileModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  user: AuthenticatedUser;
  onLogout: () => void;
  onSwitchAccount: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  language,
  isOpen,
  onClose,
  user,
  onLogout,
  onSwitchAccount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-profile-title"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white/20">
              {user.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                  {user.role.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Active Session
                </span>
              </div>
              <h2 id="user-profile-title" className="text-base sm:text-lg font-bold text-white mt-1">
                {user.name}
              </h2>
              <p className="text-xs text-slate-300">
                {language === 'hi' ? user.designation.hi : user.designation.en}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="p-5 space-y-3.5 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold text-[11px]">Institute / Department:</span>
              <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
                {user.departmentOrITI}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold text-[11px]">ID / Roll Number:</span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {user.employeeOrRollId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold text-[11px]">Official Email:</span>
              <span className="font-mono text-slate-700">{user.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold text-[11px]">Registered Mobile:</span>
              <span className="font-mono text-slate-700">{user.mobile}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-semibold text-[11px]">Session Started:</span>
              <span className="text-slate-600">{user.lastLogin}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-[11px] text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {language === 'hi' ? 'दो-चरणीय सुरक्षा सत्यापित (2FA Active)' : 'Two-Factor Protected Session'}
              </p>
              <p className="text-amber-800">
                {language === 'hi'
                  ? 'यह सत्र उत्तर प्रदेश कौशल विकास एवं प्रशिक्षण निदेशालय के सर्वर से सीधे एन्क्रिप्टेड है।'
                  : 'Authenticated directly with Directorate of Training & SCVT Lucknow Gateway.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchAccount();
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'hi' ? 'खाता बदलें' : 'Switch Stakeholder'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>{language === 'hi' ? 'लॉगआउट' : 'Logout Session'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
