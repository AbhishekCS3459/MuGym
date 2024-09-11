"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Play, Pause, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import YouTube from "react-youtube";
import { useSession } from "next-auth/react";
import MusicChart from "./MusicChart";

type Song = {
  id: string;
  title: string;
  thumbnail: string;
  votes: number;
};

const sampleSongs: Song[] = [
  {
    id: "g2v9EqxSlKA",
    title: "𝘼𝙖𝙟 𝙯𝙞𝙙 (𝙨𝙡𝙤𝙬𝙚𝙙 + 𝙧𝙚𝙫𝙚𝙧𝙗)",
    thumbnail:
      "https://i.ytimg.com/vi/g2v9EqxSlKA/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgVihTMA8=&rs=AOn4CLDUB3HjdKWlLrMVIHYTg4TaDdz-nQ",
    votes: 0,
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/0.jpg",
    votes: 0,
  },
  {
    id: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You",
    thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/0.jpg",
    votes: 0,
  },
  {
    id: "RgKAFK5djSk",
    title: "Wiz Khalifa - See You Again ft. Charlie Puth",
    thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/0.jpg",
    votes: 0,
  },
];
type Stream = {
  id: string;
  title: string;
  smallImg: string;
  url: string;
  extractedId: string;
};

export default function DashboardPage() {
  const [videoLink, setVideoLink] = useState("");
  const [queue, setQueue] = useState<Song[]>(sampleSongs);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [history, setHistory] = useState<Song[]>([]);
  const REFRESH_INTERVAL_MS = 5000;
  const session = useSession();
  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {}, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  function refreshStreams() {
    fetch("/api/streams")
      .then((res) => res.json())
      .then((data) => {
        if (data?.streams) {
          const mappedSongs: Song[] = data.streams.map((stream: Stream) => ({
            id: stream.extractedId, // assuming this is the video ID
            title: stream.title,
            thumbnail: stream.smallImg,
            votes: 0, // default vote value
          }));
          // Ensure only unique songs based on extractedId
          const uniqueSongs = getUniqueSongsById([...queue, ...mappedSongs]);
          setQueue(uniqueSongs);
        }
      })
      .catch((error) => console.error("Error fetching streams:", error));
  }
  const getUniqueSongsById = (songs: Song[]) => {
    const seen = new Set();
    return songs.filter((song) => {
      const isDuplicate = seen.has(song.id);
      seen.add(song.id);
      return !isDuplicate;
    });
  };

  const getCreator = async () => {
    try {
      const creatorData = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const creator = await creatorData.json();

      return creator;
    } catch (error) {
      throw new Error("Error fetching creator");
      return null;
    }
  };

  const addToQueue = async () => {
    if (!session.data?.user) return;

    if (videoLink) {
      const videoId = extractVideoId(videoLink);
      if (videoId) {
        const newSong: Song = {
          id: videoId,
          title: `New Song ${queue.length + 1}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
          votes: 0,
        };

        // adding songs to real backend
        try {
          setIsDisabled(true);
          // TODO - CACHE THIS FUNCTION CALL
          const creator = await getCreator();
          if (!creator.user) {
            console.error("Error fetching creator");
            return;
          }

          const creatorId = creator.user.id;

          //TODO: ADD TOAST

          const response = await fetch("/api/streams", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              creatorId,
              url: videoLink,
            }),
          });
          // TODO ADD TOAST
          console.log("Added to queue");

          const result = await response.json();
          // Ensure uniqueness before adding to the queue
          const uniqueSongs = getUniqueSongsById([...queue, newSong]);
          setQueue([...queue, newSong]);
          setVideoLink("");
          setIsDisabled(false);
        } catch (error) {
          console.error("Error adding song to queue:", error);
        }
      }
    }
  };

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const vote = (id: string, amount: number, isUpvote: Boolean) => {
    setQueue((prevQueue) => {
      const updatedQueue = prevQueue
        .map((song) =>
          song.id === id ? { ...song, votes: song.votes + amount } : song
        )
        .sort((a, b) => b.votes - a.votes); // Sort to ensure highest votes come first
      return getUniqueSongsById(updatedQueue); // Ensure uniqueness
    });

    fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({
        streamId: id,
      }),
    });
  };

  const playNext = useCallback(async () => {
    if (queue.length > 0) {
      const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes);

      setCurrentSong(sortedQueue[0]);
      setQueue(sortedQueue.slice(1));
      setHistory((prevHistory) => {
        const newHistory = [sortedQueue[0], ...prevHistory].slice(0, 5);
        return getUniqueSongsById(newHistory);
      });
      setIsPlaying(true);
    } else {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  }, [queue]);

  const addToRecent = async () => {
    // add the current song to recently played in db
  };
  const handleEnd = async () => {
    // try {
    //   // first add the current song to recently played in db
    //   await addToRecent();
    //   alert("Song Added to ended"+currentSong?.id);

    //   // then remove the current song from db
    //   await fetch(`/api/streams/${currentSong?.id}`, {
    //     method: "DELETE",
    //   });
    //   console.log("Song removed from queue");
    // } catch (error) {
    //   console.error("Error removing song from queue:", error);
    // }

    // then play next song
    playNext(); // Play the next song after the current one ends
  };
  useEffect(() => {
    if (!currentSong && queue.length > 0) {
      playNext();
    }
  }, [currentSong, playNext, queue.length]);

  const videoOptions = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      mute: 0,
      Playsinline: 1,
    },
  };

  return (
    <div className="min-h-screen p-4 space-y-6 bg-black">
      <h1 className="text-3xl font-bold text-center text-black mb-8">
        Song Voting Queue
      </h1>

      <Card className="bg-white shadow-lg hover:shadow-yellow-200  backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-black">Add your Song</h2>

          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter YouTube video link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="flex-grow"
            />
            <Button
              onClick={addToQueue}
              disabled={isDisabled}
              className="bg-black hover:bg-gray-500"
            >
              Add to Queue
            </Button>
          </div>
          {videoLink && extractVideoId(videoLink) && (
            <img
              src={`https://img.youtube.com/vi/${extractVideoId(
                videoLink
              )}/0.jpg`}
              alt="Video thumbnail"
              className="w-32 h-24 object-cover rounded-md shadow-md"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 width-[80%] ">
        <Card className="bg-white shadow-lg hover:shadow-yellow-200 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-black mb-4">Queue</h2>
            <AnimatePresence>
              {queue.map((song) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-4 overflow-hidden bg-gradient-to-r from-grey-200 to-grey-400 hover:from-gray-300 hover:to-red-600 transition-all duration-300">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-20 h-20 object-cover rounded-md shadow-md"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-black">
                          {song.title}
                        </h3>
                        <p className="text-sm text-black">
                          Votes: {song.votes}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => vote(song.id, 1, true)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <ThumbsUp size={18} />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => vote(song.id, -1, false)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <ThumbsDown size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-yellow-200  backdrop-blur-sm overflow-hidden  ">
          <CardContent className="py-3">
          <h2 className="text-2xl font-semibold text-black mb-4">
              Now Playing
            </h2>
            {currentSong ? (
              <div className="space-y-4">
                <div
                className="relative w-full h-96 "
                >
                  <YouTube
                    videoId={currentSong.id}
                    opts={videoOptions}
                    onEnd={handleEnd}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    className="absolute w-full h-full "
                    //write the style to make the video responsive
                  />
                </div>
                <h3 className="text-xl font-semibold text-black">
                  {currentSong.title}
                </h3>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-black hover:bg-red-500"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </Button>
                  <Button
                    onClick={playNext}
                    className="bg-black hover:bg-red-500"
                  >
                    <SkipForward size={24} />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-black">
                No song currently playing
              </p>
            )}
          </CardContent>
          <CardContent className="p-6 w-full">
            <MusicChart
              isPlaying={isPlaying}
              Songtitle={currentSong?.title || "Intro"}
              Imagesrc={
                currentSong?.thumbnail || "https://github.com/shadcn.png"
              }
              setIsPlaying={setIsPlaying}
              isButtonRequired={false}
            />
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-black mb-4">
              Recently Played
            </h2>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {history.map((song) => (
                <div key={song.id} className="flex-shrink-0 w-32">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-32 h-24 object-cover rounded-md shadow-md mb-2"
                  />
                  <p className="text-xs text-black truncate">{song.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
