"use client";
import Image from "next/image";
import React, { useEffect, useState, useContext } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
// تم إزالة useRef لأنه لم يعد مطلوباً للإغلاق
import { ShoppingCart } from "lucide-react";
import ContextCart from "../_context/ContextCart";
import cartApi from "../_Utils/cartApi";
import Carts from "./Carts";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [cart, setCart] = useContext(ContextCart);

  useEffect(() => {
    setIsLogedIn(
      window.location.href.toString().includes("sign-in") ||
        window.location.href.toString().includes("sign-up")
    );
  }, []);

  const [openCArt, setOPenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  // 🔥 تم حذف الـ useEffect الخاص بـ mousedown لأنه كان سبب المشكلة 🔥
  // سنعتمد على الـ Overlay في الأسفل فقط

  function handleOpenCart() {
    setOPenCart(!openCArt);
  }

  useEffect(() => {
    if (isLoaded && user) {
      getCartItems();
    }
  }, [isLoaded && user?.primaryEmailAddress?.emailAddress]);

  const getCartItems = () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    cartApi.getCart(user.primaryEmailAddress.emailAddress).then((res) => {
      res?.data?.data.forEach((citem) => {
        setCart((oldCart = []) => [
          ...oldCart,
          {
            documentId: citem?.documentId,
            product: citem?.data?.data?.products[0],
          },
        ]);
      });
    });
  };
  const pathname = usePathname();

  const hideFooter =
    pathname?.includes("sign-in") ||
    pathname?.includes("sign-up") ||
    pathname?.includes("login");

  if (hideFooter) return null;

  return (
    <header className=" shadow-md bg-white z-20 relative">
      <div className="mx-auto flex h-16 items-center gap-8 sm:px-6 lg:px-8 px-4 shadow-md">
        <Image src="/logo.svg" alt="image" width={40} height={40} />

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="/">
                  Home
                </a>
              </li>
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#">
                  Explor
                </a>
              </li>
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#">
                  Projects
                </a>
              </li>
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#">
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#">
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>

          <div className=" hidden md:block flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button className="bg-[#1754fa] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-[#71bfff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <h2 className="flex items-center">
                  <button className="cursor-pointer" onClick={handleOpenCart}>
                    <ShoppingCart />
                  </button>{" "}
                  ({cart?.length || 0})
                </h2>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "p-0 !important",
                      userButtonAvatarImage:
                        "w-10 h-10 !important object-cover !important",
                    },
                  }}
                />

                {/* Desktop Cart Overlay */}
                {openCArt && (
                  <div
                    className="fixed inset-0 z-40 bg-black/20"
                    // هنا عند الضغط على الخلفية يتم الإغلاق
                    // وبما أننا وضعنا stopPropagation في Carts.js
                    // فالضغط داخل الكارت لن يفعل هذا الكود
                    onClick={() => setOPenCart(false)}>
                    <Carts openCArt={openCArt} setOPenCart={setOPenCart} />
                  </div>
                )}
              </div>
            </SignedIn>
          </div>

          {/* Mobile View */}
          <div className="flex gap-0.5 md:hidden">
            <h2 className="flex items-center">
              <button onClick={() => setOPenCart((prev) => !prev)}>
                <ShoppingCart />
              </button>
              ({cart?.length || 0})
            </h2>

            {/* Mobile Cart Overlay - تم تحديثه ليشبه الديسكتوب */}
            {openCArt && (
              <div
                className="fixed inset-0 z-40 bg-black/20"
                onClick={() => setOPenCart(false)}>
                <Carts openCArt={openCArt} setOPenCart={setOPenCart} />
              </div>
            )}

            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="md:hidden relative z-50 flex flex-col gap-1.5 p-2 hover:text-red-600">
              <span
                className={`block h-[2px] w-6 bg-gray-700 transition-all duration-300 ${
                  openMenu ? "rotate-45 translate-y-2" : ""
                }`}></span>
              <span
                className={`block h-[2px] w-6 bg-gray-700 transition-all duration-300 ${
                  openMenu ? "opacity-0" : ""
                }`}></span>
              <span
                className={`block h-[2px] w-6 bg-gray-700 transition-all duration-300 ${
                  openMenu ? "-rotate-45 -translate-y-2" : ""
                }`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu / Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          openMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenMenu(false)}></div>

      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white shadow-xl z-50 p-6 pt-20 transform transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "-translate-x-full"
        }`}>
        <nav className="space-y-6">
          <a
            className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            href="/">
            Home
          </a>
          <a
            className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            href="#">
            Explor
          </a>
          <a
            className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            href="#">
            Projects
          </a>
          <a
            className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            href="#">
            About Us
          </a>
          <a
            className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            href="#">
            Contact Us
          </a>
        </nav>

        <div className="mt-10 space-y-4">
          <SignedOut>
            <SignInButton>
              <button className="w-full bg-[#1754fa] text-white py-3 rounded-xl">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="w-full bg-[#71bfff] text-white py-3 rounded-xl">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4 mt-4">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "p-0",
                    userButtonAvatarImage: "w-10 h-10 object-cover",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
