"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import Image from "next/image";
export default function MusicChart({
  isPlaying,
  Songtitle,
  Imagesrc,
  setIsPlaying,
  isButtonRequired,
}: {
  isPlaying: boolean;
  Songtitle: string;
  Imagesrc: string;
  setIsPlaying: (isPlaying: boolean) => void;
  isButtonRequired: boolean;
}) {
  // const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    //@ts-ignore
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => (prevTime + 1) % 100);
      }, 1000);
    }
    //@ts-ignore
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTime(0);
    // Logic for next track would go here
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image
            src={Imagesrc}
            alt="Album cover"
            className="w-16 h-16 rounded-md mr-4"
          />
          <div>
            <h4 className="font-semibold text-lg">{Songtitle}</h4>
            <p className="text-gray-600">MuGym</p>
          </div>
        </div>

        {isButtonRequired && (
          <div className="flex items-center space-x-4">
            <Button
              onClick={togglePlay}
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-100"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button
              onClick={nextTrack}
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-100"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
      <div className="relative h-24 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-around">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-500 rounded-t-sm"
              style={{
                height: `${Math.random() * 100}%`,
                opacity: i === Math.floor(currentTime / 2) ? 1 : 0.3,
                transition: "all 0.1s ease-in-out",
              }}
            ></div>
          ))}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {Math.floor(currentTime / 60)}:
        {(currentTime % 60).toString().padStart(2, "0")} / 3:30
      </div>
    </div>
  );
}
