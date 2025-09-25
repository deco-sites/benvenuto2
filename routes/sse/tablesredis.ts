import { Handlers } from "$fresh/server.ts";
import { ServerSentEventStream } from "std/http/server_sent_event_stream.ts";
import { getCookies } from "std/http/cookie.ts";
import { verify } from "jwt";
import { getJwtCryptoKey } from "site/utils/jwtKey.ts";
import { JwtUserPayload } from "site/types/user.ts";
import type { AppContext } from "site/apps/site.ts";

const UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKE");
const JWT_PRIVATE_KEY = Deno.env.get("JWT_PRIVATE_KEY");

function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Function to subscribe to the channel using the Upstash REST API
async function subscribe(channel: string, callback: (message: string) => void) {
  console.log("subscribe");
  const url = `${UPSTASH_REDIS_REST_URL}/subscribe/${channel}`;
  const headers = {
    Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    Accept: "text/event-stream",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
  });

  console.log(response.headers);
  console.log("Reading response body...");
  console.log(response.body);

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  console.log(reader);
  if (!reader) {
    console.error("Reader not available. Check the response body.");
    return;
  }

  console.log("Reader is ready, starting to read the stream...");

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      console.log("Stream done.");
      break;
    }

    const data = decoder.decode(value);

    if (!data.startsWith("data: subscribe,")) {
      if (data.startsWith(`data: message,${channel},`)) {
        const treatedData = data.slice(channel.length + 15);
        console.log("Treat and add start of data:", treatedData, "\n");
        buffer += treatedData;
      } else {
        console.log("Add rest of data:", data, "\n");
        buffer += data;
      }
    }
    if (isValidJSON(buffer)) {
      callback(buffer);
      buffer = ""; // Reset buffer after sending complete message
    }
  }
}

export const handler: Handlers<unknown, AppContext> = {
  async GET(_req, ctx) {
    const cookies = getCookies(_req.headers);
    const token = cookies.auth;
    console.log("UPSTASH_REDIS_REST_URL: ", UPSTASH_REDIS_REST_URL);
    console.log("UPSTASH_REDIS_REST_TOKEN: ", UPSTASH_REDIS_REST_TOKEN);
    console.log("JWT_PRIVATE_KEY: ", JWT_PRIVATE_KEY);
    console.log("token: ", token);
    console.log("cookie: ", cookies);

    const key = await getJwtCryptoKey(JWT_PRIVATE_KEY);

    if (!token) {
      return new Response("Missing auth cookie", { status: 401 });
    }

    const payload = await verify(token, key);
    const userInfo = payload as unknown as JwtUserPayload;

    const CHANNEL_NAME = `tablemap_${userInfo.email}_channel`;

    console.log("Rodando SSE no servidor");
    return new Response(
      new ReadableStream({
        async start(controller) {
          await subscribe(CHANNEL_NAME, (message: string) => {
            // Log the message to the console
            console.log("Message received, adding to the controller:", message);

            // Enqueue the message to be sent via SSE
            controller.enqueue({
              data: message,
              id: Date.now().toString(),
              event: "message",
            });
          });
        },
        cancel() {
          console.log("Stream canceled");
        },
      }).pipeThrough(new ServerSentEventStream()),
      {
        headers: {
          "Content-Type": "text/event-stream",
        },
      },
    );
  },
};
