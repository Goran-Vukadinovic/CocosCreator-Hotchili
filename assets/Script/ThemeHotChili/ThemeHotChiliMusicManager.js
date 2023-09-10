ThemeHotChiliMusicManager = cc.Class({
    extends: cc.Node,

    ctor() {
        this.init();
    },

    init() {
        return true;
    },

    fadeMusic(delayTime, fadingTime, beginVolume, targetVolume) {
        ThemeHotChili.ctl.stopFadeMusicActionNode();
        ThemeHotChili.ctl.fadeLoopMusic(delayTime, fadingTime, beginVolume, targetVolume);
    },
    playNG_BGM() {
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN) {
            if (AudioEngine.getPlayingMusicFileName() === ThemeHotChili.AudioPath + 'ngbgm.mp3' || !AudioEngine.isMusicPlaying()) {
                this.fadeMusicActionNode.stop();
                AudioEngine.setMusicVolume(1);
                AudioEngine.playMusic(ThemeHotChili.AudioPath + 'ngbgm.mp3', true);
            }
        }
    },
    
    fadeNG_BGM() {
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN) {
            if (AudioEngine.getPlayingMusicFileName() === ThemeHotChili.AudioPath + 'ngbgm.mp3') {
                this.fadeMusic(3, 2, 1, 0);
            }
        }
    },
    
    playFG_BGM() {
        if (AudioEngine.getPlayingMusicFileName() !== ThemeHotChili.AudioPath + 'fgbgm.mp3') {
            AudioEngine.setMusicVolume(1);
            AudioEngine.playMusic(ThemeHotChili.AudioPath + 'fgbgm.mp3', true);
        }
    },
    
});
