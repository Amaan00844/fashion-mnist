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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-grid-pattern relative font-body">
        {/* Ambient neon orbs */}
        <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-neon-lime/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-neon-magenta/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/[0.02] rounded-full blur-[150px] pointer-events-none" />

        {children}
      </body>
    </html>
  );
}
