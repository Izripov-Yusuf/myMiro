import { useState } from 'react';
import styles from './App.module.scss';
import classnames from 'classnames';
import Card from './components/Card/Card';
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
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);

    const handleClick = (event: React.MouseEvent) => {
        if (!isCreateMode) return;

        setCards((prev) => [...prev, { id: incrementId(), positionX: event.clientX, positionY: event.clientY }]);
        setIsCreateMode(!isCreateMode);
    };

    const updateCardPosition = ({ id, position }: UpdateCardPositionParams) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, positionY: position.positionY, positionX: position.positionX } : card,
            ),
        );
    };

    return (
        <main className={classnames(styles.main, isCreateMode && styles.mainCreateMode)} onClick={handleClick}>
            <div className={styles.container}>
                <button className={styles.button} onClick={() => setIsCreateMode(!isCreateMode)}>
                    + Create card
                </button>
                {cards.map(({ positionX, positionY, id }) => (
                    <Card
                        key={id}
                        id={id}
                        positionX={positionX}
                        positionY={positionY}
                        updateCardPosition={updateCardPosition}
                    />
                ))}
            </div>
        </main>
    );
}

export default App;
