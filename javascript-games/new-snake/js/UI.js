export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 24;
    this.fontFamily = "Helvetica";
  }

  draw(context) {
    this.drawScore(context);
    this.drawTimer(context);
    this.drawPowerText(context);
    this.drawPowerSquares(context);
    this.drawSeparator(context);
  }

  drawScore(context) {
    context.font = this.fontSize + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColour;
    //score
    context.fillText("Score: " + this.game.score, 20, 28);
  }

  drawTimer(context) {
    context.fillText((this.game.timer * 0.001).toFixed(1), 200, 28);
  }

  drawPowerSquares(context) {
    context.fillStyle = "red";
    context.fillRect(
      this.game.width - 95,
      10,
      this.game.cellSize / 2,
      this.game.cellSize / 2
    );
    context.fillStyle = "white";
    context.fillRect(
      this.game.width - 145,
      10,
      this.game.cellSize / 2,
      this.game.cellSize / 2
    );
    context.fillStyle = "purple";
    context.fillRect(
      this.game.width - 210,
      10,
      this.game.cellSize / 2,
      this.game.cellSize / 2
    );
  }

  drawPowerText(context) {
    context.fillStyle = "white";
    context.textAlign = "left";
    context.font = this.fontSize * 0.5 + "px " + this.fontFamily;
    context.fillText("Power ups:", this.game.width - 280, 19);
    context.fillText("food overload", this.game.width - 80, 19);
    context.fillText("slow", this.game.width - 130, 19);
    context.fillText("sweep", this.game.width - 195, 19);
  }

  drawSeparator(context) {
    context.lineWidth = 2;
    context.strokeStyle = "white";
    context.beginPath();
    context.moveTo(0, this.game.marginTop);
    context.lineTo(this.game.width, this.game.marginTop);
    context.stroke();
  }

  drawGameOver(context) {
    if (this.game.gameOver) {
      console.log("game over");
      context.textAlign = "center";
      context.font = this.fontSize * 1.5 + "px " + this.fontFamily;
      context.fillStyle = this.game.fontColour;
      context.fillText(
        "Game Over",
        this.game.width * 0.5,
        this.game.height * 0.5 - 25
      );
    }
  }
}
