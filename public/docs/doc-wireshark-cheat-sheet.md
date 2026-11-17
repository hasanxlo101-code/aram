# بطاقة مرجعية لمرشحات Wireshark للتحليل الدفاعي
**أكاديمية KAyA Safe&Sec** · *Display Filters*، وليست Capture Filters (BPF) ما لم يُذكر.

## أساسيات
| الهدف | المرشح |
|---|---|
| عنوان معيّن (مصدر أو وجهة) | `ip.addr == 10.0.0.5` |
| مصدر فقط / وجهة فقط | `ip.src == 10.0.0.5` · `ip.dst == 10.0.0.5` |
| شبكة فرعية | `ip.addr == 10.0.0.0/24` |
| منفذ | `tcp.port == 443` · `udp.port == 53` |
| استبعاد ضجيج | `!(arp or dns or icmp)` |
| نص داخل الحمولة | `frame contains "password"` |

## اكتشاف الاستطلاع والمسح
- مسح SYN (طلبات اتصال بلا إكمال): `tcp.flags.syn==1 && tcp.flags.ack==0`
- ثم عدّ الأهداف/المنافذ عبر **Statistics ▸ Conversations** لمصدر واحد يطرق منافذ كثيرة.
- مسح NULL/FIN/Xmas: `tcp.flags==0x000` · `tcp.flags==0x001` · `tcp.flags==0x029`
- ICMP Echo من مصدر واحد لعدة أهداف: `icmp.type==8`
- كثافة ARP مشبوهة (Spoofing): `arp.duplicate-address-detected || arp.duplicate-address-frame`

## DNS
- كل استعلامات DNS: `dns`
- استعلامات فقط / ردود فقط: `dns.flags.response==0` · `dns.flags.response==1`
- أخطاء NXDOMAIN (DGA محتمل): `dns.flags.rcode==3`
- أسماء طويلة (نفق DNS محتمل): `dns.qry.name.len > 50`
- نوع TXT (يُستخدم للنفق وC2): `dns.qry.type==16`

## HTTP / TLS
- طلبات POST (نماذج/تسريب): `http.request.method=="POST"`
- مضيف معيّن: `http.host contains "example.com"`
- استجابات الخطأ: `http.response.code >= 400`
- User-Agent غير معتاد: `http.user_agent contains "curl" || http.user_agent contains "python"`
- تنزيل ملفات تنفيذية: `http.content_type contains "application/x-msdownload"`
- مصافحات TLS (Client Hello): `tls.handshake.type==1`
- اسم الخادم SNI: `tls.handshake.extensions_server_name contains "example"`
- إصدارات TLS قديمة: `tls.record.version < 0x0303`
- *لفك تشفير HTTPS ضمن مختبرك:* اضبط `SSLKEYLOGFILE` في المتصفح ثم حمّله في Wireshark (Preferences ▸ TLS ▸ Pre-Master-Secret log).

## بروتوكولات الشبكات الداخلية
- SMB: `smb || smb2` · ملفات: `smb2.filename` · محاولات مصادقة: `ntlmssp`
- Kerberos: `kerberos` · أخطاء: `kerberos.error_code`
- RDP: `tcp.port==3389`
- LLMNR/NBT-NS (سرقة تجزئات): `udp.port==5355 || udp.port==137`
- DHCP: `dhcp` (ابحث عن خوادم DHCP مارقة بعنوان مصدر غير متوقع).

## إعادة بناء وتتبّع
- تتبّع جلسة: Right-click ▸ **Follow ▸ TCP Stream** (أو `tcp.stream eq 5`).
- استخراج ملفات: **File ▸ Export Objects ▸ HTTP/SMB**.
- تقدير التوقيت والإرسال المتكرر (Beaconing): **Statistics ▸ I/O Graphs** لمصدر/وجهة واحدة، وابحث عن فواصل منتظمة.
- أخطاء إعادة الإرسال: `tcp.analysis.retransmission` · `tcp.analysis.flags`

## نصائح عمل
1. التقط على أقل نقطة ممكنة تحمل الحدث، وسجّل زمن البدء والنهاية.
2. احفظ ملف `.pcapng` الأصلي كما هو واعمل على نسخة، واحسب تجزئته (SHA-256).
3. لا تحلّل حركة لا تملك تفويضًا بمراقبتها.
