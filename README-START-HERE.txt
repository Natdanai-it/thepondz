ฉบับครบสำหรับสอนคุณมี่ — GitHub Pages (ไม่เกิน 100 ไฟล์)

ไฟล์เริ่มต้น: 00-START-HERE.html
บทเรียนหลัก: course-deploy-webapp.html (10 ขั้น)
สไลด์: deploy-reference-slides.html
คำสั่ง Codex: codex-supabase-workshop.html
เช็กลิสต์: deploy-checklist.html (12 ข้อ)

วิธีอัป GitHub ด้วยหน้าเว็บ
1. แตก ZIP ลงเครื่องก่อน อย่าลาก ZIP ทั้งก้อนไปวาง
2. เข้า repository thepondz แล้วเลือก Add file > Upload files
3. เปิดโฟลเดอร์ที่แตกออกมา เลือกไฟล์และโฟลเดอร์ assets และ downloads ทั้งหมดภายใน แล้วลากทั้งชุดไปวางในหน้า Upload files
4. ตรวจว่า index.html, course-deploy-webapp.html, assets/css/site.css และ assets/css/deploy-course-steps.css อยู่ในรายชื่อ
5. Commit changes และรอ GitHub Pages ประมวลผล แล้วกด Ctrl+F5 เมื่อเปิดหน้าเดิม
6. ถ้าใน repository มีไฟล์เก่าที่ถูกเปลี่ยนชื่อ เช่น assets/lesson-deploy/*.png ให้ลบไฟล์เก่าภายหลังเมื่อเว็บใหม่เปิดครบแล้ว

ทุกไฟล์ใน ZIP อยู่ภายในโฟลเดอร์เดียว: อัปโหลดเนื้อหาข้างในโฟลเดอร์นั้นไปที่ root ของ repository เพื่อให้ index.html อยู่ระดับบนสุด
ห้ามอัปโหลดเฉพาะ HTML: จะไม่มี CSS และ JS ทำให้หน้าเว็บกลายเป็นตัวหนังสือล้วน

ภาพ SVG และภาพสอนในบทเรียนถูกฝังในไฟล์หน้าเว็บ/ข้อมูลแล้ว เพื่อให้อัปโหลดได้ในครั้งเดียว
ตัวเลข 1,000 สื่อเป็นกรณีตัวอย่างของคุณมี่ ไม่ใช่ไฟล์สื่อจริงในชุดนี้
