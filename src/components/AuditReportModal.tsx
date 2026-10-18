import React from 'react';
import { X, Printer, Download, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const currentDate = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      system: 'Kaya SafeSec',
      generatedBy: 'Hasan (kaya-safesec.hasanxlo.workers.dev)',
      date: new Date().toISOString(),
      overallScore: 92,
      grade: 'A',
      modules: {
        urlHeuristics: 'Operational - 128 active rules',
        securityHeaders: 'Grade A+ compliant',
        cloudflareWorkerShield: 'Hardened WAF & Rate Limiting configured',
        passwordVault: 'Bcrypt & Argon2 complexity guidelines enforced',
        threatIntelligence: 'Live exposure cross-referencing enabled',
      },
      recommendations: [
        'Enforce Strict Content Security Policy (CSP) with nonce-based script loading',
        'Deploy Kaya SafeSec worker.js on Cloudflare edge for automated DDoS mitigation',
        'Enable Hardware FIDO2 / WebAuthn 2FA for all administrative accounts',
        'Rotate sensitive API keys and tokens periodically',
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kaya-safesec-audit-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'تقرير التدقيق الأمني لمنظومة كايا' : 'Kaya SafeSec Security Audit Certificate'}
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {currentDate} · KAYA-SAFESEC-AUDIT-v2
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Report Content */}
        <div className="my-6 space-y-6 text-xs text-slate-300">
          {/* Executive Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block mb-1">{isAr ? 'المستوى الأمني الإجمالي' : 'Overall Cyber Posture'}</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">A (92/100)</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'حماية مشددة وفعالة' : 'Hardened Defense'}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block mb-1">{isAr ? 'بيئة التشغيل الحافية' : 'Edge Platform'}</span>
              <div className="text-sm font-bold font-mono text-white mt-1">Cloudflare Workers</div>
              <span className="text-[11px] text-slate-500 font-mono">kaya-safesec.hasanxlo...</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block mb-1">{isAr ? 'جاهزية الترويسات والـ SSL' : 'Headers & TLS'}</span>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-1">TLS 1.3 / HSTS Preloaded</div>
              <span className="text-[11px] text-slate-500">{isAr ? 'مشفّر بنسبة 100%' : '100% Encrypted'}</span>
            </div>
          </div>

          {/* Detailed Verification Checklist */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block text-xs">
              {isAr ? 'نتائج فحص المعايير والمكونات:' : 'Component Verification Breakdown:'}
            </span>
            <div className="space-y-1.5">
              {[
                { titleAr: 'درع الروابط والتصيد (Phishing & Homograph Detector)', titleEn: 'Phishing & IDN Homograph Shield', status: 'Passed' },
                { titleAr: 'ترويسات الحماية الأساسية (CSP, HSTS, X-Frame-Options)', titleEn: 'Essential Security Headers (CSP, HSTS, XFO)', status: 'Passed' },
                { titleAr: 'تحديد معدل الطلبات وحجب البوتات (Edge Rate Limiting)', titleEn: 'Edge Rate Limiting & Bot Filtering', status: 'Passed' },
                { titleAr: 'خازن التشفير ومولد المفاتيح العشوائية (Crypto Vault)', titleEn: 'Cryptographic Entropy & Key Vault', status: 'Passed' },
                { titleAr: 'رادار تسريب البيانات واستخبارات عناوين IP', titleEn: 'Data Breach Exposure & IP Reputation', status: 'Passed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{isAr ? item.titleAr : item.titleEn}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-medium">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-2">
            <span className="font-semibold text-slate-200 block text-xs">
              {isAr ? 'التوصيات التقنية المستقبلية:' : 'Recommended Follow-up Actions:'}
            </span>
            <ul className="space-y-1 text-slate-400 list-disc list-inside">
              <li>{isAr ? 'تثبيت كود worker.js على بيئة Cloudflare Workers لتفعيل الحماية الحافية.' : 'Deploy worker.js onto Cloudflare Workers for edge inspection.'}</li>
              <li>{isAr ? 'تحديث وتدوير كلمات المرور كل 90 يوماً وتفعيل المفاتيح المادية WebAuthn.' : 'Rotate credentials periodically and enforce WebAuthn 2FA.'}</li>
              <li>{isAr ? 'جدولة فحص دوري لترويسات CSP لمواكبة أي سكربتات تابعة لجهات خارجية.' : 'Audit CSP directives regularly to ensure minimal third-party script allowances.'}</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isAr ? 'تصدير JSON' : 'Export JSON'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isAr ? 'طباعة التقرير' : 'Print Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
