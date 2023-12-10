"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css'
import Card from './Card'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/exports";
import { selectCardState, setSelectedCard } from "./store/cardSlice";
import { socket } from "./socket";

export default function AvailableCards(props) {
  const [cardHand, setCardHand] = useState([])
  const [selectedCardPos, setSelectedCardPos] = useState([])

	const card = useSelector(selectCardState);

  useEffect(() => {
    socket.on('dealHand', (data) => {
      setCardHand(data.cards)
      console.log(data.cards)
    })
    return
  }, [])
  
  const dispatch = useDispatch();

  const selectCard = (id) => {
    dispatch(setSelectedCard(cardHand[id]))
    setSelectedCardPos(id)
  }

  return (
    <div className={styles.cardWrapper}>
        <Card id={0} selectedCard={selectedCardPos} selectCard={selectCard} cardHand={cardHand} />
        <Card id={1} selectedCard={selectedCardPos} selectCard={selectCard} cardHand={cardHand} />
        <Card id={2} selectedCard={selectedCardPos} selectCard={selectCard} cardHand={cardHand} />
        <Card id={3} selectedCard={selectedCardPos} selectCard={selectCard} cardHand={cardHand} />
    </div>
  )
}
