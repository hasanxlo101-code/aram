import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle, 
  Terminal, 
  ShieldCheck, 
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';

interface CyberMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: { title: string; topic: string } | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const CyberMentorDrawer: React.FC<CyberMentorDrawerProps> = ({
  isOpen,
  onClose,
  initialContext,
}) => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: initialContext
        ? `مرحباً بك يا بطل! أنا مدربك السيبراني المساعد في أكاديمية KAyA Safe&Sec. أرى أنك تدرس حالياً: "${initialContext.title}" في مجال (${initialContext.topic}). كيف يمكنني مساعدتك في الشرح، الأوامر، أو توجيهك في المختبر؟`
        : `أهلاً بك في أكاديمية KAyA Safe&Sec! أنا مرشدك الأكاديمي المساعد. يمكنك سؤالي عن مفاهيم الدفاع السيبراني، مرشحات الشبكات، تحليل السجلات، أو طلب تلميحات هندسية للمختبرات.`,
      timestamp: 'الآن'
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'اشرح لي ثغرة SQL Injection ببساطة وكيفية ترقيعها',
    'ما هي أهم مرشحات Wireshark لكشف هجمات الشبكة؟',
    'كيف أفرز سجلات Sysmon Event ID 1 للـ SOC؟',
    'ما هي خطوات التحقيق الاستخباري OSINT الصحيحة؟'
  ];

  const getSimulatedResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('sql') || q.includes('حقن')) {
      return `📌 **ثغرة حقن أوامر SQL (SQL Injection):**\n\nتحدث عندما تدمج مدخلات المستخدم مباشرة داخل جملة الاستعلام بدون تعقيم. \n\n🔒 **طريقة الحماية الجذرية:**\nاستخدم دائماً **الاستعلامات المجهزة (Parameterized Queries)** بحيث يفصل محرك قواعد البيانات الكود عن البيانات:\n\`\`\`sql\n-- كود آمن:\nSELECT * FROM users WHERE username = ? AND password = ?;\n\`\`\`\nتجنب الاعتماد على فلترة الكلمات المحظورة (Blacklisting) لأنها سهلة الالتفاف.`;
    }
    if (q.includes('wireshark') || q.includes('شبك')) {
      return `🔍 **أبرز فلاتر Wireshark للتحليل الدفاعي:**\n\n1. \`tcp.flags.syn==1 and tcp.flags.ack==0\` : رصد محاولات فحص المنافذ أو إغراق SYN Flood.\n2. \`dns.flags.response == 0 and dns.count.queries > 10\` : كشف استعلامات DNS المكثفة.\n3. \`http.request.method == "POST"\` : فحص طلبات إرسال البيانات ونماذج تسجيل الدخول.\n4. \`frame contains "cmd.exe"\` : البحث عن اتصالات شل غير مشفرة.`;
    }
    if (q.includes('sysmon') || q.includes('soc')) {
      return `🛡️ **دليل فرز سجلات Sysmon لمحللي الـ SOC:**\n\n- **Event ID 1:** Process Creation — راقب حقول \`CommandLine\` و \`ParentImage\`. إذا رأيت \`powershell.exe -enc\` مشغل من \`WINWORD.EXE\` فهذا مؤشر اختراق حاسم (True Positive).\n- **Event ID 3:** Network Connection — تحقق من عناوين الـ IP الخارجية غير المعتادة على منافذ مثل 4444 أو 8443.\n- **Event ID 8:** CreateRemoteThread — يشير لمحاولة حقن شيفرة (Process Injection).`;
    }
    if (q.includes('osint') || q.includes('استخبارات')) {
      return `🌐 **منهجية التحقيق الاستخباري مفتوح المصدر (OSINT):**\n\n1. **تحديد الهدف ونطاق البحث (Scope).**\n2. **استطلاع البنية التحتية الخامل (Passive Recon):** استخدام سجلات الشهادات crt.sh و Shodan دون لمس الهدف.\n3. **تقاطع البيانات (Cross-referencing):** مطابقة تجزئات البريد الإلكتروني وأسماء المستخدمين.\n4. **التحقق من الدليل:** لا تعتمد على مصدر واحد أبداً دون إثبات إضافي (تاريخ الأرشفة، ميتاداتا الصورة).`;
    }
    return `فهمت سؤالك حول: "${query}". \n\nفي هندسة الأمن والدفاع السيبراني بـ KAyA Safe&Sec، نوصي دائماً بتطبيق مبدأ **الدفاع في العمق (Defense in Depth)**. تحقق من مصادر السجلات ذات الصلة، وافصل بيئات الاختبار عن بيئة الإنتاج، ولا تعتمد على طبقة حماية واحدة. \n\nهل ترغب في فحص أمر محدد أو الانتقال لمختبر عملي لتطبيق هذا المفهوم؟`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'الآن'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getSimulatedResponse(text);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'الآن'
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#070d1e] border-l border-cyan-500/30 h-full flex flex-col shadow-2xl"
        dir="rtl"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#050917] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">المدرب السيبراني الأكاديمي</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-cyan-400 font-mono">KAyA Cyber Intelligence Mentor</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`relative p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.sender === 'assistant' && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="hover:text-cyan-300 transition flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>نسخ التوجيه</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 pr-10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-200"></span>
              <span>المدرب يكتب التوجيه...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-slate-800/80 bg-[#060b1b] space-y-1.5">
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>أسئلة شائعة وسريعة:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 text-slate-300 transition text-right"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-[#050814] border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب استفسارك السيبراني أو طلب التلميح..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
