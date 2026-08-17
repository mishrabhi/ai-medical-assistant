"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BellRing,
  CalendarDays,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  User,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reports", label: "Medical Reports", icon: FileText },
  { href: "/symptoms", label: "Symptoms", icon: Activity },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/reminders", label: "Reminders", icon: BellRing },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

const secondaryItems = [
  {
    href: "/emergency-contacts",
    label: "Emergency Contacts",
    icon: ShieldAlert,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

const adminItems = [
  {
    href: "/admin",
    label: "Admin Dashboard",
    icon: ShieldCheck,
  },
  {
    href: "/admin/doctors",
    label: "Manage Doctors",
    icon: Stethoscope,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-slate-50/80 px-3 py-4">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
          <HeartPulse className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            AI Medical
          </p>

          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Assistant
          </p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="my-4 border-t border-slate-200" />

      {/* Admin navigation */}
      {user?.role === "ADMIN" && (
        <>
          <div className="px-3 pb-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Administration
            </p>
          </div>

          <nav className="space-y-1">
            {adminItems.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-white hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="my-4 border-t border-slate-200" />
        </>
      )}

      {/* Secondary navigation */}
      <nav className="space-y-1">
        {secondaryItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-white hover:text-slate-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-600 hover:text-slate-900"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}