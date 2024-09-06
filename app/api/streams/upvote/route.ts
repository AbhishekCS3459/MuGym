import prismaClient from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
  streamId: z.string(),
});

// pages/api/test.ts
export function GET() {
  return NextResponse.json({ message: "Upvote route working!" });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  // TODO: I can get rid of db calls here

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: session?.user?.email ?? "",
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
        },
        {
          status: 403,
        }
      );
    }

    const existingUpvote = await prismaClient.upvote.findFirst({
      where: {
        userId: user.id,
        streamId: user.id,
      },
    });

    if (existingUpvote) {
      return NextResponse.json(
        { message: "Upvote already exists" },
        { status: 409 }
      );
    }

    // create upvote
    const data = UpvoteSchema.parse(await req.json());
    const upvote = await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        });

    return NextResponse.json({ message: "Done Upvote!" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Upvote route failed", error },
      { status: 403 }
    );
  }
}
