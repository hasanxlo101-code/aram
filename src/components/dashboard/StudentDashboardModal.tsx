import React, { useState } from 'react';
import {
  X,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Play,
  Shield,
  Sparkles,
  Terminal,
  User,
  Zap,
  Lock,
  Unlock,
  ChevronRight,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { VisitorUser, WordCourse, XpBadge } from '../../types/wordCourses';
import { Course } from '../../types/academy';
import { SYSTEM_BADGES } from '../../data/studentBadges';

interface StudentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: VisitorUser;
  xpPoints: number;
  wordCourses: WordCourse[];
  academyCourses: Course[];
  completedLessons: string[];
  onOpenWordCourse: (course: WordCourse) => void;
  onOpenAcademyCourse: (course: Course) => void;
  onGenerateCertificate: (course: Course) => void;
  onLogout: () => void;
}

export const StudentDashboardModal: React.FC<StudentDashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  xpPoints,
  wordCourses,
  academyCourses,
  completedLessons,
  onOpenWordCourse,
  onOpenAcademyCourse,
  onGenerateCertificate,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'badges' | 'labs'>('courses');

  if (!isOpen) return null;

  // Compute Badges based on XP
  const badges: XpBadge[] = SYSTEM_BADGES.map((b) => ({
    ...b,
    isUnlocked: xpPoints >= b.xpRequirement,
    unlockedAt: xpPoints >= b.xpRequirement ? b.unlockedAt || '2026-10-14' : undefined,
  }));

  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  // Rank determination
  let rankLabel = 'متدرب سيبراني واعد (Cadet)';
  let nextRankXp = 500;
  if (xpPoints >= 1000) {
    rankLabel = 'خبير عمليات سيبرانية متقدم (Elite Operator)';
    nextRankXp = 2000;
  } else if (xpPoints >= 500) {
    rankLabel = 'محلل دفاعي معتمد (Defense Specialist)';
    nextRankXp = 1000;
  }

  // Calculate enrolled courses data
  // User is enrolled by default in beginner Word courses and foundational tracks
  const enrolledWordCourses = wordCourses.filter(
    (wc) => user.enrolledCourseIds.includes(wc.id) || wc.isFree
  );

  const enrolledAcademyCourses = academyCourses.slice(0, 4);

  // Calculate total completed lessons
  const totalCompletedCount = completedLessons.length;
  const overallProgressPercent = Math.min(100, Math.round((totalCompletedCount / 24) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header / User Profile Banner */}
        <div className="border-b border-slate-800 bg-slate-900/60 p-5 sm:p-6 shrink-0 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* User Profile Info */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xl shadow-inner">
                {user.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {user.name}
                  </h2>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {rankLabel}
                  </span>
                </div>

                {/* Unboxed Metadata with typographic separators */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>{user.email}</span>
                  <span aria-hidden="true">·</span>
                  <span>تاريخ الانضمام: {user.joinedDate}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-bold tabular-nums">+{xpPoints} XP مكتسبة</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="تسجيل الخروج من حساب المتدرب"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>تسجيل خروج</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 4 Performance Indicators Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 font-mono">
              <span className="text-[11px] text-slate-500 block mb-0.5">الرصيد الإجمالي</span>
              <div className="text-xl font-bold text-emerald-400 tabular-nums">{xpPoints} XP</div>
              <span className="text-[10px] text-slate-500">الترقية التالية عند {nextRankXp} XP</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 font-mono">
              <span className="text-[11px] text-slate-500 block mb-0.5">نسبة الإنجاز العامة</span>
              <div className="text-xl font-bold text-white tabular-nums">{overallProgressPercent}%</div>
              <span className="text-[10px] text-slate-500">{totalCompletedCount} محطة منجزة</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 font-mono">
              <span className="text-[11px] text-slate-500 block mb-0.5">المسارات النشطة</span>
              <div className="text-xl font-bold text-cyan-400 tabular-nums">
                {enrolledWordCourses.length + enrolledAcademyCourses.length}
              </div>
              <span className="text-[10px] text-slate-500">مسارات Word وتطبيقية</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 font-mono">
              <span className="text-[11px] text-slate-500 block mb-0.5">أوسمة الإنجاز</span>
              <div className="text-xl font-bold text-amber-400 tabular-nums">
                {unlockedBadgesCount} / {badges.length}
              </div>
              <span className="text-[10px] text-slate-500">شارات مفتوحة ومحققة</span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              المسارات المسجلة ومتابعة التقدم
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'badges'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              شارات وأوسمة الإنجاز ({unlockedBadgesCount})
            </button>
            <button
              onClick={() => setActiveTab('labs')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'labs'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              المختبرات والشهادات
            </button>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* TAB 1: ENROLLED COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Section: Word Courses (Interactive .docx documents) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span>وثائق وكورسات Word المفتوحة للمتدرب</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    {enrolledWordCourses.length} ملفات .docx
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {enrolledWordCourses.map((wc) => (
                    <div
                      key={wc.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-400 font-bold">{wc.levelLabelAr.split(' ')[0]}</span>
                          <span className="text-slate-500 tabular-nums">{wc.docMeta.pages} صفحة · {wc.docMeta.fileSize}</span>
                        </div>

                        <h4 className="text-sm font-bold text-white leading-snug">
                          {wc.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {wc.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>مفتوح ومتاح للقراءة</span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onOpenWordCourse(wc);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm shadow-emerald-500/10"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>فتح وقراءة المستند</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Comprehensive Academy Tracks */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-cyan-400" />
                    <span>المسارات التخصصية ومشاريع التخرج (KAyA LAB)</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    {enrolledAcademyCourses.length} مسارات تطبيقية
                  </span>
                </div>

                <div className="space-y-3">
                  {enrolledAcademyCourses.map((course, idx) => {
                    // Count completed lessons for this course
                    const doneForThisCourse = completedLessons.filter((k) =>
                      k.startsWith(course.id)
                    ).length;
                    const percent = Math.min(100, Math.round((doneForThisCourse / course.lessonsCount) * 100));
                    const isFullyDone = percent === 100;

                    return (
                      <div
                        key={course.id}
                        className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-0.5">
                              <span className="text-emerald-400 font-bold">{course.badge}</span>
                              <span>·</span>
                              <span>{course.hours} ساعة تدريبية</span>
                              <span>·</span>
                              <span>{course.difficulty}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white">{course.title}</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            {isFullyDone ? (
                              <button
                                onClick={() => {
                                  onClose();
                                  onGenerateCertificate(course);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-400/30 transition-colors cursor-pointer"
                              >
                                <Award className="h-3.5 w-3.5" />
                                <span>تحميل الشهادة</span>
                              </button>
                            ) : null}

                            <button
                              onClick={() => {
                                onClose();
                                onOpenAcademyCourse(course);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Play className="h-3 w-3" />
                              <span>متابعة الدروس ({doneForThisCourse}/{course.lessonsCount})</span>
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-400">نسبة التقدم في المنهج:</span>
                            <span className="text-emerald-400 font-bold tabular-nums">{percent}% مكتمل</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(8, percent)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: XP BADGES & ACHIEVEMENTS */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span>شارات وأوسمة الإنجاز السيبراني (Cyber Badges)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    احصل على نقاط الخبرة (XP) عبر إتمام الدروس وحل تحديات المختبرات لفتح الأوسمة التخصصية.
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  {unlockedBadgesCount} مفتوحة من أصل {badges.length}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge) => {
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        badge.isUnlocked
                          ? 'border-emerald-500/40 bg-gradient-to-b from-slate-900 to-emerald-950/20 shadow-md shadow-emerald-500/5'
                          : 'border-slate-800/80 bg-slate-900/30 opacity-70'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                            badge.isUnlocked
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            <Award className="h-5 w-5" />
                          </div>

                          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                            badge.isUnlocked
                              ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-950 border border-slate-800 text-slate-500'
                          }`}>
                            {badge.isUnlocked ? 'محققة ✓' : `${badge.xpRequirement} XP`}
                          </span>
                        </div>

                        <div>
                          <h4 className={`text-xs font-bold ${badge.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                            {badge.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 block mb-1" dir="ltr">
                            {badge.titleEn}
                          </span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                        {badge.isUnlocked ? (
                          <span className="text-emerald-400">تاريخ الإنجاز: {badge.unlockedAt}</span>
                        ) : (
                          <span>يتطلب {Math.max(0, badge.xpRequirement - xpPoints)} XP إضافية</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LABS & CERTIFICATES */}
          {activeTab === 'labs' && (
            <div className="space-y-6">
              {/* Completed Labs Summary */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span>سجل إنجازات المختبرات التطبيقية (KAyA LAB Status)</span>
                </h3>

                <div className="space-y-2.5">
                  {[
                    { title: 'SQL Injection Lab (OWASP Top 10 A03)', xp: '+150 XP', status: 'مكتمل بنجاح', date: '2026-10-14' },
                    { title: 'Network Forensics & Wireshark PCAP Stream', xp: '+180 XP', status: 'مكتمل بنجاح', date: '2026-10-14' },
                    { title: 'AI & Prompt Injection Defense (OWASP LLM)', xp: '+175 XP', status: 'قيد المحاكاة', date: '2026-10-14' },
                  ].map((lab, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-800/90 bg-slate-950/60 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <div>
                          <span className="font-bold text-slate-200 block">{lab.title}</span>
                          <span className="text-[11px] font-mono text-slate-500">{lab.date} · محاكاة داخل المتصفح</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-emerald-400 font-bold tabular-nums">{lab.xp}</span>
                        <span className="text-slate-400 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {lab.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates Showcase */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>الشهادات المعتمدة الجاهزة للطباعة</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  بمجرد إتمام مساراتك التدريبية يمكنك استخراج شهادة إتمام رسمية موقعة وموثقة برقم تسلسلي من إدارة أكاديمية KAyA_SafeSec.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onGenerateCertificate(academyCourses[0]);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    <Award className="h-4 w-4" />
                    <span>معاينة وطباعة نموذج الشهادة المعتمدة</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
