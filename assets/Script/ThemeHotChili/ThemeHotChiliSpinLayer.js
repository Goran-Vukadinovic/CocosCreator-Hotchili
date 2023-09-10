require("./ThemeResource");

ThemeHotChiliSpinLayer = cc.Layer.extend({
    ctor: function() {
        this.spinResult = null;
        this.spinTable = null;
        this.effectLayer = null;
        this.state = ThemeHotChili.SpinLayerState.Idle,
        this.autoAvailableTmp = true,
        this.init();
    },
});

ThemeHotChiliSpinLayer.prototype.init = function() {
    var visibleOrigin = cc.director.getVisibleOrigin();
    var visibleSize = cc.director.getVisibleSize();
    this.centerX = visibleOrigin.x + visibleSize.width / 2;
    this.centerY = visibleOrigin.y + visibleSize.height / 2;
    var size = ThemeHotChili.CellSize;
    var distanceX = 128;
    var distanceY = 100;
    var posXList = [this.centerX - distanceX * 2 + 1, this.centerX - distanceX + 1, this.centerX + 1, this.centerX + distanceX + 1, this.centerX + distanceX * 2 + 1];

    var visibleRowNum = ThemeHotChili.VisibleCellNum;
    var centerIndex = (visibleRowNum - 1) / 2 + 1;
    var reelCenterY = 281;
    var posYList = [];
    for (var i = 0; i < visibleRowNum; i++) {
        posYList[i] = (this.centerY - reelCenterY) + (centerIndex - (i + 1)) * distanceY;
    }

    this.tableCenterPos = cc.v2(this.centerX, this.centerY - reelCenterY);
    this.posXList = posXList;
    this.posYList = posYList;

    this.collectDark = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/collectDark.png');
    this.collectDark.setPosition(this.centerX, this.centerY - 62);
    this.addChild(this.collectDark);

    this.collectPot = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_box");
    this.collectPot.setPosition(this.centerX - 4.5, this.centerY + 149);
    this.collectPot.setAnimation(0, "idle1", true);    
    this.addChild(this.collectPot);

    this.ng_Chili = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_2lajiao");
    this.ng_Chili.setPosition(this.centerX, this.centerY);
    this.addChild(this.ng_Chili);

    this.ng_Chili.setVisible(false);

    //??this._initComponents();
    this.spinTable = new ThemeHotChiliSpinTable(size, posXList, posYList, 3);
    this.addChild(this.spinTable);

    this.effectLayer = new ThemeHotChiliEffectLayer();
    this.addChild(this.effectLayer);

    this._setCascadeOpacityEnabled(true);
    return true;
};

ThemeHotChiliSpinLayer.prototype.initFgTable = function(fgTableLineNum) {
    if (fgTableLineNum !== 3) {
        const size = ThemeHotChili.CellSize;
        const distanceX = 128; //两列reel之间的距离，需使用策划的定位距离
        const distanceY = 100;
        const posXList = [this.centerX - distanceX * 2 + 1, this.centerX - distanceX + 1, this.centerX + 1, this.centerX + distanceX + 1, this.centerX + distanceX * 2 + 1];
        
        const visibleRowNum = fgTableLineNum;
        const centerIndex = (visibleRowNum - 1) / 2 + 1;
        const reelCenterYList = [231, 181, 131];
        const reelCenterY = reelCenterYList[fgTableLineNum - 3];//中间element的Y坐标
        const posYList = [];
        for (let i = 0; i < visibleRowNum; i++) {
            posYList[i] = (this.centerY - reelCenterY) + (centerIndex - (i + 1)) * distanceY;
        }
        
        if (this.spinTable && !this.spinTable.isValid) {
            this.spinTable.removeFromParent();
            this.spinTable = null;
        }
        
        this.spinTable = new ThemeHotChiliSpinTable(size, posXList, posYList, fgTableLineNum);
        this.addChild(this.spinTable);
        this.spinTable.checkCellsInit();

        if (fgTableLineNum == 5) {
            this.collectPot.setPosition(this.centerX - 3, this.centerY + 279);
            this.collectPot.setScale(0.78);
            this.collectDark.setPosition(this.centerX - 2, this.centerY + 109);
            this.ng_Chili.setPosition(this.centerX, this.centerY + 172);
            this.ng_Chili.setScale(0.78);
        } else if (fgTableLineNum == 6) {
            this.collectPot.setPosition(this.centerX - 2.5, this.centerY + 341);
            this.collectPot.setScale(0.67);
            this.collectDark.setPosition(this.centerX - 1.5, this.centerY + 205.5);
            this.ng_Chili.setPosition(this.centerX, this.centerY + 244);
            this.ng_Chili.setScale(0.67);
        } else if (fgTableLineNum == 4) {
            this.collectPot.setPosition(this.centerX - 4.5, this.centerY + 249);
            this.collectDark.setPosition(this.centerX, this.centerY + 38);
            this.ng_Chili.setPosition(this.centerX, this.centerY + 100);
        }
    }
}
ThemeHotChiliSpinLayer.prototype.resetNgTable = function(fgTableLineNum) {
    if (fgTableLineNum !== 3) {
        const size = ThemeHotChili.CellSize;
        const distanceX = 128; //两列reel之间的距离，需使用策划的定位距离
        const distanceY = 100;
        const posXList = [this.centerX - distanceX * 2 + 1, this.centerX - distanceX + 1, this.centerX + 1, this.centerX + distanceX + 1, this.centerX + distanceX * 2 + 1];

        //各个主题的visibleRowNum, reelCenterY不同
        const visibleRowNum = ThemeHotChili.VisibleCellNum;
        const centerIndex = (visibleRowNum - 1) / 2 + 1;
        const reelCenterY = 281; //中间element的Y坐标
        const posYList = [];
        for (let i = 0; i < visibleRowNum; i++) {
            posYList[i] = (this.centerY - reelCenterY) + (centerIndex - (i + 1)) * distanceY;
        }

        if (this.spinTable && !this.spinTable.isValid) {
            this.spinTable.removeFromParent();
            this.spinTable = null;
        }

        this.spinTable = new ThemeHotChiliSpinTable(size, posXList, posYList, 3);
        this.addChild(this.spinTable);
        this.spinTable.checkCellsInit();
    }
}

ThemeHotChiliSpinLayer.prototype._initComponents = function() {
    this._spinListenNode = new cc.Node();
    this.addChild(this._spinListenNode, 1);
    this._spinListenNode.setPosition(this.centerX, this.centerY - 181);

    const config = {
        reelConfig: [
            {
                view: {
                    reelHeight: 100 * 3,
                    symbolHeight: 100,
                    reelClippingIntW: 128 * 5 * 1,
                    reelClippingIntH: 100 * 3,
                }
            }
        ]
    };

    const _componentPath = [
        "BLSlotsCore.Components.BLMimicSpinComponent",
    ];

    for (let i = 0; i < _componentPath.length; i++) {
        require(_componentPath[i]);
    }

    const componentNameMap = {
        MimicSpinComponent: BLMimicSpinComponent,
    };

    const reelComponents = {};
    for (const k in componentNameMap) {
        const className = componentNameMap[k];
        const component = new className(this._spinListenNode, config);
        component.load();
        reelComponents[k] = component;
        this[k] = component;
    }
}
ThemeHotChiliSpinLayer.prototype.spinLayerChangeToRoll = function() {
    this.stateChangeTo(ThemeHotChili.SpinLayerState.Rolling);
    AudioEngine.setMusicVolume(1);
    ThemeHotChili.gameLayer.musicManager.playNG_BGM();
    //this.getGameLayerInstance().disablePuzzleEntrance();
}
ThemeHotChiliSpinLayer.prototype.spinLayerChangeToShow = function() {
    if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAPFREE ||
            ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.BONUS) {
        ThemeHotChili.ctl.reelsStopped();
        ThemeHotChili.ctl.footer.setLabelDescription('Clear');
        this.stateChangeTo(ThemeHotChili.SpinLayerState.Show);
        this.performWinShow();
        this.autoAvailableTmp = true;
    }
}
ThemeHotChiliSpinLayer.prototype.effectLayerChangeToIdle = function() {
    console.log(`cjh-----SpinLayer self.state = ${this.state}, ${this.autoAvailableTmp}`);
    if (this.state === ThemeHotChili.SpinLayerState.Show) {
        this.stateChangeTo(ThemeHotChili.SpinLayerState.Idle);
        let isNgPerform = false; //无弹窗用flase
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN && this.spinResult.free_game_trig === 0) {
            if (ThemeHotChili.ctl.ngPerformOver()) {
                ConnectLost.getInstance().recover();
                ThemeHotChili.gameLayer.theme.checkTip();
                EventCenter.pushEvent(EVT.SYSTEM.BET_CHANGE);
                isNgPerform = true;
            }
        }
        if (!isNgPerform && this.state === ThemeHotChili.SpinLayerState.Idle && this.autoAvailableTmp) {
            console.log('cjh-----SpinLayer 0');
            this.processNextStep();
        }
    } else if (this.state === ThemeHotChili.SpinLayerState.Idle && this.autoAvailableTmp) { // 刚进入游戏时判断（正常进和重连进）
        console.log('cjh-----SpinLayer 1');
        this.processNextStep();
    }
}
ThemeHotChiliSpinLayer.prototype.processNextStep = function() {
    console.log(`cjh-----SpinLayer processNextStep = ${ThemeHotChili.ctl.getGameType()}, ${ThemeHotChili.ctl.getAutoStatus()}`);
    if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN && ThemeHotChili.ctl.getAutoStatus()) {
        this.autoAvailableTmp = false;
        this.stopShow();
        if (ThemeHotChili.ctl.toSpin()) {
            ThemeHotChili.ctl.footer.setLabelDescription('GoodLuck');
        } else {
            ThemeHotChili.ctl.enableAuto(false);
        }
    } else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE && !ThemeHotChili.gameLayer.freeGameLeaving) {
        ThemeHotChili.gameLayer.processNextRoundFreeGame();
    } else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.BONUS && !ThemeHotChili.gameLayer.bonusGameLeaving) {
        ThemeHotChili.gameLayer.processNextRoundBonusGame();
    } else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAPFREE) {
        ThemeHotChili.gameLayer.processNextRoundMapFreeGame();
    }
}
ThemeHotChiliSpinLayer.prototype.processSpinResult = function(result) {
    const isEmpty = (table) => {
        for (const [k, v] of Object.entries(table)) {
            if (v !== null) {
                return false;
            }
        }
        return true;
    };

    if (result === null || isEmpty(result)) {
        return;
    }

    ConnectLost.getInstance().ignore();

    this.spinResult = result;
    console.log("spinResult = ", result);

    const multiList = [
        [18,19,20,21,22,23,24,25,26,27,28,29,30],
        [20,21,22,24,26,27,28,29,30,32,33,34,35],
        [21,24,27,29,31,32,33,34,35,36,37,38,39],
        [24,29,31,32,33,34,35,37,38,39,40,41,42],
        [34,35,37,38,40,41,42,43,44,45,46,47,48]
    ];

    if (this.spinResult.upper_reel && this.spinResult.upper_reel.length > 0) {
        for (let i = 0; i < 5; i++) {
            if (this.spinResult.upper_reel[i] === 12) {
                this.spinResult.upper_reel[i] = Math.floor(Math.random() * 4) + 14;
            } else if (this.spinResult.upper_reel[i] === 13) {
                this.spinResult.upper_reel[i] = multiList[i][Math.floor(Math.random() * multiList[i].length)];
            }
        }
    }
    
    if (this.spinResult.down_reel && this.spinResult.down_reel.length > 0) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < this.spinResult.down_reel[i].length; j++) {
                if (this.spinResult.down_reel[i][j] === 12) {
                    this.spinResult.down_reel[i][j] = Math.floor(Math.random() * 4) + 14;
                } else if (this.spinResult.down_reel[i][j] === 13) {
                    this.spinResult.down_reel[i][j] = multiList[i][Math.floor(Math.random() * multiList[i].length)];
                }
            }
        }
    }
    
    this.spinTable.spinResult = this.spinResult.item_list; // 传入结果
    this.spinTable.upperSymbols = this.spinResult.upper_reel;
    this.spinTable.rollingEndResult = this.spinResult.down_reel;

    if (self.spinResult.win_jp && self.spinResult.win_jp > 0) {
        for (let i = 1; i <= self.spinResult.jp_value.length; i++) {
            if (i === self.spinResult.win_jp) {
                ThemeHotChili.gameLayer.jackpotLayer.setMimicDuration(6);
            }
            ThemeHotChili.gameLayer.jackpotLayer.startMimic(i, self.spinResult.jp_value[i - 1]);
        }
    }
    
    if (self.spinResult.free_game_trig === 1) {
        ThemeHotChili.gameLayer.preloadFgImgRes();
    }
    if (self.spinResult.bonus_game_trig === 1) {
        ThemeHotChili.gameLayer.preloadBgImgRes();
    }
    if (self.spinResult.big_win || self.spinResult.super_win || self.spinResult.mega_win || self.spinResult.epic_win || self.spinResult.ultimate_win) {
        ThemeHotChili.ctl.preloadBWImgRes();
    }
    
    if (self.spinResult.award_notice && self.spinResult.award_notice === 1) {
        ThemeHotChili.gameLayer.showAwardNotice();
    }
    
    if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE) {
        if (ThemeHotChili.gameLayer.freeSpinIndex >= 1) {
            ThemeHotChili.ctl.enableStop();
        }
        if (self.spinResult.fg_idx) {
            ThemeHotChili.gameLayer.fg_idx = self.spinResult.fg_idx;
        }
        if (self.spinResult.fg_total_round) {
            ThemeHotChili.gameLayer.fg_total_round = self.spinResult.fg_total_round;
        }
    }
      
    self.spinTable.spin();
}

ThemeHotChiliSpinLayer.prototype.stopSpinTable = function() {
    this.spinTable.stop();
};

ThemeHotChiliSpinLayer.prototype.performWinShow = function() {
    this.effectLayer.perform(this.spinResult);
};

ThemeHotChiliSpinLayer.prototype.stopShow = function() {
    return this.effectLayer.stopShow();
};

ThemeHotChiliSpinLayer.prototype.stateChangeTo = function(s, isNgPerformOverBack) {
    this.state = s;
    console.log('cjh-----SpinLayer :state=', s, isNgPerformOverBack);
    // idle 状态由 ThemeControlNew 在弹窗完成时切换
    if (isNgPerformOverBack && s === ThemeHotChili.SpinLayerState.Idle) {
        // 执行下一轮 自动 spin 处理
        this.processNextStep();
    }
};

ThemeHotChiliSpinLayer.prototype.wildCollect = function() {
    var flag;
    for (var i = 1; i <= 5; i++) {
        for (var j = 0; j < this.spinTable.cellList[i].wildPosList.length; j++) {
            ThemeHotChili.gameLayer.flyLayer.wildCollect(this.spinTable.cellList[i].wildPosList[j]);
            flag = true;
        }
        this.spinTable.cellList[i].wildPosList = [];

        for (var j = 0; j < this.spinTable.cellList[i].indexToChange.length; j++) {
            var index = this.spinTable.cellList[i].indexToChange[j];
            this.spinTable.cellList[i].cells[index].performWildCollect();
        }
        this.spinTable.cellList[i].indexToChange = [];
    }
    if (flag) { // 收集后的逻辑
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "collectFly.mp3", false);
        this.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(function() {
                ThemeHotChili.gameLayer.adjustDragonBallState(this.spinResult.bonus_state);
            }, this)
        ));
    }
};