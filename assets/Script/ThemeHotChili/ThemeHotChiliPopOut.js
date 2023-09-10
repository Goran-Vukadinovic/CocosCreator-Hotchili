ThemeHotChiliPopOut = cc.Class({
    extends: cc.Node,
    ctor() {
        var popupType = arguments[0];
        var para1 = arguments[1];
        var para2 = arguments[2];
        var para3 = arguments[3];
        var para4 = arguments[4];
        this.init(popupType, para1, para2, para3, para4);
    },
    //   self.popList，self.backList   分批弹入及收回，每个弹窗都需要加
    //   self.popList   弹入的节点及顺序，可根据每个弹窗自行修改顺序
    //   self.backList  弹窗收回的节点及顺序，可根据每个弹窗自行修改顺序
    init(popupType, para1, para2, para3, para4) {
        if (popupType === ThemeHotChili.PopupType.FreeGamePopIn) {
            this.board = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/TC_FG_diban", ThemeHotChili.SpinePath + "fg/TC_FG_diban.atlas");
            this.board.setPosition(0.5, 12.5);
            this.board.setAnimation(0, "diban", true);
            this.addChild(this.board);
    
            this.title = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/TC_ty_title", ThemeHotChili.SpinePath + "ng/TC_ty_title.atlas");
            this.title.setAnimation(0, "title1", true);
            this.title.setPosition(0.5, 205);
            this.addChild(this.title, 1);
    
            this.label1 = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/TC_ty_title", ThemeHotChili.SpinePath + "ng/TC_ty_title.atlas");
            this.label1.setAnimation(0, "title2", true);
            this.label1.setPosition(1, 134);
            this.addChild(this.label1, 1);
    
            this.fgCount = new cc._Sprite(ThemeHotChili.ImgPath + "fg/fgCount.png");
            this.fgCount.setPosition(0, 37);
            this.addChild(this.fgCount, 2);
    
            this.label2 = new cc._Sprite(ThemeHotChili.ImgPath + "fg/freeGames.png");
            this.label2.setPosition(1.5, -57.5);
            this.addChild(this.label2, 1);
    
            this.label3 = new cc._Sprite(ThemeHotChili.ImgPath + "fg/with.png");
            this.label3.setPosition(0, -98);
            this.addChild(this.label3, 1);
    
            this.startBtn = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/TC_ty_button", ThemeHotChili.SpinePath + "ng/TC_ty_button.atlas");
            this.startBtn.setAnimation(0, "button", true);
            this.startBtn.setPosition(0, -176);
            this.addChild(this.startBtn, 2);
    
            this.label4 = new cc._Sprite(ThemeHotChili.ImgPath + "ng/fgStartBtn.png");
            this.label4.setPosition(0, -176);
            this.addChild(this.label4, 1);
    
            this.start = new cc._Sprite(ThemeHotChili.ImgPath + "fg/start.png");
            this.start.setPosition(0, -171);
            this.addChild(this.start, 1);
    
            this.btn = new cc._Button(ThemeHotChili.ImgPath + "ng/fgStartBtn.png", ThemeHotChili.ImgPath + "ng/fgStartBtn.png", ThemeHotChili.ImgPath + "ng/fgStartBtn.png");
            this.btn.setPosition(0, -176);
            this.btn.setOpacity(0);
            this.btn.setTouchEnabled(true);
            const touch = function(sender, eventType) {
                if (eventType === ccui.TouchEventType.began) {
                } else if (eventType === ccui.TouchEventType.ended) {
                    this.label4.setColor(cc.color(128, 128, 128));
                    cc.audioEngine.playEffect(ThemeHotChili.AudioPath + "button.mp3");
                    this.btn.setTouchEnabled(false);
                    ThemeHotChili.gameLayer.stopFreeGameTip();
                }
            };
            this.btn.addTouchEventListener(touch);
            this.addChild(this.btn, 10);
    
            this.popList = [
                [this.board],
                [this.title, this.label1],
                [this.label2, this.fgCount, this.label3],
                [this.startBtn, this.label4, this.start, this.btn]
            ];
            this.backList = [
                [this.startBtn, this.label4, this.start, this.btn],
                [this.board],
                [this.label2, this.fgCount, this.label3],
                [this.title, this.label1]
            ];
        } else if (popupType === ThemeHotChili.PopupType.FreeGamePopAdd) {
            this.board = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/TC_FG_bg", ThemeHotChili.SpinePath + "fg/TC_FG_bg.atlas");
            this.board.setPosition(0, 0);
            this.board.setAnimation(0, "bg", true);
            this.addChild(this.board);
            
            this.title = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/TC_FG_title", ThemeHotChili.SpinePath + "fg/TC_FG_title.atlas");
            this.title.setAnimation(0, bole.translateAnimation("title", this.title), true);
            this.title.setPosition(-0.5, 267);
            this.addChild(this.title,1);
            
            this.youWin_CN = new cc.Node();
            this.youWin_CN.setName("youWin_CN");
            this.youWin_CN.setPosition(0, 0);
            this.addChild(this.youWin_CN, -100);
            this.youWin_EN = new cc.Node();
            this.youWin_EN.setName("youWin_EN");
            this.youWin_EN.setPosition(0.5, 138.5);
            this.addChild(this.youWin_EN, 1);
            this.label1 = bole.translateNode("youWin", this);
            var tempNode2 = new cc._Sprite(ThemeHotChili.ImgPath + 'fg/youWin.png');
            this.label1.addChild(tempNode2);
            
            this.count_CN = new cc.Node();
            this.count_CN.setName("count_CN");
            this.count_CN.setPosition(1, 51);
            this.addChild(this.count_CN, 1);
            this.count_EN = new cc.Node();
            this.count_EN.setName("count_EN");
            this.count_EN.setPosition(1, 16);
            this.addChild(this.count_EN, 1);
            this.fgCount = bole.translateNode("count", this);
            var tempNode = new cc._LabelBMFont('', ThemeHotChili.ImgPath + 'fg/fgSelectNum.fnt');
            tempNode.setString(para1);
            this.fgCount.addChild(tempNode);
            
            this.extra_CN = new cc.Node();
            this.extra_CN.setName("extra_CN");
            this.extra_CN.setPosition(1, -99.5);
            this.addChild(this.extra_CN, 1);
            this.extra_EN = new cc.Node();
            this.extra_EN.setName("extra_EN");
            this.extra_EN.setPosition(0.5, -109);
            this.addChild(this.extra_EN, 1);
            this.label2 = bole.translateNode("extra", this);
            var tempNode3 = new cc._Sprite(bole.translateImage("extra", ThemeHotChili.themeId));
            this.label2.addChild(tempNode3);
            
            this.popList = [
                [this.board],
                [this.title, this.fgCount],
                [this.label1, this.label2]
            ];
            this.backList = [
                [this.board],
                [this.title, this.fgCount],
                [this.label1, this.label2],
            ];
            
        }
        else if (popupType == ThemeHotChili.PopupType.FreeGamePopOut) {
            this.board = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/TC_FG_bg", ThemeHotChili.SpinePath + "fg/TC_FG_bg.atlas");
            this.board.setPosition(0, 0);
            this.board.setAnimation(0, "bg", true);
            this.addChild(this.board);
        
            this.title = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "fg/TC_FG_JS_title", ThemeHotChili.SpinePath + "fg/TC_FG_JS_title.atlas");
            this.title.setAnimation(0, bole.translateAnimation("title", this.title), true);
            this.title.setPosition(1, 260);
            this.addChild(this.title, 1);
        
            this.label2 = new cc._Sprite(ThemeHotChili.ImgPath + 'fg/numFrame.png');
            this.label2.setPosition(1, 47.5);
            this.addChild(this.label2, 1);
        
            this.fgCount = new cc._LabelBMFont('', ThemeHotChili.ImgPath + "ng/jpWinNum.fnt"); //字体显示
            this.fgCount.setString(para1);
            this.fgCount.setPosition(373, 100);
            this.label2.addChild(this.fgCount, 2);
            bole.setLabelWidth(this.fgCount, 640);      
            
        
            this.startBtn = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/fgStartBtn.png');
            this.startBtn.setPosition(0.5, -128);
            this.addChild(this.startBtn, 1);
        
            this.start = new cc._Sprite(bole.translateImage("collect", ThemeHotChili.themeId));
            this.start.setPosition(0.5, -128);
            this.addChild(this.start, 1);
            this.btn = new cc._Button(ThemeHotChili.ImgPath + "ng/fgStartBtn.png", ThemeHotChili.ImgPath + "ng/fgStartBtn.png", ThemeHotChili.ImgPath + "ng/fgStartBtn.png");
            this.btn.setPosition(0.5, -128);
            this.btn.setOpacity(0);
            this.btn.setTouchEnabled(true);
            let touch = function(sender, eventType) {
                if (eventType == ccui.TouchEventType.began) {
                } else if (eventType == ccui.TouchEventType.ended) {
                    this.startBtn.setColor(cc.color(128, 128, 128));
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + 'button.mp3');
                    this.btn.setTouchEnabled(false);
                    ThemeHotChili.gameLayer.stopFreeGameOut();
                }
            }.bind(this);
            this.btn.addTouchEventListener(touch);
            this.addChild(this.btn, 10);
            
            this.popList = [
                [this.board],
                [this.title],
                [this.label2],
                [this.startBtn, this.start, this.btn]
            ];
            this.backList = [
                [this.startBtn, this.start, this.btn],
                [this.board],
                [this.label2],
                [this.title]
            ];
        }
        if (popupType === ThemeHotChili.PopupType.BonusGamePopIn) {
            this.board = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/TC_BG_diban", ThemeHotChili.SpinePath + "bg/TC_BG_diban.atlas");
            this.board.setPosition(0, 12);
            this.board.setAnimation(0, "diban", true);
            this.addChild(this.board);
        
            this.title = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/TC_ty_title", ThemeHotChili.SpinePath + "ng/TC_ty_title.atlas");
            this.title.setAnimation(0, "title1", true);
            this.title.setPosition(0.5, 204.5);
            this.addChild(this.title, 1);
        
            this.label1 = new cc._Sprite(ThemeHotChili.ImgPath + 'bg/youWon.png');
            this.label1.setPosition(-1.5, 130.5);
            this.addChild(this.label1, 1);
        
            this.royalTest = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/TC_BG_wenan", ThemeHotChili.SpinePath + "bg/TC_BG_wenan.atlas");
            this.royalTest.setPosition(2, -4.5);
            this.addChild(this.royalTest, 1);
        
            this.startBtn = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/TC_ty_button", ThemeHotChili.SpinePath + "ng/TC_ty_button.atlas");
            this.startBtn.setAnimation(0, 'button', true);
            this.startBtn.setPosition(0, -177);
            this.addChild(this.startBtn, 2);
        
            this.label4 = new cc._Sprite(ThemeHotChili.ImgPath + 'ng/fgStartBtn.png');
            this.label4.setPosition(0, -177);
            this.addChild(this.label4, 1);
        
            this.start = new cc._Sprite(ThemeHotChili.ImgPath + 'bg/start.png');
            this.start.setPosition(0, -177);
            this.addChild(this.start, 1);
        
            this.btn = new cc._Button(ThemeHotChili.ImgPath + "ng/fgStartBtn.png", ThemeHotChili.ImgPath + "ng/fgStartBtn.png", ThemeHotChili.ImgPath + "ng/fgStartBtn.png");
            this.btn.setPosition(0, -177);
            this.btn.setOpacity(0);
            this.btn.setTouchEnabled(true);
            let touch = function (sender, eventType) {
                if (eventType === ccui.TouchEventType.began) {
                } else if (eventType === ccui.TouchEventType.ended) {
                    this.label4.setColor(cc.color(128, 128, 128));
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + 'button.mp3');
                    this.btn.setTouchEnabled(false);
                    ThemeHotChili.gameLayer.bgBegin();
                }
            };
            this.btn.addTouchEventListener(touch);
            this.addChild(this.btn, 10);
            
            this.runAction(cc.sequence(
                cc.delayTime(1.2),
                cc.callFunc(function () {
                    this.royalTest.setAnimation(0, "title_intro", false);
                    this.royalTest.addAnimation(0, "title_idle", true);
                }, this),
                cc.delayTime(0.5),
                cc.callFunc(function () {
                    this.btn.setTouchEnabled(true);
                }, this)
            ));
            
            this.popList = [
                [this.board],
                [this.title, this.label1],
                [this.royalTest],
                [this.startBtn, this.label4, this.start, this.btn]
            ];
            this.backList = [
                [this.startBtn, this.label4, this.start, this.btn],
                [this.board],
                [this.royalTest],
                [this.title, this.label1]
            ];
        }
        if (popupType === ThemeHotChili.PopupType.BonusGamePopOut) {
            this.board = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/TC_BG_diban", ThemeHotChili.SpinePath + "bg/TC_BG_diban.atlas");
            this.board.setPosition(0, 12);
            this.board.setAnimation(0, "diban", true);
            this.addChild(this.board);
        
            this.title = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/TC_ty_title", ThemeHotChili.SpinePath + "ng/TC_ty_title.atlas");
            this.title.setAnimation(0, "title1", true);
            this.title.setPosition(0.5, 204.5);
            this.addChild(this.title, 1);
        
            this.label1 = cc._Sprite.create(ThemeHotChili.ImgPath + 'bg/youWon.png');
            this.label1.setPosition(0, 112.5);
            this.addChild(this.label1, 1);
        
            this.label2 = cc._Sprite.create(ThemeHotChili.ImgPath + 'bg/numFrame.png');
            this.label2.setPosition(0.5, -12);
            this.addChild(this.label2, 1);
        
            this.fgCount = new cc._LabelBMFont(ThemeHotChili.ImgPath + "ng/fgWinNum.fnt", ""); //字体显示
            this.fgCount.setString(para1);
            this.fgCount.setPosition(441.5, 103);
            this.label2.addChild(this.fgCount, 2);
            bole.setLabelWidth(this.fgCount, 680);
        
            this.startBtn = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "ng/TC_ty_button", ThemeHotChili.SpinePath + "ng/TC_ty_button.atlas");
            this.startBtn.setAnimation(0, 'button', true);
            this.startBtn.setPosition(0, -177);
            this.addChild(this.startBtn, 2);
        
            this.label4 = cc._Sprite.create(ThemeHotChili.ImgPath + 'ng/fgStartBtn.png');
            this.label4.setPosition(0, -177);
            this.addChild(this.label4, 1);
        
            this.start = cc._Sprite.create(ThemeHotChili.ImgPath + 'bg/collect.png');
            this.start.setPosition(0, -177);
            this.addChild(this.start, 1);
        
            this.btn = cc._Button.create(ThemeHotChili.ImgPath + "ng/fgStartBtn.png", ThemeHotChili.ImgPath + "ng/fgStartBtn.png", ThemeHotChili.ImgPath + "ng/fgStartBtn.png");
            this.btn.setPosition(0, -177);
            this.btn.setOpacity(0);
            this.btn.setTouchEnabled(true);
            let touch = function(sender, eventType) {
                if (eventType === ccui.TouchEventType.began) {
                } else if (eventType === ccui.TouchEventType.ended) {
                    this.label4.setColor(cc.color(128, 128, 128));
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + 'button.mp3');
                    this.btn.setTouchEnabled(false);
                    ThemeHotChili.gameLayer.bgOver();
                }
            };
            this.btn.addTouchEventListener(touch);
            this.addChild(this.btn, 10);
            
            this.popList = [
                [this.board],
                [this.title, this.label1],
                [this.label2],
                [this.startBtn, this.label4, this.start, this.btn]
            ];
            this.backList = [
                [this.startBtn, this.label4, this.start, this.btn],
                [this.board],
                [this.label2],
                [this.title, this.label1]
            ];
        }
        if (popupType === ThemeHotChili.PopupType.GameFever) {
            let gameFeverTypeTip = ThemeHotChili.gameLayer.gameFeverNode.getGameFeverType() === 3 ? 2 : 1;
            let textPath = ["pop_game_fever_text", "pop_game_fever_text_golden"][gameFeverTypeTip - 1];
            this.board = FONTS.addImage(ThemeHotChili.ImgPath + "gameFeverBoard.png");
            this.addChild(this.board);
            this.board.setPosition(cc.v2(0, -9));
        
            this.label1 = new cc._Sprite(bole.translateImage(textPath, ThemeHotChili.themeId));
            this.addChild(this.label1);
            this.label1.setPosition(-25, 131);
        
            this.collectBtn = FONTS.addImage(bole.translateImage("pop_game_fever_btn", ThemeHotChili.themeId));
            this.collectBtn.setPosition(cc.v2(0, -207));
            this.addChild(this.collectBtn, 4);
        
            this.btn = new cc._Button(ThemeHotChili.ImgPath + "gameFeverBtn.png", ThemeHotChili.ImgPath + "gameFeverBtn.png", ThemeHotChili.ImgPath + "gameFeverBtn.png");
            this.btn.setPosition(cc.v2(0, -213));
            let touch = function(sender, eventType) {
                if (eventType === ccui.TouchEventType.began) {
                    this.collectBtn.setColor(cc.color(150, 150, 150));
                    this.btn.setColor(cc.color(150, 150, 150));
                } else if (eventType === ccui.TouchEventType.ended) {
                    this.collectBtn.setColor(cc.color(255, 255, 255));
                    this.btn.setColor(cc.color(255, 255, 255));
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + "button.mp3");
                    this.btn.setTouchEnabled(false);
                    ThemeHotChili.gameLayer.destructGameFeverPop();
                } else if (eventType === ccui.TouchEventType.canceled) {
                    this.collectBtn.setColor(cc.color(255, 255, 255));
                    this.btn.setColor(cc.color(255, 255, 255));
                }
            };
            this.btn.addTouchEventListener(touch);
            this.addChild(this.btn, 3);
            this.btn.setTouchEnabled(false);
        
            this.popList = [
                [this.board],
                [this.label1],
                [this.collectBtn, this.btn]
            ];
        
            this.backList = [
                [this]
            ];
        }
        if (popupType === ThemeHotChili.PopupType.JpPopOut) {
            this.jp = ["grand", "maxi", "major", "minor", "mini"];
            this.board = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/TC_JP_xiaolajiao", ThemeHotChili.SpinePath + "bg/TC_JP_xiaolajiao.atlas");
            this.board.setPosition(cc.v2(0, 0));
            this.addChild(this.board);
            this.board.setAnimation(0, bole.translateAnimation(this.jp[para1 - 1] + "_chuxian", this.board), false);
            this.board.addAnimation(0, bole.translateAnimation(this.jp[para1 - 1] + "_daiji", this.board), true);
        
            this.frameNode = new cc.Node();
            this.addChild(this.frameNode, 1);
        
            this.label1 = new cc._Sprite(ThemeHotChili.ImgPath + "bg/coin_frame.png");
            this.label1.setPosition(cc.v2(1, -35.5));
            this.frameNode.addChild(this.label1, 1);
        
            this.bgCount = new cc._LabelBMFont("", ThemeHotChili.ImgPath + "ng/jpWinNum.fnt");
            this.bgCount.setPosition(cc.v2(0.5, -47));
            this.frameNode.addChild(this.bgCount, 2);
            bole.setLabelWidth(this.bgCount, 640);
            this.bgCount.setString(bole.num_2_str(para2));
        
            inherit(this.bgCount, LabelNumRoll);
            this.bgCount.nrInit(0, 20);
        
            this.multiNode = new cc.Node();
            this.frameNode.addChild(this.multiNode, 1);
            this.multiNode.setPosition(cc.v2(0, 40));
            this.bling = new sp._SkeletonAnimation(ThemeHotChili.SpinePath + "bg/TC_JP_chengbei", ThemeHotChili.SpinePath + "bg/TC_JP_chengbei.atlas");
            this.bling.setPosition(cc.v2(-61.5, 0));
            this.multiNode.addChild(this.bling, 1);
            this.leftX = new cc._Sprite(ThemeHotChili.ImgPath + "bg/X.png");
            this.leftX.setPosition(cc.v2(-61.5, 0));
            this.multiNode.addChild(this.leftX, 1);
            this.leftNum = new cc._Sprite(ThemeHotChili.ImgPath + "bg/1.png");
            this.leftNum.setPosition(cc.v2(-61.5, 0));
            this.multiNode.addChild(this.leftNum, 1);
        
            this.midLine = new cc._Sprite(ThemeHotChili.ImgPath + "bg/midLine.png");
            this.midLine.setPosition(cc.v2(1.5, 3));
            this.multiNode.addChild(this.midLine, 1);
        
            this.rightX = new cc._Sprite(ThemeHotChili.ImgPath + "bg/X.png");
            this.rightX.setPosition(cc.v2(61.5, 0));
            this.multiNode.addChild(this.rightX, 1);
            this.rightNum = new cc._Sprite(ThemeHotChili.ImgPath + "bg/" + para4 + ".png");
            this.rightNum.setPosition(cc.v2(61.5, 0));
            this.multiNode.addChild(this.rightNum, 1);
            this.label4 = new cc._Sprite(ThemeHotChili.ImgPath + "ng/jpBtn.png");
            this.label4.setPosition(cc.v2(0.5, -196));
            this.addChild(this.label4, 1);
            this.label4.setScale(0);
            
            this.start = new cc._Sprite(bole.translateImage("collect", ThemeHotChili.themeId));
            this.start.setPosition(cc.v2(0.5, -196));
            this.addChild(this.start, 1);
            this.start.setScale(0);
            
            this.btn = new cc._Button(ThemeHotChili.ImgPath + "ng/jpBtn.png", ThemeHotChili.ImgPath + "ng/jpBtn.png", ThemeHotChili.ImgPath + "ng/jpBtn.png");
            this.btn.setPosition(cc.v2(0.5, -196));
            this.btn.setOpacity(0);
            this.btn.setTouchEnabled(true);
            var touch = function(sender, eventType) {
                if (eventType === ccui.TouchEventType.began) {
                } else if (eventType === ccui.TouchEventType.ended) {
                    this.label4.setColor(cc.color(128, 128, 128));
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + "button.mp3");
                    this.btn.setTouchEnabled(false);
                    ThemeHotChili.gameLayer.jpEnd();
                }
            }.bind(this);
            this.btn.addTouchEventListener(touch);
            this.addChild(this.btn, 10);
            this.btn.setScale(0);
            
            var num = para2;
            for (var i = 1; i < para4; i++) {
                this.runAction(cc.sequence(
                    cc.delayTime(1 + (2.4 - 0.2) * (i - 1) + 1 - 0.3),
                    cc.callFunc(function () {
                        //AudioEngine.playEffect(ThemeHotChili.AudioPath + "chilliman_muti.mp3", false)
                        this.board.setAnimation(0, bole.translateAnimation(this.jp[para1] + "_chufa", this.board), false);
                        this.board.addAnimation(0, bole.translateAnimation(this.jp[para1] + "_daiji", this.board), true);
                    }, this),
                    cc.delayTime(0.8),
                    cc.callFunc(function () {
                        if (i === 1) {
                            ThemeHotChili.gameLayer.jackpotLayer.startMimic(para1, para3);
                            ThemeHotChili.gameLayer.jackpotLayer.jackpotNumList[para1].setString(bole.num_2_str(para3));
                            if (para1 >= 1 && para1 <= 3) {
                                ThemeHotChili.gameLayer.jackpotLayer.jackpotNumDark[para1].setString(bole.num_2_str(para3));
                            }
                        }
                        this.leftNum.runAction(cc.sequence(
                            cc.scaleTo(0.3, 1.8),
                            cc.scaleTo(0.2, 1)
                        ));
                        this.leftX.runAction(cc.sequence(
                            cc.scaleTo(0.3, 1.8),
                            cc.scaleTo(0.2, 1)
                        ));
                        this.bling.setAnimation(0, "chengbei", false);
                        AudioEngine.playEffect(ThemeHotChili.AudioPath + "bg_muti.mp3", false);
                    }, this),
                    cc.delayTime(0.5),
                    cc.callFunc(function () {
                        AudioEngine.playEffect(ThemeHotChili.AudioPath + "jp_up" + i + ".mp3", false);
            
                        this.leftNum.setTexture(ThemeHotChili.ImgPath + "bg/" + (i + 1) + ".png");
                        this.bgCount.nrStartRoll(parseInt(num), parseInt(num + para3), 1);
                        num = num + para3;
                    }, this)
                ));
            }
            this.runAction(cc.sequence(
                cc.delayTime(1 + 2.4 * (para4 - 1) + 2),
                cc.callFunc(function () {
                    this.label4.runAction(cc.sequence(
                        cc.scaleTo(0.33, 1.2),
                        cc.scaleTo(0.17, 0.9),
                        cc.scaleTo(0.17, 1)
                    ));
                    this.start.runAction(cc.sequence(
                        cc.scaleTo(0.33, 1.2),
                        cc.scaleTo(0.17, 0.9),
                        cc.scaleTo(0.17, 1)
                    ));
                    this.btn.runAction(cc.sequence(
                        cc.scaleTo(0.33, 1.2),
                        cc.scaleTo(0.17, 0.9),
                        cc.scaleTo(0.17, 1),
                        cc.callFunc(function () {
                            this.btn.setTouchEnabled(true);
                        }, this)
                    ));
                    //AudioEngine.playEffect(ThemeHotChili.AudioPath + "jpMulti" + para4 + ".mp3", false);
                }, this)
            ));
            
            this.popList = [
                [this.frameNode],
                //[this.label4, this.start, this.btn]
            ];
            this.backList = [
                [this.label4, this.start, this.btn],
                [this.frameNode],
            ];
        }
        this._setCascadeOpacityEnabled(true);
            
        return true;
    },
    performPop(mode, callback, isJp) {
        if (this.btn) {
            this.btn.setTouchEnabled(false);
        }
        if (mode == popState.Expand) {
            for (let i = 0; i < this.popList.length; i++) {
                const itemList = this.popList[i];
                for (let j = 0; j < itemList.length; j++) {
                    const v = itemList[j];
                    if (v && !v.isValid) {
                        v.setScale(0.01);
                    }
                }
            }
    
            let cnt = 0;
            if (isJp) {
                cnt = 3;
            }
            for (let i = 0; i < this.popList.length; i++) {
                const itemList = this.popList[i];
                for (let j = 0; j < itemList.length; j++) {
                    const v = itemList[j];
                    if (v && !v.isValid) {
                        v.runAction(cc.sequence(
                            cc.delayTime(cnt * 0.1),
                            cc.scaleTo(0.33, 1.2),
                            cc.scaleTo(0.17, 0.9),
                            cc.scaleTo(0.17, 1)
                        ));
                    }
                }
                cnt++;
            }
            this.runAction(cc.sequence(
                cc.delayTime(cnt * 0.1 + 0.5),
                cc.callFunc(function () {
                    if (this.btn && !isJp) {
                        this.btn.setTouchEnabled(true);
                    }
                }, this)
            ));
        } else if (mode == popState.Shrink) {
            if (this.btn) {
                this.btn.setTouchEnabled(false);
            }
            this.runAction(cc.sequence(
                cc.callFunc(function () {
                    AudioEngine.playEffect(ThemeHotChili.AudioPath + 'popup.mp3', false);
                }),
                cc.scaleTo(0.1, 1.1),
                cc.scaleTo(0.23, 1.2),
                cc.scaleTo(0.17, 0),
                cc.callFunc(function () {
                    callback();
                })
            ));
        }
    }
    
    

});
