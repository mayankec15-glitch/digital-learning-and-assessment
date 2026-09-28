-- =========================================================================
-- DEPARTMENT OF VOCATIONAL EDUCATION & SKILL DEVELOPMENT, GOVT. OF UP
-- UP ITI Centralized CBT & LMS Portal - Supabase Pilot Database Schema
-- Pilot Test: 2-3 ITI Colleges (e.g. Govt ITI Aliganj, Pandu Nagar, Naini)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ITI INSTITUTES
CREATE TABLE IF NOT EXISTS iti_institutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iti_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    center_passcode VARCHAR(50) NOT NULL DEFAULT 'ITI2026',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed 3 Pilot ITIs
INSERT INTO iti_institutes (iti_code, name, district, center_passcode) VALUES
('ITI-0101', 'Govt. ITI Aliganj', 'Lucknow', 'LKO0101'),
('ITI-0102', 'Govt. ITI Pandu Nagar', 'Kanpur Nagar', 'KNP0102'),
('ITI-0103', 'Govt. ITI Naini', 'Prayagraj', 'PRY0103')
ON CONFLICT (iti_code) DO NOTHING;

-- 2. CANDIDATES / TRAINEES
CREATE TABLE IF NOT EXISTS trainees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    iti_code VARCHAR(30) REFERENCES iti_institutes(iti_code),
    trade_id VARCHAR(50) NOT NULL,
    trade_name VARCHAR(100) NOT NULL,
    semester INT DEFAULT 1,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Sample Trainees for Pilot
INSERT INTO trainees (roll_number, name, iti_code, trade_id, trade_name) VALUES
('UP230809110042', 'Pooja Verma', 'ITI-0101', 'electrician', 'Electrician'),
('UP230809110043', 'Aman Sharma', 'ITI-0101', 'fitter', 'Fitter'),
('UP230809110044', 'Rohan Yadav', 'ITI-0102', 'electrician', 'Electrician'),
('UP230809110045', 'Sneha Singh', 'ITI-0102', 'copa', 'COPA'),
('UP230809110046', 'Vikas Gupta', 'ITI-0103', 'welder', 'Welder')
ON CONFLICT (roll_number) DO NOTHING;

-- 3. EXAM SESSIONS (Active CBT Exams)
CREATE TABLE IF NOT EXISTS exam_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    iti_code VARCHAR(30) NOT NULL,
    trade_id VARCHAR(50) NOT NULL,
    terminal_id VARCHAR(50) NOT NULL,
    jwt_jti VARCHAR(100),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_submitted BOOLEAN DEFAULT FALSE,
    score NUMERIC(5,2) DEFAULT 0,
    total_marks NUMERIC(5,2) DEFAULT 50,
    moodle_synced BOOLEAN DEFAULT FALSE,
    moodle_sync_time TIMESTAMP WITH TIME ZONE
);

-- 4. REAL-TIME ANSWER JOURNAL (Buffered auto-saves)
CREATE TABLE IF NOT EXISTS answer_journal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    question_id INT NOT NULL,
    selected_option INT NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PERFORMANCE INDEXES (Optimized for concurrent student writes)
CREATE INDEX IF NOT EXISTS idx_exam_sessions_roll ON exam_sessions(roll_number);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_iti ON exam_sessions(iti_code);
CREATE INDEX IF NOT EXISTS idx_answer_journal_session ON answer_journal(session_id);
CREATE INDEX IF NOT EXISTS idx_answer_journal_roll ON answer_journal(roll_number);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainees ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read & insert for pilot test portal (keyed by roll number)
CREATE POLICY "Public Read Trainees" ON trainees FOR SELECT USING (true);
CREATE POLICY "Public Manage Sessions" ON exam_sessions FOR ALL USING (true);
CREATE POLICY "Public Manage Answers" ON answer_journal FOR ALL USING (true);
