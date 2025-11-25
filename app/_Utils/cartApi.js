const { default: axiosClient } = require("./axiosClient");

const addToCart = (payload) => {
  return axiosClient.post("/carts", payload);
};

const getCart = (email) => {
  return axiosClient.get(
    `https://calm-bear-54de635d94.strapiapp.com/api/carts?populate[products][populate]=banner&filters[email][$eq]=${email}`
  );
};
const deleteCartItem = (documentId) => {
  return axiosClient.delete(`/carts/${documentId}`);
};
export default { addToCart, getCart, deleteCartItem };
