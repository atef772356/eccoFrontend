import Image from "next/image";
import Hero from "./_component/Hero";
import Product from "./_component/Product";

export default function Home() {
  return (
    <div>
      <Hero />

      <Product />
    </div>
  );
}
