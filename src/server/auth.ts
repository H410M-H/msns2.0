import { PrismaAdapter } from "@auth/prisma-adapter";
import getServerSession, { type NextAuthConfig } from "next-auth"
import {
  type DefaultSession,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { db } from "~/server/db";


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthConfig = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [

  ],
};


export const getServerAuthSession = () => getServerSession(authOptions);
