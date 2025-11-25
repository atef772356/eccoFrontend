"use client";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import BreadCrumb from "@/app/_component/BreadCrumb";
import productApi from "@/app/_Utils/porductApi";
import ProductBanner from "../_component/ProductBanner";
import ProductInfo from "../_component/ProductInfo";
import ProductList from "@/app/_component/ProductList";

export default function Page() {
  const params = useParams();
  const { productId } = params;

  const [productDetails, setProductDetails] = useState(null);
  const [productList, setProductList] = useState(null);

  // ✅ دالة جلب المنتجات حسب التصنيف
  const getProductByCategory = async (category) => {
    try {
      const res = await productApi.getProductByCategory(category);
      setProductList(res.data.data);
      console.log("Similar Products:", res.data.data);
    } catch (error) {
      console.error("حدث خطأ أثناء تحميل المنتجات المشابهة:", error);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await productApi.getProductById(productId);
        const product = res.data;
        setProductDetails(product);

        // ✅ بعد تحميل المنتج، استخرج التصنيف
        const category = product?.data?.category;
        if (category) {
          console.log("📦 Category:", category);
          getProductByCategory(category);
        }
      } catch (error) {
        console.error("حدث خطأ أثناء تحميل المنتج:", error);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);
  const path = usePathname();

  return (
    <div>
      <div className="p-6 md:p-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 min-h-screen">
        <BreadCrumb path={path} productId={productDetails} />

        {/* 🛍️ تفاصيل المنتج */}
        <div className="mt-10 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-10 md:gap-20">
          <div className="flex-shrink-0 w-full md:w-[45%] flex justify-center">
            <ProductBanner products={productDetails} />
          </div>

          <div className="w-full lg:w-[50%]">
            <ProductInfo products={productDetails} />
          </div>
        </div>

        {/* 🔒 قسم الثقة */}
        <div className="mt-16 border-t border-slate-200 dark:border-slate-700 pt-10 flex flex-col md:flex-row justify-center items-center gap-8 text-slate-600 dark:text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-sky-500 text-lg">🚚</span>
            Fast & Instant Delivery
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sky-500 text-lg">💳</span>
            Secure Payment
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sky-500 text-lg">💬</span>
            24/7 Support
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sky-500 text-lg">⭐</span>
            Trusted by Thousands
          </div>
        </div>
      </div>
      {console.log("similar product list", productList)}
      {/* 🛒 المنتجات المشابهة */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Similar Products
        </h2>
        <ProductList product={productList} />
      </div>
    </div>
  );
}
