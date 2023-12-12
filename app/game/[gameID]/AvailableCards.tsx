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
  const [selectedCardPos, setSelectedCardPos] = useState([])
  const [isSpecialActive, setSpecialStatus] = useState(false)
  const [isPassBtnPressed, setPassBtnPressed] = useState(false)

  const passStatus = useRef(null)
	const card = useSelector(selectCardState);

  useEffect(() => {
    socket.on('dealHand', (data) => {
      setCardHand(data.cards)
      console.log(data.cards)
    })

    while(isPassBtnPressed) {
      console.log('pressed')
    }

    return
  }, [])
  
  const dispatch = useDispatch();

  const selectCard = (id) => {
    dispatch(setSelectedCard(cardHand[id]))
    setSelectedCardPos(id)
  }

  const specialButtonClick = () => {
    setSpecialStatus(!isSpecialActive)
  }

  const passStatusClickDown = () => {
    setPassBtnPressed(true)
    console.log('pressed')

  }

  const passStatusClickUp = () => {
    console.log('mouseUp')

    setPassBtnPressed(false)
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
