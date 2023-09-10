GLOBAL_THEME_ID = 111057;
PAD_TAG = true;
require("./ThemeHotChili/Common");
require("./ThemeHotChili/ThemeHotChili");
require("./ThemeHotChili/ThemeHotChiliGlobal")
require("./ThemeHotChili/ThemeResource")

SCENE_STATUS = {
    OnTest: "OnTest",
    OnLoading: "OnLoading",
    OnPlayGame: "OnPlayGame"
}
cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function () {
        cc.debug.setDisplayStats(false);

        if(false){
            ThemeResource.startLoading();
            this.status = SCENE_STATUS.OnTest;
            var scene = cc.director.getScene();
            this.game = new PlayGame(scene);
            this.game.onEnter();
        }
        else{
            this.status = SCENE_STATUS.OnLoading;
            ThemeResource.startLoading();
        }
    },

    // called every frame
    update: function (dt) {
        switch(this.status){
            case SCENE_STATUS.OnTest:{
                break;
            }
            case SCENE_STATUS.OnLoading:{
                if(ThemeResource.isComplete())
                {
                    var scene = cc.director.getScene();
                    this.game = new PlayGame(scene);
                    this.game.onEnter();
                    this.status = SCENE_STATUS.OnPlayGame;
                }
                else{
                    //show loading view
                }
                break;
            }
            case SCENE_STATUS.OnPlayGame:{
            }
        }
    },
});
