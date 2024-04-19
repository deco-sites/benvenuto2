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
  imageUrl: string;
  text: string;
};

interface SidebarState {
  draggingItem: Item | null;
}

export default function EditorSidebar() {
  // Data of the items
  const items: Item[] = [
    { id: 1, imageUrl: "/tables/tableGreen.png", text: "Item 1" },
    { id: 2, imageUrl: "/tables/segmentGreen.png", text: "Item 2" },
    { id: 3, imageUrl: "https://via.placeholder.com/150", text: "Item 3" },
    { id: 4, imageUrl: "/tables/tableGreen.png", text: "Item 1" },
    { id: 5, imageUrl: "/tables/segmentGreen.png", text: "Item 2" },
    { id: 6, imageUrl: "https://via.placeholder.com/150", text: "Item 3" },
    { id: 7, imageUrl: "/tables/tableGreen.png", text: "Item 1" },
    { id: 8, imageUrl: "/tables/segmentGreen.png", text: "Item 2" },
    { id: 9, imageUrl: "https://via.placeholder.com/150", text: "Item 3" },
    { id: 10, imageUrl: "/tables/tableGreen.png", text: "Item 1" },
    { id: 11, imageUrl: "/tables/segmentGreen.png", text: "Item 2" },
    { id: 12, imageUrl: "https://via.placeholder.com/150", text: "Item 3" },
    // Add more items as necessary
  ];

  const [draggingItem, setDraggingItem] = useState<Item | null>(null);

  // Event handler for the start of dragging
  const handleDragStart = (item: Item) => {
    setDraggingItem(item);
  };

  // Event handler for the end of dragging
  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  // Event handler for dropping the item
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    if (draggingItem) {
      // Here you can insert logic to insert the image at the mouse position
      console.log("Image inserted at", clientX, clientY);
      setDraggingItem(null);
    }
  };

  return (
    <div
      className="absolute left-0 w-200 h-[50vh] bg-gray-200 overflow-y-auto"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <div className="h-[50vh]">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-2"
            draggable
            onDragStart={() => handleDragStart(item)}
            onDragEnd={handleDragEnd}
          >
            <button
              onClick={() => console.log(`Clicked item ${item.text}`)}
              className="flex items-center justify-center w-12 h-12 mr-2"
            >
              <img
                src={item.imageUrl}
                alt={item.text}
                className="w-full h-auto"
              />
            </button>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      {draggingItem && (
        <img
          src={draggingItem.imageUrl}
          alt={draggingItem.text}
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
}
