ThemeHotChiliLoadingBar = cc.Class({
    extends: cc.Node,
    name:"ThemeHotChiliLoadingBar",
    ctor () {
        this.TAG = "ThemeHotChili.LoadingBar";
        this.frame = cc._Sprite.create(ThemeHotChili.ImgPath + 'loadingFrame.png');
        this.addChild(this.frame);

        //todo删除资源
        let posX = [-197, -27, 144, 314];
        this.superTitle = [];
        this.superName = ["super_wins", "super_spins", "super_awards", "super_wilds"];
        
        for (let i = 0; i < 4; i++) {
            this.superTitle[i] = sp._SkeletonAnimation.create(
                ThemeHotChili.ImgPath + "guanqia_bagua.json",
                ThemeHotChili.ImgPath + "guanqia_bagua.atlas"
            );
            this.addChild(this.superTitle[i]);
            this.superTitle[i].setPosition(posX[i], -41);
            this.superTitle[i].setAnimation(0, this.superName[i] + "_hui", true);
        }

        //1 绿 wins 2 蓝色 spins 3 红 prizes 4 橙 wilds
        posX = {
            1: [-320, -282.5, -245.5],
            2: [-149.5, -112, -75],
            3: [21, 58.5, 95.5],
            4: [191.5, 229, 266]
        };
        this.collectBall = [];
        
        for (let i = 0; i < 4; i++) {
            this.collectBall[i] = [];
            for (let j = 0; j < 3; j++) {
                this.collectBall[i][j] = cc._Sprite.create(ThemeHotChili.ImgPath + 'ball' + i + '.png');
                this.addChild(this.collectBall[i][j]);
                this.collectBall[i][j].setPosition(posX[i][j], -43);
                this.collectBall[i][j].setVisible(false);
            }
        }

        this.spLoadingLock = sp._SkeletonAnimation.create(
            ThemeHotChili.ImgPath + "Betup.json",
            ThemeHotChili.ImgPath + "Betup.atlas"
        );
        this.addChild(this.spLoadingLock, 1);
        this.spLoadingLock.setPositionY(-40);

        let btn = cc._Button.create(
            ThemeHotChili.ImgPath + "betupMask.png",
            ThemeHotChili.ImgPath + "betupMask.png",
            ThemeHotChili.ImgPath + "betupMask.png"
        );
        
        btn.setPosition(this.spLoadingLock.getPosition());
        btn.setOpacity(0);
        let touch = function(sender, eventType) {
            if (eventType === ccui.TouchEventType.ended) {
                if (ThemeHotChili.ctl.getCurBet() < BetControl.getMinLargeBet()) {
                    if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN &&
                        ThemeHotChili.gameLayer.spinLayer.state === ThemeHotChili.SpinLayerState.Idle && 
                        !ThemeHotChili.ctl.getAutoStatus()) {
                        
                        if (BetControl.canLargeBet()) {
                            ThemeHotChili.ctl.betControl.changeToBet(BetControl.getMinLargeBet());
                            this.spLoadingLock.setAnimation(0, "Betup_unlock", false);
                            AudioEngine.playEffect(ThemeHotChili.AudioPath + "unlock.mp3");
                        }
                    }
                }
            }
        };
        btn.addTouchEventListener(touch);
        this.addChild(btn, 2);

        this.collectNum = [0,0,0,0];
        this._setCascadeOpacityEnabled(true);
        this.init();
    },

    init() {
        return true;
    },
    
    showCollect(table) {
        for (let i = 1; i <= 4; i++) {
            this.collectNum[i] = Math.min(table[i], 3);
            for (let j = 1; j <= this.collectNum[i]; j++) {
                this.collectBall[i][j].setVisible(true);
            }
        }
    },
    
    isSuperFreeGame(index) {
        if (ThemeHotChili.ctl.getCurBet() >= BetControl.getMinLargeBet()) {
            if (ThemeHotChili.gameLayer.freeCount && ThemeHotChili.gameLayer.freeCount[index] > 3) {
                ThemeHotChili.gameLayer.isSuperFreeGame = index;
                return true;
            } else {
                return false;
            }
        }
    },
    
    performSuperFreeGame(index) {
        const spLight = sp._SkeletonAnimation.create(ThemeHotChili.ImgPath + "guanqia_bagua.json", ThemeHotChili.ImgPath + "guanqia_bagua.atlas");
        this.addChild(spLight);
        spLight.setPosition(this.superTitle[index].getPosition());
        spLight.setAnimation(0, "super_fire", false);
        spLight.runAction(cc.sequence(
            cc.DelayTime.create(1),
            cc.RemoveSelf.create()
        ));
        this.runAction(cc.sequence(
            cc.DelayTime.create(0.5),
            cc.CallFunc.create(() => {
                this.superTitle[index].setAnimation(0, this.superName[index] + "_1", true);
            })
        ));
    },
    getDiamondPos(index) {
        if (this.collectNum[index] < 3) {
            return this.collectBall[index][this.collectNum[index] + 1].getParent().convertToWorldSpace(this.collectBall[index][this.collectNum[index] + 1].getPosition());
        } else {
            return this.superTitle[index].getParent().convertToWorldSpace(this.superTitle[index].getPosition());
        }
    },
    
    addCollect(index) {
        if (ThemeHotChili.ctl.getCurBet() >= BetControl.getMinLargeBet()) {
            if (this.collectNum[index] < 3) {
                this.collectNum[index] = this.collectNum[index] + 1;
                for (let i = 1; i <= this.collectNum[index]; i++) {
                    this.collectBall[index][i].setVisible(true);
                }
                const name = ["S_wins", "S_spins", "S_prizes" , "S_wilds"];
                const spLight = sp._SkeletonAnimation.create(ThemeHotChili.ImgPath + "guanqia_zhuzi.json", ThemeHotChili.ImgPath + "guanqia_zhuzi.atlas");
                this.addChild(spLight);
                spLight.setPosition(this.collectBall[index][this.collectNum[index]].getPosition());
                spLight.setAnimation(0, name[index], false);
                spLight.runAction(cc.sequence(
                    cc.DelayTime.create(1),
                    cc.RemoveSelf.create()
                ));
            }
        }
    },
    
    setCollect(list) {
        let indexI;
        let indexJ;
        for (let i = 1; i <= list.length; i++) {
            if (this.collectNum[i] < 3) {
                if (this.collectNum[i] !== list[i]) {
                    indexI = i;
                    indexJ = Math.min(list[i], 3);
                }
                this.collectNum[i] = Math.min(list[i], 3);
            }
            for (let j = 1; j <= this.collectNum[i]; j++) {
                this.collectBall[i][j].setVisible(true);
            }
        }
    
        if (indexI && indexJ) {
            const name = ["S_wins", "S_spins", "S_prizes" , "S_wilds"];
            const spLight = sp._SkeletonAnimation.create(ThemeHotChili.ImgPath + "guanqia_zhuzi.json", ThemeHotChili.ImgPath + "guanqia_zhuzi.atlas");
            this.addChild(spLight);
            spLight.setPosition(this.collectBall[indexI][indexJ].getPosition());
            spLight.setAnimation(0, name[indexI], false);
            spLight.runAction(cc.sequence(
                    cc.DelayTime.create(1),
                    cc.RemoveSelf.create()
            ));
        }
    },

    
    
});

ThemeHotChiliLoadingBar.prototype.clearCollect = function(index) {
    for (let i = 1; i <= 3; i++) {
        this.collectBall[index][i].setVisible(false);
        this.collectNum[index] = 0;
        this.superTitle[index].setAnimation(0, this.superName[index] + "_hui", true);
    }
};

ThemeHotChiliLoadingBar.prototype.showLock = function() {
    if (this.isLocked) {
        // do nothing
    } else {
        this.isLocked = true;
        if (ThemeHotChili.gameLayer.enterAndShow) {
            cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "lock.mp3");
        }
        ThemeHotChili.gameLayer.enterAndShow = true;
        this.spLoadingLock.setVisible(true);
        this.spLoadingLock.setAnimation(0, "Betup_lock", false);
        this.spLoadingLock.addAnimation(0, "Betup_lock_idle", true);
    }
};

ThemeHotChiliLoadingBar.prototype.showUnlock = function() {
    if (this.isLocked) {
        this.isLocked = false;
        if (ThemeHotChili.gameLayer.enterAndShow) {
            cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "unlock.mp3");
        }
        ThemeHotChili.gameLayer.enterAndShow = true;
        this.spLoadingLock.setVisible(true);
        this.spLoadingLock.setAnimation(0, "Betup_unlock", false);
    }
};
