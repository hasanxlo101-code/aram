import React, { useState } from 'react';
import { 
  Terminal, 
  Flag, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  Award, 
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { UnifiedLab } from '../../types/professionalTracks';

interface UnifiedLabRunnerProps {
  lab: UnifiedLab;
  onCompleteLab: (xp: number) => void;
  onOpenAiMentor?: (context: { title: string; topic: string }) => void;
}

export const UnifiedLabRunner: React.FC<UnifiedLabRunnerProps> = ({
  lab,
  onCompleteLab,
  onOpenAiMentor,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'terminal' | 'hints' | 'verify' | 'report'>('terminal');
  const [unlockedHints, setUnlockedHints] = useState<number>(0);
  const [flagInput, setFlagInput] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([
    `[+] Session started for: ${lab.title}`,
    `[+] Target: ${lab.targetEnvironment}`,
    `[+] Sandbox isolated. Type 'inspect' or 'help' to start examination.`
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const newLogs = [...logs, `${lab.simulatedScenario?.terminalPrompt || 'kaya-lab@sec:~$'} ${cmd}`];

    if (cmd === 'help') {
      newLogs.push('Available: inspect, status, cat logs.txt, strings, curl, clear');
    } else if (cmd === 'clear') {
      setLogs([]);
      setTerminalInput('');
      return;
    } else if (cmd.includes('cat') || cmd.includes('inspect') || cmd.includes('strings')) {
      newLogs.push(...(lab.simulatedScenario?.sampleLogsOrData || ['[DATA] Record retrieved successfully.']));
    } else {
      newLogs.push(`Command executed: ${cmd} (return code 0)`);
    }

    setLogs(newLogs);
    setTerminalInput('');
  };

  const handleFlagVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    if (flagInput.trim() === lab.validFlag) {
      setStatus('success');
      if (!hasCompleted) {
        setHasCompleted(true);
        onCompleteLab(lab.xpReward || lab.xp || 150);
      }
      setActiveTab('report');
    } else {
      setStatus('error');
    }
  };

  const score = Math.max(70, 100 - (unlockedHints * 5));

  const generateReport = () => {
    return `======================================================
تقرير إنجاز المختبر العملي — KAyA Safe&Sec Academy
======================================================
المختبر: ${lab.title}
التصنيف: ${lab.category} | المستوى: ${lab.difficulty}
البيئة المستهدفة: ${lab.targetEnvironment}
درجة التقييم: ${score}/100
نقاط الخبرة المكتسبة: +${lab.xpReward || lab.xp || 150} XP
حالة التحقق: تم استخراج الراية الأمنية (${lab.validFlag}) بنجاح
تاريخ التدقيق: ${new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}
كود الاعتماد: KAYA-LAB-${Math.floor(100000 + Math.random() * 900000)}
======================================================`;
  };

  const copyReportText = () => {
    navigator.clipboard.writeText(generateReport());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#080e21] overflow-hidden shadow-2xl" dir="rtl">
      {/* Runner Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060b1a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1">
            <span>{lab.category}</span>
            <span>·</span>
            <span className="text-slate-400">{lab.difficulty}</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">+{lab.xpReward || lab.xp} XP</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">{lab.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          {hasCompleted && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              مكتمل ومعتمد
            </span>
          )}
          {onOpenAiMentor && (
            <button
              onClick={() => onOpenAiMentor({ title: lab.title, topic: lab.category })}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>مساعدة المدرب الآلي</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 px-4 border-b border-slate-800 bg-[#070c1e] text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'terminal' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>الطرفية والسجلات</span>
        </button>
        <button
          onClick={() => setActiveTab('brief')}
          className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'brief' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>المهمة والتعليمات</span>
        </button>
        <button
          onClick={() => setActiveTab('hints')}
          className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'hints' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>التلميحات ({unlockedHints}/{lab.hints.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'verify' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flag className="w-4 h-4 text-rose-400" />
          <span>التحقق من الراية</span>
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'report' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>تقرير الإنجاز</span>
        </button>
      </div>

      {/* Contents */}
      <div className="p-5 sm:p-6">
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-[#040711] overflow-hidden font-mono text-xs">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="mr-2 text-slate-300">{lab.targetEnvironment}</span>
                </div>
                <span>Port 8080 Active</span>
              </div>

              <div className="p-4 space-y-1.5 max-h-64 overflow-y-auto text-slate-300" dir="ltr">
                {logs.map((l, i) => (
                  <div key={i} className={l.startsWith('[+]') ? 'text-emerald-400' : l.startsWith('[DATA]') ? 'text-cyan-300' : 'text-slate-300'}>
                    {l}
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommand} className="flex items-center border-t border-slate-800 px-4 py-2 bg-slate-950" dir="ltr">
                <span className="text-cyan-400 mr-2 font-bold">{lab.simulatedScenario?.terminalPrompt || 'kaya-lab:~$'}</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type command (inspect, cat, grep, help)..."
                  className="flex-1 bg-transparent text-emerald-300 focus:outline-none font-mono text-xs"
                />
                <button type="submit" className="text-xs text-slate-400 hover:text-white px-2">
                  Run
                </button>
              </form>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>ابحث عن الراية بالتنسيق <code className="text-cyan-400 font-mono">KAYA&#123;...&#125;</code> ثم ادخلها في تبويب الراية</span>
              <button
                onClick={() => setActiveTab('verify')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
              >
                إدخال الراية
              </button>
            </div>
          </div>
        )}

        {activeTab === 'brief' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <h4 className="text-sm font-bold text-white">وصف السيناريو الأمني:</h4>
              <p>{lab.missionBrief}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <h4 className="text-sm font-bold text-white">الهدف التعليمي:</h4>
              <p>{lab.learningGoal}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">التعليمات:</h4>
              {lab.instructions.map((ins, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-850">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {i + 1}
                  </span>
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              يخصم كل تلميح 5 درجات من التقييم النهائي للمختبر.
            </div>
            <div className="space-y-2.5">
              {lab.hints.map((hint, i) => {
                const isUnlocked = i < unlockedHints;
                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      isUnlocked ? 'bg-slate-900 border-amber-500/40 text-amber-200' : 'bg-slate-950/40 border-slate-850 text-slate-500'
                    }`}
                  >
                    <div className="font-bold mb-1">التلميح #{i + 1}</div>
                    <p>{isUnlocked ? hint : 'مغلق — اضغط الزر أدناه لفتحه'}</p>
                  </div>
                );
              })}
            </div>

            {unlockedHints < lab.hints.length && (
              <button
                onClick={() => setUnlockedHints(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition"
              >
                فتح التلميح #{unlockedHints + 1} (-5 درجات)
              </button>
            )}
          </div>
        )}

        {activeTab === 'verify' && (
          <form onSubmit={handleFlagVerify} className="space-y-4 max-w-xl mx-auto py-3">
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-white">التحقق من الراية الأمنية (Flag Verification)</h4>
              <p className="text-xs text-slate-400">أدخل الراية المستخرجة لاعتماد النتيجة</p>
            </div>

            <input
              type="text"
              value={flagInput}
              onChange={(e) => {
                setFlagInput(e.target.value);
                setStatus('idle');
              }}
              placeholder={lab.flagFormat}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
              dir="ltr"
            />

            {status === 'error' && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>الراية غير مطابقة. راجع السجلات أو استخدم تلميحاً.</span>
              </div>
            )}

            {status === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تم قبول الراية بنجاح واحتساب النقاط!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-lg shadow-cyan-500/20"
            >
              التحقق واعتماد المختبر
            </button>
          </form>
        )}

        {activeTab === 'report' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap select-all leading-relaxed" dir="rtl">
              {generateReport()}
            </div>

            <div className="flex justify-end">
              <button
                onClick={copyReportText}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
              >
                {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReport ? 'تم نسخ التقرير' : 'نسخ التقرير الرسمي'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
