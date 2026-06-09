import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");
    const fileNameParam = searchParams.get("fileName") || "download-stream";
    const quality = searchParams.get("quality") || "1085p";

    if (!urlParam) {
      return new NextResponse("Parameter 'url' is required.", { status: 400 });
    }

    const cleanFileName = `${fileNameParam.replace(/[^a-zA-Z0-9\s-_]/g, "")}_${quality}.mp4`;

    const response = await fetch(urlParam);
    if (!response.ok || !response.body) {
      return new NextResponse("Error fetching video stream source.", { status: 500 });
    }

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${cleanFileName}"`);
    headers.set("Content-Type", "video/mp4");

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Local client direct download streaming error:", err);
    return new NextResponse("Error generating file download stream.", { status: 500 });
  }
}
