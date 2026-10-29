import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 text-center shadow-sm">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-4xl shadow-inner">
          🛒
        </div>

        <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          ৪০৪ — পৃষ্ঠাটি পাওয়া যায়নি
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          দুঃখিত, কোনো তথ্য মেলেনি!
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
          আপনি যে পেজ বা পণ্যটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ঠিকানাটি সঠিক নয়। অনুগ্রহ করে হোম পেজে ফিরে পুনরায় চেষ্টা করুন।
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>
      </div>
    </div>
  );
}
