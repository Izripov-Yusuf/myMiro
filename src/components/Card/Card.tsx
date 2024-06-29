import React, { useEffect, useState, useRef, memo } from 'react';
import styles from './Card.module.scss';
import { UpdateCardPositionParams } from '../../App';
import { useLatest } from '../../hooks/useLatest';

interface CardProps {
    positionX: number;
    positionY: number;
    id: number;
    scale: number;
    updateCardPosition: ({ id, position }: UpdateCardPositionParams) => void;
}

const Card: React.FC<CardProps> = memo(({ id, positionX, positionY, scale, updateCardPosition }) => {
    const [isEditText, setIsEditText] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [tempPosition, setTempPosition] = useState({ positionX, positionY });

    const inputRef = useRef<HTMLInputElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const tempPositionRef = useLatest(tempPosition);
    const initialMouseCoords = useRef({ x: 0, y: 0 });

    const handleDoubleClick = () => {
        setIsEditText(true);
    };

    const handleOnMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsDragging(true);
        setIsEditText(false);

        initialMouseCoords.current = {
            x: event.clientX - positionX * scale,
            y: event.clientY - positionY * scale,
        };
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging) return;

            const newY = (event.clientY - initialMouseCoords.current.y) / scale;
            const newX = (event.clientX - initialMouseCoords.current.x) / scale;
            const newPosition = { positionY: newY, positionX: newX };
            setTempPosition(newPosition);
        };

        const handleOnMouseUp = () => {
            updateCardPosition({ id, position: tempPositionRef.current });
            tempPositionRef.current = { positionX: 0, positionY: 0 };
            setTempPosition({ positionX: 0, positionY: 0 });
            setIsDragging(false);
        };

        if (!isDragging) {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleOnMouseUp);
            return;
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleOnMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleOnMouseUp);
        };
    }, [isDragging, scale]);

    useEffect(() => {
        if (isEditText) inputRef.current?.focus();
    }, [isEditText]);

    return (
        <div
            style={{
                top: `${tempPosition.positionY || positionY}px`,
                left: `${tempPosition.positionX || positionX}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className={styles.box}
            ref={cardRef}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleOnMouseDown}
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
});

export default Card;
