import '@xyflow/react/dist/style.css';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ContextGrid AI - Enterprise Code Intelligence Platform',
  description: 'Real-time architectural impact control, AST dependency topology, and Gemini 2.0 AI reasoning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
