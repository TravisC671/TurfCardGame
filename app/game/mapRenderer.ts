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
			border: "#0f0f21",
			empty: "#38384d",
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
	}

	initializeMap(value: number) {
		for (let i = 0; i < this.mapHeight; i++) {
			let row = [];
			for (let j = 0; j < this.mapWidth; j++) {
				row.push(value);
			}
			this.mapArray.push(row);
		}
		this.mapArray[4][4] = 3
		this.mapArray[20][4] = 5

		console.log(JSON.stringify(this.mapArray))
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

	render() {
		/*
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.fillStyle = "#f25b50";
		this.ctx.beginPath();
		this.ctx.arc(50, 100, 100, 0, 2 * Math.PI);
		this.ctx.fill();*/
		this.drawGrid();
	}
}

export { mapRenderer };
