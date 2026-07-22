"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";

import { Button } from "../_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Input } from "../_components/ui/input";
import { Label } from "../_components/ui/label";
import { Separator } from "../_components/ui/separator";
import { api } from "~/trpc/react";

type Mode = "signin" | "signup";

// Pull a readable message out of a tRPC/Zod error instead of dumping the raw object.
function friendlyError(err: unknown): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (
      err as {
        data?: { zodError?: { fieldErrors?: Record<string, string[] | undefined> } };
      }
    ).data;
    const fieldError = data?.zodError?.fieldErrors
      ? Object.values(data.zodError.fieldErrors).flat().find(Boolean)
      : undefined;
    if (fieldError) return fieldError;
  }
  if (err instanceof Error) {
    const msg = err.message.trim();
    // Skip stringified JSON (raw Zod issue arrays) — not user-friendly.
    if (msg && !msg.startsWith("[") && !msg.startsWith("{")) return msg;
  }
  return "Something went wrong. Try again.";
}

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [providers, setProviders] =
    useState<Awaited<ReturnType<typeof getProviders>>>(null);

  const register = api.user.register.useMutation();

  // Only offer OAuth buttons for providers that are actually configured.
  useEffect(() => {
    getProviders()
      .then(setProviders)
      .catch(() => setProviders(null));
  }, []);

  const showGoogle = !!providers?.google;
  const showGithub = !!providers?.github;
  const showOAuth = showGoogle || showGithub;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "signup" && password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      // Sign-up: create the account first, then sign in with the same creds.
      if (mode === "signup") {
        await register.mutateAsync({
          name: name || undefined,
          email,
          password,
        });
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Wrong email or password.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <Card className="w-full max-w-sm [--card-spacing:--spacing(6)]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Sign in to see your notes."
              : "Sign up to start tracking what you're doing."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {showOAuth ? (
            <>
              <div className="flex flex-col gap-2">
                {showGoogle ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:cursor-pointer"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                  >
                    Continue with Google
                  </Button>
                ) : null}
                {showGithub ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:cursor-pointer"
                    onClick={() => signIn("github", { callbackUrl: "/" })}
                  >
                    Continue with GitHub
                  </Button>
                ) : null}
              </div>

              <div className="relative flex items-center justify-center">
                <Separator />
                <span className="absolute bg-card px-2 text-xs text-muted-foreground">
                  or
                </span>
              </div>
            </>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "signup" ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Optional"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === "signup" ? (
                <p className="text-xs text-muted-foreground">
                  At least 8 characters.
                </p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button
              type="submit"
              disabled={pending}
              className="mt-1 w-full hover:cursor-pointer"
            >
              {pending
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in"
                  : "Sign up"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-foreground hover:cursor-pointer hover:underline"
              onClick={() => {
                setError(null);
                setMode(mode === "signin" ? "signup" : "signin");
              }}
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
