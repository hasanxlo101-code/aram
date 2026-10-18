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
  ExternalLink
} from 'lucide-react';
import { PROFESSIONAL_TRACKS } from '../../data/professionalTracksData';
import { CapstoneProject } from '../../types/professionalTracks';

interface CapstoneProjectsSectionProps {
  onStartCapstone?: (capstone: CapstoneProject) => void;
}

export const CapstoneProjectsSection: React.FC<CapstoneProjectsSectionProps> = ({
  onStartCapstone,
}) => {
  const [selectedCapstoneId, setSelectedCapstoneId] = useState<string | null>(PROFESSIONAL_TRACKS[0].capstoneProject.id);
  const [submissionScenario, setSubmissionScenario] = useState<{ [id: string]: string }>({});
  const [submittedStatus, setSubmittedStatus] = useState<{ [id: string]: boolean }>({});

  const capstones = PROFESSIONAL_TRACKS.map(t => ({
    ...t.capstoneProject,
    trackTitle: t.title,
    trackCategory: t.category
  }));

  const handleSimulateSubmit = (capstoneId: string) => {
    if (!submissionScenario[capstoneId]?.trim()) return;
    setSubmittedStatus(prev => ({ ...prev, [capstoneId]: true }));
  };

  return (
    <section className="space-y-8" dir="rtl">
      {/* Section Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0c1633] via-[#091124] to-[#070d1e] border border-cyan-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>المشاريع النهائية ورسائل التخرج التطبيقية (Capstone Projects)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            مشاريع التخرج والتقارير الهندسية الواقعية
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            محاكاة دقيقة لمهام الاستشارات والتدقيق الأمني المؤسسي. يتطلب كل مسار إعداد تقرير فني وتنفيذي شامل يتم تقييمه وفق مصفوفة معيارية (Rubrics) لترقية مؤهل الطالب.
          </p>
        </div>
      </div>

      {/* Capstone Cards */}
      <div className="grid grid-cols-1 gap-6">
        {capstones.map((cap) => {
          const isSelected = selectedCapstoneId === cap.id;
          const isSubmitted = submittedStatus[cap.id];

          return (
            <div
              key={cap.id}
              className={`rounded-2xl border transition-all duration-300 bg-[#0b1329] overflow-hidden ${
                isSelected ? 'border-amber-500/40 shadow-xl shadow-amber-950/20' : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-850">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                      {cap.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {cap.estimatedHours} ساعة تدريبية
                    </span>
                    <span className="text-cyan-400 font-semibold">{cap.trackTitle}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{cap.title}</h3>
                </div>

                <button
                  onClick={() => setSelectedCapstoneId(isSelected ? null : cap.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0"
                >
                  <span>{isSelected ? 'إغلاق المعايير' : 'استعراض السيناريو ومصفوفة التقييم'}</span>
                  {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded Details */}
              {isSelected && (
                <div className="p-6 bg-[#080e21] space-y-6">
                  {/* Scenario */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      السيناريو الواقعي للمشروع
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{cap.scenario}</p>
                  </div>

                  {/* Two Columns: Objectives & Deliverables */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        الأهداف والمتطلبات التقنية
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {cap.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-cyan-400" />
                        المخرجات والملفات المطلوبة للتسليم
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {cap.deliverables.map((del, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Rubric Matrix */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      مصفوفة التقييم الأكاديمي والوزن النسبي (Evaluation Rubric):
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {cap.evaluationRubric.map((rub, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-white">{rub.criterion}</span>
                            <span className="text-amber-400 font-mono">{rub.weight}%</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{rub.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Box */}
                  <div className="p-5 rounded-2xl bg-[#0a1226] border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        رفع الملخص التنفيذي للمشروع للاعتماد
                      </h4>
                      {isSubmitted && (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          تم إرسال مسودة التقرير للتدقيق
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={submissionScenario[cap.id] || ''}
                      onChange={(e) => setSubmissionScenario({ ...submissionScenario, [cap.id]: e.target.value })}
                      placeholder="اكتب هنا ملخص الإجراءات الهندسية، مصفوفة التوصيات، أو روابط المستودع المشفر..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition"
                      disabled={isSubmitted}
                    />
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[11px] text-slate-400">
                        التقييم يمر عبر لجنة الأكاديمية بإشراف م. حسن نبيل خلو
                      </span>
                      <button
                        onClick={() => handleSimulateSubmit(cap.id)}
                        disabled={isSubmitted || !submissionScenario[cap.id]?.trim()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-40 transition flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitted ? 'تم التسليم بنجاح' : 'إرسال المشروع للمراجعة'}</span>
                      </button>
                    </div>
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
