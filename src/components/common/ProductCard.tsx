"use client";

import Link from "next/link";
import { Product } from "@/types";
import { formatBnPrice, formatBnUnit, formatBnChange } from "@/lib/bengali";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const changeInfo = formatBnChange(product.change.dir, product.change.pct);
  const formattedPrice = formatBnPrice(product.today);
  const formattedUnit = formatBnUnit(product.unit);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        {/* Emoji Circle */}
        <div className="w-12 h-12 rounded-full bg-slate-100/90 group-hover:bg-emerald-50 flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
          <span>{product.image || product.categoryIcon || "🛒"}</span>
        </div>

        {/* Name and Unit */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 text-base leading-snug truncate group-hover:text-emerald-700 transition-colors">
            {product.nameBn}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{formattedUnit}</p>
        </div>
      </div>

      {/* Price and Change Badge */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
        <div>
          <span className="block text-xs text-slate-400 font-normal">
            আজকের দাম
          </span>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            {formattedPrice}
          </span>
        </div>

        <div
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${changeInfo.colorClass}`}
        >
          {changeInfo.text}
        </div>
      </div>
    </Link>
  );
}
