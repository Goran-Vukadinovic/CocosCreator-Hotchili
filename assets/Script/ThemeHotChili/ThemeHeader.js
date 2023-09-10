HeaderLevel = require('./ThemeHeaderLevel');

let HeaderTreasureBowlShowFlag = false;
let HeaderGoldenWheelShowFlag = false;

const PIC_PATH = 'header/';
ThemeHeader = cc.Class({
    extends: cc.Node,
    name:"ThemeHeader",
    ctor:function () {
        var inLobby = arguments[0];
        this.animationScaleX = 1.0;
        this.animationScaleY = 1.0;
        var LOBBY = inLobby;
        if (LOBBY) {
            this.csb = PIC_PATH + "res/lobbyheader.csb";
            this.animationScaleX = 1.0;
            this.animationScaleY = 1.0;
        }
        else {
            if (SCREEN_ORIENTATION.HORIZONTAL == bole.getScreenOrientation()) {
                this.csb = PIC_PATH + "res/header.csb";
                this.animationScaleX = 1.0;
                this.animationScaleY = 0.85;
            } else if (SCREEN_ORIENTATION.VERTICAL == bole.getScreenOrientation()) {
                this.csb = PIC_PATH + "res/V_header.csb";
                this.animationScaleX = 0.68;
                this.animationScaleY = 0.79;
            }
        }

        this.node = cc.csLoader.createNode(this.csb);
        this.addChild(this.node);

        this.isLowPhone = bole.isLowQualityDevice();

        this.bg = this.node.getChildByName('background');
        this.coinsFrame = this.node.getChildByName("coins_frame");
        this.ingotsFrame = this.node.getChildByName("ingots_frame");

        if (this.node.getChildByName("back")) {
            this.node.getChildByName("back").setVisible(false);
        }

        if (bole.notNull(this.ingotsFrame)) {
            var ingotBtnPath = 'commonpics/empty.png'
            var ingotButton = new cc._Button(ingotBtnPath, ingotBtnPath, ingotBtnPath);
            ingotButton.setScaleX(this.ingotsFrame.getBoundingBox().width / ingotButton.getBoundingBox().width);
            ingotButton.setScaleY(this.ingotsFrame.getBoundingBox().height / ingotButton.getBoundingBox().height);
            ingotButton.setPosition(this.ingotsFrame.getPosition());
            this.node.addChild(ingotButton);

            var ingotEvent = function (sender, eventType) {
                if (eventType == ccui.Widget.TOUCH_ENDED) {
                    //bole.potp:send('stamp_bingo_sale', {})
                    //bole.showLoading()
                    bole.potp.send('behavior', {page : "jewels"});
                    StoreControl.getInstance().getStoreDialog(2, null, 18);
                }
            };

            ingotButton.addTouchEventListener(ingotEvent);

            ingotButton.setOpacity(0);
        }

        var s = cc.director.getVisibleSize();
        this.node.setPosition(s.width/2, s.height);

        this.scale = 1;
        if (PAD_TAG) {
            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                var scale = s.width / DESIGN_WIDTH;
                this.node.setScale(scale);
                this.scale = scale;
            } else if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
                var scale = s.width / 720;
                this.node.setScale(scale);
                this.scale = scale;
            }
        }

        this.adjustHeaderPanel();

        this.node.getChildByName("feedback").setOpacity(0);
        ///////////////////////////////////////////
        var buyTextSprite = FONTS.addImage(bole.translateImage('header/btn_buy'));
        buyTextSprite.setName('buyTextSprite');
        this.node.getChildByName('buy_text_node').addChild(buyTextSprite);

        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
            buyTextSprite.setTexture(bole.translateImage('header/btn_buy_v'));
        }

        if (!this.isLowPhone) {
            var spBuyBtn;

            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                spBuyBtn = sp._SkeletonAnimation("header/animation/Lobby_button.skel", "header/animation/Lobby_button.atlas");
            }
            else {
                spBuyBtn = sp._SkeletonAnimation("header/animation/vertical/Slot_tian_button.skel", "header/animation/vertical/Slot_tian_button.atlas");
            }

            var size = this.node.getChildByName('buy').getContentSize();
            spBuyBtn.setPosition(size.width/2, size.height/2);

            spBuyBtn.setAnimation(0, "button_B", true)
            this.node.getChildByName('buy').addChild(spBuyBtn);
        }

        var buyTextHalf = FONTS.addImage(bole.translateImage('header/btn_buy_s'))
        var saleTextHalf = FONTS.addImage(bole.translateImage('header/btn_sale'))
        buyTextHalf.setName('text');
        saleTextHalf.setName('text');

        DebugLogSender.getInstance().setData("header_error", {
            node : tostring(bole.notNull(this.node)),
            buy_sale : tostring(bole.notNull(this.node.getChildByName('buy_sale'))),
            buy_btn : tostring(bole.notNull(this.node.getChildByName('buy_sale').getChildByName('buy_btn'))),
            buy_text_node : tostring(bole.notNull(this.node.getChildByName('buy_sale').getChildByName('buy_btn').getChildByName('buy_text_node')))
        });

        this.node.getChildByName('buy_sale').getChildByName('buy_btn').getChildByName('buy_text_node').addChild(buyTextHalf);
        this.node.getChildByName('buy_sale').getChildByName('sale_text_node').addChild(saleTextHalf);

        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
            buyTextHalf.setTexture(bole.translateImage('header/btn_buy_s_v'));
            saleTextHalf.setTexture(bole.translateImage('header/btn_sale_v'));
        }

        DebugLogSender.getInstance().clear();

        if (!this.isLowPhone) {
            var spBuyBtnHalf;

            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                spBuyBtnHalf = sp._SkeletonAnimation("header/animation/Lobby_button.skel", "header/animation/Lobby_button.atlas");
            }
            else {
                spBuyBtnHalf = sp._SkeletonAnimation("header/animation/vertical/Slot_tian_button.skel", "header/animation/vertical/Slot_tian_button.atlas");
            }

            spBuyBtnHalf.setAnimation(0, "button_L", true)
            var size = this.node.getChildByName('buy_sale').getChildByName('buy_btn').getContentSize();
            spBuyBtnHalf.setPosition(size.width/2, size.height/2);
            this.node.getChildByName('buy_sale').getChildByName('buy_btn').addChild(spBuyBtnHalf);

            var spSaleBtn;
            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                spSaleBtn = sp._SkeletonAnimation("header/animation/Lobby_button.skel", "header/animation/Lobby_button.atlas");
            } else {
                spSaleBtn = sp._SkeletonAnimation("header/animation/vertical/Slot_tian_button.skel", "header/animation/vertical/Slot_tian_button.atlas");
            }
            
            spSaleBtn.setAnimation(0, "button_R", true);
            this.node.getChildByName('buy_sale').getChildByName('sale_btn').addChild(spSaleBtn);
            size = this.node.getChildByName('buy_sale').getChildByName('sale_btn').getContentSize();
            spSaleBtn.setPosition(size.width/2, size.height/2);
        }
        /////////
        //初始化只显示购买按钮，但也先初始化双按钮的显示元素
        if (LobbyControl.getInstance().saleList && Object.keys(LobbyControl.getInstance().saleList).length) {
            this.showBuySaleBtns();
        } else {
            this.showBuyBtn();
        }
        
        if (LOBBY) {
            let avatarShowSize = cc.size(56, 56); //此值与头像大小的比例关系是170/230，这是由头像可视区域的比例决定的
            let stencil = new cc.Sprite('user_info/clip.png');
            let stencilSize = stencil.getContentSize();
            stencil.setScale(avatarShowSize.width / stencilSize.width, avatarShowSize.height / stencilSize.height);
            this.profileClippingNode = new cc.ClippingNode(stencil);
            this.profileClippingNode.setAlphaThreshold(0);
            this.profileClippingNode.setPositionY(2);
            this.node.getChildByName('avatar_node').addChild(this.profileClippingNode);
            // this.avatarSprite = LazySprite.new(Facebook.getAvatar(Facebook.getInstance().getBackendUserID()), avatarShowSize, "commonpics/default_portrait.png")
            // this.profileClippingNode.addChild(this.avatarSprite);
            this.updateAvatarTexture(Facebook.getAvatar(Facebook.getInstance().getBackendUserID()), USER_CENTER_DATA);
        
            this.avatar_frame_btn_click_func = function () {
                bole.playBtnClickSound();
                bole.potp.send('behavior', {page: "user"});
                UserInfoControl.getInstance().loadUserInfo(User.getInstance().user_id);
            };
            this.userInfo = this.node.getChildByName('avatar_frame_btn');
            let userHandler = function (_, eventType) {
                if (eventType === ccui.TouchEventType.ended) {
                    this.avatar_frame_btn_click_func();
                }
            };
            this.userInfo.addTouchEventListener(userHandler);
        
            if (!this.isLowPhone) {
                // let avatarFlash = bole.newRepeatForeverSkeletonAnimation('header/animation/Lobby_headk', 'headk');
                let avatarFlash = sp._SkeletonAnimation("header/animation/Lobby_headk.skel", "header/animation/Lobby_headk.atlas");
                bole.setAnimationLoopWithDelay(avatarFlash, 0, 'headk', NEW_USER_OPTIMIZATION && 3.5 || 0);
                avatarFlash.setPosition(cc.p(this.userInfo.getContentSize().width / 2, this.userInfo.getContentSize().height / 2));
                this.userInfo.addChild(avatarFlash);
            }
        
            this.updateUserRedDot();
            this.showAdNode();
        }
        
        //扫光动画
        if (!this.isLowPhone) {
            if (bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
                let spHeaderLight = sp._SkeletonAnimation("header/animation/Lobby_tian_glow.skel", "header/animation/Lobby_tian_glow.atlas");
                spHeaderLight.setPositionY(21);
                spHeaderLight.setAnimation(0, "tian_glow", true);
                this.node.getChildByName("sp_light").addChild(spHeaderLight, 1);
            } else {
                let spHeaderLight = sp._SkeletonAnimation("header/animation/vertical/Slot_tian_glow.skel", "header/animation/vertical/Slot_tian_glow.atlas");
                spHeaderLight.setPositionY(20);
                spHeaderLight.setAnimation(0, "tian_glow", true);
                this.node.getChildByName("sp_light").addChild(spHeaderLight, 1);
            }
        }
        
        if (this.node.getChildByName('floating_label_node')) {
            this.tipNode = new cc.Node();
            this.tipNode.setPosition(this.node.getChildByName('floating_label_node').getPosition());
            this.node.addChild(this.tipNode);
        
            let node = this.node.getChildByName('floating_label_node');
            let btn = new cc._Button();
            let text = new cc.LabelTTF('', '', 18, cc.color(255, 255, 255));
            text.enableOutline(bole.hexToColor('#8c2700'), 2);
            text.setPosition(-4, -11);
            if (bole.isInLobby()) {
                text.setPosition(-13, -11);
            }
            text.setSkewX(10);
            btn.setName('btn');
            text.setName('text');
            node.addChild(btn);
            node.addChild(text);
            bole.setLabelContentWidthLimit(text, 145);
        
            let levelBar = this.node.getChildByName('level').getChildByName('levelbar_bg');
            node.levelBtn = new cc._Button('commonpics/dafu_dialog_btn.png', 'commonpics/dafu_dialog_btn_clicked.png', 'commonpics/dafu_dialog_btn.png');
            node.levelBtn.setOpacity(0);
            node.levelBtn.setName('levelBtn');
            node.levelBtn.setScale(levelBar.getBoundingBox().width / node.levelBtn.getBoundingBox().width * 1.2,
                levelBar.getBoundingBox().height / node.levelBtn.getBoundingBox().height * 1.2);
            let posX = this.node.getChildByName('level').getPositionX();
            let posY = this.node.getChildByName('level').getPositionY();
            posX = posX + levelBar.getBoundingBox().width / 2;
            node.levelBtn.setPosition(posX, posY);
            this.node.addChild(node.levelBtn);
        
            //升级速度更快
            FloatingLabelControl.getInstance().setFloatingLabel(node);
            TimerCallFunc.addScheduleUntilFunc(function () {
                if (bole.scene) {
                    bole.potp.send('check_levelboom', {});
                    return true;
                } else {
                    return false;
                }
            }, 0.01, this, 'check_levelboom');
        }
        
        if (!LOBBY) {
            this.buildMultiNode();
        }
        
        let buyHandler = function (sender, eventType) {
            bole.sinkChildrenOnTouch(sender, eventType);
        
            if (eventType === ccui.TouchEventType.ended) {
                if (LobbyControl.getInstance().showSaleNodeCallback) {
                    LobbyControl.getInstance().showSaleNodeCallback();
                }
                bole.potp.send('behavior', {page: "buy"});
                bole.playBtnClickSound();
                CurrentPaySituation = PAY_SITUATION.USER_CLICK;
                let dialog = StoreControl.getInstance().getStoreDialog(null, null, 6);
                TimerCallFunc.addScheduleUntilFunc(function () {
                    if (dialog) {
                        return true;
                    } else {
                        return false;
                    }
                }, 0.1, this, 'unstoppable');
            }
        };
        
        let saleHandler = function (sender, eventType) {
            bole.sinkChildrenOnTouch(sender, eventType);
        
            if (eventType === ccui.TouchEventType.ended) {
                bole.potp.send('behavior', {page: "sale"});
                bole.playBtnClickSound();
                //LobbyControl.getInstance():showSales(nil, nil, nil, 5)
                LobbyControl.getInstance().getCommonSaleDialog({}, null, 5);
                CurrentPaySituation = PAY_SITUATION.USER_CLICK;
            }
        };
        
        let lobbyHandler = function (sender, eventType) {
            bole.sinkChildrenOnTouch(sender, eventType);
        
            if (eventType === ccui.TouchEventType.ended) {
                if (this.themeCtl.judgeCanReturnToLobby()) {
                    let isForce = this.themeCtl.checkForceEnableToLobby();
                    this.toLobbyScene(isForce, null, null, 0);
                }
            }
        };
        //////////
        this.more_board_scale_0 = 0;
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
            this.more_board_scale_1 = 0.9 * SCREEN_RATIO;
        } else {
            this.more_board_scale_1 = 0.9 * SCREEN_RATIO;
        }
        
        let settingsHandler = function(sender, eventType) {
            bole.sinkChildrenOnTouch(sender, eventType);
        
            if (eventType == ccui.TouchEventType.ended) {
                bole.playBtnClickSound();
                if (bole.isInTheme()) {
                    if (this.more_board_scale != null && this.more_board_scale <= 0.5 * SCREEN_RATIO) {
                        this.btn_settings.setEnabled(false);
                        this.more_board.stopAllActions();
                        this.more_board.setVisible(true);
                        this.more_board.runAction(cc.sequence(
                            cc.spawn(
                                cc.easeBackOut(cc.scaleTo(0.3, this.more_board_scale_1)),
                                cc.fadeIn(0.3)
                            ),
                            cc.callFunc(function() {
                                this.more_board_scale = this.more_board_scale_1;
                                this.btn_settings.setEnabled(true);
                            }, this)
                        ));
                    } else {
                        if (this.btn_settings != null) {
                            this.btn_settings.setEnabled(false);
                        }
                        if (this.more_board && !cc.sys.isObjectValid(this.more_board)) {
                            this.more_board.stopAllActions();
                            this.more_board.runAction(cc.sequence(
                                cc.spawn(
                                    cc.easeBackIn(cc.scaleTo(0.3, this.more_board_scale_0)),
                                    cc.fadeOut(0.3)
                                ),
                                cc.callFunc(function() {
                                    this.more_board_scale = this.more_board_scale_0;
                                    this.btn_settings.setEnabled(true);
                                    this.more_board.setVisible(false);
                                }, this)
                            ));
                        }
                    }
                } else {
                    bole.potp.send('behavior', { page: "settings" });
                    SettingControl.getInstance().showSettingDialog();
                }
            }
        }
        
        let backHandler = function(_, eventType) {
            if (eventType == ccui.TouchEventType.ended) {
                bole.playBtnClickSound();
        
                let callback;
                if (bole.isInLobby()) {
                    if ('Friends' == bole.scene.main.coveringNodeKey) {
                        FriendsControl.getInstance().hideFriendsLayer();
                    } else if ('QuestStay' == bole.scene.main.coveringNodeKey) {
                        QuestStayControl.getInstance().hideMapDialog();
                        bole.scene.setPopOutState(false);
                    } else if ('QuestNewUser' == bole.scene.main.coveringNodeKey) {
                        QuestNewUserControl.getInstance().hideMapDialog();
        
                        callback = function() {
                            let lastThemeId = NewUserControl.getInstance().getGroupData("20220712A", "last_theme_id");
                            if (lastThemeId) {
                                PLAY_SCENE_CALLED_ID = lastThemeId;
                                LobbyThemeControl.getInstance().openTheme(lastThemeId);
                                NewUserControl.getInstance().removeGroupData("20220712A", "last_theme_id");
                            } else {
                                bole.scene.setPopOutState(false);
                            }
                        }
                    }
                    bole.scene.main.uncover();
                    bole.scene.main.setVisible(true);
                    if (callback) {
                        callback();
                    }
                }
            }
        }
        
        let feedbackEnterFunc = function() {
            if (BetFeedbackControl.getInstance().feedbackEnterFunc()) {
                bole.potp.send('behavior', { page: "kitty" });
                bole.playBtnClickSound();
                LobbyControl.getInstance().getFeedbackDialog(null, null, 3);
                CurrentPaySituation = PAY_SITUATION.USER_CLICK;
            }
        }
        this.feedbackEnterFunc = feedbackEnterFunc;
        let feedbackHandler = function(_, eventType) {
            if (eventType == ccui.TouchEventType.ended) {
                feedbackEnterFunc();
            }
        }
        
        let hotTodayListener = function() {
            bole.playBtnClickSound();
            if (LobbyControl.getInstance().popup_data == null) {
                return;
            }
            let hot_action_data = LobbyControl.getInstance().popup_data["3"];
            if (hot_action_data != null && hot_action_data.length > 0) {
                LobbyControl.getInstance().hot_index = LobbyControl.getInstance().hot_index + 1;
                if (LobbyControl.getInstance().hot_index > hot_action_data.length) {
                    LobbyControl.getInstance().hot_index = 1;
                }
                let hot_action_obj = hot_action_data[LobbyControl.getInstance().hot_index - 1];
                if (hot_action_obj != null) {
                    if (hot_action_obj.action == "pop") {
                        let popup_dialogs = hot_action_obj.popups;
                        if (popup_dialogs != null && popup_dialogs.length > 0) {
                            let popup_obj = popup_dialogs[0];
                            if (popup_obj != null && isPopupValid(popup_obj.id)) {
                                LobbyControl.getInstance().showPopups(popup_obj);
                            }
                        }
                    } else if (parseInt(hot_action_obj.action) == 6) {
                        LobbyControl.getInstance().getSpecialSaleDialog();
                    }
                }
            }
        }
        this.node.getChildByName("feedback").addTouchEventListener(feedbackHandler);
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
            // this.node.getChildByName("feedback").setPosition(this.node.getChildByName("feedback").getPositionX()-3, this.node.getChildByName("feedback"):getPositionY()-12);
        } else {
            // this.node.getChildByName("feedback").setPosition(this.node.getChildByName("feedback"):getPositionX()-2, this.node.getChildByName("feedback"):getPositionY()-5);
        }
        //////////
        this.cat_icon = new cc.Sprite(res.header.res.cat_icon_png); //猫
        this.cat_ribbon = new cc.Sprite(res.header.res.cat_ribbon_png); //红带子
        this.cat_ribbon.setPositionY(-14);
        this.cat_max = new cc.Sprite(bole.translateImage('header/cat_max')); //已达上限
        this.cat_bonus = new cc.LabelBMFont("", res.header.res.cat_bonus_fnt); //字
        
        this.cat_text_node = new cc.Node();
        this.cat_text_node.setPositionY(-14);
        this.cat_all_node = new cc.Node();
        this.cat_all_node.setPosition(this.node.getChildByName("feedback").getPosition());
        this.node.addChild(this.cat_all_node, 10);
        
        this.cat_all_node.addChild(this.cat_icon);
        this.cat_all_node.addChild(this.cat_ribbon);
        this.cat_all_node.addChild(this.cat_text_node);
        this.cat_text_node.addChild(this.cat_bonus);
        this.cat_text_node.addChild(this.cat_max);
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
          this.cat_all_node.setScale(0.85);
        }
        
        this.node.getChildByName("coins_frame").addTouchEventListener(function(_, eventType) {
          if (eventType == ccui.TouchEventType.ended) {
            bole.playBtnClickSound();
            bole.potp.send('behavior', { page: "coins" });
            CurrentPaySituation = PAY_SITUATION.USER_CLICK;
            var dialog = StoreControl.getInstance().getStoreDialog(null, null, 6);
            TimerCallFunc.addScheduleUntilFunc(function() {
              if (dialog) {
                return true;
              } else {
                return false;
              }
            }, 0.1, this, 'unstoppable');
          }
        });
        this.node.getChildByName("buy").addTouchEventListener(buyHandler);
        this.node.getChildByName('buy_sale').getChildByName('buy_btn').addTouchEventListener(buyHandler);
        this.node.getChildByName('buy_sale').getChildByName('sale_btn').addTouchEventListener(saleHandler);
        this.node.getChildByName("settings").addTouchEventListener(settingsHandler);
        if (this.node.getChildByName("back")) {
          this.node.getChildByName("back").addTouchEventListener(backHandler);
        }
        if (this.node.getChildByName("lobby")) {
          this.node.getChildByName("lobby").addTouchEventListener(lobbyHandler);
        }
        
        //activity center 入口
        var activityEvent = function(_, eventType) {
          if (eventType == ccui.TouchEventType.ended) {
        
            if (!LobbyControl.getInstance().isNewUser) {
              bole.potp.send('behavior', { page: "event_center" });
              this.activityClicked();
            } else if (LobbyControl.getInstance().isNewUser && LoginControl.getInstance().new_user_acts_center_test == 1) {
              bole.potp.send('behavior', { page: "event_center" });
              this.activityClicked();
            } else {
              bole.potp.send('behavior', { page: "hot" });
              hotTodayListener();
            }
          }
        };
        
        this.activityBtn = this.node.getChildByName('hot_btn');
        if (this.activityBtn) {
          this.activityBtn.addTouchEventListener(activityEvent);
          this.activityBtn.setOpacity(0); //按钮与动画有重复的背景，所以将按钮设置为透明
        }
        
        this.updateActivityCenterEntrance();
        
        //msg_node
        var layerColor = new cc._LayerColor(cc.color(0, 0, 0, 255), 600, 250);
        layerColor.setIgnoreAnchorPointForPosition(false);
        layerColor.setAnchorPoint(0.5, 1.0);
        // this.msgRootNode = cc.ClippingNode:create(layerColor);
        this.msgRootNodeLevel = new cc.ClippingNode(layerColor);
        // this.node.getChildByName('msg_node').addChild(this.msgRootNode)
        this.node.getChildByName('msg_node_level').addChild(this.msgRootNodeLevel);
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
          this.node.getChildByName('msg_node').setPosition(this.node.getChildByName('msg_node').getPositionX() - 12,
            this.node.getChildByName('msg_node').getPositionY() + 8);
        }
        
        var clubProgressRoot = this.node.getChildByName('club_progress_root');
        if (clubProgressRoot) {
          this.ingotsNode = new UserIngotNode();
          clubProgressRoot.addChild(this.ingotsNode);
          User.getInstance().setIngots(User.getInstance().getIngots(), 0);
          this.ingotsNodeWorldPos = clubProgressRoot.getParent().convertToWorldSpace(clubProgressRoot.getPosition());
          if (bole.isIphoneX()) {
            this.ingotsNodeWorldPos = cc.p(this.ingotsNodeWorldPos.x, this.ingotsNodeWorldPos.y - 50 * SCREEN_RATIO);
          }
        }
        
        //UserCoinNode
        var coinRoot = this.node.getChildByName('coin_root');
        this.userCoinNode = new UserCoinNode(inLobby);
        coinRoot.addChild(this.userCoinNode);
        User.getInstance().setCoins(User.getInstance().getCoins(), 0);
        
        var spCoin = null;
        var spDiamond = null;
        spCoin = sp._SkeletonAnimation("header/animation/Lobby_money_coin.skel", "header/animation/Lobby_money_coin.atlas");
        spDiamond = sp._SkeletonAnimation("header/animation/Lobby_money_zs.skel", "header/animation/Lobby_money_zs.atlas");
        
        spCoin.setAnimation(0, "coin", true);
        spDiamond.setAnimation(0, "zuanshi", true);
        
        this.node.getChildByName("coin_icon").addChild(spCoin);
        this.spCoin = spCoin;
        
        // if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
        // 	spCoin.setScale(0.9);
        // 	spDiamond.setScale(0.9);
        // }
        
        this.node.getChildByName("ingot_icon").addChild(spDiamond);
        this.spDiamond = spDiamond;
        
        //HeaderLevelNode
        this.levelNode = new HeaderLevel(inLobby);
        this.node.getChildByName('level').addChild(this.levelNode);
        this.updateHeaderLevelBar();
        
        if (LOBBY) {
          this.initBuyAnimation();
        }
        
        this.checkBuyButtonAnimation();
        this.CheckCatStatus(null, true);
        //////////
        if (!inLobby) {
          const touch_callback = function () {
            this.more_board_scale = this.more_board_scale_0;
            this.more_board.opacity = 0;
            this.more_board.visible = false;
            this.more_board.scale = this.more_board_scale;
          };
          
          const onTouchBegan = function (touch, event) {
            return true;
          };
        
          const onTouchEnded = function (touch, event) {
            if (
              this.more_board_scale !== null
              && this.more_board_scale > 0.5 * SCREEN_RATIO
              && this.btn_settings.isEnabled()
            ) {
              this.btn_settings.setEnabled(false);
              this.more_board.stopAllActions();
              this.more_board.runAction(cc.sequence(
                cc.spawn(
                  cc.easeBackIn(cc.scaleTo(0.3, this.more_board_scale_0)),
                  cc.fadeOut(0.3)
                ),
                cc.callFunc(() => {
                  this.btn_settings.setEnabled(true);
                  this.more_board_scale = this.more_board_scale_0;
                  this.more_board.visible = false;
                })
              ));
            }
          };
          
          const listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: onTouchBegan.bind(this),
            onTouchEnded: onTouchEnded.bind(this)
          });
          
          const shieldLayer = new ShieldLayer();
          shieldLayer.layerColor = cc.color(0, 0, 0, 0);
          this.addChild(shieldLayer, 1);
          const eventDispatcher = shieldLayer.getEventDispatcher();
          eventDispatcher.addEventListenerWithSceneGraphPriority(listener, shieldLayer);
        
          if (bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
            this.more_board = cc.load('header/header_more/header_more_new.csb');
          } else {
            this.more_board = cc.load('header/header_more/header_more_new_v.csb');
          }
          
          this.btn_settings = this.node.getChildByName('settings');
          const btn_width = this.btn_settings.getBoundingBox().width;
          this.more_board.setPosition(btn_width / 2 + 10, 10);
          this.more_board.setScale(0);
          this.more_board.opacity = 0;
          this.more_board.visible = false;
          this.more_board_scale = this.more_board_scale_0;
          const pos = this.btn_settings.convertToWorldSpace(this.more_board.getPosition());
          this.more_board.setPosition(this.convertToNodeSpace(pos));
          this.addChild(this.more_board, 1);
          this.more_board.setScale(SCREEN_RATIO);
        
          this.more_board_root = this.more_board.getChildByName('root');
          
          if (bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
            this.mb_profile_btn = this.more_board_root.getChildByName('btn_profile');
            const btnPath = bole.translateImage("header/profile");
            this.mb_profile_btn.loadTextures(btnPath, btnPath, btnPath);
            const profile_callback = function (_, eventType) {
              if (eventType === ccui.Widget.TOUCH_BEGAN) {
                bole.playBtnClickSound();
              } else if (eventType === ccui.Widget.TOUCH_ENDED) {
                touch_callback();
                UserInfoControl.getInstance().loadUserInfo(User.getInstance().user_id);
              }
            };
            
            this.mb_profile_btn.addTouchEventListener(profile_callback);
          }
        
          this.mb_paytable_btn = this.more_board_root.getChildByName('btn_rule');
          this.mb_paytable_btn.loadTextures(
            bole.translateImage("header/game_rules"),
            bole.translateImage("header/game_rules"),
            bole.translateImage("header/game_rules")
          );
          
          this.mb_settings_btn = this.more_board_root.getChildByName('btn_setting');
          this.mb_settings_btn.loadTextures(
            bole.translateImage("header/setting"),
            bole.translateImage("header/setting"),
            bole.translateImage("header/setting")
          );
          
          const paytable_callback = function (_, eventType) {
            if (eventType === ccui.Widget.TOUCH_BEGAN) {
              bole.playBtnClickSound();
            } else if (eventType === ccui.Widget.TOUCH_ENDED) {
              touch_callback();
              if (bole.isInTheme()) {
                if (
                  bole.scene.ctl.footer.paytableView == null
                  && this.paytableView == null
                ) {
                  bole.scene.ctl.theme.touchPaytableCallback();
                  AudioEngine.playEffect('sounds/info/info_page_open.mp3', false);
                  this.paytableView = new PaytableView(bole.scene.ctl);
                  this.paytableView.setName('paytableView');
                  this.paytableView.show();
                  LoginControl.getInstance().addLog({ TARGET_STR_HOLA }, "K0D");
                }
              }
            }
          };
          
          this.mb_paytable_btn.addTouchEventListener(paytable_callback);
        
          const settings_callback = function (_, eventType) {
            if (eventType === ccui.Widget.TOUCH_BEGAN) {
              bole.playBtnClickSound();
            } else if (eventType === ccui.Widget.TOUCH_ENDED) {
              touch_callback();
              SettingControl.getInstance().showSettingDialog();
            }
          };
          
          this.mb_settings_btn.addTouchEventListener(settings_callback);
          
          this.adjustMoreBoard();
        }
        
        //////////
        this.changeUI();

        var updateFunc = function() {
            this.update();
        };
        this.scheduleUpdate(updateFunc);

        this.countdownText = "";

        var onNodeEvent = function (event) {
            if (event == "exit") {
                this.onExit();
            }
        };
        this.registerScriptHandler(onNodeEvent);

        EventCenter.registerEvent(EVT.EVT_SET_RETURN_LOBBY_BLACK, this.setReturnLobbyBlack, this);
        EventCenter.registerEvent(EVT.EVT_SET_RETURN_LOBBY_LIGHT, this.setReturnLobbyLight, this);

        SCHEDLE_EVENT.registerEvent(SCHEDLE_EVENT_NAME.event_on_load, this.onLoad, this);
        this.showRedDot();
    },
});


ThemeHeader.prototype.onLoad = function() {
    if (!cc.SpriteFrameCache.getInstance().isSpriteFramesWithFileLoaded("header/res/header.plist")) {
        cc.SpriteFrameCache.getInstance().addSpriteFrames("header/res/header.plist");
    }
};

ThemeHeader.prototype.onDestroy = function() {
    SCHEDLE_EVENT.removeHandlerEvent(this);
};

ThemeHeader.prototype.onExit = function() {
    EventCenter.removeEvent(EVT.EVT_SET_RETURN_LOBBY_BLACK, this.setReturnLobbyBlack, this);
    EventCenter.removeEvent(EVT.EVT_SET_RETURN_LOBBY_LIGHT, this.setReturnLobbyLight, this);
    this.onDestroy();
};

ThemeHeader.prototype.getIsLowPhone = function() {
    return this.isLowPhone;
};

ThemeHeader.prototype.adjustHeaderPanel = function() {
    var visibleSize = cc.Director.getInstance().getVisibleSize();
    if (bole.isInLobby()) {
        if (!PAD_TAG) {
            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                var deltaX = [-79, -79, -79, -57, -57, -57, -30, -30, -30, 27, 27, 45, 45, 66, 66, 66, 79];
                var adjustList = [
                    this.node.getChildByName("back"), 
                    this.node.getChildByName("avatar_node"), 
                    this.node.getChildByName("avatar_frame_btn"),
                    this.node.getChildByName("coin_icon"), 
                    this.node.getChildByName("coin_root"), 
                    this.node.getChildByName("coins_frame"),
                    this.node.getChildByName("ingot_icon"), 
                    this.node.getChildByName("ingots_frame"), 
                    this.node.getChildByName("club_progress_root"),
                    this.node.getChildByName("feedback"), 
                    this.node.getChildByName("cat_node"), 
                    this.node.getChildByName("floating_label_node"),
                    this.node.getChildByName("level"), 
                    this.node.getChildByName("hot_btn"), 
                    this.node.getChildByName("hot_node"),
                    this.node.getChildByName("hot_red_dot"), 
                    this.node.getChildByName("settings")
                ];
                for (var i = 0; i < adjustList.length; i++) {
                    var scaleX = (deltaX[i]) / (1560 - 1280) * (visibleSize.width - 1280);
                    adjustList[i].setPositionX(adjustList[i].getPositionX() + scaleX);
                }
            }
        }
    } else {
        if (!PAD_TAG) {
            if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                var deltaX = [-79, -57, -57, -57, -30, -30, -30, 27, 27, 45, 45, 66, 79];
                var adjustList = [
                    this.node.getChildByName("lobby"), 
                    this.node.getChildByName("coin_icon"), 
                    this.node.getChildByName("coin_root"),
                    this.node.getChildByName("coins_frame"), 
                    this.node.getChildByName("ingot_icon"), 
                    this.node.getChildByName("ingots_frame"),
                    this.node.getChildByName("club_progress_root"), 
                    this.node.getChildByName("feedback"), 
                    this.node.getChildByName("cat_node"),
                    this.node.getChildByName("floating_label_node"), 
                    this.node.getChildByName("level"), 
                    this.node.getChildByName("multi_node"),
                    this.node.getChildByName("settings")
                ];
                for (var i = 0; i < adjustList.length; i++) {
                    var scaleX = (deltaX[i]) / (1560 - 1280) * (visibleSize.width - 1280);
                    adjustList[i].setPositionX(adjustList[i].getPositionX() + scaleX);
                }
            }
        }
    }
};

ThemeHeader.prototype.updateUserRedDot = function() {
    if (bole.notNull(this.userInfo)) {
        if ((!UserInfoControl.getInstance().isAvatarAllClicked() || !UserInfoControl.getInstance().isAvatarFrameAllClicked()) && (User.getInstance().abType != "A" || User.getInstance().level > 10 || !User.getInstance().isNewUser)) {
            bole.removeSafely(this.userInfo.redDot);
            this.userInfo.redDot = sp._SkeletonAnimation.create(bole.getAnimation("header/animation/Lobby_EventCenter_red"));
            this.userInfo.redDot.setAnimation(0, "red", true);
            this.userInfo.redDot.setPosition(cc.p(this.userInfo.getContentSize().width / 2 + 27, this.userInfo.getContentSize().height / 2 + 20));
            this.userInfo.addChild(this.userInfo.redDot);
        } else {
            bole.removeSafely(this.userInfo.redDot);
        }
    }
};

ThemeHeader.prototype.buildMultiNode = function() {
    if (LobbyControl.getInstance().isModuleResReady('LobbyRewards')) {
        var resList = [
            'inner_download/lobby_rewards/multi_reward/animation/Spin_JY',
            'inner_download/lobby_rewards/multi_reward/animation/Spin_LiZi',
            'inner_download/lobby_rewards/multi_reward/animation/TiSheng_LiZi',
            'inner_download/lobby_rewards/multi_reward/animation/DengJiTiSheng',
            'inner_download/lobby_rewards/multi_reward/level_up_tip_frame',
            'inner_download/lobby_rewards/multi_reward/multi',
            bole.removeExtName(
                    bole.translateImage('lobby_rewards/multi_reward/level_up_tip_content'),
                    'png'
            )
        ];
        var indexList = [1, 2, 3, 4, 5, 10];
        for (var i = 0; i < 6; i++) {
            resList.push('inner_download/lobby_rewards/multi_reward/wheel_' + indexList[i]);
        }
        bole.preloadImgResAsync(resList);
        if (!this.multiRewardNode || tolua.isnull(this.multiRewardNode)) {
            this.multiRewardNode = MultiRewardNode.new();
            this.multiRewardNode.updateIcon();
            if (this.node.getChildByName("multi_node")) {
                this.node.getChildByName("multi_node").addChild(this.multiRewardNode);
            }
        }
    }
};

ThemeHeader.prototype.showRedDot = function() {
    if (this.node.getChildByName('hot_red_dot')) {
        this.node.getChildByName('hot_red_dot').removeChildByName('redDot');
        this.node.getChildByName('hot_red_dot').removeChildByName('redDotFnt');
        var redDot;
        if (cc.FileUtils.getInstance().isFileExist('inner_download/activity_center_v2/dot.png')) {
            try {
                try{
                    redDot = FONTS.addImage('inner_download/activity_center_v2/dot.png');
                } catch{
                    redDot = cc.Sprite.create("commonpics/red_dot.png");
                };
                level = EXCEPTION_LEVEL_FATAL;
            } catch (e) {
                cc.log(e.stack);
            }
        } else {
            redDot = cc.Sprite.create("commonpics/red_dot.png");
        }
        redDot.setName('redDot');
        this.node.getChildByName('hot_red_dot').addChild(redDot);
        var red_fnt = FONTS.addFNT('commonpics/red_dot_fnt.fnt', '');
        red_fnt.setName('redDotFnt');
        this.node.getChildByName('hot_red_dot').addChild(red_fnt);
        redDot.setVisible(false);
        red_fnt.setVisible(false);
        if (RED_DOT_DATA && RED_DOT_DATA.length != 0) {
            red_fnt.setString(RED_DOT_DATA.length);
            this.node.getChildByName('hot_red_dot').getChildByName('redDot').setVisible(true);
            this.node.getChildByName('hot_red_dot').getChildByName('redDotFnt').setVisible(true);
        }
    }
};

ThemeHeader.prototype.updateAvatarTexture = function(url, userdata) {
    var avatarShowSize = cc.size(75, 75);
    bole.removeSafely(this.avatarSprite);
    if (userdata) {
        USER_PROFILE_DATA = userdata.user_avatar;
        this.avatarSprite = UserAvatarShow.new(null, userdata.user_avatar, avatarShowSize, false, { user_fb_id: Facebook.getInstance().getBackendUserID() });
        this.profileClippingNode.addChild(this.avatarSprite);
    } else {
        this.avatarSprite = UserAvatarShow.new(null, Facebook.getInstance().getBackendUserID(), avatarShowSize, false, { user_fb_id: Facebook.getInstance().getBackendUserID() });
        this.profileClippingNode.addChild(this.avatarSprite);
        if (url && this.avatarSprite && this.avatarSprite.valid && this.avatarSprite.setUrl) {
            this.avatarSprite.setUrl(url);
        }
    }
};

ThemeHeader.prototype.updateUserRedDotInLive = function(isShow) {
    if (bole.notNull(this.userInfo)) {
        if (isShow == 1 && (User.getInstance().abType != "A" || User.getInstance().level > 10 || !User.getInstance().isNewUser)) {
            bole.removeSafely(this.userInfo.redDot);
            this.userInfo.redDot = sp._SkeletonAnimation.create(bole.getAnimation("header/animation/Lobby_EventCenter_red"));
            this.userInfo.redDot.setAnimation(0, "red", true);
            this.userInfo.redDot.setPosition(cc.p(this.userInfo.getContentSize().width / 2 + 27, this.userInfo.getContentSize().height / 2 + 20));
            this.userInfo.addChild(this.userInfo.redDot);
        } else {
            bole.removeSafely(this.userInfo.redDot);
        }
    }
};

ThemeHeader.prototype.updateHeaderLevelBar = function() {
    var status = FloatingLabelControl.getInstance().isLevelRush == true;
    var justEnter = FloatingLabelControl.getInstance().performLevelRushEnter;
    if (this.starStatus != status) {
        if (bole.notNull(this.starSprite)) {
            this.starSprite.removeFromParent();
            this.starSprite = null;
        }
        if (status) {
            this.starSprite = sp._SkeletonAnimation(bole.translateSkeleton('header/animation/level_rush/LevelBlast_tian_logo',true));
            this.node.addChild(this.starSprite, 1);
            var tian_logo_x,tian_logo_y=this.node.getChildByName("level").getPosition();
            this.starSprite.setPosition(tian_logo_x,tian_logo_y);
            if (justEnter) {
                this.starSprite.setAnimation(0, "logo_intro", false);
                this.starSprite.addAnimation(0, "logo_idle", true);
            } else {
                this.starSprite.setAnimation(0,"logo_idle", true);
            }
        } else {

            if (!this.isLowPhone) {

                this.starSprite = sp._SkeletonAnimation(bole.getAnimation("header/animation/Lobby_level_star", true));

                this.node.addChild(this.starSprite, 1);
                this.starSprite.setPosition(this.node.getChildByName("level").getPosition());
                if (bole.getCountDown('level_boom_countdown') > 0) {
                    this.starSprite.setAnimation(0, "levelburst", true);
                } else {
                    bole.setAnimationLoopWithDelay(this.starSprite, 0, "level_star", NEW_USER_OPTIMIZATION && 3.0 || 0);
                }
                if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
                    this.starSprite.setScale(0.8);
                }
            } else {

                if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
                    this.starSprite = FONTS.addTexture('header/res/icon_exp.png');
                } else {
                    this.starSprite = FONTS.addTexture('header/res/icon_exp_v.png');
                }
                this.node.addChild(this.starSprite, 1);
                this.starSprite.setPosition(this.node.getChildByName("level").getPosition());
                // if bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL then
                // 	this.starSprite:setScale(0.8 / 0.9)
                // end
            }

        }

        this.starStatus = status;
    }
};

ThemeHeader.prototype.whenHide = function() {
    // 隐藏天时相关操作
    this.more_board.stopAllActions();
    this.more_board.setOpacity(0);
    this.more_board.setScale(0);
    this.btn_settings.setEnabled(false);
};

ThemeHeader.prototype.whenShow = function() {
    // 恢复隐藏时操作
    this.btn_settings.setEnabled(true);
    TimerCallFunc.addCallFunc(function() {
        FloatingLabelControl.getInstance().updateAll();
    }, 4.0, this, this);
};

ThemeHeader.prototype.updateMoreItems = function(challenges_num) {
    if (challenges_num > 0) {
        this.Label_mb_challenges_red_ball.setString(tostring(challenges_num));
        this.mb_challenges_red_ball.setVisible(true);
    } else {
        this.mb_challenges_red_ball.setVisible(false);
    }
};

ThemeHeader.prototype.showBackBtn = function() {
    this.node.getChildByName("back").setVisible(true);
    this.node.getChildByName('avatar_node').setVisible(false);
    this.node.getChildByName('avatar_frame_btn').setVisible(false);
};
ThemeHeader.prototype.hideBackBtn = function() {
    this.node.getChildByName("back").setVisible(false);
    this.node.getChildByName('avatar_node').setVisible(true);
    this.node.getChildByName('avatar_frame_btn').setVisible(true);
};

ThemeHeader.prototype.showBuyBtn = function() {
    this.node.buyButton = true;
    this.node.getChildByName('buy').setVisible(true);
    this.node.getChildByName('buy_text_node').setVisible(true);
    this.node.getChildByName('buy_sale').setVisible(false);
    this.node.getChildByName('buy_sale').getChildByName('sale_text_node').removeAllChildren();
};

ThemeHeader.prototype.showBuySaleBtns = function() {
    this.node.buyButton = false;
    this.node.getChildByName('buy').setVisible(false);
    this.node.getChildByName('buy_text_node').setVisible(false);
    this.node.getChildByName('buy_sale').setVisible(true);
    if (LobbyControl.getInstance().saleList) {
        this.updateBuySaleBtns(true);
    }
};

ThemeHeader.prototype.isBuySale = function() {
    return this.node.getChildByName('buy_sale').isVisible();
};

ThemeHeader.prototype.updateBuySaleBtns = function (_) {
    if (bole.getCountDown('sale_countdown') > 0) {
        this.node.getChildByName('buy_sale').getChildByName('sale_text_node').removeAllChildren();
        var saleTextHalf = FONTS.addImage(bole.translateImage('header/btn_sale'));
        saleTextHalf.setName('text');
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
            saleTextHalf.setTexture(bole.translateImage('header/btn_sale_v'));
        }
        var timeText = FONTS.addFNT("commonfonts/sale_countdown.fnt", bole.parseTime(bole.getCountDown('sale_countdown')));
        this.node.getChildByName('buy_sale').getChildByName('sale_text_node').addChild(saleTextHalf);
        this.node.getChildByName('buy_sale').getChildByName('sale_text_node').addChild(timeText);
        timeText.runAction(cc.repeatForever(
            cc.sequence(
                cc.delayTime(1.0),
                cc.callFunc(function () {
                    timeText.setString(bole.parseTime(bole.getCountDown('sale_countdown')))
                })
            )
        ));
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
            timeText.setScale(0.7);
        }
        CenterAlignment.setChildrenInOrder(this.node.getChildByName('buy_sale').getChildByName('sale_text_node'), saleTextHalf, timeText);
        CenterAlignment.arrangeVertical(this.node.getChildByName('buy_sale').getChildByName('sale_text_node'), -6);
        var offset_y = 1.5;
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
            offset_y = -0.5;
        }
        timeText.setPositionY(timeText.getPositionY() + offset_y)
    } else {
        this.showBuyBtn();
    }
};

ThemeHeader.prototype.shineOnce = function () {
    //this.feedCat.setAnimation(0, "mao_collect", false)
    //this.feedCat.addAnimation(0, "mao_idle", true)
    this.cat_ribbon.setVisible(false);
    this.cat_max.setVisible(false);
    this.cat_bonus.setVisible(false);
};

ThemeHeader.prototype.keepShine = function () {
    this.cat_ribbon.setVisible(true);
    this.cat_max.setVisible(true);
    this.cat_bonus.setVisible(false);
};

ThemeHeader.prototype.showBonus = function (data) {
    this.cat_bonus.setString("+" + data + "%");
    this.cat_ribbon.setVisible(true);
    this.cat_max.setVisible(false);
    this.cat_bonus.setVisible(true);
};

ThemeHeader.prototype.switchShine = function (data) {
    this.cat_text_node.stopAllActions();
    this.cat_text_node.runAction(cc.repeatForever(
        cc.sequence(
            cc.easeSineInOut(cc.scaleTo(0.33, 1.2)),
            cc.scaleTo(0.17, 1.2, 0),
            cc.callFunc(function () {
                this.showBonus(data);
            }, this),
            cc.scaleTo(0.17, 1.2),
            cc.easeSineInOut(cc.scaleTo(0.33, 1)),
            cc.delayTime(3),
            cc.easeSineInOut(cc.scaleTo(0.33, 1.2)),
            cc.scaleTo(0.17, 1.2, 0),
            cc.callFunc(function () {
                this.keepShine();
            }, this),
            cc.scaleTo(0.17, 1.2),
            cc.easeSineInOut(cc.scaleTo(0.33, 1)),
            cc.delayTime(3)
        )
    ));
};

ThemeHeader.prototype.shutShine = function () {
    this.feedCat.clearTracks();
};

ThemeHeader.prototype.checkCatStatus = function (data, first) {
    if (data) {
        BetFeedbackControl.getInstance().updateData(data)
    } else {
        data = FEEDBACK_DATA
    }
    if (data) {
        var CatShouldShine = data.feedback_should_shine || 0;
        var num = null;
        this.CatStatus, num = BetFeedbackControl.getInstance().getMaxNum();
        if (this.CatStatus == 0 && !first) {
            this.shineOnce();
            if (CatShouldShine == 1) {
                CatShouldShine = 0;
                data.feedback_should_shine = 0;
                this.shineOnce();
            }
        } else {
            this.keepShine();
        }
        if (this.CatStatus == 1 && FEEDBACK_DATA.feedback_show_bonus) {
            if (!this.isSwitching) {
                this.isSwitching = true;
                this.switchShine(FEEDBACK_DATA.feedback_show_bonus);
            }
        } else if (this.CatStatus == 1) {
            this.cat_text_node.stopAllActions();
            this.keepShine();
        } else if (FEEDBACK_DATA.feedback_show_bonus) {
            this.cat_text_node.stopAllActions();
            this.showBonus(FEEDBACK_DATA.feedback_show_bonus);
        } else {
            this.cat_text_node.stopAllActions();
            this.shineOnce();
        }
        if (this.CatStatus == 1 && FEEDBACK_DATA.feedback_show_bonus) {} else {
            this.isSwitching = null;
        }
        if (this.feedbackdialog) {
            this.feedbackdialog.RefreshCoins(data);
        }
    }
};

ThemeHeader.prototype.updateBonus = function(data) {
    if (FEEDBACK_DATA) {
        // FEEDBACK_DATA.feedback_show_bonus = data;
        BetFeedbackControl.getInstance().updateBonus(data);
    }
    if (this.CatStatus === 1) {
        this.cat_text_node.stopAllActions();
        this.switchShine(data);
    } else {
        this.showBonus(data);
    }
};

ThemeHeader.prototype.initBuyAnimation = function() {
    if (!bole.isLowQualityDevice()) {
        // var buyAnimation = bole.newRepeatForeverSkeletonAnimation('header/animation/Lobby_button', 'button_B');
        var buyAnimation = sp._SkeletonAnimation("header/animation/Lobby_button.skel", "header/animation/Lobby_button.atlas");
        buyAnimation.setAnimation(0, 'button_B', true);
        var size = this.node.getChildByName('buy').getContentSize();
        buyAnimation.setPosition(size.width / 2, size.height / 2);
        this.node.getChildByName('buy').addChild(buyAnimation);
    }
};

ThemeHeader.prototype.canClickBtnLobby = function() {
    return (this.themeCtl.isThemeIdle() || this.themeCtl.checkForceEnableToLobby());
};

ThemeHeader.prototype.update = function() {
    StoreControl.getInstance().requestStoreTimedCoinsData();
    StoreControl.getInstance().requestGoldenWheelData();
    if (LOBBY) {
        return;
    }

    if (PLAY_SCENE_CALLED_ID) {
        var canClick = this.canClickBtnLobby();
        var btn_lobby = this.node.getChildByName("lobby");
        if (btn_lobby.isEnabled() !== canClick) {
            btn_lobby.setEnabled(canClick);
        }
    } else {
        var btn_lobby = this.node.getChildByName("lobby");
        if (btn_lobby && !cc.sys.isNative && !btn_lobby._destroyed) {
            btn_lobby.setEnabled(false);
        }
    }
};

ThemeHeader.prototype.checkBuyButtonAnimation = function() {
    cc.log('@debug [checkBuyButtonAnimation] HeaderGoldenWheelShowFlag=' + HeaderGoldenWheelShowFlag);

    var showTreasureBowl = HeaderTreasureBowlShowFlag && (User.getInstance().abType !== "A" || User.getInstance().level >= 5);
    var showGoldenWheel = (!HeaderTreasureBowlShowFlag) && HeaderGoldenWheelShowFlag;
    var root = this.node.getChildByName('treasure_bowl_icon');

    if (root) {
        if (showTreasureBowl) {
            if (!bole.isLowQualityDevice()) {
                if (!root.getChildByName('tb_animation')) {
                    var animation = sp._SkeletonAnimation(bole.getAnimation("lobby/animation/Lobby_jubaopen", true));
                    animation.setName('tb_animation');
                    animation.setAnimation(0, 'pen', true);
                    root.addChild(animation);
                    if (bole.getScreenOrientation() === SCREEN_ORIENTATION.VERTICAL) {
                        // animation.setScale(0.9);
                    }
                }
            } else {
                if (!root.getChildByName('tb_animation')) {
                    var sprite = FONTS.addTexture('header/res/store_timed_coin.png');
                    sprite.setName('tb_animation');
                    root.addChild(sprite);
                    if (bole.getScreenOrientation() === SCREEN_ORIENTATION.VERTICAL) {
                        // sprite.setScale(0.9);
                    }
                }
            }
        } else {
            root.removeChildByName('tb_animation');
        }

        if (showGoldenWheel) {
            if (!root.getChildByName('gw_animation')) {
                var animation;
                if (1 === HeaderGoldenWheelShowFlag) {
                    animation = bole.newRepeatForeverSkeletonAnimation('golden_wheel/animation/SC_20X', 'SC_20X');
                    if (bole.getScreenOrientation() === SCREEN_ORIENTATION.VERTICAL) {
                        animation.setScale(0.8);
                    }
                } else if (2 === HeaderGoldenWheelShowFlag && LobbyControl.getInstance().isModuleResReady("XtraSpin")) {
                    // animation = sp._SkeletonAnimation.create('fortune_spin/animation/Logo.json', 'fortune_spin/animation/Logo.atlas')
                    // animation.clearTracks();
                    // animation.setAnimation(0, bole.translateAnimation('Logo18', animation), true);
                    animation = FONTS.addImage(bole.translateImage("new_store/header_fortune_logo"));
                    animation.setScale(0.3);
                    if (bole.getScreenOrientation() === SCREEN_ORIENTATION.VERTICAL) {
                        animation.setScale(0.3 * 0.9);
                    }
                    if (X_TRA_LUCKY_WILD) { // 目前只有这一个，所以写在一起了，如果以后需要添加其他的可以拆分
                        animation.res_action = {
                            items: []
                        };
                        animation.res_action.items.push({
                            path: bole.translateImage("new_store/header_fortune_logo"),
                            scale: 1
                        });
                        animation.res_action.items.push({
                            path: bole.translateImage("xtra_spin/symbol_wild", null, true),
                            scale: 1.4
                        });
                        bole.runResChangeAction(animation, 5, 0.5);
                    }
                }
                if (animation) {
                    animation.setName('gw_animation');
                    root.addChild(animation);
                }
            }
        } else {
            root.removeChildByName('gw_animation');
        }
    }
};

ThemeHeader.prototype.updateAdsState = function() {
    if (!LOBBY) {
        var canClick = LobbyFooterControl.getInstance().freeAdsTimes > 0;
        if (this.themeCtl) {
            canClick = canClick && this.themeCtl.isThemeIdle();
        }
        if (this.node.getChildByName("free").isTouchEnabled() !== canClick) {
            this.node.getChildByName("free").setTouchEnabled(canClick);
            this.node.getChildByName("free").setBright(canClick);
        }
        if (LobbyFooterControl.getInstance().freeAdsTimes > 0) {
            this.node.getChildByName("free").getChildByName("sprite_free").setVisible(true);
            this.node.getChildByName("free").getChildByName("icon_free").setVisible(false);
            this.node.getChildByName("free").getChildByName("text_free").setVisible(false);
        } else {
            this.node.getChildByName("free").getChildByName("sprite_free").setVisible(false);
            this.node.getChildByName("free").getChildByName("icon_free").setVisible(true);
        }
    }
};

ThemeHeader.prototype.getUserCoinNodeWorldPos = function() {
    if (bole.isInTheme() && PLAY_SCENE_CALLED_ID && IS_THEME_VERTICAL[bole.scene.ctl.getThemeId()] && bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
        return cc.p(200, 700);
    } else {
        if (this.userCoinNode !== null) {
            return this.spCoin.getParent().convertToWorldSpace(bole.getPos(this.spCoin));
        } else {
            return cc.p(0, 0);
        }
    }
};

ThemeHeader.prototype.getUserDiamondNodeWorldPos = function() {
    if (bole.isInTheme() && PLAY_SCENE_CALLED_ID && IS_THEME_VERTICAL[bole.scene.ctl.getThemeId()] && bole.getScreenOrientation() === SCREEN_ORIENTATION.HORIZONTAL) {
        return cc.p(450, 700);
    } else {
        if (this.ingotsNode !== null) {
            return this.spDiamond.getParent().convertToWorldSpace(bole.getPos(this.spDiamond));
        } else {
            return cc.p(0, 0);
        }
    }
};

ThemeHeader.prototype.playCoinCollect = function(type) {
    if (bole.notNull(this.spCoin)) {
        // && !bole.isLowQualityDevice()
        if (type === 0) {
            this.spCoin.setAnimation(0, "coin_collect1", false);
        } else if (type === 1) {
            this.spCoin.setAnimation(0, "coin_collect2", false);
        }
        this.spCoin.addAnimation(0, "coin", true);
    }
};

ThemeHeader.prototype.playIngotCollect = function(type) {
    if (bole.notNull(this.spDiamond)) {
        // && !bole.isLowQualityDevice()
        //if( type == 0 ){
        this.spDiamond.setAnimation(0, "zuanshi_collect", false);
        //}else if( type == 1 ){
        //    this.spDiamond.setAnimation(0, "coin_collect2", false);
        //}
        this.spDiamond.addAnimation(0, "zuanshi", true);
    }
};

ThemeHeader.prototype.addToMsgLevelNode = function(n) {
    this.msgRootNodeLevel.addChild(n);
};

ThemeHeader.prototype.updateUserHeader = function() {
};

ThemeHeader.prototype.enterTheme = function() {
};

ThemeHeader.prototype.beforeQuitTheme = function(isForce, noAdFlag) {
    if (bole.isInTheme() && (isForce || this.themeCtl.isThemeIdle())) {
        // ThemeActivityControl.isMoved = false;
        DM_THEME_CAN_SPIN = true;
        DM_CAN_BUY = false;
        LEVEL_UP_SALE_CAN_SPIN = true;
        RatingDialog.canSpin = true;
        TimeMachineDialog.canSpin = true;
        QUEST_STAY_BATCH_SPIN_CAN_CLEAR = false;
        LevelUpDialog.canSpin = true;
        THEME_WELCOME_REWARD = false;
        LEVEL_UP_TWO_CAN_SPIN = true;
        UNLOCK_DIALOG_CAN_SPIN = true;
        if (JwLoot) {
            JwLoot.canSpin = true;
        }
        TimerCallFunc.clearGroup("footer_levelboom_countdown");

        EventCenter.pushEvent(EVT.SYSTEM.RETURN_LOBBY_FROM_THEME, {themeId: PLAY_SCENE_CALLED_ID, bet: ((bole.scene || {}).ctl || {}).betControl.getCurBet && bole.scene.ctl.betControl.getCurBet()});
    }
};

ThemeHeader.prototype.toVideo = function() {
    if (!this.themeCtl.isThemeIdle()) {
        return;
    }
    bole.playBtnClickSound();
};

ThemeHeader.prototype.setLevelAndExpPercentage = function(level, expPercentage) {
    this.levelNode.setLevelAndExpPercentage(level, expPercentage, true);
};

ThemeHeader.prototype.adjustMoreBoard = function() {
    var delta = 10;
    if (bole.LocalLang == 'CN' || bole.LocalLang == 'TW') {
        delta = 30;
    }
    //if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
    //    this.Label_mb_profile_icon_label.setPosition(18 + delta, 0);
    //    this.Label_mb_profile_icon_label.disableEffect(cc.LabelEffect.OUTLINE);
    //    this.Label_mb_profile_icon_label.disableEffect(cc.LabelEffect.SHADOW);
    //}
    //this.Label_mb_paytable_icon_label.setPosition(18 + delta, 0);
    //this.Label_mb_settings_icon_label.setPosition(18 + delta, 0);
    //
    //this.Label_mb_paytable_icon_label.disableEffect(cc.LabelEffect.OUTLINE);
    //this.Label_mb_settings_icon_label.disableEffect(cc.LabelEffect.OUTLINE);
    //
    //this.Label_mb_paytable_icon_label.disableEffect(cc.LabelEffect.SHADOW);
    //this.Label_mb_settings_icon_label.disableEffect(cc.LabelEffect.SHADOW);
};

ThemeHeader.prototype.changeLanguage = function() {
    let buyTextSprite = this.node.getChildByName('buy_text_node').getChildByName('buyTextSprite');
    if (buyTextSprite) {
        buyTextSprite.setTexture(bole.translateImage('header/btn_buy'));
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
            buyTextSprite.setTexture(bole.translateImage('header/btn_buy_v'));
        }
    }
    
    if (this.cat_max) {
        this.cat_max.setTexture(bole.translateImage("header/cat_max"));
    }
    
    if (bole.isInTheme()) {
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.HORIZONTAL) {
            let btnPath = bole.translateImage("header/profile");
            this.mb_profile_btn.loadTextures(btnPath, btnPath, btnPath);
        }

        this.mb_paytable_btn.loadTextures(bole.translateImage("header/game_rules"), bole.translateImage("header/game_rules"), bole.translateImage("header/game_rules"));
        this.mb_settings_btn.loadTextures(bole.translateImage("header/setting"), bole.translateImage("header/setting"), bole.translateImage("header/setting"));
        this.adjustMoreBoard();
    }
    
    let textNode = this.node.getChildByName('buy_sale').getChildByName('buy_btn').getChildByName('buy_text_node');
    if (textNode.getChildByName('text')) {
        textNode.getChildByName('text').setTexture(bole.translateImage('header/btn_buy_s'));
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
            textNode.getChildByName('text').setTexture(bole.translateImage('header/btn_buy_s_v'));
        }
    }

    textNode = this.node.getChildByName('buy_sale').getChildByName('sale_text_node');
    if (textNode.getChildByName('text')) {
        textNode.getChildByName('text').setTexture(bole.translateImage('header/btn_sale'));
        if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
            textNode.getChildByName('text').setTexture(bole.translateImage('header/btn_sale_v'));
        }
    }

    this.node.getChildByName('treasure_bowl_icon').removeChildByName('gw_animation');
    this.checkBuyButtonAnimation();
    this.updateActivityCenterEntrance();
};

ThemeHeader.prototype.showAdNode = function() {
    cc.log('@debug header showAdNode');
    if (!this.advertiseNode) {
        this.advertiseNode = AdvertiseControl.createAdNode(0);
        this.adInterstitialNode = AdvertiseControl.createAdInterstitialNode();
        let s = cc.director.getWinSize();
        if (this.advertiseNode) {
            this.advertiseNode.setPositionX(s.width / 2 - 250);
            this.advertiseNode.setPositionY(-128);
            this.node.addChild(this.advertiseNode, 10);
            this.advertiseNode.setVisible(false);
        }
        if (this.adInterstitialNode) {
            this.adInterstitialNode.setPositionX(s.width / 2 - 250);
            this.adInterstitialNode.setPositionY(-128);
            this.node.addChild(this.adInterstitialNode, 11);
        }
    }
    
    AD_NODE_LAST_STATE = false;
    TimerCallFunc.addCallFunc(function() {
        AdvertiseControl.updateAdNode();
    }, 1.0, this, this);
};

ThemeHeader.prototype.setLobbyBtn = function(flag) {
    if (flag) {
        this.node.getChildByName("lobby").setTouchEnabled(true);
    } else {
        this.node.getChildByName("lobby").setTouchEnabled(false);
    }
};

ThemeHeader.prototype.changeUI = function() {
    let suffix = "";
    if (LOBBY) {
        if (CLUB_FLAG) {
            suffix = "club";
        }
        else if (UI_PRE === 0) {
            suffix = "purple";
        }
        else if (UI_PRE === 1) {
            suffix = "purple";
        }
    } 
    else {
        if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
            suffix = "purple";
        }
        else if (SCREEN_ORIENTATION.VERTICAL === bole.getScreenOrientation()) {
            suffix = "blue_v";
        }
    }

    if (this.bg && bole.notNull(this.bg)) {
        if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
            this.bg.loadTexture("header/res/board_header_" + suffix + ".png", ccui.TextureResType.plistType);
        }
        else {
            if (LOBBY) {
                this.bg.loadTexture("header/res/board_header_" + suffix + ".png", ccui.TextureResType.plistType);
            }
            else {
                this.bg.loadTexture("header/res/V_header_bg.png", ccui.TextureResType.plistType);
            }
        }
    }

    if (this.coinsFrame && bole.notNull(this.coinsFrame)) {
        this.coinsFrame.loadTextures("header/res/board_coin_" + suffix + ".png", "header/res/board_coin_" + suffix + ".png", "header/res/board_coin_" + suffix + ".png", ccui.TextureResType.plistType);
    }

    if (this.ingotsFrame && bole.notNull(this.ingotsFrame)) {
        this.ingotsFrame.setSpriteFrame("header/res/board_diamond_" + suffix + ".png");
    }

    if (LOBBY) {
        if (this.node.getChildByName("settings") && bole.notNull(this.node.getChildByName("settings"))) {
            this.node.getChildByName("settings").loadTextures("header/res/btn_setting_" + suffix + ".png", "header/res/btn_setting_" + suffix + "_clicked.png", "header/res/btn_setting_" + suffix + "_clicked.png", ccui.TextureResType.plistType);
        }

        if (this.node.getChildByName("back") && bole.notNull(this.node.getChildByName("back"))) {
            if (CLUB_FLAG) {
                this.node.getChildByName("back").loadTextures("header/res/btn_back1_" + suffix + ".png", "header/res/btn_back1_" + suffix + "_clicked.png", "header/res/btn_back1_" + suffix + "_clicked.png");
            }
            else {
                this.node.getChildByName("back").loadTextures("header/res/btn_back_" + suffix + ".png", "header/res/btn_back_" + suffix + "_clicked.png", "header/res/btn_back_" + suffix + "_disabled.png", ccui.TextureResType.plistType);
            }
        }
    }

    if (this.node.getChildByName('level').getChildByName('levelbar_bg') && bole.notNull(this.node.getChildByName('level').getChildByName('levelbar_bg'))) {
        let path;
        if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
            path = "header/res/board_progress_" + suffix + (NEW_USER_OPTIMIZATION ? '_new' : '') + ".png";
        }
        else {
            path = "header/res/board_progress_" + suffix + ".png";
        }
        this.node.getChildByName('level').getChildByName('levelbar_bg').loadTexture(path, ccui.TextureResType.plistType);
    }

};

ThemeHeader.prototype.activityClicked = function() {
    LobbyControl.getInstance().checkLatestSaleData('activity_center');
};

ThemeHeader.prototype.updateActivityCenterEntrance = function() {
    let text;
    if (!LobbyControl.getInstance().isNewUser) {
        text = sp._SkeletonAnimation(bole.translateSkeleton("header/animation/Lobby_EventCenter", true));
        text.setAnimation(0, "logo", true);
    }
    else {
        text = sp._SkeletonAnimation(bole.translateSkeleton("header/animation/Lobby_EventCenterNew", true));
        bole.setAnimationLoopWithDelay(text, 0, "logo", NEW_USER_OPTIMIZATION ? 1.5 : 0);
    }
    text.setVisible(true);

    const hotNode = this.node.getChildByName('hot_node');
    if (hotNode && !cc.sys.isObjectValid(hotNode)) {
        if (text !== null) {
            hotNode.removeAllChildren();
            hotNode.addChild(text);
        }
    }
};

ThemeHeader.prototype.setReturnLobbyBlack = function() {
    if (this.node.getChildByName("lobby")) {
        this.node.getChildByName("lobby").setTouchEnabled(false);
    }
};

ThemeHeader.prototype.setReturnLobbyLight = function() {
    if (this.node.getChildByName("lobby")) {
        this.node.getChildByName("lobby").setTouchEnabled(true);
    }
};

ThemeHeader.prototype.hide = function() {
    this.setVisible(false);
};

ThemeHeader.prototype.show = function() {
    this.setVisible(true);
};

ThemeHeader.prototype.showCoinsTapTip = function(data) {
    const coinRoot = this.node.getChildByName('coin_root');
    if (coinRoot) {
        const coinsTip = LoadingPageCoinsTip.new(data);
        coinsTip.setPositionY(-25);
        coinRoot.addChild(coinsTip);
    }
};

//-----------------------------------------------------------
var MultiRewardNode = cc.Class({
    extends: cc.Node,
    ctor: function() {
        var iconPath = 'inner_download/lobby_rewards/multi_reward/icon_dark.png';
        this.icon = new cc._Button(iconPath, iconPath, iconPath);
        this.icon.setColor(cc.color(120, 120, 120));
        this.addChild(this.icon);

        var bar = FONTS.addImage('inner_download/lobby_rewards/multi_reward/icon.png');
        var stencil = new cc._LayerColor(cc.Color.BLACK, 52, 52);
        stencil.setAnchorPoint(cc.p(0.5, 0));
        stencil.setPosition(cc.p(-52 / 2, -52 / 2));
        stencil.setScaleY(0);
        this.clippingNode = new cc.ClippingNode(stencil);
        this.addChild(this.clippingNode);
        this.stencil = stencil;

        this.clippingNode.addChild(bar);

        var stencil2 = FONTS.addImage('inner_download/lobby_rewards/multi_reward/icon.png');
        this.clippingNode2 = new cc.ClippingNode(stencil2);
        this.addChild(this.clippingNode2);

        var framePath = 'inner_download/lobby_rewards/multi_reward/frame.png';
        var frame = new cc._Button(framePath, framePath, framePath);
        this.addChild(frame);

        var that = this;
        var touchEvent = function(sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                if (that.levelUpPerforming) {
                    return true;
                }
                if (that.tipNode && !cc.sys.isObjectValid(that.tipNode)) {
                    that.tipNode.removeFromParent();
                    that.tipNode = null;
                    return true;
                }
                that.tipNode = new cc.Node();
                var scale = PAD_TAG ? 1 : 1.25;
                that.tipNode.setScale(scale * SCREEN_RATIO);

                var tipFrame = FONTS.addImage('inner_download/lobby_rewards/multi_reward/common_tip_frame.png');
                var tipContent = FONTS.addImage(bole.translateImage('lobby_rewards/multi_reward/common_tip_content'));

                var tipSize = tipFrame.getContentSize();
                var nodeSize = frame.getContentSize();

                if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
                    tipFrame.setScaleX(-1);
                }
                that.tipNode.addChild(tipFrame);
                that.tipNode.addChild(tipContent);

                that.tipNode.setPosition(cc.pAdd(that.getPosition(), cc.p(-tipSize.width * SCREEN_RATIO / 2, -tipSize.height * SCREEN_RATIO / 2 - nodeSize.height / 2 - 8)));
                if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
                    that.tipNode.setPosition(cc.pAdd(that.getPosition(), cc.p(tipSize.width * SCREEN_RATIO / 2, -tipSize.height * SCREEN_RATIO / 2 - nodeSize.height / 2)));
                }
                if (PAD_TAG) {
                    var pos = cc.p(that.tipNode.getPosition());
                    if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
                        that.tipNode.setPosition(pos.x - 30, pos.y);
                    } else {
                        that.tipNode.setPosition(pos.x + 30, pos.y);
                    }
                }
                that.getParent().addChild(that.tipNode);

                that.tipNode.runAction(new cc.Sequence(
                    cc.delayTime(8.0),
                    new cc.RemoveSelf()
                ));
                bole.sendBehaviorLog('reward_multiplier');
            }
            return true;
        };
        this.icon.addTouchEventListener(touchEvent);
        frame.addTouchEventListener(touchEvent);

        this.showNode = new cc.Node();
        this.showNode.setPositionY(-2);
        this.addChild(this.showNode);

        if (NewUserControl.isInGroup("20220617A") && NewUserControl.getInstance().getGroupData("20220617A", "enter")) {
            this.newNode = new cc.Node();
            this.showNode.addChild(this.newNode);
        } else {
            if (NewUserControl.getInstance().isTestGroup("20220617A")) {
                bole.assert(false, "是否在分组：" + NewUserControl.isInGroup("20220617A") + " 是否进入过领奖界面=" + NewUserControl.getInstance().getGroupData("20220617A", "enter"));
            }
            this.text = FONTS.addImage('');
            this.showNode.addChild(this.text);
        }
    }
});

MultiRewardNode.prototype.updateIcon = function(animated) {
    if (this.stencil && !this.stencil.isRunning()) {
        if (animated) {
            this.stencil.runAction(cc.sequence(
                cc.easeSineOut(cc.scaleTo(0.5, 1, MULTI_REWARD_EXP / 100)),
                cc.callFunc(function() {
                    if (this.text && !this.text.isRunning()) {
                        this.text.setTexture('inner_download/lobby_rewards/multi_reward/wheel_' + (MULTI_REWARD_LIST[MULTI_REWARD_LEVEL || 1] || 1) + '.png');
                    }
                    if (NewUserControl.isInGroup("20220617A")) {
                        this._updateNewNode();
                    }
                }.bind(this))
            ));
        } else {
            this.stencil.setScaleY(MULTI_REWARD_EXP / 100);
            if (this.text && !this.text.isRunning()) {
                this.text.setTexture('inner_download/lobby_rewards/multi_reward/wheel_' + (MULTI_REWARD_LIST[MULTI_REWARD_LEVEL || 1] || 1) + '.png');
            }
            if (NewUserControl.isInGroup("20220617A")) {
                this._updateNewNode();
            }
        }
    }
};

MultiRewardNode.prototype._updateNewNode = function() {
    if (!this.newNode) {
        return;
    }
    this.newNode.removeAllChildren();
    let resPath = 'inner_download/lobby_rewards/multi_reward/';
    let allStatusData = LobbyRewardsControl.getInstance().getAllStatuData();
    let collectNum = 0;
    for (let k in allStatusData) {
        let v = allStatusData[k];
        if (v.status && v.status == 1) {
            collectNum = collectNum + 1;
        }
    }

    function _getMinCountTime() {
        let leftTime = 0;
        let timeName;
        for (let k in allStatusData) {
            let v = allStatusData[k];
            if (v.time) {
                let time = bole.getCountDown(v.time);
                if (leftTime == 0 || leftTime > time) {
                    leftTime = time;
                    timeName = v.time;
                }
            }
        }
        return [timeName, leftTime];
    }
    function _createDoubleNode() {
        let oldDouble = this.newNode.double || 1;
        let newDouble = MULTI_REWARD_LIST[MULTI_REWARD_LEVEL || 1] || 1;
        let imgNode = FONTS.addImage(resPath + 'wheel_' + oldDouble + '.png');
        if (oldDouble !== newDouble) {
            let imgSize = imgNode.getContentSize();
            let vertical = bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL && "_v" || "";
            let aniNode = sp._SkeletonAnimation(bole.getAnimation('inner_download/lobby_rewards/animation/top_icon_beishu_frame' + vertical, true));
            aniNode.setAnimation(0, "frame", false);
            aniNode.setPosition(imgSize.width * 0.5, imgSize.height * 0.5);
            imgNode.addChild(aniNode);
            imgNode.runAction(cc.sequence(
                cc.DelayTime.create(0.9),
                cc.CallFunc.create(function(obj) {
                    obj.setTexture(resPath + 'wheel_' + newDouble + '.png');
                })
            ));
            this.newNode.double = newDouble;
        }
        return imgNode;
    }
    function _createTimeNode() {
        let timeBg = FONTS.addImage(resPath + 'time_board.png');
        let bgSize = timeBg.getContentSize();
        let [timeName, leftTime] = _getMinCountTime();
        bole.assert(timeName, "timeName should not nil");
        let leftTimeStr = bole.parseTime(leftTime);
        let multiText = FONTS.addFNT(resPath + 'time_fnt.fnt', leftTimeStr);
        multiText.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.DelayTime.create(0.5),
                    cc.CallFunc.create(function(obj) {
                        let time = bole.getCountDown(timeName);
                        if (time > 0) {
                            let leftTimeStr = bole.parseTime(time);
                            obj.setString(leftTimeStr);
                        } else {
                            this._updateNewNode();
                        }
                    })
                )
            )
        );
        multiText.setPosition(bgSize.width * 0.5, bgSize.height * 0.5 + 3);
        timeBg.addChild(multiText);
        timeBg.setPositionY(-30);
        return timeBg;
    }
    // 创建收集节点
    const _createCollectBtn = function() {
        const btnNode = new cc.Node();

        // 点击事件回调函数
        const _collectCallback = function(obj) {
            if (btnNode.isClicked) {
                return;
            }
            btnNode.isClicked = true;
            obj.setTouchEnabled(false);

            bole.sendBehaviorLog('slot_collect_reward');

            const _doLogic = function() {
                LobbyRewardsControl.getInstance().setCmdCallback("get_lobby_rewards", function() {
                this._updateNewNode();
                }.bind(this));
                LobbyRewardsControl.getInstance().getLobbyRewards(false);
            };

            const _checkReward = function() {
            // 收集表演
                const allStatusData = LobbyRewardsControl.getInstance().getAllStatuData();

                if (allStatusData[TimedCoinsNodeNew.TYPE.RESPIN] && allStatusData[TimedCoinsNodeNew.TYPE.RESPIN].status === 1) {
                    bole.pauseTheme();
                    SuperRespinControl.getInstance().sendTest(null, 1, function() {
                    bole.resumeTheme();
                    _doLogic();
                    });
                    return;
                }

                if (allStatusData[TimedCoinsNodeNew.TYPE.WHEEL] && allStatusData[TimedCoinsNodeNew.TYPE.WHEEL].status === 1) {
                    bole.pauseTheme();
                    bole.showLoading();
                    BONUS_WHEEL_TYPE = 1;
                    bole.potp.send("lobby_bonus_spin_wheel", {});
                    LoginControl.getInstance().setCmdSpinWheelEndCallback(function() {
                    bole.resumeTheme();
                    _doLogic();
                    });
                    return;
                }

                if (allStatusData[TimedCoinsNodeNew.TYPE.COINS_LUCKY] && allStatusData[TimedCoinsNodeNew.TYPE.COINS_LUCKY].status === 1) {
                    LobbyRewardsControl.getInstance().notSetCoins = true;
                    LobbyRewardsControl.getInstance().setCmdCallback(TIMED_COINS_MEGA, function(data) {
                    const fromPos = this.getParent().convertToWorldSpace(this.getPosition());
                    bole.flyCoins(fromPos, function() {
                        User.getInstance().setCoins(data.coins);
                    }, null, null, function() {
                        _doLogic();
                    }, true)
                    }.bind(this));
                    bole.potp.send(TIMED_COINS_MEGA, {require: 1});
                    return;
                }

                if (allStatusData[TimedCoinsNodeNew.TYPE.MEGA_DICE] && allStatusData[TimedCoinsNodeNew.TYPE.MEGA_DICE].status === 1) {
                    bole.pauseTheme();
                    LobbyRewardsControl.getInstance().notSetCoins = true;
                    LobbyRewardsControl.getInstance().setCmdCallback(TIMED_COINS_MEGA, function(data) {
                        data = LobbyRewardsControl.getInstance().scratch_data;
                        const dialog = new DafuCommonRewardScratch(data.scratch_card_multi, data.lucky_reward, data.coins);
                        dialog.setEndCallback(function() {
                            bole.resumeTheme();
                            _doLogic();
                        });
                        dialog.show();
                    }.bind(this));
                    bole.potp.send(TIMED_COINS_MEGA, {require: 1});
                    return;
                }

                // 收集金币
                if (allStatusData[TimedCoinsNodeNew.TYPE.COINS_JAMMY] && allStatusData[TimedCoinsNodeNew.TYPE.COINS_JAMMY].status === 1) {
                    LobbyRewardsControl.getInstance().notSetCoins = true;
                    LobbyRewardsControl.getInstance().setCmdCallback(TIMED_COINS, function(data) {
                    const fromPos = this.getParent().convertToWorldSpace(this.getPosition());
                    bole.flyCoins(fromPos, function() {
                        User.getInstance().setCoins(data.coins);
                    }, null, null, function() {
                        _doLogic();
                    }, true);
                    }.bind(this));
                    bole.potp.send(TIMED_COINS, {require: 1});
                    return;
                }

                this._updateNewNode();
            };

            _checkReward();
        };

        // 创建扩大可点击范围的按钮
        //do {
            const btn_ = new cc._Button(resPath + "btn_collect.png", resPath + "btn_collect.png", resPath + "btn_collect.png");
            btn_.addClickEventListener(_collectCallback);
            btn_.setOpacity(0);
            btn_.setScaleY(3);
            btnNode.addChild(btn_);
        //}

        // 创建原本的按钮
        //do {
            const langText = bole.translateTable({ CN: "btn_collect_CN.png", EN: "btn_collect_EN.png" });
            const btn__ = FONTS.addButton(resPath + "btn_collect.png", { path: resPath + langText, off: cc.p(0, 2) }, resPath + "btn_collect_mask.png");
            btn__.addClickEventListener(_collectCallback);
            btn__.setPositionY(-30);
            btnNode.addChild(btn__);

            const btnSize = btn__.getContentSize();

            const aniNode = sp._SkeletonAnimation(bole.getAnimation("inner_download/lobby_rewards/animation/btn_beishu", true));
            aniNode.setAnimation(0, "btn", true);
            aniNode.setPosition(btnSize.width * 0.5, btnSize.height * 0.5);
            btn__.addChild(aniNode);
        //}

        return btnNode;
    }

    if (collectNum === 0) {
        let doubleNode = _createDoubleNode();
        this.newNode.addChild(doubleNode);
        let timeNode = _createTimeNode();
        this.newNode.addChild(timeNode);
    } else if (collectNum > 0) { // collectNum == allStatusData.length
        let doubleNode = _createDoubleNode();
        this.newNode.addChild(doubleNode);
        let btnNode = _createCollectBtn();
        this.newNode.addChild(btnNode);
    } else { // temporarily unused, kept for future use
        let node = new cc.Node();
        let nodeSize = cc.size(50, 60);
        node.setContentSize(nodeSize);
        this.newNode.addChild(node);

        let doubleNode = _createDoubleNode();
        doubleNode.setPosition(cc.p(nodeSize.width * 0.5, nodeSize.height * 0.5));
        node.addChild(doubleNode);

        let timeNode = _createTimeNode();
        timeNode.setPosition(cc.p(nodeSize.width * 0.5, nodeSize.height * 0.5));
        node.addChild(timeNode);

        node.childrens = [doubleNode, timeNode];
        node.showIndex = 1;
        for (let i = 0; i < node.childrens.length; i++) {
            node.childrens[i].setVisible(i === node.showIndex);
        }

        node.runAction(cc.repeatForever(
            cc.sequence(
                cc.delayTime(2.0),
                cc.callFunc(function(obj) {
                    if (obj && obj !== null) {
                        let showIndex = obj.showIndex;
                        let showNode = obj.childrens[showIndex];
                        if (showNode && showNode !== null) {
                            showNode.runAction(cc.sequence(
                            cc.scaleTo(0.5, 0),
                            cc.callFunc(function(o) {
                                o.setVisible(false);
                            })
                            ));
                        }
                        let nextIndex = showIndex % obj.childrens.length + 1;
                        let nextNode = obj.childrens[nextIndex];
                        if (nextNode && nextNode !== null) {
                            nextNode.setScale(0);
                            nextNode.setVisible(true);
                            nextNode.runAction(cc.sequence(
                            cc.delayTime(0.5),
                            cc.scaleTo(0.5, 1)
                            ));
                        }
                        obj.showIndex = nextIndex;
                    }
                })
            )
        ));

        let btnNode = _createCollectBtn();
        this.newNode.addChild(btnNode);

        CenterAlignment.setChildrenInOrder(this.newNode, node, btnNode);
        CenterAlignment.arrangeVertical(this.newNode, 5);
    }

};

MultiRewardNode.prototype.playExpAnimation = function() {
  if (!this.levelUpPerforming) {
    this.updateIcon(true);
    this.removeTip();
    if (this.showNode && !this.showNode.isRunning()) {
      const path = 'inner_download/lobby_rewards/multi_reward/animation/Spin_JY';
      const animation = sp._SkeletonAnimation.createWithJsonFile(path + '.json', path + '.atlas');
      animation.setAnimation(0, 'Spin_JY', false);
      animation.runAction(cc.sequence(
        cc.delayTime(1.0),
        cc.removeSelf()
      ));
      this.addChild(animation);
      
      const particle = cc.ParticleSystemQuad.create('inner_download/lobby_rewards/multi_reward/animation/Spin_LiZi.plist');
      this.clippingNode2.addChild(particle);
      const percent = MULTI_REWARD_EXP / 100;
      particle.setPositionY((percent - 0.5) * 52);
      particle.runAction(cc.sequence(
        cc.delayTime(0.83),
        cc.removeSelf()
      ));
      
      this.showNode.runAction(cc.sequence(
        cc.callFunc(() => {
          exception.try(() => {
            // Code inside try block
          }, LEVEL_HIGH);

        }),
        cc.easeSineOut(cc.scaleTo(1 / 3, 1.3)),
        cc.easeSineIn(cc.scaleTo(1 / 6, 1))
      ));
    }
  }
};

MultiRewardNode.prototype.playLevelUpAnimation = function() {
    this.levelUpPerforming = true;
    this.reset();
    this.removeTip();
    this.runAction(cc.sequence(
        cc.callFunc(function() {
            try {
                (function () {
                    var particle = cc.ParticleSystemQuad.create('inner_download/lobby_rewards/multi_reward/animation/TiSheng_LiZi.plist');
                    this.addChild(particle);
                    particle.runAction(cc.sequence(
                        cc.delayTime(2.0),
                        cc.removeSelf()
                    ));
                })();
            } catch (error) {
                console.log(error);
            }
        }, this),
        cc.delayTime(1 / 6),
        cc.callFunc(function() {
            var path = 'inner_download/lobby_rewards/multi_reward/animation/DengJiTiSheng';
            var animation = sp._SkeletonAnimation.create(path + '.json', path + '.atlas');
            animation.setAnimation(0, 'DengJiTiSheng', false);
            animation.runAction(cc.sequence(
                cc.delayTime(2.5),
                cc.removeSelf()
            ));
            animation.setPosition(this.getPosition());
            this.getParent().addChild(animation);
        }, this)
    ));

    if (this.showNode && !this.showNode.isNull()) {
        this.showNode.runAction(cc.sequence(
            cc.EaseSineOut.create(cc.scaleTo(1 / 2, 1.3)),
            cc.EaseSineIn.create(cc.scaleTo(1 / 4, 1)),
            cc.EaseSineOut.create(cc.scaleTo(1 / 2, 1.3)),
            cc.EaseSineIn.create(cc.scaleTo(1 / 4, 1)),
            cc.EaseSineOut.create(cc.scaleTo(1 / 2, 1.5)),
            cc.callFunc(function() {
                this.updateIcon();
            }, this),
            cc.EaseSineIn.create(cc.scaleTo(1 / 4, 1)),
            cc.EaseSineOut.create(cc.scaleTo(1 / 2, 1.3)),
            cc.EaseSineIn.create(cc.scaleTo(1 / 4, 1)),
            cc.EaseSineOut.create(cc.scaleTo(1 / 2, 1.3)),
            cc.EaseSineIn.create(cc.scaleTo(1 / 4, 1)),
            cc.callFunc(function() {
                var tipNode = new cc.Node();
                tipNode.setScale(1.25);
                var contentNode = new cc.Node();
                contentNode.setPositionY(-7);

                var tipFrame = FONTS.addImage(bole.translateImage('lobby_rewards/multi_reward/level_up_tip_frame'));
                // FONTS.addImage('inner_download/lobby_rewards/multi_reward/level_up_tip_frame.png');
                var tipContent = FONTS.addImage(bole.translateImage('lobby_rewards/multi_reward/level_up_tip_content'));
                var multi = MULTI_REWARD_LIST[MULTI_REWARD_LEVEL] || 1;
                var multiText = FONTS.addFNT('inner_download/lobby_rewards/multi_reward/multi.fnt', 'x' + multi);

                var tipSize = tipFrame.getBoundingBox();
                var nodeSize = bole.getNodeBoundingBox(this);

                if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
                    tipFrame.setScaleX(-1);
                }

                tipNode.addChild(tipFrame);
                tipNode.addChild(contentNode);
                contentNode.addChild(tipContent);
                contentNode.addChild(multiText);

                var lang = bole.LocalLang;
                if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL) {
                    if (lang == 'CN' || lang == 'TW') {
                        tipContent.setPositionY(5);
                        multiText.setPositionY(7);

                        tipNode.setPosition(this.getPosition().add(cc.p(tipSize.width / 2 - 14, -tipSize.height / 2 - nodeSize.height / 2 - 5)));
                    } else {
                        tipContent.setPositionY(7);
                        multiText.setPositionY(8);

                        tipNode.setPosition(this.getPosition().add(cc.p(tipSize.width / 2 + 2, -tipSize.height / 2 - nodeSize.height / 2 - 6)));
                    }
                } else {
                    if (lang == 'CN' || lang == 'TW') {
                        tipContent.setPositionY(7);
                        multiText.setPositionY(8);

                        if (tipNode) {
                            tipNode.setPosition(this.getPosition().add(cc.p(-tipSize.width / 2 + 12, -tipSize.height / 2 - nodeSize.height / 2 - 5)));
                        }
                    } else {
                        tipContent.setPositionY(7);
                        multiText.setPositionY(11);

                        if (tipNode) {
                            tipNode.setPosition(this.getPosition().add(cc.p(-tipSize.width / 2 - 2, -tipSize.height / 2 - nodeSize.height / 2 - 6)));
                        }
                    }
                }

                CenterAlignment.setChildrenInOrder(contentNode, tipContent, multiText);
                CenterAlignment.arrangeHorizontal(contentNode, 0);

                this.getParent().addChild(tipNode);

                tipNode.runAction(cc.sequence(
                    cc.delayTime(5.0),
                    cc.removeSelf()
                ));
            }, this),
            cc.delayTime(5),
            cc.callFunc(function() {
                this.levelUpPerforming = false;
            }, this)
        ));
    }
};

MultiRewardNode.prototype.reset = function() {
    this.stopAllActions();
    if (this.showNode && !this.showNode.isValid) {
        this.showNode.stopAllActions();
        this.showNode.setScale(1.0);
    }
};

MultiRewardNode.prototype.removeTip = function() {
    if (this.tipNode && !this.tipNode.isValid) {
        this.tipNode.removeFromParent();
        this.tipNode = null;
        return true;
    }
};
