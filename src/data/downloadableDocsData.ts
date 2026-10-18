import { DownloadableDoc } from '../types/professionalTracks';

export const DOWNLOADABLE_DOCS: DownloadableDoc[] = [
  {
    id: 'doc-soc-playbook',
    title: 'كتيب إرشادات الاستجابة السريعة لحوادث الفدية (Ransomware Incident Response Playbook)',
    category: 'إطار عمل',
    format: 'PDF',
    size: '2.8 MB',
    downloadsCount: 1420,
    description: 'دليل تنفيذي شامل يوضح الخطوات الفورية لاحتواء هجمات التشفير، وحماية النسخ الاحتياطية، وسلسلة التواصل المعتمدة وفق NIST.',
    tags: ['SOC', 'Incident Response', 'Ransomware', 'NIST']
  },
  {
    id: 'doc-wireshark-cheat-sheet',
    title: 'بطاقة مرجعية سريعة لمرشحات Wireshark المتقدمة واستكشاف الهجمات',
    category: 'ملخص أوامر',
    format: 'PDF',
    size: '1.2 MB',
    downloadsCount: 2890,
    description: 'أهم 60 فلتر لاكتشاف تسريبات DNS وهجمات SYN Flood واستخراج ملفات HTTP المشبوهة وفحص جلسات TLS.',
    tags: ['Wireshark', 'Network', 'Packet Analysis', 'Defense']
  },
  {
    id: 'doc-owasp-checklist',
    title: 'قائمة التحقق المعيارية لأمن تطبيقات الويب (OWASP ASVS v4.0 Checklist)',
    category: 'قائمة تحقق',
    format: 'DOCX',
    size: '3.1 MB',
    downloadsCount: 1980,
    description: 'قائمة فحص تفاعلية مخصصة للمطورين وفرق اختبار الاختراق للتحقق من المصادقة، والتحكم بالوصول، والتشفير قبل إطلاق التطبيقات.',
    tags: ['Web Security', 'OWASP', 'Secure Coding', 'Audit']
  },
  {
    id: 'doc-sigma-rules-pack',
    title: 'حزمة قواعد رصد Sigma المترجمة لأنظمة Splunk و Wazuh و Elastic',
    category: 'دليل عملي',
    format: 'JSON',
    size: '850 KB',
    downloadsCount: 1250,
    description: 'أكثر من 40 قاعدة رصد عملية لاكتشاف تقنيات المهاجمين الأكثر خطورة مثل Mimikatz و Pass-the-Hash و PowerShell Encoded.',
    tags: ['Sigma Rules', 'SIEM', 'Threat Hunting', 'Detection']
  },
  {
    id: 'doc-osint-verification-framework',
    title: 'إطار التحقق من صحة المصادر الرقمية والأدلة مفتوحة المصدر (OSINT Verification Framework)',
    category: 'إطار عمل',
    format: 'PDF',
    size: '2.4 MB',
    downloadsCount: 3100,
    description: 'منهجية معتمدة للتحقق من الصور والفيديوهات والمستندات المسربة وحسابات التواصل الاجتماعي وتجنب الوقوع في فخ التضليل.',
    tags: ['OSINT', 'Verification', 'Fact-Checking', 'Intelligence']
  },
  {
    id: 'doc-capstone-report-template',
    title: 'النموذج الرسمي المعتمد لتقارير المشاريع النهائية والتدقيق الأمني في KAyA Safe&Sec',
    category: 'تقرير نموذج',
    format: 'DOCX',
    size: '1.9 MB',
    downloadsCount: 4560,
    description: 'قالب التقرير الهندسي المتكامل المعتمد من قبل الأكاديمية لتقديمه للتقييم، متضمناً الملخص التنفيذي، مصفوفة المخاطر، والحلول الفنية.',
    tags: ['Capstone', 'Report Template', 'Academic', 'Certification']
  }
];
