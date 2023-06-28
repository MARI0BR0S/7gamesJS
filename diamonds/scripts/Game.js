import { canvas } from "./Canvas";
import { Common, VISIBLE_SCREEN } from "./Common";
import { NUMBER_OF_DIAMONDS_TYPES } from "./Diamond";
import {
  DIAMOND_SIZE,
  EMPTY_BLOCK,
  GAME_BOARD_X_OFFSET,
  GAME_BOARD_Y_OFFSET,
  gameLevels,
} from "./GameLevels";
import { GameState } from "./GameState";
import { DATA_LOADED_EVENT_NAME } from "./Loader";
import { mainMenu } from "./MainMenu";
import { media } from "./Media";
import { mouseController } from "./MouseController";
import { resultScreen } from "./ResultScreen";
import { userData } from "./UserData";

export const DIAMONDS_ARRAY_WIDTH = 8;
const DIAMONDS_ARRAY_HEIGHT = DIAMONDS_ARRAY_WIDTH + 1; // WITH INVISIBLE FIRST LINE
const LAST_ELEMENT_DIAMONDS_ARRAY =
  DIAMONDS_ARRAY_WIDTH * DIAMONDS_ARRAY_HEIGHT - 1;
const SWAPING_SPEED = 8;
const TRANSPARENCY_SPEED = 10;

class Game extends Common {
  constructor() {
    super();
  }
  playLevel(levelNumber) {
    const { numberOfMovements, pointsToWin, board } =
      gameLevels[levelNumber - 1];
    window.removeEventListener(DATA_LOADED_EVENT_NAME, this.playLevel);

    this.gameState = new GameState(
      levelNumber,
      numberOfMovements,
      pointsToWin,
      board,
      media.diamondsSprite
    );
    this.changeVisibilityScreen(canvas.element, VISIBLE_SCREEN);
    this.changeVisibilityScreen(
      mainMenu.miniSettingsLayerElement,
      VISIBLE_SCREEN
    );
    media.isInLevel = true;
    media.playBackgroundMusic();

    this.animate();
  }
  animate() {
    this.handleMouseState();
    this.handleMouseClick();
    this.findMatches();
    this.moveDiamonds();
    this.hideAnimation();
    this.countScores();
    this.revertSwap();
    this.clearMatched();
    canvas.drawGameOnCanvas(this.gameState);
    this.gameState.getGameBoard().forEach((diamond) => diamond.draw());
    this.checkPossibilityMovement();
    this.checkEndOfGame();
  }
  handleMouseState() {
    const isSwapping = !this.gameState.getIsSwapping();
    const isMoving = !this.gameState.getIsMoving();
    if (mouseController.clicked && isSwapping && isMoving) {
      mouseController.state++;
    }
  }

  handleMouseClick() {
    if (!mouseController.clicked) return;
    const xClicked = Math.floor(
      (mouseController.x - GAME_BOARD_X_OFFSET) / DIAMOND_SIZE
    );
    const yClicked = Math.floor(
      (mouseController.y - GAME_BOARD_Y_OFFSET) / DIAMOND_SIZE
    );
    if (
      !yClicked ||
      xClicked >= DIAMONDS_ARRAY_WIDTH ||
      yClicked >= DIAMONDS_ARRAY_HEIGHT
    ) {
      mouseController.state = 0;
      return;
    }

    if (mouseController.state === 1) {
      mouseController.firstClick = {
        x: xClicked,
        y: yClicked,
      };
    } else if (mouseController.state === 2) {
      mouseController.secondClick = {
        x: xClicked,
        y: yClicked,
      };
      mouseController.state = 0;

      if (
        Math.abs(mouseController.firstClick.x - mouseController.secondClick.x) +
          Math.abs(
            mouseController.firstClick.y - mouseController.secondClick.y
          ) !==
        1
      ) {
        return;
      }
      this.swapDiamonds();
      media.playSwapSound();

      this.gameState.setIsSwapping(true);
      this.gameState.decreasePointsMovement();
      mouseController.state = 0;
    }
    mouseController.clicked = false;
  }

  findMatches() {
    this.gameState.getGameBoard().forEach((diamond, index, diamonds) => {
      if (
        diamond.kind === EMPTY_BLOCK ||
        index < DIAMONDS_ARRAY_WIDTH ||
        index === LAST_ELEMENT_DIAMONDS_ARRAY
      ) {
        return;
      }

      if (
        diamonds[index - 1].kind === diamond.kind &&
        diamonds[index + 1].kind === diamond.kind
      ) {
        if (
          Math.floor((index - 1) / DIAMONDS_ARRAY_WIDTH) ===
          Math.floor((index + 1) / DIAMONDS_ARRAY_WIDTH)
        ) {
          for (let i = -1; i <= 1; i++) {
            diamonds[index + i].match++;
          }
        }
      }
      if (
        index >= DIAMONDS_ARRAY_WIDTH &&
        index < LAST_ELEMENT_DIAMONDS_ARRAY - DIAMONDS_ARRAY_WIDTH + 1 &&
        diamonds[index - DIAMONDS_ARRAY_WIDTH].kind === diamond.kind &&
        diamonds[index + DIAMONDS_ARRAY_WIDTH].kind === diamond.kind
      ) {
        if (
          (index - DIAMONDS_ARRAY_WIDTH) % DIAMONDS_ARRAY_WIDTH ===
          (index + DIAMONDS_ARRAY_WIDTH) % DIAMONDS_ARRAY_WIDTH
        ) {
          for (
            let i = -DIAMONDS_ARRAY_WIDTH;
            i <= DIAMONDS_ARRAY_WIDTH;
            i += DIAMONDS_ARRAY_WIDTH
          ) {
            diamonds[index + i].match++;
          }
        }
      }
    });
  }
  swapDiamonds() {
    const firstDiamond =
      mouseController.firstClick.y * DIAMONDS_ARRAY_WIDTH +
      mouseController.firstClick.x;
    const secondDiamond =
      mouseController.secondClick.y * DIAMONDS_ARRAY_WIDTH +
      mouseController.secondClick.x;

    this.swap(
      this.gameState.getGameBoard()[firstDiamond],
      this.gameState.getGameBoard()[secondDiamond]
    );
  }
  moveDiamonds() {
    this.gameState.setIsMoving(false);
    this.gameState.getGameBoard().forEach((diamond) => {
      let dx, dy;

      for (let speedSwap = 0; speedSwap < SWAPING_SPEED; speedSwap++) {
        dx = diamond.x - diamond.row * DIAMOND_SIZE;
        dy = diamond.y - diamond.column * DIAMOND_SIZE;
        if (dx) {
          diamond.x -= dx / Math.abs(dx);
        }

        if (dy) {
          diamond.y -= dy / Math.abs(dy);
        }
      }
      if (dx || dy) {
        this.gameState.setIsMoving(true);
      }
    });
  }
  hideAnimation() {
    if (this.gameState.getIsMoving()) {
      return;
    }
    this.gameState.getGameBoard().forEach((diamond) => {
      if (diamond.match && diamond.alpha > TRANSPARENCY_SPEED) {
        diamond.alpha -= TRANSPARENCY_SPEED;
        this.gameState.setIsMoving(true);
      }
    });
  }
  countScores() {
    this.scores = 0;
    this.gameState
      .getGameBoard()
      .forEach((diamond) => (this.scores += diamond.match));

    if (!this.gameState.getIsMoving() && this.scores) {
      this.gameState.increasePlayerPoints(this.scores);
    }
  }
  revertSwap() {
    if (this.gameState.getIsSwapping() && !this.gameState.getIsMoving()) {
      if (!this.scores) {
        this.swapDiamonds();
        this.gameState.increasePointsMovement();
      }
      this.gameState.setIsSwapping(false);
    }
  }
  clearMatched() {
    if (this.gameState.getIsMoving()) {
      return;
    }
    this.gameState.getGameBoard().forEach((_, idx, diamonds) => {
      const index = diamonds.length - 1 - idx;
      const column = Math.floor(index / DIAMONDS_ARRAY_WIDTH);
      const row = Math.floor(index % DIAMONDS_ARRAY_WIDTH);

      if (diamonds[index].match) {
        for (let counter = column; counter >= 0; counter--) {
          if (!diamonds[counter * DIAMONDS_ARRAY_WIDTH + row].match) {
            this.swap(
              diamonds[counter * DIAMONDS_ARRAY_WIDTH + row],
              diamonds[index]
            );
            break;
          }
        }
      }
    });

    this.gameState.getGameBoard().forEach((diamond, index) => {
      const row = Math.floor(index % DIAMONDS_ARRAY_WIDTH) * DIAMOND_SIZE;

      if (index < DIAMONDS_ARRAY_WIDTH) {
        diamond.kind = EMPTY_BLOCK;
        diamond.match = 0;
      } else if (diamond.match || diamond.kind === EMPTY_BLOCK) {
        diamond.kind = Math.floor(Math.random() * NUMBER_OF_DIAMONDS_TYPES);
        diamond.y = 0;
        diamond.x = row;
        diamond.match = 0;
        diamond.alpha = 255;
      }
    });
  }
  checkPossibilityMovement() {
    if (this.gameState.getIsMoving()) return;

    this.isPossibleToMove = this.gameState
      .getGameBoard()
      .some((diamond, index, diamonds) => {
        if (diamond.kind === EMPTY_BLOCK) return false;
        // move right => check in row
        if (
          index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 3 &&
          diamond.kind === diamonds[index + 2].kind &&
          diamond.kind === diamonds[index + 3].kind
        ) {
          return true;
        }
        // move right => check if is in the middle of the column
        if (
          index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 1 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) <
            DIAMONDS_ARRAY_HEIGHT - 1 &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH + 1].kind &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH + 1].kind
        ) {
          return true;
        }
        // move right ==> check if is on the top of the column
        if (
          index & (DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1) &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) <
            DIAMONDS_ARRAY_HEIGHT - 2 &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH + 1].kind &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH * 2 + 1].kind
        ) {
          return true;
        }
        // move right => check if is on the bottom of the column
        if (
          index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 2 &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH + 1].kind &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH * 2 + 1].kind
        ) {
          return true;
        }

        // move left => check in row
        if (
          index % DIAMONDS_ARRAY_WIDTH > 2 &&
          diamond.kind === diamonds[index - 2].kind &&
          diamond.kind === diamonds[index - 3].kind
        ) {
          return true;
        }
        //move left => check if is in the middle of the column
        if (
          index % DIAMONDS_ARRAY_WIDTH &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 1 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) <
            DIAMONDS_ARRAY_HEIGHT - 1 &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH - 1].kind &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH - 1].kind
        ) {
          return true;
        }

        // move left => check if is on the top of the column
        if (
          index % DIAMONDS_ARRAY_WIDTH &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) <
            DIAMONDS_ARRAY_HEIGHT - 2 &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH - 1].kind &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH * 2 - 1].kind
        ) {
          return true;
        }
        // move left => check if is on the bottom of the column

        if (
          index % DIAMONDS_ARRAY_WIDTH &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 2 &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH - 1].kind &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH * 2 - 1].kind
        ) {
          return true;
        }

        // move down => check if is column
        if (
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) <
            DIAMONDS_ARRAY_HEIGHT - 3 &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH * 2].kind &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH * 3].kind
        )
          return true;

        // move down => check if is in the middle of the row
        if (
          index % DIAMONDS_ARRAY_WIDTH &&
          index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) <
            DIAMONDS_ARRAY_HEIGHT - 1 &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH + 1].kind &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH - 1].kind
        )
          return true;
        // move down => check if is in the left edge of the row
        if (
          index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 2 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) <
            DIAMONDS_ARRAY_HEIGHT - 1 &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH + 1].kind &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH + 2].kind
        )
          return true;
        // move down => check if is in the right edge of the row
        if (
          index % DIAMONDS_ARRAY_WIDTH > 1 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) <
            DIAMONDS_ARRAY_HEIGHT - 1 &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH - 1].kind &&
          diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH - 2].kind
        )
          return true;

        // move up => check in column
        if (
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 3 &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH * 2].kind &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH * 3].kind
        )
          return true;
        // move up => check if is in the middle of the row

        if (
          index % DIAMONDS_ARRAY_WIDTH &&
          index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 1 &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH + 1].kind
        )
          return true;
        // move up => check if is in the left edge of the row

        if (
          index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 2 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 1 &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH + 1].kind &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH + 2].kind
        )
          return true;
        // move up => check if is in the right edge of the row

        if (
          index % DIAMONDS_ARRAY_WIDTH > 1 &&
          Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 1 &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH - 1].kind &&
          diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH - 2].kind
        )
          return true;
        return false;
      });

    if (!this.isPossibleToMove) {
      this.gameState.mixDiamonds();
    }
  }

  checkEndOfGame() {
    if (
      !this.gameState.getLeftMovement() &&
      !this.gameState.getIsMoving() &&
      !this.gameState.getIsSwapping()
    ) {
      media.isInLevel = false;
      media.stopBackgroundMusic();
      const isPlayerWinner = this.gameState.isPlayerWinner();
      const currentLevel = Number(this.gameState.level);
      if (isPlayerWinner && gameLevels[currentLevel]) {
        if (!userData.checkAvaiabalityLevel(currentLevel + 1)) {
          userData.addNewLevel(currentLevel + 1);
        }
      }
      if (
        userData.getHighScores(currentLevel) < this.gameState.getPlayerPoints()
      ) {
        userData.setHighScore(currentLevel, this.gameState.getPlayerPoints());
      }
      resultScreen.viewResultScreen(
        isPlayerWinner,
        this.gameState.getPlayerPoints(),
        currentLevel
      );
    } else {
      this.animationFrame = window.requestAnimationFrame(() => this.animate());
    }
  }

  swap(firstDiamond, secondDiamond) {
    [
      firstDiamond.kind,
      firstDiamond.alpha,
      firstDiamond.match,
      firstDiamond.x,
      firstDiamond.y,
      secondDiamond.kind,
      secondDiamond.alpha,
      secondDiamond.match,
      secondDiamond.x,
      secondDiamond.y,
    ] = [
      secondDiamond.kind,
      secondDiamond.alpha,
      secondDiamond.match,
      secondDiamond.x,
      secondDiamond.y,
      firstDiamond.kind,
      firstDiamond.alpha,
      firstDiamond.match,
      firstDiamond.x,
      firstDiamond.y,
    ];
    this.gameState.setIsMoving(true);
  }
}

export const game = new Game();
