(() => {
  "use strict";

  const body = document.body;
  const payloadUrl = body.dataset.coursePayload;
  const group = body.dataset.courseGroup;
  const form = document.getElementById("courseUnlockForm");
  const passwordInput = document.getElementById("coursePassword");
  const button = document.getElementById("courseUnlockButton");
  const status = document.getElementById("courseUnlockStatus");
  const sessionKey = `pond-course-password:${group}`;

  if (!payloadUrl || !group || !form || !passwordInput || !button || !status) return;

  const fromBase64 = (value) => {
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  };

  const setState = (message, kind = "", busy = false) => {
    status.textContent = message;
    status.dataset.state = kind;
    button.disabled = busy;
    passwordInput.disabled = busy;
    button.textContent = busy ? "กำลังเปิดคอร์ส…" : "เปิดเนื้อหาคอร์ส";
  };

  const decryptCourse = async (password) => {
    const response = await fetch(payloadUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("PAYLOAD_UNAVAILABLE");
    const payload = await response.json();
    if (payload.v !== 1 || payload.kdf !== "PBKDF2-SHA256") throw new Error("PAYLOAD_UNSUPPORTED");

    const passwordKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt: fromBase64(payload.salt), iterations: payload.iterations },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(payload.iv) },
      key,
      fromBase64(payload.ciphertext)
    );
    return new TextDecoder().decode(plaintext);
  };

  const unlock = async (password, automatic = false) => {
    if (!password) {
      setState("กรุณาใส่รหัสผ่านที่ได้รับจากผู้สอน", "error");
      passwordInput.focus();
      return;
    }
    setState("กำลังตรวจสอบรหัสและถอดรหัสเนื้อหา…", "loading", true);
    try {
      const html = await decryptCourse(password);
      sessionStorage.setItem(sessionKey, password);
      setState("รหัสถูกต้อง กำลังเปิดบทเรียน…", "success", true);
      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      if (automatic) sessionStorage.removeItem(sessionKey);
      setState(
        error.message === "PAYLOAD_UNAVAILABLE"
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
