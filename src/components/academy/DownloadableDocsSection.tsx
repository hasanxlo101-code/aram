import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Search, 
  Check, 
  Filter, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  Shield,
  FileCheck
} from 'lucide-react';
import { DOWNLOADABLE_DOCS } from '../../data/downloadableDocsData';
import { FIFTEEN_WORD_COURSES } from '../../data/wordCoursesData';

interface DownloadableDocsSectionProps {
  onOpenWordCourse?: (courseId: string) => void;
}

export const DownloadableDocsSection: React.FC<DownloadableDocsSectionProps> = ({
  onOpenWordCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadedDocIds, setDownloadedDocIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'docs' | 'word-courses'>('docs');

  const filteredDocs = DOWNLOADABLE_DOCS.filter((doc) => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchDesc = doc.description.toLowerCase().includes(q);
      const matchTag = doc.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchTag;
    }
    return true;
  });

  const handleDownload = (docId: string, title: string, format: string) => {
    // Simulate real file download
    const dummyBlob = new Blob([`KAyA Safe&Sec Academy - Official Document\nTitle: ${title}\nGenerated for enrolled student.\nVerified Hash: 5f4dcc3b5aa765d61d8327deb882cf99`], { type: 'text/plain' });
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadedDocIds(prev => [...prev, docId]);
  };

  return (
    <section className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0c1633] via-[#091124] to-[#070d1e] border border-cyan-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>مكتبة الوثائق الفنية والمراجع القابلة للتنزيل</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            المستندات التنفيذية والأدلة وقوالب التقارير المعتمدة
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            مستودع متكامل يحتوي على خطط الاستجابة للطوارئ، بطاقات المرشحات الشبكية، قوائم التدقيق المعيارية، بالإضافة إلى الـ 15 مساقاً بصيغة Microsoft Word الرسمية.
          </p>
        </div>

        {/* Tab switch */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'docs'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>الوثائق والأدلة الفنية ({DOWNLOADABLE_DOCS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('word-courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'word-courses'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>مقررات ملفات الـ Word الأكاديمية ({FIFTEEN_WORD_COURSES.length} مساق)</span>
          </button>
        </div>
      </div>

      {activeTab === 'docs' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الوثائق، الأدلة، أو الأوسمة..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs">
              <span className="text-slate-400 ml-1">التصنيف:</span>
              {['all', 'دليل عملي', 'قائمة تحقق', 'ملخص أوامر', 'إطار عمل', 'تقرير نموذج'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'الكل' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Docs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => {
              const hasDownloaded = downloadedDocIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4 group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                        {doc.category}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {doc.format} · {doc.size}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {doc.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {doc.downloadsCount.toLocaleString()} تنزيل
                    </span>

                    <button
                      onClick={() => handleDownload(doc.id, doc.title, doc.format)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        hasDownloaded
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/10'
                      }`}
                    >
                      {hasDownloaded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تم التنزيل</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>تنزيل المستند</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Word Courses Tab */}
      {activeTab === 'word-courses' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <span className="text-cyan-400 font-bold">15 مساقاً أكاديمياً متخصصاً بصيغة Word:</span> تشمل الفصول التفصيلية، مخططات الدفاع، والأنشطة العملية لجميع المستويات من المبتدئ وحتى الخبير.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FIFTEEN_WORD_COURSES.map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px]">
                      {course.levelLabelAr}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {course.docMeta.fileSize} · {course.docMeta.pages} صفحة
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{course.subtitle}</p>

                  <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-850 font-mono truncate" dir="ltr">
                    {course.docMeta.fileName}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-bold">
                    {course.isFree ? 'متاح للجميع مجاناً' : 'مشمول بالاشتراك'}
                  </span>
                  <button
                    onClick={() => {
                      if (onOpenWordCourse) {
                        onOpenWordCourse(course.id);
                      } else {
                        handleDownload(course.id, course.title, 'docx');
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-xs font-semibold transition"
                  >
                    <span>استعراض الفصول</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
