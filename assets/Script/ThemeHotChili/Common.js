THEME_JP_NUM_UPDATE_INTERVAL = {
}

bole = {};
bole.chromeSize = cc.size(1280, 720);

bole.isAndroid = function () {
    return cc.sys.platform === cc.sys.ANDROID;
};
bole.isIOS = function () {
    const platform = cc.sys.platform;
    return platform === cc.sys.IPHONE || platform === cc.sys.IPAD;
};
bole.isWP8 = function () {
    return cc.sys.platform === cc.sys.WINRT;
};
bole.isWinRT = function () {
    return cc.sys.platform === cc.sys.WINRT;
};
bole.isAmazon = function () {
    return Config.platform === "amazon";
};
bole.isIphoneX = function () {
    //return bole.isIOS();
    return false;
};
bole.isChrome = function () {
    //全屏按照androidpc显示竖屏
    if (bole.isWinRT()) {
        var director = cc.director;
        var viewport = director.getViewport();
        return viewport.width === viewport.windowWidth && viewport.height === viewport.windowHeight;
    }
    //return Config.package === "com.grandegames.slots.dafu.casino.androidpc";
    return  bole.isAndroid();
};

SCREEN_ORIENTATION = {
    HORIZONTAL : cc.macro.ORIENTATION_LANDSCAPE,
    VERTICAL : cc.macro.ORIENTATION_PORTRAIT,
}
G_SO = SCREEN_ORIENTATION.HORIZONTAL;
bole.setScreenOrientation = function(o) {
    if (bole.isWinRT()) {
        console.log("=======isWinRT");
        bole.setWinScreenOrientation(o);
    } 
    else if (bole.isIOS() && bole.getSysVersion() && bole.getSysVersion() !== '' 
        && Number.parseInt(bole.getSysVersion().substr(0, bole.getSysVersion().indexOf('.'))) >= 16) {
            console.log("=========isIOS_1");
        
            bole.oldSetScreenOrientation(o);
    } else if (bole.isIOS() && bole.isSupportedVersion(10000, 6.8, null, true)) {
        console.log("======isIOS_2");        
        bole.newSetScreenOrientation(o);
    } else {
        console.log("==========other");
        bole.oldSetScreenOrientation(o);
    }
};
bole.setWinScreenOrientation = function(o) {
    if (o === G_SO) {
        return;
    }
    if (bole.isChrome()) {
        console.log("==========isChrome");
        return;
    }
    const win32Size = cc.view.getFrameSize(); // 屏幕分辨率
    let frameSize = cc.view.getFrameSize();
    let arg = null;
    if (o === SCREEN_ORIENTATION.HORIZONTAL) {
        if (G_FRAMESIZE) {
            frameSize = G_FRAMESIZE;
        }
        arg = 1;
        G_SO = o;
        cc.view.setFrameSize(frameSize.width, frameSize.height);
        cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.FIXED_HEIGHT);
        cc.view.setWin32VisibleMax(false);
        cc.view.setWinLimitRatio(true);
    } else if (o === SCREEN_ORIENTATION.VERTICAL) {
        G_FRAMESIZE = frameSize;
        arg = 2;
        G_SO = o;
        const size = {};
        if (frameSize.width < win32Size.height - bottom_h) {
            size.height = frameSize.width;
            size.width = frameSize.height;
        } else {
            size.height = frameSize.height;
            size.width = (frameSize.height * frameSize.height) / frameSize.width;
        }

        //判断下边框是否到屏幕外边
        const win32Pos = cc.view.getFramePos();
        if (win32Pos.y + size.height > win32Size.height - bottom_h) {
            cc.view.setFramePos(win32Pos.x, win32Size.height - size.height - bottom_h); // 60下标栏的宽度
        }

        cc.view.setFrameSize(size.width, size.height);
        cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_WIDTH);
        cc.view.setWin32VisibleMax(true);
        cc.view.setWinLimitRatio(false);
    }
};

bole.newSetScreenOrientation = function(o) {
    if (o === G_SO) {
        return;
    }
    if (bole.isChrome()) {
        return;
    }
    let frameSize = cc.view.getFrameSize();
    let arg = null;
    if (o === SCREEN_ORIENTATION.HORIZONTAL) {
        arg = 1;
        G_SO = o;
        cc.view.setFrameSize(frameSize.height, frameSize.width);
        cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.FIXED_HEIGHT);
    } else if (o === SCREEN_ORIENTATION.VERTICAL) {
        arg = 2;
        G_SO = o;
        cc.view.setFrameSize(frameSize.height, frameSize.width);
        cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_WIDTH);
    }
};

bole.oldSetScreenOrientation = function(o) {
    if (o === G_SO) {
        return;
    }
    if (bole.isChrome()) {
        return;
    }
    if (o === SCREEN_ORIENTATION.HORIZONTAL) {
        bole._setScreenOrientation(1);
        G_SO = o;
    } else if (o === SCREEN_ORIENTATION.VERTICAL) {
        bole._setScreenOrientation(2);
        G_SO = o;
    }
};
bole.getScreenOrientation = function() {
    return G_SO;
    var orientation = cc.view.getOrientation();
    if (orientation === cc.macro.ORIENTATION_LANDSCAPE) {
        return SCREEN_ORIENTATION.HORIZONTAL
    } else if (orientation === cc.macro.ORIENTATION_PORTRAIT) {
        return SCREEN_ORIENTATION.VERTICAL;
    }
};

bole._setScreenOrientation = function(o) {
    return bole.setWinScreenOrientation(o);
};
bole.LangList = ["CN","TW","EN","TH","ES","DE","FR","IT","JA","PL","NL"];
bole.LocalLang = bole.LangList[2];
bole.DefaultLangList = {
    CN : 'EN',
    TW : 'CN',
    EN : 'EN',
    TH : 'EN',
    ES : 'EN',
    DE : 'EN',
    FR : 'EN',
    IT : 'EN',
    JA : 'EN',
    PL : 'EN',
    NL : 'EN',
}

bole.translateImage = function(key, themeId, activity) {
    var getImagePath = function(key, themeId, lang, activityIndex) {
        if (activity == null) {
            if (themeId == null) {
                return 'lang_' + lang + '/' + key + '_' + lang + '.png';
            }
            else {
                return 'theme' + themeId + '/lang_' + lang + '/' + key + '_' + lang + '.png';
            }
        }
        else {
            return 'inner_download/multi_language/lang_' + lang + '/' + key + '_' + lang + '.png';
        }
    }

    var lang = bole.LocalLang;
    var path = getImagePath(key, themeId, lang, activity);
    //??
    // while (!cc.resources.get(path)) {
    //     if (lang == 'EN') {
    //         return '';
    //     }
    //     lang = bole.DefaultLangList[lang];
    //     path = getImagePath(key, themeId, lang, activity);
    // }
    return path;
};
bole.setLabelWidth = function(label, width) {
    label.setFixWidth(width);
}
/*
bole.setLabelWidth = function(label, width) {
    label.width = width;
    label.scaleX = 1;

    label.trueScaleX = label.trueScaleX || label.scaleX;
    label.trueScaleY = label.trueScaleY || label.scaleY;
    label.originScale = label.originScale || 1;

    let adjustLabelScale = function(_label) {
        let contentSize = _label.getContentSize();
        let contentWidth = contentSize.width;
        if (contentWidth <= 0) {
            return;
        }

        _label.scaleX = Math.min(1, width / contentWidth / label.originScale);
        _label.scaleY = _label.scaleX;
        //_label.setScale(_label.trueScaleX * _label.scaleX, _label.trueScaleY * _label.scaleY);
    };

    adjustLabelScale(label);

    label.setString = function(string) {
        if (this.__type) {
            this.__type.setString(this, string);
        } else if (this.label) {
            this.label.string = string;
        } else {
            cc.Label.prototype.setString.call(this, string);
        }
        // label.label.scheduleOnce(() => {
        //     adjustLabelScale(this);
        // })
    };

    label.setScale = function(scaleX, scaleY) {
        this.trueScaleX = scaleX;
        this.trueScaleY = scaleY || scaleX;
        this.scaleX = this.trueScaleX * this.scaleX;
        this.scaleY = this.trueScaleY * this.scaleY;
        //this.setScale(this.trueScaleX * this.scaleX, this.trueScaleY * this.scaleY);
    };

    label.setScaleX = function(scaleX) {
        this.trueScaleX = scaleX;
        this.scaleX =  this.trueScaleX * this.scaleX;
        //this.setScaleX(this.trueScaleX * this.scaleX);
    };

    label.setScaleY = function(scaleY) {
        this.trueScaleY = scaleY;
        this.scaleY = this.trueScaleY * this.scaleY;
        //this.setScaleY(this.trueScaleY * this.scaleY);
    };
};
*/
bole.translateNode = function(key, father) {
    if (!father || !cc.Node.isNode(father)) {
    //if (!father || father.isDisposed() || !cc.Node.isNode(father)) {
    return null;
  }
  
  var lang = bole.LocalLang;
  var path = `${key}_${lang}`;
  while (!father.getChildByName(path)) {
    if (lang === 'EN') {
      return null;
    }
    
    lang = bole.DefaultLangList[lang];
    path = `${key}_${lang}`;
  }
  
  return father.getChildByName(path);
}

bole.setWidgetBottom = function(node, offsetY) {
    if (!node || !offsetY || !bole.isChrome()) {
        return;
    }
    node.setPositionY(offsetY);
}

bole.updateTable = function(origin, update) {
    if (!origin) {
        return update;
    }

    if (typeof update === 'object' && typeof origin === 'object') {
        for (const [k, v] of Object.entries(update)) {
            origin[k] = bole.updateTable(origin[k], v);
        }
    } else if (typeof update === 'object' && typeof origin === 'undefined') {
        origin = {};
        origin = bole.updateTable(origin, update);
    } else {
        origin = update;
    }

    return origin;
}

bole.isLowQualityDevice = function() {
        return false;
}

bole.comma_value_abbrev = function(num, abbrevParam = 7, numOfDecimalDigits = 0) {
    if (!num) {
        return '';
    }

    let form = `%.${numOfDecimalDigits}f`;

    let e = 0;
    let suffix = '';

    if (typeof abbrevParam === 'string') {
        if (abbrevParam === 'T') {
            e = 12;
        } else if (abbrevParam === 'B') {
            e = 9;
        } else if (abbrevParam === 'M') {
            e = 6;
        } else if (abbrevParam === 'K') {
            e = 3;
        } else {
            throw new Error(`Unresolved param [abbrevParam]=${abbrevParam}`);
        }
        suffix = abbrevParam;
    } else if (typeof abbrevParam === 'number') {
        if (abbrevParam <= 0) {
            throw new Error(`Param [abbrevParam]=${abbrevParam} should be a positive integer.`);
        }

        let e_num = Math.floor(Math.log10(num));
        let e_keep = abbrevParam - 1;
        e = e_num - e_keep;

        if (e >= 12) {
            e = 12;
            suffix = 'T';
        } else if (e >= 9) {
            e = 9;
            suffix = 'B';
        } else if (e >= 6) {
            e = 6;
            suffix = 'M';
        } else if (e >= 3) {
            e = 3;
            suffix = 'K';
        } else {
            e = 0;
            suffix = '';
        }
    }

    let dvd = Math.pow(10, e);
    let numStr = (num / dvd).toFixed(numOfDecimalDigits);
    return bole.comma_value(numStr, numOfDecimalDigits) + suffix;
}

bole.num_2_str_least_byte = function(num, pointFlag) {
    let byte = Math.floor(Math.log10(num));
    let unit = "";
    if (byte >= 12) {
        unit = "T";
        num = num / Math.pow(10, 12);
        byte = byte - 12;
    } else if (byte >= 9) {
        unit = "B";
        num = num / Math.pow(10, 9);
        byte = byte - 9;
    } else if (byte >= 6) {
        unit = "M";
        num = num / Math.pow(10, 6);
        byte = byte - 6;
    } else if (byte >= 3) {
        unit = "K";
        num = num / Math.pow(10, 3);
        byte = byte - 3;
    }
    if (pointFlag) {
        let pointByte = 2 - byte;
        if (pointByte < 0) {
            pointByte = 0;
        }
        let t = Math.floor(num * Math.pow(10, pointByte));
        num = t / Math.pow(10, pointByte);
    } else {
        num = Math.floor(num);
    }
    return num.toString() + unit;
}
bole.num_2_str_byByte = function(num, byte, pointFlag) {
    byte = Math.floor(Math.log10(num)) - byte;
    let unit = "";
    while (byte >= 3) {
        if (byte >= 12) {
            unit = "T" + unit;
            num = num / Math.pow(10, 12);
            byte = byte - 12;
        } else if (byte >= 9) {
            unit = "B" + unit;
            num = num / Math.pow(10, 9);
            byte = byte - 9;
        } else if (byte >= 6) {
            unit = "M" + unit;
            num = num / Math.pow(10, 6);
            byte = byte - 6;
        } else if (byte >= 3) {
            unit = "K" + unit;
            num = num / Math.pow(10, 3);
            byte = byte - 3;
        }
    }
    if (pointFlag) {
        let pointByte = 2;
        let t = Math.floor(num * Math.pow(10, pointByte));
        num = t / Math.pow(10, pointByte);
    } else {
        num = Math.floor(num);
    }
    return num.toString() + unit;
};

bole.comma_value_new = function(num) {
    if (!num) {
        return '';
    }

    let form = '%.0f'; // '%.0f' for example
    let e = 0;
    let suffix = '';
    if (num < 1e6) {
        e = 0;
        suffix = '';
    } else {
        return bole.comma_value_abbrev(num, 5);
    }

    let dvd = Math.pow(10, e);
    let numStr = String.format(form, num / dvd);
    return bole.comma_value(numStr, 0) + suffix;
};

// 按位数转换为KMBT，仅支持数字，筹码上数字规则
bole.comma_value_strict = function(num) {
    if (!num) {
        return '';
    }

    if (num >= 1e12) {
        return Math.floor(num / 1e12).toString() + "T";
    } else if (num >= 1e9) {
        return Math.floor(num / 1e9).toString() + "B";
    } else if (num >= 1e6) {
        return Math.floor(num / 1e6).toString() + 'M';
    } else if (num >= 1e5) {
        return Math.floor(num / 1e3).toString() + 'K';
    } else {
        return num.toString();
    }
};
bole.comma_value_strict_dot = function(num, dig) {
    if (!num) {
        return '';
    }
    let len = dig || 2;
    if (num >= 1e12) {
        return bole.comma_value(num / 1e12, len).toString() + "T";
    } else if (num >= 1e9) {
        return bole.comma_value(num / 1e9, len).toString() + "B";
    } else if (num >= 1e6) {
        return bole.comma_value(num / 1e6, len).toString() + 'M';
    } else if (num >= 1e5) {
        return bole.comma_value(num / 1e3, len).toString() + 'K';
    } else {
        return num.toString();
    }
};

// 按位数转换为KMBT，智能保留两位小数
bole.comma_value_dot = function(num) {
    if (!num) {
        return '';
    }

    if (num >= 1e12) {
        return bole.comma_value_smart(num, 1e12, 2).toString() + "T";
    } else if (num >= 1e9) {
        return bole.comma_value_smart(num, 1e9, 2).toString() + "B";
    } else if (num >= 1e6) {
        return bole.comma_value_smart(num, 1e6, 2).toString() + "M";
    } else if (num >= 1e3) {
        return bole.comma_value_smart(num, 1e3, 2).toString() + "K";
    } else {
        return num.toString();
    }
};

bole.addSwallowTouchesEventListener = function (node, tapCallback, isSwallow) {
    bole._addSwallowTouchesEventListener(node, false, tapCallback, isSwallow);
};

bole.addBoundingSwallowTouchesEventListener = function (node, tapCallback, isSwallow) {
    bole._addSwallowTouchesEventListener(node, true, tapCallback, isSwallow);
};

bole._addSwallowTouchesEventListener = function (node, regional, tapCallback, isSwallow) {
    
    bole.removeSwallowTouchesEventListener(node);
    let onTouchBegan = function (touch, event) {
        if (regional) {
            return bole.containsPoint(touch, event);
        } else {
            return true;
        }
    };
    let onTouchEnded = function (touch, event) {
        if (tapCallback) {
            tapCallback(touch, event);
        }
    };
    let listener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: isSwallow !== undefined ? isSwallow : true,
        onTouchBegan: onTouchBegan,
        onTouchEnded: onTouchEnded
    });
    cc.internal.eventManager.addListener(listener, node);
    node.stEventListener = listener;
};

bole.removeSwallowTouchesEventListener = function (node) {
    if (node.stEventListener) {
        cc.internal.eventManager.removeEventListener(node.stEventListener, node);
        node.stEventListener = null;
    }
};

bole.containsPoint = function(touch, event) {
    let pos = touch.getLocation();
    let target = event.getCurrentTarget();
    let localPos = target.convertToNodeSpaceAR(pos);

    let size = target.getContentSize();
    let rect = cc.rect(0, 0, size.width, size.height);

    // console.log('ohoho pos=[' + pos.x + ', ' + pos.y +'] localPos=[' + localPos.x + ', ' + localPos.y + ']');
    return cc.rectContainsPoint(rect, localPos);
};
bole.translateAnimation = function(key, sp) {
    if (!sp) {
        return key + '_' + bole.LocalLang;
    }

    let lang = bole.LocalLang;
    let animationName = key + '_' + lang;
    let animationNameLower = key + '_' + lang.toLowerCase();
    while (!(sp.animation.findAnimation(animationName) || sp.animation.findAnimation(animationNameLower))) {
        if (lang === 'EN') {
            return '';
        }
        lang = bole.DefaultLangList[lang];
        animationName = key + '_' + lang;
        animationNameLower = key + '_' + lang.toLowerCase();
    }
    return sp.animation.findAnimation(animationName) ? animationName : animationNameLower;
};

bole.int2String = function(number) {
    if (typeof number !== "number") {
        return number;
    }

    let MAX_DIGIT = 10000000000000;
    if (cc.sys.platform === cc.sys.WINRT) {
        MAX_DIGIT = 1000000000;
    }
    if (number > MAX_DIGIT) {
        const a = String(Math.floor(number / MAX_DIGIT));
        const b = String(MAX_DIGIT + number % MAX_DIGIT);
        return a + b.substring(1);
    } else {
        return String(Math.floor(number));
    }
};































TimerCallFunc =  {};
TimerCallFunc.CallFuncType = {
        Once: 0,
        RepeatForever: 1,
        RepeatUntil: 2,
}

var TCF_maps = {};
var SchedulerState = {
    idle: -1,
    pause: -2
};

TimerCallFunc.addCallFunc = function(func, delay, param, group) {
    this._addFunc(func, delay, param, group, TimerCallFunc.CallFuncType.Once);
};

TimerCallFunc.addScheduleFunc = function(func, interval, param, group) {
    this._addFunc(func, interval, param, group, TimerCallFunc.CallFuncType.RepeatForever);
};

TimerCallFunc.addScheduleUntilFunc = function(func, interval, param, group) {
    this._addFunc(func, interval, param, group, TimerCallFunc.CallFuncType.RepeatUntil);
};

TimerCallFunc._addFunc = function(func, dt, param, group, loopType) {
    group = group || bole.scene;
    if (!group) {
        return;
    }
    if (!func) {
        return;
    }

    TCF_maps[group] = TCF_maps[group] || { state: SchedulerState.idle };    
    if (TCF_maps[group][func]) {
        return;
    }

    let append = function(type) {
        if (TCF_maps[group]) {
            if (TCF_maps[group].state === SchedulerState.pause) {
                // Do nothing
            } else {
                switch (type) {
                    case TimerCallFunc.CallFuncType.Once:
                        TimerCallFunc.unscheduleFunc(func, group, param);
                        func(param);
                        break;
                    case TimerCallFunc.CallFuncType.RepeatForever:
                        func(param);
                        break;
                    case TimerCallFunc.CallFuncType.RepeatUntil:
                        if (func(param)) {
                            TimerCallFunc.unscheduleFunc(func, group, param);
                        }
                        break;
                }
            }
        }
    };
    func.callback_wrapper = function() {
        append(loopType);
    };
    cc.director.getScheduler().schedule(func.callback_wrapper, param, dt, cc.macro.RepeatForever, 0, false);
    TCF_maps[group][func] = func.callback_wrapper;
};

TimerCallFunc.unscheduleFunc = function(func, group, param) {
    group = group || bole.scene;
    if (TCF_maps[group]) 
    {
        // var param = TCF_maps[group][func];
        //if (param) 
        {
            const scheduler = cc.director.getScheduler();
            scheduler.unschedule(func.callback_wrapper, param);
            delete TCF_maps[group][func];
        }
    }
};

TimerCallFunc.pauseThemeTimer = function(group) {
    if (TCF_maps[group]) {
        TCF_maps[group].state = cc.Scheduler.State.PAUSED;
    }
};

TimerCallFunc.resumeThemeTimer = function(group) {
    if (TCF_maps[group]) {
        TCF_maps[group].state = cc.Scheduler.State.IDLE;
    }
};

TimerCallFunc.clearGroup = function(group) {
    if (TCF_maps[group]) {
        let scheduler = cc.director.getScheduler();
        for (let func in TCF_maps[group]) {
            if (typeof(TCF_maps[group][func]) === "number") {
                scheduler.unschedule(TCF_maps[group][func]);
            }
        }
    }
    TCF_maps[group] = null;
};

////////////////////////////////////////////////////