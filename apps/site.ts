import { type App, type AppContext as AC } from "@deco/deco";
import { Secret } from "apps/website/loaders/secret.ts";
import website, { Props as WebsiteProps } from "apps/website/mod.ts";
import manifest, { Manifest } from "../manifest.gen.ts";
type WebsiteApp = ReturnType<typeof website>;

export interface Props extends WebsiteProps {
  upstashRedis: {
    url: string;
    token: Secret;
  };
}
export default function Site(state: Props): App<Manifest, Props, [
  WebsiteApp,
]> {
  return {
    state,
    manifest,
    dependencies: [
      website(state),
    ],
  };
}
export type SiteApp = ReturnType<typeof Site>;
export type AppContext = AC<SiteApp>;
export { onBeforeResolveProps } from "apps/website/mod.ts";
