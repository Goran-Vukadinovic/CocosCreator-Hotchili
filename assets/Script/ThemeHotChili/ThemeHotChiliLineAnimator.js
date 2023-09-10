ThemeHotChiliLineAnimator = cc.Class({
    name:"ThemeHotChiliLinAnimator",
    ctor () {
        this.spinElementList = [];
    },

    destruct () {
    },

    sync () {
        this.spinElementList = [];
        
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.BONUS ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAPFREE) {
            
            const spinReelList = ThemeHotChili.gameLayer.spinLayer.spinTable.cellList;
            
            for (let i = 0; i < spinReelList.length; i++) {
                const elementIdxList = spinReelList[i].getVisibleCellsIndexList();
                
                for (let j = 0; j < elementIdxList.length; j++) {
                    this.spinElementList.push(spinReelList[i].cells[elementIdxList[j]]);
                }
            }
        }
    },

    performLineAnimation (posList, ignoreMask) {
        this.stopAnimation(ignoreMask);
        
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAPFREE) {
            
            for (let i = 0; i < posList.length; i++) {
                if (posList[i] > 0) {
                    this.spinElementList[i].performLineAnimation();
                }
            }
        }
    },
    performAnimation (posList, ignoreMask) {
        this.stopAnimation(ignoreMask);
        
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAPFREE) {
            
            for (let i = 0; i < posList.length; i++) {
                if (posList[i] > 0) {
                    this.spinElementList[i].performAnimation(posList[i]);
                }
            }
        }
    },

    stopLineAnimation () {
        for (let i = 0; i < this.spinElementList.length; i++) {
            this.spinElementList[i].stopLineAnimation();
        }
    },

    stopAnimation (ignoreMask) {
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAPFREE) {
            
            for (let i = 0; i < this.spinElementList.length; i++) {
                if (ignoreMask && ignoreMask[i] > 0) {
                } else {
                    this.spinElementList[i].stopAnimation();
                }
            }
        }
    },

    performAllLine (table, wildHitPos) {
        for (let i = 0; i < this.spinElementList.length; i++) {
            if (table[i] !== 0) {
                this.spinElementList[i].performLineAnimation();
                this.spinElementList[i].performAnimation();
            }
        }
    },
});
