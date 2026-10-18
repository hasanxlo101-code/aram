import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Copy,
  Check,
  Shield,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { WordCourse } from '../../types/wordCourses';

interface WordDocumentViewerModalProps {
  course: WordCourse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WordDocumentViewerModal: React.FC<WordDocumentViewerModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(14);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const handleDownloadDocx = () => {
    // Generate text/markdown document formatted as Word content
    let docxText = `========================================================================\n`;
    docxText += `KAyA_SafeSec — أكاديمية كايا للأمن والحماية الرقمية\n`;
    docxText += `Course Title: ${course.title}\n`;
    docxText += `Level: ${course.levelLabelAr}\n`;
    docxText += `Pages: ${course.docMeta.pages} | Words: ${course.docMeta.wordsCount}\n`;
    docxText += `Author: ${course.docMeta.author}\n`;
    docxText += `========================================================================\n\n`;

    docxText += `[المقدمة والأهداف التعلمية]:\n`;
    course.learningOutcomes.forEach((o, i) => {
      docxText += `  ${i + 1}. ${o}\n`;
    });
    docxText += `\n------------------------------------------------------------------------\n\n`;

    course.chapters.forEach((ch) => {
      docxText += `الفصل ${ch.number}: ${ch.title}\n\n`;
      ch.sections.forEach((sec) => {
        docxText += `  ${sec.subtitle}\n`;
        docxText += `  ${sec.content}\n`;
        if (sec.codeOrBox) {
          docxText += `\n  [أمر تطبيقي / مرجع فني]:\n  ${sec.codeOrBox}\n`;
        }
        if (sec.tip) {
          docxText += `\n  [توجيه أمني]: ${sec.tip}\n`;
        }
        docxText += `\n`;
      });
      docxText += `------------------------------------------------------------------------\n\n`;
    });

    const blob = new Blob([docxText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = course.docMeta.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[94vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Word Ribbon / Toolbar */}
        <div className="border-b border-slate-700/80 bg-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white" dir="ltr">
                <span>{course.docMeta.fileName}</span>
                <span className="text-slate-500 text-[11px] font-normal">({course.docMeta.fileSize})</span>
              </div>
              <div className="text-[11px] text-slate-400">
                <span>{course.levelLabelAr}</span>
                <span className="mx-1.5">·</span>
                <span className="font-mono tabular-nums">{course.docMeta.pages} صفحة</span>
                <span className="mx-1.5">·</span>
                <span className="font-mono tabular-nums">{course.docMeta.wordsCount} كلمة</span>
              </div>
            </div>
          </div>

          {/* Controls: Zoom, Print, Download, Close */}
          <div className="flex items-center gap-2">
            {/* Font size adjustments */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setFontSizeLevel(Math.max(12, fontSizeLevel - 2))}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="تصغير الخط"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-slate-300 w-8 text-center">{fontSizeLevel}px</span>
              <button
                onClick={() => setFontSizeLevel(Math.min(20, fontSizeLevel + 2))}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="تكبير الخط"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
              title="طباعة المستند"
            >
              <Printer className="h-4 w-4" />
            </button>

            <button
              onClick={handleDownloadDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
            >
              {downloadSuccess ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
              <span>{downloadSuccess ? 'تم التحميل' : 'تحميل Word (.docx)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Word Document Canvas / Reading Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/70 flex justify-center">
          {/* A4 Paper Simulation Canvas */}
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-12 shadow-2xl text-slate-200 space-y-8 min-h-full">
            {/* Document Header & Official KAyA Letterhead */}
            <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    KAyA_SafeSec Academic Course Document
                  </h1>
                  <span className="text-xs font-mono text-emerald-400">
                    أكاديمية كايا للأمن والحماية الرقمية · وثيقة تدريب رسمية
                  </span>
                </div>
              </div>

              <div className="text-start sm:text-end text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>الناشر: <span className="text-slate-200">{course.docMeta.author}</span></div>
                <div>التصنيف: <span className="text-emerald-400 font-bold">{course.levelLabelAr}</span></div>
                <div>تاريخ التحديث: <span className="text-slate-300">{course.docMeta.lastUpdated}</span></div>
              </div>
            </div>

            {/* Document Title & Abstract Banner */}
            <div className="space-y-3">
              <div className="inline-block px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold">
                MICROSOFT WORD COMPATIBLE · COURSE WORKBOOK
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {course.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {course.subtitle}
              </p>
            </div>

            {/* Document Metadata Summary Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">ساعات المنهج</span>
                <span className="text-white font-bold tabular-nums">{course.hours} ساعة تدريب</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">عدد الصفحات</span>
                <span className="text-white font-bold tabular-nums">{course.docMeta.pages} صفحة A4</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">إجمالي الكلمات</span>
                <span className="text-white font-bold tabular-nums">{course.docMeta.wordsCount} كلمة</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">الصيغة المعتمدة</span>
                <span className="text-emerald-400 font-bold">Word .docx</span>
              </div>
            </div>

            {/* Learning Outcomes Section */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>أهداف ومخرجات هذا الكورس (Learning Outcomes):</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {course.learningOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapters & Content Sections */}
            <div className="space-y-8 pt-2" style={{ fontSize: `${fontSizeLevel}px` }}>
              {course.chapters.map((chapter) => (
                <div key={chapter.number} className="space-y-5 pb-8 border-b border-slate-800 last:border-b-0">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 font-mono font-bold text-xs">
                      {chapter.number}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {chapter.title}
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {chapter.sections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-3">
                        <h4 className="text-sm font-bold text-emerald-400">
                          {section.subtitle}
                        </h4>
                        <p className="text-slate-300 leading-relaxed text-justify">
                          {section.content}
                        </p>

                        {section.codeOrBox && (
                          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-300">
                            <button
                              onClick={() => copyToClipboard(section.codeOrBox!)}
                              className="absolute top-2.5 end-2.5 flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-300 hover:text-white cursor-pointer"
                              title="نسخ الأمر"
                            >
                              {copiedCode === section.codeOrBox ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedCode === section.codeOrBox ? 'تم النسخ' : 'نسخ'}</span>
                            </button>
                            <pre className="whitespace-pre-wrap leading-relaxed select-all" dir="ltr">
                              {section.codeOrBox}
                            </pre>
                          </div>
                        )}

                        {section.tip && (
                          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-xs text-amber-200">
                            <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{section.tip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Document Footer Signature */}
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
              <div>وثيقة معتمدة ومحمية بموجب معايير أكاديمية KAyA_SafeSec للأمن الرقمي.</div>
              <div className="text-emerald-400 font-bold">End of Document · Verified DOCX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
