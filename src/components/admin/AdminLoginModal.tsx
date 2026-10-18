import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Key, User } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('hasanxlo101@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Verification against user-specified credentials
    if (cleanEmail === 'hasanxlo101@gmail.com' && cleanPass === 'feelings on pepar**429673') {
      setErrorMsg('');
      onLoginSuccess(cleanEmail);
      onClose();
    } else {
      setErrorMsg('بيانات الدخول غير صحيحة. هذا القسم مخصص لمالك وأدمن الأكاديمية فقط.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">تسجيل دخول مالك وأدمن الأكاديمية</h3>
              <span className="text-xs font-mono text-slate-400">KAyA_SafeSec Administrator Portal</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">البريد الإلكتروني للأدمن:</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hasanxlo101@gmail.com"
                dir="ltr"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <User className="absolute end-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">كلمة مرور لوحة التحكم:</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pe-16"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute end-3 top-2.5 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPass ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              دخول إلى لوحة إدارة الموقع
            </button>
          </div>
        </form>

        <div className="text-[11px] text-slate-500 text-center leading-relaxed">
          فقط مالك المنصة المعتمد يمتلك الصلاحية الحصرية لإضافة أو تعديل أو حذف المسارات والمختبرات.
        </div>
      </div>
    </div>
  );
};
