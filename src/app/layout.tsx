import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DWA - ドライバー健康診断',
  description:
    '産業医・保健師向けドライバー健康診断ツール。睡眠・ストレス・疲労・食事・運動の5領域を学術的に妥当性が検証された尺度でスコアリングします。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
