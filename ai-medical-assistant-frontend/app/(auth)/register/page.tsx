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

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { confirmPassword: _confirmPassword, ...payload } = values;
    await registerUser(payload);
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
              <h1 className="text-4xl font-semibold leading-tight">Your health, organized and understood.</h1>
              <p className="max-w-md text-sm text-teal-50/90">
                Keep reports, symptom notes, appointments, and care plans in one secure place designed for clarity and confidence.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-3 text-sm text-teal-50/90">
              <ShieldCheck className="h-4 w-4 text-teal-100" />
              Patient-first, privacy-conscious healthcare support.
            </div>
          </section>

          <section className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">Create account</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Register</h2>
              </div>
            </div>

            <Card className="border-0 shadow-none">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-2xl">Start managing your health</CardTitle>
                <CardDescription>Set up your secure AI healthcare profile in minutes.</CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" {...register("firstName")} />
                      {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" {...register("lastName")} />
                      {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        {...register("confirmPassword")}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link href="/login" className="font-medium text-teal-700 hover:text-teal-800">
                      Already have an account?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
                    {isSubmitting || isLoading ? "Creating account..." : "Create account"}
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
