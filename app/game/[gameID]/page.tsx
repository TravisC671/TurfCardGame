"use client";

import styles from "./page.module.css";
import AvailableCards from "./AvailableCards";
import Map from "./Map";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import type { AppProps } from "next/app";

export default function Game({ params }: { params: { slug: string } }) {
	const [isConnected, setIsConnected] = useState(socket.connected);

	socket.connect();

	useEffect(() => {
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
		};
	}, []);

	console.log(params["gameID"]);
	const [card, setCard] = useState(-1);
	return (
		<main className={styles.main}>
			<AvailableCards setselectedcard={setCard} />
			<Map selectedcard={card} />
		</main>
	);
}


