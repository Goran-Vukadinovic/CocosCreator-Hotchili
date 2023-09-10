ThemeHotChiliSpinTable = cc.Layer.extend({
    name:"ThemeHotChiliSpinTable",
    ctor() {
        var size = arguments[0] ;
        var posXList = arguments[1];
        var posYList = arguments[2] ;
        var lineNum = arguments[3];
        
        this.cellList = null;
    
        this.durationState1Base_NG = 0.5;
        this.durationState1Base_BG = 1.5;
        this.durationDiv = 0.2;
        this.durationDivFG = 0.5;
        this.durationFast = 0.04;
    
        this.spinStartEffectEnded = true;
        this.spinStopEffectEnded = true;
        this.spinResult = null;
        this.upperSymbols = null;
        this.state = ThemeHotChili.SpinTableState.Idle;
    
        this.playNormalStopEffectInterval = 0.05;
        this.playNormalStopEffectLastTime = -1;
    
        this.hasScatter = null;
        this.hasScatterFromLeftNum = null;
        this.reelFastEffectLength = 2.1;
        this.stopIndex = null;
        this.shouldExpectingCellList = null;
        this.shouldExpecting = false;
    
        this.id = null;
    
        this.init(size, posXList, posYList, lineNum);
    
        return true;
    },

    init(size, posXList, posYList, lineNum) {
        const visibleOrigin = cc.director.getVisibleOrigin();
        const visibleSize = cc.director.getVisibleSize();
        this.centerX = visibleOrigin.x + visibleSize.width / 2;
        this.centerY = visibleOrigin.y + visibleSize.height / 2;
    
        this.posXList = posXList;
        this.posYList = posYList;
        this.lineNum = lineNum;
    
        const reelCenterYList = [281, 231, 181, 131];
        this.frameL = new cc._Sprite(ThemeHotChili.ImgPath + "ng/frameL.png");
        this.frameL.setPosition(this.centerX - 332, this.centerY - reelCenterYList[lineNum - 3]);
        this.addChild(this.frameL);
        this.frameL.setScale(lineNum / 3);
        this.frameR = new cc._Sprite(ThemeHotChili.ImgPath + "ng/frameR.png");
        this.frameR.setPosition(this.centerX + 331.5, this.centerY - reelCenterYList[lineNum - 3]);
        this.addChild(this.frameR);
        this.frameR.setScale(lineNum / 3);
        this.frameTop = new cc._Sprite(ThemeHotChili.ImgPath + "ng/frameTop.png");
        this.frameTop.setPosition(this.centerX + 0.5, this.centerY - 115 + 100 * (lineNum - 3));
        this.addChild(this.frameTop);
        this.frameDown = new cc._Sprite(ThemeHotChili.ImgPath + "ng/frameDown.png");
        this.frameDown.setPosition(this.centerX - 2, this.centerY - 452.5);
        this.addChild(this.frameDown);
    
        this.earL = new cc._Sprite(ThemeHotChili.ImgPath + "ng/earL.png");
        this.earL.setPosition(this.centerX - 342.5, this.centerY - reelCenterYList[lineNum - 3]);
        this.addChild(this.earL, 1);
        this.earR = new cc._Sprite(ThemeHotChili.ImgPath + "ng/earR.png");
        this.earR.setPosition(this.centerX + 342.5, this.centerY - reelCenterYList[lineNum - 3]);
        this.addChild(this.earR, 1);
        this.lineL = new cc._Sprite(ThemeHotChili.ImgPath + "ng/line_L" + lineNum + ".png");
        this.lineL.setPosition(this.centerX - 334, this.centerY - reelCenterYList[lineNum - 3]);
        this.addChild(this.lineL, 1);
        this.lineR = new cc._Sprite(ThemeHotChili.ImgPath + "ng/line_L" + lineNum + ".png");
        this.lineR.setPosition(this.centerX + 334, this.centerY - reelCenterYList[lineNum - 3]);
        this.addChild(this.lineR, 1);
    
        const distanceX = 128;
        const posX = [this.centerX - 64 - distanceX, this.centerX - 64, this.centerX + 64, this.centerX + 64 + distanceX];
        this.columnBar = [];
        for (let i = 0; i <= 3; ++i) {
            this.columnBar[i] = new cc._Sprite(ThemeHotChili.ImgPath + "ng/columnBar.png");
            this.addChild(this.columnBar[i], 1);
            this.columnBar[i].setPosition(posX[i], this.centerY - reelCenterYList[lineNum - 3]);
            this.columnBar[i].setScale(lineNum / 3);
        }
    
        this.stencil = new cc._Sprite(ThemeHotChili.ImgPath + "ng/reelback" + lineNum + ".png");
        const contentSize = this.stencil.getContentSize();
        this.stencil.setScale(contentSize.width * ThemeHotChili.ColumnNum * 1.2 / contentSize.width, 1);
        this.stencil.setPosition(this.centerX + 1, this.centerY - reelCenterYList[lineNum - 3]);
    
        //this.clippingNode = new cc._ClippingNode(this.stencil);
        this.clippingNode = new cc.Node();
        //this.clippingNode.setAlphaThreshold(0);
        //this.clippingNode._setCascadeOpacityEnabled(true);
        this.addChild(this.clippingNode, 1);
    
        this.cellList = [];
        const reelCenterY = (posYList[0] + posYList[posYList.length - 1]) / 2;
        for (let i = 0; i < posXList.length; ++i) {
            const windowSize = cc.size(size.width, size.height * lineNum);
            const posX = posXList[i] - windowSize.width / 2;
            const posY = reelCenterY - windowSize.height / 2;
            var cell = new ThemeHotChiliSpinReel(lineNum, size, ThemeHotChili.ReelList_NG[i]);
            cell.setPosition(posX, posY);
            cell.setDurationState1(this.durationState1Base_NG + (i) * this.durationDiv);
            this.clippingNode.addChild(cell);
            this.clippingNode.addChild(cell.higherClipNode1, 1);
            cell.higherClipNode1.setPosition(posX, posY);
            this.clippingNode.addChild(cell.higherClipNode2, 2);
            cell.higherClipNode2.setPosition(posX, posY);
            this.clippingNode.addChild(cell.higherClipNode3, 3);
            cell.higherClipNode3.setPosition(posX, posY);
            this.addChild(cell.unclipNode, 4);
            cell.unclipNode.setPosition(posX, posY);
            this.addChild(cell.unclipNode2, 5);
            cell.unclipNode2.setPosition(posX, posY);
            this.addChild(cell.unclipNode3, 6);
            cell.unclipNode3.setPosition(posX, posY);
            this.addChild(cell.unclipNode4, 7);
            cell.unclipNode4.setPosition(posX, posY);
            this.addChild(cell.unclipNode5, 8);
            cell.unclipNode5.setPosition(posX, posY);
            this.addChild(cell.unclipNode6, 9);
            cell.unclipNode6.setPosition(posX, posY);
            this.addChild(cell.unclipNode7, 10);
            cell.unclipNode7.setPosition(posX, posY);
            this.addChild(cell.unclipNode8, 11);
            cell.unclipNode8.setPosition(posX, posY);
            cell.setVisible(false);
            cell.reelIndex = i;
            cell.spinTable = this;
            this.cellList[i] = cell;
        }
    
        this.multiFlyNode = new cc.Node();
        this.addChild(this.multiFlyNode);
    
        this._setCascadeOpacityEnabled(true);
    
        return true;
    },
});
    
ThemeHotChiliSpinTable.prototype.checkCellsInit = function() {
    var lineNum = this.lineNum;
    if (lineNum === 3) {
        if (ThemeHotChili.QuickStartReelOrders) {
            for (var i = 0; i < ThemeHotChili.ColumnNum; i++) {
                var reelList = ThemeHotChili.QuickStartReelOrders[i];
                this.cellList[i].initReelPositions(reelList);
            }
            this.rearrangeTable();
            this.stateChangeTo(ThemeHotChili.SpinTableState.Idle);
        }
    } else {
        for (var i = 0; i < ThemeHotChili.ColumnNum; i++) {
            var reelList = ThemeHotChili.ReelList_FG_Init[lineNum - 3][i];
            this.cellList[i].initReelPositions(reelList);
        }
        this.rearrangeTable();
        this.stateChangeTo(ThemeHotChili.SpinTableState.Idle);
    }
};

ThemeHotChiliSpinTable.prototype.performMultiFly = function() {
    var spinLayer = ThemeHotChili.gameLayer.spinLayer;
    var spinResult = ThemeHotChili.gameLayer.spinLayer.spinResult;
    var item_list = spinResult.item_list_new && spinResult.item_list_new[1] && spinResult.item_list_new || spinResult.item_list;
    var skinList = ["lvlajiao", "zilajiao", "honglajiao", "huanglajiao"];
    AudioEngine.playEffect(ThemeHotChili.AudioPath + 'bgsc_collect.mp3', false);
    for (var i = 1; i <= item_list[3].length; i++) {
        if (item_list[3][i] >= 14 && item_list[3][i] <= 17) {
            var flyAni = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_box_shouji", ThemeHotChili.SpinePath + "ng/NG_box_shouji.atlas");
            flyAni.setSkin(skinList[item_list[3][i] - 13]);
            if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType()) {
                flyAni.setAnimation(0, "4_" + (4 - i), false);
            } else if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType()) {
                flyAni.setAnimation(0, (6 - Math.min(2, ThemeHotChili.gameLayer.fgType)) + "_" + (7 - ThemeHotChili.gameLayer.fgType - i), false);
            }
            flyAni.setPosition(this.centerX, this.centerY);
            this.addChild(flyAni, 20);
            flyAni.runAction(cc.Sequence.create(
                cc.DelayTime.create(1.67),
                cc.RemoveSelf.create()
            ));
        }
    }
    this.multiFlyNode.stopAllActions();
    spinLayer.collectPot.setAnimation(0, "idle" + spinResult.bow_state[1], true);
    if (spinResult.bow_state[1] === 5) {
        spinLayer.ng_Chili.setVisible(true);
        spinLayer.ng_Chili.setAnimation(0, "daiji", true);
    }
    this.multiFlyNode.runAction(cc.Sequence.create(
        cc.DelayTime.create(0.67),
        cc.CallFunc.create(function() {
            spinLayer.collectPot.setAnimation(0, "collect" + spinResult.bow_state[1], false);
        }),
        cc.DelayTime.create(1),
        cc.CallFunc.create(function() {
            if (spinResult.bow_state[2] > spinResult.bow_state[1]) {
                //AudioEngine.playEffect(ThemeHotChili.AudioPath + "change.mp3", false);
                spinLayer.collectPot.setAnimation(0, spinResult.bow_state[1] + 'To' + spinResult.bow_state[2], false);
                if (spinResult.bonus_game_trig && spinResult.bonus_game_trig === 1) {
                    spinLayer.collectPot.addAnimation(0, "waiting", true);
                    TimerCallFunc.addCallFunc(function() {
                        //AudioEngine.playEffect(ThemeHotChili.AudioPath + "bg_ready.mp3", false);
                    }, 2, this, this);
                } else {
                    spinLayer.collectPot.addAnimation(0, "idle" + spinResult.bow_state[2], true);
                }
                if (spinResult.bow_state[2] === 5) {
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + "chilliman_in.mp3", false);
                    spinLayer.ng_Chili.setAnimation(0, "jinru", false);
                    if (spinResult.bonus_game_trig && spinResult.bonus_game_trig === 1) {
                        spinLayer.ng_Chili.addAnimation(0, "qingzhu", true);
                    } else {
                        spinLayer.ng_Chili.addAnimation(0, "daiji", true);
                    }
                    spinLayer.ng_Chili.setVisible(true);
                }
            } else {
                if (spinResult.bonus_game_trig && spinResult.bonus_game_trig === 1) {
                    spinLayer.collectPot.addAnimation(0, "waiting", true);
                    spinLayer.ng_Chili.setAnimation(0, "qingzhu", true);
                } else {
                    spinLayer.collectPot.setAnimation(0, "idle" + spinResult.bow_state[1], true);
                }
            }
        })
    ));
};

ThemeHotChiliSpinTable.prototype.performChipWin = function(spinResult) {
    var multiNum = 0;
    var item_list = spinResult.item_list_new && spinResult.item_list_new[0] && spinResult.item_list_new || spinResult.item_list;
    var place;
    for (var i = 0; i < item_list[2].length; i++) {
        if (item_list[2][i] >= 14 && item_list[2][i] <= 17) {
            place = i;
            multiNum = item_list[2][i] - 12;
            break;
        }
    }

    if (multiNum > 0) {
        this.node.runAction(cc.sequence(
            cc.callFunc(function() {
                var a = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
                cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "win" + a + ".mp3", false);
                cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "bgsc_multi.mp3", false);
                this.cellList[2].multiBling(place, multiNum);
                var chipJpSprite = new cc.Node();
                var sp = chipJpSprite.addComponent(cc._Sprite);
                cc.loader.loadRes(ThemeHotChili.ImgPath + "ng/x" + multiNum + ".png", cc.SpriteFrame, function (err, spriteFrame) {
                    sp.spriteFrame = spriteFrame;
                });
                chipJpSprite.setPosition(this.posXList[2], this.posYList[place]);
                this.node.addChild(chipJpSprite, 20);
                chipJpSprite.runAction(cc.sequence(
                    cc.moveTo(0.5, cc.v2(this.centerX, (this.posYList[0] + this.posYList[this.posYList.length - 1]) / 2)),
                    cc.moveTo(0.5, cc.v2(this.posXList[2], this.posYList[place]))
                ));
                chipJpSprite.runAction(cc.sequence(
                    cc.scaleTo(0.5, 4),
                    cc.scaleTo(0.5, 1)
                ));
                chipJpSprite.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.removeSelf()
                ));
            }.bind(this)),
            cc.delayTime(1),
            cc.callFunc(function() {
                this.chipMulti(multiNum)
            }.bind(this)),
            cc.delayTime(1.3),
            cc.callFunc(function(){
                var a = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
                cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "win" + a + ".mp3", false);
            }.bind(this)),
            cc.delayTime(1),
            cc.callFunc(function() {
                this.chipWinAdd(spinResult, multiNum)
            }.bind(this))
        ));
    }
    else {
            var a = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
            cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "win" + a + ".mp3", false);
            this.scheduleOnce(function() {
                this.chipWinAdd(spinResult, 1);
            }.bind(this), 1);
    }
};

ThemeHotChiliSpinTable.prototype.chipMulti = function(multiNum) {
    cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "bgscmul_win.mp3", false);
    var spinResult = ThemeHotChili.gameLayer.spinLayer.spinResult;
    var item_list = spinResult.item_list_new && spinResult.item_list_new[0] && spinResult.item_list_new || spinResult.item_list;
    for (var i = 1; i <= spinResult.cash_col + 1; i++) {
        for (var j = 1; j <= item_list[i].length; j++) {
            if (item_list[i][j - 1] > 17) {
                var fire = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/BG_SC", ThemeHotChili.SpinePath + "ng/BG_SC.atlas");
                fire.setPosition(this.posXList[i - 1], this.posYList[j - 1]);
                this.addChild(fire, 15);
                fire.setScale(0.5);
                fire.setAnimation(0, "zhongjiang_huo", false);
                fire.runAction(cc.sequence(
                    cc.delayTime(1.3),
                    cc.removeSelf()
                ));
                this.cellList[i - 1].chipMulti(j - 1, multiNum);
            }
        }
    }
};

ThemeHotChiliSpinTable.prototype.chipWinAdd = function(spinResult, multiNum) {
    var time = 0;
    var allAddNum = 0;
    var item_list = spinResult.item_list_new && spinResult.item_list_new[0] && spinResult.item_list_new || spinResult.item_list;
    for (var i = 1; i <= spinResult.cash_col + 1; i++) {
        for (var j = 1; j <= item_list[i].length; j++) {
            if (item_list[i][j] > 17) {
                var addNum = ThemeHotChili.SymbolChipValueList[item_list[i][j] + 1] * ThemeHotChili.ctl.getCurTotalBet() * multiNum;
                allAddNum += addNum;

                this.runAction(cc.sequence(
                    cc.delayTime(time),
                    cc.callFunc(() => {
                        //this.cellList[i].chipWinAdd(j);
                        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "bgsc_win.mp3", false);
                        var fire = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/BG_SC", ThemeHotChili.SpinePath + "ng/BG_SC.atlas");
                        fire.setPosition(this.posXList[i], this.posYList[j]);
                        this.addChild(fire, 15);
                        fire.setScale(0.5);
                        fire.setAnimation(0, "zhongjiang_huo", false);
                        fire.runAction(cc.sequence(
                            cc.delayTime(1.3),
                            cc.removeSelf()
                        ));
                        var chipStrLabelNode = cc.Node.create();
                        chipStrLabelNode.setPosition(this.posXList[i], this.posYList[j]);
                        this.addChild(chipStrLabelNode, 16);
                        var num = ThemeHotChili.chipValueGenerator.stringify(ThemeHotChili.SymbolChipValueList[item_list[i][j] + 1] * ThemeHotChili.ctl.getCurTotalBet() * multiNum);
                        var chipStrLabel = new cc._LabelBMFont(ThemeHotChili.ImgPath + 'ng/chips_shuzi.fnt', num);
                        if (THEME_GAME_TYPE.FREE == ThemeHotChili.ctl.getGameType()) {
                            chipStrLabel.setPosition(0, 5);
                        } else {
                            chipStrLabel.setPosition(0, 5);
                        }
                        chipStrLabelNode.addChild(chipStrLabel);
                        bole.setLabelWidth(chipStrLabel, 110);
                        chipStrLabelNode.runAction(cc.sequence(
                            cc.delayTime(0.17),
                            cc.scaleTo(0.3, 1.2),
                            cc.scaleTo(0.2, 1),
                            cc.delayTime(0.4),
                            cc.removeSelf()
                        ));
                    }),
                    cc.delayTime(0.17),
                    cc.callFunc(() => {
                        var num = ThemeHotChili.SymbolChipValueList[item_list[i][j] + 1] * ThemeHotChili.ctl.getCurTotalBet() * multiNum;
                        ThemeHotChili.ctl.footer.updateTotalWin(num, 0.5);

                        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "frame_win.mp3", false);
                        var footerBling = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/BG_shouji", ThemeHotChili.SpinePath + "ng/BG_shouji.atlas");
                        footerBling.setPosition(this.centerX, 170);
                        if (bole.isIphoneX()) {
                            footerBling.setPosition(this.centerX, 180);
                        }
                        bole.scene.addToFooter(footerBling, 99);
                        footerBling.setAnimation(0, "shoujiglow", false);
                        footerBling.runAction(cc.sequence(
                            cc.delayTime(1.3),
                            cc.removeSelf()
                        ));
                    })
                ));
                time += 1;
            }
        }
    }

    var gameFeverNode = ThemeHotChili.gameLayer.gameFeverNode;
    var type = gameFeverNode.getGameFeverType();
    if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE &&
        ThemeHotChili.gameLayer.spinLayer.spinResult.respin_info_list &&
        ThemeHotChili.gameLayer.spinLayer.spinResult.respin_info_list[0] &&
        type > 0) {
        var allAddNum = 0; //assuming this variable is defined somewhere else
        var value = 0;
        if (type === 1 || type === 2) {
            value = allAddNum;
        } else if (type === 3) {
            value = 2 * allAddNum;
        }
        //tools:log("value",value,"type",type)
        this.runAction(cc.sequence(
            cc.delayTime(time + 0.5),
            cc.callFunc(function () {
                ThemeHotChili.ctl.footer.updateTotalWin(value, 1);
                cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "GameFeverX2.mp3", false);
            })
        ));
        time = time + 1;
    }

    this.runAction(cc.sequence(
        cc.delayTime(time + 0.5),
        cc.callFunc(function() {
            ThemeHotChili.gameLayer.spinLayer.effectLayer.ChipWinTemp = 1;
            ThemeHotChili.gameLayer.spinLayer.effectLayer.performChipWin();
        })
    ));
};

ThemeHotChiliSpinTable.prototype.performReSpin = function (spinResult) {
    this.reSpinChipTemp = true;
    var length = [];
    var waitTime = 0;
    for (var i = 0; i < spinResult.respin_info_list.length; i++) {
        length[i] = 0;
        for (var j = 2; j <= 4; j++) {
            if (spinResult.respin_info_list[i][j]) {
                length[i]++;
            }
        }
        var count = 0;

        this.runAction(cc.sequence(
            cc.delayTime(waitTime),
            cc.callFunc(function() {
                cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "respin.mp3", false);
                cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "respin2.mp3", false);
                for (var j = 2; j <= 4; j++) {
                    if (spinResult.respin_info_list[i][String(j)]) {
                        count++;
                        var reSpinAppear = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/FG_respin", ThemeHotChili.SpinePath + "fg/FG_respin.atlas");
                        reSpinAppear.setPosition(this.posXList[j + 1], (this.posYList[0] + this.posYList[this.posYList.length - 1]) / 2);
                        reSpinAppear.setAnimation(0, (6 - ThemeHotChili.gameLayer.fgType) + "X", false);
                        this.addChild(reSpinAppear, 20);
                        reSpinAppear.opacity = 0;
                        reSpinAppear.runAction(cc.sequence(
                            cc.fadeIn(0.2)
                        ));
                        this.cellList[j + 1].reSpinSymbolDown();
                        this.spin(spinResult.respin_info_list, i, j + 1, count);
        
                        TimerCallFunc.addCallFunc(function() {
                            if (reSpinAppear && !reSpinAppear.isValid) {
                                reSpinAppear.removeFromParent();
                            }
                        }, 2, this, this);
                    }
                }
            })
        ));
        waitTime += 1.8 + (this.reelFastEffectLength - 0.35) * length[i] + 2;
        
        var time = 0;
        for (var i = 0; i < spinResult.respin_info_list.length; i++) {
            time += 1.9 + (this.reelFastEffectLength - 0.35) * length[i] + 2;
        }
        this.runAction(cc.sequence(
            cc.delayTime(time),
            cc.callFunc(function() {
                this.reSpinChipTemp = null;
                ThemeHotChili.gameLayer.spinLayer.effectLayer.ReSpinTemp = 1;
                ThemeHotChili.gameLayer.spinLayer.effectLayer.performReSpin();
            }, this)
        ));
    }
};

ThemeHotChiliSpinTable.prototype.rearrangeTable = function() {
    if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType() ||
        THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType() ||
        THEME_GAME_TYPE.BONUS === ThemeHotChili.ctl.getGameType() ||
        THEME_GAME_TYPE.MAPFREE === ThemeHotChili.ctl.getGameType()) {

        for (let i = 0; i < this.cellList.length; i++) {
            this.cellList[i].setVisible(true);
        }
    }
};

ThemeHotChiliSpinTable.prototype.update = function(dt) {
    for (let i = 0; i < this.cellList.length; i++) {
        this.cellList[i].update(dt);
    }
};

// 所有update放在一个node里实现（甚至可以不放在node里）
ThemeHotChiliSpinTable.prototype.startUpdate = function() {
    let self = this;
    let _update = function(dt) {
        self.update(dt);
    };
    self.schedule(_update, 0);
};

ThemeHotChiliSpinTable.prototype.stopUpdate = function() {
    this.unscheduleUpdate();
};

// 一轮结束，重置一下显示（最后一个轮带转完）（SpinReel 调用）
ThemeHotChiliSpinTable.prototype.tableChangeToIdle = function() {
    this.reelEndIndex += 1;
    if (this.reelEndIndex < ThemeHotChili.ColumnNum) {
        return;
    }

    this.stopUpdate();
    ThemeHotChili.gameLayer.expectEnd(); // 听牌结束处理（如果有的话）
    ThemeHotChili.gameLayer.spinLayer.spinLayerChangeToShow();
    this.stateChangeTo(ThemeHotChili.SpinTableState.Idle);
};

// 开始转时的处理
ThemeHotChiliSpinTable.prototype.tableChangeToRoll = function() {
    ThemeHotChili.gameLayer.cancelEnableStop = null;
    ThemeHotChili.gameLayer.spinLayer.spinLayerChangeToRoll();
    this.stateChangeTo(ThemeHotChili.SpinTableState.Rolling);
};

ThemeHotChiliSpinTable.prototype.spin = function (reSpinList, reSpinRound, cellListI, count) {
    console.log("cjh-----spin self.state = ", this.state, ThemeHotChili.gameLayer.isFakeSpinning);

    if (this.state === ThemeHotChili.SpinTableState.Idle || ThemeHotChili.gameLayer.isFakeSpinning) {
        let duration = 0;
        this.shouldExpecting = false;
        this.stopIndex = 0;
        this.isForceStop = null;
        this.shouldExpectingCellList = [];
        this.reelEndIndex = 0;
        console.log("cjh-----spin type = ", ThemeHotChili.ctl.getGameType());

        if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType() || (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType() && !reSpinList)) {
            ThemeHotChili.gameLayer.isFakeSpinning = false;
        
            this.hasScatter = [];
            this.hasScatterFromLeftNum = [];
            this.hasChip = [];
            this.hasChipFromLeftNum = [];

            for (let i = 1; i <= ThemeHotChili.ColumnNum; i++) {
                this.hasScatter[i] = false;
                this.hasScatterFromLeftNum[i] = 0;
                this.shouldExpectingCellList[i] = false;
                this.hasChip[i] = false;
                this.hasChipFromLeftNum[i] = 0;
            }

            for (let i = 0; i < this.cellList.length; i++) {
                this.cellList[i].spinResult = this.spinResult[i];
                this.cellList[i].upperSymbol = this.upperSymbols[i];
                this.cellList[i].rollingEndResult = this.rollingEndResult[i];
                this.cellList[i].RollingWithResultIndex = this.rollingEndResult[i].length;
                this.cellList[i].shouldPlayScatterDown = false;
                this.cellList[i].shouldPlayChipDown = false;

                const scatterIndex = 11;
                for (let i = 0; i < this.cellList.length; i++) {
                    for (let j = 0; j < this.cellList[i].spinResult.length; j++) {
                        if (this.cellList[i].spinResult[j] === scatterIndex) {
                            this.hasScatter[i] = true;
                            if (i >= 0 && i <= 2) {
                                this.cellList[i].shouldPlayScatterDown = true;
                            } else if (i === 3 && this.hasScatterFromLeftNum[i] >= 1) {
                                this.cellList[i].shouldPlayScatterDown = true;
                            } else if (i === 4 && this.hasScatterFromLeftNum[i] >= 2) {
                                this.cellList[i].shouldPlayScatterDown = true;
                            }
                        }
                    }
                }

                for (let j = 0; j < this.cellList[i].spinResult.length; j++) {
                    if (this.cellList[i].spinResult[j] > 13) {
                        this.hasChip[i] = true;
                        if (i === 1) {
                            this.cellList[i].shouldPlayChipDown = true;
                        } else {
                            if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType()) {
                                if (this.hasChipFromLeftNum[i] >= i - 1) {
                                    this.cellList[i].shouldPlayChipDown = true;
                                }
                            } else if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType()) {
                                if (i === 2 && this.hasChipFromLeftNum[2] >= 1) {
                                    this.cellList[i].shouldPlayChipDown = true;
                                } else if (i === 3 && this.hasChipFromLeftNum[3] >= 2) {
                                    this.cellList[i].shouldPlayChipDown = true;
                                }
                            }
                        }
                    }
                }

                if (this.hasScatter[i] && i < ThemeHotChili.ColumnNum) {
                    this.hasScatterFromLeftNum[i + 1] = this.hasScatterFromLeftNum[i] + 1;
                } else {
                    this.hasScatterFromLeftNum[i + 1] = this.hasScatterFromLeftNum[i];
                }
                if (this.hasChip[i] && i < ThemeHotChili.ColumnNum) {
                    this.hasChipFromLeftNum[i + 1] = this.hasChipFromLeftNum[i] + 1;
                } else {
                    this.hasChipFromLeftNum[i + 1] = this.hasChipFromLeftNum[i];
                }
                
                let fast;
                if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType()) {
                    fast = ThemeHotChili.ctl.footer.getTurboStatus();
                }

                if (fast) {
                    if (i === 1) {
                        let duration = this.durationFast - this.cellList[i].fake_duration;
                        if (duration < 0) {
                            duration = 0;
                        }
                        this.cellList[i].setDurationState1(duration);
                    } else {
                        this.cellList[i].setDurationState1(this.cellList[i - 1].getDurationState1());
                    }
                } else {
                    if (i === 1) {
                        let duration = this.durationState1Base_NG - this.cellList[i].fake_duration;
                        if (duration < 0) {
                            duration = 0;
                        }
                        this.cellList[i].setDurationState1(duration);
                    } else {
                        if (i >= 3 && ((this.hasScatterFromLeftNum[i] >= 2 || (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType() && this.hasChipFromLeftNum[i] >= i - 1))
                            || (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType() && this.hasChipFromLeftNum[3] >= 2))) {
                            this.cellList[i].setDurationState1(this.cellList[i - 1].getDurationState1() + this.reelFastEffectLength);
                            this.shouldExpectingCellList[i] = true;
                            this.shouldExpecting = true;
                        } else {
                            this.cellList[i].setDurationState1(this.cellList[i - 1].getDurationState1() + this.durationDiv); //todo 控制听牌
                        }
                    }
                }
                this.cellList[i].spin();
            }
        } else if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType() && reSpinList) {
            TimerCallFunc.addCallFunc(function() {
              this.cellList[cellListI].performExpecting(1);
            }.bind(this), 1.6, this);

            TimerCallFunc.addCallFunc(function() {
                const multiList = [
                    [18,19,20,21,22,23,24,25,26,27,28,29,30],
                    [20,21,22,24,26,27,28,29,30,32,33,34,35],
                    [21,24,27,29,31,32,33,34,35,36,37,38,39],
                    [24,29,31,32,33,34,35,37,38,39,40,41,42],
                    [34,35,37,38,40,41,42,43,44,45,46,47,48]
                ];

                if (reSpinList[reSpinRound][cellListI - 1].upper_reel) {
                    if (reSpinList[reSpinRound][cellListI - 1].upper_reel === 12) {
                        reSpinList[reSpinRound][cellListI - 1].upper_reel = Math.floor(Math.random() * 4 + 14);
                    } else if (reSpinList[reSpinRound][cellListI - 1].upper_reel === 13) {
                        reSpinList[reSpinRound][cellListI - 1].upper_reel = multiList[cellListI - 2][Math.floor(Math.random() * multiList[cellListI - 2].length)];
                    }
                }
    
                if (reSpinList[reSpinRound][cellListI - 1].down_reel && reSpinList[reSpinRound][cellListI - 1].down_reel.length > 0) {
                    for (let j = 0; j < reSpinList[reSpinRound][cellListI - 1].down_reel.length; j++) {
                        if (reSpinList[reSpinRound][cellListI - 1].down_reel[j] === 12) {
                        reSpinList[reSpinRound][cellListI - 1].down_reel[j] = Math.floor(Math.random() * 4 + 14);
                        } else if (reSpinList[reSpinRound][cellListI - 1].down_reel[j] === 13) {
                        reSpinList[reSpinRound][cellListI - 1].down_reel[j] = multiList[cellListI - 2][Math.floor(Math.random() * multiList[cellListI - 2].length)];
                        }
                    }
                }
    
                this.cellList[cellListI].spinResult = reSpinList[reSpinRound][cellListI - 1].item_list;
                this.cellList[cellListI].upperSymbol = reSpinList[reSpinRound][cellListI - 1].upper_reel;
                this.cellList[cellListI].rollingEndResult = reSpinList[reSpinRound][cellListI - 1].down_reel;
                this.cellList[cellListI].RollingWithResultIndex = reSpinList[reSpinRound][cellListI - 1].down_reel.length;
                this.cellList[cellListI].shouldPlayScatterDown = false;
    
                var duration = (this.reelFastEffectLength - 0.35) * count;
                this.cellList[cellListI].setDurationState1(duration);
                this.cellList[cellListI].reSpin();
                this.cellList[cellListI].startUpdate();
    
                var delay = (this.reelFastEffectLength - 0.35) * (count - 1) + 0.1;
                    setTimeout(() => {
                    this.id[cellListI] = AudioEngine.playEffect(ThemeHotChili.AudioPath + 'reelfast.mp3', false);
                }, delay * 1000);
            }, 1.8, this, this);
        }

        const enableTime = duration + 0.5;
        this.spinStartEffectEnded = false;
        TimerCallFunc.addCallFunc(this.endSpinStartEffect.bind(this), enableTime, this, this);
    }
}

ThemeHotChiliSpinTable.prototype.stop = function() {
    if (this.state === ThemeHotChili.SpinTableState.Rolling) {
        TimerCallFunc.clearGroup(this);

        this.isForceStop = true;

        if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType() ||
            THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType() ||
            THEME_GAME_TYPE.MAPFREE === ThemeHotChili.ctl.getGameType()) {
            for (var i = 0; i < this.cellList.length; i++) {
                this.cellList[i].stop();
            }
        }
        this.spinStartEffectEnded = true;
        this.spinStopEffectEnded = false;
        TimerCallFunc.addCallFunc(this.endSpinStopEffect.bind(this), 0.25);
    }
};

ThemeHotChiliSpinTable.prototype.endSpinStartEffect = function() {
    this.spinStartEffectEnded = true;
}

ThemeHotChiliSpinTable.prototype.endSpinStopEffect = function() {
    this.spinStopEffectEnded = true;
};

ThemeHotChiliSpinTable.prototype.isRollingEffectFinished = function() {
    return this.spinStartEffectEnded && this.spinStopEffectEnded;
};

ThemeHotChiliSpinTable.prototype.resetReelList = function(gameType) {
    if (THEME_GAME_TYPE.MAIN === gameType) {
        for (var i = 0; i < this.cellList.length; i++) {
            this.cellList[i].resetReelOrder(ThemeHotChili.ReelList_NG[i]);
        }
    } else if (THEME_GAME_TYPE.FREE === gameType) {
        for (var i = 0; i < this.cellList.length; i++) {
            this.cellList[i].resetReelOrder(
                ThemeHotChili.ReelList_FG[4 - ThemeHotChili.gameLayer.fgType][i]
            );
        }
    }
};

ThemeHotChiliSpinTable.prototype.allSymbolDown = function() {
    for (var i = 0; i < this.cellList.length; i++) {
        this.cellList[i].symbolDown();
    }
};

ThemeHotChiliSpinTable.prototype.saveTable = function() {
    for (var i = 0; i < this.cellList.length; i++) {
        this.cellList[i].saveTable();
    }
};

ThemeHotChiliSpinTable.prototype.restoreTable = function() {
    for (var i = 0; i < ThemeHotChili.ColumnNum; i++) {
        this.cellList[i].restoreTable();
    }
};

ThemeHotChiliSpinTable.prototype.playNormalStopEffect = function() {
    this.stopIndex++;
    if (this.isForceStop || (ThemeHotChili.ctl.footer.getTurboStatus() && THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType())) {
        if (this.stopIndex === 5) {
            cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'reelstop.mp3', false);
        }
    } else {
        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'reelstop.mp3', false);
    }
    var index = this.stopIndex;
    index = Math.min(index, 5);
    // 听牌音效,动效
    if (this.shouldExpectingCellList[index + 1] && index >= 2) {
        if (!this.scIdle2) {
            this.scIdle2 = true;
            for (var i = 0; i < index; i++) {
                this.cellList[i].performScIdle2();
            }
        }
        this.shouldExpectingCellList[index + 1] = false;
        ThemeHotChili.gameLayer.expectStart();
        var id = cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'reelfast.mp3', false);
        this.cellList[index].performExpecting();
        this.runAction(cc.sequence(cc.delayTime(this.reelFastEffectLength), cc.callFunc(function() {
            this.cellList[index].stopExpecting();
            cc.audioEngine.stopEffect(id);
        }, this)));
    }
};

ThemeHotChiliSpinTable.prototype.stopAllExpect = function() {
    for (var k in this.cellList) {
        this.shouldExpectingCellList[k] = false;
    }
};

ThemeHotChiliSpinTable.prototype.stateChangeTo = function(s) {
    this.state = s;
    cc.log('cjh-----ThemeHotChiliSpinTable state = ' + s);
};

ThemeHotChiliSpinTable.prototype.fakeSpin = function() {
    this.startUpdate();  //开始起转
    this.scIdle2 = false;
    var fast = ThemeHotChili.ctl.footer.getTurboStatus();
    for (var i = 0; i < ThemeHotChili.ColumnNum; i++) {
        this.cellList[i].elementZOrder = 1e7;
        if (fast && ThemeHotChili.ctl.getGameType() == THEME_GAME_TYPE.MAIN) {
            this.cellList[i].setDurationState1(this.durationFast);
        } else {
            if (i == 0) {
                this.cellList[i].setDurationState1(this.durationState1Base_NG);
            } else {
                this.cellList[i].setDurationState1(this.cellList[i-1].getDurationState1() + this.durationDiv);
            }
        }
        this.cellList[i].spin();
    }
    ThemeHotChili.gameLayer.isFakeSpinning = true;
    this.tableChangeToRoll();
};