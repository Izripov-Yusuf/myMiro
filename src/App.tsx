import { useState, useEffect, useRef } from 'react';
import styles from './App.module.scss';
import classnames from 'classnames';
import Card from './components/Card/Card';
import { incrementId } from './utils/incrementId';

interface CardComponents {
    id: number;
    clientX: number;
    clientY: number;
}

function App() {
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [cards, setCards] = useState<CardComponents[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const currentId = useRef<number>();
    const containerRef = useRef<HTMLDivElement>(null);
    const coords = useRef<{
        startY: number;
        startX: number;
    }>({
        startY: 0,
        startX: 0,
    });

    const handleClick = (event: React.MouseEvent) => {
        if (!isCreateMode) return;

        setCards((prev) => [...prev, { id: incrementId(), clientX: event.clientX, clientY: event.clientY }]);
        setIsCreateMode(!isCreateMode);
    };

    const handleOnMouseDown = (event: MouseEvent, id: number) => {
        event.preventDefault();
        setIsDragging(true);
        currentId.current = id;
        coords.current.startY = event.clientY;
        coords.current.startX = event.clientX;
    };

    const handleOnMouseUp = () => {
        setIsDragging(false);
        currentId.current = undefined;
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging) return;

            setCards((prev) =>
                prev.map((card) =>
                    card.id === currentId.current ? { ...card, clientY: event.clientY, clientX: event.clientX } : card,
                ),
            );
        };

        container.addEventListener('mousemove', handleMouseMove);

        const cleanup = () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
        return cleanup;
    }, [cards, isDragging]);

    return (
        <main className={classnames(styles.main, isCreateMode && styles.mainCreateMode)} onClick={handleClick}>
            <div className={styles.container} ref={containerRef}>
                <button className={styles.button} onClick={() => setIsCreateMode(!isCreateMode)}>
                    + Create card
                </button>
            </div>
            {cards.map(({ clientX, clientY, id }) => (
                <Card
                    key={id}
                    id={id}
                    clientX={clientX}
                    clientY={clientY}
                    isDragging={isDragging}
                    handleOnMouseDown={handleOnMouseDown}
                    handleOnMouseUp={handleOnMouseUp}
                />
            ))}
        </main>
    );
}

export default App;
