import React from "react";
import Link from "next/link";
export default function ProductItem({ products }) {
  // لا تحتاج تفكيك متغير course، لأنك بتستقبل المنتجات كـ products
  const formatPrice = (p) =>
    typeof p === "number"
      ? `$${p.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : p;

  return (
    <Link href={`/product-detials/${products?.documentId}`}>
      <div className="group bg-white  rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-800 m-5">
        {/* Banner */}
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={products?.banner?.url}
            alt={products?.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />

          {/* Category */}
          {products?.category && (
            <span className="absolute top-3 left-3 bg-white/90  text-slate-800  text-xs font-semibold px-3 py-1 rounded-full shadow">
              {products.category}
            </span>
          )}

          {/* Instant Delivery */}
          {products?.instantDelivery && (
            <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              Instant Access
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-900  mb-2 line-clamp-1">
            {products?.title}
          </h3>
          <p className="text-sm text-slate-600  line-clamp-2 mb-4">
            {products?.description?.[0]?.children?.[0]?.text || ""}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-sky-600 ">
              {formatPrice(products?.price)}
            </span>
            <button className="px-4 py-2 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200">
              Buy Now
            </button>
          </div>

          {/* What's Included */}
          {products?.whatsincluded?.length > 0 && (
            <details className="group">
              <summary className="text-sm text-sky-600  cursor-pointer hover:underline">
                What's included
              </summary>
              <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {products.whatsincluded.map((item, i) => (
                  <p key={i}>{item.children?.[0]?.text}</p>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </Link>
  );
}
