import { Product } from "@/types";
import ProductCard from "@/components/common/ProductCard";
import { toBnDigits } from "@/lib/bengali";

interface PriceSectionsProps {
  products: Product[];
}

export default function PriceSections({ products }: PriceSectionsProps) {
  // Section A: Top 6 Risers (dir === 'up')
  const risers = [...products]
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // Section B: Top 6 Fallers (dir === 'down')
  const fallers = [...products]
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => Math.abs(b.change?.pct || 0) - Math.abs(a.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Section A: আজ দাম বেড়েছে */}
      {risers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-rose-600 text-sm font-black">▲</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              আজ দাম বেড়েছে
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {risers.map((product) => (
              <ProductCard key={`riser-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Section B: আজ দাম কমেছে */}
      {fallers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-emerald-600 text-sm font-black">▼</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              আজ দাম কমেছে
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {fallers.map((product) => (
              <ProductCard key={`faller-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Section C: সব পণ্য */}
      <section id="সব-পণ্য" className="scroll-mt-24 pt-2">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            মোট {toBnDigits(products.length)}টি পণ্যের আজকের তালিকা
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={`all-${product.id}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
