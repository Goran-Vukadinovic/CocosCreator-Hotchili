
IS_THEME_VERTICAL = [];
IS_THEME_VERTICAL[GLOBAL_THEME_ID] = true;

THEME_CONFIG_LIST = [];
THEME_CONFIG_LIST[GLOBAL_THEME_ID] = {
	THEME_NAME : 'ThemeHotChili',
	JP_INDEXES_ALL : [ 1 ],
	JP_INDEXES_OWN : [ 1 ],
	RULE_MEDAL_DATA : {
		filename : 'Info_04'
	},
	NEW_LOADING_CONFIG : {
		0:{
			num : 3,
			size : 30,
			gap : 8,
			color : cc.c4b(255, 255, 255, 255)
		},
		1:{
			num : 2,
			size : 30,
			gap : 8,
			color : cc.c4b(255, 255, 255, 0xff)
		},
		pos : cc.p(0, 60),
		specificMusic : true,
		multiLan : true,
		multiLanPos : [ cc.p(-172.5, -255), cc.p(7.5, 436.5), cc.p(187.5, -255) ]
	},
	OFFSET_Y : -20,
	SCALE : 0.53,
};

PlayGame = cc.Class({
	name:"PlayGame",
	ctor() {
		var scene = arguments[0];
		this.scene = scene;
		this.themeid = GLOBAL_THEME_ID;
		//this.initKeyboardListener();
	},

	initKeyboardListener() {
		const listener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyReleased(keyCode, event) {
				if (keyCode === cc.macro.KEY.space) {
					EventCenter.pushEvent(EVT.THEME.MIMIC_SPIN);
				}
			},
		});
		const eventDispatcher = bole.scene.getEventDispatcher();
		eventDispatcher.addEventListenerWithSceneGraphPriority(listener, this);

		this.keyBoardListener = listener;
	},

	onEnter() {
		this.initLayout();
		var data = {
			coin:100000000,
			max_lines:1,
			feature_bet_mul:1,
			jp_base:'',
			level_bet:"",
			theme_base_bet:'',
			slots_config:'',
			enter_theme_info:{
				game_info_dict:{},
				reconnection_data:{
					fg_total_round:10,
					free_spins:null,
					fg_bet:10,
					all_total_win:1,
					fg_type:3,//1~3
					fg_idx:1,

				},
				bow_state:5,
			},
			fg_info:{
				fg_total_round:1,
				tg_total_round:1,
				fg_info_list:[],
				tg_info_list:[]

			},
			trophy:0,
			trophy_v2:0,

		}
		this.enterTheme(data);
	},
	onExit() {
		if (this.ctl) {
			this.ctl.destruct();
			this.ctl = null;
		}
		TimerCallFunc.clearGroup(this);
	},
	
	onPause() {
		// body
	},
	
	onResume() {
		
	},
	initLayout() {
		let themeConfig = THEME_CONFIG_LIST[this.themeid];
		let theTheme = new ThemeHotChili();
		let theCtl = new ThemeControlNew(theTheme, this.scene);
		theTheme.setControl(theCtl);
		theTheme.setCurScene(this.scene);
		var container = this.scene.getChildByName("node_container");
		container.addChild(theTheme);
		//theTheme.parent = this.scene;
		tools.setWidgetBottom(theTheme, themeConfig.OFFSET_Y);
		tools.setThemeScale(theTheme, themeConfig.SCALE);
		// ------------------------------------------------------------------------
		// let header = new ThemeHeader(false);
		// if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL && bole.isIphoneX()) {
		// 	header.setPositionY(header.getPositionY() - 56);
		// }
		// header.themeCtl = theCtl;
		// theCtl.setHeader(header);
		// this.header = header;
		// ------------------------------------------------------------------------
		let footer = new ThemeFooter(theCtl);
		if (bole.getScreenOrientation() == SCREEN_ORIENTATION.VERTICAL && bole.isIphoneX()) {
			footer.setPositionY(footer.getPositionY() + 27);
		}
		theCtl.setFooter(footer);
		this.footer = footer;
		//footer.showPlayHideOther();
		// ------------------------------------------------------------------------
		
		this.ctl = theCtl;
		this.theme = theTheme;
	},
	enterTheme: function(data) {
		this.ctl.onEnter(data);
	},
	showLoadingView(){
		this.ctl.showLoadingView();
	}
});
