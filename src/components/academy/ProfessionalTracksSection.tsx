import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Database,
  Fingerprint,
  Search,
  Cpu,
  BookOpen,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  FolderGit2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { PROFESSIONAL_TRACKS } from '../../data/professionalTracksData';
import { ProfessionalTrack, TrackLesson } from '../../types/professionalTracks';

interface ProfessionalTracksSectionProps {
  onSelectLesson: (track: ProfessionalTrack, lesson: TrackLesson) => void;
  onLaunchCapstone: (trackId: string) => void;
  completedLessons: string[];
}

export const ProfessionalTracksSection: React.FC<ProfessionalTracksSectionProps> = ({
  onSelectLesson,
  onLaunchCapstone,
  completedLessons,
}) => {
  const [expandedTrackId, setExpandedTrackId] = useState<string>(PROFESSIONAL_TRACKS[0].id);

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="h-5 w-5 text-cyan-400" />;
      case 'Activity': return <Activity className="h-5 w-5 text-teal-400" />;
      case 'Database': return <Database className="h-5 w-5 text-indigo-400" />;
      case 'Fingerprint': return <Fingerprint className="h-5 w-5 text-emerald-400" />;
      case 'Search': return <Search className="h-5 w-5 text-amber-400" />;
      case 'Cpu': return <Cpu className="h-5 w-5 text-cyan-400" />;
      default: return <Shield className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <div id="professional-tracks" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>OFFICIAL KAYA ACCREDITED CURRICULUM</span>
            <span>·</span>
            <span>06 FLAGSHIP TRACKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            المسارات المهنية الستة للأمن والتحليل السيبراني
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            مناهج عملية مصممة للانتقال بالمتعلم من الأساسيات الهندسية إلى مستوى الاحتراف. كل مسار يضم أهدافاً قابلة للقياس، دروساً معمقة، اختبارات استيعاب، وتمارين عملية، ومشروع تخرج واقعي.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 self-start md:self-auto">
          <span className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950">
            محدث لعام 2026/2027
          </span>
        </div>
      </div>

      {/* Tracks Accordion / List */}
      <div className="space-y-4">
        {PROFESSIONAL_TRACKS.map((track) => {
          const isExpanded = expandedTrackId === track.id;
          const trackCompletedLessonsCount = track.lessons.filter((l) =>
            completedLessons.includes(l.id)
          ).length;
          const progressPercent = Math.round(
            (trackCompletedLessonsCount / track.lessons.length) * 100
          );

          return (
            <div
              key={track.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-cyan-500/40 bg-slate-900/90 shadow-xl shadow-cyan-500/5'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              {/* Card Header (Clickable) */}
              <div
                onClick={() => setExpandedTrackId(isExpanded ? '' : track.id)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                    {getTrackIcon(track.iconName || track.icon)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                        {track.badge || 'KAyA TRACK'}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">{track.level}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-cyan-400 tabular-nums">{track.hours || track.durationWeeks * 10} ساعة</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-emerald-400 font-bold">+{track.xpReward || 300} XP</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {track.title}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">{track.titleEn}</div>
                    <p className="text-xs text-slate-300 max-w-2xl pt-0.5 leading-relaxed">
                      {track.summary || track.description}
                    </p>
                  </div>
                </div>

                {/* Progress & Toggle Chevron */}
                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <div className="text-start sm:text-end">
                    <div className="text-xs font-mono text-slate-400">
                      {trackCompletedLessonsCount} من {track.lessons.length} دروس
                    </div>
                    <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-6 animate-in fade-in duration-200">
                  {/* Learning Outcomes & Prerequisites */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                      <div className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>مخرجات التعلم القابلة للقياس:</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {(track.learningOutcomes || track.objectives).map((out, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">·</span>
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                      <div className="font-mono text-amber-400 font-bold flex items-center gap-1.5">
                        <Lock className="h-4 w-4" />
                        <span>المتطلبات المسبقة للمسار:</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {track.prerequisites.map((pre, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">·</span>
                            <span>{pre}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Lessons List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400 uppercase tracking-wider font-bold">
                        خريطة الدروس العملية المتاحة (انقر لدراسة أي درس):
                      </span>
                      <span className="text-slate-500">يتضمن كل درس شرحاً وأوامر واختبار استيعاب</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {track.lessons.map((lesson, idx) => {
                        const isDone = completedLessons.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onSelectLesson(track, lesson)}
                            className={`p-4 rounded-xl border text-start transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isDone
                                ? 'border-emerald-500/30 bg-emerald-950/15 text-slate-200'
                                : 'border-slate-800 bg-slate-950/80 hover:bg-slate-950 hover:border-cyan-500/40 text-slate-300'
                            }`}
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="font-bold text-cyan-400">الدرس {lesson.number || idx + 1}</span>
                                <span className="text-slate-600">·</span>
                                <span className="text-slate-400">{lesson.durationMinutes} دقيقة</span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                                {lesson.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {lesson.subtitle || lesson.summary}
                              </p>
                            </div>

                            <div className="shrink-0 self-center">
                              {isDone ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Capstone Bar */}
                  <div className="p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <FolderGit2 className="h-5 w-5 text-cyan-400 shrink-0" />
                      <div>
                        <div className="text-xs font-mono text-cyan-300 font-bold uppercase">
                          المشروع النهائي للمسار
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white">
                          {track.capstone?.title || track.capstoneProject?.title}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onLaunchCapstone(track.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <span>الانتقال لمشروع التخرج</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
