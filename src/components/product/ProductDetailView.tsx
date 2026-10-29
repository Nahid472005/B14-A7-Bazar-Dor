"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Product } from "@/types";
import {
  formatBnPrice,
  formatBnUnit,
  formatBnChange,
  toBnDigits,
} from "@/lib/bengali";
import toast from "react-hot-toast";
import { ArrowLeft, Store, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Protected route check
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("পণ্যটির বিস্তারিত দেখতে অনুগ্রহ করে সাইন ইন করুন", {
        id: "auth-guard-toast",
      });
      router.push(`/signin?redirect=/product/${product.id}`);
    }
  }, [session, isPending, router, product.id]);

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-40 bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 bg-white rounded-2xl border border-slate-200" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null; // Will redirect in useEffect
  }

  // Calculate Min, Max, and Average prices across markets
  const marketMins = product.markets?.map((m) => m.min) || [product.today];
  const marketMaxs = product.markets?.map((m) => m.max) || [product.today];

  const minPrice = Math.min(...marketMins);
  const maxPrice = Math.max(...marketMaxs);
  const avgPrice = Math.round(
    [...marketMins, ...marketMaxs].reduce((acc, curr) => acc + curr, 0) /
      (marketMins.length + marketMaxs.length)
  );

  const changeInfo = formatBnChange(product.change.dir, product.change.pct);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Back to Home Button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল পণ্যে ফিরে যান</span>
        </Link>
      </div>

      {/* 1. Top — Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Emoji in big circle */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0 shadow-inner">
            <span>{product.image || product.categoryIcon || "🛒"}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {product.nameBn}
              </h1>

              {/* Category Tag */}
              <Link
                href={`/category/${product.category}`}
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full transition-colors"
              >
                <span>{product.categoryIcon}</span>
                <span>{product.categoryNameBn || product.category}</span>
              </Link>

              {/* Unit Tag */}
              <span className="inline-flex items-center bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full border border-emerald-200">
                {formatBnUnit(product.unit)}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {product.nameBn} এর আজকের বাজার দর ও দেশের বিভিন্ন বিভাগীয় বাজারের তুলনামূলক বিবরণ।
            </p>
          </div>

          {/* Today's Price Highlight */}
          <div className="sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border sm:border-0 border-slate-150">
            <span className="text-xs text-slate-400 font-medium">আজকের দাম</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatBnPrice(product.today)}
            </span>
            <div
              className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${changeInfo.colorClass}`}
            >
              {changeInfo.text}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Price - Summary (Cards Grid) */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 tracking-tight">
          দামের পরিসংখ্যান
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Minimum Price */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
              সর্বনিম্ন দাম
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {formatBnPrice(minPrice)}
              </span>
              <span className="text-xs text-slate-400">/{product.unit === "kg" ? "কেজি" : product.unit}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">সকল বাজারের মধ্যে সর্বনিম্ন রেট</p>
          </div>

          {/* Maximum Price */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
              সর্বোচ্চ দাম
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                {formatBnPrice(maxPrice)}
              </span>
              <span className="text-xs text-slate-400">/{product.unit === "kg" ? "কেজি" : product.unit}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">সকল বাজারের মধ্যে সর্বোচ্চ রেট</p>
          </div>

          {/* Average Price */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
              গড় দাম
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                {formatBnPrice(avgPrice)}
              </span>
              <span className="text-xs text-slate-400">/{product.unit === "kg" ? "কেজি" : product.unit}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">বাজারসমূহের সার্বিক গড় মূল্য</p>
          </div>
        </div>
      </div>

      {/* 3. Historical Trends (Yesterday, Last Week, Last Month) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
          পূর্ববর্তী মূল্যের সাথে তুলনা
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center divide-x divide-slate-100">
          <div className="px-2">
            <span className="text-xs text-slate-400 block mb-1">গতকাল</span>
            <span className="text-base sm:text-lg font-bold text-slate-800">
              {formatBnPrice(product.yesterday)}
            </span>
          </div>
          <div className="px-2">
            <span className="text-xs text-slate-400 block mb-1">গত সপ্তাহ</span>
            <span className="text-base sm:text-lg font-bold text-slate-800">
              {formatBnPrice(product.lastWeek)}
            </span>
          </div>
          <div className="px-2">
            <span className="text-xs text-slate-400 block mb-1">গত মাস</span>
            <span className="text-base sm:text-lg font-bold text-slate-800">
              {formatBnPrice(product.lastMonth)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. বাজারভিত্তিক আজকের দাম (Market-wise Today's Prices) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              বাজারভিত্তিক আজকের দাম
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              বিভিন্ন বিভাগের প্রধান প্রধান কাঁচাবাজারের আজকের খুচরা ও পাইকারি দর
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
            <Store className="w-3.5 h-3.5" />
            <span>মোট {toBnDigits(product.markets?.length || 0)}টি বাজার</span>
          </div>
        </div>

        {/* Responsive Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th scope="col" className="py-3 px-4 rounded-l-xl">বাজারের নাম</th>
                <th scope="col" className="py-3 px-4">বিভাগ</th>
                <th scope="col" className="py-3 px-4 text-emerald-700">সর্বনিম্ন দাম</th>
                <th scope="col" className="py-3 px-4 text-rose-700">সর্বোচ্চ দাম</th>
                <th scope="col" className="py-3 px-4 rounded-r-xl text-right">গড় দাম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {product.markets?.map((m, idx) => {
                const marketAvg = Math.round((m.min + m.max) / 2);
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      {m.market}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {m.division}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">
                      {formatBnPrice(m.min)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-rose-600">
                      {formatBnPrice(m.max)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 text-right">
                      {formatBnPrice(marketAvg)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
