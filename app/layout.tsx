import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";


const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Elixir",
  description: "Automated Project Management Tool", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg" href="/elixir-logo.svg" />
      </head>
      <body
        className={`${workSans.variable} ${workSans.variable} antialiased 
        bg-navyDark text-white tracking-wide

        `
      } 

      >
        {children}
      </body>
    </html>
  );
}
