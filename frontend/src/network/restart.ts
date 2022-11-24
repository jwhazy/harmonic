import url from "../utils/url";

export default async function restart(
  password: string
): Promise<{ token?: string; error: boolean; message?: string }> {
  const req = await fetch(`${url}/api/restart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
  });

  const json = await req.json();

  if (json.token) return { token: json.token, error: false };

  if (json.error) return { message: json.message, error: false };

  return { error: true };
}
