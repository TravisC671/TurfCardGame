"use client";

import { redirect, useRouter } from 'next/navigation'
import { useEffect } from "react";
import styles from "./page.module.css";

export default function matchmaking() {

	const router = useRouter()

	const  findMatch = async () => {
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
	}

	return (
		<main className={styles.main}>
			<h1>looking for match</h1>
			<button onClick={findMatch}>find match</button>
		</main>
	);
}
