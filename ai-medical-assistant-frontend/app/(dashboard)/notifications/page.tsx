"use client";

import { Bell, Check, CheckCheck, Clock, Inbox, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/useNotifications";

function formatNotificationDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const { listQuery, markAsReadMutation, markAllAsReadMutation } =
    useNotifications();

  if (listQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-9 w-64" />
          <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (listQuery.isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <p className="font-medium text-red-700">
            Failed to load notifications.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Please refresh the page and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const notifications = listQuery.data?.data ?? [];
  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  );

  const unreadCount = unreadNotifications.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-700">
            Updates
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Notifications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Stay informed about your appointments, reminders, and health
            activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            {markAllAsReadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="mr-2 h-4 w-4" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      {/* Summary */}
      {notifications.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-500">Total notifications</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {notifications.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Inbox className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-slate-500">Unread notifications</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {unreadCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {notifications.length === 0 ? (
        <Card className="border-dashed border-slate-300">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Bell className="h-6 w-6 text-slate-400" />
            </div>

            <p className="mt-4 font-medium text-slate-900">
              You&apos;re all caught up
            </p>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              You don&apos;t have any notifications right now. New updates about
              your healthcare activity will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Recent notifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {unreadCount > 0
                ? `You have ${unreadCount} unread ${
                    unreadCount === 1 ? "notification" : "notifications"
                  }.`
                : "All notifications have been read."}
            </p>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => {
              const isUnread = !notification.isRead;

              return (
                <Card
                  key={notification.id}
                  className={
                    isUnread
                      ? "border-teal-200 bg-teal-50/50"
                      : "border-slate-200"
                  }
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isUnread
                            ? "bg-teal-700 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Bell className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                className={`font-semibold ${
                                  isUnread ? "text-slate-900" : "text-slate-700"
                                }`}
                              >
                                {notification.title}
                              </h3>

                              {isUnread && (
                                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                                  New
                                </span>
                              )}
                            </div>

                            <p
                              className={`mt-2 text-sm leading-6 ${
                                isUnread ? "text-slate-700" : "text-slate-600"
                              }`}
                            >
                              {notification.message}
                            </p>
                          </div>

                          {isUnread && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                markAsReadMutation.mutate(notification.id)
                              }
                              disabled={markAsReadMutation.isPending}
                              className="shrink-0"
                            >
                              {markAsReadMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 h-4 w-4" />
                              )}
                              Mark as read
                            </Button>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {formatNotificationDate(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
