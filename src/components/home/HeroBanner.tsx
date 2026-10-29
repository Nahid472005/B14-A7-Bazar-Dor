"use client";

import Image from "next/image";
import { formatBnDate } from "@/lib/bengali";
import { ArrowDown } from "lucide-react";

export default function HeroBanner() {
  const todayDate = formatBnDate(new Date());

  const scrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("সব-পণ্য");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F2F7F2] rounded-3xl border border-emerald-100/90 p-6 sm:p-10 lg:p-12 mb-10 shadow-sm">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Eyebrow badge */}
          <div className="inline-block bg-[#DDEEE1] text-emerald-800 text-xs sm:text-sm font-semibold px-3.5 py-1 rounded-full mb-4">
            {todayDate}
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3 tracking-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mb-6">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মশলার দাম — আন্তর্জাতিক হিসাবের সাথে স্থানীয় পাইকারি ও খুচরা বাজারের দামের তারতম্য।
          </p>

          {/* CTA Button */}
          <div className="flex items-center justify-center lg:justify-start">
            <a
              href="#সব-পণ্য"
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <span>সব পণ্য দেখুন</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] flex items-center justify-center flex-shrink-0">
          <div className="relative w-full aspect-square max-h-[260px] sm:max-h-[300px]">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
