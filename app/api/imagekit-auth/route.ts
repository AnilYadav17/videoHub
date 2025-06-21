import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    //authParams - {token, expire, signature}
    const authParams = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    });
    return Response.json({
      authParams,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });
  } catch (error) {
    return Response.json(
      { error: "Authantication for imagekit Failed" },
      { status: 500 }
    );
  }
}
