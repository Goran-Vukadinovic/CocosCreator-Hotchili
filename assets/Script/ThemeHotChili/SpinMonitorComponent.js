/*const SpinMonitorComponent = cc.Class({
    extends: CommonComponent,

    ctor() {
        this.infarction = [];
        this._registerForEvent('_eventOnSpinStroke', this._onSpinStroke, this);
        this._registerForEvent('_eventOnReceiveBatchSpin', this._onReceiveBatchSpin, this);
        this._registerForEvent('_eventOnDestruct', this._onDestruct, this);
        this._registerForEvent('_eventOnEnterBackground', this._onEnterBackground, this);
    },

    _onSpinStroke(evt, event) {
        const oriData = event.data;
        this.infarction.push({ infarction: oriData.infarction, is_auto: oriData.is_auto, theme_id: oriData.theme_id });
        //cc.director.getScheduler().schedule(this._checkInfarction, this, 10, cc.macro.REPEAT_FOREVER, 0, false, 'spinStrokeMonitor');
    },

    _checkInfarction(type) {
        if (this.infarction && this.infarction.length >= 2) {
            const data = {};
            data.event = SplunkHEC.EVENT.SPIN_INFARCTION_MONITOR;
            data.uid = User.getInstance().user_id;
            data.is_new_user = User.getInstance().isNewUser;
            data.version = tostring(Math.round(parseFloat(NEWEST_GAME_VERSION)*1000));
            data.info = this.infarction;
            data.type = type || 'timer';
            SplunkHEC.getInstance().sendData(SplunkHEC.EVENT.SPIN_INFARCTION_MONITOR, data);
            bole.sendFrontendLog('spin_monitor', data);
        }
        this.infarction = [];
    },

    _onReceiveBatchSpin(evt, event) {
        //cc.director.getScheduler().unscheduleAllForTarget(this);
        this.infarction = [];
        //this._checkInfarction();
    },

    _onDestruct(evt, event) {
        //cc.director.getScheduler().unscheduleAllForTarget(this);
        this._checkInfarction('destruct');
    },

    _onEnterBackground(evt, event) {
        //cc.director.getScheduler().unscheduleAllForTarget(this);
        this._checkInfarction('enterBack');
    },
});
*/