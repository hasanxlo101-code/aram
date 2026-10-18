import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, ShieldAlert, Check, RefreshCw, FileText, Upload, LogOut, CheckCircle2 } from 'lucide-react';
import { Course } from '../../types/academy';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onUpdateCourses: (updated: Course[]) => void;
  onLogout: () => void;
  adminEmail: string;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  courses,
  onUpdateCourses,
  onLogout,
  adminEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'files' | 'new-course' | 'audit'>('courses');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // New course state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<Course['category']>('network');
  const [newHours, setNewHours] = useState(30);
  const [newOutcomes, setNewOutcomes] = useState('إتقان المبادئ الأساسية\nتطبيق المختبر العملي\nإعداد التقرير النهائي');

  // Files state
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: '1', name: 'incident_capture_2026.pcap', size: '4.2 MB', category: 'Network Forensics Lab', date: '2026-10-14' },
    { id: '2', name: 'kaya_sqli_defense_worksheet.pdf', size: '1.8 MB', category: 'SQL Injection Lab', date: '2026-10-12' },
    { id: '3', name: 'ad_kerberos_attack_matrix.json', size: '540 KB', category: 'Active Directory Lab', date: '2026-10-10' },
  ]);
  const [newFileName, setNewFileName] = useState('');

  if (!isOpen) return null;

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المسار التعليمي نهائياً من الأكاديمية؟')) {
      const updated = courses.filter((c) => c.id !== courseId);
      onUpdateCourses(updated);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const updated = courses.map((c) => (c.id === editingCourse.id ? editingCourse : c));
    onUpdateCourses(updated);
    setEditingCourse(null);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const outcomesList = newOutcomes.split('\n').filter((l) => l.trim().length > 0);

    const created: Course = {
      id: `course-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'مسار تعليمي متقدم تم تصميمه بواسطة إدارة كايا للأمن.',
      category: newCategory,
      hours: newHours,
      lessonsCount: 12,
      badge: 'KAyA LAB',
      difficulty: 'متوسط',
      xpReward: 350,
      enrolledStudents: 1,
      iconName: 'ShieldAlert',
      outcomesIntro: 'مخرجات تعلم تُقاس.',
      outcomes: outcomesList.length ? outcomesList : ['إتقان المخرجات العملية', 'توثيق نتائج المختبر'],
      syllabusIntro: 'منهج متدرج يجمع بين النظرية والمختبر العملي.',
      syllabus: Array.from({ length: 12 }, (_, i) => ({
        number: String(i + 1).padStart(2, '0'),
        title: `الدرس ${i + 1}: ${newTitle}`,
        subtitle: 'مشروع يثبت جاهزيتك',
      })),
      prerequisites: ['أساسيات الشبكات وأنظمة التشغيل', 'الالتزام ببيئة المختبر وعدم الاختبار دون تصريح'],
    };

    onUpdateCourses([created, ...courses]);
    setNewTitle('');
    setNewSubtitle('');
    setActiveTab('courses');
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    setUploadedFiles([
      ...uploadedFiles,
      {
        id: String(Date.now()),
        name: newFileName.trim(),
        size: '2.5 MB',
        category: 'KAyA Interactive Labs',
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewFileName('');
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== fileId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>AUTHENTICATED OWNER: {adminEmail}</span>
            </div>
            <h2 className="text-xl font-bold text-white">لوحة تحكم مالك وأدمن أكاديمية KAyA_SafeSec</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>تسجيل خروج</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('courses');
              setEditingCourse(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            إدارة الدورات ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('new-course')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'new-course'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + إضافة دورة جديدة
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'files'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المرفقات وملفات المختبرات ({uploadedFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            سجلات التدقيق والأمان (Audit Logs)
          </button>
        </div>

        {/* Tab 1: Course List */}
        {activeTab === 'courses' && !editingCourse && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              بصفتك المالك الوحيد، يمكنك تعديل تفاصيل أي مسار أو حذفه بشكل فوري.
            </div>

            <div className="space-y-2.5">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800/90 bg-slate-900/50 hover:border-slate-700 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{course.title}</h4>
                    <p className="text-xs text-slate-400 max-w-2xl truncate">{course.subtitle}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 mt-1">
                      <span>{course.hours} ساعة محتوى</span>
                      <span>·</span>
                      <span>{course.lessonsCount} درساً</span>
                      <span>·</span>
                      <span>{course.enrolledStudents} طالب مسجل</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-950/30 hover:bg-rose-950/70 text-xs text-rose-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Course Form */}
        {editingCourse && (
          <form onSubmit={handleSaveEdit} className="space-y-4 p-5 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">تعديل بيانات: {editingCourse.title}</h3>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                إلغاء التعديل
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">عنوان الدورة:</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">ساعات المحتوى:</label>
                <input
                  type="number"
                  value={editingCourse.hours}
                  onChange={(e) => setEditingCourse({ ...editingCourse, hours: Number(e.target.value) || 30 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-slate-300 block mb-1">الوصف الفرعي للمسار:</label>
              <textarea
                value={editingCourse.subtitle}
                onChange={(e) => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              حفظ التعديلات في النظام
            </button>
          </form>
        )}

        {/* Tab 2: New Course */}
        {activeTab === 'new-course' && (
          <form onSubmit={handleCreateCourse} className="space-y-4 p-5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">إضافة مسار تعليمي جديد إلى الأكاديمية</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-slate-300 block mb-1">اسم المسار الجديد:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: أمن الحوسبة السحابية و AWS Hardening"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">التصنيف:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="network">أمن الشبكات (Network)</option>
                  <option value="offensive">اختراق وتقييم (Offensive)</option>
                  <option value="forensics">تحقيق جنائي (Forensics)</option>
                  <option value="ai">أمن الذكاء الاصطناعي (AI)</option>
                  <option value="advanced">متقدم وبنية تحتية (Advanced)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">الوصف المختصر:</label>
              <textarea
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="نبذة عن المنهج والأهداف التطبيقية..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">مخرجات التعلم (سطر لكل مخرج):</label>
              <textarea
                value={newOutcomes}
                onChange={(e) => setNewOutcomes(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              نشر المسار في الأكاديمية
            </button>
          </form>
        )}

        {/* Tab 3: Lab Files */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <form onSubmit={handleAddFile} className="flex gap-2 text-xs">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="اسم الملف أو المرفق الجديد (مثال: wireshark_lab_v2.pcap)..."
                dir="ltr"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold cursor-pointer"
              >
                + رفع ملف مختبر
              </button>
            </form>

            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <div>
                      <span className="font-mono text-slate-200 block" dir="ltr">{file.name}</span>
                      <span className="text-[11px] text-slate-500">{file.category} · {file.size} · {file.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40 cursor-pointer"
                    title="حذف الملف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">
                سجل تدقيق العمليات الأمنية وتحديثات النظام (Security & Access Audit Logs)
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Database: ai-studio-kayasafesec</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden text-xs font-mono">
              <table className="w-full text-start">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-[11px]">
                    <th className="p-3 text-start">الوقت والتاريخ</th>
                    <th className="p-3 text-start">نوع الحدث (Event)</th>
                    <th className="p-3 text-start">الفاعل (Actor)</th>
                    <th className="p-3 text-start">التفاصيل الفنية</th>
                    <th className="p-3 text-start">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-500">2026-10-15 08:24</td>
                    <td className="p-3 text-cyan-300 font-bold">AUTH_ADMIN_SESSION</td>
                    <td className="p-3">{adminEmail}</td>
                    <td className="p-3 text-[11px]">Admin portal active authentication</td>
                    <td className="p-3 text-emerald-400 font-bold">SUCCESS ✓</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-500">2026-10-15 08:20</td>
                    <td className="p-3 text-teal-300 font-bold">FIRESTORE_DATABASE_SYNC</td>
                    <td className="p-3">system_backend</td>
                    <td className="p-3 text-[11px]">Sync users/courses schema to Firestore</td>
                    <td className="p-3 text-emerald-400 font-bold">VERIFIED ✓</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-500">2026-10-15 08:18</td>
                    <td className="p-3 text-indigo-300 font-bold">SECURITY_RULES_DEPLOY</td>
                    <td className="p-3">DeployRules RPC</td>
                    <td className="p-3 text-[11px]">Enforced RLS v2 with zero-trust access</td>
                    <td className="p-3 text-emerald-400 font-bold">ACTIVE ✓</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-500">2026-10-15 08:14</td>
                    <td className="p-3 text-amber-300 font-bold">LAB_FLAG_VALIDATION</td>
                    <td className="p-3">student_session</td>
                    <td className="p-3 text-[11px]">Verified {"KAYA{...}"} in SQLi sandbox</td>
                    <td className="p-3 text-emerald-400 font-bold">AWARDED +175 XP</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-500">2026-10-15 08:05</td>
                    <td className="p-3 text-purple-300 font-bold">THREAT_INTEL_LOOKUP</td>
                    <td className="p-3">scanner_engine</td>
                    <td className="p-3 text-[11px]">VirusTotal 72-engine reputation check</td>
                    <td className="p-3 text-emerald-400 font-bold">COMPLETED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
