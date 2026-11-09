import './globals.css';

export const metadata = {
  title: 'เอกรินทร์ นีระมนต์ (Aekkarin Neeramon) — Full-Stack & AI Creative Portfolio',
  description:
    'Official Portfolio of เอกรินทร์ นีระมนต์ (Aekkarin Neeramon) — Full-Stack Developer & AI Automation Specialist (Next.js 16, React 19, n8n, Make.com, UX/UI, Supabase)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="editorial-grid-bg selection:bg-[#FF5A36] selection:text-white">
        {children}
      </body>
    </html>
  );
}
