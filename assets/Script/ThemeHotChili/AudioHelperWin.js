

AHW = cc.Class({
    name: 'AudioHelperWin',   
    ctor() {
        this.SET_MUSIC_VOLUME_KEY = 'AHE_SET_MUSIC_VOLUME';
        this.SET_EFFECTS_VOLUME_KEY = 'AHE_SET_EFFECTS_VOLUME';
        this._playingMusic = '';

        this._effectsVolume = 1;
        this._musicVolume = 1;

        this._effectsVolumeSetting = 1;
        this._musicVolumeSetting = 1;

        this._effectsVolumeFade = 1;
        this._musicVolumeFade = 1;

        this.loadSettings();
    },

    loadSettings() {
        this._musicVolumeSetting = parseFloat(cc.sys.localStorage.getItem(this.SET_MUSIC_VOLUME_KEY, 1.0));
        this._effectsVolumeSetting = parseFloat(cc.sys.localStorage.getItem(this.SET_EFFECTS_VOLUME_KEY, 1.0));
    },

    saveSettings() {
        cc.sys.localStorage.setFloatForKey(this.SET_MUSIC_VOLUME_KEY, this._musicVolumeSetting);
        cc.sys.localStorage.setFloatForKey(this.SET_EFFECTS_VOLUME_KEY, this._effectsVolumeSetting);
    },

    preloadEffect(fileName) {
        cc.audioEngine.preloadEffect(fileName);
    },

    unloadEffect(fileName) {
        cc.audioEngine.unloadEffect(fileName);
    },

    playEffect(fileName, isLoop) {
        const volume = this._effectsVolume * this._effectsVolumeSetting;
        const ret = cc.audioEngine.playEffect(fileName, isLoop, 1, 0, volume);
        return ret;
    },

    stopEffect(effectId) {
        cc.audioEngine.stopEffect(effectId);
    },

    stopAllEffects() {
        cc.audioEngine.stopAllEffects();
    },

    getEffectsVolume() {
        return this._effectsVolume;
    },

    setEffectsVolume(v) {
        v = Math.max(0, Math.min(1, v || 1));
        this._effectsVolume = v;
        cc.audioEngine.setEffectsVolume(v);
    },

    getEffectsVolumeSetting() {
        return this._effectsVolumeSetting;
    },

    setEffectsVolumeSetting(v) {
        v = Math.max(0, Math.min(1, v || 1));
        this._effectsVolumeSetting = v;
        cc.audioEngine.setEffectsVolume(v);
    },

    preloadMusic(fileName) {
        cc.audioEngine.preloadMusic(fileName);
    },

    playMusic(fileName, isLoop) {
        if (this.isMusicPlaying()) {
            if (this._playingMusic === fileName) {
                cc.log('[AudioEngine] playing same music.');
                return;
            } else {
                this.stopMusic();
            }
        }
        const volume = this._musicVolume * this._musicVolumeSetting;
        cc.audioEngine.playMusic(fileName, isLoop);
        cc.audioEngine.setMusicVolume(volume);
        if (!this.isMusicPlaying()) return;
        this._playingMusic = fileName;
    },

    stopMusic() {
        if (this.isMusicPlaying()) {
            cc.audioEngine.stopMusic();
        }
        this.cleanPlayingMusicRecord();
    },

    isMusicPlaying() {
        const ret = cc.audioEngine.isMusicPlaying();
        if (!ret) this.cleanPlayingMusicRecord();
        return ret;
    },

    getPlayingMusicFileName() {
        this.isMusicPlaying();
        return this._playingMusic;
    },

    cleanPlayingMusicRecord() {
        this._playingMusic = '';
    },

    getMusicVolume() {
        return this._musicVolume;
    },

    setMusicVolume(v) {
        v = Math.max(0, Math.min(1, v || 1));
        this._musicVolume = v;
        this.updatePlayingMusicVolume();
    },

    getMusicVolumeSetting() {
        return this._musicVolumeSetting;
    },

    setMusicVolumeSetting(v) {
        v = Math.max(0, Math.min(1, v || 1));
        this._musicVolumeSetting = v;
        this.updatePlayingMusicVolume();
    },

    getMusicVolumeFade() {
        return this._musicVolumeFade;
    },

    setMusicVolumeFade(v) {
        v = Math.max(0, Math.min(1, v || 1));
        this._musicVolumeFade = v;

        this.updatePlayingMusicVolume();
    },

    pauseMusic() {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic() {
        cc.audioEngine.resumeMusic();
    },

    pauseAll() {
        this.pauseMusic();
        cc.audioEngine.pauseAllEffects();
    },

    resumeAll() {
        this.resumeMusic();
        cc.audioEngine.resumeAllEffects();
    },

    unloadAll() {

    },

    updatePlayingMusicVolume() {
        if (this.isMusicPlaying()) {
            const volume = this._musicVolume * this._musicVolumeSetting * this._musicVolumeFade;
            cc.audioEngine.setMusicVolume(volume);
        }
    },
});
