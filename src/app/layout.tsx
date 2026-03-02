import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ドライバー健康診断ツール（DWA）',
  description:
    '産業医・保健師向けドライバー健康診断ツール。睡眠・ストレス・食事・運動の4領域を学術的に妥当性が検証された尺度でスコアリングします。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
