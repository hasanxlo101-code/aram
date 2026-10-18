import React, { useState, useEffect } from 'react';
import {
  Key,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Cpu,
  Clock,
  Zap,
  Sliders
} from 'lucide-react';
import { Language, PasswordStrengthResult } from '../types';
import {
  calculatePasswordStrength,
  generateSecurePassword,
  generateSecurePassphrase
} from '../utils/securityEngine';

interface PasswordVaultProps {
  lang: Language;
}

export const PasswordVault: React.FC<PasswordVaultProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  // State for password analysis
  const [testPassword, setTestPassword] = useState('Kaya#SafeSec$2026!');
  const [showTestPassword, setShowTestPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrengthResult>(() =>
    calculatePasswordStrength('Kaya#SafeSec$2026!')
  );

  // State for generator
  const [generatorMode, setGeneratorMode] = useState<'password' | 'passphrase'>('password');
  const [genLength, setGenLength] = useState(20);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [passphraseWords, setPassphraseWords] = useState(4);
  const [generatedSecret, setGeneratedSecret] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    setStrength(calculatePasswordStrength(testPassword));
  }, [testPassword]);

  const handleGenerate = () => {
    if (generatorMode === 'password') {
      const p = generateSecurePassword({
        length: genLength,
        includeUppercase: includeUpper,
        includeLowercase: includeLower,
        includeNumbers: includeNumbers,
        includeSymbols: includeSymbols,
        excludeAmbiguous: excludeAmbiguous,
      });
      setGeneratedSecret(p);
    } else {
      const pp = generateSecurePassphrase(passphraseWords);
      setGeneratedSecret(pp);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [generatorMode, genLength, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, passphraseWords]);

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const getScoreColor = (score: number) => {
    switch (score) {
      case 4:
        return 'bg-emerald-500 text-emerald-400';
      case 3:
        return 'bg-cyan-500 text-cyan-400';
      case 2:
        return 'bg-amber-500 text-amber-400';
      case 1:
      default:
        return 'bg-rose-500 text-rose-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Intro */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <h2 className="text-xl font-bold text-white mb-1">
          {isAr ? 'محلل قوة كلمات المرور والمولد التشفيري' : 'Cryptographic Vault & Password Entropy Analyzer'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {isAr
            ? 'فحص درجات عشوائية شانون (Shannon Entropy)، وتقدير زمن الاختراق بمجموعات بطاقات GPU، وتوليد مفاتيح تشفير عشوائية وآمنة.'
            : 'Evaluate bit entropy against brute-force GPU clusters, identify dictionary leaks, and generate cryptographically secure credentials.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Password Strength Analyzer */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              <span>{isAr ? 'فحص وتحليل كلمة المرور' : 'Password Entropy Analyzer'}</span>
            </h3>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {strength.entropyBits} bits entropy
            </span>
          </div>

          {/* Input field */}
          <div className="relative">
            <input
              type={showTestPassword ? 'text' : 'password'}
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder={isAr ? 'أدخل كلمة المرور لاختبارها...' : 'Type or paste password to analyze...'}
              dir="ltr"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 pe-10 text-sm font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowTestPassword(!showTestPassword)}
              className="absolute end-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {showTestPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Strength Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{isAr ? 'مستوى الحصانة:' : 'Security Posture:'}</span>
              <span className="font-bold text-white">
                {isAr ? strength.ratingLabelAr : strength.ratingLabelEn}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`rounded-full transition-colors ${
                    strength.score >= step
                      ? getScoreColor(strength.score).split(' ')[0]
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Cracking Complexity Matrix */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isAr ? 'زمن التخمين والاختراق التقديري' : 'Estimated Time To Crack'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] mb-1">
                  {isAr ? 'هجوم سريع غير متصل (MD5):' : 'Fast Hash (MD5):'}
                </span>
                <span className="text-slate-200 font-bold tabular-nums">
                  {strength.crackTimeOfflineFast}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] mb-1">
                  {isAr ? 'عبر الإنترنت (محدود المعدل):' : 'Online Throttled:'}
                </span>
                <span className="text-slate-200 font-bold tabular-nums">
                  {strength.crackTimeOnlineSlow}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] mb-1">
                  {isAr ? 'مجموعة بطاقات GPU خبيثة:' : 'GPU Cluster (8x 4090):'}
                </span>
                <span className="text-emerald-400 font-bold tabular-nums">
                  {strength.crackTimeGpuCluster}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback & Precautions */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-medium block">
              {isAr ? 'ملاحظات وتوجيهات الأمان:' : 'Security Audit Feedback:'}
            </span>
            <div className="space-y-1">
              {(isAr ? strength.feedbackAr : strength.feedbackEn).map((fb, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 select-none">·</span>
                  <span>{fb}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module 2: Cryptographic Password & Passphrase Generator */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>{isAr ? 'مولد التشفير الآمن' : 'Cryptographic Key Generator'}</span>
            </h3>

            {/* Mode Selector */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setGeneratorMode('password')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  generatorMode === 'password'
                    ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isAr ? 'كلمة سر' : 'Password'}
              </button>
              <button
                onClick={() => setGeneratorMode('passphrase')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  generatorMode === 'passphrase'
                    ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isAr ? 'عبارة مرور' : 'Passphrase'}
              </button>
            </div>
          </div>

          {/* Output Secret Box */}
          <div className="relative rounded-lg border border-slate-700 bg-slate-950 p-3.5 flex items-center justify-between gap-3">
            <span className="font-mono text-sm sm:text-base font-bold text-emerald-300 break-all select-all" dir="ltr">
              {generatedSecret || '...'}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleGenerate}
                title={isAr ? 'توليد كلمة جديدة' : 'Regenerate'}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleCopySecret(generatedSecret)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedSecret ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSecret ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Generator Controls */}
          {generatorMode === 'password' ? (
            <div className="space-y-4 text-xs">
              {/* Length Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300">{isAr ? 'طول كلمة المرور:' : 'Password Length:'}</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">{genLength}</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="64"
                  value={genLength}
                  onChange={(e) => setGenLength(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 accent-emerald-500"
                  />
                  <span>{isAr ? 'أحرف كبيرة (A-Z)' : 'Uppercase (A-Z)'}</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 accent-emerald-500"
                  />
                  <span>{isAr ? 'أحرف صغيرة (a-z)' : 'Lowercase (a-z)'}</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 accent-emerald-500"
                  />
                  <span>{isAr ? 'أرقام (0-9)' : 'Numbers (0-9)'}</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 accent-emerald-500"
                  />
                  <span>{isAr ? 'رموز خاصة (!@#$)' : 'Symbols (!@#$)'}</span>
                </label>
              </div>

              <label className="flex items-center gap-2 text-slate-300 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 accent-emerald-500"
                />
                <span>{isAr ? 'استبعاد المحارف الملتبسة (مثل 0 و O و 1 و l)' : 'Exclude Ambiguous Characters (0, O, 1, l)'}</span>
              </label>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300">{isAr ? 'عدد الكلمات العشوائية:' : 'Word Count:'}</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">{passphraseWords}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="7"
                  value={passphraseWords}
                  onChange={(e) => setPassphraseWords(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <p className="text-slate-400 leading-relaxed text-[11px]">
                {isAr
                  ? 'عبارات المرور القائمة على Diceware تمنحك حماية فائقة ضد هجمات القوة الغاشمة (Brute Force) مع سهولة تامة في الحفظ والتذكر للبشر.'
                  : 'Diceware-style passphrases deliver massive cryptographic keyspaces while remaining effortless for human memory.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
