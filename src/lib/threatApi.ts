// عميل منظومة كايا للفحص: كل النتائج تأتي من الخادم (مصادر حقيقية)، لا توليد محلي.
export type SourceStatus = 'ok' | 'not_configured' | 'unavailable';
export interface SourceResult { id: string; name: string; status: SourceStatus; flagged?: boolean; detail?: string; link?: string }
export interface Indicator { id: string; severity: 'info' | 'low' | 'medium' | 'high'; titleAr: string; detailAr: string }

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j?.message || 'تعذّر إتمام الفحص');
  return j as T;
}

export const scanUrl = (url: string) => post<any>('/api/scan/url', { url });
export const auditHeaders = (url: string) => post<any>('/api/scan/headers', { url });
export const checkEmail = (email: string) => post<any>('/api/scan/email', { email });
export const analyzePhone = (phone: string, country?: string) => post<any>('/api/scan/phone', { phone, country });
export const analyzeIp = (ip: string) => post<any>('/api/scan/ip', { ip });
export const analyzeMessage = (text: string) => post<any>('/api/scan/message', { text });
export const analyzeSocial = (handle: string) => post<any>('/api/scan/social', { handle });

/**
 * فحص كلمة المرور في التسريبات بأسلوب k-anonymity:
 * يُحسب SHA-1 في المتصفح ويُرسل أول 5 محارف فقط إلى HIBP. كلمة المرور لا تغادر جهازك.
 */
export async function checkPasswordPwned(password: string): Promise<{ pwned: boolean; count: number }> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const prefix = hex.slice(0, 5), suffix = hex.slice(5);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, { headers: { 'Add-Padding': 'true' } });
  if (!res.ok) throw new Error('تعذّر الاتصال بخدمة التحقق');
  const line = (await res.text()).split('\n').find(l => l.startsWith(suffix));
  const count = line ? parseInt(line.split(':')[1], 10) : 0;
  return { pwned: count > 0, count };
}
