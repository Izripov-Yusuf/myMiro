import { useEffect, useRef } from 'react';

export default function useEventListener<EventType extends keyof DocumentEventMap>(
    element: Document,
    eventType: EventType,
    callback: (e: DocumentEventMap[EventType]) => void,
) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (element === null) return;

        const handler = (e: DocumentEventMap[EventType]) => callbackRef.current(e);

        element.addEventListener(eventType, handler);

        return () => element.removeEventListener(eventType, handler);
    }, [eventType, element]);
}
