import authMiddleware from "@src/app/api/authMiddleware";

export const GET = () => authMiddleware(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return Response.json({ hey: true }, { status: 200 });
});
