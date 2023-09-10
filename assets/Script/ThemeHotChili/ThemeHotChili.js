require("./ThemeNew");
require("./ThemeHotChiliGameLayer");
require("./tools");
require("./ThemeResource")

ThemeHotChili = cc.Class({
    extends: ThemeNew,
    name:"ThemeHotChili",

    ctor:function() {
        this.themeid = GLOBAL_THEME_ID;
        this.ThemeType = G_THEME_TYPE_LIST.WAYS;
        this.BetType = G_THEME_BET_TYPE_LIST.MULTIPLIER;

        this.ClassName = ThemeHotChili;
        this.ClassName.themeId =  this.themeid;
        this.themeFreeType = THEME_FG_TYPE.STEP;
        this.too= new tools(this);
        return true;
    }
});



ThemeHotChili.prototype.initResList = function() {
    this.loadMusicList = [];
    this.loadMusicList.push(this.getAudio('addfg.mp3'));
    this.loadMusicList.push(this.getAudio('bg_allopen.mp3'));
    this.loadMusicList.push(this.getAudio('bg_choose.mp3'));
    this.loadMusicList.push(this.getAudio('bg_end.mp3'));
    this.loadMusicList.push(this.getAudio('bg_muti.mp3'));
    this.loadMusicList.push(this.getAudio('bg_ready.mp3'));
    this.loadMusicList.push(this.getAudio('bg_transition.mp3'));
    this.loadMusicList.push(this.getAudio('bg_win.mp3'));
    this.loadMusicList.push(this.getAudio('bgbgm.mp3'));
    this.loadMusicList.push(this.getAudio('bgsc_collect.mp3'));
    this.loadMusicList.push(this.getAudio('bgsc_multi.mp3'));
    this.loadMusicList.push(this.getAudio('bgsc_win.mp3'));
    this.loadMusicList.push(this.getAudio('bgscmul_win.mp3'));
    this.loadMusicList.push(this.getAudio('bigprize_end.mp3'));
    this.loadMusicList.push(this.getAudio('bigprize.mp3'));
    this.loadMusicList.push(this.getAudio('button.mp3'));
    this.loadMusicList.push(this.getAudio('change.mp3'));
    this.loadMusicList.push(this.getAudio('chilliman_in.mp3'));
    this.loadMusicList.push(this.getAudio('chilliman_muti.mp3'));
    this.loadMusicList.push(this.getAudio('dajiangyugao.mp3'));
    this.loadMusicList.push(this.getAudio('extra.mp3'));
    this.loadMusicList.push(this.getAudio('fg_choose.mp3'));
    this.loadMusicList.push(this.getAudio('fg_end.mp3'));
    this.loadMusicList.push(this.getAudio('fg_select.mp3'));
    this.loadMusicList.push(this.getAudio('fg_transition.mp3'));
    this.loadMusicList.push(this.getAudio('fgbgm.mp3'));
    this.loadMusicList.push(this.getAudio('fgchoose.mp3'));
    this.loadMusicList.push(this.getAudio('fgEnd1.mp3'));
    this.loadMusicList.push(this.getAudio('fgEnd2.mp3'));
    this.loadMusicList.push(this.getAudio('frame_win.mp3'));
    this.loadMusicList.push(this.getAudio('jp_lock.mp3'));
    this.loadMusicList.push(this.getAudio('jp_unlock.mp3'));
    this.loadMusicList.push(this.getAudio('jp_up1.mp3'));
    this.loadMusicList.push(this.getAudio('jp_up2.mp3'));
    this.loadMusicList.push(this.getAudio('jp_up3.mp3'));
    this.loadMusicList.push(this.getAudio('jp_up4.mp3'));
    this.loadMusicList.push(this.getAudio('jp1.mp3'));
    this.loadMusicList.push(this.getAudio('jp2.mp3'));
    this.loadMusicList.push(this.getAudio('jp3.mp3'));
    this.loadMusicList.push(this.getAudio('jp4.mp3'));
    this.loadMusicList.push(this.getAudio('jp5.mp3'));
    this.loadMusicList.push(this.getAudio('jpMulti2.mp3'));
    this.loadMusicList.push(this.getAudio('jpMulti3.mp3'));
    this.loadMusicList.push(this.getAudio('jpMulti4.mp3'));
    this.loadMusicList.push(this.getAudio('jpMulti5.mp3'));
    this.loadMusicList.push(this.getAudio('loading.mp3'));
    this.loadMusicList.push(this.getAudio('ngbgm.mp3'));
    this.loadMusicList.push(this.getAudio('open.mp3'));
    this.loadMusicList.push(this.getAudio('pick.mp3'));
    this.loadMusicList.push(this.getAudio('popup.mp3'));
    this.loadMusicList.push(this.getAudio('reelbgsc.mp3'));
    this.loadMusicList.push(this.getAudio('reeldown.mp3'));
    this.loadMusicList.push(this.getAudio('reelfast.mp3'));
    this.loadMusicList.push(this.getAudio('reelsc1.mp3'));
    this.loadMusicList.push(this.getAudio('reelsc2.mp3'));
    this.loadMusicList.push(this.getAudio('reelsc3.mp3'));
    this.loadMusicList.push(this.getAudio('reelsc4.mp3'));
    this.loadMusicList.push(this.getAudio('reelsc5.mp3'));
    this.loadMusicList.push(this.getAudio('reelsctr.mp3'));
    this.loadMusicList.push(this.getAudio('reelstop.mp3'));
    this.loadMusicList.push(this.getAudio('respin.mp3'));
    this.loadMusicList.push(this.getAudio('respin2.mp3'));
    this.loadMusicList.push(this.getAudio('triggering.mp3'));
    this.loadMusicList.push(this.getAudio('unlock.mp3'));
    this.loadMusicList.push(this.getAudio('win_a_end.mp3'));
    this.loadMusicList.push(this.getAudio('win_a.mp3'));
    this.loadMusicList.push(this.getAudio('win_b_end.mp3'));
    this.loadMusicList.push(this.getAudio('win_b.mp3'));
    this.loadMusicList.push(this.getAudio('win_c.mp3'));
    this.loadMusicList.push(this.getAudio('win_d.mp3'));
    this.loadMusicList.push(this.getAudio('win_end.mp3'));
    this.loadMusicList.push(this.getAudio('win1.mp3'));
    this.loadMusicList.push(this.getAudio('win2.mp3'));
    this.loadMusicList.push(this.getAudio('win3.mp3'));
    this.loadMusicList.push(this.getAudio('win4.mp3'));
    this.loadMusicList.push(this.getAudio('fgch_bgm.mp3'));
}

ThemeHotChili.prototype.initGameLayer = function() {
    console.log("ThemeHotChili.initGameLayer");
    var visibleOrigin = cc.director.getVisibleOrigin();
    this.visibleSize = cc.director.getVisibleSize();
    this.centerX = visibleOrigin.x + this.visibleSize.width / 2;
    this.centerY = visibleOrigin.y + this.visibleSize.height / 2;

    this.gameLayer = new ThemeHotChiliGameLayer(this);
    this.ClassName.gameLayer = this.gameLayer;
    this.addChild(this.gameLayer);
};

ThemeHotChili.prototype.canSpin = function() {
    if (THEME_GAME_TYPE.MAIN === this.ctl.getGameType()) {
        if (this.gameLayer.spinLayer.state === this.ClassName.SpinLayerState.Idle || this.gameLayer.spinLayer.state === this.ClassName.SpinLayerState.Show) {
            return this.gameLayer.spinLayer.stopShow();
        } else if (this.gameLayer.spinLayer.state === this.ClassName.SpinLayerState.Rolling) {
            return false;
        }
    } else if (THEME_GAME_TYPE.FREE === this.ctl.getGameType()) {
        this.dealMusic_TouchBtnSpinMusic();
        if (this.gameLayer.freeGameLeaving) {
            return false;
        }

        if (this.gameLayer.spinLayer.state === this.ClassName.SpinLayerState.Idle || this.gameLayer.spinLayer.state === this.ClassName.SpinLayerState.Show) {
            this.gameLayer.spinLayer.stopShow();
        } else if (this.gameLayer.spinLayer.state === this.ClassName.SpinLayerState.Rolling) {
            return false;
        }
        return false;
    }
};
ThemeHotChili.prototype.canStop = function() {
    if (ThemeHotChili.gameLayer.extendSpin) {
        return false;
    }
    if (ThemeHotChili.gameLayer.spinLayer.spinTable.shouldExpecting) {
        if (ThemeHotChili.gameLayer.isExpecting) {
            return false;
        } else {
            this.gameLayer.spinLayer.spinTable.stopAllExpect();
            this.gameLayer.spinLayer.stopSpinTable();
            return true;
        }
    } else {
        this.gameLayer.spinLayer.stopSpinTable();
        return true;
    }
};
ThemeHotChili.prototype.adjustTheme = function(data) {
    ThemeHotChili.reconnectFlag = false;
    let startPos = data.startPos;
    //startPos = startPos.replace(/\[/g, '{').replace(/\]/g, '}');
    ThemeHotChili.QuickStartReelOrders = [
        [1,2,3,4,5,6,7,8,9], 
        [2,3,4,5,6,7,8,9,10], 
        [3,4,5,6,7,8,3,4,5], 
        [4,5,6,7,8,9,6,7,5],
        [5,6,7,8,9,10,8,6,5],
        [6,7,8,9,10,11,6,4],
    ];
    
    
    if (this.gameLayer.spinLayer.spinTable) {
        this.gameLayer.spinLayer.spinTable.checkCellsInit();
    }

    var _This = this;
    if (data.enter_theme_info && data.enter_theme_info.bow_state) 
    {
        TimerCallFunc.addScheduleUntilFunc(function() {
            if (_This.gameLayer && _This.gameLayer.spinLayer && _This.gameLayer.spinLayer.collectPot) {
                _This.gameLayer.spinLayer.collectPot.setAnimation(0, "idle" + data.enter_theme_info.bow_state, true);
                if (data.enter_theme_info.bow_state == 5) {
                    _This.gameLayer.spinLayer.ng_Chili.setVisible(true);
                    _This.gameLayer.spinLayer.ng_Chili.setAnimation(0, "daiji", true);
               }
                return true;
            } else {
                return false;
            }
        }, 0.01, this, this);
    }

    if (data.enter_theme_info && data.enter_theme_info.reconnection_data 
        && data.enter_theme_info.reconnection_data.free_spins) {
        ThemeHotChili.reconnectFlag = true;
        TimerCallFunc.addScheduleUntilFunc(function() {
            if (_This.gameLayer && _This.gameLayer.spinLayer && _This.gameLayer.spinLayer.spinTable) {
                _This.gameLayer.judgeJpLockMusic = true;
                ThemeHotChili.ctl.betControl.changeToBet(data.enter_theme_info.reconnection_data.fg_bet);
                ThemeHotChili.ctl.disableSpinAndOtherBtns();
                ThemeHotChili.ctl.footer.updateTotalWin(data.enter_theme_info.reconnection_data.all_total_win);
                _This.gameLayer.fgSelectReconnect(data.enter_theme_info.reconnection_data.free_spins);

                ThemeHotChili.ctl.setCacheRet(["randomDataToEscapeNG"]);
                return true;
            } else {
                return false;
            }
        }, 0.01, this, this);
    }
    else if (data.enter_theme_info && data.enter_theme_info.reconnection_data 
            && data.enter_theme_info.reconnection_data.fg_total_round) {
        ThemeHotChili.reconnectFlag = true;
        TimerCallFunc.addScheduleUntilFunc(function() {
            if (_This.gameLayer && _This.gameLayer.spinLayer && _This.gameLayer.spinLayer.spinTable) {
                _This.gameLayer.judgeJpLockMusic = true;
                ThemeHotChili.ctl.betControl.changeToBet(data.enter_theme_info.reconnection_data.fg_bet);
                ThemeHotChili.ctl.disableSpinAndOtherBtns();
                ThemeHotChili.ctl.footer.updateTotalWin(data.enter_theme_info.reconnection_data.all_total_win);
                _This.gameLayer.freeGameReconnect(data.enter_theme_info.reconnection_data);
    
                ThemeHotChili.ctl.setCacheRet(["randomDataToEscapeNG"]);
                return true;
            } else {
                return false;
            }
        }, 0.01, this, this);
    } else {
        TimerCallFunc.addCallFunc(function() {
            AudioEngine.playEffect(ThemeHotChili.AudioPath + "open.mp3", false);
        }, 0.5, null, this);
    }
};
ThemeHotChili.checkTip = function(flag) {
    var curBet = ThemeHotChili.ctl.getCurBet();
    var betList = GLOBAL_LEVEL_BET.five_bet_list_1;
    var jackpotLayer = this.gameLayer && this.gameLayer.jackpotLayer;

    if (curBet >= betList[5]) {
        if (jackpotLayer) {
            jackpotLayer.showUnlock3(flag);
            jackpotLayer.showUnlock2(flag);
            jackpotLayer.showUnlock1(flag);
        }
    } else if (curBet < betList[5] && curBet >= betList[4]) {
        if (jackpotLayer) {
            jackpotLayer.showLock1(flag);
            jackpotLayer.showUnlock3(flag);
            jackpotLayer.showUnlock2(flag);
        }
    } else if (curBet < betList[4] && curBet >= betList[3]) {
        if (jackpotLayer) {
            jackpotLayer.showLock1(flag);
            jackpotLayer.showLock2(flag);
            jackpotLayer.showUnlock3(flag);
        }
    } else {
        if (jackpotLayer) {
            jackpotLayer.showLock1(flag);
            jackpotLayer.showLock2(flag);
            jackpotLayer.showLock3(flag);
        }
    }
}

ThemeHotChili.onShow = function() {
    this.checkTip(true);
    ThemeHotChili.ctl.footer.setLabelDescription("Clear");
    ThemeHotChili.gameLayer.jackpotLayer.sendThemeJpCmd();

    if (!ThemeHotChili.reconnectFlag) {
        this.gameLayer.checkGameFever();
        tools.funcDelay(function() {
            ThemeHotChili.openEffectId = tools.playEffect("entergame", false);
        }, 0.5);
    }
}
ThemeHotChili.dealAboutBetChange = function() {
    var curBet = ThemeHotChili.ctl.getCurBet();
    var betList = GLOBAL_LEVEL_BET.five_bet_list_1;
    var gameLayer = this.gameLayer;
    var jackpotLayer = gameLayer && gameLayer.jackpotLayer;

    if (jackpotLayer) {
        jackpotLayer.reset();
    }

    if (curBet >= betList[5]) {
        this.mathType = 3;
    } else if (curBet < betList[5] && curBet >= betList[4]) {
        this.mathType = 2;
    } else if (curBet < betList[4] && curBet >= betList[3]) {
        this.mathType = 1;
    } else {
        this.mathType = 0;
    }

    if (gameLayer && gameLayer.judgeJpLockMusic) {
        this.checkTip(true);
        gameLayer.judgeJpLockMusic = null;
    } else {
        this.checkTip();
    }
}

ThemeHotChili.refreshLanguage = function() {
    var gameLayer = this.gameLayer;

    if (gameLayer && gameLayer.fgCountBoard && gameLayer.spinFree) {
        gameLayer.spinFree.setTexture(bole.translateImage("free_game", ThemeHotChili.themeId));
    }
    if (gameLayer && gameLayer.fgSelectLayer) {
        gameLayer.fgSelectLayer.refreshLanguage();
    }
    if (gameLayer && gameLayer.jackpotLayer) {
        gameLayer.jackpotLayer.refreshLanguage();
    }
    if (gameLayer) {
        gameLayer.changeLang();
    }
}

ThemeHotChili.stopWinRollByTouchBet = function() {
    var effectLayer = this.gameLayer.spinLayer.effectLayer;

    if (effectLayer.state == ThemeHotChili.WinShowState.SymbolLineAnimation) {
        effectLayer.stopSymbolLineAnimation();
        effectLayer.stopPerformUnit();
        return false;
    } else {
        return true;
    }
}
