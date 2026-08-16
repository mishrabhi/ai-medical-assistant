"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, HeartPulse, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login(values);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="grid md:grid-cols-2">
          <section className="hidden bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 p-10 text-white md:flex md:flex-col md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">AI Medical Assistant</span>
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight">Healthcare information, simplified.</h1>
              <p className="max-w-md text-sm text-teal-50/90">
                Access your reports, check symptoms, and stay proactive with intelligent health support tailored to your needs.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-3 text-sm text-teal-50/90">
              <ShieldCheck className="h-4 w-4 text-teal-100" />
              Secure patient-first healthcare management.
            </div>
          </section>

          <section className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">Welcome back</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Login</h2>
              </div>
            </div>

            <Card className="border-0 shadow-none">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-2xl">Access your health dashboard</CardTitle>
                <CardDescription>Sign in to manage reports, appointments, and AI insights.</CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password")}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link href="/register" className="font-medium text-teal-700 hover:text-teal-800">
                      Create an account
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
                    {isSubmitting || isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
