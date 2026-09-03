(() => {
  "use strict";

  const body = document.body;
  const payloadUrl = body.dataset.coursePayload;
  const mediaPayloadUrl = body.dataset.courseMediaPayload;
  const group = body.dataset.courseGroup;
  const form = document.getElementById("courseUnlockForm");
  const passwordInput = document.getElementById("coursePassword");
  const button = document.getElementById("courseUnlockButton");
  const status = document.getElementById("courseUnlockStatus");
  const sessionKey = `pond-course-password:${group}`;

  if (!payloadUrl || !group || !form || !passwordInput || !button || !status) return;

  const passwordRow = document.createElement("div");
  passwordRow.className = "course-lock-password-row";
  passwordInput.parentNode.insertBefore(passwordRow, passwordInput);
  passwordRow.appendChild(passwordInput);
  const revealButton = document.createElement("button");
  revealButton.className = "course-lock-reveal";
  revealButton.type = "button";
  revealButton.textContent = "แสดงรหัส";
  revealButton.setAttribute("aria-pressed", "false");
  revealButton.setAttribute("aria-label", "แสดงรหัสผ่านคอร์ส");
  passwordRow.appendChild(revealButton);
  revealButton.addEventListener("click", () => {
    const reveal = passwordInput.type === "password";
    passwordInput.type = reveal ? "text" : "password";
    revealButton.textContent = reveal ? "ซ่อนรหัส" : "แสดงรหัส";
    revealButton.setAttribute("aria-pressed", reveal ? "true" : "false");
    revealButton.setAttribute("aria-label", reveal ? "ซ่อนรหัสผ่านคอร์ส" : "แสดงรหัสผ่านคอร์ส");
    passwordInput.focus();
  });

  const fromBase64 = (value) => {
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  };

  const setState = (message, kind = "", busy = false) => {
    status.textContent = message;
    status.dataset.state = kind;
    button.disabled = busy;
    passwordInput.disabled = busy;
    revealButton.disabled = busy;
    form.setAttribute("aria-busy", busy ? "true" : "false");
    button.textContent = busy ? "กำลังเปิดคอร์ส…" : "เปิดเนื้อหาคอร์ส";
  };

  const fetchPayload = async (url, unavailableCode = "PAYLOAD_UNAVAILABLE") => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(unavailableCode);
    const payload = await response.json();
    if (payload.v !== 1 || payload.kdf !== "PBKDF2-SHA256") throw new Error("PAYLOAD_UNSUPPORTED");
    return payload;
  };

  const derivePayloadKey = async (password, payload) => {
    const passwordKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt: fromBase64(payload.salt), iterations: payload.iterations },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  };

  const decryptWithKey = async (payload, key) => {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(payload.iv) },
      key,
      fromBase64(payload.ciphertext)
    );
    return new TextDecoder().decode(plaintext);
  };

  const preparePrivateMedia = (html, bundle) => {
    if (!bundle) return html;
    if (bundle.v !== 1 || !bundle.assets) throw new Error("MEDIA_UNSUPPORTED");

    const storeKey = `pond-private-media-runtime:${group}`;
    let mediaSource = storeKey;
    try {
      sessionStorage.setItem(storeKey, JSON.stringify(bundle.assets));
    } catch (error) {
      window.__POND_PRIVATE_MEDIA__ = bundle.assets;
      mediaSource = "memory";
    }

    html = html.replace(/<html\b([^>]*)>/i, `<html$1 data-private-media-store="${mediaSource}">`);
    html = html.replace(/<img\b[^>]*>/gi, (tag) => {
      const source = tag.match(/\bsrc=(["'])__PRIVATE_MEDIA_([a-f0-9]+)__\1/i);
      if (!source) return tag;
      const id = source[2];
      const asset = bundle.assets[id];
      if (!asset) throw new Error("MEDIA_UNSUPPORTED");

      tag = tag.replace(source[0], `src="assets/media/private-placeholder.svg" data-private-media="${id}"`);
      tag = tag.replace(/\bdata-full=(["'])__PRIVATE_MEDIA_([a-f0-9]+)__\1/i, (_match, _quote, fullId) => `data-full="" data-private-media-full="${fullId}"`);
      if (!/\bloading=/i.test(tag)) tag = tag.replace(/<img\b/i, '<img loading="lazy"');
      if (!/\bdecoding=/i.test(tag)) tag = tag.replace(/<img\b/i, '<img decoding="async"');
      if (asset.width && asset.height && !/\bwidth=/i.test(tag)) tag = tag.replace(/<img\b/i, `<img width="${asset.width}" height="${asset.height}"`);
      return tag;
    });
    html = html.replace(/\bdata-full=(["'])__PRIVATE_MEDIA_([a-f0-9]+)__\1/gi, (_match, _quote, id) => `data-full="" data-private-media-full="${id}"`);
    html = html.replace(/\bhref=(["'])__PRIVATE_MEDIA_[a-f0-9]+__\1/gi, 'href="assets/media/38494532f2044786.svg"');
    if (html.includes("__PRIVATE_MEDIA_")) throw new Error("MEDIA_UNSUPPORTED");
    html = html.replace(/<\/body>/i, '<script src="assets/js/private-media.js" defer><\/script></body>');
    return html;
  };

  const unlock = async (password, automatic = false) => {
    if (!password) {
      setState("กรุณาใส่รหัสผ่านที่ได้รับจากผู้สอน", "error");
      passwordInput.focus();
      return;
    }
    setState("กำลังตรวจสอบรหัสและถอดรหัสเนื้อหา…", "loading", true);
    try {
      const [coursePayload, mediaPayload] = await Promise.all([
        fetchPayload(payloadUrl),
        mediaPayloadUrl ? fetchPayload(mediaPayloadUrl, "MEDIA_UNAVAILABLE") : Promise.resolve(null)
      ]);
      if (mediaPayload && (mediaPayload.salt !== coursePayload.salt || mediaPayload.iterations !== coursePayload.iterations)) {
        throw new Error("MEDIA_UNSUPPORTED");
      }
      const key = await derivePayloadKey(password, coursePayload);
      const [courseHtml, mediaJson] = await Promise.all([
        decryptWithKey(coursePayload, key),
        mediaPayload ? decryptWithKey(mediaPayload, key) : Promise.resolve(null)
      ]);
      let html = preparePrivateMedia(courseHtml, mediaJson ? JSON.parse(mediaJson) : null);
      sessionStorage.setItem(sessionKey, password);
      setState("รหัสถูกต้อง กำลังเปิดบทเรียน…", "success", true);
      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      if (automatic) sessionStorage.removeItem(sessionKey);
      setState(
        error.message === "PAYLOAD_UNAVAILABLE" || error.message === "MEDIA_UNAVAILABLE"
          ? "ไม่พบไฟล์บทเรียน กรุณาตรวจสอบการอัปโหลดหรือติดต่อผู้สอน"
          : "รหัสไม่ถูกต้อง กรุณาลองใหม่หรือติดต่อผู้สอน",
        "error"
      );
      passwordInput.value = "";
      passwordInput.focus();
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    unlock(passwordInput.value);
  });

  const savedPassword = sessionStorage.getItem(sessionKey);
  if (savedPassword) unlock(savedPassword, true);
})();

/* ===== integrated analytics.js ===== */
"use strict";
(function(){
  const endpoint = document.querySelector('meta[name="analytics-endpoint"]')?.content?.trim() || window.POND_ANALYTICS_ENDPOINT || "";
  const privacyEnabled = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1";
  const page = location.pathname.split("/").pop() || "index.html";
  const kind = page.startsWith("article-") ? "article" : page.startsWith("course-") ? "course" : "page";

  function track(event,properties={}){
    if(!endpoint || privacyEnabled) return;
    const payload = JSON.stringify({version:1,event,page,kind,properties,timestamp:new Date().toISOString()});
    if(navigator.sendBeacon) navigator.sendBeacon(endpoint,new Blob([payload],{type:"application/json"}));
    else fetch(endpoint,{method:"POST",headers:{"content-type":"application/json"},body:payload,keepalive:true,credentials:"omit"}).catch(()=>{});
  }
  window.pondTrack = track;
  track("page_view",{title:document.title});

  document.addEventListener("click",event=>{
    const link = event.target.closest("a[href]");
    if(link){
      const href=link.getAttribute("href")||"";
      if(/line\.me|mailto:|fastwork\.co/.test(href)) track("contact_click",{channel:href.startsWith("mailto:")?"email":href.includes("line.me")?"line":"fastwork"});
      if(/^course-|^it-procurement-toolkit/.test(href)) track("course_open",{course:href.split("?")[0]});
    }
    const filter=event.target.closest("[data-article-filter],[data-course-filter],[data-project-filter]");
    if(filter) track("filter_change",{filter:filter.dataset.articleFilter||filter.dataset.courseFilter||filter.dataset.projectFilter||"all"});
  });

  ["articleSearch","courseSearch","projectSearch"].forEach(id=>{
    const input=document.getElementById(id); if(!input) return;
    let timer;
    input.addEventListener("input",()=>{
      clearTimeout(timer);
      timer=setTimeout(()=>{
        const length=input.value.trim().length;
        if(length<2) return;
        const countId=id.replace("Search","ResultCount");
        const visibleCount=parseInt(document.getElementById(countId)?.textContent||"",10);
        track("search",{
          scope:id.replace("Search","").toLowerCase(),
          lengthBucket:length<5?"2-4":length<11?"5-10":"11+",
          results:Number.isFinite(visibleCount)?visibleCount:null
        });
      },800);
    });
  });
})();
