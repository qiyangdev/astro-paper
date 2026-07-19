const CACHE_CONTROL =
  "public, max-age=0, s-maxage=60, stale-while-revalidate=300";

type ActiveVisitorsResponse = {
  visitors?: unknown;
};

function json(body: object, status: number, cacheControl = "no-store") {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET") {
      const response = json({ error: "Method not allowed" }, 405);
      response.headers.set("Allow", "GET");
      return response;
    }

    const apiToken = process.env.UMAMI_API_TOKEN;
    const umamiUrl = process.env.UMAMI_URL?.replace(/\/+$/, "");
    const websiteId = process.env.UMAMI_WEBSITE_ID;

    if (!apiToken || !umamiUrl || !websiteId) {
      return json({ error: "Online visitor count is unavailable" }, 503);
    }

    try {
      const response = await fetch(
        `${umamiUrl}/api/websites/${encodeURIComponent(websiteId)}/active`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          signal: AbortSignal.timeout(5_000),
        }
      );

      if (!response.ok) {
        return json({ error: "Online visitor count is unavailable" }, 502);
      }

      const data = (await response.json()) as ActiveVisitorsResponse;
      if (
        typeof data.visitors !== "number" ||
        !Number.isInteger(data.visitors) ||
        data.visitors < 0
      ) {
        return json({ error: "Invalid response from analytics service" }, 502);
      }

      return json({ visitors: data.visitors }, 200, CACHE_CONTROL);
    } catch {
      return json({ error: "Online visitor count is unavailable" }, 502);
    }
  },
};
