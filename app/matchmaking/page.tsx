"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import styles from "./page.module.css";
import { GeistSans } from "geist/font/sans";

export default function matchmaking() {
	const router = useRouter();

	const [isLFG, setLFG] = useState(0);

	const findMatch = async () => {
		if (isLFG == 1) {
			setLFG(0)
			return
		} else if (isLFG == 0) {
			setLFG(1);
		}

		let data = await fetch("http://localhost:3001", {
			headers: {
				userID: "User1-React",
				mmr: "5",
				"Access-Control-Allow-Origin": "*",
			},
			cache: "no-store",
		})
		.then(response => {
		  // Check if the request was successful (status code 200)
		  if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		  }
	  
		  // Parse the response as JSON
		  return response.json();
		})
		.then(data => {
		  // Handle the JSON data
		  console.log(data.roomID);
		  router.push('/game/' + data.roomID)
		})

		//TODO make it so you can cancel and not send multiple requests
	};

	return (
		<main className={styles.main}>
			<div className={styles.matchStatusHolder} style={{ display: isLFG == 0 ? "none" : "flex" }}>
				<h1>
					looking for match
				</h1>
				<ReactLoading type="bubbles" color="#fff" height={50} width={50} />
			</div>
			<button className={styles.lfgButton} onClick={findMatch}>
				{isLFG == 0 ? "find match" : "cancel search"}
			</button>
		</main>
	);
}
