import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/settings — returns all settings as key-value object
export async function GET() {
  try {
    const rows = await (prisma as any).siteSettings.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    // Provide defaults if not set yet
    const defaults: Record<string, string> = {
      whatsappNumber: "+94742570943",
      telegramChatIds: "",
      storeName: "ITechLK",
      supportEmail: "support@itechlk.com",
      currencySymbol: "$",
      storeDescription: "Your one-stop shop for premium digital subscriptions and software.",
    };
    return NextResponse.json({ ...defaults, ...settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST /api/settings — upserts all provided key-value pairs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updates = Object.entries(body) as [string, string][];
    for (const [key, value] of updates) {
      await (prisma as any).siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
