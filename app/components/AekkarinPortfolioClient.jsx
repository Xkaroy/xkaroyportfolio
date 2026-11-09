'use client';

import React, { useState } from 'react';
import {
  AEKKARIN_PROFILE,
  AEKKARIN_SKILLS,
  AEKKARIN_SERVICES,
  AEKKARIN_PROJECTS,
  N8N_NODES,
  AEKKARIN_PACKAGES,
  evaluateAekkarinIntent,
} from '@/app/data/aekkarinData';

export default function AekkarinPortfolioClient() {
  const [lang, setLang] = useState('th');
  const [lightMode, setLightMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [openServiceIdx, setOpenServiceIdx] = useState(0);
  const [projFilter, setProjFilter] = useState('all');
  const [modalProject, setModalProject] = useState(null);

  // 12-Node Simulator State
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(5);
  const [runningNodeIdx, setRunningNodeIdx] = useState(null);
  const [simQuery, setSimQuery] = useState('ขอข้อมูล เอกรินทร์ นีระมนต์ Full-Stack');
  const [simStatus, setSimStatus] = useState('● READY TO INSPECT');
  const [simOutput, setSimOutput] = useState(
    'คลิกปุ่ม "จำลองการรัน Workflow" ด้านบนเพื่อดูผลลัพธ์การทำงานจริงทีละโหนด'
  );

  // Contact Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectService, setProjectService] = useState('AI & Workflow Automation (เริ่มต้น 8,000฿)');
  const [projectTimeline, setProjectTimeline] = useState('มาตรฐาน (2-4 สัปดาห์)');
  const [projectDetails, setProjectDetails] = useState('');
  const [submittedLog, setSubmittedLog] = useState(null);

  // Floating AI Assistant State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'สวัสดีครับ! ผมคือ AI Assistant ของ เอกรินทร์ นีระมนต์ (จำลองการทำงานจากโหนด 6. Intent Classifier ใน n8n) สามารถสอบถามเกี่ยวกับ ประวัติเอกรินทร์, ทักษะ Full-Stack & AI/n8n, ผลงานโปรเจกต์, แพ็กเกจราคา หรือช่องทางติดต่อ ได้เลยครับ!',
    },
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  };

  const copyToClipboard = (text, label) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`คัดลอก ${label} (${text}) เรียบร้อยแล้ว!`);
      });
    } else {
      showToast(`${label}: ${text}`);
    }
  };

  const toggleTheme = () => {
    const nextMode = !lightMode;
    setLightMode(nextMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light-mode', nextMode);
    }
    showToast(nextMode ? 'เปลี่ยนเป็นโหมดสีสว่าง (Editorial Cream)' : 'เปลี่ยนเป็นโหมดสีเข้ม (Studio Obsidian)');
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'th' ? 'en' : 'th';
    setLang(nextLang);
    showToast(nextLang === 'th' ? 'เปลี่ยนเป็นภาษาไทยแล้ว' : 'Switched to English mode');
  };

  const runPipelineSimulation = () => {
    const executionOrder = [0, 1, 2, 3, 5, 6, 7, 8, 11];
    let stepPtr = 0;
    setSimStatus('⚡ RUNNING PIPELINE...');

    const interval = setInterval(() => {
      if (stepPtr >= executionOrder.length) {
        clearInterval(interval);
        setRunningNodeIdx(null);
        setSimStatus('✓ WORKFLOW COMPLETED (200 OK)');
        const res = evaluateAekkarinIntent(simQuery);
        setSimOutput(
          JSON.stringify(
            {
              sessionId: 'session_' + Date.now(),
              topic: res.topic,
              status: 'success',
              reply: res.reply,
            },
            null,
            2
          )
        );
        showToast('จำลองการทำงาน 12-Node n8n AI Pipeline สำเร็จ!');
        return;
      }
      const nodeIdx = executionOrder[stepPtr];
      setSelectedNodeIdx(nodeIdx);
      setRunningNodeIdx(nodeIdx);
      setSimOutput(`[Executing ${N8N_NODES[nodeIdx].name}]...
Input Query: "${simQuery}"`);
      stepPtr++;
    }, 400);
  };

  const handleSelectPackage = (pkgName) => {
    setProjectService(pkgName);
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    showToast(`เลือกแพ็กเกจ "${pkgName}" แล้ว กรอกรายละเอียดด้านล่างได้เลย!`);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmittedLog({
      name: clientName,
      email: clientEmail,
      service: projectService,
      timeline: projectTimeline,
      details: projectDetails,
    });
    showToast('ส่งข้อมูลโปรเจกต์ถึง เอกรินทร์ นีระมนต์ เรียบร้อยแล้ว!');
    setClientName('');
    setClientEmail('');
    setProjectDetails('');
  };

  const sendAiMessage = async (rawText) => {
    const query = (rawText ?? chatInput).trim();
    if (!query) return;
    setChatMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setChatInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      if (response.ok) {
        const data = await response.json();
        setChatMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
        return;
      }
    } catch {
      // Fallback to client classifier
    }
    const fallback = evaluateAekkarinIntent(query);
    setChatMessages((prev) => [...prev, { sender: 'ai', text: fallback.reply }]);
  };

  const filteredSkills =
    skillFilter === 'all' ? AEKKARIN_SKILLS : AEKKARIN_SKILLS.filter((s) => s.category === skillFilter);

  const filteredProjects =
    projFilter === 'all' ? AEKKARIN_PROJECTS : AEKKARIN_PROJECTS.filter((p) => p.category === projFilter);

  const activeNode = N8N_NODES[selectedNodeIdx] || N8N_NODES[5];

  return (
    <div className="min-h-screen">
      {/* Top Notification Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-5 z-50 max-w-sm rounded-2xl border border-[#FF5A36]/50 bg-[#181B24]/95 px-5 py-3.5 text-sm text-[#F6F4EE] shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF5A36] text-xs font-bold text-white">
              ✓
            </span>
            <p className="font-medium">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-40 border-b theme-border ${
          lightMode ? 'bg-[#F6F4EE]/90' : 'bg-[#0B0C10]/85'
        } backdrop-blur-xl transition-colors duration-300 no-print`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#hero" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5A36] font-extrabold text-white transition-transform group-hover:rotate-6">
              EN
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">
                AEKKARIN<span className="text-[#FF5A36]">.</span>
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                ● Available for Work
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <a href="#about" className="hover:text-[#FF5A36] transition-colors">
              {lang === 'th' ? 'เกี่ยวกับ' : 'About'}
            </a>
            <a href="#services" className="hover:text-[#FF5A36] transition-colors">
              {lang === 'th' ? 'ความเชี่ยวชาญ' : 'Services'}
            </a>
            <a href="#work" className="hover:text-[#FF5A36] transition-colors">
              {lang === 'th' ? 'ผลงานเด่น' : 'Selected Works'}
            </a>
            <a href="#architecture" className="hover:text-[#FF5A36] transition-colors">
              {lang === 'th' ? 'สถาปัตยกรรม AI' : 'AI Architecture'}
            </a>
            <a href="#pricing" className="hover:text-[#FF5A36] transition-colors">
              {lang === 'th' ? 'แพ็กเกจ' : 'Packages'}
            </a>
            <a href="#contact" className="hover:text-[#FF5A36] transition-colors">
              {lang === 'th' ? 'ติดต่อ' : 'Contact'}
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border theme-border px-3 py-1.5 font-mono text-xs font-semibold hover:border-[#FF5A36] transition-colors"
            >
              TH / EN
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border theme-border hover:border-[#FF5A36] transition-colors"
            >
              <span className="text-sm">{lightMode ? '🌙' : '☀️'}</span>
            </button>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#FF5A36]/50 bg-[#FF5A36]/10 px-4 py-2 text-xs font-semibold text-[#FF5A36] hover:bg-[#FF5A36] hover:text-white transition-all"
            >
              <span>✦</span>
              <span>AI Assistant</span>
            </button>
            <a
              href="#contact"
              className="rounded-full bg-[#FF5A36] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#FF5A36]/25 hover:bg-[#FF7455] transition-all"
            >
              {lang === 'th' ? 'ติดต่องาน ↗' : "Let's Talk ↗"}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border theme-border"
            >
              ☰
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t theme-border theme-surface px-6 py-4">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#FF5A36]/10">
                เกี่ยวกับ (About)
              </a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#FF5A36]/10">
                บริการ (Services)
              </a>
              <a href="#work" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#FF5A36]/10">
                ผลงาน (Works)
              </a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#FF5A36]/10">
                12-Node AI
              </a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#FF5A36]/10">
                แพ็กเกจราคา
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#FF5A36]/10">
                ติดต่อเอกรินทร์
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* 1. HERO SECTION */}
        <section id="hero" className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28">
          <div className="pointer-events-none absolute -top-28 left-1/4 h-96 w-96 rounded-full bg-[#FF5A36]/15 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[130px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b theme-border pb-5 text-xs uppercase tracking-widest theme-text-muted">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#FF5A36]" />
                <span>CREATIVE FULL-STACK DEVELOPER & AI AUTOMATION SPECIALIST</span>
              </div>
              <div className="font-mono">
                <span>BANGKOK, THAILAND • UTCC</span>
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-7">
                <div className="space-y-3">
                  <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-[#FF5A36]">
                    ✦ PORTFOLIO & DIGITAL ARCHITECTURE / 2026
                  </p>
                  <h1 className="text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl xl:text-7xl">
                    <span className="block">{lang === 'th' ? AEKKARIN_PROFILE.nameTh : AEKKARIN_PROFILE.nameEn}</span>
                    <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] via-amber-400 to-emerald-400">
                      AEKKARIN NEERAMON
                    </span>
                  </h1>
                </div>

                <p className="max-w-2xl text-base sm:text-lg leading-relaxed theme-text-muted">
                  {lang === 'th' ? AEKKARIN_PROFILE.bioTh : AEKKARIN_PROFILE.bioEn}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border theme-border theme-card px-3.5 py-1.5 text-xs font-medium">
                    ⚡ Full-Stack Web (Next.js 16 / React 19)
                  </span>
                  <span className="rounded-full border border-[#FF5A36]/40 bg-[#FF5A36]/10 px-3.5 py-1.5 text-xs font-medium text-[#FF5A36]">
                    🤖 AI Automation (n8n / Make.com)
                  </span>
                  <span className="rounded-full border theme-border theme-card px-3.5 py-1.5 text-xs font-medium">
                    🎨 UX/UI Architecture
                  </span>
                  <span className="rounded-full border theme-border theme-card px-3.5 py-1.5 text-xs font-medium">
                    🔗 API Integration & Supabase
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#work"
                    className="glow-accent inline-flex items-center gap-3 rounded-full bg-[#FF5A36] px-7 py-4 text-sm font-bold text-white transition-all hover:bg-[#FF7455] hover:-translate-y-0.5"
                  >
                    <span>{lang === 'th' ? 'ดูผลงานเด่น (Selected Works)' : 'Explore Selected Works'}</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('architecture');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(runPipelineSimulation, 400);
                    }}
                    className="inline-flex items-center gap-2.5 rounded-full border theme-border theme-card px-6 py-4 text-sm font-semibold hover:border-[#FF5A36] transition-all"
                  >
                    <span className="text-emerald-400">▶</span>
                    <span>{lang === 'th' ? 'จำลองระบบ 12-Node AI' : 'Simulate 12-Node AI'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-full border theme-border px-5 py-4 text-xs font-mono uppercase tracking-wider hover:border-[#FF5A36] transition-all"
                  >
                    <span>🖨️ Print / Save CV</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t theme-border text-xs">
                  <a
                    href={AEKKARIN_PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border theme-border theme-card p-3 hover:border-[#FF5A36] transition-all"
                  >
                    <div>
                      <span className="block theme-text-muted">GitHub Profile</span>
                      <span className="font-mono font-semibold text-sm group-hover:text-[#FF5A36]">
                        {AEKKARIN_PROFILE.githubHandle}
                      </span>
                    </div>
                    <span>↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(AEKKARIN_PROFILE.email, 'อีเมลของเอกรินทร์')}
                    className="group flex items-center justify-between rounded-xl border theme-border theme-card p-3 text-left hover:border-[#FF5A36] transition-all"
                  >
                    <div>
                      <span className="block theme-text-muted">Direct Email (คลิกคัดลอก)</span>
                      <span className="font-mono font-semibold text-sm group-hover:text-[#FF5A36]">
                        {AEKKARIN_PROFILE.email}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#FF5A36]">COPY</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-3 rounded-3xl border border-[#FF5A36]/30 translate-x-3 translate-y-3 pointer-events-none" />
                  <div className="relative overflow-hidden rounded-3xl border theme-border theme-card shadow-2xl">
                    <img
                      src={AEKKARIN_PROFILE.portraitImage}
                      alt="เอกรินทร์ นีระมนต์ (Aekkarin Neeramon)"
                      className="h-[460px] w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                      <div>
                        <span className="inline-block rounded-full bg-[#FF5A36] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                          UTCC Engineering
                        </span>
                        <h2 className="mt-2 text-2xl font-bold text-white">Aekkarin Neeramon</h2>
                        <p className="text-xs text-gray-300">{AEKKARIN_PROFILE.role}</p>
                      </div>
                      <a
                        href={AEKKARIN_PROFILE.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md hover:bg-[#FF5A36] transition-colors"
                      >
                        ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MARQUEE BANNER */}
        <div className="border-y theme-border bg-[#FF5A36] py-3.5 text-white overflow-hidden select-none">
          <div className="animate-marquee flex items-center gap-8 text-sm sm:text-base font-extrabold uppercase tracking-wider">
            <span>FULL-STACK WEB DEVELOPMENT</span>
            <span>✦</span>
            <span>AI AUTOMATION WORKFLOWS</span>
            <span>✦</span>
            <span>N8N & MAKE.COM SPECIALIST</span>
            <span>✦</span>
            <span>UX/UI ARCHITECTURE</span>
            <span>✦</span>
            <span>API INTEGRATION & SUPABASE</span>
            <span>✦</span>
            <span>REAL-TIME BIOMETRIC SYSTEMS</span>
            <span>✦</span>
            <span>AEKKARIN NEERAMON • CREATIVE PORTFOLIO</span>
            <span>✦</span>
            <span>FULL-STACK WEB DEVELOPMENT</span>
            <span>✦</span>
            <span>AI AUTOMATION WORKFLOWS</span>
            <span>✦</span>
            <span>N8N & MAKE.COM SPECIALIST</span>
            <span>✦</span>
          </div>
        </div>

        {/* 3. ABOUT & SKILLS SECTION */}
        <section id="about" className="py-20 sm:py-28 border-b theme-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
              <div className="lg:col-span-5 space-y-5">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A36]">
                  01 / ABOUT AEKKARIN
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  {lang === 'th'
                    ? 'ผสานความคิดสร้างสรรค์เชิงวิศวกรรม เข้ากับระบบอัตโนมัติอัจฉริยะ'
                    : 'Merging Full-Stack Engineering with Intelligent AI Automation'}
                </h2>
                <p className="theme-text-muted text-sm sm:text-base leading-relaxed">
                  ผม <strong>เอกรินทร์ นีระมนต์ (Aekkarin Neeramon)</strong> นักพัฒนาซอฟต์แวร์{' '}
                  <strong className="text-[#FF5A36]">Full-Stack Developer & AI Automation Specialist</strong> จาก{' '}
                  <strong>มหาวิทยาลัยหอการค้าไทย (UTCC)</strong> มุ่งเน้นการสร้างสรรค์เว็บแอปพลิเคชันประสิทธิภาพสูงควบคู่กับระบบอัตโนมัติอัจฉริยะด้วย{' '}
                  <code>n8n</code> และ <code>Make.com</code>
                </p>

                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div className="rounded-2xl border theme-border theme-card p-5">
                    <p className="text-3xl sm:text-4xl font-extrabold text-[#FF5A36]">12-Node</p>
                    <p className="mt-1 text-xs theme-text-muted">Enterprise AI Workflow Architecture (n8n + Supabase)</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-card p-5">
                    <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">4+</p>
                    <p className="mt-1 text-xs theme-text-muted">Production Software & Biometric Systems</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-card p-5">
                    <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">6+</p>
                    <p className="mt-1 text-xs theme-text-muted">Core Specializations (Full-Stack, UX/UI, AI, API)</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-card p-5">
                    <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">UTCC</p>
                    <p className="mt-1 text-xs theme-text-muted">University of the Thai Chamber of Commerce</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-3xl border theme-border theme-card p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b theme-border pb-5">
                    <div>
                      <h3 className="text-xl font-bold">ทักษะและความเชี่ยวชาญเชิงลึก (Core Competencies)</h3>
                      <p className="text-xs theme-text-muted mt-1">คลิกเลือกหมวดหมู่เพื่อกรองเทคโนโลยีที่เชี่ยวชาญ</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { key: 'all', label: 'ทั้งหมด' },
                        { key: 'fullstack', label: 'Full-Stack & UX/UI' },
                        { key: 'ai', label: 'AI & Automation' },
                        { key: 'backend', label: 'API & Database' },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setSkillFilter(tab.key)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            skillFilter === tab.key
                              ? 'bg-[#FF5A36] text-white'
                              : 'border theme-border hover:border-[#FF5A36]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="rounded-2xl border theme-border p-4 transition-all hover:border-[#FF5A36]/50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base">{skill.name}</span>
                            <span className="rounded-full bg-[#FF5A36]/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#FF5A36]">
                              {skill.badge}
                            </span>
                          </div>
                          <span className="font-mono text-xs font-bold text-emerald-400">{skill.level}%</span>
                        </div>
                        <p className="text-xs theme-text-muted mb-2.5">{skill.desc}</p>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#FF5A36] to-emerald-400"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SERVICES SECTION */}
        <section id="services" className="py-20 sm:py-28 border-b theme-border theme-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A36]">
                  02 / WHAT I DO
                </span>
                <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold">บริการและความเชี่ยวชาญหลัก</h2>
              </div>
              <p className="max-w-md text-sm theme-text-muted">
                ออกแบบและพัฒนาระบบดิจิทัลแบบ End-to-End ตั้งแต่หน้าบ้านที่สวยงามไปจนถึงระบบ AI Automation หลังบ้านที่ทำงานอัตโนมัติ 24/7
              </p>
            </div>

            <div className="divide-y theme-border border-y theme-border">
              {AEKKARIN_SERVICES.map((srv, idx) => {
                const isOpen = openServiceIdx === idx;
                return (
                  <div
                    key={srv.num}
                    onClick={() => setOpenServiceIdx(isOpen ? -1 : idx)}
                    className="py-7 sm:py-9 cursor-pointer transition-transform hover:translate-x-1"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-5 sm:gap-8">
                        <span className="font-mono text-lg sm:text-2xl font-bold text-[#FF5A36]">{srv.num}</span>
                        <div>
                          <h3 className="text-xl sm:text-3xl font-bold">{srv.title}</h3>
                          <p className="mt-1 text-sm theme-text-muted">{srv.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="rounded-full border theme-border px-3 py-1 font-mono text-xs">{srv.tags}</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border theme-border text-lg">
                          {isOpen ? '↓' : '+'}
                        </span>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-5 pl-0 sm:pl-16 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm theme-text-muted">
                        {srv.highlights.map((h) => (
                          <div key={h.title} className="rounded-2xl border theme-border theme-card p-4">
                            <p className="font-bold text-[#F6F4EE] mb-1">✦ {h.title}</p>
                            <p>{h.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. SELECTED WORKS SECTION */}
        <section id="work" className="py-20 sm:py-28 border-b theme-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A36]">
                  03 / SELECTED WORKS
                </span>
                <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold">ผลงานพัฒนาซอฟต์แวร์และ AI เด่น</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'ทั้งหมด (All Works)' },
                  { key: 'fullstack', label: 'Full-Stack Web' },
                  { key: 'ai', label: 'AI & n8n Automation' },
                  { key: 'mobile', label: 'Mobile & Biometric' },
                ].map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => setProjFilter(btn.key)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                      projFilter === btn.key
                        ? 'bg-[#FF5A36] text-white'
                        : 'border theme-border theme-card hover:border-[#FF5A36]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((proj, idx) => (
                <article
                  key={proj.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border theme-border theme-card transition-all duration-300 hover:-translate-y-1 hover:border-[#FF5A36]"
                >
                  <div>
                    <div className="relative h-60 w-full overflow-hidden bg-gray-900">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 rounded-full bg-[#0B0C10]/85 px-3 py-1 font-mono text-[11px] font-bold text-[#FF5A36] backdrop-blur-md">
                        0{idx + 1} / {proj.categoryLabel}
                      </span>
                    </div>

                    <div className="p-6 sm:p-7">
                      <h3 className="text-xl sm:text-2xl font-extrabold group-hover:text-[#FF5A36] transition-colors">
                        {proj.title}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm theme-text-muted leading-relaxed">{proj.shortDesc}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {proj.tags.map((t) => (
                          <span key={t} className="rounded-full border theme-border px-2.5 py-1 font-mono text-[11px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t theme-border px-6 py-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setModalProject(proj)}
                      className="inline-flex items-center gap-1.5 text-[#FF5A36] hover:underline"
                    >
                      <span>🔍 ดูรายละเอียดเชิงลึก (Case Study)</span>
                    </button>
                    <div className="flex items-center gap-3 font-mono">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5A36]">
                          Live Demo ↗
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5A36]">
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. 12-NODE N8N AI ARCHITECTURE SIMULATOR */}
        <section id="architecture" className="py-20 sm:py-28 border-b theme-border theme-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A36]">
                  04 / AI AUTOMATION ARCHITECTURE
                </span>
                <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold">Enterprise 12-Node n8n AI Pipeline</h2>
                <p className="mt-2 max-w-2xl text-sm theme-text-muted">
                  สถาปัตยกรรมระบบ AI Assistant ส่วนตัวของ <strong>เอกรินทร์ นีระมนต์</strong> ที่เชื่อมต่อ Webhook, Intent Classifier และฐานข้อมูล Supabase PostgreSQL
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={simQuery}
                  onChange={(e) => setSimQuery(e.target.value)}
                  className="rounded-full border theme-border theme-card px-4 py-2.5 text-xs font-medium focus:border-[#FF5A36] focus:outline-none"
                >
                  <option value="ขอข้อมูล เอกรินทร์ นีระมนต์ Full-Stack">คำถามทดสอบ: &quot;ขอข้อมูล เอกรินทร์ นีระมนต์&quot;</option>
                  <option value="ขอดูผลงานโปรเจกต์ FaceCheck ของเอกรินทร์">คำถามทดสอบ: &quot;ขอดูผลงานโปรเจกต์ของเอกรินทร์&quot;</option>
                  <option value="สอบถามแพ็กเกจราคาจ้างทำเว็บและ AI">คำถามทดสอบ: &quot;สอบถามแพ็กเกจราคาจ้างทำเว็บ&quot;</option>
                  <option value="ช่องทางติดต่อ เอกรินทร์ นีระมนต์">คำถามทดสอบ: &quot;ช่องทางติดต่อ เอกรินทร์ นีระมนต์&quot;</option>
                </select>
                <button
                  type="button"
                  onClick={runPipelineSimulation}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <span>▶</span>
                  <span>จำลองการรัน Workflow (Run Live)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono theme-text-muted px-1">
                  <span>WORKFLOW: n8n-workflow-resume-ai.json (v2.0.0)</span>
                  <span className="text-emerald-400 font-bold">{simStatus}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {N8N_NODES.map((node, idx) => (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNodeIdx(idx)}
                      className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                        runningNodeIdx === idx
                          ? 'border-emerald-400 bg-emerald-500/20'
                          : selectedNodeIdx === idx
                          ? 'border-[#FF5A36] bg-[#FF5A36]/15'
                          : 'theme-border theme-card'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5A36]/15 font-mono text-xs font-bold text-[#FF5A36]">
                          {node.step}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold">{node.name}</p>
                          <p className="font-mono text-[10px] theme-text-muted">{node.type}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#FF5A36]">→</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl border theme-border bg-[#0B0C10] p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#FF5A36]">
                        {activeNode.type}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{activeNode.name}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-mono text-[11px] text-emerald-400">
                      {activeNode.id}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-400 leading-relaxed">{activeNode.desc}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-1.5">
                      <span>NODE LOGIC / SQL / JS CONFIGURATION</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(activeNode.code, 'โค้ดโหนด n8n')}
                        className="text-[#FF5A36] hover:underline"
                      >
                        คัดลอกโค้ด
                      </button>
                    </div>
                    <pre className="max-h-64 overflow-auto rounded-2xl border border-gray-800 bg-[#12141C] p-4 font-mono text-xs text-emerald-300 leading-relaxed">
                      {activeNode.code}
                    </pre>
                  </div>

                  <div className="mt-4 rounded-2xl border border-gray-800 bg-[#12141C] p-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1">
                      <span>⚡ LIVE PIPELINE OUTPUT PAYLOAD</span>
                      <span>Node {selectedNodeIdx + 1} / 12</span>
                    </div>
                    <pre className="font-mono text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {simOutput}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. SERVICE PACKAGES & PRICING */}
        <section id="pricing" className="py-20 sm:py-28 border-b theme-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A36]">
                05 / INVESTMENT & PACKAGES
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold">แพ็กเกจบริการพัฒนาเว็บไซต์และระบบ AI</h2>
              <p className="mt-3 text-sm sm:text-base theme-text-muted">
                อัตราค่าบริการพัฒนาเว็บไซต์และระบบ AI Automation โดย เอกรินทร์ นีระมนต์ ยืดหยุ่นตามขอบเขตงานจริง พร้อมดูแลตั้งแต่เริ่มต้นจนขึ้นระบบ Production
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {AEKKARIN_PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                    pkg.featured
                      ? 'border-2 border-[#FF5A36] theme-card shadow-2xl shadow-[#FF5A36]/15'
                      : 'border theme-border theme-card hover:border-[#FF5A36]/60'
                  }`}
                >
                  {pkg.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#FF5A36] px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                      ★ AEKKARIN&apos;S SPECIALTY
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 font-mono text-xs ${
                          pkg.featured ? 'bg-[#FF5A36]/15 text-[#FF5A36] font-semibold' : 'border theme-border'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                      <span className="font-mono text-xs theme-text-muted">{pkg.type}</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-bold">{pkg.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-xs theme-text-muted">เริ่มต้น</span>
                      <span className="text-4xl font-extrabold text-[#FF5A36]">{pkg.price}</span>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm theme-text-muted">{pkg.desc}</p>
                    <ul className="mt-6 space-y-3 text-xs sm:text-sm">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5">
                          <span className={pkg.featured ? 'text-[#FF5A36]' : 'text-emerald-400'}>✔</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPackage(`${pkg.name} (เริ่มต้น ${pkg.price})`)}
                    className={`mt-8 w-full rounded-full py-3.5 text-xs sm:text-sm font-bold transition-all ${
                      pkg.featured
                        ? 'bg-[#FF5A36] text-white hover:bg-[#FF7455] shadow-lg shadow-[#FF5A36]/25'
                        : 'border theme-border hover:bg-[#FF5A36] hover:text-white hover:border-[#FF5A36]'
                    }`}
                  >
                    เลือกแพ็กเกจ {pkg.name} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CONTACT SECTION */}
        <section id="contact" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-6">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A36]">
                  06 / LET&apos;S COLLABORATE
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                  พร้อมยกระดับโปรเจกต์ของคุณด้วย Full-Stack & AI หรือยัง?
                </h2>
                <p className="text-sm sm:text-base theme-text-muted leading-relaxed">
                  ไม่ว่าจะเป็นการพัฒนาเว็บแอปพลิเคชันใหม่, ออกแบบ UX/UI, หรือเชื่อมต่อระบบ AI Workflow อัตโนมัติด้วย n8n และ Make.com สามารถส่งรายละเอียดหรือติดต่อเอกรินทร์ได้โดยตรง
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between rounded-2xl border theme-border theme-card p-4">
                    <div>
                      <span className="block text-xs theme-text-muted">อีเมลส่วนตัว (เอกรินทร์ นีระมนต์)</span>
                      <span className="font-mono text-sm sm:text-base font-bold">{AEKKARIN_PROFILE.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(AEKKARIN_PROFILE.email, 'อีเมลของเอกรินทร์')}
                      className="rounded-full bg-[#FF5A36]/15 px-3.5 py-1.5 font-mono text-xs font-bold text-[#FF5A36] hover:bg-[#FF5A36] hover:text-white transition-colors"
                    >
                      คัดลอกอีเมล
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border theme-border theme-card p-4">
                    <div>
                      <span className="block text-xs theme-text-muted">เรซูเม่ออนไลน์ทางการ (Official Resume)</span>
                      <span className="font-mono text-sm font-bold">resume-nu-green.vercel.app/resume/aekkarin</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(AEKKARIN_PROFILE.liveResumeUrl, 'ลิงก์เรซูเม่ของเอกรินทร์')}
                      className="rounded-full border theme-border px-3.5 py-1.5 font-mono text-xs font-semibold hover:border-[#FF5A36] transition-colors"
                    >
                      คัดลอกลิงก์
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border theme-border theme-card p-4">
                    <div>
                      <span className="block text-xs theme-text-muted">GitHub & สถาบันการศึกษา</span>
                      <span className="text-sm font-bold">github.com/Xkaroy • มหาวิทยาลัยหอการค้าไทย (UTCC)</span>
                    </div>
                    <a
                      href={AEKKARIN_PROFILE.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border theme-border px-3.5 py-1.5 font-mono text-xs font-semibold hover:border-[#FF5A36] transition-colors"
                    >
                      เปิด GitHub ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <form
                  onSubmit={handleContactSubmit}
                  className="rounded-3xl border theme-border theme-card p-6 sm:p-10 shadow-2xl space-y-5"
                >
                  <div className="flex items-center justify-between border-b theme-border pb-4">
                    <h3 className="text-2xl font-bold">ส่งรายละเอียดโปรเจกต์ (Project Brief)</h3>
                    <span className="font-mono text-xs text-emerald-400">● ตอบกลับภายใน 24 ชม.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                        ชื่อผู้ติดต่อ / บริษัท *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="เช่น คุณสมชาย / บริษัท ABC"
                        className="w-full rounded-xl border theme-border bg-transparent px-4 py-3 text-sm focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                        อีเมล หรือ เบอร์โทรศัพท์ *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="name@company.com หรือ 08x-xxx-xxxx"
                        className="w-full rounded-xl border theme-border bg-transparent px-4 py-3 text-sm focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">บริการที่สนใจ</label>
                      <select
                        value={projectService}
                        onChange={(e) => setProjectService(e.target.value)}
                        className="w-full rounded-xl border theme-border theme-surface px-4 py-3 text-sm focus:border-[#FF5A36] focus:outline-none"
                      >
                        <option value="AI & Workflow Automation (เริ่มต้น 8,000฿)">
                          AI & Workflow Automation (เริ่มต้น 8,000฿)
                        </option>
                        <option value="Web Application & Portal (เริ่มต้น 15,000฿)">
                          Web Application & Portal (เริ่มต้น 15,000฿)
                        </option>
                        <option value="Basic Website (เริ่มต้น 5,000฿)">Basic Website (เริ่มต้น 5,000฿)</option>
                        <option value="UX/UI Architecture & API Integration">UX/UI Architecture & API Integration</option>
                        <option value="Hire Aekkarin Full-Time / Internship">ติดต่อสัมภาษณ์งาน Full-Time / Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                        ระยะเวลาที่ต้องการ
                      </label>
                      <select
                        value={projectTimeline}
                        onChange={(e) => setProjectTimeline(e.target.value)}
                        className="w-full rounded-xl border theme-border theme-surface px-4 py-3 text-sm focus:border-[#FF5A36] focus:outline-none"
                      >
                        <option value="เร่งด่วน (ภายใน 1-2 สัปดาห์)">เร่งด่วน (ภายใน 1-2 สัปดาห์)</option>
                        <option value="มาตรฐาน (2-4 สัปดาห์)">มาตรฐาน (2-4 สัปดาห์)</option>
                        <option value="โปรเจกต์ขนาดใหญ่ (1-3 เดือน)">โปรเจกต์ขนาดใหญ่ (1-3 เดือน)</option>
                        <option value="ต้องการปรึกษาขอบเขตงานก่อน">ต้องการปรึกษาขอบเขตงานก่อน</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                      รายละเอียดโปรเจกต์ หรือข้อความถึงเอกรินทร์ *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="อธิบายเป้าหมายของระบบ ฟีเจอร์ที่ต้องการ หรือระบบ AI Automation ที่อยากเชื่อมต่อ..."
                      className="w-full rounded-xl border theme-border bg-transparent px-4 py-3 text-sm focus:border-[#FF5A36] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-xs theme-text-muted">
                      ข้อมูลของคุณจะถูกจัดเก็บในรายการส่งข้อความและพร้อมส่งต่อทางอีเมลทันที
                    </p>
                    <button
                      type="submit"
                      className="rounded-full bg-[#FF5A36] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5A36]/25 hover:bg-[#FF7455] transition-all"
                    >
                      ส่งข้อความถึงเอกรินทร์ ↗
                    </button>
                  </div>

                  {submittedLog && (
                    <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs space-y-1">
                      <p className="font-bold text-emerald-400">✓ บันทึกข้อมูลการติดต่อเรียบร้อยแล้ว!</p>
                      <p>
                        <strong>ผู้ติดต่อ:</strong> {submittedLog.name} ({submittedLog.email})
                      </p>
                      <p>
                        <strong>บริการที่เลือก:</strong> {submittedLog.service} • <strong>ระยะเวลา:</strong>{' '}
                        {submittedLog.timeline}
                      </p>
                      <p>
                        <strong>รายละเอียด:</strong> {submittedLog.details}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t theme-border theme-surface py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b theme-border">
            <div>
              <span className="text-3xl font-extrabold tracking-tight">
                AEKKARIN NEERAMON<span className="text-[#FF5A36]">.</span>
              </span>
              <p className="mt-1 text-xs theme-text-muted">
                Full-Stack Developer & AI Automation Specialist • University of the Thai Chamber of Commerce (UTCC)
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <a
                href={AEKKARIN_PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border theme-border px-4 py-2 hover:border-[#FF5A36] transition-colors"
              >
                GitHub @Xkaroy ↗
              </a>
              <a
                href={AEKKARIN_PROFILE.liveResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border theme-border px-4 py-2 hover:border-[#FF5A36] transition-colors"
              >
                Live Resume ↗
              </a>
              <a href="#hero" className="rounded-full bg-[#FF5A36] px-4 py-2 font-bold text-white">
                ↑ กลับขึ้นด้านบน
              </a>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs theme-text-muted gap-2">
            <p>© 2026 เอกรินทร์ นีระมนต์ (Aekkarin Neeramon) — Full-Stack Developer & AI Automation Specialist.</p>
            <p className="font-mono">xkaroyresume • Next.js 16 & 12-Node n8n AI Architecture</p>
          </div>
        </div>
      </footer>

      {/* CASE STUDY MODAL */}
      {modalProject && (
        <div
          onClick={() => setModalProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border theme-border theme-card p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b theme-border pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#FF5A36]">
                  {modalProject.categoryLabel}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">{modalProject.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalProject(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border theme-border hover:border-[#FF5A36] text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <img
                src={modalProject.image}
                alt={modalProject.title}
                className="h-64 w-full rounded-2xl object-cover border theme-border"
              />
              <p className="text-sm sm:text-base leading-relaxed theme-text-muted">{modalProject.fullDesc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border theme-border p-4">
                  <p className="font-mono text-xs uppercase text-[#FF5A36] mb-2">บทบาทของ เอกรินทร์ นีระมนต์</p>
                  <p className="text-xs sm:text-sm">{modalProject.aekkarinRole}</p>
                </div>
                <div className="rounded-2xl border theme-border p-4">
                  <p className="font-mono text-xs uppercase text-emerald-400 mb-2">จุดเด่นเชิงเทคนิค (Key Highlights)</p>
                  <p className="text-xs sm:text-sm">{modalProject.highlights}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t theme-border">
                {modalProject.liveUrl && (
                  <a
                    href={modalProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#FF5A36] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#FF7455]"
                  >
                    เปิดดูเว็บไซต์จริง (Live Demo) ↗
                  </a>
                )}
                {modalProject.githubUrl && (
                  <a
                    href={modalProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border theme-border px-5 py-2.5 text-xs font-mono font-semibold hover:border-[#FF5A36]"
                  >
                    ดู Source Code บน GitHub ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING AI ASSISTANT WIDGET */}
      <div className="fixed bottom-5 right-5 z-50 no-print">
        {chatOpen && (
          <div className="mb-3 w-[350px] sm:w-[390px] overflow-hidden rounded-3xl border theme-border theme-card shadow-2xl">
            <div className="flex items-center justify-between bg-[#FF5A36] px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-mono text-sm font-bold">
                  AI
                </span>
                <div>
                  <p className="text-sm font-bold">Aekkarin AI Assistant</p>
                  <p className="text-[11px] text-white/85">Powered by 12-Node n8n Workflow</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="rounded-full bg-white/15 px-2.5 py-1 text-xs hover:bg-white/25"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 min-h-[240px] overflow-y-auto p-4 space-y-3 text-xs sm:text-sm">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.sender === 'user'
                      ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#FF5A36] p-3 text-white'
                      : 'mr-auto max-w-[90%] rounded-2xl rounded-tl-sm border theme-border theme-surface p-3.5 whitespace-pre-line leading-relaxed'
                  }
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 text-[11px]">
              {[
                { label: 'ประวัติเอกรินทร์', prompt: 'ขอข้อมูล เอกรินทร์ นีระมนต์' },
                { label: 'ผลงาน FaceCheck', prompt: 'ผลงานโปรเจกต์ FaceCheck' },
                { label: 'แพ็กเกจราคา', prompt: 'แพ็กเกจราคาจ้างทำเว็บ' },
                { label: 'ช่องทางติดต่อ', prompt: 'ช่องทางติดต่อ เอกรินทร์' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => sendAiMessage(chip.prompt)}
                  className="shrink-0 rounded-full border theme-border px-2.5 py-1 hover:border-[#FF5A36]"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendAiMessage();
              }}
              className="flex items-center gap-2 border-t theme-border p-3"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="พิมพ์คำถาม เช่น เอกรินทร์เชี่ยวชาญอะไร..."
                className="flex-1 rounded-full border theme-border bg-transparent px-3.5 py-2 text-xs focus:border-[#FF5A36] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#FF5A36] px-4 py-2 text-xs font-bold text-white hover:bg-[#FF7455]"
              >
                ส่ง
              </button>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setChatOpen(!chatOpen)}
          className="glow-accent ml-auto flex items-center gap-2.5 rounded-full bg-[#FF5A36] px-5 py-3.5 text-xs sm:text-sm font-bold text-white shadow-2xl hover:bg-[#FF7455] transition-all"
        >
          <span>✦ คุยกับ AI ของเอกรินทร์</span>
        </button>
      </div>
    </div>
  );
}

