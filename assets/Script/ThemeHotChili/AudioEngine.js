require("./AudioHelperWin");

const isIOS = cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD;
const isWinRT = cc.sys.platform === cc.sys.WINRT;

AudioHelper = new AHW();
// if (isWinRT) {
//     const audioClass = require("AudioHelper/AudioHelperWin");
//     AudioHelper = new audioClass();
// } else if (isIOS) {
//     require("AudioHelper/AudioHelperExperimental");
//     AudioHelper = new AudioHelperExperimental();
// } else {
//     require("AudioHelper/AudioHelperSimple");
//     AudioHelper = new AudioHelperSimple();
// }

AudioEngine = {
    saveSettings() { 
        AudioHelper.saveSettings(); 
    },
    
    preloadEffect(fileName) { 
        AudioHelper.preloadEffect(fileName); 
    },
    
    unloadEffect(fileName) { 
        AudioHelper.unloadEffect(fileName); 
    },
    
    playEffect(fileName, isLoop) {
        if (cc.loader.md5Pipe && cc.loader.md5Pipe.transformURL) {
            fileName = cc.loader.md5Pipe.transformURL(fileName);
        }
        if (cc.loader.getRes(fileName)) {
            return AudioHelper.playEffect(fileName, isLoop);
        }
    },
    
    stopEffect(effectId) { 
        AudioHelper.stopEffect(effectId); 
    },
    
    stopAllEffects() { 
        AudioHelper.stopAllEffects(); 
    },
    
    getEffectsVolume() { 
        return AudioHelper.getEffectsVolume(); 
    },
    
    setEffectsVolume(v) { 
        AudioHelper.setEffectsVolume(v); 
    },
    
    getEffectsVolumeSetting() { 
        return AudioHelper.getEffectsVolumeSetting(); 
    },
    
    setEffectsVolumeSetting(v) { 
        AudioHelper.setEffectsVolumeSetting(v); 
    },
    
    preloadMusic(fileName) { 
        AudioHelper.preloadMusic(fileName); 
    },
    
    playMusic(fileName, isLoop, duration) {
        if (cc.loader.md5Pipe && cc.loader.md5Pipe.transformURL) {
            fileName = cc.loader.md5Pipe.transformURL(fileName);
        }
        if (cc.loader.getRes(fileName)) {
            if (duration) {
                AudioHelper.setMusicVolumeFade(0);
                this.fadeMusic(duration, 1, 1);
            }
            AudioHelper.playMusic(fileName, isLoop);
        }
    },
    
    fadeMusic(duration, inOrOut, percent) {
        duration = duration || 0.5;
        inOrOut = inOrOut || 0;
        percent = percent || inOrOut;
        
        if (AudioHelper.isMusicPlaying()) {
            const beginVolume = AudioHelper.getMusicVolumeFade();
            const deltaVolume = (percent - beginVolume) / 10;

            cc.director
            .getScheduler()
            .schedule((dt) => {
                if (AudioHelper.getMusicVolumeFade() == percent) {
                    cc.director.getScheduler().unscheduleAllForTarget(this)
                } else {
                    AudioHelper.setMusicVolumeFade(AudioHelper.getMusicVolumeFade() + deltaVolume)
                }
            }, this, duration / 10, cc.macro.REPEAT_FOREVER, 0,false,'fade_music_owner');
        }
    },
    
    stopMusicFade() {
        cc.director.getScheduler().unscheduleAllForTarget(this);
        AudioHelper.setMusicVolumeFade(1);
    },
    
    stopMusic() { 
        AudioHelper.stopMusic(); 
    },
    
    isMusicPlaying() { 
        return AudioHelper.isMusicPlaying(); 
    },
    
    getPlayingMusicFileName() { 
        return AudioHelper.getPlayingMusicFileName(); 
    },
    
    cleanPlayingMusicRecord() { 
        AudioHelper.cleanPlayingMusicRecord(); 
    },
    
    getMusicVolume() { 
        return AudioHelper.getMusicVolume(); 
    },
    
    setMusicVolume(v) { 
        AudioHelper.setMusicVolume(v); 
    },
    
    getMusicVolumeSetting() { 
        return AudioHelper.getMusicVolumeSetting(); 
    },
    
    setMusicVolumeSetting(v) { 
        AudioHelper.setMusicVolumeSetting(v); 
    },
    
    getMusicVolumeFade() { 
        return AudioHelper.getMusicVolumeFade(); 
    },
    
    setMusicVolumeFade(v) { 
        AudioHelper.setMusicVolumeFade(v); 
    },
    
    pauseMusic() { 
        AudioHelper.pauseMusic(); 
    },
    
    resumeMusic() { 
        AudioHelper.resumeMusic(); 
    },
    
    pauseAll() { 
        AudioHelper.pauseAll(); 
    },
    
    resumeAll() { 
        AudioHelper.resumeAll(); 
    },
    
    unloadAll() { 
        AudioHelper.unloadAll(); 
    },
};

