"use client";
import Appbar from "./components/Appbar";
import LandingPage from "./components/LandingPage";
import Redirect from "./components/Redirect";

export default function Home() {
  return (
    <main>
      <Appbar />
      <Redirect />
      <LandingPage />
    </main>
  );
}
