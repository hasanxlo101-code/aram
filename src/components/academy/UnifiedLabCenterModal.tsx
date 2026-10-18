import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Flag, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Download, 
  Award, 
  Clock, 
  Copy, 
  Check, 
  Shield, 
  Server,
  Sparkles
} from 'lucide-react';
import { UnifiedLab } from '../../types/professionalTracks';

interface UnifiedLabCenterModalProps {
  lab: UnifiedLab;
  onClose: () => void;
  onCompleteLab: (labId: string, earnedXp: number, reportData: any) => void;
  isAlreadyCompleted?: boolean;
}

export const UnifiedLabCenterModal: React.FC<UnifiedLabCenterModalProps> = ({
  lab,
  onClose,
  onCompleteLab,
  isAlreadyCompleted = false,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'terminal' | 'hints' | 'verify' | 'report'>('brief');
  const [unlockedHintsCount, setUnlockedHintsCount] = useState<number>(0);
  const [submittedFlag, setSubmittedFlag] = useState<string>('');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [isCompleted, setIsCompleted] = useState<boolean>(isAlreadyCompleted);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    `[+] System initialized: ${lab.targetEnvironment}`,
    `[+] Session ID: LAB-${Math.floor(100000 + Math.random() * 900000)}`,
    `[+] Type 'help' or inspect sample logs to proceed.`
  ]);

  const handleUnlockHint = () => {
    if (unlockedHintsCount < lab.hints.length) {
      setUnlockedHintsCount(prev => prev + 1);
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const newLogs = [...terminalHistory, `${lab.simulatedScenario.terminalPrompt || 'lab@kaya:~$'} ${cmd}`];

    if (cmd === 'help') {
      newLogs.push('Available commands: cat, inspect, status, curl, strings, grep, clear, flag');
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (cmd.includes('cat') || cmd.includes('inspect') || cmd.includes('grep')) {
      newLogs.push(...(lab.simulatedScenario.sampleLogsOrData || ['[DATA] Record matched.']));
    } else if (cmd.includes('flag')) {
      newLogs.push(`[HINT] Submit your discovered flag in the Verification tab. Target: ${lab.flagFormat}`);
    } else {
      newLogs.push(`Execution completed: ${cmd} (exit status 0)`);
    }

    setTerminalHistory(newLogs);
    setTerminalInput('');
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedFlag.trim()) return;

    if (submittedFlag.trim() === lab.validFlag) {
      setValidationStatus('success');
      setIsCompleted(true);
      setActiveTab('report');
      onCompleteLab(lab.id, lab.xpReward, {
        labId: lab.id,
        title: lab.title,
        completedAt: new Date().toISOString(),
        score: 100 - (unlockedHintsCount * 5),
        xp: lab.xpReward
      });
    } else {
      setValidationStatus('failed');
    }
  };

  const finalScore = Math.max(70, 100 - (unlockedHintsCount * 5));

  const generateReportText = () => {
    return `======================================================
تقرير إنجاز المختبر العملي — KAyA Safe&Sec Academy
======================================================
المختبر: ${lab.title}
المجال: ${lab.category} | المستوى: ${lab.difficulty}
البيئة المستهدفة: ${lab.targetEnvironment}
النتيجة النهائية: ${finalScore}/100 | نقاط الخبرة المكتسبة: +${lab.xpReward} XP
حالة التحقق: تم استخراج الراية الأمنية ومطابقتها بنجاح
تاريخ الإنجاز: ${new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}
كود الاعتماد الأكاديمي: KAYA-LAB-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}
======================================================`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        dir="rtl"
      >
        {/* Lab Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070d1e] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-400">{lab.category}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {lab.difficulty}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">+{lab.xpReward} XP</span>
              </div>
              <h2 className="text-lg font-bold text-white line-clamp-1">{lab.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                مكتمل
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-[#080f24] overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('brief')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'brief'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>وصف المهمة والتعليمات</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'terminal'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>البيئة والطرفية المحاكية</span>
          </button>
          <button
            onClick={() => setActiveTab('hints')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'hints'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>التلميحات ({unlockedHintsCount}/{lab.hints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'verify'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flag className="w-4 h-4 text-rose-400" />
            <span>التحقق من الراية (Flag)</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'report'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>التقرير والتقييم النهائي</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Brief Tab */}
          {activeTab === 'brief' && (
            <div className="space-y-6 text-slate-200">
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/20 text-sm leading-relaxed">
                <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  وصف السيناريو الأمني والمهمة
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm">{lab.missionBrief}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    الهدف التعليمي الأساسي
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{lab.learningGoal}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    بيئة التدريب المعزولة
                  </h4>
                  <p className="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800" dir="ltr">
                    {lab.targetEnvironment}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">التعليمات وخطوات التنفيذ:</h4>
                <div className="space-y-2">
                  {lab.instructions.map((inst, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-850 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('terminal')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-2"
                >
                  <span>الانتقال للطرفية وبيئة التحليل</span>
                  <Terminal className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Terminal & Simulated Logs Tab */}
          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-cyan-400">{lab.simulatedScenario.targetService}</span>
                <span>بيئة تفاعلية آمنة 100% · معزولة محلياً</span>
              </div>

              {/* Terminal Window */}
              <div className="rounded-2xl border border-slate-750 bg-[#050811] overflow-hidden shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                    <span className="text-slate-400 mr-2 text-[11px]">bash — 80x24 (interactive)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">KAyA Secure Sandbox v2.4</span>
                </div>

                <div className="p-4 space-y-2 max-h-80 overflow-y-auto text-slate-300" dir="ltr">
                  {terminalHistory.map((line, idx) => (
                    <div 
                      key={idx} 
                      className={
                        line.startsWith('[CRIT]') || line.startsWith('[WARN]') 
                          ? 'text-amber-400' 
                          : line.startsWith('[DATA]') || line.startsWith('[+]') 
                          ? 'text-emerald-400' 
                          : 'text-slate-300'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleTerminalSubmit} className="flex items-center border-t border-slate-800 bg-slate-950 px-4 py-2" dir="ltr">
                  <span className="text-cyan-400 mr-2 font-bold">{lab.simulatedScenario.terminalPrompt || 'lab@sec:~$'}</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="type commands (help, cat, inspect, grep)..."
                    className="flex-1 bg-transparent text-emerald-300 focus:outline-none text-xs font-mono"
                  />
                  <button type="submit" className="text-xs text-slate-400 hover:text-white px-2">
                    Run
                  </button>
                </form>
              </div>

              {/* Preloaded Sample Evidence */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300">سجلات الأدلة والبيانات الحية المتاحة (Raw Evidence Logs):</h4>
                  <span className="text-[11px] text-cyan-400">4 سجلات مستخرجة</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-300" dir="ltr">
                  {lab.simulatedScenario.sampleLogsOrData?.map((item, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950 border border-slate-850 select-all">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveTab('hints')}
                  className="px-4 py-2 rounded-xl text-xs text-amber-400 hover:bg-amber-950/30 transition flex items-center gap-1.5"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>هل تحتاج لتلميح؟</span>
                </button>
                <button
                  onClick={() => setActiveTab('verify')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs transition"
                >
                  الانتقال لإدخال الراية واعتماد الحل
                </button>
              </div>
            </div>
          )}

          {/* Progressive Hints Tab */}
          {activeTab === 'hints' && (
            <div className="space-y-6 text-slate-200">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs sm:text-sm text-amber-200 space-y-1">
                <p className="font-bold flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  نظام التلميحات المتدرجة الأكاديمي
                </p>
                <p className="text-slate-300 text-xs">
                  يمكنك فتح التلميحات تدريجياً في حال واجهت صعوبة في استخراج الثغرة. يخصم كل تلميح 5 نقاط من تقييم جودة الحل النهائي.
                </p>
              </div>

              <div className="space-y-3">
                {lab.hints.map((hint, idx) => {
                  const isUnlocked = idx < unlockedHintsCount;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition ${
                        isUnlocked
                          ? 'bg-slate-900 border-amber-500/40 text-slate-200'
                          : 'bg-slate-950/50 border-slate-850 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-400">التلميح #{idx + 1}</span>
                        {!isUnlocked && (
                          <span className="text-[11px] text-slate-500">مغلق</span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {isUnlocked ? hint : 'انقر على زر فتح التلميح بالأسفل لإظهار هذا التوجيه الفني.'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {unlockedHintsCount < lab.hints.length && (
                <button
                  onClick={handleUnlockHint}
                  className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs transition flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>فتح التلميح رقم {unlockedHintsCount + 1} (-5 نقاط)</span>
                </button>
              )}
            </div>
          )}

          {/* Flag Verification Tab */}
          {activeTab === 'verify' && (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                  <Flag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">إدخال الراية الأمنية (Flag Submission)</h3>
                <p className="text-xs text-slate-400">
                  قم بإدخال الراية المستخرجة من جلسة التحليل للتحقق الفوري واعتماد إنجاز المختبر
                </p>
              </div>

              <form onSubmit={handleFlagSubmit} className="space-y-4">
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-semibold text-slate-300">
                    رمز الراية (Format: <span className="font-mono text-cyan-400">KAYA{'{...}'}</span>)
                  </label>
                  <input
                    type="text"
                    value={submittedFlag}
                    onChange={(e) => {
                      setSubmittedFlag(e.target.value);
                      setValidationStatus('idle');
                    }}
                    placeholder={lab.flagFormat}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
                    dir="ltr"
                  />
                </div>

                {validationStatus === 'failed' && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>الراية المدخلة غير صحيحة. راجع سجلات الطرفية وتأكد من استخراج الرمز كاملاً.</span>
                  </div>
                )}

                {validationStatus === 'success' && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>ممتاز! تم التحقق بنجاح من صحة الراية واحتساب +{lab.xpReward} XP.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 transition shadow-lg shadow-cyan-500/20"
                >
                  التحقق واعتماد إنجاز المختبر
                </button>
              </form>
            </div>
          )}

          {/* Final Report Tab */}
          {activeTab === 'report' && (
            <div className="space-y-6 text-slate-200">
              <div className="p-5 rounded-2xl bg-[#070d1e] border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-amber-400" />
                    <div>
                      <h3 className="text-base font-bold text-white">التقرير الفني والتقييم النهائي</h3>
                      <p className="text-xs text-slate-400">وثيقة إثبات إنجاز للمهمة العملية الصادرة عن الأكاديمية</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">درجة التقييم</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">{finalScore}/100</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 font-mono text-xs text-slate-300 space-y-2 whitespace-pre-wrap leading-relaxed select-all">
                  {generateReportText()}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>تم حفظ سجل الإنجاز وإضافته إلى ملف الطالب الأكاديمي</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyReport}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                    >
                      {copiedReport ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>نسخ التقرير</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition"
                    >
                      إنهاء والعودة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
