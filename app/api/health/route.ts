import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "qahwati",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  }, { headers: { "Cache-Control": "no-store" } });
}