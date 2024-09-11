import prismaClient from "@/app/lib/db";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";



// Wrap NextAuth in a function to handle HTTP methods
const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "SECRET",
  callbacks: {
    async signIn(params) {
      if (params.user.email === null) {
        return false;
      }
      try {
        const existingUser = await prismaClient.user.findUnique({
          where: {
            email: params.user.email || "",
          },
        });
        if (existingUser) {
          console.log("User already exists------");
          return true;
        }
       const createdUser= await prismaClient.user.create({
          data: {
            email: params.user.email || "",
            provider: "GOOGLE",
          },
        });
        // set the creator id as recoil atom so to access it every where
        console.log("User created------");

        return true;
      } catch (error) {
        console.log("error", error);
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
