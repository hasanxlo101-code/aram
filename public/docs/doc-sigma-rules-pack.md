# حزمة قواعد Sigma للكشف الدفاعي
**أكاديمية KAyA Safe&Sec** · القواعد بصيغة Sigma الرسمية، وتُحوَّل إلى Splunk/Elastic/Wazuh عبر `sigma-cli`.

## الاستخدام
```bash
pip install sigma-cli
sigma plugin install splunk elasticsearch
sigma convert -t splunk -p splunk_windows rule.yml
sigma convert -t lucene -p ecs_windows rule.yml
```
**مهم:** اختبر كل قاعدة على بيانات بيئتك واضبط الاستثناءات (False Positives) قبل تفعيل التنبيه. القواعد نقطة بداية، لا حلًا نهائيًا.

---
## 1) PowerShell بأمر مشفّر (Base64)
```yaml
title: Suspicious PowerShell Encoded Command
id: e3cc4970-713c-4a9d-87cb-f7b63003accb
status: experimental
description: يكشف تشغيل PowerShell بمعامل الأمر المشفّر، وهو أسلوب شائع للإخفاء.
logsource:
  category: process_creation
  product: windows
detection:
  selection_img:
    Image|endswith:
      - '\powershell.exe'
      - '\pwsh.exe'
  selection_cli:
    CommandLine|contains:
      - ' -enc '
      - ' -EncodedCommand '
      - ' -ec '
  condition: selection_img and selection_cli
falsepositives:
  - أدوات إدارة مشروعة تستخدم الأوامر المشفّرة (SCCM وغيره)
level: medium
tags:
  - attack.execution
  - attack.t1059.001
  - attack.t1027
```

## 2) تطبيقات Office تُنتج أوامر Shell
```yaml
title: Office Application Spawning Command Shell
id: 54e11dc0-e2ee-418c-944c-aff98bf02a4c
status: experimental
description: Word/Excel/PowerPoint تشغّل cmd أو PowerShell، مؤشر على ماكرو خبيث.
logsource:
  category: process_creation
  product: windows
detection:
  parent:
    ParentImage|endswith:
      - '\winword.exe'
      - '\excel.exe'
      - '\powerpnt.exe'
  child:
    Image|endswith:
      - '\cmd.exe'
      - '\powershell.exe'
      - '\wscript.exe'
      - '\mshta.exe'
  condition: parent and child
falsepositives:
  - ماكروهات مؤسسية موثّقة
level: high
tags:
  - attack.execution
  - attack.t1204.002
```

## 3) حذف نسخ الظل (مؤشر فدية)
```yaml
title: Volume Shadow Copy Deletion
id: ec3f19be-6604-4a2f-ae05-1b620573c222
status: experimental
description: حذف نسخ Volume Shadow يمنع الاستعادة وهو سلوك متكرر في برمجيات الفدية.
logsource:
  category: process_creation
  product: windows
detection:
  vssadmin:
    Image|endswith: '\vssadmin.exe'
    CommandLine|contains|all:
      - 'delete'
      - 'shadows'
  wmic:
    Image|endswith: '\wmic.exe'
    CommandLine|contains|all:
      - 'shadowcopy'
      - 'delete'
  bcdedit:
    Image|endswith: '\bcdedit.exe'
    CommandLine|contains: 'recoveryenabled no'
  condition: vssadmin or wmic or bcdedit
falsepositives:
  - مهام صيانة قرص مجدولة (نادرًا)
level: high
tags:
  - attack.impact
  - attack.t1490
```

## 4) الوصول إلى ذاكرة LSASS
```yaml
title: Suspicious LSASS Process Access
id: 1b3d22c3-8d04-4e09-a10c-1dd532d3a20c
status: experimental
description: عملية تطلب صلاحيات قراءة ذاكرة lsass.exe، شائع لسرقة بيانات الاعتماد. يتطلب Sysmon Event ID 10.
logsource:
  category: process_access
  product: windows
detection:
  selection:
    TargetImage|endswith: '\lsass.exe'
    GrantedAccess|contains:
      - '0x1010'
      - '0x1410'
      - '0x1438'
      - '0x143a'
      - '0x1fffff'
  filter_system:
    SourceImage|startswith:
      - 'C:\Windows\System32\'
      - 'C:\Program Files\Windows Defender\'
  condition: selection and not filter_system
falsepositives:
  - أدوات EDR/مضادات الفيروسات (أضفها للاستثناءات)
level: high
tags:
  - attack.credential_access
  - attack.t1003.001
```

## 5) إنشاء مهمة مجدولة للثبات
```yaml
title: Scheduled Task Creation via schtasks
id: 10d93405-b355-49d5-b4f7-4ba9e4031c66
status: experimental
description: إنشاء مهام مجدولة بـ schtasks أسلوب ثبات شائع.
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith: '\schtasks.exe'
    CommandLine|contains: ' /create '
  filter_legit:
    CommandLine|contains:
      - '\Microsoft\Windows\'
  condition: selection and not filter_legit
falsepositives:
  - برامج تثبّت مهام تحديث
level: low
tags:
  - attack.persistence
  - attack.t1053.005
```

## 6) فشل دخول متكرر (Wazuh/ SIEM، منطق للتجميع)
```yaml
title: Multiple Failed Logons From Single Source
id: 179b2105-4513-48b9-bbc9-d2b2b8f10edd
status: experimental
description: 4625 متكرر من مصدر واحد. التجميع (≥10 خلال 5 دقائق) يُضبط في SIEM لأن Sigma الأساسي لا يعدّ.
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4625
  condition: selection | count() by IpAddress > 10
  timeframe: 5m
falsepositives:
  - حساب خدمة بكلمة مرور قديمة
level: medium
tags:
  - attack.credential_access
  - attack.t1110
```
