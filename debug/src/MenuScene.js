
var BUTTON_TAG_MENU = {
    btn_play_ : 0,
    btn_like_ : 1,
    btn_more_ : 2,
    btn_close_ : 3,
    btn_rate_ : 4
};

var POPUP_TYPE_MENU = {
    like: 0,
    update: 1
};

var MenuLayer = cc.Layer.extend({
    scale_:0,
    srpTitle:null,
    //labelY:null,
    //labelK:null,
    labelDebug:null,
    bgPopupLayer:null,
    listLabelPopup:null,
    popupType:0,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        thiz = this;

        /*var bgLayer = new cc.LayerColor(cc.color(0, 255, 255, 180));
        this.addChild(bgLayer);*/

        size = cc.winSize;
        cc.log("w: %d", size.width);
        this.scale_ = size.width/DESIGN_WIDTH;

        this.bgPopupLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
        this.addChild(this.bgPopupLayer, 3);
        this.bgPopupLayer.setVisible(false);

        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if(keyCode == cc.KEY.back){
					cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);                    
					if(thiz.isPopupShowing){
                        thiz.closePopup();
                    } else {
                        cc.director.runScene(new LanguageScene());
                    }
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);
        if(cc.sys.isNative) {

            var xmlhttp = new XMLHttpRequest();
            var url = LINK_UPDATE;
            var hasNewVersion = false;
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var dataLast = JSON.parse(xmlhttp.responseText);
                    cc.log("xmlhttp Request Asepted: " + xmlhttp.responseText);
                    cc.log("load currentVersion");
                    cc.loader.loadJson("res/version",function(error, dataCurrent){
                           var currentVersion = 0;
                           var lastVersion = 0;
                           if(cc.sys.os === cc.sys.OS_IOS){
                                currentVersion = parseInt(dataCurrent.iOS);
                                lastVersion = parseInt(dataLast.iOS);
                           } else if(cc.sys.os === cc.sys.OS_ANDROID){
                                currentVersion = parseInt(dataCurrent.android_google);
                                lastVersion = parseInt(dataLast.android_google);
                           }
                           cc.log("currentVersion: " + currentVersion + ", lastVersion: " + lastVersion);
                           if(currentVersion < lastVersion){
                                hasNewVersion = true;
                                //rms.setItem(KEY_HAS_NEW_VERSION, true);
                           }
                    });
                    //showMessage("YK", "currentVersion: " + currentVersion + ", lastVersion: " + lastVersion);
                    var title = g_text.text_new_version, message = g_text.msg_new_version,
                        text_btn_popup_1 = g_text.text_no, text_btn_popup_2 = g_text.text_ok,
                        type = POPUP_TYPE_MENU.update;
                    if(hasNewVersion){
                        thiz.createPopup(type, title, message, text_btn_popup_1, text_btn_popup_2);
                    }

                }
            }

            xmlhttp.open("GET", url, true);
            xmlhttp.send();

        }

        var offsetX = 89*this.scale_;
        var posY = size.height / 2;
        var fontSize = 238*this.scale_;

        /*var label = new cc.LabelTTF("YK", font.Font_Roboto_Bold, fontSize);
        label.setPosition(cc.p(size.width/2, posY + 40));
        label.setColor(rainbowColor[4]);
        this.addChild(label);*/

        /*this.labelY = new cc.LabelTTF("Y", "YK", fontSize);
        this.labelY.setPosition(cc.p(size.width/2 - offsetX, posY));
        this.labelY.setColor(rainbowColor[0]);
        this.addChild(this.labelY);

        this.labelK = new cc.LabelTTF("K", "YK", fontSize);
        this.labelK.setPosition(cc.p(size.width/2 + offsetX, posY));
        this.labelK.setColor(rainbowColor[3]);
        this.addChild(this.labelK);*/
        this.srpTitle = new cc.Sprite(res.img_logo);
        this.srpTitle.setPosition(cc.p(size.width/2, posY));
        this.addChild(this.srpTitle);

        /*cc.loader.loadTxt("res/level/" + g_pack + "_" + g_pack_sub, function(error, data){
            g_levelData = data.split(/\n/);
            g_levelData.splice(g_levelData.length - 1, 1);
            g_numLevel = g_levelData.length;
            cc.log("g_numLevel: " + g_numLevel);
            g_numPage = g_levelData.length/30;
            cc.log("g_numPage: " + g_numPage);
            thiz.scheduleOnce(thiz.play, 0.5);
        });*/

        this.labelDebug = new cc.LabelTTF("Ksdfasfasfasfsadfasfsadfasfsaffsdf", "YK", 20*this.scale_);
        this.labelDebug.setPosition(cc.p(size.width/2, posY));
        this.labelDebug.setColor(rainbowColor[3]);
        //this.addChild(this.labelDebug, 100);

        this.scheduleOnce(thiz.play, 0.5);

        return true;
    },
    play:function(dt) {
        var targetY = size.height - 200*this.scale_;
        /*this.labelY.runAction(cc.sequence(
                cc.moveTo(0.5, cc.p(this.labelY.getPositionX(), targetY)),
                cc.delayTime(0.5),
                cc.callFunc(this.moveDone, this))
        );
        this.labelK.runAction(cc.moveTo(0.5, cc.p(this.labelK.getPositionX(), targetY)));*/
        this.srpTitle.runAction(cc.sequence(
                cc.moveTo(0.5, cc.p(this.srpTitle.getPositionX(), targetY)),
                cc.delayTime(0.5),
                cc.callFunc(this.moveDone, this))
        );
    },
    moveDone:function(){
        var startPosY = size.height - 510*this.scale_;
        var offsetY = 160*this.scale_;
        var fontSize = 120*this.scale_;

        var btnPlay = new ccui.Button();
        btnPlay.setTitleText(g_text.text_play);
        btnPlay.setTitleFontSize(fontSize);
        btnPlay.setPosition(cc.p(size.width/2, startPosY));
        btnPlay.addTouchEventListener(this.btnTouchEvent, this);
        btnPlay.setTag(BUTTON_TAG_MENU.btn_play_);
        this.addChild(btnPlay);

        var btnLike = new ccui.Button();
        btnLike.setTitleText(g_text.text_invite_menu);
        btnLike.setTitleFontSize(fontSize);
        btnLike.setPosition(cc.p(size.width/2, startPosY - offsetY));
        btnLike.addTouchEventListener(this.btnTouchEvent, this);
        btnLike.setTag(BUTTON_TAG_MENU.btn_like_);
        this.addChild(btnLike);

        /*var btnRate = new ccui.Button();
        btnRate.setTitleText(g_text.text_rate);
        btnRate.setTitleFontSize(fontSize);
        btnRate.setPosition(cc.p(size.width/2, startPosY - 2*offsetY));
        btnRate.addTouchEventListener(this.btnTouchEvent, this);
        btnRate.setTag(BUTTON_TAG_MENU.btn_rate_);
        this.addChild(btnRate);*/
    },
    btnCloseTouchEvent:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
        switch(sender.getTag()){
            case BUTTON_TAG_MENU.btn_close_:
                cc.log("btn_close_");
                this.closePopup();
                break;
        };
    },
    btnTouchEvent:function(sender, type){
        if(this.isPopupShowing) return;
        var tag = sender.getTag();
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                var iColor = getRandomInt(0, rainbowColor.length - 1);
                sender.setColor(rainbowColor[iColor]);
                cc.log("TOUCH_BEGAN");
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setColor(cc.color(255, 255, 255, 255));
                break;
            case ccui.Widget.TOUCH_ENDED:
                sender.setColor(cc.color(255, 255, 255, 255));
                cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                switch(tag){
                    case BUTTON_TAG_MENU.btn_play_:
                        cc.director.pushScene(new PackScene());
                        break;
                    case BUTTON_TAG_MENU.btn_like_:
                        cc.log("like");
                        /*var title = g_text.text_like, message = g_text.msg_like,
                            text_btn_popup_1 = g_text.text_tw, text_btn_popup_2 = g_text.text_fb,
                            type = POPUP_TYPE_MENU.like;
                        this.createPopup(type, title, message, text_btn_popup_1, text_btn_popup_2);*/
                        FBInstant.context
                            .chooseAsync()
                            .then(function() {
                            });
                        break;
                    case BUTTON_TAG_MENU.btn_rate_:
                        cc.log("rate");
                        cc.sys.openURL(LINK_STORE);
                        break;
                };
                break;
        };
    },
    btnPopupTouchEvent:function(sender, type){
        var tag = sender.getTag();
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                sender.setOpacity(255);
                this.listLabel[tag].setColor(cc.color(0, 0, 0, 255));
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setOpacity(0);
                this.listLabel[tag].setColor(cc.color(255, 255, 255, 255));
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                sender.setOpacity(0);
                this.listLabel[tag].setColor(cc.color(255, 255, 255, 255));
                this.closePopup();
                switch (this.popupType) {
                    case POPUP_TYPE_MENU.like:
                        switch (tag) {
                            case BUTTON_TAG_POPUP.btn_popup_2:
                                cc.log("fb");
                                if(cc.sys.os === cc.sys.OS_IOS){
                                    cc.sys.openURL("fb://profile/1555755221411825");
                                } else {
                                    cc.sys.openURL("https://www.facebook.com/YKPuzzle/");
                                }
                                break;
                            case BUTTON_TAG_POPUP.btn_popup_1:
                                cc.log("tw");
                                cc.sys.openURL("https://twitter.com/duckien112");
                                break;
                        }
                        ;
                        break;
                    case POPUP_TYPE_MENU.update:
                        switch (tag) {
                            case BUTTON_TAG_POPUP.btn_popup_2:
                                cc.log("update");
                                cc.sys.openURL(LINK_STORE);
                                break;
                            case BUTTON_TAG_POPUP.btn_popup_1:
                                cc.log("no update");
                                break;
                        }
                        ;
                        break;
                }
                break;
        };
    },
    createPopup:function(type, title, message, text_btn_popup_1, text_btn_popup_2){
        this.isPopupShowing = true;

        this.popupType = type;

        this.bgPopupLayer.setVisible(true);
        this.bgPopupLayer.setContentSize(cc.size(550*this.scale_, 365*this.scale_));
        var pos = cc.p((size.width - this.bgPopupLayer.getContentSize().width)/2, (size.height - this.bgPopupLayer.getContentSize().height)/2);
        this.bgPopupLayer.setPosition(pos);
        this.listLabel = [];
        this.createRect(this.bgPopupLayer, cc.p(this.bgPopupLayer.getContentSize().width/2, (40 + 15)*this.scale_), BUTTON_TAG_POPUP.btn_popup_1, text_btn_popup_1);
        this.createRect(this.bgPopupLayer, cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 40 + 30)*this.scale_), BUTTON_TAG_POPUP.btn_popup_2, text_btn_popup_2);

        var labelDes = new cc.LabelTTF(message, "YK", 35*this.scale_, cc.size(this.bgPopupLayer.getContentSize().width - 40*this.scale_, 90*this.scale_), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        labelDes.setPosition(cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 80 + 30 + 15 + 40)*this.scale_));
        this.bgPopupLayer.addChild(labelDes);

        var labelTitle = new cc.LabelTTF(title, "YK", 60*this.scale_);
        labelTitle.setPosition(cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 80 + 30 + 15 + 45)*this.scale_ + labelTitle.getContentSize().height));
        this.bgPopupLayer.addChild(labelTitle);

        var color = cc.color(255, 255, 255, 255);
        var draw = new cc.DrawNode();
        draw.setAnchorPoint(cc.p(0.5, 0.5));
        draw.drawRect(cc.p(0, this.bgPopupLayer.getContentSize().height), cc.p(this.bgPopupLayer.getContentSize().width, 0), null, 2*this.scale_, color);
        this.bgPopupLayer.addChild(draw);

        var btn_close = new ccui.Button(res.btn_close_press, res.btn_close);
        btn_close.setScale(this.scale_, this.scale_);
        btn_close.setPosition(cc.p(this.bgPopupLayer.getContentSize().width, this.bgPopupLayer.getContentSize().height));
        btn_close.setTag(BUTTON_TAG_MENU.btn_close_);
        btn_close.addTouchEventListener(this.btnCloseTouchEvent, this);
        this.bgPopupLayer.addChild(btn_close);
    },
    createRect:function(parent, pos, tag, text){

        var color = cc.color(255, 255, 255, 255);
        var btnWidth = 520*this.scale_;
        var draw = new cc.DrawNode();
        draw.setAnchorPoint(cc.p(0.5, 0.5));
        draw.drawRect(cc.p(pos.x - btnWidth/2, pos.y - 80/2*this.scale_), cc.p(pos.x + btnWidth/2, pos.y + 80/2*this.scale_), null, 2*this.scale_, color);
        parent.addChild(draw);

        var btn = new ccui.Button(res.pixel_png, res.pixel_png);
        btn.setScale(btnWidth + this.scale_, (80 + 1)*this.scale_);
        btn.setColor(color);
        btn.setOpacity(0);
        btn.setPosition(pos);
        btn.setTag(tag);
        btn.addTouchEventListener(this.btnPopupTouchEvent, this);
        parent.addChild(btn);

        var label = new cc.LabelTTF(text, "YK", 50*this.scale_);
        label.setPosition(pos);
        parent.addChild(label);
        this.listLabel.push(label);

        if(this.popupType == POPUP_TYPE_MENU.like){
            btn.setOpacity(255);
            if(tag == BUTTON_TAG_POPUP.btn_popup_2)//fb
                label.setColor(cc.color(59, 89, 152));
            else//tw
                label.setColor(cc.color(0, 172, 237));
        }
    },
    closePopup:function(){
        this.isPopupShowing = false;
        this.bgPopupLayer.removeAllChildren();
        this.bgPopupLayer.setVisible(false);
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});