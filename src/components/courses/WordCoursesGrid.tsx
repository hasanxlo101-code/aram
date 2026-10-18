import React, { useState } from 'react';
import {
  FileText,
  Lock,
  Unlock,
  Download,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  DollarSign,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { WordCourse, CourseLevel } from '../../types/wordCourses';

interface WordCoursesGridProps {
  courses: WordCourse[];
  onOpenViewer: (course: WordCourse) => void;
  onOpenPaymentNotice: (course: WordCourse) => void;
}

export const WordCoursesGrid: React.FC<WordCoursesGridProps> = ({
  courses,
  onOpenViewer,
  onOpenPaymentNotice,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | CourseLevel>('all');

  const filteredCourses = courses.filter((c) => {
    if (selectedLevel === 'all') return true;
    return c.level === selectedLevel;
  });

  return (
    <div id="word-courses-section" className="space-y-6">
      {/* Header and Level Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <FileText className="h-4 w-4" />
            <span>15 CYBERSECURITY WORD DOCUMENT COURSES (.DOCX)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مكتبة وثائق وكورسات Word التفاعلية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            15 مساراً تخصصياً موثقاً على هيئة ملفات Word تفاعلية (.docx) مقسمة لثلاثة مستويات: مبتدئ (مجاني عام ومفتوح للتصفح بالكامل)، متوسط وخبير (مدفوع مع إشعار أمني لبوابة الدفع).
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedLevel === 'all'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            كافة المستويات (15)
          </button>
          <button
            onClick={() => setSelectedLevel('beginner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedLevel === 'beginner'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="h-3 w-3 text-emerald-400" />
            <span>مبتدئ (5 مجانية بالكامل)</span>
          </button>
          <button
            onClick={() => setSelectedLevel('intermediate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedLevel === 'intermediate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="h-3 w-3 text-amber-400" />
            <span>متوسط (5 مدفوعة)</span>
          </button>
          <button
            onClick={() => setSelectedLevel('expert')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedLevel === 'expert'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="h-3 w-3 text-purple-400" />
            <span>خبير (5 مدفوعة)</span>
          </button>
        </div>
      </div>

      {/* Grid of 15 Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isBeginner = course.level === 'beginner';

          return (
            <div
              key={course.id}
              className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all group shadow-sm ${
                isBeginner
                  ? 'border-emerald-500/30 bg-slate-900/60 hover:bg-slate-900/90 hover:border-emerald-500/50'
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                {/* Level Badge and Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg border ${
                      isBeginner
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : course.level === 'intermediate'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                    }`}>
                      <FileText className="h-4 w-4" />
                    </div>

                    <span className={`text-xs font-mono font-bold ${
                      isBeginner
                        ? 'text-emerald-400'
                        : course.level === 'intermediate'
                          ? 'text-amber-400'
                          : 'text-purple-400'
                    }`}>
                      {course.levelLabelAr.split(' ')[0]}
                    </span>
                  </div>

                  {/* Free vs Price Tag */}
                  <div>
                    {isBeginner ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                        <Unlock className="h-3 w-3" />
                        <span>عام ومجاني 100%</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300 text-xs font-mono font-bold">
                        <Lock className="h-3 w-3" />
                        <span>${course.priceUsd} USD</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {course.subtitle}
                  </p>
                </div>

                {/* Word Document Meta Badge */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between text-slate-300 truncate" dir="ltr">
                    <span className="truncate">{course.docMeta.fileName}</span>
                    <span className="text-emerald-400 shrink-0 font-bold ms-2">DOCX</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-800/80">
                    <span>{course.docMeta.pages} صفحة A4</span>
                    <span>{course.hours} ساعة تدريب</span>
                    <span>{course.docMeta.fileSize}</span>
                  </div>
                </div>

                {/* Notice for paid courses */}
                {!isBeginner && (
                  <div className="text-[11px] text-amber-400/90 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20 leading-relaxed">
                    ملاحظة: بوابة الدفع قيد التطوير لضمان أعلى معايير الأمان المالي.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {isBeginner ? (
                  <button
                    onClick={() => onOpenViewer(course)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>تصفح وتحميل ملف Word (.docx)</span>
                  </button>
                ) : (
                  <div className="w-full flex items-center gap-2">
                    <button
                      onClick={() => onOpenPaymentNotice(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>شراء الكورس (${course.priceUsd})</span>
                    </button>
                    <button
                      onClick={() => onOpenViewer(course)}
                      className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                      title="معاينة فهرس ومقدمة المستند مجاناً"
                    >
                      معاينة
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
