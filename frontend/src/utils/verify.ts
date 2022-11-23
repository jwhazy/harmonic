export default async function verify(token: string): Promise<boolean> {
  const req = await fetch("http://localhost:3001/api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });

  if (req.status !== 200) return false;

  return true;
}
