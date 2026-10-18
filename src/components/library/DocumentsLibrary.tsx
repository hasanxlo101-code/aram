import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Search, 
  Check, 
  BookOpen, 
  ExternalLink,
  Shield,
  FileCheck,
  Tag,
  Package,
  FolderArchive,
  FileCode,
  HardDrive,
  Sparkles,
  Terminal,
  Layers
} from 'lucide-react';
import { WordCourse } from '../../types/wordCourses';
import { DOWNLOADABLE_DOCS } from '../../data/downloadableDocsData';

interface DocumentsLibraryProps {
  wordCourses: WordCourse[];
  onOpenWordViewer: (course: WordCourse) => void;
  onOpenPaymentNotice: (course: WordCourse) => void;
}

export const DocumentsLibrary: React.FC<DocumentsLibraryProps> = ({
  wordCourses,
  onOpenWordViewer,
  onOpenPaymentNotice,
}) => {
  const [activeTab, setActiveTab] = useState<'docs' | 'word' | 'source'>('docs');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadedDocIds, setDownloadedDocIds] = useState<string[]>([]);

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

  const handleDownloadFile = (docId: string, title: string, format: string) => {
    const dummyContent = `KAyA Safe&Sec Academy - Official Document\nDocument Title: ${title}\nCategory: Technical Cybersecurity Guide\nGenerated for enrolled students.\nVerified Signature: KAYA-SEC-DOC-HASH-${Math.floor(100000 + Math.random() * 900000)}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedDocIds(prev => [...prev, docId]);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0c1633] via-[#091124] to-[#070d1e] border border-cyan-500/20 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>المكتبة المركزية للأدلة والوثائق الفنية القابلة للتنزيل</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            مستودع الوثائق الأمنية وكتيبات الطوارئ والمقررات
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            مكتبة متخصصة تضم خطط الاستجابة للطوارئ، بطاقات المرشحات الشبكية لـ Wireshark، قوائم فحص OWASP المعيارية، وملفات الـ 15 مساقاً بصيغة Microsoft Word الرسمية.
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
            <span>الأدلة وخطط الاستجابة ({DOWNLOADABLE_DOCS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('word')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'word'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>مقررات Word التفاعلية ({wordCourses.length} مساق)</span>
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'source'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-400" />
            <span>كود المنصة ومجلدات المشروع (ZIP)</span>
          </button>
        </div>
      </div>

      {activeTab === 'docs' && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الأدلة، الكتيبات، أو الكلمات المفتاحية..."
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

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => {
              const isDownloaded = downloadedDocIds.includes(doc.id);
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
                      onClick={() => handleDownloadFile(doc.id, doc.title, doc.format)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        isDownloaded
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/10'
                      }`}
                    >
                      {isDownloaded ? (
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

      {activeTab === 'word' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {wordCourses.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px]">
                    {c.levelLabelAr}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {c.docMeta.fileSize} · {c.docMeta.pages} صفحة
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{c.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{c.subtitle}</p>

                <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-850 font-mono truncate" dir="ltr">
                  {c.docMeta.fileName}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold">
                  {c.isFree ? 'متاح للجميع مجاناً' : 'مشمول بالاشتراك'}
                </span>
                <button
                  onClick={() => {
                    if (c.isFree) {
                      onOpenWordViewer(c);
                    } else {
                      onOpenPaymentNotice(c);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-xs font-semibold transition"
                >
                  <span>استعراض الفصول</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Tab: Source Code Packages (ZIP) */}
      {activeTab === 'source' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Main Hero Card: Full Platform Archive */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الحزمة الكاملة الشاملة (Full Project Archive)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  كود المنصة المصدري الكامل بكافة المجلدات والملفات
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  أرشيف مضغوط بصيغة ZIP يحتوي على كافة ملفات المشروع: واجهات React وTypeScript، خادم Express السحابي، قواعد بيانات المسارات والمختبرات، محرك الفحص الأمني، ووثائق التثبيت السريع.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                    <Package className="w-3.5 h-3.5 text-cyan-400" />
                    77+ ملف مصدري
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    حجم الملف: 3.15 MB
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    Node.js & React SPA
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <a
                  href="/kaya-safesec-source.zip"
                  download="kaya-safesec-full-source.zip"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل كود المنصة الكامل (ZIP)</span>
                </a>

                <a
                  href="https://github.com/aramkaya295-cyber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>حساب ومستودع GitHub الرسمي (@aramkaya295-cyber)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Sub-Packages: Modular Folders */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-cyan-400" />
              <span>مجلدات المشروع مقسمة حسب التخصص (Modular Folders)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Module 1: Tracks & Labs */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">المسارات والمختبرات الافتراضية</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      بيانات المسارات الستة، اختبارات المعرفة، السيناريوهات العملية ومحاكي الطرفية.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-850" dir="ltr">
                    /src/components/academy/
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">62.8 KB</span>
                  <a
                    href="/kaya-tracks-and-labs.zip"
                    download="kaya-tracks-and-labs.zip"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل المجلد</span>
                  </a>
                </div>
              </div>

              {/* Module 2: Word Courses */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">مقررات ومستندات Word الـ 15</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      هياكل وبيانات الـ 15 مساقاً التدريبية مع مكونات عارض الفصول والتقييم.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-blue-300 bg-slate-950 px-2 py-1 rounded border border-slate-850" dir="ltr">
                    /src/components/courses/
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">18.5 KB</span>
                  <a
                    href="/kaya-word-courses.zip"
                    download="kaya-word-courses.zip"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-semibold text-xs border border-blue-500/30 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل المجلد</span>
                  </a>
                </div>
              </div>

              {/* Module 3: Security Engine & Tools */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">درع الحماية ومحرك الفحص</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      أدوات فحص التهديدات ومحاكي الهجمات وتحليل عناوين الـ IP وروابط التصيد.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-300 bg-slate-950 px-2 py-1 rounded border border-slate-850" dir="ltr">
                    /src/components/security/
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">31.8 KB</span>
                  <a
                    href="/kaya-security-tools.zip"
                    download="kaya-security-tools.zip"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل المجلد</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Terminal Guide */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-850">
              <span className="flex items-center gap-2 font-bold text-cyan-400">
                <Terminal className="w-4 h-4" />
                خطوات تشغيل الكود المصدري محلياً بعد فك الضغط
              </span>
              <span className="text-[10px] text-slate-500">bash / terminal</span>
            </div>
            <div className="space-y-2 text-slate-300" dir="ltr">
              <p className="text-slate-500"># 1. فك ضغط الحزمة ثم الدخول إلى مجلد المشروع</p>
              <div className="p-2.5 rounded bg-slate-900 text-emerald-400 font-mono select-all">
                unzip kaya-safesec-full-source.zip -d kaya-academy && cd kaya-academy
              </div>
              <p className="text-slate-500"># 2. تثبيت التبعيات وتشغيل الخادم</p>
              <div className="p-2.5 rounded bg-slate-900 text-cyan-300 font-mono select-all">
                npm install && npm run dev
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
