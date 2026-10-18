import React, { useState } from 'react';
import {
  Shield,
  Download,
  Copy,
  Check,
  Terminal,
  Sliders,
  Sparkles,
  Lock,
  Globe,
  Radio,
  FileCode,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  RotateCcw
} from 'lucide-react';
import { Language, WorkerShieldConfig, WorkerLintResult } from '../types';
import { DEFAULT_WORKER_SHIELD_CONFIG, SAMPLE_BUGGY_WORKER_CODE } from '../data/securityPresets';
import { generateCloudflareWorkerCode, lintWorkerCode } from '../utils/securityEngine';

import { WorkerDiagnosticsCard } from './WorkerDiagnosticsCard';

interface WorkerShieldBuilderProps {
  lang: Language;
  onScanUrl?: (url: string) => void;
}

export const WorkerShieldBuilder: React.FC<WorkerShieldBuilderProps> = ({ lang, onScanUrl }) => {
  const isAr = lang === 'ar';
  const [activeSubMode, setActiveSubMode] = useState<'diagnostics' | 'generator' | 'fixer'>('diagnostics');

  // Generator State
  const [config, setConfig] = useState<WorkerShieldConfig>(DEFAULT_WORKER_SHIELD_CONFIG);
  const [newBlockedIp, setNewBlockedIp] = useState('');
  const [newBlockedCountry, setNewBlockedCountry] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Fixer / Linter State
  const [customWorkerCode, setCustomWorkerCode] = useState(SAMPLE_BUGGY_WORKER_CODE);
  const [lintResult, setLintResult] = useState<WorkerLintResult>(() => lintWorkerCode(SAMPLE_BUGGY_WORKER_CODE));
  const [copiedFixedCode, setCopiedFixedCode] = useState(false);

  const generatedCode = generateCloudflareWorkerCode(config);

  const handleCopy = (textToCopy: string, isFixed: boolean = false) => {
    navigator.clipboard.writeText(textToCopy);
    if (isFixed) {
      setCopiedFixedCode(true);
      setTimeout(() => setCopiedFixedCode(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunLinter = (codeToTest: string) => {
    setCustomWorkerCode(codeToTest);
    const result = lintWorkerCode(codeToTest);
    setLintResult(result);
  };

  const handleApplyFixedCode = () => {
    setCustomWorkerCode(lintResult.cleanCode);
    const refreshed = lintWorkerCode(lintResult.cleanCode);
    setLintResult(refreshed);
  };

  const addIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedIp.trim()) return;
    if (!config.blockedIps.includes(newBlockedIp.trim())) {
      setConfig({
        ...config,
        blockedIps: [...config.blockedIps, newBlockedIp.trim()],
      });
    }
    setNewBlockedIp('');
  };

  const removeIp = (ipToRemove: string) => {
    setConfig({
      ...config,
      blockedIps: config.blockedIps.filter(ip => ip !== ipToRemove),
    });
  };

  const addCountry = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newBlockedCountry.trim().toUpperCase();
    if (!code || code.length !== 2) return;
    if (!config.blockedCountries.includes(code)) {
      setConfig({
        ...config,
        blockedCountries: [...config.blockedCountries, code],
      });
    }
    setNewBlockedCountry('');
  };

  const removeCountry = (code: string) => {
    setConfig({
      ...config,
      blockedCountries: config.blockedCountries.filter(c => c !== code),
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>CLOUDFLARE WORKERS INTEGRATION</span>
              <span aria-hidden="true">·</span>
              <span>KAYA SAFESEC WAF & LINTER</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {isAr ? 'منظومة حماية وتصحيح أكواد Cloudflare Workers' : 'Cloudflare Workers Security Shield & Code Fixer'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {isAr
                ? 'أنشئ درع حماية متكامل أو افحص كود خادمك الحالي لاكتشاف ومعالجة الأخطاء الشائعة (مثل ترويسات الاستجابة غير القابلة للتعديل وبطء الاستجابة).'
                : 'Synthesize edge firewall rules or inspect existing worker script to eliminate runtime exceptions and immutable header errors.'}
            </p>
          </div>

          {/* Sub-Mode Switcher */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start md:self-center shrink-0">
            <button
              onClick={() => setActiveSubMode('diagnostics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubMode === 'diagnostics'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>{isAr ? 'تشخيص أخطاء الرابط' : 'URL Diagnostics'}</span>
            </button>

            <button
              onClick={() => setActiveSubMode('generator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubMode === 'generator'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>{isAr ? 'منشئ درع الحماية' : 'WAF Shield Builder'}</span>
            </button>

            <button
              onClick={() => setActiveSubMode('fixer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubMode === 'fixer'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bug className="h-3.5 w-3.5" />
              <span>{isAr ? 'مصلح كود Worker' : 'Code Linter & Fixer'}</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubMode === 'diagnostics' ? (
        <WorkerDiagnosticsCard lang={lang} onApplyCleanUrl={onScanUrl} />
      ) : activeSubMode === 'generator' ? (
        /* WAF Shield Generator View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Rule Toggles (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? 'قواعد الأمان وجدار الحماية' : 'Firewall & Security Directives'}</span>
              </h3>

              {/* Toggle 1: Force HTTPS */}
              <label className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="text-xs font-medium text-white">{isAr ? 'فرض بروتوكول HTTPS المشفر' : 'Enforce Strict HTTPS'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{isAr ? 'إعادة توجيه أي اتصال غير مشفر (301 Moved Permanently)' : 'Permanent redirect for HTTP traffic to TLS'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.forceHttps}
                  onChange={(e) => setConfig({ ...config, forceHttps: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 cursor-pointer"
                />
              </label>

              {/* Toggle 2: Security Headers */}
              <label className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="text-xs font-medium text-white">{isAr ? 'حقن ترويسات الأمان الصارمة' : 'Hardened Security Headers'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{isAr ? 'إضافة CSP و HSTS و X-Frame-Options وإخفاء هوية الخادم' : 'Inject CSP, HSTS, X-Frame-Options and cloak Server'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableSecurityHeaders}
                  onChange={(e) => setConfig({ ...config, enableSecurityHeaders: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 cursor-pointer"
                />
              </label>

              {/* Toggle 3: Rate Limiting */}
              <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 space-y-2">
                <label className="flex items-start justify-between gap-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">{isAr ? 'تحديد معدل الطلبات (Rate Limiting)' : 'Edge Rate Limiting'}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{isAr ? 'منع هجمات التخمين والإغراق (DDoS & Brute-force)' : 'Mitigate floods and API credential spraying'}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableRateLimiting}
                    onChange={(e) => setConfig({ ...config, enableRateLimiting: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                </label>

                {config.enableRateLimiting && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block mb-1">{isAr ? 'الحد الأقصى للطلبات:' : 'Max Requests:'}</span>
                      <input
                        type="number"
                        value={config.rateLimitMaxRequests}
                        onChange={(e) => setConfig({ ...config, rateLimitMaxRequests: Number(e.target.value) || 60 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">{isAr ? 'النافذة الزمنية (ثوانٍ):' : 'Window (seconds):'}</span>
                      <input
                        type="number"
                        value={config.rateLimitWindowSec}
                        onChange={(e) => setConfig({ ...config, rateLimitWindowSec: Number(e.target.value) || 60 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Toggle 4: Bad Bot Defense */}
              <label className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="text-xs font-medium text-white">{isAr ? 'حظر أدوات الاختراق والفحص الآلي' : 'Block Vulnerability Scanners'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{isAr ? 'إسقاط طلبات sqlmap, nikto, masscan, nmap فورياً' : 'Drop sqlmap, nikto, masscan, and malicious user agents'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.blockBadBots}
                  onChange={(e) => setConfig({ ...config, blockBadBots: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 cursor-pointer"
                />
              </label>

              {/* Toggle 5: SQLi & XSS */}
              <label className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="text-xs font-medium text-white">{isAr ? 'تنقية حمولات SQL Injection و XSS' : 'OWASP SQLi & XSS Sanitizer'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{isAr ? 'فحص معاملات URL وتحييد هجمات الاستعلام وقوالب الجافاسكربت' : 'Inspect parameters for inline query & script injections'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.blockSqlInjection && config.blockXssPayloads}
                  onChange={(e) => setConfig({
                    ...config,
                    blockSqlInjection: e.target.checked,
                    blockXssPayloads: e.target.checked,
                  })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 cursor-pointer"
                />
              </label>

              {/* Toggle 6: Geo-Blocking */}
              <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 space-y-2">
                <label className="flex items-start justify-between gap-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">{isAr ? 'الحظر الجغرافي (Geo-Fencing)' : 'Geo-Fencing Restrictions'}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{isAr ? 'تقييد الوصول بحسب رمز الدولة (ISO 3166-1)' : 'Filter traffic based on Cloudflare CF-IPCountry'}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableGeoBlocking}
                    onChange={(e) => setConfig({ ...config, enableGeoBlocking: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                </label>

                {config.enableGeoBlocking && (
                  <div className="pt-2 border-t border-slate-800 text-[11px] space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {config.blockedCountries.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 font-mono bg-slate-900 border border-slate-700 text-slate-200 px-2 py-0.5 rounded">
                          {c}
                          <button type="button" onClick={() => removeCountry(c)} className="text-rose-400 hover:text-rose-300 cursor-pointer">×</button>
                        </span>
                      ))}
                    </div>
                    <form onSubmit={addCountry} className="flex gap-1.5">
                      <input
                        type="text"
                        maxLength={2}
                        value={newBlockedCountry}
                        onChange={(e) => setNewBlockedCountry(e.target.value)}
                        placeholder="e.g. RU"
                        className="w-20 uppercase font-mono bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                      <button type="submit" className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 cursor-pointer">
                        {isAr ? 'إضافة دولة' : 'Add Code'}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Toggle 7: IP Blacklisting */}
              <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 space-y-2">
                <label className="flex items-start justify-between gap-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">{isAr ? 'حظر عناوين IP خبيثة' : 'IP Blacklist Filter'}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{isAr ? 'إسقاط الطلبات من عناوين IP المحددة فورياً' : 'Drop traffic from specified attacker addresses'}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableIpFiltering}
                    onChange={(e) => setConfig({ ...config, enableIpFiltering: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                </label>

                {config.enableIpFiltering && (
                  <div className="pt-2 border-t border-slate-800 text-[11px] space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {config.blockedIps.map((ip) => (
                        <span key={ip} className="inline-flex items-center gap-1 font-mono bg-slate-900 border border-slate-700 text-slate-200 px-2 py-0.5 rounded">
                          {ip}
                          <button type="button" onClick={() => removeIp(ip)} className="text-rose-400 hover:text-rose-300 cursor-pointer">×</button>
                        </span>
                      ))}
                    </div>
                    <form onSubmit={addIp} className="flex gap-1.5">
                      <input
                        type="text"
                        value={newBlockedIp}
                        onChange={(e) => setNewBlockedIp(e.target.value)}
                        placeholder="198.51.100.1"
                        className="flex-1 font-mono bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                      <button type="submit" className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 cursor-pointer">
                        {isAr ? 'إضافة' : 'Add IP'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Generated Code & Deployment Guidance (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">worker.js (ES Module Format)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(generatedCode, false)}
                    className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy')}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(generatedCode, 'kaya-safesec-worker.js')}
                    className="flex items-center gap-1.5 rounded bg-emerald-400 px-2.5 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition-colors cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    <span>{isAr ? 'تحميل' : 'Download'}</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[480px]">
                <pre dir="ltr" className="leading-relaxed">
                  {generatedCode}
                </pre>
              </div>
            </div>

            {/* Quick Deployment Guide */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>{isAr ? 'طريقة النشر السريع على Cloudflare' : 'Cloudflare Workers Quick Deploy Guide'}</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="rounded border border-slate-800/80 bg-slate-950/60 p-3">
                  <div className="font-semibold text-slate-200 mb-1">
                    {isAr ? 'عبر لوحة تحكم Cloudflare (Quick Edit):' : 'Cloudflare Dashboard (Quick Edit):'}
                  </div>
                  <p>
                    {isAr
                      ? 'لوحة تحكم Cloudflare > Workers & Pages > kaya-safesec > انقر على Quick Edit > استبدل الكود بالكود المولد أعلاه وانقر على Save and Deploy.'
                      : 'Cloudflare Dashboard > Workers & Pages > select kaya-safesec > click Quick Edit > paste the generated code above and click Save and Deploy.'}
                  </p>
                </div>

                <div className="rounded border border-slate-800/80 bg-slate-950/60 p-3">
                  <div className="font-semibold text-slate-200 mb-1">
                    {isAr ? 'عبر موجه الأوامر (Wrangler CLI):' : 'Wrangler CLI Deployment:'}
                  </div>
                  <div className="font-mono bg-slate-900 p-2 rounded text-emerald-400 text-[11px] mt-1" dir="ltr">
                    npx wrangler deploy worker.js --name kaya-safesec
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Worker Code Linter & Bug Fixer View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Input Code Editor */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <FileCode className="h-4 w-4 text-amber-400" />
                  <span>{isAr ? 'محرر كود Worker المراد تحليله وإصلاحه' : 'Input Worker Script (To Audit & Fix)'}</span>
                </div>
                <button
                  onClick={() => handleRunLinter(SAMPLE_BUGGY_WORKER_CODE)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{isAr ? 'استعادة الكود النموذجي' : 'Reset Sample'}</span>
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <textarea
                  value={customWorkerCode}
                  onChange={(e) => handleRunLinter(e.target.value)}
                  dir="ltr"
                  rows={16}
                  className="w-full bg-transparent font-mono text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
                  placeholder="// Paste your Cloudflare Worker script here..."
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {lintResult.issues.length} {isAr ? 'ملاحظات/أخطاء مرصودة' : 'Diagnostic issues detected'}
                </span>
                <button
                  onClick={handleApplyFixedCode}
                  className="flex items-center gap-2 px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  <span>{isAr ? 'تطبيق الإصلاح التلقائي على الكود' : 'Auto-Fix & Apply All Changes'}</span>
                </button>
              </div>
            </div>

            {/* Right: Detected Issues & Fixes */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bug className="h-4 w-4 text-emerald-400" />
                    <span>{isAr ? 'تقرير فحص الأخطاء والتعديلات المطلوبة' : 'Static Diagnostic Audit & Remediation'}</span>
                  </h3>
                  <span className={`text-xs font-mono font-bold ${lintResult.hasErrors ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {lintResult.hasErrors ? (isAr ? 'أخطاء حرجة موجودة' : 'Errors Detected') : (isAr ? 'الكود سليم ومحصن' : 'All Clear & Hardened')}
                  </span>
                </div>

                {lintResult.issues.length === 0 ? (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-6 text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                    <div className="text-sm font-bold text-white">
                      {isAr ? 'كود Worker خالٍ من الأخطاء وجاهز للإنتاج' : 'Worker Code Validated & Hardened'}
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {isAr
                        ? 'تم تطبيق كافة التعديلات الوقائية وحماية الترويسات ومعالجة CORS بكفاءة عالية.'
                        : 'No immutable header errors, CORS preflights covered, and defensive headers injected.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lintResult.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`rounded-lg border p-3.5 text-xs space-y-1.5 ${
                          issue.severity === 'error'
                            ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                            : issue.severity === 'warning'
                              ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                              : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          <span>{isAr ? issue.messageAr : issue.messageEn}</span>
                        </div>
                        <div className="text-slate-300 text-[11px] ps-5">
                          <span className="font-semibold text-slate-200">{isAr ? 'الإصلاح المقترح: ' : 'Fix: '}</span>
                          {isAr ? issue.fixAr : issue.fixEn}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clean Code Preview */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    {isAr ? 'الكود المصحح والمحصن (Ready-to-Deploy):' : 'Hardened Auto-Fixed Worker Script:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(lintResult.cleanCode, true)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    >
                      {copiedFixedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedFixedCode ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                    </button>
                    <button
                      onClick={() => handleDownload(lintResult.cleanCode, 'fixed-worker.js')}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>{isAr ? 'تحميل' : 'Download'}</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto" dir="ltr">
                  <pre className="leading-relaxed">{lintResult.cleanCode}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
