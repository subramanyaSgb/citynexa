"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TestimonialSearchProps {
  defaultValue: string;
}

export function TestimonialSearch({ defaultValue }: TestimonialSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (term.trim()) {
        params.set("search", term.trim());
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search testimonials..."
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className={`pl-9 ${isPending ? "opacity-70" : ""}`}
      />
    </div>
  );
}
