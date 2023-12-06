import cards from "./cards.json";
import PowerCell from "../../assets/power-cell.svg";
import React from "react";
import ReactDOM from "react-dom";
import styles from "./page.module.css";

class mapRenderer {
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
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

	cellSize: number;
	padding: number;
	shiftOffsetX: number;
	shiftOffsetY: number;

	selectedCard: number;
	selectedCardArray: number[][];
	selectedCardRotationUncapped: number;
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
	changedHoverCells: number[][];
	constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;

		this.mapWidth = 9;
		this.mapHeight = 25;

		this.mapArray = [];

		this.initializeMap(1);

		this.colors = {
			border: "#090d17",
			empty: "#11192b",
			wall: "#5d5d69",
			powerCellA: "#ffae21",
			fillColorA: "#edc785",
			powerCellB: "#3278fa",
			fillColorB: "#70a7ff",
		};

		this.cellSize = 35;
		this.padding = 4;
		this.shiftOffsetX =
			(this.canvas.width -
				(this.cellSize + this.padding) * this.mapWidth) /
			2;
		this.shiftOffsetY =
			(this.canvas.height -
				(this.cellSize + this.padding) * this.mapHeight) /
			2;

		this.selectedCard = -1;

		this.placementX = 1;
		this.placementY = 17;

		this.selectedCardRotationUncapped = 0;

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
	}

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

	rotateArray(arr, isClockwise) {
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

	isNeighboringCell(y: number, x: number) {
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

	isNextToWall(y: number, x: number) {
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

				if ((j == x && i == y) || isOutOfBounds) {
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

	checkMovementDirections() {
		this.validMovements = [1, 1, 1, 1];

		for (let i = 0; i < this.selectedCardArray.length; i++) {
			for (let j = 0; j < this.selectedCardArray[0].length; j++) {
				if (this.selectedCardArray[i][j] != 0) {
					this.isNextToWall(i + this.placementY, j + this.placementX);
				}
			}
		}
	}

	drawGrid() {
		for (let i = 0; i < this.mapHeight; i++) {
			for (let j = 0; j < this.mapWidth; j++) {
				if (this.mapArray[i][j] == 0) continue;

				this.ctx.fillStyle = this.colors.border;
				this.ctx.fillRect(
					j * (this.cellSize + this.padding) +
						this.shiftOffsetX -
						this.padding,
					i * (this.cellSize + this.padding) +
						this.shiftOffsetY -
						this.padding,
					this.cellSize + this.padding * 2,
					this.cellSize + this.padding * 2,
				);

				switch (this.mapArray[i][j]) {
					case 1:
						this.ctx.fillStyle = this.colors.empty;
						break;
					case 2:
						this.ctx.fillStyle = this.colors.wall;
						break;
					case 3:
						this.ctx.fillStyle = this.colors.powerCellA;
						break;
					case 4:
						this.ctx.fillStyle = this.colors.fillColorA;
						break;
					case 5:
						this.ctx.fillStyle = this.colors.powerCellB;
						break;
					case 6:
						this.ctx.fillStyle = this.colors.fillColorB;
						break;
				}

				this.ctx.fillRect(
					j * (this.cellSize + this.padding) + this.shiftOffsetX,
					i * (this.cellSize + this.padding) + this.shiftOffsetY,
					this.cellSize,
					this.cellSize,
				);
			}
		}
	}

	drawHover() {
		if (this.selectedCard == -1) return;
		if (!this.isTurn) return;

		//set affected cards from previous hover render
		for (let i = 0; i < this.changedHoverCells.length; i++) {
			let pos = this.changedHoverCells[i]
			this.setCellElement(pos[1], pos[0], this.emptyCellSVG, 0)
		}
		this.changedHoverCells = [];

		for (let i = 0; i < this.selectedCardArray.length; i++) {
			for (let j = 0; j < this.selectedCardArray[0].length; j++) {
				this.ctx.globalAlpha = this.isPlacementValid ? 0.8 : 0.4;
				switch (this.selectedCardArray[i][j]) {
					case 1:
						this.ctx.fillStyle = this.colors.fillColorB;
						break;
					case 2:
						this.ctx.fillStyle = this.colors.powerCellB;
						break;
				}

				if (this.selectedCardArray[i][j] != 0) {
					this.ctx.fillRect(
						(j + this.placementX) * (this.cellSize + this.padding) +
							this.shiftOffsetX,
						(i + this.placementY) * (this.cellSize + this.padding) +
							this.shiftOffsetY,
						this.cellSize,
						this.cellSize,
					);
				}
				if (this.selectedCardArray[i][j] != 0) {
					this.changedHoverCells.push([i + this.placementY, j + this.placementX]);
				} else {
					continue;
				}

				let selectedCell = document.getElementById(
					`${i + this.placementY}-${j + this.placementX}`,
				);

				let hoverContainer = document.createElement("div");
				
				hoverContainer.innerHTML = this.filledCellSVG;
				hoverContainer.className = styles.cellHover;

				selectedCell.appendChild(hoverContainer);
				console.log(selectedCell)
				//create an array of all the selected elements
				//add the hovered element
				//on next frame, set the cell to the state of the map array
				this.ctx.globalAlpha = 1;
			}
		}
	}

	setSelectedCard(cardID) {
		//TODO check if the new card is outside of the array and correct it
		if (cardID != -1) {
			this.selectedCard = cardID;
			const cardData = cards.cards[this.selectedCard];
			this.selectedCardArray = cardData.cardArray;
			this.cardRotation = 0;
			//console.log(cards.cards[this.selectedCard])
		}
	}

	setTurn(isTurn: boolean) {
		console.log("turn: ", isTurn);
		this.isTurn = isTurn;
	}

	changePosX(x) {
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

	changePosY(y) {
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

	changeRotation(r) {
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

	setCard(cardID, rotation, positionX, positionY, player) {
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

					this.setCellElement(j + positionX, i + positionY, this.filledCellSVG, player)
				}

				if (cardArray[i][j] == 2) {
					this.mapArray[i + positionY][j + positionX] =
						player == 0 ? 5 : 3;

					this.setCellElement(j + positionX, i + positionY, this.powerCellSVG, player)
				}
			}
		}
	}

	setCellElement(x, y, svgElement, player) {
		let cellContainer = document.createElement("div");

		let selectedCell = document.getElementById(
			`${y}-${x}`,
		);

		let mainShadow = player == 0 ? "#4489E4" : "#E2559C";
		let mainColor = player == 0 ? "#55BFE2" : "#FF758F";
		let mainHighlight = player == 0 ? "#8DF2F2" : "#FF9875";

		selectedCell.style.setProperty("--m", mainColor);
		selectedCell.style.setProperty("--s", mainShadow);
		selectedCell.style.setProperty("--h", mainHighlight);
		selectedCell.style.setProperty("viewBox", "0 0 100 100");
		cellContainer.className = styles.cellContent;

		cellContainer.innerHTML = svgElement;

		selectedCell.replaceChildren(cellContainer)
	}

	//changes transforms of enemy card only works on symetrical maps
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

	placeCard(sendCardPosition, chooseCard) {
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
	}

	render() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.fillStyle = "#f25b50";
		this.drawGrid();
		this.drawHover();
	}
}

export { mapRenderer };
