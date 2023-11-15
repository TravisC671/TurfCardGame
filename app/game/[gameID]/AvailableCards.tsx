"use client";

import { useState } from "react";
import styles from './page.module.css'
import Card from './Card'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/exports";
import { selectCardState, setSelectedCard } from "./store/cardSlice";

export default function AvailableCards(props) {

	const card = useSelector(selectCardState);

  let card1 = {
    Array: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 2, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    name: "cross",
    cardCells: 5,
    specialPoints: 3,
  }

  let card2 = {
    Array: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 2, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],

    ],
    name: "arrow",
    cardCells: 6,
    specialPoints: 3,
  }

  let card3 = {
    Array: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ],
    name: "tspin",
    cardCells: 4,
    specialPoints: 3,
  }

  let card4 = {
    Array: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 2, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ],
    name: "house",
    cardCells: 7,
    specialPoints: 3,
  }

  let cards = [card1, card2, card3, card4]
  const dispatch = useDispatch();

  const selectCard = (id) => {
    dispatch(setSelectedCard(id))
    //console.log('selected card', id)
  }

  return (
    <div className={styles.cardWrapper}>
        <Card id={0} selectedCard={card} selectCard={selectCard} cardArray={cards[0].Array} name={cards[0].name} cardCells={cards[0].cardCells} specialPoints={cards[0].specialPoints} />
        <Card id={1} selectedCard={card} selectCard={selectCard} cardArray={cards[1].Array} name={cards[1].name} cardCells={cards[1].cardCells} specialPoints={cards[1].specialPoints} />
        <Card id={2} selectedCard={card} selectCard={selectCard} cardArray={cards[2].Array} name={cards[2].name} cardCells={cards[2].cardCells} specialPoints={cards[2].specialPoints} />
        <Card id={3} selectedCard={card} selectCard={selectCard} cardArray={cards[3].Array} name={cards[3].name} cardCells={cards[3].cardCells} specialPoints={cards[3].specialPoints} />
    </div>
  )
}
