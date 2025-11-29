import Image from "next/image";
import React from "react";

function ProductBanner({ products }) {
  console.log("product banner data:", products);
  const banner = products?.data?.banner?.url;

  return (
    <div className="bg-white  rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200  p-4 flex justify-center items-center">
      {banner ? (
        <Image
          src={banner}
          alt={products?.data?.title || "Product Banner"}
          width={400}
          height={400}
          className="rounded-2xl object-cover w-[380px] h-[380px] md:w-[420px] md:h-[420px] transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <div className="w-[380px] h-[380px] animate-pulse"></div>
      )}
    </div>
  );
}

export default ProductBanner;
