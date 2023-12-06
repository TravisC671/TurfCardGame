"use client";

import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { mapRenderer } from "./mapRenderer";
import { useSelector } from "react-redux/es/exports";
import {
	selectCardState,
	setSelectedCard,
	select,
	observeStore,
} from "./store/cardSlice";
import { store } from "./store/store";
import { socket } from "./socket";
import GenerateMap from "./generateMap";

export default function Map(props) {
	const canvasRef = useRef(null);

	let renderer: mapRenderer | undefined;

	const setRenderCard = (currentCard) => {
		console.log('setCard', renderer, currentCard)
		//! WHY IS THIS BROKEN
		if (renderer != undefined) {
			renderer.setSelectedCard(currentCard);
		}
	};

	

	//TODO add later
	const moveCursor = (event) => {
		console.log(event);
	};

	const handleKeyDown = (event) => {
		if (renderer != undefined) {
			switch (event.key) {
				case "w":
					renderer.changePosY(-1);
					break;
				case "s":
					renderer.changePosY(1);
					break;
				case "a":
					renderer.changePosX(-1);
					break;
				case "d":
					renderer.changePosX(1);
					break;
				case "q":
					renderer.changeRotation(1);
					break;
				case "e":
					renderer.changeRotation(-1);
					break;
				case " ":
					renderer.placeCard(props.sendCardPlacement, props.chooseCard)
					break;
			}
			renderer.render();
		}
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		renderer = new mapRenderer(context, canvas);

		document.addEventListener("keydown", handleKeyDown);

		socket.on('revealPlay', (data) => {
			renderer.transformCard(data.cardID, data.rotation, data.positionX, data.positionY)
			renderer.setTurn(true)
			renderer.render();
		})

		socket.on('gameStart', (data) => {
			console.log('Starting Game')
			renderer.setTurn(true)
		})

		const unsubscribe = store.subscribe(() => {
			const currentState = select(store.getState());
	
			setRenderCard(currentState);
		});

		renderer.render();

		return () => {
			unsubscribe()
			socket.off('revealPlay')
			socket.off('gameStart')
		};
	}, []);

	return (
		<div>
			<canvas
				className={styles.mapCanvas}
				ref={canvasRef}
			></canvas>
			<GenerateMap width={9} height={25} />
		</div>
	);
}
