import { getStore } from "@netlify/blobs";

// Shared season state for Runway.
// GET  /api/state  -> the current season, or null if nothing has been saved yet
// PUT  /api/state  -> replaces the stored season with the posted JSON

const KEY = "season";

const headers = {
  "content-type": "application/json",
  "cache-control": "no-store",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,PUT,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

export default async (req) => {
  const store = getStore({ name: "runway", consistency: "strong" });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method === "GET") {
    const data = await store.get(KEY, { type: "json" });
    return new Response(JSON.stringify(data ?? null), { status: 200, headers });
  }

  if (req.method === "PUT" || req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Body must be JSON." }), { status: 400, headers });
    }
    if (!body || !Array.isArray(body.rounds)) {
      return new Response(JSON.stringify({ error: "That isn't a Runway season." }), { status: 400, headers });
    }
    await store.setJSON(KEY, body);
    return new Response(JSON.stringify({ ok: true, savedAt: Date.now() }), { status: 200, headers });
  }

  return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
};

export const config = { path: "/api/state" };
