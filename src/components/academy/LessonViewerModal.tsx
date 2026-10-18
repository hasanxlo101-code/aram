import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, HelpCircle, Copy, Check, Clock, Award, ChevronLeft, ArrowRight } from 'lucide-react';
import { TrackLesson, ProfessionalTrack } from '../../types/professionalTracks';

interface LessonViewerModalProps {
  track: ProfessionalTrack | null;
  lesson: TrackLesson | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson?: (lesson: TrackLesson) => void;
  onLaunchLab?: (labId: string) => void;
  isCompleted?: boolean;
  onToggleComplete?: (lessonKey: string) => void;
  onOpenAiMentor?: (context?: { title: string; topic: string }) => void;
}

export const LessonViewerModal: React.FC<LessonViewerModalProps> = ({
  track,
  lesson,
  isOpen,
  onClose,
  onSelectLesson,
  onLaunchLab,
  isCompleted = false,
  onToggleComplete,
  onOpenAiMentor,
}) => {
  if (!isOpen || !lesson) return null;

  const trackTitle = track ? track.title : 'المسار التخصصي';
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(isCompleted);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
  };

  const handleMarkComplete = () => {
    if (!hasCompleted) {
      setHasCompleted(true);
      if (onToggleComplete) {
        onToggleComplete(lesson.id);
      }
    }
  };

  const isCorrect = lesson.quiz && selectedOption === lesson.quiz.correctAnswerIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070d1e]/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-cyan-400 tracking-wide">{trackTitle}</span>
              <h2 className="text-lg font-bold text-white line-clamp-1">{lesson.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lesson.durationMinutes} دقيقة</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
          {/* Summary Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/20 text-cyan-100 text-sm leading-relaxed">
            <p className="font-medium">{lesson.summary}</p>
          </div>

          {/* Lesson Content Sections */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              الشرح والتحليل الفني
            </h3>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              {lesson.content.map((paragraph, idx) => (
                <p key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Practical Code Examples */}
          {lesson.codeExamples && lesson.codeExamples.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                التطبيق العملي والأوامر التشغيلية
              </h3>
              {lesson.codeExamples.map((ex, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-[#070d1e] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs">
                    <span className="font-medium text-slate-300">{ex.title}</span>
                    <button
                      onClick={() => handleCopyCode(ex.code, idx)}
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition"
                    >
                      {copiedCodeIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الشيفرة</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre 
                    className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed select-all" 
                    dir="ltr"
                  >
                    <code>{ex.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Key Takeaways */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              النقاط الجوهرية للدرس (Key Takeaways)
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 pr-2">
              {lesson.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Quiz */}
          {lesson.quiz && (
            <div className="p-5 rounded-xl bg-[#091124] border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  اختبار المعرفة الفوري
                </h4>
                <span className="text-xs text-cyan-400 font-mono">+25 XP</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">{lesson.quiz.question}</p>

              <div className="space-y-2.5">
                {lesson.quiz.options.map((option, idx) => {
                  let optionClass = "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-850";
                  if (quizSubmitted) {
                    if (idx === lesson.quiz?.correctAnswerIndex) {
                      optionClass = "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold";
                    } else if (selectedOption === idx) {
                      optionClass = "border-rose-500 bg-rose-950/40 text-rose-300";
                    } else {
                      optionClass = "border-slate-850 bg-slate-950/50 text-slate-500 opacity-60";
                    }
                  } else if (selectedOption === idx) {
                    optionClass = "border-cyan-500 bg-cyan-950/40 text-cyan-200";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedOption(idx)}
                      disabled={quizSubmitted}
                      className={`w-full text-right p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${optionClass}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && idx === lesson.quiz?.correctAnswerIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedOption === null}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold text-xs transition"
                >
                  تأكيد الإجابة
                </button>
              ) : (
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'}`}>
                  <p className="font-bold mb-1">{isCorrect ? ' إجابة صحيحة ومتقنة!' : '⚠️ إجابة غير دقيقة'}</p>
                  <p className="text-slate-300">{lesson.quiz.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#070d1e] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {hasCompleted ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                تم إكمال هذا الدرس بنجاح
              </span>
            ) : (
              <span>أكمل القراءة والاختبار لاعتماد التقدم والحصول على +50 XP</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              إغلاق
            </button>
            <button
              onClick={handleMarkComplete}
              disabled={hasCompleted}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                hasCompleted
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{hasCompleted ? 'مكتمل' : 'إتمام الدرس (+50 XP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
