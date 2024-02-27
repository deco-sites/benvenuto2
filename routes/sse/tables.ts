import { Handlers } from "$fresh/server.ts";
import { ServerSentEventStream } from "std/http/server_sent_event_stream.ts";

export const handler: Handlers = {
  async GET(_req) {
    const kv = await Deno.openKv();

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (
            const [{ value: message }] of kv.watch([["maps", "couve", "1"]])
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
