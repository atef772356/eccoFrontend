import Link from "next/link";
import React from "react";

export default function BreadCrumb({ path, productId }) {
  console.log("mmm", productId);
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-gray-700">
        <li>
          <Link
            href="/"
            className="block transition-colors hover:text-gray-900">
            {" "}
            Home{" "}
          </Link>
        </li>

        <li className="rtl:rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"></path>
          </svg>
        </li>

        <li>
          <a href="#" className="block transition-colors hover:text-gray-900">
            {path.split("/")[1]}
          </a>
        </li>

        <li className="rtl:rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"></path>
          </svg>
        </li>

        <li>
          <a href="#" className="block transition-colors hover:text-gray-900">
            {productId?.data?.title}
          </a>
        </li>
      </ol>
    </nav>
  );
}
