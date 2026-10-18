import { WordCourse } from '../types/wordCourses';

export const FIFTEEN_WORD_COURSES: WordCourse[] = [
  // ==========================================
  // LEVEL 1: مبتدئ (Beginner) - 100% Free & Open
  // ==========================================
  {
    id: 'word-beg-01',
    title: 'أساسيات أمن المعلومات والأمن السيبراني',
    subtitle: 'مدخل تأسيسي شامل يشرح ثالوث CIA، أنواع التهديدات، والمفاهيم الأولية للدفاع الرقمي.',
    level: 'beginner',
    levelLabelAr: 'مبتدئ (متاح مجاناً للجميع)',
    isFree: true,
    priceUsd: 0,
    hours: 20,
    badge: 'KAyA DOCX · مفتوح',
    docMeta: {
      fileName: '01_Cybersecurity_Fundamentals_KayaSafeSec.docx',
      fileSize: '3.4 MB',
      pages: 48,
      wordsCount: 14200,
      lastUpdated: '2026-10-14',
      author: 'KAyA_SafeSec Academic Board',
    },
    learningOutcomes: [
      'فهم ثالوث السرية والسلامة والتوافر (CIA Triad)',
      'التمييز بين التهديد والثغرة والخطر (Threat vs Vulnerability vs Risk)',
      'تطبيق نموذج الدفاع في العمق (Defense in Depth)',
      'قراءة وتوثيق السياسات الأمنية الأساسية للمؤسسات',
    ],
    prerequisites: ['معرفة مبدئية باستخدام الحاسب وتصفح الإنترنت'],
    chapters: [
      {
        number: '01',
        title: 'مدخل إلى فضاء الأمن السيبراني ومثلث CIA',
        sections: [
          {
            subtitle: '1.1 مفهوم ثالوث أمن المعلومات (CIA Triad)',
            content: 'يرتكز أمن المعلومات على ثلاثة أركان أساسية لا غنى عنها: السرية (Confidentiality) لمنع الوصول غير المصرح به للبيانات، السلامة (Integrity) لضمان عدم تعديل أو تزوير البيانات أثناء النقل أو التخزين، والتوافر (Availability) لضمان قدرة المستخدمين المصرح لهم على الوصول للخدمة في أي وقت دون انقطاع.',
            tip: 'تذكر دائماً أن الإفراط في تشديد السرية دون توازن قد يؤدي إلى الإضرار بالتوافر (Availability).'
          },
          {
            subtitle: '1.2 الفرق بين التهديد والثغرة والمخاطرة',
            content: 'الثغرة (Vulnerability) هي نقطة ضعف برمجية أو إدارية في النظام. التهديد (Threat) هو العامل أو المهاجم القادر على استغلال تلك الثغرة. والمخاطرة (Risk) هي ناتج احتمالية حدوث الاستغلال مضروباً في حجم الأثر المترتب عليه.',
            codeOrBox: 'معادلة المخاطر القياسية: Risk = (Threat × Vulnerability × Impact) - Controls'
          }
        ]
      },
      {
        number: '02',
        title: 'أنواع الهجمات الرقمية والمصطلحات الشائعة',
        sections: [
          {
            subtitle: '2.1 البرمجيات الخبيثة (Malware Classification)',
            content: 'تنقسم البرمجيات الخبيثة إلى عدة فئات: الفيروسات (Viruses) التي تتطلب ملفاً مضيفاً، الديدان (Worms) التي تنتشر ذاتياً عبر الشبكة، أحصنة طروادة (Trojans) التي تتخفى كبرامج نافعة، وبرمجيات الفدية (Ransomware) التي تشفر البيانات وتطالب بمبالغ مالية لفكها.',
            codeOrBox: 'نصيحة أمنية: الاحتفاظ بنسخ احتياطية غير متصلة بالشبكة (Offline Backups 3-2-1) هو خط الدفاع الأقوى ضد برمجيات الفدية.'
          }
        ]
      }
    ]
  },
  {
    id: 'word-beg-02',
    title: 'أمن الشبكات المنزلية وحماية الأجهزة الشخصية',
    subtitle: 'دليل عملي مصور لتأمين موجه الإنترنت (Router)، عزل شبكة الضيوف، وحماية الهواتف والحواسيب.',
    level: 'beginner',
    levelLabelAr: 'مبتدئ (متاح مجاناً للجميع)',
    isFree: true,
    priceUsd: 0,
    hours: 18,
    badge: 'KAyA DOCX · مفتوح',
    docMeta: {
      fileName: '02_Home_Network_Hardening_Guide.docx',
      fileSize: '2.8 MB',
      pages: 36,
      wordsCount: 11500,
      lastUpdated: '2026-10-12',
      author: 'KAyA_SafeSec Defense Team',
    },
    learningOutcomes: [
      'تغيير إعدادات المصنع وتأمين لوحة تحكم الموجه المنزلي',
      'تفعيل تشفير WPA3 وعزل شبكات IoT والضيوف',
      'تثبيت وتكوين جدران الحماية الشخصية على Windows و macOS',
    ],
    prerequisites: ['جهاز حاسوب وموجه إنترنت منزلي'],
    chapters: [
      {
        number: '01',
        title: 'تأمين الموجه المنزلي (Router Security Baseline)',
        sections: [
          {
            subtitle: '1.1 تغيير كلمات المرور الافتراضية وتعطيل WPS',
            content: 'أغلب الموجهات تأتي بكلمات مرور افتراضية مثل (admin / admin) وهي أول ما يستهدفه المهاجمون. من الضروري تغيير كلمة مرور لوحة التحكم فوراً، وتعطيل خاصية WPS (Wi-Fi Protected Setup) نظراً لسهولة كسرها عبر هجمات القوة الغاشمة (Brute Force).',
            codeOrBox: 'الإجراء الموصى به: تعطيل Remote Management تماماً وقصر إدارة الراوتر على الكابل المحلي فقط.'
          }
        ]
      }
    ]
  },
  {
    id: 'word-beg-03',
    title: 'مكافحة الهندسة الاجتماعية والتصيد الاحتيالي',
    subtitle: 'أساليب كشف رسائل البريد المشبوهة، روابط التلاعب، وانتحال الشخصيات، وقواعد السلوك الرقمي الآمن.',
    level: 'beginner',
    levelLabelAr: 'مبتدئ (متاح مجاناً للجميع)',
    isFree: true,
    priceUsd: 0,
    hours: 16,
    badge: 'KAyA DOCX · مفتوح',
    docMeta: {
      fileName: '03_Social_Engineering_Phishing_Defense.docx',
      fileSize: '4.1 MB',
      pages: 42,
      wordsCount: 13800,
      lastUpdated: '2026-10-11',
      author: 'KAyA_SafeSec Awareness Cell',
    },
    learningOutcomes: [
      'التعرف على مؤشرات رسائل التصيد (Phishing Indicators)',
      'كشف هجمات تشابه النطاقات والتلاعب بالأحرف (Typosquatting)',
      'بناء بروتوكول آمن للتحقق من الرسائل المالية والإدارية',
    ],
    prerequisites: ['لا توجد متطلبات مسبقة'],
    chapters: [
      {
        number: '01',
        title: 'سيكولوجيا الهندسة الاجتماعية وأساليب الاستدراج',
        sections: [
          {
            subtitle: '1.1 استغلال مشاعر الإلحاح والخوف (Urgency & Fear Triggers)',
            content: 'يعتمد المهاجمون في رسائل التصيد على خلق حالة من الاستعجال المصطنع (مثل: "سيتم إغلاق حسابك البنكي خلال ساعتين ما لم تحدث بياناتك"). هذا التكتيك يعطل التفكير النقدي لدى الضحية ويدفعه للنقر على الروابط الخبيثة.',
            tip: 'قاعدة كايا الذهبية: أي طلب طارئ يطلب بيانات دخول أو أموال يجب التحقق منه عبر قناة اتصال خارجية مستقلة.'
          }
        ]
      }
    ]
  },
  {
    id: 'word-beg-04',
    title: 'أساسيات نظام Linux لأمن المعلومات',
    subtitle: 'إتقان سطر الأوامر (Bash)، إدارة الصلاحيات، هيكل الملفات، وتجهيز بيئة العمل لاختبار الاختراق.',
    level: 'beginner',
    levelLabelAr: 'مبتدئ (متاح مجاناً للجميع)',
    isFree: true,
    priceUsd: 0,
    hours: 24,
    badge: 'KAyA DOCX · مفتوح',
    docMeta: {
      fileName: '04_Linux_Security_Command_Line_Mastery.docx',
      fileSize: '3.6 MB',
      pages: 54,
      wordsCount: 16900,
      lastUpdated: '2026-10-10',
      author: 'Hasan - KAyA Academy',
    },
    learningOutcomes: [
      'التنقل الاحترافي في شجرة مجلدات لينكس عبر الطرفية (Terminal)',
      'إدارة أذونات الملفات (chmod, chown, SUID bits)',
      'مراقبة العمليات والاتصالات الشبكية باستخدام ps و netstat و ss',
    ],
    prerequisites: ['تثبيت نظام Ubuntu أو Kali Linux في بيئة افتراضية'],
    chapters: [
      {
        number: '01',
        title: 'أوامر الطرفية الأساسية وإدارة الأذونات',
        sections: [
          {
            subtitle: '1.1 أوامر التنقل والبحث الأساسية',
            content: 'يعد سطر أوامر لينكس السلاح الأول لمختبري الاختراق والمحققين الجنائيين. الأوامر الأساسية مثل ls -la و grep و find تمكنك من مسح النظام بسرعة فائقة واستخراج الملفات الحساسة.',
            codeOrBox: '# البحث عن ملفات تحتوي على صلاحية SUID (لتصعيد الصلاحيات):\nfind / -perm -4000 -type f 2>/dev/null'
          }
        ]
      }
    ]
  },
  {
    id: 'word-beg-05',
    title: 'إدارة كلمات المرور والمصادقة متعددة العوامل 2FA',
    subtitle: 'معايير NIST 800-63B لكلمات المرور، خزائن التشفير، ومفاتيح الأمان المادية FIDO2/WebAuthn.',
    level: 'beginner',
    levelLabelAr: 'مبتدئ (متاح مجاناً للجميع)',
    isFree: true,
    priceUsd: 0,
    hours: 15,
    badge: 'KAyA DOCX · مفتوح',
    docMeta: {
      fileName: '05_Password_Vault_MFA_Blueprint.docx',
      fileSize: '2.2 MB',
      pages: 32,
      wordsCount: 9800,
      lastUpdated: '2026-10-09',
      author: 'KAyA_SafeSec Vault Division',
    },
    learningOutcomes: [
      'تطبيق إرشادات NIST الحديثة لكلمات المرور والابتعاد عن التغيير الدوري الإجباري الروتيني',
      'إعداد خازن كلمات مرور مفتوح المصدر (مثل Bitwarden أو KeePass)',
      'تفعيل مفاتيح FIDO2/Passkeys المقاومة للتصيد الاحتيالي',
    ],
    prerequisites: ['معرفة أولية بإنشاء الحسابات وتطبيقات الهواتف الذكية'],
    chapters: [
      {
        number: '01',
        title: 'معايير NIST والفرق بين طول الكلمة والتعقيد الشكلي',
        sections: [
          {
            subtitle: '1.1 لماذا يتفوق الطول على التعقيد الرمزي؟',
            content: 'أثبتت أبحاث التشفير أن طول كلمة المرور (Entropy) يرفع مقاومتها للتخمين أضعافاً مقارنة بالكلمات القصيرة المعقدة شكلياً. استخدام عبارات مرور (Passphrases) من 4 إلى 5 كلمات عشوائية هو الحل الأفضل للبشر.',
            codeOrBox: 'مثال: "Correct-Horse-Battery-Staple-2026!" تحتاج آلاف السنين للكسر بواسطة أحدث كروت GPU.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // LEVEL 2: متوسط (Intermediate) - Paid ($49 - $69)
  // ==========================================
  {
    id: 'word-int-06',
    title: 'الاختراق الأخلاقي وتقييم ثغرات الويب OWASP',
    subtitle: 'منهجية فحص ثغرات تطبيقات الويب، استغلال وتأمين SQLi و XSS و CSRF و SSRF عملياً.',
    level: 'intermediate',
    levelLabelAr: 'متوسط (مسار مدفوع ومتقدم)',
    isFree: false,
    priceUsd: 59,
    hours: 32,
    badge: 'KAyA DOCX · مدفوع ($59)',
    docMeta: {
      fileName: '06_Ethical_Hacking_OWASP_Top10_DeepDive.docx',
      fileSize: '5.4 MB',
      pages: 68,
      wordsCount: 22400,
      lastUpdated: '2026-10-13',
      author: 'KAyA_SafeSec Offensive Research',
    },
    learningOutcomes: [
      'فهم واكتشاف ثغرات OWASP Top 10 لعام 2025/2026',
      'استخدام أداة Burp Suite Pro لاعتراض وتعديل طلبات HTTP',
      'كتابة تقارير احترافية تتضمن خطوات الاستغلال وخطة الترقيع (Remediation)',
    ],
    prerequisites: ['فهم بروتوكول HTTP/HTTPS وأساسيات لغة HTML/JS و SQL'],
    chapters: [
      {
        number: '01',
        title: 'ثغرات حقن الأوامر و SQL Injection المتقدمة',
        sections: [
          {
            subtitle: '1.1 استغلال ثغرات Union-Based و Blind SQLi',
            content: 'شرح مفصل لكيفية استخراج البيانات من قواعد البيانات بدون رسائل خطأ صريحة عبر استعلامات الوقت والمطابقة المنطقية (Time-Based Blind SQLi).',
            codeOrBox: "' UNION SELECT 1, table_name, column_name FROM information_schema.columns WHERE table_schema=database()--"
          }
        ]
      }
    ]
  },
  {
    id: 'word-int-07',
    title: 'التحقيق الجنائي الرقمي وتحليل سجلات النظام DFIR',
    subtitle: 'سلسلة الحيازة القانونية للأدلة، تصوير الذاكرة العشوائية RAM، وتحليل سجلات Windows Event Logs.',
    level: 'intermediate',
    levelLabelAr: 'متوسط (مسار مدفوع ومتقدم)',
    isFree: false,
    priceUsd: 69,
    hours: 34,
    badge: 'KAyA DOCX · مدفوع ($69)',
    docMeta: {
      fileName: '07_DFIR_Forensic_Evidence_Acquisition.docx',
      fileSize: '6.1 MB',
      pages: 74,
      wordsCount: 24800,
      lastUpdated: '2026-10-11',
      author: 'KAyA_SafeSec DFIR Laboratory',
    },
    learningOutcomes: [
      'تطبيق مبادئ حفظ الأدلة الرقمية وسلسلة الحيازة (Chain of Custody)',
      'سحب صور الذاكرة العشوائية الحية وتحليلها باستخدام أداة Volatility 3',
      'تحليل ملفات سجلات ويندوز (EVTX) لكشف هجمات الدخول وتصعيد الصلاحيات',
    ],
    prerequisites: ['أساسيات أنظمة التشغيل والشبكات'],
    chapters: [
      {
        number: '01',
        title: 'الاستجابة للحوادث وبناء الجدول الزمني للواقعة (Timeline)',
        sections: [
          {
            subtitle: '1.1 تتبع أحداث الدخول وسجلات Event ID 4624 و 4625',
            content: 'سجلات تدقيق الأمان في ويندوز تكشف بدقة عن أنواع تسجيل الدخول (Logon Type 2 محلي، Logon Type 3 عبر الشبكة، Logon Type 10 عبر ريموت ديسكتوب RDP).',
            codeOrBox: 'Get-WinEvent -FilterHashtable @{LogName="Security"; ID=4624} | Select-Object -First 20'
          }
        ]
      }
    ]
  },
  {
    id: 'word-int-08',
    title: 'أمن بروتوكولات الشبكات وتحليل Wireshark الميداني',
    subtitle: 'تشريح حزم TCP/IP، تحليل اتصالات DNS و TLS المشبوهة، وكشف قنوات C2 الخفية وسرقة البيانات.',
    level: 'intermediate',
    levelLabelAr: 'متوسط (مسار مدفوع ومتقدم)',
    isFree: false,
    priceUsd: 49,
    hours: 28,
    badge: 'KAyA DOCX · مدفوع ($49)',
    docMeta: {
      fileName: '08_Network_Protocols_Wireshark_Analysis.docx',
      fileSize: '4.9 MB',
      pages: 58,
      wordsCount: 19500,
      lastUpdated: '2026-10-08',
      author: 'KAyA_SafeSec Network Engineering',
    },
    learningOutcomes: [
      'قراءة وتتبع مسارات TCP Streams واستخراج الملفات المنقولة بنص غير مشفر',
      'كشف أنفاق الاتصال التجسسية (DNS Tunneling) وهجمات تزييف ARP',
      'بناء فلاتر Wireshark مخصصة للتحقيق في التسريبات',
    ],
    prerequisites: ['أساسيات نموذج OSI وبروتوكولات الشبكات'],
    chapters: [
      {
        number: '01',
        title: 'فلاتر Wireshark المتقدمة لكشف البرمجيات الخبيثة',
        sections: [
          {
            subtitle: '1.1 عزل الاتصالات الخبيثة',
            content: 'استخدام عوامل التصفية المعقدة لتحديد الحزم المشبوهة وحركات Beaconing التي تجريها خوادم القيادة والسيطرة C2.',
            codeOrBox: 'http.request.method == "POST" && !(http.user_agent contains "Mozilla")'
          }
        ]
      }
    ]
  },
  {
    id: 'word-int-09',
    title: 'إدارة الثغرات والامتثال الأمني للمؤسسات',
    subtitle: 'دورة حياة الثغرة، تقييم درجات CVSS v3.1/v4.0، واستخدام الماسحات الآلية مثل Nessus و OpenVAS.',
    level: 'intermediate',
    levelLabelAr: 'متوسط (مسار مدفوع ومتقدم)',
    isFree: false,
    priceUsd: 59,
    hours: 26,
    badge: 'KAyA DOCX · مدفوع ($59)',
    docMeta: {
      fileName: '09_Vulnerability_Management_Compliance.docx',
      fileSize: '3.8 MB',
      pages: 50,
      wordsCount: 16200,
      lastUpdated: '2026-10-07',
      author: 'KAyA_SafeSec Governance Board',
    },
    learningOutcomes: [
      'بناء برنامج مؤسسي دوري لإدارة ورصد الثغرات الأمنية',
      'حساب درجات الخطورة وإعداد أولويات المعالجة للمخاطر الحرجة',
      'التوافق مع متطلبات ISO 27001 و PCI-DSS',
    ],
    prerequisites: ['فهم معماريات الشبكات وأنظمة المؤسسات'],
    chapters: [
      {
        number: '01',
        title: 'معايير التقييم وتصنيف الخطورة',
        sections: [
          {
            subtitle: '1.1 مقياس CVSS وعوامل التقييم الميداني',
            content: 'كيفية التمييز بين الثغرة النظرية والثغرة التي تمتلك استغلالاً فعالاً في البرية (Weaponized Exploit in the Wild).',
            codeOrBox: 'CVSS Base Score Vector: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (9.8 Critical)'
          }
        ]
      }
    ]
  },
  {
    id: 'word-int-10',
    title: 'أساسيات مراكز العمليات الأمنية (SOC Analyst Tier-1)',
    subtitle: 'فرز التنبيهات، التعامل مع منصات SIEM و EDR، واستخدام إطار عمل MITRE ATT&CK لتصنيف الهجمات.',
    level: 'intermediate',
    levelLabelAr: 'متوسط (مسار مدفوع ومتقدم)',
    isFree: false,
    priceUsd: 69,
    hours: 35,
    badge: 'KAyA DOCX · مدفوع ($69)',
    docMeta: {
      fileName: '10_SOC_Analyst_Tier1_Playbook.docx',
      fileSize: '5.7 MB',
      pages: 72,
      wordsCount: 23600,
      lastUpdated: '2026-10-05',
      author: 'KAyA_SafeSec Blue Team',
    },
    learningOutcomes: [
      'إدارة دورة حياة التنبيهات الأمنية والحد من الإنذارات الكاذبة (False Positives)',
      'تتبع مؤشرات الاختراق IOCs على منصات الاستخبارات مثل VirusTotal و AlienVault',
      'كتابة مذكرات تصعيد الحوادث (Escalation Tickets) بدقة احترافية',
    ],
    prerequisites: ['فهم أساسيات أمن الشبكات وأنظمة التشغيل'],
    chapters: [
      {
        number: '01',
        title: 'هندسة منصات SIEM وكتابة استعلامات البحث',
        sections: [
          {
            subtitle: '1.1 ربط الأحداث (Event Correlation)',
            content: 'كيفية تحويل ملايين السجلات اليومية إلى تنبيهات ذات قيمة تشير بوضوح إلى محاولة اختراق نشطة.',
            codeOrBox: 'index=security action=blocked status>=400 | stats count by src_ip | where count > 100'
          }
        ]
      }
    ]
  },

  // ==========================================
  // LEVEL 3: خبير (Expert) - Paid ($99 - $129)
  // ==========================================
  {
    id: 'word-exp-11',
    title: 'اختبار الاختراق المتقدم لـ Active Directory والهوية',
    subtitle: 'هجمات Kerberoasting، تذاكر Golden/Silver Tickets، تتبع مسارات BloodHound، وتجاوز حدود الغابة.',
    level: 'expert',
    levelLabelAr: 'خبير (مسار النخبة المتقدم)',
    isFree: false,
    priceUsd: 119,
    hours: 40,
    badge: 'KAyA DOCX · مدفوع ($119)',
    docMeta: {
      fileName: '11_Active_Directory_Enterprise_Attacks.docx',
      fileSize: '7.8 MB',
      pages: 96,
      wordsCount: 31200,
      lastUpdated: '2026-10-13',
      author: 'KAyA_SafeSec Red Team Elite',
    },
    learningOutcomes: [
      'رسم خريطة مسارات الصلاحيات المعقدة في بيئات مايكروسوفت الضخمة',
      'تنفيذ هجمات تفويض Kerberos غير المقيد المقيد والمقيد القائم على الموارد (RBCD)',
      'بناء ضوابط دفاعية وهندسة كشف مخصصة لمسارات هجمات الهوية',
    ],
    prerequisites: ['خبرة متوسطة في إدارة Active Directory ومفاهيم اختبار الاختراق'],
    chapters: [
      {
        number: '01',
        title: 'بروتوكول Kerberos وتذاكر التذاكر TGT / TGS',
        sections: [
          {
            subtitle: '1.1 استخراج وتكسير تجزئات SPN (Kerberoasting)',
            content: 'استغلال حسابات الخدمة ذات كلمات المرور الضعيفة وطلب تذاكر TGS بطلب شرعي، ثم كسر تجزئتها خارج الشبكة بسرعة فائقة دون إصدار إنذارات أمنية.',
            codeOrBox: 'Rubeus.exe kerberoast /outfile:hashes.kerberoast'
          }
        ]
      }
    ]
  },
  {
    id: 'word-exp-12',
    title: 'الهندسة العكسية وتحليل البرمجيات الخبيثة المتقدمة',
    subtitle: 'تفكيك برمجيات الفدية وتطبيقات PE32/ELF، تفادي أدوات كشف الـ Sandbox، وتحليل الذاكرة الحي.',
    level: 'expert',
    levelLabelAr: 'خبير (مسار النخبة المتقدم)',
    isFree: false,
    priceUsd: 129,
    hours: 45,
    badge: 'KAyA DOCX · مدفوع ($129)',
    docMeta: {
      fileName: '12_Advanced_Malware_Reverse_Engineering.docx',
      fileSize: '8.4 MB',
      pages: 110,
      wordsCount: 36500,
      lastUpdated: '2026-10-12',
      author: 'KAyA_SafeSec Reversing Unit',
    },
    learningOutcomes: [
      'استخدام Ghidra و x64dbg لتفكيك وتتبع تدفق التعليمات البرمجية بالـ Assembly',
      'كشف تقنيات التخفي والحقن مثل Process Hollowing و APC Injection',
      'استخراج مفاتيح التشفير ومؤشرات الاختراق IOCs من البرمجيات الخبيثة المعقدة',
    ],
    prerequisites: ['إلمام بلغات C/C++ وبنية المعالجات x86/x64'],
    chapters: [
      {
        number: '01',
        title: 'تشريح بنية ملفات PE وتجاوز آليات مكافحة التنقيح',
        sections: [
          {
            subtitle: '1.1 فحص ترويسات Portable Executable',
            content: 'التعامل مع ملفات DLL المحقونة، تفحص جدول الاستيراد IAT، وتجاوز فحوصات IsDebuggerPresent.',
            codeOrBox: 'MOV EAX, FS:[30h] ; الحصول على مؤشر PEB\nMOVZX EAX, BYTE PTR [EAX+2] ; فحص علم BeingDebugged'
          }
        ]
      }
    ]
  },
  {
    id: 'word-exp-13',
    title: 'أمن الذكاء الاصطناعي وتأمين نماذج LLM المؤسسية',
    subtitle: 'مخاطر OWASP LLM 2025، هندسة هجمات Prompt Injection، وتأمين سلاسل RAG والوكالات الذكية.',
    level: 'expert',
    levelLabelAr: 'خبير (مسار النخبة المتقدم)',
    isFree: false,
    priceUsd: 99,
    hours: 32,
    badge: 'KAyA DOCX · مدفوع ($99)',
    docMeta: {
      fileName: '13_Enterprise_AI_LLM_Security_Architecture.docx',
      fileSize: '5.9 MB',
      pages: 76,
      wordsCount: 25100,
      lastUpdated: '2026-10-14',
      author: 'KAyA_SafeSec AI Defense Lab',
    },
    learningOutcomes: [
      'تأمين خطوط إمداد نماذج الذكاء الاصطناعي (AI Supply Chain Security)',
      'بناء جدران حماية دلالية (Semantic Guardrails) لفرز المدخلات والمخرجات',
      'منع تسريب البيانات الحساسة عبر هجمات حقن الأوامر غير المباشرة (Indirect Injection)',
    ],
    prerequisites: ['فهم بنية نماذج التعلم العميق والـ APIs وتطبيقات الويب'],
    chapters: [
      {
        number: '01',
        title: 'هجمات كسر القيود (Jailbreak Taxonomy) وحقن الأوامر',
        sections: [
          {
            subtitle: '1.1 استراتيجيات الدفاع متعددة الطبقات في RAG',
            content: 'كيفية عزل مستندات الاسترجاع وتشفير السياق لمنع استغلال وثائق ملوثة بحقن أوامر تستهدف سرقة بيانات المستخدمين.',
            codeOrBox: 'Defensive Architecture: Input Sanitize -> Semantic Guardrail -> Sandboxed LLM -> Output Verification'
          }
        ]
      }
    ]
  },
  {
    id: 'word-exp-14',
    title: 'صيد التهديدات المتقدم وهندسة الكشف (Threat Hunting)',
    subtitle: 'صياغة فرضيات الصيد، كتابة قواعد Sigma و YARA، وتتبع سلوك المهاجمين المستمر APT.',
    level: 'expert',
    levelLabelAr: 'خبير (مسار النخبة المتقدم)',
    isFree: false,
    priceUsd: 119,
    hours: 38,
    badge: 'KAyA DOCX · مدفوع ($119)',
    docMeta: {
      fileName: '14_Threat_Hunting_Detection_Engineering.docx',
      fileSize: '6.5 MB',
      pages: 82,
      wordsCount: 27900,
      lastUpdated: '2026-10-09',
      author: 'KAyA_SafeSec Threat Intelligence',
    },
    learningOutcomes: [
      'تحويل تقارير استخبارات التهديدات (CTI) إلى قواعد كشف آلية',
      'صياغة استعلامات متقدمة للبحث عن الهجمات التي لا تصدر إنذارات واضحة',
      'بناء واختبار قواعد YARA لمسح الذاكرة ونظام الملفات',
    ],
    prerequisites: ['خبرة سابقة في SOC أو الاستجابة للحوادث'],
    chapters: [
      {
        number: '01',
        title: 'منهجيات صيد التهديدات الاستباقية',
        sections: [
          {
            subtitle: '1.1 صياغة الفرضيات بالاعتماد على MITRE ATT&CK',
            content: 'التركيز على تقنيات المهاجمين (TTPs) عوضاً عن مؤشرات الاختراق سريعة التغير مثل عناوين الـ IP أو تجزئات الملفات.',
            codeOrBox: 'Sigma Rule Target: CommandLine contains "powershell.exe -enc" AND ParentProcess contains "w3wp.exe"'
          }
        ]
      }
    ]
  },
  {
    id: 'word-exp-15',
    title: 'أمن السحابة والحاويات (Cloud & Kubernetes Mastery)',
    subtitle: 'تأمين بنية AWS/GCP السحابية، حماية بيئات Docker و K8s، وتطبيق مبدأ الثقة الصفرية Zero Trust.',
    level: 'expert',
    levelLabelAr: 'خبير (مسار النخبة المتقدم)',
    isFree: false,
    priceUsd: 129,
    hours: 42,
    badge: 'KAyA DOCX · مدفوع ($129)',
    docMeta: {
      fileName: '15_Cloud_Kubernetes_ZeroTrust_Mastery.docx',
      fileSize: '7.1 MB',
      pages: 88,
      wordsCount: 29400,
      lastUpdated: '2026-10-10',
      author: 'KAyA_SafeSec Cloud Architecture',
    },
    learningOutcomes: [
      'تدقيق صلاحيات IAM في السحابة واكتشاف مسارات تصعيد الصلاحيات السحابية',
      'تأمين حاويات Docker وعزل Pods في Kubernetes باستخدام NetworkPolicies',
      'تطبيق نموذج الثقة الصفرية (Never Trust, Always Verify)',
    ],
    prerequisites: ['فهم معماريات السحابة واستخدام الحاويات والحزم'],
    chapters: [
      {
        number: '01',
        title: 'تأمين عنقود Kubernetes والتحكم في النفاذ RBAC',
        sections: [
          {
            subtitle: '1.1 عزل الصلاحيات ومنع الهروب من الحاوية (Container Escape)',
            content: 'تعطيل الحاويات ذات الصلاحيات المرتفعة (Privileged Containers)، وفرض تشفير الأسرار المخزنة في etcd.',
            codeOrBox: 'securityContext:\n  privileged: false\n  readOnlyRootFilesystem: true\n  allowPrivilegeEscalation: false'
          }
        ]
      }
    ]
  }
];
