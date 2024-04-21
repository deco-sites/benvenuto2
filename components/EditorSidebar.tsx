import { useSignal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { TableMap } from "../static/MockedTableObject.tsx";
import GenericTable from "./tableTypes/GenericTable.tsx";
import { Runtime } from "../runtime.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import SegmentTable from "./tableTypes/SegmentTable.tsx";
import { Component, h } from "preact";

// Defining the type for the items
type Item = {
  id: number;
  model: string;
  imageUrl: string;
  text: string;
};

export default function EditorSidebar() {
  // Data of the items
  const items: Item[] = [
    {
      id: 1,
      model: "models.SquareTable",
      imageUrl: "/tables/tableGreen.png",
      text: "Item 1",
    },
    {
      id: 2,
      model: "models.RoundTable",
      imageUrl: "/tables/segmentGreen.png",
      text: "Item 2",
    },
    {
      id: 3,
      model: "models.SquareTable",
      imageUrl: "/tables/tableGreen.png",
      text: "Item 3",
    },
    {
      id: 4,
      model: "models.RoundTable",
      imageUrl: "/tables/segmentGreen.png",
      text: "Item 4",
    },
    {
      id: 5,
      model: "models.SquareTable",
      imageUrl: "/tables/tableGreen.png",
      text: "Item 5",
    },
    {
      id: 6,
      model: "models.RoundTable",
      imageUrl: "/tables/segmentGreen.png",
      text: "Item 6",
    },
    {
      id: 7,
      model: "models.SquareTable",
      imageUrl: "/tables/tableGreen.png",
      text: "Item 7",
    },
    {
      id: 8,
      model: "models.RoundTable",
      imageUrl: "/tables/segmentGreen.png",
      text: "Item 8",
    },
  ];

  const handleDragStart = (e: DragEvent, item: Item) => {
    e.dataTransfer?.setData("Model", item.model);
  };

  return (
    <div
      className="absolute left-0 w-100 h-[50vh] bg-gray-200 overflow-y-auto"
      onDragOver={(event) => event.preventDefault()}
    >
      <div className="h-[50vh]">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-2"
          >
            <img
              src={item.imageUrl}
              alt={item.text}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
