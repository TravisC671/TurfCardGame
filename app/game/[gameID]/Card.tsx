"use client";
import { useRef } from "react";
import styles from "./page.module.css";
import totalCards from "./cards.json";

export default function Card(props) {
	
	let card = totalCards.cards[props.cardHand[props.id]]


	let cardArray = card.cardArray;

	let name = card.name;
	let cardCells = card.cardCells;
	let specialPoints = card.specialPoints;

	let specialIndicator = [];
	for (let i = 0; i < specialPoints; i++) {
		specialIndicator.push(
			<div key={i} className={styles.specialPoint}></div>,
		);
	}

	let isSelected = false

	const cardRef = useRef(null);

	const cellHolderStyle = (width, height) => ({
		width: `calc(100% - calc( 3px * ${width - 1}))`,
		aspectRatio: 1,
		padding: "10px",
		display: "grid",
		gridTemplateColumns: `repeat(${width},calc( 100% / ${cardArray.length}))`,
		gridTemplateRows: `repeat(${height},calc( 100% / ${cardArray[0].length}))`,
		gridGap: "3px 3px",
	});
	const cellStyle = (type) => ({
		height: `100%`,
		width: `100%`,
		backgroundColor: `var(--colorA${type})`,
	});

	const cardStyle = () => ({
		border: (props.selectedCard == props.id) ? '5px solid #fff' : 'none'
	})

	const click = (e) => {
		props.selectCard(props.id)
	};

	

	return (
		<div style={cardStyle()} ref={cardRef} className={styles.card} onClick={click}>
			<div style={cellHolderStyle(7, 7)}>
				{cardArray.map((row, rowIndex) => {
					let rowElement: React.JSX.Element[] = [];

					{
						row.map((cell, columnIndex) => {
							let cellId = `${name} - ${columnIndex} ${rowIndex}`;

							rowElement.push(
								<div key={rowIndex+columnIndex} id={cellId} style={cellStyle(cell)}></div>,
							);
						});
					}

					return rowElement;
				})}
			</div>
			<div className={styles.cardInfo}>
				<h1>{cardCells}</h1>
				<div className={styles.specialIndicatorWrapper}>
					{specialIndicator}
				</div>
			</div>
		</div>
	);
}
