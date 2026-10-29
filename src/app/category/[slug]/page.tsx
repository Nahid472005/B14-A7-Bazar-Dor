import { getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import CategoryView from "@/components/category/CategoryView";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "ক্যাটাগরি পাওয়া যায়নি — বাজার দর",
    };
  }

  return {
    title: `${category.nameBn} — বাজার দর`,
    description: `${category.nameBn} পণ্যের আজকের বাজার দর ও তালিকা।`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.slug || slug);

  return <CategoryView category={category} initialProducts={products} />;
}
