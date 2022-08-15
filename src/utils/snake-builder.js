class Game {
	constructor() {
		this.WWidth = 10
		this.WHeight = 10
		this.SHx = 4 //Snake head X coordinate
		this.SHy = 6 //Snake head Y coordinate
		this.Sd = "S" // Snake movement direction [N,S,E,W]
		this.WC = " " // world corner
		this.WV = " " // world vertical wall (edge)
		this.WH = " " // world horizontal wall (edge)
		this.WS = ":green_square:" // world space
		this.SH = ":sunglasses:" // snake head
		this.SB = ":purple_square:" // snake body
		this.SF = ":red_square:" // snake food
		this.SC = ":boom:" // snake collision
		this.time = 30

		this.gameEnded = false

		this.world = []
		for (let row = 0; row < this.WHeight; row++) {
			this.world[row] = []
			for (let col = 0; col < this.WWidth; col++) {
				this.world[row][col] = this.WS
			}
		}

		// Set the world corners
		this.world[0][0] = this.WC // Top Left cell
		this.world[this.WHeight - 1][0] = this.WC // Bottom Left cell
		this.world[0][this.WWidth - 1] = this.WC // Top Right cell
		this.world[this.WHeight - 1][this.WWidth - 1] = this.WC // Bottom Right cell

		// Set the world Vertical Walls (edges)
		for (let row = 1; row < this.WHeight - 1; row++) {
			this.world[row][0] = this.world[row][this.WWidth - 1] = this.WV
		}

		// Set the world Horizontal Walls (edges)
		for (let col = 1; col < this.WWidth - 1; col++) {
			this.world[0][col] = this.world[this.WHeight - 1][col] = this.WH
		}

		this.snake = [[this.SHx, this.SHy]]

		this.spawnFood()
	}

	_inSnake(r, c, snakeArray) {
		for (
			let snakeSegmentIndex = 0;
			snakeSegmentIndex < snakeArray.length;
			snakeSegmentIndex++
		) {
			let snakeSegmentCoordinates = snakeArray[snakeSegmentIndex]
			if (
				snakeSegmentCoordinates[0] === r &&
				snakeSegmentCoordinates[1] === c
			) {
				return snakeSegmentIndex
			}
		}
		return -1
	}

	world2string(worldMatrix, snakeArray) {
		let s = "" // Accumulator|Aggregator (this value accumulates the result of the following loops.
		for (let row = 0; row < worldMatrix.length; row++) {
			for (let col = 0; col < worldMatrix[row].length; col++) {
				// if the coordinates (row, col) are present in the snake draw the corresponding character otherwise draw what
				// ever is in the World.
				let snakeSegmentIndex = this._inSnake(row, col, snakeArray)
				if (snakeSegmentIndex < 0 || worldMatrix[row][col] === this.SC) {
					s += worldMatrix[row][col]
				} else {
					if (snakeSegmentIndex === 0) {
						s += this.SH
					} else {
						s += this.SB
					}
				}
			}
			s += "\n"
		}
		return s
	}

	snakeMovement(snake, direction) {
		this.time = 30
		direction = direction || this.Sd
		let head = snake[0]
		switch (direction.toUpperCase()) {
			// Column movement
			case "N":
				this.SHx = head[0] - 1
				this.SHy = head[1]
				this.Sd = "N"
				break
			case "S":
				this.SHx = head[0] + 1
				this.SHy = head[1]
				this.Sd = "S"
				break
			// Row movement
			case "W":
				this.SHx = head[0]
				this.SHy = head[1] - 1
				this.Sd = "W"
				break
			case "E":
				this.SHx = head[0]
				this.SHy = head[1] + 1
				this.Sd = "E"
				break
		}
		// if is NOT valid (SHx, SHy) Game over
		if (this.isTheFieldEmpty(this.SHx, this.SHy)) {
			if (this._inSnake(this.SHx, this.SHy, this.snake) < 0) {
				this.snake.unshift([this.SHx, this.SHy])
				this.snake.pop()
			} else {
				this.SH = this.SC
				this.gameEnded = true
			}
		} else if (this.isFood(this.SHx, this.SHy)) {
			this.world[this.SHx][this.SHy] = this.WS
			this.snake.unshift([this.SHx, this.SHy])
			this.spawnFood()
		} else {
			this.SH = this.SC
			this.gameEnded = true
		}
	}

	isTheFieldEmpty(r, c) {
		return this.world[r][c] === this.WS
	}

	isFood(r, c) {
		return this.world[r][c] === this.SF
	}

	getRandomNumber(min, max) {
		// Nice copy-paste, except that max is not the maximum but the supremum
		return Math.floor(Math.random() * (max - min) + min)
	}

	spawnFood(r, c) {
		if (!r || !c) {
			do {
				r = this.getRandomNumber(1, this.WHeight - 2)
				c = this.getRandomNumber(1, this.WWidth - 2)
			} while (this.isTheFieldEmpty(r, c) && !this._inSnake(r, c, this.snake))
		} // TODO: Verify that the input is sane (0<r<H-1 && 0<c<W-1)
		this.world[r][c] = this.SF
	}
}

module.exports = { Game }
