"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // لو الصفحة هي sign-in أو sign-up أو login → لا يظهر الفوتر
  const hideFooter =
    pathname?.includes("sign-in") ||
    pathname?.includes("sign-up") ||
    pathname?.includes("login");

  if (hideFooter) return null;

  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-4 text-center space-y-2">
        <p className="text-sm">
          This website was developed by{" "}
          <a
            href="https://your-link.com" // ← ضع هنا رابطك (GitHub, LinkedIn, Portfolio)
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
            Atef Mohemd
          </a>
        </p>
        <p className="text-xs text-gray-500">
          © {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
