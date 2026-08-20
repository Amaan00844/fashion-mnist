import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fashion-MNIST AI Studio | Neural Network Classifier",
  description:
    "Interactive real-time Fashion-MNIST AI image and drawing classification dashboard powered by PyTorch & FastAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-grid-pattern relative">
        {/* Glowing background ambient lights */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-accent-pink/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {children}
      </body>
    </html>
  );
}
