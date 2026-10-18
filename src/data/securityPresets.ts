import { BreachRecord, IpIntelResult, SecurityHeaderItem, WorkerShieldConfig } from '../types';

export const SUSPICIOUS_KEYWORDS = [
  'login', 'verify', 'update', 'banking', 'secure', 'account', 'wallet', 'crypto',
  'confirm', 'password', 'authenticate', 'support-desk', 'paypal-secure', 'appleid-auth',
  'billing-resolve', 'metamask-restore', 'security-alert', 'recover', 'token-claim'
];

export const HIGH_RISK_TLDS = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.cam', '.work', '.click', '.monster', '.loan'];

export const SAMPLE_SCAN_TARGETS = [
  {
    labelAr: 'رابط كايا المشوه (فحص ومعالجة الخلل التلقائي)',
    labelEn: 'Mangled Kaya URL (Auto-Correction Test)',
    url: 'https://kaya-safesec.httpskaya-safesechasanxloworkersde.workers.dev/',
    category: 'mangled',
  },
  {
    labelAr: 'رابط خادم كايا المصحح على Cloudflare Workers',
    labelEn: 'Kaya SafeSec Clean Worker Endpoint',
    url: 'https://kaya-safesec.hasanxlo.workers.dev',
    category: 'safe',
  },
  {
    labelAr: 'رابط تصيد مصرفي احتيالي (نموذج اختبار)',
    labelEn: 'Bank Phishing Clone (Test Specimen)',
    url: 'http://secure-login-bank-verification.account-update.xyz/auth?client_id=9872',
    category: 'threat',
  },
  {
    labelAr: 'رابط استرداد محفظة عملات مزيفة',
    labelEn: 'Crypto Wallet Phishing Scam',
    url: 'https://claim-airdrop-metamask-security.top/connect-wallet.html',
    category: 'threat',
  },
  {
    labelAr: 'نطاق هجوم تشابه الأحرف (Punycode / Homograph)',
    labelEn: 'IDN Homograph Spoofing Attack',
    url: 'https://www.xn--pypal-4ve.com/signin',
    category: 'threat',
  }
];

export const STANDARD_SECURITY_HEADERS: Omit<SecurityHeaderItem, 'present' | 'actualValue' | 'status'>[] = [
  {
    key: 'Content-Security-Policy',
    name: 'Content-Security-Policy (CSP)',
    descriptionAr: 'يقيد الموارد والسكربتات المصرح بتحميلها في المتصفح لمنع هجمات XSS وحقن الأكواد.',
    descriptionEn: 'Restricts authorized script, image, and style origins to prevent Cross-Site Scripting (XSS).',
    recommendedValue: "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';",
    riskIfMissingAr: 'تعرض الموقع لهجمات حقن الأكواد (Cross-Site Scripting) واختراق جلسات المستخدمين.',
    riskIfMissingEn: 'Vulnerability to XSS, unauthorized code injection, and session cookie exfiltration.',
  },
  {
    key: 'Strict-Transport-Security',
    name: 'Strict-Transport-Security (HSTS)',
    descriptionAr: 'يفرض على المتصفحات التواصل مع الموقع حصراً عبر بروتوكول HTTPS المشفر ويمنع هجمات SSL Stripping.',
    descriptionEn: 'Forces browsers to communicate exclusively over encrypted HTTPS, preventing SSL strip attacks.',
    recommendedValue: 'max-age=31536000; includeSubDomains; preload',
    riskIfMissingAr: 'إمكانية اعتراض حركة المرور غير المشفرة في هجمات الرجل في المنتصف (Man-in-the-Middle).',
    riskIfMissingEn: 'Risk of insecure HTTP fallback and man-in-the-middle interception on insecure Wi-Fi.',
  },
  {
    key: 'X-Frame-Options',
    name: 'X-Frame-Options',
    descriptionAr: 'يمنع تضمين موقعك داخل إطارات iframes في مواقع خارجية لمنع هجمات اختطاف النقر (Clickjacking).',
    descriptionEn: 'Prevents the site from being rendered within foreign iframes to block Clickjacking attacks.',
    recommendedValue: 'DENY',
    riskIfMissingAr: 'استغلال واجهة موقعك في خداع الزوار لتنفيذ إجراءات حساسة دون علمهم داخل iframe خفي.',
    riskIfMissingEn: 'Enables attackers to cloak your pages in transparent frames and hijack user clicks.',
  },
  {
    key: 'X-Content-Type-Options',
    name: 'X-Content-Type-Options',
    descriptionAr: 'يمنع المتصفح من محاولة تخمين نوع محتوى الملفات (MIME Sniffing) ويفرض النوع المعلن.',
    descriptionEn: 'Prevents browsers from MIME-sniffing the response away from the declared content-type.',
    recommendedValue: 'nosniff',
    riskIfMissingAr: 'تنفيذ ملفات نصية أو صور كأكواد تنفيذية خطيرة عبر تخمين نوع MIME.',
    riskIfMissingEn: 'Attackers can upload malicious executable scripts disguised as harmless images.',
  },
  {
    key: 'Referrer-Policy',
    name: 'Referrer-Policy',
    descriptionAr: 'يحدد كمية معلومات الإحالة وروابط الصفحات التي يتم إرسالها عند الانتقال لمواقع أخرى.',
    descriptionEn: 'Controls how much referrer metadata is forwarded when users follow links to external sites.',
    recommendedValue: 'strict-origin-when-cross-origin',
    riskIfMissingAr: 'تسريب عناوين URL الداخلية والتوكنات الحساسة في ترويسة Referer إلى مواقع خارجية.',
    riskIfMissingEn: 'Leakage of sensitive URL query parameters and private tokens to third-party logs.',
  },
  {
    key: 'Permissions-Policy',
    name: 'Permissions-Policy',
    descriptionAr: 'يعطل أذونات المتصفح غير الضرورية مثل الكاميرا والميكروفون وتحديد الموقع الجغرافي.',
    descriptionEn: 'Restricts access to browser hardware APIs like camera, microphone, and geolocation.',
    recommendedValue: 'camera=(), microphone=(), geolocation=()',
    riskIfMissingAr: 'إمكانية استغلال سكربتات تابعة لجهات خارجية لأجهزة المستخدم وأذوناته.',
    riskIfMissingEn: 'Third-party embedded scripts may request unauthorized hardware access.',
  }
];

export const DEFAULT_WORKER_SHIELD_CONFIG: WorkerShieldConfig = {
  forceHttps: true,
  enableSecurityHeaders: true,
  enableRateLimiting: true,
  rateLimitMaxRequests: 60,
  rateLimitWindowSec: 60,
  blockBadBots: true,
  blockSqlInjection: true,
  blockXssPayloads: true,
  enableGeoBlocking: false,
  blockedCountries: ['RU', 'CN', 'KP'],
  enableIpFiltering: false,
  blockedIps: ['198.51.100.14', '203.0.113.88'],
  customCspDirectives: "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
};

export const SAMPLE_BUGGY_WORKER_CODE = `// Typical Buggy Cloudflare Worker Code
export default {
  async fetch(request) {
    const response = await fetch(request);

    // BUG 1: Mutating immutable headers throws TypeError: Can't modify immutable headers
    response.headers.set('X-Frame-Options', 'DENY');
    
    // BUG 2: Missing CORS preflight handling for OPTIONS requests
    // BUG 3: Unhandled errors crash the worker without friendly 500 response
    // BUG 4: Missing HSTS and Content-Security-Policy

    return response;
  }
};`;

export const BREACH_CATALOG: BreachRecord[] = [
  {
    title: 'Adobe Systems Records Exposure',
    domain: 'adobe.com',
    breachDate: '2023-10-04',
    pwnCount: '152,445,165',
    descriptionAr: 'تسريب ضخم شمل عناوين البريد الإلكتروني، وتلميحات كلمات المرور المشفرة بشكل ضعيف.',
    descriptionEn: 'Massive database exposure including email addresses, weakly encrypted passwords, and hints.',
    dataClasses: ['Email addresses', 'Password hints', 'Encrypted passwords', 'Usernames'],
    isVerified: true
  },
  {
    title: 'LinkedIn Corporate Credential Dump',
    domain: 'linkedin.com',
    breachDate: '2022-05-18',
    pwnCount: '164,611,595',
    descriptionAr: 'قاعدة بيانات ضخمة تحتوي على تفاصيل الحسابات وتجزئات كلمات المرور SHA-1 غير المملحة.',
    descriptionEn: 'Extensive credential dump containing email addresses and un-salted SHA-1 password hashes.',
    dataClasses: ['Email addresses', 'Password hashes', 'Job titles', 'Profile URLs'],
    isVerified: true
  },
  {
    title: 'Canva Design Network Breach',
    domain: 'canva.com',
    breachDate: '2023-05-24',
    pwnCount: '137,249,040',
    descriptionAr: 'اختراق خوادم المنصة وحصول المهاجمين على بيانات المستخدمين بما فيها أسماء وحسابات وسجلات.',
    descriptionEn: 'Platform compromise resulting in unauthorized access to customer profiles and salted bcrypt hashes.',
    dataClasses: ['Customer names', 'Email addresses', 'City & Country', 'Bcrypt password hashes'],
    isVerified: true
  },
  {
    title: 'Dropbox Auth Token Incident',
    domain: 'dropbox.com',
    breachDate: '2024-04-24',
    pwnCount: '68,648,009',
    descriptionAr: 'تسريب تضمن تجزئات كلمات مرور ومصادقة مستخدمي المنصة السحابية.',
    descriptionEn: 'Cloud storage breach containing salted and hashed passwords along with user metadata.',
    dataClasses: ['Email addresses', 'Hashed credentials', 'Account creation dates'],
    isVerified: true
  }
];

export const MOCK_IP_INTEL_DB: Record<string, Partial<IpIntelResult>> = {
  '1.1.1.1': {
    ip: '1.1.1.1',
    hostname: 'one.one.one.one',
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    asn: 'AS13335 (Cloudflare, Inc.)',
    isp: 'Cloudflare Edge Anycast',
    abuseScore: 0,
    isVpn: false,
    isTor: false,
    isProxy: false,
    isKnownBotnet: false,
    openPorts: [53, 443, 853]
  },
  '8.8.8.8': {
    ip: '8.8.8.8',
    hostname: 'dns.google',
    city: 'Mountain View',
    country: 'United States',
    countryCode: 'US',
    asn: 'AS15169 (Google LLC)',
    isp: 'Google Public DNS',
    abuseScore: 0,
    isVpn: false,
    isTor: false,
    isProxy: false,
    isKnownBotnet: false,
    openPorts: [53, 443]
  },
  '185.220.101.5': {
    ip: '185.220.101.5',
    hostname: 'tor-exit-node-ams.torservers.net',
    city: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    asn: 'AS208323 (Zwiebelfreunde e.V.)',
    isp: 'Tor Exit Operator Relay',
    abuseScore: 82,
    isVpn: false,
    isTor: true,
    isProxy: true,
    isKnownBotnet: false,
    openPorts: [9001, 9050, 443]
  },
  '45.143.203.18': {
    ip: '45.143.203.18',
    hostname: 'scanner-host.unknown-bulletproof.cc',
    city: 'Seychelles',
    country: 'Seychelles',
    countryCode: 'SC',
    asn: 'AS44050 (Bulletproof Host Ltd)',
    isp: 'Offshore Bulletproof Routing',
    abuseScore: 94,
    isVpn: true,
    isTor: false,
    isProxy: true,
    isKnownBotnet: true,
    openPorts: [22, 23, 80, 8080, 4444]
  }
};
