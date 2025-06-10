import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const MontserratVariable = localFont({
  src: "./fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat-sans",
  weight: "100 900",
});

const MontserratItalicVariableFont = localFont({
  src: "./fonts/Montserrat-Italic-VariableFont_wght.ttf",
  variable: "--font-montserrat-italic",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JurisControl",
  description: "Aqui, tudo gira em torno da eficiência. Simplificando o complexo, estamos prontos para ajudar.",
  icons: "/logo-icone.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${MontserratVariable.variable} ${MontserratItalicVariableFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
