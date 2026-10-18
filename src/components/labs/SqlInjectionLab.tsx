import React, { useState } from 'react';
import { Database, ShieldCheck, ShieldAlert, Terminal, CheckCircle2, RotateCcw, Zap } from 'lucide-react';

interface SqlInjectionLabProps {
  onComplete?: (xp: number) => void;
}

export const SqlInjectionLab: React.FC<SqlInjectionLabProps> = ({ onComplete }) => {
  const [usernameInput, setUsernameInput] = useState("' OR '1'='1");
  const [passwordInput, setPasswordInput] = useState("any_password");
  const [defenseMode, setDefenseMode] = useState(false);
  const [queryOutput, setQueryOutput] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasAwarded, setHasAwarded] = useState(false);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();

    if (defenseMode) {
      // Prepared Statement Defense
      setQueryOutput({
        status: 'blocked',
        message: 'تم منع الهجوم بنجاح! تم تمرير المدخلات كبيانات خام (Parameters) وليس كأمر تنفيذي.',
        queryType: 'Prepared Statement (Parameterized)',
        safeQuery: `PREPARE stmt FROM 'SELECT * FROM accounts WHERE user = ? AND pass = ?';\nEXECUTE stmt USING '${usernameInput}', '${passwordInput}';`,
        dbResult: '0 rows returned. (Authentication Failed - Secure)',
      });
      setIsSuccess(false);
    } else {
      // Vulnerable concatenation
      const rawQuery = `SELECT * FROM accounts WHERE username = '${usernameInput}' AND password = '${passwordInput}';`;
      const isBypassed = usernameInput.includes("' OR '1'='1") || usernameInput.includes("' OR 1=1") || usernameInput.includes("'--");

      if (isBypassed) {
        setQueryOutput({
          status: 'vulnerable',
          message: 'تم اختراق التحقق بنجاح! تم التلاعب بمنطق الاستعلام والوصول بصلاحيات المشرف.',
          queryType: 'Direct String Concatenation (Vulnerable)',
          safeQuery: rawQuery,
          dbResult: [
            { id: 1, user: 'admin_hasan', role: 'Super Administrator', email: 'hasanxlo101@gmail.com', flag: 'FLAG{KAYA_SQLI_BYPASS_VERIFIED}' },
            { id: 2, user: 'audit_agent', role: 'Security Auditor', email: 'audit@kayasec.internal', flag: 'REDACTED' }
          ],
        });
        setIsSuccess(true);
        if (!hasAwarded && onComplete) {
          onComplete(150);
          setHasAwarded(true);
        }
      } else {
        setQueryOutput({
          status: 'invalid',
          message: 'فشل تسجيل الدخول. لم يتم التلاعب بالاستعلام بنجاح.',
          queryType: 'Direct String Concatenation',
          safeQuery: rawQuery,
          dbResult: 'Invalid credentials. 0 rows returned.',
        });
        setIsSuccess(false);
      }
    }
  };

  const setPayload = (payload: string) => {
    setUsernameInput(payload);
    setPasswordInput('password123');
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 sm:p-6 space-y-5">
      {/* Lab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">مختبر SQL Injection والدفاع التطبيقي (KAyA LAB #01)</h3>
            <span className="text-xs font-mono text-slate-400">OWASP Top 10 · A03:2021-Injection Defense</span>
          </div>
        </div>

        {/* Defense Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-center">
          <span className="text-xs font-mono text-slate-300 ps-2">جدار الحماية (Prepared Statements):</span>
          <button
            type="button"
            onClick={() => setDefenseMode(!defenseMode)}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
              defenseMode
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {defenseMode ? 'مفعل (DEFENSE ON)' : 'معطل (VULNERABLE)'}
          </button>
        </div>
      </div>

      {/* Target Application Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">بوابة الدخول المستهدفة (Target Form)</span>
              <span className="text-[11px] font-mono text-slate-400">POST /api/login</span>
            </div>

            <form onSubmit={handleExecute} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">اسم المستخدم (Username / Payload):</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">كلمة المرور (Password):</label>
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                <span>إرسال الطلب وتنفيذ الاستعلام</span>
              </button>
            </form>

            {/* Quick Payloads */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 block mb-1.5">حمولات جاهزة للاختبار:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setPayload("' OR '1'='1")}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-500 cursor-pointer"
                >
                  ' OR '1'='1
                </button>
                <button
                  type="button"
                  onClick={() => setPayload("admin'--")}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-500 cursor-pointer"
                >
                  admin'--
                </button>
                <button
                  type="button"
                  onClick={() => setPayload("' OR 1=1 --")}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-500 cursor-pointer"
                >
                  ' OR 1=1 --
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Terminal & DB Response */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span>استعلام محرك قاعدة البيانات الخلفي (Backend SQL Engine)</span>
              </span>
              <span className="text-slate-500">PostgreSQL / MySQL Sandbox</span>
            </div>

            {queryOutput ? (
              <div className="space-y-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto" dir="ltr">
                  <div className="text-[11px] text-slate-500 mb-1">// Executed Query:</div>
                  <pre className="text-emerald-400 font-bold whitespace-pre-wrap">{queryOutput.safeQuery}</pre>
                </div>

                <div className={`p-3 rounded-lg border text-xs ${
                  queryOutput.status === 'vulnerable'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : queryOutput.status === 'blocked'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {queryOutput.status === 'vulnerable' ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                    <span>{queryOutput.message}</span>
                  </div>

                  {Array.isArray(queryOutput.dbResult) ? (
                    <div className="mt-2 pt-2 border-t border-rose-500/20 overflow-x-auto" dir="ltr">
                      <div className="text-[11px] text-rose-400 font-bold mb-1">Extracted Database Records:</div>
                      <table className="w-full text-start text-[11px] font-mono">
                        <thead>
                          <tr className="border-b border-rose-500/20 text-slate-400">
                            <th className="py-1">ID</th>
                            <th className="py-1">User</th>
                            <th className="py-1">Role</th>
                            <th className="py-1">Flag</th>
                          </tr>
                        </thead>
                        <tbody>
                          {queryOutput.dbResult.map((row: any) => (
                            <tr key={row.id} className="text-slate-200">
                              <td className="py-0.5">{row.id}</td>
                              <td className="py-0.5 text-amber-300">{row.user}</td>
                              <td className="py-0.5">{row.role}</td>
                              <td className="py-0.5 text-emerald-400">{row.flag}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 mt-1" dir="ltr">
                      Result: {queryOutput.dbResult}
                    </div>
                  )}
                </div>

                {isSuccess && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>اكتمل التحدي! جرب الآن تفعيل جدار الحماية (Defense Mode) لمشاهدة كيف يمنع الهجوم.</span>
                    </div>
                    <span className="font-bold font-mono">+150 XP</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                أدخل حمولة في الحقل أعلاه واضغط على زر التنفيذ لبدء المحاكاة.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
