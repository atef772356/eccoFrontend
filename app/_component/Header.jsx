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
import { useRef } from "react";

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

  const cartRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setOPenCart(false);
      }
    };

    if (openCArt) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCArt]);
  function handleOpenCart() {
    if (!openCArt) {
      setOPenCart(true);
    } else {
      setOPenCart(false);
    }
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

  // لو الصفحة هي sign-in أو sign-up أو login → لا يظهر الفوتر
  const hideFooter =
    pathname?.includes("sign-in") ||
    pathname?.includes("sign-up") ||
    pathname?.includes("login");

  if (hideFooter) return null;

  return (
    <header className=" shadow-md bg-white z-20 relative  ">
      <div className="mx-auto flex h-16  items-center gap-8 sm:px-6 lg:px-8 px-4 shadow-md">
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

          <div className="flex items-center gap-4">
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
                  <button className="cursor-pointer">
                    <ShoppingCart onClick={handleOpenCart} />
                  </button>{" "}
                  ({cart?.length || 0})
                </h2>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "p-0 !important", // إزالة أي padding داخلي
                      userButtonAvatarImage:
                        "w-10 h-10 !important object-cover !important",
                    },
                  }}
                />
                {openCArt && (
                  <div ref={cartRef}>
                    <Carts openCArt={openCArt} setOPenCart={setOPenCart} />
                  </div>
                )}
              </div>
            </SignedIn>

            <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
