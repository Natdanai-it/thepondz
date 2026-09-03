# เปิดใช้งาน Analytics แบบไม่เก็บคำค้นดิบ

เว็บไซต์รวมโค้ด Analytics ไว้ใน `assets/js/core.js` และ `assets/js/course-lock.js` แล้ว แต่จะไม่ส่งข้อมูลจนกว่าจะกำหนด Endpoint ที่คุณควบคุมเอง

เพิ่มใน `<head>` ของหน้าที่ต้องการวัด:

```html
<meta name="analytics-endpoint" content="https://YOUR-ENDPOINT.example/events">
```

ข้อมูลที่ส่งมีเฉพาะชื่อ Event, ชื่อหน้า, ประเภทหน้า, เวลา และ Property ที่ไม่ระบุตัวบุคคล เช่นช่องทางติดต่อ หมวดตัวกรอง จำนวนผลลัพธ์ และช่วงความยาวคำค้น ระบบไม่ส่งข้อความคำค้นจริง ไม่ใช้ Cookie และหยุดทำงานเมื่อ Browser เปิด Do Not Track หรือ Global Privacy Control

Event ที่มีอยู่:

- `page_view`
- `contact_click`
- `course_open`
- `filter_change`
- `search`

Endpoint ควรรับ `POST` แบบ JSON และกำหนด CORS ให้รับ Origin `https://natdanai-it.github.io` เท่านั้น อย่าเก็บ IP แบบเต็มหรือ User-Agent แบบละเอียด หากใช้ Cloudflare Worker/Supabase Edge Function ให้รวมข้อมูลเป็นรายวันก่อนแสดง Dashboard
