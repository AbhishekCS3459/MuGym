import prismaClient from "@/app/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubeserarchapi from "youtube-search-api";
//@ts-ignore
import { getData, getPreview, getTracks, getDetails } from "spotify-url-info";

// // Define your validation schema
const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string().url(),
});
const MAX_QUEUE_LEN = 20;
// Define regex patterns for URL validation
const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const SPOTIFY_REGEX = /spotify\.com\/track\/[\w]{22}/;

export async function POST(req: Request) {
  console.log("At create stream--------");
  try {
    // Parse and validate the incoming request body
    const body = await req.json();
    const data = CreateStreamSchema.parse(body);

    if (!data) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    // Check if the URL matches either YouTube or Spotify regex
    const isYt = YT_REGEX.test(data.url);
    const isSpotify = SPOTIFY_REGEX.test(data.url);

    if (!isYt && !isSpotify) {
      return NextResponse.json({ error: "Invalid YouTube or Spotify URL" });
    }

    // Extract the ID based on the URL type
    let extractedId: string | null = null;
    if (isYt) {
      const match = data.url.match(/v=([a-zA-Z0-9_-]{11})/);
      extractedId = match ? match[1] : null;
    } else if (isSpotify) {
      // Extract Spotify ID if needed
      extractedId = data.url.split("/track/")[1] || null;
    }

    if (!extractedId) {
      return NextResponse.json({ error: "Failed to extract ID from URL" });
    }

    if (isYt) {
      console.log("Extracted Id", extractedId);
      const videoDetails = await youtubeserarchapi.GetVideoDetails(extractedId);

      let thumbnailData;

      let smallImgUrl = `https://img.youtube.com/vi/${extractedId}/0.jpg`,
        bigImgUrl = `https://img.youtube.com/vi/${extractedId}/0.jpg`;

      console.log("videoDetails", videoDetails);

      if (videoDetails.thumbnail) {
        thumbnailData = videoDetails.thumbnail.thumbnails;
        thumbnailData.sort(
          (
            a: { width: number; height: number },
            b: { width: number; height: number }
          ) => (a.width * a.height > b.width * b.height ? 1 : -1)
        );
        smallImgUrl = thumbnailData[0]?.url;
        bigImgUrl = thumbnailData[thumbnailData.length - 1]?.url;
      }
      // logic for max queue length weather to add song or not
      const existingStreams = await prismaClient.stream.count({
        where: {
          userId: data.creatorId,
        },
      });

      if (existingStreams > MAX_QUEUE_LEN) {
        return NextResponse.json(
          { error: "Max queue length reached" },
          {
            status: 411,
          }
        );
      }

      // // Create a new stream in the database
      const stream = await prismaClient.stream.create({
        data: {
          type: isYt ? "Youtube" : "Spotify",
          url: data.url,
          extractedId,
          title: videoDetails.title || "Youtube Video Title",
          smallImg: smallImgUrl,
          bigImg: bigImgUrl,
          active: true,
          userId: data.creatorId,
        },
      });
      console.log("Song Added");
      // Return a success response
      return NextResponse.json({ msg: "stream created", stream: stream });
    }
    return NextResponse.json({ msg: "stream created", id: "spotify" });
  } catch (error: any) {
    console.log(error);
    // If validation or any other error occurs, send a 400 response with the error message
    return NextResponse.json({ error: error.message });
  }
}

export async function GET() {
  try {
    const streams = await prismaClient.stream.findMany({
      where: {
        active: true,
      },
    });
    return NextResponse.json({ streams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const streamId = body.streamId;
    const stream = await prismaClient.stream.delete({
      where: {
        id: streamId,
      },
    });

    return NextResponse.json({ msg: "stream deleted", stream });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
