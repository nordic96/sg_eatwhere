import { RefCallback, useRef, useState } from 'react';

export default function useHover<T extends Element>(): [RefCallback<T>, boolean] {
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<T>(null);

  function refCallback(element: T | null) {
    nodeRef.current = element;
    if (nodeRef.current) {
      nodeRef.current.addEventListener('mouseover', () => {
        setHovered(true);
      });
      nodeRef.current.addEventListener('mouseout', () => {
        setHovered(false);
      });
    }
  }

  return [refCallback, hovered];
}
