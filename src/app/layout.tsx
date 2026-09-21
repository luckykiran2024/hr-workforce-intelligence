import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Workforce Intelligence & HR Architecture | Leadership Platform',
  description: 'Interactive HR Leadership Intelligence, Workforce Architecture & Career Management Platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-white text-slate-900 selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
