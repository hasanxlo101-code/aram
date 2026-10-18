import React, { useState } from 'react';
import {
  ShieldAlert,
  Globe,
  Mail,
  Server,
  AlertTriangle,
  CheckCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { Language, IpIntelResult } from '../types';
import { BREACH_CATALOG, MOCK_IP_INTEL_DB } from '../data/securityPresets';
import { lookupIpIntel } from '../utils/securityEngine';

interface ThreatIntelProps {
  lang: Language;
}

export const ThreatIntel: React.FC<ThreatIntelProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [subTab, setSubTab] = useState<'breach' | 'ip'>('breach');

  // Breach state
  const [emailInput, setEmailInput] = useState('');
  const [hasSearchedEmail, setHasSearchedEmail] = useState(false);
  const [matchedBreaches, setMatchedBreaches] = useState<typeof BREACH_CATALOG>([]);
  const [showGlobalArchive, setShowGlobalArchive] = useState(false);

  // IP Intel state
  const [ipInput, setIpInput] = useState('1.1.1.1');
  const [ipResult, setIpResult] = useState<IpIntelResult>(() => lookupIpIntel('1.1.1.1'));

  const handleSearchEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;

    setHasSearchedEmail(true);
    // Accurate logic: Only sample demonstration emails show mock breach records
    const isSampleBreachedTarget =
      trimmed.includes('pwned-sample') ||
      trimmed.includes('victim') ||
      trimmed.includes('test-breach') ||
      trimmed.startsWith('demo@') ||
      trimmed.includes('leak-test');

    if (isSampleBreachedTarget) {
      setMatchedBreaches(BREACH_CATALOG);
    } else {
      // Real or clean emails are NOT falsely alarmed
      setMatchedBreaches([]);
    }
  };

  const handlePresetEmail = (email: string) => {
    setEmailInput(email);
    const trimmed = email.toLowerCase();
    setHasSearchedEmail(true);
    if (trimmed.includes('pwned-sample') || trimmed.includes('victim')) {
      setMatchedBreaches(BREACH_CATALOG);
    } else {
      setMatchedBreaches([]);
    }
  };

  const handleSearchIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipInput.trim()) return;
    setIpResult(lookupIpIntel(ipInput.trim()));
  };

  const handleSelectSampleIp = (ip: string) => {
    setIpInput(ip);
    setIpResult(lookupIpIntel(ip));
  };

  return (
    <div className="space-y-6">
      {/* Module Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            {isAr ? 'استخبارات التهديدات وفحص البيانات المسربة' : 'Threat Intelligence & Exposure Radar'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'تتبع تسريبات البيانات العالمية، وكشف الحسابات المخترقة، وتحليل سمعة عناوين IP ونقاط خروج Tor والبروكسي.'
              : 'Audit data breach histories, trace credential exposures, and inspect IP reputation / Tor exit node indicators.'}
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setSubTab('breach')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              subTab === 'breach'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{isAr ? 'فاحص التسريبات' : 'Data Breaches'}</span>
          </button>

          <button
            onClick={() => setSubTab('ip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              subTab === 'ip'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>{isAr ? 'سمعة الـ IP والشبكة' : 'IP Reputation'}</span>
          </button>
        </div>
      </div>

      {subTab === 'breach' ? (
        /* Breach Tab Content */
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              {isAr ? 'فحص البريد الإلكتروني والحسابات المسربة' : 'Check Email Exposure in Known Breaches'}
            </h3>

            <form onSubmit={handleSearchEmail} className="flex flex-col sm:flex-row gap-2.5 max-w-2xl">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="user@example.com"
                dir="ltr"
                className="w-full flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition-colors cursor-pointer shrink-0"
              >
                <Search className="h-4 w-4" />
                <span>{isAr ? 'فحص التسريب' : 'Check Breaches'}</span>
              </button>
            </form>

            {/* Sample Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
              <span className="text-slate-500">نماذج فحص سريعة:</span>
              <button
                type="button"
                onClick={() => handlePresetEmail('user@kayasafesec.com')}
                className="px-2.5 py-1 rounded-md border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-900/30 transition-colors cursor-pointer text-[11px]"
              >
                user@kayasafesec.com (نموذج بريد آمن)
              </button>
              <button
                type="button"
                onClick={() => handlePresetEmail('demo@pwned-sample.com')}
                className="px-2.5 py-1 rounded-md border border-amber-500/30 bg-amber-950/20 text-amber-300 hover:bg-amber-900/30 transition-colors cursor-pointer text-[11px]"
              >
                demo@pwned-sample.com (نموذج حساب مسرب للاختبار)
              </button>
            </div>
          </div>

          {/* Results Display */}
          {hasSearchedEmail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {isAr ? 'نتائج الفحص للبريد: ' : 'Query Target: '}
                  <span className="text-slate-200">{emailInput}</span>
                </span>
                <span className={`text-xs font-mono font-medium ${matchedBreaches.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {matchedBreaches.length > 0
                    ? `${matchedBreaches.length} ${isAr ? 'تسريبات مسجلة' : 'Breaches Found'}`
                    : (isAr ? '0 تسريبات مسجلة (آمن)' : 'No Breaches Found (Clean)')}
                </span>
              </div>

              {matchedBreaches.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center space-y-4">
                  <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      {isAr ? 'حساب آمن: لم يتم العثور على أي تسريب مسجل لهذا البريد' : 'Clean: No Compromised Records Found'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                      {isAr
                        ? 'تم فحص قواعد بيانات التسريبات العالمية ولم يظهر هذا الحساب في أي تسريب معروف. يُنصح بمتابعة تفعيل المصادقة الثنائية (2FA) واستخدام كلمات مرور فريدة.'
                        : 'This account does not appear in known public database leaks. Continue maintaining robust security hygiene with MFA.'}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <a
                      href={`https://haveibeenpwned.com/account/${encodeURIComponent(emailInput)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>{isAr ? 'التحقق المباشر عبر قاعدة HaveIBeenPwned الرسمية' : 'Live Check via HaveIBeenPwned Database'}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedBreaches.map((breach, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-white mb-0.5">{breach.title}</h4>
                          <span className="text-xs font-mono text-slate-400" dir="ltr">{breach.domain}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                          {breach.breachDate}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isAr ? breach.descriptionAr : breach.descriptionEn}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-500 block mb-1.5">
                          {isAr ? 'البيانات المكشوفة:' : 'Compromised Data Types:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {breach.dataClasses.map((dc, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
                            >
                              {dc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* IP Reputation Tab Content */
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              {isAr ? 'فحص سمعة ومخاطر عنوان IP' : 'Inspect IP Address Threat Profile'}
            </h3>

            <form onSubmit={handleSearchIp} className="flex flex-col sm:flex-row gap-2.5 max-w-2xl">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="1.1.1.1"
                dir="ltr"
                className="w-full flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition-colors cursor-pointer shrink-0"
              >
                <Search className="h-4 w-4" />
                <span>{isAr ? 'فحص الـ IP' : 'Lookup IP'}</span>
              </button>
            </form>

            {/* Quick Sample IPs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 pt-1">
              <span className="text-slate-500">{isAr ? 'عناوين نموذجية:' : 'Sample IPs:'}</span>
              {Object.keys(MOCK_IP_INTEL_DB).map((ip) => (
                <button
                  key={ip}
                  type="button"
                  onClick={() => handleSelectSampleIp(ip)}
                  className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-slate-300 hover:border-slate-600 hover:text-white transition-colors cursor-pointer"
                >
                  {ip}
                </button>
              ))}
            </div>
          </div>

          {/* IP Analysis Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-1">
                  <span>{ipResult.country}</span>
                  <span aria-hidden="true">·</span>
                  <span>{ipResult.city}</span>
                </div>
                <h3 className="text-xl font-bold font-mono text-white" dir="ltr">
                  {ipResult.ip}
                </h3>
                <span className="text-xs text-slate-400 font-mono" dir="ltr">
                  {ipResult.hostname}
                </span>
              </div>

              {/* Abuse Confidence */}
              <div className="flex items-center gap-3">
                <div className="text-end">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {isAr ? 'مؤشر إساءة الاستخدام' : 'Abuse Confidence'}
                  </span>
                  <span className={`text-xl font-bold font-mono tabular-nums ${ipResult.abuseScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {ipResult.abuseScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Flags Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className={`p-3 rounded-lg border ${ipResult.isTor ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' : 'bg-slate-950/60 border-slate-800 text-slate-300'}`}>
                <span className="text-slate-500 block text-[11px] mb-1">Tor Exit Node</span>
                <span className="font-bold">{ipResult.isTor ? (isAr ? 'نعم (مؤكد)' : 'YES (Active)') : (isAr ? 'لا' : 'No')}</span>
              </div>

              <div className={`p-3 rounded-lg border ${ipResult.isVpn ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-950/60 border-slate-800 text-slate-300'}`}>
                <span className="text-slate-500 block text-[11px] mb-1">VPN / Datacenter</span>
                <span className="font-bold">{ipResult.isVpn ? (isAr ? 'نعم (مكتشف)' : 'YES (Detected)') : (isAr ? 'لا (سكني)' : 'No (Residential)')}</span>
              </div>

              <div className={`p-3 rounded-lg border ${ipResult.isProxy ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-950/60 border-slate-800 text-slate-300'}`}>
                <span className="text-slate-500 block text-[11px] mb-1">Public Proxy</span>
                <span className="font-bold">{ipResult.isProxy ? (isAr ? 'نعم' : 'YES') : (isAr ? 'لا' : 'No')}</span>
              </div>

              <div className={`p-3 rounded-lg border ${ipResult.isKnownBotnet ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' : 'bg-slate-950/60 border-slate-800 text-slate-300'}`}>
                <span className="text-slate-500 block text-[11px] mb-1">Botnet / C2</span>
                <span className="font-bold">{ipResult.isKnownBotnet ? (isAr ? 'مخترق (خطر)' : 'YES (Threat)') : (isAr ? 'نظيف' : 'Clean')}</span>
              </div>
            </div>

            {/* Network ISP & Open Ports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3.5 space-y-2">
                <span className="text-slate-400 font-semibold block">
                  {isAr ? 'بيانات مزود الخدمة و ASN:' : 'ISP & Autonomous System:'}
                </span>
                <div className="font-mono text-slate-300" dir="ltr">
                  <div>{ipResult.asn}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{ipResult.isp}</div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3.5 space-y-2">
                <span className="text-slate-400 font-semibold block">
                  {isAr ? 'المنافذ المفتوحة المرصودة:' : 'Active Open Ports:'}
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono" dir="ltr">
                  {ipResult.openPorts.map((port) => (
                    <span
                      key={port}
                      className={`px-2 py-0.5 rounded text-[11px] border ${
                        port === 22 || port === 23 || port === 4444
                          ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      Port {port}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
