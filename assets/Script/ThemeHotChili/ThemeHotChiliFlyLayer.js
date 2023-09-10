ThemeHotChiliFlyLayer = cc.Class({
    extends: cc.Layer,
    name:"ThemeHotChiliFlyLayer",

    ctor() {
        this.init();
    },

    init() {
        this._setCascadeOpacityEnabled(true);
    },

    wildCollect(startPos) {
        const sugar = new cc._Sprite();
        sugar.setPosition(this.convertToNodeSpace(cc.v2(startPos.x, startPos.y)));
        this.addChild(sugar);

        const size = sugar.getContentSize();
        const endPos = ThemeHotChili.gameLayer.dragonBall.getParent().convertToWorldSpace(ThemeHotChili.gameLayer.dragonBall.getPosition());
        sugar.runAction(cc.sequence(
            cc.callFunc(() => {
                const star = new cc.ParticleSystemQuad(ThemeSugarKingdom.ImgPath + "chips_collect_star.plist");
                star.setPosition(size.width / 2, size.height / 2);
                sugar.addChild(star);

                const lizi = new cc.ParticleSystemQuad(ThemeHotChili.ImgPath + "collect_fire.plist");
                lizi.setPosition(size.width / 2, size.height / 2);
                sugar.addChild(lizi);
            }),
            cc.moveTo(0.5, endPos),
            cc.delayTime(0.1),
            cc.removeSelf()
        ));
    }
});
