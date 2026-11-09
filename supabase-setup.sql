-- =================================================================================
-- SUPABASE DATABASE SETUP SCRIPT FOR AEKKARIN NEERAMON (XKAROYRESUME)
-- Project: Aekkarin Neeramon — Full-Stack & AI Automation Portfolio
-- Database: Supabase PostgreSQL
-- =================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILE TABLE: public.aekkarin_profile
CREATE TABLE IF NOT EXISTS public.aekkarin_profile (
    id SERIAL PRIMARY KEY,
    member_key VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    nickname VARCHAR(50),
    role_title VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    github_url TEXT,
    resume_url TEXT,
    bio TEXT,
    skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROJECTS TABLE: public.aekkarin_projects
CREATE TABLE IF NOT EXISTS public.aekkarin_projects (
    id SERIAL PRIMARY KEY,
    project_slug VARCHAR(100) UNIQUE NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    live_url TEXT,
    github_url TEXT,
    tech_stack TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AI CHAT LOGS TABLE: public.chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    sender VARCHAR(50) NOT NULL CHECK (sender IN ('user', 'ai', 'system')),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Backward compatibility views
CREATE OR REPLACE VIEW public.ekarin_profile AS SELECT * FROM public.aekkarin_profile;
CREATE OR REPLACE VIEW public.ekarin_projects AS SELECT * FROM public.aekkarin_projects;

-- SEED AEKKARIN NEERAMON PROFILE DATA
INSERT INTO public.aekkarin_profile (
    member_key, full_name, nickname, role_title, email, phone, github_url, resume_url, bio, skills
)
VALUES (
    'aekkarin',
    'เอกรินทร์ นีระมนต์ (Aekkarin Neeramon)',
    'เอก / Xkaroy',
    'Full-Stack Developer & AI Automation Specialist',
    'mikp1919@gmail.com',
    '091-914-5670',
    'https://github.com/Xkaroy',
    'https://resume-nu-green.vercel.app/resume/aekkarin',
    'นักพัฒนาซอฟต์แวร์ Full-Stack และผู้เชี่ยวชาญด้านระบบอัตโนมัติ AI (n8n & Make.com) จากมหาวิทยาลัยหอการค้าไทย (UTCC)',
    ARRAY['Full-Stack Web (Next.js 16 / React 19)', 'UX/UI Architecture', 'n8n Workflow Automation', 'Make.com', 'AI Automation Workflows', 'API Integration & Supabase PostgreSQL']
)
ON CONFLICT (member_key) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role_title = EXCLUDED.role_title,
    email = EXCLUDED.email,
    github_url = EXCLUDED.github_url,
    resume_url = EXCLUDED.resume_url,
    bio = EXCLUDED.bio,
    skills = EXCLUDED.skills,
    updated_at = NOW();

-- SEED AEKKARIN NEERAMON PROJECTS
INSERT INTO public.aekkarin_projects (project_slug, project_name, category, description, live_url, github_url, tech_stack)
VALUES
    ('facecheck-web', 'FaceCheck Web — Real-Time Biometric Verification', 'Full-Stack Web', 'ระบบสแกนและยืนยันตัวตนด้วยใบหน้าผ่านเว็บเบราว์เซอร์แบบ Real-time ความแม่นยำสูง', 'https://facecheck-web.vercel.app', 'https://github.com/Mickeyyok/-facecheckWeb', ARRAY['Next.js 16', 'React 19', 'Tailwind CSS', 'Biometrics']),
    ('n8n-enterprise-ai', 'Enterprise 12-Node n8n AI Portfolio & Resume Engine', 'AI Automation', 'สถาปัตยกรรม AI Automation 12 โหนดบน n8n เชื่อมต่อ Webhook, Intent Classifier และฐานข้อมูล Supabase PostgreSQL', 'https://resume-nu-green.vercel.app/resume/aekkarin', 'https://github.com/Xkaroy', ARRAY['n8n', 'Make.com', 'Supabase PostgreSQL', 'Webhook API']),
    ('facecheck-mobile', 'FaceCheck Mobile App — Biometric Attendance', 'Mobile & UX/UI', 'แอปพลิเคชันมือถือสำหรับสแกนใบหน้าเช็กชื่อและยืนยันตัวตนผ่านสมาร์ตโฟน', NULL, 'https://github.com/Mickeyyok/FacecheckApp', ARRAY['Mobile Biometrics', 'UX/UI Architecture', 'RESTful API']),
    ('make-ai-automation-hub', 'Cross-Platform AI & Make.com Workflow Integration', 'AI Automation', 'ระบบเชื่อมต่อข้อมูลและเวิร์กโฟลว์อัตโนมัติข้ามแพลตฟอร์มด้วย Make.com, n8n และ RESTful APIs', 'https://resume-nu-green.vercel.app/resume/aekkarin', 'https://github.com/Xkaroy', ARRAY['Make.com', 'n8n', 'API Integration', 'Next.js 16'])
ON CONFLICT (project_slug) DO UPDATE SET
    project_name = EXCLUDED.project_name,
    description = EXCLUDED.description,
    live_url = EXCLUDED.live_url,
    github_url = EXCLUDED.github_url;
