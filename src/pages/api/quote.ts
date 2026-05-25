import type { APIRoute } from "astro";
import {
  createOpenRouterClient,
  getRequiredEnv,
} from "../../lib/openrouter";

export const GET: APIRoute = async () => {
  try {
    const openrouter = createOpenRouterClient();

    const result = await openrouter.chat.send({
      chatRequest: {
        model: getRequiredEnv("PUBLIC_QUOTE_MODEL"),
        messages: [
          {
            role: "system",
            content: "You recite shlokas from the Bhagavad Gita. Output ONLY the English translation of one verse and its chapter:verse number. No commentary, no explanation, no formatting, no quotation marks. Just the verse text followed by a dash and the reference. Pick a truly random verse — vary across all 18 chapters.",
          },
          {
            role: "user",
            content: "Give me one random verse from the Bhagavad Gita.",
          },
        ],
      },
    });

    const quote = result.choices?.[0]?.message?.content;
    return new Response(JSON.stringify({ quote }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
