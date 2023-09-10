require("../Setup");
ThemeNew = cc.Class({
  extends:cc.Layer,
  name:"ThemeNew",
  ctor:function(){
    console.log("+++++++++++");
  
    CNT_IN_THEMECNT++;
  
    this.themeFreeType = THEME_FG_TYPE.NORMAL;
  
    this.kickOutTip = null;
    this.recordList = {};
  /*
    const _componentPath = [
      "Model/ThemeNewComponent/JwLootComponent",
      "Components/SpinMonitorComponent"
    ];
  
    _componentPath.forEach((path) => {
      bole.reRequire(path);
    });
  
    this._componentNameMap = {
      jwLootComponent: JwLootComponent,
      ShopComponent: ShopComponent,
      spinMonitorComponent: SpinMonitorComponent
    };
  
    this._components = [];
  
    for (let k in this._componentNameMap) {
      const className = this._componentNameMap[k];
      const component = new className(this);
      this._components.unshift(component);
    }
    */
  
    this._eventOnCheckSymbolJwLoot = new Event('_eventOnCheckSymbolJwLoot');
    this._eventOnJwIndexListChange = new Event('_eventOnJwIndexListChange');
    this._eventOnChangeSymbolJwLoot = new Event('_eventOnChangeSymbolJwLoot');
    this._eventOnCheckJwLootNgPerformOver = new Event('_eventOnCheckJwLootNgPerformOver');
    this._eventOnShowJwSymbolDown = new Event('_eventOnShowJwSymbolDown');
    this._eventOnShowJwReelSymbolDown = new Event('_eventOnShowJwReelSymbolDown');
    this._eventOnUpdateJw = new Event('_eventOnUpdateJw');
    this._eventOnFakeSpinUpdateJw = new Event('_eventOnFakeSpinUpdateJw');
    this._eventOnRefreshJwLanguage = new Event('_eventOnRefreshJwLanguage');
    this._eventOnSpinStroke = new Event('_eventOnSpinStroke');
    this._eventOnReceiveBatchSpin = new Event('_eventOnReceiveBatchSpin');
    this._eventOnDestruct = new Event('_eventOnDestruct');
    this._eventOnEnterForeground = new Event('_eventOnEnterForeground');
    this._eventOnEnterBackground = new Event('_eventOnEnterBackground');
  
    this._initEvent();
  }
});

THEME_FG_TYPE = {
  NORMAL: 0,
  CHOICE: 1,
  STEP: 2,
};

THEME_BG_TYPE = {
  NORMAL: 0,
  CHOICE: 1,
  STEP: 2,
};
G_THEME_TYPE_LIST = {
  WAYS:0,
  LINES:1,
}
G_THEME_BET_TYPE_LIST = {
  MULTIPLIER:0,
  PER_LINE:1
}

togetherPlayThemeList = {
  111002: true,
  111011: true,
  111013: true,
  111015: true,
};

let idleTime = 0;
const kickOutTipDeadline = 5 * 60;
const kickOutDeadline = 6 * 60;

const tag_long_time_no_stop = 999;
CNT_IN_THEMECNT = 0;

let downloadingEffectId = -1;

ThemeNew.prototype._initEvent = function() {
  //jw loot
  EventCenter.registerEvent(EVT.JW_LOOT.JW_LOOT_CHECK_SYMBOL, this._checkSymbolJwLoot, this);
  EventCenter.registerEvent(EVT.JW_LOOT.JW_LOOT_CHANGE_LIST_INDEX, this._changeJwListIndex, this);
  EventCenter.registerEvent(EVT.JW_LOOT.JW_LOOT_CHANGE_SYMBOL, this._changeSymbolJwLoot, this);
  EventCenter.registerEvent(EVT.JW_LOOT.JW_LOOT_REEL_SYMBOL_DOWN, this._showJwReelSymbolDown, this);

  //common
  EventCenter.registerEvent(EVT.THEME.SEND_BATCH_SPIN, this._onSendBatchSpin, this);
  EventCenter.registerEvent(EVT.THEME.BATCH_SPIN, this._onReceiveBatchSpin, this);
  EventCenter.registerEvent(EVT.THEME.ON_CAN_STOP, this._onCanStop, this);
  EventCenter.registerEvent(EVT.THEME.SPIN_STROKE, this._onSpinStroke, this);
  EventCenter.registerEvent(EVENTNAMES.EVT_ENTER_FOREGROUND, this._onEnterForeground, this);
  EventCenter.registerEvent(EVENTNAMES.EVT_ENTER_BACKGROUND, this._onEnterBackground, this);
};

ThemeNew.prototype._removeEvent = function() {
  //jw loot
  EventCenter.removeEvent(EVT.JW_LOOT.JW_LOOT_CHECK_SYMBOL, this._checkSymbolJwLoot, this);
  EventCenter.removeEvent(EVT.JW_LOOT.JW_LOOT_CHANGE_LIST_INDEX, this._changeJwListIndex, this);
  EventCenter.removeEvent(EVT.JW_LOOT.JW_LOOT_CHANGE_SYMBOL, this._changeSymbolJwLoot, this);
  EventCenter.removeEvent(EVT.JW_LOOT.JW_LOOT_REEL_SYMBOL_DOWN, this._showJwReelSymbolDown, this);

  //common
  EventCenter.removeEvent(EVT.THEME.SEND_BATCH_SPIN, this._onSendBatchSpin, this);
  EventCenter.removeEvent(EVT.THEME.BATCH_SPIN, this._onReceiveBatchSpin, this);
  EventCenter.removeEvent(EVT.THEME.ON_CAN_STOP, this._onCanStop, this);
  EventCenter.removeEvent(EVT.THEME.SPIN_STROKE, this._onSpinStroke, this);
  EventCenter.removeEvent(EVENTNAMES.EVT_ENTER_FOREGROUND, this._onEnterForeground, this);
  EventCenter.removeEvent(EVENTNAMES.EVT_ENTER_BACKGROUND, this._onEnterBackground, this);
};

ThemeNew.prototype._dispatchToComponents = function(reelEvent) {
  for (let i = 0; i < this._components.length; i++) {
    const component = this._components[i];
    component.dispatchEvent(reelEvent);
  }
};
ThemeNew.prototype._checkSymbolJwLoot = function(data) {
  if (!this._eventOnCheckSymbolJwLoot) {
    return;
  }
  
  this._eventOnCheckSymbolJwLoot.cell = data[0];
  this._eventOnCheckSymbolJwLoot.reel = data[1];
  this._eventOnCheckSymbolJwLoot.cellSize = data[2];
  this._eventOnCheckSymbolJwLoot.zOrder = data[3];
  this._eventOnCheckSymbolJwLoot.long_symbol = data[4];
  this._eventOnCheckSymbolJwLoot.long_place = data[5];

  this._dispatchToComponents(this._eventOnCheckSymbolJwLoot);
};

ThemeNew.prototype._changeJwListIndex = function(data) {
  if (!this._eventOnJwIndexListChange) {
    return;
  }
  
  this._eventOnJwIndexListChange.reelIndex = data[0];
  this._dispatchToComponents(this._eventOnJwIndexListChange);
};

ThemeNew.prototype._changeSymbolJwLoot = function(data) {
  if (!this._eventOnChangeSymbolJwLoot) {
    return;
  }
  
  this._eventOnChangeSymbolJwLoot.cell = data[0];
  this._eventOnChangeSymbolJwLoot.width = data[1];
  this._eventOnChangeSymbolJwLoot.height = data[2];
  this._eventOnChangeSymbolJwLoot.x = data[3];
  this._eventOnChangeSymbolJwLoot.y = data[4];
  this._eventOnChangeSymbolJwLoot.beforeX = data[5];
  this._eventOnChangeSymbolJwLoot.beforeY = data[6];
  this._eventOnChangeSymbolJwLoot.cellSize = data[7];
  this._eventOnChangeSymbolJwLoot.zOrder = data[8];
  this._eventOnChangeSymbolJwLoot.scale = data[9];

  this._dispatchToComponents(this._eventOnChangeSymbolJwLoot);
};
ThemeNew.prototype.checkJwLootNgPerformOver = function(callBack, data) {
  if (!this._eventOnCheckJwLootNgPerformOver) {
    return;
  }
  
  this._eventOnCheckJwLootNgPerformOver.callBack = callBack;
  this._eventOnCheckJwLootNgPerformOver.data = data;
  this._eventOnCheckJwLootNgPerformOver.spinElementList = this.ClassName.gameLayer.spinLayer.effectLayer.lineAnimator.spinElementList;
  this._eventOnCheckJwLootNgPerformOver.gameLayer = this.ClassName.gameLayer;
  
  this._dispatchToComponents(this._eventOnCheckJwLootNgPerformOver);
};

ThemeNew.prototype.showJwSymbolDown = function() {
  if (!this._eventOnShowJwSymbolDown) {
    return;
  }
  
  this._eventOnShowJwSymbolDown.spinElementList = this.ClassName.gameLayer.spinLayer.effectLayer.lineAnimator.spinElementList;
  
  this._dispatchToComponents(this._eventOnShowJwSymbolDown);
};

ThemeNew.prototype._showJwReelSymbolDown = function(data) {
  if (!this._eventOnShowJwReelSymbolDown) {
    return;
  }
  
  this._eventOnShowJwReelSymbolDown.spinElementList = data.spinElementList;
  
  this._dispatchToComponents(this._eventOnShowJwReelSymbolDown);
};

ThemeNew.prototype.jwLootRefreshLanguage = function() {
  if (!this._eventOnRefreshJwLanguage) {
    return;
  }
  
  this._dispatchToComponents(this._eventOnRefreshJwLanguage);
};
ThemeNew.prototype.updateJw = function(jw_loot) {
  if (!this._eventOnUpdateJw) {
    return;
  }
  
  this._eventOnUpdateJw.jw_loot = jw_loot;
  this.jw_listen = true;
  
  this._dispatchToComponents(this._eventOnUpdateJw);
};

ThemeNew.prototype.fakeSpinUpdateJw = function() {
  if (!this._eventOnFakeSpinUpdateJw) {
    return;
  }
  
  this._dispatchToComponents(this._eventOnFakeSpinUpdateJw);
};

ThemeNew.prototype.setControl = function(ctl) {
  this.ctl = ctl;
  this.ClassName.ctl = ctl;
};

ThemeNew.prototype.setCurScene = function(theScene) {
  this.curScene = theScene || bole.scene;
};

ThemeNew.prototype.onEnter = function() {
  console.log("ThemeNew.onEnter");
  this.initGameLayer();
};
const STUCK_ACTION_TAG = 0x1357;

ThemeNew.prototype.frameUpdate = function(dt) {
  //LobbyControl:getInstance():monitorVerticesCount(dt)
  FloatingLabelControl.getInstance().getFloatingLabel().setVisible(!this.isInFullScreenPerforming() && FloatingLabelControl.getInstance().canShow());

  // spinLayer idle start time
  if (this.ClassName.gameLayer && this.ClassName.gameLayer.spinLayer) {
    if (this.ClassName.SpinLayerState.Rolling === this.ClassName.gameLayer.spinLayer.state) {
      this.stopActionByTag(STUCK_ACTION_TAG);
      this.spinLayerLongTimeIdleFlag = false;
    } else {
      if (!this.spinLayerLongTimeIdleFlag) {
        if (!this.getActionByTag(STUCK_ACTION_TAG)) {
          var checkStuckAction = cc.Sequence.create(
            cc.DelayTime.create(10.0),
            cc.CallFunc.create(function() {
              this.spinLayerLongTimeIdleFlag = true;
            }, this)
          );
          checkStuckAction.setTag(STUCK_ACTION_TAG);
          this.runAction(checkStuckAction);
        }

        if (this.ClassName.SpinLayerState && this.ClassName.SpinLayerState.Show && this.ClassName.gameLayer.spinLayer.state && THEME_GAME_TYPE.MAIN === this.ClassName.ctl.getGameType()) {
          if (this.ClassName.SpinLayerState.Show === this.ClassName.gameLayer.spinLayer.state) {
            if (this.ClassName.gameLayer.spinLayer.effectLayer && this.ClassName.gameLayer.spinLayer.effectLayer.state && this.ClassName.WinShowState && this.ClassName.WinShowState.SymbolLineAnimation) {
              if (this.ClassName.gameLayer.spinLayer.effectLayer.state === this.ClassName.WinShowState.SymbolLineAnimation
                || (111037 === this.ClassName.themeId && this.ClassName.gameLayer.spinLayer.effectLayer.state === this.ClassName.WinShowState.BgWin2)) {
                this.stopActionByTag(STUCK_ACTION_TAG);
                this.spinLayerLongTimeIdleFlag = true;
              }
            }
          }
        }
      }

      if (this.jw_listen && this.ClassName.SpinLayerState.Show === this.ClassName.gameLayer.spinLayer.state) {
        this.jw_listen = false;
        if (this.ClassName && this.ClassName.themeId && LOBBY_THEME_CONFIG[this.ClassName.themeId]?.IS_JW_LOOT) {
          this.showJwSymbolDown();
        }
      }
    }

    if (this.recordFPSFlag) {
      this.fpsRecord = this.fpsRecord || new FPSTool();
      FPSTool.add(this.fpsRecord, Math.min(1 / dt, 240));
    } else {
      this._fpsDropMonitor(dt);
    }

    if (Object.keys(this.recordList).length) {
      for (var key in this.recordList) {
        if (Object.prototype.hasOwnProperty.call(this.recordList, key)) {
          var v = this.recordList[key];
          if (v.recordFlag) {
            FPSTool.add(v.fps, Math.min(1 / dt, 240));
          }
        }
      }
    }
  }
};
const monitorInterval = 30;
let lastTestTSP = 0;
const standard = 10;

ThemeNew.prototype._fpsDropMonitor = function(dt) {
    const tsp = Date.now() / 1000;
    if (tsp - lastTestTSP > monitorInterval && this.fpsRecord && Object.keys(this.fpsRecord).length > 0) {
        const fps = 1 / dt;
        const avgFps = FPSTool.getAvgFPS(this.fpsRecord);
        if (avgFps - fps > standard) {
            const data = {};
            data.event = SplunkHEC.EVENT.FPS_DROP_MONITOR;
            data.uid = User.getInstance().user_id;
            data.themeid = this.themeid;
            data.is_new_user = User.getInstance().isNewUser;
            data.version = String(Math.round(parseFloat(NEWEST_GAME_VERSION)*1000));
            data.cmd = (bole.potp || {}).latestCmdr;
            SplunkHEC.getInstance().sendData(SplunkHEC.EVENT.FPS_DROP_MONITOR, data);
            bole.sendFrontendLog('fps_drop_monitor', data);

            lastTestTSP = tsp;
        }
    }
};

ThemeNew.prototype._onReceiveBatchSpin = function(data) {
    const socket = require('socket');
    const key = 'ng_receive';

    if (this.recordList && this.recordList[key] && Object.keys(this.recordList[key]).length > 0) {
        this.recordList[key].recordFlag = false;
        this.recordList[key].endTime = socket.gettime();
        if ((this.recordList[key].endTime - this.recordList[key].startTime) * 1000 < 30000) {
            RecordTool.add(this.recordList[key].used_time, (this.recordList[key].endTime - this.recordList[key].startTime) * 1000);
        }
    }

    this._dispatchToComponents(this._eventOnReceiveBatchSpin);
};

ThemeNew.prototype._onCanStop = function(data) {
    const socket = require('socket');
    const key = 'ng_receive_on_stop';
    if (this.recordList && this.recordList[key] && Object.keys(this.recordList[key]).length > 0 && this.recordList[key].recordFlag) {
        this.recordList[key].recordFlag = false;
        this.recordList[key].endTime = socket.gettime();
        if ((this.recordList[key].endTime - this.recordList[key].startTime) * 1000 < 30000) {
            RecordTool.add(this.recordList[key].used_time, (this.recordList[key].endTime - this.recordList[key].startTime) * 1000);
        }
    }
};
const gameType = {
    NG: 0,
};

ThemeNew.prototype._onSendBatchSpin = function(data) {
    const socket = require('socket');
    const game_type = data.game_type;
    if (game_type === gameType.NG) {
        if (this.recordList) {
            this.recordList['ng_receive'] = this.recordList['ng_receive'] || { fps: FPSTool.new(), used_time: RecordTool.new(), recordFlag: true };
            this.recordList['ng_receive'].recordFlag = true;
            this.recordList['ng_receive'].startTime = socket.gettime();

            if (data.is_auto === 0) {
                this.recordList['ng_receive_on_stop'] = this.recordList['ng_receive_on_stop'] || { fps: FPSTool.new(), used_time: RecordTool.new(), recordFlag: true };
                this.recordList['ng_receive_on_stop'].recordFlag = true;
                this.recordList['ng_receive_on_stop'].startTime = socket.gettime();
            }
        }
    }
};

ThemeNew.prototype._onSpinStroke = function(data) {
    this._eventOnSpinStroke.data = data;
    this._dispatchToComponents(this._eventOnSpinStroke);
};

ThemeNew.prototype._onEnterForeground = function() {
    this._dispatchToComponents(this._eventOnEnterForeground);
};

ThemeNew.prototype._onEnterBackground = function() {
    this._dispatchToComponents(this._eventOnEnterBackground);
};

ThemeNew.prototype.startFPSRecord = function() {
    this.isNewUser = NEW_USER_GUIDE === true;
    this.recordFPSFlag = true;
};
ThemeNew.prototype.stopFPSRecord = function() {
    this.recordFPSFlag = false;
    if (this.fpsRecord && Object.keys(this.fpsRecord).length > 0) {
        const gotAvgFPS = FPSTool.getAvgFPS(this.fpsRecord);
        if (cc.UserDefault.getInstance().getIntegerForKey("device_theme_quality") === DEVICE_QUALITY_TYPE.NOT_DETECTED) {
            if (gotAvgFPS >= MIN_FPS_STANDARD) {
                cc.UserDefault.getInstance().setIntegerForKey("device_theme_quality", DEVICE_QUALITY_TYPE.HIGH_QUALITY);
            } else {
                cc.UserDefault.getInstance().setIntegerForKey("device_theme_quality", DEVICE_QUALITY_TYPE.LOW_QUALITY);
            }
        }
        const data = FPSTool.dump(this.fpsRecord, `theme_${parseInt(this.ClassName.themeId) || 0}`, this.isNewUser);
        SplunkHEC.getInstance().sendData(SplunkHEC.EVENT.FPS, data);
        bole.potp.send(["splunkinfo", data]);
    }
};

ThemeNew.prototype.isSlotIdle = function() {

};

ThemeNew.prototype.performKickOutTip = function() {
    if (!this.kickOutTip && cc.isValid(this.kickOutTip)) {
        const visibleOrigin = cc.view.getVisibleOrigin();
        const visibleSize = cc.view.getVisibleSize();
        const kickOutPosHorizon = cc.p(visibleOrigin.x + visibleSize.width / 2 + 436.77, visibleOrigin.y + visibleSize.height / 2 - 196.27);
        const kickOutPosVertical = cc.p(visibleOrigin.x + visibleSize.width / 2 + 1.89, visibleOrigin.y + visibleSize.height / 2 - 468.48);
        let posWorld;
        if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
            posWorld = this.ClassName.gameLayer.convertToWorldSpace(kickOutPosHorizon);
        } else if (SCREEN_ORIENTATION.VERTICAL === bole.getScreenOrientation()) {
            posWorld = this.ClassName.gameLayer.convertToWorldSpace(kickOutPosVertical);
            if (bole.isIphoneX()) {
                posWorld.y -= 100;
            } else if (PAD_TAG) {
                posWorld.y += 150;
            }
        }
        if (posWorld) {
            this.kickOutTip = FONTS.addImage(bole.translateImage('theme_common/kick_out', null, true));
            this.kickOutTip.setPosition(posWorld);
            bole.scene.addToFooter(this.kickOutTip, 100);
            if (SCREEN_ORIENTATION.HORIZONTAL === bole.getScreenOrientation()) {
                this.kickOutTip.setScale(SCREEN_RATIO);
            } else if (SCREEN_ORIENTATION.VERTICAL === bole.getScreenOrientation()) {
                this.kickOutTip.setScale(SCREEN_RATIO_VERTICAL);
            }
            this.kickOutTip.opacity = 0;
            this.kickOutTip.runAction(cc.fadeIn(0.5));
        }
    }
};

ThemeNew.prototype.destructKickOutTip = function() {
    if (this.kickOutTip && cc.isValid(this.kickOutTip)) {
        this.kickOutTip.removeFromParent();
        this.kickOutTip = null;
    }
};
ThemeNew.prototype.initGameLayer = function() {
    // 子类中重写
};

ThemeNew.prototype.destruct = function() {
    this.stopFPSRecord();
    TimerCallFunc.clearGroup(this);
    if (this.ClassName.gameLayer) {
        this.ClassName.gameLayer.onGameExit();
        this.ClassName.gameLayer = null;
    }

    let key = 'ng_receive';
    if (this.recordList[key] && Object.keys(this.recordList[key]).length > 0) {
        let data = FPSTool.dump(this.recordList[key].fps, `theme_${parseInt(this.ClassName.themeId) || 0}`, this.isNewUser, key);
        data.avg_used_time = RecordTool.getAvg(this.recordList[key].used_time);
        SplunkHEC.getInstance().sendData(SplunkHEC.EVENT.FPS, data);
        bole.potp.send(["splunkinfo", data]);
        this.recordList[key] = null;
    }

    key = 'ng_receive_on_stop';
    if (this.recordList[key] && Object.keys(this.recordList[key]).length > 0) {
        let data = FPSTool.dump(this.recordList[key].fps, `theme_${parseInt(this.ClassName.themeId) || 0}`, this.isNewUser, key);
        data.avg_used_time_on_stop = RecordTool.getAvg(this.recordList[key].used_time);
        SplunkHEC.getInstance().sendData(SplunkHEC.EVENT.FPS, data);
        bole.potp.send(["splunkinfo", data]);
        this.recordList[key] = null;
    }

    this._dispatchToComponents(this._eventOnDestruct);

    AudioEngine.setEffectsVolume(1);
    AudioEngine.setMusicVolume(1);

    this.unloadThemeMusics();
    this.unloadBasicImgRes();

    this._removeEvent();
};

ThemeNew.prototype.getThemeLoadingView = function() {
    if (IN_HERO_WISH_GAME_THEME) {
        return new HeroLoadingView();
    } else if (PUZZLE_BACK) {
        if (PUZZLE_TYPE == 2) {
            return new BaseLoadingView({ themeId: 9999462 });
        } else if (PUZZLE_TYPE == 3) {
            return new BaseLoadingView({ themeId: 1010032 });
        }
    } else {
        return new BaseLoadingView(this);
    }
};

ThemeNew.prototype.preloadBasicImgResAsync = function (endCallFunc) {
    this.themeLoadResStart = Date.now();

    //this.csbList = this.csbList || {};
    this.initResList();

    this.loadResEndCallFunc = endCallFunc;
    this.curLoadCnt = 0;
    this.objLoadCnt = 0;
    let themeCnt = CNT_IN_THEMECNT;

    if (THEME_CONFIG_LIST[this.themeid] && THEME_CONFIG_LIST[this.themeid].NEW_LOADING_CONFIG && THEME_CONFIG_LIST[this.themeid].NEW_LOADING_CONFIG.specificMusic) {
        let path = `theme_resource/theme${this.themeid}/audio/loading.mp3`;
        if (cc.FileUtils.getInstance().isFileExist(path)) {
            AudioEngine.preloadEffect(path);
        }
    }

    let addLoadResCnt = (obj) => {
        if (themeCnt !== CNT_IN_THEMECNT) {
            return;
        }
        if (!this.ctl.loadingView) {
            return;
        }

        this.curLoadCnt++;
        let percent = 60 + this.curLoadCnt / this.objLoadCnt * 40;

        this.ctl.loadingView.setPercentage(percent);
        if (this.curLoadCnt === this.objLoadCnt) {
            if (this.loadResEndCallFunc) {
                let waitTime;
                if (THEME_CONFIG_LIST[this.themeid] && THEME_CONFIG_LIST[this.themeid].NEW_LOADING_CONFIG && THEME_CONFIG_LIST[this.themeid].NEW_LOADING_CONFIG.specificMusic) {
                    if (!PUZZLE_BACK_3) {
                        let path = `theme_resource/theme${this.themeid}/audio/loading.mp3`;
                        waitTime = THEME_CONFIG_LIST[this.themeid].NEW_LOADING_CONFIG.specificMusicTime || 1.5;
                        AudioEngine.playEffect(path, false);
                    } else {
                        waitTime = 1.5;
                    }
                } else {
                    AudioEngine.playEffect('sounds/dafu_game_loading.mp3', false);
                    waitTime = 1.5;
                }
                if (NewUserControl.isInGroup("20220818A")) {
                    //TimerCallFunc.addCallFunc(function()
                    //{
                        if (this.loadResEndCallFunc) {
                            this.loadResEndCallFunc();
                        }
                        this.loadResEndCallFunc = null;
                        if (this.onLoading_100) {
                            this.onLoading_100();
                        }
                    //}
                        //, waitTime, null, this);
                } else {
                    TimerCallFunc.addCallFunc(() => {
                        if (this.loadResEndCallFunc) {
                            this.loadResEndCallFunc();
                        }
                        this.loadResEndCallFunc = null;
                        if (this.onLoading_100) {
                            this.onLoading_100();
                        }
                    }, waitTime, null, this);
                }
            }
        }
        if (obj && typeof obj === 'object') {
            this.loadResInfo(obj.key, obj.keyTotal);
        }
    };
    this.addLoadResCnt = addLoadResCnt;
    this.onLoading_0();

    let resCount = bole.preloadImgResAsync(this.basicImgResList, (done, objName) => {
        if (themeCnt !== CNT_IN_THEMECNT) {
            return;
        }
        addLoadResCnt({ key: 'a', keyTotal: 'a_t' });
        // 预加载spine数据缓存
        spineUtil.preLoadDataFile(objName);
    });
    this.objLoadCnt += resCount;
    this.setResInfo('a_t', resCount || 0);

    this.loadResInfo('a', 'a_t', true);
};
ThemeNew.prototype.initResInfo = function() {
    this.resInfoPercent = {};
    const initPercent = (key) => {
        this.resInfoPercent[key] = {};
        const percentKey = ["0.25", "0.5", "0.75", "1"];
        for (let k in percentKey) {
            this.resInfoPercent[key][percentKey[k]] = true;
        }
    };
    initPercent('a');
    initPercent('b');
    initPercent('c');
    initPercent('d');
    initPercent('e');

    this.resInfo = {};
    this.resInfo.seq = Date.now();
    this.resInfo.a = 0;
    this.resInfo.b = 0;
    this.resInfo.c = 0;
    this.resInfo.d = 0;
    this.resInfo.e = 0;
    this.resInfo.a_t = 0;
    this.resInfo.b_t = 0;
    this.resInfo.c_t = 0;
    this.resInfo.d_t = 0;
    this.resInfo.e_t = 0;
};

ThemeNew.prototype.initResList = function() {
}

ThemeNew.prototype.setResInfo = function(key, value) {
    this.resInfo = this.resInfo || {};
    this.resInfo[key] = value || 0;
};

ThemeNew.prototype.loadAllMusics = function() {
    this.loadResMusic();
    this.loadThemeMusics();
};

ThemeNew.prototype.loadResMusic = function() {
    var betList = ["global_max_bet"];
    var resMusicList = {
        "sounds/bet/": betList
    };

    for (var preStr in resMusicList) {
        if (resMusicList.hasOwnProperty(preStr)) {
            var list = resMusicList[preStr];
            for (var i = 0; i < list.length; i++) {
                var audioName = list[i];
                cc.audioEngine.preloadEffect(preStr + audioName + ".mp3");
            }
        }
    }
};

ThemeNew.prototype.loadThemeMusics = function() {
    if (this.loadMusicList && this.loadMusicList.length > 0) {
        for (var i = 0; i < this.loadMusicList.length; i++) {
            var v = this.loadMusicList[i];
            cc.audioEngine.preloadEffect(v);
        }
    }
};

ThemeNew.prototype.loadResInfo = function(key, keyTotal, force) {
    var isforce = force || false;
    var info = {
        t: Date.now() - this.themeLoadResStart,
        seq: this.resInfo.seq,
        a: this.resInfo.a || 0,
        b: this.resInfo.b || 0,
        c: this.resInfo.c || 0,
        d: this.resInfo.d || 0,
        e: this.resInfo.e || 0,
        a_t: this.resInfo.a_t || 0,
        b_t: this.resInfo.b_t || 0,
        c_t: this.resInfo.c_t || 0,
        d_t: this.resInfo.d_t || 0,
        e_t: this.resInfo.e_t || 0
    };

    if (isforce) {
        // Splunk.getInstance().send_loadResInfo(info);
    } else {
        var total = this.resInfo[keyTotal];
        this.resInfo[key] = (this.resInfo[key] || 0) + 1;
        var count = this.resInfo[key];

        if (typeof total === 'number' && total > 0) {
            var percent = count * 1.0 / total;

            for (var i = 0; i < [1, 0.75, 0.5, 0.25].length; i++) {
                var v = [1, 0.75, 0.5, 0.25][i];
                if (percent >= v) {
                    var keyStr = v.toString();

                    if (this.resInfoPercent[key][keyStr]) {
                        info.t = Date.now() - this.themeLoadResStart;
                        info.a = this.resInfo.a || 0;
                        info.b = this.resInfo.b || 0;
                        info.c = this.resInfo.c || 0;
                        info.d = this.resInfo.d || 0;
                        info.e = this.resInfo.e || 0;
                        info.a_t = this.resInfo.a_t || 0;
                        info.b_t = this.resInfo.b_t || 0;
                        info.c_t = this.resInfo.c_t || 0;
                        info.d_t = this.resInfo.d_t || 0;
                        info.e_t = this.resInfo.e_t || 0;

                        // Splunk.getInstance().send_loadResInfo(info);
                        this.resInfoPercent[key][keyStr] = false;
                    }
                }
            }
        }
    }
};

ThemeNew.prototype.preloadHeroSGRes = function(endCallFunc) {
    // TODO overwritten
};

ThemeNew.prototype.onLoading_0 = function() {
    // 通过加载csb构建的类，都写在这里调用。
    this.loadFuncList = [];
    this.setResInfo('e_t', 3);
    this.objLoadCnt = this.objLoadCnt + this.loadFuncList.length;
    this.objLoadCnt = this.objLoadCnt + 1; // recv enterThemeData called in self.ctl:onEnter()
    //AudioEngine.playEffect('sounds/dafu_game_loading.mp3', false)
};

ThemeNew.prototype.onLoading_100 = function() {
    const localLogFlag = 15;
    if (true) {
        // LoginControl:getInstance().logFlag < localLogFlag then
        bole.potp.send('behavior', { page: localLogFlag, theme_id: this.themeid });
        LoginControl.getInstance().logFlag = localLogFlag;
    }
    let duration = 0;
    if (bole.codeEnterThemeTime && typeof bole.codeEnterThemeTime === "number") {
        duration = Date.now() / 1000 - bole.codeEnterThemeTime;
    }
    // Splunk:getInstance():send_codeInfo("inslotsuc", { t = duration})
};

ThemeNew.prototype.preloadImgResAsync = function(resList, overCallback) {
    const resCount = bole.preloadImgResAsync(resList, (over, objName) => {
        // 预加载spine数据缓存
        // spineUtil.preLoadDataFile(objName);
        if (over) {
            if (overCallback) {
                overCallback();
            }
        }
    });
    return resCount;
};

ThemeNew.prototype.unloadImgRes = function(resList) {
    bole.unloadImgRes(resList);
};

ThemeNew.prototype.unloadBasicImgRes = function() {
    bole.unloadImgRes(this.basicImgResList);
    this.basicImgResList = [];
    cc.SpriteFrameCache.getInstance().removeUnusedSpriteFrames();
    spineUtil.disposeAllSkeletonData();
};

ThemeNew.prototype.dumpTextures = function() {
    if (appDebugMode) {
        const sss = cc.director.getTextureCache().getCachedTextureInfo();
        const sssArr = bole.splitStr(sss, "\n");
        for (let k = 0; k < sssArr.length; ++k) {
            console.log("[" + k + "]  =  " + sssArr[k]);
        }
    }
};

ThemeNew.prototype.unloadThemeMusics = function() {
    if (this.loadMusicList && this.loadMusicList.length > 0) {
        for (let k = 0; k < this.loadMusicList.length; ++k) {
            AudioEngine.unloadEffect(this.loadMusicList[k]);
        }
    }
};

ThemeNew.prototype.adjustTheme = function (data) {
  // 子类中重写
};

ThemeNew.prototype.onShow = function () {
  // 子类中重写
};

ThemeNew.prototype.onSpinStart = function () {
  this.stopActionByTag(777);
  this.stopActionByTag(987);
  this.playGame = false;

  this.hintMusicCnt = 0;
  if (this.playNormalLoopMusic) {
    this.playNormalLoopMusic = false;
  }

  const action = cc.sequence(cc.delayTime(30), cc.callFunc(function() {
    if (bole.loginSuc) {
      this.ctl.header.toLobbyScene(true);
    }
  }));
  action.setTag(tag_long_time_no_stop);
  this.stopActionByTag(tag_long_time_no_stop);
};

ThemeNew.prototype.canSpin = function () {
  // 子类中重写
};

ThemeNew.prototype.canStop = function () {
  // 子类中重写
};

ThemeNew.prototype.onAllReelStop = function () {
  this.stopActionByTag(tag_long_time_no_stop);
};

ThemeNew.prototype.dealAboutBetChange = function () {
  // 子类中重写
};
ThemeNew.prototype.dealMusic_TouchBtnSpinMusic = function() {
  cc.audioEngine.playEffect('sounds/reel_click.mp3', false);
};

ThemeNew.prototype.dealMusic_TouchBonusBtnSpinMusic = function() {
  cc.audioEngine.playEffect('sounds/bgspin.mp3', false);
};

ThemeNew.prototype.getPic = function(name) {
  return "theme" + this.themeid + "/" + name;
};

ThemeNew.prototype.getCommonPic = function(name) {
  return `theme_resource/common/${name}`;
};

ThemeNew.prototype.getAudio = function(name) {
  return "theme" + this.themeid + "/audio/" + name;
};

ThemeNew.prototype.getCommonAudio = function(name) {
  return `sounds/${name}`;
};

ThemeNew.prototype.touchPaytableCallback = function() {
  // 子类中重写
};

ThemeNew.prototype.paytableBackCallback = function() {
  // 子类中重写
};

ThemeNew.prototype.refreshLanguage = function() {
  // 子类中重写
};
ThemeNew.prototype.isStuck = function() {
  return this.spinLayerLongTimeIdleFlag && !this.getNeedClearScreen();
};

ThemeNew.prototype.setNeedClearScreen = function(flag) {
  this._needClearScreen = flag;

  // if (IN_QUEST_NEW_USER_THEME_FLAG) {
  //   // 只有新手Quest进度
  // } else {
  //   ThemeActivityControl.needClearScreen(flag);
  // }
  // ThemeFeedbackControl.needClearScreen(flag);
};

ThemeNew.prototype.getNeedClearScreen = function() {
  return !!this._needClearScreen;
};

ThemeNew.prototype.isSelectingSpecialGame = function() {
  // 子类中重写
  return false;
};

ThemeNew.prototype.isInFullScreenPerforming = function() {
  // 子类中重写
  if (this && this.ctl && this.ctl.getGameType && this.ctl.getGameType() === THEME_GAME_TYPE.BONUS) {
    return true;
  }
  return false;
};

ThemeNew.prototype.dealKeepAlive = function(data) {
  // 子类中重写
};

ThemeNew.prototype.dealShopSpin = function(data) {
  // 子类中重写
};
ThemeNew.prototype.getSpinTableCenterWorldPos = function() {
  if (this.ClassName.gameLayer && this.ClassName.gameLayer.spinLayer) {
    return this.ClassName.gameLayer.spinLayer.convertToWorldSpace(this.ClassName.gameLayer.spinLayer.tableCenterPos);
  }
};

ThemeNew.prototype.adNodeReposition = function(pos, reset) {
  pos = pos || cc.p(0, 0);

  const footer = bole.getFooter();
  if (footer) {
    const adNode = footer.advertiseNode;
    if (adNode && !adNode.isValid) {
      if (reset) {
        adNode.setPosition(pos);
      } else {
        const offset = pos;
        adNode.setPosition(cc.pAdd(adNode.getPosition(), offset));
      }
    }
  }
};

ThemeNew.prototype.refreshSpinLayer = function() {
  if (this.ClassName.gameLayer && this.ClassName.gameLayer.spinLayer) {
    this.ClassName.gameLayer.spinLayer.removeFromParent();
    this.initSpinLayer();
  }
};

ThemeNew.prototype.initSpinLayer = function() {
  // 子类中重写
};
ThemeNew.prototype.createDiamondUnitedNode = function(isLeft) {
    const duNode = new cc.Node();
    this.ClassName.duNode = duNode;
    duNode.isLeft = isLeft;

    const createDiamondUnitedTip = function(isLeft) {
        const factor = isLeft ? -1 : 1;
        const factorOffset = isLeft ? -10 : 0;
        const tipNode = new cc.Node();

        const tipBG = FONTS.addImage(this.ClassName.ImgPath + 'unitBG.png');
        tipBG.setScaleX(factor);
        tipNode.addChild(tipBG);

        const text = FONTS.addImage(bole.translateImage('united_text_1', this.ClassName.themeId));
        text.setPosition(-15 * factor + factorOffset, 30);
        tipNode.addChild(text);

        const num1 = FONTS.addFNT(this.ClassName.FntPath + 'DiamondActiveFnt.fnt',
        bole.comma_value_abbrev(DIAMOND_UNITED_LATEST_DATA.fg_max_win || 0, 9));
        num1.setPosition(-factor * 10, 74);
        tipNode.addChild(num1);
        const num2 = FONTS.addFNT(this.ClassName.FntPath + 'DiamondActiveFnt.fnt',
        'X' + String(DIAMOND_UNITED_LATEST_DATA.multi || 0));
        num2.setPosition(-factor * 10, 16);
        tipNode.addChild(num2);
        const num3 = FONTS.addFNT(this.ClassName.FntPath + 'DiamondActiveFnt.fnt',
        bole.comma_value_abbrev(DIAMOND_UNITED_LATEST_DATA.max_can_win || 0, 9));
        num3.setPosition(-factor * 10, -76);
        tipNode.addChild(num3);
        bole.setLabelWidth(num1, 150);
        bole.setLabelWidth(num2, 150);
        bole.setLabelWidth(num3, 140);

        const infoEvent = function(sender, eventType) {
        if (eventType === ccui.TouchEventType.ended) {
            if (isPopupValid('P1407')) {
            PopupDialogCommon.new({
                id: 'P1407',
                extraScale: (bole.getScreenOrientation() === SCREEN_ORIENTATION.VERTICAL) ? 0.56 : 1,
                last_secs: 86400
            }).show();
            }
        }
        };
        const plusEvent = function(sender, eventType) {
        if (eventType === ccui.TouchEventType.ended) {
            StoreControl.getInstance().getStoreDialog(null, null, 14);
        }
        };
        
        const btnInfo = new cc._Button(this.ClassName.ImgPath + 'btn_info.png',
        this.ClassName.ImgPath + 'btn_info_clicked.png',
        this.ClassName.ImgPath + 'btn_info_clicked.png');
        btnInfo.addTouchEventListener(infoEvent);
        btnInfo.setPosition(isLeft ? 57 : 43, -40);
        const btnPlus = new cc._Button(this.ClassName.ImgPath + 'btn_plus.png',
        this.ClassName.ImgPath + 'btn_plus_clicked.png',
        this.ClassName.ImgPath + 'btn_plus_clicked.png');
        btnPlus.addTouchEventListener(plusEvent);
        btnPlus.setPosition(isLeft ? 82 : 75, -73);
        
        tipNode.addChild(btnInfo);
        tipNode.addChild(btnPlus);
        
        return tipNode;
        
    };
    const btn = new cc._Button(bole.translateImage("unitBtn", this.ClassName.themeId));
    const touchEvent = function(sender, eventType) {
        if (eventType === ccui.TouchEventType.began) {
        // TODO: Add logic for began event
        } else if (eventType === ccui.TouchEventType.ended) {
        if (duNode.locked) {
            if (isPopupValid('P1406')) {
            new PopupDialogCommon({
                id: 'P1406',
                extraScale: bole.getScreenOrientation() === SCREEN_ORIENTATION.VERTICAL ? 0.56 : 1,
                last_secs: bole.getCountDown('diamond_united_countdown') || 0,
                action: '2',
                info_action: 'P1407'
            }).show();
            }
        } else {
            let tipNode = duNode.getChildByName('tip');
            bole.setEnableRecursiveCascading(tipNode, true);
            if (!tipNode || tolua.isnull(tipNode)) {
            tipNode = createDiamondUnitedTip(duNode.isLeft);
            bole.setEnableRecursiveCascading(tipNode, true);
            const factor = duNode.isLeft ? -1 : 1;
            tipNode.setPosition(-200 * factor, -80);
            tipNode.setName('tip');
            duNode.addChild(tipNode);
    
            tipNode.runAction(cc.sequence(
                cc.delayTime(4),
                cc.fadeOut(1.0),
                cc.removeSelf()
            ));
            } else {
            tipNode.removeFromParent();
            }
        }
        }
    };
    btn.addTouchEventListener(touchEvent);
    btn.name = 'btn';
    duNode.addChild(btn);
    
    const num = FONTS.addFNT(`${this.ClassName.FntPath}DiamondActiveFnt.fnt`,
      (DIAMOND_UNITED_LATEST_DATA.fg_times || 0).toString());
    num.setPosition(0, -8);
    num.name = 'num';
    duNode.addChild(num);
    
    duNode.setVisible(DIAMOND_UNITED_OPEN === true);
    
    duNode.locked = this.ClassName.ctl.getCurTotalBet() < BetControl.getMinClubPointTotalBet()
      || !ActivityControl.getInstance().isDiamondUnitedActivated();
    
    duNode.update = function() {
      const tipNode = this.getChildByName('tip');
      if (tipNode && !tipNode.isNulled()) {
        tipNode.removeFromParent();
        const newTipNode = createDiamondUnitedTip(this.isLeft);
        bole.setEnableRecursiveCascading(newTipNode, true);
        const factor = this.isLeft ? -1 : 1;
        newTipNode.setPosition(-200 * factor, -80);
        newTipNode.name = 'tip';
        this.addChild(newTipNode);
    
        newTipNode.runAction(cc.sequence(
          cc.delayTime(4),
          cc.fadeOut(1.0),
          cc.removeSelf()
        ));
      }
      const theNum = this.getChildByName('num');
      if (theNum && !theNum.isNulled()) {
        theNum.setString((DIAMOND_UNITED_LATEST_DATA.fg_times || 0).toString());
      }
    
      this.setVisible( DIAMOND_UNITED_OPEN === true);
    };
    duNode.lock = function(classObj, force) {
      if (!this.locked || force) {
        const tipNode = this.getChildByName('tip');
        const theBtn = this.getChildByName('btn');
        if (tipNode && !tipNode.isNulled()) {
          tipNode.removeFromParent();
        }
    
        const lock = FONTS.addImage(`${classObj.ImgPath}unitLock.png`);
        lock.setPosition(4, -6);
        lock.name = 'lock';
        this.addChild(lock);
        if (theBtn && !theBtn.isNulled()) {
          theBtn.color = cc.color(71, 71, 71);
        }
        const theNum = this.getChildByName('num');
        if (theNum && !theNum.isNulled()) {
          theNum.color = cc.color(71, 71, 71);
        }
      }
      this.locked = true;
    };
    
    duNode.unlock = function(force) {
      if (this.locked || force) {
        const lock = this.getChildByName('lock');
        const theBtn = this.getChildByName('btn');
    
        if (lock && !lock.isNulled()) {
          lock.removeFromParent();
        }
        if (theBtn && !theBtn.isNulled()) {
          theBtn.color = cc.Color.WHITE;
        }
        const theNum = this.getChildByName('num');
        if (theNum && !theNum.isNulled()) {
          theNum.color = cc.Color.WHITE;
        }
      }
      this.locked = false;
    };
    duNode.showMultiTip = function(classObj) {
      const factor = this.isLeft ? -1 : 1;
      const multiTip = new cc.Node();
      bole.setEnableRecursiveCascading(multiTip, true);
      multiTip.setPosition(-250 * factor, 0);
    
      const bg = FONTS.addImage(`${classObj.ImgPath}united_bg_2.png`);
      bg.setScaleX(factor);
      multiTip.addChild(bg);
      const text = FONTS.addImage(bole.translateImage("united_text_2", classObj.themeId));
      text.setPosition(factor * -6, 0);
      multiTip.addChild(text);
    
      multiTip.runAction(cc.sequence(
        cc.delayTime(4),
        cc.fadeOut(1.0),
        cc.removeSelf()
      ));
    
      this.addChild(multiTip);
    };
    
    duNode.showWinTip = function(classObj) {
      const factor = this.isLeft ? -1 : 1;
      const winTip = new cc.Node();
      bole.setEnableRecursiveCascading(winTip, true);
      winTip.setPosition(-250 * factor, 0);
    
      const bg = FONTS.addImage(`${classObj.ImgPath}united_bg_2.png`);
      bg.setScaleX(factor);
      winTip.addChild(bg);
      const text = FONTS.addImage(bole.translateImage("united_text_3", classObj.themeId));
      text.setPosition(factor * -6, 0);
      winTip.addChild(text);
    
      winTip.runAction(cc.sequence(
        cc.delayTime(4),
        cc.fadeOut(1.0),
        cc.removeSelf()
      ));
    
      this.addChild(winTip);
    };
    
    if (duNode.locked) {
      duNode.lock(this.ClassName, true);
    } else {
      duNode.unlock(true);
    }
    
    return duNode;
};
ThemeNew.prototype.getDiamondUnitedNode = function() {
    return this.ClassName.duNode;
}

ThemeNew.prototype.readyToChangeBet = function() {
    // Override this function in the theme class to perform operations before changing bets.
    return true;
}

ThemeNew.prototype.getBasicImgResList = function() {
    return this.basicImgResList;
}

ThemeNew.prototype.getSpineImgResList = function() {
    return this.spineImgResList;
}

ThemeNew.prototype.getFgImgResList = function() {
    // fgImgResList.manual && fgImgResList.auto
    return this.fgImgResList;
}

ThemeNew.prototype.getBgImgResList = function() {
    // bgImgResList.manual && bgImgResList.auto
    return this.bgImgResList;
}

ThemeNew.prototype.getBwImgResList = function() {
    // bwImgResList.manual && bwImgResList.auto
    return this.bwImgResList;
}
ThemeNew.prototype.getReservePath = function() {
    // Store paths of textures to retain in memory when memory warnings occur
    const ret = [...this.basicImgResList, ...this.spineImgResList];
    if (this.fgImgResList && Object.keys(this.fgImgResList).length) {
        ret.push(...this.fgImgResList.manual);
        ret.push(...this.fgImgResList.auto);
    }
    if (this.bgImgResList && Object.keys(this.bgImgResList).length) {
        ret.push(...this.bgImgResList.manual);
        ret.push(...this.bgImgResList.auto);
    }
    if (this.bwImgResList && Object.keys(this.bwImgResList).length) {
        ret.push(...this.bwImgResList.manual);
        ret.push(...this.bwImgResList.auto);
    }
    return ret;
}

ThemeNew.prototype.setThemeScaleX = function(bgSpr, baseScale = 1) {
    if (!bgSpr || !bole.isChrome()) {
        return;
    }

    const size = bgSpr.getContentSize();
    const director = cc.director;
    const glSize = director.getVisibleSize();

    // Special handling for "航海宝藏" background
    if (size.width === 0) {
        size.width = 720;
        size.height = 1560;
    }

    return bgSpr.setScaleX((glSize.width / size.width) * bgSpr.getScaleX() * baseScale);
}
