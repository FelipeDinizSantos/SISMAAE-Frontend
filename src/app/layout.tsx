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
  display: 'swap',
})

export const metadata = {
  title: 'Quadro de Chamados Técnicos',
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
      <body className={montserrat.className}>
        <AuthProvider>
          <header className="titulo-principal">
            <Link href="/dashboard">
              <Image
                src="/img/logo_batalhao.jpeg"
                alt="logo do batalhão"
                width={450}
                height={150}
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
              fontSize: "0.9rem",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "0.8rem 1rem",
              color: "#333",
              display: "flex",
              background: "#F9F9F9",
              alignItems: "center",
              justifyContent: "space-between",
            },
          }}
        />
      </body>
    </html>
  );
}