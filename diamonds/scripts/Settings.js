import { Common, HIDDEN_CLASS, HIDDEN_SCREEN, VISIBLE_SCREEN } from "./Common";
import { media } from "./Media";

const SETTINGS_SCREEN_ID = "js-settings-screen";

const MUSIC_ON_OFF_BUTTON_ID = "js-music-on-off";

const MUSIC_VOLUME_INCREASE_ID = "js-music-volume-increase";

const MUSIC_VOLUME_DECREASE_ID = "js-music-volume-decrease";

const SOUND_ON_OFF_BUTTON_ID = "js-sound-on-off";

const SOUND_VOLUME_INCREASE_ID = "js-sound-volume-increase";

const SOUND_VOLUME_DECREASE_ID = "js-sound-volume-decrease";

const SETTINGS_EXIT_BUTTON_ID = "js-settings-screen-exit-button";

class Settings extends Common {
  constructor() {
    super(SETTINGS_SCREEN_ID);
    this.bindToElements();
  }
  bindToElements() {
    const settingsElementExit = this.bindToElement(SETTINGS_EXIT_BUTTON_ID);
    const musicOnOffElement = this.bindToElement(MUSIC_ON_OFF_BUTTON_ID);
    const musicVolumeUpElement = this.bindToElement(MUSIC_VOLUME_INCREASE_ID);
    const musicVolumeDownElement = this.bindToElement(MUSIC_VOLUME_DECREASE_ID);
    const soundOnOffElement = this.bindToElement(SOUND_ON_OFF_BUTTON_ID);
    const soundVolumeUpElement = this.bindToElement(SOUND_VOLUME_INCREASE_ID);
    const soundVolumeDownElement = this.bindToElement(SOUND_VOLUME_DECREASE_ID);

    settingsElementExit.addEventListener("click", () => {
      this.changeVisibilityScreen(this.element, HIDDEN_SCREEN);
    });

    musicOnOffElement.addEventListener("click", () => media.toggleMusicOnOff());
    musicVolumeUpElement.addEventListener("click", () =>
      media.increaseMusicVolume()
    );
    musicVolumeDownElement.addEventListener("click", () =>
      media.decreaseMusicVolume()
    );
    soundOnOffElement.addEventListener("click", () => media.toggleSoundOnOff());
    soundVolumeUpElement.addEventListener("click", () =>
      media.increaseSoundVolume()
    );
    soundVolumeDownElement.addEventListener("click", () =>
      media.decreaseSoundVolume()
    );
  }
}

export const settings = new Settings();
