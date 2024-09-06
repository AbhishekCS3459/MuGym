"use client";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <SessionProvider>{children}</SessionProvider>;
    </RecoilRoot>
  );
}
