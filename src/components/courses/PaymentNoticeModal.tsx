import React, { useState } from 'react';
import { X, ShieldAlert, Lock, CheckCircle2, DollarSign, Clock, ShieldCheck, BookOpen } from 'lucide-react';
import { WordCourse } from '../../types/wordCourses';

interface PaymentNoticeModalProps {
  course: WordCourse | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPreview: (course: WordCourse) => void;
}

export const PaymentNoticeModal: React.FC<PaymentNoticeModalProps> = ({
  course,
  isOpen,
  onClose,
  onOpenPreview,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [reservedSuccess, setReservedSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setReservedSuccess(true);
    setTimeout(() => {
      setReservedSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">الاشتراك في المسار المدفوع</h3>
              <span className="text-xs font-mono text-slate-400">{course.levelLabelAr}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Course Info & Price Banner */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">{course.title}</h4>
            <span className="text-xs font-mono text-slate-400 mt-1 block">
              {course.hours} ساعة تدريب · وثيقة Word (.docx) معتمدة
            </span>
          </div>

          <div className="text-end shrink-0">
            <span className="text-[11px] text-slate-500 block">رسوم المسار:</span>
            <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
              ${course.priceUsd}
            </span>
          </div>
        </div>

        {/* Required Security Notice About Payment System */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
            <span>إشعار أمني رسمي حول بوابة الدفع الإلكتروني</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed text-justify">
            نود إحاطتكم علماً بأن نظام وبوابة الدفع الإلكتروني المصرفية <strong>ما زالت قيد التنفيذ والتطوير حالياً</strong>، ولم يتم إنهاؤها أو إطلاقها النهائي بعد، وذلك لضمان تطبيق أعلى إجراءات ومعايير الأمان المالي والتشفير السيبراني (PCI-DSS & End-to-End Encryption) لحماية بياناتكم البنكية.
          </p>
        </div>

        {/* Early-Bird Reservation Form */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-200 block">
            سجل اهتمامك الآن للحصول على خصم 30% وأولوية الدخول عند الإطلاق:
          </span>

          {reservedSuccess ? (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>تم تسجيل حجزك بنجاح! سنرسل لك إشعاراً فور تفعيل بوابة الدفع الآمنة.</span>
            </div>
          ) : (
            <form onSubmit={handleReserve} className="space-y-2.5">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني (your@email.com)..."
                dir="ltr"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                تأكيد الحجز المسبق والتنبيه الفوري
              </button>
            </form>
          )}
        </div>

        {/* Free Preview Option */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">هل ترغب بالاطلاع على فهرس المسار؟</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPreview(course);
            }}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>معاينة ملف Word مجاناً</span>
          </button>
        </div>
      </div>
    </div>
  );
};
