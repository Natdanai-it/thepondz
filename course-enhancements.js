(function(){
  "use strict";
  const match=location.pathname.match(/course-it-procurement-day([1-3])\.html$/);
  if(!match){
    const courseDiscovery=document.querySelector("#courses .course-discovery-panel");
    if(courseDiscovery){
      const promo=document.createElement("section");
      promo.className="index-presentation-panel";
      promo.innerHTML=`<div><span>NEW · PRESENTATION READY</span><h3>IT Procurement Intensive — สอนสดครบ 3 วัน</h3><p>Presentation 16:9 รวม 57 สไลด์ วันละ 120 นาที พร้อม Speaker Cue, Workshop และ Procurement Toolkit</p></div><div class="index-presentation-actions"><a href="course-it-procurement-presentation.html?day=1">▶ เปิด Presentation</a><a href="it-procurement-toolkit.html">เปิด Toolkit</a></div>`;
      courseDiscovery.insertAdjacentElement("afterend",promo);
    }
    return;
  }
  const day=Number(match[1]);
  const configs={
    1:{
      title:"Hardware, Software, Microsoft & Service",
      focus:"คัดหัวใจสำคัญจาก 65 หัวข้อ พร้อม Workshop เปรียบเทียบ Notebook และเสริม Microsoft Licensing กับ Service Procurement",
      agenda:[["00–15","System view","Hardware / Software / License / Service"],["15–55","Core specification","CPU / GPU / RAM / Storage / Device / OS"],["55–85","License & service","Microsoft / SKU / Warranty / SOW"],["85–120","Workshop","Comparison Matrix + Q&A"]],
      core:[1,2,5,10,15,18,21,25,29,30,32,38,44,45,46,53,54,55,56,57,58,59,63,64,65]
    },
    2:{
      title:"Network, FortiGate, Server, VM & Cloud",
      focus:"เรียนแบบ System view เน้น Metric ที่ใช้เลือกจริง พร้อม Mini Case Firewall และ Cloud TCO",
      agenda:[["00–25","Network map","IP / Router / Switch / Wi‑Fi"],["25–60","Security","VLAN / VPN / Firewall / FortiGate"],["60–95","Infrastructure","Server / RAID / Backup / VM / Cloud"],["95–120","Mini cases","Firewall sizing + Cloud cost"]],
      core:[1,7,8,9,11,12,14,17,20,22,24,28,30,32,35,36,37,40,41,42,55,61,66,67,68,70,73,74,77,84,85,92,94,95,96,98,102,106,107]
    },
    3:{
      title:"Spec Comparison & Procurement Workshop",
      focus:"เปลี่ยนจากการอ่านเนื้อหา 140 หัวข้อ เป็น Workflow, Evidence, Matrix, Deviation, TCO และ Recommendation ที่ลงมือทำจริง",
      agenda:[["00–30","Clarify","Requirement / Must / Source"],["30–60","Research","Benchmark / Compatibility / Lifecycle"],["60–90","Compare","Equivalent / Deviation / TCO / SLA"],["90–120","Workshop","Replacement + Recommendation"]],
      core:[1,3,4,7,16,18,24,35,40,45,48,49,50,52,59,62,67,73,79,82,94,103,105,107,110,119,120,130,132,139]
    }
  };
  const config=configs[day];
  const presentationUrl=`course-it-procurement-presentation.html?day=${day}`;

  const topActions=document.querySelector(".top-actions");
  if(topActions){
    const link=document.createElement("a");
    link.className="btn presentation-top-button";
    link.href=presentationUrl;
    link.textContent="▶ โหมดนำเสนอ";
    topActions.prepend(link);
  }

  const meta=document.querySelector(".course-meta");
  const anchor=meta||document.querySelector(".hero");
  const panel=document.createElement("section");
  panel.className="teaching-version-panel";
  panel.innerHTML=`<div class="teaching-version-inner">
    <div class="teaching-version-head"><div><span class="teaching-version-kicker">PRESENTATION-READY · 120 MINUTES</span><h2>${config.title}</h2><p>${config.focus}</p></div>
    <div class="teaching-version-actions"><a class="teaching-action primary" href="${presentationUrl}">▶ เปิด Presentation 16:9</a><button class="teaching-action green" id="coreViewButton" type="button" aria-pressed="false">เน้นหัวข้อสอนสด</button><a class="teaching-action" href="it-procurement-toolkit.html">เปิด Workshop Toolkit</a></div></div>
    <div class="teaching-agenda">${config.agenda.map(item=>`<div class="agenda-step"><span>${item[0]} MIN</span><b>${item[1]}</b><small>${item[2]}</small></div>`).join("")}</div>
  </div>`;
  anchor.insertAdjacentElement("afterend",panel);
  const note=document.createElement("div");
  note.className="core-mode-note";
  note.innerHTML="<span>หัวข้อที่มีป้าย LIVE คือหัวข้อเน้นสำหรับการสอน 2 ชั่วโมง — เนื้อหาทั้งหมดของบทเรียนยังแสดงครบ ไม่มีหัวข้อใดถูกซ่อน</span>";
  panel.insertAdjacentElement("afterend",note);

  const coreSet=new Set(config.core.map(String));
  document.querySelectorAll(".topic[id^='topic-']").forEach(topic=>{
    const id=topic.id.replace("topic-","");
    if(coreSet.has(id))topic.classList.add("live-core");
  });

  const supplement=document.createElement("section");
  supplement.className="module-card course-upgrade-module";
  supplement.dataset.coreAlways="true";
  supplement.id=`day-${day}-procurement-upgrade`;
  supplement.innerHTML=buildSupplement(day);
  const courseEnd=document.querySelector(".course-end");
  courseEnd?.insertAdjacentElement("beforebegin",supplement);

  const coreButton=document.getElementById("coreViewButton");
  coreButton?.addEventListener("click",()=>{
    const active=document.body.classList.toggle("core-teaching-view");
    coreButton.classList.toggle("active",active);
    coreButton.setAttribute("aria-pressed",String(active));
    coreButton.textContent=active?"ยกเลิกการเน้น":"เน้นหัวข้อสอนสด";
    panel.scrollIntoView({behavior:"smooth",block:"start"});
  });

  function buildSupplement(selectedDay){
    const head=(kicker,title,count)=>`<header class="module-head"><div><span class="module-kicker">${kicker}</span><h2>${title}</h2></div><span class="module-count">${count}</span></header>`;
    if(selectedDay===1)return `${head("COURSE UPGRADE · PROCUREMENT DEEP DIVE","Microsoft Licensing & Service Procurement","เนื้อหาเสริมสำคัญ")}
      <p class="course-upgrade-intro">ส่วนนี้เติมช่องว่างจากเนื้อหาเดิม เพื่อให้ครอบคลุมการซื้อ Microsoft และบริการ IT มากกว่าการรู้จักชื่อผลิตภัณฑ์</p>
      <div class="upgrade-grid">
        <article class="upgrade-card"><h3>Microsoft 365 — ก่อนออก PO</h3><ul><li>ชื่อ Plan/SKU เต็ม และมี/ไม่มี Teams</li><li>จำนวน User, Tenant และ Domain ที่รับสิทธิ์</li><li>Term, Billing, Commitment, Start/Expiry</li><li>Renewal, Coterm, การเพิ่ม/ลดจำนวน และ Owner</li></ul></article>
        <article class="upgrade-card"><h3>Microsoft Server Licensing</h3><ul><li>Edition และ License metric เช่น Core/User/Device</li><li>Windows Server CAL แยกจาก Server license</li><li>RDS CAL เมื่อต้องใช้ Remote Desktop Services</li><li>Guest OS/VM rights และ Version compatibility</li></ul></article>
        <article class="upgrade-card wide"><h3>Service Procurement Checklist</h3><div class="table-wrap"><table class="upgrade-table"><thead><tr><th>หมวด</th><th>ต้องเขียนให้ชัด</th><th>หลักฐานส่งมอบ</th></tr></thead><tbody><tr><td>Scope</td><td>ทำอะไร ที่ไหน กี่ระบบ รวม/ไม่รวมอะไร</td><td>SOW / BOM</td></tr><tr><td>Migration</td><td>Downtime, Backup, Cutover, Rollback</td><td>Migration plan</td></tr><tr><td>Acceptance</td><td>Test case, Success criteria, ผู้อนุมัติ</td><td>UAT / Sign-off</td></tr><tr><td>Support</td><td>8×5/24×7, Response/Resolution, On-site</td><td>SLA / Escalation</td></tr><tr><td>Change</td><td>งานนอก Scope, Rate และขั้นตอนอนุมัติ</td><td>Change request</td></tr></tbody></table></div><div class="upgrade-callout">Product Key หรือไฟล์ติดตั้ง ไม่ใช่หลักฐานสิทธิ์ใช้งาน — ต้องเก็บ License owner, Tenant, Contract และ Proof of entitlement</div></article>
      </div>`;
    if(selectedDay===2)return `${head("COURSE UPGRADE · SYSTEM SIZING","FortiGate, VM & Cloud — Advanced Procurement Checks","เนื้อหาเสริมสำคัญ")}
      <p class="course-upgrade-intro">เพิ่ม Metric และเงื่อนไขที่มักหายไปจาก Requirement ทำให้เทียบราคาได้แต่ใช้งานจริงไม่ครบ</p>
      <div class="upgrade-grid">
        <article class="upgrade-card"><h3>FortiGate — Beyond Raw Throughput</h3><ul><li>Threat Protection และ SSL Inspection throughput</li><li>Concurrent/New sessions, VPN และ Interface</li><li>HA, FortiOS compatibility, Logging/FortiAnalyzer</li><li>Appliance + FortiCare + FortiGuard SKU/Term</li><li>Peak traffic, Growth และ Product lifecycle</li></ul></article>
        <article class="upgrade-card"><h3>VM — Host และ Guest ต้องตรวจแยก</h3><ul><li>Hypervisor, Cluster, HA, Live migration</li><li>vCPU/vRAM/Storage และ Overcommit policy</li><li>Host/Guest OS license และ Support</li><li>Backup, Restore, Snapshot และ Monitoring</li></ul></article>
        <article class="upgrade-card wide"><h3>Cloud Procurement — Total Cost & Resilience</h3><div class="table-wrap"><table class="upgrade-table"><thead><tr><th>มิติ</th><th>คำถามที่ต้องได้คำตอบ</th></tr></thead><tbody><tr><td>Architecture</td><td>Provider, Region/Zone, Service family, Scaling และ Dependency</td></tr><tr><td>Performance</td><td>vCPU class, RAM, Storage type/IOPS, Network และ Peak usage</td></tr><tr><td>Continuity</td><td>SLA, Backup retention, RPO/RTO, DR และ Restore test</td></tr><tr><td>Cost</td><td>Compute hours, Disk, Transaction, Egress, IP, Security และ Support</td></tr><tr><td>Control</td><td>Shared responsibility, Data residency, Monitoring, Exit/Lock-in</td></tr></tbody></table></div><div class="upgrade-callout">เปรียบเทียบ Cloud ด้วย Architecture และ Usage assumption เดียวกัน ไม่ใช่เทียบจาก vCPU/RAM หรือราคา VM เพียงบรรทัดเดียว</div></article>
      </div>`;
    return `${head("COURSE UPGRADE · WORKSHOP OUTPUT","จากการเรียนรู้สู่เอกสารที่ใช้อนุมัติจริง","6 Deliverables")}
      <p class="course-upgrade-intro">Day 3 ต้องจบด้วยเอกสารและการตัดสินใจ ไม่ใช่เพียงรู้ชื่อเว็บไซต์หรือขั้นตอนค้นหา</p>
      <div class="upgrade-grid">
        <article class="upgrade-card"><h3>1–2 · Clarify & Evidence</h3><ul><li>Requirement Clarification — Use Case, Must/Should/Optional</li><li>Source Log — Original spec, URL, Version, วันที่ตรวจ</li></ul></article>
        <article class="upgrade-card"><h3>3–4 · Compare & Control</h3><ul><li>Technical Comparison Matrix — Pass/Check/Fail</li><li>Deviation & Open Issues — Owner, Due date, Approval</li></ul></article>
        <article class="upgrade-card"><h3>5–6 · Decide & Track</h3><ul><li>TCO / Commercial Comparison ระยะเวลาเดียวกัน</li><li>Recommendation + IT Approval + Renewal record</li></ul></article>
        <article class="upgrade-card"><h3>Decision Gate</h3><ul><li>Technical ต้องผ่านก่อน Commercial</li><li>Unknown สำคัญต้องปิดก่อน PO</li><li>Alternative ต้องเปิดเผย Trade-off</li><li>ทุก Deviation ต้องมีผู้อนุมัติ</li></ul></article>
        <article class="upgrade-card wide"><h3>Workshop Flow — 30 นาที</h3><div class="table-wrap"><table class="upgrade-table"><thead><tr><th>เวลา</th><th>งาน</th><th>ผลลัพธ์</th></tr></thead><tbody><tr><td>0–8</td><td>หา Original spec และแยก Must Have</td><td>Baseline</td></tr><tr><td>8–16</td><td>กรอก Candidate A/B และ Source</td><td>Comparison Matrix</td></tr><tr><td>16–22</td><td>ระบุ Unknown/Deviation และคำถาม</td><td>Issue list</td></tr><tr><td>22–27</td><td>เทียบ TCO, Warranty, SLA, Lead time</td><td>Commercial view</td></tr><tr><td>27–30</td><td>เขียน Recommendation และ Approval</td><td>Decision record</td></tr></tbody></table></div><div class="upgrade-callout"><a href="it-procurement-toolkit.html">เปิด Procurement Toolkit →</a> เพื่อใช้ Template ครบชุดในการทำ Workshop</div></article>
      </div>`;
  }
})();
