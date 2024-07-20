import React, { useCallback, useState } from 'react';
import styles from './App.module.scss';
import classnames from 'classnames';
import Card from './components/Card/Card';
import usePan from './hooks/usePan';
import useScale from './hooks/useScale';
import { incrementId } from './utils/incrementId';

export interface UpdateCardPositionParams {
    id: number;
    position: { positionX: number; positionY: number };
}
interface Card {
    id: number;
    positionX: number;
    positionY: number;
}

function App() {
    const [offset, startPan, setOffset] = usePan();

    const [isCreateMode, setIsCreateMode] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);

    const scale = useScale(offset, setOffset);

    const handleClick = (event: React.MouseEvent) => {
        if (!isCreateMode) return;

        console.log('event.clientX', event.clientX);
        console.log('event.clientY', event.clientY);
        console.log('offset.x', offset.x);
        console.log('offset.y', offset.y);
        console.log('scale', scale);

        const x = (event.clientX - offset.x) / scale;
        const y = (event.clientY - offset.y) / scale;

        console.log('x', x);
        console.log('y', y);

        setCards((prev) => [...prev, { id: incrementId(), positionX: x, positionY: y }]);
        setIsCreateMode(!isCreateMode);
    };

    const updateCardPosition = useCallback(({ id, position }: UpdateCardPositionParams) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, positionY: position.positionY, positionX: position.positionX } : card,
            ),
        );
    }, []);

    return (
        <main className={classnames(styles.main, isCreateMode && styles.mainCreateMode)} onClick={handleClick}>
            <button className={styles.button} onClick={() => setIsCreateMode(!isCreateMode)}>
                + Create card
            </button>
            <div className={styles.container} onMouseDown={startPan} />
            <div
                className={styles.cardsWrapper}
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                {cards.map(({ positionX, positionY, id }) => (
                    <Card
                        key={id}
                        id={id}
                        positionX={positionX}
                        positionY={positionY}
                        scale={scale}
                        updateCardPosition={updateCardPosition}
                    />
                ))}
            </div>
        </main>
    );
}

export default App;
