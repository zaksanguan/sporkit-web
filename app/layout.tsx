import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Plus Jakarta Sans (SIL OFL), self-hosted from app/fonts.
const jakarta = localFont({
  src: [
    { path: "./fonts/plus-jakarta-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-jakarta",
});

const title = "SporkIt — Your food diary starts here";
const description =
  "Discover dishes worth trying. Share your honest verdict. Because every meal has a story.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sporkitapp.com"),
  title,
  description,
  icons: { icon: "/favicon.png", apple: "/apple-icon.png" },
  openGraph: {
    title,
    description,
    url: "https://sporkitapp.com",
    siteName: "SporkIt",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F0F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
