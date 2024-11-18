#ifndef DZAPIINCLUDE
#define DZAPIINCLUDE


// 保存值
native DzAPI_Map_SaveServerValue        takes player whichPlayer, string key, string value returns boolean
// 获取值
native DzAPI_Map_GetServerValue         takes player whichPlayer, string key returns string
native DzAPI_Map_Ladder_SetStat         takes player whichPlayer, string key, string value returns nothing
// rpg阶梯
native DzAPI_Map_IsRPGLadder            takes nothing returns boolean
// 游戏开始时间
native DzAPI_Map_GetGameStartTime       takes nothing returns integer
native DzAPI_Map_Stat_SetStat           takes player whichPlayer, string key, string value returns nothing
// 本局游戏的地图模式
// 获取本局游戏所选择地图模式，地图模式均由作者在开发者平台进行配置（包括天梯排位赛模式、快速匹配模式、建房间时房主所选定的地图模式）。
native DzAPI_Map_GetMatchType      		takes nothing returns integer
// 玩家状态
native DzAPI_Map_Ladder_SetPlayerStat   takes player whichPlayer, string key, string value returns nothing
native DzAPI_Map_GetServerValueErrorCode takes player whichPlayer returns integer
// 得到阶梯水平
native DzAPI_Map_GetLadderLevel         takes player whichPlayer returns integer
// 红名vip
native DzAPI_Map_IsRedVIP               takes player whichPlayer returns boolean
// 蓝名vip
native DzAPI_Map_IsBlueVIP              takes player whichPlayer returns boolean
// 得到梯阶
native DzAPI_Map_GetLadderRank          takes player whichPlayer returns integer
// 地图排名
native DzAPI_Map_GetMapLevelRank        takes player whichPlayer returns integer
// 工会名称
native DzAPI_Map_GetGuildName           takes player whichPlayer returns string
// 工会权限
native DzAPI_Map_GetGuildRole           takes player whichPlayer returns integer
// rpg大厅
native DzAPI_Map_IsRPGLobby             takes nothing returns boolean
// 获取地图等级
native DzAPI_Map_GetMapLevel            takes player whichPlayer returns integer
// 任务完成
native DzAPI_Map_MissionComplete        takes player whichPlayer, string key, string value returns nothing
// 活动数据
native DzAPI_Map_GetActivityData        takes nothing returns string
// 地图配置
native DzAPI_Map_GetMapConfig           takes string key returns string
native DzAPI_Map_SavePublicArchive      takes player whichPlayer, string key, string value returns boolean
native DzAPI_Map_GetPublicArchive       takes player whichPlayer, string key returns string
native DzAPI_Map_UseConsumablesItem     takes player whichPlayer, string key returns nothing
// Orpg触发
native DzAPI_Map_OrpgTrigger            takes player whichPlayer, string key returns nothing
// 获取服务器存档
native DzAPI_Map_GetServerArchiveDrop   takes player whichPlayer, string key returns string
// 服务器存档设备
native DzAPI_Map_GetServerArchiveEquip  takes player whichPlayer, string key returns integer
// 获取鼠标在游戏内的坐标X
native DzGetMouseTerrainX takes nothing returns real
// 获取鼠标在游戏内的坐标Y
native DzGetMouseTerrainY takes nothing returns real
// 获取鼠标在游戏内的坐标Z
native DzGetMouseTerrainZ takes nothing returns real
// 鼠标是否在游戏内
native DzIsMouseOverUI takes nothing returns boolean
// 获取鼠标屏幕坐标X
native DzGetMouseX takes nothing returns integer
// 获取鼠标屏幕坐标Y
native DzGetMouseY takes nothing returns integer
// 获取鼠标游戏窗口坐标X
native DzGetMouseXRelative takes nothing returns integer
// 获取鼠标游戏窗口坐标Y
native DzGetMouseYRelative takes nothing returns integer
// 设置鼠标位置
native DzSetMousePos takes integer x, integer y returns nothing
// 注册鼠标点击触发（sync为true时，调用TriggerExecute。为false时，直接运行action函数，可以异步不掉线，action里不要有同步操作）
native DzTriggerRegisterMouseEvent takes trigger trig, integer btn, integer status, boolean sync, string func returns nothing
// 注册鼠标点击触发（sync为true时，调用TriggerExecute。为false时，直接运行action函数，可以异步不掉线，action里不要有同步操作）
// DzTriggerRegisterMouseEventByCode(null, 2, 1, false, function()) //第一个参数一般为null，第二个参数为鼠标按键(1:左键|2:右键)，第三个参数为鼠标状态(1:按下|0:抬起)，第四个参数为是否同步，第五个参数为回调函数
native DzTriggerRegisterMouseEventByCode takes trigger trig, integer btn, integer status, boolean sync, code funcHandle returns nothing
// 注册键盘点击触发
native DzTriggerRegisterKeyEvent takes trigger trig, integer key, integer status, boolean sync, string func returns nothing
// 注册键盘点击触发
native DzTriggerRegisterKeyEventByCode takes trigger trig, integer key, integer status, boolean sync, code funcHandle returns nothing
// 注册鼠标滚轮触发
native DzTriggerRegisterMouseWheelEvent takes trigger trig, boolean sync, string func returns nothing
// 注册鼠标滚轮触发
native DzTriggerRegisterMouseWheelEventByCode takes trigger trig, boolean sync, code funcHandle returns nothing
// 注册鼠标移动触发
native DzTriggerRegisterMouseMoveEvent takes trigger trig, boolean sync, string func returns nothing
// 注册鼠标移动触发
native DzTriggerRegisterMouseMoveEventByCode takes trigger trig, boolean sync, code funcHandle returns nothing
// 获取触发器的按键码
native DzGetTriggerKey takes nothing returns integer
// 获取滚轮delta
native DzGetWheelDelta takes nothing returns integer
// 判断按键是否按下
native DzIsKeyDown takes integer iKey returns boolean
// 获取触发key的玩家
native DzGetTriggerKeyPlayer takes nothing returns player
// 获取war3窗口宽度
native DzGetWindowWidth takes nothing returns integer
// 获取war3窗口高度
native DzGetWindowHeight takes nothing returns integer
// 获取war3窗口X坐标
native DzGetWindowX takes nothing returns integer
// 获取war3窗口Y坐标
native DzGetWindowY takes nothing returns integer
// 注册war3窗口大小变化事件
native DzTriggerRegisterWindowResizeEvent takes trigger trig, boolean sync, string func returns nothing
// 注册war3窗口大小变化事件
native DzTriggerRegisterWindowResizeEventByCode takes trigger trig, boolean sync, code funcHandle returns nothing
// 判断窗口是否激活
native DzIsWindowActive takes nothing returns boolean
// 设置可摧毁物位置
native DzDestructablePosition takes destructable d, real x, real y returns nothing
// 设置单位位置-本地调用
native DzSetUnitPosition takes unit whichUnit, real x, real y returns nothing
// 异步执行函数
native DzExecuteFunc takes string funcName returns nothing
// 取鼠标指向的单位
native DzGetUnitUnderMouse takes nothing returns unit
// 设置单位的贴图
native DzSetUnitTexture takes unit whichUnit, string path, integer texId returns nothing
//  设置内存数值
native DzSetMemory takes integer address, real value returns nothing
//  替换单位类型 [BZAPI]
native DzSetUnitID takes unit whichUnit, integer id returns nothing
//  替换单位模型 [BZAPI]
native DzSetUnitModel takes unit whichUnit, string path returns nothing
//  原生 - 设置小地图背景贴图
native DzSetWar3MapMap takes string map returns nothing
// 注册数据同步触发器
native DzTriggerRegisterSyncData takes trigger trig, string prefix, boolean server returns nothing
// 同步游戏数据
native DzSyncData takes string prefix, string data returns nothing
// 获取同步的数据
native DzGetTriggerSyncData takes nothing returns string
// 获取同步数据的玩家
native DzGetTriggerSyncPlayer takes nothing returns player
// 隐藏界面元素
native DzFrameHideInterface takes nothing returns nothing
// 修改游戏世界窗口位置
native DzFrameEditBlackBorders takes real upperHeight, real bottomHeight returns nothing
// 头像
native DzFrameGetPortrait takes nothing returns integer
// 小地图
native DzFrameGetMinimap takes nothing returns integer
// 技能按钮
native DzFrameGetCommandBarButton takes integer row, integer column returns integer
// 英雄按钮
native DzFrameGetHeroBarButton takes integer buttonId returns integer
// 英雄血条
native DzFrameGetHeroHPBar takes integer buttonId returns integer
// 英雄蓝条
native DzFrameGetHeroManaBar takes integer buttonId returns integer
// 道具按钮
native DzFrameGetItemBarButton takes integer buttonId returns integer
// 小地图按钮
native DzFrameGetMinimapButton takes integer buttonId returns integer
// 左上菜单按钮
native DzFrameGetUpperButtonBarButton takes integer buttonId returns integer
// 鼠标提示
native DzFrameGetTooltip takes nothing returns integer
// 聊天信息
native DzFrameGetChatMessage takes nothing returns integer
// 单位信息
native DzFrameGetUnitMessage takes nothing returns integer
// 获取最上的信息
native DzFrameGetTopMessage takes nothing returns integer
// 取rgba色值
native DzGetColor takes integer r, integer g, integer b, integer a returns integer
// 设置界面更新回调（非同步）
native DzFrameSetUpdateCallback takes string func returns nothing
// 界面更新回调
native DzFrameSetUpdateCallbackByCode takes code funcHandle returns nothing
// 显示/隐藏窗体
native DzFrameShow takes integer frame, boolean enable returns nothing
// 创建窗体
native DzCreateFrame takes string frame, integer parent, integer id returns integer
// 创建简单的窗体
native DzCreateSimpleFrame takes string frame, integer parent, integer id returns integer
// 销毁窗体
native DzDestroyFrame takes integer frame returns nothing
// 加载内容目录 (Toc table of contents)
native DzLoadToc takes string fileName returns nothing
// 设置窗体相对位置 [0:左上|1:上|2:右上|3:左|4:中|5:右|6:左下|7:下|8:右下]
native DzFrameSetPoint takes integer frame, integer point, integer relativeFrame, integer relativePoint, real x, real y returns nothing
// 设置窗体绝对位置
native DzFrameSetAbsolutePoint takes integer frame, integer point, real x, real y returns nothing
// 清空窗体锚点
native DzFrameClearAllPoints takes integer frame returns nothing
// 设置窗体禁用/启用
native DzFrameSetEnable takes integer name, boolean enable returns nothing
// 注册用户界面事件回调
native DzFrameSetScript takes integer frame, integer eventId, string func, boolean sync returns nothing
//  注册UI事件回调(func handle)
native DzFrameSetScriptByCode takes integer frame, integer eventId, code funcHandle, boolean sync returns nothing
// 获取触发用户界面事件的玩家
native DzGetTriggerUIEventPlayer takes nothing returns player
// 获取触发用户界面事件的窗体
native DzGetTriggerUIEventFrame takes nothing returns integer
// 通过名称查找窗体
native DzFrameFindByName takes string name, integer id returns integer
// 通过名称查找普通窗体
native DzSimpleFrameFindByName takes string name, integer id returns integer
// 查找字符串
native DzSimpleFontStringFindByName takes string name, integer id returns integer
// 查找BACKDROP frame
native DzSimpleTextureFindByName takes string name, integer id returns integer
// 获取游戏用户界面
native DzGetGameUI takes nothing returns integer
// 点击窗体
native DzClickFrame takes integer frame returns nothing
// 自定义屏幕比例
native DzSetCustomFovFix takes real value returns nothing
// 使用宽屏模式
native DzEnableWideScreen takes boolean enable returns nothing
// 设置文字（支持EditBox, TextFrame, TextArea, SimpleFontString、GlueEditBoxWar3、SlashChatBox、TimerTextFrame、TextButtonFrame、GlueTextButton）
native DzFrameSetText takes integer frame, string text returns nothing
// 获取文字（支持EditBox, TextFrame, TextArea, SimpleFontString）
native DzFrameGetText takes integer frame returns string
// 设置字数限制（支持EditBox）
native DzFrameSetTextSizeLimit takes integer frame, integer size returns nothing
// 获取字数限制（支持EditBox）
native DzFrameGetTextSizeLimit takes integer frame returns integer
// 设置文字颜色（支持TextFrame, EditBox）
native DzFrameSetTextColor takes integer frame, integer color returns nothing
// 获取鼠标所在位置的用户界面控件指针
native DzGetMouseFocus takes nothing returns integer
// 设置所有锚点到目标窗体上
native DzFrameSetAllPoints takes integer frame, integer relativeFrame returns boolean
// 设置焦点
native DzFrameSetFocus takes integer frame, boolean enable returns boolean
// 设置模型（支持Sprite、Model、StatusBar）
native DzFrameSetModel takes integer frame, string modelFile, integer modelType, integer flag returns nothing
// 获取控件是否启用
native DzFrameGetEnable takes integer frame returns boolean
// 设置透明度（0-255）
native DzFrameSetAlpha takes integer frame, integer alpha returns nothing
// 获取透明度（0-255）
native DzFrameGetAlpha takes integer frame returns integer
// 设置动画
native DzFrameSetAnimate takes integer frame, integer animId, boolean autocast returns nothing
// 设置动画进度（autocast为false是可用）
native DzFrameSetAnimateOffset takes integer frame, real offset returns nothing
// 设置texture（支持Backdrop、SimpleStatusBar）
native DzFrameSetTexture takes integer frame, string texture, integer flag returns nothing
// 设置缩放
native DzFrameSetScale takes integer frame, real scale returns nothing
// 设置提示
native DzFrameSetTooltip takes integer frame, integer tooltip returns nothing
// 鼠标限制在用户界面内
native DzFrameCageMouse takes integer frame, boolean enable returns nothing
// 获取当前值（支持Slider、SimpleStatusBar、StatusBar）
native DzFrameGetValue takes integer frame returns real
// 设置最大最小值（支持Slider、SimpleStatusBar、StatusBar）
native DzFrameSetMinMaxValue takes integer frame, real minValue, real maxValue returns nothing
// 设置Step值（支持Slider）
native DzFrameSetStepValue takes integer frame, real step returns nothing
// 设置当前值（支持Slider、SimpleStatusBar、StatusBar）
native DzFrameSetValue takes integer frame, real value returns nothing
// 设置窗体大小
native DzFrameSetSize takes integer frame, real w, real h returns nothing
// 根据tag创建窗体
native DzCreateFrameByTagName takes string frameType, string name, integer parent, string template, integer id returns integer
// 设置颜色（支持SimpleStatusBar）
native DzFrameSetVertexColor takes integer frame, integer color returns nothing
// 不明觉厉
native DzOriginalUIAutoResetPoint takes boolean enable returns nothing
//  设置优先级 [NEW]
native DzFrameSetPriority takes integer frame, integer priority returns nothing
//  设置父窗口 [NEW]
native DzFrameSetParent takes integer frame, integer parent returns nothing
//  设置字体 [NEW]
native DzFrameSetFont takes integer frame, string fileName, real height, integer flag returns nothing
//  获取 Frame 的 高度 [NEW]
native DzFrameGetHeight takes integer frame returns real
//  设置对齐方式 [NEW]
native DzFrameSetTextAlignment takes integer frame, integer align returns nothing
//  获取 Frame 的 Parent [NEW]
native DzFrameGetParent takes integer frame returns integer
//显示/隐藏SimpleFrame
//native DzSimpleFrameShow takes integer frame, boolean enable returns nothing
// 追加文字（支持TextArea）
native DzFrameAddText takes integer frame, string text returns nothing
// 沉默单位-禁用技能
native DzUnitSilence takes unit whichUnit, boolean disable returns nothing
// 禁用攻击
native DzUnitDisableAttack takes unit whichUnit, boolean disable returns nothing
// 禁用道具
native DzUnitDisableInventory takes unit whichUnit, boolean disable returns nothing
// 刷新小地图
native DzUpdateMinimap takes nothing returns nothing
// 修改单位alpha
native DzUnitChangeAlpha takes unit whichUnit, integer alpha, boolean forceUpdate returns nothing
// 设置单位是否可以选中
native DzUnitSetCanSelect takes unit whichUnit, boolean state returns nothing
// 修改单位是否可以被设置为目标
native DzUnitSetTargetable takes unit whichUnit, boolean state returns nothing
// 保存内存数据
native DzSaveMemoryCache takes string cache returns nothing
// 读取内存数据
native DzGetMemoryCache takes nothing returns string
// 设置加速倍率
native DzSetSpeed takes real ratio returns nothing
// 转换世界坐标为屏幕坐标-异步
native DzConvertWorldPosition takes real x, real y, real z, code callback returns boolean
// 转换世界坐标为幕坐标-获取转换后的X坐标
native DzGetConvertWorldPositionX takes nothing returns real
// 转换世界坐标为屏幕坐标-获取转换后的Y坐标
native DzGetConvertWorldPositionY takes nothing returns real
// 创建command button
native DzCreateCommandButton takes integer parent, string icon, string name, string desc returns integer
//玩家是否拥有地图商城道具
//"获取 ",~whichPlayer," 是否拥有:",~key," 对应的地图商城道具."
//检测玩家背包中是否拥该道具且处于有效状态。已过期的时效性道具、剩余数量为0的数量型道具均视为无效；"
native DzAPI_Map_HasMallItem takes player whichPlayer, string key returns boolean

// 获得玩家服务器值是否成功
// 如果返回false代表读取失败,反之成功,之后游戏里平台不会再发送"服务器保存失败"的信息，
// 所以希望地图作者在游戏开始给玩家发下信息服务器存档是否正确读取。
function GetPlayerServerValueSuccess takes player whichPlayer returns boolean
	if(DzAPI_Map_GetServerValueErrorCode(whichPlayer)==0)then
		return true
	else
		return false
	endif
endfunction

// 保存整数数据
// 这是经过封装的接口，实际Key会在原Key前面加"I"，（如您的key是AA，实际key为IAA。
// 【IAA用于开发者平台填写，在编辑器上获取和读都填写AA就可以了】）
function DzAPI_Map_StoreInteger takes player whichPlayer, string key, integer value returns nothing
	set key="I"+key
	call DzAPI_Map_SaveServerValue(whichPlayer,key,I2S(value))
	set key=null
	set whichPlayer=null
endfunction

// 获取整数数据
// 这是经过封装的接口，实际Key会在原Key前面加"I"
function DzAPI_Map_GetStoredInteger takes player whichPlayer, string key returns integer
	local integer value
	set key="I"+key
	set value=S2I(DzAPI_Map_GetServerValue(whichPlayer,key))
	set key=null
	set whichPlayer=null
	return value
endfunction

// 保存实数数据
// 这是经过封装的接口，实际Key会在原Key前面加"R"，（如您的key是AA，实际key为RAA。
// 【RAA用于开发者平台填写，在编辑器上获取和读都填写AA就可以了】
function DzAPI_Map_StoreReal takes player whichPlayer, string key, real value returns nothing
	set key="R"+key
	call DzAPI_Map_SaveServerValue(whichPlayer,key,R2S(value))
	set key=null
	set whichPlayer=null
endfunction

// 获取实数数据
// 这是经过封装的接口，实际Key会在原Key前面加"R"
function DzAPI_Map_GetStoredReal takes player whichPlayer, string key returns real
	local real value
	set key="R"+key
	set value=S2R(DzAPI_Map_GetServerValue(whichPlayer,key))
	set key=null
	set whichPlayer=null
	return value
endfunction

// 保存布尔数据
// 这是经过封装的接口，实际Key会在原Key前面加"B"，（如您的key是AA，实际key为BAA。
// 【BAA用于开发者平台填写，在编辑器上获取和读都填写AA就可以了】）
function DzAPI_Map_StoreBoolean takes player whichPlayer, string key, boolean value returns nothing
	set key="B"+key
	if(value)then
		call DzAPI_Map_SaveServerValue(whichPlayer,key,"1")
	else
		call DzAPI_Map_SaveServerValue(whichPlayer,key,"0")
	endif
	set key=null
	set whichPlayer=null
endfunction

// 获取布尔数据
function DzAPI_Map_GetStoredBoolean takes player whichPlayer, string key returns boolean
	local boolean value
	set key="B"+key
	set key=DzAPI_Map_GetServerValue(whichPlayer,key)
	if(key=="1")then
		set value=true
	else
		set value=false
	endif
	set key=null
	set whichPlayer=null
	return value
endfunction

// 保存字符串数据
function DzAPI_Map_StoreString takes player whichPlayer, string key, string value returns nothing
	set key="S"+key
	call DzAPI_Map_SaveServerValue(whichPlayer,key,value)
	set key=null
	set whichPlayer=null
endfunction

// 获取字符串数据
function DzAPI_Map_GetStoredString takes player whichPlayer, string key returns string
	return DzAPI_Map_GetServerValue(whichPlayer,"S"+key)
endfunction

// 保存单位数据
function DzAPI_Map_GetStoredUnitType takes player whichPlayer, string key returns integer
	local integer value
	set key="I"+key
	set value=S2I(DzAPI_Map_GetServerValue(whichPlayer,key))
	set key=null
	set whichPlayer=null
	return value
endfunction

// 获取技能id
function DzAPI_Map_GetStoredAbilityId takes player whichPlayer, string key returns integer
	local integer value
	set key="I"+key
	set value=S2I(DzAPI_Map_GetServerValue(whichPlayer,key))
	set key=null
	set whichPlayer=null
	return value
endfunction




function DzAPI_Map_FlushStoredMission takes player whichPlayer, string key returns nothing
	call DzAPI_Map_SaveServerValue(whichPlayer,key,null)
	set key=null
	set whichPlayer=null
endfunction

// 上报房间内显示的数据
// 作者可以将游戏内的关键数值或结果上报给平台，用于在平台游戏房间内展示以方便玩家相互快速了解实力，数据上报后需在开发者平台进行配置后才能展示出来。比如：比如获得MVP次数、最高通关难度等。
function DzAPI_Map_Stat_SetStat takes player whichPlayer, string key, string value returns nothing
	call DzAPI_Map_Stat_SetStat(whichPlayer,key,value)
endfunction

// 天梯提交布尔值数据
function DzAPI_Map_Ladder_SubmitBooleanData takes player whichPlayer, string key,boolean value  returns nothing
	if(value)then
		call DzAPI_Map_Ladder_SetStat(whichPlayer,key,"1")
	else
		call DzAPI_Map_Ladder_SetStat(whichPlayer,key,"0")
	endif
endfunction

// 天梯提交字符串数据
function DzAPI_Map_Ladder_SetStat takes player whichPlayer, string key, string value returns nothing
	call DzAPI_Map_Ladder_SetStat(whichPlayer,key,value)
endfunction

// 天梯提交整数数据
function DzAPI_Map_Ladder_SubmitIntegerData takes player whichPlayer, string key, integer value returns nothing
	call DzAPI_Map_Ladder_SetStat(whichPlayer,key,I2S(value))
endfunction

// 天梯提交单位类型数据
function DzAPI_Map_Stat_SubmitUnitIdData takes player whichPlayer, string key,integer value returns nothing
	if(value==0)then
		//call DzAPI_Map_Ladder_SetStat(whichPlayer,key,"0")
	else
		call DzAPI_Map_Ladder_SetStat(whichPlayer,key,I2S(value))
	endif
endfunction

// 天梯提交技能数据
function DzAPI_Map_Ladder_SubmitAblityIdData takes player whichPlayer, string key, integer value returns nothing
	if(value==0)then
		//call DzAPI_Map_Ladder_SetStat(whichPlayer,key,"0")
	else
		call DzAPI_Map_Ladder_SetStat(whichPlayer,key,I2S(value))
	endif
endfunction

// 天梯提交物品数据
function DzAPI_Map_Ladder_SubmitItemIdData takes player whichPlayer, string key, integer value returns nothing
	local string S
	if(value==0)then
		set S="0"
	else
		set S=I2S(value)
		call DzAPI_Map_Ladder_SetStat(whichPlayer,key,S)
	endif
	//call DzAPI_Map_Ladder_SetStat(whichPlayer,key,S)
	set S=null
	set whichPlayer=null
endfunction

// 天梯提交获得称号
function DzAPI_Map_Ladder_SubmitTitle takes player whichPlayer, string value  returns nothing
	call DzAPI_Map_Ladder_SetStat(whichPlayer,value,"1")
endfunction

// 天梯提交玩家排名
function DzAPI_Map_Ladder_SubmitPlayerRank takes player whichPlayer, integer value returns nothing
	call DzAPI_Map_Ladder_SetPlayerStat(whichPlayer,"RankIndex",I2S(value))
endfunction

// 天梯设置玩家额外分(最多30分)
function DzAPI_Map_Ladder_SubmitPlayerExtraExp takes player whichPlayer, integer value returns nothing
	call DzAPI_Map_Ladder_SetStat(whichPlayer,"ExtraExp",I2S(value))
endfunction


//玩家累计游戏局数
function DzAPI_Map_PlayedGames takes player whichPlayer returns integer
	return RequestExtraIntegerData(45, whichPlayer, null, null, false, 0, 0, 0)
endfunction

//获取玩家的评论次数，该功能已失效，始终返回1
function DzAPI_Map_CommentCount takes player whichPlayer returns integer
	return RequestExtraIntegerData(46, whichPlayer, null, null, false, 0, 0, 0)
endfunction

//玩家好友数量【废弃】,该功能废弃
function DzAPI_Map_FriendCount takes player whichPlayer returns integer
	return RequestExtraIntegerData(47, whichPlayer, null, null, false, 0, 0, 0)
endfunction

//玩家是否平台认证的鉴赏家[废弃]
function DzAPI_Map_IsConnoisseur takes player whichPlayer returns boolean
	return RequestExtraBooleanData(48, whichPlayer, null, null, false, 0, 0, 0)
endfunction

//玩家是否当前地图作者
function DzAPI_Map_IsAuthor takes player whichPlayer returns boolean
	return RequestExtraBooleanData(50, whichPlayer, null, null, false, 0, 0, 0)
endfunction

function DzAPI_Map_CommentTotalCount takes nothing returns integer
	return RequestExtraIntegerData(51, null, null, null, false, 0, 0, 0)
endfunction

//上报埋点数据： ",~whichPlayer,"，埋点key：",~eventKey,"，子key：",~不填,"，次数 ",~value
//可以在游戏内的关键行为操作进行埋点，以便进行游戏内的玩家行为数据统计分析（比如某个英雄选择次数），上报前需先在开发者平台创建埋点。
function DzAPI_Map_Statistics takes player whichPlayer, string eventKey, string eventType, integer value returns nothing
	call RequestExtraBooleanData(34, whichPlayer, eventKey, eventType, false, value, 0, 0)
endfunction

//是否回流/收藏过地图的用户
//超过7天未玩地图的用户再次登录被称为地图回流用户，地图回流BUFF会存在7天，7天后消失。平台回流用户的BUFF存在15天，15天后消失。建议设置奖励，鼓励玩家回来玩地图！
function DzAPI_Map_Returns takes player whichPlayer, integer label returns boolean
	return RequestExtraBooleanData(53, whichPlayer, null, null, false, label, 0, 0)
endfunction


// ~whichPlayer," 在 ",~id," 地图的地图签到数据。"
// 获取玩家在指定地图的地图签到数据。
function DzAPI_Map_ContinuousCount takes player whichPlayer, integer id returns integer
	return RequestExtraIntegerData(54, whichPlayer, null, null, false, id, 0, 0)
endfunction

// IsPlayer,                      //是否为玩家
function DzAPI_Map_IsPlayer takes player whichPlayer returns boolean
	return RequestExtraBooleanData(55, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// MapsTotalPlayed,               //所有地图的总游戏时长
function DzAPI_Map_MapsTotalPlayed takes player whichPlayer returns integer
	return RequestExtraIntegerData(56, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// MapsLevel,                    //指定地图的地图等级
function DzAPI_Map_MapsLevel takes player whichPlayer, integer mapId returns integer
	return RequestExtraIntegerData(57, whichPlayer, null, null, false, mapId, 0, 0)
endfunction

// MapsConsumeGold,              //所有地图的金币消耗
function DzAPI_Map_MapsConsumeGold takes player whichPlayer, integer mapId returns integer
	return RequestExtraIntegerData(58, whichPlayer, null, null, false, mapId, 0, 0)
endfunction

// MapsConsumeLumber,            //所有地图的木材消耗
function DzAPI_Map_MapsConsumeLumber takes player whichPlayer, integer mapId returns integer
	return RequestExtraIntegerData(59, whichPlayer, null, null, false, mapId, 0, 0)
endfunction

// MapsConsumeLv1,               //消费 1-199
function DzAPI_Map_MapsConsumeLv1 takes player whichPlayer, integer mapId returns boolean
	return RequestExtraBooleanData(60, whichPlayer, null, null, false, mapId, 0, 0)
endfunction

// MapsConsumeLv2,               //消费 200-499
function DzAPI_Map_MapsConsumeLv2 takes player whichPlayer, integer mapId returns boolean
	return RequestExtraBooleanData(61, whichPlayer, null, null, false, mapId, 0, 0)
endfunction

// MapsConsumeLv3,               //消费 500~999
function DzAPI_Map_MapsConsumeLv3 takes player whichPlayer, integer mapId returns boolean
	return RequestExtraBooleanData(62, whichPlayer, null, null, false, mapId, 0, 0)
endfunction

// MapsConsumeLv4,               //消费 1000+
function DzAPI_Map_MapsConsumeLv4 takes player whichPlayer, integer mapId returns boolean
	return RequestExtraBooleanData(63, whichPlayer, null, null, false, mapId, 0, 0)
endfunction

// IsPlayerUsingSkin,            //检查是否装备着皮肤（skinType头像=1、边框=2、称号=3、底纹=4）
function DzAPI_Map_IsPlayerUsingSkin takes player whichPlayer, integer skinType, integer id returns boolean
	return RequestExtraBooleanData(64,whichPlayer, null, null, false, skinType, id, 0)
endfunction
//获取论坛数据（0=累计获得赞数，1=精华帖数量，2=发表回复次数，3=收到的欢乐数，4=是否发过贴子，5=是否版主，6=主题数量）
function DzAPI_Map_GetForumData takes player whichPlayer, integer whichData returns integer
	return RequestExtraIntegerData(65, whichPlayer, null, null, false, whichData, 0, 0)
endfunction

// PlayerFlags,                   //玩家标记 label（1=曾经是平台回流用户，2=当前是平台回流用户，4=曾经是地图回流用户，8=当前是地图回流用户，16=地图是否被玩家收藏）
function DzAPI_Map_PlayerFlags takes player whichPlayer, integer label returns boolean
	return RequestExtraBooleanData(53, whichPlayer, null, null, false, label, 0, 0)
endfunction

// GetLotteryUsedCount, // 获取宝箱抽取次数
function DzAPI_Map_GetLotteryUsedCountEx takes player whichPlayer,integer index returns integer
	return RequestExtraIntegerData(68, whichPlayer, null, null, false, index, 0, 0)
endfunction

//玩家抽取地图宝箱总次数
function DzAPI_Map_GetLotteryUsedCount takes player whichPlayer returns integer
	return DzAPI_Map_GetLotteryUsedCountEx(whichPlayer,0)+DzAPI_Map_GetLotteryUsedCountEx(whichPlayer,1)+DzAPI_Map_GetLotteryUsedCountEx(whichPlayer,2)
endfunction

//打开地图商城道具购买界面
//~whichPlayer," 打开地图商城道具 ",~道具key," 购买界面"
//打开游戏内置商城的道具购买页面，用于作者在地图内开发引导消费场景。购买成功后可通过玩家获得平台道具事件实现在游戏内立即生效。
function DzAPI_Map_OpenMall takes player whichPlayer,string whichkey returns boolean
	return RequestExtraBooleanData(66, whichPlayer, whichkey, null, false, 0, 0, 0)
endfunction


function DzAPI_Map_GameResult_CommitData takes player whichPlayer, string key, string value returns nothing
	call RequestExtraIntegerData(69, whichPlayer, key, value, false, 0, 0, 0)
endfunction

//游戏结算
function DzAPI_Map_GameResult_CommitTitle takes player whichPlayer, string value  returns nothing
	call DzAPI_Map_GameResult_CommitData(whichPlayer,value,"1")
	set whichPlayer=null
	set value=null
endfunction
function DzAPI_Map_GameResult_CommitPlayerRank takes player whichPlayer, integer value returns nothing
	call DzAPI_Map_GameResult_CommitData(whichPlayer,"RankIndex",I2S(value))
	set whichPlayer=null
	set value=0
endfunction
function DzAPI_Map_GameResult_CommitGameMode takes string value returns nothing
	call DzAPI_Map_GameResult_CommitData(GetLocalPlayer(),"InnerGameMode",value)
	set value=null
endfunction
function DzAPI_Map_GameResult_CommitGameResult takes player whichPlayer, integer value returns nothing
	call DzAPI_Map_GameResult_CommitData(whichPlayer,"GameResult",I2S(value))
	set whichPlayer=null
endfunction

function DzAPI_Map_GameResult_CommitGameResultNoEnd takes player whichPlayer, integer value returns nothing
	call DzAPI_Map_GameResult_CommitData(whichPlayer,"GameResultNoEnd",I2S(value))
	set whichPlayer=null
endfunction

// GetSinceLastPlayedSeconds, // 获取距最后一次游戏的秒数
function DzAPI_Map_GetSinceLastPlayedSeconds takes player whichPlayer returns integer
	return RequestExtraIntegerData(70, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// QuickBuy, //游戏内快速购买
function DzAPI_Map_QuickBuy takes player whichPlayer, string key, integer count, integer seconds returns boolean
	return RequestExtraBooleanData(72, whichPlayer, key, null, false, count, seconds, 0)
endfunction

// CancelQuickBuy, //取消快速购买
function DzAPI_Map_CancelQuickBuy takes player whichPlayer returns boolean
	return RequestExtraBooleanData(73, whichPlayer, null, null, false, 0, 0, 0)
endfunction

//判断是加载成功某个玩家的道具
function DzAPI_Map_PlayerLoadedItems takes player whichPlayer returns boolean
	return RequestExtraBooleanData(77, whichPlayer, null, null, false, 0, 0, 0)
endfunction

function DzAPI_Map_CustomRankCount takes integer id returns integer
	return RequestExtraIntegerData(78, null, null, null, false, id, 0, 0)
endfunction

// CustomRankPlayerName            // 获取排行榜上指定排名的用户名称
function DzAPI_Map_CustomRankPlayerName takes integer id, integer ranking returns string
	return RequestExtraStringData(79, null, null, null, false, id, ranking, 0)
endfunction

// CustomRankPlayerValue           // 获取排行榜上指定排名的值
function DzAPI_Map_CustomRankValue takes integer id, integer ranking returns integer
	return RequestExtraIntegerData(80, null, null, null, false, id, ranking, 0)
endfunction

//获取玩家在KK平台的完整昵称（基础昵称#编号）
function DzAPI_Map_GetPlayerUserName takes player whichPlayer returns string
	return RequestExtraStringData(81, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// GetServerValueLimitLeft,   // 获取服务器档限制余额
function KKApiGetServerValueLimitLeft takes player whichPlayer, string key returns integer
	return RequestExtraIntegerData(82, whichPlayer, key, null, false, 0, 0, 0)
endfunction

// RequestBackendLogic,       //请求后端逻辑生成
function KKApiRequestBackendLogic takes player whichPlayer, string key, string groupkey returns boolean
	return RequestExtraBooleanData(83, whichPlayer, key, groupkey, false, 0, 0, 0)
endfunction

// CheckBackendLogicExists,   // 获取后端逻辑生成结果 是否存在
function KKApiCheckBackendLogicExists takes player whichPlayer, string key returns boolean
	return RequestExtraBooleanData(84, whichPlayer, key, null, false, 0, 0, 0)
endfunction

// GetBackendLogicIntResult,  // 获取后端逻辑生成结果 整型
function KKApiGetBackendLogicIntResult takes player whichPlayer, string key returns integer
	return RequestExtraIntegerData(85, whichPlayer, key, null, false, 0, 0, 0)
endfunction

// GetBackendLogicStrResult,  // 获取后端逻辑生成结果 字符串
function KKApiGetBackendLogicStrResult takes player whichPlayer, string key returns string
	return RequestExtraStringData(86, whichPlayer, key, null, false, 0, 0, 0)
endfunction

// GetBackendLogicUpdateTime, // 获取后端逻辑生成时间
function KKApiGetBackendLogicUpdateTime takes player whichPlayer, string key returns integer
	return RequestExtraIntegerData(87, whichPlayer, key, null, false, 0, 0, 0)
endfunction

// GetBackendLogicGroup,      // 获取后端逻辑生成组
function KKApiGetBackendLogicGroup takes player whichPlayer, string key returns string
	return RequestExtraStringData(88, whichPlayer, key, null, false, 0, 0, 0)
endfunction

// RemoveBackendLogicResult,  // 删除后端逻辑生成结果
function KKApiRemoveBackendLogicResult takes player whichPlayer, string key returns boolean
	return RequestExtraBooleanData(89, whichPlayer, key, null, false, 0, 0, 0)
endfunction

// 获取随机存档剩余次数
function KKApiRandomSaveGameCount takes player whichPlayer, string groupkey returns integer
	return RequestExtraIntegerData(101, whichPlayer, groupkey, null, false, 0, 0, 0)
endfunction

// 注册随机存档更新事件
// 当玩家随机存档更新的时候触发该事件。用"当前变动的随机存档"来获取变动的随机存档key。
function KKApiTriggerRegisterBackendLogicUpdata takes trigger trig returns nothing
	call DzTriggerRegisterSyncData(trig, "DZBLU", true)
endfunction

// 注册随机存档删除事件
// 当玩家随机存档删除的时候触发该事件。用"当前变动的随机存档"来获取变动的随机存档key
function KKApiTriggerRegisterBackendLogicDelete takes trigger trig returns nothing
	call DzTriggerRegisterSyncData(trig, "DZBLD", true)
endfunction

// 获取变动的随机存档
// 用在注册随机存档更新和删除事件之后
function KKApiGetSyncBackendLogic takes nothing returns string
	return DzGetTriggerSyncData()
endfunction

// 是否在平台正常游戏中
// 主要试用于平台运行中区分正常游戏和观战模式，返回true代表是正常游戏模式，反之为观战模式
function KKApiIsGameMode takes nothing returns boolean
	return RequestExtraBooleanData(90, null, null, null, false, 0, 0, 0)
endfunction

// 初始化平台键位显示设置
// 初始化键位设置会显示在平台改键界面上，最多2套方案
function KKApiInitializeGameKey takes player whichPlayer,integer setIndex, string k,string data returns boolean
	return RequestExtraBooleanData(91, whichPlayer, "[{\"name\":\""+data+"\",\"key\":\""+k+"\"}]", null, false, setIndex, 0, 0)
endfunction

// 获取玩家的平台ID
// 返回的是一个32位的字符串
function KKApiPlayerGUID takes player whichPlayer returns string
	return RequestExtraStringData(93, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// 玩家地图任务状态
function KKApiIsTaskInProgress takes player whichPlayer,integer setIndex,integer taskstat returns boolean
	return RequestExtraIntegerData(94, whichPlayer, null, null, false, setIndex, 0, 0)==taskstat
endfunction

// 玩家地图任务当前进度
function KKApiQueryTaskCurrentProgress takes player whichPlayer, integer setIndex returns integer
	return RequestExtraIntegerData(95, whichPlayer, null, null, false, setIndex, 0, 0)
endfunction

// 玩家地图任务总进度
function KKApiQueryTaskTotalProgress takes player whichPlayer, integer setIndex returns integer
	return RequestExtraIntegerData(96, whichPlayer, null, null, false, setIndex, 0, 0)
endfunction

// 玩家平台该地图成就是否完成
// 完成返回true
function KKApiIsAchievementCompleted takes player whichPlayer, string id returns boolean
	return RequestExtraBooleanData(98, whichPlayer, id, null, false, 0, 0, 0)
endfunction

// 玩家平台该地图成就点数
function KKApiAchievementPoints takes player whichPlayer returns integer
	return RequestExtraIntegerData(99, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// 判定测试大厅游戏时长区间
// 判断测试大厅游戏时长是否满足该区间，0表示不限制，单位为小时
function KKApiPlayedTime takes player whichPlayer, integer minHours, integer maxHours returns boolean
	return RequestExtraBooleanData(100, whichPlayer, null, null, false, minHours, maxHours, 0)
endfunction

// 注册天梯投降事件
// 当玩家在天梯投降时候触发该事件。用"获取投降的队伍id"来获取。
function KKApiTriggerRegisterLadderSurrender takes trigger trig returns nothing
	call DzTriggerRegisterSyncData(trig, "DZSR", true)
endfunction

// 获取天梯投降的队伍ID
// 用于天梯投降事件动作里
function KKApiGetLadderSurrenderTeamId takes nothing returns integer
	return S2I(DzGetTriggerSyncData())
endfunction

// 获取公会等级
function KKApiGetGuildLevel takes player whichPlayer returns integer
	return RequestExtraIntegerData(106, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// 获取平台宠物探险次数
function KKApiMapExplorationNum takes player whichPlayer returns integer
	return RequestExtraIntegerData(107, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// 获取平台宠物探险时间
function KKApiMapExplorationTime takes player whichPlayer returns integer
	return RequestExtraIntegerData(108, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// 测试大厅预约人数
function KKApiMapOrderNum takes nothing returns integer
	return RequestExtraIntegerData(109, null, null, null, false, 0, 0, 0)
endfunction

// 获取选中的主选英雄单位
native DzGetSelectedLeaderUnit takes nothing returns unit

// 判断聊天框是否打开
native DzIsChatBoxOpen takes nothing returns boolean

// 设置单位的鼠标指向UI和血条显示/隐藏
native DzSetUnitPreselectUIVisible takes unit whichUnit, boolean visible returns nothing

// 设置特效播放动画
// 设置特效播放第N号动画,可指定播放方式
native DzSetEffectAnimation takes effect whichEffect, integer index, integer flag returns nothing

// 设置特效坐标
// 可以精确设置特效的X,Y,Z坐标位置
native DzSetEffectPos takes effect whichEffect, real x, real y, real z returns nothing

// 设置特效颜色
// 可以改变特效的RGB颜色值
native DzSetEffectVertexColor takes effect whichEffect, integer color returns nothing

// 设置特效透明度
// 可以设置特效的透明度(0-255)
native DzSetEffectVertexAlpha takes effect whichEffect, integer alpha returns nothing

// 设置特效模型
// 可以更换特效使用的模型文件
native DzSetEffectModel takes effect whichEffect, string model returns nothing

// 设置特效队伍颜色
// 可以改变特效的队伍颜色
native DzSetEffectTeamColor takes effect whichHandle, integer playerId returns nothing

// 设置控件视口
// 设置控件视口后，他的子控件在边缘超出部分不会显示
native DzFrameSetClip takes integer whichframe, boolean enable returns nothing

// 设置魔兽窗口大小
// 如修改窗口模式下的窗口大小为 1920/1080
native DzChangeWindowSize takes integer width, integer height returns boolean

// 设置特效播放动画
// 变身动画才需要附加链接名,一般情况填 "" 空字符串就行
native DzPlayEffectAnimation takes effect whichEffect, string anim, string link returns nothing

// 绑定特效
// 可以将特效绑定到单位的指定附着点上
native DzBindEffect takes widget parent, string attachPoint, effect whichEffect returns nothing

// 解除绑定特效
// 可以让绑定在单位身上的特效分离出来，被分离的特效能设置坐标、缩放
native DzUnbindEffect takes effect whichEffect returns nothing

// 单位缩放
// 可以用来缩放单位的大小
native DzSetWidgetSpriteScale takes widget whichUnit, real scale returns nothing

// 特效缩放
// 可以用来缩放特效的大小
native DzSetEffectScale takes effect whichHandle, real scale returns nothing

// 获取特效颜色
native DzGetEffectVertexColor takes effect whichEffect returns integer

// 获取特效透明度
native DzGetEffectVertexAlpha takes effect whichEffect returns integer

// 获取物品技能
native DzGetItemAbility takes item whichEffect, integer index returns ability

// 获取控件子节点数量
native DzFrameGetChildrenCount takes integer whichframe returns integer

// 获取控件子节点
native DzFrameGetChild takes integer whichframe, integer index returns integer

// 解锁BLP像素限制
// 填true会解除原本魔兽高清图片的512像素限制
native DzUnlockBlpSizeLimit takes boolean enable returns nothing

// 获取商店的顾客单位
native DzGetActivePatron takes unit store, player p returns unit

// 获取本地选择单位数量
native DzGetLocalSelectUnitCount takes nothing returns integer

// 获取本地选择的单位
native DzGetLocalSelectUnit takes integer index returns unit

// 获取JASS字符串表数量
native DzGetJassStringTableCount takes nothing returns integer

// 清除模型内存缓存
// 清除指定模型的内存缓存
native DzModelRemoveFromCache takes string path returns nothing

// 清除所有模型内存缓存
// 清除所有已加载模型的内存缓存
native DzModelRemoveAllFromCache takes nothing returns nothing

// 获取信息面板选择按钮
native DzFrameGetInfoPanelSelectButton takes integer index returns integer

// 获取信息面板Buff按钮
native DzFrameGetInfoPanelBuffButton takes integer index returns integer

// 获取农民建造条
native DzFrameGetPeonBar takes nothing returns integer

// 获取命令按钮数字文本
native DzFrameGetCommandBarButtonNumberText takes integer whichframe returns integer

// 获取命令按钮数字覆盖层
native DzFrameGetCommandBarButtonNumberOverlay takes integer whichframe returns integer

// 获取命令按钮冷却指示器
native DzFrameGetCommandBarButtonCooldownIndicator takes integer whichframe returns integer

// 获取命令按钮自动施法指示器
native DzFrameGetCommandBarButtonAutoCastIndicator takes integer whichframe returns integer

// 设置FPS显示/隐藏
native DzToggleFPS takes boolean show returns nothing

// 获取当前FPS值
native DzGetFPS takes nothing returns integer

// 转换世界坐标为小地图X坐标
native DzFrameWorldToMinimapPosX takes real x, real y returns real

// 转换世界坐标为小地图Y坐标
native DzFrameWorldToMinimapPosY takes real x, real y returns real

// 自定义指定单位的小地图图标
// 图标大小只支持16×16，设置图标之前需要开启：中立建筑 - 小地图特殊标志
native DzWidgetSetMinimapIcon takes unit whichunit, string path returns nothing

// 开启/关闭自定义指定单位的小地图图标
native DzWidgetSetMinimapIconEnable takes unit whichunit, boolean enable returns nothing

// 获取世界消息框架
native DzFrameGetWorldFrameMessage takes nothing returns integer

// 显示游戏提示信息
// 可以设置消息界面显示消息,指定颜色、持续时间和是否永久显示
native DzSimpleMessageFrameAddMessage takes integer whichframe, string text, integer color, real duration, boolean permanent returns nothing

// 清理游戏提示信息
native DzSimpleMessageFrameClear takes integer whichframe returns nothing

// 转换屏幕坐标到世界坐标X
// 将屏幕上的X,Y坐标转换为游戏世界中的X坐标
native DzConvertScreenPositionX takes real x, real y returns real

// 转换屏幕坐标到世界坐标Y
// 将屏幕上的X,Y坐标转换为游戏世界中的Y坐标
native DzConvertScreenPositionY takes real x, real y returns real

// 监听建筑选位置
// 注册一个本地触发器来监听玩家选择建筑位置的事件
native DzRegisterOnBuildLocal takes code func returns nothing

// 获取建筑选位命令ID
// 等于0时表示结束事件
native DzGetOnBuildOrderId takes nothing returns integer

// 获取建筑选位命令类型
native DzGetOnBuildOrderType takes nothing returns integer

// 获取建筑选位的施法单位
native DzGetOnBuildAgent takes nothing returns widget

// 监听技能选目标
// 注册一个本地触发器来监听玩家选择技能目标的事件
native DzRegisterOnTargetLocal takes code func returns nothing

// 获取技能选目标的技能ID
// 等于0时表示结束事件
native DzGetOnTargetAbilId takes nothing returns integer

// 获取技能选目标的命令ID
native DzGetOnTargetOrderId takes nothing returns integer

// 获取技能选目标的命令类型
native DzGetOnTargetOrderType takes nothing returns integer

// 获取技能选目标的施法单位
native DzGetOnTargetAgent takes nothing returns widget

// 获取技能选目标的目标单位
native DzGetOnTargetInstantTarget takes nothing returns widget
// 打开QQ群链接
native DzOpenQQGroupUrl takes string url returns boolean

// 启用/禁用控件裁剪区域
native DzFrameEnableClipRect takes boolean enable returns nothing

// 设置单位名称
native DzSetUnitName takes unit whichUnit, string name returns nothing

// 设置单位头像模型
native DzSetUnitPortrait takes unit whichUnit, string modelFile returns nothing

// 设置单位描述
native DzSetUnitDescription takes unit whichUnit, string value returns nothing

// 设置单位投射物弧度
// 控制单位投射物的抛物线弧度
native DzSetUnitMissileArc takes unit whichUnit, real arc returns nothing

// 设置单位投射物模型
native DzSetUnitMissileModel takes unit whichUnit, string modelFile returns nothing

// 设置单位专有名称
native DzSetUnitProperName takes unit whichUnit, string name returns nothing

// 设置单位投射物追踪
// 启用/禁用单位投射物的追踪能力
native DzSetUnitMissileHoming takes unit whichUnit, boolean enable returns nothing

// 设置单位投射物速度
native DzSetUnitMissileSpeed takes unit whichUnit, real speed returns nothing

// 设置特效显示/隐藏
native DzSetEffectVisible takes effect whichHandle, boolean enable returns nothing

// 复活单位
// 在指定位置复活单位,可设置生命值和魔法值
native DzReviveUnit takes unit whichUnit, player whichPlayer, real hp, real mp, real x, real y returns nothing

// 获取单位攻击技能
native DzGetAttackAbility takes unit whichUnit returns ability

// 结束攻击技能冷却
native DzAttackAbilityEndCooldown takes ability whichHandle returns nothing

// 设置单位数组字符串
native EXSetUnitArrayString takes integer uid, integer id, integer n, string name returns boolean

// 设置单位整数值
native EXSetUnitInteger takes integer uid, integer id, integer n returns boolean

// 设置英雄类型专有名称
function DzSetHeroTypeProperName takes integer uid, string name returns nothing
	call EXSetUnitArrayString(uid, 61, 0, name)
	call EXSetUnitInteger(uid, 61, 1)
endfunction

// 设置单位类型名称
function DzSetUnitTypeName takes integer uid, string name returns nothing
	call EXSetUnitArrayString(uid, 10, 0, name)
	call EXSetUnitInteger(uid, 10, 1)
endfunction

// 判断单位攻击类型
// 检查指定单位的第index个攻击类型是否为指定类型
function DzIsUnitAttackType takes unit whichUnit, integer index, attacktype attackType returns boolean
	return ConvertAttackType(R2I(GetUnitState(whichUnit, ConvertUnitState(16 + 19 * index)))) == attackType
endfunction

// 设置单位攻击类型
// 设置指定单位的第index个攻击类型
function DzSetUnitAttackType takes unit whichUnit, integer index, attacktype attackType returns nothing
	call SetUnitState(whichUnit, ConvertUnitState(16 + 19 * index), GetHandleId(attackType))
endfunction

// 判断单位防御类型
// 检查指定单位的防御类型是否为指定类型
function DzIsUnitDefenseType takes unit whichUnit, integer defenseType returns boolean
	return R2I(GetUnitState(whichUnit, ConvertUnitState(0x50))) == defenseType
endfunction

// 设置单位防御类型
// 修改指定单位的防御类型
function DzSetUnitDefenseType takes unit whichUnit, integer defenseType returns nothing
	call SetUnitState(whichUnit, ConvertUnitState(0x50), defenseType)
endfunction

// 地形装饰物相关函数
// 创建地形装饰物
// 根据ID创建装饰物,可设置变体、位置、旋转角度和缩放比例
native DzDoodadCreate takes integer id, integer var, real x, real y, real z, real rotate, real scale returns integer

// 获取装饰物类型ID
native DzDoodadGetTypeId takes integer doodad returns integer

// 设置装饰物模型
// 更改装饰物使用的模型文件
native DzDoodadSetModel takes integer doodad, string modelFile returns nothing

// 设置装饰物队伍颜色
native DzDoodadSetTeamColor takes integer doodad, integer color returns nothing

// 设置装饰物颜色
// 可以改变装饰物的RGB颜色值
native DzDoodadSetColor takes integer doodad, integer color returns nothing

// 获取装饰物X坐标
native DzDoodadGetX takes integer doodad returns real

// 获取装饰物Y坐标
native DzDoodadGetY takes integer doodad returns real

// 获取装饰物Z坐标
native DzDoodadGetZ takes integer doodad returns real

// 设置装饰物位置
// 可以精确设置装饰物的X,Y,Z坐标位置
native DzDoodadSetPosition takes integer doodad, real x, real y, real z returns nothing

// 设置装饰物旋转矩阵
// 可以设置装饰物绕指定轴的旋转角度
native DzDoodadSetOrientMatrixRotate takes integer doodad, real angle, real axisX, real axisY, real axisZ returns nothing

// 设置装饰物缩放矩阵
// 可以分别设置装饰物在X,Y,Z轴上的缩放比例
native DzDoodadSetOrientMatrixScale takes integer doodad, real x, real y, real z returns nothing

// 重置装饰物变换矩阵
// 将装饰物的旋转和缩放恢复默认值
native DzDoodadSetOrientMatrixResize takes integer doodad returns nothing

// 设置装饰物显示/隐藏
native DzDoodadSetVisible takes integer doodad, boolean enable returns nothing

// 设置装饰物动画
// 播放指定名称的动画,可选择是否随机播放
native DzDoodadSetAnimation takes integer doodad, string animName, boolean animRandom returns nothing

// 设置装饰物动画播放速度
// 通过缩放时间来控制动画播放速度
native DzDoodadSetTimeScale takes integer doodad, real scale returns nothing

// 获取装饰物动画播放速度
native DzDoodadGetTimeScale takes integer doodad returns real

// 获取装饰物当前动画索引
native DzDoodadGetCurrentAnimationIndex takes integer doodad returns integer

// 获取装饰物动画数量
// 返回装饰物拥有的动画总数
native DzDoodadGetAnimationCount takes integer doodad returns integer

// 获取装饰物动画名称
// 根据索引获取对应动画的名称
native DzDoodadGetAnimationName takes integer doodad, integer index returns string

// 获取装饰物动画时长
// 获取指定索引动画的持续时间
native DzDoodadGetAnimationTime takes integer doodad, integer index returns integer

// 查找单位技能
native DzUnitFindAbility takes unit whichUnit, integer abilcode returns ability
// 修改技能数据-字符串
native DzAbilitySetStringData takes ability whichAbility, string key, string value returns nothing

// 启用/禁用技能
native DzAbilitySetEnable takes ability whichAbility, boolean enable, boolean hideUI returns nothing
// 设置单位移动类型
native DzUnitSetMoveType takes unit whichUnit, string moveType returns nothing
// 获取控件宽度
native DzFrameGetWidth takes integer frame returns real

// 设置模型界面播放动画（编号）
// 设置模型界面播放第N个动画，播放方式flag
native DzFrameSetAnimateByIndex takes integer frame, integer index, integer flag returns nothing

// 设置单位整数物编数据
native DzSetUnitDataCacheInteger takes integer uid, integer id,integer index,integer v returns nothing

// 设置单位UI等级数组整数值
native DzUnitUIAddLevelArrayInteger takes integer uid, integer id,integer lv,integer v returns nothing

// 设置单位整数物编数据
// 设置单位的id数值
function KKWESetUnitDataCacheInteger takes integer uid,integer id,integer v returns nothing
	call DzSetUnitDataCacheInteger( uid, id, 0, v)
endfunction

// 设置单位物编数据(建筑升级)
// 设置单位的第id个建筑升级单位类型
function KKWEUnitUIAddUpgradesIds takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 94, id, v)
endfunction

// 设置单位物编数据(农民可建造建筑)
// 设置单位的第id个可建造建筑单位类型
function KKWEUnitUIAddBuildsIds takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 100, id, v)
endfunction

// 设置单位物编数据(可研究的科技)
// 设置单位的第id个可研究的科技类型
function KKWEUnitUIAddResearchesIds takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 112, id, v)
endfunction

// 设置单位物编数据(可训练的单位)
// 设置单位的第id个可训练的单位类型
function KKWEUnitUIAddTrainsIds takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 106, id, v)
endfunction

// 设置单位物编数据(出售的单位)
// 设置单位的第id个可出售的单位类型
function KKWEUnitUIAddSellsUnitIds takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 118, id, v)
endfunction

// 设置单位物编数据(出售的物品)
// 设置单位的第id个可出售的物品类型
function KKWEUnitUIAddSellsItemIds takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 124, id, v)
endfunction

// 设置单位物编数据(制造的物品)
// 设置单位的第id个可制造的物品类型
function KKWEUnitUIAddMakesItemIds takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 130, id, v)
endfunction

// 设置单位物编数据(科技需求)[单位]
// 设置单位的第id个科技需求单位类型
function KKWEUnitUIAddRequiresUnitCode takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 166, id, v)
endfunction

// 设置单位物编数据(科技需求)[科技]
// 设置单位的第id个科技需求科技类型
function KKWEUnitUIAddRequiresTechcode takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 166, id, v)
endfunction

// 设置单位物编数据(科技需求值)
// 设置单位的第id个科技需求值数量
function KKWEUnitUIAddRequiresAmounts takes integer uid,integer id,integer v returns nothing
	call DzUnitUIAddLevelArrayInteger( uid, 172, id, v)
endfunction

// 设置道具模型
native DzItemSetModel takes item whichItem, string file returns nothing
// 设置道具颜色
native DzItemSetVertexColor takes item whichItem, integer color returns nothing
// 设置道具透明度
native DzItemSetAlpha takes item whichItem, integer color returns nothing
// 解锁JASS字节码限制
native DzUnlockOpCodeLimit takes boolean enable returns nothing

#endif

