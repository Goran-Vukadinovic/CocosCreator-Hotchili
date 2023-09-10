ThemeHotChiliFgSelectLayer = cc.Class({
    extends: cc.Node,
  
    ctor() {
        var result = arguments[0];
        var isReconnectData = arguments[1];
        this.reSend = null;
        this.TAG = "ThemeDaFuShow.Map";
        this.init(result, isReconnectData);
    },
  
    onEnter() {},
  
    onExit() {
        TimerCallFunc.clearGroup(this);
    },
  
    afterReconnectNetwork() {
        if (this.reSend) {
            this.reSend();
        }
    },
  
    registerNodeEvent() {
        this.on(cc.Node.EventType.ENTER, this.onEnter, this);
        this.on(cc.Node.EventType.EXIT, this.onExit, this);
    },
  
    unregisterNodeEvent() {
        this.off(cc.Node.EventType.ENTER, this.onEnter, this);
        this.off(cc.Node.EventType.EXIT, this.onExit, this);
    },
  
    onLoad() {
        this.registerNodeEvent();
        tools.registerEvent(EVT.SYSTEM.AFTER_THEME_RECONNECT, this.afterReconnectNetwork, this);
    },
  
    onDestroy() {
        this.unregisterNodeEvent();
    },
    init(result, isReconnectData) {
        this.frame = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/TC_FG_xuanzebg");
        this.frame.setPosition(0, 0);
        this.addChild(this.frame);
        this.frame.setAnimation(0, "bg", true);
      
        this.select = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/TC_FG_xuanze_title");
        this.select.setPosition(0.5, 495);
        this.addChild(this.select);
        this.select.setAnimation(0, bole.translateAnimation("title", this.select), true);
      
        let scNum = 0;
        if (!isReconnectData) {
          for (let i = 1; i <= 15; i++) {
            if (result.sf_hit_pos[i] > 0) {
              scNum++;
            }
          }
        } else {
          scNum = Math.floor(result[1] / 4) + 2;
        }
      
        const fgStartNumList = [
          [4, 6, 8, 10],
          [8, 12, 16, 20],
          [12, 18, 24, 30],
        ];
      
        this.selectNode = [];
        this.greenFrame = [];
        this.table = {};
        this.fgStartNum = {};
        this.freeGames = {};
        this.with = {};
        this.rowNum = {};
        this.rows = {};
        this.greenFramePosY = [327, 114.5, -98, -311];
        this.tablePosY = [330.5, 118.5, -94.5, -306.5];
        this.fgStartNumPosY = [375.5, 160, -50, -263.5];
        this.freeGamesPosY = [310.5, 98.5, -114.5, -326.5];
        this.withPosY = [267.5, 55.5, -157.5, -369.5];

        this.blingIdle = {};
        this.btn = {};
        for (let i = 0; i < 4; i++) {
            this.selectNode[i] = new cc.Node();
            this.selectNode[i].setPosition(0, this.greenFramePosY[i]);
            this.addChild(this.selectNode[i]);
            this.selectNode[i].setScale(0);
        
            this.greenFrame[i] = new cc._Sprite(ThemeHotChili.ImgPath + 'fg/greenFrame.png');
            this.greenFrame[i].setPosition(4, this.greenFramePosY[i] - this.greenFramePosY[i]);
            this.selectNode[i].addChild(this.greenFrame[i]);
        
            this.table[i] = new cc._Sprite(ThemeHotChili.ImgPath + 'fg/table' + (i + 1) + '.png');
            this.table[i].setPosition(-126, this.tablePosY[i] - this.greenFramePosY[i]);
            this.selectNode[i].addChild(this.table[i]);
        
            this.fgStartNum[i] = new cc._LabelBMFont("", ThemeHotChili.ImgPath + "fg/fgSelectNum.fnt");
            this.fgStartNum[i].setPosition(107.5, this.fgStartNumPosY[i] - this.greenFramePosY[i]);
            this.selectNode[i].addChild(this.fgStartNum[i]);
            this.fgStartNum[i].setScale(0.57);
            this.fgStartNum[i].setString(fgStartNumList[scNum - 2][i]); // Added 1 because Lua indexes start at 1
        
            this.freeGames[i] = new cc._Sprite(bole.translateImage("selectFree", ThemeHotChili.themeId));
            this.freeGames[i].setPosition(106, this.freeGamesPosY[i] - this.greenFramePosY[i]);
            this.selectNode[i].addChild(this.freeGames[i]);
        
            this.with[i] = new cc._Sprite(bole.translateImage("selectWith", ThemeHotChili.themeId));
            this.with[i].setPosition(43, this.withPosY[i] - this.greenFramePosY[i]);
            this.selectNode[i].addChild(this.with[i]);

            self.rowNum[i] = cc._Sprite(ThemeHotChili.ImgPath+'fg/rowNum'+str(i)+'.png')
            self.rowNum[i].position = (99, self.withPosY[i] - self.greenFramePosY[i])
            self.selectNode[i].addChild(self.rowNum[i])

            self.rows[i] = cc._Sprite(bole.translateImage('rows', ThemeHotChili.themeId))
            self.rows[i].position = (164, self.withPosY[i] - 0.5 - self.greenFramePosY[i])
            self.selectNode[i].addChild(self.rows[i])

            self.blingIdle[i] = sp._SkeletonAnimation(ThemeHotChili.SpinePath+'fg/TC_FG_xuanze_kung', 
                                                    ThemeHotChili.SpinePath+'fg/TC_FG_xuanze_kung.atlas')
            self.blingIdle[i].position = (4, self.greenFramePosY[i] - self.greenFramePosY[i])
            self.selectNode[i].addChild(self.blingIdle[i])
            // self.blingIdle[i].setAnimation(0, 'animation', True)

            self.btn[i] = cc._Button(ThemeHotChili.ImgPath+'fg/greenFrame.png',
                                    ThemeHotChili.ImgPath+'fg/greenFrame.png',
                                    ThemeHotChili.ImgPath+'fg/greenFrame.png')
            self.btn[i].position = (4, self.greenFramePosY[i])
            self.btn[i].opacity = 0
            self.btn[i].touch_enabled = false
            const touch = function(sender, eventType) {
                if (eventType === ccui.TouchEventType.began) {
                    for (let j = 1; j <= 4; j++) {
                        this.btn[j].setVisible(false);
                    }
                } else if (eventType === ccui.TouchEventType.ended) {
                    cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'fg_choose.mp3');
                    TimerCallFunc.clearGroup(this);
                    for (let j = 1; j <= 4; j++) {
                        this.selectNode[j].stopAllActions();
                        this.selectNode[j].setScale(1);
                        this.btn[j].setVisible(false);
                    }
                    this.selectNode[i]._setLocalZOrder(2);
                    this.reSend = function() {
                        bole.potp.send({'theme_choice': {'fg_choice': i - 1}});
                    };
                    this.reSend();
            
                    for (let j = 1; j <= 4; j++) {
                        if (i != j) {
                            this.selectNode[j].setColor(cc.color(125, 125, 125));
                            for (let [k, v] of this.selectNode[j].getChildren()) {
                                if (v && !v.isValid) {
                                    v.setColor(cc.color(125, 125, 125));
                                }
                            }
                            this.blingIdle[j].setVisible(false);
                        }
                        this.chooseBling = new sp._SkeletonAnimation(
                            ThemeHotChili.SpinePath + "fg/TC_FG_xuanze_kuangxuan"
                        );
                        this.chooseBling.setPosition(4, this.greenFramePosY[i] - this.greenFramePosY[i]);
                        this.selectNode[i].addChild(this.chooseBling);
                        this.chooseBling.setAnimation(0, "animation", true);
            
                        this.selectNode[i].runAction(cc.sequence(
                            cc.scaleTo(0.17, 0.9),
                            cc.scaleTo(0.33, 1.2)
                        ));
                    }
                } else if (eventType === ccui.TouchEventType.canceled) {
                    for (let j = 1; j <= 4; j++) {
                        this.btn[j].setVisible(true);
                    }
                }
            };
            this.btn[i].on('touch', touch, this);
            this.addChild(this.btn[i], 10);

            this.selectNode[i].runAction(cc.sequence(
                cc.delayTime(0.5 + 0.2 * (i - 1)),
                cc.callFunc(() => {
                    cc.audioEngine.playEffect(ThemeHotChili.AudioPath + 'fg_select.mp3');
                }),
                cc.scaleTo(0.2, 1.1),
                cc.scaleTo(0.1, 1)
            ));

            TimerCallFunc.addCallFunc(() => {
                this.selectNode[i].runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(() => {
                        this.blingIdle[i].setAnimation(0, "animation", false);
                    }),
                    cc.scaleTo(0.58, 1.05),
                    cc.scaleTo(0.58, 1),
                    cc.delayTime(3.4) //(0.58 * 3 + 0.58 + 0.58 + 0.5)
                )));
            }, 1.4 + (0.58) * (i - 1), null, this);

            TimerCallFunc.addCallFunc(() => {
                this.btn[i].enabled = true;
            }, 1.4, null, this);
        }
        TimerCallFunc.addCallFunc(() => {
            AudioEngine.playMusic(ThemeHotChili.AudioPath + "fgch_bgm.mp3", true);
        }, 0.5, null, this);
        
        TimerCallFunc.addCallFunc(() => {
            AudioEngine.playEffect(ThemeHotChili.AudioPath + "fgchoose.mp3", false);
        }, 1.4, null, this);
        
        this._setCascadeOpacityEnabled(true);
        
      },

      refreshLanguage() {
        if (this.select && !this.select.isValid) {
            this.select.setAnimation(0, bole.translateAnimation("title", this.select), true);
        }
        for (let i = 1; i <= 4; i++) {
            if (this.freeGames[i] && !this.freeGames[i].isValid) {
                this.freeGames[i].setTexture(bole.translateImage("selectFree", ThemeHotChili.themeId));
            }
            if (this.with[i] && !this.with[i].isValid) {
                this.with[i].setTexture(bole.translateImage("selectWith", ThemeHotChili.themeId));
            }
            if (this.rows[i] && !this.rows[i].isValid) {
                this.rows[i].setTexture(bole.translateImage("rows", ThemeHotChili.themeId));
            }
        }
    }
    
      
  });
  