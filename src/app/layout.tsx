import "./globals.css";
import { Montserrat } from 'next/font/google'
import Link from "next/link";
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '../context/AuthContext';
import Image from "next/image";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: [
    '100', // Thin
    '200', // ExtraLight
    '300', // Light
    '400', // Regular
    '500', // Medium
    '600', // SemiBold
    '700', // Bold
    '800', // ExtraBold
    '900'  // Black
  ],
  variable: "--font-montserrat",
  display: 'swap',
})

export const metadata = {
  title: 'SISMAAE',
  description: 'Sem Descrição',
  icons: {
    icon: '/img/icon_logo_sistema.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${montserrat.variable}`} suppressHydrationWarning>
        <AuthProvider>
          <header className="titulo-principal">
            <Link href="/dashboard">
              <Image
                src="/img/logo_batalhao.jpeg"
                alt="logo do batalhão"
                width={450}
                height={150}
                priority
              />
            </Link>
          </header>
          {children}
        </AuthProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "inherit",
              fontSize: "0.95rem",
              borderRadius: "12px",
              padding: ".8rem",
              fontWeight: 500,
              color: "#fff",
              boxShadow: "0 4px 10px #0000002d",
            },
            success: {
              style: {
                background: "#16a34a",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#16a34a",
              },
            },
            error: {
              style: {
                background: "#dc2626",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#dc2626",
              },
            },
            loading: {
              style: {
                background: "#2563eb",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#2563eb",
              },
            },
          }}
        />
      </body>
    </html>
  );
}