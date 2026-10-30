"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { formatBnDate, toBnDigits, formatBnChange } from "@/lib/bengali";
import { Product, Category } from "@/types";
import toast from "react-hot-toast";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";

interface NavbarProps {
  categories?: Category[];
  tickerProducts?: Product[];
}

const defaultCategories: Category[] = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🥫" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

export default function Navbar({
  categories = defaultCategories,
  tickerProducts = [],
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [todayDate, setTodayDate] = useState("মঙ্গলবার, ৬ অক্টোবর, ২০২৬");

  useEffect(() => {
    setTodayDate(formatBnDate(new Date()));
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      setUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট হতে সমস্যা হয়েছে");
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Bangla Date */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={30}
                height={30}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                  বাজার দর
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {todayDate}
              </p>
            </div>
          </Link>

          {/* Right Auth Buttons / User Profile */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="h-9 w-24 bg-slate-100 rounded-lg animate-pulse" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm flex-shrink-0">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{session.user.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 hidden sm:inline-block max-w-[120px] truncate">
                    {session.user.name?.split(" ")[0] || "ব্যবহারকারী"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {session.user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/signin"
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 sm:px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  সাইন আপ
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle categories"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop Row 2) */}
        <div className="hidden md:flex items-center justify-start gap-2 py-3 border-t border-slate-100 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id || cat.slug}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            );
          })}
        </div>

        {/* Categories Bar (Mobile Drawer) */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Ticker (Marquee Strip below Navbar) */}
      <div className="bg-slate-50 border-t border-b border-slate-200 py-2 overflow-hidden text-xs text-slate-700">
        <div className="animate-marquee flex items-center space-x-8">
          {(tickerProducts.length > 0 ? tickerProducts : [
            { id: 1, nameBn: "স্বর্ণমাছি চাল", image: "🍚", today: 148, unit: "kg", change: { dir: "up", pct: 2.1 } },
            { id: 2, nameBn: "মিনিকেট চাল", image: "🍚", today: 99, unit: "kg", change: { dir: "down", pct: 2.9 } },
            { id: 4, nameBn: "বাটাম সাইজ চাল", image: "🍚", today: 66, unit: "kg", change: { dir: "up", pct: 3.1 } },
            { id: 5, nameBn: "মসুর ডাল", image: "🫘", today: 542, unit: "kg", change: { dir: "up", pct: 2.9 } },
            { id: 6, nameBn: "ছোলা", image: "🫘", today: 120, unit: "kg", change: { dir: "down", pct: 2.4 } },
            { id: 9, nameBn: "সয়াবিন তেল", image: "🥫", today: 199, unit: "liter", change: { dir: "up", pct: 1.5 } },
            { id: 13, nameBn: "পেঁয়াজ", image: "🧅", today: 74, unit: "kg", change: { dir: "up", pct: 1.0 } },
            { id: 14, nameBn: "কাঁচামরিচ", image: "🌶️", today: 92, unit: "kg", change: { dir: "down", pct: 4.2 } },
          ]).map((item, idx) => {
            const chg = formatBnChange(item.change.dir as any, item.change.pct);
            const unitText = item.unit === "kg" ? "কেজি" : item.unit === "liter" ? "লিটার" : item.unit;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 px-2"
              >
                <span>{item.image || "🛒"}</span>
                <span className="font-semibold text-slate-800">{item.nameBn}</span>
                <span className="text-slate-600">
                  {toBnDigits(item.today)} টাকা/{unitText}
                </span>
                <span className={`font-medium ${chg.textColor}`}>
                  {chg.text}
                </span>
                <span className="text-slate-300 ml-4">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
