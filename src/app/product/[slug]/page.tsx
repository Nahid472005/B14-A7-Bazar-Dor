import { getProductByIdOrSlug } from "@/lib/api";
import ProductDetailView from "@/components/product/ProductDetailView";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    return {
      title: "পণ্য পাওয়া যায়নি — বাজার দর",
    };
  }

  return {
    title: `${product.nameBn} আজকের বাজার দর — বাজার দর`,
    description: `${product.nameBn} এর আজকের বাজার দর, সর্বনিম্ন ও সর্বোচ্চ দাম এবং বিভিন্ন বাজারের তুলনামূলক বিবরণ।`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
