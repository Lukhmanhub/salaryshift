"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CountryFlag({
  code,
  emoji,
  className,
}: {
  code: string;
  emoji: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={className}>{emoji}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${code.toLowerCase()}.svg`}
      alt=""
      className={cn("rounded-[4px] object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
