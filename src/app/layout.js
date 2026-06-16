import { EB_Garamond, Hanken_Grotesk } from 'next/font/google';
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
});

export const metadata = {
  title: "SOVA OFFICIAL | Refined Utility",
  description: "Curated leather goods for the discerning collector.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Material Symbols Import */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className={`${ebGaramond.variable} ${hankenGrotesk.variable} bg-background text-on-background antialiased selection:bg-primary-fixed selection:text-on-primary-fixed`}>
        {children}
      </body>
    </html>
  );
}