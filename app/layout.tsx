import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export const metadata: Metadata = {
  title: 'CrimeVision AI | Karnataka State Police Intelligence Command Center',
  description: 'Advanced AI-powered crime analytics and visualization platform for Karnataka State Police. Real-time crime heatmaps, criminal network analysis, anomaly detection, and predictive intelligence.',
  keywords: 'Karnataka Police, Crime Analytics, AI Intelligence, Crime Prediction, Law Enforcement, Criminal Network, Heatmap',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="cyber-grid" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-h-screen" style={{ marginLeft: '288px' }}>
            <Topbar />
            <div style={{ paddingTop: '64px' }}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
