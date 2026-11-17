import React, { useState } from 'react';
import { X, Printer, Award, Shield, Cpu, Globe2, Fingerprint, LockKeyhole } from 'lucide-react';
import { Course } from '../types/academy';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, course }) => {
  const [studentName, setStudentName] = useState('');
  if (!isOpen || !course) return null;

  const certNumber = `KAYA-PREVIEW-${Date.now().toString().slice(-8)}`;
  const issueDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-[#020611]/95 backdrop-blur-md print:static print:block print:bg-white print:p-0">
      <div className="relative w-full max-w-5xl rounded-2xl border border-cyan-400/30 bg-[#050b18] p-3 sm:p-5 shadow-[0_0_70px_rgba(6,182,212,.12)] max-h-[96vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-cyan-900/70 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <Award className="h-4 w-4" />
            <span>KAyA Safe&Sec — CERTIFICATE DESIGN / تصميم الشهادة</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-300 hover:bg-cyan-200 text-slate-950 text-xs font-bold transition-colors">
              <Printer className="h-4 w-4" /><span>طباعة / حفظ PDF</span>
            </button>
            <button onClick={onClose} aria-label="إغلاق" className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs print:hidden">
          <label htmlFor="certificate-student-name" className="text-slate-300">اسم المتدرب:</label>
          <input id="certificate-student-name" type="text" value={studentName} onChange={e => setStudentName(e.target.value)}
            placeholder="أدخل الاسم الكامل" dir="auto"
            className="min-w-0 flex-1 bg-slate-900 border border-cyan-900 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400" />
          <span className="text-amber-300">نموذج تصميم — لا يثبت إتمام الدورة أو صلاحية الشهادة.</span>
        </div>

        <article dir="rtl" className="certificate-sheet relative isolate overflow-hidden min-h-[560px] sm:min-h-[620px] border-2 border-cyan-400/80 bg-[#030817] text-white">
          <div className="absolute inset-[7px] border border-cyan-300/40 pointer-events-none" />
          <div className="absolute inset-[13px] border border-blue-500/25 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:'linear-gradient(rgba(34,211,238,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.10) 1px, transparent 1px)',backgroundSize:'28px 28px'}} />
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col min-h-[560px] sm:min-h-[620px] p-6 sm:p-10">
            <header className="flex items-start justify-between gap-4 border-b border-cyan-400/40 pb-5">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-14 w-14 border border-cyan-300/70 bg-cyan-300/10 text-cyan-200">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <div className="font-black tracking-[.16em] text-cyan-200 text-lg sm:text-2xl">KAyA <span className="text-white">Safe&Sec</span></div>
                  <div className="text-[10px] sm:text-xs tracking-[.2em] text-slate-400 uppercase">Cybersecurity · Digital Forensics · OSINT</div>
                  <div className="text-xs text-cyan-100 mt-1">أكاديمية كايا للأمن والحماية الرقمية</div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 text-cyan-300/80">
                <Cpu className="h-7 w-7" /><span className="text-[9px] tracking-[.2em]">ACADEMY / VERIFIED DESIGN</span>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-5 items-center flex-1 py-7">
              <section className="text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] sm:text-xs tracking-[.25em] text-cyan-300 uppercase mb-3">
                  <span className="inline-block w-8 h-px bg-cyan-300" /> Certificate of Completion
                </div>
                <h1 className="text-3xl sm:text-5xl font-black leading-tight text-white">شهادة إتمام</h1>
                <h2 className="text-sm sm:text-lg text-cyan-200 mt-2 font-bold">CERTIFICATE OF ACHIEVEMENT</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-5">تشهد أكاديمية KAyA Safe&Sec بأن المتدرب/ة</p>
                <div className="mt-3 mb-4 text-2xl sm:text-4xl font-black text-cyan-200 break-words [text-shadow:0_0_22px_rgba(34,211,238,.25)]">
                  {studentName.trim() || 'اسم المتدرب الكامل'}
                </div>
                <div className="h-px w-4/5 mx-auto sm:mx-0 bg-gradient-to-l from-cyan-300/80 via-blue-400/50 to-transparent" />
                <p className="mt-4 text-xs sm:text-sm leading-7 text-slate-300">قد أتمّ المتطلبات التدريبية الخاصة بالبرنامج التالي</p>
                <div className="mt-3 inline-block max-w-full border border-cyan-400/40 bg-cyan-950/40 px-5 py-3">
                  <div className="text-lg sm:text-2xl font-bold text-white break-words">{course.title}</div>
                  <div className="mt-2 text-xs sm:text-sm text-cyan-200">{course.hours} ساعة تدريبية · مختبرات KAyA LAB</div>
                </div>
              </section>

              <aside className="flex sm:flex-col items-center justify-center gap-4 sm:gap-5">
                <div className="relative grid place-items-center w-28 h-28 sm:w-40 sm:h-40 rounded-full border border-cyan-300/60 bg-[#07162a]/80 shadow-[0_0_35px_rgba(34,211,238,.12)]">
                  <div className="absolute inset-2 rounded-full border border-dashed border-blue-300/60" />
                  <div className="absolute inset-4 rounded-full border border-cyan-300/30" />
                  <Globe2 className="h-12 w-12 sm:h-16 sm:w-16 text-cyan-200" />
                  <span className="absolute -bottom-2 bg-[#030817] px-2 text-[9px] tracking-[.2em] text-cyan-200">KAYA ACADEMY</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 sm:flex-col sm:text-center">
                  <Fingerprint className="h-5 w-5 text-cyan-300" />
                  <span>Digital Skills<br/>Learning Achievement</span>
                </div>
              </aside>
            </div>

            <footer className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-cyan-400/40 pt-5">
              <div className="text-xs">
                <div className="text-slate-500 mb-1">رقم مرجعي للمعاينة</div>
                <div className="font-mono text-cyan-200 break-all">{certNumber}</div>
                <div className="text-slate-500 mt-2">تاريخ المعاينة</div>
                <div className="text-slate-200">{issueDate}</div>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <LockKeyhole className="h-5 w-5 text-cyan-300 mb-1" />
                <div className="text-[10px] text-cyan-200 font-bold">KAyA Safe&Sec Academy</div>
                <div className="text-[9px] text-slate-500 mt-1">التوقيع والختم الرسمي يُضافان بعد التحقق</div>
              </div>
              <div className="text-xs sm:text-left text-center sm:self-end">
                <div className="text-slate-300 font-bold">الإدارة الأكاديمية</div>
                <div className="text-slate-500 mt-1">Cybersecurity Training & Digital Skills</div>
                <div className="mt-3 inline-flex items-center gap-2 text-[9px] text-amber-300 border border-amber-500/30 px-2 py-1">
                  <span>PREVIEW</span><span>·</span><span>غير معتمدة للتحقق الرسمي</span>
                </div>
              </div>
            </footer>
          </div>
        </article>
      </div>
      <style>{`
        @media print {
          @page { size: landscape; margin: 8mm; }
          body * { visibility: hidden !important; }
          .certificate-sheet, .certificate-sheet * { visibility: visible !important; }
          .certificate-sheet { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; min-height: 0 !important; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
          .certificate-sheet > div:last-child { min-height: 0 !important; }
        }
      `}</style>
    </div>
  );
};
