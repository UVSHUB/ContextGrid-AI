import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ContextGrid AI - Real-time Architectural Impact Dashboard',
  description: 'Visual map, AST dependency graph, and Gemini AI architectural risk reasoning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
