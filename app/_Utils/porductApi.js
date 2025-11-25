import axiosClient from "./axiosClient";

const getProduct = async () => {
  return axiosClient.get("/products?populate=*");
};

const getProductById = async (documentId) => {
  console.log("📦 Fetching:", `/products/${documentId}?populate=*`);
  return axiosClient.get(`/products/${documentId}?populate=*`);
};

const getProductByCategory = async (category) => {
  return axiosClient.get(
    `/products?filters[category][$eq]=${category}&populate=*`
  );
};

export default { getProduct, getProductById, getProductByCategory };
