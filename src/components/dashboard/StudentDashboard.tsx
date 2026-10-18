import React, { useState } from 'react';
import {
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
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  LogOut,
  LogIn,
  RotateCcw
} from 'lucide-react';
import { VisitorUser, WordCourse, XpBadge } from '../../types/wordCourses';
import { Course } from '../../types/academy';
import { SYSTEM_BADGES } from '../../data/studentBadges';

interface StudentDashboardProps {
  user: VisitorUser | null;
  xpPoints: number;
  wordCourses: WordCourse[];
  academyCourses: Course[];
  completedLessons: string[];
  onOpenWordCourse: (course: WordCourse) => void;
  onOpenAcademyCourse: (course: Course) => void;
  onGenerateCertificate: (course: Course) => void;
  onOpenVisitorLogin: () => void;
  onLogout: () => void;
  onToggleLessonComplete?: (lessonKey: string) => void;
  onExploreCourses?: () => void;
  onExploreLabs?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  xpPoints,
  wordCourses,
  academyCourses,
  completedLessons,
  onOpenWordCourse,
  onOpenAcademyCourse,
  onGenerateCertificate,
  onOpenVisitorLogin,
  onLogout,
  onToggleLessonComplete,
  onExploreCourses,
  onExploreLabs,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'word' | 'academy' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState<string>('all');

  // If user is not logged in, show student portal authentication prompt
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-8 animate-in fade-in duration-300">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-xl shadow-emerald-500/5">
          <User className="h-10 w-10" />
        </div>

        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            لوحة متابعة المتدرب السيبراني (Student Dashboard)
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            قم بتسجيل الدخول أو إنشاء حساب متدرب جديد لحفظ تقدمك في المناهج، جمع شارات نقاط الخبرة (XP Badges)، والوصول لمستندات الكورسات والمختبرات المسجلة.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenVisitorLogin}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/15 cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>تسجيل الدخول / فتح الحساب</span>
          </button>

          {onExploreCourses && (
            <button
              onClick={onExploreCourses}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>تصفح الكورسات المفتوحة</span>
            </button>
          )}
        </div>

        {/* Feature previews for prospective students */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 text-right">
          <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white">متابعة نسب الإنجاز التفاعلية</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تسجيل تلقائي لتقدمك في كل درس عملي، مشروع تطبيقي، ومستند Word تدرسه.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white">نظام شارات وأوسمة XP</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              اكتسب نقاط خبرة مع كل اختبار تنهيه وافتح أوسمة دفاع الويب وهندسة الشبكات.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Shield className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-white">شهادات إتمام موثقة رقمياً</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              توليد وطباعة شهادة تخرج رسمية معتمدة برقم تسلسلي من أكاديمية كايا.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Badges based on XP Points
  const badges: XpBadge[] = SYSTEM_BADGES.map((b) => ({
    ...b,
    isUnlocked: xpPoints >= b.xpRequirement,
    unlockedAt: xpPoints >= b.xpRequirement ? b.unlockedAt || '2026-10-14' : undefined,
  }));

  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  // Rank determination
  let rankLabel = 'متدرب سيبراني واعد (Cyber Cadet)';
  let nextRankName = 'محلل دفاعي معتمد (Defense Specialist)';
  let prevRankXp = 0;
  let nextRankXp = 500;

  if (xpPoints >= 1000) {
    rankLabel = 'خبير عمليات سيبرانية متقدم (Elite Operator)';
    nextRankName = 'أسطورة كايا السيبرانية (Master Guardian)';
    prevRankXp = 1000;
    nextRankXp = 2000;
  } else if (xpPoints >= 500) {
    rankLabel = 'محلل دفاعي معتمد (Defense Specialist)';
    nextRankName = 'خبير عمليات سيبرانية متقدم (Elite Operator)';
    prevRankXp = 500;
    nextRankXp = 1000;
  }

  const rankProgressPercent = Math.min(
    100,
    Math.round(((xpPoints - prevRankXp) / (nextRankXp - prevRankXp)) * 100)
  );

  // Enrolled Word Courses
  const enrolledWordCourses = wordCourses.filter(
    (wc) => user.enrolledCourseIds.includes(wc.id) || wc.isFree
  );

  // Enrolled Academy Courses (Foundational 4 tracks + any user customized)
  const enrolledAcademyCourses = academyCourses.slice(0, 4);

  // Combine and format enrolled course list with completion status
  interface FormattedEnrolledCourse {
    id: string;
    title: string;
    subtitle: string;
    level: string;
    type: 'word' | 'academy';
    totalUnits: number;
    completedUnits: number;
    progressPercent: number;
    isCompleted: boolean;
    rawWordCourse?: WordCourse;
    rawAcademyCourse?: Course;
  }

  const formattedCourses: FormattedEnrolledCourse[] = [
    // Word Courses
    ...enrolledWordCourses.map((wc, idx) => {
      // simulate realistic progress based on completed lessons
      const isWordCompleted = completedLessons.some((id) => id.includes(wc.id) || id.includes('word-beg'));
      const completedUnits = isWordCompleted ? wc.chapters.length : (idx === 0 ? Math.min(2, wc.chapters.length) : 0);
      const progressPercent = Math.min(100, Math.round((completedUnits / Math.max(1, wc.chapters.length)) * 100));

      return {
        id: wc.id,
        title: wc.title,
        subtitle: wc.subtitle,
        level: wc.levelLabelAr,
        type: 'word' as const,
        totalUnits: wc.chapters.length,
        completedUnits,
        progressPercent,
        isCompleted: progressPercent === 100,
        rawWordCourse: wc,
      };
    }),
    // Academy Courses
    ...enrolledAcademyCourses.map((course) => {
      const doneLessons = completedLessons.filter((k) => k.startsWith(course.id)).length;
      const progressPercent = Math.min(100, Math.round((doneLessons / course.lessonsCount) * 100));

      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        level: course.difficulty,
        type: 'academy' as const,
        totalUnits: course.lessonsCount,
        completedUnits: doneLessons,
        progressPercent,
        isCompleted: progressPercent === 100,
        rawAcademyCourse: course,
      };
    }),
  ];

  // Filtering
  const filteredCourses = formattedCourses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeSubTab === 'word') return c.type === 'word';
    if (activeSubTab === 'academy') return c.type === 'academy';
    if (activeSubTab === 'completed') return c.isCompleted;
    return true;
  });

  const totalCompletedCount = formattedCourses.filter((c) => c.isCompleted).length;
  const overallProgressPercent = Math.min(
    100,
    Math.round(
      (formattedCourses.reduce((sum, c) => sum + c.progressPercent, 0) /
        Math.max(1, formattedCourses.length))
    )
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ======================================================== */}
      {/* 1. STUDENT PROFILE & PROGRESS BANNER */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-2xl shadow-inner">
              {user.name.slice(0, 2).toUpperCase()}
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 border border-emerald-500/40 text-emerald-400">
                <Sparkles className="h-3 w-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {rankLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-mono">
                <span>{user.email}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>تاريخ التسجيل: {user.joinedDate}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400 font-bold tabular-nums">معرّف الطالب: {user.id.slice(0, 14)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            {onExploreLabs && (
              <button
                onClick={onExploreLabs}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors cursor-pointer"
              >
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span>المختبرات التفاعلية</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-slate-800 hover:border-rose-800/40 transition-colors cursor-pointer"
              title="تسجيل الخروج من الحساب"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">الرتبة الحالية:</span>
              <span className="text-white font-bold">{rankLabel.split('(')[0]}</span>
            </div>
            <div className="text-slate-400">
              الهدف التالي:{' '}
              <span className="text-emerald-400 font-bold">{nextRankName.split('(')[0]}</span>{' '}
              ({xpPoints} / {nextRankXp} XP)
            </div>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/20"
              style={{ width: `${Math.max(6, rankProgressPercent)}%` }}
            />
          </div>
        </div>

        {/* 4 Performance Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-slate-800/90 bg-slate-950/70 font-mono">
            <span className="text-[11px] text-slate-500 block mb-0.5">رصيد نقاط الخبرة</span>
            <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">{xpPoints} XP</div>
            <span className="text-[10px] text-slate-500 block mt-0.5">+{rankProgressPercent}% نحو الترقية</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800/90 bg-slate-950/70 font-mono">
            <span className="text-[11px] text-slate-500 block mb-0.5">متوسط الإنجاز الإجمالي</span>
            <div className="text-2xl font-extrabold text-white tabular-nums">{overallProgressPercent}%</div>
            <span className="text-[10px] text-slate-500 block mt-0.5">{totalCompletedCount} مسار منجز كلياً</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800/90 bg-slate-950/70 font-mono">
            <span className="text-[11px] text-slate-500 block mb-0.5">الكورسات المسجلة</span>
            <div className="text-2xl font-extrabold text-cyan-400 tabular-nums">
              {formattedCourses.length}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">ملفات Word ومسارات كايا</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800/90 bg-slate-950/70 font-mono">
            <span className="text-[11px] text-slate-500 block mb-0.5">الشارات المفتوحة</span>
            <div className="text-2xl font-extrabold text-amber-400 tabular-nums">
              {unlockedBadgesCount} / {badges.length}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">أوسمة تخصصية محققة</span>
          </div>
        </div>

        {/* 5. NEXT ACTIONABLE TASK MILESTONE (المهمة التالية المقترحة) */}
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                <span>المهمة التالية المقترحة (NEXT ACTIONABLE TASK)</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">+50 إلى +200 XP</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {completedLessons.length < 2
                  ? 'الدرس الأول: بنية حزمة TCP/IP وفحص حركة البيانات عبر tcpdump'
                  : completedLessons.length < 5
                  ? 'مختبر كسر وتحصين حقن الاستعلامات SQLi واستعادة الراية'
                  : 'مشروع التخرج: تصميم وهندسة بنية شبكية دفاعية لشركة مالية'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {completedLessons.length < 2
                  ? 'تعلم أسس مصافحة TCP الثلاثية وكشف هجمات SYN Flood وطبق فحص الحزم العملي لرفع رصيدك.'
                  : completedLessons.length < 5
                  ? 'ادخل إلى المختبر الآمن، نفذ تجاوز تسجيل الدخول، واستخرج العلم السري وطبق الاستعلامات المجهزة.'
                  : 'أكمل صياغة التقرير الهندسي وخطة المعالجة لاعتماد شهادة المسار التخصصية.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {onExploreCourses && (
              <button
                onClick={onExploreCourses}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-cyan-500/10"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>متابعة المهمة الآن</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ENROLLED COURSES WITH COMPLETION STATUS */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <span>الكورسات المسجلة وحالة الإنجاز (Enrolled Courses)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              قائمة الكورسات والوثائق المفتوحة لحسابك مع نسب الإتمام وإمكانية المتابعة الفورية.
            </p>
          </div>

          {/* Sub Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              جميع الكورسات ({formattedCourses.length})
            </button>
            <button
              onClick={() => setActiveSubTab('word')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'word'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ملفات Word ({enrolledWordCourses.length})
            </button>
            <button
              onClick={() => setActiveSubTab('academy')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'academy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              مسارات KAyA LAB ({enrolledAcademyCourses.length})
            </button>
            <button
              onClick={() => setActiveSubTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              المكتملة ({totalCompletedCount})
            </button>
          </div>
        </div>

        {/* Search input for enrolled courses */}
        <div className="relative max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الكورسات المسجلة..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Enrolled Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => {
            const isWord = course.type === 'word';

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top line meta */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isWord
                          ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                          : 'bg-cyan-950 border border-cyan-500/30 text-cyan-400'
                      }`}>
                        {isWord ? 'وثيقة .docx' : 'مسار تدريبي'}
                      </span>
                      <span className="text-slate-500">{course.level}</span>
                    </div>

                    {/* Completion Status Badge */}
                    {course.isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>مكتمل 100%</span>
                      </span>
                    ) : course.progressPercent > 0 ? (
                      <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                        قيد الدراسة ({course.progressPercent}%)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        لم يبدأ بعد
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Progress Bar & Units */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">
                        {isWord ? 'فصول الوثيقة المقروءة:' : 'الدروس المنجزة:'} {course.completedUnits} من {course.totalUnits}
                      </span>
                      <span className="text-emerald-400 font-bold tabular-nums">
                        {course.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          course.isCompleted
                            ? 'bg-emerald-400'
                            : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        }`}
                        style={{ width: `${Math.max(4, course.progressPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {/* For Academy Courses: Certificate button if completed */}
                  {!isWord && course.rawAcademyCourse && course.isCompleted && (
                    <button
                      onClick={() => onGenerateCertificate(course.rawAcademyCourse!)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-400/20 transition-colors cursor-pointer"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>الشهادة</span>
                    </button>
                  )}

                  {isWord && course.rawWordCourse ? (
                    <button
                      onClick={() => onOpenWordCourse(course.rawWordCourse!)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm shadow-emerald-500/10"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>فتح وقراءة مستند Word</span>
                    </button>
                  ) : course.rawAcademyCourse ? (
                    <button
                      onClick={() => onOpenAcademyCourse(course.rawAcademyCourse!)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition-colors cursor-pointer border border-slate-700/60"
                    >
                      <Play className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{course.progressPercent > 0 ? 'متابعة المحاضرات والدروس' : 'بدء دراسة المسار'}</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/30 space-y-2">
            <p className="text-sm text-slate-400">لا توجد كورسات مطابقة لمعايير البحث الحالية.</p>
            <button
              onClick={() => {
                setActiveSubTab('all');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-400 hover:underline cursor-pointer font-semibold"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. EARNED XP BADGES & ACHIEVEMENTS */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>شارات وأوسمة الإنجاز السيبراني (Earned XP Badges)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              كل وسام يوثق كفاءة سيبرانية تم اختبارها في المختبرات والدروس التطبيقية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              {unlockedBadgesCount} مفتوحة من أصل {badges.length}
            </span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  badge.isUnlocked
                    ? 'border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900/80 to-emerald-950/20 shadow-lg shadow-emerald-500/5'
                    : 'border-slate-800/80 bg-slate-900/20 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                        badge.isUnlocked
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-inner'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <Award className="h-5 w-5" />
                    </div>

                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        badge.isUnlocked
                          ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-950 border border-slate-800 text-slate-500'
                      }`}
                    >
                      {badge.isUnlocked ? 'محققة ✓' : `${badge.xpRequirement} XP`}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-sm font-bold ${badge.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {badge.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 block mb-1" dir="ltr">
                      {badge.titleEn}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/60 text-[11px] font-mono flex items-center justify-between">
                  {badge.isUnlocked ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{badge.unlockedAt || '2026-10-14'}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      متبقي {Math.max(0, badge.xpRequirement - xpPoints)} XP
                    </span>
                  )}
                  <span className="text-[10px] text-slate-600 uppercase">{badge.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. PRACTICAL LABS & CERTIFICATION SUMMARY */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        {/* Lab Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>مختبرات الدفاع السيبراني المحاكية (KAyA LABs)</span>
            </h3>
            {onExploreLabs && (
              <button
                onClick={onExploreLabs}
                className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                فتح منصة المختبرات ←
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: 'SQL Injection Lab (OWASP Top 10 A03)',
                status: 'مكتمل بنجاح',
                xp: '+150 XP',
                date: '2026-10-14',
                color: 'text-emerald-400',
              },
              {
                title: 'Network Forensics & Wireshark PCAP Stream',
                status: 'مكتمل بنجاح',
                xp: '+180 XP',
                date: '2026-10-14',
                color: 'text-emerald-400',
              },
              {
                title: 'AI & Prompt Injection Defense (OWASP LLM)',
                status: 'قيد المحاكاة والتنفيذ',
                xp: '+175 XP',
                date: '2026-10-14',
                color: 'text-amber-400',
              },
            ].map((lab, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-200 block">{lab.title}</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {lab.date} · محاكاة تفاعلية في المتصفح
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono shrink-0">
                  <span className={`${lab.color} font-bold tabular-nums`}>{lab.xp}</span>
                  <span className="text-slate-400 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {lab.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Ready */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span>الشهادة المعتمدة الرقمية (Verified Cyber Certificate)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              شهادة رسمية صادرة وموثقة برقم ترخيص تسلسلي من إدارة أكاديمية KAyA_SafeSec تشهد باجتيازك مسارات الأمن والدفاع السيبراني بنجاح، متوافقة مع معايير NIST وMITRE ATT&CK.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">نموذج شهادة التخرج المعتمدة:</span>
              <span className="text-slate-500">KAyA-CERT-2026</span>
            </div>
            <p className="text-xs text-slate-300">
              شهادة إتمام مسار: <strong className="text-white">{academyCourses[0]?.title || 'أساسيات أمن الشبكات'}</strong>
            </p>
            <button
              onClick={() => onGenerateCertificate(academyCourses[0])}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-amber-500/10"
            >
              <Award className="h-4 w-4" />
              <span>معاينة وتوليد الشهادة الرسمية الموقعة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
