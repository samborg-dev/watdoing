import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import ItemsBoard from "./_components/itemsBoard";
import SignOutButton from "./_components/signOutButton";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <>
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-semibold">watdoing</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
          <SignOutButton />
        </div>
      </header>
      <ItemsBoard />
    </>
  );
}
