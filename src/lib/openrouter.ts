import { OpenRouter } from "@openrouter/sdk";

type GlobalWithProcess = typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

export function getRequiredEnv(name: string) {
  const metaEnv = import.meta.env as Record<string, string | undefined>;
  const processEnv = (globalThis as GlobalWithProcess).process?.env;
  const value = metaEnv[name] ?? processEnv?.[name];

  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env and restart the dev server.`
    );
  }

  return value;
}

export function createOpenRouterClient() {
  return new OpenRouter({
    apiKey: getRequiredEnv("OPENROUTER_API_KEY"),
  });
}
