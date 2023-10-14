import React, { useEffect, useState, useRef } from 'react'
import styles from './Card.module.scss'

interface CardProps {
    clientX: number,
    clientY: number,
    id: number,
    isDragging: boolean,
    handleOnMouseDown: (event: MouseEvent, id: number) => void,
    handleOnMouseUp: (event: MouseEvent) => void,
}

const Card: React.FC<CardProps> = ({ id, clientX, clientY, isDragging, handleOnMouseDown, handleOnMouseUp }) =>  {

    const [isEditText, setIsEditText] = useState(false)
    const [inputText, setInputText] = useState('')

    const inputRef = useRef<HTMLInputElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    const handleDoubleClick = () => {
        setIsEditText(true)
    }

    useEffect(() => {
        // TODO: Не нравятся такие условия, можно что-нибудь вместо них делать?
        if (!cardRef.current) return

        const card = cardRef.current

        const handleMouseDown = (event: MouseEvent) => {
            handleOnMouseDown(event, id);
        }

        card.addEventListener('mousedown', handleMouseDown)
        card.addEventListener('mouseup', handleOnMouseUp)

        return () => {
            card.removeEventListener('mousedown', handleMouseDown);
            card.removeEventListener('mouseup', handleOnMouseUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (isEditText) {
            inputRef.current?.focus()
        }
    }, [isEditText])

    return (
        <div
            style={{ top: `${clientY}px`, left: `${clientX}px`, cursor: isDragging ? "grabbing" : "grab" }}
            className={styles.box}
            ref={cardRef}
            onDoubleClick={handleDoubleClick}
        >
            {isEditText && (
                <input type="text" value={inputText} ref={inputRef} onChange={({ target }) => setInputText(target.value)} />
            )}
            {inputText && !isEditText && (
                <span>{inputText}</span>
            )}
        </div>
    )
};

export default Card