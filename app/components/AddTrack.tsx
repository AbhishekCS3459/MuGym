import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Youtube,
  // Spotify,
} from "lucide-react";

export default function AddTrack() {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <Tabs defaultValue="youtube" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="youtube"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <Youtube className="w-4 h-4 mr-2" />
            YouTube
          </TabsTrigger>
          <TabsTrigger
            value="spotify"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            {/* <Spotify className="w-4 h-4 mr-2" /> */}
            Spotify
          </TabsTrigger>
        </TabsList>
        <TabsContent value="youtube">
          <div className="flex">
            <Input
              placeholder="Paste YouTube URL here"
              className="flex-grow mr-2 border-gray-300 text-gray-900 placeholder-gray-500"
            />
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Add Track
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="spotify">
          <div className="flex">
            <Input
              placeholder="Paste Spotify URL here"
              className="flex-grow mr-2 border-gray-300 text-gray-900 placeholder-gray-500"
            />
            <Button className="bg-red-500 hover:bg-red-600 text-white ">
              Add Track
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
