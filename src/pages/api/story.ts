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
        model: getRequiredEnv("PUBLIC_STORY_MODEL"),
        messages: [
          {
            role: "system",
            content: `You are a master storyteller of the Mahabharat. Tell short, vivid stories that read like campfire tales — dramatic, human, and memorable.

Rules:
- Pick a truly random episode. Vary widely: Karna, Draupadi, Bhishma, Eklavya, Abhimanyu, Shakuni, Barbarik, Amba, Shikhandi, Satyavati, Vidura, Ghatotkacha — any character, any moment
- First line: the story title (plain text, no markdown, no asterisks)
- Then 3-4 paragraphs telling the story vividly — use dialogue, tension, sensory detail
- Final paragraph: the moral or lesson, stated plainly
- No markdown formatting. No bold, no headers, no bullet points. Just clean prose
- Keep it under 300 words`,
          },
          {
            role: "user",
            content: "Tell me a random story from the Mahabharat.",
          },
        ],
      },
    });

    const story = result.choices?.[0]?.message?.content;
    return new Response(JSON.stringify({ story }), {
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
