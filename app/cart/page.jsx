"use client";
import React, { useContext, useEffect, useState } from "react";
import ContextCart from "../_context/ContextCart";
import cartApi from "../_Utils/cartApi";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { DeleteIcon, RemoveFormattingIcon, TrashIcon } from "lucide-react";

export default function Page() {
  const [cart, setCart] = useContext(ContextCart);
  const [cartLoaded, setCartLoaded] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Load cart
  useEffect(() => {
    if (user) {
      cartApi
        .getCart(user.primaryEmailAddress.emailAddress)
        .then((res) => {
          setCart(res?.data?.data || []);
          setCartLoaded(true);
        })
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [user]);

  const getTotalAmount = () => {
    if (!cart) return 0;
    return cart.reduce(
      (sum, item) => sum + Number(item?.products?.[0]?.price || 0),
      0
    );
  };

  const deleteCartItemFromList = async (documentId) => {
    try {
      await cartApi.deleteCartItem(documentId);
      setCart((oldCart) => oldCart.filter((i) => i.documentId !== documentId));
    } catch (err) {
      console.log("Error deleting item", err);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) return;

    try {
      await Promise.all(
        cart.map(
          (item) => item.documentId && cartApi.deleteCartItem(item.documentId)
        )
      );
      setCart([]);
      setShowModal(true);
      setTimeout(() => setAnimate(true), 50);
    } catch (err) {
      console.log("Error during checkout:", err);
      alert("Checkout failed!");
    }
  };

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => {
      setShowModal(false);
      router.push("/");
    }, 300);
  };

  return (
    <>
      {/* Success Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black/60 transition-opacity duration-300 ${
            animate ? "opacity-100" : "opacity-0"
          }`}>
          <div
            className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 transform transition-all duration-300 ${
              animate ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}>
            <div className="flex justify-center mb-6">
              <span
                className={`text-green-500 text-6xl transform transition-all duration-500 ${
                  animate ? "scale-100 animate-bounce" : "scale-0"
                }`}>
                ✅
              </span>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Payment Successful!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Thank you for your purchase.
            </p>
            <button
              onClick={closeModal}
              className="mx-auto block bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded-lg text-md font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              OK
            </button>
          </div>
        </div>
      )}

      {/* Cart Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-indigo-100 py-12 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl bg-white shadow-xl rounded-xl p-10">
            <header className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-indigo-700">
                Your Shopping Cart
              </h1>
              <p className="text-gray-500 mt-2">
                Review your items before checkout
              </p>
            </header>

            {cartLoaded && (!cart || cart.length === 0) && (
              <p className="text-center text-gray-500 text-lg py-10">
                Your cart is empty.
              </p>
            )}

            <ul className="space-y-6">
              {cart?.map((item) => {
                const product = item?.products?.[0];
                if (!product) return null;
                return (
                  <li
                    key={item.documentId}
                    className="flex items-center gap-6 p-5 bg-gray-50 rounded-lg shadow hover:shadow-md transition">
                    <img
                      src={product.banner?.url}
                      alt={product.title}
                      className="w-24 h-24 rounded-lg object-cover border"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Price: ${product.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        Category: {product.category}
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

            {cart?.length > 0 && (
              <div className="mt-10 border-t pt-6">
                <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                  <span>Total</span>
                  <span>${getTotalAmount()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-500 transition text-lg font-semibold shadow-lg hover:scale-105">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
