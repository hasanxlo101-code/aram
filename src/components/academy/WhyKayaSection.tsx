import React from 'react';
import { Terminal, Award, Globe, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface WhyKayaSectionProps {
  onStartLearning: () => void;
}

export const WhyKayaSection: React.FC<WhyKayaSectionProps> = ({ onStartLearning }) => {
  return (
    <div id="why-kaya" className="space-y-12 py-10 border-t border-slate-900">
      {/* 04 / لماذا KAyA؟ Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
          <span>04 / لماذا KAyA؟</span>
          <span aria-hidden="true">·</span>
          <span>THE KAYA ADVANTAGE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          أدوات حقيقية. ثقة حقيقية.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          منهج يجمع بين المعرفة النظرية والتطبيق العملي في بيئة مصممة للنجاح.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 01 */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="font-mono text-xs text-slate-500 font-bold">01</span>
          </div>
          <h3 className="text-base font-bold text-white">مختبرات عملية تفاعلية</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            حوّل المعرفة إلى عضلة. سيناريوهات هجوم ودفاع واقعية، مصممة لتتعلم بأمان داخل المتصفح.
          </p>
        </div>

        {/* Pillar 02 */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Award className="h-5 w-5" />
            </div>
            <span className="font-mono text-xs text-slate-500 font-bold">02</span>
          </div>
          <h3 className="text-base font-bold text-white">تقدم يُرى ويُقاس</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            XP، شارات، شهادات ومسار واضح يخبرك دائمًا بالخطوة التالية دون تشتت.
          </p>
        </div>

        {/* Pillar 03 */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Globe className="h-5 w-5" />
            </div>
            <span className="font-mono text-xs text-slate-500 font-bold">03</span>
          </div>
          <h3 className="text-base font-bold text-white">معرفة تواكب العالم</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            محتوى عربي حديث يتحدث لغة السوق ويواكب أحدث التهديدات والذكاء الاصطناعي لعام 2025/2026.
          </p>
        </div>
      </div>

      {/* Final Call to Action Banner */}
      <div className="relative rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block">
            جاهز للخطوة الأولى؟
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            لا تنتظر التهديد. كن أنت خط الدفاع الأول.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            انضم إلى مئات المتدربين وابدأ رحلتك في احتراف الأمن السيبراني اليوم.
          </p>
        </div>

        <button
          onClick={onStartLearning}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <span>ابدأ التعلم مجانًا</span>
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </div>
  );
};
