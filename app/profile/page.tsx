import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, LogOut, Package, MapPin, Compass, ArrowRight, ShieldCheck, Mail, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ShopifyCustomerInfo {
  firstName?: string;
  lastName?: string;
  emailAddress?: {
    email: string;
  };
}

async function fetchShopifyCustomer(shopId: string, token: string): Promise<ShopifyCustomerInfo | null> {
  const url = `https://shopify.com/${shopId}/account/api/2024-04/graphql`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({
        query: `
          query GetCustomerInfo {
            customer {
              firstName
              lastName
              emailAddress {
                email
              }
            }
          }
        `
      }),
      next: { revalidate: 60 } // cache for 1 minute
    });

    if (!res.ok) return null;
    const body = await res.json();
    return body?.data?.customer || null;
  } catch (error) {
    console.error("Failed to fetch customer profile:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;
  const shopId = process.env.SHOPIFY_SHOP_ID;

  // If not logged in, redirect to login
  if (!token || !shopId) {
    redirect("/api/auth/login");
  }

  // Fetch real customer data from Shopify API, or use luxury fallback for demo
  const customer = await fetchShopifyCustomer(shopId, token);
  
  const firstName = customer?.firstName || "Harsh";
  const lastName = customer?.lastName || "Kshirsagar";
  const email = customer?.emailAddress?.email || "theharshkshirsagar@gmail.com";

  // Realistic mock orders for the design demo matching Fashion Handloom brand
  const mockOrders = [
    {
      id: "FH-89211",
      date: "July 08, 2026",
      items: "Handspun Mulberry Silk Saree - Emerald Gold (1)",
      status: "In Transit (Jaipur Hub)",
      total: 18500,
      trackingUrl: "#",
    },
    {
      id: "FH-87455",
      date: "June 24, 2026",
      items: "Artisan Khadi Cushion Covers - Desert Sienna (2), Organic Cotton Throw (1)",
      status: "Delivered",
      total: 7800,
      trackingUrl: "#",
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-warmWhite pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-stone border-opacity-10 pb-8 mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-luxury-olive text-luxury-cream flex items-center justify-center text-xl font-serif font-bold shadow-md">
              {firstName[0]}{lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-serif text-luxury-charcoal font-medium">
                  Namaste, {firstName}
                </h1>
                <span className="bg-luxury-gold bg-opacity-10 text-luxury-gold text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                  Varanasi Gold Member
                </span>
              </div>
              <p className="text-xs font-sans text-luxury-stone mt-1">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-sans text-luxury-olive hover:text-luxury-gold font-semibold flex items-center gap-1.5 transition-colors border border-luxury-stone border-opacity-10 px-4 py-2 rounded-full bg-luxury-cream bg-opacity-40"
            >
              <Compass className="w-3.5 h-3.5" /> Start Shopping
            </Link>
            <Link
              href="/api/auth/logout"
              className="text-xs font-sans text-red-600 hover:text-red-800 font-semibold flex items-center gap-1.5 transition-colors border border-red-200 px-4 py-2 rounded-full bg-red-50 bg-opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Link>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Orders */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-luxury-stone border-opacity-5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-5 h-5 text-luxury-olive" />
                <h2 className="text-lg font-serif text-luxury-charcoal font-semibold">Your Orders</h2>
              </div>

              {mockOrders.length > 0 ? (
                <div className="space-y-6">
                  {mockOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-luxury-stone border-opacity-5 rounded-xl p-5 hover:border-luxury-stone hover:border-opacity-20 transition-all duration-300 bg-luxury-warmWhite bg-opacity-20"
                    >
                      <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                        <div>
                          <p className="text-[11px] font-sans text-luxury-stone uppercase tracking-wider font-bold">
                            Order {order.id}
                          </p>
                          <p className="text-xs font-sans text-luxury-stone mt-0.5">{order.date}</p>
                        </div>
                        <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          order.status.includes("Delivered") 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm font-sans text-luxury-charcoal font-medium mb-4">
                        {order.items}
                      </p>

                      <div className="flex justify-between items-center border-t border-luxury-stone border-opacity-5 pt-4">
                        <div>
                          <span className="text-xs font-sans text-luxury-stone">Total Amount:</span>
                          <p className="text-base font-serif font-semibold text-luxury-charcoal">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        <a 
                          href={order.trackingUrl}
                          className="text-xs font-sans text-luxury-olive hover:text-luxury-gold font-bold flex items-center gap-1 group transition-colors"
                        >
                          Track Package <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-luxury-stone border-opacity-20 rounded-xl">
                  <Package className="w-8 h-8 text-luxury-stone mx-auto opacity-50 mb-3" />
                  <p className="text-sm font-sans text-luxury-stone">You haven't placed any orders yet.</p>
                  <Link href="/shop" className="text-xs font-sans text-luxury-olive font-bold mt-2 inline-block hover:underline">
                    Browse the Collection
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column: Address & Concierge */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-luxury-stone border-opacity-5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-luxury-olive" />
                <h2 className="text-lg font-serif text-luxury-charcoal font-semibold">Primary Address</h2>
              </div>
              <div className="font-sans text-sm text-luxury-charcoal space-y-1">
                <p className="font-bold">{firstName} {lastName}</p>
                <p>12, Weaver’s Enclave, Colony Road</p>
                <p>Akluj, Solapur</p>
                <p>Maharashtra - 413101</p>
                <p className="text-luxury-stone mt-2">India</p>
              </div>
              <button className="text-xs font-sans text-luxury-stone hover:text-luxury-gold font-semibold underline mt-6 block transition-colors">
                Manage Addresses
              </button>
            </div>

            {/* Support Concierge */}
            <div className="bg-luxury-olive text-luxury-cream p-6 sm:p-8 rounded-2xl border border-luxury-stone border-opacity-5 shadow-lg relative overflow-hidden">
              {/* Background weave watermark */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-lg font-serif font-semibold">Royal Support</h2>
              </div>
              <p className="text-xs font-sans opacity-90 leading-relaxed mb-6">
                As a Gold Member, you have direct access to our specialist handloom weavers concierge for customization requests and delivery assistance.
              </p>
              
              <div className="space-y-3.5 text-xs font-sans">
                <a href="mailto:concierge@fashionhandloom.com" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                  <Mail className="w-4 h-4" /> concierge@fashionhandloom.com
                </a>
                <a href="tel:+919876543210" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                  <Phone className="w-4 h-4" /> +91 98765 43210 (24/7 Priority)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
