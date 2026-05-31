"use client";
import React from "react";
import { createRazorpayOrder, confirmRazorpayPayment } from "@/lib/api";

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Script load failed"));
    document.body.appendChild(s);
  });
}

export default function Checkout({ amount }: { amount: number }) {
  async function handleCheckout() {
    try {
      const data = await createRazorpayOrder(amount);
      const order = data.order;
      const key = data.key;

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      const options = {
        key,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        handler: async function (response: any) {
          try {
            await confirmRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Payment successful");
          } catch (err: any) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        prefill: {},
      } as any;

      // @ts-ignore
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert("Unable to start checkout");
    }
  }

  return <button onClick={handleCheckout}>Pay ₹{amount}</button>;
}
