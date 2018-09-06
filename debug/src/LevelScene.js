/**
 * Created by Kien on 3/11/2016.
 */
var BUTTON_TAG_LEVEL = {
    btn_back_ : 0
};

var LevelLayer = cc.Layer.extend({
    size:null,
    scale_:0,
    btnSize:0,
    iColor:0,
    listLabel:null,
    listMark:null,
    recntPage:0,
    oldPage:0,
    dTile:0,
    unlockLevel:0,
    startY:0,
    layout:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init();
        thiz = this;

        //var bgLayer = new cc.LayerColor(cc.color(0, 255, 255, 180));
         //this.addChild(bgLayer);

        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if(keyCode == cc.KEY.back){
					cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                    cc.director.runScene(new PackScene());
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);

        this.listLabel = [];
        this.listMark = [];

        this.size = cc.winSize;
        cc.log("w: %d", this.size.width);
        this.scale_ = size.width/DESIGN_WIDTH;

        this.unlockLevel = rms.getItem(KEY_UNLOCK_LEVEL + g_pack + "_" + g_pack_sub, UNLOCK_DEFAULT);

        var btn_back = new ccui.Button(res.btn_back, res.btn_back_press);
        var topY = this.size.height - (btn_back.getContentSize().width/2 + 10)*this.scale_;
        btn_back.setPosition(cc.p((btn_back.getContentSize().width/2 + 10)*this.scale_, topY));
        btn_back.setScale(this.scale_);
        btn_back.setTag(BUTTON_TAG_LEVEL.btn_back_);
        btn_back.addTouchEventListener(this.btnUITouchEvent, this);
        this.addChild(btn_back, 2);

        var labelColorIndex = getRandomInt(0, titleColor.length - 1)
        var labelPack = new cc.LabelTTF(g_pack_data[g_pack].name, "YK", 45*this.scale_);
        labelPack.setAnchorPoint(cc.p(0, 0.5));
        labelPack.setPosition(cc.p(btn_back.getPositionX() + (btn_back.getContentSize().width/2 + 10)*this.scale_, topY));
        labelPack.setColor(titleColor[labelColorIndex]);
        this.addChild(labelPack);

        var offsetX = 89*this.scale_;
        var posY = this.size.height / 2;
        var fontSize = 238*this.scale_;

        /*var label = new cc.LabelTTF("YK", font.Font_Roboto_Bold, fontSize);
         label.setPosition(cc.p(this.size.width/2, posY + 40));
         label.setColor(rainbowColor[4]);
         this.addChild(label);

        var labelL = new cc.LabelTTF("L", font.Font_Roboto_Bold, fontSize);
        labelL.setPosition(cc.p(this.size.width/2 - offsetX, posY));
        labelL.setColor(rainbowColor[4]);
        this.addChild(labelL);

        var labelV = new cc.LabelTTF("V", font.Font_Roboto_Bold, fontSize);
        labelV.setPosition(cc.p(this.size.width/2 + offsetX, posY));
        labelV.setColor(rainbowColor[6]);
        this.addChild(labelV);*/

        this.layout = new ccui.Layout();
        this.layout.setContentSize(this.size.width, this.size.height);
        this.layout.setPosition(this.size.width/2, this.size.height/2);
        this.layout.setAnchorPoint(0.5, 0.5);
        this.layout.setTouchEnabled(true);
        this.addChild(this.layout, 1);
        this.scheduleOnce(this.removeTmpLayout);

        // Create the page view
        var pageView = new ccui.PageView();
        pageView.setTouchEnabled(true);
        pageView.setContentSize(this.size);
        //pageView.setAnchorPoint(cc.p(1, 1));
        pageView.x = 0;
        pageView.y = 0;

        this.recntPage = 0;
        this.oldPage = this.recntPage;

        this.iColor = getRandomInt(0, rainbowColor.length - 1);

        var _0x = 100*this.scale_;
		this.dTile = 25*this.scale_;
        this.btnSize = (this.size.width - 2*_0x - 4*this.dTile)/ 5;
        var startX = _0x + this.btnSize/ 2;
        this.startY = this.size.height - (this.size.height - 5*this.dTile - 6*this.btnSize)/2;
        var level = -1;
        for (var i = 0; i < g_numPage; ++i) {
            var layout = new ccui.Layout();
            layout.setContentSize(this.size);
            //layout.setAnchorPoint(cc.p(0.5, 0.5));
            var layoutRect = layout.getContentSize();

            for(var c = 0; c < 6; c++) {
                if (level >= g_numLevel) break;
                for (var r = 0; r < 5; r++) {
                    level++;
                    if (level >= g_numLevel) break;
                    this.createRect(layout, cc.p(startX + r * (this.btnSize + this.dTile), this.startY - c * (this.btnSize + this.dTile)), level);
                }
            }

            pageView.addPage(layout);
        }
        pageView.addEventListener(this.pageViewEvent, this);
        var indexPage = Math.floor(this.unlockLevel/30);
        if(indexPage >= g_numPage) indexPage = 0;
        pageView.scrollToPage(indexPage);
        this.addChild(pageView);

        this.recntPage = indexPage;
        this.showMarkPage();
                                 
        return true;
    },
    pageViewEvent: function (sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                var pageView = sender;
                this.recntPage = pageView.getCurPageIndex();
                if(this.oldPage != this.recntPage){
                    cc.log("this.recntPage: " + this.recntPage);
                    this.showMarkPage();
                    this.oldPage = this.recntPage;
                    cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                }
                break;
            default:
                break;
        }
    },
    createRect:function(parent, pos, level){
        var isUnlocked = false;
        var isCurrent = false;
        if(this.unlockLevel == level){
            var color = cc.color(255, 255, 255, 255);
            isCurrent = true;
        } else{
            this.iColor++;
            if(this.iColor >= rainbowColor.length) this.iColor = 0;
            var color = rainbowColor[this.iColor];
            if(this.unlockLevel < level){
                isUnlocked = true;
            }
        }

        draw = new cc.DrawNode();
        draw.setAnchorPoint(cc.p(0.5, 0.5));
        draw.drawRect(cc.p(pos.x - this.btnSize/2, pos.y - this.btnSize/2), cc.p(pos.x + this.btnSize/2, pos.y + this.btnSize/2), null, 2*this.scale_, color);
        parent.addChild(draw);

        var btn = new ccui.Button(res.pixel_png, res.pixel_png);
        btn.setScale(this.btnSize + this.scale_);
        btn.setColor(color);
        btn.setOpacity(0);
        btn.setPosition(pos);
        btn.setTag(level);
        if(!isUnlocked)
            btn.addTouchEventListener(this.btnTouchEvent, this);
        parent.addChild(btn);

        if(isUnlocked){
            var imgLock = new cc.Sprite(res.img_lock_png);
            imgLock.setScale(this.scale_);
            imgLock.setPosition(pos);
            parent.addChild(imgLock);
        }

        if(isCurrent){
            var action2 = cc.tintBy(2, -127, -255, -127);
            var action2Back = action2.reverse();
            //draw.runAction(cc.sequence(action2, cc.delayTime(0.25), action2Back));
            draw.runAction(cc.sequence(cc.blink(1, 2), cc.delayTime(1)).repeatForever());
        }

        var label = new cc.LabelTTF(level + 1, "YK", 30*this.scale_);
        label.setPosition(pos);
        parent.addChild(label);
        this.listLabel.push(label);
    },
    btnTouchEvent:function(sender, type){
        var level = sender.getTag();
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                sender.setOpacity(255);
                this.listLabel[level].setColor(cc.color(0, 0, 0, 255));
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setOpacity(0);
                this.listLabel[level].setColor(cc.color(255, 255, 255, 255));
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                cc.log("press: " + sender.getTag());
                sender.setOpacity(0);
                this.listLabel[level].setColor(cc.color(255, 255, 255, 255));
                g_level = level;
                cc.director.pushScene(new GameScene());
                break;
        };
    },
    btnUITouchEvent:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
        switch (sender.getTag()) {
            case BUTTON_TAG_LEVEL.btn_back_:
                cc.director.runScene(new PackScene());
                break;
        }
    },
    showMarkPage:function(){
        if(g_numPage <= 1) return;
        if(this.listMark.length != 0){
            for(var i = 0; i < this.listMark.length; i++){
                this.listMark[i].removeFromParent();
            }
            this.listMark = [];
        }

        var tileSize = 6*this.scale_, dTile = 10*this.scale_;
        var half = Math.floor(g_numPage/2);
        var startMarkX;
        if(g_numPage % 2 == 0){
            startMarkX = this.size.width/2 - dTile/2 - half*tileSize - (half - 1)*dTile + tileSize/2;
        } else {
            startMarkX = this.size.width/2 - tileSize/2 - half*(tileSize + dTile) + tileSize/2;
        }

        for(var i = 0; i < g_numPage; i++){
            var mark = new cc.DrawNode();
            mark.setPosition(cc.p(startMarkX + i*(tileSize + dTile), this.startY - 5 * (this.btnSize + this.dTile) - this.btnSize));
            this.addChild(mark);
            var color = cc.color(128, 128, 128, 255);
            if(i == this.recntPage)
                color = cc.color(255, 255, 255, 255);
            mark.drawDot(cc.p(0, 0), tileSize, color);
            this.listMark.push(mark);
        }
    },
    removeTmpLayout:function(dt){
        this.layout.removeFromParent();
    }
});

var LevelScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelLayer();
        this.addChild(layer);
    }
});