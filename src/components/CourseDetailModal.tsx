import React, { useState } from 'react';
import { X, Clock, BookOpen, Award, CheckCircle2, Terminal, ArrowRight, ShieldCheck, Play } from 'lucide-react';
import { Course } from '../types/academy';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchLab: (labId?: string) => void;
  onGenerateCertificate: (course: Course) => void;
  completedLessons: string[];
  onToggleLessonComplete: (lessonKey: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onLaunchLab,
  onGenerateCertificate,
  completedLessons,
  onToggleLessonComplete,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 font-bold">{course.badge}</span>
              <span aria-hidden="true">·</span>
              <span>{course.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">+{course.xpReward} XP</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {course.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {course.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer self-start"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 3 Metrics Badge Row */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="text-slate-500 text-[11px] mb-0.5">مدة المسار</div>
            <div className="text-base font-bold text-white tabular-nums">{course.hours} ساعة محتوى</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="text-slate-500 text-[11px] mb-0.5">الدروس العملية</div>
            <div className="text-base font-bold text-white tabular-nums">{course.lessonsCount} درسًا</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="text-slate-500 text-[11px] mb-0.5">المشروع النهائي</div>
            <div className="text-base font-bold text-emerald-400">مشروع تطبيقي</div>
          </div>
        </div>

        {/* Section 01: ستخرج وأنت قادر على */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <span className="font-bold">01 / ستخرج وأنت قادر على</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{course.outcomesIntro}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {course.outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 02: خريطة المنهج (12 Lessons) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <span className="font-bold">02 / خريطة المنهج</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{course.syllabusIntro}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              12 محطة تدريبية متدرجة
            </span>
          </div>

          <div className="space-y-2">
            {course.syllabus.map((lesson) => {
              const lessonKey = `${course.id}-${lesson.number}`;
              const isDone = completedLessons.includes(lessonKey);
              return (
                <div
                  key={lesson.number}
                  className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                    isDone
                      ? 'border-emerald-500/30 bg-emerald-950/20'
                      : 'border-slate-800/90 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 shrink-0 pt-0.5">
                      {lesson.number}
                    </span>
                    <div>
                      <h4 className={`text-xs font-bold ${isDone ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {lesson.subtitle}
                      </p>
                      {lesson.description && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleLessonComplete(lessonKey)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`h-3 w-3 ${isDone ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{isDone ? 'مكتمل' : 'وضع علامة إنجاز'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 03: قبل أن تبدأ */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-2 text-xs">
          <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            03 / قبل أن تبدأ المتطلبات المسبقة:
          </div>
          <div className="space-y-1 text-slate-400">
            {course.prerequisites.map((req, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-emerald-400 select-none">·</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bottom Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono">
            {course.enrolledStudents} طالب يتدربون في هذا المسار حالياً
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onGenerateCertificate(course)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Award className="h-4 w-4 text-amber-400" />
              <span>شهادة الإتمام</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onLaunchLab(course.id);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>دخول المختبر التفاعلي</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
