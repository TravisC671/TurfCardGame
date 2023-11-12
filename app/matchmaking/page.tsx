"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function matchmaking() {
	useEffect(() => {
		console.log('eeeeeeeeeeeeeee')
		fetch("http://localhost:3001", {
			headers: {
				userID: "User1-React",
				mmr: "5",
				"Access-Control-Allow-Origin": "*",
			},
			cache: "no-store",
		}).then((response) => {
			console.log(response);
		});
	}, []);

	return (
		<main className={styles.main}>
			<h1>looking for match</h1>
		</main>
	);
}
