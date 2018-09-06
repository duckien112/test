/**
 * Created by kien.buiduc on 5/5/2015.
 */
RMS = cc.Class.extend({
    _ls: null,
    ctor:function () {
        this._ls = cc.sys.localStorage;
    },
    getItem: function (key, defaultValue) {
        var value = this._ls.getItem(key);
        if(value == null || value == "") value = defaultValue;
        return value;
    },
    setItem: function (key, value) {
        this._ls.setItem(key, value);
    }
});

/**
 * @private
 * @static
 */
RMS.instance = null;
RMS.isGotInstance = false;
RMS.getInstance = function () {
    if (RMS.isGotInstance == false) {
        RMS.instance = new RMS();
        RMS.isGotInstance = true;
    }
    return RMS.instance;
};