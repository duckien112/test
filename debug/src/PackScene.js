/**
 * Created by Kien on 3/20/2016.
 */


var BUTTON_TAG_PACK = {
    btn_back_ : 0,
    btn_close_ : 1
};

var PackLayer = cc.Layer.extend({
    scale_: 0,
    iColor: 0,
    listLabel:null,
    listLabelPopup:null,
    listLockStatus:null,
    isPopupShowing:false,
    bgPopupLayer:null,
	bgLoading:null,
    isPurchasing:false,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        thiz = this;
        this.listLabel = [];
        this.listLockStatus = [];

        /*var bgLayer = new cc.LayerColor(cc.color(0, 255, 255, 180));
         this.addChild(bgLayer);*/

        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if(keyCode == cc.KEY.back){
					cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                    if(thiz.isPopupShowing){
                        thiz.closePopup();
                    } else {
                        cc.director.runScene(new MenuScene());
                    }
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);

        if(cc.sys.isNative){
            g_iap_price = JSON.parse('{"pack":"$4.99"}');
            sdkbox.IAP.refresh();
            sdkbox.IAP.setListener({
                onSuccess : function (product) {
                    //Purchase success
                    if(product.name == "pack"){
                        var unlockPack = parseInt(rms.getItem(KEY_UNLOCK_PACK, UNLOCK_PACK_DEFAULT));
                        rms.setItem(KEY_UNLOCK_PACK, unlockPack + 1);
                        cc.director.runScene(new PackScene());
                    }
                },
                onFailure : function (product, msg) {
                    //Purchase failed
                    //msg is the error message
                    cc.log("onFailure");
					thiz.closeLoading();
                    thiz.createPopupMessage(g_text.text_unlock.replace("#pack", g_pack_data[parseInt(rms.getItem(KEY_UNLOCK_PACK, UNLOCK_PACK_DEFAULT)) + 1].name), g_text.msg_purchase_fail);
                },
                onCanceled : function (product) {
                    //Purchase was canceled by user
                    cc.log("onCanceled");
					thiz.closeLoading();
                    thiz.createPopupMessage(g_text.text_unlock.replace("#pack", g_pack_data[parseInt(rms.getItem(KEY_UNLOCK_PACK, UNLOCK_PACK_DEFAULT)) + 1].name), g_text.msg_purchase_fail);
                },
                onRestored : function (product) {
                    //Purchase restored
                },
                onProductRequestSuccess : function (products) {
                    //Returns you the data for all the iap products
                    //You can get each item using following method
                    cc.log("onProductRequestSuccess");
                    var text = "{"
                    for (var i = 0; i < products.length; i++) {
                        // loop
                        if(products[i].name == "pack"){
                            text += '"pack":"' + products[i].price + '"';
                        }
                    }
                    text += "}";
                    g_iap_price = JSON.parse(text);
                },
                onProductRequestFailure : function (msg) {
                    //When product refresh request fails.
                }
            });
        }

        size = cc.winSize;
        cc.log("w: %d", size.width);
        this.scale_ = size.width/DESIGN_WIDTH;

        this.bgPopupLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
        this.addChild(this.bgPopupLayer, 3);
        this.bgPopupLayer.setVisible(false);
		
		this.bgLoading = new cc.LayerColor(cc.color(0, 0, 0, 150));
        this.addChild(this.bgLoading, 3);
        this.bgLoading.setVisible(false);

        var btn_back = new ccui.Button(res.btn_back, res.btn_back_press);
        var topY = size.height - (btn_back.getContentSize().width/2 + 10)*this.scale_;
        btn_back.setScale(this.scale_);
        btn_back.setPosition(cc.p((btn_back.getContentSize().width/2 + 10)*this.scale_, topY));
        btn_back.setTag(BUTTON_TAG_PACK.btn_back_);
        btn_back.addTouchEventListener(this.btnUITouchEvent, this);
        this.addChild(btn_back, 1);

        this.iColor = getRandomInt(0, titleColor.length - 1)
        //var labelPack = new cc.LabelTTF(g_text.text_level, "YK", 120*this.scale_);
        var labelPack = new cc.LabelTTF("0", "YK", 120*this.scale_);
        labelPack.setAnchorPoint(cc.p(0.5, 1));
        labelPack.setPosition(cc.p(size.width/2, size.height - 10*this.scale_));
        labelPack.setColor(titleColor[this.iColor]);
        this.addChild(labelPack);

        // Create the list view
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(size.width, size.height - 200*this.scale_));
        listView.x = 0;
        listView.y = 0;
        //listView.addEventListener(this.selectedItemEvent, this);
        this.addChild(listView);

        // add custom item
        for (var i = 0; i < g_pack_num.length; ++i) {
            var item = new ccui.Layout();
            item.setContentSize(cc.size(size.width, 150*this.scale_));
            item.width = listView.width;


            var btn = new ccui.Button(res.pixel_png, res.pixel_png);
            btn.setTouchEnabled(true);
            btn.setScale(size.width, 150*this.scale_);
            btn.setOpacity(0);
            btn.setTag(i);
            btn.setPosition(cc.p(item.width/2, item.height/2));
            btn.addTouchEventListener(this.btnTouchEvent, this);
            item.addChild(btn);

            var fontSize = 50*this.scale_;
                                
            var labelPackName = new cc.LabelTTF(g_pack_data[i].name, "YK", fontSize);
            labelPackName.setAnchorPoint(cc.p(0, 1));
            labelPackName.setColor(titleColor[(this.iColor + 1 + i) % titleColor.length]);
            labelPackName.setPosition(cc.p(12*this.scale_, item.height));
            item.addChild(labelPackName);
            this.listLabel.push(labelPackName);

            var labelPackDes = new cc.LabelTTF(g_pack_data[i].des, "YK", 35*this.scale_);
            labelPackDes.setAnchorPoint(cc.p(0, 1));
            labelPackDes.setColor(cc.color(128, 128, 128, 255));
            labelPackDes.setPosition(cc.p(12*this.scale_, 85*this.scale_));
            item.addChild(labelPackDes);

            var isLockedPack = false;//isLockPack(i);
            this.listLockStatus.push(isLockedPack);

            var labelPackLevel = new cc.LabelTTF(g_pack_num[i], "YK", fontSize);
            labelPackLevel.setAnchorPoint(cc.p(1, 1));
            labelPackLevel.setColor(cc.color(128, 128, 128, 255));
            labelPackLevel.setPosition(cc.p(size.width - 12*this.scale_, item.height));
            item.addChild(labelPackLevel);

            if(isLockedPack){
                labelPackLevel.setString(g_text.text_lock);
                labelPackLevel.setColor(cc.color(255, 255, 255, 255));
            } else {
                var labelPackCenter = new cc.LabelTTF("/", "YK", 55*this.scale_);
                labelPackCenter.setAnchorPoint(cc.p(1, 1));
                labelPackCenter.setColor(cc.color(128, 128, 128, 255));
                labelPackCenter.setPosition(cc.p(size.width - 100*this.scale_ - 12*this.scale_, item.height));
                item.addChild(labelPackCenter);

                var labelPackUnlock = new cc.LabelTTF(rms.getItem(KEY_UNLOCK_LEVEL + i + "_" + 0, UNLOCK_DEFAULT) + "", "YK", 55*this.scale_);
                labelPackUnlock.setAnchorPoint(cc.p(1, 1));
                labelPackUnlock.setColor(cc.color(128, 128, 128, 255));
                labelPackUnlock.setPosition(cc.p(size.width - 130*this.scale_ - 12*this.scale_, item.height));
                item.addChild(labelPackUnlock);
            }

            listView.pushBackCustomItem(item);
        }

        var itemTmp = new ccui.Layout();
        itemTmp.setContentSize(cc.size(size.width, 150*this.scale_));
        itemTmp.width = listView.width;
        listView.pushBackCustomItem(itemTmp);

        // set all items layout gravity
        listView.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);

        return true;
    },
    btnTouchEvent:function(sender, type){
        if(this.isPopupShowing) return;
		if(this.isPurchasing) return;
        var pack = sender.getTag();
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                var iColor = getRandomInt(0, titleColor.length - 1);
                this.listLabel[pack].setColor(cc.color(255, 255, 255, 255));
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setOpacity(0);
                this.listLabel[pack].setColor(titleColor[(this.iColor + 1 + pack) % titleColor.length]);
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                cc.log("press: " + sender.getTag());
                this.listLabel[pack].setColor(titleColor[(this.iColor + 1 + pack) % titleColor.length]);

                if(this.listLockStatus[pack]){
                    var title = g_text.text_lock, message = g_text.msg_lock,
                        text_btn_popup_1 = g_text.text_unlock.replace("#pack", g_pack_data[parseInt(rms.getItem(KEY_UNLOCK_PACK, UNLOCK_PACK_DEFAULT)) + 1].name), text_btn_popup_2 = g_text.text_ok;
                    this.createPopup(title, message, text_btn_popup_1, text_btn_popup_2);

                } else{
                    g_pack = pack; g_pack_sub = 0;
                    cc.loader.loadTxt("res/level/" + g_pack + "_" + g_pack_sub, function(error, data){
                         g_levelData = data.split(/\n/);
                         g_levelData.splice(g_levelData.length - 1, 1);
                         g_numLevel = g_levelData.length;
                         cc.log("g_numLevel: " + g_numLevel);
                         g_numPage = g_levelData.length/30;
                         cc.log("g_numPage: " + g_numPage);
                        cc.director.pushScene(new LevelScene());
                     });
                }
                break;
        };
    },
    btnPopupTouchEvent:function(sender, type){
        var tag = sender.getTag();
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                sender.setOpacity(255);
                this.listLabelPopup[tag].setColor(cc.color(0, 0, 0, 255));
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setOpacity(0);
                this.listLabelPopup[tag].setColor(cc.color(255, 255, 255, 255));
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                sender.setOpacity(0);
                this.listLabelPopup[tag].setColor(cc.color(255, 255, 255, 255));
                this.closePopup();
                switch (tag){
                    case BUTTON_TAG_POPUP.btn_popup_1:
                        if(cc.sys.isNative){
							this.loadingIAPP();							
                            sdkbox.IAP.purchase("pack");
						}
                        break;
                };
                break;
        };
    },
	loadingIAPP:function(){
        this.isPurchasing = true;
        var loadingSprite = new cc.Sprite(res.img_loading_png);
        loadingSprite.setScale(this.scale_);
        loadingSprite.setPosition(cc.p(size.width/2, size.height/2));
        loadingSprite.runAction(cc.rotateBy(1, 360).repeatForever());

        this.bgLoading.setVisible(true);
        this.bgLoading.addChild(loadingSprite);
    },
    closeLoading:function(){
        this.isPurchasing = false;
        this.bgLoading.removeAllChildren();
        this.bgLoading.setVisible(false);
    },
    createPopup:function(title, message, text_btn_popup_1, text_btn_popup_2){
        this.isPopupShowing = true;

        this.bgPopupLayer.setVisible(true);
        this.bgPopupLayer.setContentSize(cc.size(550*this.scale_, 365*this.scale_));
        var pos = cc.p((size.width - this.bgPopupLayer.getContentSize().width)/2, (size.height - this.bgPopupLayer.getContentSize().height)/2);
        this.bgPopupLayer.setPosition(pos);
        this.listLabelPopup = [];
        this.createRect(this.bgPopupLayer, cc.p(this.bgPopupLayer.getContentSize().width/2, (40 + 15)*this.scale_), BUTTON_TAG_POPUP.btn_popup_1, text_btn_popup_1, g_iap_price.pack);
        this.createRect(this.bgPopupLayer, cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 40 + 30)*this.scale_), BUTTON_TAG_POPUP.btn_popup_2, text_btn_popup_2, null);

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
        btn_close.setTag(BUTTON_TAG_PACK.btn_close_);
        btn_close.addTouchEventListener(this.btnUITouchEvent, this);
        this.bgPopupLayer.addChild(btn_close);
    },
    createRect:function(parent, pos, tag, text, textPrice){

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
        this.listLabelPopup.push(label);

        if(textPrice != null) {
            label.setAnchorPoint(cc.p(0, 0.5));
            label.setFontSize(40*this.scale_);
            label.setPosition(cc.p(pos.x - btnWidth/2 + 10*this.scale_, pos.y));

            var labelPrice = new cc.LabelTTF(textPrice, "YK", 30 * this.scale_);
            labelPrice.setColor(cc.color(128, 128, 128));
            labelPrice.setAnchorPoint(cc.p(1, 0.5));
            labelPrice.setPosition(cc.p(pos.x + btnWidth / 2 - 10 * this.scale_, pos.y));
            parent.addChild(labelPrice);
        }
    },
    createPopupMessage:function(title, message){
        this.isPopupShowing = true;

        this.bgPopupLayer.setVisible(true);
        this.bgPopupLayer.setContentSize(cc.size(550*this.scale_, 300*this.scale_));
        var pos = cc.p((size.width - this.bgPopupLayer.getContentSize().width)/2, (size.height - this.bgPopupLayer.getContentSize().height)/2);
        this.bgPopupLayer.setPosition(pos);

        var labelDes = new cc.LabelTTF(message, "YK", 35*this.scale_, cc.size(this.bgPopupLayer.getContentSize().width - 40*this.scale_, 200*this.scale_), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        labelDes.setPosition(cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 40)*this.scale_));
        this.bgPopupLayer.addChild(labelDes);

        var labelTitle = new cc.LabelTTF(title, "YK", 50*this.scale_);
        labelTitle.setPosition(cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 40 + 40)*this.scale_ + labelTitle.getContentSize().height + 15*this.scale_));
        this.bgPopupLayer.addChild(labelTitle);

        var color = cc.color(255, 255, 255, 255);
        var draw = new cc.DrawNode();
        draw.setAnchorPoint(cc.p(0.5, 0.5));
        draw.drawRect(cc.p(0, this.bgPopupLayer.getContentSize().height), cc.p(this.bgPopupLayer.getContentSize().width, 0), null, 2*this.scale_, color);
        this.bgPopupLayer.addChild(draw);

        var btn_close = new ccui.Button(res.btn_close_press, res.btn_close);
        btn_close.setScale(this.scale_, this.scale_);
        btn_close.setPosition(cc.p(this.bgPopupLayer.getContentSize().width, this.bgPopupLayer.getContentSize().height));
        btn_close.setTag(BUTTON_TAG_PACK.btn_close_);
        btn_close.addTouchEventListener(this.btnUITouchEvent, this);
        this.bgPopupLayer.addChild(btn_close);
    },
    btnUITouchEvent:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
		if(this.isPurchasing) return;
        cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
        switch (sender.getTag()) {
            case BUTTON_TAG_PACK.btn_back_:
                cc.director.runScene(new MenuScene());
                break;
            case BUTTON_TAG_PACK.btn_close_:
                this.closePopup();
                break;
        }
    },
    closePopup:function(){
        this.isPopupShowing = false;
        this.bgPopupLayer.removeAllChildren();
        this.bgPopupLayer.setVisible(false);
    }
});

var PackScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PackLayer();
        this.addChild(layer);
    }
});