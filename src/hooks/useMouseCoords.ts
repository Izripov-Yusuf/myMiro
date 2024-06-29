import { useState } from 'react';
import useEventListener from './useEventListener';

export default function useMouseCoords() {
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

    useEventListener(document, 'wheel', (e) => {
        setMouseCoords({ x: e.clientX, y: e.clientY });
    });

    return mouseCoords;
}
