"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "./ui/button";

export default function SignOutButton() {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="hover:cursor-pointer"
      onClick={() => signOut({ callbackUrl: "/signin" })}
    >
      <LogOut />
      Sign out
    </Button>
  );
}
