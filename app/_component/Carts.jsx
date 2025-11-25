"use client";
import React, { useContext, useEffect } from "react";
import ContextCart from "../_context/ContextCart";
import Link from "next/link";
import cartApi from "../_Utils/cartApi";
import { useUser } from "@clerk/clerk-react";
import { TrashIcon } from "lucide-react";

export default function Carts({ openCArt, setOPenCart }) {
  const [cart, setCart] = useContext(ContextCart);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      cartApi
        .getCart(user.primaryEmailAddress.emailAddress)
        .then((res) => {
          setCart(res?.data?.data || []);
        })
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [user, setCart]);

  const deleteCartItemFromList = (documentId) => {
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

  function handleOpenCart() {
    setOPenCart(!openCArt);
  }

  return (
    <div
      className="absolute right-10 top-14 w-[380px] max-h-[400px] overflow-auto z-50 rounded-xl shadow-2xl border border-gray-200 bg-white p-6"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}>
      {/* Close button */}
      <button
        onClick={handleOpenCart}
        className="cursor-pointer hover:text-red-600 absolute right-4 top-4 text-gray-500 transition hover:scale-125">
        ✕
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        My Cart
      </h2>

      {/* Cart Items */}
      <ul className="space-y-5">
        {cart?.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

        {cart?.map((item) => {
          const product = item?.products?.[0];
          if (!product) return null;

          return (
            <li
              key={item?.documentId}
              className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition">
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

      {/* Actions */}
      <div className="mt-6 space-y-4 text-center">
        <Link
          href="/cart"
          onClick={() => setOPenCart(false)}
          className="block rounded-md bg-indigo-600 text-white px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 shadow">
          View my cart ({cart?.length || 0})
        </Link>

        <Link
          href="/"
          className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-700">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
