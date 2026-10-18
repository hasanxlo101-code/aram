import React, { useState } from 'react';
import { X, Printer, Award, Shield, CheckCircle } from 'lucide-react';
import { Course } from '../types/academy';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const [studentName, setStudentName] = useState('Hasan Student');
  if (!isOpen || !course) return null;

  const certNumber = `KAYA-CERT-${Date.now().toString().slice(-8)}`;
  const issueDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Award className="h-4 w-4" />
            <span>KAYA_SAFESEC OFFICIAL CERTIFICATE OF COMPLETION</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>طباعة الشهادة (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Name input */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">اسم المتدرب في الشهادة:</span>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-bold"
          />
        </div>

        {/* Certificate Printable Canvas */}
        <div className="relative p-8 sm:p-12 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl text-center space-y-6 overflow-hidden">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Shield className="h-96 w-96 text-emerald-400" />
          </div>

          <div className="flex items-center justify-center gap-2 font-mono text-xs text-emerald-400 tracking-widest uppercase">
            <span>KAyA_SafeSec · أكاديمية كايا للأمن والحماية الرقمية</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            شهادة إتمام مسار مهني معتمد
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            تشهد إدارة أكاديمية كايا للأمن السيبراني بأن المتدرب:
          </p>

          <div className="text-xl sm:text-2xl font-black text-emerald-300 border-b-2 border-emerald-500/40 pb-2 inline-block px-8">
            {studentName}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            قد أتم بنجاح كافة متطلبات المسار التدريبي الاحترافي والمختبرات التطبيقية المقررة في:
          </p>

          <div className="text-lg sm:text-xl font-bold text-white bg-slate-900/80 border border-slate-800 p-3 rounded-xl max-w-lg mx-auto">
            {course.title}
            <div className="text-xs font-mono text-emerald-400 mt-1">{course.hours} ساعة تدريب عملي ومختبرات KAyA LAB</div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <div className="text-start">
              <div>رقم الاعتماد: <span className="text-white font-bold">{certNumber}</span></div>
              <div className="mt-0.5">تاريخ الإصدار: <span className="text-white">{issueDate}</span></div>
            </div>

            <div className="text-end">
              <div className="text-emerald-400 font-bold">إشراف وإدارة: Hasan (hasanxlo)</div>
              <div className="text-[11px] text-slate-500">Director of KAyA_SafeSec Academy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
