import React, { useState } from 'react';
import {
  Shield,
  Search,
  Terminal,
  Key,
  ShieldCheck,
  Wrench,
  Globe,
  Sparkles,
  Phone,
  Radio,
  FileCheck,
  Users
} from 'lucide-react';
import { UrlScanner } from './UrlScanner';
import { VirusTotalUrlScanner } from './tools/VirusTotalUrlScanner';
import { SocialPageVerifier } from './tools/SocialPageVerifier';
import { PhoneOwnerLookup } from './tools/PhoneOwnerLookup';
import { HeadersInspector } from './HeadersInspector';
import { WorkerShieldBuilder } from './WorkerShieldBuilder';
import { PasswordVault } from './PasswordVault';
import { ThreatIntel } from './ThreatIntel';

export const SecuritySuiteSection: React.FC = () => {
  const [activeSubTool, setActiveSubTool] = useState<
    'virustotal' | 'social' | 'phone' | 'intel' | 'scanner' | 'headers' | 'worker' | 'vault'
  >('virustotal');

  const tools = [
    { id: 'virustotal', label: 'فاحص الروابط الحي (Live & VirusTotal)', badge: 'مباشر', icon: Radio },
    { id: 'social', label: 'محلل انتحال السوشيال ميديا', badge: 'Homoglyph', icon: Sparkles },
    { id: 'phone', label: 'محلل أرقام الهواتف والاتصالات', badge: 'ITU-T OSINT', icon: Phone },
    { id: 'intel', label: 'استخبارات IP والتسريبات الحية', badge: 'Live Registry', icon: Search },
    { id: 'scanner', label: 'فاحص ومصحح الروابط', badge: 'Live DNS', icon: Globe },
    { id: 'headers', label: 'ترويسات الأمان الحية HTTP', badge: 'Live Audit', icon: ShieldCheck },
    { id: 'worker', label: 'درع ومحرر Workers WAF', badge: 'Cloudflare', icon: Terminal },
    { id: 'vault', label: 'خازن ومولد كلمات المرور', badge: 'Vault', icon: Key },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Shield className="h-4 w-4" />
            <span>KAYA DEFENSIVE OPERATIONS & REAL-TIME THREAT INTEL SUITE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            منظومة كايا لفحص التهديدات، الروابط، وعناوين الشبكة الحية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            أدوات أمنية تشغيلية دقيقة تعتمد القياس الحي المباشر: فحص الروابط ورصد سجلات DNS والكمون، استعلام مباشر عن عناوين الـ IP عبر السجل العالمي، تدقيق ترويسات الأمان الصادرة فعلياً من الخوادم، وتحليل انتحال الحسابات وفق المعايير المعتمدة دون أي بيانات عشوائية أو وهمية.
          </p>
        </div>
      </div>

      {/* Sub-tools horizontal scrolling switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" style={{ scrollbarWidth: 'thin' }}>
        {tools.map((t) => {
          const isActive = activeSubTool === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTool(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-md shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-950 text-slate-500'
              }`}>
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render sub tool */}
      <div className="pt-2">
        {activeSubTool === 'virustotal' && <VirusTotalUrlScanner />}
        {activeSubTool === 'social' && <SocialPageVerifier />}
        {activeSubTool === 'phone' && <PhoneOwnerLookup />}
        {activeSubTool === 'intel' && <ThreatIntel lang="ar" />}
        {activeSubTool === 'scanner' && <UrlScanner lang="ar" />}
        {activeSubTool === 'headers' && <HeadersInspector lang="ar" />}
        {activeSubTool === 'worker' && <WorkerShieldBuilder lang="ar" />}
        {activeSubTool === 'vault' && <PasswordVault lang="ar" />}
      </div>
    </div>
  );
};
