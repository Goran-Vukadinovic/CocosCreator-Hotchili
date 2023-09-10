require("./ThemeHotChiliSpinLayer");
require("./tools");
require("./Common");
require("./ThemeHotChiliChipValueGenerator");



ThemeHotChiliGameLayer = cc.Class({
    extends: cc.Layer,

    ctor() {
        var theme = arguments[0];
        this.background = null;
        this.spinLayer = null;
        this.jackpotLayer = null;
        this.loadingBar = null;
        this.infoBar = null;
        this.flyLayer = null;

        this.freeGameLeaving = false;
        this.freeSpinIndex = 0;
        this.freeSpinNum = 0;

        this.bonusGameLeaving = false;
        this.bonusSpinIndex = 0;
        this.bonusSpinNum = 0;

        this.turboFlag = false;

        this.fg_idx = 0;
        this.fg_total_round = 0;

        this.init(theme);
    },

    init(theme) {
        console.log("ThemeHotChiliGameLayer.init");
        // get design resolution size
        var designResolution = cc.view.getDesignResolutionSize();
        cc.log("Design resolution: " + designResolution.width + " x " + designResolution.height);

        this.theme = theme;
        ThemeHotChili.ImgPath = this.theme.getPic('image/');
        ThemeHotChili.SpinePath = this.theme.getPic('spine/');
        ThemeHotChili.FontPath = this.theme.getPic('font/');
        ThemeHotChili.AudioPath = this.theme.getAudio('');
    
        const visibleOrigin = cc.director.getVisibleOrigin();
        this.visibleSize = cc.director.getVisibleSize();
        console.log("visibleOrigin", visibleOrigin);
        console.log("visibleSize", this.visibleSize);

        this.centerX = visibleOrigin.x + this.visibleSize.width / 2;
        this.centerY = visibleOrigin.y + this.visibleSize.height / 2;
        console.log("center", this.centerX, this.centerY);
        this.setOffset();
    
        this.background = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/ngBg.png');
        this.background.setPosition(this.centerX, this.centerY - this.offset * SCREEN_RATIO_VERTICAL);
        this.addChild(this.background);
    
        tools.setThemeScaleX(this.background, 2); 
    
        this.flagNode = new cc.Node();
        this.addChild(this.flagNode, 1);
        this.flagNode.setScale(SCREEN_RATIO_VERTICAL);
    
        this.flagLT = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/qizi_L1.png');
        this.flagLT.setPosition(this.centerX - 233, this.centerY + 627.5);//need fix
        this.flagNode.addChild(this.flagLT);
        this.flagLD = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/qizi_L2.png');
        this.flagLD.setPosition(this.centerX - 263, this.centerY + 515.5);//need fix
        this.flagNode.addChild(this.flagLD);
        this.flagRT = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/qizi_R1.png');
        this.flagRT.setPosition(this.centerX + 229, this.centerY + 645.5);//need fix
        this.flagNode.addChild(this.flagRT);
        this.flagRD = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/qizi_R2.png');
        this.flagRD.setPosition(this.centerX + 311, this.centerY + 514.5);//need fix
        this.flagNode.addChild(this.flagRD);
        this.flagNode.setVisible(false);
    
        //!!this.touchEffectNode = new ThemeHotChiliTouchEffectNode();// no need
        //!!this.addChild(this.touchEffectNode, 1);// no need
    
        this.spinLayer = new ThemeHotChiliSpinLayer(); //盘面摆放以及状态控制
        this.spinLayer.setScale(SCREEN_RATIO_VERTICAL);
        this.spinLayer.setPosition(0, -this.offset * SCREEN_RATIO_VERTICAL);
        this.addChild(this.spinLayer, 1);
    
        const gameFeverNodeLayer = new cc.Layer();
        gameFeverNodeLayer.setScale(SCREEN_RATIO_VERTICAL);
        gameFeverNodeLayer.setPosition(0, -this.offset * SCREEN_RATIO_VERTICAL);
        this.addChild(gameFeverNodeLayer, 5);
        //??this.gameFeverNode = GameFeverControl.getInstance().createGameFeverNode(ThemeHotChili);
        //??gameFeverNodeLayer.addChild(this.gameFeverNode);
        //??this.gameFeverNode.setPosition(this.centerX + 275, this.centerY + 267);
    
        ThemeHotChili.chipValueGenerator = new ThemeHotChiliChipValueGenerator(); //某些主题需要在symbol上显示数字，用于控制金币的显示
    
        this.jackpotLayer = new ThemeHotChiliJackpotLayer(); //jp彩金相关
        this.jackpotLayer.setScale(SCREEN_RATIO_VERTICAL);
        this.jackpotLayer.assemble();
        this.jackpotLayer.setPosition(0, -this.offset * SCREEN_RATIO_VERTICAL);
        this.addChild(this.jackpotLayer, 3);
    
        if (this.offset !== 0) {
            this.logoNode = new cc.Node();
            this.addChild(this.logoNode, 4);
            this.logoNode.setScale(SCREEN_RATIO_VERTICAL);
            this.logoNode.setPosition(this.centerX, this.centerY);
    
            this.logo = new cc._Sprite(bole.translateImage('logo', ThemeHotChili.themeId));
            this.logo.setPosition(0, this.logoOffset);
            this.logoNode.addChild(this.logo);
        }
    
        this.flyLayer = new ThemeHotChiliFlyLayer(); //飞行相关
        this.flyLayer.setScale(SCREEN_RATIO_VERTICAL);
        this.addChild(this.flyLayer, 10);
    
        this.musicManager = new ThemeHotChiliMusicManager(); //背景音乐相关
        this.addChild(this.musicManager);
    
        this.savedTable = {};
    
        return true;
    },
    setOffset() {
        let screenSize = this.visibleSize;
        let realR = screenSize.height / screenSize.width;
    
        let offset = 0;
        let iphoneXHeight = 1560;
        let iphoneXWidth = 720;
        this.jpOffset = 0;
        this.womanUpOffset = 0;
        let headHeight = 50;
        if (realR >= 2) {
            if (bole.isIphoneX()) {
                offset = 110 + (screenSize.height - iphoneXHeight) / 2;
                let jpHeight = this.centerY + 570 - offset;
                this.logoOffset = (this.visibleSize.height - headHeight - jpHeight - 60) / 2 + jpHeight - this.centerY;
            } else {
                offset = 135 + (screenSize.height - iphoneXHeight) / 2;
                let jpHeight = this.centerY + 570 - offset;
                this.logoOffset = (this.visibleSize.height - headHeight - jpHeight) / 2 + jpHeight - this.centerY;
            }
        }
        this.offset = offset;
    },
    
    fgSelectReconnect(data) {
        this.fgInLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 180), this.visibleSize.width, this.visibleSize.height);
        this.addChild(this.fgInLayerColor, 9);
    
        tools.setThemeOtherScale(this.fgInLayerColor, 1.2, true);
    
        bole.addSwallowTouchesEventListener(this.fgInLayerColor);
        this.fgSelectLayer = new ThemeHotChiliFgSelectLayer(data, 1);
        this.fgSelectLayer.setScale(SCREEN_RATIO_VERTICAL);
        this.fgSelectLayer.setPosition(this.centerX, this.centerY);
        this.addChild(this.fgSelectLayer, 9);
    },
    fgSelect(reconnectData) {
        ThemeHotChili.ctl.hideThemeActivityNode();
        this.fgInLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 180), this.visibleSize.width, this.visibleSize.height);
        this.addChild(this.fgInLayerColor, 9);
    
        tools.setThemeOtherScale(this.fgInLayerColor, 1.2, true);
    
        bole.addSwallowTouchesEventListener(this.fgInLayerColor);
        AudioEngine.playEffect(ThemeHotChili.AudioPath + "fg_transition.mp3", false);
        let spLoading = sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/FG_guochang", ThemeHotChili.SpinePath + "fg/FG_guochang.atlas");
        this.addChild(spLoading, 10);
        spLoading.setPosition(this.centerX, this.centerY);
        spLoading.setAnimation(0, "guochang", false);
        spLoading.runAction(cc.Sequence.create(
                cc.DelayTime.create(2.5),
                cc.CallFunc.create(function() {
                    this.fgSelectLayer = new ThemeHotChiliFgSelectLayer(this.spinLayer.spinResult);
                    this.fgSelectLayer.setScale(0);
                    this.fgSelectLayer.setPosition(this.centerX, this.centerY);
                    this.addChild(this.fgSelectLayer, 9);
                }, this),
                cc.DelayTime.create(0.5),
                cc.CallFunc.create(function() {
                    this.fgSelectLayer.runAction(cc.Sequence.create(
                            cc.ScaleTo.create(0.33, 1.2 * SCREEN_RATIO_VERTICAL),
                            cc.ScaleTo.create(0.17, 0.9 * SCREEN_RATIO_VERTICAL),
                            cc.ScaleTo.create(0.17, 1 * SCREEN_RATIO_VERTICAL)
                    ));
                }, this),
                cc.RemoveSelf.create()
        ));
    },
    freeGameReconnect(data) {
        this.freeSpinNum = data.fg_total_round;
        this.freeSpinIndex = data.fg_idx;
        this.fg_idx = data.fg_idx;
        this.fg_total_round = data.fg_total_round;
    
        this.isFgReconnect = true;
        this.fgType = data.fg_type;
        this.performGotFreeGameTip(1);
    },
    
    processFreeGameResult(spinResult) {
        this.freeSpinNum = spinResult.fg_total_round; // fg局数
        this.fg_total_round = spinResult.fg_total_round;
        this.freeSpinIndex = 0;
        this.fg_idx = 0;
        this.fgType = spinResult.fg_type;
    },
    
    processBonusGameResult(spinResult) {
        this.bonusSpinNum = spinResult.free_round;
        this.bonusSpinIndex = 0;
    },
    performGotFreeGameTip(isReconnect) {
        this.turboFlag = ThemeHotChili.ctl.footer.getTurboStatus();
        ThemeHotChili.ctl.turnOffAutoSpinCheck();
        ThemeHotChili.ctl.setTurboVisible(false);
        ThemeHotChili.ctl.setFooterSpinBtn();
        ThemeHotChili.ctl.disableSpinAndOtherBtns();
        ThemeHotChili.ctl.forceSetTurboStatus(false);
    
        //fg计数板
        this.fgCountBoard = new cc._Sprite(ThemeHotChili.ImgPath + "fg/fg_board.png");
        this.fgCountBoard.setPosition(this.centerX, 215);
        //this.fgCountBoard.setPosition(this.centerX, 105); //横屏
        this.fgCountBoard.setScale(SCREEN_RATIO_VERTICAL);
        this.addChild(this.fgCountBoard, 5);
        let fgBoardSize = this.fgCountBoard.getContentSize();
        this.spinFree = new cc._Sprite(bole.translateImage("free_game", ThemeHotChili.themeId));
        this.spinFree.setPosition(fgBoardSize.width / 2 - 35, fgBoardSize.height / 2 + 5 - 6);
        this.fgCountBoard.addChild(this.spinFree);
        this.fgCountNum = new cc._LabelBMFont("", ThemeHotChili.ImgPath + "fg/fg_num.fnt");
        this.fgCountNum.setPosition(fgBoardSize.width / 2 + 75, fgBoardSize.height / 2 + 5 - 6);
        this.fgCountBoard.addChild(this.fgCountNum);
        this.fgCountNum.setString(this.freeSpinIndex + "/" + this.freeSpinNum);
        this.fgCountBoard.setVisible(false);
    
        if (PAD_TAG) {
            this.fgCountBoard.setPosition(this.centerX, 202);
        }
        if (bole.isIphoneX()) {
            this.fgCountBoard.setPosition(this.centerX, 245);
        }
    
        //横屏
        if (PAD_TAG) {
           this.fgCountBoard.setPosition(this.centerX, 75);
        }
    
        if (!isReconnect) {
            this.spinLayer.spinTable.saveTable();
            this.spinLayer.effectLayer.stopAllPerforms();
            TimerCallFunc.unscheduleFunc(this.spinLayer.effectLayer.performEachLineAnimation, this.spinLayer.effectLayer, this.spinLayer.effectLayer);
            this.fgCountBoard.setVisible(true);
            this.spinLayer.initFgTable(6 - this.fgType); //6 - self.fgType是fg的行数
            this.spinLayer.effectLayer.lineAnimator.sync();
            this.background.setPosition(this.centerX, this.centerY + ((3 - this.fgType) * 100 - this.offset) * SCREEN_RATIO_VERTICAL);
            if (this.fgInLayerColor && !this.fgInLayerColor.isNull()) {
                this.fgInLayerColor.runAction(new cc.Sequence(
                    new cc.FadeOut(0.3)
                ));
                TimerCallFunc.addCallFunc(() => {
                    if (this.fgInLayerColor && !this.fgInLayerColor.isNull()) {
                        this.fgInLayerColor.removeFromParent();
                        this.fgInLayerColor = null;
                    }
                }, 0.3, this, this);
            }
            AudioEngine.playEffect(ThemeHotChili.AudioPath + 'popup.mp3', false);
            if (this.fgSelectLayer && !this.fgSelectLayer.isNull()) {
                this.fgSelectLayer.runAction(new cc.Sequence(
                    new cc.ScaleTo(0.3, 0),
                    new cc.CallFunc(() => {
                        if (this.fgSelectLayer && !this.fgSelectLayer.isNull()) {
                            this.fgSelectLayer.removeFromParent();
                            this.fgSelectLayer = null;
                        }
                    })
                ));
            }
            if ((this.fgType == 0 || this.fgType == 1)) {
                if (this.offset == 0) {
                    this.jackpotLayer.jpMove();
                } else {
                    if (bole.notNull(this.logo)) {
                        this.logo.setVisible(false);
                    }
                    this.jackpotLayer.setPosition(0, 0);
                }
            }
            this.spinLayer.setVisible(true);
            this.flagNode.setVisible(true);
            this.runAction(new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.CallFunc(() => {
                    AudioEngine.playMusic(ThemeHotChili.AudioPath + "fgbgm.mp3", true);
                    ThemeHotChili.gameLayer.spinLayer.effectLayer.performFreeGameEnter();
                })
            ));
        } else {
            ThemeHotChili.ctl.hideThemeActivityNode();
            this.fgCountBoard.setVisible(true);
            this.spinLayer.spinTable.saveTable();
            this.spinLayer.initFgTable(6 - this.fgType); //6 - this.fgType是fg的行数
            this.spinLayer.effectLayer.lineAnimator.sync();
            this.background.setPosition(this.centerX, this.centerY + ((3 - this.fgType) * 100 - this.offset) * SCREEN_RATIO_VERTICAL);
            if ((this.fgType == 0 || this.fgType == 1)) {
                if (this.offset == 0) {
                    this.jackpotLayer.jpMove();
                } else {
                    if (bole.notNull(this.logo)) {
                        this.logo.setVisible(false);
                    }
                    this.jackpotLayer.setPosition(0, 0);
                }
            }
            AudioEngine.playMusic(ThemeHotChili.AudioPath + "fgbgm.mp3", true);
            ThemeHotChili.gameLayer.spinLayer.effectLayer.performFreeGameEnter();
            this.flagNode.setVisible(true);
        }
    },
    stopFreeGameTip() {
        TimerCallFunc.unscheduleFunc(this.stopFreeGameTip, this, this);
        if (this.fgInLayerColor && !cc.isValid(this.fgInLayerColor)) {
            this.fgInLayerColor.runAction(cc.sequence(
                cc.fadeOut(0.3)
            ));
            TimerCallFunc.addCallFunc(() => {
                if (this.fgInLayerColor && !cc.isValid(this.fgInLayerColor)) {
                    this.fgInLayerColor.removeFromParent();
                    this.fgInLayerColor = null;
                }
            }, 0.3, this, this);
        }
        const deleteFunc = () => {
            if (this.fgPopIn && !cc.isValid(this.fgPopIn)) {
                this.fgPopIn.removeFromParent();
                this.fgPopIn = null;
            }
            this.spinLayer.spinTable.saveTable();
            AudioEngine.playEffect(ThemeHotChili.AudioPath + 'fgTransition.mp3', false);
            const spLoading = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + 'fg/FG_guochang', ThemeHotChili.SpinePath + 'fg/FG_guochang.atlas');
            this.addChild(spLoading, 10);
            spLoading.setPosition(this.centerX, this.centerY);
            spLoading.setAnimation(0, 'FG_guochang', false);
            spLoading.runAction(cc.sequence(
                cc.delayTime(1.7),
                cc.callFunc(() => {
                    this.fgCountBoard.setVisible(true);
                    this.background.setTexture(ThemeHotChili.ImgPath + 'fg/fgBg.png');
                    this.flagNode.setVisible(true);
                }),
                cc.delayTime(0.47),
                cc.callFunc(() => {
                    AudioEngine.playMusic(ThemeHotChili.AudioPath + 'fgbgm.mp3', true);
                    ThemeHotChili.gameLayer.spinLayer.effectLayer.performFreeGameEnter();
                }),
                cc.removeSelf()
            ));
        };
        this.fgPopIn.performPop(ThemeHotChili.PopState.Shrink, deleteFunc);
    },
    bgIn(spinResult) {
        ThemeHotChili.ctl.hideThemeActivityNode();
        this.bgInLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 200), this.visibleSize.width, this.visibleSize.height);
        this.addChild(this.bgInLayerColor, 10);
    
        tools.setThemeOtherScale(this.bgInLayerColor, 1.2, true);
    
        bole.addSwallowTouchesEventListener(this.bgInLayerColor);
        AudioEngine.playEffect(ThemeHotChili.AudioPath + 'bg_transition.mp3', false);
        ThemeHotChili.gameLayer.spinLayer.ng_Chili.setVisible(false);
        const spLoading = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/BG_guochang", ThemeHotChili.SpinePath + "bg/BG_guochang.atlas");
        this.addChild(spLoading, 10);
        spLoading.setPosition(this.centerX, this.centerY);
        spLoading.setAnimation(0, "guochang", false);
        spLoading.runAction(cc.sequence(
            cc.delayTime(2.67),
            cc.callFunc(() => {
                this.spinLayer.setVisible(false);
                this.bgLayer = new ThemeHotChiliBGLayer(spinResult); // jp彩金相关
                this.bgLayer.setScale(SCREEN_RATIO_VERTICAL);
                this.bgLayer.setPosition(this.centerX, this.centerY - this.offset * SCREEN_RATIO_VERTICAL);
                this.addChild(this.bgLayer, 2);
                if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE) {
                    if (this.fgCountBoard && !cc.isValid(this.fgCountBoard)) {
                        this.fgCountBoard.setVisible(false);
                    }
                }
                if (this.bgInLayerColor && !cc.isValid(this.bgInLayerColor)) {
                    this.bgInLayerColor.runAction(cc.sequence(
                        cc.fadeOut(0.3)
                    ));
                    TimerCallFunc.addCallFunc(() => {
                        if (this.bgInLayerColor && !cc.isValid(this.bgInLayerColor)) {
                            this.bgInLayerColor.removeFromParent();
                            this.bgInLayerColor = null;
                        }
                    }, 0.3, this, this);
                }
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                AudioEngine.playEffect(ThemeHotChili.AudioPath + "pick.mp3", false);
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                AudioEngine.playMusic(ThemeHotChili.AudioPath + "bgbgm.mp3", true);
                this.spinLayer.collectPot.setAnimation(0, "idle1", true);
                ThemeHotChili.gameLayer.spinLayer.ng_Chili.setVisible(false);
            }),
            cc.removeSelf()
        ));
    },
    jpWin() {
        const spinResult = this.spinLayer.spinResult;
        AudioEngine.playEffect(ThemeHotChili.AudioPath + "bg_end.mp3", false);
        AudioEngine.playEffect(ThemeHotChili.AudioPath + "jp" + spinResult.win_jp + ".mp3", false);
        this.jpLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 0), this.visibleSize.width, this.visibleSize.height);
        this.addChild(this.jpLayerColor, 10);
    
        tools.setThemeOtherScale(this.jpLayerColor, 1.2, true);
    
        this.jpLayerColor.runAction(cc.sequence(
            cc.fadeTo(0.3, 200)
        ));
        let multiNum;
        for (let i = 0; i < spinResult.item_list[3].length; i++) {
            if (spinResult.item_list[3][i] >= 14 && spinResult.item_list[3][i] <= 17) {
                multiNum = spinResult.item_list[3][i] - 12;
            }
        }
        this.jpPop = new ThemeHotChiliPopOut(ThemeHotChili.PopupType.JpPopOut, spinResult.win_jp, spinResult.jp_value[spinResult.win_jp], spinResult.jp_value_1[spinResult.win_jp], multiNum);
        this.jpPop.setPosition(this.centerX, this.centerY);
        this.jpPop.setScale(SCREEN_RATIO_VERTICAL);
        this.addChild(this.jpPop, 10);
        this.jpPop.performPop(ThemeHotChili.PopState.Expand, null, 1);
    
        TimerCallFunc.addCallFunc(this.jpEnd, 30, this, this);
    },
    jpEnd() {
        TimerCallFunc.unscheduleFunc(this.jpEnd, this, this);
        let multiNum;
        const spinResult = this.spinLayer.spinResult;
        for (let i = 0; i < spinResult.item_list[3].length; i++) {
            if (spinResult.item_list[3][i] >= 14 && spinResult.item_list[3][i] <= 17) {
                multiNum = spinResult.item_list[3][i] - 12;
            }
        }
        const num = this.spinLayer.spinResult.jp_value[this.spinLayer.spinResult.win_jp] + this.spinLayer.spinResult.jp_value_1[this.spinLayer.spinResult.win_jp] * (multiNum - 1);
        ThemeHotChili.ctl.footer.updateTotalWin(num);
        this.jackpotLayer.stopMimic();
        //if (this.jpLayerColor && !cc.sys.isNullOrUndefined(this.jpLayerColor)) {
        //    this.jpLayerColor.runAction(cc.sequence(
        //            cc.FadeOut.create(0.3)
        //    ));
        //    TimerCallFunc.addCallFunc(() => {
        //        if (this.jpLayerColor && !cc.sys.isNullOrUndefined(this.jpLayerColor)) {
        //            this.jpLayerColor.removeFromParent();
        //            this.jpLayerColor = null;
        //        }
        //    }, 0.3, this, this);
        //}
        const callBack = () => {
            if (this.jpPop && !cc.sys.isNullOrUndefined(this.jpPop)) {
                this.jpPop.removeFromParent();
                this.jpPop = null;
            }
            AudioEngine.playEffect(ThemeHotChili.AudioPath + "bg_transition.mp3", false);
            const spLoading = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/BG_guochang", ThemeHotChili.SpinePath + "bg/BG_guochang.atlas");
            this.addChild(spLoading, 10);
            spLoading.setPosition(this.centerX, this.centerY);
            spLoading.setAnimation(0, "guochang", false);
            spLoading.runAction(cc.sequence(
                cc.delayTime(2.67),
                cc.callFunc(() => {
                    this.returnToMainFromBonusGame(num);
                }),
                cc.delayTime(1),
                cc.removeSelf(true)
            ));
        };
        this.jpPop.performPop(ThemeHotChili.PopState.Shrink, callBack);
    },
    returnToMainFromBonusGame(num) {
        this.spinLayer.setVisible(true);
        if (this.bgLayer && !this.bgLayer.isValid) {
            this.bgLayer.removeFromParent();
            this.bgLayer = null;
        }
        this.preloadBgImgRes();
        if (this.jpLayerColor && !this.jpLayerColor.isValid) {
            this.jpLayerColor.runAction(cc.sequence(
                cc.fadeOut(0.3),
                cc.callFunc(() => {
                    if (this.jpLayerColor.isValid) {
                        this.jpLayerColor.removeFromParent();
                        this.jpLayerColor = null;
                    }
                }, this)
            ));
        }
    
        setTimeout(() => {
            if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN) {
                ThemeHotChili.ctl.showThemeActivityNode();
            } else {
                if (this.fgCountBoard && this.fgCountBoard.isValid) {
                    this.fgCountBoard.setVisible(true);
                }
            }
            const callback = () => {
                if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN) {
                    ThemeHotChili.ctl.setTurboVisible(true);
                    ThemeHotChili.ctl.enableSpinAndOtherBtns();
                    ThemeHotChili.ctl.turnOnAutoSpinCheck();
                    if (ThemeHotChili.ctl.getAutoStatus()) {
                        ThemeHotChili.ctl.setFooterAutoSpinBtn();
                    } else {
                        ThemeHotChili.ctl.setFooterSpinBtn();
                    }
                    this.musicManager.playNG_BGM();
                    ThemeHotChili.ctl.fadeLoopMusic(3, 2, 1, 0);
                } else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE) {
                    cc.audioEngine.playMusic(ThemeHotChili.AudioPath + "fgbgm.mp3", true);
                    this.spinLayer.effectLayer.forceStopShow();
                    ThemeHotChili.ctl.enableSpin();
                }
                this.spinLayer.effectLayer.bgInTemp = 1;
                this.spinLayer.effectLayer.performStandbyBeforeBonusGameEnter();
            };
            const bgAllWinNum = parseFloat(this.spinLayer.spinResult.big_total_win_2);
            let winType;
            if (this.spinLayer.spinResult.big_win_2) {
                winType = ThemeWinNode.BigWin;
                console.log("BigWinnn");
            } else if (this.spinLayer.spinResult.super_win_2) {
                winType = ThemeWinNode.SuperWin;
                console.log("SuperWinnn");
            } else if (this.spinLayer.spinResult.mega_win_2) {
                winType = ThemeWinNode.MegaWin;
            } else if (this.spinLayer.spinResult.epic_win_2) {
                winType = ThemeWinNode.EpicWin;
            } else if (this.spinLayer.spinResult.ultimate_win_2) {
                winType = ThemeWinNode.UltimateWin;
            } else {
                winType = false;
            }
    
            if (!winType) {
                callback();
            } else {
                ThemeHotChili.ctl.preloadBWImgRes();
                setTimeout(() => {
                    ThemeHotChili.ctl.performBigWin(winType, bgAllWinNum, callback);
                }, 100);
            }
        }, 1000);
    },
});

ThemeHotChiliGameLayer.prototype.performFreeGameRetrigger = function(spinResult) {
    cc.audioEngine.stopMusic();
    cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "addfg.mp3", false);
    cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "extra.mp3", false);
    this.fgAddLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 0), this.visibleSize.width, this.visibleSize.height);
    this.addChild(this.fgAddLayerColor, 10);

    tools.setThemeOtherScale(this.fgAddLayerColor, 1.2, true);

    this.fgAddLayerColor.runAction(cc.sequence(
        cc.fadeTo(0.3, 150)
    ));

    this.freeSpinNum += spinResult.free_spins;

    this.fgPopAdd = new ThemeHotChiliPopOut(ThemeHotChili.PopupType.FreeGamePopAdd, spinResult.free_spins);
    this.fgPopAdd.setPosition(this.centerX, this.centerY);
    this.fgPopAdd.setScale(SCREEN_RATIO_VERTICAL);
    this.addChild(this.fgPopAdd, 10);
    this.fgPopAdd.performPop(ThemeHotChili.PopState.Expand);

    this.stopFreeGameAdd();
};

ThemeHotChiliGameLayer.prototype.stopFreeGameAdd = function() {
    TimerCallFunc.unscheduleFunc(this.stopFreeGameAdd, this, this);
    if (this.fgAddLayerColor && !this.fgAddLayerColor._isDestroyed) {
        this.fgAddLayerColor.runAction(cc.sequence(
            cc.fadeOut(0.3)
        ));
        TimerCallFunc.addCallFunc(function() {
            if (this.fgAddLayerColor && !this.fgAddLayerColor._isDestroyed) {
                this.fgAddLayerColor.removeFromParent();
                this.fgAddLayerColor = null;
            }
        }, 0.3, this, this);
    }
    var callBack = function() {
        if (this.fgPopAdd && !this.fgPopAdd._isDestroyed) {
            this.fgPopAdd.removeFromParent();
            this.fgPopAdd = null;
        }
        this.spinLayer.effectLayer.stopPerformUnit();
        cc.audioEngine.playMusic(ThemeHotChili.AudioPath + "fgbgm.mp3", true);
    }.bind(this);
    if (this.fgPopAdd && !this.fgPopAdd._isDestroyed) {
        this.fgPopAdd.performPop(ThemeHotChili.PopState.Shrink, callBack);
    }
};
ThemeHotChiliGameLayer.prototype.performFreeGame = function() {
    this.setGameType(THEME_GAME_TYPE.FREE);
    this.spinLayer.spinTable.resetReelList(THEME_GAME_TYPE.FREE);
};

ThemeHotChiliGameLayer.prototype.performBonusGame = function() {
    this.setGameType(THEME_GAME_TYPE.BONUS);
    this.spinLayer.spinTable.resetReelList(THEME_GAME_TYPE.BONUS);
};

ThemeHotChiliGameLayer.prototype.fgReconnectWithoutExit = function(data) {
    if (((data.enter_theme_info || {}).reconnection_data || {}).fg_idx) {
        if (data.enter_theme_info.reconnection_data.fg_idx < this.freeSpinIndex) {
            ThemeHotChili.ctl.requestFreeGameSpin();
        }
    }
};

ThemeHotChiliGameLayer.prototype.processNextRoundFreeGame = function() {
    this.freeSpinIndex++;
    if (this.fg_idx < this.fg_total_round) {
        this.fgCountNum.setString(this.freeSpinIndex + "/" + this.freeSpinNum);
        this.spinLayer.effectLayer.forceStopShow();
        this.spinLayer.autoAvailableTmp = false;
        this.fakeSpin();
        ThemeHotChili.ctl.requestFreeGameSpin();
        ThemeHotChili.ctl.setFooterStopBtn();
        ThemeHotChili.ctl.disableStop();
        return true;
    }
    else if (this.freeGameLeaving === false) {
        ThemeHotChili.ctl.setFooterSpinBtn();
        ThemeHotChili.ctl.disableSpinAndOtherBtns();
        this.freeGameLeaving = true;
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        TimerCallFunc.addCallFunc(function() {
            this.fgOutLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 0), this.visibleSize.width, this.visibleSize.height);
            this.addChild(this.fgOutLayerColor, 10);
            tools.setThemeOtherScale(this.fgOutLayerColor, 1.2, true);
            this.fgOutLayerColor.runAction(cc.sequence(
                cc.fadeTo(0.3, 215)
            ));
            cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'fg_end.mp3', false);
            var a = Math.floor(Math.random() * 2) + 1;
            cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "fgEnd" + a + ".mp3", false);
            this.fgPopOut = new ThemeHotChiliPopOut(ThemeHotChili.PopupType.FreeGamePopOut, bole.num_2_str(parseInt(ThemeHotChili.ctl.getTotalWinNumValue())));
            this.fgPopOut.setPosition(this.centerX, this.centerY);
            this.addChild(this.fgPopOut, 10);
            this.fgPopOut.setScale(SCREEN_RATIO_VERTICAL);
            this.fgPopOut.performPop(ThemeHotChili.PopState.Expand);
            TimerCallFunc.addCallFunc(this.stopFreeGameOut.bind(this), 30, this, this);
        }.bind(this), 1, this, this);
        return false;
    }
};
ThemeHotChiliGameLayer.prototype.stopFreeGameOut = function() {
    TimerCallFunc.unscheduleFunc(this.stopFreeGameOut, this, this);
    ConnectLost.getInstance().recover();

    if (this.fgOutLayerColor && !this.fgOutLayerColor._isDestroyed) {
        this.fgOutLayerColor.runAction(cc.sequence(
            cc.fadeOut(0.3)
        ));
        TimerCallFunc.addCallFunc(function() {
            if (this.fgOutLayerColor && !this.fgOutLayerColor._isDestroyed) {
                this.fgOutLayerColor.removeFromParent();
                this.fgOutLayerColor = null;
            }
        }.bind(this), 0.3, this, this);
    }

    var callBack = function() {
        if (this.fgPopOut && !this.fgPopOut._isDestroyed) {
            this.fgPopOut.removeFromParent();
            this.fgPopOut = null;
        }

        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "fg_transition.mp3", false);
        var spLoading = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/FG_guochang", ThemeHotChili.SpinePath + "fg/FG_guochang.atlas");
        this.addChild(spLoading, 10);
        spLoading.setPosition(this.centerX, this.centerY);
        spLoading.setAnimation(0, "guochang", false);
        spLoading.runAction(cc.sequence(
            cc.delayTime(2.4),
            cc.callFunc(function() {
                this.flagNode.setVisible(false);
                this.returnToMainFromFreeGame();
            }.bind(this)),
            cc.delayTime(0.5),
            cc.removeSelf()
        ));
    };

    if (this.fgPopOut && !this.fgPopOut._isDestroyed) {
        this.fgPopOut.performPop(ThemeHotChili.PopState.Shrink, callBack);
    }
};
ThemeHotChiliGameLayer.prototype.returnToMainFromFreeGame = function() {
    if (this.fgCountBoard && !this.fgCountBoard._isDestroyed) {
        this.fgCountBoard.removeFromParent();
        this.fgCountBoard = null;
    }

    this.background.setPosition(this.centerX, this.centerY - this.offset * SCREEN_RATIO_VERTICAL);
    this.spinLayer.collectDark.setPosition(this.spinLayer.centerX, this.spinLayer.centerY - 62);
    this.spinLayer.collectPot.setPosition(this.spinLayer.centerX - 4.5, this.spinLayer.centerY + 149);
    this.spinLayer.collectPot.setScale(1);
    this.spinLayer.ng_Chili.setPosition(this.spinLayer.centerX, this.spinLayer.centerY);
    this.spinLayer.ng_Chili.setScale(1);
    this.jackpotLayer.jpBack();
    this.jackpotLayer.setPosition(0, -this.offset * SCREEN_RATIO_VERTICAL);

    if (bole.notNull(this.logo)) {
        this.logo.setVisible(true);
    }

    this.spinLayer.effectLayer.forceStopShow();
    this.spinLayer.spinTable.resetReelList(THEME_GAME_TYPE.MAIN);
    this.spinLayer.resetNgTable(6 - this.fgType);
    this.spinLayer.effectLayer.lineAnimator.sync();
    this.spinLayer.spinTable.restoreTable();

    TimerCallFunc.addCallFunc(function() {
        this.spinLayer.effectLayer.lineAnimator.sync();
        this.spinLayer.spinTable.restoreTable();
    }.bind(this), 0.1, this, this);

    this.freeSpinIndex = -1;
    this.freeSpinNum = -1;
    this.fgType = -1;
    this.fg_idx = -1;
    this.fg_total_round = -1;
    this.unloadFgImgRes();

    TimerCallFunc.addCallFunc(function() {
        ThemeHotChili.ctl.showThemeActivityNode();
        var callback = function() {
            this.freeGameLeaving = false;
            this.setGameType(THEME_GAME_TYPE.MAIN);
            ThemeHotChili.ctl.ngPerformOver();
            EventCenter.pushEvent(EVT.SYSTEM.BET_CHANGE);
            ThemeHotChili.gameLayer.theme.checkTip();
            ThemeHotChili.ctl.setTurboVisible(true);
            ThemeHotChili.ctl.forceSetTurboStatus(this.turboFlag);
            ThemeHotChili.ctl.enableSpinAndOtherBtns();
            ThemeHotChili.ctl.turnOnAutoSpinCheck();

            if (ThemeHotChili.ctl.getAutoStatus()) {
                ThemeHotChili.ctl.setFooterAutoSpinBtn();
            } else {
                ThemeHotChili.ctl.setFooterSpinBtn();
            }

            this.musicManager.playNG_BGM();
            ThemeHotChili.ctl.fadeLoopMusic(3, 2, 1, 0);
        }.bind(this);

        var bgAllWinNum = parseFloat(ThemeHotChili.ctl.getTotalWinNumValue());
        var winType;

        if (this.spinLayer.spinResult.big_win_1) {
            winType = ThemeWinNode.BigWin;
        } else if (this.spinLayer.spinResult.super_win_1) {
            winType = ThemeWinNode.SuperWin;
        } else if (this.spinLayer.spinResult.mega_win_1) {
            winType = ThemeWinNode.MegaWin;
        } else if (this.spinLayer.spinResult.epic_win_1) {
            winType = ThemeWinNode.EpicWin;
        } else if (this.spinLayer.spinResult.ultimate_win_1) {
            winType = ThemeWinNode.UltimateWin;
        } else {
            winType = false;
        }

        if (!winType) {
            callback();
        } else {
            ThemeHotChili.ctl.preloadBWImgRes();

            TimerCallFunc.addCallFunc(function() {
                ThemeHotChili.ctl.performBigWin(winType, bgAllWinNum, callback);
            }.bind(this), 0.1, null, this);
        }
    }.bind(this), 0.5, this, this);
};
ThemeHotChiliGameLayer.prototype.processNextRoundBonusGame = function() {
    this.bonusSpinIndex++;

    if (this.bonusSpinIndex <= this.bonusSpinNum) {
        this.bgCountNum.string = this.bonusSpinIndex + "/" + this.bonusSpinNum;
        this.spinLayer.effectLayer.forceStopShow();
        this.spinLayer.autoAvailableTmp = false;
        this.fakeSpin();
        
        ThemeHotChili.ctl.requestSpecialFreeGameSpin();
        ThemeHotChili.ctl.setFooterStopBtn();
        ThemeHotChili.ctl.disableStop();
        return true;
    }
    else if (!this.bonusGameLeaving) {
        ThemeHotChili.ctl.setFooterSpinBtn();
        ThemeHotChili.ctl.disableSpinAndOtherBtns();
        this.bonusGameLeaving = true;
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        this.bgOutLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 150), this.visibleSize.width, this.visibleSize.height);
        this.addChild(this.bgOutLayerColor, 10);
        
        tools.setThemeOtherScale(this.bgOutLayerColor, 1.2, true);
        
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'fgend.mp3', false);
        
        this.bgPopOut = new ThemeHotChiliPopOut(ThemeHotChili.PopupType.BonusGamePopOut, bole.num_2_str(Number(ThemeHotChili.ctl.getTotalWinNumValue())));
        this.bgPopOut.setPosition(this.centerX, this.centerY);
        this.bgPopOut.setScale(SCREEN_RATIO_VERTICAL);
        this.addChild(this.bgPopOut, 10);
        this.bgPopOut.performPop(ThemeHotChili.PopState.Expand);
        TimerCallFunc.addCallFunc(this.stopBonusGameOut, 30, this, this);
        return false;
    }
};

ThemeHotChiliGameLayer.prototype.stopBonusGameOut = function() {
    TimerCallFunc.unscheduleFunc(this.stopBonusGameOut, this, this);
    ConnectLost.getInstance().recover();
    this.bgOutLayerColor.removeFromParent();
    this.bgOutLayerColor = null;
    let callBack = function() {
        this.bgPopOut.removeFromParent();
        this.bgPopOut = null;
        let spLoading = sp._SkeletonAnimation.createWithJsonFile(ThemeHotChili.SpinePath + "fg/FG_GuoChang.json", ThemeHotChili.SpinePath + "fg/FG_GuoChang.atlas", 1);
        this.addChild(spLoading,10);
        spLoading.setPosition(this.centerX, this.centerY);
        spLoading.setAnimation(0, "FG_GuoChang", false);
        spLoading.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(function(){
                this.returnToMainFromBonusGame()
            }, this),
            cc.removeSelf(true)
        ));
    };
    this.bgPopOut.performPop(ThemeHotChili.PopState.Shrink, callBack);
};

ThemeHotChiliGameLayer.prototype.changeLang = function() {
    if (bole.notNull(this.logo)) {
        this.logo.setTexture(bole.translateImage("logo", ThemeHotChili.themeId));
    }
};

ThemeHotChiliGameLayer.prototype.setGameType = function(t) {
    ThemeHotChili.ctl.setGameType(t);
    this.spinLayer.spinTable.rearrangeTable();
}

ThemeHotChiliGameLayer.prototype.onGameExit = function() {
    TimerCallFunc.clearGroup(this);
    TimerCallFunc.clearGroup(this.spinLayer);
    TimerCallFunc.clearGroup(this.jackpotLayer);
    TimerCallFunc.clearGroup(this.spinLayer.spinTable);
    TimerCallFunc.clearGroup(this.spinLayer.effectLayer);

    this.spinLayer.effectLayer.lineAnimator.destruct();
    ThemeHotChili.QuickStartReelOrders = null;
};

ThemeHotChiliGameLayer.prototype.preloadFgImgRes = function() {
    this.theme.preloadImgResAsync(this.theme.fgImgResList.manual, () => { 
        this.fgImgReady = true 
    });
}

ThemeHotChiliGameLayer.prototype.unloadFgImgRes = function() {
    this.theme.unloadImgRes(this.theme.fgImgResList.manual);
    this.theme.unloadImgRes(this.theme.fgImgResList.auto);
    this.fgImgReady = false;
}

ThemeHotChiliGameLayer.prototype.preloadBgImgRes = function() {
    this.theme.preloadImgResAsync(this.theme.bgImgResList.manual, () => { 
        this.bgImgReady = true 
    });
}
ThemeHotChiliGameLayer.prototype.unloadBgImgRes = function() {
    this.theme.unloadImgRes(this.theme.bgImgResList.manual);
    this.theme.unloadImgRes(this.theme.bgImgResList.auto);
    this.bgImgReady = false;
}
ThemeHotChiliGameLayer.prototype.fakeSpin = function() {
    this.spinLayer.spinTable.fakeSpin();
}

ThemeHotChiliGameLayer.prototype.fakeSshowAwardNoticepin = function() {
    cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "bigprize.mp3", false);
    this.extendSpin = true;
    this.awardNotice = {};
    this.awardNotice2 = {};
    this.awardNoticePosX = [this.centerX - 128 * 2 * SCREEN_RATIO_VERTICAL, this.centerX, this.centerX + 128 * 2 * SCREEN_RATIO_VERTICAL];
    this.awardLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 150), this.visibleSize.width, this.visibleSize.height);
    this.addChild(this.awardLayerColor, 10);

    tools.setThemeOtherScale(this.awardLayerColor, 1.2, true);

    for (let i = 1; i <= 3; i++) {
        this.runAction(cc.sequence(
            cc.delayTime(0.26 * (i - 1)),
            cc.callFunc(() => {
                this.awardNotice[i] = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_dajiangyugao", ThemeHotChili.SpinePath + "ng/NG_dajiangyugao.atlas");
                this.awardNotice[i].setPosition(this.awardNoticePosX[i], 0);
                this.awardNotice[i].setScale(SCREEN_RATIO_VERTICAL);
                this.addChild(this.awardNotice[i], 10);
                this.awardNotice[i].setAnimation(0, "glow", false);
                this.awardNotice[i].setVisible(true);

                this.awardNotice2[i] = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_dajiangyugao", ThemeHotChili.SpinePath + "ng/NG_dajiangyugao.atlas");
                this.awardNotice2[i].setPosition(this.awardNoticePosX[i], 0);
                this.awardNotice2[i].setScale(SCREEN_RATIO_VERTICAL);
                this.addChild(this.awardNotice2[i], 10);
                this.awardNotice2[i].setAnimation(0, "huo", false);
                this.awardNotice2[i].setVisible(true);
            })
        ));
    }

    TimerCallFunc.addCallFunc(() => {
        for (let i = 1; i <= 3; i++) {
            if (this.awardNotice[i] && !cc.sys.isObjectValid(this.awardNotice[i])) {
                this.awardNotice[i].removeFromParent();
                this.awardNotice[i] = null;
            }
        }
        if (this.awardLayerColor && !cc.sys.isObjectValid(this.awardLayerColor)) {
            this.awardLayerColor.runAction(cc.sequence(
                cc.fadeOut(0.3)
            ));
            TimerCallFunc.addCallFunc(() => {
                if (this.awardLayerColor && !cc.sys.isObjectValid(this.awardLayerColor)) {
                    this.awardLayerColor.removeFromParent();
                    this.awardLayerColor = null;
                }
            }, 0.3, this, this);
        }
        for (let i = 1; i <= 5; i++) {
            this.spinLayer.spinTable.cellList[i].speedPosNode.stopAllActions();
            this.spinLayer.spinTable.cellList[i].speedPosNode.runAction(cc.easeSineInOut(cc.moveTo(0.10, cc.v2(0, 2800))));
        }
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "dajiangyugao.mp3", false);
        this.shakeScreen(2);
    }, 1.8, null, this);
    TimerCallFunc.addCallFunc(() => {
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "bigprize_end.mp3", false);
        this.extendSpin = false;
        this.spinLayer.spinTable.stopAllExpect();
        this.spinLayer.stopSpinTable();
    }, 3.8, null, this);
}
ThemeHotChiliGameLayer.prototype.shakeScreen = function(duration, shakeRange) {
    let moveTime = 0.05;
    let unitLength = 2;
    if (shakeRange) {
        unitLength *= shakeRange;
    }
    let heightScale = 2;
    let totalTime = duration;
    let time = Math.floor((totalTime / 5) / moveTime);
    this.spinLayer.spinTable.runAction(
        cc.sequence(
            cc.repeat(
                cc.sequence(
                    cc.callFunc(() => {
                        this.spinLayer.setPosition(unitLength, 2 * unitLength * heightScale);
                    }),
                    cc.delayTime(moveTime),
                    cc.callFunc(() => {
                        this.spinLayer.setPosition(-2 * unitLength, unitLength * heightScale);
                    }),
                    cc.delayTime(moveTime),
                    cc.callFunc(() => {
                        this.spinLayer.setPosition(2 * unitLength, unitLength * heightScale);
                    }),
                    cc.delayTime(moveTime),
                    cc.callFunc(() => {
                        this.spinLayer.setPosition(-unitLength, 2 * unitLength * heightScale);
                    }),
                    cc.delayTime(moveTime),
                    cc.callFunc(() => {
                        this.spinLayer.setPosition(0, 0);
                    }),
                    cc.delayTime(moveTime)
                ), time
            )
        )
    );
}

ThemeHotChiliGameLayer.prototype.expectStart = function() {
    ThemeHotChili.ctl.disableSpinAndOtherBtns();
    this.isExpecting = true;
}
ThemeHotChiliGameLayer.prototype.expectEnd = function() {
    this.isExpecting = null;
}

let jpLockIntervalTime = new Date().getTime();
ThemeHotChiliGameLayer.prototype.judgeJpLockInterval = function() {
    if (new Date().getTime() - jpLockIntervalTime < 0.1) {
        jpLockIntervalTime = new Date().getTime();
        return;
    } else {
        jpLockIntervalTime = new Date().getTime();
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'jp_lock.mp3', false);
    }
}

let jpUnLockIntervalTime = new Date().getTime();
ThemeHotChiliGameLayer.prototype.judgeJpUnLockInterval = function() {
    if (new Date().getTime() - jpUnLockIntervalTime < 0.1) {
        jpUnLockIntervalTime = new Date().getTime();
        return;
    } else {
        jpUnLockIntervalTime = new Date().getTime();
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'jp_unlock.mp3', false);
    }
}

let scIntervalTime = new Date().getTime();
ThemeHotChiliGameLayer.prototype.judgeScInterval = function(reelIndex) {
    if (new Date().getTime() - scIntervalTime < 0.1) {
        scIntervalTime = new Date().getTime();
        return;
    } else {
        scIntervalTime = new Date().getTime();
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "reelsc" + reelIndex + ".mp3", false);
    }
}

let bgScIntervalTime = new Date().getTime();
ThemeHotChiliGameLayer.prototype.judgeBgScInterval = function() {
    if (new Date().getTime() - bgScIntervalTime < 0.1) {
        bgScIntervalTime = new Date().getTime();
        return;
    } else {
        bgScIntervalTime = new Date().getTime();
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "reelbgsc.mp3", false);
    }
}

ThemeHotChiliGameLayer.prototype.processThemeChoiceResult = function(data) {
    console.log("processThemeChoiceResult", data);
    this.fgSelectLayer.reSend = null;
    this.processFreeGameResult(data);
    TimerCallFunc.addCallFunc(() => {
        this.performGotFreeGameTip();
    }, 1.5, this, this);
}

ThemeHotChiliGameLayer.prototype.checkGameFever = function() {
    const type = this.gameFeverNode.getGameFeverType();
    if (type > 0) {
        this.createGameFeverPop(type);
    }
}
ThemeHotChiliGameLayer.prototype.createGameFeverPop = function(type) {
    ThemeHotChili.ctl.disableSpinAndOtherBtns();
    this.gfLayerColor = new cc._LayerColor(cc.color(0, 0, 0, 150), this.visibleSize.width, this.visibleSize.height);
    this.addChild(this.gfLayerColor, 1000000);

    tools.setThemeOtherScale(this.gfLayerColor, 1.2, true);

    this.gameFeverPop = new ThemeHotChiliPopOut(ThemeHotChili.PopupType.GameFever, type);
    this.gameFeverPop.setPosition(this.centerX, this.centerY);
    this.gameFeverPop.setScale(SCREEN_RATIO);
    this.addChild(this.gameFeverPop, 1000000);
    this.gameFeverPop.performPop(ThemeHotChili.PopState.Expand);
    TimerCallFunc.addCallFunc(() => {
        this.destructGameFeverPop();
    }, 30, this, this);
}
ThemeHotChiliGameLayer.prototype.destructGameFeverPop = function() {
    TimerCallFunc.unscheduleFunc(this.destructGameFeverPop, this, this);
    if (this.gfLayerColor && !this.gfLayerColor.isValid) {
        this.gfLayerColor.removeFromParent(true);
        this.gfLayerColor = null;
    }
    const deleteFn = () => {
        ThemeHotChili.ctl.enableSpinAndOtherBtns();
        if (this.gameFeverPop) {
            this.gameFeverPop.removeFromParent(true);
            this.gameFeverPop = null;
        }
    };
    if (this.gameFeverPop) {
        this.gameFeverPop.performPop(ThemeHotChili.PopState.Shrink, deleteFn);
    }
}


