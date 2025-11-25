"use client";
import React, { useEffect, useState } from "react";
import productApi from "../_Utils/porductApi";
import ProductList from "./ProductList";
import SkeltonProduct from "./SkeltonProduct";

export default function Product() {
  const [productList, setProductLIst] = useState([]);
  const getProduct_ = () => {
    productApi.getProduct().then((res) => {
      console.log(res.data.data);
      setProductLIst(res.data.data);
    });
  };

  useEffect(() => {
    getProduct_();
  }, []); // 👈 لازم [] علشان مايتنفذش كل ريندر
  console.log("the productList is", productList);
  return productList[0]?.title ? (
    <div>
      <ProductList product={productList} />
    </div>
  ) : (
    <SkeltonProduct />
  );
}
