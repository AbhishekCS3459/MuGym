"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { use, useEffect } from "react";
export default function Appbar() {
  const session = useSession();

  return (
    <header className="container mx-auto px-4 py-1">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">MuGym 💪</h1>
        {session.data?.user ? (
          <div className="flex items-center space-x-5">
            <Avatar>
              <AvatarImage
                src={
                  session.data?.user?.image || "https://github.com/shadcn.png"
                }
                width={60}
                height={60}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <button
              className="m-2 p-2 outline-double stroke-white font-extrabold rounded-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => {
                signOut();
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="m-2 p-2 outline-double stroke-white rounded-lg font-extrabold border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => {
              signIn();
            }}
          >
            Sign In{" "}
          </button>
        )}
      </nav>
    </header>
  );
}
