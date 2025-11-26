import { RefObject } from "react";

export default function useClickOutside<T extends HTMLElement | null>(
  ref: RefObject<T>,
  // eslint-disable-next-line no-unused-vars
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: "mousedown" | "touchstart" = "mousedown",
  eventListenerOptions?: boolean | AddEventListenerOptions,
) {
  function eventHandler(e: MouseEvent | TouchEvent | FocusEvent) {
    if (e.target === ref.current) {
      return;
    }
    handler(e);
    e.stopPropagation();
  }
  document.addEventListener(eventType, eventHandler, eventListenerOptions);
}
