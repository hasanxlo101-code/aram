import React, { useState } from 'react';
import { 
  Award, 
  Clock, 
  FileCheck, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  HelpCircle,
  LogIn,
  Upload
} from 'lucide-react';
import { PROFESSIONAL_TRACKS } from '../../data/professionalTracksData';
import { VisitorUser } from '../../types/wordCourses';

interface FinalProjectsCenterProps {
  user: VisitorUser | null;
  onOpenVisitorLogin: () => void;
  onAwardXp: (xp: number) => void;
  onOpenAiMentor?: (context: { title: string; topic: string }) => void;
}

export const FinalProjectsCenter: React.FC<FinalProjectsCenterProps> = ({
  user,
  onOpenVisitorLogin,
  onAwardXp,
  onOpenAiMentor,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROFESSIONAL_TRACKS[0].capstoneProject.id);
  const [reportsText, setReportsText] = useState<{ [id: string]: string }>({});
  const [submittedProjects, setSubmittedProjects] = useState<{ [id: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'details' | 'rubric' | 'submit'>('details');

  const selectedTrack = PROFESSIONAL_TRACKS.find(t => t.capstoneProject.id === selectedProjectId) || PROFESSIONAL_TRACKS[0];
  const capstone = selectedTrack.capstoneProject;

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportsText[capstone.id]?.trim()) return;

    if (!user) {
      onOpenVisitorLogin();
      return;
    }

    setSubmittedProjects(prev => ({ ...prev, [capstone.id]: true }));
    onAwardXp(200);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0c1633] via-[#091124] to-[#070d1e] border border-cyan-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>المشاريع النهائية والتقارير الهندسية التطبيقية (Capstone Projects)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            مركز مشاريع التخرج وإعداد تقارير الحوادث الواقعية
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            محاكاة دقيقة لمهام الاستشارات والتحقيقات الأمنية. يتطلب كل مسار مهني إعداد تقرير فني شامل وتطبيق الإجراءات الدفاعية لترقية مستوى الطالب في الأكاديمية واكتساب +200 XP.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Projects Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 px-1">المشاريع المتاحة لكل مسار ({PROFESSIONAL_TRACKS.length})</div>
          {PROFESSIONAL_TRACKS.map((t) => {
            const isSelected = t.capstoneProject.id === selectedProjectId;
            const isSubmitted = submittedProjects[t.capstoneProject.id];

            return (
              <button
                key={t.id}
                onClick={() => setSelectedProjectId(t.capstoneProject.id)}
                className={`w-full text-right p-4 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-amber-500/60 bg-amber-950/20 shadow-lg shadow-amber-950/20'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">{t.titleEn}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                    {t.capstoneProject.estimatedHours} س
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{t.capstoneProject.title}</h4>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                  <span className="text-amber-400 font-medium">مستوى: {t.capstoneProject.difficulty}</span>
                  {isSubmitted ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      مكتمل (+200 XP)
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono">+200 XP</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Selected Project Detail View */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-6 shadow-xl">
          {/* Top Bar of Project */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
            <div>
              <span className="text-xs font-semibold text-cyan-400">{selectedTrack.title}</span>
              <h3 className="text-lg font-bold text-white mt-1">{capstone.title}</h3>
            </div>

            {onOpenAiMentor && (
              <button
                onClick={() => onOpenAiMentor({ title: capstone.title, topic: 'مشاريع التخرج والتقارير' })}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>استشارة المدرب الذكي</span>
              </button>
            )}
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'details' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              السيناريو والمتطلبات
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'rubric' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              مصفوفة التقييم والوزن النسبي (Rubric)
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'submit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              رفع ملخص التقرير والاعتماد
            </button>
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-5 text-slate-200">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  سيناريو الحالة الواقعية:
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{capstone.scenario}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    الأهداف التقنية المطلوبة:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {capstone.objectives.map((ob, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                        <span>{ob}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    المخرجات والملفات للتسليم:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {capstone.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Rubrics */}
          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                يتم تقييم التقارير المرفوعة بدقة من قِبل المشرفين وفق المعايير التالية:
              </div>
              <div className="grid grid-cols-1 gap-3">
                {capstone.evaluationRubric.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-white">{r.criterion}</h5>
                      <p className="text-xs text-slate-400">{r.description}</p>
                    </div>
                    <div className="text-lg font-bold text-amber-400 font-mono shrink-0">
                      {r.weight}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Submit */}
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="p-4 rounded-xl bg-[#080d1d] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>ملخص تقرير التدقيق وخطة المعالجة التنفيذية</span>
                  </h4>
                  {submittedProjects[capstone.id] && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تم الاعتماد بنجاح
                    </span>
                  )}
                </div>
                <textarea
                  rows={5}
                  value={reportsText[capstone.id] || ''}
                  onChange={(e) => setReportsText({ ...reportsText, [capstone.id]: e.target.value })}
                  placeholder="اكتب هنا الملخص التنفيذي، أبرز المخاطر المكتشفة، والحلول الفنية المقترحة وفق نموذج KAyA المعتمد..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition"
                  disabled={submittedProjects[capstone.id]}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400">
                  {user ? `مسجل كطالب: ${user.name}` : 'يتطلب تسجيل دخول الطالب لتوثيق السجل'}
                </div>

                <div className="flex items-center gap-2">
                  {!user && (
                    <button
                      type="button"
                      onClick={onOpenVisitorLogin}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>تسجيل دخول لحفظ الإنجاز</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submittedProjects[capstone.id] || !reportsText[capstone.id]?.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 disabled:opacity-40 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittedProjects[capstone.id] ? 'تم التقديم (+200 XP)' : 'تقديم المشروع للاعتماد'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
