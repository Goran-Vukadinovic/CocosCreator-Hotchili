ThemeHotChiliJackpotLayer = cc.Class({
    extends: cc.Layer,
    name:"ThemeHotChiliJackpotLayer",
    sendThemeJpCmd() {
        ThemeHotChili.ctl.sendThemeJpCmd();
    },

    onJpCmd(data) {
        this.updateTargetJackpot(data.jp_value);
    },

    ctor() {
        this.TAG = 'ThemeHotChili.JackpotLayer';
        this.JPNum = 5;
        this.jackpotFrame = null,
        this.jackpotNumList = null,
        this.jackpotLockList = null,
        this.jackpotCurrentList = null,
        this.jackpotLastList = null,
        this.jackpotTargetList = null,
        this.jackpotLastTargetList = null,
        this.JPInterval = 10.0;
        this.jpLastSendTime = 0;
        this.jpLastReceiveTime = 0;
        this.jpPosY = 0;
        this.jpNamePosXList = null;
        this.jpNumPosXList = null;
        this.jpNamePosYList = null;
        this.jpNumPosYList = null;
        this.isMimicking = false;
        this.mimicJpIndexes = null;
        this.mimicJpValues = null;
        this.mimicJpRealValues = null;
        this.mimicJpStartValues = null;
        this.mimicStartTime = null
        this.mimicDuration = 0;
        this.init();
    },

    init() {
        return true;
    },
    
    reset(data) {
        this.jpLastSendTime = 0;
    
        let value = bole.cloneTable(data);
    
        if (!value || value.length < this.JPNum) {
            return;
        }
    
        for (let i = 0; i < value.length; i++) {
            value[i] = value[i] * ThemeHotChili.ctl.getCurTotalBet();
        }
    
        this.jackpotTargetList = bole.cloneTable(value);
        this.jackpotLastTargetList = bole.cloneTable(value);
        this.jackpotCurrentList = value;
    
        for (let i = 0; i < this.JPNum; i++) {
            this.jackpotNumList[i].setVisible(true);
        }
    },
    assemble() {
        const director = cc.director;
        const visibleOrigin = director.getVisibleOrigin();
        const visibleSize = director.getVisibleSize();
        this.centerX = visibleOrigin.x + visibleSize.width / 2;
        this.centerY = visibleOrigin.y + visibleSize.height / 2;
    
        this.jpNamePosXList = [this.centerX, this.centerX - 190, this.centerX + 192, this.centerX - 220, this.centerX + 222];
        this.jpNamePosYList = [this.centerY + 569, this.centerY + 477, this.centerY + 477.5, this.centerY + 396.5, this.centerY + 396];
    
        this.jpBoardPosXList = [this.centerX + 1, this.centerX - 189.5, this.centerX + 191.5, this.centerX - 220, this.centerX + 223];
        this.jpBoardPosYList = [this.centerY + 539, this.centerY + 446.5,  this.centerY + 446.5, this.centerY + 367.5, this.centerY + 367];
    
        this.jpNumPosXList = [this.centerX + 0.5, this.centerX - 191, this.centerX + 191.5, this.centerX - 221, this.centerX + 223];
        // need fix position
        this.jpNumPosYList = [this.centerY + 527, this.centerY + 441, this.centerY + 441, this.centerY + 362, this.centerY + 362.5];
    
        this.jackpotLastList = [];
        this.jpFrame = [];
        this.jpName = [];
        this.jackpotNumList = [];
    
        this.mimicJpIndexes = [];
        this.mimicJpValues = [];
        this.mimicJpRealValues = [];
        this.mimicJpStartValues = [];
        this.resetForMimic();
    
        this.jpNode = [];
        for (let i = 0; i < this.JPNum; i++) {
            this.jpNode[i] = new cc.Node();
            this.addChild(this.jpNode[i]);
            this.jpNode[i].setPosition(this.jpBoardPosXList[i], this.jpBoardPosYList[i]);
        
            this.jpFrame[i] = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/jpFrame' + (i + 1) + '.png');
            this.jpNode[i].addChild(this.jpFrame[i]);
            this.jpFrame[i].setPosition(0, 0);
        
            this.jpName[i] = new cc._Sprite(bole.translateImage('jpTitle' + (i + 1), ThemeHotChili.themeId));
            this.jpName[i].setPosition(this.jpNamePosXList[i] - this.jpBoardPosXList[i], this.jpNamePosYList[i] - this.jpBoardPosYList[i]);
            this.jpNode[i].addChild(this.jpName[i]);
        
            this.jackpotNumList[i] = new cc._LabelBMFont('', ThemeHotChili.ImgPath + 'ng/jpFnt' + (i + 1) + '.fnt');
            this.jackpotNumList[i].setPosition(this.jpNumPosXList[i] - this.jpBoardPosXList[i], this.jpNumPosYList[i] - this.jpBoardPosYList[i]);
            this.jpNode[i].addChild(this.jackpotNumList[i]);
        }
        bole.setLabelWidth(this.jackpotNumList[0], 400);
        bole.setLabelWidth(this.jackpotNumList[1], 250);
        bole.setLabelWidth(this.jackpotNumList[2], 250);
        bole.setLabelWidth(this.jackpotNumList[3], 192);
        bole.setLabelWidth(this.jackpotNumList[4], 192);
        
        this.jpNameDark = [];
        this.jackpotNumDark = [];
        this.jpClickBtn = [];
        for (let i = 0; i < 3; i++) {
            var imgPath = bole.translateImage('jpTitleDark' + (i + 1), ThemeHotChili.themeId);
            this.jpNameDark[i] = new cc._Sprite(imgPath);
            this.jpNameDark[i].setPosition(this.jpNamePosXList[i] - this.jpBoardPosXList[i], this.jpNamePosYList[i] - this.jpBoardPosYList[i]);
            this.jpNode[i].addChild(this.jpNameDark[i], 11);
            this.jpNameDark[i].setVisible(false);
        
            this.jackpotNumDark[i] = new cc._LabelBMFont('', ThemeHotChili.ImgPath + 'ng/jpDarkFnt.fnt');
            this.jackpotNumDark[i].setPosition(this.jpNumPosXList[i] - this.jpBoardPosXList[i], this.jpNumPosYList[i] - this.jpBoardPosYList[i]);
            this.jpNode[i].addChild(this.jackpotNumDark[i], 11);
            this.jackpotNumDark[i].setVisible(false);
        
            this.jpClickBtn[i] = new cc._Button(ThemeHotChili.ImgPath + 'ng/jpFrame' + (i + 1) + '.png', ThemeHotChili.ImgPath + 'ng/jpFrame' + (i + 1) + '.png', ThemeHotChili.ImgPath + 'ng/jpFrame' + (i + 1) + '.png');
            this.jpClickBtn[i].setPosition(this.jpBoardPosXList[i], this.jpBoardPosYList[i]);
            this.jpClickBtn[i].setOpacity(0);
            this.jpClickBtn[i].setTouchEnabled(true);
            const touch = function(sender, eventType) {
                if (eventType === cc.Node.EventType.TOUCH_START) {
                    if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN &&
                        (ThemeHotChili.gameLayer.spinLayer.state === ThemeHotChili.SpinLayerState.Idle || ThemeHotChili.gameLayer.spinLayer.effectLayer.isWinLineCanChangeTip()) &&
                        !ThemeHotChili.ctl.getAutoStatus()) {
                        ThemeHotChili.ctl.disableSpinAndOtherBtns();
                    }
                } else if (eventType === cc.Node.EventType.TOUCH_END) {
                    const spinTable = ThemeHotChili.gameLayer.spinLayer.spinTable;
                    if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN &&
                        (ThemeHotChili.gameLayer.spinLayer.state === ThemeHotChili.SpinLayerState.Idle || ThemeHotChili.gameLayer.spinLayer.effectLayer.isWinLineCanChangeTip()) &&
                        !ThemeHotChili.ctl.getAutoStatus()) {
                        TimerCallFunc.addCallFunc(function() {
                            ThemeHotChili.ctl.enableSpinAndOtherBtns();
                        }, 0.5, null, this);
        
                        ThemeHotChili.ctl.betControl.changeToBet(GLOBAL_LEVEL_BET.five_bet_list_1[6 - i]);
                        ThemeHotChili.ctl.theme.mathType = 6 - i - 2;
                    }
                } else if (eventType === cc.Node.EventType.TOUCH_CANCEL) {
                    if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN &&
                        (ThemeHotChili.gameLayer.spinLayer.state === ThemeHotChili.SpinLayerState.Idle || ThemeHotChili.gameLayer.spinLayer.effectLayer.isWinLineCanChangeTip()) &&
                        !ThemeHotChili.ctl.getAutoStatus()) {
                        ThemeHotChili.ctl.enableSpinAndOtherBtns();
                    }
                }
            };            
            this.jpClickBtn[i].addTouchEventListener(touch);
            this.addChild(this.jpClickBtn[i], 110);
            this.jpClickBtn[i].setVisible(false);
            
        }
        bole.setLabelWidth(this.jackpotNumDark[0], 400);
        bole.setLabelWidth(this.jackpotNumDark[1], 250);
        bole.setLabelWidth(this.jackpotNumDark[2], 250);
        

        this.lockTemp1 = false;
        this.lockTemp2 = false;
        this.lockTemp3 = false;
        
        this.lockNode = {};
        this.lockNodePosX = [this.centerX + 5, this.centerX - 185, this.centerX + 195];
        this.lockNodePosY = [this.centerY + 500 - 15, this.centerY + 408 - 15, this.centerY + 408 - 15];
        this.lockFrame = [];
        this.betUp = [];
        this.betUpJp = [];
        this.betUpEnd = [];
        
        this.unLockNode = [];
        this.unLockFrame = [];
        this.isUnLocked = [];
        this.isUnLockedJp = [];
        for (var i = 0; i < 3; i++) {
            this.lockNode[i] = new cc.Node();
            this.lockNode[i].setPosition(this.lockNodePosX[i], this.lockNodePosY[i]);
            this.addChild(this.lockNode[i], 5);
            this.lockNode[i].setVisible(false);
            
            this.lockFrame[i] = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/lockFrame.png');
            this.lockNode[i].addChild(this.lockFrame[i]);
            
            var betUp_CN = new cc.Node();
            betUp_CN.setName("betUp_CN");
            betUp_CN.setPosition(-0.5, -10 + 3);
            this.lockNode[i].addChild(betUp_CN);
            var betUp_EN = new cc.Node();
            betUp_EN.setName("betUp_EN");
            betUp_EN.setPosition(-45, -10 + 3);
            this.lockNode[i].addChild(betUp_EN);
            this.betUp[i] = bole.translateNode("betUp", this.lockNode[i]);
            var tempNode = new cc._Sprite(bole.translateImage("betUp", ThemeHotChili.themeId));
            this.betUp[i].addChild(tempNode);
            
            var betUpJp_CN = new cc.Node();
            betUpJp_CN.setName("betUpJp_CN");
            betUpJp_CN.setPosition(42, -10.5 + 3);
            this.lockNode[i].addChild(betUpJp_CN);
            var betUpJp_EN = new cc.Node();
            betUpJp_EN.setName("betUpJp_EN");
            betUpJp_EN.setPosition(85, -10.5 + 3);
            this.lockNode[i].addChild(betUpJp_EN);
            this.betUpJp[i] = bole.translateNode("betUpJp", this.lockNode[i]);
            var tempNode2 = new cc._Sprite(bole.translateImage("jpTitle" + (i + 1), ThemeHotChili.themeId));
            if (i == 1) {
                tempNode2.setScale(0.6);
            } else {
                tempNode2.setScale(0.8);
            }
            this.betUpJp[i].addChild(tempNode2);
            
            var betUpEnd_CN = new cc.Node();
            betUpEnd_CN.setName("betUpEnd_CN");
            betUpEnd_CN.setPosition(1000, 1000);
            this.lockNode[i].addChild(betUpEnd_CN);
            var betUpEnd_EN = new cc.Node();
            betUpEnd_EN.setName("betUpEnd_EN");
            betUpEnd_EN.setPosition(130, -9.5 + 3);
            this.lockNode[i].addChild(betUpEnd_EN);
            this.betUpEnd[i] = bole.translateNode("betUpEnd", this.lockNode[i]);
            var tempNode3 = new cc._Sprite(bole.translateImage("betUpEnd", ThemeHotChili.themeId));
            this.betUpEnd[i].addChild(tempNode3);
            
            this.unLockNode[i] = new cc.Node();
            this.unLockNode[i].setPosition(this.lockNodePosX[i], this.lockNodePosY[i]);
            this.addChild(this.unLockNode[i], 5);
            this.unLockNode[i].setVisible(false);
            
            this.unLockFrame[i] = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/lockFrame.png');
            this.unLockNode[i].addChild(this.unLockFrame[i]);
            
            var isUnLocked_CN = new cc.Node();
            isUnLocked_CN.setName("isUnLocked_CN");
            isUnLocked_CN.setPosition(38.5, -10 + 3);
            this.unLockNode[i].addChild(isUnLocked_CN);
            var isUnLocked_EN = new cc.Node();
            isUnLocked_EN.setName("isUnLocked_EN");
            isUnLocked_EN.setPosition(43.5, -10.5 + 3);
            this.unLockNode[i].addChild(isUnLocked_EN);
            this.isUnLocked[i] = bole.translateNode("isUnLocked", this.unLockNode[i]);
            var tempNode4 = new cc._Sprite(bole.translateImage("isUnLocked", ThemeHotChili.themeId));
            this.isUnLocked[i].addChild(tempNode4);
            
            var isUnLockedJp_CN = new cc.Node();
            isUnLockedJp_CN.setName("isUnLockedJp_CN");
            isUnLockedJp_CN.setPosition(-49, -10.5 + 3);
            this.unLockNode[i].addChild(isUnLockedJp_CN);
            var isUnLockedJp_EN = new cc.Node();
            isUnLockedJp_EN.setName("isUnLockedJp_EN");
            isUnLockedJp_EN.setPosition(-69, -11 + 3);
            this.unLockNode[i].addChild(isUnLockedJp_EN);
            this.isUnLockedJp[i] = bole.translateNode("isUnLockedJp", this.unLockNode[i]);
            var tempNode5 = new cc._Sprite(bole.translateImage("jpTitle" + (i + 1), ThemeHotChili.themeId));
            if (i == 0) {
                tempNode5.setScale(0.6);
            } else {
                tempNode5.setScale(0.8);
            }
            this.isUnLockedJp[i].addChild(tempNode5);
        }
        this.lockNodeTemp = {};
        for (let i = 0; i < 3; i++) {
            this.lockNodeTemp[i] = new cc.Node();
            this.addChild(this.lockNodeTemp[i]);
        }
        
        // 每隔10秒发送一次jp请求
        const scheduleSendCmd = function() {
            this.sendThemeJpCmd();
        };
        this.schedule(scheduleSendCmd, this.JPInterval);
        const updateInterval = THEME_JP_NUM_UPDATE_INTERVAL[ThemeHotChili.themeId] || 1 / 12;
        this.schedule(this.update.bind(this), updateInterval);
        return true;
    },
    update(dt) {
        let currTime = Date.now() / 1000;
        let jpReceiveInterval = currTime - this.jpLastReceiveTime;
        jpReceiveInterval = Math.min(jpReceiveInterval, this.JPInterval);
    
        if (this.jackpotTargetList !== null) {
            if (this.jackpotCurrentList === null) {
                this.jackpotCurrentList = [];
                for (let i = 0; i < this.JPNum; i++) {
                    this.jackpotCurrentList[i] = this.jackpotTargetList[i];
                }
            } else {
                for (let i = 0; i < this.JPNum; i++) {
                    if (this.isMimicking && this.mimicJpIndexes[i]) {
                        this.mimicJpRealValues[i] = this.jackpotTargetList[i];
                        let duration = (currTime - this.mimicStartTime);
                        this.jackpotCurrentList[i] = (duration >= this.mimicDuration) ? this.mimicJpValues[i] : Math.min(this.mimicJpValues[i], this.mimicJpStartValues[i] + Math.ceil((this.mimicJpValues[i]-this.mimicJpStartValues[i]) * duration/this.mimicDuration));
                    } else if (this.jackpotTargetList[i] <= this.jackpotCurrentList[i] || this.jackpotLastTargetList[i] === null) {
                        this.jackpotCurrentList[i] = this.jackpotTargetList[i];
                    } else {
                        this.jackpotCurrentList[i] = this.jackpotLastTargetList[i] + Math.ceil((this.jackpotTargetList[i]-this.jackpotLastTargetList[i]) * jpReceiveInterval/this.JPInterval);
                    }
                }
            }
            this.updateJackpotDisplay();
        }
    },
    
    updateTargetJackpot(jackpotList) {
        if (jackpotList === null) return;
    
        if (this.jackpotTargetList === null) {
            this.jackpotTargetList = [];
        }
    
        if (this.jackpotLastTargetList === null) {
            this.jackpotLastTargetList = [];
        } else {
            for (let i = 0; i < this.JPNum; i++) {
                this.jackpotLastTargetList[i] = this.jackpotTargetList[i];
            }
        }
    
        for (let i = 0; i < this.JPNum; i++) {
            this.jackpotTargetList[i] = parseInt(jackpotList[i]);
        }
    
        this.jpLastReceiveTime = Date.now() / 1000;
    },

    updateJackpotDisplay() {
        for (let i = 0; i < this.JPNum; i++) {
            if (this.jackpotLastList[i] !== this.jackpotCurrentList[i]) {
                this.jackpotLastList[i] = this.jackpotCurrentList[i];
                this.jackpotNumList[i].setString(bole.num_2_str(this.jackpotCurrentList[i]));
                if (i >= 1 && i <= 3) {
                    this.jackpotNumDark[i].setString(bole.num_2_str(this.jackpotCurrentList[i]));
                }
            }
            if (!this.jackpotNumList[i].isVisible()) {
                this.jackpotNumList[i].setVisible(true);
            }
        }
    },
    
    startMimic(index, num) {
        this.isMimicking = true;
        this.mimicJpIndexes[index] = true;
        this.mimicJpValues[index] = num;
    },
    
    setMimicDuration(duration) {
        this.mimicDuration = duration;
        this.mimicStartTime = Date.now() / 1000;
    
        for (let i = 0; i < this.JPNum; i++) {
            if (this.jackpotCurrentList) {
                this.mimicJpStartValues[i] = this.jackpotCurrentList[i];
            }
        }
    },
    stopMimic() {
        if (!this.isMimicking) return;
        this.isMimicking = false;
    
        for (let i = 0; i < this.JPNum; i++) {
            if (this.mimicJpIndexes[i] === true) {
                this.jackpotTargetList[i] = this.mimicJpRealValues[i];
            }
        }
    
        this.resetForMimic();
    },
    
    resetForMimic() {
        for (let i = 0; i < this.JPNum; i++) {
            this.mimicJpIndexes[i] = false;
            this.mimicJpValues[i] = -1;
            this.mimicJpRealValues[i] = -1;
            this.mimicJpStartValues[i] = 0;
            this.mimicStartTime = null;
            this.mimicDuration = 0;
        }
    },
    
    showLock1(flag) {
        //array index fixed
        if (!this.lockTemp1) {
            if (!flag) {
                ThemeHotChili.gameLayer.judgeJpLockInterval();
            }
            this.lockTemp1 = true;
            this.jpClickBtn[0].setVisible(true);
            if (!this.lock1) {
                this.lock1 = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_jpsuo", ThemeHotChili.SpinePath + "ng/NG_jpsuo.atlas");
                //this.lock1.setPosition(this.jpBoardPosXList[1], this.jpBoardPosYList[1]);
                this.jpNode[1].addChild(this.lock1, 10);
            }
            this.lock1.setAnimation(0, "da_shangsuo", false);
    
            //this.stopAllActions();
            this.lockNodeTemp[0].runAction(cc.Sequence.create(
                cc.DelayTime.create(0.5),
                cc.CallFunc.create(() => {
                    this.jpNameDark[1].setVisible(true);
                    this.jackpotNumDark[1].setVisible(true);
                })
            ));
            this.unLockNode[0].stopAllActions();
            this.unLockNode[0].setVisible(false);
            this.lockNode[0].setScale(0);
            this.lockNode[0].setVisible(true);
            this.lockNode[0].runAction(cc.Sequence.create(
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 1),
                cc.DelayTime.create(2),
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 0),
                cc.CallFunc.create(() => {
                    this.lockNode[1].setVisible(false);
                })
            ));
        }
    },
    showLock2(flag) {
        //array index fixed
        if (!this.lockTemp2) {
            if (!flag) {
                ThemeHotChili.gameLayer.judgeJpLockInterval();
            }
            this.lockTemp2 = true;
            this.jpClickBtn[1].setVisible(true);
            if (!this.lock2) {
                this.lock2 = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_jpsuo", ThemeHotChili.SpinePath + "ng/NG_jpsuo.atlas");
                //this.lock2.setPosition(this.jpBoardPosXList[2], this.jpBoardPosYList[2]);
                this.jpNode[2].addChild(this.lock2, 10);
            }
            this.lock2.setAnimation(0, "xiao_shangsuo", false);
    
            //this.stopAllActions();
            this.lockNodeTemp[1].runAction(cc.Sequence.create(
                cc.DelayTime.create(0.5),
                cc.CallFunc.create(() => {
                    this.jpNameDark[2].setVisible(true);
                    this.jackpotNumDark[2].setVisible(true);
                })
            ));
    
            this.unLockNode[0].stopAllActions();
            this.unLockNode[0].setVisible(false);
            this.lockNode[0].stopAllActions();
            this.lockNode[0].setVisible(false);
            this.unLockNode[1].stopAllActions();
            this.unLockNode[1].setVisible(false);
            this.lockNode[1].setScale(0);
            this.lockNode[1].setVisible(true);
            this.lockNode[1].runAction(cc.Sequence.create(
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 1),
                cc.DelayTime.create(2),
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 0),
                cc.CallFunc.create(() => {
                    this.lockNode[2].setVisible(false);
                })
            ));
        }
    },
    showLock3(flag) {
        //array index fixed
        if (!this.lockTemp3) {
            if (!flag) {
                ThemeHotChili.gameLayer.judgeJpLockInterval();
            }
            this.lockTemp3 = true;
            this.jpClickBtn[2].setVisible(true);
            if (!this.lock3) {
                this.lock3 = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_jpsuo", ThemeHotChili.SpinePath + "ng/NG_jpsuo.atlas");
                this.jpNode[3].addChild(this.lock3, 10);
            }
            this.lock3.setAnimation(0, "xiao_shangsuo", false);
    
            //this.stopAllActions();
            this.lockNodeTemp[2].runAction(cc.Sequence.create(
                cc.DelayTime.create(0.5),
                cc.CallFunc.create(() => {
                    this.jpNameDark[3].setVisible(true);
                    this.jackpotNumDark[3].setVisible(true);
                })
            ));
    
            this.unLockNode[0].stopAllActions();
            this.unLockNode[0].setVisible(false);
            this.lockNode[0].stopAllActions();
            this.lockNode[0].setVisible(false);
            this.unLockNode[1].stopAllActions();
            this.unLockNode[1].setVisible(false);
            this.lockNode[1].stopAllActions();
            this.lockNode[1].setVisible(false);
            this.unLockNode[2].stopAllActions();
            this.unLockNode[2].setVisible(false);
            this.lockNode[2].setScale(0);
            this.lockNode[2].setVisible(true);
            this.lockNode[2].runAction(cc.Sequence.create(
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 1),
                cc.DelayTime.create(2),
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 0),
                cc.CallFunc.create(() => {
                    this.lockNode[3].setVisible(false);
                })
            ));
        }
    },
    showUnlock1(flag) {
        //array index fixed
        if (this.lockTemp1) {
            if (!flag) {
                ThemeHotChili.gameLayer.judgeJpUnLockInterval();
            }
            this.lockTemp1 = false;
            this.jpClickBtn[0].setVisible(false);
            if (!this.lock1) {
                this.lock1 = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_jpsuo", ThemeHotChili.SpinePath + "ng/NG_jpsuo.atlas");
                //this.lock1.setPosition(this.jpBoardPosXList[1], this.jpBoardPosYList[1]);
                this.jpNode[0].addChild(this.lock1, 10);
            }
            this.lock1.setAnimation(0, "da_jiesuo", false);
    
            //this.stopAllActions()
            this.lockNodeTemp[0].stopAllActions();
            this.jpNameDark[0].setVisible(false);
            this.jackpotNumDark[0].setVisible(false);
    
            this.lockNode[2].stopAllActions();
            this.lockNode[2].setVisible(false);
            this.unLockNode[2].stopAllActions();
            this.unLockNode[2].setVisible(false);
            this.lockNode[1].stopAllActions();
            this.lockNode[1].setVisible(false);
            this.unLockNode[1].stopAllActions();
            this.unLockNode[1].setVisible(false);
            this.lockNode[0].stopAllActions();
            this.lockNode[0].setVisible(false);
            this.unLockNode[0].setScale(0);
            this.unLockNode[0].setVisible(true);
            this.unLockNode[0].runAction(cc.Sequence.create(
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 1),
                cc.DelayTime.create(2),
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 0),
                cc.CallFunc.create(() => {
                    this.unLockNode[1].setVisible(false);
                })
            ));
        }
    },
    showUnlock2(flag) {
        //array index fixed
        if (this.lockTemp2) {
            if (!flag) {
                ThemeHotChili.gameLayer.judgeJpUnLockInterval();
            }
            this.lockTemp2 = false;
            this.jpClickBtn[1].setVisible(false);
            if (!this.lock2) {
                this.lock2 = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_jpsuo", ThemeHotChili.SpinePath + "ng/NG_jpsuo.atlas");
                //this.lock2.setPosition(this.jpBoardPosXList[2], this.jpBoardPosYList[2]);
                this.jpNode[1].addChild(this.lock2, 10);
            }
            this.lock2.setAnimation(0, "xiao_jiezuo", false);
    
            //this.stopAllActions()
            this.lockNodeTemp[1].stopAllActions();
            this.jpNameDark[1].setVisible(false);
            this.jackpotNumDark[1].setVisible(false);
    
            this.lockNode[2].stopAllActions();
            this.lockNode[2].setVisible(false);
            this.unLockNode[2].stopAllActions();
            this.unLockNode[2].setVisible(false);
            this.lockNode[1].stopAllActions();
            this.lockNode[1].setVisible(false);
            this.unLockNode[1].setScale(0);
            this.unLockNode[1].setVisible(true);
            this.unLockNode[1].runAction(cc.Sequence.create(
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 1),
                cc.DelayTime.create(2),
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 0),
                cc.CallFunc.create(() => {
                    this.unLockNode[2].setVisible(false);
                })
            ));
        }
    },
    showUnlock3(flag) {
        //array index fixed
        if (this.lockTemp3) {
            if (!flag) {
                ThemeHotChili.gameLayer.judgeJpUnLockInterval();
            }
            this.lockTemp3 = false;
            this.jpClickBtn[2].setVisible(false);
            if (!this.lock3) {
                this.lock3 = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_jpsuo", ThemeHotChili.SpinePath + "ng/NG_jpsuo.atlas");
                //this.lock3.setPosition(this.jpBoardPosXList[3], this.jpBoardPosYList[3]);
                this.jpNode[3].addChild(this.lock3, 10);
            }
            this.lock3.setAnimation(0, "xiao_jiezuo", false);
    
            //this.stopAllActions()
            this.lockNodeTemp[2].stopAllActions();
            this.jpNameDark[2].setVisible(false);
            this.jackpotNumDark[2].setVisible(false);
    
            this.lockNode[2].stopAllActions();
            this.lockNode[2].setVisible(false);
            this.unLockNode[2].setScale(0);
            this.unLockNode[2].setVisible(true);
            this.unLockNode[2].runAction(cc.Sequence.create(
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 1),
                cc.DelayTime.create(2),
                cc.ScaleTo.create(0.33, 1.15),
                cc.ScaleTo.create(0.17, 0),
                cc.CallFunc.create(() => {
                    this.unLockNode[3].setVisible(false);
                })
            ));
        }
    },
    jpMove() {
        //array index fixed
        if (this.jpNameDark[1].isVisible()) {
            this.jpNode[3].setPosition(this.jpBoardPosXList[2], this.jpBoardPosYList[2]);
            this.jpNode[3].setScale(1);
            this.jpNode[1].setVisible(false);
        } else {
            this.jpNode[3].setPosition(this.jpBoardPosXList[2], this.jpBoardPosYList[2]);
            this.jpNode[3].setScale(0);
            this.jpNode[1].runAction(cc.RepeatForever.create(cc.Sequence.create(
                cc.DelayTime.create(3),
                cc.ScaleTo.create(0.5, 0),
                cc.DelayTime.create(3),
                cc.ScaleTo.create(0.5, 1)
            )));
            this.jpNode[3].runAction(cc.RepeatForever.create(cc.Sequence.create(
                cc.DelayTime.create(3),
                cc.ScaleTo.create(0.5, 1),
                cc.DelayTime.create(3),
                cc.ScaleTo.create(0.5, 0)
            )));
        }
        if (this.jpNameDark[2].isVisible()) {
            this.jpNode[4].setPosition(this.jpBoardPosXList[3], this.jpBoardPosYList[3]);
            this.jpNode[4].setScale(1);
            this.jpNode[2].setVisible(false);
        } else {
            this.jpNode[4].setPosition(this.jpBoardPosXList[3], this.jpBoardPosYList[3]);
            this.jpNode[4].setScale(0);
            this.jpNode[2].runAction(cc.RepeatForever.create(cc.Sequence.create(
                cc.DelayTime.create(3),
                cc.ScaleTo.create(0.5, 0),
                cc.DelayTime.create(3),
                cc.ScaleTo.create(0.5, 1)
            )));
            this.jpNode[4].runAction(cc.RepeatForever.create(cc.Sequence.create(
                cc.DelayTime.create(3),
                cc.ScaleTo.create(0.5, 1),
                cc.DelayTime.create(3),
                cc.ScaleTo.create(0.5, 0)
            )));
        }
    },
    jpBack() {
        this.jpNode[3].setPosition(this.jpBoardPosXList[4], this.jpBoardPosYList[4]);
        this.jpNode[4].setPosition(this.jpBoardPosXList[5], this.jpBoardPosYList[5]);
        this.jpNode[1].setVisible(true);
        this.jpNode[2].setVisible(true);
        this.jpNode[1].stopAllActions();
        this.jpNode[2].stopAllActions();
        this.jpNode[3].stopAllActions();
        this.jpNode[4].stopAllActions();
        this.jpNode[1].setScale(1);
        this.jpNode[2].setScale(1);
        this.jpNode[3].setScale(1);
        this.jpNode[4].setScale(1);
    },
    refreshLanguage() {
        if (this.select && !cc.sys.isNullOrUndefined(this.select)) {
            this.select.setTexture(bole.translateImage("select", ThemeHotChili.themeId));
        }
        for (let i = 1; i <= 5; i++) {
            if (this.jpName[i] && !cc.sys.isNullOrUndefined(this.jpName[i])) {
                this.jpName[i].setTexture(bole.translateImage("jpTitle" + (i + 1), ThemeHotChili.themeId))
            }
        }
        for (let i = 1; i <= 3; i++) {
            if (this.jpNameDark[i] && !cc.sys.isNullOrUndefined(this.jpNameDark[i])) {
                this.jpNameDark[i].setTexture(bole.translateImage("jpTitleDark" + (i + 1), ThemeHotChili.themeId));
            }
            if (this.lockNode[i] && !cc.sys.isNullOrUndefined(this.lockNode[i])) {
                this.lockNode[i].stopAllActions();
                this.lockNode[i].removeFromParent();
                this.lockNode[i] = null;
            }
            if (this.unLockNode[i] && !cc.sys.isNullOrUndefined(this.unLockNode[i])) {
                this.unLockNode[i].stopAllActions();
                this.unLockNode[i].removeFromParent();
                this.unLockNode[i] = null;
            }
            this.lockNode[i] = new cc.Node();
            this.lockNode[i].setPosition(this.lockNodePosX[i], this.lockNodePosY[i]);
            this.addChild(this.lockNode[i], 5);
            this.lockNode[i].setVisible(false);
    
            this.lockFrame[i] = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/lockFrame.png');
            this.lockNode[i].addChild(this.lockFrame[i]);
    
            let betUp_CN = new cc.Node();
            betUp_CN.setName("betUp_CN");
            betUp_CN.setPosition(-0.5, -10 + 3);
            this.lockNode[i].addChild(betUp_CN);
    
            let betUp_EN = new cc.Node();
            betUp_EN.setName("betUp_EN");
            betUp_EN.setPosition(-45, -10 + 3);
            this.lockNode[i].addChild(betUp_EN);
    
            this.betUp[i] = bole.translateNode("betUp", this.lockNode[i]);
            let tempNode1 = new cc._Sprite(bole.translateImage("betUp", ThemeHotChili.themeId));
            this.betUp[i].addChild(tempNode1);
    
            let betUpJp_CN = new cc.Node();
            betUpJp_CN.setName("betUpJp_CN");
            betUpJp_CN.setPosition(42, -10.5 + 3);
            this.lockNode[i].addChild(betUpJp_CN);
    
            let betUpJp_EN = new cc.Node();
            betUpJp_EN.setName("betUpJp_EN");
            betUpJp_EN.setPosition(85, -10.5 + 3);
            this.lockNode[i].addChild(betUpJp_EN);
    
            this.betUpJp[i] = bole.translateNode("betUpJp", this.lockNode[i]);
            let tempNode2 = new cc._Sprite(bole.translateImage("jpTitle" + (i + 1), ThemeHotChili.themeId));
            if (i === 1) {
                tempNode2.setScale(0.6);
            } else {
                tempNode2.setScale(0.8);
            }
            this.betUpJp[i].addChild(tempNode2);
    
            let betUpEnd_CN = new cc.Node();
            betUpEnd_CN.setName("betUpEnd_CN");
            betUpEnd_CN.setPosition(1000, 1000);
            this.lockNode[i].addChild(betUpEnd_CN);
    
            let betUpEnd_EN = new cc.Node();
            betUpEnd_EN.setName("betUpEnd_EN");
            betUpEnd_EN.setPosition(130, -9.5 + 3);
            this.lockNode[i].addChild(betUpEnd_EN);
    
            this.betUpEnd[i] = bole.translateNode("betUpEnd", this.lockNode[i]);
            let tempNode3 = new cc._Sprite(bole.translateImage("betUpEnd", ThemeHotChili.themeId));
            this.betUpEnd[i].addChild(tempNode3);
    
    
            this.unLockNode[i] = new cc.Node();
            this.unLockNode[i].setPosition(this.lockNodePosX[i], this.lockNodePosY[i]);
            this.addChild(this.unLockNode[i], 5);
            this.unLockNode[i].setVisible(false);
    
            this.unLockFrame[i] = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/lockFrame.png');
            this.unLockNode[i].addChild(this.unLockFrame[i]);
    
            let isUnLocked_CN = new cc.Node();
            isUnLocked_CN.setName("isUnLocked_CN");
            isUnLocked_CN.setPosition(38.5, -10 + 3);
            this.unLockNode[i].addChild(isUnLocked_CN);
    
            let isUnLocked_EN = new cc.Node();
            isUnLocked_EN.setName("isUnLocked_EN");
            isUnLocked_EN.setPosition(43.5, -10.5 + 3);
            this.unLockNode[i].addChild(isUnLocked_EN);
    
            this.isUnLocked[i] = bole.translateNode("isUnLocked", this.unLockNode[i]);
            let tempNode4 = new cc._Sprite(bole.translateImage("isUnLocked", ThemeHotChili.themeId));
            this.isUnLocked[i].addChild(tempNode4);
    
            let isUnLockedJp_CN = new cc.Node();
            isUnLockedJp_CN.setName("isUnLockedJp_CN");
            isUnLockedJp_CN.setPosition(-49, -10.5 + 3);
            this.unLockNode[i].addChild(isUnLockedJp_CN);
    
            let isUnLockedJp_EN = new cc.Node();
            isUnLockedJp_EN.setName("isUnLockedJp_EN");
            isUnLockedJp_EN.setPosition(-69, -11 + 3);
            this.unLockNode[i].addChild(isUnLockedJp_EN);
    
            this.isUnLockedJp[i] = bole.translateNode("isUnLockedJp", this.unLockNode[i]);
            let tempNode5 = new cc._Sprite(bole.translateImage("jpTitle" + (i + 1), ThemeHotChili.themeId));
            if (i === 1) {
                tempNode5.setScale(0.6);
            } else {
                tempNode5.setScale(0.8);
            }
            this.isUnLockedJp[i].addChild(tempNode5);
        }
    }
});
