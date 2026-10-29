"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut, updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { LogOut, ArrowRight, UserCircle, Edit3, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("প্রোফাইল দেখতে অনুগ্রহ করে সাইন ইন করুন");
      router.push("/signin?redirect=/profile");
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট হতে সমস্যা হয়েছে");
    }
  };

  const handleInlineUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("অনুগ্রহ করে একটি নাম লিখুন");
      return;
    }

    setUpdating(true);
    try {
      await updateUser({
        name: name.trim(),
      });
      toast.success("নাম সফলভাবে আপডেট করা হয়েছে!");
      router.refresh();
    } catch {
      toast.error("তথ্য আপডেট করা সম্ভব হয়নি");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse py-8">
        <div className="h-8 w-40 bg-slate-200 rounded" />
        <div className="h-28 bg-white rounded-3xl border border-slate-200" />
        <div className="h-44 bg-white rounded-3xl border border-slate-200" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-8 space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      {/* Top Card: User Info & Sign Out */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-2xl overflow-hidden shadow-inner flex-shrink-0">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-emerald-700" />
            )}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {session.user.name || "ব্যবহারকারী"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {session.user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>সাইন আউট</span>
        </button>
      </div>

      {/* Bottom Card: Information & Update form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            তথ্য
          </h3>
          {/* Challenge C3 dedicated route button */}
          <Link
            href="/profile/update"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            <span>আলাদা পেজে তথ্য আপডেট</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <form onSubmit={handleInlineUpdate} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center text-sm"
          >
            {updating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "আপডেট"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
