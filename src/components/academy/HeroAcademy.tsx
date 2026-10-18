import React from 'react';
import { Shield, ArrowRight, Play, Terminal, Award, Cpu, CheckCircle2, LayoutDashboard, Sparkles, FolderGit2 } from 'lucide-react';
import { VisitorUser } from '../../types/wordCourses';

interface HeroAcademyProps {
  onExploreCourses: () => void;
  onExploreLabs: () => void;
  xpPoints: number;
  visitorUser?: VisitorUser | null;
  onOpenDashboard?: () => void;
  onExploreTracks?: () => void;
  onOpenAiMentor?: () => void;
}

export const HeroAcademy: React.FC<HeroAcademyProps> = ({
  onExploreCourses,
  onExploreLabs,
  xpPoints,
  visitorUser,
  onOpenDashboard,
  onExploreTracks,
  onOpenAiMentor,
}) => {
  return (
    <div className="border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 pb-12 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero Split 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          {/* Column 1: Editorial Branding & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 mb-3 tracking-wide">
              <span>KAYA_SAFESEC ACADEMY</span>
              <span aria-hidden="true">·</span>
              <span>06 FLAGSHIP TRACKS</span>
              <span aria-hidden="true">·</span>
              <span>15 WORD CURRICULUM</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">XP: {xpPoints}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4 text-balance">
              أكاديمية كايا للأمن والحماية الرقمية
            </h1>

            <p className="text-base sm:text-lg font-medium text-cyan-300 mb-2">
              منصة عربية احترافية: مسار واضح، تطبيق عملي في مختبر آمن، ونتيجة تُقاس بتقرير هندسي.
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
              مسارات متخصصة تغطي أساسيات الدفاع، غرف العمليات SOC، أمن تطبيقات الويب OWASP، التحقيق الجنائي DFIR، استخبارات المصادر المفتوحة OSINT، وأمن الذكاء الاصطناعي، مدعومة بمختبرات تفاعلية ونظام أوسمة XP موثق.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {visitorUser && onOpenDashboard ? (
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-lg shadow-cyan-500/15 shrink-0"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>لوحة المتدرب ومتابعة التقدم ({visitorUser.name})</span>
                </button>
              ) : null}

              {onExploreTracks && (
                <button
                  onClick={onExploreTracks}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-md shadow-cyan-500/10 shrink-0"
                >
                  <Shield className="h-4 w-4" />
                  <span>المسارات المهنية الستة</span>
                </button>
              )}

              <button
                onClick={onExploreLabs}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
              >
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>مركز المختبرات العملية</span>
              </button>

              <button
                onClick={onExploreCourses}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
              >
                <span>مناهج Word (15 ملف)</span>
              </button>

              {onOpenAiMentor && (
                <button
                  onClick={onOpenAiMentor}
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>اسأل المرشد السيبراني</span>
                </button>
              )}
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>300+ ساعة محتوى تطبيقي</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>بيانات اصطناعية وملفات تدريبية آمنة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>شهادات معتمدة بسجل تدقيق</span>
              </div>
            </div>
          </div>

          {/* Column 2: Graphic Asset */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full h-72 lg:h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src="/src/assets/images/kaya_safesec_hero_1791977993715.jpg"
                alt="KAyA SafeSec Operations Center"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between text-xs font-mono text-slate-300 bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold">06 بيئات اختبار ومحاكاة معزولة</span>
                </div>
                <span className="text-cyan-400 font-bold">KAyA_Safe&Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Progression Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-slate-900">
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <span className="font-mono text-cyan-400 font-bold text-xs block mb-1">01 / الأساسيات الدفاعية</span>
            <p className="text-xs text-slate-300 leading-relaxed">تعلّم كيف تعمل الشبكات وتدفق الحزم مع TCP/IP وDNS وجدران الحماية.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <span className="font-mono text-teal-400 font-bold text-xs block mb-1">02 / تحليل SOC وDFIR</span>
            <p className="text-xs text-slate-300 leading-relaxed">راقب سجلات Sysmon، تتبع رش كلمات المرور، واستخرج أدلة الذاكرة الجنائية.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <span className="font-mono text-indigo-400 font-bold text-xs block mb-1">03 / أمن الويب والـ AI</span>
            <p className="text-xs text-slate-300 leading-relaxed">اكتشف ثغرات SQLi وBOLA، واختبر دفاعات نماذج GenAI ضد كسر القيود.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <span className="font-mono text-emerald-400 font-bold text-xs block mb-1">04 / مشاريع التخرج والاعتماد</span>
            <p className="text-xs text-slate-300 leading-relaxed">أعد تقارير حوادث قابلة للمراجعة واحصل على شهادة الكفاءة المعتمدة.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
