import { getProducts } from "@/lib/api";
import HeroBanner from "@/components/home/HeroBanner";
import PriceSections from "@/components/home/PriceSections";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <HeroBanner />
      <PriceSections products={products} />
    </div>
  );
}
