import { NextResponse } from "next/server";

const demoCafes = [
  { id: "cafe_1", name: "مزاج كافيه", type: "قهوة مختصة", rating: 4.9, deliveryMinutes: 18, isOpen: true },
  { id: "cafe_2", name: "جلسة", type: "حلويات وقهوة", rating: 4.7, deliveryMinutes: 22, isOpen: true },
  { id: "cafe_3", name: "بُن الصباح", type: "فطور وقهوة", rating: 4.8, deliveryMinutes: 16, isOpen: true },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    version: "v1",
    data: demoCafes,
    meta: { count: demoCafes.length },
  }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
}