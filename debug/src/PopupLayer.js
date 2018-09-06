var PopupLayer = cc.Layer.extend({
    size:null,
    listener:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        thiz = this;

        // set background color
        /*var bgLayer = new cc.LayerColor(cc.color(0, 0, 0, 180));
        this.addChild(bgLayer);
        bgLayer.setTouchEnabled(true);*/

        /*this.listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                cc.log("popup onTouchBegan");
                return true;
            },
            onTouchMoved: function (touch, event) {
                cc.log("popup onTouchMoved");
            },
            onTouchEnded: function (touch, event) {
                cc.log("popup onTouchEnded");
                cc.eventManager.removeListener(thiz.listener);
                thiz.removeFromParent();
            }
        });
        cc.eventManager.addListener(this.listener, this);*/

        /*cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        }, this);*/

        //setTouchEnabled(false);
        //this.setTouchPriority(1);
        //this.setTouchMode(cc.TOUCH_ONE_BY_ONE);
        //this._isTouchEnabled = true;

        this.size = cc.winSize;
        cc.log("w: %d", this.size.width);

        var layout = new ccui.Layout();
        layout.setContentSize(this.size.width, this.size.height);
        layout.setPosition(this.size.width/2, this.size.height/2);
        layout.setAnchorPoint(0.5, 0.5);
        layout.addTouchEventListener(this.touchEvent, this);
        layout.setTouchEnabled(true);
        this.addChild(layout);

        return true;
    },
    touchEvent: function (sender, type) {
        if(type != ccui.Widget.TOUCH_BEGAN) return;
        cc.log("touchEvent");
        //cc.eventManager.removeAllListeners();
        this.removeFromParent();
    }
});