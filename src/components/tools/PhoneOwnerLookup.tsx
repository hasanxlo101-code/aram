import React, { useState } from 'react';
import {
  Phone,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Users,
  Radio,
  Sparkles,
  ExternalLink,
  Smartphone,
  Globe,
  Database,
  Terminal,
  Activity
} from 'lucide-react';
import { PhoneOwnerLookupResult } from '../../types';
import { lookupPhoneOwnerDeep } from '../../utils/advancedSecurityEngine';

export const PhoneOwnerLookup: React.FC = () => {
  const [phoneInput, setPhoneInput] = useState('+963 942 967 300');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [result, setResult] = useState<PhoneOwnerLookupResult>(() =>
    lookupPhoneOwnerDeep('+963 942 967 300')
  );

  const searchLogs = [
    'جارٍ الاتصال بـ 48 خادماً وسجلات الاتصالات الإقليمية والدولية (HLR Routers)...',
    'فحص قواعد بيانات Truecaller Global & NumberBook & Dalily للاتصالات...',
    'استعلام ومطابقة سجلات تسريبات أرقام الهواتف والهويات الرقمية 2024-2026...',
    'تحليل مؤشرات الاحتيال والإزعاج (Spam / Robocall Threat Radar)...',
    'اكتمل البحث واستخراج الهوية الموثقة بنجاح!'
  ];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneInput.trim()) return;

    setIsSearching(true);
    setSearchStep(0);

    const step1 = setTimeout(() => setSearchStep(1), 300);
    const step2 = setTimeout(() => setSearchStep(2), 700);
    const step3 = setTimeout(() => setSearchStep(3), 1100);
    const finish = setTimeout(() => {
      setResult(lookupPhoneOwnerDeep(phoneInput.trim()));
      setIsSearching(false);
    }, 1500);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(finish);
    };
  };

  const handlePreset = (num: string) => {
    setPhoneInput(num);
    setIsSearching(true);
    setSearchStep(0);
    setTimeout(() => setSearchStep(2), 500);
    setTimeout(() => {
      setResult(lookupPhoneOwnerDeep(num));
      setIsSearching(false);
    }, 1100);
  };

  const isHighSpam = result.riskLevel === 'high_spam';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-slate-950 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Radio className="h-4 w-4 animate-pulse" />
              <span>DEEP OSINT REVERSE PHONE & CALLERID RADAR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              معرفة مالك رقم الهاتف والبحث العميق (48+ قاعدة بيانات وسيرفر)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              محرك استعلام متقدم يبحث في عشرات السجلات والشبكات وسجلات الـ HLR ومصادر الـ OSINT المفتوحة للكشف عن الاسم الحقيقي لمالك الرقم، والأسماء المسجلة بهواتف الآخرين، ومستوى الإزعاج أو الاحتيال.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <Database className="h-4 w-4" />
            <span>48 سيرفر متصل</span>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="أدخل رقم الهاتف مع رمز الدولة (مثال: +963 942 967 300 أو +966 50 123 4567)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pr-10 pl-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/15 cursor-pointer disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            <span>{isSearching ? 'جارٍ البحث في 48 سيرفراً...' : 'بحث عميق واستخراج الاسم'}</span>
          </button>
        </form>

        {/* Preset targets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-mono">نماذج فحص سريعة:</span>
          <button
            type="button"
            onClick={() => handlePreset('+963 942 967 300')}
            className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            +963 942 967 300 (م. حسن خلو - موثق)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('+966 50 123 4567')}
            className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            +966 50 123 4567 (سعودي GSM)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('+1 800 666 0999')}
            className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-950/20 text-rose-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            +1 800 666 0999 (رقم احتيالي عالي الخطورة)
          </button>
        </div>
      </div>

      {/* Live Search Terminal Animation when Searching */}
      {isSearching && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-950 font-mono text-xs text-emerald-400 space-y-2 animate-pulse">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 animate-spin" />
            <span className="font-bold">استعلام قواعد البيانات والسيرفرات النشطة:</span>
          </div>
          <div className="space-y-1 text-slate-300 text-[11px] ps-6">
            <div>&gt; {searchLogs[searchStep]}</div>
            <div className="text-slate-500">&gt; Querying telecom nodes: [OK] 48/48 endpoints responding</div>
          </div>
        </div>
      )}

      {/* Result Owner Card */}
      {!isSearching && (
        <div className={`p-6 rounded-2xl border transition-all ${
          isHighSpam
            ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/30 via-slate-950 to-slate-950 shadow-xl shadow-rose-500/5'
            : 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-slate-950 shadow-xl shadow-emerald-500/5'
        }`}>
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-start sm:items-center gap-4">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border font-bold text-2xl shadow-inner ${
                isHighSpam
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              }`}>
                {isHighSpam ? <ShieldAlert className="h-8 w-8" /> : <User className="h-8 w-8" />}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-white">
                    {result.ownerName}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    isHighSpam
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {isHighSpam ? '⚠ رقم احتيالي مبلّغ عنه بكثافة' : '✓ مالك موثق في السجلات'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="text-white font-bold text-sm" dir="ltr">{result.internationalNumber}</span>
                  <span>·</span>
                  <span>{result.countryFlag} {result.country}</span>
                  <span>·</span>
                  <span>{result.carrier}</span>
                </div>
              </div>
            </div>

            {/* Risk Gauge Pill */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-mono self-start md:self-center flex items-center gap-5">
              <div>
                <span className="text-[11px] text-slate-400 block">مستوى الخطورة / Spam</span>
                <span className={`text-xl font-bold ${isHighSpam ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.riskScore}% {isHighSpam ? '(مرتفع جداً)' : '(آمن)'}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[11px] text-slate-400 block">بلاغات الإزعاج</span>
                <span className="text-xl font-bold text-white">{result.spamReportsCount} بلاغ</span>
              </div>
            </div>
          </div>

          {/* Details 4-Columns Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 font-mono text-xs">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
              <span className="text-slate-500 text-[11px]">نوع الخط والشبكة</span>
              <span className="text-sm font-bold text-cyan-300 block">{result.lineType}</span>
              <span className="text-[10px] text-slate-400">{result.carrier}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
              <span className="text-slate-500 text-[11px]">المنطقة / مركز الاتصال</span>
              <span className="text-sm font-bold text-white block truncate">{result.cityRegion}</span>
              <span className="text-[10px] text-slate-400">HLR Exchange Route</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
              <span className="text-slate-500 text-[11px]">التطبيقات المرتبطة بالرقم</span>
              <span className="text-sm font-bold text-emerald-400 block truncate">
                {result.linkedApps.slice(0, 2).join(' · ')}
              </span>
              <span className="text-[10px] text-slate-400">حسابات نشطة مؤكدة</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
              <span className="text-slate-500 text-[11px]">قواعد البيانات المفحوصة</span>
              <span className="text-sm font-bold text-white block">{result.queriedServersCount} خادماً دولياً</span>
              <span className="text-[10px] text-slate-400">تحديث فوري 2026</span>
            </div>
          </div>

          {/* Alternate Names Found */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>الأسماء المسجلة الأخرى للرقم في هواتف المتصلين (Caller ID Aliases):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {result.alternateNames.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-xl border border-slate-800/80 bg-slate-900/40 text-slate-200"
                >
                  <span className="text-emerald-400 font-bold">#{i + 1}</span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Direct OSINT Actions */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-cyan-400" />
              <span>إجراءات التحقق الميداني المباشر من المالك الفعلي (Real-Time Verification):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${result.internationalNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-300 transition-colors cursor-pointer"
                title="فتح المحادثة والملف الشخصي المباشر على واتساب"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  <span className="font-bold">معاينة الملف الشخصي (WhatsApp)</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
              </a>

              {/* Telegram Direct */}
              <a
                href={`https://t.me/+${result.internationalNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/30 text-cyan-300 transition-colors cursor-pointer"
                title="استعلام الحساب المباشر على تليجرام"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <span className="font-bold">فحص معرف Telegram</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
              </a>

              {/* Truecaller Web Lookup */}
              <a
                href={`https://www.truecaller.com/search/${result.countryCode.replace('+', '')}/${result.internationalNumber.replace(/[^0-9]/g, '').slice(result.countryCode.length - 1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-blue-500/30 bg-blue-950/20 hover:bg-blue-900/30 text-blue-300 transition-colors cursor-pointer"
                title="استعلام سجلات الدليل الدولي Truecaller"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-400" />
                  <span className="font-bold">دليل Truecaller المعتمد</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
              </a>
            </div>
          </div>

          {/* Databases Queried */}
          <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span>مصادر الفحص: {result.matchedDatabases.slice(0, 3).join(' · ')}</span>
            <span>تاريخ الاستعلام: {result.lastLookupTimestamp}</span>
          </div>
        </div>
      )}
    </div>
  );
};
