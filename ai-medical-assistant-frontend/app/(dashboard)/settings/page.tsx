"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Bot,
  CheckCircle2,
  Info,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingsState {
  appointmentNotifications: boolean;
  reminderNotifications: boolean;
  healthNotifications: boolean;
  aiAssistantEnabled: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  appointmentNotifications: true,
  reminderNotifications: true,
  healthNotifications: true,
  aiAssistantEnabled: true,
};

const SETTINGS_STORAGE_KEY = "ai-medical-assistant-settings";

function getInitialSettings(): SettingsState {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored) as Partial<SettingsState>;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsState>(getInitialSettings);

  const [saved, setSaved] = useState(false);

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    try {
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings),
      );

      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
          Preferences
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Manage your notification and AI assistant preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal-700" />
            Notifications
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <SettingToggle
            title="Appointment notifications"
            description="Receive updates and reminders about upcoming appointments."
            checked={settings.appointmentNotifications}
            onChange={(value) =>
              updateSetting("appointmentNotifications", value)
            }
          />

          <SettingToggle
            title="Reminder notifications"
            description="Receive notifications for your health reminders."
            checked={settings.reminderNotifications}
            onChange={(value) =>
              updateSetting("reminderNotifications", value)
            }
          />

          <SettingToggle
            title="Health updates"
            description="Receive general updates related to your healthcare activity."
            checked={settings.healthNotifications}
            onChange={(value) =>
              updateSetting("healthNotifications", value)
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-teal-700" />
            AI Assistant
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SettingToggle
            title="Enable AI health assistance"
            description="Allow the AI assistant to provide general health information and guidance."
            checked={settings.aiAssistantEnabled}
            onChange={(value) =>
              updateSetting("aiAssistantEnabled", value)
            }
          />

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />

            <p>
              AI assistance provides general health information and does not
              replace a qualified healthcare professional or emergency medical
              care.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-700" />
            Security
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                <Lock className="h-4 w-4" />
              </div>

              <div>
                <p className="font-medium text-slate-900">
                  Account security
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Change your password or manage your account from your
                  profile.
                </p>
              </div>
            </div>

            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/profile">Manage profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <div className="min-h-5">
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Settings saved.
            </div>
          )}
        </div>

        <Button onClick={handleSave} className="rounded-xl">
          Save settings
        </Button>
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <p className="font-medium text-slate-900">{title}</p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-teal-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}