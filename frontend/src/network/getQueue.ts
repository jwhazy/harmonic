import url from "../utils/url";

export default async function getQueue() {
  const req = await fetch(`${url}/api/get/queue`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const json = await req.json();

  return json;
}
