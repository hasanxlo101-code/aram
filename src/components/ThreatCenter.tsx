import React, { useState } from 'react';
import { Globe, Mail, Phone, Server, ShieldCheck, Users, Loader2, AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert, KeyRound, Info, MessageSquareWarning } from 'lucide-react';
import * as api from '../lib/threatApi';
import type { SourceResult, Indicator } from '../lib/threatApi';

type Tab = 'url' | 'message' | 'account' | 'phone' | 'ip' | 'headers' | 'social';
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'url', label: 'فحص الروابط', icon: Globe },
  { id: 'message', label: 'فحص الرسائل المشبوهة', icon: MessageSquareWarning },
  { id: 'account', label: 'الحسابات والتسريبات', icon: Mail },
  { id: 'phone', label: 'تحليل رقم الهاتف', icon: Phone },
  { id: 'ip', label: 'سمعة IP', icon: Server },
  { id: 'headers', label: 'ترويسات الأمان', icon: ShieldCheck },
  { id: 'social', label: 'انتحال الحسابات', icon: Users },
];
const COUNTRIES = [['', 'دولي (+)'], ['SA', 'السعودية'], ['AE', 'الإمارات'], ['EG', 'مصر'], ['SY', 'سوريا'], ['JO', 'الأردن'], ['LB', 'لبنان'], ['IQ', 'العراق'], ['KW', 'الكويت'], ['QA', 'قطر'], ['OM', 'عُمان'], ['BH', 'البحرين'], ['TR', 'تركيا'], ['MA', 'المغرب'], ['TN', 'تونس'], ['DZ', 'الجزائر']];

const sevColor: Record<string, string> = {
  high: 'border-rose-500/40 bg-rose-500/10 text-rose-300', medium: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  low: 'border-sky-500/30 bg-sky-500/10 text-sky-300', info: 'border-slate-700 bg-slate-800/50 text-slate-300',
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 ${className}`}>{children}</div>
);

const Verdict: React.FC<{ kind: 'bad' | 'warn' | 'ok' | 'unknown'; title: string; text: string }> = ({ kind, title, text }) => {
  const m = {
    bad: ['border-rose-500/50 bg-rose-500/10 text-rose-300', ShieldAlert], warn: ['border-amber-500/50 bg-amber-500/10 text-amber-300', AlertTriangle],
    ok: ['border-emerald-500/40 bg-emerald-500/10 text-emerald-300', CheckCircle2], unknown: ['border-slate-600 bg-slate-800/60 text-slate-300', HelpCircle],
  }[kind] as [string, any];
  const Icon = m[1];
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${m[0]}`}>
      <Icon className="h-7 w-7 shrink-0" />
      <div><div className="font-extrabold text-base">{title}</div><p className="text-xs sm:text-sm opacity-90 leading-relaxed mt-1">{text}</p></div>
    </div>
  );
};

const Sources: React.FC<{ sources: SourceResult[] }> = ({ sources }) => (
  <Card>
    <h4 className="text-sm font-bold text-white mb-3">المصادر التي استُعلم منها</h4>
    <ul className="space-y-2">
      {sources.map(s => (
        <li key={s.id} className="flex items-start justify-between gap-3 text-xs">
          <div className="min-w-0"><span className="text-slate-200">{s.name}</span>{s.detail && <div className="text-slate-500 mt-0.5">{s.detail}</div>}</div>
          <span className={`shrink-0 px-2 py-0.5 rounded-md border font-mono text-[10px] ${
            s.status === 'ok' ? (s.flagged ? 'border-rose-500/40 text-rose-300' : 'border-emerald-500/30 text-emerald-300')
            : s.status === 'not_configured' ? 'border-slate-700 text-slate-500' : 'border-amber-500/30 text-amber-300'}`}>
            {s.status === 'ok' ? (s.flagged ? 'مُبلَّغ' : 'نظيف') : s.status === 'not_configured' ? 'غير مفعّل' : 'تعذّر'}
          </span>
        </li>
      ))}
    </ul>
  </Card>
);

const Indicators: React.FC<{ items: Indicator[]; empty?: string }> = ({ items, empty }) => (
  <Card>
    <h4 className="text-sm font-bold text-white mb-3">المؤشرات المرصودة</h4>
    {items.length === 0 ? <p className="text-xs text-slate-500">{empty || 'لم تُرصد مؤشرات مشبوهة في بنية العنوان.'}</p> : (
      <ul className="space-y-2">{items.map(i => (
        <li key={i.id} className={`rounded-lg border p-3 ${sevColor[i.severity]}`}>
          <div className="text-xs font-bold">{i.titleAr}</div><div className="text-[11px] opacity-80 mt-0.5 leading-relaxed">{i.detailAr}</div>
        </li>))}</ul>)}
  </Card>
);

const KV: React.FC<{ k: string; v?: React.ReactNode }> = ({ k, v }) => (
  <div className="flex justify-between gap-3 py-1.5 border-b border-slate-800/70 text-xs last:border-0">
    <span className="text-slate-500 shrink-0">{k}</span><span className="text-slate-200 text-left break-all" dir="ltr">{v ?? '—'}</span>
  </div>
);

function useRunner<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const run = async (fn: () => Promise<T>) => {
    setLoading(true); setErr(''); setData(null);
    try { setData(await fn()); } catch (e: any) { setErr(e.message || 'خطأ'); } finally { setLoading(false); }
  };
  return { data, loading, err, run };
}

const InputRow: React.FC<{ value: string; onChange: (v: string) => void; onSubmit: () => void; placeholder: string; loading: boolean; btn: string; extra?: React.ReactNode; type?: string }> =
  ({ value, onChange, onSubmit, placeholder, loading, btn, extra, type = 'text' }) => (
  <form onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSubmit(); }} className="flex flex-col sm:flex-row gap-2">
    {extra}
    <input type={type} dir="ltr" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 outline-none" />
    <button disabled={loading || !value.trim()} className="rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold px-5 py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}{btn}
    </button>
  </form>
);

// ---------- روابط ----------
const UrlTab: React.FC = () => {
  const [v, setV] = useState(''); const { data: d, loading, err, run } = useRunner<any>();
  const vd = d && !d.blocked ? ({
    malicious: ['bad', 'تهديد مؤكد', 'أُبلغ عن هذا الرابط في مصدر موثوق. لا تفتحه ولا تُدخل أي بيانات.'],
    suspicious: ['warn', 'مشبوه', 'رُصدت مؤشرات قوية في بنية الرابط دون تأكيد من قوائم التهديدات. تعامل معه كخطر حتى تتحقق.'],
    no_known_threat: ['ok', 'غير مدرج في قوائم التهديدات المعروفة', 'هذا لا يعني أنه آمن بالضرورة: الروابط الجديدة قد لا تكون مُبلَّغًا عنها بعد.'],
    inconclusive: ['unknown', 'نتيجة غير حاسمة', 'لم تتوفر مصادر سمعة كافية للرد. اعتمد على المؤشرات أدناه.'],
  } as any)[d.verdict] : null;
  return (
    <div className="space-y-4">
      <InputRow value={v} onChange={setV} loading={loading} btn="افحص" placeholder="https://example.com/login" onSubmit={() => run(() => api.scanUrl(v))} />
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      {d?.blocked && <Verdict kind="unknown" title="لا يمكن الفحص" text={d.reason} />}
      {vd && <>
        <Verdict kind={vd[0]} title={vd[1]} text={vd[2]} />
        <p className="text-[11px] text-slate-500">ردّ {d.coverage.responded} من {d.coverage.total} مصادر سمعة. {d.coverage.responded < d.coverage.total && 'المصادر غير المفعّلة موضحة أدناه.'}</p>
        <Indicators items={d.indicators} />
        <Sources sources={d.sources} />
        <Card>
          <h4 className="text-sm font-bold text-white mb-2">البنية التقنية (قياس حي)</h4>
          <KV k="النطاق المسجّل" v={d.registrableDomain} />
          <KV k="عمر النطاق" v={d.domainAge ? `${d.domainAge.ageDays} يومًا (${d.domainAge.createdAt.slice(0, 10)})` : 'غير متاح'} />
          <KV k="عناوين IP" v={[...d.dns.a, ...d.dns.aaaa].slice(0, 4).join(', ') || 'لا يُحَل'} />
          <KV k="خوادم الأسماء" v={d.dns.ns.slice(0, 3).join(', ') || '—'} />
          <KV k="شهادة TLS" v={d.tls ? `${d.tls.authorized ? 'موثوقة' : 'غير موثوقة'} · ${d.tls.issuer || ''} · تنتهي بعد ${d.tls.daysRemaining} يومًا` : d.tls === null ? 'غير متاحة' : '—'} />
          <KV k="الوجهة النهائية" v={d.redirect?.finalUrl || d.redirect?.error} />
          {d.redirect?.hops?.length > 1 && <KV k="سلسلة التحويلات" v={d.redirect.hops.map((h: any) => h.status).join(' → ')} />}
        </Card>
      </>}
    </div>
  );
};

// ---------- حسابات ----------
const AccountTab: React.FC = () => {
  const [email, setEmail] = useState(''); const em = useRunner<any>();
  const [pw, setPw] = useState(''); const pr = useRunner<{ pwned: boolean; count: number }>();
  const d = em.data;
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-400" />هل ظهر بريدك في تسريبات؟</h3>
        <InputRow value={email} onChange={setEmail} loading={em.loading} btn="تحقق" type="email" placeholder="name@example.com" onSubmit={() => em.run(() => api.checkEmail(email))} />
        <p className="text-[11px] text-slate-500 flex gap-1.5"><Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />يُرسل البريد إلى خدمة تسريبات خارجية (HIBP أو XposedOrNot) عبر خادمنا ولا نخزّنه.</p>
        {em.err && <p className="text-rose-400 text-sm">{em.err}</p>}
        {d && (d.status === 'unavailable'
          ? <Verdict kind="unknown" title="تعذّر الفحص" text="لا يوجد مصدر متاح للرد حاليًا. لم نتمكن من تحديد حالة البريد." />
          : d.status === 'exposed'
          ? <Verdict kind="bad" title={`ظهر في ${d.breaches.length} تسريب`} text="غيّر كلمة مرور هذا الحساب وكل حساب استخدمت فيه نفس كلمة المرور، وفعّل التحقق بخطوتين." />
          : <Verdict kind="ok" title="لا تسريبات معروفة" text="لم يظهر البريد في قواعد التسريبات المعروفة. هذا لا يضمن عدم تسرّبه مستقبلًا." />)}
        {d?.breaches?.length > 0 && <Card><ul className="space-y-2">{d.breaches.slice(0, 25).map((b: any, i: number) => (
          <li key={i} className="text-xs border-b border-slate-800 pb-2 last:border-0"><div className="text-slate-200 font-bold">{b.name} {b.date && <span className="text-slate-500 font-mono">· {b.date}</span>}</div>
            {b.dataClasses && <div className="text-slate-500 mt-0.5">البيانات المكشوفة: {b.dataClasses.join('، ')}</div>}</li>))}</ul></Card>}
        {d && <Sources sources={d.sources} />}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><KeyRound className="h-4 w-4 text-emerald-400" />هل كلمة المرور مسرّبة؟</h3>
        <InputRow value={pw} onChange={setPw} loading={pr.loading} btn="تحقق" type="password" placeholder="كلمة المرور" onSubmit={() => pr.run(() => api.checkPasswordPwned(pw))} />
        <p className="text-[11px] text-slate-500 flex gap-1.5"><Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />تُحسب البصمة داخل متصفحك ويُرسل منها 5 محارف فقط (k-anonymity). كلمة المرور لا تغادر جهازك.</p>
        {pr.err && <p className="text-rose-400 text-sm">{pr.err}</p>}
        {pr.data && (pr.data.pwned
          ? <Verdict kind="bad" title={`مسرّبة ${pr.data.count.toLocaleString('en')} مرة`} text="لا تستخدم هذه الكلمة أبدًا. هي في قوائم الكلمات التي يجرّبها المهاجمون أولًا." />
          : <Verdict kind="ok" title="غير موجودة في التسريبات المعروفة" text="لا يعني أنها قوية. استخدم كلمة طويلة وفريدة لكل حساب." />)}
      </div>
    </div>
  );
};

// ---------- رسائل ----------
const MessageTab: React.FC = () => {
  const [v, setV] = useState(''); const { data: d, loading, err, run } = useRunner<any>();
  return (
    <div className="space-y-4">
      <textarea value={v} onChange={e => setV(e.target.value)} rows={5} maxLength={4000} placeholder="الصق نص الرسالة (SMS، واتساب، بريد) هنا..."
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
      <button type="button" disabled={loading || !v.trim()} onClick={() => run(() => api.analyzeMessage(v))}
        className="flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 cursor-pointer disabled:opacity-50">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}حلّل الرسالة</button>
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      {d && <>
        <Verdict kind={d.verdict === 'likely_scam' ? 'bad' : d.verdict === 'suspicious' ? 'warn' : 'unknown'}
          title={d.verdict === 'likely_scam' ? 'احتيال مرجّح' : d.verdict === 'suspicious' ? 'رسالة مشبوهة' : 'لا أنماط احتيال معروفة'} text={d.disclaimerAr} />
        <Indicators items={d.indicators} empty="لم تُرصد أنماط احتيال في النص." />
        {d.urlsFound?.length > 0 && <Card><h4 className="text-sm font-bold text-white mb-2">روابط داخل الرسالة (افحصها في تبويب «فحص الروابط»)</h4>
          <ul className="space-y-1">{d.urlsFound.map((u: string, i: number) => <li key={i}><code className="text-[11px] text-slate-300 break-all" dir="ltr">{u}</code></li>)}</ul></Card>}
      </>}
    </div>
  );
};

// ---------- هاتف ----------
const PhoneTab: React.FC = () => {
  const [v, setV] = useState(''); const [cc, setCc] = useState('SA'); const { data: d, loading, err, run } = useRunner<any>();
  return (
    <div className="space-y-4">
      <InputRow value={v} onChange={setV} loading={loading} btn="حلّل" placeholder="+966 5x xxx xxxx" onSubmit={() => run(() => api.analyzePhone(v, cc))}
        extra={<select value={cc} onChange={e => setCc(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2.5 text-sm text-slate-200">{COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select>} />
      <Card className="border-amber-500/30 bg-amber-500/5"><p className="text-xs text-amber-200 leading-relaxed">لا نكشف هوية مالك الرقم. لا يوجد مصدر قانوني عام يعطي اسم مالك أي رقم، وأي أداة تعرض أسماء عشوائية تخمّن أو تتاجر ببيانات مسرّبة. نحلل ما يمكن إثباته: صحة الرقم ونوعه ومؤشرات الاحتيال.</p></Card>
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      {d && (d.reason ? <Verdict kind="unknown" title="تعذّر التحليل" text={d.reason} /> : <>
        <Verdict kind={!d.valid || d.indicators.some((i: any) => i.severity === 'high') ? 'warn' : d.indicators.length ? 'warn' : 'ok'}
          title={d.valid ? 'الرقم صالح وفق خطة الترقيم' : 'الرقم غير صالح'} text={d.valid ? 'الصحة لا تعني أن صاحبه موثوق. انظر المؤشرات.' : 'قد يكون الرقم مزوّرًا أو مكتوبًا بشكل خاطئ.'} />
        <Card><KV k="الصيغة الدولية" v={d.international} /><KV k="الدولة" v={d.country} /><KV k="نوع الخط" v={d.lineTypeAr} />
          {d.carrier && <KV k="الشركة الحالية" v={d.carrier} />}</Card>
        <Indicators items={d.indicators} empty="لا مؤشرات احتيال بنيوية على الرقم." />
        <Sources sources={d.sources} />
        <Card><ul className="space-y-1.5">{d.notes.map((n: string, i: number) => <li key={i} className="text-[11px] text-slate-400 flex gap-1.5"><Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-600" />{n}</li>)}</ul></Card>
        <Card><h4 className="text-sm font-bold text-white mb-2">إن شككت بالمتصل</h4><ul className="text-xs text-slate-400 space-y-1 list-disc pr-4">
          <li>لا تشارك رمز تحقق (OTP) أو بيانات بطاقة مع أي متصل مهما ادّعى.</li><li>أنهِ المكالمة واتصل بالجهة من الرقم المنشور في موقعها الرسمي.</li><li>أبلغ شركة الاتصالات والجهة المختصة بالاحتيال في بلدك.</li></ul></Card>
      </>)}
    </div>
  );
};

// ---------- IP ----------
const IpTab: React.FC = () => {
  const [v, setV] = useState(''); const { data: d, loading, err, run } = useRunner<any>();
  return (
    <div className="space-y-4">
      <InputRow value={v} onChange={setV} loading={loading} btn="افحص" placeholder="8.8.8.8" onSubmit={() => run(() => api.analyzeIp(v))} />
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      {d?.blocked && <Verdict kind="unknown" title="عنوان داخلي" text={d.reason} />}
      {d && !d.blocked && <>
        <Verdict kind={d.verdict === 'flagged' ? 'bad' : d.verdict === 'no_known_threat' ? 'ok' : 'unknown'}
          title={d.verdict === 'flagged' ? 'مُبلَّغ عن هذا العنوان' : d.verdict === 'no_known_threat' ? 'لا بلاغات في المصادر المتاحة' : 'نتيجة غير حاسمة'}
          text={d.verdict === 'inconclusive' ? 'لا مصدر سمعة متاح للرد الآن.' : 'السمعة تتغير بسرعة، والعنوان المشترك قد يحمل سمعة غيره.'} />
        <Card><KV k="الدولة / المدينة" v={d.geo ? `${d.geo.country} · ${d.geo.city || '—'}` : 'غير متاح'} /><KV k="ASN" v={d.geo?.asn} /><KV k="المزوّد" v={d.geo?.isp || d.geo?.org} />
          <KV k="Reverse DNS" v={d.reverseDns?.[0]} /></Card>
        <Sources sources={d.sources} />
      </>}
    </div>
  );
};

// ---------- ترويسات ----------
const HeadersTab: React.FC = () => {
  const [v, setV] = useState(''); const { data: d, loading, err, run } = useRunner<any>();
  const col = (s: string) => s === 'pass' ? 'text-emerald-300 border-emerald-500/30' : s === 'warn' ? 'text-amber-300 border-amber-500/30' : 'text-rose-300 border-rose-500/30';
  return (
    <div className="space-y-4">
      <InputRow value={v} onChange={setV} loading={loading} btn="دقّق" placeholder="https://your-site.com" onSubmit={() => run(() => api.auditHeaders(v))} />
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      {d && <>
        <Card className="text-center"><div className="text-5xl font-black text-white">{d.grade}</div><div className="text-xs text-slate-400 mt-1">{d.percent}% · استجابة HTTP {d.httpStatus}</div></Card>
        <div className="space-y-2">{d.items.map((i: any) => (
          <div key={i.id} className={`rounded-lg border bg-slate-900/60 p-3 ${col(i.status)}`}>
            <div className="flex justify-between text-xs font-bold"><span dir="ltr">{i.name}</span><span>{i.status === 'pass' ? 'ناجح' : i.status === 'warn' ? 'تحسين' : 'ناقص'}</span></div>
            {i.value && <code className="block text-[10px] text-slate-400 mt-1.5 break-all" dir="ltr">{i.value}</code>}
            <p className="text-[11px] text-slate-400 mt-1.5">{i.adviceAr}</p>
          </div>))}</div>
      </>}
    </div>
  );
};

// ---------- سوشيال ----------
const SocialTab: React.FC = () => {
  const [v, setV] = useState(''); const { data: d, loading, err, run } = useRunner<any>();
  return (
    <div className="space-y-4">
      <InputRow value={v} onChange={setV} loading={loading} btn="حلّل" placeholder="instagram.com/username أو @username" onSubmit={() => run(() => api.analyzeSocial(v))} />
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      {d && <>
        <Verdict kind={d.riskLevel === 'high' ? 'bad' : d.riskLevel === 'medium' ? 'warn' : 'unknown'}
          title={d.riskLevel === 'high' ? 'مؤشرات انتحال قوية' : d.riskLevel === 'medium' ? 'مؤشرات تستدعي الحذر' : 'لا مؤشرات في الاسم'}
          text="هذا فحص لنمط الاسم فقط. لا يثبت أصالة الحساب ولا يمكن أن يعتبره «موثّقًا»." />
        <Indicators items={d.indicators} empty="لم يُرصد نمط انتحال في الاسم." />
        <Card><h4 className="text-sm font-bold text-white mb-2">كيف تتحقق يدويًا ({d.platform})</h4><ul className="text-xs text-slate-300 space-y-1.5 list-disc pr-4">{d.verificationSteps.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></Card>
        <p className="text-[11px] text-slate-500">{d.limitations}</p>
      </>}
    </div>
  );
};

export const ThreatCenter: React.FC = () => {
  const [tab, setTab] = useState<Tab>('url');
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => { const I = t.icon; const a = tab === t.id; return (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3.5 py-2 text-xs rounded-xl whitespace-nowrap border cursor-pointer ${a ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'}`}>
            <I className="h-4 w-4" />{t.label}</button>); })}
      </div>
      <Card>
        {tab === 'url' && <UrlTab />}{tab === 'message' && <MessageTab />}{tab === 'account' && <AccountTab />}{tab === 'phone' && <PhoneTab />}
        {tab === 'ip' && <IpTab />}{tab === 'headers' && <HeadersTab />}{tab === 'social' && <SocialTab />}
      </Card>
    </div>
  );
};
