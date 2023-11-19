"use client";
import styles from "./page.module.css";

export default function Scoreboard(props) {
	return (
		<div className={styles.scoreboardWrapper}>
			<div className={styles.scoreboardSecondaryWrapper}>
				<div
					className={`${styles.scoreDiv} ${styles.scoreOnlinePlayer}`}
				>
					<h1> {props.onlinePlayerScore} </h1>
				</div>
				<div
					className={`${styles.scoreDiv} ${styles.scoreLocalPlayer}`}
				>
					<h1>{props.localPlayerScore} </h1>
				</div>
			</div>
		</div>
	);
}
