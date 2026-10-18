import React, { useRef, useState } from 'react';
import {
  Award,
  Shield,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Terminal,
  Cpu,
  Fingerprint,
  FileCheck
} from 'lucide-react';

interface Credential {
  id: string;
  badgeCode: string;
  issuer: string;
  title: string;
  tag: string;
  category: 'osint' | 'offensive' | 'social-eng' | 'ai-strategy' | 'foundational' | 'lead';
  year?: string;
  icon?: string;
}

const CREDENTIALS_LIST: Credential[] = [
  {
    id: 'cred-basel',
    badgeCode: 'Basel Security',
    issuer: 'Basel Security',
    title: 'Full Intelligence Lifecycle & OSINT',
    tag: 'OSINT & Cyber Threat Intelligence',
    category: 'osint',
    year: 'Certified',
  },
  {
    id: 'cred-techmind',
    badgeCode: 'TechMind',
    issuer: 'TechMind Academy',
    title: 'AI Strategy & OSINT Digital Footprinting',
    tag: 'AI Strategy & Footprinting',
    category: 'ai-strategy',
    year: 'Certified',
  },
  {
    id: 'cred-cybrary',
    badgeCode: 'Cybrary',
    issuer: 'Cybrary NetAcad',
    title: 'Social Engineering & Digital Security',
    tag: 'Social Engineering Defense',
    category: 'social-eng',
    year: 'Verified',
  },
  {
    id: 'cred-thm-pro',
    badgeCode: 'THM Pro',
    issuer: 'TryHackMe',
    title: 'Hack With Kali Linux — Professional',
    tag: 'Offensive Security & PenTest',
    category: 'offensive',
    year: 'Professional Tier',
  },
  {
    id: 'cred-thm-int',
    badgeCode: 'THM Int',
    issuer: 'TryHackMe',
    title: 'Hack With Kali Linux — Intermediate',
    tag: 'Linux Systems & Penetration',
    category: 'offensive',
    year: 'Intermediate Tier',
  },
  {
    id: 'cred-albalasmeh-se',
    badgeCode: 'Albalasmeh',
    issuer: 'Albalasmeh UK',
    title: 'Social Engineering & Cyber Security',
    tag: 'Human Factors & Security',
    category: 'social-eng',
    year: 'Accredited',
  },
  {
    id: 'cred-albalasmeh-ai',
    badgeCode: 'Albalasmeh Att',
    issuer: 'Albalasmeh UK',
    title: 'Basics of Cybersecurity & AI Strategies',
    tag: 'AI Strategies & Cyber Defense',
    category: 'ai-strategy',
    year: 'Accredited',
  },
  {
    id: 'cred-icdl',
    badgeCode: 'ICDL',
    issuer: 'ICDL',
    title: 'ICDL Start Certificate',
    tag: 'Core Digital Literacy',
    category: 'foundational',
    year: 'Standard Verified',
  },
  {
    id: 'cred-kaya-lead',
    badgeCode: 'KAyA SAFE&SEC · INSTRUCTOR',
    issuer: 'Cyber Defense Curriculum Architect',
    title: 'تصميم مناهج الأمن السيبراني والمختبرات العملية وإدارة المسارات التعليمية الاحترافية 2026.',
    tag: 'Lead Instructor & Platform Architect',
    category: 'lead',
    year: '2026 Architect',
  },
];

interface FounderSectionProps {
  onOpenAdminLogin?: () => void;
  isAdmin?: boolean;
}

export const FounderSection: React.FC<FounderSectionProps> = ({
  onOpenAdminLogin,
  isAdmin,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const founderEmail = 'hasan.xlo101@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(founderEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="founder-section" className="space-y-12 py-12 border-t border-slate-900 scroll-mt-20">
      {/* 05 / مهندس ومالك الأكاديمية Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
            <span>05 / القيادة المعمارية والأكاديمية</span>
            <span aria-hidden="true">·</span>
            <span>FOUNDER & CHIEF ARCHITECT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مهندس ومالك الأكاديمية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            الرؤية والخبرة الميدانية التي تقود تصميم مناهج كايا وتطوير مختبراتها العملية.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>الإدارة الفنية والأكاديمية المباشرة 2026</span>
        </div>
      </div>

      {/* Main Founder Card */}
      <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden space-y-8">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Column 1: Founder Identity & Avatar Badge */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-start space-y-4">
            <div className="relative">
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 via-slate-900 to-cyan-500/20 border-2 border-emerald-500/40 text-emerald-300 font-extrabold text-3xl sm:text-4xl shadow-xl shadow-emerald-500/10">
                HK
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 border border-emerald-400 text-emerald-400 shadow-md" title="مؤسس موثق">
                <Shield className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                حسن نبيل خلو
              </h3>
              <p className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold" dir="ltr">
                Hassan Nabil Khalu
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                <span className="text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  مؤسّس KAyA_Safe&Sec
                </span>
                <span className="text-[11px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-semibold">
                  Architect
                </span>
              </div>
            </div>

            {/* Direct Technical Administration Contact Card */}
            <div className="w-full pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-mono text-slate-500 block">
                الإدارة الفنية للموقع والمنصة:
              </span>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs font-mono">
                <div className="flex items-center gap-2 truncate text-slate-200">
                  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{founderEmail}</span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                  title="نسخ البريد الإلكتروني"
                >
                  {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`mailto:${founderEmail}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-emerald-500/10"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>مراسلة المؤسس</span>
                </a>

                {onOpenAdminLogin && (
                  <button
                    onClick={onOpenAdminLogin}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
                    title="تسجيل دخول المالك"
                  >
                    بوابة الإدارة
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Detailed Bio and Mission */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>الرؤية والهدف التأسيسي</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-balance">
                مؤسّس أكاديمية <strong className="text-emerald-400 font-bold">KAyA_Safe&Sec</strong>، مختص في الأمن السيبراني والتحقيقات الرقمية والهندسة الاجتماعية وOSINT. يهدف إلى بناء منصة عربية احترافية تُقدّم مسارات عملية حقيقية، ومختبرات آمنة، وأدوات تعليمية حصرية تساعد المتعلم على الانتقال من الأساسيات إلى المستويات المتقدمة بسرعة ومنهجية.
              </p>
            </div>

            {/* Specialization Tags Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-800/90 bg-slate-950/60 space-y-1">
                <Fingerprint className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white block">OSINT & Footprinting</span>
                <span className="text-[10px] text-slate-400 block">جمع المعلومات الاستخباراتية</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-800/90 bg-slate-950/60 space-y-1">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-white block">Offensive & Kali Linux</span>
                <span className="text-[10px] text-slate-400 block">اختبار الاختراق الأخلاقي</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-800/90 bg-slate-950/60 space-y-1">
                <Shield className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-white block">Social Engineering</span>
                <span className="text-[10px] text-slate-400 block">حماية العامل البشري والدفاع</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-800/90 bg-slate-950/60 space-y-1">
                <Cpu className="h-4 w-4 text-teal-400" />
                <span className="text-xs font-bold text-white block">AI Security Strategy</span>
                <span className="text-[10px] text-slate-400 block">استراتيجيات الذكاء الاصطناعي</span>
              </div>
            </div>

            {/* Formal Qualifications Narrative */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                <span>الاعتمادات والتأهيل المهني للمؤسس:</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                حاصل على شهادات في: <strong>الهندسة الاجتماعية وحماية الأمن الرقمي</strong>، دورة <strong>Kali Linux (متوسط واحترافي)</strong> من <strong>TryHackMe</strong>، برنامج <strong>AI Strategy & OSINT Digital Footprinting</strong>، برنامج <strong>Full Intelligence Lifecycle & OSINT</strong> من <strong>Basel Security</strong>، وشهادة <strong>ICDL Start</strong>، بالإضافة إلى شهادات من <strong>Albalasmeh Business Company</strong> في الأمن السيبراني واستراتيجيات الذكاء الاصطناعي.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CREDENTIAL WALL — شهادات واعتمادات المؤسس معروضة في شريط موحّد */}
        {/* ======================================================== */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                <Award className="h-4 w-4" />
                <span>CREDENTIAL WALL</span>
              </div>
              <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-0.5">
                شهادات واعتمادات المؤسس — معروضة في شريط موحّد
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span>اسحب للتصفح ←</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleScroll('right')}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="السابق"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleScroll('left')}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="التالي"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Unified Credential Wall Ribbon */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-3.5 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'thin' }}
          >
            {CREDENTIALS_LIST.map((cred) => {
              const isLead = cred.category === 'lead';

              return (
                <div
                  key={cred.id}
                  className={`min-w-[270px] sm:min-w-[300px] max-w-[320px] p-4 sm:p-5 rounded-2xl border flex flex-col justify-between snap-start transition-all hover:-translate-y-1 ${
                    isLead
                      ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700/90 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Credential Tag */}
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          isLead
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-900 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {cred.badgeCode}
                      </span>
                      <span className="text-slate-500 text-[10px]">{cred.year}</span>
                    </div>

                    {/* Issuer & Title */}
                    <div>
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold block mb-1">
                        {cred.issuer}
                      </span>
                      <h5 className="text-sm font-bold text-white leading-snug">
                        {cred.title}
                      </h5>
                    </div>
                  </div>

                  {/* Bottom Verification Footer */}
                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="truncate max-w-[170px] text-slate-400">{cred.tag}</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>موثق</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
