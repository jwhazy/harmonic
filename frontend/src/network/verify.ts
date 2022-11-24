import url from "../utils/url";

export default async function verify(token: string): Promise<boolean> {
  const req = await fetch(`${url}/api/verify`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (req.status !== 200) return false;

  return true;
}
