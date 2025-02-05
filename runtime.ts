import type { SiteApp } from "./apps/site.ts";
import { forApp } from "@deco/deco/web";

import type { Manifest } from "./manifest.gen.ts";
import { proxy } from "@deco/deco/web";

export const invoke = proxy<Manifest>();
export const Runtime = forApp<SiteApp>();
