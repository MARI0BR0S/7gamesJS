import { UI } from "./Ui.js";

export class ResetButton extends UI {
  element = this.getElement(this.UiSelectors.resetButton);
  changeEmotion(emotion) {
    this.element
      .querySelector("use")
      .setAttribute("href", `/sprite.svg#${emotion}`);
  }
}
