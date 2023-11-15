import cards from "./cards.json";

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
		if (this.mapArray[y][x] == 5 || this.mapArray[y][x] == 6) {
			return false;
		}

		let isNeigboringCell = false;

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i + y < 0 || i + y >= this.mapHeight) {
					continue;
				}
				if (j == x && i == y) {
					continue;
				}
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
				if (i + yOffset < 0 || i + yOffset > this.mapHeight) {
					continue;
				}
				if (j + xOffset < 0 || j + xOffset > this.mapWidth) {
					continue;
				}

				if (this.selectedCardArray[i][j] == 0) {
					continue;
				}

				if (
					this.mapArray[i + yOffset][j + xOffset] != 1 &&
					this.mapArray[i + yOffset][j + xOffset] != 0
				) {
					isOverlapping = true;
					console.log(this.mapArray[i + yOffset][j + xOffset]);
				}

				if (this.isNeighboringCell(i + yOffset, j + xOffset)) {
					isPositionValid = true;
				}
			}
		}

		console.log(
			`isOverlapping: ${isOverlapping}, isPositionValid: ${isPositionValid}`,
		);
		return !isOverlapping && isPositionValid ? true : false;
	}

	drawGrid() {
		for (let i = 0; i < this.mapHeight; i++) {
			for (let j = 0; j < this.mapWidth; j++) {
				if (this.mapArray[i][j] != 0) {
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
				}
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

		for (let i = 0; i < this.selectedCardArray.length; i++) {
			for (let j = 0; j < this.selectedCardArray[0].length; j++) {
				this.ctx.globalAlpha = (this.isPlacementValid) ? 1 : 0.4;
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
				this.ctx.globalAlpha = 1;
			}
		}
	}

	setSelectedCard(cardID) {
		if (cardID != -1) {
			this.selectedCard = cardID;
			const cardData = cards.cards[this.selectedCard];
			this.selectedCardArray = cardData.cardArray;
			//console.log(cards.cards[this.selectedCard])
		}
	}

	changePosX(x) {
		this.placementX += x;
		this.isPlacementValid = this.isValidPlacement(this.placementY, this.placementX);
	}

	changePosY(y) {
		this.placementY += y;
		this.isPlacementValid = this.isValidPlacement(this.placementY, this.placementX);
	}

	changeRotation(r) {
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
		this.isPlacementValid = this.isValidPlacement(this.placementY, this.placementX);
	}

	render() {
		/*
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.fillStyle = "#f25b50";
		this.ctx.beginPath();
		this.ctx.arc(50, 100, 100, 0, 2 * Math.PI);
		this.ctx.fill();*/
		this.drawGrid();
		this.drawHover();
	}
}

export { mapRenderer };
