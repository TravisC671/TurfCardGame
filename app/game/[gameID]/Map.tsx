"use client";

import styles from "./page.module.css";
import { useEffect, useRef } from "react";
import { mapRenderer } from "./mapRenderer";
import { useSelector } from "react-redux/es/exports";
import {
	selectCardState,
	setSelectedCard,
	select,
	observeStore,
} from "./store/cardSlice";
import { store } from "./store/store";

export default function Map(props) {
	const canvasRef = useRef(null);

	const draw = (renderer: mapRenderer) => {
		renderer.render();
	};

	let renderer: mapRenderer | undefined;

	const setRenderCard = (currentCard) => {
		if (renderer != undefined) {
			renderer.setSelectedCard(currentCard);
		}
	};

	const unsubscribe = store.subscribe(() => {
		const currentState = select(store.getState());

		setRenderCard(currentState);
	});

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
					console.log('placeItem');
					break;
			}
		}
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		let frameCount = 0;
		let animationFrameId;

		renderer = new mapRenderer(context, canvas);

		document.addEventListener("keydown", handleKeyDown);

		const render = () => {
			frameCount++;
			draw(renderer);
			animationFrameId = window.requestAnimationFrame(render);
		};

		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			className={styles.mapCanvas}
			ref={canvasRef}
			{...props}
		></canvas>
	);
}
