import { Common } from "./Common";
import { media } from "./Media";

const GAME_SCREEN_ID = "js-game-screen";

export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;

class Canvas extends Common {
  constructor() {
    super(GAME_SCREEN_ID);
    this.configureCanvas();
  }
  configureCanvas() {
    /** @type {CanvasRenderingContext2D} */
    this.context = this.element.getContext("2d");
    this.context.canvas.width = CANVAS_WIDTH;
    this.context.canvas.height = CANVAS_HEIGHT;
    this.context.font = "20px Arial white";
    this.context.fillStyle = "white";
  }
  drawGameOnCanvas(gameState) {
    this.drawBackground();
    this.drawPointsToWin(gameState.pointsToWin);
    this.drawPlayerPoints(gameState.getPlayerPoints());
    this.drawLeftMovement(gameState.getLeftMovement());
  }
  drawBackground() {
    this.context.drawImage(media.backgroundImage, 0, 0);
  }
  drawPointsToWin(pointsToWin) {
    this.context.fillText(`${pointsToWin}`, 520, 92);
  }
  drawPlayerPoints(playerPoints) {
    this.context.fillText(`${playerPoints}`, 520, 163);
  }
  drawLeftMovement(leftMovement) {
    this.context.fillText(`${leftMovement}`, 520, 234);
  }
}

export const canvas = new Canvas();
