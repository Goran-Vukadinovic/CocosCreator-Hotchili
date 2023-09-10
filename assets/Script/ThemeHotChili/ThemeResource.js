var g_allImages = {};
var g_nAllImages = 0;
var g_nLoadedImage = 0;

var g_allSpines = {};
var g_nAllSpines = 0;
var g_nLoadedSpines = 0;

var g_allBitmapFonts = {};
var g_nAllBitmapFonts = 0;
var g_nLoadedBitmapFonts = 0;

ThemeResource = {};
ThemeResource.loadImage = function (path){
    path = removeExt(path);
    if(g_allImages[path]) return;
    g_nAllImages++;
    cc.resources.load(path, cc.SpriteFrame, null, function (err, spriteFrame) {
        if(err) console.log("loadImage", path);
        else{
            g_allImages[path] = spriteFrame;
            g_nLoadedImage++;
        }
    });
}

ThemeResource.getLoadedImage = function (path){
    path = removeExt(path);
    return g_allImages[path];
}

ThemeResource.loadAnimation = function (path){
    path = removeExt(path);
    if(g_allSpines[path]) return;
    g_nAllSpines++;
    cc.resources.load(path, sp.SkeletonData, null, function (err, skeletonData) {
        if(err) console.log("loadAnimation", path);
        else{
            g_allSpines[path] = skeletonData;
            g_nLoadedSpines++;
        }
    });
}

ThemeResource.getLoadedAnimation = function (path){
    path = removeExt(path);
    return g_allSpines[path];
}

ThemeResource.loadBitmapFont = function (path){
    path = removeExt(path);
    if(g_allBitmapFonts[path]) return;
    g_nAllBitmapFonts++;
    cc.resources.load(path, cc.BitmapFont, null, function (err, data) {
        if(err) console.log("loadBitmapFont", path);
        else{
            g_allBitmapFonts[path] = data;
            g_nLoadedBitmapFonts++;
        }
    });
}

ThemeResource.getLoadedBitmapFont = function (path){
    path = removeExt(path);
    return g_allBitmapFonts[path];
}

ThemeResource.isComplete = function(){
    if(g_nAllBitmapFonts == g_nLoadedBitmapFonts 
        && g_nAllImages == g_nLoadedImage
        && g_nAllSpines == g_nLoadedSpines) return true;
        return false;
}
ThemeResource.themeid = GLOBAL_THEME_ID;
ThemeResource.getPic = function(name){
    return "theme" + this.themeid + "/" + name;

}

ThemeResource.startLoading = function() {
    this.loadAnimation(this.getPic('spine/ng/BG_SC'));
    this.loadAnimation(this.getPic('spine/ng/BG_shouji'));
    this.loadAnimation(this.getPic('spine/ng/NG_2lajiao'));
    this.loadAnimation(this.getPic('spine/ng/NG_box_shouji'));
    this.loadAnimation(this.getPic('spine/ng/NG_box'));
    this.loadAnimation(this.getPic('spine/ng/NG_dajiangyugao'));
    this.loadAnimation(this.getPic('spine/ng/NG_H1'));
    this.loadAnimation(this.getPic('spine/ng/NG_H2'));
    this.loadAnimation(this.getPic('spine/ng/NG_H3'));
    this.loadAnimation(this.getPic('spine/ng/NG_H4'));
    this.loadAnimation(this.getPic('spine/ng/NG_H5'));
    this.loadAnimation(this.getPic('spine/ng/NG_jpsuo'));
    this.loadAnimation(this.getPic('spine/ng/NG_L1'));
    this.loadAnimation(this.getPic('spine/ng/NG_L2'));
    this.loadAnimation(this.getPic('spine/ng/NG_L3'));
    this.loadAnimation(this.getPic('spine/ng/NG_L4'));
    this.loadAnimation(this.getPic('spine/ng/NG_L5'));
    this.loadAnimation(this.getPic('spine/ng/NG_SC'));
    this.loadAnimation(this.getPic('spine/ng/NG_tp'));
    this.loadAnimation(this.getPic('spine/ng/NG_yfk'));
    this.loadAnimation(this.getPic('spine/fg/FG_guochang'));
    this.loadAnimation(this.getPic('spine/fg/FG_respin'));
    this.loadAnimation(this.getPic('spine/fg/TC_FG_bg'));
    this.loadAnimation(this.getPic('spine/fg/TC_FG_JS_title'));
    this.loadAnimation(this.getPic('spine/fg/TC_FG_title'));
    this.loadAnimation(this.getPic('spine/fg/TC_FG_xuanze_kuangxuan'));
    this.loadAnimation(this.getPic('spine/fg/TC_FG_xuanze_kung'));
    this.loadAnimation(this.getPic('spine/fg/TC_FG_xuanze_title'));
    this.loadAnimation(this.getPic('spine/fg/TC_FG_xuanzebg'));
    this.loadAnimation(this.getPic('spine/bg/BG_choujiang'));
    this.loadAnimation(this.getPic('spine/bg/BG_guochang'));
    this.loadAnimation(this.getPic('spine/bg/BG_huanglajiao'));
    this.loadAnimation(this.getPic('spine/bg/TC_JP_chengbei'));
    this.loadAnimation(this.getPic('spine/bg/TC_JP_xiaolajiao'));

    this.loadBitmapFont(this.getPic('image/fg/fgSelectNum.fnt'));
    this.loadBitmapFont(this.getPic('image/fg/fg_num.fnt'));
    this.loadBitmapFont(this.getPic('image/ng/jpFnt1.fnt'));
    this.loadBitmapFont(this.getPic('image/ng/jpFnt2.fnt'));
    this.loadBitmapFont(this.getPic('image/ng/jpFnt3.fnt'));
    this.loadBitmapFont(this.getPic('image/ng/jpFnt4.fnt'));
    this.loadBitmapFont(this.getPic('image/ng/jpFnt5.fnt'));
    this.loadBitmapFont(this.getPic('image/ng/jpDarkFnt.fnt'));
    this.loadBitmapFont(this.getPic('image/ng/jpWinNum.fnt'));
    this.loadBitmapFont(this.getPic('image/ng/chips_shuzi.fnt'));

    this.loadImage(this.getPic('image/ng/jpFrame4'));
    this.loadImage(this.getPic('image/ng/jpFrame5'));
    this.loadImage(this.getPic('image/ng/jpWinNum'));
    this.loadImage(this.getPic('image/ng/line_L3'));
    this.loadImage(this.getPic('image/ng/line_L4'));
    this.loadImage(this.getPic('image/ng/line_L5'));
    this.loadImage(this.getPic('image/ng/line_L6'));
    this.loadImage(this.getPic('image/ng/lockFrame'));
    this.loadImage(this.getPic('image/ng/logo'));
    this.loadImage(this.getPic('image/ng/ngBg'));
    this.loadImage(this.getPic('image/ng/qizi_L1'));
    this.loadImage(this.getPic('image/ng/qizi_L2'));
    this.loadImage(this.getPic('image/ng/qizi_R1'));
    this.loadImage(this.getPic('image/ng/qizi_R2'));
    this.loadImage(this.getPic('image/ng/reelback3'));
    this.loadImage(this.getPic('image/ng/reelback4'));
    this.loadImage(this.getPic('image/ng/reelback5'));
    this.loadImage(this.getPic('image/ng/reelback6'));
    //this.loadImage(this.getPic('image/ng/symbol'));
    this.loadImage(this.getPic('image/ng/x2'));
    this.loadImage(this.getPic('image/ng/x3'));
    this.loadImage(this.getPic('image/ng/x4'));
    this.loadImage(this.getPic('image/ng/x5'));

    this.loadImage(this.getPic('image/fg/fg_board.png'));
    this.loadImage(this.getPic('image/fg/fg_num.png'));
    this.loadImage(this.getPic('image/fg/fgSelectNum.png'));
    this.loadImage(this.getPic('image/fg/greenFrame.png'));
    this.loadImage(this.getPic('image/fg/numFrame.png'));
    this.loadImage(this.getPic('image/fg/rowNum1.png'));
    this.loadImage(this.getPic('image/fg/rowNum2.png'));
    this.loadImage(this.getPic('image/fg/rowNum3.png'));
    this.loadImage(this.getPic('image/fg/rowNum4.png'));
    this.loadImage(this.getPic('image/fg/table1.png'));
    this.loadImage(this.getPic('image/fg/table2.png'));
    this.loadImage(this.getPic('image/fg/table3.png'));
    this.loadImage(this.getPic('image/fg/table4.png'));
    this.loadImage(this.getPic('image/fg/youWin.png'));
    
    this.loadImage(this.getPic('image/bg/1.png'));
    this.loadImage(this.getPic('image/bg/2.png'));
    this.loadImage(this.getPic('image/bg/3.png'));
    this.loadImage(this.getPic('image/bg/4.png'));
    this.loadImage(this.getPic('image/bg/5.png'));
    this.loadImage(this.getPic('image/bg/bgSelectBall.png'));
    this.loadImage(this.getPic('image/bg/coin_frame.png'));
    this.loadImage(this.getPic('image/bg/frame2.png'));
    this.loadImage(this.getPic('image/bg/frame3.png'));
    this.loadImage(this.getPic('image/bg/frame4.png'));
    this.loadImage(this.getPic('image/bg/frame5.png'));
    this.loadImage(this.getPic('image/bg/jpwinsx2.png'));
    this.loadImage(this.getPic('image/bg/jpwinsx3.png'));
    this.loadImage(this.getPic('image/bg/jpwinsx4.png'));
    this.loadImage(this.getPic('image/bg/jpwinsx5.png'));
    this.loadImage(this.getPic('image/bg/match.png'));
    this.loadImage(this.getPic('image/bg/midLine.png'));
    this.loadImage(this.getPic('image/bg/X.png'));

    this.loadImage(this.getPic("image/ng/collectDark.png"));
    this.loadImage(this.getPic("image/ng/frameL.png"));
    this.loadImage(this.getPic("image/ng/frameR.png"));
    this.loadImage(this.getPic("image/ng/frameTop.png"));
    this.loadImage(this.getPic("image/ng/frameDown.png"));
    this.loadImage(this.getPic("image/ng/earL.png"));
    this.loadImage(this.getPic("image/ng/earR.png"));
    this.loadImage(this.getPic("image/ng/columnBar.png"));
    this.loadImage(this.getPic("image/ng/jpFrame1.png"));
    this.loadImage(this.getPic("image/ng/jpFrame2.png"));
    this.loadImage(this.getPic("image/ng/jpFrame3.png"));

    this.loadImage(this.getPic("lang_EN/jpTitle1_EN.png"));
    this.loadImage(this.getPic("lang_EN/jpTitle2_EN.png"));
    this.loadImage(this.getPic("lang_EN/jpTitle3_EN.png"));
    this.loadImage(this.getPic("lang_EN/jpTitle4_EN.png"));
    this.loadImage(this.getPic("lang_EN/jpTitle5_EN.png"));
    this.loadImage(this.getPic("lang_EN/jpTitleDark1_EN.png"));
    this.loadImage(this.getPic("lang_EN/jpTitleDark2_EN.png"));
    this.loadImage(this.getPic("lang_EN/jpTitleDark3_EN.png"));

    this.loadImage(this.getPic("lang_EN/betUp_EN.png"));
    this.loadImage(this.getPic("lang_EN/betUpEnd_EN.png"));
    this.loadImage(this.getPic("lang_EN/isUnLocked_EN.png"));
    this.loadImage(this.getPic("lang_EN/betUp_EN.png"));
    this.loadImage(this.getPic("lang_EN/betUpEnd_EN.png"));
    this.loadImage(this.getPic("lang_EN/isUnLocked_EN.png"));
    this.loadImage(this.getPic("lang_EN/betUp_EN.png"));
    this.loadImage(this.getPic("lang_EN/betUpEnd_EN.png"));
    this.loadImage(this.getPic("lang_EN/isUnLocked_EN.png"));


}