"use client";
import React, { useContext } from "react"; // 1. مسحنا useEffect و useState لأننا مش محتاجينهم هنا
import ContextCart from "../_context/ContextCart";
import Link from "next/link";
import { useUser } from "@clerk/nextjs"; // مسحنا cartApi
import { TrashIcon } from "lucide-react";
import cartApi from "../_Utils/cartApi"; // نحتاجه فقط للحذف

export default function Carts({ openCArt, setOPenCart }) {
  // نعتمد فقط على الكونتكست الذي ملأه الـ Header
  const [cart, setCart] = useContext(ContextCart);
  // لا حاجة لـ useUser هنا لأننا لن نجلب داتا، نحن فقط نعرضها ونحذف

  // 🔥 تم حذف الـ useEffect بالكامل من هنا 🔥
  // البيانات تأتي جاهزة من الـ Header عبر الـ ContextCart

  const deleteCartItemFromList = (documentId) => {
    if (!documentId) return;

    cartApi
      .deleteCartItem(documentId)
      .then(() => {
        setCart((oldCart) =>
          oldCart.filter((item) => item.documentId !== documentId)
        );
      })
      .catch((err) => {
        console.log("Error deleting cart item", err);
      });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-10 top-14 w-[380px] max-h-[400px] overflow-auto z-50 rounded-xl shadow-2xl border border-gray-200 bg-white p-6">
      <button
        onClick={() => setOPenCart(false)}
        className="cursor-pointer hover:text-red-600 absolute right-4 top-4 text-gray-500 transition hover:scale-125">
        ✕
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        My Cart
      </h2>

      <ul className="space-y-5">
        {(!cart || cart.length === 0) && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

        {cart?.map((item) => {
          const product = item?.products?.[0];
          if (!product) return null;

          return (
            <li
              key={item?.documentId || item?.id}
              className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition">
              {/* نصيحة الصور:
                  حاول دائماً استخدام الصور المصغرة إذا كانت متوفرة من Strapi
                  example: src={product?.banner?.formats?.thumbnail?.url || product?.banner?.url}
              */}
              <img
                src={product?.banner?.url}
                alt={product?.title}
                className="w-16 h-16 rounded-md object-cover border"
              />

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {product?.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Category: {product?.category}
                </p>
              </div>

              <button
                onClick={() => deleteCartItemFromList(item.documentId)}
                className="text-gray-500 hover:text-red-600 transition text-xl">
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 space-y-4 text-center">
        <Link
          href="/cart"
          onClick={() => setOPenCart(false)}
          className="block rounded-md bg-indigo-600 text-white px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 shadow">
          View my cart ({cart?.length || 0})
        </Link>

        <Link
          href="/"
          onClick={() => setOPenCart(false)}
          className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-700">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
