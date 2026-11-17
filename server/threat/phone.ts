import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/max';
import type { Indicator, SourceResult } from './types.js';

const TYPE_AR: Record<string, string> = {
  MOBILE: 'جوال', FIXED_LINE: 'خط ثابت', FIXED_LINE_OR_MOBILE: 'ثابت أو جوال', TOLL_FREE: 'رقم مجاني', PREMIUM_RATE: 'رقم بتعرفة مرتفعة',
  SHARED_COST: 'تكلفة مشتركة', VOIP: 'VoIP (اتصال عبر الإنترنت)', PERSONAL_NUMBER: 'رقم شخصي', PAGER: 'جهاز نداء', UAN: 'رقم موحّد للشركات', VOICEMAIL: 'بريد صوتي',
};

export async function analyzePhone(raw: string, defaultCountry?: string) {
  const input = (raw || '').trim();
  if (!input || input.length > 32) throw new Error('INVALID_INPUT');
  const cc = defaultCountry && /^[A-Z]{2}$/.test(defaultCountry) ? (defaultCountry as CountryCode) : undefined;
  const p = parsePhoneNumberFromString(input.replace(/^00/, '+'), cc);
  if (!p) return { valid: false, possible: false, reason: 'تعذّر تحليل الرقم. أدخله بصيغة دولية (+966…) أو اختر الدولة.' };

  const type = p.getType();
  const indicators: Indicator[] = [];
  if (type === 'PREMIUM_RATE') indicators.push({ id: 'premium', severity: 'high', titleAr: 'رقم بتعرفة مرتفعة', detailAr: 'الاتصال أو الرد بالرسائل قد يكلّفك مبالغ كبيرة، ومن الحيل الشائعة (اتصال لثانية ثم قطع لدفعك للاتصال).' });
  if (type === 'VOIP') indicators.push({ id: 'voip', severity: 'medium', titleAr: 'خط VoIP', detailAr: 'يسهل الحصول عليه مجهول الهوية، ويُستخدم كثيرًا في حملات الاحتيال، لكنه يُستخدم أيضًا بشكل مشروع.' });
  if (type === 'SHARED_COST') indicators.push({ id: 'shared', severity: 'low', titleAr: 'تكلفة مشتركة', detailAr: 'قد تُحمَّل رسومًا غير معتادة.' });
  if (!p.isValid()) indicators.push({ id: 'invalid', severity: 'high', titleAr: 'رقم غير صالح لهذه الدولة', detailAr: 'الأرقام المزوّرة غالبًا لا تطابق خطة الترقيم الرسمية.' });

  const sources: SourceResult[] = [{ id: 'libphonenumber', name: 'خطة الترقيم الدولية (libphonenumber)', status: 'ok', detail: 'تحقق من الصيغة والنوع محليًا' }];
  let carrier: string | null = null;
  let lineType: string | null = null;

  const sid = process.env.TWILIO_ACCOUNT_SID, tok = process.env.TWILIO_AUTH_TOKEN;
  if (sid && tok && p.isValid()) {
    try {
      const res = await fetch(`https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(p.number)}?Fields=line_type_intelligence`, {
        headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${tok}`).toString('base64') }, signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(String(res.status));
      const j: any = await res.json();
      carrier = j.line_type_intelligence?.carrier_name || null;
      lineType = j.line_type_intelligence?.type || null;
      sources.push({ id: 'twilio', name: 'Twilio Lookup', status: 'ok', detail: carrier ? `الشركة الحالية: ${carrier}` : 'لا بيانات إضافية' });
    } catch { sources.push({ id: 'twilio', name: 'Twilio Lookup', status: 'unavailable', detail: 'فشل الاتصال' }); }
  } else {
    sources.push({ id: 'twilio', name: 'Twilio Lookup (الشركة المشغّلة الحالية)', status: 'not_configured', detail: 'غير مفعّل على هذا الخادم' });
  }

  return {
    valid: p.isValid(), possible: p.isPossible(),
    international: p.formatInternational(), national: p.formatNational(), e164: p.number,
    country: p.country || null, callingCode: p.countryCallingCode,
    lineType: type || null, lineTypeAr: type ? (TYPE_AR[type] || type) : 'غير محدد',
    carrier, carrierLiveType: lineType,
    indicators, sources,
    notes: [
      'لا يمكن تحديد اسم مالك الرقم من أي مصدر مشروع عام، وأي موقع يعرض اسمًا لأي رقم تقريبًا يخمّن أو يبيع بيانات مسرّبة.',
      'الشركة المشغّلة لا تُستنتج من بادئة الرقم لأن خدمة نقل الرقم بين الشبكات تغيّرها.',
    ],
    checkedAt: new Date().toISOString(),
  };
}
