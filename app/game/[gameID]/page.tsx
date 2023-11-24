"use client";

import styles from "./page.module.css";
import AvailableCards from "./AvailableCards";
import Map from "./Map";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import type { AppProps } from "next/app";
import Scoreboard from "./Scoreboard";
import cards from "./cards.json";
import Status from "./Status";
import PlacedCards from "./PlacedCards";

export default function Game({ params }: { params: { slug: string } }) {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [localPlayerScore, setLocalPlayerScore] = useState(0);
	const [onlinePlayerScore, setOnlinePlayerScore] = useState(0);

	const [localPlacedCard, setLocalPlacedCard] = useState(false);
	const [onlinePlacedCard, setOnlinePlacedCard] = useState(false);

	const [statusText, setStatusText] = useState('Waiting to connect to server');
	const [isStatusAnimate, setStatusAnimate] = useState(0);


	useEffect(() => {
		socket.connect();
		function onConnect() {
			setStatusText('Waiting for Game to Start')
			setIsConnected(true);
			socket.emit("joinRoom", { gameID: params["gameID"] });
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		function getCards() {}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("getCards", getCards);

		socket.on('refused', (data) => {
			//add refuse reasons
			setStatusText('server refused connection to game, full')
		})

		socket.on('gameStart', (data) => {
			//add refuse reasons
			setStatusText('Starting match in 3...')
			setTimeout(() => {
				setStatusText('Starting match in 2...')
			}, 750);
			setTimeout(() => {
				setStatusText('Starting match in 1...')
			}, 1500);
			setTimeout(() => {
				setStatusText('Match Start!')

				setStatusAnimate(1)				
			}, 2250);
		})


		socket.on('revealPlay', (data) => {
			let oldScore = onlinePlayerScore

			setOnlinePlayerScore(oldScore + cards.cards[data.cardID].cardCells)
		})

		socket.on('onlinePlayerCard', (data) => {
			setOnlinePlacedCard(true)
		})

		socket.on('sendPlay', (data) => {
			let oldScore = localPlayerScore

			setLocalPlayerScore(oldScore + cards.cards[data.cardID].cardCells)
		})

		socket.on('revealPlay', (data) => {
			setTimeout(() => {
				setOnlinePlacedCard(false)
				setLocalPlacedCard(false)
			}, 1000);
		})

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("getCards", getCards);
			socket.off("revealPlay", getCards);
			socket.off("sendPlay", getCards);

			socket.disconnect();
		};
	}, []);

	const chooseCard = () => {
		setLocalPlacedCard(true)
	}

	const sendCardPlacement = (cardID: number, rotation: number, positionX: number, positionY: number) => {
		console.log('sendingCard')
		socket.emit("playCard", cardID, rotation, positionX, positionY);
	};

	console.log(params["gameID"]);
	return (
		<main className={styles.main}>
			<Status statusText={statusText} isAnimate={isStatusAnimate}/>
			<AvailableCards />
			<Scoreboard localPlayerScore={localPlayerScore} onlinePlayerScore={onlinePlayerScore}/>
			<Map chooseCard={chooseCard} sendCardPlacement={sendCardPlacement} />
			<PlacedCards hasLocalPlayerPlayedCard={localPlacedCard}  hasOnlinePlayerPlayedCard={onlinePlacedCard} />
		</main>
	);
}
