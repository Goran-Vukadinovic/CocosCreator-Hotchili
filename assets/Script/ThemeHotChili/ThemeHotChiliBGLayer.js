ThemeHotChiliBGLayer = cc.Class({
    extends: cc.Node,
    name:"ThemeHotChiliBGLayer",
    ctor: function () {
        var result = arguments[0];
        this._TAG = "ThemeDaFuShow.Map";
        this.init(result);
    },
    onEnter() {
        // implementation of onEnter method goes here
    },

    onExit: function () {
        cc.TimerTargetSelector.clearAllTimers(this);
    },
    onLoad: function () {
        this.node.on("enter", this.onEnter, this);
        this.node.on("exit", this.onExit, this);
    },

    onEnter: function () {
        // Do something when node enters the scene
    },

    init: function (result) {
        // Initialize object with result
        this.result = result;
        this.selectNum = result.bonus_item_list.length;
        let multi;
        if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.MAIN) {
            for (let i = 0; i < result.item_list[3].length; i++) {
                if (result.item_list[3][i] >= 14 && result.item_list[3][i] <= 17) {
                    multi = result.item_list[3][i] - 12;
                }
            }
        }
        else if (ThemeHotChili.ctl.getGameType() === THEME_GAME_TYPE.FREE) {
            const itemList = (result.item_list_new && result.item_list_new[1]) ? result.item_list_new : result.item_list;
            for (let i = 0; i < itemList[3].length; i++) {
                if (itemList[3][i] >= 14 && itemList[3][i] <= 17) {
                    multi = itemList[3][i] - 12;
                }
            }
        }

        this.yellowChili = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/BG_huanglajiao", ThemeHotChili.SpinePath + "bg/BG_huanglajiao.atlas");
        this.addChild(this.yellowChili);
        this.yellowChili.setPosition(0, 0);
        this.yellowChili.setAnimation(0, "huanglajiao", true);

        this.frame = new cc._Sprite(ThemeHotChili.ImgPath + "bg/frame" + multi + ".png");
        this.frame.setPosition(cc.p(0.5, -148.5));
        this.addChild(this.frame);

        this.multiName = new cc._Sprite(ThemeHotChili.ImgPath + "bg/jpwinsx" + multi + ".png");
        this.multiName.setPosition(cc.p(-3, 118.5));
        this.addChild(this.multiName);

        this.match = new cc._Sprite(ThemeHotChili.ImgPath + "bg/match.png");
        this.match.setPosition(cc.p(-2, 38.5));
        this.addChild(this.match);

        let ballPosX = [-240,-120,0,120,240,-240,-120,0,120,240,-240,-120,0,120,240];
        let ballPosY = [-36.5,-64.5,-36.5,-64.5,-36.5,-172,-200,-172,-200,-172,-307.5,-335.5,-307.5,-333.5,-307.5];

        this.ballBackLight = [];
        this.ballList = [];
        for (let i = 1; i <= 15; i++) {
            //this.ballBackLight[i] = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/BG_choujiang", ThemeHotChili.SpinePath + "bg/BG_choujiang.atlas");
            //this.node.addChild(this.ballBackLight[i]);
            //this.ballBackLight[i].setPosition(ballPosX[i-1], ballPosY[i-1]);

            this.ballList[i-1] = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/BG_choujiang", ThemeHotChili.SpinePath + "bg/BG_choujiang.atlas");
            this.node.addChild(this.ballList[i-1], 1);
            this.ballList[i-1].setPosition(ballPosX[i-1], ballPosY[i-1]);
            this.ballList[i-1].setAnimation(0, "daiji1", true);
        }

        this.randomSelect();

        let temp = [3, 3, 3, 3, 3];
        for (let i = 0; i < this.result.bonus_item_list.length; i++) {
            temp[this.result.bonus_item_list[i]-1] -= 1;
        }
        this.remainToShow = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < temp[i]; j++) {
                this.remainToShow.push(i+1);
            }
        }
        for (let i = this.remainToShow.length - 1; i >= 1; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.remainToShow[i], this.remainToShow[j]] = [this.remainToShow[j], this.remainToShow[i]];
        }
        
        this.hadSelected = [];
        this.ballType = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.typeNum = {
            [1] : 0,
            [2] : 0,
            [3] : 0,
            [4] : 0,
            [5] : 0
        };
        this.resultIndex = 1;
        this.remainToShowIndex = 1;
        this.mp = ["grand", "maxi", "major", "minor", "mini"];
        this.mp2 = ["grand", "maxi", "magor", "minor", "mini"];
        this.btn = [];

        for (let i = 1; i <= 15; i++) {
            this.btn[i] = new cc._Button(ThemeHotChili.ImgPath + "bg/bgSelectBall.png", ThemeHotChili.ImgPath + "bg/bgSelectBall.png", ThemeHotChili.ImgPath + "bg/bgSelectBall.png");
            this.btn[i].setPosition(this.ballList[i].getPosition());
            this.btn[i].setOpacity(0);
            this.btn[i].setVisible(false);
            let touch = (sender, eventType) => {
                if (eventType === ccui.TouchEventType.began) {
                    // do something here
                } else if (eventType === ccui.TouchEventType.ended) {
                    self.selectNum -= 1;
                    if (self.selectNum > 0) {
                        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "bg_choose.mp3", false);
                        this.btn[i].setTouchEnabled(false);
                        let outcome = self.result.bonus_item_list[self.resultIndex];
                        this.ballList[i].setAnimation(0, "dianji_" + self.mp[outcome], false);
                        this.ballList[i].addAnimation(0, "daiji_" + self.mp[outcome], true);
                        self.resultIndex += 1;
                        self.hadSelected[i] = true;
            
                        self.ballType[i] = outcome;
                        self.typeNum[outcome] += 1;
            
                        for (let j = 1; j <= 5; j++) {
                            if (self.typeNum[j] > 1) {
                                for (let k = 1; k <= 15; k++) {
                                    if (self.ballType[k] === j) {
                                        TimerCallFunc.addCallFunc(() => {
                                            this.ballList[k].setAnimation(0, "daiji_" + self.mp[j], true);
                                        }, 0.83, self, self);
                                    }
                                }
                            }
                        }
                    } else {
                        cc.audioEngine.stopMusic();
                        cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "bg_choose.mp3", false);
                        for (let j = 1; j <= 15; j++) {
                            this.btn[j].setTouchEnabled(false);
                        }
            
                        let outcome = self.result.bonus_item_list[self.resultIndex];
                        this.ballList[i].setAnimation(0, "dianji_" + self.mp[outcome], false);
                        self.resultIndex += 1;
                        self.hadSelected[i] = true;
            
                        self.ballType[i] = outcome;
                        self.typeNum[outcome] += 1;
                        TimerCallFunc.addCallFunc(() => {
                            cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "bg_allopen.mp3", false);
                        }, 0.5, self, self);
                        TimerCallFunc.addCallFunc(() => {
                            for (let j = 1; j <= 15; j++) {
                                if (self.ballType[j] === outcome) {
                                    this.ballList[j].setAnimation(0, "doudong_" + self.mp[outcome], true);
                                } else if (self.ballType[j] > 0) {
                                    this.ballList[j].setAnimation(0, "jingzhi_" + self.mp2[self.ballType[j]], true);
                                    this.ballList[j].setColor(cc.color(128, 128, 128));
                                }
                            }
                            self.runAction(cc.sequence(
                                //cc.DelayTime:create(1),
                                cc.callFunc(() => {
                                    for (let j = 1; j <= 15; j++) {
                                        if (!self.hadSelected[j]) {
                                            this.ballList[j].setColor(cc.color(128, 128, 128));
                                        }
                                    }
                                }),
                                cc.delayTime(1),
                                cc.callFunc(() => {
                                    ThemeHotChili.gameLayer.jpWin();
                                })
                            ));
                        }, 1, self, self);
                    }
                }
            };
            this.btn[i].on("touchend", touch, this);
            this.addChild(this.btn[i], 10);
        }
        this._setCascadeOpacityEnabled(true);
    },

    randomSelect() {
        let t = {};
        let ballNo = [];
        for (let i = 1; i <= 15; i++) {
            let temp = Math.floor(Math.random() * (15 + 1 - i)) + 1;
            for (let j = 1; j <= 15; j++) {
                if (!t[j]) {
                    temp--;
                    if (temp === 0) {
                        ballNo.push(j);
                        t[j] = true;
                    }
                }
            }
        }
    
        for (let i = 1; i <= 5; i++) {
            this.ballList[ballNo[i]].setAnimation(0, "daiji1", true);
        }
        for (let i = 6; i <= 10; i++) {
            this.ballList[ballNo[i]].setAnimation(0, "daiji2", true);
        }
        for (let i = 11; i <= 15; i++) {
            this.ballList[ballNo[i]].setAnimation(0, "daiji3", true);
        }
    
        TimerCallFunc.addCallFunc(() => {
            for (let i = 1; i <= 15; i++) {
                this.btn[i].setVisible(true);
            }
        }, 1, this, this);
    }
    








});
