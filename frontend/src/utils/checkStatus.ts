export default async function checkStatus() {
  const req = await fetch("http://localhost:3000/api/status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await req.json();

  return json;
}
