"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded bg-gradient-to-tr from-purple-600 to-blue-500 animate-pulse" />
          <h1 className="text-lg font-bold tracking-tight text-white">
            ResumeForge<span className="text-purple-500">.</span>
          </h1>
        </div>

        {/* Dynamic Auth Section */}
        <nav className="flex items-center gap-4">
          {status === "loading" ? (
            <span className="text-xs text-zinc-500 animate-pulse">Checking status...</span>
          ) : session ? (
            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <div className="relative h-7 w-7 rounded-full overflow-hidden border border-zinc-800">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User profile image"}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="h-7 w-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-300">
                  {session.user?.name?.charAt(0) || "U"}
                </span>
              )}
              <span className="hidden sm:inline text-xs font-medium text-zinc-300 truncate max-w-[120px]">
                {session.user?.name || "Member"}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-1.5 text-xs font-semibold text-zinc-300 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-full bg-white hover:bg-zinc-100 px-5 py-1.5 text-xs font-semibold text-black transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Sign In with Google
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}