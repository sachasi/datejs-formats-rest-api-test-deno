import { serve, Handler } from "https://deno.land/std@0.138.0/http/server.ts";

const app = await Deno.readTextFile("app.html");

const handler: Handler = async (request) => {
  if (request.method !== "GET" && request.method !== "POST") {
    return new Response("Method not allowed.", { status: 400 });
  }

  const { pathname } = new URL(request.url);

  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "*",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "*",
  };

  if (pathname === "/") {
    headers["content-type"] = "text/html";

    return new Response(app, { headers, status: 200 });
  }

  if (pathname === "/api") {
    if (!request.body) {
      return new Response("Body is required.");
    }

    const reader = request.body.getReader();

    const { value } = await reader.read();

    if (!value) {
      return new Response("No value on body.");
    }

    const text = new TextDecoder().decode(value);

    const data = JSON.parse(text);

    const date = new Date(data.date);

    return new Response(JSON.stringify({ date: date.toISOString() }));
  }

  return new Response("Route not found.", { status: 404 });
};

serve(handler);
