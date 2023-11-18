"use client";

import { useState } from "react";
import styles from './page.module.css'
import Card from './Card'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/exports";
import { selectCardState, setSelectedCard } from "./store/cardSlice";

export default function AvailableCards(props) {

	const card = useSelector(selectCardState);

  let cardHand = [0, 1, 2, 3]
  
  const dispatch = useDispatch();

  const selectCard = (id) => {
    dispatch(setSelectedCard(id))
    //console.log('selected card', id)
  }

  return (
    <div className={styles.cardWrapper}>
        <Card id={0} selectedCard={card} selectCard={selectCard} cardHand={cardHand} />
        <Card id={1} selectedCard={card} selectCard={selectCard} cardHand={cardHand} />
        <Card id={2} selectedCard={card} selectCard={selectCard} cardHand={cardHand} />
        <Card id={3} selectedCard={card} selectCard={selectCard} cardHand={cardHand} />
    </div>
  )
}
