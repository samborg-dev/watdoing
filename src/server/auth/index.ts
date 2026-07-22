import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

// Cache `auth()` for the duration of a request (React Server Components).
const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
