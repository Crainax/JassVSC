"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeDesc = void 0;
const map = new Map([
    ["boolean", "布尔"],
    ["integer", "整数"],
    ["real", "实数"],
    ["string", "字符串"],
    ["code", "代码"],
    ["handle", "处理"],
    ["agent", "中介(代理)"],
    ["event", "事件"],
    ["player", "玩家"],
    ["widget", "组件"],
    ["unit", "单位"],
    ["destructable", "可破坏物"],
    ["item", "物品"],
    ["ability", "技能"],
    ["buff", "魔法效果"],
    ["force", "势力"],
    ["group", "单位组"],
    ["trigger", "触发器"],
    ["triggercondition", "触发器条件"],
    ["triggeraction", "触发器动作"],
    ["timer", "计时器"],
    ["location", "点"],
    ["region", "区域"],
    ["rect", "矩形"],
    ["boolexpr", "条件表达式"],
    ["sound", "声音"],
    ["conditionfunc", "条件方法"],
    ["filterfunc", "过滤方法"],
    ["unitpool", "单位池"],
    ["itempool", "物品池"],
    ["race", "比赛"],
    ["alliancetype", "联盟类型"],
    ["racepreference", "优先种族"],
    ["gamestate", "游戏状态"],
    ["igamestate", "游戏状态"],
    ["fgamestate", "游戏状态"],
    ["playerstate", "玩家状态"],
    ["playerscore", "玩家得分"],
    ["playergameresult", "玩家游戏结果"],
    ["unitstate", "单位状态"],
    ["aidifficulty", "困难程度"],
    ["eventid", "事件id"],
    ["gameevent", "游戏事件"],
    ["playerevent", "玩家事件"],
    ["playerunitevent", "玩家单位事件"],
    ["unitevent", "单位事件"],
    ["limitop", "比较算符"],
    ["widgetevent", "容器事件"],
    ["dialogevent", "对话框事件"],
    ["unittype", "单位类型"],
    ["gamespeed", "游戏速度"],
    ["gamedifficulty", "游戏难度"],
    ["gametype", "游戏类型"],
    ["mapflag", "地图标志"],
    ["mapvisibility", "游戏可见性"],
    ["mapsetting", "游戏设置"],
    ["mapdensity", "地图密度"],
    ["mapcontrol", "地图控制"],
    ["playerslotstate", "玩家插槽状态"],
    ["volumegroup", "声音组"],
    ["camerafield", "摄像机场"],
    ["camerasetup", "摄像机设置"],
    ["playercolor", "玩家颜色"],
    ["placement", "安置"],
    ["startlocprio", "开始位置优先级"],
    ["raritycontrol", "动画珍品"],
    ["blendmode", "混合模型"],
    ["texmapflags", "地图涂层标志"],
    ["effect", "特效"],
    ["effecttype", "特效类型"],
    ["weathereffect", "天气特效"],
    ["terraindeformation", "地形变形"],
    ["fogstate", "战争迷雾状态"],
    ["fogmodifier", "战争迷雾标志"],
    ["dialog", "对话框"],
    ["button", "按钮"],
    ["quest", "任务"],
    ["questitem", "人物物品"],
    ["defeatcondition", "失败条件"],
    ["timerdialog", "计时器窗口"],
    ["leaderboard", "排行榜"],
    ["multiboard", "多面板"],
    ["multiboarditem", "多面板项目"],
    ["trackable", "可跟踪物"],
    ["gamecache", "游戏缓存"],
    ["version", "版本"],
    ["itemtype", "物品类型"],
    ["texttag", "漂浮文字"],
    ["attacktype", "攻击类型"],
    ["damagetype", "伤害类型"],
    ["weapontype", "武器类型"],
    ["soundtype", "声音类型"],
    ["lightning", "闪电效果"],
    ["pathingtype", "路径类型"],
    ["mousebuttontype", "鼠标按钮类型"],
    ["animtype", "动画类型"],
    ["subanimtype", "子动画类型"],
    ["image", "图片"],
    ["ubersplat", "地面纹理"],
    ["hashtable", "哈希表"],
    ["framehandle", "帧处理"],
    ["originframetype", "帧类型"],
    ["framepointtype", "帧点类型"],
    ["textaligntype", "文本对齐方式"],
    ["frameeventtype", "帧事件类型"],
    ["oskeytype", "os键类型"],
    ["abilityintegerfield", "技能整数字段"],
    ["abilityrealfield", "技能实数字段"],
    ["abilitybooleanfield", "技能布尔字段"],
    ["abilitystringfield", "技能字符串字段"],
    ["abilityintegerlevelfield", "技能整数等级字段"],
    ["abilityreallevelfield", "技能实数等级字段"],
    ["abilitybooleanlevelfield", "技能布尔等级字段"],
    ["abilitystringlevelfield", "技能字符串等级字段"],
    ["abilityintegerlevelarrayfield", "技能整数数组等级字段"],
    ["abilityreallevelarrayfield", "技能实数数组等级字段"],
    ["abilitybooleanlevelarrayfield", "技能布尔数组等级字段"],
    ["abilitystringlevelarrayfield", "技能字符串数组等级字段"],
    ["unitintegerfield", "单位整数字段"],
    ["unitrealfield", "单位实数字段"],
    ["unitbooleanfield", "单位布尔字段"],
    ["unitstringfield", "单位字符串字段"],
    ["unitweaponintegerfield", "单位武器整数字段"],
    ["unitweaponrealfield", "单位武器实数字段"],
    ["unitweaponbooleanfield", "单位武器布尔字段"],
    ["unitweaponstringfield", "单位武器字符串字段"],
    ["itemintegerfield", "物品字符串字段"],
    ["itemrealfield", "物品实数字段"],
    ["itembooleanfield", "物品布尔字段"],
    ["itemstringfield", "物品字符串字段"],
    ["movetype", "移动类型"],
    ["targetflag", "目标"],
    ["armortype", "装甲类型"],
    ["heroattribute", "英雄属性"],
    ["defensetype", "防御类型"],
    ["regentype", "再生类型"],
    ["unitcategory", "单位类别"],
    ["pathingflag", "路标"],
    ["minimapicon", "小地图图标"],
    ["commandbuttoneffect", "命令按钮效果"],
]);
function getTypeDesc(name) {
    var _a;
    return (_a = map.get(name)) !== null && _a !== void 0 ? _a : "";
}
exports.getTypeDesc = getTypeDesc;
