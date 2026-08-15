import Link from "next/link";
import { CircleHelp } from "lucide-react";

const NAV = [
  { href: "/", label: "Compare Salary" },
  { href: "/offer", label: "Evaluate Offer" },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-primary-600">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="SalaryShift" className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-primary-100 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
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
