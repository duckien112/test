/**
 * Created by Kien on 2/3/2016.
 */

var BUTTON_TAG_GAME = {
    btn_back_level_ : 0,
    btn_close_ : 1,
    btn_hint_ : 2,
    btn_next_ : 3,
    //btn_pause_ : 4,
    btn_restart_ : 5,
    btn_settings_ : 6,
    btn_back_ : 7
};

var POPUP_TYPE = {
    level_complete: 0,
    message: 1,
    pack_complete: 2,
    iapp: 3
};

var GameLayer = cc.Layer.extend({
	size:null,
	isValidTouch:false,
    boardDrawNode:null,
    hintsDrawNode:null,
    numSize:0,
    tileSize:0,
    startX:0,
    startY:0,
    currentLevel:0,
    hintSprite:null,
    prePos:null,
    pathLines:null,
    pathPos:null,
    pathPosTarget:null,
    pathPosHints:null,
    pathPosHintsIndex:null,
    currentColorLine:0,
    stepSoundMove:1,
    unlockLevel:0,
    boardNode:null,
    isGuide:false,
    guideStep:0,
    guideHintIndex:0,
    guideSprite:null,
    btn_next:null,
    btn_back_level:null,
    btn_hint:null,
    labelPack:null,
    labelLevel:null,
    isPressHint:false,
    numAsk:0,
    numAskTarget:0,
    scale_:0,
    bgPopupLayer:null,
    bgLoading:null,
    listLabel:null,
    popupType: 0,
    g_song: 0,
    timerBar: null,
    runningTime: 0,
    isStarted:false,
    isUseTimer:false,
    topY:0,
    bottomLayout:null,
    imgSharePath:null,
    isPopupShowing:false,
    isPurchasing:false,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        thiz = this;

        isResetTime = true;

        this.unlockLevel = rms.getItem(KEY_UNLOCK_LEVEL + g_pack + "_" + g_pack_sub, UNLOCK_DEFAULT);

        g_hint = rms.getItem(KEY_HINT, HINT_DEFAULT);

        this.currentColorLine = getRandomInt(0, rainbowColor.length - 1);        

        // set background color
        var bgLayer = new cc.LayerColor(cc.color(0, 0, 0, 255));
        this.addChild(bgLayer);

        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if(keyCode == cc.KEY.back){
					cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
                    if(thiz.isPopupShowing){
                        thiz.closePopup();
                    } else {
                        cc.director.runScene(new LevelScene());
                    }
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return thiz._onTouchBegan(touch, event);
            },
            onTouchMoved: function (touch, event) {
                thiz._onTouchMoved(touch, event);
            },
            onTouchEnded: function (touch, event) {
                thiz._onTouchEnded(touch, event);
            }
        });
        cc.eventManager.addListener(listener, this);
        if(cc.sys.isNative){
            g_iap_price = JSON.parse('{"hints30":"$2.99", "hints5":"$0.99"}');
            sdkbox.IAP.refresh();
            sdkbox.IAP.setListener({
               onSuccess : function (product) {
                   //Purchase success
                   if(product.name == "30hints"){
                        g_hint += 30;

                   } else if(product.name == "5hints"){
                        g_hint += 5;
                   }
                   thiz.closeLoading();
                   thiz.showHint();
               },
               onFailure : function (product, msg) {
                    //Purchase failed
                    //msg is the error message
                    cc.log("onFailure");
                    thiz.closeLoading();
                    thiz.createPopupMessage(g_text.text_hint, g_text.msg_purchase_fail);
               },
               onCanceled : function (product) {
                   //Purchase was canceled by user
                   cc.log("onCanceled");
                   thiz.closeLoading();
                   thiz.createPopupMessage(g_text.text_hint, g_text.msg_purchase_fail);
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
                       if(products[i].name == "30hints"){
                           text += '"hints30":"' + products[i].price + '", ';
                       } else if(products[i].name == "5hints"){
                           text += '"hints5":"' + products[i].price + '", ';
                       }
                   }
                   text += "}";
                   g_iap_price = JSON.parse(text.replace('", }', '" }'));
               },
               onProductRequestFailure : function (msg) {
                    //When product refresh request fails.
                    g_iap_price = JSON.parse('{"hints30":"$2.99", "hints5":"$0.99"}');
               }
            });
            
			sdkbox.PluginChartboost.setListener({
				onChartboostCached : function (name) {
					cc.log("onChartboostCached " + name)
				},
				onChartboostShouldDisplay : function (name) {
					cc.log("onChartboostShouldDisplay " + name)
				},
				onChartboostDisplay : function (name) {
					cc.log("onChartboostDisplay " + name)
				},
				onChartboostDismiss : function (name) {
					cc.log("onChartboostDismiss " + name)
				},
				onChartboostClose : function (name) {
					cc.log("onChartboostClose " + name)
				},
				onChartboostClick : function (name) {
					cc.log("onChartboostClick " + name)
				},
				onChartboostReward : function (name, reward) {
					cc.log("onChartboostReward " + name + " reward " + reward)
				},
				onChartboostFailedToLoad : function (name, e) {
					cc.log("onChartboostFailedToLoad " + name + " load error " + e)
				},
				onChartboostFailToRecordClick : function (name, e) {
					cc.log("onChartboostFailToRecordClick " + name + " click error " + e)
				},
				onChartboostConfirmation : function () {
					cc.log("onChartboostConfirmation")
				},
				onChartboostCompleteStore : function () {
					cc.log("onChartboostCompleteStore")
				}
			});
			sdkbox.PluginAdColony.setListener({
				onAdColonyChange : function (data, available) {
					// Called when AdColony finish loading
					cc.log("onAdColonyChange");
				},
				onAdColonyReward : function (data, currencyName, amount, success) {
					// Called when AdColony v4vc ad finish playing
					cc.log("onAdColonyReward");
				},
				onAdColonyStarted : function (data) {
					// Called when ad starts playing
					cc.log("onAdColonyStarted");
				},
				onAdColonyFinished : function (data) {
					// Called when an ad finish displaying
					cc.log("onAdColonyFinished");
					cc.log(JSON.stringify(data));
					if(data.name == "hint_reward" && data.shown){
						g_hint += 1;
						thiz.showHint();
					}
				}
			});
			cc.log("sdkbox.PluginFacebook.setListener");
			sdkbox.PluginFacebook.setListener({
				onLogin: function(isLogin, msg) {
				  if(isLogin){
					cc.log("login successful");
					requestInviteFbWithIds();
				  }
				  else {
					cc.log("login failed");
				  }
				},
				onAPI: function(tag, data) {
				  cc.log("============");
				  cc.log("tag=%s", tag);
				  cc.log("data=%s", data);
					if (tag == "/me/invitable_friends") {
						var obj = JSON.parse(data);
						var friends = obj.data;
						var listFriendsId = [];
						for (var i = 0; i < friends.length; i++) {						  
						  listFriendsId.push(friends[i].id);
						}
						sdkbox.PluginFacebook.inviteFriendsWithInviteIds(listFriendsId, "Invite friends", "YK Puzzle - The combination of puzzle and music, science and romance.");
					}			  
				},
				onSharedSuccess: function(data) {
					cc.log("share successful");
					g_hint += 1;
					thiz.showHint();
					//thiz.labelHintNum.setString("" + g_hint);
					if (cc.sys.os != cc.sys.OS_IOS) isInviteGetHint = !isInviteGetHint;
				},
				onSharedFailed: function(data) {
				  cc.log("share failed");
				},
				onSharedCancel: function() {
				  cc.log("share canceled");
				},
				onPermission: function(isLogin, msg) {
				  if(isLogin) {
					cc.log("request permission successful");
				  }
				  else {
					cc.log("request permission failed");
				  }
				},
				onFetchFriends: function(ok, msg) {
				  cc.log(ok + ":" +JSON.stringify(msg) + "onFetchFriends");
				},
				onRequestInvitableFriends: function(friends){
					cc.log("onRequestInvitableFriends: %s", JSON.stringify(friends));
				},
				onInviteFriendsWithInviteIdsResult: function(result, msg){
					cc.log("onInviteFriendsWithInviteIdsResult: %s, msg: %s", JSON.stringify(result), JSON.stringify(msg));
					if(JSON.stringify(result) == "true"){
						cc.log("onInviteFriendsWithInviteIdsResult ok");
						g_hint += 1;
						//thiz.showHint();
						thiz.labelHintNum.setString("" + g_hint);
						thiz.btn_hint.runAction(cc.blink(1, 2));
						thiz.scheduleOnce(thiz.runBtnHintDone, 1.5);
						if (cc.sys.os != cc.sys.OS_IOS) isInviteGetHint = !isInviteGetHint;
					}
				},
				onInviteFriendsResult: function(result, msg){
					cc.log("onInviteFriendsResult: %s, msg: %s", JSON.stringify(result), JSON.stringify(msg));
				}
			});
        }
		this.size = cc.winSize;
        cc.log("w: %d", this.size.width);
        this.scale_ = this.size.width/DESIGN_WIDTH;
		
        this.hintSprite = new cc.DrawNode();
        this.hintSprite.setPosition(cc.p(-100*this.scale_, -100*this.scale_));
        this.addChild(this.hintSprite, 10);
        this.hintSprite.drawDot(cc.p(0, 0), 100*this.scale_, cc.color(255, 255, 255, 150));

        var btnScale = 0.8;
                                
        this.bottomLayout = new ccui.Layout();
        this.bottomLayout.setContentSize(cc.size(this.size.width, 70*this.scale_*btnScale));
        if(cc.sys.isNative){
            var h = sdkbox.PluginAdMob.getCurrBannerHeight();
            if(h < 100) h = 100;
            this.bottomLayout.setPositionY(h);
        }
        this.addChild(this.bottomLayout);
                                
        var btn_restart = new ccui.Button(res.btn_restart, res.btn_restart_press);
        var posYBtn = this.bottomLayout.getContentSize().height/2;
        btn_restart.setPosition(cc.p(this.size.width / 2, posYBtn));
        btn_restart.setScale(this.scale_*btnScale);
        btn_restart.setTag(BUTTON_TAG_GAME.btn_restart_);
        btn_restart.addTouchEventListener(this.btnTouchEvent, this);
        this.bottomLayout.addChild(btn_restart);

        var posXOffset = 36*this.scale_;
        this.btn_next = new ccui.Button(res.btn_next, res.btn_next_press);
        this.btn_next.setPosition(cc.p(this.size.width / 2 + btn_restart.getContentSize().width*this.scale_ + posXOffset, posYBtn));
        this.btn_next.setScale(this.scale_*btnScale);
        this.btn_next.setTag(BUTTON_TAG_GAME.btn_next_);
        this.btn_next.addTouchEventListener(this.btnTouchEvent, this);
        this.bottomLayout.addChild(this.btn_next);

        this.btn_hint = new ccui.Button(res.btn_hint, res.btn_hint_press);
        var posYHint = this.size.height / 2 + this.btn_hint.getContentSize().height*this.scale_/2 + this.size.width/2 + 10*this.scale_;
        this.btn_hint.setPosition(cc.p(this.size.width - this.btn_hint.getContentSize().width*this.scale_/2, posYHint));
        this.btn_hint.setScale(this.scale_);
        this.btn_hint.setTag(BUTTON_TAG_GAME.btn_hint_);
        this.btn_hint.addTouchEventListener(this.btnTouchEvent, this);
        this.addChild(this.btn_hint);

        this.labelHintNum = new cc.LabelTTF(g_hint, "YK", 45*this.scale_);
        this.labelHintNum.setAnchorPoint(cc.p(1, 0.5));
        this.labelHintNum.setPosition(cc.p(this.btn_hint.getPositionX()  - (this.btn_hint.getContentSize().width/2 + 10)*this.scale_, posYHint));
        this.addChild(this.labelHintNum);

        this.btn_back_level = new ccui.Button(res.btn_back, res.btn_back_press);
        this.btn_back_level.setPosition(cc.p(this.size.width / 2 - btn_restart.getContentSize().width*this.scale_ - posXOffset, posYBtn));
        this.btn_back_level.setScale(this.scale_*btnScale);
        this.btn_back_level.setTag(BUTTON_TAG_GAME.btn_back_level_);
        this.btn_back_level.addTouchEventListener(this.btnTouchEvent, this);
        this.bottomLayout.addChild(this.btn_back_level);

        var btn_back = new ccui.Button(res.btn_back, res.btn_back_press);
        this.topY = this.size.height - (btn_back.getContentSize().width/2 + 10)*this.scale_;
        btn_back.setPosition(cc.p((btn_back.getContentSize().width/2 + 10)*this.scale_, this.topY));
        btn_back.setScale(this.scale_);
        btn_back.setTag(BUTTON_TAG_GAME.btn_back_);
        btn_back.addTouchEventListener(this.btnTouchEvent, this);
        this.addChild(btn_back);

        var labelColorIndex = getRandomInt(0, titleColor.length - 1)
        this.labelPack = new cc.LabelTTF(g_pack_data[g_pack].name, "YK", 40*this.scale_);
        this.labelPack.setAnchorPoint(cc.p(0, 0.5));
        this.labelPack.setPosition(cc.p(btn_back.getPositionX() + (btn_back.getContentSize().width/2 + 10)*this.scale_, this.topY));
        this.labelPack.setColor(titleColor[labelColorIndex]);
        this.addChild(this.labelPack);

        if(labelColorIndex == titleColor.length - 1) labelColorIndex = -1;
        this.labelLevel = new cc.LabelTTF("0", "YK", 40*this.scale_);
        this.labelLevel.setAnchorPoint(cc.p(0, 0.5));
        this.labelLevel.setPosition(cc.p(this.labelPack.getPositionX() + this.labelPack.getContentSize().width + 12*this.scale_, this.topY));
        //this.labelLevel.setColor(cc.color(128, 128, 128, 255));
        this.addChild(this.labelLevel);

        this.bgPopupLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
        this.addChild(this.bgPopupLayer, 3);
        this.bgPopupLayer.setVisible(false);

        this.bgLoading = new cc.LayerColor(cc.color(0, 0, 0, 150));
        this.addChild(this.bgLoading, 3);
        this.bgLoading.setVisible(false);

        this.initBoard(g_level);

        return true;
    },
    initBoard:function(index){

        if(isResetTime){
            startTime = new Date();
            isResetTime = false;
        }

        this.currentSoundMove = 0;

        this.g_song = [];
        var indexSong = getRandomInt(0, 23);
        cc.loader.loadTxt("res/songs/" + indexSong, function(error, data){
            //cc.log(indexSong + ": " + data);
            var arrData = data.split(";");
            for(var i = 0; i < arrData.length; i++){
                var multiNote = arrData[i].split(",");
                thiz.g_song.push(multiNote);
            }
        });
        this.labelLevel.setString(g_text.text_level_game.replace("#level", g_level + 1));
        this.numAsk = 0;

        if(g_level == 0){
            this.btn_back_level.setTouchEnabled(false);
            this.btn_back_level.setColor(cc.color(128, 128, 128, 255));
        } else {
            this.btn_back_level.setTouchEnabled(true);
            this.btn_back_level.setColor(cc.color(255, 255, 255, 255));
        }

        if(g_level == this.unlockLevel || g_level == g_levelData.length - 1){
            this.btn_next.setTouchEnabled(false);
            this.btn_next.setColor(cc.color(128, 128, 128, 255));
        } else {
            this.btn_next.setTouchEnabled(true);
            this.btn_next.setColor(cc.color(255, 255, 255, 255));
        }

        if(this.pathLines != undefined)
            while(this.pathLines.length >0){
                this.pathLines[this.pathLines.length - 1].removeFromParent();
                this.pathLines.splice(this.pathLines.length - 1, 1);
            }
        this.pathLines = [];

        this.pathPos = [];

        this.pathPosTarget = [];

        this.pathPosHints = [];

        if(this.pathLabelHints != undefined)
            while(this.pathLabelHints.length >0){
                this.pathLabelHints[this.pathLabelHints.length - 1].removeFromParent();
                this.pathLabelHints.splice(this.pathLabelHints.length - 1, 1);
            }
        this.pathLabelHints = [];

        if(this.hintsDrawNode != undefined)
            this.hintsDrawNode.removeFromParent();

        var levelDataAt = g_levelData[index].substring(0, g_levelData[index].length - 1);

        this.numSize = Math.ceil(Math.sqrt(levelDataAt.length/2));
        this.numAskTarget = this.numSize*this.numSize;
        cc.log("numSize: " + this.numSize + ", g_level: " + g_level);

        levelDataAt = levelDataAt.split("").reverse().join("");
        if(g_level%2 == 0){
            for(var i = levelDataAt.length - 1; i >= 0; i = i - 2)
                this.pathPosTarget.push(this.getPosFromIndex(this.getIndexFromCode(levelDataAt.substring(i - 1, i + 1))));
        } else{
            for(var i = 0; i < levelDataAt.length; i = i + 2)
                this.pathPosTarget.push(this.getPosFromIndex(this.getIndexFromCode(levelDataAt.substring(i, i + 2))));
        }

        this.pathPos.push(this.pathPosTarget[0]);		

        this.tileSize = this.size.width / (this.numSize);
        cc.log("this.tileSize: %d", this.tileSize);
        this.startX = this.tileSize/2;
        this.startY = (this.size.height - this.size.width)/2 + this.startX;

        this.boardNode = new cc.LayerColor(cc.color(255, 255, 255, 0));
        this.boardNode.setAnchorPoint(cc.p(0.5, 0.5));
        this.boardNode.setPosition(cc.p(0, (this.size.height - this.size.width)/2));
        this.boardNode.setContentSize(cc.size(this.size.width, this.size.width));
        //this.boardNode.runAction(cc.sequence(cc.orbitCamera(1, 1, 0, 0, 360, 0, 0), cc.callFunc(this.moveDone, this)));
        //this.runAction(cc.waves( 1, cc.size(16,12), 4, 20, true, true));
        this.addChild(this.boardNode);

        if(this.boardDrawNode != undefined)
            this.boardDrawNode.removeFromParent();
        this.boardDrawNode  = new cc.DrawNode();
        this.boardNode.addChild(this.boardDrawNode, 1);
        var indexColor = getRandomInt(0, rainbowColor.length - 1);
        for(var i = 0; i < this.numSize + 1; i++){
            this.boardDrawNode.drawSegment( cc.p(this.scale_, /*this.startY - this.startX*/ + i*this.tileSize), cc.p(this.numSize*(this.tileSize), /*this.startY - this.startX*/ + i*this.tileSize), this.scale_, rainbowColor[indexColor]);
            this.boardDrawNode.drawSegment( cc.p(this.scale_ + i*(this.tileSize), /*this.startY - this.startX*/0), cc.p(this.scale_ + i*(this.tileSize), /*this.startY - this.startX*/ + this.numSize*this.tileSize), this.scale_, rainbowColor[indexColor]);
        }
        this.boardDrawNode.drawSegment( cc.p(this.numSize*(this.tileSize) - this.scale_, /*this.startY - this.startX*/0), cc.p(this.numSize*(this.tileSize) - this.scale_, /*this.startY - this.startX*/ + this.numSize*this.tileSize), this.scale_, rainbowColor[indexColor]);

        var i = 0;
        this.pathPosHintsIndex = [];
        while(i < this.numSize*this.numSize){
            this.pathPosHintsIndex.push(i);
            i = i + this.numSize - 1;
        }
        this.hintsDrawNode  = new cc.DrawNode();
        this.boardNode.addChild(this.hintsDrawNode, 2);
        var iColor = getRandomInt(0, rainbowColor.length - 1);
        for(var i = 0; i < this.pathPosHintsIndex.length; i++){
            iColor++;
            if(iColor >= rainbowColor.length) iColor = 0;
            if(iColor == 2) iColor++; // Avoid Yellow
            var pos = this.pathPosTarget[this.pathPosHintsIndex[i]];
            this.pathPosHints.push(pos);
            this.hintsDrawNode.drawDot(cc.p(this.startX + pos.x*this.tileSize, this.tileSize/2 + pos.y*this.tileSize), this.scale_*4*60/this.numSize, rainbowColor[iColor]);
            var label = new cc.LabelTTF(i + 1, "YK", this.scale_*3*120/this.numSize);
            //label.setColor(cc.color(0, 0, 0, 255));
            label.setPosition(cc.p(this.startX + pos.x*this.tileSize, this.tileSize/2 + pos.y*this.tileSize));
            this.boardNode.addChild(label, 2);
            this.pathLabelHints.push(label);

        }

        if(this.guideSprite != undefined)
            this.guideSprite.removeFromParent();
        this.isGuide = false;
        if(g_pack == 0 && g_pack_sub == 0 && g_level <= 2) this.isGuide = true; // show guide 3 first levels
        if(this.isGuide){
            this.btn_hint.setTouchEnabled(false);
            this.btn_hint.setColor(cc.color(128, 128, 128, 255));
            this.guideStep = 0;
            this.guideHintIndex = 0;
            this.guideSprite = new cc.Sprite(res.pointer_png);
            this.guideSprite.setScale(this.scale_);
            this.guideSprite.setAnchorPoint(cc.p(0.5, 1));
            this.boardNode.addChild(this.guideSprite, 2);
            this.showGuide();
        } else {
            this.btn_hint.setTouchEnabled(true);
            this.btn_hint.setColor(cc.color(255, 255, 255, 255));
            this.btn_hint.runAction(cc.blink(1, 2));
            this.scheduleOnce(this.runBtnHintDone, 1.5);
        }

        this.isUseTimer = false;

        if(this.isUseTimer){
            if(this.timerBar != undefined)
                this.timerBar.removeFromParent();
            var posTimer = cc.p(this.size.width / 2, this.size.height / 2 + this.size.width/2 + 20*this.scale_);
            this.timerBar = new ccui.LoadingBar();
            this.timerBar.loadTexture(res.pixel_png);
            this.timerBar.setScale(this.size.width, 10*this.scale_);
            this.timerBar.setPercent(100);
            this.timerBar.setPosition(posTimer);
            this.timerBar.setColor(titleColor[getRandomInt(0, titleColor.length - 1)]);
            this.addChild(this.timerBar);

            var draw = new cc.DrawNode();
            draw.setAnchorPoint(cc.p(0.5, 0.5));
            draw.drawRect(cc.p(posTimer.x - this.size.width/2 + this.scale_, posTimer.y - 10/2*this.scale_), cc.p(posTimer.x + this.size.width/2 - this.scale_, posTimer.y + 10/2*this.scale_), null, 2*this.scale_, cc.color(255, 255, 255, 255));
            this.addChild(draw);

            this.unschedule(this.updateTimer);
            this.runningTime = 10;
            this.isStarted = false;
        }
        this.imgSharePath = screenshot(this, this.size, "yk.png");
        
    },
    updateTimer:function(dt){
        if(!this.isUseTimer) return;
        cc.log("updateTimer");
        var percent = this.timerBar.getPercent();
        this.timerBar.setPercent(percent - 1);
        if(percent <= 0){
            this.unschedule(this.updateTimer);
        }
    },
    showGuide:function(){
        if(!this.isGuide) return;
        if(this.guideHintIndex +1 >= this.pathPosHintsIndex.length) return;
        this.guideSprite.stopAllActions();
        var posBoard = this.pathPosTarget[this.pathPosHintsIndex[this.guideHintIndex]];
        var posBoardNext = this.pathPosTarget[this.pathPosHintsIndex[this.guideHintIndex + 1]];
        var posBoardNextNext = this.pathPosTarget[this.pathPosHintsIndex[this.guideHintIndex] + 1];
        this.guideSprite.setPosition(cc.p(this.startX + posBoard.x*this.tileSize, this.tileSize/2 + posBoard.y*this.tileSize));
        var action = cc.sequence(
            cc.moveTo(1, cc.p(this.startX + posBoardNextNext.x*this.tileSize, this.tileSize/2 + posBoardNextNext.y*this.tileSize)),
            cc.moveTo(1, cc.p(this.startX + posBoardNext.x*this.tileSize, this.tileSize/2 + posBoardNext.y*this.tileSize)),
            cc.delayTime(0.5),
            cc.callFunc(this.guideLoop));
        this.guideSprite.runAction(action);
    },
    guideLoop:function(){
        thiz.showGuide();
    },
    getPosFromIndex:function(t){
        var X = t%this.numSize;
        var Y = (t - X)/this.numSize;
        return cc.p(X, Y);
    },
    getIndexFromCode:function(code){
        for(var i = 0; i < keyBoardCode.length; i++){
            if(code == keyBoardCode[i]) return i;
        }
        return -1;
    },
    playRunningMusic:function(){
        if(this.g_song[this.currentSoundMove] != undefined){
            for(var i = 0; i < this.g_song[this.currentSoundMove].length; i++)
                cc.audioEngine.playEffect(sound_move[this.g_song[this.currentSoundMove][i] - 9], false);
            this.currentSoundMove++;
            if(this.currentSoundMove == this.g_song.length){
                this.currentSoundMove = 0;
            }
        }
    },
    _onTouchBegan:function(touch, event){
        if(this.isUseTimer && !this.isStarted){
            this.schedule(this.updateTimer, this.runningTime/100);
            this.isStarted = true;
        }
        if(this.isPopupShowing) return true;
        if(this.isPurchasing) return true;
		this.isValidTouch = true;
        //cc.log("_onTouchBegan");
        this.prePos =  this.getPosFromTouch(touch);
        if(this.indexInPath(this.prePos) == -1){
			this.isValidTouch = false;
			return true;
		}
        if(this.prePos.x < 0 || this.prePos.x >= this.numSize || this.prePos.y < 0 || this.prePos.y >= this.numSize){
            this.hintSprite.setPosition(cc.p(-100*this.scale_, -100*this.scale_));
			this.isValidTouch = false;
            return true;
        }

        this.playRunningMusic();

        var posTouch = touch.getLocation();
        this.hintSprite.setPosition(posTouch);
        if(this.isGuide) return true;
        this.cutPathAt(this.prePos);
        return true;
    },
    _onTouchMoved:function(touch, event){
        if(this.isPopupShowing) return;
        if(this.isPurchasing) return;
        //cc.log("_onTouchMoved");
		if(!this.isValidTouch) return;
        var posBoard =  this.getPosFromTouch(touch);
        if(posBoard.x < 0 || posBoard.x >= this.numSize || posBoard.y < 0 || posBoard.y >= this.numSize){
            this.hintSprite.setPosition(cc.p(-100*this.scale_, -100*this.scale_));
            return;
        }

        var posTouch = touch.getLocation();
        this.hintSprite.setPosition(posTouch);

        if(this.isGuide && !cc.pSameAs(posBoard, this.pathPosTarget[this.guideStep + 1])) return;

        if(!cc.pSameAs(posBoard, this.prePos) && (posBoard.x == this.prePos.x || posBoard.y == this.prePos.y) && (Math.abs(posBoard.x - this.prePos.x) == 1 || Math.abs(posBoard.y - this.prePos.y) == 1)){
            var index = this.indexInPath(posBoard);
            if(index != -1){
                if(index == this.pathLines.length - 1) {
                    this.playRunningMusic();

                    this.cutPathAt(posBoard);
                } else {
                    return;
                }
            } else{
                this.playRunningMusic();

                var line  = new cc.DrawNode();
                this.boardNode.addChild(line, 1);
                line.drawSegment( cc.p(this.startX + posBoard.x*this.tileSize, this.tileSize/2 + posBoard.y*this.tileSize), cc.p(this.startX + this.prePos.x*this.tileSize, this.tileSize/2 + this.prePos.y*this.tileSize), this.scale_*5*30/this.numSize, rainbowColor[thiz.currentColorLine]);
                this.pathLines.push(line);
                this.pathPos.push(posBoard);
                this.currentColorLine++;
                if(this.currentColorLine == rainbowColor.length) this.currentColorLine = 0;
                this.prePos = posBoard;
                if(this.isGuide) this.guideStep++;
                if(this.guideStep == this.pathPosHintsIndex[this.guideHintIndex + 1]){
                    this.guideHintIndex++;
                    this.showGuide();
                }
                //cc.log("drawSegment");
            }
        } else {
            return;
        }
    },
    _onTouchEnded:function(touch, event){
        if(this.isPopupShowing) return;
        if(this.isPurchasing) return;
        //cc.log("_onTouchEnded");
		if(!this.isValidTouch) return;
        this.hintSprite.setPosition(cc.p(-100*this.scale_, -100*this.scale_));
        //cc.log("pathLines: " + this.pathLines.length + ", pathPos: " + this.pathPos.length);
        this.checkStatus();
    },
    getPosFromTouch:function(touch){
        var pos = touch.getLocation();
        return cc.p(Math.floor((pos.x - this.startX + this.tileSize/2)/this.tileSize), Math.floor((pos.y - this.startY + this.tileSize/2)/this.tileSize));
    },
    cutPathAt:function(pos){
        if(!this.isPressHint){
            this.numAsk++;
            if(this.numAsk >= this.numAskTarget){
                this.btn_hint.runAction(cc.blink(1, 2));
                this.scheduleOnce(this.runBtnHintDone, 1.5);
                this.numAsk = 0;
                this.numAskTarget = 3*this.numAskTarget/2;
            }
        } else {
            this.isPressHint = false;
        }
        var index = this.indexInPath(pos);
        if(index == -1) return;
        for(var i = this.pathPos.length - 1; i > index; i--){
            this.pathLines[this.pathLines.length - 1].removeFromParent();
            this.pathLines.splice(this.pathLines.length - 1, 1);
            this.pathPos.splice(this.pathPos.length - 1, 1);
            this.currentColorLine--;
            if(this.currentColorLine == -1) this.currentColorLine = rainbowColor.length - 1;
        }
        this.prePos = this.pathPos[this.pathPos.length - 1];
    },
    indexInPath:function(pos){
        for(var i = 0; i < this.pathPos.length; i++)
            if(cc.pSameAs(pos, this.pathPos[i])) return i;
        return -1;

    },
    checkStatus:function(){
        var pathPosHintsT = [];
        for(var i = 0; i < this.pathPos.length; i++){
            if(this.isPointInPath(this.pathPos[i], this.pathPosHints))
                pathPosHintsT.push(this.pathPos[i]);
        }
        if(this.pathPos.length == this.numSize*this.numSize){
            if(this.comparePath(this.pathPosHints, pathPosHintsT) && cc.pSameAs(this.pathPosHints[this.pathPosHints.length - 1], this.pathPos[this.pathPos.length - 1])){
                this.levelComplete();
            }else{
                cc.audioEngine.playEffect(res.S_WRONG, false);

                this.createPopup(POPUP_TYPE.message, g_text.text_wait, g_text.msg_connect_order.replace("#pre", pathPosHintsT.length - 1).replace("#last", pathPosHintsT.length), g_text.text_ask_friends, g_text.text_ok);                
            }
        } else{
            if(this.comparePath(this.pathPosHints, pathPosHintsT) && cc.pSameAs(this.pathPosHints[this.pathPosHints.length - 1], this.pathPos[this.pathPos.length - 1])){
                cc.audioEngine.playEffect(res.S_WRONG, false);
                this.createPopup(POPUP_TYPE.message, g_text.text_wait, g_text.msg_fill_board, g_text.text_ask_friends, g_text.text_ok);
            } else {
                this.playRunningMusic();
            }
        }
    },
    levelComplete:function(){
        if(g_level + 1 > this.unlockLevel){
            this.unlockLevel = g_level + 1;
            rms.setItem(KEY_UNLOCK_LEVEL + g_pack + "_" + g_pack_sub, g_level + 1);
        }

        if(g_level + 1 < g_numLevel) {
            this.btn_next.setTouchEnabled(true);
            this.btn_next.setColor(cc.color(255, 255, 255, 255));
        }
        cc.audioEngine.playEffect(res.S_PASS, false);

        var title = g_text.text_perfect, message = g_text.msg_completed.replace("#level", g_level + 1),
            text_btn_popup_1 = g_text.text_share, text_btn_popup_2 = g_text.text_next_level,
            type = POPUP_TYPE.level_complete;
        if(g_pack == 0 && g_pack_sub == 0 && g_level == 2){
            title = g_text.text_congra;
            message = g_text.msg_complete_tutorial;
        }
        if(g_level == g_numLevel - 1){
            title = g_text.text_congra;
            if(g_pack == g_pack_num.length - 1){
                message = g_text.msg_complete_all;
                text_btn_popup_2 = g_text.text_ok;
                type = POPUP_TYPE.message;
            }
            else{
                message = g_text.msg_complete_end_pack.replace("#pack", g_pack_data[g_pack].name);
                text_btn_popup_2 = g_text.text_next_level;
                type = POPUP_TYPE.pack_complete;
            }
        }
        this.createPopup(type, title, message, text_btn_popup_1, text_btn_popup_2);


    },
    createPopup:function(type, title, message, text_btn_popup_1, text_btn_popup_2){
        if(type == POPUP_TYPE.level_complete) {
            showFullAds();
            FBInstant.updateAsync({
                action: 'CUSTOM',
                cta: 'Play',
                image: imageShare,
                text: {
                    default: FBInstant.player.getName() + ' just played. Now your turn!'
                },
                template: 'WORD_PLAYED',
                data: { myReplayData: '...' },
                strategy: 'IMMEDIATE',
                notification: 'NO_PUSH'
            }).then(function() {
            });
        }
        this.isPopupShowing = true;

        this.popupType = type;

        this.bgPopupLayer.setVisible(true);
        this.bgPopupLayer.setContentSize(cc.size(550*this.scale_, 365*this.scale_));
        var pos = cc.p((this.size.width - this.bgPopupLayer.getContentSize().width)/2, (this.size.height - this.bgPopupLayer.getContentSize().height)/2);
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
        btn_close.setTag(BUTTON_TAG_GAME.btn_close_);
        btn_close.addTouchEventListener(this.btnTouchEvent, this);
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
    },
    createPopupIAPP:function(type, title, message, text_btn_popup_1, text_btn_popup_2, text_btn_popup_3, text_btn_popup_4){
        this.isPopupShowing = true;

        this.popupType = type;

        this.bgPopupLayer.setVisible(true);
        this.bgPopupLayer.setContentSize(cc.size(500*this.scale_, (365 + 1*95)*this.scale_));
        var pos = cc.p((this.size.width - this.bgPopupLayer.getContentSize().width)/2, (this.size.height - this.bgPopupLayer.getContentSize().height)/2);
        this.bgPopupLayer.setPosition(pos);
        this.listLabel = [];
        this.createRectIAPP(this.bgPopupLayer, cc.p(this.bgPopupLayer.getContentSize().width/2, (55 + 0*95)*this.scale_), BUTTON_TAG_POPUP.btn_popup_1, text_btn_popup_1, g_iap_price.hints5, null);
        this.createRectIAPP(this.bgPopupLayer, cc.p(this.bgPopupLayer.getContentSize().width/2, (55 + 1*95)*this.scale_), BUTTON_TAG_POPUP.btn_popup_2, text_btn_popup_2, g_iap_price.hints30, g_text.text_hint_promo);
        this.createRectIAPP(this.bgPopupLayer, cc.p(this.bgPopupLayer.getContentSize().width/2, (55 + 2*95)*this.scale_), BUTTON_TAG_POPUP.btn_popup_3, text_btn_popup_3, null, null);
        //this.createRectIAPP(this.bgPopupLayer, cc.p(this.bgPopupLayer.getContentSize().width/2, (55 + 3*95)*this.scale_), BUTTON_TAG_POPUP.btn_popup_4, text_btn_popup_4, null, null);

        var labelDes = new cc.LabelTTF(message, "YK", 35*this.scale_, cc.size(this.bgPopupLayer.getContentSize().width - 40*this.scale_, 90*this.scale_), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        labelDes.setPosition(cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 80 + 30 + 15 + 40 + 1*95)*this.scale_));
        this.bgPopupLayer.addChild(labelDes);

        var labelTitle = new cc.LabelTTF(title, "YK", 60*this.scale_);
        labelTitle.setPosition(cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 80 + 30 + 15 + 45 + 1*95)*this.scale_ + labelTitle.getContentSize().height));
        this.bgPopupLayer.addChild(labelTitle);

        var color = cc.color(255, 255, 255, 255);
        var draw = new cc.DrawNode();
        draw.setAnchorPoint(cc.p(0.5, 0.5));
        draw.drawRect(cc.p(0, this.bgPopupLayer.getContentSize().height), cc.p(this.bgPopupLayer.getContentSize().width, 0), null, 2*this.scale_, color);
        this.bgPopupLayer.addChild(draw);

        var btn_close = new ccui.Button(res.btn_close_press, res.btn_close);
        btn_close.setScale(this.scale_, this.scale_);
        btn_close.setPosition(cc.p(this.bgPopupLayer.getContentSize().width, this.bgPopupLayer.getContentSize().height));
        btn_close.setTag(BUTTON_TAG_GAME.btn_close_);
        btn_close.addTouchEventListener(this.btnTouchEvent, this);
        this.bgPopupLayer.addChild(btn_close);
    },
    createRectIAPP:function(parent, pos, tag, text, textPrice, textPromo){

        var color = cc.color(255, 255, 255, 255);
        var btnWidth = 470*this.scale_;
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
        label.setAnchorPoint(cc.p(0, 0.5));
        label.setPosition(cc.p(pos.x - btnWidth/2 + 10*this.scale_, pos.y));
        parent.addChild(label);
        this.listLabel.push(label);

        if(textPrice == null){
            label.setAnchorPoint(cc.p(0.5, 0.5));
            label.setPosition(pos);
        } else {
            var labelPrice = new cc.LabelTTF(textPrice, "YK", 30*this.scale_);
            labelPrice.setColor(cc.color(128, 128, 128));
            labelPrice.setAnchorPoint(cc.p(1, 0.5));
            labelPrice.setPosition(cc.p(pos.x + btnWidth/2 - 10*this.scale_, pos.y));
            parent.addChild(labelPrice);

            if(textPromo != null){
                labelPrice.setAnchorPoint(cc.p(1, 0));
                labelPrice.setPositionY(pos.y);

                var labelPromo = new cc.LabelTTF(textPromo, "YK", 30*this.scale_);
                labelPromo.setColor(cc.color(0, 255, 0));
                labelPromo.setAnchorPoint(cc.p(1, 1));
                labelPromo.setPosition(cc.p(pos.x + btnWidth/2 - 10*this.scale_, pos.y));
                parent.addChild(labelPromo);
            }
        }
    },
    createPopupMessage:function(title, message){
        this.isPopupShowing = true;

        this.bgPopupLayer.setVisible(true);
        this.bgPopupLayer.setContentSize(cc.size(550*this.scale_, 250*this.scale_));
        var pos = cc.p((this.size.width - this.bgPopupLayer.getContentSize().width)/2, (this.size.height - this.bgPopupLayer.getContentSize().height)/2);
        this.bgPopupLayer.setPosition(pos);

        var labelDes = new cc.LabelTTF(message, "YK", 35*this.scale_, cc.size(this.bgPopupLayer.getContentSize().width - 40*this.scale_, 200*this.scale_), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        labelDes.setPosition(cc.p(this.bgPopupLayer.getContentSize().width/2, (80)*this.scale_));
        this.bgPopupLayer.addChild(labelDes);

        var labelTitle = new cc.LabelTTF(title, "YK", 60*this.scale_);
        labelTitle.setPosition(cc.p(this.bgPopupLayer.getContentSize().width/2, (80 + 40)*this.scale_ + labelTitle.getContentSize().height));
        this.bgPopupLayer.addChild(labelTitle);

        var color = cc.color(255, 255, 255, 255);
        var draw = new cc.DrawNode();
        draw.setAnchorPoint(cc.p(0.5, 0.5));
        draw.drawRect(cc.p(0, this.bgPopupLayer.getContentSize().height), cc.p(this.bgPopupLayer.getContentSize().width, 0), null, 2*this.scale_, color);
        this.bgPopupLayer.addChild(draw);

        var btn_close = new ccui.Button(res.btn_close_press, res.btn_close);
        btn_close.setScale(this.scale_, this.scale_);
        btn_close.setPosition(cc.p(this.bgPopupLayer.getContentSize().width, this.bgPopupLayer.getContentSize().height));
        btn_close.setTag(BUTTON_TAG_GAME.btn_close_);
        btn_close.addTouchEventListener(this.btnTouchEvent, this);
        this.bgPopupLayer.addChild(btn_close);
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
                switch (this.popupType){
                    case POPUP_TYPE.level_complete:
                        this.closePopup();
                        switch (tag){
                            case BUTTON_TAG_POPUP.btn_popup_2:
                                g_level++;
                                this.initBoard(g_level);
                                break;
                            case BUTTON_TAG_POPUP.btn_popup_1:
                                shareDefault(this.imgSharePath, g_text.msg_share.replace("#level", g_level + 1).replace("#pack", g_pack_data[g_pack].name));
                                break;
                        };
                        break;
                    case POPUP_TYPE.message:
                        this.closePopup();
                        switch (tag){
                            case BUTTON_TAG_POPUP.btn_popup_2:
                                break;
                            case BUTTON_TAG_POPUP.btn_popup_1:
                                console.log("ask friend");
                                //shareDefault(this.imgSharePath, g_text.msg_ask_friend.replace("#level", g_level + 1).replace("#pack", g_pack_data[g_pack].name));
                                askFriend();
                                break;
                        };
                        break;
                    case POPUP_TYPE.pack_complete:
                        cc.log("POPUP_TYPE.pack_complete");
                        switch (tag){
                            case BUTTON_TAG_POPUP.btn_popup_2:
                                if(isLockPack(g_pack + 1)){
                                    cc.director.runScene(new PackScene());
                                } else {
                                    g_pack++;
                                    g_pack_sub = 0;
                                    g_level = 0;
                                    cc.loader.loadTxt("res/level/" + g_pack + "_" + g_pack_sub, function(error, data){
                                        g_levelData = data.split(/\n/);
                                        g_levelData.splice(g_levelData.length - 1, 1);
                                        g_numLevel = g_levelData.length;
                                        cc.log("g_numLevel: " + g_numLevel);
                                        g_numPage = g_levelData.length/30;
                                        cc.log("g_numPage: " + g_numPage);
                                        thiz.labelPack.setString(g_pack_data[g_pack].name);
                                        thiz.labelLevel.setPosition(cc.p(thiz.labelPack.getPositionX() + thiz.labelPack.getContentSize().width + 12*thiz.scale_, thiz.topY));
                                        thiz.closePopup();
                                        thiz.initBoard(g_level);
                                    });
                                }
                                break;
                            case BUTTON_TAG_POPUP.btn_popup_1:
                                break;
                        };
                        break;
                    case POPUP_TYPE.iapp:
                        this.closePopup();
                        //if(!cc.sys.isNative) return;
                        switch (tag){
                            case BUTTON_TAG_POPUP.btn_popup_4:
                                cc.log("invite");
                                break;
                            case BUTTON_TAG_POPUP.btn_popup_3:
                                cc.log("watch video");
                                //showReward();
                                //shareFb();
                                //inviteFb();
								/*if(isInviteGetHint)
									requestInviteFbWithIds();
								else
									shareFb();*/
                                FBInstant.context
                                    .chooseAsync()
                                    .then(function() {
                                        FBInstant.updateAsync({
                                            action: 'CUSTOM',
                                            cta: 'Play',
                                            image: imageShare,
                                            text: {
                                                default: FBInstant.player.getName() + ' just played. Now your turn!'
                                            },
                                            template: 'WORD_PLAYED',
                                            data: { myReplayData: '...' },
                                            strategy: 'IMMEDIATE',
                                            notification: 'NO_PUSH'
                                        }).then(function() {
                                            g_hint++;
                                            thiz.showHint();
                                        });
                                    });
                                break;
                            case BUTTON_TAG_POPUP.btn_popup_2:
                                cc.log("btn_popup_2");
                                /*this.loadingIAPP();
                                sdkbox.IAP.purchase("30hints");*/
                                break;
                            case BUTTON_TAG_POPUP.btn_popup_1:
                                /*this.loadingIAPP();
                                sdkbox.IAP.purchase("5hints");*/
                                break;
                        };
                        break;
                };
                break;
        };
    },
    loadingIAPP:function(){
        this.isPurchasing = true;
        var loadingSprite = new cc.Sprite(res.img_loading_png);
        loadingSprite.setScale(this.scale_);
        loadingSprite.setPosition(cc.p(this.size.width/2, this.size.height/2));
        loadingSprite.runAction(cc.rotateBy(1, 360).repeatForever());

        this.bgLoading.setVisible(true);
        this.bgLoading.addChild(loadingSprite);
    },
    closeLoading:function(){
        this.isPurchasing = false;
        this.bgLoading.removeAllChildren();
        this.bgLoading.setVisible(false);
    },
    closePopup:function(){
        this.isPopupShowing = false;
        this.bgPopupLayer.removeAllChildren();
        this.bgPopupLayer.setVisible(false);
    },
    comparePath:function(path1, path2){
        if(path1.length != path2.length) return false;
        for(var i = 0; i < path1.length; i++){
            if(!cc.pSameAs(path1[i], path2[i])) return false;
        }
        return true;
    },
    isPointInPath:function(point, path){
        for(var i = 0; i < path.length; i++){
            if(cc.pSameAs(point, path[i])) return true;
        }
        return false;
    },
    btnTouchEvent:function(sender, type){
        if(type != ccui.Widget.TOUCH_ENDED) return;
        if(this.isPurchasing) return;
        cc.audioEngine.playEffect(sound_move[getRandomInt(1, sound_move.length)], false);
        switch (sender.getTag()) {
            case BUTTON_TAG_GAME.btn_restart_:
                this.currentSoundMove = 0;
                this.closePopup();
                if(this.pathLines.length == 0) return;
                this.btn_hint.runAction(cc.blink(1, 2));
                this.scheduleOnce(this.runBtnHintDone, 1.5);
                this.cutPathAt(this.pathPosTarget[0]);
                this.numAsk = 0;
                this.guideStep = 0;
                this.guideHintIndex = 0;
                this.showGuide();
                break;
            case BUTTON_TAG_GAME.btn_next_:
                this.closePopup();
                g_level++;
                this.initBoard(g_level);
                break;
            case BUTTON_TAG_GAME.btn_back_level_:
                this.closePopup();
                g_level--;
                this.initBoard(g_level);
                break;
            case BUTTON_TAG_GAME.btn_back_:
                cc.director.runScene(new LevelScene());
                break;
            case BUTTON_TAG_GAME.btn_hint_:
                this.showHint();
                break;
            case BUTTON_TAG_GAME.btn_close_:
                this.closePopup();
                break;
        }
    },
    runBtnHintDone:function(dt){
        this.btn_hint.setVisible(true);
    },
    showHint:function(){
        if(this.isPopupShowing) return;
        this.isPressHint = false;
        this.numAsk = 0;
        if(this.isGuide) return;
        var startIndex = 0;
        for(i = startIndex; i < this.pathPos.length; i++){
            if(!cc.pSameAs(this.pathPos[i], this.pathPosTarget[i])) break;
        };
        startIndex = i - 1;
        if(g_hint == 0 && startIndex < this.pathPosTarget.length - 1){
			if (isInviteGetHint)
				this.createPopupIAPP(POPUP_TYPE.iapp, g_text.text_hint, g_text.msg_hint, g_text.text_hint2, g_text.text_hint1, g_text.text_invite, g_text.text_invite);
			else
				this.createPopupIAPP(POPUP_TYPE.iapp, g_text.text_hint, g_text.msg_hint, g_text.text_hint2, g_text.text_hint1, g_text.text_share, g_text.text_invite);
            return;
        }
        if(startIndex >= this.pathPosTarget.length - 1) return;
        this.isPressHint = true;
        this.cutPathAt(this.pathPos[startIndex]);
        var hintIndex = 0;
        while(this.pathPosHintsIndex[hintIndex] < startIndex + 1) hintIndex++;
        var endIndex = this.pathPosHintsIndex[hintIndex];
        this.pathPos.splice(this.pathPos.length - 1, 1);
        for(var i = startIndex; i <= endIndex; i++){
            var posBoard = this.pathPosTarget[i];
            this.pathPos.push(posBoard);
            if(i != startIndex){
                var line  = new cc.DrawNode();
                this.boardNode.addChild(line, 1);
                line.drawSegment( cc.p(this.startX + posBoard.x*this.tileSize, this.tileSize/2 + posBoard.y*this.tileSize), cc.p(this.startX + this.prePos.x*this.tileSize, this.tileSize/2 + this.prePos.y*this.tileSize), this.scale_*5*30/this.numSize, cc.color(255, 255, 255, 255));
                this.pathLines.push(line);
                this.currentColorLine++;
                if(this.currentColorLine == rainbowColor.length) this.currentColorLine = 0;
            }
            this.prePos = posBoard;
        }
        g_hint--;
        rms.setItem(KEY_HINT, g_hint);
        this.labelHintNum.setString("" + g_hint);
        this.checkStatus();
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

