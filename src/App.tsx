import React, { useState } from 'react';
import { Language, ExamResult, UserRole, AuthenticatedUser } from './types';
import { DEFAULT_PORTAL_USERS } from './data';
import { Navbar } from './components/Navbar';
import { LibraryView } from './components/LibraryView';
import { CBTExamEngine } from './components/CBTExamEngine';
import { MoodleIntegrationPanel } from './components/MoodleIntegrationPanel';
import { HostingerDeployPanel } from './components/HostingerDeployPanel';
import { DirectorateDashboard } from './components/DirectorateDashboard';
import { CentralContentAssessmentView } from './components/CentralContentAssessmentView';
import { ITIAdminPortal } from './components/ITIAdminPortal';
import { TraineePortal } from './components/TraineePortal';
import { LoginModal } from './components/LoginModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Check, UserCheck, ShieldCheck, LogIn, LogOut } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('directorate');
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(DEFAULT_PORTAL_USERS[0]);
  const [currentTab, setCurrentTab] = useState<'role_dashboard' | 'library' | 'cbt' | 'moodle' | 'hostinger'>('role_dashboard');
  const [language, setLanguage] = useState<Language>('hi'); // Default Hindi for UP ITI with instant toggle
  const [targetTradeId, setTargetTradeId] = useState<string>('electrician');
  const [examInProgress, setExamInProgress] = useState<boolean>(false);
  const [syncedNotification, setSyncedNotification] = useState<string | null>(null);

  // Authentication Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [loginTargetRole, setLoginTargetRole] = useState<UserRole>('directorate');

  const handleOpenLogin = (role?: UserRole) => {
    setLoginTargetRole(role || currentRole);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setSyncedNotification(
      language === 'hi'
        ? `सफलतापूर्वक लॉगिन: ${user.name} (${user.designation.hi})`
        : `Successfully Logged In: ${user.name} (${user.designation.en})`
    );
    setTimeout(() => setSyncedNotification(null), 5000);
  };

  const handleLogout = () => {
    const prevName = currentUser?.name;
    setCurrentUser(null);
    setSyncedNotification(
      language === 'hi'
        ? `उपयोगकर्ता सत्र समाप्त कर दिया गया है।`
        : `Session logged out successfully.`
    );
    setTimeout(() => setSyncedNotification(null), 4000);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // Auto-sync matching demo user for seamless stakeholder preview
    const matchingUser = DEFAULT_PORTAL_USERS.find((u) => u.role === newRole);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    }
  };

  const handleLaunchPracticeTest = (tradeId: string) => {
    setTargetTradeId(tradeId);
    setCurrentTab('cbt');
    setExamInProgress(true);
  };

  const handleSyncToMoodle = (result: ExamResult) => {
    setSyncedNotification(
      language === 'hi'
        ? `रोल नं ${result.rollNumber} के अंक (${result.score}/${result.totalMarks}) सफलतापूर्वक मूडल एलएमएस में सिंक कर दिए गए हैं!`
        : `Successfully pushed score (${result.score}/${result.totalMarks}) for Roll ${result.rollNumber} to Moodle Gradebook!`
    );
    setTimeout(() => {
      setSyncedNotification(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Universal Government ITI Header with 4 User Stakeholders & Login Module */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'cbt') {
            setExamInProgress(false);
          }
        }}
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        language={language}
        setLanguage={setLanguage}
        examInProgress={examInProgress}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Global Moodle Sync Toast Notification */}
      {syncedNotification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4 w-full">
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600" />
              <span>{syncedNotification}</span>
            </div>
            <span className="text-[11px] bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded font-mono">
              wstoken verified
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {/* Dynamic Role-Based Desk View */}
        {currentTab === 'role_dashboard' && (
          <>
            {currentRole === 'directorate' && (
              <DirectorateDashboard
                language={language}
                onNavigateToTab={(tab) => {
                  setCurrentTab(tab);
                  if (tab === 'cbt') setExamInProgress(true);
                }}
              />
            )}

            {currentRole === 'central_content' && (
              <CentralContentAssessmentView
                language={language}
                onNavigateToTab={(tab) => {
                  setCurrentTab(tab);
                  if (tab === 'cbt') setExamInProgress(true);
                }}
              />
            )}

            {currentRole === 'iti_admin' && (
              <ITIAdminPortal
                language={language}
                onLaunchPracticeTest={handleLaunchPracticeTest}
                onNavigateToTab={(tab) => {
                  setCurrentTab(tab);
                  if (tab === 'cbt') setExamInProgress(true);
                }}
              />
            )}

            {currentRole === 'trainee' && (
              <TraineePortal
                language={language}
                onLaunchCBT={handleLaunchPracticeTest}
                onOpenLibrary={(tradeId) => {
                  setTargetTradeId(tradeId);
                  setCurrentTab('library');
                }}
              />
            )}
          </>
        )}

        {currentTab === 'library' && (
          <LibraryView
            language={language}
            onLaunchPracticeTest={handleLaunchPracticeTest}
          />
        )}

        {currentTab === 'cbt' && (
          <CBTExamEngine
            language={language}
            targetTradeId={targetTradeId}
            onExitExam={() => {
              setExamInProgress(false);
              setCurrentTab('role_dashboard');
            }}
            onSyncToMoodle={handleSyncToMoodle}
          />
        )}

        {currentTab === 'moodle' && (
          <MoodleIntegrationPanel language={language} />
        )}

        {currentTab === 'hostinger' && (
          <HostingerDeployPanel language={language} />
        )}
      </main>

      {/* Official State Portal Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-200">
              {language === 'hi'
                ? 'व्यावसायिक शिक्षा एवं कौशल विकास विभाग, उत्तर प्रदेश शासन'
                : 'Department of Vocational Education & Skill Development, Govt. of Uttar Pradesh'}
            </p>
            <p className="text-[11px] text-slate-500">
              4 User Roles: Directorate (निदेशालय) • Central Assessment Cell • ITI Institutes • Trainees (छात्र)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => {
                setCurrentRole('directorate');
                setCurrentTab('role_dashboard');
              }}
              className="hover:text-amber-400 transition-colors"
            >
              {language === 'hi' ? '1. निदेशालय' : '1. Directorate'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentRole('central_content');
                setCurrentTab('role_dashboard');
              }}
              className="hover:text-amber-400 transition-colors"
            >
              {language === 'hi' ? '2. परीक्षा प्रकोष्ठ' : '2. Central Content'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentRole('iti_admin');
                setCurrentTab('role_dashboard');
              }}
              className="hover:text-amber-400 transition-colors"
            >
              {language === 'hi' ? '3. आईटीआई संस्थान' : '3. ITIs'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentRole('trainee');
                setCurrentTab('role_dashboard');
              }}
              className="hover:text-amber-400 transition-colors"
            >
              {language === 'hi' ? '4. छात्र पोर्टल' : '4. Trainees'}
            </button>
          </div>
        </div>
      </footer>

      {/* Universal Users Login Modal */}
      <LoginModal
        language={language}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        targetRole={loginTargetRole}
        currentUser={currentUser}
      />

      {/* User Profile / Active Session Modal */}
      {currentUser && (
        <UserProfileModal
          language={language}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
          onSwitchAccount={() => handleOpenLogin(currentRole)}
        />
      )}
    </div>
  );
}
