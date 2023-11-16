"use client";

import styles from "./page.module.css";
import AvailableCards from "./AvailableCards";
import Map from "./Map";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import type { AppProps } from "next/app";

export default function Game({ params }: { params: { slug: string } }) {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [isTurn, setTurn] = useState(false.toString());

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

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("getCards", getCards);
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
			<Map sendCardPlacement={sendCardPlacement} />
		</main>
	);
}
