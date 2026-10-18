import React, { useState } from 'react';
import { Activity, Search, ShieldCheck, Terminal, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

interface NetworkForensicsLabProps {
  onComplete?: (xp: number) => void;
}

export const NetworkForensicsLab: React.FC<NetworkForensicsLabProps> = ({ onComplete }) => {
  const [selectedPacket, setSelectedPacket] = useState<number>(4);
  const [displayFilter, setDisplayFilter] = useState('');
  const [submittedFlag, setSubmittedFlag] = useState('');
  const [flagFeedback, setFlagFeedback] = useState<'success' | 'error' | null>(null);
  const [hasAwarded, setHasAwarded] = useState(false);

  const packets = [
    { no: 1, time: '0.000000', src: '192.168.1.45', dst: '1.1.1.1', proto: 'DNS', len: 74, info: 'Standard query 0x1a2b A update-service-cdn.top', isThreat: true },
    { no: 2, time: '0.014201', src: '1.1.1.1', dst: '192.168.1.45', proto: 'DNS', len: 90, info: 'Standard query response 0x1a2b A 185.220.101.5', isThreat: true },
    { no: 3, time: '0.025110', src: '192.168.1.45', dst: '185.220.101.5', proto: 'TCP', len: 66, info: '49212 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460', isThreat: false },
    { no: 4, time: '0.082914', src: '192.168.1.45', dst: '185.220.101.5', proto: 'HTTP', len: 482, info: 'POST /api/v1/beacon HTTP/1.1 (Encrypted C2 Payload Attached)', isThreat: true, flag: 'FLAG{PCAP_C2_EXFIL_IDENTIFIED}' },
    { no: 5, time: '0.124800', src: '185.220.101.5', dst: '192.168.1.45', proto: 'HTTP', len: 142, info: 'HTTP/1.1 200 OK (text/plain: cmd=whoami&sleep=60)', isThreat: true },
    { no: 6, time: '1.402194', src: '192.168.1.45', dst: '142.250.180.14', proto: 'TLSv1.3', len: 1240, info: 'Application Data (Legitimate Google Cloud Telemetry)', isThreat: false },
    { no: 7, time: '2.100412', src: '192.168.1.45', dst: '185.220.101.5', proto: 'TCP', len: 840, info: 'Data Exfiltration Chunk [PSH, ACK] Length=774 bytes', isThreat: true },
  ];

  const filteredPackets = packets.filter(p => {
    if (!displayFilter) return true;
    const f = displayFilter.toLowerCase();
    return p.proto.toLowerCase().includes(f) || p.info.toLowerCase().includes(f) || p.src.includes(f) || p.dst.includes(f);
  });

  const activePkt = packets.find(p => p.no === selectedPacket) || packets[0];

  const handleVerifyFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (submittedFlag.trim().toUpperCase() === 'FLAG{PCAP_C2_EXFIL_IDENTIFIED}') {
      setFlagFeedback('success');
      if (!hasAwarded && onComplete) {
        onComplete(180);
        setHasAwarded(true);
      }
    } else {
      setFlagFeedback('error');
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">التحقيق الجنائي للشبكات وتحليل الحزم (KAyA LAB #02)</h3>
            <span className="text-xs font-mono text-slate-400">Wireshark Stream · C2 Beacon Hunting · PCAP Forensics</span>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Target File: <span className="text-emerald-400 font-bold">incident_capture_2026.pcap</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={displayFilter}
          onChange={(e) => setDisplayFilter(e.target.value)}
          placeholder="تصفية الحزم (Display Filter: http, dns, 185.220...)"
          dir="ltr"
          className="w-full bg-transparent text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
        />
        {displayFilter && (
          <button onClick={() => setDisplayFilter('')} className="text-xs text-slate-400 hover:text-white px-2 cursor-pointer">
            إلغاء
          </button>
        )}
      </div>

      {/* Wireshark Packet Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto max-h-56">
          <table className="w-full text-start">
            <thead className="bg-slate-950 text-slate-400 text-[11px] sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3 text-start">No.</th>
                <th className="py-2 px-3 text-start">Time</th>
                <th className="py-2 px-3 text-start">Source</th>
                <th className="py-2 px-3 text-start">Destination</th>
                <th className="py-2 px-3 text-start">Protocol</th>
                <th className="py-2 px-3 text-start">Length</th>
                <th className="py-2 px-3 text-start">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPackets.map((pkt) => (
                <tr
                  key={pkt.no}
                  onClick={() => setSelectedPacket(pkt.no)}
                  className={`cursor-pointer transition-colors ${
                    selectedPacket === pkt.no
                      ? 'bg-emerald-500/15 text-white'
                      : pkt.isThreat
                        ? 'hover:bg-slate-900 text-rose-300/90'
                        : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <td className="py-1.5 px-3">{pkt.no}</td>
                  <td className="py-1.5 px-3 tabular-nums text-slate-400">{pkt.time}</td>
                  <td className="py-1.5 px-3">{pkt.src}</td>
                  <td className="py-1.5 px-3">{pkt.dst}</td>
                  <td className="py-1.5 px-3 font-bold text-cyan-300">{pkt.proto}</td>
                  <td className="py-1.5 px-3 tabular-nums">{pkt.len}</td>
                  <td className="py-1.5 px-3 truncate max-w-xs">{pkt.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packet Inspection Details Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 font-mono text-xs">
          <div className="text-slate-400 text-[11px] flex items-center justify-between border-b border-slate-800 pb-2">
            <span>تفاصيل الحزمة المحددة (Frame {activePkt.no})</span>
            <span className={activePkt.isThreat ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {activePkt.isThreat ? 'حزمة مشبوهة (Threat Vector)' : 'حزمة اعتيادية'}
            </span>
          </div>

          <div className="space-y-1 text-slate-300 text-[11px]" dir="ltr">
            <div>&gt; Frame {activePkt.no}: {activePkt.len} bytes on wire (672 bits)</div>
            <div>&gt; Ethernet II, Src: 00:0c:29:4a:1b:99, Dst: 00:50:56:c0:00:08</div>
            <div>&gt; Internet Protocol Version 4, Src: {activePkt.src}, Dst: {activePkt.dst}</div>
            <div>&gt; {activePkt.proto} Payload Data:</div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-emerald-300 font-bold">
              {activePkt.info}
            </div>
            {activePkt.flag && (
              <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 mt-2">
                <span className="text-[11px] block text-slate-400">قيمة الـ Flag المستخرجة من الحزمة:</span>
                <span className="font-bold select-all">{activePkt.flag}</span>
              </div>
            )}
          </div>
        </div>

        {/* Challenge Submission Form */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>تسليم راية التحدي (Submit Flag)</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            ابحث عن حزمة اتصال خادم التحكم الخبيث C2 المشفوع بطلب استدعاء البرمجية، واستخرج الـ Flag المكتشف وضعه في الحقل أدناه لإكمال المختبر.
          </p>

          <form onSubmit={handleVerifyFlag} className="space-y-2">
            <input
              type="text"
              value={submittedFlag}
              onChange={(e) => setSubmittedFlag(e.target.value)}
              placeholder="FLAG{...}"
              dir="ltr"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              التحقق من صحة الإجابة (+180 XP)
            </button>
          </form>

          {flagFeedback === 'success' && (
            <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
              🎉 إجابة صحيحة! تم منحك 180 نقطة خبرة وتوثيق إتمام مختبر التحقيق الجنائي.
            </div>
          )}
          {flagFeedback === 'error' && (
            <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs text-center">
              ❌ إجابة غير صحيحة. تفحص الحزمة رقم 4 (Frame #4) بعناية.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
