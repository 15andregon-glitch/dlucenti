import { AppProviders } from "@/components/providers/AppProviders";
import { fontVariables } from "@/lib/fonts";
import { rootMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--maison-ivory)] text-[var(--maison-charcoal)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
