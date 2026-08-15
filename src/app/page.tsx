import { AppHeader } from "@/components/AppHeader";
import { SalaryCompareApp } from "@/components/SalaryCompareApp";
import { countries } from "@/lib/data/countries";

export default async function Home(props: PageProps<"/">) {
  const sp = await props.searchParams;
  const fromCode = typeof sp.from === "string" ? sp.from.toUpperCase() : undefined;
  const toCode = typeof sp.to === "string" ? sp.to.toUpperCase() : undefined;
  const initialFromCode = countries.some((c) => c.code === fromCode)
    ? fromCode
    : undefined;
  const initialToCode = countries.some((c) => c.code === toCode)
    ? toCode
    : undefined;

  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <SalaryCompareApp
          initialFromCode={initialFromCode}
          initialToCode={initialToCode}
        />
      </main>
    </>
  );
}
