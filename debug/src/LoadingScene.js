var LoadingLayer = cc.Layer.extend({
    arrStatus:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        thiz = this;

        initSdkBoxPlugin();

        this.arrStatus = [false, false];

        cc.loader.loadJson("res/text/langs",function(error, data){
            g_support_langs = data;
            thiz.arrStatus[0] = true;
        });

        cc.loader.loadJson("res/level/num",function(error, data){
            g_pack_num = data
            thiz.arrStatus[1] = true;
        });

        this.schedule(this.checkLoadStatus);

        return true;
    },
    checkLoadStatus:function(){
        var isLoaded = true;
        for(var i = 0; i < this.arrStatus.length; i++)
            if(!this.arrStatus[i]){
                isLoaded = false;
                break;
            }
        if(isLoaded)
            cc.director.runScene(new LanguageScene());
    }
});

var LoadingScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LoadingLayer();
        this.addChild(layer);
    }
});