"use client";
import React, { useContext, useEffect, useState } from "react";
import { ShoppingCart, Star, ShieldCheck, Truck, Sparkles } from "lucide-react";
import SkeltonProduct from "@/app/_component/SkeltonProduct";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import cartApi from "@/app/_Utils/cartApi";
import ContextCart from "@/app/_context/ContextCart";

function ProductInfo({ products }) {
  const { user } = useUser();
  const router = useRouter();
  const [cart, setCart] = useContext(ContextCart);
  const [cartLoaded, setCartLoaded] = useState(false);

  const product = products?.data;

  async function handleAuth() {
    // 1) التحقق من تسجيل الدخول
    if (!user) {
      router.push(
        "/sign-in?redirectURl=" + encodeURIComponent(window.location.href)
      );
      return;
    }

    // 2) التأكد أن المنتج موجود
    if (!product?.documentId) {
      console.error("❌ Product ID is missing");
      return;
    }

    // 3) البيانات المرسلة لـ Cart
    const payload = {
      data: {
        username: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        products: [product.documentId],
      },
    };

    try {
      // 4) إضافة المنتج للسلة
      const res = await cartApi.addToCart(payload);
      console.log("Cart created successfully:", res);

      // 5) جلب السلة كاملة ببيانات المنتج (populate)
      const email = user.primaryEmailAddress.emailAddress;
      const cartResponse = await cartApi.getCart(email);

      const fullCart = cartResponse?.data?.data || [];

      // 6) تحديث Context بالبيانات الصحيحة
      setCart(fullCart);

      console.log("🛒 Updated Cart:", fullCart);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  }
  useEffect(() => {
    if (user) {
      cartApi
        .getCart(user.primaryEmailAddress.emailAddress)
        .then((res) => {
          setCart(res?.data?.data || []);
          setCartLoaded(true); // ← السلة جاهزة 100%
        })
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [user]);
  // Debug cart

  const formatPrice = (p) =>
    typeof p === "number"
      ? `$${p.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : p;

  return product?.title ? (
    <div className="group bg-white  rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200  m-4 md:m-6 p-6 sm:p-8  max-w-2xl">
      {/* Category + Instant Access */}
      <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
        {product?.category && (
          <span className="bg-sky-100  text-sky-700  text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        )}
        {product?.instantDelivery && (
          <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            <Truck size={14} /> Instant Access
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900  mb-3 leading-snug">
        {product?.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={`${
              i < 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-400"
            }`}
          />
        ))}
        <span className="text-xs text-slate-500  ml-1">(120 reviews)</span>
      </div>

      {/* Description */}
      <p className="text-slate-600  text-sm sm:text-base leading-relaxed mb-6">
        {product?.description?.[0]?.children?.[0]?.text ||
          "No description available."}
      </p>

      {/* Price + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="block text-3xl font-bold text-sky-600 ">
            {formatPrice(product?.price)}
          </span>
          <span className="text-xs text-slate-400">
            Includes lifetime access
          </span>
        </div>

        <button
          className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors duration-200 shadow-md w-full sm:w-auto"
          onClick={handleAuth}>
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>

      {/* What's Included */}
      {product?.whatsincluded?.length > 0 && (
        <div className="bg-slate-50  p-4 sm:p-5 rounded-xl">
          <h3 className="flex items-center gap-2 text-sky-600  font-semibold mb-3">
            <Sparkles size={18} /> What's included
          </h3>
          <ul className="text-sm sm:text-base text-slate-700  space-y-1 list-disc list-inside">
            {product.whatsincluded.map((item, i) => (
              <li key={i}>{item.children?.[0]?.text}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mt-5 text-xs text-slate-500 ">
        <ShieldCheck size={14} />
        Secure Payment Guaranteed
      </div>
    </div>
  ) : (
    <SkeltonProduct />
  );
}

export default ProductInfo;
