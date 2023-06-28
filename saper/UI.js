export class UI {
  UiSelectors = {
    board: `[data-board]`,
    cell: `[data-cell]`,
    counter: `[data-counter]`,
    timer: `[data-timer]`,
    resetButton: `[data-button-reset]`,
    easyButton: `[data-button-easy]`,
    modal: `[data-modal]`,
    modalHeader: `[data-modal-header]`,
    modalButton: `[data-modal-button]`,
    hardButton: `[data-button-hard]`,
    expertButton: `[data-button-expert]`,
  };

  getElement(selector) {
    return document.querySelector(selector);
  }

  getElements(selectors) {
    return document.querySelectorAll(selectors);
  }
}
