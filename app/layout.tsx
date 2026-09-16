import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SporkIt — Your food diary starts here",
  description: "Discover dishes worth trying. Share your honest verdict. Because every meal has a story.",
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
