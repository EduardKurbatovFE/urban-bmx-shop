import { Geist, Geist_Mono, Open_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Open_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'], // опційно
  display: 'swap',
});

export const metadata = {
  title: 'Urban BMX Shop',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`flex flex-col h-full ${geistSans.variable} ${geistMono.variable} antialiased relative ${inter.className}`}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
