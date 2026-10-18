import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
  Bot,
  Link as LinkIcon,
  HelpCircle,
  Instagram,
  Facebook,
  Twitter,
  Send
} from 'lucide-react';
import { SocialPlatform, SocialVerificationResult } from '../../types';
import { verifySocialPage } from '../../utils/advancedSecurityEngine';

export const SocialPageVerifier: React.FC = () => {
  const [inputVal, setInputVal] = useState('@Kaya_SafeSec_Official');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<SocialVerificationResult>(() =>
    verifySocialPage('@Kaya_SafeSec_Official', 'instagram')
  );

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setResult(verifySocialPage(inputVal.trim(), platform));
      setIsVerifying(false);
    }, 400);
  };

  const handlePreset = (handle: string, plat: SocialPlatform) => {
    setInputVal(handle);
    setPlatform(plat);
    setIsVerifying(true);
    setTimeout(() => {
      setResult(verifySocialPage(handle, plat));
      setIsVerifying(false);
    }, 300);
  };

  const isAuthentic = result.verdict === 'authentic';
  const isFake = result.verdict === 'fake_scam';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-slate-950 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>SOCIAL IDENTITY & PAGE AUTHENTICITY RADAR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              فاحص صفحات الإنترنت ووسائل التواصل الاجتماعي (حقيقية أم مزيفة)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              تحليل عميق لحسابات إنستغرام، فيسبوك، إكس (تويتر)، تيليجرام، وتيك توك لكشف صفحات الانتحال والنصب، وتتبع الحسابات المزيفة، والمتابعين الوهميين.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <Bot className="h-4 w-4" />
            <span>كاشف بوتات متطور</span>
          </div>
        </div>

        {/* Platform Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-mono">
          <span className="text-slate-500">المنصة:</span>
          {(['instagram', 'x', 'facebook', 'telegram', 'tiktok', 'website'] as SocialPlatform[]).map((p) => {
            const labels: Record<SocialPlatform, string> = {
              instagram: 'Instagram',
              x: 'X (Twitter)',
              facebook: 'Facebook',
              telegram: 'Telegram',
              tiktok: 'TikTok',
              linkedin: 'LinkedIn',
              website: 'موقع إلكتروني',
            };
            const isActive = platform === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'border-purple-500/50 bg-purple-950/40 text-purple-300 font-bold shadow-sm'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="أدخل اسم المستخدم (مثال: @user) أو رابط الصفحة بالكامل..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pr-10 pl-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors font-mono"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-500/15 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isVerifying ? 'جارٍ التحقق وفحص الانتحال...' : 'فحص الحساب والصفحة'}</span>
          </button>
        </form>

        {/* Test Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-mono">نماذج سريعة:</span>
          <button
            type="button"
            onClick={() => handlePreset('@Kaya_SafeSec_Official', 'instagram')}
            className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            @Kaya_SafeSec_Official (رسمي موثق)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('@Bank_Support_Official_Giveaway', 'telegram')}
            className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-950/20 text-rose-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            @Bank_Support_Official (انتحال احتيالي)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('@Free_Crypto_Telegram_Bot', 'x')}
            className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-300 font-mono transition-colors cursor-pointer text-[11px]"
          >
            @Free_Crypto_Claim (حساب مشبوه)
          </button>
        </div>
      </div>

      {/* Main Verdict Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isAuthentic
          ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-slate-950 shadow-xl shadow-emerald-500/5'
          : isFake
          ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/30 via-slate-950 to-slate-950 shadow-xl shadow-rose-500/5'
          : 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 via-slate-950 to-slate-950 shadow-xl shadow-amber-500/5'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border font-bold text-2xl shadow-inner ${
              isAuthentic
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : isFake
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}>
              {isAuthentic ? <CheckCircle2 className="h-8 w-8" /> : isFake ? <XCircle className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white font-mono" dir="ltr">
                  {result.displayName}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  isAuthentic
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : isFake
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isAuthentic
                    ? '✓ حساب رسمي موثق وحقيقي'
                    : isFake
                    ? '⚠ حساب منتحل ومزيف (High Scam Risk)'
                    : 'حساب غير مؤكد (يحتاج تدقيق)'}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono">
                المنصة: <strong className="text-slate-200 capitalize">{result.platform}</strong> · المدخل: {result.handleOrUrl}
              </p>
            </div>
          </div>

          {/* Trust Score Gauge */}
          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-mono self-start md:self-center">
            <div>
              <span className="text-[11px] text-slate-400 block">معدل الثقة والمصداقية</span>
              <div className="text-2xl font-extrabold text-white tabular-nums">
                {result.trustScore} / 100
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <span className="text-[11px] text-slate-400 block">نسبة المتابعين الوهميين</span>
              <div className={`text-2xl font-extrabold tabular-nums ${
                result.botRiskPercent > 50 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {result.botRiskPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 font-mono text-xs">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
            <span className="text-slate-500 text-[11px]">نمط المتابعين والجمهور</span>
            <span className="text-sm font-bold text-white block">{result.followersCount}</span>
            <span className="text-[10px] text-slate-400">{result.followingCount}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
            <span className="text-slate-500 text-[11px]">الاستقرار التاريخي للحساب</span>
            <span className="text-sm font-bold text-cyan-300 block">{result.creationAge}</span>
            <span className="text-[10px] text-slate-400">فحص الثبات وعمر النشاط</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
            <span className="text-slate-500 text-[11px]">شارة التوثيق المعتمدة</span>
            <span className={`text-sm font-bold block ${result.isOfficialBadgeGenuine ? 'text-emerald-400' : 'text-slate-400'}`}>
              {result.isOfficialBadgeGenuine ? 'موثقة ومطابقة للنظام ✓' : 'حساب قياسي غير موثق بشارة'}
            </span>
            <span className="text-[10px] text-slate-400">فحص الـ Meta / Authority Badge</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
            <span className="text-slate-500 text-[11px]">سلامة رابط الوصف (Bio Link)</span>
            <span className={`text-sm font-bold block ${result.securitySignals.hasPhishingBioLink ? 'text-rose-400' : 'text-emerald-400'}`}>
              {result.securitySignals.hasPhishingBioLink ? 'رابط تصيد خارجي مشبوه ⚠' : 'رابط نظيف ومطابق ✓'}
            </span>
            <span className="text-[10px] text-slate-400">فحص الدومين التلقائي</span>
          </div>
        </div>

        {/* Direct Open & Verify Action */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            التحقق الميداني الفعلي من الصفحة:
          </span>
          <a
            href={result.handleOrUrl.startsWith('http') ? result.handleOrUrl : `https://${result.platform === 'x' ? 'x.com' : result.platform === 'instagram' ? 'instagram.com' : result.platform === 'facebook' ? 'facebook.com' : result.platform === 'telegram' ? 't.me' : 'tiktok.com'}/${result.handleOrUrl.replace(/^@/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono text-xs transition-colors cursor-pointer"
          >
            <span>فتح ومعاينة الصفحة الحقيقية على {result.platform}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Detailed Reasons Checklist */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span>تقرير الفحص والتحليل الأمني للحساب:</span>
          </h4>

          <div className="space-y-2">
            {result.reasonsAr.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-800/80 bg-slate-900/30 text-xs text-slate-300"
              >
                {isAuthentic ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
