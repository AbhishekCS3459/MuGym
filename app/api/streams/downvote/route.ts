import { NextRequest, NextResponse } from "next/server";

// pages/api/test.ts
export function GET() {
  return NextResponse.json({ message: "Downvote route working!" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("At downVote", body);

    return NextResponse.json({ message: "Downvote route working!", body });
  } catch (error) {
    return NextResponse.json({ message: "Downvote route failed", error });
  }
}
