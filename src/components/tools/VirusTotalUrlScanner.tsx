import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Server,
  Lock,
  Layers,
  Sparkles,
  Info,
  Clock,
  Hash,
  Terminal,
  Activity,
  XCircle,
  FileCode
} from 'lucide-react';
import { calculateShannonEntropy } from '../../utils/securityEngine';

interface LiveScanResponse {
  url: string;
  hostname: string;
  finalUrl: string;
  httpStatus: number;
  latencyMs: number;
  fetchError: string | null;
  isReachable: boolean;
  dns: {
    ipAddresses: string[];
    mxRecords: string[];
    hasTxtSpf: boolean;
  };
  headers: {
    csp: string | null;
    hsts: string | null;
    xfo: string | null;
    xcto: string | null;
    refPol: string | null;
    permPol: string | null;
    server: string | null;
    raw: Record<string, string>;
  };
  audit: {
    score: number;
    grade: string;
  };
  virustotal: {
    sha256: string;
    reportUrl: string;
  };
}

export const VirusTotalUrlScanner: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://cloudflare.com');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<LiveScanResponse | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'headers' | 'dns' | 'vt'>('overview');

  const executeLiveScan = async (target: string) => {
    const cleanTarget = target.trim();
    if (!cleanTarget) return;

    setIsScanning(true);
    setScanError(null);

    try {
      const res = await fetch('/api/security/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanTarget }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `خطأ في الخادم: ${res.status}`);
      }

      const data: LiveScanResponse = await res.json();
      setScanResult(data);
    } catch (err: any) {
      setScanError(err.message || 'تعذر الاتصال بخادم الفحص');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    executeLiveScan('https://cloudflare.com');
  }, []);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLiveScan(urlInput);
  };

  const handleSelectPreset = (target: string) => {
    setUrlInput(target);
    executeLiveScan(target);
  };

  // Real heuristics calculation
  const urlLower = urlInput.toLowerCase();
  const entropy = calculateShannonEntropy(urlInput);
  const isPunycode = urlLower.includes('xn--');
  const hasHighRiskTld = ['.xyz', '.top', '.live', '.click', '.fit', '.tk', '.ml', '.cf', '.gq'].some(tld =>
    scanResult ? scanResult.hostname.endsWith(tld) : urlLower.includes(tld)
  );
  const hasPhishKeywords = ['phish', 'login-verify', 'bank-security', 'free-crypto', 'airdrop', 'claim-reward', 'auth-token'].some(k =>
    urlLower.includes(k)
  );
  const isHttps = urlInput.startsWith('https://');

  const isCriticalRisk = isPunycode || (hasHighRiskTld && hasPhishKeywords);
  const isWarningRisk = !isCriticalRisk && (hasHighRiskTld || hasPhishKeywords || !isHttps);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-slate-950 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <Radio className="h-4 w-4 animate-pulse" />
              <span>LIVE TELEMETRY & MULTI-SOURCE THREAT INSPECTOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              فاحص الروابط الحقيقي واستخبارات التهديدات
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              فحص حي ومباشر عبر خادم التطبيق: يجري استعلامات DNS حقيقية، يقيس زمن الاستجابة والكمون، يدقق الترويسات الأمنية الصادرة من الخادم الفعلي، ويولد رابط الفحص المباشر لدى VirusTotal الرسمي.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>بيانات حية 100% بدون محاكاة</span>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleScanSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="أدخل رابط الموقع، الدومين، أو عنوان الـ URL لفحصه حياً... (مثال: https://google.com)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pr-10 pl-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors font-mono"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/15 cursor-pointer disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>جارٍ فحص الخادم الحي...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>فحص الرابط حياً</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Sample Targets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-mono">نماذج حية للتجربة:</span>
          <button
            type="button"
            onClick={() => handleSelectPreset('https://cloudflare.com')}
            className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            Cloudflare (رسمي)
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset('https://google.com')}
            className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            Google (رسمي)
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset('https://github.com')}
            className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            GitHub (رسمي)
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {scanError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>خطأ في الفحص: {scanError}</span>
        </div>
      )}

      {/* Main Results Dashboard */}
      {scanResult && (
        <div className="space-y-6">
          {/* Top Live Summary Strip */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isCriticalRisk
              ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/30 via-slate-950 to-slate-950'
              : isWarningRisk
              ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/30 via-slate-950 to-slate-950'
              : 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-slate-950'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                    scanResult.isReachable
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {scanResult.isReachable ? `HTTP ${scanResult.httpStatus} متصل ونشط` : 'الخادم غير مستجيب'}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>الكمون: {scanResult.latencyMs} ms</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    تقييم الترويسات: {scanResult.audit.grade} ({scanResult.audit.score}/100)
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white break-all font-mono" dir="ltr">
                  {scanResult.finalUrl}
                </h3>
                <p className="text-xs text-slate-300">
                  تم التحقق من استجابة الخادم الفعلي وتسجيل الترويسات الأصلية وسجلات الـ DNS المرتبطة.
                </p>
              </div>

              {/* Direct Official VirusTotal Deep Link Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                <a
                  href={scanResult.virustotal.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-500/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>فتح التقرير الرسمي على VirusTotal</span>
                </a>

                <a
                  href={`https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(scanResult.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                >
                  <Search className="h-3.5 w-3.5 text-cyan-400" />
                  <span>فحص Google Safe Browsing</span>
                </a>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-[10px] text-slate-400 block">عناوين IP المرصودة</span>
                <span className="text-sm font-bold text-white mt-1 block truncate" dir="ltr">
                  {scanResult.dns.ipAddresses[0] || 'غير متوفر'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {scanResult.dns.ipAddresses.length} عنوان مسجل
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-[10px] text-slate-400 block">سيرفر الويب (Server)</span>
                <span className="text-sm font-bold text-cyan-300 mt-1 block truncate" dir="ltr">
                  {scanResult.headers.server || 'مخفي / WAF Protected'}
                </span>
                <span className="text-[10px] text-slate-500">حماية الكشف</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-[10px] text-slate-400 block">معامل العشوائية (Entropy)</span>
                <span className="text-sm font-bold text-amber-300 mt-1 block">
                  {entropy} bits
                </span>
                <span className="text-[10px] text-slate-500">
                  {entropy > 4.5 ? 'تشويش عالي (مريب)' : 'توزيع طبيعي'}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-[10px] text-slate-400 block">بصمة SHA-256</span>
                <span className="text-[11px] font-bold text-slate-400 mt-1 block truncate" dir="ltr">
                  {scanResult.virustotal.sha256.slice(0, 16)}...
                </span>
                <span className="text-[10px] text-emerald-400">معرف التتبع الدولي</span>
              </div>
            </div>
          </div>

          {/* Sub-Tabs Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>مؤشرات الأمان والتهديدات</span>
            </button>

            <button
              onClick={() => setActiveTab('headers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'headers'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>الترويسات الحية ({Object.keys(scanResult.headers.raw).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('dns')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dns'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Server className="h-3.5 w-3.5" />
              <span>سجلات الـ DNS</span>
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>المعايير الأمنية الإيجابية المكتشفة</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>البروتوكول المستخدم: {isHttps ? 'HTTPS مشفر بـ TLS' : 'HTTP غير مشفر (خطر)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {scanResult.headers.hsts ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                    <span>فرض التشفير الصارم HSTS: {scanResult.headers.hsts ? 'مفعّل' : 'غير مفعّل'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {scanResult.headers.csp ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                    <span>سياسة أمان المحتوى CSP: {scanResult.headers.csp ? 'مطبقة بنجاح' : 'مفقودة'}</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>التحليل الهيكلي والسلوكي (Heuristics)</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-2">
                    {isPunycode ? (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                    <span>هجمات التجانس (IDN Punycode): {isPunycode ? 'رُصدت محارف وهمية خادعة!' : 'نطاق نقي وسليم'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {hasHighRiskTld ? (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                    <span>نطاق المستوى الأعلى (TLD): {hasHighRiskTld ? 'نطاق مجاني/رخيص عالي المخاطر' : 'نطاق قياسي موثوق'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {hasPhishKeywords ? (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                    <span>كلمات التصيد في الرابط: {hasPhishKeywords ? 'رُصدت كلمات انتحال مريبة!' : 'لا توجد كلمات انتحال شائعة'}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Raw Headers */}
          {activeTab === 'headers' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-850">
                <span>الترويسات الحية المستلمة مباشرة من خادم الموقع:</span>
                <span className="text-[10px] text-cyan-400">{Object.keys(scanResult.headers.raw).length} ترويسة</span>
              </div>
              <div className="space-y-1.5 max-h-96 overflow-y-auto" dir="ltr">
                {Object.entries(scanResult.headers.raw).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-slate-900 border border-slate-850 text-slate-300 break-all">
                    <span className="text-cyan-400 font-bold">{key}:</span> {val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: DNS Records */}
          {activeTab === 'dns' && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4 text-xs font-mono">
              <div>
                <h5 className="font-bold text-white mb-2">سجلات العناوين (A / AAAA IPv4):</h5>
                <div className="space-y-1" dir="ltr">
                  {scanResult.dns.ipAddresses.map(ip => (
                    <div key={ip} className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                      {ip}
                    </div>
                  ))}
                  {scanResult.dns.ipAddresses.length === 0 && (
                    <p className="text-slate-500">لا توجد سجلات A مسجلة لهذا النطاق.</p>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-white mb-2">خوادم البريد الإلكتروني (MX Records):</h5>
                <div className="space-y-1" dir="ltr">
                  {scanResult.dns.mxRecords.map(mx => (
                    <div key={mx} className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                      {mx}
                    </div>
                  ))}
                  {scanResult.dns.mxRecords.length === 0 && (
                    <p className="text-slate-500">لا توجد سجلات MX مسجلة لهذا النطاق.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
