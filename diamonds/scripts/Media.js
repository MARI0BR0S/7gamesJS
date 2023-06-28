class Media {
  #backgroundImage = null;
  #diamondsSprite = null;
  musicVolume = 0.5;
  soundVolume = 0.5;
  allowedMusic = true;
  allowedSound = true;
  #swapSound = null;
  #backgroundMusic = null;
  isInLevel = false;

  increaseMusicVolume() {
    this.musicVolume += 0.1;
    if (this.musicVolume > 1) this.musicVolume = 1;
    if (this.backgroundMusic) this.#backgroundMusic.volume = this.musicVolume;
  }
  decreaseMusicVolume() {
    this.musicVolume -= 0.1;
    if (this.musicVolume < 0) this.musicVolume = 0;
    if (this.#backgroundMusic) this.#backgroundMusic.volume = this.musicVolume;
  }

  increaseSoundVolume() {
    this.soundVolume += 0.1;
    if (this.soundVolume > 1) this.soundVolume = 1;
    if (this.#swapSound) this.#swapSound.volume = this.soundVolume;
  }
  decreaseSoundVolume() {
    this.soundVolume -= 0.1;
    if (this.soundVolume < 0) this.soundVolume = 0;

    this.#swapSound.volume = this.soundVolume;
  }

  playBackgroundMusic() {
    if (!this.allowedMusic || !this.#backgroundMusic) return;

    this.#backgroundMusic.loop = true;
    this.#backgroundMusic.play();
  }

  stopBackgroundMusic() {
    this.#backgroundMusic.pause();
  }

  playSwapSound() {
    if (!this.allowedSound) return;
    this.#swapSound.play();
  }

  set swapSound(sound) {
    this.#swapSound = sound;
    this.#swapSound.volume = this.soundVolume;
  }

  set backgroundMusic(music) {
    this.#backgroundMusic = music;
    this.#backgroundMusic.volume = this.musicVolume;
  }

  get swapSound() {
    return Boolean(this.#swapSound);
  }
  get backgroundMusic() {
    return !!this.#backgroundMusic;
  }

  toggleMusicOnOff() {
    if (this.allowedMusic) {
      this.allowedMusic = false;
      this.stopBackgroundMusic();
    } else {
      this.allowedMusic = true;
      this.playBackgroundMusic();
    }
  }
  toggleSoundOnOff() {
    if (this.allowedSound) {
      this.allowedSound = false;
    }
    this.allowedSound = true;

    return;
  }
  set backgroundImage(imageObject) {
    if (!imageObject instanceof Image) {
      return;
    }
    this.#backgroundImage = imageObject;
  }
  get backgroundImage() {
    return this.#backgroundImage;
  }

  set diamondsSprite(imageObject) {
    if (!imageObject instanceof Image) {
      return;
    }
    this.#diamondsSprite = imageObject;
  }
  get diamondsSprite() {
    return this.#diamondsSprite;
  }
}

export const media = new Media();
