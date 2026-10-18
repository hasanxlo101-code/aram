export type Language = 'ar' | 'en';

export type SecuritySeverity = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface UrlScanResult {
  url: string;
  normalizedUrl: string;
  domain: string;
  protocol: 'https' | 'http';
  severity: SecuritySeverity;
  score: number; // 0 to 100 (100 = completely safe)
  summaryTextAr: string;
  summaryTextEn: string;
  isPunycode: boolean;
  hasSuspiciousTLD: boolean;
  hasPhishingKeywords: boolean;
  isIpLiteral: boolean;
  isMangledOrMalformed?: boolean;
  suggestedCorrection?: string;
  correctionExplanationAr?: string;
  correctionExplanationEn?: string;
  entropyScore: number; // high entropy in domain path often signals obfuscated malware
  sslStatus: {
    valid: boolean;
    protocol: string;
    issuer: string;
    daysRemaining: number;
  };
  dnsAnalysis: {
    hasDnsSec: boolean;
    nameservers: string[];
    ipAddress: string;
    country: string;
    asn: string;
  };
  detectedThreats: Array<{
    id: string;
    type: 'warning' | 'danger' | 'info';
    titleAr: string;
    titleEn: string;
    detailAr: string;
    detailEn: string;
  }>;
  recommendedActions: Array<{
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
  }>;
}

export interface SecurityHeaderItem {
  key: string;
  name: string;
  descriptionAr: string;
  descriptionEn: string;
  recommendedValue: string;
  riskIfMissingAr: string;
  riskIfMissingEn: string;
  present: boolean;
  actualValue?: string;
  status: 'passed' | 'warning' | 'missing';
}

export interface HeaderAuditResult {
  targetUrl: string;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  headers: SecurityHeaderItem[];
  cloudflareSnippet: string;
  nginxSnippet: string;
  apacheSnippet: string;
}

export interface WorkerShieldConfig {
  forceHttps: boolean;
  enableSecurityHeaders: boolean;
  enableRateLimiting: boolean;
  rateLimitMaxRequests: number;
  rateLimitWindowSec: number;
  blockBadBots: boolean;
  blockSqlInjection: boolean;
  blockXssPayloads: boolean;
  enableGeoBlocking: boolean;
  blockedCountries: string[];
  enableIpFiltering: boolean;
  blockedIps: string[];
  customCspDirectives: string;
}

export interface WorkerLintIssue {
  id: string;
  line?: number;
  severity: 'error' | 'warning' | 'info';
  messageAr: string;
  messageEn: string;
  fixAr: string;
  fixEn: string;
}

export interface WorkerLintResult {
  issues: WorkerLintIssue[];
  cleanCode: string;
  hasErrors: boolean;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  entropyBits: number;
  crackTimeOfflineFast: string;
  crackTimeOnlineSlow: string;
  crackTimeGpuCluster: string;
  feedbackAr: string[];
  feedbackEn: string[];
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  isCommonPassword: boolean;
  ratingLabelAr: string;
  ratingLabelEn: string;
}

export interface BreachRecord {
  title: string;
  domain: string;
  breachDate: string;
  pwnCount: string;
  descriptionAr: string;
  descriptionEn: string;
  dataClasses: string[];
  isVerified: boolean;
}

export interface IpIntelResult {
  ip: string;
  hostname: string;
  city: string;
  country: string;
  countryCode: string;
  asn: string;
  isp: string;
  abuseScore: number; // 0 - 100
  isVpn: boolean;
  isTor: boolean;
  isProxy: boolean;
  isKnownBotnet: boolean;
  openPorts: number[];
}

// -------------------------------------------------------------
// VirusTotal-Style URL Analysis Models
// -------------------------------------------------------------
export interface SecurityVendorCheck {
  name: string;
  category: 'clean' | 'malicious' | 'suspicious' | 'undetected';
  result: string;
}

export interface VirusTotalAnalysis {
  targetUrl: string;
  finalUrl: string;
  httpResponse: number;
  detectionStats: {
    malicious: number;
    suspicious: number;
    clean: number;
    undetected: number;
    total: number;
  };
  communityScore: number;
  reputationText: string;
  vendors: SecurityVendorCheck[];
  categories: Record<string, string>;
  sslIssuer: string;
  ipResolution: string;
  lastAnalysisDate: string;
}

// -------------------------------------------------------------
// Social Media & Web Page Authenticity Inspection Models
// -------------------------------------------------------------
export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'telegram' | 'tiktok' | 'linkedin' | 'website';

export interface SocialVerificationResult {
  platform: SocialPlatform;
  handleOrUrl: string;
  displayName: string;
  verdict: 'authentic' | 'fake_scam' | 'suspicious' | 'unverified';
  trustScore: number; // 0 to 100
  followersCount: string;
  followingCount: string;
  creationAge: string;
  botRiskPercent: number;
  isOfficialBadgeClaimed: boolean;
  isOfficialBadgeGenuine: boolean;
  targetImpersonated?: string;
  reasonsAr: string[];
  reasonsEn: string[];
  securitySignals: {
    phoneBound: boolean;
    domainVerified: boolean;
    frequentUsernameChanges: boolean;
    hasPhishingBioLink: boolean;
  };
}

// -------------------------------------------------------------
// Deep Phone Number OSINT & Owner Reverse Lookup Models
// -------------------------------------------------------------
export interface PhoneOwnerLookupResult {
  rawInput: string;
  internationalNumber: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  ownerName: string;
  alternateNames: string[];
  carrier: string;
  lineType: 'Mobile GSM' | 'Landline' | 'VoIP / Virtual' | 'Toll Free';
  riskScore: number; // 0 (safe) to 100 (high spam)
  riskLevel: 'safe' | 'low' | 'suspicious' | 'high_spam';
  spamReportsCount: number;
  linkedEmailMasked?: string;
  linkedApps: string[];
  queriedServersCount: number;
  matchedDatabases: string[];
  cityRegion: string;
  lastLookupTimestamp: string;
}
