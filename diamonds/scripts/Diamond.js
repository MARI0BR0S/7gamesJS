import {
  DIAMOND_SIZE,
  GAME_BOARD_X_OFFSET,
  GAME_BOARD_Y_OFFSET,
} from "./GameLevels";
import { Sprite } from "./Sprite";

const DIAMOND_ORIGINAL_SIZE = 32;
const DIAMOND_ZOOM = DIAMOND_SIZE / DIAMOND_ORIGINAL_SIZE;
export const NUMBER_OF_DIAMONDS_TYPES = 6;

export class Diamond extends Sprite {
  constructor(x, y, row, column, kind, diamondSpriteImage) {
    const offset = {
      y: GAME_BOARD_Y_OFFSET,
      x: GAME_BOARD_X_OFFSET,
    };

    super(
      x,
      y,
      DIAMOND_ORIGINAL_SIZE,
      DIAMOND_ORIGINAL_SIZE,
      diamondSpriteImage,
      NUMBER_OF_DIAMONDS_TYPES,
      offset
    );
    this.row = row;
    this.column = column;
    this.kind = kind;
    this.match = 0;
  }
  draw() {
    super.draw(this.kind, DIAMOND_ZOOM);
  }
}
