import { signal } from "@preact/signals";
import { PositionXY } from "deco-sites/benvenuto2/islands/MapEditor.tsx";

export const imagePreviewPosition = signal<PositionXY>({ x: 0, y: -9999 });