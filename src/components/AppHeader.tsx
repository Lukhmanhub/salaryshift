"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerHomeReset } from "@/lib/homeReset";

const NAV = [
  { href: "/", label: "Compare Salary" },
  { href: "/offer", label: "Evaluate Offer" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-primary-600">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6">
        <Link
          href="/"
          onClick={() => {
            if (pathname === "/") triggerHomeReset();
          }}
          className="flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="SalaryShift" className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/15 text-white"
                      : "text-primary-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/methodology"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary-100 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CircleHelp size={16} />
            How it works
          </Link>
        </div>
      </div>
    </header>
  );
}
