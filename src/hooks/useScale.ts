import { useState } from 'react';
import useEventListener from './useEventListener';

type ScaleOpts = {
    direction: 'up' | 'down';
    interval: number;
    position: {
        x: number;
        y: number;
    };
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

/**
 * Listen for `wheel` events on the given element ref and update the reported
 * scale state, accordingly.
 */
export default function useScale(
    offset: { x: number; y: number },
    setOffset: (offset: { x: number; y: number }) => void,
) {
    const [scale, setScale] = useState(1);

    const updateScale = ({ direction, interval, position }: ScaleOpts) => {
        let newScale: number;

        // Adjust up to or down to the maximum or minimum scale levels by `interval`.
        if (direction === 'up' && scale + interval < MAX_SCALE) {
            newScale = scale + interval;
        } else if (direction === 'up') {
            newScale = MAX_SCALE;
        } else if (direction === 'down' && scale - interval > MIN_SCALE) {
            newScale = scale - interval;
        } else if (direction === 'down') {
            newScale = MIN_SCALE;
        } else {
            newScale = scale;
        }

        newScale = +newScale.toFixed(1);

        const distanceX = position.x - offset.x;
        const distanceY = position.y - offset.y;

        const cof = newScale / scale;
        const diffX = distanceX * cof - distanceX;
        const diffY = distanceY * cof - distanceY;

        setOffset({
            x: offset.x - diffX,
            y: offset.y - diffY,
        });

        setScale(newScale);

        return newScale;
    };

    // Set up an event listener such that on `wheel`, we call `updateScale`.
    useEventListener(document, 'wheel', (e) => {
        updateScale({
            direction: e.deltaY < 0 ? 'up' : 'down',
            interval: 0.1,
            position: {
                x: e.clientX,
                y: e.clientY,
            },
        });
    });

    return scale;
}
