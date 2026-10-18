import React from 'react';
import { Shield, Lock, Award, Mail, Code2 } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenAdminLogin: () => void;
  isAdmin: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenAdminLogin,
  isAdmin,
}) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-start">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-white text-sm">KAyA_Safe&Sec</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            أكاديمية عربية متخصصة في تعليم الأمن السيبراني والتحقيقات الرقمية وهندسة الدفاع.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <a 
              href="https://tinyurl.com/kaya-safesec" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] hover:bg-cyan-900/60 transition-colors"
              title="الرابط الأساسي المعتمد"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              الرئيسي: tinyurl.com/kaya-safesec
            </a>
            <a 
              href="https://tinyurl.com/kaya-academy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] hover:border-slate-700 transition-colors"
              title="الرابط الأكاديمي المعتمد"
            >
              <Award className="h-3 w-3 text-emerald-400" />
              الأكاديمي: tinyurl.com/kaya-academy
            </a>
            <a 
              href="https://github.com/aramkaya295-cyber/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono text-[11px] hover:border-purple-400 transition-colors"
              title="مستودع الكود المصدري على GitHub"
            >
              <Code2 className="h-3 w-3 text-purple-400" />
              GitHub: aramkaya295-cyber
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <button
            onClick={() => onSelectTab('word-courses')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            كورسات Word (15)
          </button>
          <button
            onClick={() => onSelectTab('courses')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            المسارات التعليمية
          </button>
          <button
            onClick={() => onSelectTab('labs')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            المختبرات التفاعلية
          </button>
          <button
            onClick={() => onSelectTab('founder')}
            className="hover:text-emerald-400 transition-colors cursor-pointer font-medium text-slate-300"
          >
            عن المؤسس والاعتمادات
          </button>
          <button
            onClick={() => onSelectTab('security-suite')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            درع وفاحص الحماية
          </button>
          <button
            onClick={() => onSelectTab('why-kaya')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            لماذا KAyA؟
          </button>
          {!isAdmin && (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <Lock className="h-3 w-3" />
              <span>دخول الإدارة</span>
            </button>
          )}
        </div>

        <div className="text-center md:text-end text-[11px] font-mono text-slate-500 space-y-1">
          <div>
            مؤسس ومهندس المنصة: <strong className="text-slate-200">حسن نبيل خلو</strong> (Hassan Nabil Khalu)
          </div>
          <div>
            الإدارة الفنية: <a href="mailto:hasan.xlo101@gmail.com" className="text-emerald-400 hover:underline">hasan.xlo101@gmail.com</a>
          </div>
          <div>All Rights Reserved © 2026 KAyA_SafeSec Academy</div>
        </div>
      </div>
    </footer>
  );
};
