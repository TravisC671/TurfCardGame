"use client";

import styles from "./page.module.css";
import AvailableCards from "./AvailableCards";
import Map from "./Map";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import type { AppProps } from "next/app";
import Scoreboard from "./ScoreBoard";
import cards from "./cards.json";

export default function Game({ params }: { params: { slug: string } }) {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [localPlayerScore, setLocalPlayerScore] = useState(0);
	const [onlinePlayerScore, setOnlinePlayerScore] = useState(0);
	

	useEffect(() => {
		socket.connect();
		function onConnect() {
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

		socket.on('revealPlay', (data) => {
			setOnlinePlayerScore(onlinePlayerScore + cards.cards[data.cardID].cardCells)
		})

		socket.on('sendPlay', (data) => {
			setLocalPlayerScore(localPlayerScore + cards.cards[data.cardID].cardCells)
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

	const sendCardPlacement = (cardID: number, rotation: number, positionX: number, positionY: number) => {
		console.log('sendingCard')
		socket.emit("playCard", cardID, rotation, positionX, positionY);
	};

	console.log(params["gameID"]);
	return (
		<main className={styles.main}>
			<AvailableCards />
			<Scoreboard localPlayerScore={localPlayerScore} onlinePlayerScore={onlinePlayerScore}/>
			<Map sendCardPlacement={sendCardPlacement} />
		</main>
	);
}
