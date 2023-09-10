cc.macro.ENABLE_MULTI_TOUCH = false
SCREEN_RATIO = 1
SCREEN_RATIO_VERTICAL = SCREEN_RATIO * ((SCREEN_RATIO === 1) && 1 || 0.84)
var utils = {
    gettime:function(){
        let currentTime = Date.now();
        return currentTime;
    }
};
cc.utils = utils;

var Layer = cc.Class({
    name:"cc.Layer",
    extends: cc.Node,
    ctor: function () {
    },
})
cc.Layer = Layer;

cc.director.getVisibleOrigin = function(){
    return cc.view.getVisibleOrigin();
}
cc.director.getVisibleSize = function(){
    return cc.view.getVisibleSize();
}

removeExt = function (filePath){
    let fileNameWithoutExtension = filePath.replace(/\.[^/.]+$/, "");
    return fileNameWithoutExtension;
}

var _Sprite = cc.Class({
    name:"_Sprite",
    extends: cc.Node,
    ctor: function () {
        var imgPath = arguments[0];
        this.sprite = this.addComponent(cc.Sprite);
        if(imgPath){
            var spriteFrame = ThemeResource.getLoadedImage(imgPath)
            if(!spriteFrame) console.log("Error image", imgPath);
            this.sprite.spriteFrame = spriteFrame;
        }
    },
    setSpriteFrame:function(spriteFrame){
        this.sprite.spriteFrame = spriteFrame;
    }
})

_Sprite.create = function(imgPath){
    sprite = new _Sprite(imgPath);
    return sprite;
}

cc._Sprite = _Sprite;

cc.Node.prototype.setVisible = function(val){
    this.active = val;
}
var SkeletonAnimation = cc.Class({
    name:"SkeletonAnimation",
    extends: cc.Node,
    ctor: function () {
        this.run = false;
        this.idx = 0;
        this.aniName = "";
        this.loop = false;

        var imgPath = arguments[0];
        this.animation = this.addComponent(sp.Skeleton); 
        this.animation.premultipliedAlpha = false;
        var This = this;
        cc.resources.load(imgPath, sp.SkeletonData, function(err,my_animation){
            This.animation.skeletonData = my_animation;
            if(This.run) This.animation.setAnimation(This.idx, This.aniName, This.loop);
        });
    },
    setAnimation:function(idx, name, loop){
        this.idx = idx;
        this.aniName = name;
        this.loop = loop;
        this.run = true;
        this.animation.setAnimation(idx, name, loop);
    }
});
var _SkeletonAnimation = cc.Class({
    name:"_SkeletonAnimation",
    extends: cc.Node,
    ctor: function () {
        var imgPath = arguments[0];
        this.animation = this.addComponent(sp.Skeleton);         
        this.animation.premultipliedAlpha = false;
        var skeletonData = ThemeResource.getLoadedAnimation(imgPath);
        if(!skeletonData) console.log("Error animation", imgPath);
        this.animation.skeletonData = skeletonData;
    },
    setAnimation:function(idx, name, loop){
        var This = this;
        setTimeout(function(){
            This.animation.setAnimation(idx, name, loop);
        }, 0);        
    },
    clearTracks:function(){
        this.animation.clearTracks();
    },
    clearTrack:function(idx){
        this.animation.clearTrack(idx);
    }
});
sp._SkeletonAnimation = _SkeletonAnimation;

cc.p = cc.v2;
cc.c4b = cc.Color;

var _ClippingNode = cc.Class({
    name:"_ClippingNode",
    extends: cc.Node,
    ctor: function () {
        var stencil = arguments[0];
        this.mask = this.addComponent(cc.Mask);
        this.mask.type = cc.Mask.Type.IMAGE_STENCIL;
        this.mask.spriteFrame = stencil.spriteFrame;
    },
    setAlphaThreshold:function(alpha){
        this.mask.alphaThreshold = alpha;
    },
})

cc._ClippingNode = _ClippingNode;
cc.Node.create = function(){
    return new cc.Node();
}
cc.Node.prototype._setCascadeOpacityEnabled = function(enabled){
}

var _LabelBMFont = cc.Class({
    name:"_LabelBMFont",
    extends: cc.Node,
    ctor: function () {
        var name = arguments[0];
        var fontPath = arguments[1];
        this.label = this.addComponent(cc.Label);
        if(fontPath){
            var font = ThemeResource.getLoadedBitmapFont(fontPath);
            if(!font) console.log("Error font", fontPath);
            this.label.font = font;
        }
    },
    setFixWidth:function(w){
        if(!this.width) this.width = w;
        var sx = Math.min(1, w / this.width);
        this.scaleX = sx;
        this.scaleY = this.scaleX;
    },
    setString:function(str){
        var width = this.width;
        this.label.string = str;
        var This =  this;
        this.label.scheduleOnce(() => {
            This.setFixWidth(width);
        });
    },
    
});
cc._LabelBMFont = _LabelBMFont;

//reference   child's content size do not affect to parent
var _Button = cc.Class({
    name:"_Button",
    extends: cc._Sprite,
    ctor: function () {
    },
    setOpacity:function(a){
        this.opacity  = a;
    },
    setTouchEnabled:function(enabled){
    },
    addTouchEventListener:function(cb){
        callback = function(e){
            cb(null, e.type);
        };
        this.on(cc.Node.EventType.TOUCH_START, callback);
        this.on(cc.Node.EventType.TOUCH_MOVE, callback);
        this.on(cc.Node.EventType.TOUCH_END, callback,);
        this.on(cc.Node.EventType.TOUCH_CANCEL, callback);
    }
});

cc._Button = _Button;


cc.Node.prototype.schedule = function(callback, interval){
    cc.director.getScheduler().schedule(callback, this, interval, 
        cc.macro.REPEAT_FOREVER, 0, false);

    //this.runAction(cc.sequence(cc.delayTime(this.JPInterval), cc.callFunc(scheduleSendCmd, this)));

}
cc.Node.prototype.setTouchEnabled = function(enabled){
};
cc.Node.prototype._setLocalZOrder = function(ord){
    this.zIndex = ord;
}
cc.Node.prototype._getLocalZOrder = function(){
    return this.zIndex;
}
cc.Node.prototype.isVisible = function(){
    return this.active;
}



var _Label = cc.Class({
    name:"_Label",
    extends: cc.Node,
    ctor: function () {
        var str = arguments[0];
        this.label = this.addComponent(cc.Label);
        this.label.string = str;
    },
    setString:function(str){
        this.label.string = str;
    },
});
cc._Label = _Label;

var _LayerColor = cc.Class({
    name:"_LayerColor",
    extends:cc.Node,
    ctor:function(){
        var clr = arguments[0];
        var width = arguments[1];
        var height = arguments[2];
        this.width = width;
        this.height = height;
        this.colorLayer = this.addComponent(cc.Graphics);
        this.colorLayer.fillRect(0, 0, this.width, this.height, clr);
    },
});
cc._LayerColor = _LayerColor;

cc.DelayTime.create = function(dur){
    return cc.delayTime(dur);
}
cc.ScaleTo.create = function(sx, sy){
    return new cc.ScaleTo(sx, sy);
}
cc.Sequence.create = function(...args){
    //b.apply(null, arguments);
    return new cc.Sequence(...args);
}
cc.RepeatForever.create = function(seq){
    return new cc.RepeatForever(seq);
}
cc.EaseSineOut = {};
cc.EaseSineOut.create = function(p){
    return p.easing(cc.easeSineOut())
}
cc.EaseSineInOut = {};
cc.EaseSineInOut.create = function(p){
    return p.easing(cc.easeSineInOut())
}
cc.EaseSineIn = {};
cc.EaseSineIn.create = function(p){
    return p.easing(cc.easeSineIn())
}
cc.MoveTo = {};
cc.MoveTo.create = function(a, b){
    return cc.moveBy(a, b);
}