import url from "../utils/url";

export default async function restart() {
  const req = await fetch(`${url}/api/restart`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const json = await req.json();

  return json;
}
