export type SourceStatus = 'ok' | 'not_configured' | 'unavailable';
export interface SourceResult {
  id: string;
  name: string;
  status: SourceStatus;
  flagged?: boolean;
  detail?: string;
  link?: string;
}
export interface Indicator {
  id: string;
  severity: 'info' | 'low' | 'medium' | 'high';
  titleAr: string;
  detailAr: string;
}
export type Verdict =
  | 'malicious'        // مُبلَّغ عنه في مصدر موثوق
  | 'suspicious'       // مؤشرات قوية بلا تأكيد
  | 'no_known_threat'  // غير مدرج بالقوائم المعروفة (لا يعني أنه آمن)
  | 'inconclusive';    // لا توجد مصادر كافية
