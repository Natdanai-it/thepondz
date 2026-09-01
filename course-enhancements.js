(function () {
  "use strict";

  const courseDiscovery = document.querySelector("#courses .course-discovery-panel");
  if (!courseDiscovery || document.querySelector(".index-presentation-panel")) return;

  const panel = document.createElement("section");
  panel.className = "index-presentation-panel";
  panel.innerHTML = `
    <div>
      <span>AFTER-CLASS PRIVATE LIBRARY</span>
      <h3>เรียนสดแล้วกลับมาทบทวนได้</h3>
      <p>หลังเรียนมี Video Replay, Slides, คู่มือ และไฟล์ Workshop ตามแพ็กเกจ โดยแยกสิทธิ์ตามลูกค้าและคอร์ส</p>
    </div>
    <div class="index-presentation-actions">
      <a href="private-access.html">ดูระบบหลังเรียน</a>
      <a href="https://line.me/ti/p/~pondnatdanai" target="_blank" rel="noopener">สอบถามคอร์ส Private</a>
    </div>`;
  courseDiscovery.insertAdjacentElement("afterend", panel);
})();
