import type { Indicator } from './types.js';

// فاحص الرسائل المشبوهة (SMS / واتساب / بريد) — تحليل محلي بالكامل:
// لا شبكة، لا قواعد بيانات خارجية، لا يُخزَّن النص. الهدف: شرح المؤشرات
// الشائعة في الاحتيال الهندسي (Social Engineering) بشفافية، وليس إصدار حكم قاطع.

interface Rule {
  id: string;
  weight: number;
  test: RegExp;
  titleAr: string;
  detailAr: string;
}

const RULES: Rule[] = [
  {
    id: 'urgency', weight: 2,
    test: /(عاجل|فورا|فوراً|خلال\s*\d+\s*(دقيقة|ساعة|ساعات)|آخر\s*فرصة|سيتم\s*(إيقاف|تعليق|حظر)|urgent|immediately|within\s*\d+\s*(minutes|hours)|last\s*chance|account\s*(will|would)\s*be\s*(suspended|closed|blocked))/i,
    titleAr: 'ضغط زمني مصطنع',
    detailAr: 'الرسائل الاحتيالية تفرض مهلة قصيرة لمنعك من التفكير أو التحقق.',
  },
  {
    id: 'otp_request', weight: 4,
    test: /(رمز\s*التحقق|كود\s*التحقق|OTP|verification\s*code|security\s*code|one[- ]time\s*(password|code)|أرسل\s*(لي|لنا)\s*الرمز)/i,
    titleAr: 'طلب رمز التحقق (OTP)',
    detailAr: 'لا تطلب أي جهة موثوقة رمز التحقق أبدًا. مشاركته تعني تسليم حسابك للمحتال.',
  },
  {
    id: 'credentials', weight: 4,
    test: /(كلمة\s*(المرور|السر)|رقم\s*(السري|البطاقة|بطاقتك)|CVV|password|pin\s*number|card\s*number|سي\s*في\s*في)/i,
    titleAr: 'طلب بيانات حساسة',
    detailAr: 'طلب كلمة المرور أو بيانات البطاقة عبر رسالة أو رابط ليس من علامات مؤسسة حقيقية.',
  },
  {
    id: 'shortener', weight: 2,
    test: /(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy|shorturl\.at|ow\.ly)\//i,
    titleAr: 'رابط مختصر',
    detailAr: 'الروابط المختصرة تخفي الوجهة الحقيقية. افحص الرابط قبل فتحه، ولا تفتحه من رسالة غير متوقعة.',
  },
  {
    id: 'ip_url', weight: 3,
    test: /https?:\/\/\d{1,3}(\.\d{1,3}){3}/i,
    titleAr: 'رابط بعنوان IP مباشر',
    detailAr: 'المواقع الرسمية تستخدم أسماء نطاقات، والعناوين الرقمية المباشرة شائعة في صفحات التصيّد.',
  },
  {
    id: 'lookalike_domain', weight: 3,
    test: /https?:\/\/[^\s/]*(-|\d)[^\s/]*\.(com|net|org|xyz|top|info|click|online|site)\b/i,
    titleAr: 'نطاق يشبه نطاقًا رسميًا',
    detailAr: 'أسماء بها شرطات أو أرقام تحاكي علامة تجارية معروفة. تحقق من النطاق حرفًا بحرف.',
  },
  {
    id: 'prize', weight: 2,
    test: /(مبروك|فزت|جائزة|هدية\s*مجانية|you\s*(have\s*)?won|congratulations|free\s*gift|claim\s*your)/i,
    titleAr: 'وعد بجائزة',
    detailAr: 'الجوائز غير المطلوبة التي تشترط دفع رسوم أو إدخال بيانات هي احتيال في الغالب.',
  },
  {
    id: 'fee', weight: 2,
    test: /(رسوم\s*(الشحن|التخليص|التسجيل)|ادفع|حول\s*مبلغ|pay\s*(a\s*)?fee|processing\s*fee|transfer\s*(the\s*)?amount)/i,
    titleAr: 'طلب دفع أو تحويل',
    detailAr: 'طلب دفع مقدّم لاستلام شيء موعود أو لفك "قفل" حساب من أكثر أنماط الاحتيال انتشارًا.',
  },
  {
    id: 'impersonation', weight: 2,
    test: /(فريق\s*الدعم|قسم\s*الأمن|البنك\s*المركزي|الشرطة|النيابة|مصرفك|إدارة\s*المنصة|support\s*team|security\s*department|bank\s*(representative|staff)|official\s*notice)/i,
    titleAr: 'انتحال جهة رسمية',
    detailAr: 'المحتال يدّعي صفة جهة رسمية ليكسب ثقتك. تواصل مع الجهة عبر قنواتها المعروفة بنفسك.',
  },
];

export interface MessageAnalysis {
  verdict: 'likely_scam' | 'suspicious' | 'low_risk';
  score: number;
  indicators: Indicator[];
  urlsFound: string[];
  disclaimerAr: string;
  checkedAt: string;
}

export function analyzeMessage(raw: string): MessageAnalysis {
  const text = (raw || '').trim();
  if (!text || text.length > 5000) throw new Error('INVALID_INPUT');

  const indicators: Indicator[] = [];
  let score = 0;

  for (const r of RULES) {
    if (r.test.test(text)) {
      score += r.weight;
      indicators.push({
        id: r.id,
        severity: r.weight >= 4 ? 'high' : r.weight >= 3 ? 'medium' : 'low',
        titleAr: r.titleAr,
        detailAr: r.detailAr,
      });
    }
  }

  const urlsFound = Array.from(new Set(text.match(/https?:\/\/[^\s<>"']+/gi) || [])).slice(0, 10);

  // الحكم يعتمد على عدد المؤشرات المتقاطعة لا على مؤشر واحد، لتقليل الإنذارات الكاذبة
  const verdict: MessageAnalysis['verdict'] =
    score >= 6 || indicators.filter((i) => i.severity === 'high').length >= 2 ? 'likely_scam'
    : score >= 3 ? 'suspicious'
    : 'low_risk';

  return {
    verdict,
    score,
    indicators,
    urlsFound,
    disclaimerAr:
      'هذا تقييم بالأنماط فقط ولا يُعد حكمًا قاطعًا. الرسالة الحقيقية قد تحتوي بعض هذه المؤشرات، والاحتيال المتقن قد لا يحتوي أيًا منها. عند الشك لا تضغط الروابط، وتواصل مع الجهة عبر قنواتها الرسمية.',
    checkedAt: new Date().toISOString(),
  };
}
