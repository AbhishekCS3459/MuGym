"use client";
// import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Music,
  Users,
  Zap,
  Play,
  Pause,
  // Spotify,
  SkipForward,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddTrack from "./AddTrack";
import MusicChart from "./MusicChart";
import FeatureCard from "./FeatureCard";
import StepCard from "./StepCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const session = useSession();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-gray-900 animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#e11d48,45%,#f43f5e,55%,#e11d48)] bg-[length:200%_100%]">
            Let Your Fans Choose Your Stream Soundtrack
          </h2>
          <p className="text-xl mb-8 text-gray-700">
            Engage your audience like never before with fan-picked music
          </p>
          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => {
              if (session.data?.user) {
                router.push("/dashboard");
              }
            }}
          >
            Get Started
          </Button>
        </section>

        <section className="mb-16">
          <MusicChart />
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Music className="w-12 h-12 mb-4 text-red-500" />}
            title="Diverse Music Selection"
            description="Allow fans to choose from YouTube or Spotify, expanding your musical horizons"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 mb-4 text-red-500" />}
            title="Boost Engagement"
            description="Increase viewer interaction and keep your audience coming back for more"
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12 mb-4 text-red-500" />}
            title="Easy Integration"
            description="Seamlessly integrate with your existing streaming setup in minutes"
          />
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title="Sign Up"
              description="Create your MusicChoice account"
            />
            <StepCard
              number={2}
              title="Share"
              description="Give your audience the unique link to submit songs"
            />
            <StepCard
              number={3}
              title="Stream"
              description="Play the fan-selected music on your stream"
            />
          </div>
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            Ready to Revolutionize Your Streams?
          </h3>
          <p className="text-xl mb-8 text-gray-700">
            Join thousands of creators who are boosting engagement with
            MusicChoice
          </p>
          {session.data?.user ? (
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white hover:animate-out"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => router.push("/api/auth/signin")}
            >
              Sign Up Now
            </Button>
          )}
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 MuGym. All rights reserved.</p>
      </footer>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}