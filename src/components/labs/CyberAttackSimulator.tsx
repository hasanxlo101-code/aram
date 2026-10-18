import React, { useState } from 'react';
import {
  Terminal,
  Database,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface CyberAttackSimulatorProps {
  onComplete?: (xp: number) => void;
}

export const CyberAttackSimulator: React.FC<CyberAttackSimulatorProps> = ({ onComplete }) => {
  const [username, setUsername] = useState("' OR '1'='1");
  const [password, setPassword] = useState("any_pass");
  const [defenseMode, setDefenseMode] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasAwardedXp, setHasAwardedXp] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>({
    executed: true,
    status: 'bypassed',
    message: 'تم اختراق بوابة التحقق بنجاح! تم التلاعب بمنطق الاستعلام والوصول لحساب المدير الفائق.',
    queryUsed: `SELECT * FROM accounts WHERE username = '' OR '1'='1' AND password = 'any_pass';`,
    extractedRows: [
      { id: 1, username: 'admin_hasan', role: 'Super Administrator', email: 'hasanxlo101@gmail.com', flag: 'FLAG{KAYA_SQLI_BYPASS_VERIFIED}' },
      { id: 2, username: 'lead_auditor', role: 'Security Engineer', email: 'auditor@kaya-safesec.org', flag: 'FLAG{PWNED_DATABASE_ACCESS_2026}' }
    ],
    executionTimeMs: 14,
  });

  // Calculate live SQL query in real-time
  const liveRawQuery = defenseMode
    ? `PREPARE stmt FROM 'SELECT * FROM accounts WHERE username = ? AND password = ?';\nEXECUTE stmt USING ('${username}', '${password}');`
    : `SELECT * FROM accounts WHERE username = '${username}' AND password = '${password}';`;

  const handleRunAttack = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsExecuting(true);

    setTimeout(() => {
      if (defenseMode) {
        setExecutionResult({
          executed: true,
          status: 'blocked',
          message: 'تم إحباط الهجوم بنجاح! الاستعلام المجهز (Prepared Statement) عامل المدخلات كبيانات نصية بحتة دون تنفيذها كأوامر SQL.',
          queryUsed: liveRawQuery,
          extractedRows: [],
          executionTimeMs: 6,
        });
        if (!hasAwardedXp && onComplete) {
          onComplete(175);
          setHasAwardedXp(true);
        }
      } else {
        const isBypassed =
          username.includes("' OR '1'='1") ||
          username.includes("' OR 1=1") ||
          username.includes("'--") ||
          username.includes("' UNION") ||
          username.includes("'#");

        if (isBypassed) {
          setExecutionResult({
            executed: true,
            status: 'bypassed',
            message: 'تم اختراق بوابة التحقق بنجاح! تم التلاعب بمنطق الاستعلام والوصول لحساب المدير الفائق.',
            queryUsed: liveRawQuery,
            extractedRows: [
              { id: 1, username: 'admin_hasan', role: 'Super Administrator', email: 'hasanxlo101@gmail.com', flag: 'FLAG{KAYA_SQLI_BYPASS_VERIFIED}' },
              { id: 2, username: 'lead_auditor', role: 'Security Engineer', email: 'auditor@kaya-safesec.org', flag: 'FLAG{PWNED_DATABASE_ACCESS_2026}' }
            ],
            executionTimeMs: 12,
          });
          if (!hasAwardedXp && onComplete) {
            onComplete(175);
            setHasAwardedXp(true);
          }
        } else {
          setExecutionResult({
            executed: true,
            status: 'failed',
            message: 'فشل الهجوم: بيانات الدخول غير صحيحة، ولم يتم كسر منطق الاستعلام.',
            queryUsed: liveRawQuery,
            extractedRows: [],
            executionTimeMs: 18,
          });
        }
      }
      setIsExecuting(false);
    }, 280);
  };

  const applyPreset = (payload: string, pass: string = 'password123') => {
    setUsername(payload);
    setPassword(pass);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-7 space-y-6 shadow-2xl animate-in fade-in duration-300">
      {/* Simulator Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/10 border border-rose-500/30 text-rose-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Cyber Attack Simulator (SQL Injection Real-Time)</h3>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                +175 XP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              محاكاة تفاعلية فورية لاختبار هجمات حقن قواعد البيانات (SQLi) ومراقبة النتائج في الوقت الحقيقي.
            </p>
          </div>
        </div>

        {/* Defense Toggle */}
        <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-center font-mono text-xs">
          <button
            onClick={() => {
              setDefenseMode(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              !defenseMode
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="h-3.5 w-3.5 text-rose-400" />
            <span>نظام غير محمي (Vulnerable)</span>
          </button>

          <button
            onClick={() => {
              setDefenseMode(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              defenseMode
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>تفعيل الدفاع (Prepared Stmt)</span>
          </button>
        </div>
      </div>

      {/* Real-Time Inputs & Presets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Attack Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <h4 className="text-xs font-bold text-white font-mono flex items-center justify-between">
              <span>مدخلات الهجوم (Attack Payloads):</span>
              <span className="text-slate-500 text-[10px]">التحديث لحظي بالأسفل</span>
            </h4>

            <form onSubmit={handleRunAttack} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  حقل اسم المستخدم (Username Field):
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-rose-300 font-mono focus:border-rose-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  حقل كلمة المرور (Password Field):
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 font-mono focus:border-slate-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={isExecuting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-500/10 cursor-pointer disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>{isExecuting ? 'جارٍ تنفيذ الاستعلام...' : 'إطلاق ومحاكاة الهجوم الآن'}</span>
              </button>
            </form>
          </div>

          {/* Preset Attack Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 block">
              حمولات هجومية جاهزة للتجربة (SQLi Payloads):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => applyPreset("' OR '1'='1")}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-start transition-colors cursor-pointer"
              >
                <span className="text-rose-400 font-bold block mb-0.5">Tautology Bypass</span>
                <code className="text-[10px] text-slate-400">' OR '1'='1</code>
              </button>

              <button
                type="button"
                onClick={() => applyPreset("admin' --")}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-start transition-colors cursor-pointer"
              >
                <span className="text-cyan-400 font-bold block mb-0.5">Comment-Out</span>
                <code className="text-[10px] text-slate-400">admin' --</code>
              </button>

              <button
                type="button"
                onClick={() => applyPreset("' UNION SELECT id, username, flag, 4 FROM accounts --")}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-start transition-colors cursor-pointer"
              >
                <span className="text-purple-400 font-bold block mb-0.5">UNION Extract</span>
                <code className="text-[10px] text-slate-400">' UNION SELECT..</code>
              </button>

              <button
                type="button"
                onClick={() => applyPreset("'; DROP TABLE logs; --")}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-start transition-colors cursor-pointer"
              >
                <span className="text-amber-400 font-bold block mb-0.5">Stacked Query</span>
                <code className="text-[10px] text-slate-400">'; DROP TABLE..</code>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Query Synthesizer & Target Database View */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Query Box */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                <Code2 className="h-4 w-4 text-cyan-400" />
                <span>الاستعلام التفاعلي المولد في الوقت الفعلي (SQL Synthesizer):</span>
              </span>
              <span className="text-[10px] text-slate-500">Live Backend Stream</span>
            </div>

            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {liveRawQuery}
            </pre>
          </div>

          {/* Real-time Execution Output Terminal */}
          <div className={`p-4 rounded-xl border transition-all ${
            executionResult.status === 'bypassed'
              ? 'border-rose-500/40 bg-rose-950/20'
              : executionResult.status === 'blocked'
              ? 'border-emerald-500/40 bg-emerald-950/20'
              : 'border-slate-800 bg-slate-900/40'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="font-bold text-white">الاستجابة الميدانية في الوقت الفعلي:</span>
              </div>
              <span className="text-[11px] text-slate-400">
                زمن التنفيذ: {executionResult.executionTimeMs}ms
              </span>
            </div>

            <div className="pt-3 space-y-3">
              <p className={`text-xs font-semibold ${
                executionResult.status === 'bypassed'
                  ? 'text-rose-300'
                  : executionResult.status === 'blocked'
                  ? 'text-emerald-300'
                  : 'text-slate-300'
              }`}>
                {executionResult.message}
              </p>

              {/* Extracted Database Records if Bypassed */}
              {executionResult.extractedRows.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/60 font-mono text-xs">
                  <span className="text-[11px] text-amber-400 font-bold block">
                    البيانات المستخرجة من جدول accounts (تسريب ناجح):
                  </span>
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-start text-[11px]">
                      <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2 text-start">ID</th>
                          <th className="p-2 text-start">User</th>
                          <th className="p-2 text-start">Role</th>
                          <th className="p-2 text-start">Secret Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/80">
                        {executionResult.extractedRows.map((row: any) => (
                          <tr key={row.id} className="text-slate-200">
                            <td className="p-2 text-emerald-400">#{row.id}</td>
                            <td className="p-2 font-bold">{row.username}</td>
                            <td className="p-2 text-cyan-300">{row.role}</td>
                            <td className="p-2 text-rose-300 font-bold">{row.flag}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
