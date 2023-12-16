"use client";

import { useEffect, useRef, useState } from "react";
import styles from './page.module.css'
import Card from './Card'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/exports";
import { selectCardState, setSelectedCard } from "./store/cardSlice";
import { socket } from "./socket";
import ActionButtons from "./ActionButtons";

export default function AvailableCards(props) {
  const [cardHand, setCardHand] = useState([])
  const [selectedCardPos, setSelectedCardPos] = useState(-1)

  const passStatus = useRef(null)
	const card = useSelector(selectCardState);

  useEffect(() => {
    console.log(cardHand)


    const dealHand = (data) => {
      setCardHand(data.cards)
      console.log(data.cards)
    }

    const sendNewCard = (data) => {
      console.log('dealHand',data)
      let newCardHand = cardHand
      console.log(newCardHand)
      if (selectedCardPos != -1) {
        newCardHand[selectedCardPos] = data
        console.log(newCardHand)
        setCardHand(newCardHand)
      }
    }


    socket.on('dealHand', dealHand)
    socket.on('sendNewCard', sendNewCard)
    
    return () => {
      socket.off('dealHand', dealHand)
      socket.off('sendNewCard', sendNewCard)
    }
  }, [cardHand])
  
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
        <ActionButtons />
    </div>
  )
}
