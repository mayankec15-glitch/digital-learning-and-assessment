export type Language = 'hi' | 'en';

export type PortalTheme = 'imperial_navy' | 'modern_emerald' | 'executive_dark';

export type TradeCategory = 'engineering' | 'non-engineering' | 'workshop-common';

export interface Trade {
  id: string;
  code: string;
  name: {
    en: string;
    hi: string;
  };
  category: TradeCategory;
  duration: string;
  semesterCount: number;
  icon: string;
  description: {
    en: string;
    hi: string;
  };
  totalBooks: number;
  totalQuestions: number;
}

export type ResourceType = 'pdf' | 'video' | 'practical' | 'question-bank';

export interface LibraryResource {
  id: string;
  tradeId: string;
  yearOrSem: number;
  subject: 'Trade Theory' | 'Trade Practical' | 'Workshop Calculation & Science' | 'Engineering Drawing' | 'Employability Skills';
  title: {
    en: string;
    hi: string;
  };
  authorOrSource: string; // e.g. "NIMI / DGT Bharat Skills"
  type: ResourceType;
  fileSize?: string;
  duration?: string;
  downloadUrl: string;
  isNimiStandard: boolean;
  tags: string[];
  summary: {
    en: string;
    hi: string;
  };
  readTime?: string;
}

export interface Question {
  id: string;
  tradeId: string;
  module: string;
  questionNumber: number;
  text: {
    en: string;
    hi: string;
  };
  diagramUrl?: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    text: {
      en: string;
      hi: string;
    };
  }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: {
    en: string;
    hi: string;
  };
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type QuestionStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked';

export interface ExamSession {
  examId: string;
  title: {
    en: string;
    hi: string;
  };
  tradeId: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  statusMap: Record<string, QuestionStatus>;
  timeRemainingSeconds: number;
  startedAt: string;
  isSubmitted: boolean;
}

export interface ExamResult {
  examId: string;
  examTitle: string;
  tradeName: string;
  studentName: string;
  rollNumber: string;
  itiName: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTakenMinutes: number;
  passed: boolean;
  subjectBreakdown: {
    subject: string;
    total: number;
    score: number;
  }[];
}

export interface MoodleConfig {
  hostUrl: string;
  wsToken: string;
  courseId: string;
  quizId: string;
  autoSyncGrades: boolean;
  exportFormat: 'GIFT' | 'MoodleXML' | 'CSV';
  connected: boolean;
}

export interface ITIInstitute {
  code: string;
  name: string;
  district: string;
  type: 'Government' | 'Private';
  id?: string;
  zone?: string;
  email?: string;
  phone?: string;
  address?: string;
  totalSeats?: number;
  affiliatedTradesCount?: number;
}

export type UserRole = 'directorate' | 'central_content' | 'iti_admin' | 'trainee';

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  designation: {
    en: string;
    hi: string;
  };
  departmentOrITI: string;
  avatarInitials: string;
  email: string;
  mobile: string;
  employeeOrRollId: string;
  lastLogin: string;
  token?: string;
  twoFactorEnabled?: boolean;
}

export interface RoleInfo {
  id: UserRole;
  title: {
    en: string;
    hi: string;
  };
  badge: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  icon: string;
}

export interface DirectorateDistrictSummary {
  district: string;
  division: string;
  totalITIs: number;
  enrolledStudents: number;
  testsCompleted: number;
  passPercentage: number;
  topTrade: string;
  averageAttendancePct: number;
  status: 'excellent' | 'normal' | 'attention';
}

export interface StateCircular {
  id: string;
  number: string;
  date: string;
  title: {
    en: string;
    hi: string;
  };
  category: 'Examination' | 'Curriculum' | 'Administration' | 'Admissions';
  downloadSize: string;
  signedBy: string;
  isUrgent: boolean;
}

export interface AssessmentBlueprint {
  id: string;
  title: {
    en: string;
    hi: string;
  };
  tradeId: string;
  examType: 'Annual AITT CBT' | 'Monthly Unit Test' | 'Semester Mid-Term';
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  passingPercentage: number;
  negativeMarking: boolean;
  sections: {
    name: string;
    questionCount: number;
    marksPerQuestion: number;
  }[];
  active: boolean;
}

export interface ITIBatch {
  id: string;
  itiCode: string;
  tradeId: string;
  batchYear: string;
  semester: number;
  section: string;
  totalTrainees: number;
  cbtEligibleCount: number;
  instructorName: string;
  averageScorePct: number;
}

export interface ITILabSession {
  id: string;
  itiCode: string;
  labName: string;
  totalPCs: number;
  activeTrade: string;
  shift: 'Morning (09:30 - 11:30)' | 'Afternoon (12:30 - 02:30)' | 'Evening (03:30 - 05:30)';
  scheduledDate: string;
  status: 'Ready' | 'In-Progress' | 'Completed';
  invigilator: string;
}

export interface TraineeAccount {
  id: string;
  rollNumber: string;
  fullName: string;
  tradeId: string;
  itiCode: string;
  itiName?: string;
  semester: number;
  registrationYear: string;
  fatherName: string;
  category: string;
  mobile: string;
  email?: string;
  password?: string;
  dob?: string;
  gender?: string;
  aadhaarLast4?: string;
  mockTestsTaken: number;
  averageScore: number;
  lastTestDate?: string;
  status: 'Active' | 'Exam Registered' | 'Suspended';
  uploadedBy?: 'Directorate' | 'ITI Admin';
  createdAt?: string;
}

export interface TraineeMistakeItem {
  questionId: string;
  tradeId: string;
  questionText: {
    en: string;
    hi: string;
  };
  selectedOption: string;
  correctOption: string;
  explanation: {
    en: string;
    hi: string;
  };
  topic: string;
}

export interface ScheduledStateExam {
  id: string;
  title: { en: string; hi: string };
  tradeId: string;
  examType: string;
  dateRange: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  targetITIs: string;
  passcode: string;
  status: 'Live' | 'Scheduled' | 'Completed';
  registeredCount: number;
  // Statewide Activation Time & Window
  activationStartTime: string; // e.g. "2026-03-05T09:30:00" or ISO format
  activationEndTime: string;   // e.g. "2026-03-08T17:30:00"
  shiftTimeSlot?: string;      // e.g. "Shift 1: 09:30 AM - 11:30 AM"
  timeRemainingSeconds?: number;
  isActivatedNow: boolean;
  // Branch & District Assignments
  assignedBranches?: {
    code: string;
    name: string;
    district: string;
    terminalCount: number;
    supervisorName: string;
    status: 'Ready' | 'Assigned' | 'Live';
  }[];
  targetDistricts?: string[];
  // Two-Factor / Invigilator OTP Authentication
  requiresOtpAuth: boolean;
  demoOtpCode?: string;       // Master/center generated 6-digit OTP
  invigilatorName?: string;
  otpCooldownSeconds?: number;
}
