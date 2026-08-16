"use client";

import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="border-slate-200 bg-slate-50 pl-9 text-sm"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="ml-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
          AD
        </div>
      </div>
    </header>
  );
}
