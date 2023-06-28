import { canvas } from "./Canvas";
import { Common, HIDDEN_SCREEN, VISIBLE_SCREEN } from "./Common";
import { game } from "./Game";
import { gameLevels } from "./GameLevels";

import { DATA_LOADED_EVENT_NAME, loader } from "./Loader";
import { media } from "./Media";
import { userData } from "./UserData";

const LEVEL_SELECT_BUTTON_ID = "level-select__button";
const LEVEL_SELECT_ID = "js-level-select-screen";

class LevelSelect extends Common {
  constructor() {
    super(LEVEL_SELECT_ID);
  }

  createButtons() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    gameLevels.some(({ level }) => this.createButton(level));
  }
  createButton(value) {
    if (!userData.checkAvaiabalityLevel(value)) {
      return true;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(LEVEL_SELECT_BUTTON_ID);
    button.textContent = value;
    button.value = value;
    button.addEventListener("click", (event) =>
      this.buttonOnClickHandler(event)
    );

    this.element.appendChild(button);
  }
  buttonOnClickHandler(event) {
    this.changeVisibilityScreen(this.element, HIDDEN_SCREEN);
    this.changeVisibilityScreen(canvas.element, VISIBLE_SCREEN);
    this.loadLevel(event.currentTarget.value);
  }

  loadLevel(level) {
    if (
      media.backgroundImage &&
      media.diamondsSprite &&
      media.backgroundMusic &&
      media.swapSound
    ) {
      game.playLevel(level);

      return;
    }

    if (!media.diamondsSprite) {
      media.diamondsSprite = loader.loadImage(
        "../public/images/diamonds-transparent.png"
      );
    }
    if (!media.backgroundImage) {
      media.backgroundImage = loader.loadImage(
        "../public/images/levelbackground.png"
      );
    }

    if (!media.swapSound) {
      media.swapSound = loader.loadSound(
        "../public/sounds/stone_rock_or_wood_moved.mp3"
      );
    }

    if (!media.backgroundMusic) {
      media.backgroundMusic = loader.loadSound(
        "../public/sounds/music-background.mp3"
      );
    }

    window.addEventListener(DATA_LOADED_EVENT_NAME, () =>
      game.playLevel(level)
    );
  }
}

export const levelSelect = new LevelSelect();
