import React, { useState } from 'react';
import { Shield, Radar, Terminal, Key } from 'lucide-react';
import { ThreatCenter } from './ThreatCenter';
import { WorkerShieldBuilder } from './WorkerShieldBuilder';
import { PasswordVault } from './PasswordVault';

export const SecuritySuiteSection: React.FC = () => {
  const [tool, setTool] = useState<'threat' | 'worker' | 'vault'>('threat');
  const tools = [
    { id: 'threat', label: 'مركز فحص التهديدات', icon: Radar },
    { id: 'worker', label: 'درع ومحرر Workers WAF', icon: Terminal },
    { id: 'vault', label: 'مولّد كلمات المرور', icon: Key },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <Shield className="h-4 w-4" /><span>KAYA THREAT INTEL CENTER</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">مركز كايا لفحص التهديدات</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          فحوص حقيقية: تحليل بنية الروابط مع استعلام مباشر لقوائم التهديدات (Google Safe Browsing، VirusTotal، URLhaus، OpenPhish)، وقياس حي لـ DNS وTLS وعمر النطاق، وفحص التسريبات، وتحليل الأرقام والـ IP.
          كل نتيجة تعرض مصدرها، وما لا يمكن إثباته نقول إنه «غير حاسم» بدل اختلاق إجابة.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tools.map((t) => {
          const Icon = t.icon; const a = tool === t.id;
          return (
            <button key={t.id} onClick={() => setTool(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap border cursor-pointer ${a ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'}`}>
              <Icon className="h-4 w-4 shrink-0" /><span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {tool === 'threat' && <ThreatCenter />}
        {tool === 'worker' && <WorkerShieldBuilder lang="ar" />}
        {tool === 'vault' && <PasswordVault lang="ar" />}
      </div>
    </div>
  );
};
