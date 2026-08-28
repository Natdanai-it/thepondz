window.PROCUREMENT_DECKS = {
  1: {
    shortTitle: "IT & Hardware / Software",
    handbook: "course-it-procurement-day1.html",
    totalMinutes: 120,
    slides: [
      {
        type: "cover", kicker: "IT PROCUREMENT INTENSIVE · DAY 1",
        title: "เข้าใจ Hardware, Software และ License ก่อนเทียบราคา",
        subtitle: "จากคำศัพท์ที่เคยเห็น ให้กลายเป็นความเข้าใจที่ใช้ตรวจ Requirement และคุยกับฝ่าย IT หรือ Vendor ได้จริง",
        badge: "CORE LESSON · 2 HOURS", duration: 2,
        notes: "เปิดด้วยเป้าหมายของคนจัดซื้อ: ไม่ต้องเป็น Engineer แต่ต้องรู้ว่าข้อมูลอะไรจำเป็น อะไรยังไม่พอ และจุดไหนต้องให้ IT ยืนยัน"
      },
      {
        kicker: "LEARNING OUTCOMES", title: "วันนี้ต้องทำอะไรได้บ้าง",
        columns: [
          {title:"เข้าใจ", items:["หน้าที่ CPU, GPU, RAM และ Storage","ความต่าง Hardware / Software / License / Service"]},
          {title:"ตรวจได้", items:["ชื่อรุ่นเต็ม, SKU, OS และ Warranty","จุดที่ Vendor เสนอไม่ตรง Requirement"]},
          {title:"ตัดสินใจได้", items:["แยก Equal / Higher / Lower / Unknown","ส่งคำถามกลับ IT หรือ Vendor อย่างเฉพาะเจาะจง"]}
        ],
        callout: "ผลลัพธ์ปลายวัน: อ่านใบเสนอราคา Notebook และ Microsoft License ได้อย่างเป็นระบบ", duration: 4,
        notes: "ถามผู้เรียนก่อนว่าในงานจริงซื้ออะไรบ่อยที่สุด แล้วเก็บตัวอย่างไว้ใช้เชื่อมกับแต่ละหัวข้อ"
      },
      {
        kicker: "01 · SYSTEM VIEW", title: "ระบบ IT หนึ่งงานมี 4 ส่วน",
        columns: [
          {title:"Hardware", items:["อุปกรณ์ที่จับต้องได้","Notebook, Server, Switch, Firewall"]},
          {title:"Software", items:["โปรแกรมที่ทำงานบน Hardware","Windows, ERP, Antivirus"]},
          {title:"License", items:["สิทธิ์ใช้งานตามเงื่อนไข","จำนวน User/Device และระยะเวลา"]},
          {title:"Service", items:["ติดตั้ง ย้ายระบบ ดูแล Support","มี Scope, SLA และ Deliverable"]}
        ],
        callout: "ใบเสนอราคา 1 ใบอาจมีครบทั้ง 4 ส่วน จึงห้ามมองว่าเป็น “สินค้า 1 รายการ”", duration: 5,
        notes: "ยกตัวอย่าง Notebook + Windows Pro + Microsoft 365 + On-site setup ให้ผู้เรียนแยก 4 ส่วน"
      },
      {
        kicker: "02 · PROCUREMENT MINDSET", title: "อย่าเริ่มจากคำถามว่า “รุ่นไหนถูกกว่า”",
        bullets: [
          "เริ่มจาก Use Case — ใครใช้ ใช้ทำอะไร และสำคัญแค่ไหน",
          "แปลง Use Case เป็น Requirement ที่ตรวจสอบได้",
          "ตรวจ Compatibility กับระบบ อุปกรณ์ และ Software เดิม",
          "ตรวจ SKU, License, Warranty, Service และระยะสัญญา",
          "เมื่อ Technical ผ่านแล้วจึงค่อยเปรียบเทียบราคาและ TCO"
        ],
        callout: "ลำดับที่ถูก: Use Case → Requirement → Compatibility → Commercial", duration: 5,
        notes: "เน้นว่าของที่แรงกว่าอาจใช้ไม่ได้ และของที่ถูกกว่าอาจมีค่าใช้จ่ายต่อเนื่องสูงกว่า"
      },
      {
        kicker: "03 · CPU", title: "ชื่อ i5 หรือ i7 อย่างเดียวยังเทียบไม่ได้",
        table: {
          headers:["ต้องดู", "คำถามสำหรับจัดซื้อ", "ความเสี่ยงถ้าไม่ตรวจ"],
          rows:[
            ["Model เต็ม", "CPU รุ่นใดแน่นอน?", "คนละ Generation/ระดับ"],
            ["Core / Thread", "งานหลายโปรแกรมหรือ VM หรือไม่?", "ประสิทธิภาพไม่พอ"],
            ["Power class", "Notebook, Desktop หรือ Server?", "เทียบข้ามประเภท"],
            ["Benchmark", "ทดสอบงานประเภทใด?", "ยึดคะแนนเดียว"],
            ["Platform", "รองรับ RAM/OS/Feature ที่ต้องใช้ไหม?", "ซื้อแล้วไม่ Compatible"]
          ]
        },
        callout: "หลักฐานสเปกใช้ข้อมูลผู้ผลิต; Benchmark เป็นข้อมูลประกอบ ไม่ใช่ Requirement ทั้งหมด", duration: 7,
        notes: "ยกตัวอย่าง i7 รุ่นเก่ากับ Core Ultra 5 รุ่นใหม่ แต่ห้ามฟันธงจนกว่าจะได้ Model เต็มและ Use Case"
      },
      {
        kicker: "04 · GPU", title: "GPU ต้องเลือกจากงานและ Software Compatibility",
        columns: [
          {title:"งานทั่วไป", items:["Office, Browser, Teams","Integrated GPU มักเพียงพอ","ประหยัดไฟและราคา"]},
          {title:"งานเฉพาะทาง", items:["CAD, 3D, Video, AI","ดู Model และ VRAM","ตรวจ Driver / CUDA / Software certification"]},
          {title:"คำถามสำคัญ", items:["Training หรือ Inference?","Model ใหญ่เท่าไร?","Notebook, Workstation หรือ Server?"]}
        ],
        callout: "VRAM มากกว่า ≠ GPU เร็วกว่าเสมอ และ GPU ที่แรงกว่า ≠ ใช้กับ Software ได้เสมอ", duration: 6,
        notes: "ใช้กรณี Vendor เสนอ AMD แต่โปรแกรมกำหนด NVIDIA CUDA เพื่ออธิบาย Compatibility"
      },
      {
        kicker: "05 · RAM & STORAGE", title: "ความจุเท่ากัน ไม่ได้แปลว่าสเปกเท่ากัน",
        table: {
          headers:["รายการ", "นอกจากความจุ ต้องดู", "ตัวอย่างความต่าง"],
          rows:[
            ["RAM", "DDR, Speed, ECC, Module, Slot", "32GB = 16×2 หรือ 32×1"],
            ["SSD", "SATA/NVMe, PCIe, Form factor", "1TB SATA ≠ 1TB NVMe"],
            ["Enterprise SSD", "Endurance, DWPD/TBW, Hot swap", "ใช้งาน Server ต่างจาก Consumer"],
            ["HDD", "RPM, Interface, Workload rating", "CCTV/Archive/Server ใช้คนละงาน"],
            ["RAID", "Raw vs Usable, Controller, Spare", "4×1TB ไม่ได้แปลว่าใช้ได้ 4TB"]
          ]
        },
        callout: "Better specification ไม่ได้แปลว่าใส่แทนได้ — ต้องตรวจ Platform Compatibility", duration: 7,
        notes: "ให้ผู้เรียนตอบว่า 1TB SATA SSD กับ 1TB NVMe SSD ตรง Requirement เดียวกันหรือไม่"
      },
      {
        kicker: "06 · DEVICE TYPE", title: "เลือกประเภทเครื่องจากลักษณะงาน",
        columns: [
          {title:"Notebook", items:["พกพา Hybrid work","ดู Battery, Weight, Port, Dock","Business warranty สำคัญ"]},
          {title:"Desktop", items:["คุ้มค่าและ Upgrade ง่าย","เหมาะกับโต๊ะทำงานประจำ","ดู PSU, Expansion, Monitor"]},
          {title:"Workstation", items:["CAD, Engineering, Data","GPU/Driver certification","ECC และ Support เฉพาะทาง"]},
          {title:"Server", items:["ทำงานต่อเนื่องหลาย User","ECC, RAID, Hot swap, Redundant PSU","Remote management และ On-site support"]}
        ],
        callout: "อย่าเรียกเครื่องสเปกสูงทุกเครื่องว่า Server — จุดต่างอยู่ที่ Reliability, Management และ Support", duration: 6,
        notes: "เทียบ Desktop สเปกแรงกับ Server ที่ CPU/RAM ดูต่ำกว่า แต่รองรับงานต่อเนื่องและอะไหล่สำรอง"
      },
      {
        kicker: "07 · OPERATING SYSTEM", title: "OS ต้องตรง Edition, Architecture และสิทธิ์ใช้งาน",
        columns: [
          {title:"Windows 11 Home", items:["เหมาะผู้ใช้ทั่วไป","ขาด Feature องค์กรบางส่วน","ไม่ควรแทน Pro โดยไม่ยืนยัน"]},
          {title:"Windows 11 Pro", items:["รองรับ Domain/Management มากขึ้น","พบบ่อยใน Business Notebook","ตรวจว่า License ติดมากับ SKU"]},
          {title:"Windows Server / Linux", items:["ต้องดู Version และ Workload","มี CAL/Subscription/Support เพิ่มได้","ตรวจ Software compatibility"]}
        ],
        callout: "Vendor เสนอ Windows Home แทน Pro ถือเป็น Technical Deviation แม้เครื่องเปิดใช้งานได้", duration: 5,
        notes: "แยกคำว่าเครื่องมี Windows, มี Product Key และมีสิทธิ์ใช้งานถูกต้องว่าไม่ใช่สิ่งเดียวกัน"
      },
      {
        kicker: "08 · MICROSOFT 365", title: "คำว่า Microsoft 365 อย่างเดียวยังออก PO ไม่ได้",
        table: {
          headers:["ต้องระบุ", "ตัวอย่าง", "เหตุผล"],
          rows:[
            ["ชื่อ Plan เต็ม", "Business Basic / Standard / Premium", "Feature และ App ต่างกัน"],
            ["จำนวน User", "100 Users", "คิดสิทธิ์ตามผู้ใช้"],
            ["Tenant", "บริษัทใด / Domain ใด", "ป้องกันลงผิด Tenant"],
            ["Teams", "With Teams / No Teams", "SKU และ Feature อาจต่างกัน"],
            ["Term & Billing", "12 เดือน / รายเดือนหรือรายปี", "Commitment และราคาแตกต่าง"],
            ["Start / Renewal", "วันเริ่มและหมดอายุ", "ควบคุม Continuity และงบประมาณ"]
          ]
        },
        callout: "Plan ต้องตรง Requirement; Plan ที่ราคาถูกกว่าไม่ถือว่า Equivalent", duration: 7,
        notes: "ตัวอย่าง Business Basic กับ Standard: จำนวน User เท่ากันแต่ Desktop Apps และ Feature ไม่เท่ากัน"
      },
      {
        kicker: "09 · MICROSOFT LICENSING", title: "Microsoft ไม่ได้มีแค่ Office และ Microsoft 365",
        columns: [
          {title:"Client", items:["Windows 11 Edition","Microsoft 365 / Office","User หรือ Device"]},
          {title:"Server", items:["Windows Server Edition/Core","Windows Server CAL","RDS CAL เมื่อต้องใช้ Remote Desktop Services"]},
          {title:"Control", items:["Tenant และ License owner","Proof of entitlement","Renewal, Coterm และจำนวนสิทธิ์"]}
        ],
        callout: "ก่อนซื้อให้ถาม: Product อะไร, License metric อะไร, ให้สิทธิ์ใคร, ใช้ที่ไหน และนานเท่าไร", duration: 8,
        notes: "ไม่ต้องสอนคำนวณ License ขั้นสูง แต่ให้ผู้เรียนรู้ว่าเมื่อเจอ Server/CAL/RDS ต้องขอ IT หรือ Licensing Specialist ยืนยัน"
      },
      {
        kicker: "10 · SERVICE PROCUREMENT", title: "ซื้อ Service ต้องตรวจ Scope มากกว่าชั่วโมงหรือราคา",
        table: {
          headers:["หมวด", "สิ่งที่ต้องเขียนให้ชัด"],
          rows:[
            ["Scope", "ติดตั้งอะไร ที่ไหน กี่ระบบ รวม/ไม่รวมอะไร"],
            ["Deliverable", "Configuration, Diagram, Document, Training"],
            ["Migration", "Cutover window, Downtime, Backup, Rollback"],
            ["Acceptance", "เกณฑ์ทดสอบ ผู้อนุมัติ และวันส่งมอบ"],
            ["Support", "8×5/24×7, Response vs Resolution, On-site/Remote"],
            ["Change", "งานนอก Scope, Rate และขั้นตอนอนุมัติ"],
            ["Dependency", "สิ่งที่ลูกค้า/Vendor ต้องเตรียม"]
          ]
        },
        callout: "บริการที่ Scope ไม่ชัด มีโอกาสเกิดค่าใช้จ่ายเพิ่มและข้อโต้แย้งมากกว่าสินค้าที่สเปกชัด", duration: 7,
        notes: "ยกตัวอย่างราคา “ติดตั้ง Server” แต่ไม่บอกจำนวน VM, Migration, Downtime และเอกสารส่งมอบ"
      },
      {
        kicker: "11 · SKU, WARRANTY & QUOTATION", title: "ชื่อรุ่นเหมือนกัน แต่ของที่ได้รับอาจต่างกัน",
        bullets: [
          "ตรวจ Part Number / SKU — ระบุ Configuration, Region หรือ Bundle",
          "ตรวจ OS, Adapter, Power supply, Accessories และ License ที่รวมมา",
          "Warranty ต้องดู On-site/Carry-in, Response, Parts และสถานที่ให้บริการ",
          "ตรวจ Lead time, Validity, VAT, Payment term และเงื่อนไขส่งมอบ",
          "เขียน Assumption และสิ่งที่ยังต้องยืนยัน ห้ามเดาจากชื่อสินค้า"
        ],
        callout: "Model คือชื่อกลุ่มสินค้า; SKU คือสิ่งที่ Vendor จะส่งจริง", duration: 7,
        notes: "แสดงใบเสนอราคาจริงแล้ววง Model, SKU, Warranty, Lead time, License term และ Service scope"
      },
      {
        type: "activity", kicker: "WORKSHOP 1 · 16 MIN", title: "เปรียบเทียบ Business Notebook",
        scenario: "Requirement: Business Notebook, CPU ระดับ Core i7, RAM 16GB, 512GB NVMe, Windows 11 Pro, Wi‑Fi 6 และ Warranty 3 ปี On-site",
        task: "ตรวจ Vendor A/B ทีละรายการ แล้วให้สถานะ PASS / CHECK / FAIL พร้อมเขียนคำถามที่ต้องส่งกลับ Vendor",
        table: {
          headers:["รายการ", "Vendor A", "Vendor B", "ตัดสิน"],
          rows:[
            ["CPU", "ระบุแค่ Core i7", "Core Ultra 5 135U", "CHECK"],
            ["RAM", "16GB", "16GB", "PASS"],
            ["Storage", "512GB ไม่ระบุ Interface", "1TB NVMe", "CHECK / PASS"],
            ["OS", "Windows 11 Home", "Windows 11 Pro", "FAIL / PASS"],
            ["Warranty", "3Y Carry-in", "3Y On-site", "FAIL / PASS"]
          ]
        },
        duration: 16,
        notes: "ให้ผู้เรียนทำ 8 นาที อภิปราย 5 นาที และสรุปหลักการ 3 นาที ไม่ต้องรีบเลือกรุ่นจนกว่าข้อมูล CPU/SKU จะครบ"
      },
      {
        kicker: "12 · DECISION MATRIX", title: "ตัดสิน Technical ก่อน Commercial",
        table: {
          headers:["สถานะ", "ความหมาย", "การดำเนินการ"],
          rows:[
            ["PASS", "ตรงหรือสูงกว่าโดยไม่กระทบ Compatibility", "เข้าสู่การเทียบราคา"],
            ["CHECK", "ข้อมูลไม่ครบหรือยังเทียบไม่ได้", "ถาม Vendor/IT พร้อมหลักฐาน"],
            ["FAIL", "ต่ำกว่า/ผิด Edition/ไม่ Compatible", "ไม่ผ่าน หรือขออนุมัติ Deviation"],
            ["OPTION", "ใช้ได้แต่ไม่ใช่ Equivalent โดยตรง", "เสนอเป็น Alternative แยก"]
          ]
        },
        callout: "อย่าซ่อน Deviation และอย่าใช้คำว่า “เทียบเท่า” หากยังไม่มีหลักฐานรองรับ", duration: 8,
        notes: "ให้ผู้เรียนใช้คำ PASS/CHECK/FAIL เหมือนกันทั้งทีม จะช่วยลดการตีความคลุมเครือ"
      },
      {
        kicker: "13 · QUESTIONS", title: "ถาม IT และ Vendor ให้ได้คำตอบที่นำไปใช้ต่อได้",
        columns: [
          {title:"ไม่ควรถาม", className:"bad", items:["รุ่นนี้เหมือนกันไหม?","ตัวนี้ดีกว่าใช่ไหม?","ใช้ได้หรือเปล่า?"]},
          {title:"ควรถาม", className:"good", items:["Part Number นี้รวม Windows 11 Pro หรือไม่?","SSD เป็น NVMe Interface ใด?","Warranty เป็น On-site และ Response เท่าไร?","Plan นี้ลง Tenant ใดและเริ่มวันไหน?"]}
        ],
        callout: "คำถามที่ดีต้องระบุ Feature, Metric, Version, Term หรือหลักฐานที่ต้องการ", duration: 4,
        notes: "ให้ผู้เรียนลองเปลี่ยนคำถามกว้าง ๆ หนึ่งคำถามให้เป็นคำถามเฉพาะเจาะจง"
      },
      {
        kicker: "14 · BEFORE PO", title: "Checklist ก่อนออก PO — Day 1",
        bullets: [
          "Use Case และ Must Have ได้รับการยืนยันแล้ว",
          "Model เต็ม, Part Number/SKU และ Quantity ถูกต้อง",
          "CPU/GPU/RAM/Storage/OS ตรงและ Compatible",
          "License: Product, Plan, Metric, Tenant, Term และ Renewal ชัดเจน",
          "Warranty, Service scope, Deliverable และ Acceptance ชัดเจน",
          "Deviation ทุกข้อมีผู้อนุมัติและมีหลักฐานแนบ"
        ],
        callout: "ถ้าข้อมูลสำคัญเป็น Unknown — ยังไม่ควรออก PO", duration: 5,
        notes: "ชวนผู้เรียนเลือก 3 ข้อที่เคยพลาดในงานจริง แล้วนำไปใช้เป็น checklist ประจำทีม"
      },
      {
        type: "summary", kicker: "DAY 1 · SUMMARY & Q&A", title: "จำ 3 หลักนี้ให้ได้",
        cards: [
          {title:"ซื้อจากงาน", text:"เริ่มจาก Use Case และ Requirement ไม่ใช่ชื่อรุ่นหรือราคา"},
          {title:"เทียบให้ครบ", text:"ดู Model, SKU, Compatibility, License, Warranty และ Service"},
          {title:"ไม่รู้ให้ถาม", text:"ข้อมูลไม่ครบให้สถานะ CHECK และขอหลักฐาน ห้ามเดา"}
        ],
        callout: "พรุ่งนี้: Network, FortiGate, Server, VM, Backup และ Cloud ในมุม Procurement",
        duration: 11,
        notes: "ใช้ 6 นาทีสรุปและ 10 นาทีถามตอบ หากเวลาเหลือน้อยให้รวบคำถามที่ต้องค้นจาก Datasheet ไปต่อ Day 2"
      }
    ]
  },

  2: {
    shortTitle: "Network / Security / Server / Cloud",
    handbook: "course-it-procurement-day2.html",
    totalMinutes: 120,
    slides: [
      {
        type:"cover", kicker:"IT PROCUREMENT INTENSIVE · DAY 2",
        title:"มอง Network, FortiGate, Server, VM และ Cloud เป็นระบบเดียวกัน",
        subtitle:"เลือกอุปกรณ์และบริการจาก Traffic, Security, Availability, Data และ Support ที่ระบบต้องการจริง",
        badge:"CORE LESSON · 2 HOURS", duration:2,
        notes:"เชื่อมจาก Day 1: วันนี้ไม่ได้ดูอุปกรณ์แยกชิ้น แต่ดูว่าอุปกรณ์แต่ละชิ้นทำงานร่วมกันอย่างไร"
      },
      {
        kicker:"LEARNING OUTCOMES", title:"วันนี้ต้องตรวจอะไรได้บ้าง",
        columns:[
          {title:"Network",items:["Router / Switch / AP ต่างกันอย่างไร","Speed, PoE, VLAN, Uplink"]},
          {title:"Security",items:["Firewall กับ FortiGate bundle","Throughput ภายใต้ Security feature"]},
          {title:"Infrastructure",items:["Server, RAID, Backup, VM","Cloud cost, SLA, RPO/RTO"]}
        ],
        callout:"ผลลัพธ์ปลายวัน: อ่าน Requirement Network/Firewall/Cloud และพบ Metric ที่ยังขาดได้", duration:4,
        notes:"ถามผู้เรียนว่าเคยเห็นคำว่า 1Gbps, PoE+, Threat Protection, vCPU หรือ SLA ในใบเสนอราคาหรือไม่"
      },
      {
        kicker:"01 · NETWORK MAP", title:"สำนักงานหนึ่งแห่งใช้หลายอุปกรณ์ร่วมกัน",
        bullets:[
          "Internet/ISP นำการเชื่อมต่อจากภายนอกเข้ามา",
          "Router เชื่อมต่าง Network และกำหนดเส้นทาง",
          "Firewall ตรวจและควบคุม Traffic ตาม Policy",
          "Switch เชื่อมอุปกรณ์ภายใน LAN",
          "Access Point ให้บริการ Wi‑Fi",
          "Server/NAS/Cloud ให้บริการ Application และ Data"
        ],
        callout:"อุปกรณ์หนึ่งตัวทำได้หลายหน้าที่ แต่ต้องตรวจว่า Requirement ต้องการ Function ใดจริง", duration:5,
        notes:"วาดเส้นทาง User → AP → Switch → Firewall → ISP → Cloud ให้เห็นภาพก่อนลงสเปก"
      },
      {
        kicker:"02 · IP SERVICES", title:"IP, DHCP, DNS และ Gateway ทำหน้าที่คนละอย่าง",
        columns:[
          {title:"IP Address",items:["ที่อยู่ของอุปกรณ์ใน Network","Private กับ Public ไม่เหมือนกัน"]},
          {title:"DHCP",items:["แจก IP และ Network setting อัตโนมัติ","ลดงานกำหนดค่าทีละเครื่อง"]},
          {title:"DNS",items:["แปลงชื่อเป็น IP","DNS มีปัญหาอาจดูเหมือน Internet ล่ม"]},
          {title:"Gateway",items:["ทางออกไป Network อื่น","กำหนดผิดจะออกนอกวงไม่ได้"]}
        ],
        callout:"Internet ใช้ไม่ได้ ไม่ได้แปลว่า ISP เสียเสมอ — ต้องแยก DNS, Gateway, LAN และ Firewall", duration:5,
        notes:"ใช้สถานการณ์เปิดเว็บไม่ได้แต่ Ping IP ได้ เพื่ออธิบายว่าปัญหาอาจอยู่ที่ DNS"
      },
      {
        kicker:"03 · ROUTER, SWITCH & AP", title:"เลือกจาก Port, Speed, Management และขนาดระบบ",
        table:{
          headers:["อุปกรณ์","Metric สำคัญ","คำถามจัดซื้อ"],
          rows:[
            ["Router","WAN/LAN speed, VPN, routing","Internet กี่เส้นและเร็วเท่าไร?"],
            ["Switch","Port, PoE, uplink, managed","ต่อกี่อุปกรณ์และมี VLAN ไหม?"],
            ["Access Point","Wi‑Fi generation, client, PoE","พื้นที่/ผู้ใช้/ความหนาแน่นเท่าไร?"],
            ["Transceiver","SFP/SFP+, speed, distance","ตรง Port และ Fiber เดิมหรือไม่?"],
            ["Cable","Category, length, environment","รองรับ Speed และ PoE หรือไม่?"]
          ]
        },
        callout:"จำนวน Port ต้องรวม Uplink, อุปกรณ์ใหม่, Spare และการเติบโต ไม่ใช่นับเฉพาะวันนี้", duration:6,
        notes:"ให้ผู้เรียนคำนวณ Switch สำหรับ AP 8 ตัว กล้อง 12 ตัว Uplink 2 Port และ Spare 20%"
      },
      {
        kicker:"04 · BANDWIDTH & THROUGHPUT", title:"เลข 1Gbps ไม่ได้รับประกันว่าจะได้ใช้งานจริง 1Gbps",
        columns:[
          {title:"Bandwidth",items:["ความจุสูงสุดของช่องทาง","เหมือนจำนวนเลนถนน"]},
          {title:"Throughput",items:["ปริมาณข้อมูลที่ผ่านได้จริง","ลดลงจาก Protocol/Load/Security"]},
          {title:"Bottleneck",items:["จุดที่ช้าที่สุดจำกัดทั้งระบบ","Internet, Port, Cable, Firewall หรือ Wi‑Fi"]}
        ],
        callout:"ตรวจ End-to-End: Internet 1Gbps แต่ Firewall Threat Protection 500Mbps ระบบก็อาจติดที่ Firewall", duration:5,
        notes:"เน้นให้แยก Port speed, switching capacity, firewall throughput และ internet package"
      },
      {
        kicker:"05 · POE", title:"PoE ต้องดูทั้งมาตรฐานต่อ Port และกำลังไฟรวม",
        table:{
          headers:["ต้องดู","ตัวอย่างคำถาม","ความเสี่ยง"],
          rows:[
            ["มาตรฐาน","802.3af/at/bt?","จ่ายไฟต่ออุปกรณ์ไม่พอ"],
            ["PoE Budget","รวมกี่ Watt?","ครบ Port แต่เปิดพร้อมกันไม่ได้"],
            ["จำนวน PoE Port","ทุก Port จ่ายไฟหรือไม่?","ต่อ AP/Camera ไม่ครบ"],
            ["Power redundancy","มี PSU สำรองไหม?","อุปกรณ์ปลายทางดับพร้อมกัน"],
            ["Growth","เหลือ Budget เท่าไร?","ขยายระบบไม่ได้"]
          ]
        },
        callout:"24-Port PoE Switch ไม่ได้แปลว่าสามารถจ่ายกำลังสูงสุดครบทั้ง 24 Port พร้อมกัน", duration:5,
        notes:"คำนวณตัวอย่าง AP 8×25W + Camera 12×12W แล้วเผื่อ 20%"
      },
      {
        kicker:"06 · VLAN & VPN", title:"VLAN แยก Network — VPN เชื่อม Network อย่างปลอดภัย",
        columns:[
          {title:"VLAN",items:["แยก User, Server, Guest, CCTV","ลด Broadcast และจำกัดการเข้าถึง","ต้องใช้ Managed switch และ Configuration"]},
          {title:"Remote-access VPN",items:["User เชื่อมจากนอกองค์กร","ตรวจจำนวน User, MFA, Client และ License","ดู Performance และ Support"]},
          {title:"Site-to-site VPN",items:["เชื่อมสำนักงานหรือ Cloud","ตรวจ Throughput, Tunnel, Encryption","ต้องมี Public IP/วิธีผ่าน CGNAT ที่เหมาะสม"]}
        ],
        callout:"ซื้ออุปกรณ์ที่รองรับ Feature ยังไม่พอ — ต้องรวมงานออกแบบและ Configuration ใน Service scope", duration:6,
        notes:"ยกตัวอย่างแยก Guest Wi‑Fi ไม่ให้เข้าถึง Server ภายใน"
      },
      {
        kicker:"07 · FIREWALL", title:"Firewall ไม่ใช่ Antivirus และไม่ควรเลือกจากจำนวน User อย่างเดียว",
        bullets:[
          "Firewall ควบคุม Traffic ระหว่าง Network ตาม Policy",
          "NGFW เพิ่ม IPS, Application Control, Web Filtering และ Threat protection",
          "User หนึ่งคนสร้างหลาย Session พร้อมกัน",
          "ต้องดู Internet speed, Traffic mix, VPN และ Security feature ที่เปิด",
          "ตรวจ Interface, HA, Logging, Management และ Product lifecycle"
        ],
        callout:"Requirement “Firewall รองรับ 100 Users” ยังไม่พอสำหรับเลือกรุ่น", duration:6,
        notes:"ถามต่อว่า Internet กี่ Gbps, เปิด SSL inspection/IPS ไหม, มี VPN กี่คน และโตอีกเท่าไร"
      },
      {
        kicker:"08 · FORTIGATE BUNDLE", title:"FortiGate หนึ่งรายการมี Hardware + Support + Security Subscription",
        columns:[
          {title:"Appliance",items:["ตัวเครื่องและ Interface","Performance, Storage, HA","Model และ Part Number"]},
          {title:"FortiCare",items:["Technical support","Firmware access และ RMA ตาม Package","ระยะเวลาและระดับ Support"]},
          {title:"FortiGuard",items:["IPS, Antivirus, Web/DNS filtering","Feature แตกต่างตาม Bundle","วันเริ่มและวันหมดอายุ"]}
        ],
        callout:"ตรวจ Quote ว่าเป็น Hardware only หรือ Bundle และ Subscription เริ่มนับเมื่อไร", duration:7,
        notes:"ชื่อ Bundle และ SKU เปลี่ยนได้ตามช่วงเวลา จึงต้องใช้ Ordering guide/Quote ล่าสุดจาก Partner และตรวจสิทธิ์กับ IT"
      },
      {
        kicker:"09 · FORTIGATE SIZING", title:"เลือกจาก Performance ตอนเปิด Feature ที่ใช้งานจริง",
        table:{
          headers:["Metric","ใช้ประเมิน","ข้อควรระวัง"],
          rows:[
            ["Firewall Throughput","Raw traffic","ไม่สะท้อน Full inspection"],
            ["IPS / NGFW","เปิด Security บางชุด","ดูเงื่อนไขการทดสอบ"],
            ["Threat Protection","เปิดหลาย Security feature","เหมาะกับ Use case มากกว่า Raw"],
            ["SSL Inspection","ตรวจ HTTPS traffic","อาจเป็น Bottleneck สำคัญ"],
            ["Concurrent Sessions","Connection พร้อมกัน","ไม่เท่ากับจำนวน User"],
            ["New Sessions/sec","Connection ใหม่ต่อวินาที","สำคัญกับระบบ Traffic สูง"],
            ["IPsec VPN","Site/Remote connectivity","ดู Algorithm และเงื่อนไขทดสอบ"]
          ]
        },
        callout:"เผื่อ Growth และ Peak load พร้อมให้ IT ยืนยัน Policy/Feature ก่อนเลือกรุ่น", duration:9,
        notes:"เปิด Fortinet Product Matrix เทียบ 2 รุ่น และชี้ Footnote ว่าค่าทดสอบเกิดภายใต้เงื่อนไขใด"
      },
      {
        kicker:"10 · SERVER & RAID", title:"Server ซื้อ Reliability และ Manageability ไม่ใช่แค่สเปกแรง",
        columns:[
          {title:"Compute",items:["CPU, Core, RAM ECC","Workload และ Growth","License ที่ผูกกับ Core"]},
          {title:"Storage",items:["RAID level, Controller, Cache","Raw vs Usable, Hot spare","SSD/HDD workload และ endurance"]},
          {title:"Resilience",items:["Redundant PSU/Fan","Hot swap","Remote management และ On-site support"]}
        ],
        callout:"RAID ช่วยลด Downtime จาก Disk บางกรณี แต่ RAID ไม่ใช่ Backup", duration:7,
        notes:"ยกตัวอย่าง 4×1TB RAID 5/6/10 ให้เห็นว่า Usable capacity และ Fault tolerance ต่างกัน"
      },
      {
        kicker:"11 · BACKUP", title:"ซื้อ Backup ต้องเริ่มจากการกู้คืน ไม่ใช่เริ่มจากพื้นที่เก็บ",
        table:{
          headers:["คำถาม","ต้องได้คำตอบ"],
          rows:[
            ["Backup อะไร?","File, Database, VM, SaaS หรือทั้งระบบ"],
            ["บ่อยแค่ไหน?","Frequency และ RPO"],
            ["กู้คืนภายในเท่าไร?","RTO และ Priority"],
            ["เก็บนานเท่าไร?","Retention และ Version"],
            ["เก็บที่ไหน?","3-2-1, Offsite/Immutable"],
            ["พิสูจน์อย่างไร?","Monitoring และ Restore test"]
          ]
        },
        callout:"Backup ที่ไม่เคยทดสอบ Restore ยังไม่ควรถูกถือว่าพร้อมใช้งาน", duration:6,
        notes:"อธิบาย 3-2-1 และแยก Snapshot ออกจาก Backup"
      },
      {
        kicker:"12 · VM & HYPERVISOR", title:"VM ไม่ได้แปลว่า Cloud และ License ต้องดูทั้ง Host กับ Guest",
        bullets:[
          "Hypervisor แบ่งทรัพยากร Physical Server ให้หลาย VM",
          "ตรวจ Host CPU/RAM/Storage, Cluster, HA และ Live migration",
          "ดู vCPU/vRAM/Virtual disk พร้อม Overcommit policy",
          "ตรวจ Hypervisor subscription/support และ Version compatibility",
          "ตรวจ Guest OS/Application license แยกจาก Hypervisor",
          "Snapshot ใช้ระยะสั้นก่อนเปลี่ยนแปลง ไม่ใช่ Backup ระยะยาว"
        ],
        callout:"Requirement “ต้องการ VM 4 Core 16GB” ยังขาด Platform, Storage, HA, Backup, OS และ Support", duration:8,
        notes:"กล่าวถึง VMware/Hyper‑V/แพลตฟอร์มอื่นเป็นตัวอย่าง แต่ไม่ฟันธงเลือกจากชื่อโดยไม่มี Requirement"
      },
      {
        kicker:"13 · CLOUD MODEL", title:"SaaS, PaaS และ IaaS มีขอบเขตความรับผิดชอบต่างกัน",
        columns:[
          {title:"SaaS",items:["ใช้ Application สำเร็จรูป","คิดตาม User/Plan/Usage","ตรวจ Data, SLA, Exit"]},
          {title:"PaaS",items:["Provider ดูแล Platform มากขึ้น","คิดตาม Service/Transaction","ตรวจ Version และ Lock-in"]},
          {title:"IaaS",items:["VM, Storage, Network","ลูกค้าดูแล OS/Application มากขึ้น","มีค่า Compute, Disk, Backup, Traffic"]}
        ],
        callout:"Cloud ไม่ได้แปลว่า Provider รับผิดชอบทุกอย่าง — ต้องระบุ Shared Responsibility", duration:7,
        notes:"ให้ผู้เรียนแยก Microsoft 365 เป็น SaaS และ Cloud VM เป็น IaaS"
      },
      {
        kicker:"14 · CLOUD PROCUREMENT", title:"ราคา VM เป็นเพียงส่วนหนึ่งของ Cloud TCO",
        table:{
          headers:["หมวด","ตัวแปรที่ต้องตรวจ"],
          rows:[
            ["Compute","Region, VM family, vCPU/RAM, run hours, scaling"],
            ["Storage","Type, capacity, IOPS, transaction, snapshot"],
            ["Network","Public IP, egress, inter-region, VPN/ExpressRoute"],
            ["Continuity","Zone, SLA, Backup, retention, RPO/RTO, DR"],
            ["Security","Identity, logging, encryption, monitoring"],
            ["Commercial","On-demand/commitment, support, tax, currency"],
            ["Exit","Export data, migration, lock-in และค่าปิดระบบ"]
          ]
        },
        callout:"เปรียบเทียบด้วยสถาปัตยกรรมและ Usage assumption เดียวกัน ไม่ใช่เทียบ vCPU/RAM อย่างเดียว", duration:8,
        notes:"แสดง Cost assumption 12 เดือน และเขียนสิ่งที่รวม/ไม่รวมทุกครั้ง"
      },
      {
        type:"activity", kicker:"WORKSHOP 2 · 10 MIN", title:"เลือก Firewall จาก Use Case ไม่ใช่ Raw Throughput",
        scenario:"บริษัทมี Internet 1Gbps เปิด IPS, Application Control และ Malware protection พร้อม VPN และคาดว่า Traffic โต 25%",
        task:"Firewall A: Raw 10Gbps / Threat 700Mbps — Firewall B: Raw 5Gbps / Threat 1.5Gbps ให้เลือกสถานะและระบุข้อมูลที่ยังต้องถาม",
        bullets:["ตรวจ Threat protection และ SSL inspection","ตรวจ Interface/HA/VPN/Session","ตรวจ Subscription/Support/Term","ให้ IT ยืนยัน Feature และ Peak traffic"],
        duration:10,
        notes:"คำตอบไม่ใช่เลือก B ทันที ต้องตรวจข้อมูลอื่น แต่ A มีสัญญาณว่าอาจไม่พอเมื่อเปิด Security feature"
      },
      {
        kicker:"15 · BEFORE PO", title:"Checklist ระบบ Infrastructure",
        bullets:[
          "วาด System view และระบุ Dependency ระหว่างอุปกรณ์/บริการ",
          "ตรวจ Capacity จาก Current, Peak และ Growth",
          "ตรวจ Performance ภายใต้ Feature ที่เปิดจริง",
          "ตรวจ Compatibility, Version, Interface และ Product lifecycle",
          "ตรวจ License/Subscription/Support/HA/Backup และ Renewal",
          "กำหนด Acceptance test, Monitoring, Document และผู้รับผิดชอบ"
        ],
        callout:"ระบบผ่าน Technical เมื่อทุก Component ทำงานร่วมกันได้—not เมื่อแต่ละชิ้นมีสเปกสูง", duration:7,
        notes:"ให้ผู้เรียนเลือกหนึ่งระบบจริงและระบุ Bottleneck/Single point of failure"
      },
      {
        type:"summary", kicker:"DAY 2 · SUMMARY & Q&A", title:"จำ 3 มุมนี้เมื่อซื้อ Infrastructure",
        cards:[
          {title:"Capacity",text:"Current + Peak + Growth พร้อม Bottleneck แบบ End-to-End"},
          {title:"Security & Continuity",text:"Feature, HA, Backup, RPO/RTO, SLA และ Restore test"},
          {title:"Lifecycle & Cost",text:"License, Support, Renewal, EOL/EOS และ TCO ตลอดสัญญา"}
        ],
        callout:"พรุ่งนี้: หา Equivalent/Replacement และทำ Recommendation จากหลักฐานจริง", duration:7,
        notes:"สรุป 4 นาที ถามตอบ 4 นาที หากมีเวลาต่อ ให้เปิด Datasheet Firewall จริงและหา Footnote"
      }
    ]
  },

  3: {
    shortTitle: "Spec Comparison & Procurement Workshop",
    handbook: "course-it-procurement-day3.html",
    totalMinutes: 120,
    slides: [
      {
        type:"cover", kicker:"IT PROCUREMENT INTENSIVE · DAY 3",
        title:"หารุ่นทดแทน เปรียบเทียบ Vendor และเขียน Recommendation อย่างมีหลักฐาน",
        subtitle:"จาก Requirement ที่คลุมเครือ สู่ Comparison Matrix, Deviation, TCO และการอนุมัติก่อนออก PO",
        badge:"WORKSHOP DAY · 2 HOURS", duration:2,
        notes:"Day 3 เน้นลงมือทำ ผู้เรียนต้องได้เอกสารที่นำกลับไปใช้ในงานจริง ไม่ใช่จำชื่อเว็บไซต์"
      },
      {
        kicker:"01 · END-TO-END PROCESS", title:"กระบวนการจัดซื้อ IT ที่ตรวจสอบย้อนหลังได้",
        bullets:[
          "Clarify — เข้าใจ Use Case และผู้อนุมัติ",
          "Structure — แยก Must / Should / Optional",
          "Research — หา Original spec และ Candidate จากแหล่งจริง",
          "Compare — Technical, Compatibility, Lifecycle และ Commercial",
          "Decide — Recommendation, Deviation และ IT approval",
          "Control — PO, Delivery, Acceptance, Asset/License/Renewal record"
        ],
        callout:"ทุกการตัดสินใจต้องย้อนกลับไปหาหลักฐานและผู้อนุมัติได้", duration:5,
        notes:"ใช้ flow นี้เป็นกรอบของทั้ง Day 3 และ Workshop ตอนท้าย"
      },
      {
        kicker:"02 · SOURCES OF TRUTH", title:"ใช้แหล่งข้อมูลตามลำดับความน่าเชื่อถือ",
        columns:[
          {title:"Primary",className:"good",items:["Manufacturer datasheet/product page","Ordering guide / PSREF / QuickSpecs","Compatibility matrix / lifecycle notice"]},
          {title:"Supporting",items:["Authorized partner quote","Benchmark methodology","Distributor stock/lead time"]},
          {title:"Do not rely alone",className:"warn",items:["Google snippet","Marketplace title","AI answer ที่ไม่มี Source","คำว่า “เทียบเท่า” จาก Vendor"]}
        ],
        callout:"บันทึก URL, Document version และวันที่ตรวจ เพราะ Product/License เปลี่ยนได้", duration:5,
        notes:"แสดงความต่างระหว่าง Product family page กับ Datasheet ของ SKU จริง"
      },
      {
        kicker:"03 · REQUIREMENT", title:"แปลงข้อความกว้างให้กลายเป็นเงื่อนไขที่ตรวจได้",
        table:{
          headers:["ข้อความเดิม","ปัญหา","คำถามเพื่อทำให้ตรวจได้"],
          rows:[
            ["CPU แรง","ไม่มี Metric/Use case","งานอะไร? Model/benchmark ขั้นต่ำ?"],
            ["Firewall 100 Users","User ไม่เท่ากับ Traffic","Internet, feature, session, VPN, growth?"],
            ["Server 1TB","ไม่รู้ Raw/Usable/Performance","RAID, usable, IOPS, growth, backup?"],
            ["Cloud พร้อม Backup","ไม่รู้ RPO/RTO/Retention","ถี่เท่าไร เก็บนานเท่าไร กู้กี่ชั่วโมง?"],
            ["Support 24×7","ไม่รู้ Response/Resolution","Severity, channel, on-site และ SLA?" ]
          ]
        },
        callout:"Requirement ที่ดีต้อง Measurable และโยงกลับไปหา Use Case", duration:6,
        notes:"ให้ผู้เรียนเลือก Requirement จริงหนึ่งบรรทัดแล้วเปลี่ยนเป็นคำถาม 3 ข้อ"
      },
      {
        kicker:"04 · PRIORITY", title:"Must Have, Should Have และ Optional ต้องมีเจ้าของการตัดสินใจ",
        columns:[
          {title:"MUST",className:"bad",items:["ขาดแล้วใช้งานไม่ได้/ผิดนโยบาย","ต้องผ่านทุกข้อ","เปลี่ยนได้เมื่อ IT/Owner อนุมัติ"]},
          {title:"SHOULD",className:"warn",items:["มีผลต่อคุณภาพหรือประสิทธิภาพ","ใช้เป็นคะแนนเปรียบเทียบ","ยอมลดได้พร้อมเหตุผล"]},
          {title:"OPTIONAL",className:"good",items:["เพิ่มคุณค่าแต่ไม่จำเป็น","แยกราคา Option","ไม่ควรทำให้ Vendor ที่ตรง Must แพ้"]}
        ],
        callout:"อย่าให้ Procurement เดาเองว่าข้อไหน Must — ต้องยืนยันกับ Requester/IT", duration:6,
        notes:"ใช้สีเดียวกันใน Comparison Matrix และ TOR/Requirement"
      },
      {
        kicker:"05 · PERFORMANCE", title:"Benchmark ใช้ประกอบ—not ใช้แทน Use Case",
        bullets:[
          "เทียบ CPU/GPU ในประเภทและ Power class เดียวกัน",
          "เลือก Benchmark ที่สอดคล้องกับงาน เช่น Single, Multi, Rendering หรือ AI",
          "ตรวจ Test condition, Version และวันที่",
          "ดู RAM/Storage/Power/Thermal ที่ทำให้ผลจริงต่างกัน",
          "ห้ามอ้างคะแนนเดียวเพื่อสรุป Compatibility หรือ Reliability",
          "ถ้า Requirement ระบุ Model ให้ถามว่าเหตุผลคือ Performance หรือ Compatibility"
        ],
        callout:"Performance Requirement และ Model Requirement ไม่ใช่สิ่งเดียวกัน", duration:6,
        notes:"ให้ตัวอย่าง Notebook CPU กับ Desktop CPU ชื่อใกล้กันแต่ Power envelope ต่างกัน"
      },
      {
        kicker:"06 · COMPATIBILITY", title:"ของที่สเปกสูงกว่าอาจใช้แทนไม่ได้",
        table:{
          headers:["มิติ","ตัวอย่างที่ต้องตรวจ"],
          rows:[
            ["Physical","Form factor, Slot, Port, Power, Rack depth"],
            ["Protocol","SATA/NVMe, SFP/SFP+, Wi‑Fi, PoE"],
            ["Software","OS/Driver/API/CUDA/Application certification"],
            ["Version","Firmware, FortiOS, Hypervisor, Database"],
            ["License","Edition, User/Device/Core, Tenant, Term"],
            ["Operational","Monitoring, Backup, Support, Team skill"]
          ]
        },
        callout:"คำว่า Connector เหมือนกัน ไม่ได้รับประกัน Protocol, Speed หรือ Compatibility", duration:6,
        notes:"ใช้ตัวอย่าง RAM DDR4/DDR5 หรือ SFP ที่รูปทรงเหมือนกันแต่ Vendor coding/Speed ไม่ตรง"
      },
      {
        kicker:"07 · LIFECYCLE", title:"ตรวจ EOL/EOS ก่อนถามว่ามี Stock หรือไม่",
        columns:[
          {title:"Lifecycle",items:["Launch / Active / Last order","End of Sale","End of Support/Security update"]},
          {title:"Risk",items:["อายุ Support สั้น","อะไหล่และ Firmware จำกัด","ต้องเปลี่ยนเร็วและ TCO สูง"]},
          {title:"Action",items:["หา Replacement notice","ตรวจรุ่นใหม่และ Compatibility","บันทึกวันที่/Source/Support horizon"]}
        ],
        callout:"มีของใน Stock ไม่ได้แปลว่าเป็น Current product หรือเหมาะกับสัญญาระยะยาว", duration:6,
        notes:"แยก End of Sale กับ End of Support ให้ชัดเจน"
      },
      {
        kicker:"08 · REPLACEMENT SEARCH", title:"วิธีหารุ่นทดแทนอย่างเป็นระบบ",
        bullets:[
          "หา Original model และ Part Number ให้ถูกก่อน",
          "ดึง Original datasheet/QuickSpecs/PSREF และ Lifecycle",
          "แยก Must Have ออกจาก Feature ที่มีเพราะรุ่นเดิม",
          "ค้น Official replacement หรือรุ่นใน Product family ปัจจุบัน",
          "สร้าง Candidate 2–3 รุ่นจากผู้ผลิต/Partner ที่เชื่อถือได้",
          "เทียบทีละ Requirement พร้อม Source และ Unknown"
        ],
        callout:"อย่าเริ่มจากค้นคำว่า “รุ่นเทียบเท่า” — เริ่มจาก Baseline และ Must Have", duration:6,
        notes:"เปิดตัวอย่าง Original spec แล้วให้ผู้เรียนหา 3 ข้อที่เป็น Must และ 2 ข้อที่อาจไม่จำเป็น"
      },
      {
        kicker:"09 · DECISION LABELS", title:"Equivalent, Alternative และ Not Equivalent ต้องใช้คนละความหมาย",
        table:{
          headers:["ผล","เกณฑ์","วิธีเสนอ"],
          rows:[
            ["Equivalent","ผ่าน Must และ Compatibility ไม่มีผลเสียสำคัญ","เสนอแทนได้พร้อมหลักฐาน"],
            ["Alternative","ใช้งานได้แต่มี Trade-off/แนวทางต่าง","เสนอเป็นตัวเลือกและให้ Owner อนุมัติ"],
            ["Not Equivalent","ตก Must หรือไม่ Compatible","ไม่เสนอเป็นตัวแทน"],
            ["Unknown","ไม่มีข้อมูลยืนยัน","ถามเพิ่ม ห้ามเดา"],
            ["Higher spec","สูงกว่า Metric หนึ่ง","ยังต้องตรวจผลกระทบด้านอื่น"]
          ]
        },
        callout:"Higher ≠ Equivalent โดยอัตโนมัติ", duration:6,
        notes:"ย้ำว่า Alternative ไม่ใช่คำเสียหาย แต่ต้องเปิดเผย Trade-off และผู้อนุมัติ"
      },
      {
        kicker:"10 · COMPARISON MATRIX", title:"ตารางที่ดีทำให้เห็น Requirement, Evidence และ Deviation ในหน้าเดียว",
        table:{
          headers:["Requirement","Must?","Original","Vendor A","Vendor B","ผล"],
          rows:[
            ["Windows 11 Pro","Yes","Pro","Home","Pro","A FAIL"],
            ["RAM ≥16GB","Yes","16GB","16GB","32GB","Both PASS"],
            ["512GB NVMe","Yes","512","ไม่ระบุ","1TB NVMe","A CHECK"],
            ["LAN Port","Yes","Yes","No","Yes","A FAIL"],
            ["3Y On-site","Yes","On-site","Carry-in","On-site","A FAIL"]
          ]
        },
        callout:"ทุกช่อง Unknown ต้องมี Owner และ Due date ไม่ควรปล่อยว่าง", duration:7,
        notes:"เปิด Toolkit ให้ผู้เรียนกรอก Source/Note เพิ่ม ไม่ใช้ตารางนี้เป็นเพียงตารางราคา"
      },
      {
        kicker:"11 · COMMERCIAL & TCO", title:"ราคาซื้อถูกที่สุดอาจมีต้นทุนรวมสูงที่สุด",
        columns:[
          {title:"Acquisition",items:["สินค้า/License/Implementation","Shipping, Tax, Lead time","Training และ Migration"]},
          {title:"Operation",items:["Subscription/Renewal","Cloud usage/Egress","Support, Power, Admin effort"]},
          {title:"Risk & Exit",items:["Downtime/Compatibility","EOL หรือ Grey market","Data export/Migration/Disposal"]}
        ],
        callout:"เปรียบเทียบ TCO ด้วยระยะเวลาเดียวกัน เช่น 3 ปี และระบุ Assumption ชัดเจน", duration:6,
        notes:"ยกตัวอย่าง Cloud 5,000 บาทที่ไม่รวม Backup/Support/Traffic กับ 8,000 บาทที่รวมครบ"
      },
      {
        kicker:"12 · SLA & SERVICE", title:"SLA ต้องบอกว่าใครทำอะไร ภายในเวลาเท่าไร",
        table:{
          headers:["คำ","ความหมาย","ต้องระบุเพิ่ม"],
          rows:[
            ["8×5 / 24×7","ช่วงเวลาที่รับบริการ","Timezone และวันหยุด"],
            ["Response","เวลาที่เริ่มตอบรับ","แยกตาม Severity"],
            ["Resolution","เวลาที่แก้เสร็จ/เป้าหมาย","Workaround นับหรือไม่"],
            ["On-site","เข้าพื้นที่","Location และ Travel"],
            ["Availability","เปอร์เซ็นต์พร้อมใช้งาน","Exclusion และ Service credit"],
            ["Acceptance","เกณฑ์รับมอบ","ผู้ทดสอบและหลักฐาน"]
          ]
        },
        callout:"Support 24×7 ไม่ได้แปลว่าแก้เสร็จภายใน 24 ชั่วโมง", duration:5,
        notes:"ให้ผู้เรียนแยก Response SLA ออกจาก Resolution target"
      },
      {
        kicker:"13 · SOURCING RISK", title:"ตรวจแหล่งที่มา สภาพสินค้า และสิทธิ์ Support",
        bullets:[
          "Authorized partner/distributor และความสามารถขึ้นทะเบียน Support",
          "New / Refurbished / Used ต้องระบุให้ชัด",
          "Grey market อาจกระทบ Warranty, Region และ Subscription",
          "Serial number, Asset tag, License owner และ Delivery evidence",
          "Lead time จริงกับ Stock statement ต้องมีวันที่",
          "Vendor dependency และแผนทดแทนกรณีส่งไม่ทัน"
        ],
        callout:"ของแท้ไม่ได้รับประกันว่า Warranty/License ใช้ได้ใน Region หรือ Tenant ที่ต้องการ", duration:5,
        notes:"ไม่กล่าวหาผู้ขาย ให้ขอหลักฐานและเงื่อนไขจากผู้ผลิต/ตัวแทนอย่างเป็นกลาง"
      },
      {
        kicker:"14 · RESEARCH TOOLS & AI", title:"ใช้เครื่องมือเร็วขึ้น แต่ Source of Truth ยังต้องเป็นผู้ผลิต",
        columns:[
          {title:"Official tools",items:["Intel ARK / AMD specs","Lenovo PSREF / HP QuickSpecs / Dell specs","Fortinet Product Matrix/Compare","Microsoft service descriptions"]},
          {title:"AI ช่วยได้",items:["สรุป Datasheet","สร้างรายการคำถาม","จัด Comparison table","ชี้ข้อมูลที่ขาด"]},
          {title:"AI ห้ามตัดสินแทน",className:"warn",items:["Part Number/License ที่ไม่มี Source","EOL/EOS ล่าสุด","Compatibility ที่ต้องรับรอง","ราคาหรือ Stock ปัจจุบัน"]}
        ],
        callout:"Prompt ที่ดีแนบ Requirement + Datasheet และสั่งให้ตอบ “ไม่พบข้อมูล” แทนการเดา", duration:5,
        notes:"สาธิต AI อ่าน Datasheet 1 หน้า แล้วกลับไปคลิก Source จริงเพื่อยืนยัน"
      },
      {
        type:"activity", kicker:"WORKSHOP 3 · 18 MIN", title:"Full Replacement Process",
        scenario:"Business Notebook รุ่นเดิม End of Sale ฝ่าย IT ต้องการรุ่นทดแทนภายใน 2 สัปดาห์ และ Vendor เสนอมา 2 รุ่น",
        task:"ใช้ Toolkit ทำ Original baseline → Must Have → Candidate → Comparison → Deviation → TCO → Recommendation",
        bullets:["8 นาที: แยก Requirement และกรอก Matrix","5 นาที: ระบุ Unknown/Deviation และคำถาม","3 นาที: เขียน Recommendation","2 นาที: IT approval และหลักฐานที่ต้องเก็บ"],
        duration:18,
        notes:"ผู้สอนทำหน้าที่ Reviewer อย่าเฉลยเร็ว ให้ผู้เรียนระบุ Source และ Assumption เอง"
      },
      {
        kicker:"15 · PROCUREMENT TOOLKIT", title:"เอกสาร 6 ชิ้นที่ควรได้จากกระบวนการ",
        columns:[
          {title:"ก่อนขอราคา",items:["Requirement Clarification","Original Specification / Source log"]},
          {title:"ระหว่างเปรียบเทียบ",items:["Technical Comparison Matrix","Deviation & Open issues"]},
          {title:"ก่อนอนุมัติ",items:["TCO / Commercial comparison","Recommendation + Approval record"]},
          {title:"หลังซื้อ",items:["Delivery/Acceptance record","Asset, License และ Renewal calendar"]}
        ],
        callout:"เปิด Procurement Toolkit จากปุ่มด้านบนเพื่อพิมพ์หรือใช้เป็น Template", duration:5,
        notes:"ให้ผู้เรียนบันทึก Toolkit เป็นไฟล์ของแต่ละ Case และตั้งชื่อให้ค้นย้อนหลังได้"
      },
      {
        kicker:"16 · RECOMMENDATION", title:"คำแนะนำที่ดีต้องตอบ 5 เรื่อง",
        bullets:[
          "แนะนำ Candidate ใด และใช้แทนอะไร",
          "ผ่าน Must Have และ Compatibility ข้อใดบ้าง",
          "มี Deviation, Trade-off หรือ Unknown อะไร",
          "TCO, Lead time, Warranty, SLA และ Risk ต่างกันอย่างไร",
          "เรื่องใดต้องให้ IT/Owner อนุมัติก่อนออก PO"
        ],
        callout:"เขียนข้อเท็จจริง + Source + เหตุผล ไม่ใช้คำว่า “น่าจะ”, “ดีกว่า” หรือ “เหมือนกัน” ลอย ๆ", duration:5,
        notes:"ให้ผู้เรียนอ่าน Recommendation ของตนเองแล้วตรวจว่าคนที่ไม่อยู่ในประชุมสามารถตัดสินใจได้หรือไม่"
      },
      {
        kicker:"17 · FINAL CHECK", title:"10 คำถามก่อนออก PO IT",
        table:{
          headers:["1–5 · Technical","6–10 · Commercial & Control"],
          rows:[
            ["Model และ Part Number ถูก?","Warranty/Support/SLA ตรง?"],
            ["Must Have ครบ?","License/Term/Tenant ถูก?"],
            ["Compatible กับระบบเดิม?","TCO และ Renewal ครบ?"],
            ["EOL/EOS/Version ผ่าน?","Lead time/Scope/Acceptance ชัด?"],
            ["Deviation/Unknown ปิดแล้ว?","IT/Owner อนุมัติและเก็บหลักฐาน?"]
          ]
        },
        callout:"ถ้ามีคำตอบ “ไม่ทราบ” ในข้อสำคัญ ให้หยุดและขอข้อมูลก่อน", duration:4,
        notes:"ใช้เป็น Gate checklist ของทีม Procurement ก่อนสร้าง PR/PO"
      },
      {
        type:"summary", kicker:"3-DAY SUMMARY & Q&A", title:"Procurement ไม่ต้องรู้ทุกคำตอบ แต่ต้องรู้วิธีหาคำตอบที่เชื่อถือได้",
        cards:[
          {title:"Understand",text:"เข้าใจ Use Case, System และสิ่งที่แต่ละสเปกมีผลต่อการใช้งาน"},
          {title:"Verify",text:"ใช้ Datasheet, SKU, Compatibility, Lifecycle และ Source ที่ตรวจย้อนหลังได้"},
          {title:"Control",text:"เปิดเผย Deviation, เทียบ TCO, ขอ Approval และติดตาม Renewal"}
        ],
        callout:"ผลลัพธ์หลักสูตร: ซื้อของให้ตรง ใช้งานได้จริง และลดความเสี่ยงก่อนออก PO",
        duration:6,
        notes:"สรุป 3 นาที ถามตอบ 3 นาที และชวนผู้เรียนเลือกหนึ่ง Template ที่จะเริ่มใช้กับงานจริงทันที"
      }
    ]
  }
};
