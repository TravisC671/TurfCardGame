"use client";
import styles from "./page.module.css";

export default function Status(props) {
	return (
		<div className={`${styles.statusWrapper} ${props.isAnimate  == 1 ? styles.animation : ''}`}>
            <h1 className={`${styles.statusText}`}>{props.statusText}</h1>
		</div>
	);
}
