"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import Card from "./Card";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/exports";
import { selectCardState, setSelectedCard } from "./store/cardSlice";
import { socket } from "./socket";

export default function ActionButtons(props) {
	return (
		<div className={styles.ActionButtonWrapper}>

		</div>
	);
}
