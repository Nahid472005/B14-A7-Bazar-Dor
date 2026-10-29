"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Product, Category, SortOption } from "@/types";
import ProductCard from "@/components/common/ProductCard";
import { toBnDigits } from "@/lib/bengali";
import { ChevronDown, ArrowLeft } from "lucide-react";

interface CategoryViewProps {
  category: Category;
  initialProducts: Product[];
}

export default function CategoryView({
  category,
  initialProducts,
}: CategoryViewProps) {
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Challenge C1: Sort products by numerical value
  const sortedProducts = useMemo(() => {
    const list = [...initialProducts];
    if (sortOption === "price-asc") {
      return list.sort((a, b) => a.today - b.today);
    }
    if (sortOption === "price-desc") {
      return list.sort((a, b) => b.today - a.today);
    }
    return list;
  }, [initialProducts, sortOption]);

  const sortLabels: Record<SortOption, string> = {
    default: "ডিফল্ট",
    "price-asc": "দাম: কম থেকে বেশি",
    "price-desc": "দাম: বেশি থেকে কম",
  };

  if (!initialProducts || initialProducts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center text-3xl">
          🔍
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          কোনো পণ্য পাওয়া যায়নি
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          এই ক্যাটাগরিতে এই মুহূর্তে কোনো পণ্য তালিকাভুক্ত নেই অথবা লিঙ্কটি সঠিক নয়।
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-inner">
          <span>{category.icon || "🛒"}</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {category.nameBn}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {toBnDigits(initialProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      {/* Sort Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Count text */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          মোট <span className="font-bold text-slate-900">{toBnDigits(sortedProducts.length)}</span>টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Challenge C1: Sort Dropdown */}
        <div className="relative self-end sm:self-auto flex items-center gap-2">
          <span className="text-xs sm:text-sm text-slate-500 font-medium">
            সাজান:
          </span>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors"
            >
              <span>{sortLabels[sortOption]}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40">
                {(
                  [
                    "default",
                    "price-asc",
                    "price-desc",
                  ] as SortOption[]
                ).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs sm:text-sm transition-colors ${
                      sortOption === opt
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {sortLabels[opt]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
