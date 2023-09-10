
THEME_FIVE_BET_LIST_1 = {
    110038: true,
    110045: true,
    110042: true,
    111059: true,
    111063: true,
    110060: true,
}
CLUB_FLAG = true;
IN_QUEST_STAY_THEME_FLAG = true
IN_QUEST_NEW_USER_THEME_FLAG = false

LEVEL_BET_DATA = {
    club_bet: 1e7,
    club_in : 1e6,
    common_in : 1e5,
    club : [1e6, 1e7, 1e8],
    common:[1e6, 1e7, 1e8],
    club_open_map:1e6,
    open_map:1e6,
};

BetControl = cc.Class({
    extends: cc.Component,

    ctor() {
        var theThemeControl = arguments[0];
        this.themeControl = theThemeControl;
        this.themeControl.betControl = this;
        this.themeid = this.themeControl.getThemeId();
        this.bet = BetControl.getMinLargeBet();
        
        this.checkBetValidity();
        this.betChanged();
    },

    changeToUpBet() {
        if (this.themeControl.getThemeId() == 110038) {
            EventCenter.pushEvent(EVT.EVT_CHANGE_BET_110038);
        } else {
            let bet = BetControl.getNextBet(this.bet);
            if (bet) {
                this.bet = bet;
                this.betChanged(true);
                if (bet === this.getMaxBet() && (User.getInstance().abType !== "A" || !User.getInstance().isNewUser)) {
                    this.themeControl.footer.createMaxBetTip();
                }
            }
        }
    },

    changeToDownBet() {
        if (this.themeControl.getThemeId() == 110038) {
            EventCenter.pushEvent(EVT.EVT_CHANGE_BET_110038);
        } else {
            let bet = BetControl.getPrevBet(this.bet);
            if (bet) {
                this.bet = bet;
                this.betChanged(true);
                if (bet === this.getMaxBet() && (User.getInstance().abType !== "A" || !User.getInstance().isNewUser)) {
                    this.themeControl.footer.createMaxBetTip();
                }
            }
        }
    },
    
    changeToBet(bet) {
        let idx = BetControl._getIdxByBet(bet);
        if (idx) {
            this.bet = bet;
            this.betChanged(true);
            if (BetControl.getMinLargeBet() === bet) {
                bole.potp.send('behavior', {page: "change_to_unlock_bet"});
            }
            return true;
        } else {
            return false;
        }
    },
    
    changeToTotalBet(totalBet) {
        let bet = totalBet / this.getCurBetBase();
        return this.changeToBet(bet);
    },
    
    setMaxBet() {
        if (this.themeControl.getThemeId() == 110038) {
            EventCenter.pushEvent(EVT.EVT_CHANGE_BET_110038);
        } else {
            this.checkIsMaxBet(true);
        }
    },
    
    setMinBet() {
        this.checkIsMinBet(true);
    },
    checkIsMaxBet(change) {
        if (change) {
            this.bet = BetControl.getMaxBet();
            this.betChanged(true);
        }
        return this.bet === BetControl.getMaxBet();
    },
    
    checkIsMinBet(change) {
        if (change) {
            this.bet = BetControl.getMinBet();
            this.betChanged(true);
        }
        return this.bet === BetControl.getMinBet();
    },
    
    betChanged(sound) {
        //会先检测是否真正变了
        if (this._lastBet && this._lastBet === this.bet && this._lastBetBase === this.getCurBetBase()) return;
        this._lastBet = this.bet;
        this._lastBetBase = this.getCurBetBase();
    
        if (sound) {
            this.setCurBetSound();
        }
    
        this.themeControl.betChanged();
    },
    
    setCurBetSound() {
        if (this.checkIsMaxBet()) {
            AudioEngine.playEffect('sounds/bet/global_max_bet.mp3', false);
        }
        let idx = Math.min(42, BetControl._getIdxByBet(this.bet));
        AudioEngine.playEffect('sounds/bet/bet' + idx + '.mp3', false);
    },
    getCurBet() {
        return this.bet;
    },
    
    getCurBetBase() {
        return BetControl.getBetBase(this.themeControl.getThemeId(), this.getCurBet());
    },
    
    getCurFakeBetBase() {
        return BetControl.getFakeBetBase(this.themeControl.getThemeId(), this.getCurBet());
    },
    
    getCurTotalBet() {
        return this.getCurBetBase() * this.getCurBet();
    },
    
    
    
    
    
    
    
    getTotalBet: function(themeid, bet) {
        return this.getBetBase(themeid, bet) * bet;
    },
    
    canLargeBet: function() {
        return this.getMaxBet() >= this.getMinLargeBet();
    },
    
    getMinClubPointTotalBet: function() {
        return LEVEL_BET_DATA.club_bet;
    },
    
    getClubEntryBets: function() {
        if (CLUB_FLAG) {
            return LEVEL_BET_DATA.club_in;
        } else {
            return LEVEL_BET_DATA.common_in;
        }
    },
    
    getNormalEntryBets: function() {
        return LEVEL_BET_DATA.common_in;
    },
    
    getUnlockUserLevel: function(themeid) {
        if (CLUB_FLAG) {
            return THEME_CONFIG_LIST[themeid].UNLOCK_LEVEL_CLUB || 1;
        } else {
            return THEME_CONFIG_LIST[themeid].UNLOCK_LEVEL_NORMAL || 1;
        }
    },
    getUnlockTheme: function(level) {
        if (THEME_UNLOCK_DATA && Array.isArray(THEME_UNLOCK_DATA)) {
            return THEME_UNLOCK_DATA[level];
        }
    },
    
    checkBetValidity: function() { // 先找大再找小
        var expBet = this._lastBetBase ? ((this.bet * this._lastBetBase) / this.getCurBetBase()) : this.bet;
        if (BetControl.canBet(expBet)) {
            return;
        }
    
        var list = BetControl.getBetList();
        var left, right;
    
        for (var i = 0; i < list.length; i++) {
            if (list[i] < expBet) {
                left = list[i];
            } else if (list[i] >= expBet) {
                right = list[i];
            }
    
            if (right !== undefined) {
                this.bet = right;
                this.betChanged();
                return;
            }
        }
    
        if (left !== undefined) {
            this.bet = left;
            this.betChanged();
            return;
        }
    
        throw new Error('No available bet ???');
    }
});

BetControl.canBet = function(bet) {
    return BetControl._getIdxByBet(bet) !== null;
};

BetControl.getBetList = function() {
    if (CLUB_FLAG) {
        return LEVEL_BET_DATA.club;
    } else {
        return LEVEL_BET_DATA.common;
    }
};
BetControl.getMinLargeBet = function() {
    if (CLUB_FLAG) {
        return LEVEL_BET_DATA.club_open_map;
    } else {
        return LEVEL_BET_DATA.open_map;
    }
};
BetControl.getEntryBets = function() { // 4
    if (CLUB_FLAG) {
        return LEVEL_BET_DATA.club_in;
    } else {
        return LEVEL_BET_DATA.common_in;
    }
};

BetControl.getNextBet = function(bet) {
    var betList = this.getBetList();
    var idx = this._getIdxByBet(bet);
    if (idx !== null && idx < betList.length - 1) {
        return betList[idx + 1];
    } else if (idx !== null && idx == betList.length - 1) {
        return betList[0];
    } else {
        return null;
    }
},
BetControl.getPrevBet = function(bet) {
    var betList = this.getBetList();
    var idx = this._getIdxByBet(bet);
    if (idx !== null && idx > 0) {
        return betList[idx-1];
    } else if (idx !== null && idx == 0) {
        return betList[betList.length - 1];
    } else {
        return null;
    }
};

BetControl._getIdxByBet = function(bet) {
    var list = this.getBetList();
    //tools:log("bet:",json.encode(list))
    for (var i = 0; i < list.length; i++) {
        if (bet === list[i]) {
            return i;
        }
    }
    return null;
};

BetControl.getMaxBet = function() {
    const betList = BetControl.getBetList();
    return betList[betList.length - 1];
};

BetControl.getMinBet = function() {
    const betList = BetControl.getBetList();
    return betList[0];
};
BetControl.getFakeBetBase = function(themeid, bet) {
    var data = FAKE_THEME_BASE_BET_DATA[themeid];
    if (bet < this.getMinLargeBet()) {
        return data[0];
    } else {
        return data[1];
    }
};

BetControl.getBetBase = function(themeid, bet) {
    return 1e4;
};