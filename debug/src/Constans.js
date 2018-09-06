var DESIGN_WIDTH = 640;
var rainbowColor = [cc.color(51, 228, 239), cc.color(242, 225, 13), cc.color(142, 19, 250), cc.color(254, 0, 127), cc.color(237, 47, 47), cc.color(50, 242, 86), cc.color(239, 123, 30)/*, cc.color(255, 0, 255, 255)*/];
var titleColor = [cc.color(51, 228, 239), cc.color(242, 225, 13), cc.color(142, 19, 250), cc.color(254, 0, 127), cc.color(237, 47, 47)];

var keyBoardCode = [ "ab", "ba", "ac", "ca", "ad", "da", "ae", "ea", "af", "fa", "12", "21", "13", "31", "14", "41", "15", "51", "16", "61", "ag", "ga", "ah", "ha", "ai", "ia", "aj", "ja", "ak", "ka", "17", "71", "18", "81", "19", "91", "23", "32", "24", "42", "al", "la", "am", "ma", "an", "na", "ao", "oa", "ap", "pa", "25", "52", "26", "62", "27", "72", "28", "82", "29", "92", "aq", "qa", "ar", "ra", "as", "sa", "at", "ta", "au", "ua", "34", "43", "35", "53", "36", "63", "37", "38", "39", "93", "av", "va", "aw", "wa", "ax", "xa", "ay", "ya", "az", "za", "45", "54", "46", "64", "47", "74", "48", "84", "49", "94", "bc", "cb", "bd", "db", "be", "eb", "bf", "fb", "bg", "gb", "56", "65", "57", "75", "58", "85", "59", "95", "67", "76", "bh", "hb", "bi", "ib", "bj", "jb", "bk", "kb", "bl", "lb", "68", "86", "69", "96", "78", "87", "79", "97", "89", "98", "bm", "mb", "bn", "nb", "bo", "ob", "bp", "pb", "bq", "qb", "1a", "a1", "1b", "b1", "1c", "c1", "1d", "d1", "1e", "e1", "br", "rb", "bs", "sb", "bt", "tb", "bu", "ub", "bv", "vb", "1f", "f1", "1g", "g1", "1h", "h1", "1i", "i1", "1j", "j1", "bw", "wb", "bx", "xb", "by", "yb", "bz", "zb", "cd", "dc", "1k", "k1", "1l", "l1", "1m", "m1", "1n", "n1", "1o", "o1", "ce", "ec", "cf", "fc", "cg", "gc", "ch", "hc", "ci", "ic", "1p", "p1", "1q", "q1", "1r", "r1", "1s", "s1", "1t", "t1", "cj", "jc", "ck", "kc", "cl", "lc", "cm", "mc", "cn", "nc", "1u", "u1", "1v", "v1", "1w", "w1", "1x", "x1", "1y", "y1" ];

var KEY_UNLOCK_LEVEL = "KEY_UNLOCK_LEVEL";
var KEY_HINT = "KEY_HINT";
var KEY_LANG = "KEY_LANG";
var KEY_UNLOCK_PACK = "KEY_UNLOCK_PACK";
var KEY_HAS_NEW_VERSION = "KEY_HAS_NEW_VERSION";

var HINT_DEFAULT = 5;
var UNLOCK_DEFAULT = 0;
var UNLOCK_PACK_DEFAULT = 3;

var LINK_STORE = "http://ykpuzzle.com/";
var LINK_UPDATE = "http://ykpuzzle.com/version.html";