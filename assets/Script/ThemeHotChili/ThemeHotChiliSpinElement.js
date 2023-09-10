require("../Setup");

ThemeHotChiliSpinElement = cc.Class({
    extends: cc.Node,
    name:"ThemeHotChiliSpinElement",

    ctor () {
        this.symbolIndex = -1;
        this.chipIndex = -1;

        this.normalSprite = null;
        this.animation = null;
        this.frameSprite = null;

        this.clipFatherNode = null;
        this.unclipFatherNode = null;
        this.unclipFatherNode2 = null;

        this.aboutToStopFlag = true;
        this.init();
    },

    init () {
        this.normalSprite = new cc._Sprite();
        this.chipNode = new cc.Node();
        this.frameSprite = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_yfk", ThemeHotChili.SpinePath + "ng/NG_yfk.atlas");
        this.frameSprite.setVisible(false);

        this.addChild(this.normalSprite, 1);
        this.addChild(this.chipNode, 3);
        this.addChild(this.frameSprite, 4); // 高度2预留给动效

        this.normalSprite.setScale(0.5);

        this._setCascadeOpacityEnabled(true);
        return true;
    }
});

ThemeHotChiliSpinElement.prototype.getContentSize = function () {
    return ThemeHotChili.CellSize;
};

ThemeHotChiliSpinElement.prototype.setFathers = function (clipNode, unclipNode, unclipNode2, unclipNode3, unclipNode4, unclipNode5, unclipNode6, unclipNode7, unclipNode8, higherClipNode1, higherClipNode2, higherClipNode3) {
    this.clipFatherNode = clipNode;
    this.unclipFatherNode = unclipNode;
    this.unclipFatherNode2 = unclipNode2;
    this.unclipFatherNode3 = unclipNode3;
    this.unclipFatherNode4 = unclipNode4;
    this.unclipFatherNode5 = unclipNode5;
    this.unclipFatherNode6 = unclipNode6;
    this.unclipFatherNode7 = unclipNode7;
    this.unclipFatherNode8 = unclipNode8;
    this.higherClipFatherNode1 = higherClipNode1;
    this.higherClipFatherNode2 = higherClipNode2;
    this.higherClipFatherNode3 = higherClipNode3;
};

ThemeHotChiliSpinElement.prototype.checkFather = function (fatherNode, zOrder) {
    if (fatherNode === this.getParent()) {
        return;
    }
    this.removeFromParent(false);
    var order = zOrder || this._getLocalZOrder();
    fatherNode.addChild(this, order);
};

ThemeHotChiliSpinElement.prototype.changeFather = function (fatherNode, pos, zOrder) {
    if (fatherNode === this.frameSprite.getParent()) {
        return;
    }
    this.frameSprite.removeFromParent(false);
    var order = zOrder || this._getLocalZOrder();
    fatherNode.addChild(this.frameSprite, order);
    if (fatherNode !== this.clipFatherNode) {
        var pos2 = fatherNode.convertToNodeSpace(pos);
        this.frameSprite.setPosition(pos2);
    } else {
        this.frameSprite.setPosition(pos);
    }
};

ThemeHotChiliSpinElement.prototype.setAboutToStop = function (flag) {
    this.aboutToStopFlag = flag;
};

ThemeHotChiliSpinElement.prototype.setSymbolIndex = function (index, init, reSpinChipTemp) {
    if (index >= 14) {
        if (index === 17) {
            this.symbolIndex = 12;
        } else {
            this.symbolIndex = 13;
        }
        this.chipIndex = index;
    } else {
        this.symbolIndex = index;
        this.chipIndex = -1;
    }

    if (this.chipStrSprite != null) {
        this.chipStrSprite.removeFromParent();
        this.chipStrSprite = null;
    }
    if (ThemeResource.getLoadedImage(ThemeHotChili.SymbolNormal[this.symbolIndex])) {
        this.normalSprite.setVisible(true);
        this.normalSprite.setSpriteFrame(ThemeResource.getLoadedImage(ThemeHotChili.SymbolNormal[this.symbolIndex]));

        if (this.animation) {
            this.animation.removeFromParent();
            this.animation = null;
        }
        this.frameSprite.setVisible(false);

    }

    var elementZOrder = this.spinReel.elementZOrder || 0;
    if (init) {
        elementZOrder = 0;
    }
    if (reSpinChipTemp) {
        this.checkFather(this.clipFatherNode);
    } else {
        if (this.symbolIndex === 1) {
            this.checkFather(this.higherClipFatherNode1);
        } else if (this.symbolIndex === 12 || this.symbolIndex === 13) {
            this.checkFather(this.higherClipFatherNode2);
        } else if (this.symbolIndex === 11) {
            this.checkFather(this.higherClipFatherNode3);
        } else {
            this.checkFather(this.clipFatherNode);
        }
    }
    if (this.spinReel && this.spinReel.elementZOrder && !init) {
        this.spinReel.elementZOrder = this.spinReel.elementZOrder - 1;
    }
    this.checkChipDisplay();
    this.updateSpriteZOrder();
};

ThemeHotChiliSpinElement.prototype.createAnimation = function () {
    if (this.animation && !tolua.isnull(this.animation)) {
        this.animation.removeFromParent();
        this.animation = null;
    }


    if (1 <= this.symbolIndex && this.symbolIndex <= 5) {
        this.animation = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_H" + this.symbolIndex + "", ThemeHotChili.SpinePath + "ng/NG_H" + this.symbolIndex + ".atlas");
    } else if (6 <= this.symbolIndex && this.symbolIndex <= 10) {
        this.animation = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_L" + (this.symbolIndex - 5) + "", ThemeHotChili.SpinePath + "ng/NG_L" + (this.symbolIndex - 5) + ".atlas");
    } else if (this.symbolIndex === 11) {
        this.animation = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/NG_SC", ThemeHotChili.SpinePath + "ng/NG_SC.atlas");
    } else if (this.symbolIndex > 11) {
        this.animation = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/BG_SC", ThemeHotChili.SpinePath + "ng/BG_SC.atlas");
    }

    if (this.animation) {
        this.animation.setScale(0.5);
        this.addChild(this.animation, 2);
    }
};

ThemeHotChiliSpinElement.prototype.getSymbolIndex = function () {
    return this.symbolIndex;
};

ThemeHotChiliSpinElement.prototype.updateSpriteZOrder = function () {
    this.zOrder = 0;
};

ThemeHotChiliSpinElement.prototype.checkChipDisplay = function () {
    if (this.chipIndex !== -1) {
        if (this.chipStrSprite != null) {
            this.chipStrSprite.removeFromParent();
            this.chipStrSprite = null;
        }
        this.chipStrSprite = cc._Sprite.create();
        this.chipNode.addChild(this.chipStrSprite);
        if (this.chipIndex >= 14 && this.chipIndex <= 17) {
            var chipJpSprite = cc._Sprite.create(ThemeHotChili.ImgPath + "ng/x" + (this.chipIndex - 12) + ".png");
            this.chipStrSprite.addChild(chipJpSprite);
        } else {
            var chipStr;
            if (this.aboutToStopFlag && this.chipIndex > ThemeHotChili.SymbolNormal.length) {
                chipStr = ThemeHotChili.chipValueGenerator.index2ValueStr(this.chipIndex, 1);
            } else {
                chipStr = ThemeHotChili.chipValueGenerator.index2ValueStr(this.chipIndex, 1);
            }
            if ('-' === chipStr.substr(0, 1)) {
                var jpIndex = -parseInt(chipStr);
                var chipJpSprite = cc._Sprite.create(bole.translateImage("chipJp_" + jpIndex, ThemeHotChili.themeId));
                this.chipStrSprite.addChild(chipJpSprite, 0);
            } else {
                var chipStrLabel = new cc._LabelBMFont(ThemeHotChili.ImgPath + "ng/chips_shuzi.fnt", chipStr);
                chipStrLabel.setPosition(0, 5);
                this.chipStrSprite.addChild(chipStrLabel);
                bole.setLabelWidth(chipStrLabel, 110);
            }
        }
    }
};

ThemeHotChiliSpinElement.prototype.multiBling = function(multiNum) {
    if (this.chipIndex > 13) {
        this.checkFather(this.unclipFatherNode6);
        /*this.normalSprite.setVisible(false);
        this.chipNode.setVisible(false);
        this.animation.setVisible(true);
        this.animation.setAnimation(0, "X" + multiNum + "_luoxia", false);*/
        /*this.runAction(cc.Sequence.create(
            cc.DelayTime.create(1),
            cc.CallFunc.create(function() {
                this.chipNode.setVisible(true);
            }, this)
        ));*/
    }
}

ThemeHotChiliSpinElement.prototype.chipMulti = function(multiNum) {
    this.checkFather(this.unclipFatherNode6);
    this.runAction(cc.Sequence.create(
        cc.DelayTime.create(0.3),
        cc.CallFunc.create(function() {
            if (this.chipStrSprite !== null) {
                this.chipStrSprite.removeFromParent();
                this.chipStrSprite = null;
            }
            this.chipStrSprite = cc._Sprite.create();
            this.chipNode.addChild(this.chipStrSprite);
            var chipStr = ThemeHotChili.chipValueGenerator.index2ValueStr(this.chipIndex, multiNum);
            var chipStrLabel = cc._LabelBMFont.create(chipStr, ThemeHotChili.ImgPath + 'ng/chips_shuzi.fnt');
            chipStrLabel.setPosition(0, 5);
            this.chipStrSprite.addChild(chipStrLabel);
            bole.setLabelWidth(chipStrLabel, 110);
        }, this)
    ));
}

ThemeHotChiliSpinElement.prototype.chipWinAdd = function() {
    if (!this.animation) {
        this.createAnimation();
    }
    this.checkFather(this.unclipFatherNode6);
    var fire = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/BG_SC", ThemeHotChili.SpinePath + "ng/BG_SC.atlas");
    this.addChild(fire, 4);
    fire.setScale(0.5);
    fire.setAnimation(0, "zhongjiang_huo", false);
    fire.update(0);
    fire.runAction(cc.Sequence.create(
        cc.DelayTime.create(1.3),
        cc.RemoveSelf.create()
    ));
}

ThemeHotChiliSpinElement.prototype.performScatterDownAnimation = function() {
    if (!this.animation) {
        this.createAnimation();
    }
    if (this.symbolIndex == 11) {
        this.checkFather(this.unclipFatherNode3);
        this.normalSprite.setVisible(false);
        this.animation.setVisible(true);
        this.animation.setAnimation(0, "luoxia", false);
        this.animation.update(0);
        if (ThemeHotChili.gameLayer.spinLayer.spinTable.scIdle2) {
            this.animation.addAnimation(0, "idle2", true);
        } else {
            this.animation.addAnimation(0, "idle", true);
        }
    }
}

ThemeHotChiliSpinElement.prototype.performChipDown = function() {
    if (!this.animation) {
        this.createAnimation();
    }
    if (this.chipIndex > 13) {
        this.checkFather(this.unclipFatherNode2);
        this.normalSprite.setVisible(false);
        this.animation.setVisible(true);
        if (this.chipIndex <= 17) {
            this.chipNode.setVisible(false);
            this.animation.setAnimation(0, "X" + (this.chipIndex - 12) + "_luoxia", false);
            this.animation.addAnimation(0, "X" + (this.chipIndex - 12) + "_daiji", true);
        } else {
            this.animation.setAnimation(0, "zhongjiang_jinbi", true);
            this.animation.addAnimation(0, "daiji", true);
        }
        this.animation.update(0);
    }
}

ThemeHotChiliSpinElement.prototype.performChipDownNoWin = function() {
    if (!this.animation) {
        this.createAnimation();
    }
    if (this.chipIndex > 13) {
        this.checkFather(this.unclipFatherNode2);
        this.normalSprite.setVisible(false);
        this.animation.setVisible(true);
        if (this.chipIndex <= 17) {
            this.chipNode.setVisible(false);
            this.animation.setAnimation(0, "X" + (this.chipIndex - 12) + "_luoxia", false);
            this.animation.addAnimation(0, "X" + (this.chipIndex - 12) + "_daiji", true);
            ThemeHotChili.gameLayer.judgeBgScInterval();
        } else {
            this.animation.setAnimation(0, "daiji", true);
        }
        this.animation.update(0);
    }
}

ThemeHotChiliSpinElement.prototype.performScIdle2 = function() {
    if (!this.animation) {
        this.createAnimation();
    }
    if (this.symbolIndex == 11) {
        this.checkFather(this.unclipFatherNode2);
        this.animation.setAnimation(0, "idle2", true);
        this.animation.update(0);
    }
}

ThemeHotChiliSpinElement.prototype.performAnimation = function() {
    if (!this.animation) {
        this.createAnimation();
    }

    if (1 <= this.symbolIndex && this.symbolIndex <= 5) {
        if (this.symbolIndex == 1) {
            this.checkFather(this.unclipFatherNode5);
        } else {
            this.checkFather(this.unclipFatherNode4);
        }
        this.normalSprite.setVisible(false);
        this.animation.setVisible(true);
        this.animation.setAnimation(0, "H" + this.symbolIndex, true);
        this.animation.update(0);
    } else if (6 <= this.symbolIndex && this.symbolIndex <= 10) {
        this.checkFather(this.unclipFatherNode4);
        this.normalSprite.setVisible(false);
        this.animation.setVisible(true);
        this.animation.setAnimation(0, 'L' + (this.symbolIndex - 5), true);
        this.animation.update(0);
    } else if (this.symbolIndex == 11) {
        this.checkFather(this.unclipFatherNode7);
        this.normalSprite.setVisible(false);
        this.animation.setVisible(true);
        this.animation.setAnimation(0, "zhongjiang", true);
        this.animation.update(0);
    } else if (this.symbolIndex == 12 || this.symbolIndex == 13) {
        this.checkFather(this.unclipFatherNode6);
        // this.normalSprite.setVisible(false);
        // this.animation.setVisible(true);
        // this.animation.setAnimation(0, "Scatter_02", true);
    }
}

ThemeHotChiliSpinElement.prototype.performLineAnimation = function() {
    var pos = this.convertToWorldSpace(this.frameSprite.getPosition());
    this.changeFather(this.unclipFatherNode8, pos, 1e6);

    this.frameSprite.setAnimation(0, "yfk", true);
    this.frameSprite.setVisible(true);
    this.frameSprite.update(0);
};

ThemeHotChiliSpinElement.prototype.stopLineAnimation = function() {
    this.frameSprite.setVisible(false);
    this.frameSprite.clearTracks();
    this.frameSprite.clearTrack(0);
    this.frameSprite.stopAllActions();
};

ThemeHotChiliSpinElement.prototype.stopAnimation = function() {
    this.normalSprite.stopAllActions();
    this.normalSprite.setVisible(true);
    this.chipNode.stopAllActions();
    this.chipNode.setVisible(true);
    this.frameSprite.setVisible(false);
    this.frameSprite.clearTracks();
    this.frameSprite.clearTrack(0);
    this.frameSprite.stopAllActions();

    if (this.animation && !cc.sys.isObjectValid(this.animation)) {
        this.animation.setVisible(false);
        this.animation.clearTracks();
        this.animation.clearTrack(0);
        this.animation.stopAllActions();
    }

    if (this.symbolIndex === 1) {
        this.checkFather(this.unclipFatherNode);
    } else if (this.symbolIndex === 12 || this.symbolIndex === 13) {
        this.checkFather(this.unclipFatherNode2);
    } else if (this.symbolIndex === 11) {
        this.checkFather(this.unclipFatherNode3);
    } else {
        this.checkFather(this.clipFatherNode);
    }

    var pos = cc.p(0, 0);
    this.changeFather(this.clipFatherNode, pos);
};
