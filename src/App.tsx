import { useState, useEffect, useRef } from 'react'
import styles from './App.module.scss'
import classnames from 'classnames'
import Card from './components/Card/Card'

interface CardComponents {
  id: number,
  clientX: number,
  clientY: number
}

function App() {
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [cardComponents, setCardComponents] = useState<CardComponents[]>([])
  const [id, setId] = useState(1)
  const [isDragging, setIsDragging] = useState(false)

  const currentId = useRef<number>()
  console.log(1)

  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (event: React.MouseEvent) => {
    if (isCreateMode) {
      setCardComponents(prev => [...prev, { id, clientX: event.clientX, clientY: event.clientY } ])
      setId((prev) => ++prev)
      setIsCreateMode(!isCreateMode)
    }
  }

  const handleOnMouseDown = (event: MouseEvent, id: number) => {
    event.preventDefault()
    setIsDragging(true)
    currentId.current = id
  }

  const handleOnMouseUp = () => {
    setIsDragging(false)
    currentId.current = undefined
  }


  useEffect(() => {
    // TODO: Не нравятся такие условия, можно что-нибудь вместо них делать?
    if (!containerRef.current) return

    const container = containerRef.current

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return
      const currentCard = cardComponents.find((el) => el.id === currentId.current)
      if (!currentCard) return
  
      currentCard.clientY = event.clientY
      currentCard.clientX = event.clientX
      setCardComponents(prev => [...prev, currentCard ])
    }

    const cleanup = () => {
      container.removeEventListener('mousemove', handleMouseMove)
    }

    container.addEventListener('mousemove', handleMouseMove)

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className={classnames(styles.main, isCreateMode && styles.mainCreateMode)} onClick={handleClick}>
      <div className={styles.container} ref={containerRef}>
        <button className={styles.button} onClick={() => setIsCreateMode(!isCreateMode)}>+ Create card</button>
      </div>
      {cardComponents.map(({ clientX, clientY, id } ) => (
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
  )
}

export default App
