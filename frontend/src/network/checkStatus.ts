import url from "../utils/url";

export default async function checkStatus() {
  const req = await fetch(`${url}/api/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await req.json();

  return json;
}
