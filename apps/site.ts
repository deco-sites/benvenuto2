import website, { Props } from "apps/website/mod.ts";
import manifest, { Manifest } from "../manifest.gen.ts";
import { type App, type AppContext as AC } from "@deco/deco";
type WebsiteApp = ReturnType<typeof website>;
export default function Site(state: Props): App<Manifest, Props, [
    WebsiteApp
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
