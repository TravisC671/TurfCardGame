"use client";
import styles from "./page.module.css";
import React from 'react';
import CardBack from '../../assets/card.svg'
import EmptyCard from '../../assets/emptyCard.svg'


export default function PlacedCards(props) {
    return (
        <div className={styles.PlayedCardsWrapper}>
            {props.hasOnlinePlayerPlayedCard ? (
                <CardBack className={styles.PlayedCardBack} />
            ) : (
                <EmptyCard />
            )}
            {props.hasLocalPlayerPlayedCard ? (
                <CardBack className={styles.PlayedCardBack} />
            ) : (
                <EmptyCard />
            )}
        </div>
    );
}
