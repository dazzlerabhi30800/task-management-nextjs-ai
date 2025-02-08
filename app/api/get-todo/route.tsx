import { chatSession } from "@/config/GoogleAi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const result = await chatSession.sendMessage(
      `Give me a short summary of my these tasks, summarize in 20 words or less, tasks are :- ${prompt}`,
    );
    return NextResponse.json({ result: result.response.text() });
  } catch (err: unknown) {
    return NextResponse.json({
      err: err instanceof Error ? err.message : "Unknown error",
      status: 500,
    });
  }
}
