# 🚀 xkaroyresume — เอกรินทร์ นีระมนต์ (Aekkarin Neeramon) Portfolio

เว็บไซต์พอร์ตโฟลิโอส่วนตัวของ **เอกรินทร์ นีระมนต์ (Aekkarin Neeramon)** — **Full-Stack Developer & AI Automation Specialist** จากมหาวิทยาลัยหอการค้าไทย (UTCC) ออกแบบในสไตล์ **Antonio — Marketing & Creative Portfolio** พร้อมระบบจำลอง **12-Node n8n AI Pipeline** และ **AI Portfolio Assistant**

---

## 👤 ข้อมูลเจ้าของพอร์ตโฟลิโอ (Owner Profile)

- **ชื่อ-นามสกุล**: เอกรินทร์ นีระมนต์ (Aekkarin Neeramon)
- **ตำแหน่ง**: Full-Stack Developer & AI Automation Specialist
- **สถาบันการศึกษา**: มหาวิทยาลัยหอการค้าไทย (University of the Thai Chamber of Commerce — UTCC)
- **อีเมล**: `mikp1919@gmail.com`
- **GitHub**: [@Xkaroy](https://github.com/Xkaroy)
- **Live Resume**: [https://resume-nu-green.vercel.app/resume/aekkarin](https://resume-nu-green.vercel.app/resume/aekkarin)

---

## 📁 โครงสร้างโฟลเดอร์ `xkaroyresume/`

```text
xkaroyresume/
├── app/                                        # Next.js 16 App Router
│   ├── api/chat/route.js                       # API Endpoint สำหรับ Aekkarin AI Assistant + n8n Webhook Proxy
│   ├── components/AekkarinPortfolioClient.jsx  # หน้าเว็บพอร์ตโฟลิโอหลัก (Antonio Dark/Light Theme)
│   ├── data/aekkarinData.js                    # ข้อมูลประวัติ ทักษะ ผลงาน แพ็กเกจ และโหนด n8n ทั้ง 12 โหนดของเอกรินทร์
│   ├── resume/aekkarin/page.js                 # Route /resume/aekkarin
│   ├── globals.css                             # สไตล์หลักและแอนิเมชัน Marquee / Glow
│   ├── layout.js                               # Root Layout + Google Fonts (Syne, Inter, Noto Sans Thai)
│   └── page.js                                 # หน้าแรก (/)
├── public/
│   ├── images/                                 # รูปโปรไฟล์และรูปตัวอย่างผลงานของเอกรินทร์
│   └── aekkarin-portfolio.html                 # ไฟล์ HTML แบบ Standalone (เปิดด้วยเบราว์เซอร์ได้ทันที)
├── docs/
│   ├── n8n-workflow-resume-ai.json             # ไฟล์เวิร์กโฟลว์ n8n 12 โหนดพร้อม Import
│   ├── supabase-setup.sql                      # สคริปต์สร้างตารางฐานข้อมูล Supabase PostgreSQL ของเอกรินทร์
│   └── docker-compose.yml                      # Docker Compose สำหรับรัน n8n
├── aekkarin-portfolio.html                     # ไฟล์เว็บแบบครบจบในไฟล์เดียว (ดับเบิลคลิกเปิดได้เลย)
├── package.json                                # ตั้งชื่อโปรเจกต์เป็น "xkaroyresume"
├── tailwind.config.js                          # ตั้งค่าสีและฟอนต์สไตล์ Antonio Creative
└── README.md
```

---

## ⚡ วิธีเปิดใช้งาน (2 รูปแบบ)

### วิธีที่ 1: เปิดใช้งานทันทีโดยไม่ต้องรันเซิร์ฟเวอร์ (Standalone HTML)
ดับเบิลคลิกไฟล์ **`aekkarin-portfolio.html`** ในโฟลเดอร์ `xkaroyresume/` เพื่อเปิดดูบนเว็บเบราว์เซอร์ได้ทันที หรือนำไฟล์ไปอัปโหลดขึ้น Hostinger / GitHub Pages / Netlify ได้ทันที

### วิธีที่ 2: รันเป็นโปรเจกต์ Next.js 16 เต็มรูปแบบ
```bash
# 1. เปิด Terminal เข้าไปในโฟลเดอร์ xkaroyresume
cd xkaroyresume

# 2. ติดตั้งแพ็กเกจ
npm install

# 3. รันเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev
```
จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:3000` หรือ `http://localhost:3000/resume/aekkarin`

---

## 🛠️ วิธีแก้ไขข้อมูลของเอกรินทร์
- **แก้ไขใน Next.js**: เปิดไฟล์ `app/data/aekkarinData.js` เพื่อแก้ชื่อ ทักษะ ผลงาน ลิงก์ หรือราคาแพ็กเกจ และเปิดไฟล์ `app/components/AekkarinPortfolioClient.jsx` เพื่อแก้โครงสร้างหน้าเว็บ
- **แก้ไขในไฟล์ HTML เดี่ยว**: เปิดไฟล์ `aekkarin-portfolio.html` ด้วย VS Code แล้วแก้ข้อความหรือตัวแปร `AEKKARIN_SKILLS`, `AEKKARIN_PROJECTS`, `N8N_NODES` ใน `<script>` ด้านล่างได้เลย
