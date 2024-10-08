import { Handlers } from "$fresh/server.ts";
import { ServerSentEventStream } from "std/http/server_sent_event_stream.ts";

// Replace with your actual Upstash Redis REST URL and Token
const UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");

// The Redis channel you want to subscribe to
const CHANNEL_NAME = "tablemap_couve_channel"; // Replace with your channel name

function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
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

    //console.log("Read chunk:", value);

    if (done) {
      console.log("Stream done.");
      break;
    }

    const data = decoder.decode(value);

    //console.log("Decoded data:", data, "\n");

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

export const handler: Handlers = {
  async GET(_req) {
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
