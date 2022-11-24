export default async function auth(
  password: string
): Promise<{ token?: string; error: boolean; message?: string }> {
  const req = await fetch("http://localhost:3000/api/auth", {
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
