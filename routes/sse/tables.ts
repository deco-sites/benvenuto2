import { Handlers } from "$fresh/server.ts";
import { ServerSentEventStream } from "std/http/server_sent_event_stream.ts";

const DATABASE_ID = "2f0c2673-1eb4-407c-a605-b6914df02ae1"

export const handler: Handlers = {
  async GET(_req) {
    const kv = await Deno.openKv(`https://api.deno.com/databases/${DATABASE_ID}/connect`);

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (
            const [{ value: message }] of kv.watch([["maps", "couve", "teste", "1"]])
          ) {
            controller.enqueue({
              data: message,
              id: Date.now(),
              event: "message",
            });
          }
        },
        cancel() {
          console.log("cancel");
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
