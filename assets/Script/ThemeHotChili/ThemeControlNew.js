require("./BetControl");

IN_HERO_WISH_GAME_THEME = false;
THEME_CONTROL_STATUS_LIST = {
	LOADING 	: "loading",
	THEME 		: "theme",
}
THEME_BASE_TYPE = {
    OLD : 0,
    NEW : 1
}

THEME_GAME_TYPE = {
    MAIN : 0,
    FREE : 1,
    BONUS : 2,
    superFG : 3,
    FREEBONUS : 4,
    MAPFREE : 5,
    MAPBONUS : 6,
}

THEME_CONTROL_LOCK_LIST   = {
	ENTER_CMD			: "enter_cmd",
	LOAD_RES			: "load_res",
	CHECK_RES			: "check_res",
	FUHAO_RES			: 'fuhao_res',
	COMMON_REWARD		: 'common_reward',
	NEW_USER_PRELOAD	: 'new_user_preload',
	COMMON_PRELOAD		: 'common_preload',
};

RELOAD_BACKEND_THEME_CONFIG_DATA = function(data) {
	if (data.level_bet) {
		let flag = false;
		if (LEVEL_BET_DATA && BetControl.getBetList()) {
			if (BetControl.getMaxBet() < BetControl.getMinLargeBet()) {
				flag = true;
			}
		}
		LEVEL_BET_DATA = bole.updateTable(LEVEL_BET_DATA, data.level_bet);
		GLOBAL_LEVEL_BET = bole.updateTable(GLOBAL_LEVEL_BET, data.level_bet);
		if (flag && BetControl.getMaxBet() >= BetControl.getMinLargeBet()) {
			EventCenter.pushEvent(EVT.SYSTEM.MAX_BET_EXCEED_MIN_LARGE);
		}
	}

	if (data.theme_base_bet) {
		THEME_BASE_BET_DATA = bole.updateTable(THEME_BASE_BET_DATA, data.theme_base_bet);
	}

	if (data.slots_config) {
		SLOTS_CONFIG_DATA = bole.updateTable(SLOTS_CONFIG_DATA, data.slots_config);
		THEME_UNLOCK_DATA = {};

		if (USE_BACKEND_THEME_CONFIG) {
			THEME_SEQUENCE = {};
			CLUB_THEME_SEQUENCE = {};

			let themeForeNoticeNum = 1;
			let skipCnt = 0;
			for (let [k,v] of SLOTS_CONFIG_DATA.normal_hall.entries()) {
				let idx = parseInt(v[0]) - skipCnt;
				let themeid = parseInt(v[1]);
				if (THEME_CONFIG_LIST[themeid]) {
					THEME_SEQUENCE[idx] = themeid;

					let idx_divide_three = Math.floor((idx - 1) / 3);
					let idx_divide_six = Math.floor((idx - 1) / 6);
					let idx_mod_six = (idx - 1) % 6;
					let posY_by_idx = (idx_divide_three % 2 == 0) ? 1 : -1;
					let idx_offset = idx_divide_six * 3;
					let idx_six_mod_three = idx_mod_six % 3;
					let posX_by_idx = idx_six_mod_three + idx_offset;

					LOBBY_THEME_CONFIG[themeid].POS_X_IDX = posX_by_idx;
					LOBBY_THEME_CONFIG[themeid].POS_Y_IDX = posY_by_idx;
					THEME_CONFIG_LIST[themeid].UNLOCK_LEVEL_NORMAL = parseInt(v[3]);
					THEME_UNLOCK_DATA[parseInt(v[3])] = themeid;

					LOBBY_THEME_CONFIG[themeid].IS_HOT_RED = 1 <= k && k <= 3;
					LOBBY_THEME_CONFIG[themeid].IS_NEW = 4 <= k && k <= 6;
					LOBBY_THEME_CONFIG[themeid].IS_HOT = false;
					LOBBY_THEME_CONFIG[themeid].IS_NEW_RED = false;
				}
				else {
					skipCnt++;
				}
			}

			LOBBY_VIEW_X_IDX_MAX = ((THEME_SEQUENCE.length + themeForeNoticeNum) % 6 == 0)
				? ((THEME_SEQUENCE.length + themeForeNoticeNum) / 2 - 1)
				: (((THEME_SEQUENCE.length + themeForeNoticeNum) + 6 - (THEME_SEQUENCE.length + themeForeNoticeNum) % 6) / 2 - 1);

			let max_num_normal = (LOBBY_VIEW_X_IDX_MAX + 1) * 2 + themeForeNoticeNum;
			for (let i = THEME_SEQUENCE.length + 1; i <= max_num_normal; i++) {
				LOBBY_THEME_CONFIG[i] = {};

				let idx = i;
				let idx_divide_three = Math.floor((idx - 1) / 3);
				let idx_divide_six = Math.floor((idx - 1) / 6);
				let idx_mod_six = (idx - 1) % 6;
				let posY_by_idx = (idx_divide_three % 2 == 0) ? 1 : -1;
				let idx_offset = idx_divide_six * 3;
				let idx_six_mod_three = idx_mod_six % 3;
				let posX_by_idx = idx_six_mod_three + idx_offset;

				LOBBY_THEME_CONFIG[idx].POS_X_IDX = posX_by_idx;
				LOBBY_THEME_CONFIG[idx].POS_Y_IDX = posY_by_idx;
			}

			skipCnt = 0;
			for (let [k,v] of SLOTS_CONFIG_DATA.club.entries()) {
				let idx = parseInt(v[0]) - skipCnt;
				let themeid = parseInt(v[1]);

				if (THEME_CONFIG_LIST[themeid]) {
					CLUB_THEME_SEQUENCE[idx] = themeid;

					let idx_divide_three = Math.floor((idx - 1) / 3);
					let idx_divide_six = Math.floor((idx - 1) / 6);
					let idx_mod_six = (idx - 1) % 6;
					let posY_by_idx = (idx_divide_three % 2 == 0) ? 1 : -1;
					let idx_offset = idx_divide_six * 3;
					let idx_six_mod_three = idx_mod_six % 3;
					let posX_by_idx = idx_six_mod_three + idx_offset;

					LOBBY_THEME_CONFIG[themeid].POS_X_IDX_2 = posX_by_idx;
					LOBBY_THEME_CONFIG[themeid].POS_Y_IDX_2 = posY_by_idx;
					THEME_CONFIG_LIST[themeid].UNLOCK_LEVEL_CLUB = parseInt(v[3]);
				}
				else {
					skipCnt++;
				}
			}

			CLUB_LOBBY_VIEW_X_IDX_MAX = ((CLUB_THEME_SEQUENCE.length + themeForeNoticeNum) % 6 == 0)
				? ((CLUB_THEME_SEQUENCE.length + themeForeNoticeNum) / 2 - 1)
				: (((CLUB_THEME_SEQUENCE.length + themeForeNoticeNum) + 6 - (CLUB_THEME_SEQUENCE.length + themeForeNoticeNum) % 6) / 2 - 1);

			let max_num_club = (CLUB_LOBBY_VIEW_X_IDX_MAX + 1) * 2 + themeForeNoticeNum;

			if (max_num_club % 6 !== 0) {
				max_num_club += 6 - max_num_club % 6;
			}

			for (let i = CLUB_THEME_SEQUENCE.length + 1; i <= max_num_club; i++) {
				if (!LOBBY_THEME_CONFIG[i]) {
					LOBBY_THEME_CONFIG[i] = {};
				}

				let idx = i;
				let idx_divide_three = Math.floor((idx - 1) / 3);
				let idx_divide_six = Math.floor((idx - 1) / 6);
				let idx_mod_six = (idx - 1) % 6;
				let posY_by_idx = (idx_divide_three % 2 == 0) ? 1 : -1;
				let idx_offset = idx_divide_six * 3;
				let idx_six_mod_three = idx_mod_six % 3;
				let posX_by_idx = idx_six_mod_three + idx_offset;

				LOBBY_THEME_CONFIG[idx].POS_X_IDX_2 = posX_by_idx;
				LOBBY_THEME_CONFIG[idx].POS_Y_IDX_2 = posY_by_idx;
			}
		}
	}
}



var themeInitTable = {
}
var lastActivityState = 1; // 1 活动 2 quest
let bwImgReady = false;

ThemeControlNew = cc.Class({
	name:"ThemeControlNew",
	ctor:function(){		
		var theme = arguments[0];
		var curScene = arguments[1];
		this._enterThemeData = null;
		this.theme 	        = theme
		this.scheduleNode = new cc.Node();
		this.theme.addChild(this.scheduleNode);
		this.themeName      = theme.ClassName
		this.setGameType(THEME_GAME_TYPE.MAIN)
		this.curScene  	    = curScene
		this.curStatus      = null
		this.header 	    = null
		this.footer  	    = null
		this.betControl     = null
		this.lockTagList    = {}
		this.needToFgChoice = false
		this.autoEnable		= false
		this.spin_index = 0
		this.respList = {}
		//this.afterSpinPopupHeap = PriorityQueue.new()

		for (const _ in THEME_CONTROL_LOCK_LIST) {
			const  theLockName  = THEME_CONTROL_LOCK_LIST[_];
			if ( theLockName  == null) continue;
			this.lockTagList[theLockName] = true
		}
		TimerCallFunc.addScheduleFunc(() => {
			STAMP_CAN_SPIN_FALSE = 0
		}, 2.0, this.scheduleNode, this)

		EventCenter.registerEvent(EVT.THEME.BTN_SPIN_STATE, this.updateSpinState, this)
	},
	setGameType:function(T){
    	this.themeGameType = T;
	},
	getGameType:function(){
    	return this.themeGameType;
	},
	initBetControl:function(){
		this.betControl = new BetControl(this);
	},
	disableSpinAndOtherBtns : function(){
		this.footer.disableSpinAndOtherBtns();
	},
	setCacheRet : function(theSpinRet){
		this.cacheSpinRet = theSpinRet
	},
	getCurBet : function(){
		if(!this.isBetControlReady()) return null;
		else return this.betControl.getCurBet();
	},
	isBetControlReady:function(){
		return (null != this.betControl);
	},
	getCurTotalBet:function(){
		if(!this.isBetControlReady()) return 0;
		else this.betControl.getCurTotalBet();
	},
	enableSpin:function(){
		this.footer.enableSpin();
	},
	disableSpin:function(){
		this.footer.disableSpin()
	},
	getAutoStatus:function(){
		return true == this.autoSpin;
	},
	performBigWin: function(winType, totalWin, callback, extraCheck, musicVolume) {
		musicVolume = musicVolume || 0;
		TimerCallFunc.addScheduleUntilFunc(function() {
			let checked;
			if (extraCheck === undefined) {
				checked = true;
			} else {
				checked = extraCheck();
			}
	
			if (bwImgReady && checked) {
				let callback2 = function() {
					if (callback) {
						callback();
					}
					this.unloadBWImgRes();
				}.bind(this);
				new ThemeWinNode(winType, totalWin, callback2, musicVolume);
				return true;
			} else {
				return false;
			}
		}, 0.1, this, this);
	},
	turnOffAutoSpinCheck:function(){
		this.autoSpinCheck = false
	},
	setTurboVisible:function(flag){
		this.footer.setTurboVisible(flag)
	},
	setFooterSpinBtn:function(){
		this.footer.setSpinBtn()
	},
	
	hideThemeActivityNode: function(time) {
		// if (ThemeActivityControl.hide(time)) {
		// 	lastActivityState = 1;
		// } else {
		// 	QuestStayControl.getInstance().shrinkInThemeProgress();
		// 	lastActivityState = 2;
		// }
		// ThemeFeedbackControl.hideFeedback();
		// if (this.newUserMissionBoard !== null && this.newUserMissionBoard !== undefined) {
		// 	this.newUserMissionBoard.hideThemeActivityNode();
		// }
	},
	forceSetTurboStatus:function(flag){
		this.footer.forceSetTurboStatus(flag)
	},
	showThemeActivityNode: function() {
		// if (lastActivityState === 2) {
		// 	QuestStayControl.getInstance().expandInThemeProgress();
		// } else {
		// 	ThemeActivityControl.show();
		// }
		// ThemeFeedbackControl.showFeedback();
		// if (this.newUserMissionBoard !== null && this.newUserMissionBoard !== undefined) {
		// 	this.newUserMissionBoard.showThemeActivityNode();
		// }
	},
	enableSpinAndOtherBtns:function(){
		this.footer.enableSpinAndOtherBtns();
	},
	setFooterAutoSpinBtn:function(){
		this.footer.setAutoSpinBtn();
	},
	fadeLoopMusic: function(delay, duration, beginVolume, endVolume) {
		if (!this.fadeMusicActionNode || this.fadeMusicActionNode.isValid === false) {
			this.fadeMusicActionNode = new cc.Node();
			this.theme.addChild(this.fadeMusicActionNode);
		}
		let finalVolume = endVolume || 0;
		let nowMusicVolume = beginVolume || cc.audioEngine.getMusicVolume();
		if (Math.abs(nowMusicVolume - finalVolume) < 0.01) {
			return;
		}
		let fadeDuration = duration || 1;
		let interval = 1/10;
		let actionList = [];
		let actionListCopy = [];
		let frame = Math.floor(fadeDuration / interval);
		let initialVolume = nowMusicVolume || 0;
		let perChangeVolume = (finalVolume - initialVolume) / frame;
	
		let initialDelay = delay || 0;
		let delayTime = cc.delayTime(initialDelay);
		actionList.push(delayTime);
	
		for (let i = 1; i <= frame; i++) {
			let changeAction = cc.callFunc(function() {
				cc.audioEngine.setMusicVolume(initialVolume + perChangeVolume * i);
				if (this.fadeMusicActionList && this.fadeMusicActionList.length > 0) {
					this.fadeMusicActionList.shift();
				}
			}, this);
	
			let delayTime = cc.delayTime(interval);
			actionList.push(delayTime);
			actionList.push(changeAction);
	
			actionListCopy.push([interval, initialVolume + perChangeVolume * i]);
		}
	
		this.fadeMusicActionNode.runAction(cc.sequence(...actionList));
		this.fadeMusicState = null;
		this.fadeMusicActionList = actionListCopy;
	},
	loopMusicBackoff: function(duration, delay) {
		delay = delay || 0;
		if (!this.backoffMusicActionNode || this.backoffMusicActionNode.isValid === false) {
			this.backoffMusicActionNode = new cc.Node();
			this.theme.addChild(this.backoffMusicActionNode);
		}
		this.backoffMusicActionNode.runAction(cc.sequence(
			cc.delayTime(delay),
			cc.callFunc(function() {
				this.fadeLoopMusic(0, 0.1, 1, 0.2);
			}, this),
			cc.delayTime(Math.max(duration - 0.2, 0)),
			cc.callFunc(function() {
				this.fadeLoopMusic(0, 0.1, 0.2, 1);
			}, this)
		));
	},
	preloadBWImgRes:function() {
		ThemeWinNode.loadEffects();
		
		console.log('@xsm preload BigWin resources');
		this.theme.preloadImgResAsync(ThemeWinNode.getPreloadRes().manual, () => {
			bwImgReady = true;
		});
	},
	getTotalWinNumValue:function(){
		return this.footer.getTotalWinNumValue();
	},

	requestSpecialFreeGameSpin() {
		this.touchSpinTime = Date.now();
		const curBet = this.getCurBet();
		const socket = require('socket');
		this.spinRequestTime = socket.gettime();
	},
	sendThemeJpCmd:function() {
		const bet = this.getCurBet();
		const mathType = (this.theme && this.theme.mathType) ? this.theme.mathType : (bet < BetControl.getMinLargeBet() ? 0 : 1);
		const paramTable = { theme_id: this.getThemeId(), bet, math_type: mathType };
	
		//??bole.potp.send([THEME_JP_CMD, paramTable]);
	},
	stopFadeMusicActionNode() {
		if (this.fadeMusicActionNode && !this.fadeMusicActionNode.isValid) {
			this.fadeMusicActionNode.stopAllActions();
			this.fadeMusicActionList = null;
			this.fadeMusicState = null;
		}
		if (this.backoffMusicActionNode && !this.backoffMusicActionNode.isValid) {
			this.backoffMusicActionNode.stopAllActions();
		}
	},
	
	pauseFadeMusic() {
		// console.log("zyj_pauseFadeMusic1");
		if (this.fadeMusicActionNode && !this.fadeMusicActionNode.isValid) {
			// console.log("zyj_pauseFadeMusic2" + " fadeMusicActionList=" + (this.fadeMusicActionList || []).length);
			this.fadeMusicActionNode.stopAllActions();
			this.fadeMusicState = "pause";
		}
		// return this.fadeMusicActionList;
	},
	
	resumeFadeMusic() {
		if (Array.isArray(this.fadeMusicActionList) && this.fadeMusicState === "pause" && this.fadeMusicActionList.length > 0) {
			if (this.fadeMusicActionNode && !this.fadeMusicActionNode.isValid) {
				console.log("zyj_resumeFadeMusic3" + " fadeMusicActionList=" + this.fadeMusicActionList.length);
				let actionList = [];
				for (let i = 0; i < this.fadeMusicActionList.length; i++) {
					const v = this.fadeMusicActionList[i];
					const changeAction = cc.callFunc(() => {
						AudioEngine.setMusicVolume(v[1]);
						if (this.fadeMusicActionList && this.fadeMusicActionList.length > 0) {
							this.fadeMusicActionList.shift();
						}
					});
					const delayTime = cc.delayTime(v[0]);
					actionList.push(delayTime);
					actionList.push(changeAction);
				}
				this.fadeMusicActionNode.runAction(cc.sequence(...actionList));
			}
		}
	},
	reelsStopped: function(){
		this.theme.onAllReelStop();
	},
	toSpin() {
		const [canSpin, infarction] = this.canSpin();
		const isQueueEmpty = afterSpinPopupHeap.isEmpty();
		if (canSpin && isQueueEmpty && this.spin()) {
			if (this.spinCounter == null) {
				this.spinCounter = 0;
			}
			this.spinCounter++;
			// use this counter to control the frequency of releasing spine resources
			if (this.spinCounter % 5 === 0) {
				this.theme.unloadImgRes(this.theme.spineImgResList);
			}
	
			this.footer.checkAutoSpin();
	
			this.curScene.runAction(cc.sequence(
				cc.delayTime(0.5),
				cc.callFunc(() => {
					this.footer.resetTotalWin();
				})
			));
			return true;
		} else if (this.isNgOver() && ((!canSpin && (infarction !== 'theme' || infarction !== 'isSpinning')) || !isQueueEmpty)) {
			this.ngPerformOverPopups();
			TimerCallFunc.addScheduleUntilFunc(() => {
				if (POPUP_STACK.getStackSize(popStackKey) === 0) {
					if (!afterSpinPopupHeap.isEmpty()) {
						const func = afterSpinPopupHeap.pop();
						func();
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			}, 1 / 20, null, 'ngPerformOver_pop');
		} else {
			const data = {};
			data.infarction = (!isQueueEmpty) ? 'popupsQueue' : infarction;
			data.is_auto = this.getAutoStatus();
			data.theme_id = this.getThemeId();
			EventCenter.emit(EVT.THEME.SPIN_STROKE, data);
			return false;
		}
	},
	spin() {
		// ThemeActivityControl.showTournamentUnlockTip('hide');
		this.touchSpinTime = cc.sys.now();
	
		if (this.isSpinning() && !this.isFakeSpinning()) {
			return false;
		}
	
		if (this.newUserMissionBoard && !cc.sys.isNative && !this.newUserMissionBoard.isValid) {
			if (this.newUserMissionBoard.tip && this.newUserMissionBoard.tip.active) {
				this.newUserMissionBoard.tip.stopAllActions();
				this.newUserMissionBoard.tip.runAction(cc.sequence(
					cc.fadeOut(0.5),
					cc.hide()
				));
			}
		}
	
		this.ngPerformOver();
		this.requestSpin();
	
		console.log("jinle" + "onSpinStart");
	
		this.footer.onSpinStart(this.autoEnable, this.footer.getTurboStatus());
		ThemeFeedbackControl.onSpinStart();
		POPUP_STACK.clearStack(popStackKey);
		TimerCallFunc.clearGroup('ngPerformOver_pop');
	
		if (this.theme.themeBaseType !== THEME_BASE_TYPE.NEW) {
			if (this.theme.gameLayer.fakeSpin && this.getCurTotalBet() <= User.getInstance().getCoins()) {
				this.theme.fakeSpinUpdateJw();
				this.theme.gameLayer.fakeSpin();
			}
		} else {
			if (this.getCurTotalBet() <= User.getInstance().getCoins()) {
				this.theme.onSpinStart();
				if ((this.theme.themeId === 110037 || this.theme.themeId === 110033) && BLLogList.getInstance().getUserData("new_spin_received") === true) {
					BLLogList.getInstance().pushDebugTraceback(10);
				}
			}
		}
	
		return true;
	},
	out_of_coins() {
		this.enableAuto(false);
		this.footer.enableSpinAndOtherBtns(!this.get_bonus_reward_110038_temp, true, ((this.theme || {}).gameLayer || {}).cancelEnableOtherBtns);
	
		let c = cc.sys.localStorage.getItem("out_of_coins_count") || 0;
		cc.sys.localStorage.setItem("out_of_coins_count", parseInt(c) + 1);
		this.outOfCoinsShowing = true;
	},
	enableAuto(enable, mute, auto) {
		let succeed;
	
		this.autoEnable = enable;
		if (enable) {
			succeed = this.toSpin();
		} else {
			succeed = true;
		}
	
		if (succeed) {
			this.autoSpin = enable;
			this.footer.enableAuto(this.autoEnable);
	
			if (this.theme.themeBaseType !== THEME_BASE_TYPE.NEW) {
				this.themeName.gameLayer.spinLayer.autoAvailable = false;
			}
	
			if (!mute && enable) {
				cc.audioEngine.playEffect('sounds/dafu_slots_autospin.mp3', false);
			}
		}
	},
	getThemeId:function(){
		return this.theme.themeid
	},
	getCurTheme:function(){
		return this.theme
	},
	updateSpinState(data) {
		if (this.spClick && !cc.sys.isObjectValid(this.spClick)) {
			if (User.getInstance().getLevel() >= 2) { // 达到2级移除
				this.spClick.removeFromParent();
				this.spClick = null;
			} else {
				if (data) {
					if (data.spinAble && this.autoSpinCheck) {
						this.spClick.setVisible(true);
					} else {
						this.spClick.setVisible(false);
					}
				}
			}
		}
	},
	betChanged() {
		this.updateBetRange(true);
		this.checkSendThemeChangeBetCmd();
		this.adjustThemeJP();
		this.adjustThemeInitTable();
		console.log("==================", this.theme.gameLayer);
	
		this.theme.dealAboutBetChange();
		EventCenter.pushEvent(EVT.SYSTEM.BET_CHANGE);
	},
	
	updateBetRange(setBtnState) {
		var isMaxBet = this.checkIsMaxBet();
		var isMinBet = this.checkIsMinBet();
	
		// footer related
		if (isMaxBet) {
			if (!this.wasMaxBet) {
				this.wasMaxBet = true;
				this.footer.addMaxBetFlash();
			}
		} else {
			this.wasMaxBet = false;
			if (this.footer && this.footer.tipTotalBetSprite) {
				this.footer.tipTotalBetSprite.setTexture(bole.translateImage('footer/label_bet_total'));
			}
		}
		this.footer.setMaxBetState(isMaxBet);
	
		if (setBtnState) {
			this.footer.setMaxBetBtnEnable(!isMaxBet);
			this.footer.setMinBetBtnEnable(!isMinBet);
		} else {
			this.footer.maxBetTag = !isMaxBet;
			this.footer.minBetTag = !isMinBet;
		}
	
		var totalBet = this.getCurTotalBet();
		this.footer.setBetInfo(totalBet);
	},
	checkIsMaxBet(){
		if(!this.isBetControlReady()) return false;
		else return this.betControl.checkIsMaxBet();
	},
	checkIsMinBet(){
		if(!this.isBetControlReady()) return false;
		else return this.betControl.checkIsMinBet();
	},
	setFooter(footer){
		this.footer = footer;
	},

	checkSendThemeChangeBetCmd() {
		if (THEME_CONFIG_LIST[this.getThemeId()].ROOM_LOGIC) {
			this.sendThemeChangeBetCmd();
		}
	},
	adjustThemeJP() {
		if (this.theme && this.theme.themeId && themeJPList[this.theme.themeId] && this.jpInitData) {
			this.theme.jpInitData = this.jpInitData; // 进主题时初始化，升级时重置（如有需要）
			var betIdx;
			if (this.jpInitData && this.jpInitData.length > 0) {
	
				if (this.jpInitData.length >= 2) {
					betIdx = this.getMathType();
					betIdx = Math.min(betIdx, this.jpInitData.length);
				} else {
					betIdx = 1;
				}
	
				if (((this.theme || {}).gameLayer || {}).jackpotLayer) {
					this.theme.gameLayer.jackpotLayer.reset(this.jpInitData[betIdx]);
				} else if ((((this.theme || {}).gameLayer || {}).spinLayer || {}).jackpotLayer) {
					this.theme.gameLayer.spinLayer.jackpotLayer.reset(this.jpInitData[betIdx]);
				} else if (((((this.theme || {}).gameLayer || {}).spinLayer || {}).spinTable || {}).jackpotLayer) {
					this.theme.gameLayer.spinLayer.spinTable.jackpotLayer.reset(this.jpInitData[betIdx]);
				} else if (this.theme && this.theme.gameLayer && this.theme.gameLayer.spinLayer && this.theme.gameLayer.spinLayer.spinTable && this.theme.gameLayer.spinLayer.spinTable[0] &&
						   this.theme.gameLayer.spinLayer.spinTable[0].jackpotLayer) {
					this.theme.gameLayer.spinLayer.spinTable[0].jackpotLayer.reset(this.jpInitData[betIdx]);
				}
			}
		}
	},
	adjustThemeInitTable() {
		if (this.theme && themeInitTable[this.theme.themeId]) {
			if (!this.theme.saveBetChangeTable) {
				this.theme.saveBetChangeTable = {};
			}
			if (!this.theme.saveBetTable) {
				this.theme.saveBetTable = {};
			}
	
			if (this.theme.saveBetChangeTable[String(this.getCurBet())] && !this.reconnectFlag) {
				this.theme.dealKeepAlive(this.theme.saveBetChangeTable[String(this.getCurBet())], true);
			} else {
				var bet = this.getCurBet() || -1;
				this.theme.saveBetTable.unshift(bet);
				this.sendThemeChangeBetCmd();
			}
		}
	},
	
	requestFreeGameSpin: function () {
		this.touchSpinTime = Date.now();
		var curBet = this.getCurBet();
		let is_quest;
		if (IN_QUEST_NEW_USER_THEME_FLAG) {
			is_quest = 2;
		} else if (IN_QUEST_STAY_THEME_FLAG) {
			is_quest = 4;
		}
		curBet = this.getCurBet();
	
		const fastStatus = this.footer && this.footer.getTurboStatus();
		const autoStatus = this.getAutoStatus();
	
		const data = {
			bet: curBet,
			bet_string: bole.int2String(curBet),
			lines: 50,
			sf_choice: 1,
			fg_step: 1,
			game_type: 1,
			spin_index: this.getSpinIndex(),
			is_quest: is_quest,
			is_fast: fastStatus ? 1 : 0,
			is_auto: autoStatus ? 1 : 0
		};
		// if ((this.theme.themeId === 110037 || this.theme.themeId === 110033) && BLLogList.getInstance().getUserData("new_spin_received") === true) {
		// 	BLLogList.getInstance().pushDebugTraceback(10);
		// }
		//bole.potp.send([BATCH_SPIN, data]);
		this.spinRequestTime = Date.now();
	},
	
	getSpinIndex:function(){
		this.spin_index = this.spin_index % 1000;
		return this.spin_index;
	},
	setFooterStopBtn:function(){
		this.footer.setStopBtn();
	},
	disableStop:function(){
		this.footer.disableStop();
	},
	














	








	/////////////////////////////////////////////////////////////////
	showLoadingView() {
		let loading = this.theme.getThemeLoadingView();
		loading.setPercentage(10);
		this.curScene.addToLoading(loading, 100);
		this.loadingView = loading;
	},
	
	onEnter(data) {
		//??
		// if (THEME_CONTROL_STATUS_LIST.THEME == this.curStatus) {
		// 	this.betControl.checkBetValidity();
		// 	return;
		// }
	
		this._enterThemeData = data;
		this.initControlConfig();
		this.needToFgChoice = false;
		this.checkEnterTheme();
	},
	
	initControlConfig() {
		this.cacheSpinRet = null; // spin结果缓存，非nil时间范围为 收到返回-NG结束 之间
		this.spinRequestTime = null; // spin请求时刻，非nil时间范围为 发出请求-收到返回 之间
		this.touchSpinTime = 0; // spin按下时刻，基本与ng spin时间相同
		this.spinCounter = 0; // 进入主题后spin的次数
		this.allrevenue = 0; // 进入主题后所赢的coins数
		this.allcost = 0; // 进入主题后所花费的coins数
		this.autoSpin = false; // auto状态，默认不开启，用途：autospin状态
		this.autoSpinCheck = true;
		this.freespin = 0; // freespin剩余次数，默认值为0
		this.freeItem = null; // 进入freespin时的item_list，用途：freespin结束后的现场还原
		this.spinCD = 0.3; // 从spin开始计时，自动stop最短时间间隔
		this.spinMinCD = 0.15; // 从spin开始计时，stop按钮可点击最短时间间隔
	},
	
	checkEnterTheme() {
		if (this._enterThemeData) {
			this.needToFgChoice = (1 == this._enterThemeData.fg_choice); // after reconnect
			this.onEnterTheme(this._enterThemeData);
		}
	},
	onEnterTheme: function (data) {
		// AdvertiseControl.getInstance().setCanSpin(true);
		this.curStatus = THEME_CONTROL_STATUS_LIST.THEME;
		
		if (data["coins"]) {
			User.coins = data.coins;
		}
		this.initBetControl();
		RELOAD_BACKEND_THEME_CONFIG_DATA(data);
		this.theme.onEnter();
		this.theme.adjustTheme(data);
		this.footer.enableAuto(false);
		this.footer.setLabelDescription('Intro');
	},
	loadTheme:function(){

	}
	
	



})