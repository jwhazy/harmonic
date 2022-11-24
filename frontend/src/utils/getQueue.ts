export default async function getQueue() {
  const req = await fetch("http://localhost:3000/api/get/queue", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await req.json();

  return json;
}
