"use client";

import Image from "next/image";
import { useShopStore } from "@/store/useShopStore";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";

const orderSummaryCopy: Record<
  Locale,
  {
    title: string;
    empty: string;
    sizeQty: string;
    qty: string;
    subtotal: string;
    memberDiscount: string;
    shipping: string;
    total: string;
    disclaimer: string;
  }
> = {
  pt: {
    title: "Resumo do Pedido",
    empty: "Seu carrinho está vazio.",
    sizeQty: "TAM",
    qty: "QTD",
    subtotal: "Subtotal",
    memberDiscount: "Desconto Sócio (-20%)",
    shipping: "Frete",
    total: "Total",
    disclaimer:
      "Os itens no seu carrinho não estão reservados. Ao concluir o pedido, você concorda com nossos T&C.",
  },
  en: {
    title: "Order Summary",
    empty: "Your cart is empty.",
    sizeQty: "SIZE",
    qty: "QTY",
    subtotal: "Subtotal",
    memberDiscount: "Member Discount (-20%)",
    shipping: "Shipping",
    total: "Total",
    disclaimer:
      "Items in your cart are not reserved. By completing the order, you agree to our T&C.",
  },
  es: {
    title: "Resumen del Pedido",
    empty: "Tu carrito está vacío.",
    sizeQty: "TALLA",
    qty: "CANT",
    subtotal: "Subtotal",
    memberDiscount: "Descuento Socio (-20%)",
    shipping: "Envío",
    total: "Total",
    disclaimer:
      "Los artículos de tu carrito no están reservados. Al finalizar el pedido, aceptas nuestros T&C.",
  },
};

export function CheckoutOrderSummary() {
  const { locale } = useLocale();
  const { cartItems } = useShopStore();
  const copy = orderSummaryCopy[locale];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const isSocio = true;
  const discount = isSocio ? subtotal * 0.2 : 0;
  const shipping = subtotal > 0 ? 15.0 : 0;
  const total = subtotal - discount + shipping;

  const localeMap = { pt: "pt-BR", en: "en-US", es: "es-ES" } as const;
  const formatPrice = (val: number) =>
    val.toLocaleString(localeMap[locale], {
      style: "currency",
      currency: "BRL",
    });

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[4px]">
        <h3 className="text-xl font-heading font-black tracking-widest uppercase mb-4">
          {copy.title}
        </h3>
        <p className="text-sm text-white/40">{copy.empty}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[4px] sticky top-[100px]">
      <h3 className="text-xl font-heading font-black tracking-widest uppercase mb-6 border-b border-white/5 pb-4">
        {copy.title}
      </h3>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
        {cartItems.map((item) => (
          <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
            <div className="relative w-16 h-20 bg-[#111] border border-white/5 shrink-0 rounded-[2px] overflow-hidden">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-wider text-white line-clamp-2 leading-tight">
                {item.product.name}
              </p>
              <p className="text-[10px] text-white/40 mt-1 uppercase">
                {copy.sizeQty}: {item.size} | {copy.qty}: {item.quantity}
              </p>
              <p className="text-[var(--color-primary)] font-bold text-xs mt-2">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 text-sm border-t border-white/5 pt-6">
        <div className="flex justify-between text-white/60">
          <span>{copy.subtotal}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {isSocio && discount > 0 && (
          <div className="flex justify-between text-[#60E861]">
            <span>{copy.memberDiscount}</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-white/60">
          <span>{copy.shipping}</span>
          <span>{formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between text-white font-bold text-lg border-t border-white/10 pt-4 mt-2">
          <span className="uppercase tracking-widest">{copy.total}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <p className="text-[10px] text-white/30 text-center mt-6">
        {copy.disclaimer}
      </p>
    </div>
  );
}

