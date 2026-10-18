import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { Language } from '../types';
import { SAMPLE_SCAN_TARGETS } from '../data/securityPresets';

interface HeroSectionProps {
  lang: Language;
  onScanUrl: (url: string) => void;
  onSelectTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onScanUrl,
  onSelectTab,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const isAr = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onScanUrl(inputUrl.trim());
    }
  };

  const handlePresetClick = (url: string) => {
    setInputUrl(url);
    onScanUrl(url);
  };

  return (
    <div className="border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 pb-12 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          {/* Column 1: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed Metadata kicker with typographic separator */}
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/90 mb-3 tracking-wide">
              <span>KAYA-SAFESEC EDGE</span>
              <span aria-hidden="true">·</span>
              <span>CLOUDFLARE WORKERS INTEGRATION</span>
              <span aria-hidden="true">·</span>
              <span>HEURISTIC SUITE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4 text-balance">
              {isAr
                ? 'منظومة كايا للأمن الرقمي وحماية الويب'
                : 'Kaya SafeSec Autonomous Cyber Defense Suite'}
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed mb-6">
              {isAr
                ? 'منصة دفاعية سحابية متقدمة مطورة لبيئات Cloudflare Workers والويب. توفر فحصاً استباقياً لروابط التصيد، وتحليلاً عميقاً لترويسات الأمان، وحصانة كلمات المرور، مع مُنشئ قواعد جدار الحماية الحافة.'
                : 'Enterprise-grade edge cyber defense engineered for modern web infrastructure and Cloudflare Workers. Real-time heuristic phishing detection, SSL/header audit, cryptographic password vaults, and zero-trust WAF code synthesis.'}
            </p>

            {/* Quick Scanner Input Bar */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-700/80 shadow-lg shadow-black/40 p-1.5 focus-within:border-emerald-500/80 transition-colors">
                <div className="px-3 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder={
                    isAr
                      ? 'أدخل أي رابط للفحص (مثال: https://bank-verify.xyz أو kaya-safesec...)'
                      : 'Enter URL or domain to audit (e.g. https://bank-verify.xyz or domain...)'
                  }
                  dir="ltr"
                  className="w-full bg-transparent py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  <span>{isAr ? 'بدء الفحص' : 'Scan URL'}</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </form>

            {/* Sample Presets to quickly test */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-500">{isAr ? 'عينات سريعة:' : 'Quick Presets:'}</span>
              {SAMPLE_SCAN_TARGETS.slice(0, 3).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(item.url)}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer whitespace-nowrap truncate max-w-xs"
                >
                  {isAr ? item.labelAr : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Visual High-Fidelity Asset */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full h-64 lg:h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src="/src/assets/images/kaya_safesec_hero_1791977993715.jpg"
                alt="Kaya SafeSec Cyber Command Center"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between text-xs font-mono text-slate-300 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>KAYA-WORKER-EDGE // ACTIVE</span>
                </div>
                <span className="text-slate-400 tabular-nums">TLS 1.3 / ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI / Metrics Strip below Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-900">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{isAr ? 'قواعد التحليل الإرشادي' : 'Heuristic Rules'}</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">128+</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'خوارزميات فحص متقدمة' : 'Deep pattern inspection'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>{isAr ? 'زمن المعالجة الحافية' : 'Edge Latency'}</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">~3.8ms</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'أداء Cloudflare Workers فائق' : 'Cloudflare V8 isolates'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>{isAr ? 'قواعد بيانات التهديدات' : 'Threat Intelligence'}</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">520M+</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'سجلات تسريبات وبيانات مخترقة' : 'Breach records indexed'}
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('worker-shield')}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isAr ? 'درع Workers WAF' : 'Worker Shield WAF'}</span>
              <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">v2.4</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'إنشاء كود الحماية بنقرة' : '1-click exportable worker.js'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
