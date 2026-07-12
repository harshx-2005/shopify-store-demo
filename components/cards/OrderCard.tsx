"use client";

import React from "react";
import { Package, Truck, ExternalLink, Calendar, CheckCircle2, Circle } from "lucide-react";
import { OrderStatus } from "@/types/chat";

interface OrderCardProps {
  order: OrderStatus;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getFulfillmentBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "FULFILLED":
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PARTIALLY_FULFILLED":
      case "IN_TRANSIT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-luxury-beige text-luxury-stone border-luxury-stone/20";
    }
  };

  return (
    <div className="rounded-2xl border border-luxury-stone/20 bg-luxury-warmWhite shadow-sm overflow-hidden select-none font-sans text-luxury-charcoal mt-2">
      {/* Title Header */}
      <div className="bg-luxury-charcoal text-luxury-warmWhite p-3.5 flex items-center justify-between border-b border-luxury-stone/20">
        <div className="flex items-center gap-2">
          <Package size={15} className="text-luxury-gold" />
          <span className="text-xs font-bold tracking-wide">
            Order Status: {order.orderNumber}
          </span>
        </div>
        <span
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getFulfillmentBadgeClass(
            order.fulfillmentStatus
          )}`}
        >
          {order.fulfillmentStatus.replace("_", " ")}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="p-3.5 flex flex-col gap-3.5">
        {/* Line Items List */}
        <div className="flex flex-col gap-2">
          {order.lineItems.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-10 h-10 object-cover rounded-lg border border-luxury-stone/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate">{item.title}</p>
                <p className="text-[9px] text-luxury-stone font-semibold mt-0.5">
                  Qty: {item.quantity} • {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carrier Details */}
        {order.tracking && (
          <div className="bg-luxury-cream p-2.5 rounded-xl border border-luxury-stone/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-luxury-gold" />
              <div className="min-w-0">
                <p className="text-[9px] text-luxury-stone font-semibold">Shipped via {order.tracking.carrier}</p>
                <p className="text-[10px] font-bold truncate tracking-wide text-luxury-charcoal">
                  No: {order.tracking.number}
                </p>
              </div>
            </div>
            <a
              href={order.tracking.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 text-[9px] font-bold text-luxury-warmWhite bg-luxury-charcoal hover:bg-luxury-olive rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
            >
              <span>Track</span>
              <ExternalLink size={8} />
            </a>
          </div>
        )}

        {/* Shipping Address Details */}
        <div className="text-[9px] border-t border-luxury-stone/5 pt-2 flex flex-col gap-1">
          <p className="font-bold text-luxury-stone text-[8px] uppercase tracking-wider">Shipping Destination</p>
          <p className="font-semibold">{order.shippingAddress.name}</p>
          <p className="text-luxury-stone truncate">
            {order.shippingAddress.address1}, {order.shippingAddress.city}, {order.shippingAddress.zip}
          </p>
        </div>

        {/* Progress History Timeline */}
        <div className="border-t border-luxury-stone/5 pt-3.5 flex flex-col gap-2 relative">
          <p className="font-bold text-luxury-stone text-[8px] uppercase tracking-wider mb-1">Transit Timeline</p>
          
          <div className="flex flex-col gap-3 relative pl-4">
            {/* Horizontal progress bar */}
            <div className="absolute left-1.5 top-1 bottom-1 w-0.5 bg-luxury-beige" />

            {order.history.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 relative text-[9px]">
                {/* Status Dot */}
                <span className="absolute -left-4.5 top-0.5 z-10 bg-luxury-warmWhite">
                  {step.completed ? (
                    <CheckCircle2 size={11} className="text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Circle size={11} className="text-luxury-stone/40" />
                  )}
                </span>

                <div className="flex items-center justify-between font-bold">
                  <span className={step.completed ? "text-luxury-charcoal" : "text-luxury-stone/60"}>
                    {step.status}
                  </span>
                  <span className="text-[8px] text-luxury-stone font-semibold">{step.date}</span>
                </div>
                <p className="text-luxury-stone leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
