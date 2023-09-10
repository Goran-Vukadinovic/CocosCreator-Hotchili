require("./Common");

DESIGN_SIZE = cc.size(1280, 720);

tools = cc.Class({
    ctor() {
        var theme = arguments[0];
        this.pri = {};
        this.theme = theme;
        this.pri.theme = theme;
        this.pri.themeId = this.theme.themeId;
        this.pri.ImgPath = this.getPath('image/', this.pri.themeId);
        this.pri.SpinePath = this.getPath('spine/', this.pri.themeId);
        this.pri.FontPath = this.getPath('font/', this.pri.themeId);
        this.pri.PlistPath = this.getPath('plist/', this.pri.themeId);
        this.pri.AudioPath = this.getPath('audio/', this.pri.themeId);
        this.pri.img = tools.createResTable(this.pri.ImgPath);
        this.pri.ani = tools.createResTable(this.pri.SpinePath);
        this.pri.node = new cc.Node();
        this.pri.theme.addChild(this.pri.node);
        this.pri.randomEffectList = [];
        this.pri.randomVoiceList = [];
        //tools:log(pri.themeId,pri.ImgPath,pri.AudioPath)
    },
    getPath(name, themeId) {
        return "theme" + this.pri.themeId + "/ " + name;
    },
});

tools.createResTable = function(frontPath){
    var resTable = {
        ng : frontPath + "ng/",
        fg : frontPath + "fg/",
        bg : frontPath + "bg/",
        sfg : frontPath + "sfg/",
        pop : frontPath + "pop/",
        symbol : frontPath + "symbol/",
        wheel : frontPath + "wheel/",
        interlude : frontPath + "interlude/",
    };
    return resTable
};

tools.setThemeScaleX = function (bgSpr, baseScale) {
    baseScale = baseScale || 1;

    if (!bgSpr || !bole.isChrome()) {
        return;
    }

    var size = bgSpr.getContentSize();
    var director = cc.director;
    var glSize = director.getVisibleSize();
    //航海宝藏特殊处理
    if (size.width === 0) {
        size = cc.size(720, 1560);
    }
    bgSpr.setScaleX((glSize.width / size.width) * bgSpr.scaleX * baseScale);
}

tools.setWidgetBottom = function(node, offsetY) {
  if (!node || !offsetY || !bole.isChrome()) {
    return;
  }

  node.y = offsetY;
}

tools.setThemeScale = function(node, scale) {
  if (!node || !scale || !bole.isChrome()) {
    return;
  }

  const glSize = cc.view.getVisibleSize();
  const scaleOffset = (glSize.height / glSize.width) / (DESIGN_SIZE.height / DESIGN_SIZE.width);

  node.setScale(scale * scaleOffset);
}
tools.setThemeOtherScale = function(node, scale, bAdd) {
    if (!node || !cc.sys.browserType === cc.sys.BROWSER_TYPE_CHROME) {
        return;
    }

    scale = scale || 1;
    bAdd = bAdd || false;

    let visibleSize = cc.view.getVisibleSize();
    let radio = visibleSize.height / visibleSize.width;

    if(bAdd) {
        radio = visibleSize.width / visibleSize.height;
    }

    node.scale = node.scale * scale * radio;
};
