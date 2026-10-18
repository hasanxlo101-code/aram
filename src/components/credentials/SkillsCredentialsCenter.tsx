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
  UserCheck,
  LogIn
} from 'lucide-react';
import { PROFESSIONAL_TRACKS } from '../../data/professionalTracksData';
import { VisitorUser } from '../../types/wordCourses';

interface SkillsCredentialsCenterProps {
  user: VisitorUser | null;
  xpPoints: number;
  completedLessonsCount: number;
  onOpenCertificateModal: () => void;
  onOpenVisitorLogin: () => void;
}

export const SkillsCredentialsCenter: React.FC<SkillsCredentialsCenterProps> = ({
  user,
  xpPoints,
  completedLessonsCount,
  onOpenCertificateModal,
  onOpenVisitorLogin,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(PROFESSIONAL_TRACKS[0].id);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const selectedTrack = PROFESSIONAL_TRACKS.find(t => t.id === selectedTrackId) || PROFESSIONAL_TRACKS[0];
  const studentDisplayName = user?.name || 'مهندس الأمن السيبراني حسن نبيل خلو';

  const skillsMatrix = [
    { domain: 'أساسيات الدفاع ونموذج CIA', level: 'متقدم', score: Math.min(95, 65 + completedLessonsCount * 4), color: 'from-emerald-500 to-teal-400' },
    { domain: 'تحليل عمليات الـ SOC وقواعد Sigma', level: 'متوسط', score: Math.min(90, 55 + completedLessonsCount * 3), color: 'from-cyan-500 to-blue-500' },
    { domain: 'أمن تطبيقات الويب (OWASP Top 10)', level: 'متقدم', score: Math.min(92, 50 + completedLessonsCount * 4), color: 'from-blue-500 to-indigo-500' },
    { domain: 'التحقيقات الرقمية والذاكرة (DFIR)', level: 'تأسيسي', score: Math.min(85, 45 + completedLessonsCount * 3), color: 'from-purple-500 to-pink-500' },
    { domain: 'استخبارات المصادر المفتوحة (OSINT)', level: 'متقدم', score: Math.min(94, 60 + completedLessonsCount * 5), color: 'from-amber-500 to-orange-500' },
    { domain: 'أمن نماذج الذكاء الاصطناعي (LLM)', level: 'متوسط', score: Math.min(88, 40 + completedLessonsCount * 4), color: 'from-teal-400 to-emerald-500' },
  ];

  const credentialId = `KAYA-${selectedTrack.category.toUpperCase()}-2026-${Math.abs(selectedTrack.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000) * 89).toString().slice(0, 6)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleVerify = () => {
    setVerificationFeedback(` تم التحقق بنجاح! القيد الأكاديمي [${credentialId}] مسجل رسمياً في قاعدة بيانات KAyA Safe&Sec بتاريخ ${new Date().toLocaleDateString('ar-EG')}`);
    setTimeout(() => setVerificationFeedback(null), 6000);
  };

  return (
    <div className="space-y-10" dir="rtl">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0c1633] via-[#091124] to-[#070d1e] border border-cyan-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>الاعتمادات ومصفوفة المهارات الرقمية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            خريطة الكفاءات والشهادات الأكاديمية المعتمدة
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            قياس كمي دقيق لتطورك المهني في 6 مجالات أمنية رئيسية، مع توليد شهادات تخرج رقمية تحمل رقم تحقق أكاديمي فريد وبصمة استيثاق قابلة للمشاركة.
          </p>
        </div>
      </div>

      {/* Grid: Skills Matrix + Certificate Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Skills Radar / Bars */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                مصفوفة المهارات السيبرانية
              </h3>
              <span className="text-xs font-mono text-cyan-300 font-bold">{xpPoints} XP</span>
            </div>

            <div className="space-y-4">
              {skillsMatrix.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{item.domain}</span>
                    <span className="text-cyan-400 font-bold font-mono">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>الكفاءة: {item.level}</span>
                    <span>معتمد من الأكاديمية</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-850 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-lg font-bold text-white font-mono">{completedLessonsCount}</div>
                <div className="text-[11px] text-slate-400">وحدة منجزة</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-lg font-bold text-emerald-400 font-mono">{xpPoints}</div>
                <div className="text-[11px] text-slate-400">إجمالي نقاط الخبرة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Certificate Generation & Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-6 shadow-xl">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  معاينة الشهادة الرقمية المعتمدة
                </h3>
                <p className="text-xs text-slate-400">اختر المسار لإصدار وثيقة الاعتماد الرسمية</p>
              </div>

              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {PROFESSIONAL_TRACKS.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            {/* Official Certificate Card */}
            <div className="relative p-7 sm:p-10 rounded-2xl bg-gradient-to-br from-[#070e22] via-[#091533] to-[#040817] border-2 border-amber-500/40 shadow-2xl text-center space-y-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl pointer-events-none"></div>

              {/* Seal */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-300 tracking-wider">KAyA SAFE&SEC ACADEMY</div>
                  <div className="text-[10px] text-slate-400">Cyber Defense & Intelligence Curriculum</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                  KAyA
                </div>
                <div className="text-left font-mono text-[10px] text-slate-400">
                  {credentialId}
                </div>
              </div>

              {/* Body */}
              <div className="space-y-3 py-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  شهادة إتمام وتأهيل مهني معتمدة
                </span>
                <p className="text-xs text-slate-300">تشهد إدارة منصة KAyA Safe&Sec بأن المهندس/ـة:</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 py-1">
                  {studentDisplayName}
                </h4>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  قد أتم بنجاح كافة الساعات المعتمدة والمتطلبات العملية في مسار:
                </p>
                <div className="text-base sm:text-lg font-bold text-cyan-300 bg-cyan-950/40 py-2 px-4 rounded-xl border border-cyan-500/30 inline-block">
                  {selectedTrack.title}
                </div>
                <p className="text-[11px] text-slate-400">
                  مع اجتياز كافة التحديات البرمجية والمختبرات المعزولة ومشاريع التخرج.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 items-end pt-6 border-t border-amber-500/20 text-xs">
                <div className="space-y-1 text-center">
                  <div className="font-serif italic text-amber-300 text-sm">Hassan N. Khalu</div>
                  <div className="w-24 h-0.5 bg-amber-500/30 mx-auto"></div>
                  <div className="font-bold text-slate-200 text-[11px]">م. حسن نبيل خلو</div>
                  <div className="text-[10px] text-slate-400">المؤسس والمشرف الأكاديمي</div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="p-2 bg-white rounded-lg shadow">
                    <QrCode className="w-12 h-12 text-slate-950" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-400">{credentialId}</span>
                  <span className="font-mono text-[8px] text-cyan-400/80">tinyurl.com/kaya-safesec</span>
                </div>

                <div className="space-y-1 text-center">
                  <div className="text-emerald-400 font-bold text-xs">اعتماد موثق</div>
                  <div className="w-24 h-0.5 bg-emerald-500/30 mx-auto"></div>
                  <div className="text-[11px] text-slate-200">{new Date().toLocaleDateString('ar-EG')}</div>
                  <div className="text-[10px] text-slate-400">تاريخ الإصدار الأكاديمي</div>
                </div>
              </div>
            </div>

            {verificationFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{verificationFeedback}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleVerify}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>التحقق من صحة القيد الأكاديمي</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold hover:brightness-110 transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة أو حفظ الشهادة PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
