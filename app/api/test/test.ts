import { NextResponse } from "next/server";

// pages/api/test.ts
export function GET() {
  return NextResponse.json({ message: "Test route working!" });
}

