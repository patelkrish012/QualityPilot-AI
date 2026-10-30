import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QualityPilot AI — From Requirement to Release',
  description: 'AI-Powered Software Quality Engineering and Release Assurance Platform',
  icons: {
    icon: '/favicon.ico',
    apple: '/brand/qualitypilot-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06110C] text-neutral-100 antialiased selection:bg-[#A31C18] selection:text-white">
        {children}
      </body>
    </html>
  );
}
