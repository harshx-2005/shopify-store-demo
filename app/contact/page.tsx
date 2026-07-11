"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Clock, Send, MessageSquare, ChevronDown, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "What makes handloom textiles different from machine weaves?",
    answer: "Machine looms tightly stretch and compress yarns, resulting in stiff, uniform sheets. Traditional handloom shuttle looms maintain natural yarn elasticity. This slow-weaving process creates subtle textures (slubs) that increase absorption, drape beautifully, and soften significantly with each wash.",
  },
  {
    question: "How should I care for my organic cotton and linen bedding?",
    answer: "We recommend washing in cold water using a mild, biodegradable detergent. Line dry in the shade to preserve natural pigments, or tumble dry on low. Avoid bleach and optical brighteners. Handloom bedding naturally relaxes, so ironing is optional.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 60 countries including the United States, Europe, UAE, and Singapore. International shipping is calculated during the Shopify checkout process based on weight and country regulations.",
  },
  {
    question: "What is your return and exchange policy?",
    answer: "We accept returns on unused, unwashed sheets and linens within 14 days of delivery. Returns are free in India. Once we receive and inspect the item, a refund is issued directly to your original payment method.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-luxury-warmWhite pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Intro */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="flex justify-center gap-2 text-[10px] font-sans uppercase tracking-widest text-luxury-stone text-opacity-65">
            <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-luxury-charcoal font-semibold">Contact & Support</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-luxury-charcoal font-medium">
            Connect With Us
          </h1>
          <p className="font-sans text-xs text-luxury-stone text-opacity-90 leading-relaxed">
            Need styling advice, custom fabric dimensions, or assistance with your order? Our concierge team is available to assist you.
          </p>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto mt-4" />
        </div>

        {/* Form and Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Contact Details (Left) */}
          <div className="md:col-span-5 space-y-8">
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-luxury-charcoal font-semibold">
                Direct Contact
              </h2>
              <div className="space-y-4 font-sans text-xs text-luxury-stone leading-relaxed">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-luxury-olive" />
                  <div>
                    <p className="font-semibold text-luxury-charcoal">Concierge Call / WhatsApp</p>
                    <p className="mt-0.5">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-luxury-olive" />
                  <div>
                    <p className="font-semibold text-luxury-charcoal">Email Support</p>
                    <p className="mt-0.5">concierge@fashionhandloom.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-luxury-olive" />
                  <div>
                    <p className="font-semibold text-luxury-charcoal">Business Hours</p>
                    <p className="mt-0.5">Monday to Saturday: 10:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map placeholder */}
            <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-luxury-cream border border-luxury-stone border-opacity-10 shadow-luxury flex items-center justify-center text-center p-6">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400')] bg-cover opacity-15" />
              <div className="relative space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-widest text-luxury-gold font-bold">Loom Cluster Location</span>
                <h4 className="font-serif text-sm font-semibold text-luxury-charcoal">Fashion Handloom Atelier</h4>
                <p className="font-sans text-[10px] text-luxury-stone">Ahilya Fort Road, Maheshwar, Madhya Pradesh - 451224</p>
              </div>
            </div>
          </div>

          {/* Form (Right) */}
          <div className="md:col-span-7 bg-luxury-cream bg-opacity-40 p-8 rounded-3xl border border-luxury-stone border-opacity-5 shadow-luxury">
            <h2 className="font-serif text-xl text-luxury-charcoal font-semibold mb-6">
              Send an Inquiry
            </h2>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center space-y-4"
              >
                <CheckCircle className="w-12 h-12 text-luxury-olive" />
                <h3 className="font-serif text-lg text-luxury-charcoal">Thank You</h3>
                <p className="font-sans text-xs text-luxury-stone max-w-sm">
                  Your message has been received by our concierge. We will reply to your registered email address within 24 hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 bg-luxury-charcoal text-luxury-warmWhite text-xs font-sans uppercase tracking-widest rounded-lg hover:bg-luxury-olive transition-colors duration-300"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-sans uppercase tracking-widest text-luxury-stone font-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-luxury-warmWhite px-4 py-3 rounded-lg border border-luxury-stone border-opacity-20 focus:outline-none focus:border-luxury-gold text-xs font-sans"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-sans uppercase tracking-widest text-luxury-stone font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-luxury-warmWhite px-4 py-3 rounded-lg border border-luxury-stone border-opacity-20 focus:outline-none focus:border-luxury-gold text-xs font-sans"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-sans uppercase tracking-widest text-luxury-stone font-semibold">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-luxury-warmWhite px-4 py-3 rounded-lg border border-luxury-stone border-opacity-20 focus:outline-none focus:border-luxury-gold text-xs font-sans resize-none"
                    placeholder="Describe your inquiry (e.g. bedding swatches request, custom dimensions, order status)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-luxury-charcoal text-luxury-warmWhite text-xs font-sans uppercase tracking-widest rounded-xl hover:bg-luxury-olive transition-colors duration-300 flex justify-center items-center gap-2 font-semibold"
                >
                  {isSubmitting ? (
                    "Sending Message..."
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-luxury-gold font-bold">
              Got Questions?
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-luxury-charcoal font-medium">
              Frequently Asked Questions
            </h2>
            <div className="w-10 h-0.5 bg-luxury-gold mx-auto mt-3" />
          </div>

          <div className="max-w-3xl mx-auto border border-luxury-stone border-opacity-20 rounded-2xl overflow-hidden divide-y divide-luxury-stone divide-opacity-10 shadow-luxury bg-luxury-cream bg-opacity-25">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index}>
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-luxury-cream transition-all duration-300"
                  >
                    <span className="font-serif text-sm font-semibold text-luxury-charcoal tracking-wide">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4.5 h-4.5 text-luxury-stone transition-transform duration-300 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-luxury-warmWhite"
                      >
                        <p className="px-6 pb-6 pt-2 font-sans text-xs text-luxury-stone text-opacity-90 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
