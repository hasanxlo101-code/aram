import { DownloadableDoc } from '../types/professionalTracks';

export const DOWNLOADABLE_DOCS: DownloadableDoc[] = [
  {
    id: 'doc-soc-playbook',
    fileUrl: '/docs/doc-soc-playbook.md',
    title: 'كتيب إرشادات الاستجابة السريعة لحوادث الفدية (Ransomware Incident Response Playbook)',
    category: 'إطار عمل',
    format: 'MD',
    description: 'دليل تنفيذي شامل يوضح الخطوات الفورية لاحتواء هجمات التشفير، وحماية النسخ الاحتياطية، وسلسلة التواصل المعتمدة وفق NIST.',
    tags: ['SOC', 'Incident Response', 'Ransomware', 'NIST']
  },
  {
    id: 'doc-wireshark-cheat-sheet',
    fileUrl: '/docs/doc-wireshark-cheat-sheet.md',
    title: 'بطاقة مرجعية سريعة لمرشحات Wireshark المتقدمة واستكشاف الهجمات',
    category: 'ملخص أوامر',
    format: 'MD',
    description: 'مرشحات عملية لاكتشاف تسريبات DNS وهجمات SYN Flood واستخراج ملفات HTTP المشبوهة وفحص جلسات TLS.',
    tags: ['Wireshark', 'Network', 'Packet Analysis', 'Defense']
  },
  {
    id: 'doc-owasp-checklist',
    fileUrl: '/docs/doc-owasp-checklist.md',
    title: 'قائمة التحقق المعيارية لأمن تطبيقات الويب (OWASP ASVS v4.0 Checklist)',
    category: 'قائمة تحقق',
    format: 'MD',
    description: 'قائمة فحص تفاعلية مخصصة للمطورين وفرق اختبار الاختراق للتحقق من المصادقة، والتحكم بالوصول، والتشفير قبل إطلاق التطبيقات.',
    tags: ['Web Security', 'OWASP', 'Secure Coding', 'Audit']
  },
  {
    id: 'doc-sigma-rules-pack',
    fileUrl: '/docs/doc-sigma-rules-pack.md',
    title: 'حزمة قواعد رصد Sigma المترجمة لأنظمة Splunk و Wazuh و Elastic',
    category: 'دليل عملي',
    format: 'MD',
    description: 'أكثر من 40 قاعدة رصد عملية لاكتشاف تقنيات المهاجمين الأكثر خطورة مثل Mimikatz و Pass-the-Hash و PowerShell Encoded.',
    tags: ['Sigma Rules', 'SIEM', 'Threat Hunting', 'Detection']
  },
  {
    id: 'doc-osint-verification-framework',
    fileUrl: '/docs/doc-osint-verification-framework.md',
    title: 'إطار التحقق من صحة المصادر الرقمية والأدلة مفتوحة المصدر (OSINT Verification Framework)',
    category: 'إطار عمل',
    format: 'MD',
    description: 'منهجية معتمدة للتحقق من الصور والفيديوهات والمستندات المسربة وحسابات التواصل الاجتماعي وتجنب الوقوع في فخ التضليل.',
    tags: ['OSINT', 'Verification', 'Fact-Checking', 'Intelligence']
  },
  {
    id: 'doc-capstone-report-template',
    fileUrl: '/docs/doc-capstone-report-template.md',
    title: 'النموذج الرسمي المعتمد لتقارير المشاريع النهائية والتدقيق الأمني في KAyA Safe&Sec',
    category: 'تقرير نموذج',
    format: 'MD',
    description: 'قالب التقرير الهندسي المتكامل المعتمد من قبل الأكاديمية لتقديمه للتقييم، متضمناً الملخص التنفيذي، مصفوفة المخاطر، والحلول الفنية.',
    tags: ['Capstone', 'Report Template', 'Academic', 'Certification']
  }
];
