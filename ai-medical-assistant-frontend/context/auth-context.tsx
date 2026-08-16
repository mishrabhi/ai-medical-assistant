"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import type { AuthContextValue, LoginPayload, RegisterPayload } from "@/types/auth";
import type { User } from "@/types/user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistToken(token: string | null) {
  if (typeof window === "undefined") return;

  if (token) {
    window.sessionStorage.setItem("accessToken", token);
    return;
  }

  window.sessionStorage.removeItem("accessToken");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = Boolean(user);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      setUser(response.data as User);
    } catch {
      setUser(null);
      persistToken(null);
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);
      persistToken(response.data.accessToken);
      setUser(response.data.user);
      router.push("/dashboard");
    },
    [router],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authApi.register(payload);
      persistToken(response.data.accessToken);
      setUser(response.data.user);
      router.push("/dashboard");
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // no-op: backend cookie may already be expired
    } finally {
      persistToken(null);
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = typeof window !== "undefined" ? window.sessionStorage.getItem("accessToken") : null;

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        setUser(null);
        persistToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [isAuthenticated, isLoading, login, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
