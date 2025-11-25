import React from "react";
import ProductItem from "./ProductItem";

export default function ProductList({ product }) {
  console.log("the Product", product);
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-15">Our Latest Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4 mx-auto align-center place-content-center ">
        {Array.isArray(product) &&
          product.map((item) => <ProductItem key={item?.id} products={item} />)}
      </div>
    </div>
  );
}
