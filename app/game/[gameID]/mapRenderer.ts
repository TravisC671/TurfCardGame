import cards from "./cards.json";
import PowerCell from "../../assets/power-cell.svg";
import React from "react";
import ReactDOM from "react-dom";
import styles from "./page.module.css";

enum cellValues {
	Void = 0,
	empty = 1,
	wall = 2,
	powerCellA = 3,
	fillCell = 4,
	powerCellB = 5,
	fillColorB = 6,
	empoweredSpecialA = 7,
	empoweredSpecialB = 8,
}

class mapRenderer {
	mapWidth: number;
	mapHeight: number;
	mapArray: number[][];
	colors: {
		border: string;
		empty: string;
		wall: string;
		powerCellA: string;
		fillColorA: string;
		powerCellB: string;
		fillColorB: string;
	};

	shiftOffsetX: number;
	shiftOffsetY: number;

	selectedCard: number;
	selectedCardArray: number[][];
	selectedCardRotation: number;

	placementX: number;
	placementY: number;
	isPlacementValid: boolean;
	validMovements: number[];
	cardRotation: number;

	isTurn: boolean;

	filledCellSVG: string;
	powerCellSVG: string;
	emptyCellSVG: string;
	hoverFilledCellSVG: string;
	activatedPowerCellSVG: string;

	changedHoverCells: number[][];
	constructor() {
		this.mapWidth = 9;
		this.mapHeight = 25;

		this.mapArray = [];

		this.initializeMap(1);

		//update to new colors
		this.colors = {
			border: "#090d17",
			empty: "#11192b",
			wall: "#5d5d69",
			powerCellA: "#ffae21",
			fillColorA: "#edc785",
			powerCellB: "#3278fa",
			fillColorB: "#70a7ff",
		};

		this.selectedCard = -1;

		this.placementX = 1;
		this.placementY = 17;

		//top right bottom left
		this.validMovements = [1, 1, 1, 1];
		this.cardRotation = 0;

		this.isTurn = false;

		this.changedHoverCells = [];

		fetch("/filled-cell.svg")
			.then((response) => response.text())
			.then((svgContent) => {
				this.filledCellSVG = svgContent;
			});

		fetch("/power-cell.svg")
			.then((response) => response.text())
			.then((svgContent) => {
				this.powerCellSVG = svgContent;
			});

		fetch("/empty-cell.svg")
			.then((response) => response.text())
			.then((svgContent) => {
				this.emptyCellSVG = svgContent;
			});
		fetch("/hover-filled-cell.svg")
			.then((response) => response.text())
			.then((svgContent) => {
				this.hoverFilledCellSVG = svgContent;
			});
		fetch("/activated-power-cell.svg")
			.then((response) => response.text())
			.then((svgContent) => {
				this.activatedPowerCellSVG = svgContent;
			});
	}

	/**
	 * this initializes the mapArray
	 * @param value this is the value that all the cells are set to
	 * TODO make it able to handle different maps
	 */
	initializeMap(value: number) {
		for (let i = 0; i < this.mapHeight; i++) {
			let row = [];
			for (let j = 0; j < this.mapWidth; j++) {
				row.push(value);
			}
			this.mapArray.push(row);
		}
		this.mapArray[4][4] = 3;
		this.mapArray[20][4] = 5;
	}

	/**
	 *
	 * @param arr this is the array to be rotated
	 * @param isClockwise true to rotate the array clockwise and false for counter clockwise
	 * @returns rotated array
	 */
	rotateArray(arr: number[][], isClockwise: boolean): number[][] {
		const size = arr.length;
		const rotatedArray = new Array(size)
			.fill(0)
			.map(() => new Array(size).fill(0));

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (isClockwise) {
					rotatedArray[j][size - 1 - i] = arr[i][j];
				} else {
					rotatedArray[size - 1 - j][i] = arr[i][j];
				}
			}
		}

		return rotatedArray;
	}

	/**
	 * this checks if a given cell is neighboring another cell
	 * @param y y position of the cell
	 * @param x x position of the cell
	 * @returns a boolean that determines if there is a neigboring cell
	 * TODO make this so it checks and validates the online player's placement
	 * TODO if invalid, request the entire mapstate from the server
	 */
	isNeighboringCell(y: number, x: number): boolean {
		//returns true if next to a neighbor
		//returns false if no neigbors or is on top of a neigbor
		if (this.mapArray[y][x] == 5 || this.mapArray[y][x] == 6) return false;

		let isNeigboringCell = false;

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i + y < 0 || i + y >= this.mapHeight) continue;
				if (j + x < 0 || j + x >= this.mapWidth) continue;
				if (j == x && i == y) continue;

				if (
					this.mapArray[i + y][j + x] == 5 ||
					this.mapArray[i + y][j + x] == 6
				) {
					isNeigboringCell = true;
				}
			}
		}
		return isNeigboringCell;
	}

	/**
	 * this checks if the selected card is in a valid placement, making sure cells arent out of bounds or overlapping cells
	 * @param yOffset y offset of the card
	 * @param xOffset x offset of the card
	 * @returns boolean that depends of if the placement is valid
	 */
	isValidPlacement(yOffset: number, xOffset: number): boolean {
		if (this.selectedCardArray == undefined) {
			return;
		}

		let isOverlapping = false;
		//checks wether it is neigboring a cell
		let isPositionValid = false;

		for (let i = 0; i < this.selectedCardArray.length; i++) {
			for (let j = 0; j < this.selectedCardArray.length; j++) {
				if (i + yOffset < 0 || i + yOffset > this.mapHeight) continue;
				if (j + xOffset < 0 || j + xOffset > this.mapWidth) continue;

				if (this.selectedCardArray[i][j] == 0) continue;

				if (
					this.mapArray[i + yOffset][j + xOffset] != 1 &&
					this.mapArray[i + yOffset][j + xOffset] != 0
				) {
					isOverlapping = true;
				}

				if (this.isNeighboringCell(i + yOffset, j + xOffset)) {
					isPositionValid = true;
				}
			}
		}

		return !isOverlapping && isPositionValid ? true : false;
	}

	/**
	 * this checks if the cell is next to a wall and makes sure cards cant go out of bounds by updating the validMovements array
	 * @param y y position of the cell
	 * @param x x position of the cell
	 */
	isNextToWall(y: number, x: number): void {
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				//this seems a bit redundant but idk another way to do it

				let isOutOfBounds = false;
				if (i + y < 0) {
					this.validMovements[0] = 0;
					isOutOfBounds = true;
				} // else this.validMovements[0] = 1;

				if (i + y >= this.mapHeight) {
					this.validMovements[2] = 0;
					isOutOfBounds = true;
				} //else this.validMovements[2] = 1;

				if (j + x < 0) {
					this.validMovements[3] = 0;
					isOutOfBounds = true;
				} //else this.validMovements[3] = 1;

				if (j + x >= this.mapWidth) {
					this.validMovements[1] = 0;
					isOutOfBounds = true;
				} //else this.validMovements[1] = 1;

				if ((j == 0 && i == 0) || isOutOfBounds) {
					continue;
				}

				let cellValue = this.mapArray[i + y][j + x];

				if (cellValue != 0) continue;
				//console.log(cellValue)

				//since cellvalue == 0 we dont need to check it, and since valid movement is reset in the previous spot we dont need to change it
				if (i == -1 && j == 0) this.validMovements[0] = 0;
				if (i == 0 && j == 1) this.validMovements[1] = 0;
				if (i == 1 && j == 0) this.validMovements[2] = 0;
				if (i == 0 && j == -1) this.validMovements[3] = 0;
			}
		}
	}

	/**
	 * checks weather the given cell is surrounded
	 * @param y y position of the cell
	 * @param x x position of the cell
	 * @returns boolean depending on if the cell was surrounded
	 */
	getNeighbors(y: number, x: number): number {
		let neighbors = 0;
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				let isOutOfBoundsX = false;
				let isOutOfBoundsY = false;

				if (i + y < 0) {
					neighbors += 3;
					isOutOfBoundsY = true;
				}

				if (i + y >= this.mapHeight) {
					neighbors += 3;
					isOutOfBoundsY = true;
				}

				//by checking if the y is out of bounds we can make sure we dont double count corners
				if (j + x < 0 && isOutOfBoundsY) {
					neighbors += 2;
					isOutOfBoundsX = true;
				} else if (j + x < 0) neighbors += 3;

				if (j + x >= this.mapWidth && isOutOfBoundsY) {
					neighbors += 2;
					isOutOfBoundsX = true;
				} else if (j + x >= this.mapWidth) neighbors += 3;

				if ((j == 0 && i == 0) || isOutOfBoundsX || isOutOfBoundsY) {
					continue;
				}

				let cellValue = this.mapArray[i + y][j + x];

				if (cellValue != 1) neighbors += 1;
			}
		}
		return neighbors;
	}

	checkSpecials(): void {
		for (let i = 0; i < this.mapArray.length; i++) {
			for (let j = 0; j < this.mapArray[0].length; j++) {
				let cellValue = this.mapArray[i][j];

				if (cellValue == 3 || cellValue == 5) {
					let neigbors = this.getNeighbors(i, j);
					if (neigbors == 8) {
						console.log("special spoted");
						this.mapArray[i][j] = cellValue == 3 ? 7 : 8;
						this.setCellElement(
							j,
							i,
							this.activatedPowerCellSVG,
							cellValue == 3 ? 1 : 0,
							false,
							false,
							true,
						);
					}
				}
			}
		}
	}

	/**
	 * this checks each cell of the selected card and checks if it is able to move
	 */
	checkMovementDirections(): void {
		this.validMovements = [1, 1, 1, 1];

		for (let i = 0; i < this.selectedCardArray.length; i++) {
			for (let j = 0; j < this.selectedCardArray[0].length; j++) {
				if (this.selectedCardArray[i][j] != 0) {
					this.isNextToWall(i + this.placementY, j + this.placementX);
				}
			}
		}
	}

	/**
	 * this draws the hovered state of the selected card
	 */
	drawHover(): void {
		if (this.selectedCard == -1) return;
		if (!this.isTurn) return;

		//set affected cards from previous hover render
		for (let i = 0; i < this.changedHoverCells.length; i++) {
			let pos = this.changedHoverCells[i];
			let cell = this.mapArray[pos[0]][pos[1]];
			switch (cell) {
				case 1:
					this.setCellElement(
						pos[1],
						pos[0],
						this.emptyCellSVG,
						0,
						true,
						false,
						false,
					);
					break;
				case 3:
					this.setCellElement(
						pos[1],
						pos[0],
						this.powerCellSVG,
						1,
						false,
						false,
						false,
					);
					break;
				case 4:
					this.setCellElement(
						pos[1],
						pos[0],
						this.filledCellSVG,
						1,
						false,
						false,
						false,
					);
					break;
				case 5:
					this.setCellElement(
						pos[1],
						pos[0],
						this.powerCellSVG,
						0,
						false,
						false,
						false,
					);
					break;
				case 6:
					this.setCellElement(
						pos[1],
						pos[0],
						this.filledCellSVG,
						0,
						false,
						false,
						false,
					);
					break;
				case 7:
					this.setCellElement(
						pos[1],
						pos[0],
						this.activatedPowerCellSVG,
						1,
						false,
						false,
						true,
					);
					break;
				case 8:
					this.setCellElement(
						pos[1],
						pos[0],
						this.activatedPowerCellSVG,
						0,
						false,
						false,
						true,
					);
					break;
			}
		}
		this.changedHoverCells = [];

		for (let i = 0; i < this.selectedCardArray.length; i++) {
			for (let j = 0; j < this.selectedCardArray[0].length; j++) {
				if (this.selectedCardArray[i][j] != 0) {
					this.changedHoverCells.push([
						i + this.placementY,
						j + this.placementX,
					]);
				} else {
					continue;
				}

				let selectedCell = document.getElementById(
					`${i + this.placementY}-${j + this.placementX}`,
				);

				if (selectedCell == null) continue;

				let hoverContainer = document.createElement("div");

				hoverContainer.style.setProperty(
					"--c",
					this.selectedCardArray[i][j] == 1 ? "#55bfe2" : "#4489e4",
				);
				hoverContainer.style.setProperty(
					"--o",
					this.isPlacementValid ? "0.8" : "0.4",
				);

				hoverContainer.innerHTML = this.hoverFilledCellSVG;
				hoverContainer.className = styles.cellHover;

				selectedCell.appendChild(hoverContainer);
				//create an array of all the selected elements
				//add the hovered element
				//on next frame, set the cell to the state of the map array
			}
		}
	}

	/**
	 * sets the selected card
	 * @param cardID ID of the card which can be found in the card.json file
	 */
	setSelectedCard(cardID): void {
		//TODO check if the new card is outside of the array and correct it
		if (cardID != -1) {
			this.selectedCard = cardID;
			const cardData = cards.cards[this.selectedCard];
			this.selectedCardArray = cardData.cardArray;
			this.cardRotation = 0;
			//console.log(cards.cards[this.selectedCard])
		}
	}

	/**
	 * sets the turn
	 * @param isTurn boolean if its your turn or not
	 */
	setTurn(isTurn: boolean): void {
		console.log("turn: ", isTurn);
		this.isTurn = isTurn;
	}

	/**
	 * changes the position of the card on the X axis
	 * @param x either 1 or -1. this checks the movement and makes sure its a valid placement
	 */
	changePosX(x: number): void {
		if (this.selectedCard != -1) {
			this.checkMovementDirections();
			if (x == 1) {
				this.placementX += this.validMovements[1];
			}
			if (x == -1) {
				this.placementX -= this.validMovements[3];
			}
		}

		this.isPlacementValid = this.isValidPlacement(
			this.placementY,
			this.placementX,
		);
	}

	/**
	 * changes the position of the card on the Y axis
	 * @param y either 1 or -1. this checks the movement and makes sure its a valid placement
	 */
	changePosY(y: number): void {
		if (this.selectedCard != -1) {
			this.checkMovementDirections();
			if (y == 1) {
				this.placementY += this.validMovements[2];
			}
			if (y == -1) {
				this.placementY -= this.validMovements[0];
			}
		}

		this.isPlacementValid = this.isValidPlacement(
			this.placementY,
			this.placementX,
		);
	}

	/**
	 * changes the rotation of the selected card array
	 * @param r 1 for counter clockwise and -1 for clockwise
	 */
	changeRotation(r: number): void {
		this.cardRotation = (this.cardRotation + r) % 4;
		if (r == 1) {
			this.selectedCardArray = this.rotateArray(
				this.selectedCardArray,
				false,
			);
		}
		if (r == -1) {
			this.selectedCardArray = this.rotateArray(
				this.selectedCardArray,
				true,
			);
		}
		this.isPlacementValid = this.isValidPlacement(
			this.placementY,
			this.placementX,
		);
	}

	/**
	 * This places a card on the card Array
	 * @param cardID ID of the card to be placed
	 * @param rotation how many times the card needs to be rotated
	 * @param positionX x position of the card
	 * @param positionY y position of the card
	 * @param player the player that placed this card
	 */
	setCard(cardID, rotation, positionX, positionY, player): void {
		const cardData = cards.cards[cardID];

		let cardArray = cardData.cardArray;

		let rotationDirection = Math.sign(rotation);

		for (let r = 0; r < Math.abs(rotation); r++) {
			cardArray = this.rotateArray(
				cardArray,
				rotationDirection == -1 ? true : false,
			);
		}

		for (let i = 0; i < cardData.cardArray.length; i++) {
			for (let j = 0; j < this.selectedCardArray[0].length; j++) {
				if (cardArray[i][j] == 0) continue;

				if (i + positionY < 0 || i + positionY > this.mapHeight)
					continue;
				if (j + positionX < 0 || j + positionX > this.mapWidth)
					continue;

				if (cardArray[i][j] == 1) {
					this.mapArray[i + positionY][j + positionX] =
						player == 0 ? 6 : 4;

					this.setCellElement(
						j + positionX,
						i + positionY,
						this.filledCellSVG,
						player,
						false,
						true,
						false,
					);
				}

				if (cardArray[i][j] == 2) {
					this.mapArray[i + positionY][j + positionX] =
						player == 0 ? 5 : 3;

					this.setCellElement(
						j + positionX,
						i + positionY,
						this.powerCellSVG,
						player,
						false,
						true,
						false,
					);
				}
			}
		}
	}

	/**
	 * This sets the dom element of the cell
	 * @param x x location of the cell
	 * @param y y location of the cell
	 * @param svgElement svg string to be put inside the cell
	 * @param player which player placed the cell, either 0 or 1
	 * @param clear clears all elements inside the cell if left true
	 * @param placeAnim unused. true if you want to playe the place animation
	 * @param isActivated used to see if you use the activated color or not
	 */
	setCellElement(
		x: number,
		y: number,
		svgElement: string,
		player: number,
		clear: boolean,
		placeAnim: boolean,
		isActivated: boolean,
	) {
		let cellContainer = document.createElement("div");

		let mainShadow = player == 0 ? "#4489E4" : "#de3f8f";
		let mainColor = player == 0 ? "#55BFE2" : "#ff758f";
		let mainHighlight = player == 0 ? "#8DF2F2" : "#ff9f80";

		let activatedShadow = player == 0 ? "#70A5EB" : "#EA81B5";
		let activatedColor = player == 0 ? "#81CFEA" : "#FFA8B8";
		let activatedHighlight = player == 0 ? "#BAF7F7" : "#FFBEA8";

		let selectedCell = document.getElementById(`${y}-${x}`);
		if (selectedCell == undefined) {
			console.log(`cell of id "${y}-${x}" was not found`);
		}
		if (placeAnim) {
			//cellContainer.classList.add(styles.place)
		}
		if (!clear) {
			if (svgElement == this.powerCellSVG) {
				this.isNeighboringCell;
			}
			selectedCell.style.setProperty("--m", mainColor);
			selectedCell.style.setProperty("--s", mainShadow);
			selectedCell.style.setProperty("--h", mainHighlight);
			if (isActivated) {
				selectedCell.style.setProperty("--activatedm", activatedColor);
				selectedCell.style.setProperty("--activateds", activatedShadow);
				selectedCell.style.setProperty(
					"--activatedh",
					activatedHighlight,
				);
			}
			//selectedCell.style.setProperty("--slamSize", placeAnim ? '1.5' : '1');
			selectedCell.style.setProperty("viewBox", "0 0 100 100");
			cellContainer.classList.add(styles.cellContent);

			cellContainer.innerHTML = svgElement;

			selectedCell.replaceChildren(cellContainer);
		} else {
			selectedCell.innerHTML = svgElement;
		}
	}

	/**
	 * changes transforms of enemy card only works on symetrical maps. this algorithm needs help lol
	 * @param cardID id of the card
	 * @param rotation rotation of the card from the enemy pov
	 * @param positionX x position from the enemy pov
	 * @param positionY y position from the enemy pov
	 */
	transformCard(cardID, rotation, positionX, positionY) {
		let isMapEvenX = this.mapWidth % 2;
		let isMapEvenY = this.mapHeight % 2;

		//assuming map is odd for now

		let newRotation = (rotation + 2) % 4;

		//convert to relative coordinates & flip signs
		let newPosX = (positionX - (this.mapWidth - 1) / 2) * -1;
		let newPosY = (positionY - (this.mapHeight - 1) / 2) * -1;
		//convert back
		newPosX += (this.mapWidth - 1) / 2 - 6;
		newPosY += (this.mapHeight - 1) / 2 - 6;
		/*console.log(
			`translated positions x:${positionX} -> x\`:${newPosX} y:${positionY} -> y\`:${newPosY}`,
		);*/

		this.setCard(cardID, newRotation, newPosX, newPosY, 1);
	}

	/**
	 * places the selected card
	 * @param sendCardPosition this is a callback that sends the data
	 * @param chooseCard callback this tells the placedCard Component if a card has been placed
	 */
	placeCard(sendCardPosition, chooseCard): void {
		if (!this.isTurn) return;

		this.isPlacementValid = this.isValidPlacement(
			this.placementY,
			this.placementX,
		);

		if (!this.isPlacementValid) return;
		if (this.selectedCard == -1) return;

		sendCardPosition(
			this.selectedCard,
			this.cardRotation,
			this.placementX,
			this.placementY,
		);

		this.setCard(
			this.selectedCard,
			this.cardRotation,
			this.placementX,
			this.placementY,
			0,
		);

		chooseCard();

		this.setTurn(false);
		this.selectedCard = -1;
	}

	/**
	 * render's the currentMapstate
	 */
	render() {
		this.checkSpecials();
		this.drawHover();
	}
}

export { mapRenderer };
