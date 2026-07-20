export class Progress {
  constructor() {
    this.mapId = "Home";
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = "down";
    this.saveFileKey = "rpgGame_SaveFile1";
  }

  save() {
    window.localStorage.setItem(
      this.saveFileKey,
      JSON.stringify({
        mapId: this.mapId,
        startingHeroX: this.startingHeroX,
        startingHeroY: this.startingHeroY,
        startingHeroDirection: this.startingHeroDirection,
        playerState: {
          animals: window.playerState.animals,
          lineup: window.playerState.lineup,
          items: window.playerState.items,
          storyFlags: window.playerState.storyFlags,
          coins: window.playerState.coins,
          badges: window.playerState.badges,
          stats: window.playerState.stats,
          nextId: window.playerState.nextId,
        },
      })
    );
  }

  getSaveFile() {
    if (!window.localStorage) {
      return null;
    }

    const saveFile = window.localStorage.getItem(this.saveFileKey);
    return saveFile ? JSON.parse(saveFile) : null;
  }

  load() {
    const file = this.getSaveFile();

    if (file) {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;
      Object.assign(window.playerState, file.playerState);
      window.playerState.coins ||= 0;
      window.playerState.badges ||= [];
      window.playerState.stats ||= { battlesWon: 0, animalsRescued: 0 };
      window.playerState.nextId ||= 1;
    }
  }
}
