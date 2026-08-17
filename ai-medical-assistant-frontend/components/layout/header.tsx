"use client";

import { Bell, CheckCheck, Clock, Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/hooks/useNotifications";

interface SearchItem {
  label: string;
  description: string;
  href: string;
  keywords: string[];
}

const searchItems: SearchItem[] = [
  {
    label: "Dashboard",
    description: "View your health dashboard",
    href: "/dashboard",
    keywords: ["dashboard", "home", "overview"],
  },
  {
    label: "Medical Reports",
    description: "View and manage your medical reports",
    href: "/reports",
    keywords: ["report", "reports", "medical", "document"],
  },
  {
    label: "Symptoms",
    description: "Check and track your symptoms",
    href: "/symptoms",
    keywords: ["symptom", "symptoms", "health", "check"],
  },
  {
    label: "AI Assistant",
    description: "Ask the AI health assistant",
    href: "/assistant",
    keywords: ["ai", "assistant", "chat", "health", "question"],
  },
  {
    label: "Doctors",
    description: "Find and view doctors",
    href: "/doctors",
    keywords: ["doctor", "doctors", "physician", "specialist"],
  },
  {
    label: "Appointments",
    description: "Manage your doctor appointments",
    href: "/appointments",
    keywords: ["appointment", "appointments", "booking", "doctor"],
  },
  {
    label: "Reminders",
    description: "Manage your health reminders",
    href: "/reminders",
    keywords: ["reminder", "reminders", "medication", "schedule"],
  },
  {
    label: "Notifications",
    description: "View your notifications",
    href: "/notifications",
    keywords: ["notification", "notifications", "alerts", "updates"],
  },
  {
    label: "Emergency Contacts",
    description: "Manage your emergency contacts",
    href: "/emergency-contacts",
    keywords: ["emergency", "contact", "contacts", "family"],
  },
  {
    label: "Profile",
    description: "Manage your profile",
    href: "/profile",
    keywords: ["profile", "account", "personal", "user"],
  },
  {
    label: "Settings",
    description: "Manage your application settings",
    href: "/settings",
    keywords: ["settings", "preferences", "configuration"],
  },
];

function formatNotificationDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(firstName?: string | null, lastName?: string | null) {
  const first = firstName?.trim().charAt(0) ?? "";
  const last = lastName?.trim().charAt(0) ?? "";

  const initials = `${first}${last}`.toUpperCase();

  return initials || "U";
}

export function Header() {
  const router = useRouter();
  const { user } = useAuth();

  const { listQuery, markAsReadMutation, markAllAsReadMutation } =
    useNotifications();

  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const notifications = listQuery.data?.data ?? [];

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.isRead),
    [notifications],
  );

  const unreadCount = unreadNotifications.length;

  const recentNotifications = notifications.slice(0, 5);

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return searchItems
      .filter((item) => {
        const searchableText = [item.label, item.description, ...item.keywords]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .slice(0, 6);
  }, [search]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    const firstResult = searchResults[0];

    if (!firstResult) {
      return;
    }

    setSearch("");
    setShowSearchResults(false);
    router.push(firstResult.href);
  };

  const handleNotificationClick = async (
    notificationId: string,
    isRead: boolean,
  ) => {
    if (!isRead) {
      await markAsReadMutation.mutateAsync(notificationId);
    }

    setShowNotifications(false);
    router.push("/notifications");
  };

  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <header className="relative flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      {/* Search */}
      <div ref={searchRef} className="relative flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => {
              if (search.trim()) {
                setShowSearchResults(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
            className="border-slate-200 bg-slate-50 pl-9 pr-9 text-sm"
            placeholder="Search pages..."
            aria-label="Search pages"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setShowSearchResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search results */}
        {showSearchResults && search.trim() && (
          <div className="absolute left-0 top-12 z-50 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {searchResults.length > 0 ? (
              <div className="p-2">
                <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Pages
                </p>

                {searchResults.map((result) => (
                  <Link
                    key={result.href}
                    href={result.href}
                    onClick={() => {
                      setSearch("");
                      setShowSearchResults(false);
                    }}
                    className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <p className="text-sm font-medium text-slate-900">
                      {result.label}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {result.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-5 text-center">
                <Search className="mx-auto h-5 w-5 text-slate-300" />

                <p className="mt-2 text-sm font-medium text-slate-700">
                  No matching page
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try searching for doctors, reports, appointments, reminders,
                  or settings.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="ml-4 flex items-center gap-2">
        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() => {
              setShowNotifications((current) => !current);
            }}
            className="relative"
          >
            <Bell className="h-4 w-4" />

            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold leading-none text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-11 z-50 w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Notifications</p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={markAllAsReadMutation.isPending}
                    className="text-xs font-medium text-teal-700 hover:text-teal-800 disabled:opacity-50"
                  >
                    {markAllAsReadMutation.isPending
                      ? "Marking..."
                      : "Mark all read"}
                  </button>
                )}
              </div>

              {listQuery.isLoading ? (
                <div className="px-4 py-8 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-teal-700" />

                  <p className="mt-2 text-xs text-slate-500">
                    Loading notifications...
                  </p>
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="mx-auto h-6 w-6 text-slate-300" />

                  <p className="mt-2 text-sm font-medium text-slate-700">
                    No notifications
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    New updates will appear here.
                  </p>
                </div>
              ) : (
                <div className="max-h-[360px] overflow-y-auto">
                  {recentNotifications.map((notification) => {
                    const isUnread = !notification.isRead;

                    return (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          void handleNotificationClick(
                            notification.id,
                            notification.isRead,
                          )
                        }
                        className={`w-full border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                          isUnread ? "bg-teal-50/50" : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              isUnread
                                ? "bg-teal-700 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Bell className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`truncate text-sm ${
                                  isUnread
                                    ? "font-semibold text-slate-900"
                                    : "font-medium text-slate-700"
                                }`}
                              >
                                {notification.title}
                              </p>

                              {isUnread && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                              )}
                            </div>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                              {notification.message}
                            </p>

                            <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock className="h-3 w-3" />
                              {formatNotificationDate(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-slate-100 p-2">
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
                >
                  <CheckCheck className="h-4 w-4" />
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          title={user ? `${user.firstName} ${user.lastName}` : "Profile"}
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
