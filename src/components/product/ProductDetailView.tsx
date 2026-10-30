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
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse py-4">
        <div className="h-4 w-48 bg-slate-200 rounded" />
        <div className="h-36 bg-white rounded-3xl border border-slate-200 p-6" />
        <div className="h-28 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-3xl border border-slate-200" />
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

  // Price difference compared to yesterday
  const priceDiff = product.today - (product.yesterday || product.today);
  const unitLabel = product.unit === "kg" ? "কেজি" : product.unit === "liter" ? "লিটার" : product.unit;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb Navigation (Figma Match) */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          হোম
        </Link>
        <span>›</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-emerald-700 transition-colors"
        >
          {product.categoryNameBn || product.category}
        </Link>
        <span>›</span>
        <span className="text-slate-800 font-semibold">{product.nameBn}</span>
      </div>

      {/* 1. Top — Product Header Card (Figma Match) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Emoji container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-inner">
              <span>{product.image || product.categoryIcon || "🛒"}</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {product.nameBn}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {formatBnUnit(product.unit)} • {product.categoryNameBn || product.category}
              </p>
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                {priceDiff > 0 ? (
                  <>
                    <span>গতকালের তুলনায় আজ দাম বেড়েছে</span>
                    <span>•</span>
                    <span className="font-semibold text-rose-600">{toBnDigits(priceDiff)} টাকা</span>
                  </>
                ) : priceDiff < 0 ? (
                  <>
                    <span>গতকালের তুলনায় আজ দাম কমেছে</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">{toBnDigits(Math.abs(priceDiff))} টাকা</span>
                  </>
                ) : (
                  <span>গতকালের তুলনায় আজ দাম অপরিবর্তিত</span>
                )}
              </p>
            </div>
          </div>

          {/* Today's Price Box on Right */}
          <div className="w-full sm:w-44 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 text-center flex-shrink-0">
            <span className="text-xs text-slate-500 font-medium block">
              আজকের দাম
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 my-1 tracking-tight">
              {toBnDigits(product.today)}
            </div>
            <span className="text-xs text-slate-500 block mb-2">
              টাকা / {unitLabel}
            </span>
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${changeInfo.colorClass}`}
            >
              {changeInfo.text}
            </div>
          </div>
        </div>
      </div>

      {/* 2. দামের সারসংক্ষেপ (Figma Match) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 tracking-tight">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Minimum Price */}
          <div className="bg-slate-50/60 rounded-2xl border border-slate-200/60 p-4">
            <span className="text-xs text-slate-500 block mb-1">
              সর্বনিম্ন দাম
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
              {toBnDigits(minPrice)} টাকা
            </div>
            <p className="text-[11px] text-slate-400 mt-1">সবচেয়ে কম দামের বাজার</p>
          </div>

          {/* Maximum Price */}
          <div className="bg-slate-50/60 rounded-2xl border border-slate-200/60 p-4">
            <span className="text-xs text-slate-500 block mb-1">
              সর্বাধিক দাম
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600">
              {toBnDigits(maxPrice)} টাকা
            </div>
            <p className="text-[11px] text-slate-400 mt-1">সবচেয়ে বেশি দামের বাজার</p>
          </div>

          {/* Average Price */}
          <div className="bg-slate-50/60 rounded-2xl border border-slate-200/60 p-4">
            <span className="text-xs text-slate-500 block mb-1">
              গড় দাম
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
              {toBnDigits(avgPrice)} টাকা
            </div>
            <p className="text-[11px] text-slate-400 mt-1">প্রতি {unitLabel}-এর হিসাবে</p>
          </div>
        </div>
      </div>

      {/* 3. বাজারভিত্তিক আজকের দাম (Figma Match) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 tracking-tight">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th scope="col" className="py-3 px-4">বাজার</th>
                <th scope="col" className="py-3 px-4">বিভাগ</th>
                <th scope="col" className="py-3 px-4">সর্বনিম্ন</th>
                <th scope="col" className="py-3 px-4">সর্বাধিক</th>
                <th scope="col" className="py-3 px-4 text-right">গড়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {product.markets?.map((m, idx) => {
                const marketAvg = ((m.min + m.max) / 2).toFixed(1);
                const displayAvg = marketAvg.endsWith(".0")
                  ? toBnDigits(Math.round(parseFloat(marketAvg)))
                  : toBnDigits(marketAvg);

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {m.market}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {m.division}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {toBnDigits(m.min)} টাকা
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {toBnDigits(m.max)} টাকা
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-right">
                      {displayAvg} টাকা
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
