import React, { useState } from 'react';
import { Network, ShieldAlert, Fingerprint, Award, Zap, Cpu, Database, Activity, Terminal, Server, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Course } from '../../types/academy';

interface CourseCatalogProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onLaunchLab: (courseId?: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  onSelectCourse,
  onLaunchLab,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'network' | 'offensive' | 'forensics' | 'cert' | 'ai' | 'advanced'>('all');

  const filteredCourses = courses.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.category === selectedFilter;
  });

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Network': return <Network className="h-5 w-5 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="h-5 w-5 text-rose-400" />;
      case 'Fingerprint': return <Fingerprint className="h-5 w-5 text-cyan-400" />;
      case 'Award': return <Award className="h-5 w-5 text-amber-400" />;
      case 'Zap': return <Zap className="h-5 w-5 text-yellow-400" />;
      case 'Cpu': return <Cpu className="h-5 w-5 text-emerald-400" />;
      case 'Database': return <Database className="h-5 w-5 text-indigo-400" />;
      case 'Activity': return <Activity className="h-5 w-5 text-teal-400" />;
      case 'Terminal': return <Terminal className="h-5 w-5 text-purple-400" />;
      case 'Server': return <Server className="h-5 w-5 text-blue-400" />;
      default: return <ShieldAlert className="h-5 w-5 text-emerald-400" />;
    }
  };

  return (
    <div id="courses-section" className="space-y-6">
      {/* Catalog Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>OFFICIAL CURRICULUM</span>
            <span aria-hidden="true">·</span>
            <span>10 PROFESSIONAL TRACKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            المسارات التعليمية والبرامج المهنية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            30 ساعة محتوى تدريبي، 12 درساً تطبيقياً ومختبرات آمنة ومشروع تخرج لكل مسار تعليمي.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {[
            { id: 'all', label: 'كافة المسارات (10)' },
            { id: 'network', label: 'الشبكات' },
            { id: 'offensive', label: 'الاختراق الأخلاقي' },
            { id: 'forensics', label: 'التحقيق الجنائي' },
            { id: 'ai', label: 'أمن الذكاء الاصطناعي' },
            { id: 'advanced', label: 'المسارات المتقدمة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl border border-slate-800/90 bg-slate-900/50 hover:bg-slate-900/80 hover:border-emerald-500/40 transition-all p-5 sm:p-6 flex flex-col justify-between group shadow-sm"
          >
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/30 transition-colors">
                  {getCourseIcon(course.iconName)}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                    {course.badge}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{course.difficulty}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {course.subtitle}
                </p>
              </div>

              {/* Course Meta */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-center font-mono text-xs text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">المحتوى</span>
                  <span className="text-slate-200 font-bold tabular-nums">{course.hours} ساعة</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">الدروس</span>
                  <span className="text-slate-200 font-bold tabular-nums">{course.lessonsCount} درساً</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">المشروع</span>
                  <span className="text-emerald-400 font-bold">تطبيقي</span>
                </div>
              </div>

              {/* Outcomes Highlight */}
              <div className="space-y-1 text-xs text-slate-400">
                <span className="text-[11px] font-mono text-slate-500 block mb-1">مخرجات التعلم:</span>
                {course.outcomes.slice(0, 2).map((oc, i) => (
                  <div key={i} className="flex items-start gap-1.5 truncate">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="truncate">{oc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectCourse(course)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <span>خريطة المنهج (12 درساً)</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onLaunchLab(course.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                المختبر
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
