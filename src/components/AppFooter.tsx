import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-[1320px] px-6 py-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-fg-muted">
        <p>
          Estimates are illustrative and not financial, tax or immigration
          advice.{" "}
          <Link href="/methodology" className="text-primary-600 hover:underline">
            View methodology
          </Link>
        </p>
        <p>&copy; {new Date().getFullYear()} SalaryShift</p>
      </div>
    </footer>
  );
}
