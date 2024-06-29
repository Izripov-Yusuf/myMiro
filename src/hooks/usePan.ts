import { MouseEvent as SyntheticMouseEvent, useCallback, useRef, useState } from 'react';

type Point = { x: number; y: number };
// TODO: В статье, которую сенсей мне скидывал, было так, но если делать так, то ts кидает ошибки
// const ORIGIN = Object.freeze({ x: 0, y: 0 });
const ORIGIN = { x: 0, y: 0 };

export default function usePan(): [Point, (e: SyntheticMouseEvent) => void] {
    const [panState, setPanState] = useState<Point>(ORIGIN);

    const lastPointRef = useRef(ORIGIN);

    const pan = useCallback((e: MouseEvent) => {
        const lastPoint = lastPointRef.current;
        const point = { x: e.pageX, y: e.pageY };
        lastPointRef.current = point;

        setPanState((panState) => {
            const delta = {
                x: point.x - lastPoint.x,
                y: point.y - lastPoint.y,
            };
            const offset = {
                x: panState.x + delta.x,
                y: panState.y + delta.y,
            };

            return offset;
        });
    }, []);

    const endPan = useCallback(() => {
        document.removeEventListener('mousemove', pan);
        document.removeEventListener('mouseup', endPan);
    }, [pan]);

    const startPan = useCallback(
        (e: SyntheticMouseEvent) => {
            document.addEventListener('mousemove', pan);
            document.addEventListener('mouseup', endPan);
            lastPointRef.current = { x: e.pageX, y: e.pageY };
        },
        [pan, endPan],
    );

    return [panState, startPan];
}
