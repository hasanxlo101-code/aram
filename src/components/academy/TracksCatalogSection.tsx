import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Globe, 
  Search, 
  Radar, 
  Cpu, 
  Clock, 
  Award, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  CheckCircle2, 
  ExternalLink,
  Target,
  Sparkles
} from 'lucide-react';
import { PROFESSIONAL_TRACKS } from '../../data/professionalTracksData';
import { ProfessionalTrack, TrackLesson } from '../../types/professionalTracks';

interface TracksCatalogSectionProps {
  onSelectLesson: (lesson: TrackLesson, trackTitle: string) => void;
  onLaunchCapstone: (track: ProfessionalTrack) => void;
  completedLessonIds: string[];
}

export const TracksCatalogSection: React.FC<TracksCatalogSectionProps> = ({
  onSelectLesson,
  onLaunchCapstone,
  completedLessonIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(PROFESSIONAL_TRACKS[0].id);

  const getTrackIcon = (icon: string) => {
    switch (icon) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'Terminal': return <Terminal className="w-6 h-6 text-cyan-400" />;
      case 'Globe': return <Globe className="w-6 h-6 text-blue-400" />;
      case 'Search': return <Search className="w-6 h-6 text-amber-400" />;
      case 'Radar': return <Radar className="w-6 h-6 text-purple-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-teal-400" />;
      default: return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
    }
  };

  const filteredTracks = PROFESSIONAL_TRACKS.filter((track) => {
    if (selectedCategory !== 'all' && track.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && track.level !== selectedLevel) return false;
    return true;
  });

  return (
    <section className="space-y-8" dir="rtl">
      {/* Section Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0c1633] via-[#091124] to-[#070d1e] border border-cyan-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المسارات التخصصية المهنية المتكاملة · 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            مسارات تأهيل الكفاءات السيبرانية والأمنية
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            مناهج عملية شاملة وموجهة هندسياً تنقلك من المفاهيم الأساسية إلى احتراف عمليات الدفاع الأزرق، واختبار التطبيقات، والتحقيقات الجنائية، واستخبارات المصادر المفتوحة، وأمن الذكاء الاصطناعي.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              كافة المجالات ({PROFESSIONAL_TRACKS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('foundations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === 'foundations'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الأساسيات
            </button>
            <button
              onClick={() => setSelectedCategory('soc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === 'soc'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الدفاع و SOC
            </button>
            <button
              onClick={() => setSelectedCategory('web')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === 'web'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              أمن الويب
            </button>
            <button
              onClick={() => setSelectedCategory('dfir')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === 'dfir'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              التحقيقات DFIR
            </button>
            <button
              onClick={() => setSelectedCategory('osint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === 'osint'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الاستخبارات OSINT
            </button>
            <button
              onClick={() => setSelectedCategory('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === 'ai'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              أمن الذكاء الاصطناعي
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 mr-auto">
            <span className="text-xs text-slate-400 px-2">المستوى:</span>
            {['all', 'مبتدئ', 'متوسط', 'متقدم', 'خبير'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs transition ${
                  selectedLevel === lvl
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'all' ? 'الكل' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tracks Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTracks.map((track) => {
          const isExpanded = expandedTrackId === track.id;
          const completedInTrack = track.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
          const progressPercent = Math.round((completedInTrack / track.lessons.length) * 100);

          return (
            <div
              key={track.id}
              className={`rounded-2xl border transition-all duration-300 bg-[#0b1329] overflow-hidden ${
                isExpanded
                  ? 'border-cyan-500/50 shadow-xl shadow-cyan-950/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Track Card Main Header */}
              <div className="p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-850/60">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 shrink-0 shadow-inner">
                    {getTrackIcon(track.icon)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                        {track.level}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {track.durationWeeks} أسابيع
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 tracking-wider">
                        {track.titleEn}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white hover:text-cyan-400 transition">
                      {track.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {track.description}
                    </p>
                  </div>
                </div>

                {/* Progress & Expansion Toggle */}
                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end text-xs">
                      <span className="text-slate-400">الإنجاز:</span>
                      <span className="font-bold text-cyan-400">{progressPercent}%</span>
                    </div>
                    <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedTrackId(isExpanded ? null : track.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    <span>{isExpanded ? 'إخفاء الخطة' : 'عرض المحتوى والدروس'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Syllabus & Details */}
              {isExpanded && (
                <div className="p-6 sm:p-7 bg-[#080e21] space-y-7 animate-in fade-in-50 duration-200">
                  {/* Two-Column Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Objectives */}
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        أهداف المسار والنتائج التعليمية
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {track.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills & Roles */}
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 mb-2">المهارات المكتسبة</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {track.skillsGained.map((sk, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-cyan-300 text-[11px] font-mono">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 mb-2">الوظائف المستهدفة</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {track.targetRoles.map((role, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[11px]">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lessons Syllabus */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        الدروس النظرية والتطبيقية ({track.lessons.length} وحدات)
                      </h4>
                      <span className="text-xs text-slate-400">انقر على أي درس لبدء الشرح والاختبار</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {track.lessons.map((lesson, idx) => {
                        const isDone = completedLessonIds.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition group"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                isDone 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}>
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-white group-hover:text-cyan-400 transition">
                                  {lesson.title}
                                </h5>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                  <span>{lesson.durationMinutes} دقيقة</span>
                                  {lesson.quiz && <span className="text-amber-400">يحتوي على اختبار فوري</span>}
                                  {lesson.codeExamples && <span className="text-emerald-400">أمثلة شيفرات عملية</span>}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => onSelectLesson(lesson, track.title)}
                              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                                isDone
                                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950'
                              }`}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{isDone ? 'مراجعة الدرس' : 'بدء الدرس'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Capstone Project Preview Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">المشروع النهائي للتخرج</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {track.capstoneProject.difficulty} · {track.capstoneProject.estimatedHours} ساعة
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{track.capstoneProject.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-1">{track.capstoneProject.scenario}</p>
                    </div>

                    <button
                      onClick={() => onLaunchCapstone(track)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 text-xs font-bold hover:brightness-110 transition shadow-lg shadow-cyan-500/10 shrink-0"
                    >
                      استعراض متطلبات المشروع
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
