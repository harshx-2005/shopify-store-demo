import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import CustomCursor from "@/components/common/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fashion Handloom | Indian Luxury Textile & Home Furnishing Storefront",
  description:
    "Experience premium, handcrafted Indian luxury home textiles, artisan bedding, curtains, fine comforters, and dining linens. Connect to secure headless Shopify checkout.",
  metadataBase: new URL("https://fashionhandloom.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fashion Handloom | Indian Luxury Home Furnishing",
    description:
      "Premium handcrafted Indian luxury textiles and home furnishings. Discover artisan bedding, comforters, and linen collections.",
    url: "/",
    siteName: "Fashion Handloom",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fashion Handloom Luxury Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion Handloom | Luxury Textile Storefront",
    description: "Premium handcrafted Indian luxury textiles and home furnishings.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="bg-luxury-warmWhite text-luxury-charcoal font-sans antialiased overflow-x-hidden selection:bg-luxury-beige selection:text-luxury-charcoal min-h-screen flex flex-col" suppressHydrationWarning>
        <CartProvider>
          <CustomCursor />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <ChatWidget />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
