import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Code2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { HeaderAuditResult, Language } from '../types';
import { auditSecurityHeaders } from '../utils/securityEngine';

interface HeadersInspectorProps {
  lang: Language;
}

export const HeadersInspector: React.FC<HeadersInspectorProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [targetUrl, setTargetUrl] = useState('https://kaya-safesec.hasanxlo.workers.dev');
  const [auditResult, setAuditResult] = useState<HeaderAuditResult>(() =>
    auditSecurityHeaders('https://kaya-safesec.hasanxlo.workers.dev')
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'cloudflare' | 'nginx' | 'apache'>('cloudflare');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsAuditing(true);
    try {
      const res = await fetch('/api/security/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      if (!res.ok) throw new Error('Audit failed');
      const data = await res.json();

      const h = data.headers;
      const items: SecurityHeaderItem[] = [
        {
          key: 'Content-Security-Policy',
          status: h.csp ? 'passed' : 'failed',
          actualValue: h.csp || undefined,
          recommendedValue: "default-src 'self'; script-src 'self'; object-src 'none';",
          descriptionAr: 'حظر حقن نصوص XSS وتحديد مصادر تحميل السكربتات الموثوقة حصراً.',
          descriptionEn: 'Mitigates Cross-Site Scripting (XSS) and data injection attacks.',
          riskIfMissingAr: 'احتمال حقن سكربتات ضارة وسرقة جلسات المستخدمين.',
          riskIfMissingEn: 'High exposure to XSS and malicious script execution.'
        },
        {
          key: 'Strict-Transport-Security',
          status: h.hsts ? 'passed' : 'failed',
          actualValue: h.hsts || undefined,
          recommendedValue: 'max-age=31536000; includeSubDomains; preload',
          descriptionAr: 'إلزام المتصفح بالاتصال عبر بروتوكول HTTPS المشفر دائماً وحظر خفض التشفير.',
          descriptionEn: 'Enforces HTTPS encryption and prevents SSL-stripping attacks.',
          riskIfMissingAr: 'عرضة لهجمات Man-in-the-Middle والتنصت على البيانات.',
          riskIfMissingEn: 'Vulnerable to MITM SSL downgrade attacks.'
        },
        {
          key: 'X-Frame-Options',
          status: h.xfo ? 'passed' : (h.csp?.includes('frame-ancestors') ? 'passed' : 'failed'),
          actualValue: h.xfo || (h.csp?.includes('frame-ancestors') ? 'Protected via CSP frame-ancestors' : undefined),
          recommendedValue: 'DENY أو SAMEORIGIN',
          descriptionAr: 'منع تضمين موقعك داخل إطارات iframes خارجية لحمايته من هجمات Clickjacking.',
          descriptionEn: 'Defends against Clickjacking and invisible frame overlays.',
          riskIfMissingAr: 'خطر هجمات Clickjacking وخداع المستخدم بالنقر.',
          riskIfMissingEn: 'Susceptible to UI redressing and Clickjacking.'
        },
        {
          key: 'X-Content-Type-Options',
          status: h.xcto ? 'passed' : 'failed',
          actualValue: h.xcto || undefined,
          recommendedValue: 'nosniff',
          descriptionAr: 'منع المتصفح من تخمين نوع الوسائط MIME والتصدي لملفات البرمجيات الخبيثة المتخفية.',
          descriptionEn: 'Stops MIME-type sniffing and executable masquerading.',
          riskIfMissingAr: 'تنفيذ ملفات نصية كشيفرات برمجية خبيثة.',
          riskIfMissingEn: 'Execution of malicious files disguised as images.'
        },
        {
          key: 'Referrer-Policy',
          status: h.refPol ? 'passed' : 'warning',
          actualValue: h.refPol || undefined,
          recommendedValue: 'strict-origin-when-cross-origin',
          descriptionAr: 'التحكم في بيانات الإحالة المرسلة عند انتقال الزائر لروابط خارجية لحماية مسارات المستخدم.',
          descriptionEn: 'Controls referrer data sent in request headers.',
          riskIfMissingAr: 'تسريب مسارات الروابط الحساسة وعناوين الـ URLs الداخلية.',
          riskIfMissingEn: 'Information leakage via Referer request headers.'
        },
        {
          key: 'Permissions-Policy',
          status: h.permPol ? 'passed' : 'warning',
          actualValue: h.permPol || undefined,
          recommendedValue: 'geolocation=(), camera=(), microphone=()',
          descriptionAr: 'تقييد الوصول إلى ميزات الأجهزة كالكاميرا والميكروفون والموقع الجغرافي.',
          descriptionEn: 'Restricts browser hardware features like camera and mic.',
          riskIfMissingAr: 'تفعيل غير مرغوب فيه لميزات الجهاز دون علم الزائر.',
          riskIfMissingEn: 'Unrestricted browser API hardware access.'
        }
      ];

      setAuditResult({
        url: targetUrl,
        grade: data.audit.grade as any,
        score: data.audit.score,
        headers: items,
        missingHeadersCount: items.filter(i => i.status === 'failed').length,
        analyzedAt: new Date().toISOString()
      });
    } catch {
      setAuditResult(auditSecurityHeaders(targetUrl.trim()));
    } finally {
      setIsAuditing(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const getGradeColor = (grade: HeaderAuditResult['grade']) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'B':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      case 'C':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'D':
      case 'F':
      default:
        return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Grade Header Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-1">
              {isAr ? 'فاحص ترويسات الأمان (Security Headers Audit)' : 'HTTP Security Headers Inspector'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? 'فحص ترويسات HTTP الوقائية ضد هجمات Clickjacking، وحقن السكربتات XSS، وتجاوز نوع الوسائط MIME، وتأمين بروتوكول HSTS.'
                : 'Audit defense-in-depth response headers against Clickjacking, XSS injections, MIME-sniffing, and HSTS downgrades.'}
            </p>

            <form onSubmit={handleAudit} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                dir="ltr"
                className="w-full flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAuditing}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition-colors cursor-pointer shrink-0"
              >
                {isAuditing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                <span>{isAuditing ? (isAr ? 'جاري الفحص...' : 'Auditing...') : (isAr ? 'فحص الترويسات' : 'Audit Headers')}</span>
              </button>
            </form>
          </div>

          {/* Grade Badge */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-950/80 min-w-[130px] shrink-0">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              {isAr ? 'التقييم الأمني' : 'Security Grade'}
            </span>
            <div className={`flex h-16 w-16 items-center justify-center rounded-xl border text-3xl font-black font-mono shadow-inner ${getGradeColor(auditResult.grade)}`}>
              {auditResult.grade}
            </div>
            <span className="mt-2 text-xs font-mono tabular-nums text-slate-300">
              {auditResult.score}/100 {isAr ? 'نقاط' : 'Score'}
            </span>
          </div>
        </div>
      </div>

      {/* Headers Table / Breakdown */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            {isAr ? 'تحليل الترويسات الفردية' : 'Individual Header Verification Matrix'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {auditResult.headers.filter(h => h.status === 'passed').length}/{auditResult.headers.length} {isAr ? 'محققة' : 'Passed'}
          </span>
        </div>

        <div className="space-y-3">
          {auditResult.headers.map((header) => {
            const isPassed = header.status === 'passed';
            const isWarning = header.status === 'warning';
            return (
              <div
                key={header.key}
                className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isPassed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-mono text-sm font-bold text-slate-200" dir="ltr">
                      {header.key}
                    </span>
                  </div>

                  <span className={`text-xs font-mono font-medium ${isPassed ? 'text-emerald-400' : isWarning ? 'text-amber-400' : 'text-rose-400'}`}>
                    {isPassed
                      ? (isAr ? 'محققة بنجاح' : 'Passed')
                      : isWarning
                        ? (isAr ? 'تحذير / تكوين جزئي' : 'Warning / Partial')
                        : (isAr ? 'مفقودة (خطر)' : 'Missing (Vulnerable)')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                  {isAr ? header.descriptionAr : header.descriptionEn}
                </p>

                {header.actualValue && (
                  <div className="mb-2 text-[11px] font-mono rounded bg-slate-900 px-2.5 py-1.5 text-slate-300 border border-slate-800 break-all" dir="ltr">
                    <span className="text-slate-500 select-none">Actual: </span>
                    {header.actualValue}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] pt-2 border-t border-slate-800/60">
                  <div className="font-mono text-slate-400 break-all" dir="ltr">
                    <span className="text-emerald-400/90 select-none">{isAr ? 'القيمة المقترحة: ' : 'Recommended: '}</span>
                    {header.recommendedValue}
                  </div>
                  {!isPassed && (
                    <span className="text-rose-400/90 shrink-0">
                      {isAr ? header.riskIfMissingAr : header.riskIfMissingEn}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Remediation Code Snippets */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'كود الإصلاح والتحصين المباشر' : 'Instant Server Hardening Snippet'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'اختر بيئة التشغيل لنسخ التكوين المحصن وتطبيقه على خادمك.'
                  : 'Select your server platform to copy production-ready hardening headers.'}
              </p>
            </div>
          </div>

          {/* Platform Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveSnippetTab('cloudflare')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSnippetTab === 'cloudflare'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cloudflare Worker
            </button>
            <button
              onClick={() => setActiveSnippetTab('nginx')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSnippetTab === 'nginx'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nginx
            </button>
            <button
              onClick={() => setActiveSnippetTab('apache')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSnippetTab === 'apache'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Apache
            </button>
          </div>
        </div>

        {/* Code Viewport with Copy Button */}
        <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
          <button
            onClick={() => {
              const code =
                activeSnippetTab === 'cloudflare'
                  ? auditResult.cloudflareSnippet
                  : activeSnippetTab === 'nginx'
                    ? auditResult.nginxSnippet
                    : auditResult.apacheSnippet;
              copyCode(code);
            }}
            className="absolute top-3 end-3 flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer shadow"
          >
            {copiedSnippet ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedSnippet ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
          </button>

          <pre dir="ltr" className="pt-6 sm:pt-0 leading-relaxed">
            {activeSnippetTab === 'cloudflare' && auditResult.cloudflareSnippet}
            {activeSnippetTab === 'nginx' && auditResult.nginxSnippet}
            {activeSnippetTab === 'apache' && auditResult.apacheSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
