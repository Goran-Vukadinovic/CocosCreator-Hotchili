HeaderLevel = cc.Class({
    extends:cc.Node,
    name:"HeaderLevel",
    ctor: function() {
        var inLobby = arguments[0];
        this.lastLevel = null;
        this.lastLevelTarget = null;
        this.lastExpPercentage = 0;
        this.spBarWidth = 168;

        if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded("header/res/header.plist")) {
            cc.spriteFrameCache.addSpriteFrames("header/res/header.plist");
        }

        this.init(inLobby);
        this.seq = [];
        this.initEvent();

        this.registerScriptHandler((event) => {
            if (event === cc.Node.EventType.EXIT) {
                EventCenter.removeEvent(EVT.SYSTEM.ADD_EXP, this.onAddExp, this);
            }
        });
    },

    initEvent: function() {
        EventCenter.registerEvent(EVT.SYSTEM.ADD_EXP, this.onAddExp, this);
    },

    onAddExp: function(data) {
        this.seq.push(data);
        this.checkSequence();
    },

    checkSequence: function() {
        if (this.block) {
            return;
        } else {
            let data = List.popleft(this.seq);
            if (data) {
                let percentage = (data.exp - data.lastExp) * 100.0 / (data.nextExp - data.lastExp);
                percentage = Math.min(percentage, 100);
                if (percentage === 100) {
                    percentage = 0;
                }
                this.setLevelAndExpPercentage(data.level, percentage);
            }
        }
    },

    init: function(inLobby) {
        this.barWidth = inLobby || bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL ? 163 : 150;
        this.spBarWidth = inLobby || bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL ? 168 : 158;

        this.barStencil = new cc.Sprite();
        this.barStencil.setAnchorPoint(cc.p(0, 0.5));

        this.clippingNode = new cc.ClippingNode(this.barStencil);
        this.clippingNode.setAlphaThreshold(0);
        this.addChild(this.clippingNode);

        let isNewOptSign = (inLobby || bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) && NEW_USER_OPTIMIZATION && "_new" || "";

        if (inLobby || bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
            this.barStencil.setSpriteFrame("header/res/progress_bar_lobby" + isNewOptSign + ".png");
            this.clippingNode.setPosition(4, 0);
        } else {
            this.barStencil.setSpriteFrame("header/res/progress_bar_slot.png");
            this.clippingNode.setPosition(2, 0);
        }

        if (bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
            this.barSprite = sp._SkeletonAnimation(bole.getAnimation("header/animation/Lobby_level_bar" + isNewOptSign, true));
        } else {
            this.barSprite = sp._SkeletonAnimation("header/animation/vertical/Slot_level_bar.skel", "header/animation/vertical/Slot_level_bar.atlas");
        }
        this.barSprite.setAnimation(0, "bar_idle", true);
        this.barSprite.setAnchorPoint(cc.p(1.0, 0.5));
        this.clippingNode.addChild(this.barSprite);
        this.barSprite.setPositionX(-this.barWidth / 2);
        // this.barSprite.setScale(this.barWidth / this.spBarWidth);

        let labelNode = new cc.Node();
        labelNode.setPosition(this.barWidth / 2, 0.5);
        this.addChild(labelNode);

        this.levelLabel = FONTS.addFNT("header/top_icon_jingyan_bar" + isNewOptSign + "_fnt.fnt", "");
        labelNode.addChild(this.levelLabel);

        this.percentageLabel = FONTS.addFNT("header/top_icon_jingyan_bar" + isNewOptSign + "_fnt.fnt", "");
        this.percentageLabel.setOpacity(0);
        labelNode.addChild(this.percentageLabel);

        Utils.inherit(this.percentageLabel, LabelNumRoll);
        this.percentageLabel.nrInit(0, 12, function(value) {
            if (value) {
                value = parseInt(value, 10);
                if (value < 0) {
                    value = 0;
                } else if (value >= 0 && value <= 100) {
                    value = value;
                } else {
                    value = 100;
                }
                return Math.floor(value) + "%";
            } else {
                return '';
            }
        });
    }
});

HeaderLevel.prototype.setLevelAndExpPercentage = function(level, expPercentage, isInit) {
    this.block = true;

    const onPerformOver = () => {
        this.block = false;
        EventCenter.pushEvent(EVT.SYSTEM.GAIN_EXP_BLOCK, {addExp: false});
        this.checkSequence();
    };

    level = tonumber(level);

    const updateLevel = (lv) => {
        this.lastLevel = lv;
        this.levelLabel.setString(lv);
        this.lastLevelTarget = null;
    };

    this.levelLabel.stopAllActions();
    this.percentageLabel.stopAllActions();
    this.percentageLabel.nrStopRoll();
    this.barSprite.stopAllActions();

    this.lastLevelTarget = level;
    const levelUpFlag = (this.lastLevel && this.lastLevel < level);

    const ratioX = Math.max(0, Math.min(1, expPercentage / 100));

    const rollDuration = 0.5;
    let recoverDuration;

    if (!levelUpFlag) {
        recoverDuration = rollDuration + 0.5;

        if (this.lastExpPercentage < expPercentage) {
            this.percentageLabel.nrStartRoll(null, expPercentage, rollDuration);

            this.levelLabel.setOpacity(0);
            updateLevel(level);
            this.percentageLabel.runAction(cc.Sequence.create(
                    cc.FadeIn.create(0.15),
                    cc.DelayTime.create(recoverDuration - 0.2),
                    cc.FadeOut.create(0.05)
            ));
            this.barSprite.runAction(cc.EaseSineInOut.create(cc.MoveTo.create(rollDuration, cc.p(ratioX * this.barWidth - this.barWidth / 2, 0))));

            let spBar = null;
            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                spBar = sp._SkeletonAnimation(bole.getAnimation("header/animation/Lobby_level_bar" + (NEW_USER_OPTIMIZATION ? "_new" : ''), true));
            } else {
                spBar = sp._SkeletonAnimation("header/animation/vertical/Slot_level_bar.skel", "header/animation/vertical/Slot_level_bar.atlas");
            }
            spBar.setPosition(this.spBarWidth / 2, 0);
            this.barSprite.addChild(spBar);
            spBar.runAction(cc.Sequence.create(
                    cc.CallFunc.create(() => {
                        spBar.setAnimation(0, "bar_add", false);
                    }),
                    cc.DelayTime.create(rollDuration + 0.4),
                    cc.RemoveSelf.create()
            ));
        } else {
            if (isInit) {
                this.percentageLabel.nrSetCurValue(expPercentage);
                this.levelLabel.setOpacity(0);
                updateLevel(level);
                this.percentageLabel.runAction(cc.Sequence.create(
                        cc.FadeIn.create(0.15),
                        cc.DelayTime.create(recoverDuration - 0.2),
                        cc.FadeOut.create(0.05)
                ));
                this.barSprite.runAction(cc.EaseSineInOut.create(cc.MoveTo.create(rollDuration, cc.p(ratioX * this.barWidth - this.barWidth / 2, 0))));
            }
        }
    } else {
        this.levelLabel.setOpacity(0);
        updateLevel(level);

        const levelUpAnimateDuartion = 0.5;

        recoverDuration = rollDuration + levelUpAnimateDuartion;

        this.percentageLabel.runAction(cc.Sequence.create(
                cc.Spawn.create(
                        cc.FadeIn.create(0.25),
                        cc.CallFunc.create(() => {
                            this.percentageLabel.nrStartRoll(null, 100, 0.5);
                        })
                ),
                cc.CallFunc.create(() => {
                    let spBar = null;
                    if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                        spBar = sp._SkeletonAnimation(bole.getAnimation("header/animation/Lobby_level_bar" + (NEW_USER_OPTIMIZATION ? "_new" : ''), true));
                    } else {
                        spBar = sp._SkeletonAnimation("header/animation/vertical/Slot_level_bar.skel", "header/animation/vertical/Slot_level_bar.atlas");
                    }
                    spBar.setPosition(0.5 * this.barWidth, 0);
                    this.clippingNode.addChild(spBar);
                    spBar.setAnimation(0, "bar_full", false);
                    spBar.runAction(cc.Sequence.create(
                            cc.DelayTime.create(1),
                            cc.RemoveSelf.create()
                    ));
                }),
                cc.FadeOut.create(0.25),
                cc.CallFunc.create(() => {
                    this.percentageLabel.nrStopRoll();
                    this.percentageLabel.nrSetCurValue(expPercentage);
                })
        ));

        this.barSprite.runAction(cc.Sequence.create(
                cc.EaseSineInOut.create(cc.MoveTo.create(0.5, cc.p(this.barWidth - this.barWidth / 2, 0))),
                cc.EaseSineIn.create(cc.MoveTo.create(0.25, cc.p(-this.barWidth / 2, 0))),
                cc.CallFunc.create(() => {
                    if (bole.notNull(bole.getHeader().starSprite) && !bole.getHeader().getIsLowPhone()) {
                        if (bole.getCountDown('level_boom_countdown') > 0) {
                            bole.getHeader().starSprite.setAnimation(0, "levelup", false);
                            bole.getHeader().starSprite.addAnimation(0, "levelburst", true);
                        } else {
                            bole.getHeader().starSprite.setAnimation(0, "levelup", false);
                            bole.setAnimationLoopWithDelay(bole.getHeader().starSprite, 0, "level_star", NEW_USER_OPTIMIZATION ? 3.0 : 0);
                        }
                    }
                }),
                cc.DelayTime.create(levelUpAnimateDuartion),
                cc.EaseSineInOut.create(cc.MoveTo.create(0.5, cc.p(ratioX * this.barWidth - this.barWidth / 2, 0)))
        ));
    }

    const getBlockAction = () => {
        return cc.Sequence.create(
                cc.DelayTime.create(1.0),
                cc.CallFunc.create(onPerformOver)
        );
    };
    if (levelUpFlag) {
        this.levelLabel.runAction(cc.Sequence.create(
                cc.DelayTime.create(recoverDuration),
                cc.FadeIn.create(0),
                cc.ScaleTo.create(0.15, 1.1),
                cc.ScaleTo.create(0.1, 1),
                getBlockAction()
        ));
    } else {
        this.levelLabel.runAction(cc.Sequence.create(
                cc.DelayTime.create(recoverDuration),
                cc.FadeIn.create(0),
                getBlockAction()
        ));
    }

    this.lastExpPercentage = expPercentage;
};
