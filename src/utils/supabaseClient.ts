/**
 * Supabase Client Integration for UP ITI Pilot Testing
 * Supports 2-3 ITI Colleges (e.g. Govt ITI Aliganj, Pandu Nagar, Naini)
 */

export interface PilotTraineeRecord {
  roll_number: string;
  name: string;
  iti_code: string;
  trade_id: string;
  trade_name: string;
}

export interface PilotExamSession {
  session_id: string;
  roll_number: string;
  iti_code: string;
  trade_id: string;
  terminal_id: string;
  score?: number;
  total_marks?: number;
  is_submitted?: boolean;
}

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Record a live exam start event in Supabase PostgreSQL
 */
export async function recordSupabaseExamStart(session: PilotExamSession): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/exam_sessions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        session_id: session.session_id,
        roll_number: session.roll_number,
        iti_code: session.iti_code,
        trade_id: session.trade_id,
        terminal_id: session.terminal_id,
        started_at: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Supabase Pilot] Offline or error recording start:', err);
    return false;
  }
}

/**
 * Record student answer response in Supabase PostgreSQL
 */
export async function recordSupabaseAnswer(
  sessionId: string,
  rollNumber: string,
  questionId: number,
  selectedOption: number
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/answer_journal`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        session_id: sessionId,
        roll_number: rollNumber,
        question_id: questionId,
        selected_option: selectedOption,
        answered_at: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Update final exam score in Supabase PostgreSQL
 */
export async function updateSupabaseExamResult(
  sessionId: string,
  score: number,
  totalMarks: number
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/exam_sessions?session_id=eq.${sessionId}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        is_submitted: true,
        score,
        total_marks: totalMarks,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Supabase Pilot] Score sync error:', err);
    return false;
  }
}
