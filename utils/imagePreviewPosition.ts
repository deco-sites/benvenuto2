import { signal } from "@preact/signals";
import { PositionXY } from "site/islands/MapEditor.tsx";

export const imagePreviewPosition = signal<PositionXY>({ x: 0, y: -9999 });