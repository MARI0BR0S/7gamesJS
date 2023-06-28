import { UI } from "./Ui";

export class Counter extends UI {
  value = null;
  #element = null;

  init() {
    this.#element = this.getElement(this.UiSelectors.counter);
  }

  setValue(value) {
    this.value = value;
    this.#updateHTML();
  }
  #updateHTML() {
    this.#element.textContent = this.value;
  }
  increment() {
    this.value++;
    this.#updateHTML();
  }

  decrement() {
    this.value--;
    this.#updateHTML();
  }
}
