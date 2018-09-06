/**
 * Created by Kien on 3/20/2016.
 */


var BUTTON_TAG_LANGUAGE = {
    btn_ok_ : 0
};

var LanguageLayer = cc.Layer.extend({
    scale_: 0,
    iColor: 0,
    listLabel:null,
    labelOK:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        thiz = this;
        this.listLabel = [];

        /*var bgLayer = new cc.LayerColor(cc.color(0, 255, 255, 180));
         this.addChild(bgLayer);*/

        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if(keyCode == cc.KEY.back){
					cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                    cc.director.end();
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);

        size = cc.winSize;
        cc.log("w: %d", size.width);
        this.scale_ = size.width/DESIGN_WIDTH;

        g_lang = rms.getItem(KEY_LANG, 0); // English is default

        var btnWidth = 520*this.scale_;
        var btnHeight = 80*this.scale_;

        var pos = cc.p(size.width/2, 120*this.scale_);

        /*var draw = new cc.DrawNode();
        draw.setAnchorPoint(cc.p(0.5, 0.5));
        draw.drawRect(cc.p(pos.x - btnWidth/2, pos.y - btnHeight/2), cc.p(pos.x + btnWidth/2, pos.y + btnHeight/2), null, 2*this.scale_, cc.color(255, 255, 255, 255));
        this.addChild(draw);

        var btn = new ccui.Button(res.pixel_png, res.pixel_png);
        btn.setScale(btnWidth + this.scale_, btnHeight + this.scale_);
        btn.setOpacity(0);
        btn.setPosition(pos);
        btn.setTag(BUTTON_TAG_LANGUAGE.btn_ok_);
        btn.addTouchEventListener(this.btnUITouchEvent, this);
        this.addChild(btn);

        this.labelOK = new cc.LabelTTF(g_text[g_lang].text_ok, "YK", 50*this.scale_);
        this.labelOK.setPosition(pos);
        this.labelOK.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.labelOK);*/

        this.iColor = getRandomInt(0, titleColor.length - 1);
        /*var labelLanguage = new cc.LabelTTF(g_text[g_lang].text_lang, "YK", 120*this.scale_);
        labelLanguage.setAnchorPoint(cc.p(0.5, 1));
        labelLanguage.setPosition(cc.p(size.width/2, size.height - 10*this.scale_));
        labelLanguage.setColor(titleColor[this.iColor]);
        this.addChild(labelLanguage);*/

        // Create the list view
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(size.width, size.height - 360*this.scale_));
        listView.x = 0;
        listView.y = pos.y + btnHeight/2;
        //listView.addEventListener(this.selectedItemEvent, this);
        this.addChild(listView);

        // add custom item
        for (var i = 0; i < g_support_langs.length; ++i) {

            var item = new ccui.Layout();
            item.setContentSize(cc.size(size.width, 150*this.scale_));
            item.width = listView.width;

            var pos = cc.p(item.width/2, item.height/2);

            var draw = new cc.DrawNode();
            draw.setAnchorPoint(cc.p(0.5, 0.5));
            draw.drawRect(cc.p(pos.x - btnWidth/2, pos.y - btnHeight/2), cc.p(pos.x + btnWidth/2, pos.y + btnHeight/2), null, 2*this.scale_, cc.color(255, 255, 255, 255));
            item.addChild(draw);

            var btn = new ccui.Button(res.pixel_png, res.pixel_png);
            btn.setScale(btnWidth + this.scale_, btnHeight + this.scale_);
            btn.setOpacity(0);
            btn.setPosition(pos);
            btn.setTag(i);
            btn.addTouchEventListener(this.btnTouchEvent, this);
            item.addChild(btn);

            var label = new cc.LabelTTF(g_support_langs[i], "YK", 50*this.scale_);
            label.setPosition(pos);
            label.setColor(titleColor[(this.iColor + 1 + i) % titleColor.length]);
            item.addChild(label);
            this.listLabel.push(label);

            listView.pushBackCustomItem(item);
        }

        // set all items layout gravity
        //listView.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);

        return true;
    },
    btnTouchEvent:function(sender, type){
        var lang = sender.getTag();
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                //this.listLabel[lang].setColor(cc.color(255, 255, 255, 255));
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setOpacity(0);
                this.listLabel[lang].setColor(titleColor[(this.iColor + 1 + lang) % titleColor.length]);
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                cc.log("press: " + sender.getTag());
                for(var i = 0; i < g_support_langs.length; i++)
                    this.listLabel[i].setColor(titleColor[(this.iColor + 1 + i) % titleColor.length]);
                this.listLabel[lang].setColor(cc.color(255, 255, 255, 255));
                g_lang = lang;
				cc.log("g_lang: " + g_lang);
                cc.loader.loadJson("res/text/" + g_lang,function(error, data){
                    g_text = data;
                    g_pack_data = data.pack_data;
                    cc.director.runScene(new MenuScene());
                });
                break;
        };
    },
    btnUITouchEvent:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;

        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                this.labelOK.setColor(cc.color(0, 0, 0, 255));
                sender.setOpacity(255);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setOpacity(0);
                this.labelOK.setColor(titleColor[(this.iColor + 1 + lang) % titleColor.length]);
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                switch (sender.getTag()) {
                    case BUTTON_TAG_PACK.btn_back_:
                        cc.director.runScene(new MenuScene());
                        break;
                }
                sender.setOpacity(0);
                this.labelOK.setColor(cc.color(255, 255, 255, 255));

                break;
        };
    }
});

var LanguageScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LanguageLayer();
        this.addChild(layer);
    }
});