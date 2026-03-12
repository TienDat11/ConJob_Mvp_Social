import { validateRequest } from "@/auth";

export async function GET() {
  const { user } = await validateRequest();
  return Response.json({
    status: "ok",
    user: user?.username || "not logged in",
  });
}
