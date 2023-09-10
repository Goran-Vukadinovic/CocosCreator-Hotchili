require("./ThemeHotChiliSpinElement");

ThemeHotChiliSpinReel = cc.Class({
    extends:cc.Layer, 
    name:"ThemeHotChiliSpinReel",
    ctor() {
        var visibleCellNum =  arguments[0];
        var cellSize = arguments[1];
        var reel = arguments[2];

        this.visibleCellNum = -1;
        this.realCellNum = -1;
        this.realCellStablePosYList = null;
        this.cellSize = null;
        this.windowSize = null;
    
        this.cells = null;
        this.clippingNode = null;
        this.unclipNode = null;
        this.unclipNode2 = null;
    
        this.toStart = false;
        this.toStop = false;
    
        this.duration = 0.0;
        this.durationState1 = -1;
        this.distanceState2 = 30;
        this.distanceState3 = 0;
    
        this.speedState1 = 2200;
        this.speedState2 = 4000;
        this.speedState3 = 300;
        this.speedState4 = 240;
    
        this.topSpriteIndex = 0;
        this.topReelOrderIndex = 0;
        this.countDown = 0;
        this.RollingWithResultIndex = -1;
        this.reelOrder = null;
    
        this.spinResult = null;
        this.upperSymbol = null;
        this.spinTable = null;
    
        this.state = ThemeHotChili.SpinReelState.Uninitialized;
    
        this.expectAnimation = null;
    
        this.fake_duration = 0;
    
        this.elementZOrder = 1e7;
    
        this.init(visibleCellNum, cellSize, reel);
    },
});

ThemeHotChiliSpinReel.prototype.init = function (visibleCellNum, cellSize, reel) {
    this.visibleCellNum = visibleCellNum;
    this.realCellNum = this.visibleCellNum + 2;
    this.cellSize = cellSize;
    this.cellHeight = cellSize.height;
    this.windowSize = cc.size(cellSize.width, cellSize.height * visibleCellNum);
    this.reelOrder = reel;
    this.cells = [];
    this.setContentSize(this.windowSize);
    this.reelBackSprite = cc._Sprite.create(ThemeHotChili.ImgPath + "ng/reelback" + visibleCellNum + ".png");
    this.reelBackSprite.setPosition(this.windowSize.width / 2, this.windowSize.height / 2);
    this.addChild(this.reelBackSprite);
    
    this.clippingNode = cc.Node.create();
    this.addChild(this.clippingNode);
    this.higherClipNode1 = cc.Node.create();
    this.higherClipNode2 = cc.Node.create();
    this.higherClipNode3 = cc.Node.create();

    this.unclipNode = cc.Node.create();
    this.unclipNode2 = cc.Node.create();
    this.unclipNode3 = cc.Node.create();
    this.unclipNode4 = cc.Node.create();
    this.unclipNode5 = cc.Node.create();
    this.unclipNode6 = cc.Node.create();
    this.unclipNode7 = cc.Node.create();
    this.unclipNode8 = cc.Node.create();

    const centerIndex = (this.realCellNum - 1) / 2;
    this.realCellStablePosYList = [];

    for (let i = 0; i < this.realCellNum; i++) {
        this.cells[i] = new ThemeHotChiliSpinElement();
        this.cells[i].setFathers(
            this.clippingNode,
            this.unclipNode,
            this.unclipNode2,
            this.unclipNode3,
            this.unclipNode4,
            this.unclipNode5,
            this.unclipNode6,
            this.unclipNode7,
            this.unclipNode8,
            this.higherClipNode1,
            this.higherClipNode2,
            this.higherClipNode3
        );
        
        this.clippingNode.addChild(this.cells[i]);
        
        this.realCellStablePosYList[i] = this.windowSize.height / 2 + (centerIndex - (i)) * this.cellSize.height;
        this.cells[i].setPosition(this.windowSize.width / 2, this.realCellStablePosYList[i]);
        this.cells[i].spinReel = this;
    }

    this.speedPosNode = cc.Node.create();
    this.addChild(this.speedPosNode);

    this._setCascadeOpacityEnabled(true);
    return true;
};
  
ThemeHotChiliSpinReel.prototype.initReelPositions = function(reelOrder) {
    for (let i = 0; i < this.reelOrder.length; i++) {
        if (this.reelOrder[i] == reelOrder[0]) {
            this.topReelOrderIndex = i;
            break;
        }
    }
  
    this.topReelOrderIndex = (this.topReelOrderIndex) % this.reelOrder.length;
  
    for (let i = 0; i < this.realCellNum; i++) {
        let symbolIndex;
    
        if (i == 0) {
            symbolIndex = this.reelOrder[this.topReelOrderIndex];
        } else if (i == this.realCellNum - 1) {
            symbolIndex = this.reelOrder[(this.topReelOrderIndex + i) % this.reelOrder.length];
        } else {
            symbolIndex = reelOrder[i];
        }
    
        this.cells[i].setSymbolIndex(symbolIndex, 1);
    }
  
    this.topSpriteIndex = 1;
    this.stateChangeTo(ThemeHotChili.SpinReelState.Idle);
};

ThemeHotChiliSpinReel.prototype.startUpdate = function() {
    this.isStart = true;
  
    const updateFn = (dt) => {
      this.update(dt);
    };
  
    cc.director.getScheduler().scheduleUpdate(updateFn, this);
};

ThemeHotChiliSpinReel.prototype.stopUpdate = function() {
    cc.director.getScheduler().unscheduleUpdate(this);
};

ThemeHotChiliSpinReel.prototype.update = function (dt) {
    //cc.log('cjh-----spin update', this.toStart, this.state);
    if (!this.toStart && this.state === ThemeHotChili.SpinReelState.Idle) {
        return;
    }

    let speed = this.speedPosNode.y;

    if (this.toStart && this.state === ThemeHotChili.SpinReelState.Idle) {
        this.toStart = false;
        this.stopped = false;
        this.stateChangeTo(ThemeHotChili.SpinReelState.Rolling);
        this.symbolDown();

        this.duration = 0;
        this.fake_duration = 0;
        let symbolIndex = this.reelOrder[this.topReelOrderIndex];

        this.cells[this.topSpriteIndex].setSymbolIndex(symbolIndex, 1, this.spinTable.reSpinChipTemp);

        return;
    }

    if (this.toStop && (this.state === ThemeHotChili.SpinReelState.Rolling || this.state === ThemeHotChili.SpinReelState.RollingWithResult || (this.state === ThemeHotChili.SpinReelState.AboutToStop && this.countDown > 0 && !ThemeHotChili.gameLayer.extendSpin))) {
        this.toStop = false;
        this.setAboutToStop(true);
    
        for (let i = 0; i < this.realCellNum; i++) {
            let processingIndex = (this.topSpriteIndex + i - 1) % this.realCellNum;
            this.cells[processingIndex].y = this.realCellStablePosYList[i];
    
            let symbolIndex;
            if (i === 0) {
                for (let j = 0; j < this.reelOrder.length; j++) {
                    if (this.reelOrder[j] === this.upperSymbol) {
                        this.topReelOrderIndex = j;
                        break;
                    }
                }
                symbolIndex = this.reelOrder[this.topReelOrderIndex];
            } else if (i === this.realCellNum - 1) {
                symbolIndex = this.reelOrder[(this.topReelOrderIndex + i - 1 - 1) % this.reelOrder.length + 1];
            } else {
                symbolIndex = this.spinResult[i - 1];
            }
            this.cells[processingIndex].setSymbolIndex(symbolIndex, 1);
        }
        this.stateChangeTo(ThemeHotChili.SpinReelState.AboutToStop);
        this.countDown = 0;
    }
    
    if (this.state === ThemeHotChili.SpinReelState.Rolling || this.state === ThemeHotChili.SpinReelState.AboutToStop || this.state === ThemeHotChili.SpinReelState.BounceBack || this.state === ThemeHotChili.SpinReelState.RollingWithResult) {
        let velocityRatio = 1.0;
        if (this.state === ThemeHotChili.SpinReelState.AboutToStop && this.countDown === 0) {
            let distance = this.realCellStablePosYList[0] - this.distanceState2 - this.cells[this.topSpriteIndex].y;
            velocityRatio = Math.max(0.4, Math.min(1.0, 0.3 - distance / (this.cellHeight + this.distanceState2)));
        }
        let deltaDistance = dt * speed * velocityRatio;
        for (let i = 0; i < this.realCellNum; i++) {
            this.cells[i].y -= deltaDistance;
        }
    
        if (ThemeHotChili.SpinReelState.Rolling === this.state) {
            if (!ThemeHotChili.gameLayer.isFakeSpinning && !ThemeHotChili.gameLayer.extendSpin) {
                this.duration += dt;
            } else {
                this.fake_duration += dt;
            }
        } else {
            this.duration += dt;
        }
    }

    let processingIndex = this.topSpriteIndex;

    while (this.state === ThemeHotChili.SpinReelState.Rolling || (this.state === ThemeHotChili.SpinReelState.AboutToStop && this.countDown > 0)) {
        processingIndex = ((processingIndex - 1) % this.realCellNum);
        let posY = this.cells[processingIndex].y;
        if (posY < this.realCellStablePosYList[this.realCellNum - 1]) {
            posY += this.cellHeight * this.realCellNum;
            this.cells[processingIndex].y = posY;
            this.topSpriteIndex = processingIndex;

            let symbolIndex;
            if (this.state === ThemeHotChili.SpinReelState.AboutToStop) {
                this.countDown--;
                if (this.countDown === 0) {
                    symbolIndex = this.upperSymbol;
                    for (let i = 0; i < this.reelOrder.length; i++) {
                        if (this.reelOrder[i] === symbolIndex) {
                            this.topReelOrderIndex = i;
                            break;
                        }
                    }
                } else {
                    symbolIndex = this.spinResult[this.countDown];
                }
                this.cells[processingIndex].setSymbolIndex(symbolIndex, 1);
            } else {
                this.topReelOrderIndex = ((this.topReelOrderIndex - 1) % this.reelOrder.length);
                symbolIndex = this.reelOrder[this.topReelOrderIndex - 1];
                this.cells[processingIndex].setSymbolIndex(symbolIndex);
            }
        } else {
            break;
        }
    }

    while (this.state === ThemeHotChili.SpinReelState.RollingWithResult && this.RollingWithResultIndex > 0) {
        processingIndex = ((processingIndex - 1) % this.realCellNum);
        let posY = this.cells[processingIndex].y;
        if (posY < this.realCellStablePosYList[this.realCellNum - 1]) {
            posY += this.cellHeight * this.realCellNum;
            this.cells[processingIndex].y = posY;
            this.topSpriteIndex = processingIndex;
    
            const symbolIndex = this.rollingEndResult[this.RollingWithResultIndex];
            this.cells[processingIndex].setSymbolIndex(symbolIndex);
            this.RollingWithResultIndex--;
        } else {
            break;
        }
    }
    
    if (this.state === ThemeHotChili.SpinReelState.Rolling) {
        if (this.RollingWithResultIndex > 0 && this.duration > this.durationState1 && this.cells[this.topSpriteIndex].y > this.realCellStablePosYList[0] && !ThemeHotChili.gameLayer.extendSpin) {
            this.stateChangeTo(ThemeHotChili.SpinReelState.RollingWithResult);
        }
    } else if (this.state === ThemeHotChili.SpinReelState.RollingWithResult) {
        if (this.RollingWithResultIndex <= 0) {
            this.countDown = this.realCellNum - 1;
            this.stateChangeTo(ThemeHotChili.SpinReelState.AboutToStop);
        }
    } else if (this.state === ThemeHotChili.SpinReelState.AboutToStop && this.countDown <= 0) {
        let addDistance = this.realCellStablePosYList[0] - this.distanceState2 - this.cells[this.topSpriteIndex].y;
        if (addDistance > 0) {
            for (let i = 0; i < this.realCellNum; i++) {
                this.cells[i].y += addDistance;
            }
            this.stateChangeTo(ThemeHotChili.SpinReelState.BounceBack);
            for (let i = 0; i < this.spinResult.length; i++) {
                if (this.spinResult[i] === 1) {
                    this.symbolUp(i, this.unclipNode, 1e4);
                }
            }
            for (let i = 0; i < this.spinResult.length; i++) {
                if (this.spinResult[i] > 13) {
                    if (this.shouldPlayChipDown || this.spinTable.reSpinChipTemp) {
                        this.performChipDown(i);
                        ThemeHotChili.gameLayer.judgeBgScInterval();
                    } else {
                        this.performChipDownNoWin(i);
                    }
                }
            }
            const scatterIndex = 11;
            let firstPlayScatterEffect = true;
            if (this.shouldPlayScatterDown) {
                for (let i = 0; i < this.spinResult.length; i++) {
                    if (this.spinResult[i] === scatterIndex) {
                        this.performScatterDown(i);
                        if (firstPlayScatterEffect) {
                            firstPlayScatterEffect = false;
                            ThemeHotChili.gameLayer.judgeScInterval(this.reelIndex);
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.spinResult.length; i++) {
                    if (this.spinResult[i] === scatterIndex) {
                        this.symbolUp(i, this.unclipNode3);
                    }
                }
            }
            this.playReelStopEffect();
            this.stopExpecting();
        }
    } else if (this.state === ThemeHotChili.SpinReelState.BounceBack) {
        const addDistance = this.realCellStablePosYList[0] + this.distanceState3 - this.cells[this.topSpriteIndex].getPositionY();
        if (addDistance < 0) {
            for (let i = 0; i < this.realCellNum; i++) {
                this.cells[i].setPositionY(this.cells[i].getPositionY() + addDistance);
            }
            this.stateChangeTo(ThemeHotChili.SpinReelState.Idle);
            ThemeHotChili.gameLayer.spinLayer.spinTable.tableChangeToIdle();
            this.stopped = true;
    
            if (this.isStart) {
                this.isStart = false;
                this.stopUpdate();
            }
        }
    }
}

ThemeHotChiliSpinReel.prototype.performScatterDown = function(place) {
    const index = (this.topSpriteIndex + place - 1) % this.realCellNum;
    this.cells[index].performScatterDownAnimation();
};

ThemeHotChiliSpinReel.prototype.performChipDown = function(place) {
    const index = (this.topSpriteIndex + place - 1) % this.realCellNum;
    this.cells[index].performChipDown();
};

ThemeHotChiliSpinReel.prototype.performChipDownNoWin = function(place) {
    const index = (this.topSpriteIndex + place - 1) % this.realCellNum;
    this.cells[index].performChipDownNoWin();
};

ThemeHotChiliSpinReel.prototype.multiBling = function(place, multiNum) {
    const index = (this.topSpriteIndex + place - 1) % this.realCellNum;
    this.cells[index].multiBling(multiNum);
};

ThemeHotChiliSpinReel.prototype.symbolUp = function(place, father, zOrder) {
    const index = (this.topSpriteIndex + place - 1) % this.realCellNum;
    this.cells[index].checkFather(father, zOrder);
};

ThemeHotChiliSpinReel.prototype.performExpecting = function(rsSpin) {
    if (!this.expectAnimation) {
        this.expectAnimation = new sp._SkeletonAnimation(
            ThemeHotChili.SpinePath + "ng/NG_tp",
            ThemeHotChili.SpinePath + "ng/NG_tp.atlas"
        );

        if (THEME_GAME_TYPE.MAIN === ThemeHotChili.ctl.getGameType()) {
            this.expectAnimation.setAnimation(0, "ng_tp", true);
        } else if (THEME_GAME_TYPE.FREE === ThemeHotChili.ctl.getGameType()) {
            if (ThemeHotChili.gameLayer.fgType === 3) {
                this.expectAnimation.setAnimation(0, "ng_tp", true);
            } else {
                this.expectAnimation.setAnimation(0, "fg_X" + (6 - ThemeHotChili.gameLayer.fgType), true);
            }
        }

        this.unclipNode8.addChild(this.expectAnimation, 1e7);
        this.expectAnimation.setPosition(cc.p(this.windowSize.width / 2, this.windowSize.height / 2));

        if (rsSpin) {
            this.expectAnimation.setOpacity(0);
            this.expectAnimation.runAction(cc.Sequence.create(
                cc.FadeIn.create(0.2)
            ));
        }

        this.speedPosNode.stopAllActions();
        this.speedPosNode.runAction(cc.EaseSineInOut.create(
            cc.MoveTo.create(0.10, cc.p(0, this.speedState2))
        ));
    }
};

ThemeHotChiliSpinReel.prototype.stopExpecting = function() {
    if (this.expectAnimation && !cc.sys.isObjectValid(this.expectAnimation)) {
        this.expectAnimation.removeFromParent();
        this.expectAnimation = null;
    }

    if (this.spinTable.id && this.spinTable.id[this.reelIndex]) {
        cc.audioEngine.stopEffect(this.spinTable.id[this.reelIndex]);
        this.spinTable.id[this.reelIndex] = null;
    }
};

ThemeHotChiliSpinReel.prototype.chipMulti = function(place, multiNum) {
    var index = ((this.topSpriteIndex + place - 1) % this.realCellNum) + 1;
    this.cells[index].chipMulti(multiNum);
};

ThemeHotChiliSpinReel.prototype.chipWinAdd = function(place) {
    var index = ((this.topSpriteIndex + place - 1) % this.realCellNum) + 1;
    this.cells[index].chipWinAdd();
};

ThemeHotChiliSpinReel.prototype.performScIdle2 = function() {
    for (var i = 0; i < this.spinResult.length; i++) {
        if (this.spinResult[i] === 11) {
            var index = ((this.topSpriteIndex + i - 1) % this.realCellNum) + 1;
            this.cells[index].performScIdle2();
        }
    }
};

ThemeHotChiliSpinReel.prototype.symbolDown = function() {
    for (var i = 0; i < this.cells.length; i++) {
        var index = ((this.topSpriteIndex + i - 1) % this.cells.length);
        this.cells[index].stopAllActions();
        if (this.spinTable.reSpinChipTemp) {
            this.cells[index].checkFather(this.clippingNode);
        } else {
            if (this.cells[index].symbolIndex === 11) {
                this.cells[index].checkFather(this.higherClipNode3, i + 1);
            } else if (this.cells[index].symbolIndex === 1) {
                this.cells[index].checkFather(this.higherClipNode1, i + 1);
            } else if (this.cells[index].symbolIndex === 12 || this.cells[index].symbolIndex === 13) {
                this.cells[index].checkFather(this.higherClipNode2, i + 1);
            } else {
                this.cells[index].checkFather(this.clippingNode);
            }
        }
    }
};

ThemeHotChiliSpinReel.prototype.reSpinSymbolDown = function() {
    for (var i = 0; i < this.cells.length; i++) {
        var index = ((this.topSpriteIndex + i - 1) % this.cells.length) + 1;
        this.cells[index].stopAllActions();
        if (this.cells[index].symbolIndex !== 11) {
            this.cells[index].checkFather(this.clippingNode);
        }
    }
};

ThemeHotChiliSpinReel.prototype.setDurationState1 = function(value) {
    this.durationState1 = value;
};

ThemeHotChiliSpinReel.prototype.getDurationState1 = function() {
    return this.durationState1;
};

ThemeHotChiliSpinReel.prototype.setDuration = function(value) {
    this.duration = value;
};

ThemeHotChiliSpinReel.prototype.getDuration = function() {
    return this.duration;
};

ThemeHotChiliSpinReel.prototype.isStarted = function() {
    return this.toStart || this.state !== ThemeHotChili.SpinReelState.Idle;
};

ThemeHotChiliSpinReel.prototype.isStopped = function() {
    return this.toStop || this.state === ThemeHotChili.SpinReelState.Idle;
};

ThemeHotChiliSpinReel.prototype.spin = function() {
    if (!this.isStarted()) {
        this.toStart = true;
        this.toStop = false;
        this.setAboutToStop(false);
    }
};

ThemeHotChiliSpinReel.prototype.reSpin = function() {
    this.toStart = true;
    this.toStop = false;
    this.setAboutToStop(false);
};

ThemeHotChiliSpinReel.prototype.stop = function() {
    if (!this.isStopped()) {
        this.toStop = true;
    }
};

ThemeHotChiliSpinReel.prototype.setAboutToStop = function(flag) {
    for (var i = 0; i < this.cells.length; i++) {
        this.cells[i].setAboutToStop(flag);
    }
};

ThemeHotChiliSpinReel.prototype.resetReelOrder = function(reel) {
    this.reelOrder = reel.slice();
};

ThemeHotChiliSpinReel.prototype.saveTable = function() {
    if (!ThemeHotChili.gameLayer.savedTable) {
        ThemeHotChili.gameLayer.savedTable = [];
    }
    if (!ThemeHotChili.gameLayer.savedTable[this.reelIndex]) {
        ThemeHotChili.gameLayer.savedTable[this.reelIndex] = [];
    }
    for (var i = 0; i < this.realCellNum; i++) {
        if (i === 0 || i === this.realCellNum - 1) {
            ThemeHotChili.gameLayer.savedTable[this.reelIndex][i] = (this.topReelOrderIndex + i - 1) % this.reelOrder.length + 1;
        } else {
            ThemeHotChili.gameLayer.savedTable[this.reelIndex][i] = this.spinResult ? this.spinResult[i-1] : ThemeHotChili.QuickStartReelOrders[this.reelIndex][i-1];
        }
    }
};

ThemeHotChiliSpinReel.prototype.restoreTable = function() {
    if (!ThemeHotChili.gameLayer.savedTable || !ThemeHotChili.gameLayer.savedTable[this.reelIndex]) {
        return;
    }
    this.setAboutToStop(true);

    this.topReelOrderIndex = ThemeHotChili.gameLayer.savedTable[this.reelIndex][0];
    for (var i = 0; i < this.realCellNum; i++) {
        var processingIndex = (this.topSpriteIndex + i) % this.realCellNum,
            symbolIndex;
        if (i === 0 || i === this.realCellNum - 1) {
            symbolIndex = this.reelOrder[ThemeHotChili.gameLayer.savedTable[this.reelIndex][i] - 1];
            console.log("restoreTable1", symbolIndex);
            this.cells[processingIndex].setSymbolIndex(symbolIndex, 1);
        } else {
            symbolIndex = ThemeHotChili.gameLayer.savedTable[this.reelIndex][i];
            console.log("restoreTablex2", symbolIndex);
            this.cells[processingIndex].setSymbolIndex(symbolIndex, 1);
            // if (symbolIndex === 11) {
            //     this.cells[processingIndex].checkFather(this.unclipNode3);
            // } else if (symbolIndex === 0) {
            //     this.cells[processingIndex].checkFather(this.higherClipNode1);
            // }
        }
    }
};

ThemeHotChiliSpinReel.prototype.getVisibleCellsIndexList = function() {
    var list = [];
    for (var i = 0; i < this.visibleCellNum; i++) {
        list.push(((this.topSpriteIndex - 1 + 1 + i) % this.realCellNum) + 1);
    }
    return list;
};

ThemeHotChiliSpinReel.prototype.playReelStopEffect = function() {
    this.spinTable.playNormalStopEffect();
};

ThemeHotChiliSpinReel.prototype.stateChangeTo = function(s) {
    this.state = s;

    if (this.state === ThemeHotChili.SpinReelState.Idle) {
        this.speedPosNode.stopAllActions();
        this.speedPosNode.setPosition(cc.p(0, 0));
    } else if (this.state === ThemeHotChili.SpinReelState.Rolling) {
        this.speedPosNode.stopAllActions();
        this.speedPosNode.setPosition(cc.p(0, 0));
        this.speedPosNode.runAction(cc.EaseSineInOut.create(cc.MoveTo.create(0.10, cc.p(0, this.speedState1))));
    } else if (this.state === ThemeHotChili.SpinReelState.BounceBack) {
        this.speedPosNode.stopAllActions();
        this.speedPosNode.setPosition(cc.p(0, 0));
        this.speedPosNode.runAction(cc.EaseSineOut.create(cc.MoveTo.create(0.15, cc.p(0, -this.speedState3))));
    }
};