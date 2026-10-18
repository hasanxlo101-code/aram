import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Share2, 
  Download, 
  QrCode, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { PROFESSIONAL_TRACKS } from '../../data/professionalTracksData';

interface SkillsAndCertificatesSectionProps {
  studentName?: string;
  completedLessonCount: number;
  completedLabsCount: number;
  xpPoints: number;
}

export const SkillsAndCertificatesSection: React.FC<SkillsAndCertificatesSectionProps> = ({
  studentName = 'طالب أكاديمية KAyA المعتمد',
  completedLessonCount = 2,
  completedLabsCount = 1,
  xpPoints = 250,
}) => {
  const [activeCertTrackId, setActiveCertTrackId] = useState<string>(PROFESSIONAL_TRACKS[0].id);
  const [customStudentName, setCustomStudentName] = useState<string>(studentName);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const selectedTrack = PROFESSIONAL_TRACKS.find(t => t.id === activeCertTrackId) || PROFESSIONAL_TRACKS[0];

  // Calculated skills distribution
  const skillsMatrix = [
    { domain: 'هندسة الشبكات وثالوث CIA', level: 'متقدم', score: Math.min(95, 60 + completedLessonCount * 5), color: 'from-emerald-500 to-teal-400' },
    { domain: 'عمليات مركز الـ SOC وتحليل السجلات', level: 'متوسط', score: Math.min(90, 50 + completedLabsCount * 15), color: 'from-cyan-500 to-blue-500' },
    { domain: 'أمن الويب واختبار الثغرات (OWASP)', level: 'متوسط', score: Math.min(88, 45 + completedLabsCount * 20), color: 'from-blue-500 to-indigo-500' },
    { domain: 'التحقيقات الجنائية الرقمية (DFIR)', level: 'تأسيسي', score: Math.min(80, 40 + completedLessonCount * 4), color: 'from-purple-500 to-pink-500' },
    { domain: 'الاستخبارات مفتوحة المصدر (OSINT)', level: 'متقدم', score: Math.min(92, 55 + completedLessonCount * 6), color: 'from-amber-500 to-orange-500' },
    { domain: 'أمن الذكاء الاصطناعي وهندسة الحماية', level: 'متوسط', score: Math.min(85, 35 + completedLabsCount * 25), color: 'from-teal-400 to-emerald-500' },
  ];

  const certCredentialId = `KAYA-${selectedTrack.category.toUpperCase()}-2026-${Math.abs(selectedTrack.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000) * 73).toString().slice(0, 6)}`;

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleVerifyCredential = () => {
    setVerificationFeedback(` تم التحقق بنجاح! الشهادة رقم [${certCredentialId}] مسجلة وموثقة في سجلات KAyA Safe&Sec بتاريخ ${new Date().toLocaleDateString('ar-EG')}`);
    setTimeout(() => setVerificationFeedback(null), 6000);
  };

  return (
    <section className="space-y-10" dir="rtl">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0c1633] via-[#091124] to-[#070d1e] border border-cyan-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>مصفوفة المهارات والاعتمادات الرسمية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            خريطة الكفاءات والشهادات الرقمية الموثقة
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            قياس كمي لمهاراتك في فروع الأمن السيبراني الستة وإصدار شهادات مهنية موثوقة برقم تحقق وطني ودولي بإشراف إدارة الأكاديمية.
          </p>
        </div>
      </div>

      {/* Two Columns: Skills Radar & Certificate Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Main Column: Skills Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                مصفوفة المهارات الفنية التراكمية
              </h3>
              <span className="text-xs font-mono text-cyan-300 font-bold">{xpPoints} XP</span>
            </div>

            <div className="space-y-4">
              {skillsMatrix.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{skill.domain}</span>
                    <span className="text-cyan-400 font-bold font-mono">{skill.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-700`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>مستوى الكفاءة: {skill.level}</span>
                    <span>معيار تقييم عملي</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-850 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-lg font-bold text-white font-mono">{completedLessonCount}</div>
                <div className="text-[11px] text-slate-400">وحدة نظرية مكتملة</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-lg font-bold text-emerald-400 font-mono">{completedLabsCount}</div>
                <div className="text-[11px] text-slate-400">مختبر عملي معتمد</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verifiable Certificate Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-6 shadow-xl">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  الشهادة الرقمية المعتمدة
                </h3>
                <p className="text-xs text-slate-400">تحديث فوري لمعلومات الشهادة وكود التحقق</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={activeCertTrackId}
                  onChange={(e) => setActiveCertTrackId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {PROFESSIONAL_TRACKS.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Name Input */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-300 shrink-0">اسم الخريج على الشهادة:</label>
              <input
                type="text"
                value={customStudentName}
                onChange={(e) => setCustomStudentName(e.target.value)}
                placeholder="أدخل الاسم الثلاثي باللغة العربية"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Physical-style Certificate Preview Card */}
            <div 
              id="printable-certificate"
              className="relative p-7 sm:p-10 rounded-2xl bg-gradient-to-br from-[#070e22] via-[#091533] to-[#040817] border-2 border-amber-500/40 shadow-2xl text-center space-y-6 overflow-hidden print:p-0 print:border-none"
            >
              {/* Corner Watermarks */}
              <div className="absolute top-0 right-0 w-28 h-28 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl pointer-events-none"></div>

              {/* Academy Seal */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-300 tracking-wider">KAyA SAFE&SEC ACADEMY</div>
                  <div className="text-[10px] text-slate-400">Cyber Defense & Intelligence Curriculum</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                  KAyA
                </div>
                <div className="text-left font-mono text-[10px] text-slate-400">
                  REF: 2026-ARCH-VERIFIED
                </div>
              </div>

              {/* Certificate Body */}
              <div className="space-y-3 py-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  شهادة إتمام معتمدة · CERTIFICATE OF COMPLETION
                </span>
                <p className="text-xs text-slate-300">تشهد إدارة أكاديمية KAyA Safe&Sec بأن المهندس/ـة:</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 py-1">
                  {customStudentName || 'حسن نبيل خلو'}
                </h4>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  قد أتم بنجاح متطلبات المسار التخصصي المهني:
                </p>
                <div className="text-base sm:text-lg font-bold text-cyan-300 bg-cyan-950/40 py-2 px-4 rounded-xl border border-cyan-500/30 inline-block">
                  {selectedTrack.title}
                </div>
                <p className="text-[11px] text-slate-400">
                  بمعدل تقييم متميز واجتياز لكافة التدريبات العملية والمشاريع التطبيقية واختبارات الـ Capstone.
                </p>
              </div>

              {/* Signatures & QR */}
              <div className="grid grid-cols-3 items-end pt-6 border-t border-amber-500/20 text-xs">
                {/* Founder Signature */}
                <div className="space-y-1 text-center">
                  <div className="font-serif italic text-amber-300 text-sm">Hassan N. Khalu</div>
                  <div className="w-24 h-0.5 bg-amber-500/30 mx-auto"></div>
                  <div className="font-bold text-slate-200 text-[11px]">م. حسن نبيل خلو</div>
                  <div className="text-[10px] text-slate-400">المؤسس والمشرف الأكاديمي</div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="p-2 bg-white rounded-lg shadow">
                    <QrCode className="w-12 h-12 text-slate-950" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 select-all">{certCredentialId}</span>
                </div>

                {/* Academic Seal */}
                <div className="space-y-1 text-center">
                  <div className="text-emerald-400 font-bold text-xs">معتمد رسمياً</div>
                  <div className="w-24 h-0.5 bg-emerald-500/30 mx-auto"></div>
                  <div className="text-[11px] text-slate-200">{new Date().toLocaleDateString('ar-EG')}</div>
                  <div className="text-[10px] text-slate-400">تاريخ منح الاعتماد</div>
                </div>
              </div>
            </div>

            {/* Verification Alert */}
            {verificationFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{verificationFeedback}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleVerifyCredential}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>التحقق من صحة القيد الأكاديمي</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold hover:brightness-110 transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة أو حفظ PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
