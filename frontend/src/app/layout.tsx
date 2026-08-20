import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fashion-MNIST",
  description: "Minimalist Fashion-MNIST AI classifier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen selection:bg-claude-accent/20 selection:text-claude-text">
        {children}
      </body>
    </html>
  );
}
