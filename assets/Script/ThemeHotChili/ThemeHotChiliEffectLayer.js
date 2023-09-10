ThemeHotChiliEffectLayer = cc.Class({
    extends: cc.Node,

    ctor() {
        this.TAG = 'ThemeHotChili.EffectLayer';
        this.lineAnimator = null;
        this.spinResult = null;
        this.eachLineShowIndex = null;
        this.totalWinToAdd = 0;

        this.showInAdvancePos = null;
        this.scatterHitPos = null;
        this.eachLineAnimationInterval = 2.0;

        this.winEffectIds = [];
        this.winMusic = null;

        this.state = ThemeHotChili.WinShowState.Idle;
        this.performList = [];

        this.init();
    },

    init() {
        this.lineAnimator = new ThemeHotChiliLineAnimator();

        this.bgmControlNode = new cc.Node();
        this.addChild(this.bgmControlNode);

        this.performList = [];
        this.showInAdvancePos = {};
        this.scatterHitPos = {};
        this.wildHitPos = {};
        this.allLineHitPos = {};

        this._setCascadeOpacityEnabled(true);
        return true;
    },
    perform(result) {
        if (this.state === ThemeHotChili.WinShowState.Idle) {
            this.spinResult = result;
            this.clearPerformList();
            this.totalWinToAdd = this.spinResult.total_win;
            this.assemblePerformList();
            this.lineAnimator.sync();
            this.stateChangeTo(ThemeHotChili.WinShowState.Checking);
        }
    },
    assemblePerformList() {
        this.fgWin = false;
        this.mapWin = false;
        this.linesWin = false;
        this.bigWin = false;
        this.bgWin = false;
    
        if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType()) {
            for (let i = 1; i <= ThemeHotChili.CellNum; i++) {
                this.allLineHitPos[i] = 0;
                this.showInAdvancePos[i] = 0; //现在用于不停下所有的中奖动效
                this.wildHitPos[i] = 0;
                this.scatterHitPos[i] = 0;
            }
        } else if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType()) {
            for (let i = 1; i <= 5 * (6 - ThemeHotChili.gameLayer.fgType); i++) {
                this.allLineHitPos[i] = 0;
                this.showInAdvancePos[i] = 0; //现在用于不停下所有的中奖动效
                this.wildHitPos[i] = 0;
                this.scatterHitPos[i] = 0;
            }
        }
        if (self.spinResult.free_game_trig && self.spinResult.free_game_trig === 1) {
            this.scatterHitPos = self.spinResult.sf_hit_pos;
            this.fgWin = true;
            this.performList[ThemeHotChili.WinShowState.ScatterAnimation] = 1;
            
            if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType()) {
                this.performList[ThemeHotChili.WinShowState.StandbyBeforeFreeGameEnter] = 1;
            } else if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType()) {
                this.performList[ThemeHotChili.WinShowState.FreeGameTrigger] = 1;
            }
        }
        
        if (self.spinResult.total_win === 0 && !this.fgWin && !this.mapWin) {
            this.performList[ThemeHotChili.WinShowState.NoWinDelay] = 1;
        } else {
            this.performList[ThemeHotChili.WinShowState.WinDelay] = 1;
        }
        
        if (self.spinResult.win_lines && self.spinResult.win_lines.length > 0) {
            this.linesWin = true;
        
            for (let i = 0; i < self.spinResult.win_lines.length; i++) {
                const hit_pos = self.spinResult.win_lines[i].hit_pos;
        
                for (let j = 0; j < hit_pos.length; j++) {
                    if (2 === hit_pos[j]) {
                        this.wildHitPos[j] = 1;
                    }
                }
            }
        
            this.performList[ThemeHotChili.WinShowState.SymbolLineAnimation] = 1;
        }
        if (self.spinResult.big_win || self.spinResult.super_win || self.spinResult.mega_win || self.spinResult.epic_win || self.spinResult.ultimate_win) {
            this.linesWin = true;
            this.bigWin = true;
            this.performList[ThemeHotChili.WinShowState.SymbolLineAnimation] = 0;
            this.performList[ThemeHotChili.WinShowState.BigWinAnimation] = 1;
        } else {
            if (this.totalWinToAdd === self.spinResult.credit_win) {
                this.totalWinToAdd = 0;
            }
        }
        
        const linesWin = self.spinResult.win_lines;
        
        for (let i = 0; i < linesWin.length; i++) {
            for (let j = 0; j < linesWin[i].hit_pos.length; j++) {
                if (linesWin[i].hit_pos[j] !== 0) {
                    this.allLineHitPos[j] = 1;
                    this.showInAdvancePos[j] = 1;
                }
            }
        }
        
        for (let i = 0; i < this.scatterHitPos.length; i++) {
            if (this.scatterHitPos[i] === 1) {
                this.showInAdvancePos[i] = 1;
            }
        }
        
        if (self.spinResult.sb_hit_pos) {
            for (let i = 0; i < self.spinResult.sb_hit_pos.length; i++) {
                if (self.spinResult.sb_hit_pos[i] === 1) {
                    this.showInAdvancePos[i] = 1;
                }
            }
        }
        
        for (let i = 0; i < self.spinResult.item_list[3].length; i++) {
            if (self.spinResult.item_list[3][i] >= 14 && self.spinResult.item_list[3][i] <= 17) {
                this.performList[ThemeHotChili.WinShowState.MultiFly] = 1;
            }
        }
        
        if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType()) {
            if (self.spinResult.item_list_new && self.spinResult.item_list_new[3]) {
                for (let i = 0; i < self.spinResult.item_list_new[3].length; i++) {
                    if (self.spinResult.item_list_new[3][i] >= 14 && self.spinResult.item_list_new[3][i] <= 17) {
                        this.performList[ThemeHotChili.WinShowState.MultiFly] = 1;
                    }
                }
            }
        }
        if (self.spinResult.credit_win && self.spinResult.credit_win > 0) {
            this.performList[ThemeHotChili.WinShowState.ChipWin] = 1;
        }
        
        if (self.spinResult.bonus_game_trig && self.spinResult.bonus_game_trig === 1) {
            this.bgWin = true;
            this.performList[ThemeHotChili.WinShowState.StandbyBeforeBonusGameEnter] = 1;
        }
        
        if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType()) {
            if (self.spinResult.respin_info_list && self.spinResult.respin_info_list[1]) {
                this.performList[ThemeHotChili.WinShowState.ReSpin] = 1;
            }
        }
    },
});
ThemeHotChiliEffectLayer.prototype.clearPerformList = function() {
    for (let i = ThemeHotChili.WinShowState.Idle; i < ThemeHotChili.WinShowState.Checking; i++) {
        this.performList[i] = 0;
    }
};

ThemeHotChiliEffectLayer.prototype.checkPerformList = function() {
    let toPerformIndex = -1;

    for (let i = ThemeHotChili.WinShowState.Idle; i < ThemeHotChili.WinShowState.Checking; i++) {
        if (this.performList[i] === 1) {
            toPerformIndex = i;
            break;
        }
    }

    if (toPerformIndex === -1) {
        this.stateChangeTo(ThemeHotChili.WinShowState.Idle);
        return;
    }

    this.performList[toPerformIndex] = 0;

    if (ThemeHotChili.WinShowState.NoWinDelay === toPerformIndex) {
        this.performNoWinDelay();
    } else if (ThemeHotChili.WinShowState.FreeGameTrigger === toPerformIndex) {
        this.performFreeGameTrigger();
    } else if (ThemeHotChili.WinShowState.ScatterAnimation === toPerformIndex) {
        this.performScatterAnimation();
    } else if (ThemeHotChili.WinShowState.BigWinAnimation === toPerformIndex) {
        this.performBigWinAnimation();
    } else if (ThemeHotChili.WinShowState.SymbolLineAnimation === toPerformIndex) {
        this.performSymbolLineAnimation();
    } else if (ThemeHotChili.WinShowState.StandbyBeforeBonusGameEnter === toPerformIndex) {
        this.bgInTemp = 0;
        this.performStandbyBeforeBonusGameEnter();
    } else if (ThemeHotChili.WinShowState.BonusGameEnter === toPerformIndex) {
        this.performBonusGameEnter();
    } else if (ThemeHotChili.WinShowState.StandbyBeforeFreeGameEnter === toPerformIndex) {
        this.performStandbyBeforeFreeGameEnter();
    } else if (ThemeHotChili.WinShowState.WinDelay === toPerformIndex) {
        this.performWinDelay();
    } else if (ThemeHotChili.WinShowState.MultiFly === toPerformIndex) {
        this.performMultiFly();
    } else if (ThemeHotChili.WinShowState.ChipWin === toPerformIndex) {
        this.ChipWinTemp = 0;
        this.performChipWin();
    } else if (ThemeHotChili.WinShowState.ReSpin === toPerformIndex) {
        this.ReSpinTemp = 0;
        this.performReSpin();
    }
};
ThemeHotChiliEffectLayer.prototype.performReSpin = function() {
    if (this.ReSpinTemp === 0) {
        this.stateChangeTo(ThemeHotChili.WinShowState.ReSpin);
        ThemeHotChili.ctl.disableSpinAndOtherBtns();
        ThemeHotChili.gameLayer.spinLayer.spinTable.performReSpin(this.spinResult);
    } else {
        TimerCallFunc.addCallFunc(this.stopPerformUnit, 0.1, this, this);
    }
};

ThemeHotChiliEffectLayer.prototype.performChipWin = function() {
    if (this.ChipWinTemp === 0) {
        this.stateChangeTo(ThemeHotChili.WinShowState.ChipWin);
        ThemeHotChili.ctl.disableSpinAndOtherBtns();
        ThemeHotChili.gameLayer.spinLayer.spinTable.performChipWin(this.spinResult);
    } else {
        TimerCallFunc.addCallFunc(this.stopPerformUnit, 0.1, this, this);
    }
};

ThemeHotChiliEffectLayer.prototype.performMultiFly = function() {
    this.stateChangeTo(ThemeHotChili.WinShowState.MultiFly);
    ThemeHotChili.ctl.disableSpinAndOtherBtns();
    ThemeHotChili.gameLayer.spinLayer.spinTable.performMultiFly();

    let time = 0.1;
    let item_list = (this.spinResult.item_list_new && this.spinResult.item_list_new[1] && this.spinResult.item_list_new) || this.spinResult.item_list;

    if (this.spinResult.credit_win && this.spinResult.credit_win > 0) {
        for (let i = 0; i < item_list[3].length; i++) {
            if (item_list[3][i] >= 14 && item_list[3][i] <= 17) {
                time = 1.67;
                break;
            }
        }
    }

    if (this.spinResult.free_game_trig && this.spinResult.free_game_trig === 1) {
        time = 1.67;
        if (this.spinResult.bow_state[2] > this.spinResult.bow_state[1]) {
            time = 3.2;
        }
    }

    TimerCallFunc.addCallFunc(this.stopPerformUnit, time, this, this);
};
ThemeHotChiliEffectLayer.prototype.stopPerformUnit = function() {
    TimerCallFunc.unscheduleFunc(this.stopPerformUnit, this, this);
    this.stateChangeTo(ThemeHotChili.WinShowState.Checking);
};

ThemeHotChiliEffectLayer.prototype.performNoWinDelay = function() {
    this.stateChangeTo(ThemeHotChili.WinShowState.NoWinDelay);
    ThemeHotChili.gameLayer.musicManager.fadeNG_BGM();
    TimerCallFunc.addCallFunc(function() {
        ThemeHotChili.ctl.enableSpin();
    }, 0.1, this, this);
    ThemeHotChili.ctl.footer.setLabelDescription('Intro');

    if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType() ||
        THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType()) {
        TimerCallFunc.addCallFunc(this.stopPerformUnit, 1, this, this);
    }
};

ThemeHotChiliEffectLayer.prototype.performWinDelay = function() {
    this.stateChangeTo(ThemeHotChili.WinShowState.WinDelay);
    ThemeHotChili.gameLayer.musicManager.fadeNG_BGM();
    ThemeHotChili.ctl.enableSpin();

    let waitTime = 0.5;
    if (this.bigWin) {
        waitTime = 0.8;
    }

    ThemeHotChili.ctl.footer.setLabelDescription('Intro');
    if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType() ||
        THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType()) {
        TimerCallFunc.addCallFunc(this.stopPerformUnit, waitTime, this, this);
    }
};

ThemeHotChiliEffectLayer.prototype.performFreeGameTrigger = function() {
    ThemeHotChili.ctl.disableSpinAndOtherBtns();
    this.stateChangeTo(ThemeHotChili.WinShowState.FreeGameTrigger);
    TimerCallFunc.addCallFunc(function() {
        ThemeHotChili.gameLayer.performFreeGameRetrigger(this.spinResult);
    }, 0.5, this, this);
};

ThemeHotChiliEffectLayer.prototype.performScatterAnimation = function() {
    ThemeHotChili.ctl.disableSpinAndOtherBtns();
    this.stateChangeTo(ThemeHotChili.WinShowState.ScatterAnimation);

    let time = 3;
    TimerCallFunc.addCallFunc(function() {
        AudioEngine.stopMusic();
        AudioEngine.stopAllEffects();
        this.playWinEffect(ThemeHotChili.AudioPath + 'triggering.mp3', false);
        this.lineAnimator.performAnimation(this.scatterHitPos);
    }, 0.5, this, this);

    if (this.spinResult.big_win ||
        this.spinResult.super_win ||
        this.spinResult.mega_win ||
        this.spinResult.epic_win ||
        this.spinResult.ultimate_win ||
        (this.spinResult.win_lines && this.spinResult.win_lines.length > 0)) {
        // Do nothing
    } else {
        const tb = this.spinResult.tb || 0.5;

        if (tb < 1 && tb > 0) {
            time = 4;
        } else if (tb >= 1 && tb < 5) {
            time = 5;
        }

        this.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function() {
                if (tb < 1 && tb > 0) {
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + "win_a.mp3", false);
                    this.runAction(cc.sequence(
                        cc.delayTime(1),
                        cc.callFunc(function() {
                            AudioEngine.stopAllEffects();
                            AudioEngine.playEffect(ThemeHotChili.AudioPath + "win_a_end.mp3", false);
                        })
                    ));
                } else if (tb >= 1 && tb < 5) {
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + "win_b.mp3", false);
                    this.runAction(cc.sequence(
                        cc.delayTime(2),
                        cc.callFunc(function() {
                            AudioEngine.stopAllEffects();
                            AudioEngine.playEffect(ThemeHotChili.AudioPath + "win_b_end.mp3", false);
                        })
                    ));
                }

                ThemeHotChili.ctl.footer.updateTotalWin(this.spinResult.scatter_win, 1);
                this.totalWinToAdd = this.totalWinToAdd - this.spinResult.scatter_win;
            }, this)
        ));
    }

    TimerCallFunc.addCallFunc(this.stopPerformUnit, time, this, this);
};
ThemeHotChiliEffectLayer.prototype.performBigWinAnimation = function() {
    ThemeHotChili.ctl.disableSpinAndOtherBtns();
    this.stateChangeTo(ThemeHotChili.WinShowState.BigWinAnimation);
    this.lineAnimator.sync();

    const callback = () => {
        ThemeHotChili.ctl.enableSpin();

        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE) {
            AudioEngine.setMusicVolume(1);
            //AudioEngine.playMusic(ThemeHotChili.AudioPath + "fgbgm.mp3", true);
        } else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN) {
            AudioEngine.setMusicVolume(1);
        } else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAPFREE) {
            AudioEngine.setMusicVolume(1);
            //AudioEngine.playMusic(ThemeHotChili.AudioPath + "fgbgm.mp3", true);
        }

        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN && !ThemeHotChili.ctl.getAutoStatus()) {
            this.resetForEachLineAnimation();
            this.performEachLineAnimation();
            TimerCallFunc.addScheduleFunc(this.performEachLineAnimation, this.eachLineAnimationInterval, this, this);
        }

        if (this.spinResult.credit_win && this.spinResult.credit_win > 0) {
            ThemeHotChili.ctl.footer.updateTotalWin(this.totalWinToAdd - this.spinResult.credit_win);
        } else {
            ThemeHotChili.ctl.footer.updateTotalWin(this.totalWinToAdd);
        }
        this.totalWinToAdd = 0;

        this.stopSymbolLineAnimation();
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN && !ThemeHotChili.ctl.getAutoStatus()) {
            this.stopPerformUnit();
        } else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE || ThemeHotChili.ctl.getAutoStatus()) {
            this.stopPerformUnit();
            //TimerCallFunc.addCallFunc(this.stopPerformUnit, 2, this, this);
        } else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAPFREE || ThemeHotChili.ctl.getAutoStatus()) {
            this.stopPerformUnit();
            //TimerCallFunc.addCallFunc(this.stopPerformUnit, 2, this, this);
        }
    };

    let winType;
    if (this.spinResult.big_win) {
        winType = ThemeWinNode.BigWin;
    } else if (this.spinResult.super_win) {
        winType = ThemeWinNode.SuperWin;
    } else if (this.spinResult.mega_win) {
        winType = ThemeWinNode.MegaWin;
    } else if (this.spinResult.epic_win) {
        winType = ThemeWinNode.EpicWin;
    } else if (this.spinResult.ultimate_win) {
        winType = ThemeWinNode.UltimateWin;
    }

    this.showAllLines();

    TimerCallFunc.addCallFunc(() => {
        ThemeHotChili.ctl.performBigWin(winType, this.spinResult.total_win, callback);
    }, 0.3, null, this);
};

ThemeHotChiliEffectLayer.prototype.performSymbolLineAnimation = function() {
    this.stateChangeTo(ThemeHotChili.WinShowState.SymbolLineAnimation);
    TimerCallFunc.addCallFunc(() => {
        ThemeHotChili.ctl.enableSpin();
    }, 0.1, this, this);
    if (!ThemeHotChili.ctl.getAutoStatus() && ThemeHotChili.ctl.getGameType() == THEME_GAME_TYPE.MAIN && !this.fgWin) {
        ThemeHotChili.ctl.enableOtherBtns();
    }

    let tbtime = 0;
    let updateTime = 0;
    let tb = this.spinResult.tb;

    if (tb < 1) {
        tbtime = 1;
        this.playWinEffect(ThemeHotChili.AudioPath + "win_a.mp3", false);
    } else if (tb >= 1 && tb < 5) {
        tbtime = 2;
        this.playWinEffect(ThemeHotChili.AudioPath + "win_b.mp3", false);
    }
    this.bgmControlNode.runAction(cc.sequence(
        cc.delayTime(0.2),
        cc.callFunc(() => {
            ThemeHotChili.ctl.loopMusicBackoff(tbtime);
        })
    ));
    if (tb >= 3 && tb < 5) {
        let a = Math.floor(Math.random() * 2) + 1;
        if (a === 2) {
            a = 4;
        }
        AudioEngine.playEffect(ThemeHotChili.AudioPath + "win" + a + ".mp3", false);
    }
    updateTime = Math.max(tbtime - 1.5, 1);

    this.showAllLines();
    if (ThemeHotChili.ctl.getGameType() == THEME_GAME_TYPE.MAIN && !ThemeHotChili.ctl.getAutoStatus()) {
        if (this.spinResult.credit_win && this.spinResult.credit_win > 0) {
            ThemeHotChili.ctl.footer.updateTotalWin(this.totalWinToAdd - this.spinResult.credit_win, tbtime);
        } else {
            ThemeHotChili.ctl.footer.updateTotalWin(this.totalWinToAdd, tbtime);
        }
        this.totalWinToAdd = 0;

        TimerCallFunc.addCallFunc(this.stopSymbolLineAnimation, tbtime, this, this);
        TimerCallFunc.addCallFunc(this.stopPerformUnit, tbtime, this, this);
        TimerCallFunc.addCallFunc(() => {
            this.resetForEachLineAnimation();
            this.performEachLineAnimation();

            TimerCallFunc.addScheduleFunc(this.performEachLineAnimation, this.eachLineAnimationInterval, this, this);
        }, 1, null, this);
    } else {
        if (this.spinResult.credit_win && this.spinResult.credit_win > 0) {
            ThemeHotChili.ctl.footer.updateTotalWin(this.totalWinToAdd - this.spinResult.credit_win, tbtime);
        } else {
            ThemeHotChili.ctl.footer.updateTotalWin(this.totalWinToAdd, tbtime);
        }
        this.totalWinToAdd = 0;

        TimerCallFunc.addCallFunc(this.stopSymbolLineAnimation, tbtime, this, this);
        TimerCallFunc.addCallFunc(this.stopPerformUnit, tbtime, this, this);
    }
}

ThemeHotChiliEffectLayer.prototype.stopSymbolLineAnimation = function() {
    TimerCallFunc.unscheduleFunc(this.stopSymbolLineAnimation, this, this);
    this.stopAllWinMusicAndEffects();
    if (AudioEngine.getPlayingMusicFileName() == ThemeHotChili.AudioPath + 'ngbgm.mp3') {
        //ThemeHotChiliMusicManager:fadeMusic(0.1 + 2, 0.4, 0.1, false, 0.1)
        //TimerCallFunc.addCallFunc(function()
        //    ThemeHotChiliMusicManager:fadeMusic(0.1 + 2, 1.4, 0.1, false, 0)
        //end, 0.5, nil, self)
        ThemeHotChiliMusicManager.fadeMusic(3, 2, 1, 0);
    }

    ThemeHotChili.ctl.footer.flushTotalWin();

    var tb = this.spinResult.tb;
    if (ThemeHotChili.ctl.getGameType() == THEME_GAME_TYPE.MAIN) {
        if (!this.spinResult.big_win && !this.spinResult.super_win && !this.spinResult.mega_win && !this.spinResult.epic_win && !this.spinResult.ultimate_win) {
            if (tb < 1) {
                AudioEngine.playEffect(ThemeHotChili.AudioPath + "win_a_end.mp3", false);
            } else if (tb >= 1 && tb < 5) {
                AudioEngine.playEffect(ThemeHotChili.AudioPath + "win_b_end.mp3", false);
            }
        }
    } else {
        // 其他feature big win之后 也不应该有声音win_end， 具体big_win 字段在哪一层 需要看各自主题情况
        if (!this.spinResult.big_win && !this.spinResult.super_win && !this.spinResult.mega_win && !this.spinResult.epic_win && !this.spinResult.ultimate_win) {
            if (tb < 1) {
                AudioEngine.playEffect(ThemeHotChili.AudioPath + "win_a_end.mp3", false);
            } else if (tb >= 1 && tb < 5) {
                AudioEngine.playEffect(ThemeHotChili.AudioPath + "win_b_end.mp3", false);
            }
        }
    }
}

ThemeHotChiliEffectLayer.prototype.showAllLines = function() {
    this.lineAnimator.performAllLine(this.allLineHitPos, this.wildHitPos);
};

ThemeHotChiliEffectLayer.prototype.stopAllLines = function() {
    this.lineAnimator.stopLineAnimation();
};

ThemeHotChiliEffectLayer.prototype.resetForEachLineAnimation = function() {
    this.eachLineShowIndex = 1;
};

ThemeHotChiliEffectLayer.prototype.performEachLineAnimation = function() {
    this.lineAnimator.stopAnimation(this.showInAdvancePos);
    this.lineAnimator.stopLineAnimation();

    if (this.eachLineShowIndex == null || this.spinResult == null || this.spinResult.win_lines == null || this.spinResult.win_lines[this.eachLineShowIndex] == null || this.spinResult.win_lines[this.eachLineShowIndex].hit_pos == null) {
        return;
    }

    var pos = this.spinResult.win_lines[this.eachLineShowIndex].hit_pos;

    this.lineAnimator.performLineAnimation(pos, this.showInAdvancePos);

    var win = this.spinResult.win_lines[this.eachLineShowIndex].win;
    ThemeHotChili.ctl.footer.setLabelDescription('WaysWin', win);

    this.eachLineShowIndex = (this.eachLineShowIndex % this.spinResult.win_lines.length) + 1;
};
ThemeHotChiliEffectLayer.prototype.performStandbyBeforeBonusGameEnter = function() {
    if (this.bgInTemp === 0) {
        this.stopAllPerforms();
        // ThemeHotChili.gameLayer.turboFlag = ThemeHotChili.ctl.footer:getTurboStatus();
        ThemeHotChili.ctl.turnOffAutoSpinCheck();
        ThemeHotChili.ctl.setTurboVisible(false);
        ThemeHotChili.ctl.setFooterSpinBtn();
        ThemeHotChili.ctl.disableSpinAndOtherBtns();
        this.stateChangeTo(ThemeHotChili.WinShowState.StandbyBeforeBonusGameEnter);

        TimerCallFunc.addCallFunc(function() {
            AudioEngine.stopMusic();
            AudioEngine.stopAllEffects();
            this.playWinEffect(ThemeHotChili.AudioPath + 'triggering.mp3', false);
            ThemeHotChili.gameLayer.spinLayer.spinTable.multiFlyNode.stopAllActions();
            ThemeHotChili.gameLayer.spinLayer.ng_Chili.setVisible(true);
            ThemeHotChili.gameLayer.spinLayer.ng_Chili.addAnimation(0, "daiji", true);
            ThemeHotChili.gameLayer.spinLayer.collectPot.setAnimation(0, "waiting", true);

            TimerCallFunc.addCallFunc(function() {
                TimerCallFunc.addScheduleUntilFunc(function() {
                    if (ThemeHotChili.gameLayer.bgImgReady) {
                        ThemeHotChili.gameLayer.bgIn(this.spinResult);
                        return true;
                    } else {
                        return false;
                    }
                }, 0.01, this, this);
            }, 2.5, null, this);
        }, 1.8, null, this);
    } else {
        TimerCallFunc.addCallFunc(this.stopPerformUnit, 0.1, this, this);
    }
};

ThemeHotChiliEffectLayer.prototype.performBonusGameEnter = function() {
    ThemeHotChili.ctl.disableSpinAndOtherBtns();
    TimerCallFunc.unscheduleFunc(this.performEachLineAnimation, this, this);
    ThemeHotChili.gameLayer.performBonusGame();
    ThemeHotChili.ctl.footer.setLabelDescription('Clear');
    this.stateChangeTo(ThemeHotChili.WinShowState.Idle);
};


ThemeHotChiliEffectLayer.prototype.performStandbyBeforeFreeGameEnter = function() {
    ThemeHotChili.gameLayer.turboFlag = ThemeHotChili.ctl.footer.getTurboStatus();
    ThemeHotChili.ctl.turnOffAutoSpinCheck();
    ThemeHotChili.ctl.setTurboVisible(false);
    ThemeHotChili.ctl.setFooterSpinBtn();
    ThemeHotChili.ctl.disableSpinAndOtherBtns();
    this.stateChangeTo(ThemeHotChili.WinShowState.StandbyBeforeFreeGameEnter);
    // ThemeHotChili.gameLayer:processFreeGameResult(self.spinResult);

    TimerCallFunc.addScheduleUntilFunc(function() {
        if (ThemeHotChili.gameLayer.fgImgReady) {
            ThemeHotChili.gameLayer.fgSelect(this.spinResult);
            return true;
        } else {
            return false;
        }
    }, 0.01, this, this);
};

ThemeHotChiliEffectLayer.prototype.performFreeGameEnter = function() {
    ThemeHotChili.gameLayer.performFreeGame();
    ThemeHotChili.ctl.footer.setLabelDescription('Clear');
    this.stateChangeTo(ThemeHotChili.WinShowState.Idle);
};

ThemeHotChiliEffectLayer.prototype.stopShow = function() {
    var ret;
    if (this.state === ThemeHotChili.WinShowState.Idle) {
        ret = true;
    } else {
        ret = this.stepCurrentState();
    }
    if (ret) {
        this.stopAllPerforms();
        this.stateChangeTo(ThemeHotChili.WinShowState.Idle);
    }
    return ret;
};
ThemeHotChiliEffectLayer.prototype.forceStopShow = function() {
    this.stopAllPerforms();
    //this.stateChangeTo(ThemeHotChili.WinShowState.Idle);
};

ThemeHotChiliEffectLayer.prototype.stepCurrentState = function() {
    if (this.state === ThemeHotChili.WinShowState.FreeGameTrigger) {
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.ScatterAnimation) {
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.SymbolLineAnimation && (this.fgWin || this.bigWin || this.bgWin)) {
        this.stopSymbolLineAnimation();
        this.stopPerformUnit();
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.SymbolLineAnimation) {
        this.bgmControlNode.stopAllActions();
        this.stopSymbolLineAnimation();
        return true;
    } else if (this.state === ThemeHotChili.WinShowState.BigWinAnimation) {
        this.stopPerformUnit();
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.StandbyBeforeBonusGameEnter) {
        this.stopPerformUnit();
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.BonusGameEnter) {
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.StandbyBeforeFreeGameEnter) {
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.Checking) {
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.MultiFly) {
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.ChipWin) {
        return false;
    } else if (this.state === ThemeHotChili.WinShowState.ReSpin) {
        return false;
    } else {
        return true;
    }
};

ThemeHotChiliEffectLayer.prototype.stopAllPerforms = function() {
    TimerCallFunc.clearGroup(this);

    this.stopAllWinMusicAndEffects();
    this.lineAnimator.stopAnimation();

    ThemeHotChili.ctl.footer.flushTotalWin();
    if (this.totalWinToAdd > 0) {
        ThemeHotChili.ctl.footer.updateTotalWin(this.totalWinToAdd);
        this.totalWinToAdd = 0;
    }
    ThemeHotChili.ctl.footer.setLabelDescription('Clear');
};

ThemeHotChiliEffectLayer.prototype.stateChangeTo = function(s) {
    this.state = s;
    // 如果必须要下一帧调用 stateChangeTo ，可以使用 TimerCallFunc.addCallFunc(self.stateChangeTo, 0, self, self)
    if (ThemeHotChili.WinShowState.Checking === this.state) {
        this.checkPerformList();
    } else if (ThemeHotChili.WinShowState.Idle === this.state) {
        ThemeHotChili.gameLayer.spinLayer.effectLayerChangeToIdle();
    }
};

ThemeHotChiliEffectLayer.prototype.playWinMusic = function(fileName, isLoop) {
    AudioEngine.playMusic(fileName, isLoop);
    this.winMusic = AudioEngine.getPlayingMusicFileName();
};

ThemeHotChiliEffectLayer.prototype.playWinEffect = function(fileName, isLoop) {
    var id = AudioEngine.playEffect(fileName, isLoop);
    if (id === -1) return;
    this.winEffectIds.push(id);
};

ThemeHotChiliEffectLayer.prototype.stopAllWinMusicAndEffects = function() {
    TimerCallFunc.unscheduleFunc(this.stopAllWinMusicAndEffects, this, this);
    if (this.winMusic && this.winMusic === AudioEngine.getPlayingMusicFileName()) {
        AudioEngine.stopMusic();
    }
    this.winMusic = null;

    while (this.winEffectIds.length > 0) {
        var id = this.winEffectIds.shift();
        AudioEngine.stopEffect(id);
    }
};

ThemeHotChiliEffectLayer.prototype.isWinLineCanChangeTip = function() {
    if ((this.state === ThemeHotChili.WinShowState.SymbolLineAnimation || this.state === ThemeHotChili.WinShowState.WinDelay) && !this.fgWin && !this.bgWin) {
        return true;
    }
    return false;
};
