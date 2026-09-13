import { createFileRoute } from "@tanstack/react-router";

const GEMINI_MODEL = "gemini-3.6-flash";
const MAX_PROMPT_LENGTH = 50_000;

type GeneratePlanBody = {
  prompt?: unknown;
};

function jsonError(message: string, status: number) {
  return Response.json({ error: { message } }, { status });
}

function getGeminiApiKey(): string | undefined {
  return typeof process !== "undefined" ? process.env.GEMINI_API_KEY : undefined;
}

export const Route = createFileRoute("/api/generate-plan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: GeneratePlanBody;
        try {
          body = (await request.json()) as GeneratePlanBody;
        } catch {
          return jsonError("Request body must be valid JSON.", 400);
        }

        if (typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
          return jsonError("A non-empty prompt is required.", 400);
        }

        if (body.prompt.length > MAX_PROMPT_LENGTH) {
          return jsonError("The prompt is too large.", 413);
        }

        const apiKey = getGeminiApiKey();
        if (!apiKey) {
          return jsonError("Gemini API is not configured on the server.", 503);
        }

        const endpoint = new URL(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        );
        endpoint.searchParams.set("key", apiKey);

        let upstream: Response;
        try {
          upstream = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: body.prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          });
        } catch {
          return jsonError("Unable to reach the Gemini API.", 502);
        }

        if (!upstream.ok) {
          let message = `Gemini API returned status ${upstream.status}.`;
          try {
            const details = (await upstream.json()) as {
              error?: { message?: unknown };
            };
            if (typeof details.error?.message === "string") {
              message = details.error.message;
            }
          } catch {
            // Keep the generic upstream status when the error is not JSON.
          }
          return jsonError(message, 502);
        }

        const data = await upstream.text();
        return new Response(data, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
