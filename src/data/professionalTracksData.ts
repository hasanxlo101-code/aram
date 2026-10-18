import { ProfessionalTrack } from '../types/professionalTracks';

export const PROFESSIONAL_TRACKS: ProfessionalTrack[] = [
  {
    id: 'track-foundations',
    category: 'foundations',
    title: 'أساسيات الأمن السيبراني وهندسة الدفاع',
    titleEn: 'Cybersecurity Foundations & Defense Engineering',
    level: 'مبتدئ',
    durationWeeks: 4,
    icon: 'ShieldCheck',
    description: 'بناء الأساس التقني والعملي الشامل في أمن الشبكات والأنظمة ونموذج CIA والتحكم بالوصول والتشفير التطبيقي.',
    objectives: [
      'فهم نماذج التهديدات الحديثة ونموذج الثقة الصفرية Zero Trust',
      'إتقان تحليل بروتوكولات الشبكات (TCP/IP, DNS, TLS, ARP)',
      'تطبيق التشفير المتماثل وغير المتماثل وإدارة المفاتيح',
      'تأمين أنظمة Linux و Windows وفق معايير CIS Benchmarks'
    ],
    prerequisites: ['معرفة أساسية بأنظمة التشغيل ومبادئ شبكات الحاسوب'],
    targetRoles: ['Junior Security Analyst', 'IT Security Specialist', 'Systems Administrator'],
    skillsGained: ['Network Analysis', 'Cryptography', 'Linux Hardening', 'Access Control (RBAC/ABAC)', 'Threat Modeling'],
    lessons: [
      {
        id: 'foundations-1',
        title: 'ثلاثية الأمان ونماذج التهديد (CIA Triad & STRIDE)',
        durationMinutes: 45,
        summary: 'شرح معمق لمبادئ السرية والتكاملية والتوافر ونمذجة التهديدات البرمجية والتشغيلية.',
        content: [
          'يمثل ثالوث CIA (السرية Confidentiality، السلامة Integrity، والتوافر Availability) حجر الزاوية في أي بنية أمنية قوية.',
          'تعد منهجية STRIDE المطورة من مايكروسوفت أداة قياسية لتصنيف التهديدات: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.',
          'التقليل من مساحة الهجوم (Attack Surface Reduction) يتطلب إغلاق المنافذ غير المستخدمة وتطبيق مبدأ الصلاحيات الأقل (Least Privilege).'
        ],
        codeExamples: [
          {
            language: 'bash',
            title: 'فحص المنافذ والخدمات النشطة بأمر ss و netstat',
            code: 'ss -tulpn | grep LISTEN\n# التحقق من أن الخدمات تستمع فقط على 127.0.0.1 وليس 0.0.0.0 دون داعٍ'
          }
        ],
        keyTakeaways: [
          'الأمان ليس منتجاً بل عملية مستمرة ومتكاملة',
          'تصنيف التهديدات عبر STRIDE يسبق مرحلة بناء الكود أو نشر البنية التحتية'
        ],
        quiz: {
          question: 'أي من التهديدات التالية في نموذج STRIDE يتعلق بتعديل البيانات أثناء الإرسال دون تخويل؟',
          options: ['Spoofing', 'Tampering', 'Repudiation', 'Elevation of Privilege'],
          correctAnswerIndex: 1,
          explanation: 'Tampering يعني التلاعب أو التعديل غير المصرح به على البيانات مما ينتهك مبدأ النزاهة (Integrity).'
        }
      },
      {
        id: 'foundations-2',
        title: 'تحليل حركة الشبكات والتقاط الحزم بواسطة Wireshark و TShark',
        durationMinutes: 55,
        summary: 'تعلم فحص مصافحة TCP Three-Way Handshake، واكتشاف تسريبات DNS، وتحليل جلسات TLS.',
        content: [
          'التقاط الحزم (Packet Capture) هو الأسلوب الأكثر موثوقية للتحقق مما يدور في الشبكة فعلياً.',
          'يتم فحص حزم SYN, SYN-ACK, ACK للتأكد من إتمام الاتصال، ورصد محاولات SYN Flood الهجومية.',
          'تساعد مرشحات Wireshark مثل (tcp.flags.reset==1 or dns.flags.response==0) في استكشاف الأعطال وحركات الاختراق.'
        ],
        codeExamples: [
          {
            language: 'bash',
            title: 'التقاط حركة مرور مشبوهة بواسطة TShark',
            code: 'tshark -i eth0 -f "tcp port 80 or tcp port 443" -w /tmp/capture.pcap\ntshark -r /tmp/capture.pcap -Y "http.request.method == POST" -T fields -e ip.src -e http.host -e http.request.uri'
          }
        ],
        keyTakeaways: [
          'الحزم المشفرة تكشف أيضاً أبعاداً استخباراتية عبر فحص شهادات TLS و SNI و أحجام التدفقات',
          'المرشحات المتقدمة توفر ساعات من التحليل اليدوي المرهق'
        ],
        quiz: {
          question: 'ما هو الفلتر المستخدم في Wireshark لإظهار حزم استعلامات DNS الفاشلة؟',
          options: ['dns.flags.rcode != 0', 'http.response.code >= 400', 'tcp.port == 53', 'ip.addr == 8.8.8.8'],
          correctAnswerIndex: 0,
          explanation: 'الرمز dns.flags.rcode != 0 يعزل استعلامات DNS التي رد الخادم عليها بأخطاء مثل NXDomain أو Server Failure.'
        }
      }
    ],
    capstoneProject: {
      id: 'capstone-foundations',
      title: 'بناء وتدقيق معمارية دفاعية لمؤسسة افتراضية مع تقرير CIS',
      trackId: 'track-foundations',
      difficulty: 'مبتدئ',
      estimatedHours: 12,
      scenario: 'طلب منك عميل مالي صغير تأمين شبكته الداخلية ومخدم الويب التابع له وفق معايير CIS Benchmarks وتقديم تقرير تدقيق هندسي يوضح الثغرات ونقاط القوة.',
      objectives: [
        'إجراء مسح أمني شامل للمنافذ والخدمات',
        'تطبيق جدار الحماية iptables/ufw وقواعد عزل الشبكة VLAN',
        'كتابة تقرير أمني تنفيذي وتقرير فني للمدير التقني'
      ],
      deliverables: ['ملف تكوين جدار الحماية hardening.sh', 'تقرير مصفوفة المخاطر Risk Matrix PDF', 'خطة معالجة الثغرات Remediation Roadmap'],
      evaluationRubric: [
        { criterion: 'دقة تقييم المخاطر وتصنيفها', weight: 35, description: 'استخدام تصنيف CVSS/STRIDE بدقة دون إفراط أو تفريط' },
        { criterion: 'جودة قواعد جدار الحماية وحزم الأمان', weight: 40, description: 'منع الحركة غير المصرح بها مع الحفاظ على استمرارية العمل' },
        { criterion: 'وضوح التقرير التنفيذي للقيادة', weight: 25, description: 'لغة مهنية مباشرة مع جدول زمني وتوصيات قابلة للقياس' }
      ]
    }
  },
  {
    id: 'track-soc',
    category: 'soc',
    title: 'فريق الدفاع الأزرق وتحليل مركز العمليات السيبرانية SOC',
    titleEn: 'Blue Team & SOC Operations Analysis',
    level: 'متوسط',
    durationWeeks: 6,
    icon: 'Terminal',
    description: 'تأهيل محللي SOC من المستوى الأول والثاني (L1/L2) لإدارة الحوادث، وتحليل السجلات، وصياغة قواعد Sigma، ورصد هجمات MITRE ATT&CK.',
    objectives: [
      'فحص سجلات أنظمة التشغيل وحلول SIEM (Elasticsearch, Splunk, Wazuh)',
      'بناء وتعديل قواعد رصد الهجمات وفق لغة Sigma و YARA',
      'إتقان مراحل دورة حياة الحوادث السيبرانية وفق NIST SP 800-61',
      'كشف تحركات المهاجمين الجانبية (Lateral Movement) وتقنيات Pass-the-Hash'
    ],
    prerequisites: ['إتمام مسار الأساسيات أو إتقان مبادئ الشبكات وسجلات الأحداث'],
    targetRoles: ['SOC Analyst L1/L2', 'Security Operations Engineer', 'Incident Responder'],
    skillsGained: ['SIEM Engineering', 'Sigma Rules', 'Threat Hunting', 'Log Analysis', 'MITRE ATT&CK Mapping'],
    lessons: [
      {
        id: 'soc-1',
        title: 'فرز وتصنيف التنبيهات وإدارة الحوادث (Incident Triage & NIST Lifecycle)',
        durationMinutes: 50,
        summary: 'كيفية تقييم الإنذارات المتدفقة للـ SOC وفصل الإشارات الحقيقية عن الضوضاء وتطبيق نموذج NIST.',
        content: [
          'تبدأ دورة حياة الحادث وفق معيار NIST بأربعة أطوار: الإعداد والتجهيز، الاكتشاف والتحليل، الاحتواء والاستئصال والتعافي، ومراجعة ما بعد الحادث (Post-Incident Review).',
          'التصنيف الأولي السريع (Triage) يعتمد على قياس الأثر المحتمل، وحساسية الأصل المتضرر، ومدى انتشار التهديد.',
          'الإنذارات الزائفة (False Positives) تسبب إرهاق التنبيهات (Alert Fatigue)، لذلك يجب ضبط القواعد وتغذيتها بسياق موثوق.'
        ],
        codeExamples: [
          {
            language: 'yaml',
            title: 'قاعدة رصد Sigma لاكتشاف استدعاء PowerShell مشبوه مع خيارات خفية',
            code: 'title: Suspicious Encoded PowerShell Execution\nstatus: production\nlogsource:\n  category: process_creation\n  product: windows\ndetection:\n  selection:\n    Image|endswith: \'\\powershell.exe\'\n    CommandLine|contains:\n      - \' -enc \'\n      - \' -EncodedCommand \'\n      - \' -w hidden \'\n  condition: selection\nlevel: high'
          }
        ],
        keyTakeaways: [
          'توثيق الخطوات الزمنية (Timeline) في كل مرحلة أمر حاسم للمسؤولية القانونية والتقنية',
          'الاحتواء السريع يمنع الحادث المحدود من التحول إلى كارثة مؤسسية'
        ],
        quiz: {
          question: 'ما هي الخطوة الفورية الموصى بها في مرحلة الاحتواء عند رصد اتصال جهاز بمخدم C2 معادٍ؟',
          options: ['مسح نظام التشغيل وإعادة تثبيته فوراً', 'عزل الجهاز شبكياً مع الحفاظ على الذاكرة الحية RAM', 'إرسال بريد إلكتروني لجميع الموظفين', 'إيقاف خوادم الـ Active Directory'],
          correctAnswerIndex: 1,
          explanation: 'عزل الجهاز شبكياً يقطع تواصل المهاجم دون إتلاف الأدلة الرقمية الموجودة في الذاكرة الحية (RAM Forensics).'
        }
      },
      {
        id: 'soc-2',
        title: 'استقصاء التهديدات والربط مع إطار عمل MITRE ATT&CK',
        durationMinutes: 60,
        summary: 'تحويل تكتيكات المهاجمين (TTPs) إلى سيناريوهات رصد استباقية تصيداً للخصوم.',
        content: [
          'يوفر إطار MITRE ATT&CK لغة مشتركة لتصنيف سلوكيات المهاجمين عبر 14 تكتيكاً ومئات التقنيات الفرعية.',
          'صيد التهديدات (Threat Hunting) يفترض أن المهاجم تجاوز دفاعاتك الخارجية وهو موجود فعلاً داخل الشبكة.',
          'تحليل سجلات Sysmon (خاصة Event ID 1 و 3 و 8) يكشف حقن العمليات وإنشاء المفاتيح واستدعاء ملفات DLL المشبوهة.'
        ],
        codeExamples: [
          {
            language: 'sql',
            title: 'استعلام KQL للبحث عن عمليات إنشاء مستخدمين محليين غير اعتيادية',
            code: 'SecurityEvent\n| where EventID == 4720\n| project TimeGenerated, AccountName=TargetUserName, AdminUser=SubjectUserName, Computer\n| order by TimeGenerated desc'
          }
        ],
        keyTakeaways: [
          'التركيز على سلوك المهاجم (TTPs) أصعب بكثير على الخصم تجاوزه من مجرد رصد تجزئات الملفات (Hashes)',
          'تحتاج فرق الـ SOC لأتمتة المهام المتكررة عبر أنظمة SOAR لتسريع وقت الاستجابة (MTTR)'
        ],
        quiz: {
          question: 'ما هو معرف حدث Windows Security الخاص بإنشاء حساب مستخدم جديد؟',
          options: ['Event ID 4624', 'Event ID 4720', 'Event ID 7045', 'Event ID 1102'],
          correctAnswerIndex: 1,
          explanation: 'الحدث 4720 يشير إلى "A user account was created" وهو مؤشر مهم عند مراجعة محاولات تثبيت الاستدامة (Persistence).'
        }
      }
    ],
    capstoneProject: {
      id: 'capstone-soc',
      title: 'محاكاة تحقيق في هجوم فدية متقدم وصياغة استجابة SOC متكاملة',
      trackId: 'track-soc',
      difficulty: 'متوسط',
      estimatedHours: 16,
      scenario: 'تلقى مركز الـ SOC إنذارات متزامنة تفيد بقيام مستخدم عادي بتشغيل سكربت VBS مشبوه أدى لتحميل حمولة Cobalt Strike ومحاولة الوصول إلى خادم الملفات.',
      objectives: [
        'إعادة بناء الجدول الزمني للحادث من سجلات Sysmon و Firewall',
        'صياغة قاعدة Sigma مخصصة لاكتشاف التهديد مستقبلاً',
        'إعداد تقرير التحقيق النهائي وخطة المعالجة التنظيمية'
      ],
      deliverables: ['جدول زمني للحادث Incident Timeline CSV', 'قاعدة رصد YARA/Sigma', 'تقرير الحادث الفني النهائي Post-Mortem Report'],
      evaluationRubric: [
        { criterion: 'دقة تحديد المريض رقم صفر (Patient Zero) ومصدر الدخول', weight: 40, description: 'تتبع السجلات حتى أول مؤشر تسلل حقيقي' },
        { criterion: 'جودة قواعد الرصد المقترحة وخلوها من الإنذارات الخاطئة', weight: 30, description: 'كتابة شروط محكمة تعزل النشاط المشبوه بدقة' },
        { criterion: 'كفاءة تدابير الاحتواء والدروس المستفادة', weight: 30, description: 'توصيات واقعية تمنع تكرار الثغرة هندسياً وإجرائياً' }
      ]
    }
  },
  {
    id: 'track-web',
    category: 'web',
    title: 'أمن تطبيقات الويب والبرمجة الآمنة',
    titleEn: 'Web Security & Secure Application Development',
    level: 'متوسط',
    durationWeeks: 6,
    icon: 'Globe',
    description: 'استكشاف شامل لثغرات OWASP Top 10 وآليات استغلالها ومعالجتها عملياً على مستوى الشيفرة البرمجية وبنية الخوادم.',
    objectives: [
      'إتقان تحليل ثغرات حقن الأوامر و SQLi و SSRF و IDOR و XSS و CSRF',
      'فحص ومعالجة مشكلات المصادقة والتحكم بالصلاحيات (Broken Access Control)',
      'تطبيق مبادئ البرمجة الدفاعية وإدخال اختبارات الأمان في خطوط CI/CD (DevSecOps)',
      'تأمين واجهات البرمجة REST APIs وآليات التفويض المبنية على JWT و OAuth'
    ],
    prerequisites: ['معرفة بتطوير الويب (HTML/JS/Backend) وبروتوكول HTTP'],
    targetRoles: ['Application Security Engineer', 'Penetration Tester', 'Full-Stack Secure Developer'],
    skillsGained: ['OWASP Top 10 Mitigation', 'Code Review', 'Burp Suite', 'API Security', 'SQLi & XSS Defense'],
    lessons: [
      {
        id: 'web-1',
        title: 'حقن لغة الاستعلامات البنيوية (SQL Injection): الآلية والوقاية الجوهرية',
        durationMinutes: 50,
        summary: 'تشريح ثغرات SQLi بأنواعها (In-band, Error-based, Blind) وتطبيق الاستعلامات المجهزة والمعيارية.',
        content: [
          'تحدث ثغرة SQL Injection عندما يتم دمج مدخلات المستخدم مباشرة في نص استعلام SQL دون تعقيم أو فصل منطقي.',
          'الحقن الأعمى المعتمد على الزمن (Time-based Blind SQLi) يستغل دوال مثل SLEEP() لاستنتاج محتويات قاعدة البيانات بايت تلو الآخر.',
          'الحل الوحيد الجذري لمنع حقن SQL هو استخدام الاستعلامات المجهزة (Parameterized Queries / Prepared Statements) أو مكتبات ORM الموثوقة.'
        ],
        codeExamples: [
          {
            language: 'typescript',
            title: 'مقارنة بين الكود الضعيف والكود المحمي ضد SQL Injection',
            code: '// ❌ كود غير آمن وضعيف وقابل للحقن:\nconst query = `SELECT * FROM users WHERE email = \'${req.body.email}\' AND pass = \'${req.body.pass}\'`;\n\n//  كود آمن يستخدم الاستعلامات المجهزة المربوطة (Parameterized Query):\nconst secureQuery = \'SELECT id, email, role FROM users WHERE email = $1 AND password_hash = $2\';\nconst result = await db.query(secureQuery, [req.body.email, computedHash]);'
          }
        ],
        keyTakeaways: [
          'فلاتر الكلمات المحظورة السوداء (Blacklists) سهلة الالتفاف وليست وسيلة أمان',
          'الاعتماد على المعاملات المربوطة يفصل البيانات عن الأوامر التنفيذية في محرك قواعد البيانات'
        ],
        quiz: {
          question: 'ما هو الأسلوب الأكثر فعالية وموثوقية لمنع ثغرات SQL Injection بالكامل في الكود البرمجي؟',
          options: ['حظر الكلمات مثل OR و UNION بالتعابير النمطية', 'استخدام الاستعلامات المجهزة مع ربط المعاملات (Prepared Statements)', 'تغيير اسم جدول المستخدمين', 'تشفير اسم قاعدة البيانات'],
          correctAnswerIndex: 1,
          explanation: 'الاستعلامات المجهزة تفصل بنية الاستعلام عن قيم المدخلات تماماً، مما يمنع محرك قاعدة البيانات من تفسير المدخلات كشيفرة تنفيذية.'
        }
      },
      {
        id: 'web-2',
        title: 'ثغرات تزييف الطلبات عبر الخادم (SSRF) وكسر التحكم بالوصول (IDOR)',
        durationMinutes: 55,
        summary: 'كيف يستغل المهاجمون خوادم الويب للوصول للخدمات السحابية الداخلية وملفات البيانات الحساسة.',
        content: [
          'تحدث ثغرة SSRF عندما يجبر الخادم على جلب موارد من عنوان خارجي أو داخلي دون قيود، كاستهداف الـ Cloud Metadata API (169.254.169.254).',
          'ثغرات كسر التحكم بالوصول على مستوى الكائن (Insecure Direct Object References - IDOR) تحدث عندما يعتمد الخادم على معرف مرسل من المستخدم دون التحقق من ملكيته.',
          'الوقاية من IDOR تتطلب التحقق الدائم من هوية المستخدم المسجل ومقارنتها بالسجل المطلوب في طبقة البيانات.'
        ],
        codeExamples: [
          {
            language: 'typescript',
            title: 'تحقق آمن لمنع ثغرات IDOR في مسار جلب تقارير الطلاب',
            code: 'app.get("/api/reports/:reportId", authenticateUser, async (req, res) => {\n  const { reportId } = req.params;\n  const currentUserId = req.user.id;\n  \n  const report = await db.reports.findUnique({ where: { id: reportId } });\n  if (!report || (report.ownerId !== currentUserId && req.user.role !== "ADMIN")) {\n    return res.status(403).json({ error: "غير مصرح لك باستعراض هذا المستند" });\n  }\n  return res.json(report);\n});'
          }
        ],
        keyTakeaways: [
          'لا تثق أبداً بأي معرف مرسل من العميل حتى لو كان رقماً تسلسلياً عادياً',
          'عزل واجهات الميتاداتا السحابية والشبكات الداخلية عبر جدران الحماية للحد من خطورة SSRF'
        ],
        quiz: {
          question: 'ما هو عنوان IP الشائع الخاص بخدمة الـ Metadata في السحابة (AWS/GCP/Azure) الذي يستهدفه المهاجمون غالباً عبر SSRF؟',
          options: ['127.0.0.1', '192.168.1.1', '169.254.169.254', '10.0.0.1'],
          correctAnswerIndex: 2,
          explanation: 'العنوان 169.254.169.254 هو عنوان Link-Local القياسي الذي يقدم بيانات وصفية وبيانات اعتماد IAM مؤقتة في بيئات السحابة.'
        }
      }
    ],
    capstoneProject: {
      id: 'capstone-web',
      title: 'تدقيق أمني واختراق أخلاقي لتطبيق تجارة إلكترونية وإصلاح كوده البرمجي',
      trackId: 'track-web',
      difficulty: 'متقدم',
      estimatedHours: 20,
      scenario: 'منصة تجارة إلكترونية افتراضية تعاني من مشاكل في سلة المشتريات ومسارات الدفع واستعراض الفواتير. المطلوب استخراج 3 ثغرات حرجة وتصحيحها في الكود.',
      objectives: [
        'اكتشاف ثغرة IDOR في تنزيل الفواتير وتوثيق خطوات الاستغلال الأخلاقي',
        'اكتشاف ثغرة تلاعب بالأسعار في سلة المشتريات ومعالجة منطق العمل (Business Logic)',
        'كتابة اختبارات وحدة أمنية (Security Unit Tests) تضمن عدم عودة الثغرات'
      ],
      deliverables: ['تقرير تدقيق كود واختراق برمجيات مطابق لـ OWASP', 'حزمة التصحيح البرمجية Git Patch / Code Diffs', 'اختبارات تحقق أمنية آلية'],
      evaluationRubric: [
        { criterion: 'دقة وتوثيق سيناريو إعادة إنتاج الثغرة (PoC)', weight: 35, description: 'خطوات واضحة قابلة للتكرار مع لقطات وتفاصيل طلبات HTTP' },
        { criterion: 'جودة الكود التصحيحي والتزامه بالممارسات الآمنة', weight: 45, description: 'إصلاح الخلل من الجذور دون التسبب بكسر لوظائف التطبيق' },
        { criterion: 'الشمولية في تغطية الحالات الحدية (Edge Cases)', weight: 20, description: 'اختبار مدخلات غير متوقعة وتفادي الالتفافات المحتملة' }
      ]
    }
  },
  {
    id: 'track-dfir',
    category: 'dfir',
    title: 'التحقيقات الرقمية والاستجابة للحوادث (DFIR)',
    titleEn: 'Digital Forensics & Incident Response',
    level: 'متقدم',
    durationWeeks: 8,
    icon: 'Search',
    description: 'تحليل الأدلة الجنائية الرقمية، وتفريغ الذاكرة العشوائية RAM، واستخراج بقايا النشاط من سجلات NTFS و Prefetch و LNK وملفات النظام.',
    objectives: [
      'استخراج وفحص صور الذاكرة الحية باستخدام أدوات مثل Volatility 3',
      'فحص أدلة نظام Windows الأساسية (Registry, Amcache, MFT, Shimcache, Event Logs)',
      'التحقيق في هجمات اختراق بيئات Linux والخوادم السحابية',
      'الحفاظ على سلسلة الحيازة للأدلة (Chain of Custody) وكتابة تقارير المحاكم والخبراء'
    ],
    prerequisites: ['إلمام عميق بأنظمة التشغيل Windows/Linux وهيكلية الملفات ونموذج الذاكرة'],
    targetRoles: ['Digital Forensics Investigator', 'Incident Response Lead', 'Malware Analyst'],
    skillsGained: ['Memory Forensics', 'Disk Forensics', 'Volatility 3', 'Chain of Custody', 'Timeline Reconstruction'],
    lessons: [
      {
        id: 'dfir-1',
        title: 'التحقيق في الذاكرة الحية (Memory Forensics) باستخدام Volatility',
        durationMinutes: 60,
        summary: 'اكتشاف العمليات الخفية وحقن الشيفرات وروابط الشبكة غير النشطة من تفريغ الـ RAM.',
        content: [
          'الذاكرة العشوائية RAM هي المستودع الوحيد لحمولات البرمجيات الخبيثة التي لا تلمس القرص (Fileless Malware).',
          'يوفر إطار Volatility 3 إضافات قياسية مثل windows.pslist و windows.psscan و windows.malfind للتعرف على الصفحات البرمجية المحقونة (PAGE_EXECUTE_READWRITE).',
          'فحص شجرة العمليات ومقارنة العمليات الآباء بالعمليات الأبناء (Process Parent-Child Relationships) يكشف العمليات الشاذة مثل تشغيل cmd.exe من داخل sqlservr.exe.'
        ],
        codeExamples: [
          {
            language: 'bash',
            title: 'أوامر تحليل الذاكرة الأساسية بواسطة Volatility 3',
            code: '# سرد العمليات مع كشف العمليات المخفية عبر فحص مساحة الذاكرة غير المرتبطة:\npython3 vol.py -f memory.raw windows.psscan\n\n# البحث عن مناطق الذاكرة المحقونة بشيفرات خبيثة:\npython3 vol.py -f memory.raw windows.malfind --dump'
          }
        ],
        keyTakeaways: [
          'يجب أخذ لقطة الذاكرة الحية أولاً قبل إيقاف تشغيل الجهاز لتفادي فقدان المفاتيح والاتصالات المؤقتة',
          'تحليل الـ VAD (Virtual Address Descriptors) يعزل التخصيصات المشبوهة للذاكرة بدقة فائقة'
        ],
        quiz: {
          question: 'ما هي صلاحية صفحة الذاكرة التي يعتبرها المحلل الجنائي مؤشراً قوياً على وجود حقن شيفرة خبيثة (Code Injection)؟',
          options: ['PAGE_READONLY', 'PAGE_NOACCESS', 'PAGE_EXECUTE_READWRITE', 'PAGE_WRITECOPY'],
          correctAnswerIndex: 2,
          explanation: 'الصفحات التي تجمع بين إمكانية الكتابة والتنفيذ (PAGE_EXECUTE_READWRITE) تستخدم لتنزيل وتنفيذ شل كود في مساحة عملية أخرى.'
        }
      },
      {
        id: 'dfir-2',
        title: 'أدلة التنفيذ والنشاط في Windows: Prefetch و Amcache و LNK',
        durationMinutes: 55,
        summary: 'إثبات تشغيل البرامج وتواريخ أول وآخر تشغيل ومسارات المجلدات حتى لو قام المهاجم بمسح الملف التنفيذي.',
        content: [
          'ملفات Prefetch (.pf) تسجل أسماء الملفات التنفيذية وعدد مرات تشغيلها وآخر 8 تواريخ تشغيل وقائمة ملفات الـ DLL المحملة.',
          'سجل Amcache.hve و Shimcache يتيحان استخراج تجزئة SHA-1 للملف التنفيذي وتاريخ تثبيته ومساره الكامل.',
          'ملفات الاختصار Shell LNK ومجلد Jump Lists تكشف الملفات التي فتحها المستخدم أو المهاجم ومسارات وحدات التخزين الخارجية.'
        ],
        codeExamples: [
          {
            language: 'powershell',
            title: 'استخراج تفاصيل ملفات Prefetch لفحص النشاط المشبوه',
            code: 'Get-ChildItem -Path "C:\\Windows\\Prefetch" -Filter "*.pf" | \n  Sort-Object LastWriteTime -Descending | \n  Select-Object -First 20 Name, LastWriteTime, Length'
          }
        ],
        keyTakeaways: [
          'حذف المهاجم للملف الأصلي لا يمحو أثره من ملفات الـ Prefetch وجدول MFT',
          'تطابق التواريخ بين الأدلة المختلفة ينشئ تسلسلاً زمنياً غير قابل للشك أمام لجان التحقيق'
        ],
        quiz: {
          question: 'ما هي الفائدة الجنائية الرئيسية لملفات Prefetch في نظام Windows؟',
          options: ['تخزين كلمات مرور المستخدمين', 'إثبات واقعة تشغيل برنامج معين وتاريخ ووقت تشغيله الأخير', 'تسريع اتصال كرت الشبكة', 'تشفير سجلات النظام'],
          correctAnswerIndex: 1,
          explanation: 'ملفات Prefetch صممت لتسريع إقلاع التطبيقات، ولكنها جنائياً تثبت تشغيل التطبيق وعدد مرات التشغيل وآخر توقيتات تنفيذ.'
        }
      }
    ],
    capstoneProject: {
      id: 'capstone-dfir',
      title: 'تحقيق جنائي رقمي في تسريب بيانات سرية واستخراج مسار الاختراق بالكامل',
      trackId: 'track-dfir',
      difficulty: 'احترافي',
      estimatedHours: 24,
      scenario: 'أبلغت شركة برمجيات عن تسريب كودها المصدري إلى الإنترنت. توفرت لديك صورة قرص E01 وصورة ذاكرة RAM لجهاز مهندس أول في الشركة.',
      objectives: [
        'تأكيد سلامة الأدلة الرقمية عبر مطابقة قيم الـ Hash (MD5/SHA256)',
        'استخراج الأدلة من سجلات MFT والـ Registry والـ Browser History',
        'تحديد وسيلة التسريب (فلاش USB، تخزين سحابي، أو قناة C2 خلفية)'
      ],
      deliverables: ['سجل سلسلة الحيازة Chain of Custody Form', 'جدول زمني متكامل للأحداث Super-Timeline', 'تقرير الخبير الجنائي المعتمد Forensic Examination Report'],
      evaluationRubric: [
        { criterion: 'سلامة الإجراءات والالتزام بمعايير الأدلة الجنائية', weight: 30, description: 'توثيق قيم الهاش وطرق الاستخراج دون إتلاف الدليل' },
        { criterion: 'دقة وتكامل الجدول الزمني للجريمة الرقمية', weight: 45, description: 'ربط أحداث القرص بالذاكرة والشبكة لإثبات تسلسل الفعل' },
        { criterion: 'قوة الاستنتاجات الفنية وتماسك التقرير', weight: 25, description: 'خلو التقرير من التخمينات غير المدعومة بأدلة رقمية قاطعة' }
      ]
    }
  },
  {
    id: 'track-osint',
    category: 'osint',
    title: 'الاستخبارات مفتوحة المصدر وتحليل التهديدات (OSINT)',
    titleEn: 'Open Source Intelligence & Threat Analysis',
    level: 'متوسط',
    durationWeeks: 5,
    icon: 'Radar',
    description: 'جمع وتحليل المعلومات من المصادر العلنية، ورسم البصمة الرقمية للشركات والأفراد، ومراقبة الويب المظلم وقواعد البيانات المسربة.',
    objectives: [
      'تطبيق دورة الاستخبارات الكاملة (Intelligence Lifecycle: Planning to Dissemination)',
      'إجراء استطلاع البنية التحتية والشبكات والأصول السحابية عبر DNS و WHOIS و Shodan و Censys',
      'كشف الحسابات والهويات الرقمية وتقنيات تقاطع البيانات (Cross-referencing)',
      'مراقبة تسريبات البيانات وحسابات الاعتماد المسروقة والتحقق من صحتها بأمان'
    ],
    prerequisites: ['معرفة بمحركات البحث وعمل بروتوكولات الإنترنت ومبادئ التحقيق والبحث المتقدم'],
    targetRoles: ['OSINT Investigator', 'Threat Intelligence Analyst (CTI)', 'Fraud & Risk Analyst'],
    skillsGained: ['SOCMINT', 'GEOINT', 'Threat Intelligence', 'Digital Footprinting', 'Data Leak Investigation'],
    lessons: [
      {
        id: 'osint-1',
        title: 'استخبارات البنية التحتية والبحث المتقدم في Shodan و Censys',
        durationMinutes: 50,
        summary: 'اكتشاف الأجهزة المتصلة بالإنترنت والشهادات الرقمية والمنافذ المفتوحة والمخازن السحابية المكشوفة.',
        content: [
          'تعتمد محركات مثل Shodan على مسح عناوين IPv4 بشكل دوري وجمع لافتات الخدمات (Service Banners).',
          'استخدام مرشحات دقيقة مثل org:"Target Org" port:"3389" country:"SA" يكشف خوادم RDP المكشوفة مباشرة للإنترنت دون حماية.',
          'تتيح سجلات شفافية الشهادات (Certificate Transparency Logs - crt.sh) استخراج جميع النطاقات الفرعية (Subdomains) التي حصلت على شهادات SSL.'
        ],
        codeExamples: [
          {
            language: 'bash',
            title: 'استخراج النطاقات الفرعية تلقائياً عبر سجلات الشهادات الرقمية crt.sh',
            code: 'curl -s "https://crt.sh/?q=%25.targetdomain.com&output=json" | jq -r \'.[].name_value\' | sort -u'
          }
        ],
        keyTakeaways: [
          'أكبر خطر على المؤسسات يأتي غالباً من خوادم التجارب المنسية (Shadow IT)',
          'البحث عن تجزئات شهادات الـ SSL يربط الخوادم ببعضها حتى لو كانت مخفية خلف خدمات مثل Cloudflare'
        ],
        quiz: {
          question: 'ما هو الهدف الأساسي من فحص سجلات Certificate Transparency في مرحلة الاستطلاع؟',
          options: ['كسر تشفير كلمات المرور', 'اكتشاف النطاقات الفرعية والأصول المرتبطة بالمؤسسة', 'إرسال هجمات حجب خدمة', 'تعديل سجلات DNS للمؤسسة'],
          correctAnswerIndex: 1,
          explanation: 'سجلات شفافية الشهادات عامة وتسجل كل شهادة SSL تم إصدارها، مما يكشف النطاقات الفرعية الرسمية والتجريبية بدقة.'
        }
      },
      {
        id: 'osint-2',
        title: 'تحقيق الهويات الرقمية والتحقق من التسريبات وتتبع البصمة الرقمية',
        durationMinutes: 55,
        summary: 'كيفية مطابقة المعرفات، وفحص تسريبات كلمات المرور المجمعة، وتقييم مصداقية المصادر.',
        content: [
          'البصمة الرقمية (Digital Footprint) تتألف من البصمة النشطة (التي ينشرها الهدف بنفسه) والبصمة الخاملة (التي تسجلها الأنظمة عنه).',
          'تقاطع البيانات عبر تجزئات البريد الإلكتروني (MD5/SHA1 Gravatar) وأسماء المستخدمين المشتركة عبر المنصات يقود لكشف الحسابات البديلة.',
          'التحقق من تسريبات البيانات يتطلب التعامل الحذر مع قواعد الكومبليشن (Compilation of Many Breaches - COMB) دون تشغيل ملفات ضارة.'
        ],
        codeExamples: [
          {
            language: 'python',
            title: 'سكربت للتحقق من وجود صورة Gravatar لحساب بريد إلكتروني',
            code: 'import hashlib, requests\nemail = "test@example.com".strip().lower()\nemail_hash = hashlib.md5(email.encode("utf-8")).hexdigest()\nurl = f"https://www.gravatar.com/avatar/{email_hash}?d=404"\nresponse = requests.get(url)\nprint("Avatar Found!" if response.status_code == 200 else "No profile")'
          }
        ],
        keyTakeaways: [
          'يجب دائماً استخدام بيئات عزل (Sock Puppets & VMs) لعدم تسريب هويتك الحقيقية أثناء التحقيق',
          'التحقق من صحة المعلومة من مصدرين مستقلين على الأقل قبل إدراجها كحقيقة في التقرير'
        ],
        quiz: {
          question: 'ما هو المفهوم الاستخباراتي الذي يعني إنشاء هوية وهمية معزولة للتحقيق دون كشف هوية المحلل؟',
          options: ['Honeypot', 'Sock Puppet', 'Buffer Overflow', 'Man-in-the-Middle'],
          correctAnswerIndex: 1,
          explanation: 'حسابات الـ Sock Puppet هي هويات وهمية متكاملة يبنيها المحلل للبحث والتفاعل مع الأهداف بأمان وسرية تامة.'
        }
      }
    ],
    capstoneProject: {
      id: 'capstone-osint',
      title: 'خريطة البصمة الرقمية الشاملة وتقرير استخبارات التهديدات لمؤسسة مستهدفة',
      trackId: 'track-osint',
      difficulty: 'متوسط',
      estimatedHours: 18,
      scenario: 'طلب بنك افتراضي رسم بصمته الرقمية بالكامل من مصادر علنية وكشف ما إذا كان أي من مدراءه أو أصوله قد تعرض لتسريب أو مساحة هجوم مكشوفة.',
      objectives: [
        'حصر النطاقات والمخازن السحابية وأجهزة الخوادم المكشوفة',
        'فحص تسريبات البريد الإلكتروني ورسم شبكة العلاقات الرقمية',
        'صياغة تقرير استخباري تنفيذي مع توصيات عملية لسد الثغرات'
      ],
      deliverables: ['خريطة الأصول الرقمية Asset Inventory Sheet', 'مخطط العلاقات والروابط Entity Graph', 'تقرير استخبارات التهديدات التكتيكي والاستراتيجي CTI Report'],
      evaluationRubric: [
        { criterion: 'عمق البحث والوصول للأصول غير المعلنة (Shadow IT)', weight: 40, description: 'كشف خدمات غير محمية أو نطاقات اختبارية منسية' },
        { criterion: 'دقة التحليل والربط المنطقي بين المعطيات', weight: 35, description: 'تجنب النتائج الإيجابية الزائفة ومطابقة الأدلة من مصادر متعددة' },
        { criterion: 'الالتزام بالأخلاقيات والقوانين المنظمة لجمع المعلومات', weight: 25, description: 'الاعتماد الكلي على المصادر المشروعة دون اختراق فعلي' }
      ]
    }
  },
  {
    id: 'track-ai',
    category: 'ai',
    title: 'أمن الذكاء الاصطناعي والأتمتة الدفاعية',
    titleEn: 'AI Security & Defensive Automation',
    level: 'خبير',
    durationWeeks: 6,
    icon: 'Cpu',
    description: 'حماية وتأمين نماذج الذكاء الاصطناعي التوليدي، واكتشاف ثغرات Prompt Injection و Data Poisoning، واستخدام الذكاء الاصطناعي في الاستجابة الآلية للحوادث.',
    objectives: [
      'فهم قائمة OWASP Top 10 for Large Language Models (LLMs)',
      'هندسة دفاعات ضد هجمات كسر القيود (Jailbreaks) وحقن المطالبات المباشرة وغير المباشرة',
      'حماية خطوط إمداد نماذج الذكاء الاصطناعي (Model Supply Chain & Inversion Attacks)',
      'بناء وكلاء وسكربتات ذكاء اصطناعي لأتمتة فحص التنبيهات وصياغة تقارير الحوادث'
    ],
    prerequisites: ['فهم لمفاهيم تعلم الآلة ونماذج اللغة الكبيرة وبرمجة بايثون أو تايب سكريبت'],
    targetRoles: ['AI Security Researcher', 'MLOps Security Engineer', 'Automation Security Architect'],
    skillsGained: ['Prompt Injection Defense', 'LLM Red Teaming', 'AI Guardrails', 'Defensive Automation', 'RAG Security'],
    lessons: [
      {
        id: 'ai-1',
        title: 'ثغرات حقن المطالبات (Prompt Injection) وكسر حواجز الأمان (Jailbreaking)',
        durationMinutes: 55,
        summary: 'تشريح آليات التلاعب بالمدخلات لجعل النموذج يتجاوز قيوده الأمنية، وكيفية بناء دروع دفاعية (Guardrails).',
        content: [
          'يحدث حقن المطالبات المباشر عندما يدخل المستخدم تعليمات تتجاوز موجه النظام (System Prompt).',
          'الحقن غير المباشر (Indirect Prompt Injection) يحدث عندما يقرأ النموذج محتوى خارجي (صفحة ويب، ملف PDF) يحتوي على تعليمات خبيثة خفية.',
          'بناء سياج حماية متعدد الطبقات (Defense in Depth) يتطلب فحص المدخلات، وفصل التعليمات عن البيانات، ومراقبة المخرجات قبل تمريرها لأي أداة تنفيذية.'
        ],
        codeExamples: [
          {
            language: 'typescript',
            title: 'بناء وسيط أمان (Guardrail) للتحقق من المدخلات قبل إرسالها للنموذج',
            code: 'export function sanitizePrompt(input: string): { isSafe: boolean; reason?: string } {\n  const injectionPatterns = [\n    /ignore previous instructions/i,\n    /disregard system prompt/i,\n    /you are now in developer mode/i,\n    /act as an unrestricted/i\n  ];\n  \n  for (const pattern of injectionPatterns) {\n    if (pattern.test(input)) {\n      return { isSafe: false, reason: "تم اكتشاف محاولة حقن تعليمات مشبوهة" };\n    }\n  }\n  return { isSafe: true };\n}'
          }
        ],
        keyTakeaways: [
          'لا تعامل مدخلات المستخدم كمطالبات موثوقة أبداً، بل عاملها دائماً كبيانات خاضعة للتنقية',
          'تقييد صلاحيات الأدوات (Tool Calling) التي يمتلكها النموذج هو خط الدفاع الأقوى ضد أضرار الحقن'
        ],
        quiz: {
          question: 'ما هو الخطر الرئيسي المترتب على ثغرة Indirect Prompt Injection في أنظمة الـ LLM المدعومة بالبحث على الويب؟',
          options: ['استهلاك سعة التخزين على القرص', 'تنفيذ النموذج لتعليمات خبيثة موجودة داخل صفحة الويب التي قرأها دون علم المستخدم', 'إيقاف تشغيل الخادم الفيزيائي', 'مسح قاعدة بيانات الـ DNS العالمية'],
          correctAnswerIndex: 1,
          explanation: 'في الحقن غير المباشر، يستغل المهاجم قراءة النموذج لبيانات من الويب تحتوي على أوامر هجومية خفية تحثه على تسريب بيانات أو تنفيذ أفعال غير مصرحة.'
        }
      },
      {
        id: 'ai-2',
        title: 'أمن أنظمة التوليد المعزز بالاسترجاع (RAG) وسلاسل إمداد النماذج',
        durationMinutes: 60,
        summary: 'تأمين قواعد البيانات المتجهية (Vector DBs)، ومنع تسريب الوثائق الحساسة، وفحص أمان النماذج المحملة من مصادر مفتوحة.',
        content: [
          'أنظمة RAG قد تصبح نقطة ضعف رئيسية إذا تمكن مستخدم غير مصرح من استرجاع وثائق سرية من قاعدة المتجهات.',
          'تسميم البيانات (Data Poisoning) يستهدف حشو قاعدة المعرفة بوثائق مغلوطة تؤثر على إجابات النموذج وقراراته.',
          'ملفات النماذج بصيغ غير آمنة مثل Pickle قد تحتوي على شيفرات خبيثة تنفذ عند التحميل، ويجب استبدالها بصيغ آمنة مثل Safetensors.'
        ],
        codeExamples: [
          {
            language: 'python',
            title: 'تحقق من صلاحيات استرجاع المتجهات (Role-Based RAG Filtering)',
            code: '# تطبيق فلترة أمنية مبنية على دور المستخدم عند استعلام قاعدة المتجهات:\nresults = vector_db.similarity_search(\n    query=user_query,\n    k=4,\n    filter={\n        "department": user_department,\n        "clearance_level": {"$lte": user_clearance}\n    }\n)'
          }
        ],
        keyTakeaways: [
          'يجب تطبيق عزل الصلاحيات على مستوى قطع المتجهات (Chunk-Level Access Control)',
          'اعتماد صيغة safetensors بدلاً من pickle لمنع الهجمات التنفيذية أثناء تحميل الأوزان'
        ],
        quiz: {
          question: 'لماذا يوصى باستخدام صيغة safetensors بدلاً من pickle لحفظ وتوزيع نماذج الذكاء الاصطناعي؟',
          options: ['لأن safetensors تجعل النموذج أسرع في الحفظ فقط', 'لأن ملفات pickle قد تحتوي على شيفرة برمجية تنفيذية خبيثة تعمل تلقائياً عند فك التجميد', 'لأن safetensors لا تدعم التشفير', 'لأن pickle تدعم فقط لغة جافا'],
          correctAnswerIndex: 1,
          explanation: 'صيغة pickle في بايثون تسمح بتنفيذ دوال اعتباطية أثناء عملية unpickling مما يسهل تنفيذ هجمات RCE، بينما safetensors آمنة بطبيعتها وخالية من الشيفرات التنفيذية.'
        }
      }
    ],
    capstoneProject: {
      id: 'capstone-ai',
      title: 'بناء واختبار نظام حماية ذكي متعدد الطبقات لمساعد ذكاء اصطناعي مؤسسي',
      trackId: 'track-ai',
      difficulty: 'احترافي',
      estimatedHours: 22,
      scenario: 'مؤسسة طبية تريد نشر مساعد تشخيصي يعتمد على الذكاء الاصطناعي وقاعدة بيانات داخلية. المطلوب بناء جدار حماية (Guardrail) يمنع تسريب بيانات المرضى ويرفض محاولات الـ Jailbreak.',
      objectives: [
        'تصميم وتنفيذ مصنف أمني للمدخلات (Input Classifier) لرصد محاولات الحقن',
        'عزل بيانات المرضى وفرض تحكم وصول صارم في مرحلة استرجاع RAG',
        'إجراء اختبار اختراق أحمر (Red Teaming) وتوثيق نسبة صمود النظام'
      ],
      deliverables: ['مكتبة سياج الأمان Guardrail Library', 'حزمة اختبارات الهجوم المعاكس Adversarial Benchmark Suite', 'تقرير تقييم الأمان والمخاطر AI Safety Audit Report'],
      evaluationRubric: [
        { criterion: 'نسبة صد هجمات حقن التعليمات المباشرة وغير المباشرة', weight: 45, description: 'تحقيق معدل نجاح دفاعي يفوق 95% أمام حزم الاختبار القياسية' },
        { criterion: 'كفاءة زمن الاستجابة وعدم تعطيل تجربة المستخدم', weight: 30, description: 'فحص المدخلات في زمن أقل من 80 ميلي ثانية' },
        { criterion: 'منع تسريب المعلومات الحساسة ومطابقة معايير الخصوصية', weight: 25, description: 'ضمان عدم إمكانية استدراج النموذج لكشف أي سجلات محمية' }
      ]
    }
  }
];
