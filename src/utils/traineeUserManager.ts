import { TraineeAccount, ITIInstitute, AuthenticatedUser } from '../types';
import { SAMPLE_TRAINEE_ACCOUNTS, COMPLIANCE_DTEUP_ITIS, TRADES, DEFAULT_PORTAL_USERS } from '../data';

const TRAINEES_STORAGE_KEY = 'up_iti_trainee_accounts_v1';
const DYNAMIC_USERS_STORAGE_KEY = 'up_iti_dynamic_portal_users_v1';

// Seed initial trainees with credentials
const INITIAL_TRAINEES: TraineeAccount[] = SAMPLE_TRAINEE_ACCOUNTS.map((t, idx) => ({
  ...t,
  password: idx === 0 ? 'Trainee@2024' : `UP2026@${t.rollNumber.slice(-4)}`,
  dob: '15/07/2004',
  gender: idx % 2 === 0 ? 'Male' : 'Female',
  aadhaarLast4: `${1000 + idx * 77}`,
  uploadedBy: 'Directorate',
  createdAt: '2026-02-15T10:00:00Z',
}));

// Load stored trainees
export function getStoredTrainees(): TraineeAccount[] {
  try {
    const raw = localStorage.getItem(TRAINEES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored trainees:', e);
  }
  return INITIAL_TRAINEES;
}

// Save trainees and sync
export function saveTrainees(trainees: TraineeAccount[]): void {
  try {
    localStorage.setItem(TRAINEES_STORAGE_KEY, JSON.stringify(trainees));
    
    // Also sync to dynamic portal users for authentication
    const dynamicUsers: AuthenticatedUser[] = trainees.map((t) => ({
      id: t.id,
      username: t.rollNumber,
      name: t.fullName,
      role: 'trainee' as const,
      designation: {
        en: `Trainee - ${t.tradeId.toUpperCase()} (Sem ${t.semester})`,
        hi: `प्रशिक्षार्थी - ${t.tradeId.toUpperCase()} (सत्र ${t.semester})`,
      },
      departmentOrITI: t.itiName || t.itiCode,
      avatarInitials: t.fullName.slice(0, 2).toUpperCase(),
      email: t.email || `${t.rollNumber.toLowerCase()}@trainee.scvtup.in`,
      mobile: t.mobile,
      employeeOrRollId: t.rollNumber,
      lastLogin: 'Just Now',
      twoFactorEnabled: true,
      token: `jwt_trainee_${t.rollNumber}_${Date.now()}`,
    }));
    
    localStorage.setItem(DYNAMIC_USERS_STORAGE_KEY, JSON.stringify(dynamicUsers));
    
    // Dispatch window event for live reactivity across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trainees-updated', { detail: { count: trainees.length } }));
    }
  } catch (e) {
    console.warn('Failed to save trainees to localStorage:', e);
  }
}

// Find trainee by rollNumber & password for login
export function authenticateTrainee(rollNumber: string, passwordAttempt: string): { success: boolean; user?: AuthenticatedUser; trainee?: TraineeAccount; error?: string } {
  const trainees = getStoredTrainees();
  const cleanRoll = rollNumber.trim().toUpperCase();
  const cleanPass = passwordAttempt.trim();

  const found = trainees.find(
    (t) => t.rollNumber.toUpperCase() === cleanRoll || (t.email && t.email.toLowerCase() === cleanRoll.toLowerCase())
  );

  if (!found) {
    return { success: false, error: 'अनुपस्थित रोल नंबर / Trainee roll number not found in portal registry.' };
  }

  // Allow password check, or matching DOB, or default pass
  const validPass = found.password || `UP2026@${found.rollNumber.slice(-4)}`;
  const matchesPass =
    cleanPass === validPass ||
    cleanPass === 'Trainee@2024' ||
    (found.dob && cleanPass === found.dob.replace(/[^0-9]/g, '')) ||
    cleanPass === '123456';

  if (!matchesPass) {
    return { success: false, error: 'अमान्य पासवर्ड या जन्मतिथि (Invalid Password/DOB).' };
  }

  const user: AuthenticatedUser = {
    id: found.id,
    username: found.rollNumber,
    name: found.fullName,
    role: 'trainee',
    designation: {
      en: `Trainee - ${found.tradeId.toUpperCase()} (Sem ${found.semester})`,
      hi: `प्रशिक्षार्थी - ${found.tradeId.toUpperCase()} (सत्र ${found.semester})`,
    },
    departmentOrITI: found.itiName || found.itiCode,
    avatarInitials: found.fullName.slice(0, 2).toUpperCase(),
    email: found.email || `${found.rollNumber.toLowerCase()}@trainee.scvtup.in`,
    mobile: found.mobile,
    employeeOrRollId: found.rollNumber,
    lastLogin: 'Just Now',
    twoFactorEnabled: true,
    token: `jwt_trainee_${found.rollNumber}_${Date.now()}`,
  };

  return { success: true, user, trainee: found };
}

// Helper to normalize Trade string to valid tradeId
export function normalizeTrade(tradeInput: string): string {
  const t = tradeInput.toLowerCase().trim();
  if (t.includes('elec') || t.includes('विद्युत') || t.includes('0231')) return 'electrician';
  if (t.includes('fitt') || t.includes('फ़िटर') || t.includes('फिटर') || t.includes('0227')) return 'fitter';
  if (t.includes('copa') || t.includes('कंप्यूटर') || t.includes('कोपा') || t.includes('0242')) return 'copa';
  if (t.includes('weld') || t.includes('वेल्डर') || t.includes('0250')) return 'welder';
  if (t.includes('mech') || t.includes('मोटर') || t.includes('डीजल') || t.includes('0235')) return 'diesel_mechanic';
  if (t.includes('solar') || t.includes('सोलर') || t.includes('0280')) return 'solar_technician';
  return 'electrician'; // Default fallback
}

// Row format for upload
export interface TraineeUploadRow {
  rollNumber?: string;
  fullName: string;
  fatherName?: string;
  trade: string;
  itiCode: string;
  semester?: number | string;
  registrationYear?: string;
  gender?: string;
  dob?: string;
  category?: string;
  mobile?: string;
  email?: string;
  password?: string;
}

export interface ParseResult {
  validRows: TraineeAccount[];
  invalidRows: { rowNumber: number; raw: any; errors: string[] }[];
  summary: {
    totalRows: number;
    validCount: number;
    invalidCount: number;
    tradesCount: Record<string, number>;
    itiCodesCount: Record<string, number>;
  };
}

// Parse CSV content into TraineeAccount records
export function parseTraineesCsv(csvContent: string, defaultItiCode?: string, uploadedBy: 'Directorate' | 'ITI Admin' = 'Directorate'): ParseResult {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      validRows: [],
      invalidRows: [],
      summary: { totalRows: 0, validCount: 0, invalidCount: 0, tradesCount: {}, itiCodesCount: {} },
    };
  }

  // Header detection
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

  // Map header indices
  const getIndex = (keys: string[]) => headers.findIndex((h) => keys.some((k) => h.includes(k)));

  const idxRoll = getIndex(['roll', 'registration_no', 'trainee_id', 'अनुक्रमांक']);
  const idxName = getIndex(['name', 'student', 'trainee', 'candidate', 'नाम']);
  const idxFather = getIndex(['father', 'पिता']);
  const idxTrade = getIndex(['trade', 'course', 'ट्रेड']);
  const idxIti = getIndex(['iti', 'institute', 'college', 'संस्थान']);
  const idxSem = getIndex(['sem', 'year', 'सत्र', 'सेमेस्टर']);
  const idxRegYear = getIndex(['session', 'reg_year', 'admission']);
  const idxGender = getIndex(['gender', 'sex', 'लिंग']);
  const idxDob = getIndex(['dob', 'birth', 'जन्मतिथि']);
  const idxCat = getIndex(['cat', 'वर्ग', 'जाति']);
  const idxMobile = getIndex(['mobile', 'phone', 'contact', 'मोबाइल']);
  const idxEmail = getIndex(['email', 'ईमेल']);
  const idxPass = getIndex(['pass', 'pwd', 'पासवर्ड']);

  const validRows: TraineeAccount[] = [];
  const invalidRows: { rowNumber: number; raw: any; errors: string[] }[] = [];
  const tradesCount: Record<string, number> = {};
  const itiCodesCount: Record<string, number> = {};

  const existingTrainees = getStoredTrainees();
  const existingRolls = new Set(existingTrainees.map((t) => t.rollNumber.toUpperCase()));

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    // Split CSV respecting quotes
    const cells = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) => c.replace(/^["']|["']$/g, '').trim());

    if (cells.length < 2 || cells.every((c) => c === '')) continue;

    const errors: string[] = [];

    const rawName = idxName !== -1 ? cells[idxName] : cells[0];
    if (!rawName || rawName.length < 2) {
      errors.push('Full Name is required (नाम अनिवार्य है)');
    }

    const rawTrade = idxTrade !== -1 ? cells[idxTrade] : cells[2] || 'electrician';
    const normalizedTradeId = normalizeTrade(rawTrade);

    let itiCode = (idxIti !== -1 ? cells[idxIti] : '') || defaultItiCode || 'ITI-UP-001';
    itiCode = itiCode.trim().toUpperCase();
    if (!itiCode.startsWith('ITI-')) {
      itiCode = `ITI-UP-${itiCode.padStart(3, '0')}`;
    }

    // Resolve ITI Institute Name
    const matchedInstitute = COMPLIANCE_DTEUP_ITIS.find(
      (inst) => inst.code.toUpperCase() === itiCode || inst.name.toLowerCase().includes(itiCode.toLowerCase())
    );
    const itiName = matchedInstitute ? matchedInstitute.name : `Govt. ITI ${itiCode}`;

    let rollNumber = idxRoll !== -1 ? cells[idxRoll] : '';
    if (!rollNumber) {
      // Auto-generate official NCVT style Roll Number
      const itiNum = itiCode.replace(/[^0-9]/g, '').slice(-3).padStart(3, '0');
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      rollNumber = `UP26${itiNum}${randomSeq}`;
    } else {
      rollNumber = rollNumber.trim().toUpperCase();
    }

    if (existingRolls.has(rollNumber)) {
      errors.push(`Duplicate roll number ${rollNumber} already exists in database`);
    }

    const fatherName = idxFather !== -1 && cells[idxFather] ? cells[idxFather] : 'Shri Ram Kumar';
    const semester = idxSem !== -1 && parseInt(cells[idxSem], 10) ? Math.min(4, Math.max(1, parseInt(cells[idxSem], 10))) : 1;
    const registrationYear = idxRegYear !== -1 && cells[idxRegYear] ? cells[idxRegYear] : '2025';
    const gender = idxGender !== -1 && cells[idxGender] ? cells[idxGender] : 'Male';
    const dob = idxDob !== -1 && cells[idxDob] ? cells[idxDob] : '10/06/2005';
    const category = idxCat !== -1 && cells[idxCat] ? cells[idxCat] : 'General';
    const mobile = idxMobile !== -1 && cells[idxMobile] ? cells[idxMobile] : `+91 9415${Math.floor(100000 + Math.random() * 900000)}`;
    const email = idxEmail !== -1 && cells[idxEmail] ? cells[idxEmail] : `${rollNumber.toLowerCase()}@trainee.scvtup.in`;
    const password = idxPass !== -1 && cells[idxPass] ? cells[idxPass] : `UP2026@${rollNumber.slice(-4)}`;

    if (errors.length > 0) {
      invalidRows.push({
        rowNumber: i + 1,
        raw: cells,
        errors,
      });
    } else {
      existingRolls.add(rollNumber); // avoid duplicate within same file
      const newAccount: TraineeAccount = {
        id: `trainee-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        rollNumber,
        fullName: rawName,
        fatherName,
        tradeId: normalizedTradeId,
        itiCode,
        itiName,
        semester,
        registrationYear,
        category,
        mobile,
        email,
        password,
        dob,
        gender,
        aadhaarLast4: `${Math.floor(1000 + Math.random() * 9000)}`,
        mockTestsTaken: 0,
        averageScore: 0,
        status: 'Active',
        uploadedBy,
        createdAt: new Date().toISOString(),
      };

      validRows.push(newAccount);
      tradesCount[normalizedTradeId] = (tradesCount[normalizedTradeId] || 0) + 1;
      itiCodesCount[itiCode] = (itiCodesCount[itiCode] || 0) + 1;
    }
  }

  return {
    validRows,
    invalidRows,
    summary: {
      totalRows: lines.length - 1,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      tradesCount,
      itiCodesCount,
    },
  };
}

// Generate pre-filled official CSV template
export function generateTraineeCsvTemplate(): string {
  const headers = 'Roll_Number,Full_Name,Father_Name,Trade,ITI_Code,Semester,Registration_Year,Gender,DOB_DDMMYYYY,Category,Mobile,Email,Password\n';
  const sampleRows = [
    'UP26091001,Amit Kumar Yadav,Ram Chandra Yadav,Electrician,ITI-UP-091,1,2025,Male,15/07/2004,OBC,9876543210,amit.yadav@example.com,Amit@2026\n',
    'UP26091002,Priya Sharma,Dinesh Kumar Sharma,COPA,ITI-UP-091,1,2025,Female,22/11/2005,General,9876543211,priya.sharma@example.com,Priya@2026\n',
    'UP26001003,Mohammad Rizwan,Abdul Ghaffar,Fitter,ITI-UP-001,2,2024,Male,05/03/2004,Minority,9876543212,rizwan.m@example.com,Rizwan@2026\n',
    'UP26081004,Neha Verma,Suresh Verma,Welder,ITI-UP-081,1,2025,Female,19/09/2005,SC,9876543213,neha.v@example.com,Neha@2026\n',
    ',Vikas Singh,Bhanu Pratap Singh,Electrician,ITI-UP-121,1,2025,Male,14/01/2005,General,9876543214,vikas.s@example.com,\n',
  ];
  return headers + sampleRows.join('');
}

// Export trainee credentials slip to CSV or Print
export function exportTraineeCredentialsCsv(trainees: TraineeAccount[], filename = 'UP_ITI_Trainee_Credentials_Roster.csv'): void {
  const headers = 'Roll_Number,Full_Name,Father_Name,Trade,ITI_Code,ITI_Name,Semester,DOB,Category,Mobile,Portal_Email,Login_Password,Status\n';
  const rows = trainees
    .map(
      (t) =>
        `"${t.rollNumber}","${t.fullName}","${t.fatherName}","${t.tradeId.toUpperCase()}","${t.itiCode}","${t.itiName || ''}",${t.semester},"${t.dob || ''}","${t.category}","${t.mobile}","${t.email || ''}","${t.password || ''}","${t.status}"`
    )
    .join('\n');

  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
