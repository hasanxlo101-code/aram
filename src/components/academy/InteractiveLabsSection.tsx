import React, { useState } from 'react';
import {
  Terminal,
  Database,
  Activity,
  Cpu,
  Shield,
  Server,
  CheckCircle2,
  Play,
  Zap,
  Radio,
  FileCheck,
  Search
} from 'lucide-react';
import { UNIFIED_LABS } from '../../data/unifiedLabsData';
import { UnifiedLabRunner } from '../labs/UnifiedLabRunner';
import { CyberAttackSimulator } from '../labs/CyberAttackSimulator';

interface InteractiveLabsSectionProps {
  onCompleteLab: (xp: number) => void;
  onOpenWorkerShield: () => void;
  onOpenAiMentor?: (context: { title: string; topic: string }) => void;
}

export const InteractiveLabsSection: React.FC<InteractiveLabsSectionProps> = ({
  onCompleteLab,
  onOpenWorkerShield,
  onOpenAiMentor,
}) => {
  const [selectedLabId, setSelectedLabId] = useState<string>('lab-attack-sim');

  const unifiedLab = UNIFIED_LABS.find((l) => l.id === selectedLabId);

  return (
    <div id="labs-section" className="space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Terminal className="h-4 w-4" />
            <span>KAYA INTERACTIVE LABS & SANDBOX CENTER</span>
            <span>·</span>
            <span>06 APPLIED ENVIRONMENTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مركز المختبرات العملية المعزولة
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            مختبرات آمنة تعمل ببيانات اصطناعية وملفات تدريبية حية: وصف المهمة، تحليل الملفات، نظام تلميحات متدرج، التحقق من علم الراية، وتوليد تقارير الحوادث القابلة للمراجعة.
          </p>
        </div>

        <button
          onClick={onOpenWorkerShield}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto"
        >
          <Shield className="h-4 w-4 text-cyan-400" />
          <span>درع Cloudflare WAF</span>
        </button>
      </div>

      {/* Lab Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Lab 0: Cyber Attack Simulator */}
        <button
          onClick={() => setSelectedLabId('lab-attack-sim')}
          className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
            selectedLabId === 'lab-attack-sim'
              ? 'border-cyan-500/50 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
              : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-lg font-bold text-cyan-400">⚡</span>
              <span className="text-[10px] font-mono text-emerald-400 tabular-nums">+175 XP</span>
            </div>
            <h4 className="text-xs font-bold text-white leading-tight mb-1">Cyber Attack Simulator</h4>
            <p className="text-[10px] text-slate-400 line-clamp-1">محاكاة هجمات SQL Injection المباشرة</p>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>متوسط</span>
            <span className={selectedLabId === 'lab-attack-sim' ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
              {selectedLabId === 'lab-attack-sim' ? 'نشط الآن' : 'تشغيل'}
            </span>
          </div>
        </button>

        {/* Unified Labs 1 to 5 */}
        {UNIFIED_LABS.map((lab) => {
          const isActive = selectedLabId === lab.id;
          return (
            <button
              key={lab.id}
              onClick={() => setSelectedLabId(lab.id)}
              className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'border-cyan-500/50 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                    {lab.badge}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 tabular-nums">+{lab.xp} XP</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight mb-1">{lab.title}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{lab.category}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{lab.difficulty}</span>
                <span className={isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                  {isActive ? 'نشط الآن' : 'تشغيل'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Lab Runner Container */}
      <div className="pt-2">
        {selectedLabId === 'lab-attack-sim' && (
          <CyberAttackSimulator onComplete={onCompleteLab} />
        )}

        {unifiedLab && (
          <UnifiedLabRunner
            lab={unifiedLab}
            onCompleteLab={onCompleteLab}
            onOpenAiMentor={onOpenAiMentor}
          />
        )}
      </div>
    </div>
  );
};
