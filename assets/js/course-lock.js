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

      tag = tag.replace(source[0], `src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAwIDkwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSLguIHguLPguKXguLHguIfguYDguJXguKPguLXguKLguKHguKDguLLguJ7guJrguJfguYDguKPguLXguKLguJkiPgogIDxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIHN0b3AtY29sb3I9IiMwNzFhM2UiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwYzI4NTciLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiIGZpbGw9InVybCgjZykiLz4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2ZmE0ZmYiIHN0cm9rZS1vcGFjaXR5PSIuMjIiIHN0cm9rZS13aWR0aD0iMyI+PHJlY3QgeD0iNjEwIiB5PSIzNDAiIHdpZHRoPSIzODAiIGhlaWdodD0iMjIwIiByeD0iMjgiLz48cGF0aCBkPSJNNjgwIDUwNWw5NS05NSA3NSA3MiA1NC00OSA3MCA3MiIvPjwvZz4KICA8dGV4dCB4PSI4MDAiIHk9IjYyNSIgZmlsbD0iIzg3YTdkNCIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByZXBhcmluZyBwcml2YXRlIGxlc3NvbiBtZWRpYeKApjwvdGV4dD4KPC9zdmc+Cg==" data-private-media="${id}"`);
      tag = tag.replace(/\bdata-full=(["'])__PRIVATE_MEDIA_([a-f0-9]+)__\1/i, (_match, _quote, fullId) => `data-full="" data-private-media-full="${fullId}"`);
      if (!/\bloading=/i.test(tag)) tag = tag.replace(/<img\b/i, '<img loading="lazy"');
      if (!/\bdecoding=/i.test(tag)) tag = tag.replace(/<img\b/i, '<img decoding="async"');
      if (asset.width && asset.height && !/\bwidth=/i.test(tag)) tag = tag.replace(/<img\b/i, `<img width="${asset.width}" height="${asset.height}"`);
      return tag;
    });
    html = html.replace(/\bdata-full=(["'])__PRIVATE_MEDIA_([a-f0-9]+)__\1/gi, (_match, _quote, id) => `data-full="" data-private-media-full="${id}"`);
    html = html.replace(/\bhref=(["'])__PRIVATE_MEDIA_[a-f0-9]+__\1/gi, 'href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxkZWZzPgogIDxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMDYxNTJmIi8+CiAgICA8c3RvcCBvZmZzZXQ9Ii41OCIgc3RvcC1jb2xvcj0iIzFmNWJkOCIvPgogICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNGY4Y2ZmIi8+CiAgPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIxNSIgZmlsbD0idXJsKCNnKSIvPgo8cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHJ4PSIxMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGJiY2ZmIiBzdHJva2Utb3BhY2l0eT0iLjQ1IiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTE3IDQ2VjE4aDEzLjJjNy40IDAgMTIgNC4xIDEyIDEwLjQgMCA2LjUtNC44IDEwLjctMTIuMyAxMC43aC01LjFWNDZIMTd6bTcuOC0xM2g0LjZjMy40IDAgNS4yLTEuNSA1LjItNC40IDAtMi44LTEuOC00LjMtNS4yLTQuM2gtNC42VjMzeiIgZmlsbD0iI2ZmZiIvPgo8Y2lyY2xlIGN4PSI0Ny41IiBjeT0iNDUuNSIgcj0iNC41IiBmaWxsPSIjN2VlOGM3Ii8+Cjwvc3ZnPg=="');
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
    if(button.disabled) return;
    if(location.protocol === "file:" || !globalThis.crypto?.subtle){
      setState("กรุณาเปิดเว็บไซต์ผ่าน HTTPS หรือ localhost เพื่อเปิดคอร์ส Private", "error");
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
      try { sessionStorage.setItem(sessionKey, password); } catch { /* Unlock works when storage is blocked. */ }
      setState("รหัสถูกต้อง กำลังเปิดบทเรียน…", "success", true);
      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      if (automatic) { try { sessionStorage.removeItem(sessionKey); } catch {} }
      setState(
        error.message === "PAYLOAD_UNAVAILABLE" || error.message === "MEDIA_UNAVAILABLE"
          ? "ไม่พบไฟล์บทเรียน กรุณาตรวจสอบการอัปโหลดหรือติดต่อผู้สอน"
          : error.name === "OperationError" ? "รหัสไม่ถูกต้อง กรุณาลองใหม่หรือติดต่อผู้สอน"
          : "เปิดบทเรียนไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่",
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

  let savedPassword = null;
  try { savedPassword = sessionStorage.getItem(sessionKey); } catch {}
  if (savedPassword) unlock(savedPassword, true);
})();
