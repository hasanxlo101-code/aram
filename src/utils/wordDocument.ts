import type { WordCourse } from '../types/wordCourses';

export function getCourseDocumentText(course: WordCourse): string {
  const lines = [
    'أكاديمية كايا للأمن والحماية الرقمية', course.title, course.subtitle,
    `المستوى: ${course.levelLabelAr}`, `المؤلف: ${course.docMeta.author}`,
    'الأهداف التعليمية:', ...course.learningOutcomes.map((item, i) => `${i + 1}. ${item}`),
    'المتطلبات السابقة:', ...course.prerequisites.map((item) => `• ${item}`),
  ];
  for (const chapter of course.chapters) {
    lines.push(`الفصل ${chapter.number}: ${chapter.title}`);
    for (const section of chapter.sections) {
      lines.push(section.subtitle, section.content);
      if (section.codeOrBox) lines.push('مثال تطبيقي:', section.codeOrBox);
      if (section.tip) lines.push(`تنبيه أمني: ${section.tip}`);
    }
  }
  lines.push('نهاية المستند — أكاديمية كايا للأمن والحماية الرقمية');
  return lines.join('\n');
}

export function getCourseDocumentStats(course: WordCourse) {
  const text = getCourseDocumentText(course);
  const words = text.trim().split(/\s+/u).filter(Boolean).length;
  // A transparent estimate based on actual content; Word pagination depends on fonts and margins.
  const pages = Math.max(1, Math.ceil(words / 350));
  return { words, pages, text };
}

const encoder = new TextEncoder();
const xmlEscape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1); table[n] = c >>> 0; }
  return table;
})();
function crc32(bytes: Uint8Array) { let c = 0xffffffff; for (const b of bytes) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function u16(v: number) { return [v & 255, (v >>> 8) & 255]; }
function u32(v: number) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
function zipStore(files: Array<{ name: string; data: Uint8Array }>): Uint8Array {
  const local: number[] = []; const central: number[] = [];
  for (const file of files) {
    const name = encoder.encode(file.name); const data = file.data; const crc = crc32(data); const offset = local.length;
    local.push(...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...name, ...data);
    central.push(...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name);
  }
  const centralOffset = local.length; const centralSize = central.length;
  return new Uint8Array([...local, ...central, ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(centralSize), ...u32(centralOffset), ...u16(0)]);
}

export function createCourseDocxBlob(course: WordCourse): Blob {
  const stats = getCourseDocumentStats(course);
  const paragraphs = stats.text.split('\n').map((line, i) => {
    const text = line.trim() || ' ';
    const heading = i < 2 || /^الفصل\s/.test(text) || /^(الأهداف التعليمية:|المتطلبات السابقة:|مثال تطبيقي:)$/.test(text);
    const run = `<w:r><w:rPr>${heading ? '<w:b/><w:sz w:val="28"/>' : '<w:sz w:val="22"/>'}</w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r>`;
    return `<w:p><w:pPr><w:bidi/><w:jc w:val="right"/><w:spacing w:after="140"/></w:pPr>${run}</w:p>`;
  }).join('');
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const files = [
    { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { name: '_rels/.rels', data: encoder.encode(rels) },
    { name: 'word/document.xml', data: encoder.encode(documentXml) },
  ];
  const zipped = zipStore(files);
  const exactBuffer = zipped.buffer.slice(zipped.byteOffset, zipped.byteOffset + zipped.byteLength) as ArrayBuffer;
  return new Blob([exactBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}
