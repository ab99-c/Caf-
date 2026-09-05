import { NextResponse } from "next/server";

const demoCafes = [
  { id: "cafe_1", name: "مزاج كافيه", type: "قهوة مختصة", rating: 4.9, deliveryMinutes: 18 },
  { id: "cafe_2", name: "جلسة", type: "حلويات وقهوة", rating: 4.7, deliveryMinutes: 22 },
  { id: "cafe_3", name: "بُن الصباح", type: "فطور وقهوة", rating: 4.8, deliveryMinutes: 16 },
];

export async function GET() {
  return NextResponse.json({ success: true, data: demoCafes });
}