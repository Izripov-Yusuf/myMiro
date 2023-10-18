import React, { useEffect, useState, useRef } from 'react';
import styles from './Card.module.scss';
import { UpdateCardPositionParams } from '../../App';

interface CardProps {
    positionX: number;
    positionY: number;
    id: number;
    updateCardPosition: ({ id, position }: UpdateCardPositionParams) => void;
}

const Card: React.FC<CardProps> = ({ id, positionX, positionY, updateCardPosition }) => {
    const [isEditText, setIsEditText] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [tempPosition, setTempPosition] = useState(() => {
        return { positionX, positionY };
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const coords = useRef({
        startX: positionX,
        startY: positionY,
    });

    const handleDoubleClick = () => {
        setIsEditText(true);
    };

    const handleOnMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsDragging(true);
        setIsEditText(false);

        const offsetX = event.clientX - tempPosition.positionX;
        const offsetY = event.clientY - tempPosition.positionY;

        coords.current.startX = offsetX;
        coords.current.startY = offsetY;
    };

    const handleOnMouseUp = () => {
        setIsDragging(false);
        updateCardPosition({ id, position: tempPosition });
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging) return;

            const newY = event.clientY - coords.current.startY;
            const newX = event.clientX - coords.current.startX;
            setTempPosition({
                positionY: newY,
                positionX: newX,
            });
        };

        if (!isDragging) {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleOnMouseUp);
            return;
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleOnMouseUp);

        const cleanup = () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
        return cleanup;
    }, [isDragging]);

    useEffect(() => {
        if (!isEditText) return;
        inputRef.current?.focus();
    }, [isEditText]);

    return (
        <div
            style={{
                top: `${tempPosition.positionY}px`,
                left: `${tempPosition.positionX}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className={styles.box}
            ref={cardRef}
            onDoubleClick={handleDoubleClick}
            onMouseDown={(event) => handleOnMouseDown(event)}
        >
            {isEditText && (
                <input
                    className={styles.input}
                    type="text"
                    value={inputText}
                    ref={inputRef}
                    onChange={({ target }) => setInputText(target.value)}
                />
            )}
            {inputText && !isEditText && <span>{inputText}</span>}
        </div>
    );
};

export default Card;
