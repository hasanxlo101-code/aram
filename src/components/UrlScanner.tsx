import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  Globe,
  Server,
  Share2,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { Language, UrlScanResult } from '../types';
import { analyzeUrl } from '../utils/securityEngine';
import { SAMPLE_SCAN_TARGETS } from '../data/securityPresets';

interface UrlScannerProps {
  lang: Language;
  initialResult?: UrlScanResult | null;
}

export const UrlScanner: React.FC<UrlScannerProps> = ({ lang, initialResult }) => {
  const isAr = lang === 'ar';
  const [urlInput, setUrlInput] = useState(
    initialResult ? initialResult.url : 'https://kaya-safesec.hasanxlo.workers.dev'
  );
  const [scanResult, setScanResult] = useState<UrlScanResult>(() => {
    return initialResult || analyzeUrl('https://kaya-safesec.hasanxlo.workers.dev');
  });
  const [isScanning, setIsScanning] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setIsScanning(true);
    try {
      const baseResult = analyzeUrl(urlInput.trim());
      const res = await fetch('/api/security/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      if (res.ok) {
        const live = await res.json();
        if (live.dns && live.dns.ipAddresses && live.dns.ipAddresses.length > 0) {
          baseResult.dnsAnalysis.ipAddress = live.dns.ipAddresses[0];
          baseResult.dnsAnalysis.nameservers = live.dns.mxRecords || [];
        }
        if (live.headers && live.headers.server) {
          baseResult.dnsAnalysis.asn = `Server: ${live.headers.server}`;
        }
      }
      setScanResult(baseResult);
    } catch {
      setScanResult(analyzeUrl(urlInput.trim()));
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrlInput(presetUrl);
    setTimeout(() => {
      handleScan();
    }, 50);
  };

  const copyScanSummary = () => {
    const summary = `[Kaya SafeSec Scan Report]
Target: ${scanResult.url}
Score: ${scanResult.score}/100 (${scanResult.severity.toUpperCase()})
Status: ${isAr ? scanResult.summaryTextAr : scanResult.summaryTextEn}
Host IP: ${scanResult.dnsAnalysis.ipAddress} (${scanResult.dnsAnalysis.country})`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Severity visual styles
  const getSeverityBadge = (severity: UrlScanResult['severity']) => {
    switch (severity) {
      case 'safe':
        return {
          bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400',
          labelAr: 'آمن ومعتمد',
          labelEn: 'Verified Safe',
          icon: ShieldCheck,
        };
      case 'low':
      case 'medium':
        return {
          bg: 'bg-amber-950/60 border-amber-500/40 text-amber-400',
          labelAr: 'مشبوه / يتطلب الحذر',
          labelEn: 'Suspicious / Caution',
          icon: AlertTriangle,
        };
      case 'high':
      case 'critical':
      default:
        return {
          bg: 'bg-rose-950/60 border-rose-500/40 text-rose-400',
          labelAr: 'خطر سيبراني مرتفع',
          labelEn: 'High Cyber Threat',
          icon: ShieldAlert,
        };
    }
  };

  const sevBadge = getSeverityBadge(scanResult.severity);
  const SevIcon = sevBadge.icon;

  return (
    <div className="space-y-6">
      {/* Header and Input Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">
            {isAr ? 'فاحص الروابط والتصيد والاحتيال' : 'URL & Phishing Heuristic Scanner'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'تحليل الروابط باستخدام خوارزميات الاستدلال، وكشف هجمات تشابه الأحرف (Punycode)، وفحص النطاقات الخبيثة وشهادات SSL.'
              : 'Analyze URLs using heuristic algorithms, detect IDN homograph punycode attacks, and audit SSL/DNS integrity.'}
          </p>
        </div>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/login"
              dir="ltr"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isScanning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            <span>{isScanning ? (isAr ? 'جاري التحليل...' : 'Analyzing...') : (isAr ? 'فحص الرابط' : 'Scan URL')}</span>
          </button>
        </form>

        {/* Quick presets buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          <span className="text-slate-500">{isAr ? 'تجربة عينات:' : 'Test Samples:'}</span>
          {SAMPLE_SCAN_TARGETS.map((target, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(target.url)}
              className="rounded border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-slate-300 hover:border-slate-600 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {isAr ? target.labelAr : target.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Correction Prompt Card if Mangled or Malformed */}
      {scanResult.isMangledOrMalformed && scanResult.suggestedCorrection && (
        <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs sm:text-sm">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{isAr ? 'تم رصد وتصحيح خطأ بنيوي في الرابط (Auto-Correction Ready)' : 'Structural URL Defect Detected & Corrected'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {isAr ? scanResult.correctionExplanationAr : scanResult.correctionExplanationEn}
            </p>
            <div className="font-mono text-xs text-emerald-400 pt-1" dir="ltr">
              → {scanResult.suggestedCorrection}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPreset(scanResult.suggestedCorrection!)}
            className="flex items-center justify-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-4 py-2 text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-lg shadow-cyan-500/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{isAr ? 'اعتماد الرابط الصحيح وفحصه الآن' : 'Apply & Scan Corrected URL'}</span>
          </button>
        </div>
      )}

      {/* Primary Result Overview Banner */}
      <div className={`rounded-xl border p-5 sm:p-6 transition-all ${sevBadge.bg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-current shrink-0">
              <SevIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono mb-1">
                <span className="font-bold">{isAr ? sevBadge.labelAr : sevBadge.labelEn}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {isAr ? `مؤشر الأمان: ${scanResult.score}/100` : `Trust Score: ${scanResult.score}/100`}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white break-all font-mono" dir="ltr">
                {scanResult.domain}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {isAr ? scanResult.summaryTextAr : scanResult.summaryTextEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={copyScanSummary}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            >
              {copiedSummary ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedSummary ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ التقرير' : 'Share Result')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Breakdown: Indicators & Network details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Card: Core Heuristics Analysis */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-400" />
            <span>{isAr ? 'مؤشرات الفحص الإرشادي' : 'Heuristic Scan Indicators'}</span>
          </h4>

          <div className="space-y-3 text-xs">
            {/* Protocol */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'بروتوكول النقل' : 'Transport Protocol'}</span>
              <div className="flex items-center gap-1.5 font-mono">
                {scanResult.protocol === 'https' ? (
                  <>
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-300">HTTPS (TLS Encrypted)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-rose-400 font-bold">HTTP (Insecure)</span>
                  </>
                )}
              </div>
            </div>

            {/* Punycode */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'فحص تشابه الأحرف (Punycode)' : 'IDN Homograph Spoofing'}</span>
              <span className={`font-mono font-medium ${scanResult.isPunycode ? 'text-rose-400' : 'text-slate-300'}`}>
                {scanResult.isPunycode
                  ? (isAr ? 'تم اكتشاف محارف خادعة' : 'Punycode Detected (Risk)')
                  : (isAr ? 'سليم (ASCII قياسي)' : 'Clean Standard ASCII')}
              </span>
            </div>

            {/* Suspicious TLD */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'سمعة امتداد النطاق (TLD)' : 'TLD Extension Reputation'}</span>
              <span className={`font-mono font-medium ${scanResult.hasSuspiciousTLD ? 'text-amber-400' : 'text-emerald-400'}`}>
                {scanResult.hasSuspiciousTLD
                  ? (isAr ? 'امتداد عالي الخطورة' : 'High Risk Disposable TLD')
                  : (isAr ? 'امتداد ذو سمعة مستقرة' : 'Standard Trusted TLD')}
              </span>
            </div>

            {/* IP as Host */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'هيكل اسم المضيف' : 'Hostname Format'}</span>
              <span className={`font-mono font-medium ${scanResult.isIpLiteral ? 'text-rose-400' : 'text-slate-300'}`}>
                {scanResult.isIpLiteral
                  ? (isAr ? 'عنوان IP مباشر (غير آمن)' : 'Raw IP Hostname (Alert)')
                  : (isAr ? 'اسم نطاق FQDN قياسي' : 'Standard FQDN')}
              </span>
            </div>

            {/* Shannon Entropy */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">{isAr ? 'معامل شانون للعشوائية (Entropy)' : 'Shannon Character Entropy'}</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-200 tabular-nums">{scanResult.entropyScore} bits</span>
                <span className="text-[11px] text-slate-500">
                  {scanResult.entropyScore > 3.8
                    ? (isAr ? '(عشوائية مرتفعة)' : '(High Randomness)')
                    : (isAr ? '(طبيعي)' : '(Normal)')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: SSL & Network Infrastructure */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Server className="h-4 w-4 text-cyan-400" />
            <span>{isAr ? 'معلومات الشبكة وشهادة الأمان' : 'Network & Certificate Authority'}</span>
          </h4>

          <div className="space-y-3 text-xs">
            {/* SSL Issuer */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'جهة إصدار الشهادة (Issuer)' : 'Certificate Authority'}</span>
              <span className="font-mono text-slate-200 truncate max-w-[200px]" title={scanResult.sslStatus.issuer}>
                {scanResult.sslStatus.issuer}
              </span>
            </div>

            {/* Protocol Cipher */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'بروتوكول التشفير' : 'Cipher Negotiation'}</span>
              <span className="font-mono text-slate-300">
                {scanResult.sslStatus.protocol}
              </span>
            </div>

            {/* Resolved IP */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'عنوان IP الخادم' : 'Resolved IP Address'}</span>
              <span className="font-mono text-emerald-400 tabular-nums">
                {scanResult.dnsAnalysis.ipAddress}
              </span>
            </div>

            {/* Geolocation / ASN */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'الموقع الجغرافي والـ ASN' : 'Host Country & ASN'}</span>
              <span className="font-mono text-slate-300">
                {scanResult.dnsAnalysis.country} · {scanResult.dnsAnalysis.asn}
              </span>
            </div>

            {/* DNSSEC Status */}
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">{isAr ? 'حماية DNSSEC' : 'DNSSEC Validation'}</span>
              <span className={`font-mono font-medium ${scanResult.dnsAnalysis.hasDnsSec ? 'text-emerald-400' : 'text-slate-400'}`}>
                {scanResult.dnsAnalysis.hasDnsSec ? (isAr ? 'مفعل ومحمي' : 'Active & Signed') : (isAr ? 'غير مفعل' : 'Unsigned')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Vulnerabilities / Threats List */}
      {scanResult.detectedThreats.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>{isAr ? 'المخاطر والتهديدات المرصودة' : 'Identified Risk Vectors'}</span>
          </h4>
          <div className="space-y-2.5">
            {scanResult.detectedThreats.map((threat) => (
              <div
                key={threat.id}
                className="rounded-lg border border-slate-800/90 bg-slate-950/70 p-3.5 text-xs"
              >
                <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${threat.type === 'danger' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                  <span>{isAr ? threat.titleAr : threat.titleEn}</span>
                </div>
                <p className="text-slate-400 leading-relaxed ps-3.5">
                  {isAr ? threat.detailAr : threat.detailEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Recommendations */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-400" />
          <span>{isAr ? 'إجراءات الحماية والتوصيات' : 'Protective Actions & Recommendations'}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scanResult.recommendedActions.map((rec, i) => (
            <div key={i} className="rounded-lg border border-slate-800/70 bg-slate-950/50 p-3 text-xs">
              <div className="font-medium text-slate-200 mb-1">
                {isAr ? rec.titleAr : rec.titleEn}
              </div>
              <p className="text-slate-400 leading-relaxed">
                {isAr ? rec.descriptionAr : rec.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
