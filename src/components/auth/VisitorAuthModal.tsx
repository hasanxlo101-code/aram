import React, { useState } from 'react';
import { X, User, Mail, Lock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { VisitorUser } from '../../types/wordCourses';

interface VisitorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: VisitorUser) => void;
}

export const VisitorAuthModal: React.FC<VisitorAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFeedback('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    const visitor: VisitorUser = {
      id: `visitor-${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      joinedDate: new Date().toISOString().split('T')[0],
      enrolledCourseIds: ['word-beg-01', 'word-beg-02'],
    };

    onLoginSuccess(visitor);
    onClose();
  };

  const handleGuestLogin = () => {
    const guest: VisitorUser = {
      id: `guest-${Date.now()}`,
      name: 'متدرب زائر (Guest)',
      email: 'guest@kaya-safesec.org',
      joinedDate: new Date().toISOString().split('T')[0],
      enrolledCourseIds: ['word-beg-01'],
    };
    onLoginSuccess(guest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">بوابة تسجيل دخول المتدربين والزوار</h3>
              <span className="text-xs font-mono text-slate-400">KAyA_SafeSec Student Access</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setFeedback('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setFeedback('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="text-slate-300 block mb-1">الاسم الكامل:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك للمتابعة والشهادات..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="text-slate-300 block mb-1">البريد الإلكتروني:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              dir="ltr"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">كلمة المرور:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              dir="ltr"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {feedback && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
              {feedback}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            {mode === 'login' ? 'دخول المنصة وتصفح ملفات Word' : 'إنشاء الحساب وبدء التعلم'}
          </button>
        </form>

        {/* Guest access option */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="text-xs text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            تخطي ومتابعة كزائر مجاني (Guest Mode) ←
          </button>
        </div>
      </div>
    </div>
  );
};
