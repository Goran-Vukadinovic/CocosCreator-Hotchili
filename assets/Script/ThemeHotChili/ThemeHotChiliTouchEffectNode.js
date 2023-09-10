require("./Common");

ThemeHotChiliTouchEffectNode = cc.Class({
    extends: cc.Node,
    ctor() {
        this.img = tools.createResTable(ThemeHotChili.ImgPath);
        this.ani = tools.createResTable(ThemeHotChili.SpinePath);
        let startPosition;

        const onTouchBegan = (touch, event) => {
            startPosition = this.convertToNodeSpace(touch.getLocation());

            const effectAni = new cc.ParticleSystemQuad(ThemeHotChili.SpinePath + "ng/NG_lajiao.plist");
            effectAni.setPosition(startPosition);
            this.addChild(effectAni);

            effectAni.runAction(cc.sequence(
                cc.delayTime(1),
                cc.removeSelf(),
            ));
        };

        const onTouchCancelled = (touch, event) => {
            // Implementation goes here.
        };

        const onTouchMoved = (touch, event) => {
            // Implementation goes here.
        };

        const onTouchEnded = (touch, event) => {
            // Implementation goes here.
        };

        const listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan,
            onTouchMoved,
            onTouchCancelled,
            onTouchEnded,
        });

        const eventDispatcher = this.getEventDispatcher();
        eventDispatcher.addEventListenerWithSceneGraphPriority(listener, this);
    },

    // Additional methods go here.
});
