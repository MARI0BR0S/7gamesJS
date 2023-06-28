import { Quote } from "./Quote";
export default class Game {
  currentStep = 0;
  lastStep = 7;
  quotes = [
    {
      text: "Pan Tadeusz",
      category: "Utwór Literacki",
    },
    {
      text: "Lalka",
      category: "Utwór Literacki",
    },
    {
      text: "Wesele",
      category: "Utwór Literacki",
    },

    {
      text: "Szybcy i wsciekli",
      category: "Film",
    },
    {
      text: "Ogniem i mieczem",
      category: "Film",
    },
  ];

  constructor({ lettersWrapper, categoryWrapper, wordWrapper, outputWrapper }) {
    this.lettersWrapper = lettersWrapper;
    this.categoryWrapper = categoryWrapper;
    this.wordWrapper = wordWrapper;
    this.outputWrapper = outputWrapper;
    const { text, category } =
      this.quotes[Math.floor(Math.random() * this.quotes.length)];
    categoryWrapper.textContent = category;
    this.quote = new Quote(text.toLowerCase());
  }

  drawLetters() {
    for (let i = 0; i < 26; i++) {
      const label = (i + 10).toString(36);
      const button = document.createElement("button");
      button.textContent = label;
      button.addEventListener("click", (event) => this.guess(label, event));
      this.lettersWrapper.appendChild(button);
    }
  }
  drawQuote() {
    const content = this.quote.getContent();
    this.wordWrapper.textContent = content;
    if (!content.includes("_")) this.winning();
  }
  guess(letter, event) {
    event.target.disabled = true;
    if (this.quote.guess(letter)) {
      this.drawQuote();
    } else {
      this.currentStep++;
      document.getElementsByClassName("step")[
        this.currentStep
      ].style.opacity = 1;
      if (this.currentStep === this.lastStep) this.losing();
    }
  }

  start() {
    this.drawLetters();
    this.drawQuote();
    document.getElementsByClassName("step")[this.currentStep].style.opacity = 1;
  }

  winning() {
    this.wordWrapper.textContent = "Gratulacje hehe ehehehehe";
    this.lettersWrapper.textContent = "";
  }

  losing() {
    this.wordWrapper.textContent =
      "Gratulacje hehe ehehehehe tyym razem przegrałes ";
    this.lettersWrapper.textContent = "";
  }
}
