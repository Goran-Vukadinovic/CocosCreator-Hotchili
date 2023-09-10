
var PIC_PATH = "footer/";
DM_THEME_CAN_SPIN = true;

var dailyMissionScale;

var BTNFILESPATH = {
    NORMAL_SPIN: [
        PIC_PATH + "btn_spin.png",
        PIC_PATH + "btn_spin_clicked.png",
        PIC_PATH + "btn_spin_disabled.png"
    ],
    AUTO_SPIN: [
        PIC_PATH + "btn_spin.png",
        PIC_PATH + "btn_spin.png",
        PIC_PATH + "btn_spin.png"
    ],
    STOP_SPIN: [
        PIC_PATH + "btn_spin.png",
        PIC_PATH + "btn_spin_clicked.png",
        PIC_PATH + "btn_spin_disabled.png"
    ],
    V_NORMAL_SPIN: [
        PIC_PATH + "btn_spin.png",
        PIC_PATH + "btn_spin_clicked.png",
        PIC_PATH + "btn_spin_disabled.png"
    ],
    V_AUTO_SPIN: [
        PIC_PATH + "btn_spin.png",
        PIC_PATH + "btn_spin.png",
        PIC_PATH + "btn_spin.png"
    ],
    V_STOP_SPIN: [
        PIC_PATH + "btn_spin.png",
        PIC_PATH + "btn_spin_clicked.png",
        PIC_PATH + "btn_spin_disabled.png"
    ],
    PAYTABLE_NEXT: [
        PIC_PATH + "paytable/next_normal.png",
        PIC_PATH + "paytable/next_click.png",
    ],
    PAYTABLE_PREV: [
        PIC_PATH + "paytable/back_normal.png",
        PIC_PATH + "paytable/back_click.png",
    ],
    PAYTABLE_BACK: [
        PIC_PATH + "paytable/backtogame_normal.png",
        PIC_PATH + "paytable/backtogame_click.png",
    ]
};

var SPIN_STATUS_NAME = {
    NORMAL_SPIN: "normalspin",
    AUTO_SPIN: "autospin",
};

var FOOT_Z_ORDER = {
    DAILY_MISSION: 101,
    MAX_BET_TIP: 202
};
var delayEnableSpinTag = 10086;


ThemeFooter = cc.Class({
    extends: cc.Node,
    name:"ThemeFooter",
    ctor: function() {
        var ctl = arguments[0];
        this.ctl = ctl;
        this.isFreeSpin = false;

        this.btnMaxBet = new cc.Node("btnMaxBet");
        this.root = new cc.Node("root");
        this.spFooterWin = new cc.SkeletonAnimation("dddd");
        this.underLabelWinNode = new cc.Node();
        this.dailyMissionNode = new cc.Node("");
        this.flameNode = new cc.Node();
        this.flameBetTipNode = new cc.Node.create();
        this.flameBetTip = new cc.Node();
        this.flameBetTipLabel = new cc.Node();
        this.dailyMissionBtn = new cc.Node();
        this.dailyMissionNodeSwitch = false;
        this.dmNodeCurStatus = true;
        this.totalBetNod = new cc.Node();
        this.betTipNode = new cc.Node();
        this.labelTotalBet = new cc._LabelBMFont();
        this.labelAverageBet = new cc._LabelBMFont();
        this.averageLabelNew = new cc.Node();
        this.btnAddBet = new cc.Node();
        this.btnSubBet = new cc.Node();
        this.upperTotalBetNode = cc.Node.create();
        this.btnMaxBet = new cc.Node();
        this.qidong = new cc.Node();
        this.winNode = new cc.Node();
        this.autoNode = new cc.Node();
        this.spinNode = new cc.Node();
        this.spinCountBoard = new cc.Node();
        this.spinCountLabel = new cc.Node();
        this.btnSpin = new cc.Node();
        this.spinCountDownNode = new cc.Node();
        this.spinNode.changeBtnState = function(theState, isStop, isForbid) {};
        this.spinNode.refreshState = function(theSelf) {};
        this.btnMaxBet.setMaxState = function(){};
        this.btnAddBet.setBright = function(){};
        this.btnMaxBet.setBright = function(){};
        this.btnSubBet.setBright = function(){};


    }
});

ThemeFooter.prototype.changeBackgroundParticle = function(animation) {
    if (this.spFooterWin) {
        var pos = cc.p(this.spFooterWin.getPosition());
        var zOrder = this.spFooterWin.zIndex;
        var fatherNode = this.spFooterWin.getParent();
        this.spFooterWin.removeFromParent();
        this.spFooterWin = animation;
        fatherNode.addChild(this.spFooterWin, zOrder);
        this.spFooterWin.setPosition(pos);
    }
};
    
ThemeFooter.prototype.getValueWorldPos = function() {
    return tools.getWorldPos(this.spFooterWin);
};
    
ThemeFooter.prototype.addWinAnimationToFooter = function(animation) {
    var pos = cc.p(this.spFooterWin.getPosition());
    var zOrder = this.spFooterWin._getLocalZOrder();
    var fatherNode = this.spFooterWin.getParent();
    fatherNode.addChild(animation, zOrder);
    animation.setPosition(pos);
};
    
ThemeFooter.prototype.getNumberWorldPos = function() {
    var pos = cc.p(this.spFooterWin.getPosition());
    var fatherNode = this.spFooterWin.getParent();
    pos.y = pos.y - 35;
    return fatherNode.convertToWorldSpace(pos);
};
    
ThemeFooter.prototype.onExit = function() {
    EventCenter.removeEvent(EVT.THEME.MIMIC_SPIN, this._mimicSpin, this);
    EventCenter.removeEvent(EVT.DAILY_MISSION.FOOTER_ICON_COLLECT, this.performDMCollect, this);
    EventCenter.removeEvent(EVT.DAILY_MISSION.FOOTER_NEXT_MISSION, this.showNextTips, this);
    TimerCallFunc.clearGroup(this);
    
    if (cc.spriteFrameCache.isSpriteFramesWithFileLoaded("footer/footer/game_footer.plist")) {
        cc.spriteFrameCache.removeSpriteFramesFromFile("footer/footer/game_footer.plist");
    }
};
    
ThemeFooter.prototype.getCenterWorldPos = function() {
    var winNode = this.root.getChildByName("node_win");
    if (bole.notNull(winNode)) {
        return winNode.getParent().convertToWorldSpace(cc.p(winNode.getPosition()));
    } else {
        return cc.p(0, 0);
    }
};
    
ThemeFooter.prototype.getUnderLabelWinNode = function() {
    return this.underLabelWinNode;
};
    
ThemeFooter.prototype.getWinNodeWorldPosition = function() {
    return this.winNode.getParent().convertToWorldSpace(cc.p(this.winNode.getPosition()));
};
    
ThemeFooter.prototype.showPlayHideOther = function() {
    this.root.getChildByName("node_win").setVisible(false);
    this.root.getChildByName("node_daily_mission").setVisible(false);
    this.root.getChildByName("node_total_bet").setVisible(false);
    this.root.getChildByName('node_total_bet_info').setVisible(false);
    this.root.getChildByName("node_max_bet").setVisible(false);
    this.root.getChildByName("bet_tip_node").setVisible(false);  
};
    
ThemeFooter.prototype.showPuzzleFooter = function() {
    this.root.getChildByName("node_daily_mission").setVisible(true);
    this.refreshDailyMission();
};

////
ThemeFooter.prototype.initEvent = function() {
    this.btnSpin.addTouchEventListener(this.spinEvent, this)
    this.btnSubBet.addTouchEventListener(this.touchDownBet, this)
    this.btnAddBet.addTouchEventListener(this.touchUpBet, this)
    this.btnMaxBet.addTouchEventListener(this.touchMaxBet, this)
    EventCenter.registerEvent(EVT.THEME.MIMIC_SPIN, this._mimicSpin, this)
    EventCenter.registerEvent(EVT.DAILY_MISSION.FOOTER_ICON_COLLECT, this.performDMCollect, this)
    EventCenter.registerEvent(EVT.DAILY_MISSION.FOOTER_NEXT_MISSION, this.showNextTips, this)
}

ThemeFooter.prototype.spinEvent = function(sender, eventType) {
    if (eventType === ccui.TouchEventType.began) {
        if (this.checkCanClickSpin()) {
            this.ctl.touchSpinBtnBegan();
        }
        return false;
    } else if (eventType === ccui.TouchEventType.ended) {
        this.ctl.touchSpinBtnEnded();
        this.hideMaxBetTip();
    } else if (eventType === ccui.TouchEventType.canceled) {
        this.ctl.touchSpinBtnCanceled();
    }
};

ThemeFooter.prototype.touchDownBet = function(sender, eventType) {
    if (eventType === ccui.TouchEventType.began) {
        if (this.ctl.getThemeId() !== 110038) {
            if (bole.scene.theme && bole.scene.theme.dealTouchSubBetBtn && bole.scene.theme.dealTouchSubBetBtn()) {
                this.ignoreTouchSubBetBtnOnce = true;
                return;
            }
            this.btnSpin.setTouchEnabled(false);
            this.btnAddBet.setTouchEnabled(false);
            this.btnMaxBet.setTouchEnabled(false);
            this.ctl.touchSubBetBtnBegan();
            this.hideMaxBetTip();
        }
    } else if (eventType === ccui.TouchEventType.ended) {
        if (this.ignoreTouchSubBetBtnOnce) {
            this.ignoreTouchSubBetBtnOnce = null;
            return;
        }
        if (this.ctl.getThemeId() !== 110038) {
            this.btnSpin.setTouchEnabled(true);
            this.btnAddBet.setTouchEnabled(true);
            if (this.ctl.betControl.bet !== BetControl.getMaxBet()) {
                this.btnMaxBet.setTouchEnabled(true);
                this.btnMaxBet.setBright(true);
            }
            this.ctl.touchSubBetBtnEnded();
            bole.potp.send('behavior', {page: "manual_change_bet_down"});
        } else {
            this.ctl.changeToDownBet();
        }
        this.removeUnClickLayer();
    } else if (eventType === ccui.TouchEventType.canceled) {
        if (this.ctl.getThemeId() !== 110038) {
            this.btnSpin.setTouchEnabled(true);
            this.btnAddBet.setTouchEnabled(true);
            if (this.ctl.betControl.bet !== BetControl.getMaxBet()) {
                this.btnMaxBet.setTouchEnabled(true);
                this.btnMaxBet.setBright(true);
            }
            this.ctl.touchSubBetBtnCanceled();
        }
        this.removeUnClickLayer();
    }
};

ThemeFooter.prototype.touchUpBet = function(sender, eventType) {
    if (eventType === ccui.TouchEventType.began) {
        if (this.ctl.getThemeId() !== 110038) {
            if (bole.scene.theme && bole.scene.theme.dealTouchAddBetBtn && bole.scene.theme.dealTouchAddBetBtn()) {
                this.ignoreTouchAddBetBtn = true;
                return;
            }
            this.btnSpin.setTouchEnabled(false);
            this.btnSubBet.setTouchEnabled(false);
            this.btnMaxBet.setTouchEnabled(false);
            this.ctl.touchAddBetBtnBegan();
            this.hideMaxBetTip();
        }
    } else if (eventType === ccui.TouchEventType.ended) {
        if (this.ignoreTouchAddBetBtn) {
            this.ignoreTouchAddBetBtn = null;
            return;
        }
        if (this.ctl.getThemeId() !== 110038) {
            this.btnSpin.setTouchEnabled(true);
            this.btnSubBet.setTouchEnabled(true);
            if (this.ctl.betControl.bet !== BetControl.getMaxBet()) {
                this.btnMaxBet.setTouchEnabled(true);
                this.btnMaxBet.setBright(true);
            }
            this.ctl.touchAddBetBtnEnded();
            bole.potp.send('behavior', {page: "manual_change_bet_up"});
        } else {
            this.ctl.changeToUpBet();
        }
        this.removeUnClickLayer();
    } else if (eventType === ccui.TouchEventType.canceled) {
        if (this.ctl.getThemeId() !== 110038) {
            this.btnSpin.setTouchEnabled(true);
            this.btnSubBet.setTouchEnabled(true);
            if (this.ctl.betControl.bet !== BetControl.getMaxBet()) {
                this.btnMaxBet.setTouchEnabled(true);
                this.btnMaxBet.setBright(true);
            }
            this.ctl.touchAddBetBtnCanceled();
        }
        this.removeUnClickLayer();
    }
};

ThemeFooter.prototype.touchMaxBet = function(sender, eventType) {
    bole.sinkChildrenOnTouch(sender, eventType, 3);
    if (eventType === ccui.TouchEventType.ended) {
        if (bole.scene.theme && bole.scene.theme.dealTouchMaxBetBtn && bole.scene.theme.dealTouchMaxBetBtn()) {
            return;
        }
        this.ctl.changeToMaxBet();
        if (this.ctl.getThemeId() !== 110038 && (User.getInstance().abType !== "A" || !User.getInstance().isNewUser)) {
            this.createMaxBetTip();
        }
        bole.potp.send('behavior', {page: "manual_change_bet_max"});
    }
};

ThemeFooter.prototype.createUnClickLayer = function(){
    var visibleOrigin = cc.director.getVisibleOrigin();
    var visibleSize = cc.director.getVisibleSize();
    if (!this.unClickLayer) {
        this.unClickLayer = new cc._LayerColor(cc.color(0, 0, 0, 0), visibleSize.width, visibleSize.height);
        this.addChild(this.unClickLayer, -1);
        bole.addSwallowTouchesEventListener(this.unClickLayer);
    }
};

ThemeFooter.prototype.removeUnClickLayer = function(){
    if (this.unClickLayer && !cc.sys.isNullOrUndefined(this.unClickLayer)) {
        this.unClickLayer.removeFromParent();
        this.unClickLayer = null;
    }
};

ThemeFooter.prototype._mimicSpin = function() {
    if (this.checkCanClickSpin() && !bole.notNull(this.ctl.loadingView)) {
        this.ctl.touchSpinBtnBegan();
        this.ctl.touchSpinBtnEnded();
        this.hideMaxBetTip();
    }
};

ThemeFooter.prototype.getTurboStatus = function() {
    //return false
    return this.turboFlag;
};

ThemeFooter.prototype.forceSetTurboStatus = function(flag) {
    this.turboFlag = flag;
    //this.turboClose.setVisible(!this.turboFlag);
    //this.turboOpen.setVisible(this.turboFlag);
};

ThemeFooter.prototype.setTurboVisible = function(flag) {
    this.canTurbo = flag;
    //if (flag) {
    //    this.turboClose.setVisible(!this.turboFlag);
    //    this.turboOpen.setVisible(this.turboFlag);
    //} else {
    //    this.turboClose.setVisible(true);
    //    this.turboOpen.setVisible(false);
    //}
};

ThemeFooter.prototype.setTurboStatus = function(flag) {
    this.turboFlag = flag;
};

ThemeFooter.prototype.clickSpinOnce = function() {
    if (this.checkCanClickSpin()) {
        this.ctl.touchSpinBtnBegan();
        if (SCREEN_ORIENTATION.HORIZONTAL == bole.getScreenOrientation()) {
            this.btnSpin.loadTextureNormal(BTNFILESPATH.NORMAL_SPIN[2], ccui.Widget.PLIST_TEXTURE);
        } else {
            this.btnSpin.loadTextureNormal(BTNFILESPATH.V_NORMAL_SPIN[2], ccui.Widget.PLIST_TEXTURE);
        }

        this.runAction(cc.sequence(
                cc.delayTime(0.3),
                cc.callFunc(function(){
                    this.ctl.touchSpinBtnEnded();

                    if (SCREEN_ORIENTATION.HORIZONTAL == bole.getScreenOrientation()) {
                        this.btnSpin.loadTextureNormal(BTNFILESPATH.NORMAL_SPIN[1], ccui.Widget.PLIST_TEXTURE);
                    } else {
                        this.btnSpin.loadTextureNormal(BTNFILESPATH.V_NORMAL_SPIN[1], ccui.Widget.PLIST_TEXTURE);
                    }
                }.bind(this))
        ));
    }
};

ThemeFooter.prototype.updateSpinCount = function(count) {
    if (count < -200) {
        count = -2;
    }
    this.autoCount = count;
    if (bole.notNull(this.spinCountLabel)) {
        this.spinCountLabel.setString(count);
    }
};

ThemeFooter.prototype.showAutoCountBoard = function(flag) {
    this.spinCountBoard.setVisible(flag);
};

ThemeFooter.prototype.checkAutoSpin = function(afterSpin) {
    if (this.ctl.getGameType() !== THEME_GAME_TYPE.MAIN) return;

    var lastCount = this.autoCount;

    if (!afterSpin) {
        this.autoCount = this.autoCount - 1;
        this.updateSpinCount(this.autoCount);
    }

    if (lastCount >= 0 && (this.autoCount <= 0 || lastCount - 1 <= 0)) {
        // this.showAutoCountBoard(false);
        // this.setTurboStatus(false);
        this.ctl.enableAuto(false);
        this.stopAuto();
        return;
    }

    if (User.getInstance().getCoins() < this.ctl.getCurTotalBet()) {
        this.ctl.enableAuto(false);
        this.stopAuto();
        return;
    }
};

ThemeFooter.prototype.stopAuto = function() {
    this.autoCount = 0;
    this.isAuto = false;
    this.updateSpinCount(this.autoCount);
    this.showAutoCountBoard(false);
    this.setTurboStatus(false);
    this.infinitySpin = false;
};

ThemeFooter.prototype.loadAutoBtn = function() {
    var fastPath = bole.translateImage("footer/spin_time_fast");
    this.autoNode.getChildByName("clipping").getChildByName("board").getChildByName("btn_fast").loadTextures(fastPath, fastPath, fastPath);
    var btnConfig = {
        '20': {count: 20, showAutoCountBoard: true},
        '50': {count: 50, showAutoCountBoard: true},
        '100': {count: 100, showAutoCountBoard: true},
        '500': {count: 500, showAutoCountBoard: true},
        'fast': {count: -2, showAutoCountBoard: false, isFast: true, isInfinity: true},
        'infinity': {count: -2, showAutoCountBoard: false, isInfinity: true}
    };
    for (var k in btnConfig) {
        if (btnConfig.hasOwnProperty(k)) {
            this.autoNode.getChildByName("clipping").getChildByName("board").getChildByName("btn_" + k).addTouchEventListener(function(s, t) {
                if (t === ccui.TouchEventType.began) {
                    bole.sendBehaviorLog(22, {location: v.count});
                    this.isAuto = true;
                    this.showAutoCountBoard(v.showAutoCountBoard === true);
                    this.updateSpinCount(v.count);
                    this.ctl.enableAuto(true);
                    if (v.isFast) {
                        this.setTurboStatus(true);
                    }
                    if (v.isInfinity) {
                        this.infinitySpin = true;
                        this.showStop(true);
                    }
                }
            }.bind(this));
        }
    }
};

ThemeFooter.prototype.showAutoBoard = function() {
    this.autoNode.setVisible(true);
    this.autoNode.getChildByName("clipping").getChildByName("board").stopAllActions();
    this.autoNode.getChildByName("clipping").getChildByName("board").setPositionY(-160);
    this.autoNode.getChildByName("clipping").getChildByName("board").runAction(
        cc.Sequence.create(
            //cc.EaseBackOut:create(cc.MoveTo:create(0.6, cc.p(98, 160))),
            cc.MoveTo.create(0.3, cc.p(98, 160)),
            cc.CallFunc.create(function() {
                this.autoNode.touchNode = cc.Node.create();
                this.autoNode.addChild(this.autoNode.touchNode);
                var onTouchBegan = function(touch, event) {
                    return true;
                };
                var onTouchEnded = function(touch, event) {
                    if (bole.isInTheme()) {
                        bole.scene.footer.hideAutoBoard();
                    }
                };
                this.autoNode.touchListener = cc.EventListenerTouchOneByOne.create();
                this.autoNode.touchListener.registerScriptHandler(onTouchBegan, cc.Handler.EVENT_TOUCH_BEGAN);
                this.autoNode.touchListener.registerScriptHandler(onTouchEnded, cc.Handler.EVENT_TOUCH_ENDED);
                this.autoNode.touchEventDispatcher = this.autoNode.touchNode.getEventDispatcher();
                this.autoNode.touchEventDispatcher.addEventListenerWithSceneGraphPriority(this.autoNode.touchListener, this.autoNode.touchNode);
            }.bind(this))
        )
    );
};

ThemeFooter.prototype.hideAutoBoard = function() {
    this.autoNode.setVisible(false);
    this.autoNode.getChildByName("clipping").getChildByName("board").stopAllActions();
    this.autoNode.getChildByName("clipping").getChildByName("board").setPositionY(-160);

    bole.removeSafely(this.autoNode.touchNode);
    this.autoNode.touchListener = null;
    this.autoNode.touchEventDispatcher = null;
};

ThemeFooter.prototype.setBetInfo = function(total) {
    EventCenter.pushEvent(EVENTNAMES.EVT_CHANGE_TOTAL_BET, total);

    if (total < 0) {
        total = 0;
    } else if (total < 1e11) {
        total = bole.num_2_str(total);
    } else {
        total = bole.comma_value_abbrev(total, 10);
    }
    this.labelTotalBet.setString(total);

    //this.labelTotalBet.setPositionX(this.labelTotalBet.getPositionX() + 3);

    if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
        bole.setLabelWidth(this.labelTotalBet, 180);
    } else {
        bole.setLabelWidth(this.labelTotalBet, 210);
        //this.labelTotalBet.setPositionY(this.labelTotalBet.getPositionY() - 3);
    }

    if (IN_HERO_WISH_GAME_THEME) {
        //this.infoBetLabel.setVisible(false);
    } else {
        //this.infoBetLabel.setString(this.ctl.getCurFakeBetBase() + ' x ' + bole.translateText(this.ctl.themeName.BetType));
        if (this.ctl.themeName.HideBetLabel) {
            shouldFlameSwitch = true;
            //this.infoBetLabel.setVisible(false);
        }
    }
};

ThemeFooter.prototype.startSpinCountDown = function(seconds) {
    this.spinCountDownLabel.setString(Math.floor(seconds));
    this.spinCountDownNode.startTime = cc.utils.getTime();
    this.spinCountDownNode.totalValue = seconds;

    var checkTime = function() {
        var currTime = cc.utils.getTime();
        var timeLeft = this.spinCountDownNode.totalValue - (currTime - this.spinCountDownNode.startTime);
        if (timeLeft <= 0) {
            timeLeft = 0;
            this.stopSpinCountDown();
        }
        this.spinCountDownLabel.setString(Math.ceil(timeLeft));
    }.bind(this);

    this.spinCountDownNode.runAction(cc.RepeatForever.create(cc.Sequence.create(
        cc.DelayTime.create(0.1),
        cc.CallFunc.create(checkTime)
    )));
    this.spinCountDownNode.setVisible(true);
};

ThemeFooter.prototype.stopSpinCountDown = function() {
    this.spinCountDownNode.stopAllActions();
    this.spinCountDownNode.setVisible(false);
    this.spinCountDownLabel.setString('');
};
ThemeFooter.prototype.setLabelDescription = function(textType, param1, param2) {
    // implementation code here
};

ThemeFooter.prototype.resetTotalWin = function() {
    if (this.labelWin && this.labelWin.nrStartRoll) {
        this.labelWin.nrStopRoll();
        this.labelWin.nrSetCurValue(0);
    }
};

ThemeFooter.prototype.flushTotalWin = function() {
    if (this.labelWin && this.labelWin.nrStopRoll) {
        this.labelWin.nrStopRoll(true);
    }
};

ThemeFooter.prototype.updateTotalWin = function(value, duration) {
    if (this.labelWin) {
        this.flushTotalWin();

        duration = duration || 0;

        var startValue = this.labelWin.nrGetCurValue();
        var endValue = startValue + value;
        if (duration > 0) {
            this.labelWin.nrStartRoll(startValue, endValue, duration);
        } else {
            this.labelWin.nrSetCurValue(endValue);
        }
    }
};

ThemeFooter.prototype.setTotalWinNum = function(value) {
    if (this.labelWin) {
        this.labelWin.nrStopRoll();
        this.labelWin.setString(bole.num_2_str(value));
    }
};

ThemeFooter.prototype.getTotalWinNum = function() {
    return this.labelWin && this.labelWin.getString();
};

ThemeFooter.prototype.getTotalWinNumValue = function() {
    return this.labelWin && this.labelWin.nrGetCurValue();
};

ThemeFooter.prototype.getTotalWinNumEndValue = function() {
    return this.labelWin && this.labelWin.nrGetEndValue();
};

ThemeFooter.prototype.showAverageBet = function(flag, value) {
    if (IN_HERO_WISH_GAME_THEME) {
        return;
    }

    if (flag) {
        if (value) {
            this.labelAverageBet.setVisible(true);
            if (this.averageLabelNew && !cc.sys.isObjectValid(this.averageLabelNew)) {
                this.averageLabelNew.setVisible(true);
            }
            this.averageLabel.setVisible(false);
            this.betLabel.setVisible(false);
            this.labelTotalBet.setVisible(false);
            if (this.root.getChildByName("node_total_bet_info").getChildByName("total_label")) {
                this.root.getChildByName("node_total_bet_info").getChildByName("total_label").setVisible(false);
            }

            if (value < 0) {
                value = 0;
            } else if (value < 1e11) {
                value = bole.num_2_str(value);
            } else {
                value = bole.comma_value_abbrev(value, 10);
            }
            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                bole.setLabelWidth(this.labelAverageBet, 180);
            } else {
                bole.setLabelWidth(this.labelAverageBet, 210);
            }
            this.labelAverageBet.setString(value);
        } else {
            this.labelAverageBet.setVisible(false);
            if (this.averageLabelNew && !cc.sys.isObjectValid(this.averageLabelNew)) {
                this.averageLabelNew.setVisible(false);
            }
            this.averageLabel.setVisible(true);
            this.betLabel.setVisible(true);
            this.labelTotalBet.setVisible(false);
            if (this.root.getChildByName("node_total_bet_info").getChildByName("total_label")) {
                this.root.getChildByName("node_total_bet_info").getChildByName("total_label").setVisible(false);
            }
            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                this.upperTotalBetNode.setPositionY(-10);
                CenterAlignment.setChildrenInOrder(this.upperTotalBetNode, this.averageLabel, this.betLabel);
                CenterAlignment.arrangeHorizontal(this.upperTotalBetNode, 0.0);
            } else {
                this.upperTotalBetNode.setPositionY(0);
                CenterAlignment.setChildrenInOrder(this.upperTotalBetNode, this.averageLabel, this.betLabel);
                CenterAlignment.arrangeHorizontal(this.upperTotalBetNode, 0.0);
            }
        }
    } else {
        this.averageLabel.setVisible(false);
        this.betLabel.setVisible(false);
        this.labelAverageBet.setVisible(false);
        if (this.averageLabelNew && !cc.sys.isObjectValid(this.averageLabelNew)) {
            this.averageLabelNew.setVisible(false);
        }
        this.labelTotalBet.setVisible(true);
        if (this.root.getChildByName("node_total_bet_info").getChildByName("total_label")) {
            this.root.getChildByName("node_total_bet_info").getChildByName("total_label").setVisible(true);
        }
    }
};
ThemeFooter.prototype.showBasePrizeBet = function(flag) {
    this.labelTotalBet.setVisible(!flag);
    this.basePrizeLabel.setVisible(flag);
    this.betLabel.setVisible(flag);
    
    if (bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
        this.upperTotalBetNode.setPositionY(-10);
        CenterAlignment.setChildrenInOrder(this.upperTotalBetNode, this.basePrizeLabel, this.betLabel);
        CenterAlignment.arrangeVertical(this.upperTotalBetNode, 0.0);
    } else {
        this.upperTotalBetNode.setPositionY(0);
        CenterAlignment.setChildrenInOrder(this.upperTotalBetNode, this.basePrizeLabel, this.betLabel);
        CenterAlignment.arrangeHorizontal(this.upperTotalBetNode, 0.0);
    }
    
    if (this.root.getChildByName("node_total_bet_info").getChildByName("total_label")) {
        this.root.getChildByName("node_total_bet_info").getChildByName("total_label").setVisible(!flag);
    }
}

ThemeFooter.prototype.showHeroGameBet = function() {
    this.setBetInfo(HERO_THEME_GAME_DATA.bet);
}

ThemeFooter.prototype.setMaxBetBtnEnable = function(enable, notCacheTag) {
    if (!notCacheTag) {
        this.maxBetTag = enable;
        if (!(this.ctl.subBetRollingStart || this.ctl.addBetRollingStart)) {
            this.btnAddBet.setTouchEnabled(true);
        }
        this.btnAddBet.setBright(true);
    } else {
        if (!(this.ctl.subBetRollingStart || this.ctl.addBetRollingStart)) {
            this.btnAddBet.setTouchEnabled(false);
        }
        this.btnAddBet.setBright(false);
    }
    if (!(this.ctl.subBetRollingStart || this.ctl.addBetRollingStart)) {
        this.btnMaxBet.setTouchEnabled(enable);
        this.btnMaxBet.setBright(enable);
    }
}

ThemeFooter.prototype.setMaxBetState = function(isMaxBet) {
    this.btnMaxBet.setMaxState(isMaxBet);
}

ThemeFooter.prototype.setMinBetBtnEnable = function(enable, notCacheTag) {
    if (!notCacheTag) {
        this.minBetTag = enable;
        if (!(this.ctl.subBetRollingStart || this.ctl.addBetRollingStart)) {
            this.btnSubBet.setTouchEnabled(true);
        }
        this.btnSubBet.setBright(true);
    } else {
        if (!(this.ctl.subBetRollingStart || this.ctl.addBetRollingStart)) {
            this.btnSubBet.setTouchEnabled(false);
        }
        this.btnSubBet.setBright(false);
    }
}

ThemeFooter.prototype.setPaytableBtnEnable = function(enable) {
    //this.btnPaytable.setTouchEnabled(enable);
    //this.btnPaytable.setBright(enable);
}

ThemeFooter.prototype.getOtherBtnsEnableState = function() {
    return this.otherBtnsEnableState;
}

ThemeFooter.prototype.enableOtherBtns = function(enable) {
    this.otherBtnsEnableState = enable;
    if (enable) {
        this.setMaxBetBtnEnable(this.maxBetTag);
        this.setMinBetBtnEnable(this.minBetTag);
    } else {
        this.setMaxBetBtnEnable(false, true);
        this.setMinBetBtnEnable(false, true);
    }
}

ThemeFooter.prototype.checkInFreeSpin = function() {
    return this.isFreeSpin;
}

ThemeFooter.prototype.checkCanClickSpin = function() {
    return !this.spinNode.isForbid;
}

ThemeFooter.prototype.setTouchEnabled = function(flag) {
    if (flag) {
        this.btnSpin.setTouchEnabled(true);
        this.btnSpin.setBright(true);
    } else {
        this.btnSpin.setTouchEnabled(false);
        this.btnSpin.setBright(false);
    }
}

// convert to cocos 2.4.5 javascript

ThemeFooter.prototype.enableAuto = function(enable) {
    if (enable) {
        this.spinNode.changeBtnState(SPIN_STATUS_NAME.AUTO_SPIN, "ignore", "ignore");
        this.btnSpin.textSprite.setPositionY(this.positionY);
    } else {
        this.spinNode.changeBtnState(SPIN_STATUS_NAME.NORMAL_SPIN, "ignore", "ignore");
    }
}
ThemeFooter.prototype.onSpinStart = function(autospin, fastspin) {
    this.disableStopAndOtherBtns(autospin, fastspin);
    if (!this.checkInFreeSpin()) {
        this.setLabelDescription('GoodLuck');
    }
}
ThemeFooter.prototype.setStopBtn = function() {
    this.spinNode.changeBtnState("ignore", true, false);
}
ThemeFooter.prototype.onStop = function() {
    //this.spinNode.changeBtnState("ignore", true, true);
    this.spinNode.changeBtnState("ignore", false, true);
}
ThemeFooter.prototype.setSpinBtn = function() {
    if (!this.ctl.autoSpinCheck || !this.canTurbo) {
        this.spinCountBoard.setVisible(false);
    }

    this.spinNode.changeBtnState(SPIN_STATUS_NAME.NORMAL_SPIN, false, false);
} 
ThemeFooter.prototype.setAutoSpinBtn = function() {
    this.spinCountBoard.setVisible(this.isAuto && !this.infinitySpin && this.ctl.autoSpinCheck);
    this.spinNode.changeBtnState(SPIN_STATUS_NAME.AUTO_SPIN, false, false);
}
ThemeFooter.prototype.delayEnableSpin = function(duration) {
    var action = cc.Sequence.create(
            cc.DelayTime.create(duration),
            cc.CallFunc.create(function() {
                this.enableSpin();
            }, this)
    );
    action.setTag(delayEnableSpinTag);
    this.stopActionByTag(delayEnableSpinTag);
    this.runAction(action);
}
ThemeFooter.prototype.getSpinEnableState = function() {
    return this.spinEnableState;
}
ThemeFooter.prototype.enableSpin = function() {
    if (this.ctl.touchSpinTag) return;
    this.spinNode.changeBtnState("ignore", false, false);
    if (this.ctl.subBetRollingStart || this.ctl.addBetRollingStart) {
        this.btnSpin.setTouchEnabled(false);
    }
}
ThemeFooter.prototype.enableSpinAndOtherBtns = function(get_bonus_reward_110038_temp, ngPerformOverNotSpin, cancelEnableOtherBtns) {
    if (this.ctl.theme.themeId == 110038) {
        if (get_bonus_reward_110038_temp && ngPerformOverNotSpin) {
            this.enableSpin();
        }
    } else {
        this.enableSpin();
    }
    if (!this.ctl.isSpinning()) {
        if (this.ctl.theme.themeId == 110038) {
            if (get_bonus_reward_110038_temp && ngPerformOverNotSpin) {
                if (this.ctl.theme.gameLayer.judgeCanEnableOthers) {
                    this.ctl.theme.gameLayer.judgeCanEnableOthers();
                }
            }
        } else {
            if (cancelEnableOtherBtns) {
                this.enableOtherBtns(false);
            } else {
                this.enableOtherBtns(true);
            }
        }
    }
}
ThemeFooter.prototype.disableSpin = function() {
    this.stopActionByTag(delayEnableSpinTag);
    this.spinNode.changeBtnState("ignore", false, true);
}
ThemeFooter.prototype.disableSpinAndOtherBtns = function() {
    this.disableSpin();
    this.enableOtherBtns(false);
}
ThemeFooter.prototype.disableStopAndOtherBtns = function(autospin, fastspin) {
    this.showStop(autospin, fastspin);
    this.enableOtherBtns(false);
}
ThemeFooter.prototype.showStop = function(autospin, fastspin) {
    if (fastspin || autospin) {
        this.spinNode.changeBtnState("ignore", false, true);
    } else {
        this.disableStop();
    }
}
ThemeFooter.prototype.enableStop = function() {
    this.spinNode.changeBtnState("ignore", true, false);
}
ThemeFooter.prototype.disableStop = function() {
    this.spinNode.changeBtnState("ignore", true, true);
}
ThemeFooter.prototype.addMaxBetFlash = function() {
    if (!this.maxBetFlash) {
        var file = "footer/animation/Slot_Bet_max";
        this.maxBetFlash = sp._SkeletonAnimation(bole.getAnimation(file, true));
        this.maxBetFlash.setVisible(true);
        this.maxBetFlash._setLocalZOrder(100);
        this.root.getChildByName('node_total_bet_info').addChild(this.maxBetFlash);
    }

    this.maxBetFlash.clearTracks();
    this.maxBetFlash.setPosition(
        this.root.getChildByName('node_total_bet_info').getChildByName("total_label").getPositionX(),
        this.totalBetNode.getChildByName("bg_total_bet_1").getPositionY()
    );

    if (SCREEN_ORIENTATION.HORIZONTAL == bole.getScreenOrientation()) {
        this.maxBetFlash.setAnimation(0, "bet_max_heng", false);
    } else if (SCREEN_ORIENTATION.VERTICAL == bole.getScreenOrientation()) {
        this.maxBetFlash.setAnimation(0, "bet_max_shu", false);
    }
}
ThemeFooter.prototype.canToAutoSpin = function() {
    return this.spinNode.curStatue == SPIN_STATUS_NAME.NORMAL_SPIN && !this.isFreeSpinLayer;
}
ThemeFooter.prototype.changeLanguage = function() {
    var fastPath = bole.translateImage("footer/spin_time_fast");
    this.autoNode.getChildByName("clipping").getChildByName("board").getChildByName("btn_fast").loadTextures(fastPath, fastPath, fastPath);

    if (bole.notNull(this.btnMaxBet)) {
        this.btnMaxBet.loadTextures(bole.translateImage("footer/btn_max"), bole.translateImage("footer/btn_max_clicked"), bole.translateImage("footer/btn_max_disabled"));
    }

    if (bole.notNull(this.qidong)) {
        this.qidong.setTexture(bole.translateImage("footer/btn_max_disabled"));
    }

    var winNode = this.node.getChildByName("root").getChildByName("node_win");
    winNode.getChildByName('totalwin_sprite').setTexture(bole.translateImage('footer/label_win_total'));

    if (this.root.getChildByName("node_total_bet_info").getChildByName("total_label")) {
        this.root.getChildByName("node_total_bet_info").getChildByName("total_label").setTexture(bole.translateImage("footer/label_bet_total"));
    }
    if (this.averageLabelNew && !tolua.isnull(this.averageLabelNew)) {
        this.averageLabelNew.setTexture(bole.translateImage("footer/label_bet_average"));
    }

    this.spinNode.refreshState();

    var paytableView = this.ctl.curScene.nodeList["footer_header"].getChildByName('paytableView');
    if (paytableView != null) {
        paytableView.setCurPage();
        var backLabel = paytableView.backBtn.getChildByName('backLabel');
        backLabel.setTexture(bole.translateImage("footer/backtogame"));
    }

    if (this.averageLabel) {
        this.averageLabel.setString(bole.translateText("sugar_average"));
    }

    if (this.basePrizeLabel) {
        this.basePrizeLabel.setString(bole.translateText("base_prize_label"));
    }

    if (this.betLabel) {
        this.betLabel.setString(bole.translateText("sugar_bet"));
    }
    CenterAlignment.arrangeHorizontal(this.upperTotalBetNode, 0.0);

    this.freshJwLootBetTip();
}
ThemeFooter.prototype.checkFlameBetTip = function() {
    if (this.flameBetTip && this.flameBetTip.betNum && this.flameBetTip.betNum > 0) {
        if (bole.isInTheme()) {
            var curBet = bole.scene.ctl.getCurTotalBet();
            if (curBet < this.flameBetTip.betNum) {
                this.flameBetNum.setString(bole.comma_value_abbrev(this.flameBetTip.betNum, 3));
                this.flameBetTipNode.stopAllActions();
                this.flameBetTipNode.runAction(cc.Sequence.create(
                        cc.ScaleTo.create(0.33, 1),
                        cc.DelayTime.create(2),
                        cc.ScaleTo.create(0.33, 0)
                ));
            } else {
                this.flameBetNum.setString(bole.comma_value_abbrev(this.flameBetTip.betNum, 3));
                this.flameBetTipNode.stopAllActions();
                this.flameBetTipNode.setScale(0);
            }
        }
    }
}
ThemeFooter.prototype.checkIconStatus = function() {
    this.root.stopAllActions();
    if (shouldFlameSwitch) {
        if (bole.notNull(this.dailyMissionNode) && bole.notNull(this.flameNode)) {
            this.root.runAction(cc.RepeatForever.create(
                    cc.Sequence.create(
                            cc.DelayTime.create(8),
                            cc.CallFunc.create(function() {
                                this.dailyMissionNode.setVisible(true);
                                this.dailyMissionNode.runAction(cc.ScaleTo.create(0.2, 0, dailyMissionScale));
                                this.flameNode.setVisible(true);
                                this.flameNode.runAction(cc.ScaleTo.create(0.2, 1));
                            }.bind(this)),
                            cc.DelayTime.create(0.2),
                            cc.CallFunc.create(function() {
                                this.dailyMissionNode.setVisible(false);
                            }.bind(this)),
                            cc.DelayTime.create(8),
                            cc.CallFunc.create(function() {
                                this.dailyMissionNode.setVisible(true);
                                this.dailyMissionNode.runAction(cc.ScaleTo.create(0.2, dailyMissionScale, 1));
                                this.flameNode.setVisible(true);
                                this.flameNode.runAction(cc.ScaleTo.create(0.2, 0, 1));
                            }.bind(this)),
                            cc.DelayTime.create(0.2),
                            cc.CallFunc.create(function() {
                                this.flameNode.setVisible(false);
                            }.bind(this))
                    )
            ));
        }
    } else {
        if (bole.notNull(this.dailyMissionNode)) {
            this.dmNodeCurStatus = true;
        }
    }

    if (this.forceShowDailyMission && this.forceShowFlame) {
        this.root.stopAllActions();
        if (!(this.dailyMissionNode.isVisible() && this.dailyMissionNode.getScaleX() == dailyMissionScale)) {
            this.root.runAction(cc.Sequence.create(
                    cc.CallFunc.create(function() {
                        this.dailyMissionNode.setVisible(true);
                        this.dailyMissionNode.runAction(cc.ScaleTo.create(0.2, dailyMissionScale));
                        this.flameNode.setVisible(true);
                        this.flameNode.runAction(cc.ScaleTo.create(0.2, 0, 1));
                    }.bind(this)),
                    cc.DelayTime.create(0.2),
                    cc.CallFunc.create(function() {
                        this.flameNode.setVisible(false);
                    }.bind(this))
            ));
        }
        this.root.runAction(cc.RepeatForever.create(
                cc.Sequence.create(
                        cc.DelayTime.create(8),
                        cc.CallFunc.create(function() {
                            this.dailyMissionNode.setVisible(true);
                            this.dailyMissionNode.runAction(cc.ScaleTo.create(0.2, 0, dailyMissionScale));
                            this.flameNode.setVisible(true);
                            this.flameNode.runAction(cc.ScaleTo.create(0.2, 1));
                        }.bind(this)),
                        cc.DelayTime.create(0.2),
                        cc.CallFunc.create(function() {
                            this.dailyMissionNode.setVisible(false);
                        }.bind(this)),
                        cc.DelayTime.create(8),
                        cc.CallFunc.create(function() {
                            this.dailyMissionNode.setVisible(true);
                            this.dailyMissionNode.runAction(cc.ScaleTo.create(0.2, dailyMissionScale));
                            this.flameNode.setVisible(true);
                            this.flameNode.runAction(cc.ScaleTo.create(0.2, 0, 1));
                        }.bind(this)),
                        cc.DelayTime.create(0.2),
                        cc.CallFunc.create(function() {
                            this.flameNode.setVisible(false);
                        }.bind(this))
                )
        ));
    } else if (this.forceShowDailyMission) {
        this.root.stopAllActions();
        if (!(this.dailyMissionNode.isVisible() && this.dailyMissionNode.getScaleX() == dailyMissionScale)) {
            this.root.runAction(cc.Sequence.create(
                    cc.CallFunc.create(function() {
                        this.dailyMissionNode.setVisible(true);
                        this.dailyMissionNode.runAction(cc.ScaleTo.create(0.2, dailyMissionScale));
                        this.flameNode.setVisible(true);
                        this.flameNode.runAction(cc.ScaleTo.create(0.2, 0, 1));
                    }.bind(this)),
                    cc.DelayTime.create(0.2),
                    cc.CallFunc.create(function() {
                        this.flameNode.setVisible(false);
                    }.bind(this))
            ));
        }
    } else if (this.forceShowFlame) {
        this.root.stopAllActions();
        if (!(this.flameNode.isVisible() && this.flameNode.getScaleX() == 1)) {
            this.root.runAction(cc.Sequence.create(
                    cc.CallFunc.create(function() {
                        this.dailyMissionNode.runAction(cc.ScaleTo.create(0.2, 0, dailyMissionScale));
                        this.flameNode.setVisible(true);
                        this.flameNode.runAction(cc.ScaleTo.create(0.2, 1));
                    }.bind(this)),
                    cc.DelayTime.create(0.2),
                    cc.CallFunc.create(function() {
                        this.dailyMissionNode.setVisible(false);
                    }.bind(this))
            ));
        }
    }
}

ThemeFooter.prototype.refreshAfterSpin = function() {
    if (User.getInstance().level >= 8 && User.getInstance().level <= 20) {
        //将maxBet恢复正常。大于8级是给的一个要求等级，小于20级是一个大致判断，以便后面不做其他逻辑处理了
        this.btnMaxBet.checkAnable(true, function() {
            const nodeBet = this.root.getChildByName('node_total_bet_info');
            if (nodeBet) {
                const tipsNode = FONTS.addImage(bole.translateImage("new_user/tips_bet_max"));
                function getTipsPos() {
                    const offY = this.totalBetNode && this.totalBetNode.getChildByName("bg_total_bet_1").getContentSize().height * 0.5 || 44;
                    return cc.pAdd(cc.p(nodeBet.getPosition()), cc.p(0, offY));
                }

                if (tipsNode) {
                    this.root.addChild(tipsNode);
                    tipsNode.setAnchorPoint(0.5, 0);
                    tipsNode.setPosition(getTipsPos());
                    tipsNode.setOpacity(0);
                    tipsNode.runAction(
                        cc.sequence(
                            cc.fadeIn(0.5),
                            cc.delayTime(2.0),
                            cc.fadeOut(0.5),
                            cc.removeSelf()
                        )
                    );
                }
            }
        });
    }
};

ThemeFooter.prototype.refreshFlameData = function() {
    shouldFlameSwitch = false;
    this.forceShowFlame = false;
    if (FLAME_INFO && FLAME_INFO.flame_mission) {
        const fmData = FLAME_INFO.flame_mission;

        let themeFlameData, systemFlameData;
        for (let i in fmData) {
            const v = fmData[i];
            if (bole.isInTheme()) {
                if (v.theme.toString() === this.ctl.themeName.themeId.toString()) {
                    themeFlameData = v;
                }
                if (v.theme.toString() === "system") {
                    systemFlameData = v;
                }
            }
        }
        this.flameBetTip.betNum = 0;
        if (themeFlameData) {
            if (themeFlameData.key && themeFlameData.key[2] && themeFlameData.key[2] !== 's' && themeFlameData.key[2] !== ' ' && bole.str_2_num(themeFlameData.key[2])) {
                this.flameBetTip.betNum = Math.floor(bole.str_2_num(themeFlameData.key[2]));
            }
        }

        if (themeFlameData) {
            this.dailyMissionNodeSwitch = true;
            shouldFlameSwitch = true;
            this.refreshFlame(themeFlameData, systemFlameData);
        } else {
            shouldFlameSwitch = false;
            this.refreshFlame(null, systemFlameData);
        }
    } else {
        this.forceShowDailyMission = true;
        this.checkIconStatus();
    }
};

ThemeFooter.prototype.refreshDailyMission = function() {
    this.refreshFlameData();
    if (User.getInstance().level < DAILY_MISSION_MIN_USER_LEVEL) {
        if (this.dailyMissionNode) {
            this.dailyMissionNode.update(0, 1, true, false, '');
            return;
        }
    }

    if (this.dailyMissionNode) {
        const dailyMissionData = DailyMissionControl.getInstance().dailyMissionData;
        if (!bole.notNull(dailyMissionData)) return;
        const com_mission_info = dailyMissionData.com_mission_info;
        if (!bole.notNull(com_mission_info)) return;

        let processIndex;
        let statusType;
        const status = {
            PROCESSING: 0,
            TO_COLLECT: 1,
            COLLECTED: 2,
            ALL_FINISHED: 3
        };
        for (let i in dailyMissionData.mission_status) {
            const v = dailyMissionData.mission_status[i];
            if (v === status.TO_COLLECT) {
                processIndex = i;
                statusType = v;
                break;
            } else if (v === status.PROCESSING) {
                processIndex = i;
                statusType = v;
                break;
            }
        }

        //if curMissionIndex and dmCtl.missionList[curMissionIndex] and dmCtl.missionList[curMissionIndex].status == 1 then
        //    if cc.UserDefault.getInstance():getIntegerForKey('NEW_GUIDE_DM_FINISH', 0) == 0 then
        //        self:showDMFinishTip()
        //    elseif MISSION_FINISH_LIST and MISSION_FINISH_LIST[curMissionIndex] == 1 then
        //        MISSION_FINISH_LIST[curMissionIndex] = 2
        //        self:showDMFinishTip()
        //    end
        //end
        let hadCheckNormal = false;
        if (processIndex) {
            this.dailyMissionNode.setVisible(true);

            if (com_mission_info.status && com_mission_info.status === 1) {
                const lastForceShowDailyMission = this.forceShowDailyMission;
                this.forceShowDailyMission = true;
                if (this.forceShowDailyMission !== lastForceShowDailyMission) {
                    this.checkIconStatus();
                }
                this.dailyMissionNode.update(1, processIndex, false, true, bole.translateText('daily_mission_claim'));

                return;
            } else if (com_mission_info.finish && com_mission_info.base) {
                let content;
                const percentage = com_mission_info.finish / com_mission_info.base;
                if (com_mission_info && com_mission_info.finish_1 && com_mission_info.base_1) {
                    if (com_mission_info.status && com_mission_info.status === 1) {
                        content = bole.translateText('daily_mission_claim');
                    } else {
                        content = com_mission_info.base_1 - com_mission_info.finish_1;
                    }
                } else {
                    content = (percentage === 1) ? bole.translateText('daily_mission_claim') : bole.translateText('daily_mission_spin');
                }
                const lastForceShowDailyMission = this.forceShowDailyMission;
                if (percentage === 1) {
                    this.forceShowDailyMission = true;
                } else {
                    this.forceShowDailyMission = false;
                }
                if (this.forceShowDailyMission !== lastForceShowDailyMission) {
                    this.checkIconStatus();
                }
                this.dailyMissionNode.update(percentage, processIndex, false, true, content);
                hadCheckNormal = true;
            }
        }

        const mission_plus_info = dailyMissionData.mission_plus_info;
        if (!bole.notNull(mission_plus_info)) return;
        if (mission_plus_info.status === 1) {
            const lastForceShowDailyMission = this.forceShowDailyMission;
            this.forceShowDailyMission = true;
            if (this.forceShowDailyMission !== lastForceShowDailyMission) {
                this.checkIconStatus();
            }
            this.dailyMissionNode.update(1, 7, false, true, bole.translateText('daily_mission_claim'));

            return;
        }

        if (mission_plus_info.finish && mission_plus_info.base && !hadCheckNormal) {
            const percentage = mission_plus_info.finish / mission_plus_info.base;
            this.dailyMissionNode.update(percentage, 7, false, true, bole.translateText('daily_mission_spin'));
        }
    }
};

ThemeFooter.prototype.performDMCollect = function(pkg) {
var callback = pkg.callback;
if (this.dailyMissionNode !== null) {
    this.dailyMissionNode.performDMCollect();
    cc.audioEngine.playEffect('inner_download/daily_mission/audio/close.mp3');
    var sprite = new cc.Sprite();
    this.root.addChild(sprite);
    sprite.setPosition(this.root.getChildByName('node_daily_mission').getPosition());
    var visibleSize = cc.director.getVisibleSize();
    var endPosW = cc.p(visibleSize.width / 2, visibleSize.height / 2);
    var endPos = this.root.convertToNodeSpace(endPosW);
    sprite.runAction(cc.sequence(
        cc.delayTime(1.17),
        cc.callFunc(function () {
            var star = new cc.ParticleSystemQuad(PIC_PATH + "animation/Daily_fly.plist");
            sprite.addChild(star);
            star.setPosition(0, 0);
        }),
        cc.callFunc(function () {
            if (callback != null) {
                callback();
            }
            cc.audioEngine.playEffect('inner_download/daily_mission/audio/fly.mp3');
        }),
        cc.moveTo(0.5, endPos),
        cc.delayTime(0.1),
        cc.removeSelf()
    ));
} else {
    if (callback != null) {
        callback();
    }
}
};

ThemeFooter.showNextTips = function(pkg) {
    var callback = pkg.callback;
    if (callback != null) {
        callback();
    }
    var data = pkg.data;
    if (bole.notNull(this.dailyMissionNode)) {
        var dailyMissionData = data;
        if (!bole.notNull(dailyMissionData)) return;
        var com_mission_info = dailyMissionData.com_mission_info;
        var resPath = 'footer/footer/dm/';
        var isVertical = SCREEN_ORIENTATION.VERTICAL == bole.getScreenOrientation();
        var suffix = isVertical ? '_v' : '';
        if (com_mission_info && com_mission_info.lang_key) {
            var bg = FONTS.addTexture(resPath + 'tip_bg' + suffix + '.png');
            bg.setAnchorPoint(0.1, 0);
            bg.setPosition(cc.pAdd(cc.p(this.dailyMissionNode.getPosition()), cc.p((230 - 153 + 20) * SCREEN_RATIO, (150 - 128 / 2) * SCREEN_RATIO)));
            if (isVertical) {
                bg.setAnchorPoint(0.9, 0);
                bg.setPosition(cc.pAdd(cc.p(this.dailyMissionNode.getPosition()), cc.p((510 + 153), (150 - 64 + 32))));
            }
            var posW = this.convertToWorldSpace(bg.getPosition());
            bole.scene.addToFooterHeader(bg, 1);
            bg.setPosition(posW);

            var node = cc.Node.create();
            var title = FONTS.addNoEffectText('', bole.translateText('dm_title_' + com_mission_info.index), 26, bole.hexToColor('#730006'));
            node.addChild(title);

            var params = [];
            for (var _ in com_mission_info.key_params) {
                var v = com_mission_info.key_params[_];
                params.push(v);
            }
            if (params[1] !== '1') {
                params.push('s');
            } else {
                params.push(' ');
            }
            var content = bole.translateText(com_mission_info.lang_key, params);
            var text = FONTS.addNoEffectText('', content, 20, bole.hexToColor('#730006'));
            node.addChild(text);

            var bgScale = 1.4 * text.getContentSize().width / bg.getContentSize().width;

            CenterAlignment.setChildrenInOrder(node, title, text);
            CenterAlignment.arrangeVertical(node, 10);

            bg.addChild(node);
            var bottomThick = 30;
            var contentHeight = 97;
            node.setPosition(bg.getContentSize().width / 2, bottomThick + contentHeight / 2);


            var duration = 0.3;
            duration *= 1.6;

            bg.setScale(0.25 * bgScale, 0.25);
            bg.setCascadeOpacityEnabled(true);
            bg.setOpacity(0);
            bg.setVisible(true);

            bg.runAction(cc.Sequence.create(cc.EaseBackOut.create(cc.ScaleTo.create(duration, bgScale, 1))));
            bg.runAction(cc.Sequence.create(cc.FadeIn.create(Math.min(0.2, duration / 2))));

            node.setScaleX(bg.getContentSize().width / (1.4 * text.getContentSize().width));

            var action = function() {
                if (!bole.notNull(bg)) return;

                if (isVertical) {
                    bg.runAction(cc.Sequence.create(
                        cc.Spawn.create(
                            cc.RotateBy.create(0.25, 90),
                            cc.MoveBy.create(0.25, cc.p(0, -100)),
                            cc.ScaleTo.create(0.25, 0),
                            cc.FadeOut.create(0.25)
                        ),
                        cc.RemoveSelf.create()
                    ));
                } else {
                    bg.runAction(cc.Sequence.create(
                        cc.Spawn.create(
                            cc.RotateBy.create(0.25, -90),
                            cc.MoveBy.create(0.25, cc.p(0, -100)),
                            cc.ScaleTo.create(0.25, 0),
                            cc.FadeOut.create(0.25)
                        ),
                        cc.RemoveSelf.create()
                    ));
                }
            }

            var path1 = resPath + 'tip_bg' + suffix + '.png';
            var path2 = resPath + 'tip_bg' + suffix + '.png';
            var btn = ccui.Button.create(path1, path2, path2, 1);
            var event = function(sender, eventType) {
                if (eventType === ccui.TouchEventType.ended) {
                    btn.setTouchEnabled(false);
                    action();
                }
            }
            btn.addTouchEventListener(event);
            bg.addChild(btn);
            btn.setOpacity(0);
            btn.setPosition(bg.getContentSize().width / 2, bg.getContentSize().height / 2);

            bg.runAction(cc.Sequence.create(
                cc.DelayTime.create(5),
                cc.CallFunc.create(function() {
                    btn.setTouchEnabled(false);
                    action();
                })
            ));

            return;
        }

        var mission_plus_info = dailyMissionData.mission_plus_info;
        if (!bole.notNull(mission_plus_info)) return;

    if(mission_plus_info.lang_key){
        let bg = FONTS.addTexture(resPath+'tip_bg'+suffix+'.png');
        bg.setAnchorPoint(0.1, 0);
        bg.setPosition(cc.pAdd(cc.p(this.dailyMissionNode.getPosition()), cc.p((230 - 153 + 20) * SCREEN_RATIO, (150 - 128 / 2) * SCREEN_RATIO)));
    
        if(isVertical){
            bg.setAnchorPoint(0.9, 0);
            bg.setPosition(cc.pAdd(cc.p(this.dailyMissionNode.getPosition()), cc.p((510 + 153), (150 - 64 + 32))));
        }
    
        let posW = this.convertToWorldSpace(bg.getPosition());
        bole.scene.addToFooterHeader(bg, 1);
        bg.setPosition(posW);
    
        let node = new cc.Node();
        let title = FONTS.addNoEffectText('',bole.translateText('dm_title_6'),26,bole.hexToColor('#730006'));
        node.addChild(title);
    
        let params = [];
        for(let v of mission_plus_info.key_params){
            params.push(v);
        }
        if(params[0] !== '1'){
            params.push('s');
        } else {
            params.push(' ');
        }
    
        let content = bole.translateText(mission_plus_info.lang_key, params);
        let text = FONTS.addNoEffectText('',content,20,bole.hexToColor('#730006'));
        node.addChild(text);
    
        let bgScale = 1.4 * text.getContentSize().width / bg.getContentSize().width;
    
        CenterAlignment.setChildrenInOrder(node, title, text);
        CenterAlignment.arrangeVertical(node, 10);
    
        bg.addChild(node);
        let bottomThick = 30;
        let contentHeight = 97;
        node.setPosition(bg.getContentSize().width / 2, bottomThick + contentHeight / 2);
    
        let duration = 0.3;
        duration *= 1.6;
    
        bg.setScale(0.25 * bgScale, 0.25);
        bg.setCascadeOpacityEnabled(true);
        bg.setOpacity(0);
        bg.setVisible(true);
    
        bg.runAction(cc.sequence(cc.EaseBackOut.create(cc.ScaleTo.create(duration, bgScale, 1))),
            cc.FadeIn.create(Math.min(0.2, duration/2))
        );
    
        node.setScaleX(bg.getContentSize().width / (1.4 * text.getContentSize().width));
    
        let action = function(){
            if(!bole.notNull(bg)){
                return;
            }
    
            if(isVertical){
                bg.runAction(cc.sequence(
                    cc.Spawn.create(
                        cc.RotateBy.create(0.25, 90),
                        cc.MoveBy.create(0.25, cc.p(0, -100)),
                        cc.ScaleTo.create(0.25, 0),
                        cc.FadeOut.create(0.25)
                    ),
                    cc.RemoveSelf.create()
                ));
            } else {
                bg.runAction(cc.sequence(
                    cc.Spawn.create(
                        cc.RotateBy.create(0.25, -90),
                        cc.MoveBy.create(0.25, cc.p(0, -100)),
                        cc.ScaleTo.create(0.25, 0),
                        cc.FadeOut.create(0.25)
                    ),
                    cc.RemoveSelf.create()
                ));
            }
        }
    
        let path1 = resPath+'tip_bg'+suffix+'.png';
        let path2 = resPath+'tip_bg'+suffix+'.png';
        let btn = new cc._Button(path1, path2, path2, 1);
        let event = function(sender, eventType){
            if(eventType === ccui.Widget.TOUCH_ENDED){
                btn.setTouchEnabled(false);
                action();
            }
        };
        btn.addTouchEventListener(event);
        bg.addChild(btn);
        btn.setOpacity(0);
        btn.setPosition(bg.getContentSize().width / 2, bg.getContentSize().height / 2);
    
        bg.runAction(cc.sequence(
            cc.DelayTime.create(5),
            cc.CallFunc.create(function(){
                btn.setTouchEnabled(false);
                action();
            })
        ));
    }
        
    }
};

ThemeFooter.prototype.onDMAllDone = function() {
    var time = parse_second(bole.getCountDown('daily_mission_day_countdown'), false);
    var content;
    if (time.hour <= 0) {
        content = string.format('%02d', time.minute) + ':' + string.format('%02d', time.second);
    } else {
        content = string.format('%02d', time.hour) + ':' + string.format('%02d', time.minute);
    }
    this.dailyMissionNode.update(1, 6, false, false, content);
};

ThemeFooter.prototype.refreshFlame = function(theData, systemFlameData) {
    if (this.flameNode) {
        if (User.getInstance().level < DAILY_MISSION_MIN_USER_LEVEL) {
            this.flameNode.update(0, null, true, false, '');
            return;
        }
        var progress = theData && theData.finish / theData.target || 0;
        if (systemFlameData && systemFlameData.finish >= systemFlameData.target) {
            progress = 1;
        }
        var lastForceShowFlame = this.forceShowFlame;
        if (progress == 1) {
            this.forceShowFlame = true;
        } else {
            this.forceShowFlame = false;
        }
        if (this.forceShowFlame !== lastForceShowFlame) {
            if (!this.forceShowFlame && !theData) {
                this.forceShowDailyMission = true;
            }
            this.checkIconStatus();
        }
        if (!this.forceShowFlame && !theData) {
            this.forceShowDailyMission = true;
            this.checkIconStatus();
        }
        this.flameNode.update(progress, null, false, true, bole.translateText('daily_mission_spin'));
    }
};

ThemeFooter.prototype.hideClubPointBetTip = function() {
    if (this.cpBetTipNode) {
        this.cpBetTipNode.removeFromParent();
        this.cpBetTipNode = null;
    }
};

ThemeFooter.prototype.showClubPointBetTip = function (mode) {
    this.hideClubPointBetTip();

    this.cpBetTipNode = new cc.Node();
    this.cpBetTipNode.setCascadeOpacityEnabled(true);
    this.cpBetTipNode.setOpacity(0);

    let board;
    if (SCREEN_ORIENTATION.VERTICAL == bole.getScreenOrientation()) {
        board = cc.Sprite.create('club/club_bet_tip_bg_v.png');
    } else {
        board = cc.Sprite.create('club/club_bet_tip_bg_h.png');
    }
    board.setAnchorPoint(cc.p(0.5, 0));
    this.cpBetTipNode.addChild(board);

    const addImage = () => {
        return new cc.Sprite(cc.textureCache.addImage(bole.translateImage.apply(null, arguments)));
    };

    let label1, label2, label2_1, label3, coins;

    if (0 == mode) {
        if (bole.LocalLang == 'CN' || bole.LocalLang == 'TW') {
            label1 = addImage('club/sentence1');
            label2 = addImage('club/sentence2');
            label3 = addImage('club/sentence3');
            coins = FONTS.addFNT('club/club_coins.fnt', bole.comma_value_abbrev(BetControl.getMinClubPointTotalBet(), 9));
            coins.setPositionY(-1.5);
            const sentence2 = new cc.Node();
            sentence2.setCascadeOpacityEnabled(true);
            sentence2.addChild(label2);
            sentence2.addChild(coins);
            CenterAlignment.setChildrenInOrder(sentence2, label2, coins);
            CenterAlignment.arrangeHorizontal(sentence2, 3);
            label1.setPosition(cc.p(0, 107));
            sentence2.setPosition(cc.p(0, 83));
            label3.setPosition(cc.p(0, 54));
            this.cpBetTipNode.addChild(label1);
            this.cpBetTipNode.addChild(sentence2);
            this.cpBetTipNode.addChild(label3);
        } else {
            label1 = addImage('club/sentence1');
            label2 = addImage('club/sentence2');
            label2_1 = addImage('club/sentence2_1');
            label3 = addImage('club/sentence3');
            coins = FONTS.addFNT('club/club_coins.fnt', bole.comma_value_abbrev(BetControl.getMinClubPointTotalBet(), 6));
            coins.setPositionY(-0.5);
            const sentence2 = new cc.Node();
            sentence2.setCascadeOpacityEnabled(true);
            sentence2.addChild(label2);
            sentence2.addChild(label2_1);
            sentence2.addChild(coins);
            CenterAlignment.setChildrenInOrder(sentence2, label2, coins, label2_1);
            CenterAlignment.arrangeHorizontal(sentence2, 3);
            label1.setPosition(cc.p(0, 107));
            sentence2.setPosition(cc.p(0, 83));
            label3.setPosition(cc.p(0, 54));
            this.cpBetTipNode.addChild(label1);
            this.cpBetTipNode.addChild(sentence2);
            this.cpBetTipNode.addChild(label3);
        }
    } else if (1 == mode) {
        label1 = addImage('club/get_points');
        label1.setPosition(cc.p(0, 106));
        this.cpBetTipNode.addChild(label1);
    }

    const icon = addImage('club/club_tip_title_1');
    icon.setAnchorPoint(0.5, 0);
    this.cpBetTipNode.addChild(icon);

    this.betTipNode.addChild(this.cpBetTipNode);
    this.betTipNode.setScale(SCREEN_RATIO);
    this.cpBetTipNode.runAction(cc.Sequence.create(
        cc.FadeIn.create(0.15),
        cc.DelayTime.create(3),
        cc.FadeOut.create(0.15),
        cc.CallFunc.create(() => {
            this.hideClubPointBetTip();
        })
    ));
};

ThemeFooter.prototype.freshJwLootBetTip = function (percent) {
    if (this.jwBetTipNode != null) {
        let percent_text = this.jwBetTipNode.getChildByName("jw_percent_text");
        if (percent_text != null) {
            percent_text.setTexture(bole.translateImage('footer/jw_loot/jw_loot_progress_text_v' + JwLootVerSion));
        }

        let jw_logo = this.jwBetTipNode.getChildByName("jw_logo");
        if (jw_logo != null) {
            jw_logo.setTexture(bole.translateImage('footer/jw_loot/jw_loot_progress_logo_v' + JwLootVerSion));
        }

        if (this.jw_loot_progress_logo != null) {
            this.jw_loot_progress_logo.removeFromParent();
            let config = bole.returnRequire("footer/footer/jw_loot/animation/v" + JwLootVerSion);
            let skeletonsFolder = "res/" + cc.path.basename(config.res_name, ".json") + "_ske";
            let binaryFile = skeletonsFolder + ".skel.bytes"
            let atlas = skeletonsFolder + ".atlas"
            if (cc.sys.isNative &&
                cc.loader["_checkIsImageFile"](binaryFile) &&
                cc.loader["_checkIsImageFile"](atlas)) {

                this.jw_loot_progress_logo = new sp._SkeletonAnimation(binaryFile, atlas);
                this.jwBetTipNode.addChild(this.jw_loot_progress_logo);
                this.jw_loot_progress_logo.setCompleteListener(function(trackEntry) {
                    this.jw_loot_progress_logo.setAnimation(0, config.animation, true);
                }.bind(this))
                this.jw_loot_progress_logo.setPosition(cc.v2(120 + 10, 45));
                if (percent != 1) {
                    this.jw_loot_progress_logo.setVisible(false);
                }
            }
        }
    }
};


ThemeFooter.prototype.showJwLootBetTip = function(percent) {
    let luaPath = "footer/footer/jw_loot/v" + JwLootVerSion;
    let jw_config = require(luaPath);

    if (this.jwBetTipNode && !this.jwBetTipNode.isValid && this.jwBetTipNode.name === "jw_bet_tip") {
        this.jwBetTipNode.stopAllActions();
        this.jwBetTipNode.runAction(cc.sequence(
            cc.fadeIn(0.15),
            cc.delayTime(2),
            cc.fadeOut(0.15),
            cc.callFunc(() => {
                this.hideClubPointBetTip();
            })
        ));

        let scaleX = this.jw_progress_bar.progress / 100;
        this.jw_progress_bar.stopAllActions();
        this.jw_progress_bar.runAction(cc.sequence(
            cc.progressTo(0.15, percent * 100),
            cc.fadeIn(0.15),
            cc.delayTime(2),
            cc.fadeOut(0.15)
        ));

        if (jw_config.plist_pos) {
            this.jw_progress_plist_node.stopAllActions();
            this.jw_progress_plist_node.runAction(cc.moveTo(0.15, cc.v2(jw_config.plist_pos.x + jw_config.bar_len * percent, jw_config.plist_pos.y)));
        }

        if (this.jw_progress_bar_move) {
            if (scaleX <= percent) {
                this.jw_progress_bar_move.setAnimation(0, "bar_zhang", false);
            } else {
                this.jw_progress_bar_move.setAnimation(0, "bar_tui", false);
            }
            this.jw_progress_bar_move.stopAllActions();
            this.jw_progress_bar_move.runAction(cc.moveTo(0.15, cc.v2(jw_config.clip_star_pos.x + jw_config.bar_len * percent, jw_config.clip_star_pos.y)));
        }

        if (percent === 1) {
            if (this.jw_loot_progress_logo) {
                this.jw_loot_progress_logo.active = true;
            }
            if (this.jw_progress_bar_light) {
                this.jw_progress_bar_light.active = true;
            }
        } else {
            if (this.jw_loot_progress_logo) {
                this.jw_loot_progress_logo.active = false;
            }
            if (this.jw_progress_bar_light) {
                this.jw_progress_bar_light.active = false;
            }
        }

        if (this.jw_progress_plist_1) {
            this.jw_progress_plist_1.stopAllActions();
            this.jw_progress_plist_1.runAction(cc.sequence(
                cc.fadeIn(0.15),
                cc.show(),
                cc.delayTime(2),
                cc.fadeOut(0.15),
                cc.hide()
            ));
        }

        if (this.jw_progress_plist_2) {
            this.jw_progress_plist_2.stopAllActions();
            this.jw_progress_plist_2.runAction(cc.sequence(
                cc.fadeIn(0.15),
                cc.show(),
                cc.delayTime(2),
                cc.fadeOut(0.15),
                cc.hide()
            ));
        }
    } else {
        this.hideClubPointBetTip();
        this.jwBetTipNode = new cc.Node();
        this.jwBetTipNode.setName("jw_bet_tip");
        this.jwBetTipNode.setCascadeOpacityEnabled(true);
        this.jwBetTipNode.setOpacity(0);
        
        let board = FONTS.addImage("footer/footer/jw_loot/jw_loot_progress_bg_v" + JwLootVerSion + ".png");
        board.setPosition(jw_config.bg_pos);
        board.setAnchorPoint(cc.p(0.5, 0));
        this.jwBetTipNode.addChild(board);
        
        let percent_text = FONTS.addImage(bole.translateImage('footer/jw_loot/jw_loot_progress_text_v' + JwLootVerSion))
        percent_text.setPosition(jw_config.text_pos);
        this.jwBetTipNode.addChild(percent_text);
        percent_text.setName("jw_percent_text");
        
        this.jw_progress_bar_stencil = FONTS.addImage("footer/footer/jw_loot/jw_loot_progress_bar_v" + JwLootVerSion + ".png");
        this.jw_progress_bar_stencil.setPosition(jw_config.bar_pos);
        
        let progress_bar_clipping_node = new cc.ClippingNode(this.jw_progress_bar_stencil);
        progress_bar_clipping_node.setAlphaThreshold(0.01);//alpha<=1的部分会画出来
        progress_bar_clipping_node.setCascadeOpacityEnabled(true);
        progress_bar_clipping_node.setPosition(jw_config.clip_pos);
        this.jwBetTipNode.addChild(progress_bar_clipping_node);
        
        this.jw_progress_bar = new cc.ProgressTimer(FONTS.addImage("footer/footer/jw_loot/jw_loot_progress_bar_v" + JwLootVerSion + ".png"));
        this.jw_progress_bar.setType(cc.PROGRESS_TIMER_TYPE_BAR);
        this.jw_progress_bar.setPosition(jw_config.bar_pos);
        this.jw_progress_bar.setMidpoint(cc.p(0, 0));
        this.jw_progress_bar.setBarChangeRate(cc.p(1, 0));
        progress_bar_clipping_node.addChild(this.jw_progress_bar);
        this.jw_progress_bar.setCascadeOpacityEnabled(true);
        this.jw_progress_bar.setPercentage(percent * 100);
        
        this.jw_progress_plist_node = new cc.Node();
        //this.jw_progress_plist_node.setScale(100)
        progress_bar_clipping_node.addChild(this.jw_progress_plist_node, 10);
        
        if (jw_config.plist1) {
            this.jw_progress_plist_1 = new cc.ParticleSystemQuad("footer/footer/jw_loot/animation/v" + JwLootVerSion + jw_config.plist1);
            this.jw_progress_plist_1.setDuration(-1);
            this.jw_progress_plist_1.setPosition(0, 0);
            this.jw_progress_plist_node.addChild(this.jw_progress_plist_1);
        }
        
        if (jw_config.plist2) {
            this.jw_progress_plist_2 = new cc.ParticleSystemQuad("footer/footer/jw_loot/animation/v" + JwLootVerSion + jw_config.plist2);
            this.jw_progress_plist_2.setDuration(-1);
            this.jw_progress_plist_2.setPosition(0, 0);
            this.jw_progress_plist_node.addChild(this.jw_progress_plist_2);
        }
        
        if (jw_config.plist_pos) {
            this.jw_progress_plist_node.setPosition(jw_config.plist_pos.x + jw_config.bar_len * percent, jw_config.plist_pos.y);
        }
        
        let pet_bet_tip_box = FONTS.addImage(bole.translateImage('footer/jw_loot/jw_loot_progress_logo_v' + JwLootVerSion));
        pet_bet_tip_box.setPosition(jw_config.icon_pos);
        this.jwBetTipNode.addChild(pet_bet_tip_box);
        pet_bet_tip_box.setName("jw_logo");
        
        let config = bole.returnRequire("footer/footer/jw_loot/animation/v" + JwLootVerSion);
        let skeletonFile, atlasFile = bole.translateSkeleton("footer/jw_loot/animation/v" + JwLootVerSion + "/" + config.res_name, true, null, false);
        if (cc.sys.isNative && cc.fileUtils.isFileExist(skeletonFile)
            && cc.fileUtils.isFileExist(atlasFile)) {
            this.jw_loot_progress_logo = sp._SkeletonAnimation(skeletonFile, atlasFile);
            this.jw_loot_progress_logo.setAnimation(0, config.animation, true);
            this.jw_loot_progress_logo.setPosition(120 + 10, 45);
            this.jwBetTipNode.addChild(this.jw_loot_progress_logo);
            if (percent !== 1) {
                this.jw_loot_progress_logo.setVisible(false);
            }
        }
        
        if (bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
            this.jwBetTipNode.setPosition(0, 15);
        } else {
            this.jwBetTipNode.setPosition(-65, 5);
            this.jwBetTipNode.setScale(0.9);
        }
        
        this.betTipNode.addChild(this.jwBetTipNode);
        this.betTipNode.setScale(SCREEN_RATIO);
        this.jwBetTipNode.runAction(new cc.Sequence(
            new cc.FadeIn(0.15),
            cc.delayTime(2),
            new cc.FadeOut(0.15),
            new cc.CallFunc(() => {
                this.hideClubPointBetTip();
            })
        ));
        this.jw_progress_bar.setOpacity(0);
        this.jw_progress_bar.runAction(new cc.Sequence(
            new cc.FadeIn(0.15),
            cc.delayTime(2),
            new cc.FadeOut(0.15)
        ));
        
        if (bole.notNull(this.jw_progress_plist_1)) {
            this.jw_progress_plist_1.setVisible(false);
            this.jw_progress_plist_1.runAction(new cc.Sequence(
                new cc.FadeIn(0.15),
                new cc.Show(),
                cc.delayTime(2),
                new cc.FadeOut(0.15),
                new cc.Hide()
            ));
        }
        
        if (bole.notNull(this.jw_progress_plist_2)) {
            this.jw_progress_plist_2.setVisible(false);
            this.jw_progress_plist_2.runAction(new cc.Sequence(
                new cc.FadeIn(0.15),
                new cc.Show(),
                cc.delayTime(2),
                new cc.FadeOut(0.15),
                new cc.Hide()
            ));
        }
        
    }
};

ThemeFooter.prototype.showPetBetTip = function(percent) {
    if(this.cpBetTipNode && !this.cpBetTipNode.isRunning() && this.cpBetTipNode.getName() === "pet_bet_tip") {
        this.cpBetTipNode.stopAllActions();
        this.cpBetTipNode.runAction(cc.sequence(
            cc.fadeIn(0.15),
            cc.delayTime(2),
            cc.fadeOut(0.15),
            cc.callFunc(() => {
                this.hideClubPointBetTip();
            })
        ));
        this.progress_bar_stencil.stopAllActions();
        this.progress_bar_stencil.runAction(cc.scaleTo(0.15, percent, 1));
    } else {
        this.hideClubPointBetTip();

        this.cpBetTipNode = new cc.Node();
        this.cpBetTipNode.setName("pet_bet_tip");
        this.cpBetTipNode.setCascadeOpacityEnabled(true);
        this.cpBetTipNode.setOpacity(0);

        let board = new cc.Sprite('club/pet/pet_bet_tip_frame.png');
        board.setAnchorPoint(cc.v2(0.5, 0));
        this.cpBetTipNode.addChild(board);

        let progress_bar_frame = FONTS.addImage("club/pet/pet_bet_tip_progress_bar_frame.png");
        progress_bar_frame.setPosition(-12,30);
        this.cpBetTipNode.addChild(progress_bar_frame);

        let percent_text = FONTS.addNoEffectText('', bole.translateText('pet_bet_tip'), 16, cc.Color.WHITE);
        percent_text.enableOutline(cc.Color.BLACK, 2);
        percent_text.setPosition(-30, 57);
        this.cpBetTipNode.addChild(percent_text);

        const vex = [cc.v2(0, -40), cc.v2(208, -40), cc.v2(208, 40), cc.v2(0, 40)];
        this.progress_bar_stencil = new cc.DrawNode();
        this.progress_bar_stencil.drawPolygon(vex, cc.c4f(1,1,1,1), 0, cc.c4f(1,1,1,1));
        this.progress_bar_stencil.setPosition(-208/2, 0);
        this.progress_bar_stencil.setScaleX(percent);
        let progress_bar_clipping_node = new cc.ClippingNode(this.progress_bar_stencil);
        progress_bar_clipping_node.setAlphaThreshold(1);
        progress_bar_clipping_node.setCascadeOpacityEnabled(true);
        progress_bar_clipping_node.setPosition(-12, 30);
        this.cpBetTipNode.addChild(progress_bar_clipping_node);

        let progress_bar = FONTS.addImage("club/pet/pet_bet_tip_progress_bar.png");
        progress_bar.setPosition(0, 0);
        progress_bar_clipping_node.addChild(progress_bar);

        let pet_bet_tip_box = FONTS.addImage("club/pet/pet_bet_tip_box.png");
        pet_bet_tip_box.setPosition(120, 45);
        this.cpBetTipNode.addChild(pet_bet_tip_box);

        if(bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
            this.cpBetTipNode.setPosition(0, 15);
        } else {
            this.cpBetTipNode.setPosition(-65, 5);
        }

        this.betTipNode.addChild(this.cpBetTipNode);
        this.betTipNode.setScale(SCREEN_RATIO);
        this.cpBetTipNode.runAction(cc.sequence(
            cc.fadeIn(0.15),
            cc.delayTime(2),
            cc.fadeOut(0.15),
            cc.callFunc(() => {
                this.hideClubPointBetTip();
            })
        ))
    }
}

ThemeFooter.prototype.showAdNode = function() {
    if(!this.advertiseNode) {
        this.advertiseNode = AdvertiseControl.createAdNode(1);
        let s = cc.director.getVisibleSize();
        let pos = (bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL)
            ? cc.v2(s.width / 2 - 80, 240)
            : cc.v2(s.width / 2 - 80, 800);
        if(this.advertiseNode) {
            this.advertiseNode.setPosition(pos);
            this.node.addChild(this.advertiseNode);
            this.advertiseNode.setVisible(false);
        }
    }
    AD_NODE_LAST_STATE = false;
    TimerCallFunc.addCallFunc(() => {
        AdvertiseControl.updateAdNode();
    }, 1.0, this, this);
}

ThemeFooter.prototype.showDMPromotionDialog = function(popStackKey) {
    DM_THEME_CAN_SPIN = false;
    POPUP_STACK.pushStack('ngPerformOver');
    POPUP_STACK.pushStack(popStackKey);
    this.dailyMissionNode.stopAllActions();
    this.flameNode.stopAllActions();

    this.dailyMissionNode.visible = true;
    const scaleX = dailyMissionScale; // not sure where this comes from in your code
    this.dailyMissionNode.scaleX = scaleX;
    this.flameNode.visible = false;
    this.flameNode.scaleX = 0;
    this.dailyMissionBtn.touchEnabled = false;

    this.lastShouldFlameSwitch = shouldFlameSwitch;
    shouldFlameSwitch = false;
    if (this.getChildByName('dlg')) {
        this.getChildByName('dlg').removeFromParent();
    }

    const dlg = cc.CSLoader.createNode(PIC_PATH + 'footer/daily_mission/dm_promotion.csb');
    dlg.setName('dlg');
    this.root.addChild(dlg, 2);
    this.dmDialog = this.root.getChildByName('dlg').getChildByName('root');

    const visibleOrigin = cc.director.getVisibleOrigin();
    const visibleSize = cc.director.getVisibleSize();

    if (SCREEN_ORIENTATION.HORIZONTAL == bole.getScreenOrientation()) {
        this.dm_bg = 'footer/footer/daily_mission/tips_bg.png';
        const tempPos = cc.p(this.root.getChildByName('node_daily_mission').getPosition());
        this.root.getChildByName('dlg').setPosition({
        x: tempPos.x + 130 + 90 - 90 + 40,
        y: tempPos.y + 60 - 35 + 35 - 11
        });
    } else if (SCREEN_ORIENTATION.VERTICAL == bole.getScreenOrientation()) {
        this.dm_bg = 'footer/footer/daily_mission/tips_bg_v.png';
        this.root.getChildByName('dlg').setPosition({
        x: 172,
        y: 130
        });
    }

    this.dmDialog.getChildByName('bg').loadTexture(this.dm_bg);
    this.dmDialog.getChildByName('bg').setScale(1);

    this.dmDialog.getChildByName('top_text').loadTexture(bole.translateImage('footer/no_spin_left'));
    this.dmDialog.getChildByName('top_text').setScale(1);
    this.dmDialog.getChildByName('btn_text').loadTexture('footer/footer/daily_mission/tips_zuanshi.png');
    this.dmDialog.getChildByName('btn_text').setScale(1);

    const goldNum = FONTS.addFNT('footer/footer/daily_mission/font1.fnt', 120);
    goldNum.setPositionX(-40);
    this.dmDialog.getChildByName('gold_num').addChild(goldNum);

    this.timesNumNode = bole.translateNode('times_num', this.dmDialog);
    const timesNum = FONTS.addNoEffectText('', bole.translateText('dm_theme_tip1') + 30 + bole.translateText('dm_theme_tip2'), 30, bole.hexToColor('#ffffff'));
    timesNum.enableOutline(bole.hexToColor('#440072'), 2);
    this.timesNumNode.addChild(timesNum);
    timesNum.setPositionY(-20);

    this.root.getChildByName('dlg').runAction(cc.sequence(
        cc.delayTime(10.0),
        cc.callFunc(() => {
        if (this.root.getChildByName('dlg')) {
            this.DMDialogHide(popStackKey);
            bole.potp.send('daily_mission_extend', {});
            bole.showLoading();
        }
        if (DM_THEME_CAN_SPIN == false) {
            DM_THEME_CAN_SPIN = true;
            POPUP_STACK.popStack('ngPerformOver');
        }
        })
    ));

    this.dmDialog.getChildByName('btn_close').setTouchEnabled(false);
    this.dmDialog.getChildByName('btn_close').runAction(cc.sequence(
        cc.delayTime(2.0),
        cc.callFunc(() => {
        this.dmDialog.getChildByName('btn_close').setTouchEnabled(true);
        })
    ));

    const btnPic1 = 'footer/footer/daily_mission/btn_tips_1.png';
    const btnPic2 = 'footer/footer/daily_mission/btn_tips_2.png';
    dlg.getChildByName('root').getChildByName('btn').loadTextures(btnPic1, btnPic2, btnPic2);
    dlg.getChildByName('root').getChildByName('btn').setScale(1);
    dlg.getChildByName('root').getChildByName('btn').addTouchEventListener((sender, eventType) => {
        if (eventType == ccui.TouchEventType.began) {
        this.dmDialog.getChildByName('btn_close').setTouchEnabled(true);
        this.root.getChildByName('dlg').stopAllActions();
        bole.potp.send('daily_mission_extend', { is_buy: 1 });
        bole.showLoading();
        }
    });

    const btnPic3 = 'footer/footer/daily_mission/btn_close.png';
    const btnPic4 = 'footer/footer/daily_mission/btn_close_clicked.png';
    dlg.getChildByName('root').getChildByName('btn_close').loadTextures(btnPic3, btnPic4, btnPic4);
    dlg.getChildByName('root').getChildByName('btn_close').setScale(1);
    dlg.getChildByName('root').getChildByName('btn_close').addTouchEventListener((sender, eventType) => {
        if (eventType == ccui.TouchEventType.began) {
        bole.potp.send('daily_mission_extend', {});
        bole.showLoading();
        if (this.root.getChildByName('dlg')) {
            this.DMDialogHide(popStackKey);
        }
        }
    });

    const centerX = visibleSize.width / 2;

    const blackLayer = cc._LayerColor.create(cc.color(0, 0, 0, 0.7 * 0xff), visibleSize.width * 4, visibleSize.height * 4);
    blackLayer.setName('blackLayer');
    this.root.getChildByName('node_mask').addChild(blackLayer);
    bole.addSwallowTouchesEventListener(blackLayer);

    blackLayer.setAnchorPoint(0.5, 0.5);
    blackLayer.setPosition(-centerX / SCREEN_RATIO, 0);

    if (SCREEN_ORIENTATION.HORIZONTAL == bole.getScreenOrientation()) {
        const posY = this.dmDialog.getChildByName('top_text').getPositionY();
        this.dmDialog.getChildByName('top_text').setPositionY(posY + 10);
        const posX = this.dmDialog.getChildByName('top_text').getPositionX();
        this.timesNumNode.setPositionX(posX);
        const posY2 = dlg.getChildByName('root').getChildByName('btn').getPositionY();
        dlg.getChildByName('root').getChildByName('btn').setPositionY(posY2 - 3.5);
    } else if (SCREEN_ORIENTATION.VERTICAL == bole.getScreenOrientation()) {
        const posX = this.dmDialog.getChildByName('top_text').getPositionX();
        this.timesNumNode.setPositionX(posX);
    }
};
ThemeFooter.prototype.DMDialogHide = function(popStackKey) {
    POPUP_STACK.popStack(popStackKey);
    POPUP_STACK.popStack('ngPerformOver');
    DM_THEME_CAN_SPIN = true;

    this.dailyMissionBtn.setTouchEnabled(true);
    if (this.root.getChildByName('dlg') && !cc.sys.isObjectValid(this.root.getChildByName('dlg'))) {
        this.root.getChildByName('dlg').removeFromParent();
    }
    shouldFlameSwitch = this.lastShouldFlameSwitch;
    this.root.getChildByName('node_mask').removeAllChildren();

    if (shouldFlameSwitch) {
        if (bole.notNull(this.dailyMissionNode) && bole.notNull(this.flameNode)) {
            this.dailyMissionNode.stopAllActions();
            this.dailyMissionNode.runAction(cc.repeatForever(
                cc.sequence(
                    cc.delayTime(8),
                    cc.delayTime(0.2),
                    cc.scaleTo(0.2, 0, dailyMissionScale),
                    cc.hide(),
                    cc.delayTime(8.2),
                    cc.show(),
                    cc.scaleTo(0.2, dailyMissionScale, dailyMissionScale)
                )
            ));
            this.flameNode.stopAllActions();
            this.flameNode.runAction(cc.repeatForever(
                cc.sequence(
                    cc.delayTime(8.2),
                    cc.show(),
                    cc.scaleTo(0.2, 1, 1),
                    cc.delayTime(8),
                    cc.delayTime(0.2),
                    cc.scaleTo(0.2, 0, 1),
                    cc.hide()
                )
            ));
        }
    } else {
        if (bole.notNull(this.dailyMissionNode)) {
            this.dmNodeCurStatus = true;
        }
    }

};

ThemeFooter.prototype.showDMUnlockTip = function() {
    var tipNode = cc.Node.create();
    this.root.addChild(tipNode);
    tipNode.setPosition(this.root.getChildByName("node_daily_mission").getPosition());

    var tip = (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) ?
            FONTS.addImage(bole.translateImage("new_user/dm_unlock_new")) :
            FONTS.addImage(bole.translateImage("new_user/dm_unlock_new_v"));

    tipNode.setPosition((bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) ?
        cc.p(tipNode.getPositionX() + tip.getContentSize().width / 2 - 60 + 10, tipNode.getPositionY() + tip.getContentSize().height / 2 + 40) :
        cc.p(tipNode.getPositionX() + -tip.getContentSize().width / 2 + 60 - 10, tipNode.getPositionY() + tip.getContentSize().height / 2 + 40));
    tipNode.addChild(tip);

    tipNode.setScale(0);
    tipNode.runAction(cc.sequence(
        cc.scaleTo(0.2, 1),
        cc.delayTime(3),
        cc.scaleTo(0.2, 0),
        cc.removeSelf()
    ));

};

ThemeFooter.prototype.showDMFinishTip = function() {
    if (cc.UserDefault.getInstance().getIntegerForKey('NEW_GUIDE_DM_FINISH', 0) == 0) {
        cc.UserDefault.getInstance().setIntegerForKey('NEW_GUIDE_DM_FINISH', 1);

        var tipNode = cc.Node.create();
        this.root.addChild(tipNode);
        tipNode.setPosition(this.root.getChildByName("node_daily_mission").getPosition());

        var tip = (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) ?
                FONTS.addImage(bole.translateImage("new_user/dm_finish_new")) :
                FONTS.addImage(bole.translateImage("new_user/dm_finish_new_v"));

        tipNode.setPosition((bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) ?
            cc.p(tipNode.getPositionX() + tip.getContentSize().width / 2 - 60 + 10, tipNode.getPositionY() + tip.getContentSize().height / 2 + 40) :
            cc.p(tipNode.getPositionX() + -tip.getContentSize().width / 2 + 60 - 10, tipNode.getPositionY() + tip.getContentSize().height / 2 + 40));
        tipNode.addChild(tip);

        tipNode.setScale(0);
        tipNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.delayTime(3),
            cc.scaleTo(0.2, 0),
            cc.removeSelf()
        ));

    } else {
        var tipNode = cc.Node.create();
        this.root.addChild(tipNode);
        tipNode.setPosition(this.root.getChildByName("node_daily_mission").getPosition());

        var tip = FONTS.addImage(
            (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) ?
                    bole.translateImage("new_user/dm_finish") :
                    bole.translateImage("new_user/dm_finish_v")
        );

        tip.setPosition((bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) ?
            cc.p(tip.getContentSize().width / 2 - 65 + 10, tip.getContentSize().height / 2 + 40) :
            cc.p(-tip.getContentSize().width / 2 + 65 - 10, tip.getContentSize().height / 2 + 40));

        tipNode.addChild(tip);

        tipNode.setScale(0);
        tipNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.delayTime(3),
            cc.scaleTo(0.2, 0),
            cc.removeSelf()
        ));

    }
};

ThemeFooter.prototype.createMaxBetTip = function() {
    if (this.maxBetTip != null) {
        return;
    }
    this.maxBetTip = cc.Node.create();

    var contentNode = cc.Node.create();
    contentNode.setPosition(
            bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL ? -15 : 0,
            92
    );
    this.maxBetTip.addChild(contentNode);

    var board = FONTS.addTexture(string.format(
            'footer/footer/max_bet_tip%s.png',
            bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL ? '_v' : ''
    ));
    contentNode.addChild(board);

    var textNode = cc.Node.create();
    textNode.setPosition(0, 7);
    contentNode.addChild(textNode);

    var title = FONTS.addNoEffectText('', bole.translateText('max_bet_tip_title'), 28, bole.hexToColor('#FCFF01'));
    title.enableOutline(bole.hexToColor('#000B73'), 2);
    textNode.addChild(title);

    var maxBetNum = this && this.ctl && this.ctl.betControl && this.ctl.betControl.getCurTotalBet();
    var subTextNode = cc.Node.create();
    textNode.addChild(subTextNode);
    var num =FONTS.addNoEffectText('', bole.comma_value_abbrev(maxBetNum || 0,12), 30, cc.WHITE);
    var text = FONTS.addNoEffectText('', bole.translateText('max_bet_tip_text'), 24, cc.WHITE);
    num.enableOutline(bole.hexToColor('#000B73'), 2);
    text.enableOutline(bole.hexToColor('#000B73'), 2);
    subTextNode.addChild(num);
    subTextNode.addChild(text);

    CenterAlignment.setChildrenInOrder(subTextNode, num, text);
    CenterAlignment.arrangeVertical(subTextNode, 5);

    CenterAlignment.setChildrenInOrder(textNode, title, subTextNode);
    CenterAlignment.arrangeVertical(textNode, 4);

    this.root.addChild(this.maxBetTip, FOOT_Z_ORDER.MAX_BET_TIP);
    this.maxBetTip.setPosition(cc.pAdd(
            cc.p(this.root.getChildByName("node_max_bet").getPosition()),
            cc.p(
                    0,
                    this.btnMaxBet.getBoundingBox().height / 2 +
                            (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL ? 10 : -8)
            )
    ));
    this.maxBetTip.setScale(0);
    this.maxBetTip.runAction(cc.EaseBackOut.create(
            cc.ScaleTo.create(0.33, 1.0)
    ));
};

ThemeFooter.prototype.hideMaxBetTip = function() {
    if (this.maxBetTip != null) {
        this.maxBetTip.runAction(cc.Sequence.create(
                cc.EaseBackIn.create(cc.ScaleTo.create(0.33, 0)),
                cc.CallFunc.create(function() {
                    this.maxBetTip.removeFromParent();
                    this.maxBetTip = null;
                }, this)
        ));
    }
};

ThemeFooter.prototype.hideTotalBetNode = function() {
    if (this.totalBetNode) {
        this.totalBetNodePos = cc.p(this.totalBetNode.getPositionX(), this.totalBetNode.getPositionY());
        this.totalBetNodeHidePos = cc.p(this.totalBetNodePos.x , this.totalBetNodePos.y - 200);
        this.totalBetNode.runAction(cc.Sequence.create(
                cc.MoveTo.create(0.5, this.totalBetNodeHidePos)
        ));
        this.root.getChildByName('node_total_bet_info').runAction(cc.Sequence.create(
            cc.MoveTo.create(0.5, this.totalBetNodeHidePos)
        ));
    }
};

ThemeFooter.prototype.showTotalBetNode = function() {
    if (this.totalBetNode) {
        this.totalBetNodePos = cc.p(this.totalBetNode.getPositionX(), this.totalBetNode.getPositionY());
        this.totalBetNodeShowPos = cc.p(this.totalBetNodePos.x , this.totalBetNodePos.y + 200);
        this.totalBetNode.runAction(cc.Sequence.create(
                cc.MoveTo.create(0.5, this.totalBetNodeShowPos)
        ));
        this.root.getChildByName('node_total_bet_info').runAction(cc.Sequence.create(
            cc.MoveTo.create(0.5, this.totalBetNodeShowPos)
        ));
    }
};

ThemeFooter.prototype.hide = function() {
    this.setVisible(false);
};

ThemeFooter.prototype.show = function() {
    this.setVisible(true);
};

ThemeFooter.prototype.initPageNames = function() {
this.pageNames = [];
var medalData = this.getMedalRuleData();
if (this.isGameFeverTheme(this.ctl.themeName.themeId) && this.game_fever_count_down && this.game_fever_count_down > 0) {
    for (var i = 0; i < this.ctl.themeName.game_fever_info_pages_picture_name.length; ++i) {
    var v = this.ctl.themeName.game_fever_info_pages_picture_name[i];
    if (v) {
        if (medalData && medalData.filename && medalData.filename == v && MedalControl.getInstance().isOpened()) {
        if (MedalControl.getInstance().isOpened(this.ctl.themeName.themeId)) {
            this.pageNames.push({ key: v, filename: v + '_medal' });
        }
        } else {
        this.pageNames.push({ key: v, filename: v });
        }
    }
    }
} else {
    for (var i = 1; i <= this.pageCnt; ++i) {
    if (medalData && medalData.index && medalData.index == i && MedalControl.getInstance().isOpened()) {
        if (MedalControl.getInstance().isOpened(this.ctl.themeName.themeId)) {
        if (i >= 10) {
            this.pageNames.push({ filename: `Info_${i}_medal`, key: `Info_${i}` });
        } else {
            this.pageNames.push({ filename: `Info_0${i}_medal`, key: `Info_0${i}` });
        }
        }
    } else {
        if (i >= 10) {
        this.pageNames.push({ filename: `Info_${i}`, key: `Info_${i}` });
        } else {
        this.pageNames.push({ filename: `Info_0${i}`, key: `Info_0${i}` });
        }
    }
    }
}
};

ThemeFooter.prototype.initLayout = function() {
    var visibleOrigin = cc.Director.getInstance().getVisibleOrigin();
    var visibleSize = cc.Director.getInstance().getVisibleSize();
    var centerX = visibleOrigin.x + visibleSize.width / 2;
    var centerY = visibleOrigin.y + visibleSize.height / 2;

    this.blackLayer = cc._LayerColor.create(cc.color(0, 0, 0, 0.7 * 0xff), visibleSize.width, visibleSize.height);
    this.addChild(this.blackLayer);

    bole.addSwallowTouchesEventListener(this.blackLayer);

    this.contentNode = new cc.Node();
    this.addChild(this.contentNode);

    if (bole.isChrome() && IS_THEME_VERTICAL[bole.scene.ctl.getThemeId()]) {
        centerX = centerX * visibleSize.width / visibleSize.height;
        centerY = centerY * visibleSize.width / visibleSize.height;

        this.contentNode.setScale(visibleSize.height / visibleSize.width);
        this.blackLayer.setScale(1.2 * visibleSize.width / visibleSize.height);
    }

    if (this.isGameFeverTheme(this.ctl.themeName.themeId) && this.game_fever_count_down && this.game_fever_count_down > 0 && this.ctl.themeName.game_fever_info_background_name) {
        this.infoBackSprite = cc.Sprite.create(this.ctl.themeName.ImgPath + this.ctl.themeName.game_fever_info_background_name + '.png');
    } else {
        if (this.ctl.themeName.themeId == 999946) {
            this.infoBackSprite = cc.Sprite.create(this.ctl.themeName.ImgPath + 'InfoBackground_horiz.png');
        } else {
            this.infoBackSprite = cc.Sprite.create(this.ctl.themeName.ImgPath + 'InfoBackground.png');
        }

    }

    if (PAD_TAG) {
        this.infoBackSprite.setPosition(centerX, centerY);
    } else {
        if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
            this.infoBackSprite.setPosition(centerX, this.infoBackSprite.getContentSize().height / 2)
        } else if (SCREEN_ORIENTATION.VERTICAL === bole.getScreenOrientation()) {
            this.infoBackSprite.setPosition(centerX, centerY + 30);
        }
    }

    if (bole.isChrome() && IS_THEME_VERTICAL[bole.scene.ctl.getThemeId()]) {
        this.infoBackSprite.setPositionY(this.infoBackSprite.getPositionY() + 60 * visibleSize.width / visibleSize.height);
    }

    this.infoBackSprite.setScale(SCREEN_RATIO);
    this.contentNode.addChild(this.infoBackSprite);

    this.infoContentSprite = cc.Sprite.create();
    this.infoContentSprite.setPosition(centerX, this.infoBackSprite.getPositionY());
    if (PAD_TAG) {
        this.infoContentSprite.setPosition(centerX, centerY);
    } else {
        if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
            this.infoContentSprite.setPosition(centerX, centerY)
        } else if (SCREEN_ORIENTATION.VERTICAL === bole.getScreenOrientation()) {
            this.infoContentSprite.setPosition(centerX, centerY + 30);
        }
    }
    this.infoContentSprite.setScale(SCREEN_RATIO);
    this.contentNode.addChild(this.infoContentSprite);


    this.infoCenterNode = new cc.Node();
    this.infoCenterNode.setScale(SCREEN_RATIO);
    this.infoCenterNode.setPosition(centerX, centerY);
    this.contentNode.addChild(this.infoCenterNode, 1);
    if (PAD_TAG) {
        this.infoCenterNode.setPosition(centerX, centerY);
    } else {
        if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
            this.infoCenterNode.setPosition(centerX, centerY)
        } else if (SCREEN_ORIENTATION.VERTICAL === bole.getScreenOrientation()) {
            this.infoCenterNode.setPosition(centerX, centerY + 30);
        }
    }

    this.backBtn = cc.MenuItemImage.create();
    this.backBtn.setNormalSpriteFrame(cc.SpriteFrameCache.getInstance().getSpriteFrameByName(BTNFILESPATH.PAYTABLE_BACK[1]));
    this.backBtn.setSelectedSpriteFrame(cc.SpriteFrameCache.getInstance().getSpriteFrameByName(BTNFILESPATH.PAYTABLE_BACK[2]));

    this.backBtn.setScale(SCREEN_RATIO);
    this.backBtn.registerScriptTapHandler(function () {
        this.exit()
    }.bind(this));

    var backLabel = FONTS.addImage(bole.translateImage("footer/backtogame"));
    backLabel.setName('backLabel');
    var size = this.backBtn.getContentSize();
    backLabel.setPosition(size.width / 2, size.height / 2);
    this.backBtn.addChild(backLabel);

    this.prevBtn = cc.MenuItemImage.create();
    this.prevBtn.setNormalSpriteFrame(cc.SpriteFrameCache.getInstance().getSpriteFrameByName(BTNFILESPATH.PAYTABLE_PREV[1]));
    this.prevBtn.setSelectedSpriteFrame(cc.SpriteFrameCache.getInstance().getSpriteFrameByName(BTNFILESPATH.PAYTABLE_PREV[2]));
    this.prevBtn.setPositionX(-250);
    this.prevBtn.setScale(SCREEN_RATIO);
    this.prevBtn.registerScriptTapHandler(function () {
        this.onPrevPage()
    }.bind(this));

    this.nextBtn = cc.MenuItemImage.create();
    this.nextBtn.setNormalSpriteFrame(cc.SpriteFrameCache.getInstance().getSpriteFrameByName(BTNFILESPATH.PAYTABLE_NEXT[1]));
    this.nextBtn.setSelectedSpriteFrame(cc.SpriteFrameCache.getInstance().getSpriteFrameByName(BTNFILESPATH.PAYTABLE_NEXT[2]));
    this.nextBtn.setPositionX(250);
    this.nextBtn.setScale(SCREEN_RATIO);
    this.nextBtn.registerScriptTapHandler(function () {
        this.onNextPage()
    }.bind(this));

    this.btnMenu = cc.Menu.create(this.backBtn, this.prevBtn, this.nextBtn);
    if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
        this.btnMenu.setPosition(centerX, 45)
    } else if (SCREEN_ORIENTATION.VERTICAL === bole.getScreenOrientation()) {
        this.btnMenu.setPosition(centerX, 90);
    }
    this.contentNode.addChild(this.btnMenu);


    var themeConfig = TemplateUtil.getTemplateConfigByField("ThemeTemplate", "theme_id", this.ctl.themeName.themeId);
    if (cc.FileUtils.getInstance().isFileExist(bole.translateImage('footer/moreLang')) && themeConfig) {
        this.btnMoreLanguage = new cc._Button(bole.translateImage('footer/moreLang'), bole.translateImage('footer/moreLang'), bole.translateImage('footer/moreLang'));
        this.contentNode.addChild(this.btnMoreLanguage);
        if (bole.getScreenOrientation() === SCREEN_ORIENTATION.VERTICAL) {
            this.btnMoreLanguage.setScale(SCREEN_RATIO_VERTICAL)
            this.btnMoreLanguage.setPosition(centerX + 242 * SCREEN_RATIO_VERTICAL, centerY - 611 * SCREEN_RATIO_VERTICAL)
        } else {
            this.btnMoreLanguage.setScale(SCREEN_RATIO)
            this.btnMoreLanguage.setPosition(centerX + 395 * SCREEN_RATIO, centerY - 316 * SCREEN_RATIO)
        }

        if (bole.isChrome() && IS_THEME_VERTICAL[bole.scene.ctl.getThemeId()]) {
            this.btnMoreLanguage.setPositionX(this.btnMoreLanguage.getPositionX() + 35);
        }

        var touchLoadingEvent = function (sender, eventType) {
            if (eventType === ccui.TouchEventType.ended) {
                bole.openThemeFAQ(this.ctl.themeName.themeId);
            }
        }.bind(this)
        this.btnMoreLanguage.addTouchEventListener(touchLoadingEvent);
    }
};
