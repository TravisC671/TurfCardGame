"use client";
import styles from "./page.module.css";
import React, { useEffect } from "react";
import CardBack from "../../assets/card.svg";
import EmptyCard from "../../assets/emptyCard.svg";
import CellEmpty from "../../assets/cell-empty.svg";
import PowerCell from "../../assets/cell-blue.svg";
import FilledCell from "../../assets/filled-cell.svg";
export default function GenerateMap(props) {
	let generatedMap = [];

	for (let i = 0; i < props.height; i++) {
		let row = [];
		for (let j = 0; j < props.width; j++) {
			let idName = `${i}-${j}`;
			//let mainColor = '#78c3e2'
			let mainShadow = "#DE3F8F";
			let mainColor = "#FF758F";
			let mainHighlight = "#FF9F80";
            //TODO put black box behin powercell and shrink it for border
			if (i == 4 && j == 4) {
				row.push(
					<div
						key={idName}
						id={idName}
						className={styles.defaultCell}
					>
						<PowerCell
							style={{
								"--m": mainColor,
								"--s": mainShadow,
								"--h": mainHighlight,
							}}
						></PowerCell>
					</div>,
				);
			} else if (i == 5 && j == 4) {
				row.push(
					<div
						key={idName}
						id={idName}
						className={styles.defaultCell}
					>
						<FilledCell></FilledCell>
					</div>,
				);
			} else if (i == 5 && j == 3) {
				row.push(
					<div
						key={idName}
						id={idName}
						className={styles.defaultCell}
					>
						<FilledCell></FilledCell>
					</div>,
				);
			} else if (i == 20 && j == 4) {
				let secondaryShadow = "#4489E4";
				let secondaryColor = "#55BFE2";
				let secondaryHighlight = "#8DF2F2";
				row.push(
					<div
						key={idName}
						id={idName}
						className={styles.defaultCell}
					>
						<PowerCell
							style={{
								"--m": secondaryColor,
								"--s": secondaryShadow,
								"--h": secondaryHighlight,
							}}
						></PowerCell>
					</div>,
				);
			} else {
				row.push(
					<div
						key={idName}
						id={idName}
						className={styles.defaultCell}
					>
						<CellEmpty></CellEmpty>
					</div>,
				);
			}
		}
		generatedMap.push(row);
	}

	useEffect(() => {
		document.documentElement.style.setProperty("--mapWidth", props.width);
		document.documentElement.style.setProperty("--mapHeight", props.height);
	}, []);

	return (
		<div>
			<div className={styles.cellContainer}>{generatedMap}</div>
		</div>
	);
}
