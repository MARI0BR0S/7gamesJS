import { UI } from "./Ui.js";

export class Timer extends UI {
  #element = null;
  numberOfSeconds = 0;
  maxNumberOfSeconds = 999;
  #interval = null;
  init() {
    this.#element = this.getElement(this.UiSelectors.timer);
  }
  #startTimer() {
    this.#interval = setInterval(() => this.#updateTimer(), 1000);
  }
  #updateTimer() {
    this.numberOfSeconds++;
    this.numberOfSeconds <= this.maxNumberOfSeconds
      ? this.#setTimerValue(this.numberOfSeconds)
      : this.stopTimer();
  }
  resetTimer() {
    this.numberOfSeconds = 0;
    this.#setTimerValue(this.numberOfSeconds);
    this.stopTimer();
    this.#startTimer();
  }
  stopTimer() {
    clearInterval(this.#interval);
  }
  #setTimerValue(value) {
    this.#element.textContent = value;
  }
}
