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
native DzSimpleFrameShow takes integer frame, boolean enable returns nothing
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

// 启用/禁用控件裁剪区域,禁用后就能显示在外面了(不会锁里面)
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
// 设置道具头像
native DzItemSetPortrait takes item whichItem, string modelPath returns nothing
// 解锁JASS字节码限制
native DzUnlockOpCodeLimit takes boolean enable returns nothing

//玩家消耗/使用商城道具事件
function DzTriggerRegisterMallItemConsumeEvent takes trigger trig returns nothing
	call DzTriggerRegisterSyncData(trig, "DZMIC", true)
endfunction

//玩家删除商城道具事件
function DzTriggerRegisterMallItemRemoveEvent takes trigger trig returns nothing
	call DzTriggerRegisterSyncData(trig, "DZMID", true)
endfunction

//玩家实时获得地图商城道具事件
// 玩家背包中新获得了当前地图商城道具的回调事件，用于地图实现玩家在游戏内商城购买成功后在游戏内立即生效。可在事件内配合[事件响应-实时获得平台道具的玩家]和[事件响应-实时获得的平台道具]使用。
function DzTriggerRegisterMallItemSyncData takes trigger trig returns nothing
	call DzTriggerRegisterSyncData(trig, "DZMIA", true)
endfunction

//玩家消耗/使用商城道具事件
function DzTriggerRegisterMallItemConsumeEvent takes trigger trig returns nothing
	call DzTriggerRegisterSyncData(trig, "DZMIC", true)
endfunction

//玩家删除商城道具事件
function DzTriggerRegisterMallItemRemoveEvent takes trigger trig returns nothing
	call DzTriggerRegisterSyncData(trig, "DZMID", true)
endfunction

//事件响应 - 实时获得地图商城道具的玩家
//获取是哪位玩家获得了平台道具。仅限在玩家实时获得地图商城道具事件内使用。
function DzGetTriggerMallItemPlayer takes nothing returns player
	return DzGetTriggerSyncPlayer()
endfunction

//事件响应 - 实时获得的地图商城道具
//获取实时购买的地图商城道具。仅限在玩家实时获得地图商城道具事件内使用。
function DzGetTriggerMallItem takes nothing returns string
	return DzGetTriggerSyncData()
endfunction

// 发送云脚本数据
function KKApiMlScriptEvent takes player whichPlayer, string eventName, string payload returns boolean
	return RequestExtraBooleanData(110, whichPlayer, eventName, payload, false, 0, 0, 0)
endfunction

// 获取商城道具最后变动的数量（新增/删除）
function KKApiGetMallItemUpdateCount takes player whichPlayer, string key returns integer
	return RequestExtraIntegerData(110, whichPlayer, key, null, false, 0, 0, 0)
endfunction

// 设置剪切板内容
native DzSetClipboard takes string content returns boolean

//删除装饰物
native DzDoodadRemove takes integer doodad returns nothing

//移除科技等级
native DzRemovePlayerTechResearched takes player whichPlayer, integer techid, integer removelevels returns nothing


//------- 251002 更新 ------

// 注册UI事件回调-异步(func handle)[观战、录像不响应][new]
// 注册 frame 的事件类型事件 运行:code handle 是否同步:sync
// 注册UI事件回调-异步，可以在游戏、录像、观战等所有模式响应
// @param frame UI框架
// @param eventId 事件类型
// @param funcHandle 代码句柄
// @param sync 是否同步
native DzFrameSetScriptBlock takes integer frame, integer eventId, code funcHandle, boolean sync returns nothing
// * 注册UI事件回调-异步(func name)[观战、录像可响应][new]
// * 注册 frame 的事件类型事件 运行:func name
// * @param frame UI框架
// * @param eventId 事件类型
// * @param funcName 函数名
native DzFrameSetScriptAsync takes integer frame, integer eventId, string funcName returns nothing
// * 注册UI事件回调-异步(func handle)[观战、录像可响应][new]
// * 注册 frame 的事件类型事件 运行:code handle
// * 注册UI事件回调-异步，可以在游戏、录像、观战等所有模式响应
// * @param frame UI框架
// * @param eventId 事件类型
// * @param func 代码句柄
native DzFrameSetScriptByCodeAsync takes integer frame, integer eventId, code func returns nothing
// * 注册UI事件回调-异步(func handle)[观战、录像可响应][new]
// * 注册 frame 的事件类型事件 运行:code handle
// * 注册UI事件回调-异步，可以在游戏、录像、观战等所有模式响应，该函数执行会阻止它原本的功能继续响应
// * @param frame UI框架
// * @param eventId 事件类型
// * @param func 代码句柄
native DzFrameSetScriptBlockAsync takes integer frame, integer eventId, code func returns nothing


// 是否地图测试服
function DzAPI_Map_IsMapTest takes nothing returns boolean
	return RequestExtraBooleanData(74, null, null, null, false, 0, 0, 0)
endfunction


    // BeginBatchSaveArchive,  // 开始批量保存存档
    function KKApiBeginBatchSaveArchive takes player whichPlayer returns boolean
        return RequestExtraBooleanData(102, whichPlayer, null, null, false, 0, 0, 0)
    endfunction

    // AddBatchSaveArchive,    // 添加批量保存存档条目
    function KKApiAddBatchSaveArchive takes player whichPlayer, string key, string value, boolean caseInsensitive returns boolean
        return RequestExtraBooleanData(103, whichPlayer, key, value, caseInsensitive, 0, 0, 0)
    endfunction

    // EndBatchSaveArchive,    // 结束批量保存存档
    function KKApiEndBatchSaveArchive takes player whichPlayer, boolean abandon returns boolean
        return RequestExtraBooleanData(104, whichPlayer, null, null, abandon, 0, 0, 0)
    endfunction

// 【批量存档】添加条目-整数
// 对添加批量保存存档条目进行保存。KEY不区分大小写
// @param whichPlayer 玩家
// @param key 存档键名
// @param value 整数值
function KKApiAddBatchSaveArchiveInteger takes player whichPlayer, string key, integer value returns nothing
	set key="I"+key
	call KKApiAddBatchSaveArchive(whichPlayer,key,I2S(value),false)
	set key=null
	set whichPlayer=null
endfunction

// 【批量存档】添加条目-实数
// 对添加批量保存存档条目进行保存。KEY不区分大小写
// @param whichPlayer 玩家
// @param key 存档键名
// @param value 实数值
function KKApiAddBatchSaveArchiveReal takes player whichPlayer, string key, real value returns nothing
	set key="R"+key
	call KKApiAddBatchSaveArchive(whichPlayer,key,R2S(value),false)
	set key=null
	set whichPlayer=null
endfunction

// 【批量存档】添加条目-布尔值
// 对添加批量保存存档条目进行保存。KEY不区分大小写
// @param whichPlayer 玩家
// @param key 存档键名
// @param value 布尔值
function KKApiAddBatchSaveArchiveBoolean takes player whichPlayer, string key, boolean value returns nothing
	set key="B"+key
	if(value)then
		call KKApiAddBatchSaveArchive(whichPlayer,key,"1",false)
	else
		call KKApiAddBatchSaveArchive(whichPlayer,key,"0",false)
	endif
	set key=null
	set whichPlayer=null
endfunction

// 【批量存档】添加条目-字符串
// 对添加批量保存存档条目进行保存。KEY不区分大小写
// @param whichPlayer 玩家
// @param key 存档键名
// @param value 字符串值
function KKApiAddBatchSaveArchiveString takes player whichPlayer, string key, string value returns nothing
	set key="S"+key
	call KKApiAddBatchSaveArchive(whichPlayer,key,value,false)
	set key=null
	set whichPlayer=null
endfunction


// 获取地图版本号[new]
// 获取地图版本号
function KKApiGetMapVersion takes nothing returns string
	return RequestExtraStringData(111, null, null, null, false, 0, 0, 0)
endfunction

// 获取赛事模式[new]
// 获取赛事模式
function KKApiGetCompetitionGameMode takes nothing returns string
	return RequestExtraStringData(112, null, null, null, false, 0, 0, 0)
endfunction

// 获取玩家当天总游戏局数[new]
// 获取 whichPlayer 当天总游戏局数
// 为当天玩家玩该地图的有效局数，10分钟算一局，每天05:00刷新
// @param whichPlayer 玩家
function KKApiDayRounds takes player whichPlayer returns integer
	return RequestExtraIntegerData(113, whichPlayer, null, null, false, 0, 0, 0)
endfunction

// 获取玩家在指定地图会员等级[new]
// 获取 whichPlayer 在地图 mapId 的会员等级
// 该功能需要在作者之家后台申请开启权限，否则返回值都是0
// @param whichPlayer 玩家
// @param mapId 地图ID
function KKApiConsumeLevel takes player whichPlayer, integer mapId returns integer
	return RequestExtraIntegerData(115, whichPlayer, null, null, false, mapId, 0, 0)
endfunction

// 血条刷新事件 [NEW]
// 血条刷新事件
native DzFrameHookHpBar takes code func returns nothing
// 触发的血条单位 [NEW]
// 触发血条的单位
// 用于血条刷新事件下
native DzFrameGetTriggerHpBarUnit takes nothing returns unit
// 触发的血条 [NEW]
// 触发的血条
// 用于血条刷新事件下
native DzFrameGetTriggerHpBar takes nothing returns integer
// 获取单位血条 [NEW]
// 获取 whichUnit 血条
// 获取单位血条
// @param whichUnit 单位
// param whichUnit 单位
native DzFrameGetUnitHpBar takes unit whichUnit returns integer

// 鼠标界面 [NEW]
// 鼠标界面
native DzGetCursorFrame takes nothing returns integer
// 是否有指定锚点 [NEW]
// 判断 whichFrame 是否有 anchor 锚点
// @param frame 界面
// @param anchor 锚点
// param frame 界面句柄
// param anchor 锚点
native DzFrameGetPointValid takes integer frame, integer anchor returns boolean
// 获取相对锚点所在界面 [NEW]
// 判断 whichFrame 的相对锚点 anchor 所在界面
// @param frame 界面
// @param anchor 锚点
// param frame 界面句柄
// param anchor 锚点
native DzFrameGetPointRelative takes integer frame, integer anchor returns integer
// 获取相对锚点的界面锚点 [NEW]
// 判断 whichFrame 的相对锚点 anchor 所在界面的锚点
// @param frame 界面
// @param anchor 锚点
// param frame 界面句柄
// param anchor 锚点
native DzFrameGetPointRelativePoint takes integer frame, integer anchor returns integer
// 获取锚点X坐标 [NEW]
// whichFrame 的 anchor X坐标
// @param frame 界面
// @param anchor 锚点
// param frame 界面句柄
// param anchor 锚点
native DzFrameGetPointX takes integer frame, integer anchor returns real
// 获取锚点Y坐标 [NEW]
// whichFrame 的 anchor Y坐标
// @param frame 界面
// @param anchor 锚点
// param frame 界面句柄
// param anchor 锚点
native DzFrameGetPointY takes integer frame, integer anchor returns real

function DzIsLeapYear takes integer year returns boolean
	return (ModuloInteger(year , 4) == 0 and ModuloInteger(year , 100) != 0) or (ModuloInteger(year , 400) == 0)
endfunction

function DzGetTimeDateFromTimestamp takes integer timestamp returns string
endfunction

// 转换时间戳为具体时间 [NEW]
// 转换 timestamp 为具体时间
// 返回值类似：2025-1-10 17:4:40
// @param timestamp 时间戳
// param timestamp 时间戳
function KKAPIGetTimeDateFromTimestamp takes integer timestamp returns string
	set timestamp=IMaxBJ(timestamp,0)
	if(HaveSavedString(Hash,timestamp,4))then
		return LoadStr(Hash,timestamp,4)
	else
		return DzGetTimeDateFromTimestamp(timestamp)
	endif
endfunction

// 获取时间戳年份 [NEW]
// timestamp 的年份
// @param timestamp 时间戳
// param timestamp 时间戳
function  KKAPIGetTimestampYear takes integer timestamp returns integer
	set timestamp=IMaxBJ(timestamp,0)
	if(HaveSavedInteger(Hash,timestamp,1)==false)then
		call DzGetTimeDateFromTimestamp(timestamp)
	endif
	return LoadInteger(Hash,timestamp,1)
endfunction

// 获取时间戳月份 [NEW]
// timestamp 的月份
// @param timestamp 时间戳
// param timestamp 时间戳
function  KKAPIGetTimestampMonth takes integer timestamp returns integer
	set timestamp=IMaxBJ(timestamp,0)
	if(HaveSavedInteger(Hash,timestamp,2)==false)then
		call DzGetTimeDateFromTimestamp(timestamp)
	endif
	return LoadInteger(Hash,timestamp,2)
endfunction

// 获取时间戳日份 [NEW]
// timestamp 的日份
// @param timestamp 时间戳
// param timestamp 时间戳
function  KKAPIGetTimestampDay takes integer timestamp returns integer
	set timestamp=IMaxBJ(timestamp,0)
	if(HaveSavedInteger(Hash,timestamp,3)==false)then
		call DzGetTimeDateFromTimestamp(timestamp)
	endif
	return LoadInteger(Hash,timestamp,3)
endfunction

// 打印调试信息到平台日志 [NEW]
// 打印 msg 到平台日志
// 用于调试，打印信息到平台日志文件
// @param msg 信息
// param msg 信息
native DzWriteLog takes string msg returns nothing

// texttag
// 获取当前漂浮文字的字体 [NEW]
// 漂浮文字的字体
native DzTextTagGetFont takes nothing returns string
// 设置漂浮文字字体 [NEW]
// 设置漂浮文字字体：fileName
// @param fileName 字体文件名
// param fileName 字体文件名
native DzTextTagSetFont takes string fileName returns nothing
// 设置漂浮文字透明度 [NEW]
// 设置 t 透明度：alpha
// @param t 漂浮文字
// @param alpha 透明度
// param t 漂浮文字句柄
// param alpha 透明度
native DzTextTagSetStartAlpha takes texttag t, integer alpha returns nothing
// 获取漂浮文字的阴影颜色 [NEW]
// 获取 t 的阴影颜色
// @param t 漂浮文字
// param t 漂浮文字句柄
native DzTextTagGetShadowColor takes texttag t returns integer
// 设置漂浮文字阴影颜色 [NEW]
// 设置 t 阴影颜色：color
// @param t 漂浮文字
// @param color 颜色
// param t 漂浮文字句柄
// param color 颜色
native DzTextTagSetShadowColor takes texttag t, integer color returns nothing

// group
// 获取单位组里单位数量 [NEW]
// 获取 g 里单位数量
// @param g 单位组
// param g 单位组句柄
native DzGroupGetCount takes group g returns integer
// 获取单位组里指定索引的单位 [NEW]
// 获取 g 里第 index 个单位
// @param g 单位组
// @param index 索引
// param g 单位组句柄
// param index 索引
native DzGroupGetUnitAt takes group g, integer index returns unit

// unit
// 创建幻象单位 [NEW]
// 为 p 创建一个 unitId 类型的幻象，在坐标(x,y),面向角度：face
// @param p 玩家
// @param unitId 单位类型ID
// @param x X坐标
// @param y Y坐标
// @param face 面向角度
// param p 玩家
// param unitId 单位类型ID
// param x X坐标
// param y Y坐标
// param face 面向角度
native DzUnitCreateIllusion takes player p, integer unitId, real x, real y, real face returns unit
// 为单位创建幻象 [NEW]
// 为 u 创建一个幻象
// @param u 单位
// param u 单位句柄
native DzUnitCreateIllusionFromUnit takes unit u returns unit

// string
// 检查字符串是否包含指定的子字符串 [NEW]
// 检测 s 是否包含 whichString 字符串，判定规则：caseSensitive 区分大小写
// @param s 目标字符串
// @param whichString 子字符串
// @param caseSensitive 是否区分大小写
// param s 目标字符串
// param whichString 子字符串
// param caseSensitive 是否区分大小写
native DzStringContains takes string s, string whichString, boolean caseSensitive returns boolean
// 字符串中查找子字符串并返回其位置 [NEW]
// 检测 s 包含 whichString 的位置，从第 off 位开始，判定规则：caseSensitive 区分大小写
// @param s 目标字符串
// @param whichString 子字符串
// @param off 起始位置
// @param caseSensitive 是否区分大小写
// param s 目标字符串
// param whichString 子字符串
// param off 起始位置
// param caseSensitive 是否区分大小写
native DzStringFind takes string s, string whichString, integer off, boolean caseSensitive returns integer
// 检测字符串里第一个包含指定字符串里任意字符的位置 [NEW]
// 检测 s 第一个包含 whichString 里任意字符的位置，从第 off 位开始，判定规则：caseSensitive 区分大小写
// @param s 目标字符串
// @param whichString 子字符串
// @param off 起始位置
// @param caseSensitive 是否区分大小写
// param s 目标字符串
// param whichString 子字符串
// param off 起始位置
// param caseSensitive 是否区分大小写
native DzStringFindFirstOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
// 检查字符串第一个不包含指定字符串里任意字符的位置 [NEW]
// 检测 s 第一个不包含 whichString 里任意字符的位置，从第 off 位开始，判定规则：caseSensitive 区分大小写
// @param s 目标字符串
// @param whichString 子字符串
// @param off 起始位置
// @param caseSensitive 是否区分大小写
// param s 目标字符串
// param whichString 子字符串
// param off 起始位置
// param caseSensitive 是否区分大小写
native DzStringFindFirstNotOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
// 从后往前查找字符串中包含指定字符串任意字符的所在位置 [NEW]
// 从后往前检测 s 包含指定字符串 whichString 任意字符的位置，从第 off 位开始，判定规则：caseSensitive 区分大小写
// @param s 目标字符串
// @param whichString 子字符串
// @param off 起始位置
// @param caseSensitive 是否区分大小写
// param s 目标字符串
// param whichString 子字符串
// param off 起始位置
// param caseSensitive 是否区分大小写
native DzStringFindLastOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
// 从后往前查找字符串中不包含指定字符串任意字符的所在位置 [NEW]
// 从后往前检测 s 不包含指定字符串 whichString 任意字符的位置，从第 off 位开始，判定规则：caseSensitive 区分大小写
// @param s 目标字符串
// @param whichString 子字符串
// @param off 起始位置
// @param caseSensitive 是否区分大小写
// param s 目标字符串
// param whichString 子字符串
// param off 起始位置
// param caseSensitive 是否区分大小写
native DzStringFindLastNotOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
// 删除字符串左边的空格 [NEW]
// 删除 s 左边的空格
// @param s 字符串
// param s 字符串
native DzStringTrimLeft takes string s returns string
// 删除字符串右边的空格 [NEW]
// 删除 s 右边的空格
// @param s 字符串
// param s 字符串
native DzStringTrimRight takes string s returns string
// 删除字符串两边的空格 [NEW]
// 删除 s 两边的空格
// @param s 字符串
// param s 字符串
native DzStringTrim takes string s returns string
// 反转字符串 [NEW]
// 反转 s
// @param s 字符串
// param s 字符串
native DzStringReverse takes string s returns string
// 替换字符串 [NEW]
// 替换 s 里的 whichString 为 replaceWith
// @param s 目标字符串
// @param whichString 要替换的字符串
// @param replaceWith 替换为的字符串
// @param caseSensitive 是否区分大小写
// param s 目标字符串
// param whichString 要替换的字符串
// param replaceWith 替换为的字符串
// param caseSensitive 是否区分大小写
native DzStringReplace takes string s, string whichString, string replaceWith, boolean caseSensitive returns string
// 插入字符串 [NEW]
// 在 s 的位置 whichPosition 插入 whichString
// @param s 目标字符串
// @param whichPosition 插入位置
// @param whichString 要插入的字符串
// param s 目标字符串
// param whichPosition 插入位置
// param whichString 要插入的字符串
native DzStringInsert takes string s, integer whichPosition, string whichString returns string

// bit
// 整数的2进制的位值 [NEW]
// i 的2进制的第 byteIndex 位的值
// @param i 整数
// @param byteIndex 字节索引
native DzBitGet takes integer i, integer byteIndex returns integer
// 设置整数的2进制的位值 [NEW]
// 设置 i 的2进制的第 byteIndex 位的值：byteValue
// @param i 整数
// @param byteIndex 字节索引
// @param byteValue 字节值
native DzBitSet takes integer i, integer byteIndex, integer byteValue returns integer
// 整数的256进制的位值 [NEW]
// ${i} 256进制第 ${byteIndex} 位的值
// @param i 整数
// @param byteIndex 字节索引
native DzBitGetByte takes integer i, integer byteIndex returns integer

// 设置整数的256进制的位值 [NEW]
// 设置 ${i} 的256进制的第 ${byteIndex} 位的值：${byteValue}
// @param i 整数
// @param byteIndex 字节索引
// @param byteValue 字节值
native DzBitSetByte takes integer i, integer byteIndex, integer byteValue returns integer

// 按位取反 [NEW]
// ${i} 按位取反
// @param i 整数
native DzBitNot takes integer i returns integer

// 按位与 [NEW]
// ${a} 和 ${b} 按位与
// @param a 整数a
// @param b 整数b
native DzBitAnd takes integer a, integer b returns integer

// 按位或 [NEW]
// ${a} 和 ${b} 按位或
// @param a 整数a
// @param b 整数b
native DzBitOr takes integer a, integer b returns integer

// 按位异或 [NEW]
// ${a} 和 ${b} 按位异或
// @param a 整数a
// @param b 整数b
native DzBitXor takes integer a, integer b returns integer

// 按位左移 [NEW]
// ${i} 的所有位向左移动 ${bitsToShift} 位
// @param i 整数
// @param bitsToShift 移位数
native DzBitShiftLeft takes integer i, integer bitsToShift returns integer

// 按位右移 [NEW]
// ${i} 的所有位向右移动 ${bitsToShift} 位
// @param i 整数
// @param bitsToShift 移位数
native DzBitShiftRight takes integer i, integer bitsToShift returns integer

// 4字节组合为整数 [NEW]
// 在4个字节(${b1},${b2},${b3},${b4})组合成一个整数。这里组合是256进制，组合的结果其实是b4b3b2b1
// @param b1 字节1
// @param b2 字节2
// @param b3 字节3
// @param b4 字节4
native DzBitToInt takes integer b1, integer b2, integer b3, integer b4 returns integer

// 对单位组添加命令到队列(无目标) [NEW]
// 对单位组 ${whichGroup} 添加 ${order} 命令到队列
// @param whichGroup 单位组
// @param order 命令
native DzQueueGroupImmediateOrderById              takes group whichGroup, integer order returns boolean

// 对单位组添加命令到队列(指定坐标) [NEW]
// 对单位组 ${whichGroup} 添加 ${order} 命令到队列，位置 (${x}, ${y})
// @param whichGroup 单位组
// @param order 命令
// @param x X坐标
// @param y Y坐标
native DzQueueGroupPointOrderById                  takes group whichGroup, integer order, real x, real y returns boolean

// 对单位组添加命令到队列(指定单位) [NEW]
// 对单位组 ${whichGroup} 添加 ${order} 命令到队列，目标 ${targetWidget}
// @param whichGroup 单位组
// @param order 命令
// @param targetWidget 目标控件
native DzQueueGroupTargetOrderById                 takes group whichGroup, integer order, widget targetWidget returns boolean

// 对单位添加命令到队列(无目标) [NEW]
// 对单位 ${whichUnit} 添加 ${order} 命令到队列
// @param whichUnit 单位
// @param order 命令
native DzQueueIssueImmediateOrderById      takes unit whichUnit, integer order returns boolean

// 对单位添加命令到队列(指定坐标) [NEW]
// 对单位 ${whichUnit} 添加 ${order} 命令到队列，位置 (${x}, ${y})
// @param whichUnit 单位
// @param order 命令
// @param x X坐标
// @param y Y坐标
native DzQueueIssuePointOrderById          takes unit whichUnit, integer order, real x, real y returns boolean

// 对单位添加命令到队列(指定单位) [NEW]
// 对单位 ${whichUnit} 添加 ${order} 命令到队列，目标 ${targetWidget}
// @param whichUnit 单位
// @param order 命令
// @param targetWidget 目标控件
native DzQueueIssueTargetOrderById         takes unit whichUnit, integer order, widget targetWidget returns boolean

// 对单位添加命令到队列(指定坐标和瞬发目标) [NEW]
// 对单位 ${whichUnit} 添加 ${order} 命令到队列，位置 (${x}, ${y})，瞬发目标 ${instantTargetWidget}
// @param whichUnit 单位
// @param order 命令
// @param x X坐标
// @param y Y坐标
// @param instantTargetWidget 瞬发目标控件
native DzQueueIssueInstantPointOrderById   takes unit whichUnit, integer order, real x, real y, widget instantTargetWidget returns boolean

// 对单位添加命令到队列(指定单位和瞬发目标) [NEW]
// 对单位 ${whichUnit} 添加 ${order} 命令到队列，目标 ${targetWidget}，瞬发目标 ${instantTargetWidget}
// @param whichUnit 单位
// @param order 命令
// @param targetWidget 目标控件
// @param instantTargetWidget 瞬发目标控件
native DzQueueIssueInstantTargetOrderById  takes unit whichUnit, integer order, widget targetWidget, widget instantTargetWidget returns boolean

// 对单位添加建造命令到队列 [NEW]
// 对单位 ${whichPeon} 添加建造 ${unitId} 命令到队列，位置 (${x}, ${y})
// @param whichPeon 农民单位
// @param unitId 单位ID
// @param x X坐标
// @param y Y坐标
native DzQueueIssueBuildOrderById          takes unit whichPeon, integer unitId, real x, real y returns boolean

// 添加中介命令到队列(无目标) [NEW]
// 使 ${forWhichPlayer} 对 ${neutralStructure} 添加 ${unitId} 命令到队列
// @param forWhichPlayer 玩家
// @param neutralStructure 中立建筑
// @param unitId 单位ID
native DzQueueIssueNeutralImmediateOrderById   takes player forWhichPlayer,unit neutralStructure, integer unitId returns boolean

// 添加中介命令到队列(指定坐标) [NEW]
// 使 ${forWhichPlayer} 对 ${neutralStructure} 添加 ${unitId} 命令到队列，位置 (${x}, ${y})
// @param forWhichPlayer 玩家
// @param neutralStructure 中立建筑
// @param unitId 单位ID
// @param x X坐标
// @param y Y坐标
native DzQueueIssueNeutralPointOrderById       takes player forWhichPlayer,unit neutralStructure, integer unitId, real x, real y returns boolean

// 添加中介命令到队列(指定单位) [NEW]
// 使 ${forWhichPlayer} 对单位 ${neutralStructure} 添加 ${unitId} 命令到队列，目标 ${TargetWidget}
// @param forWhichPlayer 玩家
// @param neutralStructure 中立建筑
// @param unitId 单位ID
// @param target 目标控件
native DzQueueIssueNeutralTargetOrderById      takes player forWhichPlayer,unit neutralStructure, integer unitId, widget target returns boolean

// 获取单位的命令数量 [NEW]
// 获取单位 ${u} 的命令数量
// @param u 单位
native DzUnitOrdersCount takes unit u returns integer

// 清除单位命令队列 [NEW]
// 清除单位 ${u} 命令，清理规则： ${onlyQueued} 仅清理队列里的命令
// @param u 单位
// @param onlyQueued 是否仅清理队列
native DzUnitOrdersClear takes unit u, boolean onlyQueued returns nothing

// 执行单位的命令队列 [NEW]
// 执行单位 ${u} 的命令队列
// @param u 单位
native DzUnitOrdersExec takes unit u returns nothing

// 强制停止单位当前命令 [NEW]
// 强制停止单位 ${u} 的当前命令，${clearQueue} 清理队列里的命令
// @param u 单位
// @param clearQueue 是否清理队列
native DzUnitOrdersForceStop takes unit u, boolean clearQueue returns nothing

// 反转单位命令队列 [NEW]
// 反转 ${u} 命令队列
// @param u 单位
native DzUnitOrdersReverse takes unit u returns nothing
// 打开Excel文件 [NEW]
// 打开Excel文件 ${filePath}
// @param filePath 文件路径
native DzXlsxOpen takes string filePath returns integer

// 关闭工作表 [NEW]
// 关闭工作表：${docHandle}
// @param docHandle 文档句柄
native DzXlsxClose takes integer docHandle returns boolean

// 工作表的总行数 [NEW]
// ${docHandle} 里 ${sheetName} 页的总行数
// @param docHandle 文档句柄
// @param sheetName 工作表名
native DzXlsxWorksheetGetRowCount takes integer docHandle, string sheetName returns integer

// 工作表的总列数 [NEW]
// ${docHandle} 里 ${sheetName} 的列数
// @param docHandle 文档句柄
// @param sheetName 工作表名
native DzXlsxWorksheetGetColumnCount takes integer docHandle, string sheetName returns integer

// 单元格的数据类型 [NEW]
// ${docHandle} 里 ${sheetName} 中单元格 (${row}, ${column}) 的数据类型
// @param docHandle 文档句柄
// @param sheetName 工作表名
// @param row 行号
// @param column 列号
native DzXlsxWorksheetGetCellType takes integer docHandle, string sheetName, integer row, integer column returns integer

// 工作表的值（字符串） [NEW]
// ${docHandle} 里 ${sheetName} 中单元格 (${row}, ${column}) 的字符串值
// @param docHandle 文档句柄
// @param sheetName 工作表名
// @param row 行号
// @param column 列号
native DzXlsxWorksheetGetCellString takes integer docHandle, string sheetName, integer row, integer column returns string

// 工作表的值（整数） [NEW]
// ${docHandle} 里 ${sheetName} 中单元格 (${row}, ${column}) 的整数值
// @param docHandle 文档句柄
// @param sheetName 工作表名
// @param row 行号
// @param column 列号
native DzXlsxWorksheetGetCellInteger takes integer docHandle, string sheetName, integer row, integer column returns integer

// 工作表的值（布尔值） [NEW]
// ${docHandle} 里 ${sheetName} 中单元格 (${row}, ${column}) 的布尔值
// @param docHandle 文档句柄
// @param sheetName 工作表名
// @param row 行号
// @param column 列号
native DzXlsxWorksheetGetCellBoolean takes integer docHandle, string sheetName, integer row, integer column returns boolean

// 工作表的值（实数） [NEW]
// ${docHandle} 里 ${sheetName} 中单元格 (${row}, ${column}) 的实数值
// @param docHandle 文档句柄
// @param sheetName 工作表名
// @param row 行号
// @param column 列号
native DzXlsxWorksheetGetCellFloat takes integer docHandle, string sheetName, integer row, integer column returns real

// 设置界面纹理坐标 [NEW]
// 设置 ${frame} 的纹理坐标为 (${left}, ${top}, ${right}, ${bottom})
// @param frame 界面
// @param left 左坐标
// @param top 上坐标
// @param right 右坐标
// @param bottom 下坐标
native DzFrameSetTexCoord takes integer frame, real left, real top, real right, real bottom returns nothing

// 技能 - 设置技能施法距离（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的施法距离${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 距离值
//  = [[单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityRange takes unit Unit, integer abil_code, real value returns boolean

// 技能 - 获取技能施法距离（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的施法距离
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityRange takes unit Unit, integer abil_code returns real

// 技能 - 设置技能施法范围（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的施法范围${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 范围值
// 单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityArea takes unit Unit, integer abil_code, real value returns boolean

// 技能 - 获取技能施法范围（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的施法范围
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityArea takes unit Unit, integer abil_code returns real

// 技能 - 设置技能冷却时间（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的当前冷却时间${cool}/最大冷却时间${max_cool}
// @param Unit 单位
// @param abil_code 技能代码
// @param cool 当前冷却时间
// @param max_cool 最大冷却时间
// 单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityCool takes unit Unit, integer abil_code, real cool, real max_cool returns boolean

// 技能 - 获取技能当前冷却时间（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的当前冷却时间
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityCool takes unit Unit, integer abil_code returns real

// 技能 - 获取技能最大冷却时间（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的最大冷却时间
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityMaxCool takes unit Unit, integer abil_code returns real

// 技能 - 设置技能数据A（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的数据A${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 数据值
// 通魔的数据A是施法持续时间;单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityDataA takes unit Unit, integer abil_code, real value returns boolean

// 技能 - 获取技能数据A（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的数据A
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityDataA takes unit Unit, integer abil_code returns real

// 技能 - 设置技能数据B（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的数据B${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 数据值
// 通魔的数据B是目标类型;0无目标;1目标单位;2目标点;3目标单位或点;单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityDataB takes unit Unit, integer abil_code, real value returns boolean

// 技能 - 获取技能数据B（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的数据B
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityDataB takes unit Unit, integer abil_code returns real

// 技能 - 设置技能数据C（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的数据C${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 数据值
// 通魔的数据C是选项;单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityDataC takes unit Unit, integer abil_code, real value returns boolean

// 技能 - 获取技能数据C（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的数据C
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityDataC takes unit Unit, integer abil_code returns real

// 技能 - 设置技能数据D（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的数据D${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 数据值
// 通魔的数据D是动作持续时间;单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityDataD takes unit Unit, integer abil_code, real value returns boolean

// 技能 - 获取技能数据D（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的数据D
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityDataD takes unit Unit, integer abil_code returns real

// 技能 - 设置技能数据E（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的数据E${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 数据值
// 通魔的数据E是否使其他技能失效;单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityDataE takes unit Unit, integer abil_code, real value returns boolean

// 技能 - 获取技能数据E（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的数据E
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityDataE takes unit Unit, integer abil_code returns real

// 技能 - 设置技能按钮位置（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的按钮X轴${x}, Y轴${y}
// @param Unit 单位
// @param abil_code 技能代码
// @param x X坐标
// @param y Y坐标
// x轴0~3, y轴0~2且 y轴-11可以隐藏技能;单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityButtonPos takes unit Unit, integer abil_code, integer x, integer y returns boolean

// 技能 - 设置技能快捷键（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的按钮快捷键${key}
// @param Unit 单位
// @param abil_code 技能代码
// @param key 快捷键
// 必须显示在按钮上的技能才有效,单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityHotkey takes unit Unit, integer abil_code, string key returns boolean

// 转化 - 目标允许整数转字符串
// 转换 ${targs}为字符串
// @param targs 目标允许
native DzConvertTargs2Str takes integer targs returns string

// 转化 - 目标允许字符串转整数
// 转换 ${targs}为整数
// @param targs 目标允许字符串
native DzConvertStr2Targs takes string targs returns integer

// 技能 - 设置技能目标允许（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的目标允许${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 目标允许值
// 单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityTargs takes unit Unit, integer abil_code, integer value returns boolean

// 技能 - 获取技能目标允许（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的目标允许
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityTargs takes unit Unit, integer abil_code returns integer

// 技能 - 设置技能魔法消耗（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的魔法消耗${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 消耗值
// 单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityCost takes unit Unit, integer abil_code, integer value returns boolean

// 技能 - 获取技能魔法消耗（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的魔法消耗
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityCost takes unit Unit, integer abil_code returns integer

// 技能 - 设置技能等级要求（通魔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的等级要求${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 等级要求
// 2级以上可以无视魔法免疫;单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;保证通魔技能有效,其他类型的技能也可以尝试使用不保证有效, 如无效果可以升级降级技能刷新
native DzSetUnitAbilityReqLevel takes unit Unit, integer abil_code, integer value returns boolean

// 技能 - 获取技能等级要求（通魔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的等级要求
// @param Unit 单位
// @param abil_code 技能代码
// 2级以上可以无视魔法免疫
native DzGetUnitAbilityReqLevel takes unit Unit, integer abil_code returns integer

// 技能 - 设置建造技能单位ID（象牙塔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的单位id${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 单位ID
// 用在象牙塔或变身类技能;单位的独立修改,不会影响其他单位身上的技能;删除技能后改动即清除;
native DzSetUnitAbilityUnitId takes unit Unit, integer abil_code, integer value returns boolean

// 技能 - 获取建造技能单位ID（象牙塔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的单位ID
// @param Unit 单位
// @param abil_code 技能代码
// 象牙塔或者变身类技能有效
native DzGetUnitAbilityUnitId takes unit Unit, integer abil_code returns integer

// 技能 - 设置建造技能命令ID（象牙塔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 的命令id${value}
// @param Unit 单位
// @param abil_code 技能代码
// @param value 命令ID
native DzSetUnitAbilityBuildOrderId takes unit Unit, integer abil_code, integer value returns boolean

// 技能 - 获取建造技能命令ID（象牙塔）
// 获取 单位${Unit} 当前拥有的技能${abil_code} 的命令ID
// 象牙塔类的技能有效
// @param Unit 单位
// @param abil_code 技能代码
native DzGetUnitAbilityBuildOrderId takes unit Unit, integer abil_code returns integer

// 技能 - 设置建造技能模型（象牙塔）
// 设置单位${Unit} 当前拥有的技能${abil_code} 模型${model_path} 缩放${model_scale}
// @param Unit 单位
// @param abil_code 技能代码
// @param model_path 模型路径
// @param model_scale 模型缩放
native DzSetUnitAbilityBuildModel takes unit Unit, integer abil_code, string model_path, real model_scale returns boolean

// 技能 - 判断单位是否拥有技能 (包含模版技能)
// 单位${Unit}是否拥有技能 ${abil_code}
// 单位拥有指定id 或者 指定模板id, 真实的模板技能id在 编辑器里units\abilitydata.slk 里面的code列里
// @param Unit 单位
// @param abil_code 技能ID
native DzUnitHasAbility takes unit Unit, integer abil_code returns boolean


// 技能按钮 - 创建技能按钮控件
// 创建技能按钮控件
// 创建的技能按钮可以拿来绑定技能。
native KKCreateCommandButton takes nothing returns integer
// 技能按钮 - 删除技能按钮
// 删除技能按钮${btn}
// @param btn 技能按钮控件
// 只能是来自"创建技能按钮控件"的控件,不能删原生哈。
native KKDestroyCommandButton takes integer btn returns nothing

// 技能按钮 - 鼠标点击技能按钮 (无目标施法 或 激活目标指示器)
// 点击技能按钮${btn}, 按照鼠标${mouse_type}类型来点击
// @param btn 技能按钮控件
// @param mouse_type 鼠标类型(1是左键,4是右键)
// 鼠标类型1是左键,4是右键,无目标技能左键之后可以释放,目标类技能左键后会激活目标指示器
native KKCommandButtonClick takes integer btn, integer mouse_type returns nothing

// 技能按钮 - 目标指示器点击目标单位
// 鼠标${mouse_type}类型点击目标${target}
// @param mouse_type 鼠标类型(1是左键点击目标,4是右键取消)
// @param target 目标单位
// 需要先激活目标指示器后, 鼠标类型1是左键点击目标,4是右键取消
native KKCommandTargetClick takes integer mouse_type, widget target returns boolean

// 技能按钮 - 目标指示器点击地面坐标
// 鼠标${mouse_type}类型点击坐标 x轴${x}, y轴${y}, z轴${z}
// @param mouse_type 鼠标类型(1是左键点击目标,4是右键取消)
// @param x X轴坐标
// @param y Y轴坐标
// @param z Z轴坐标
// 坐标类的技能 需要先激活点或范围指示器后, 鼠标类型1是左键点击目标,4是右键取消
native KKCommandTerrainClick takes integer mouse_type, real x, real y, real z returns boolean

// 技能按钮 - 绑定单位技能
// 技能按钮${btn} 绑定单位${Unit}的技能${abil_code}
// @param btn 技能按钮控件
// @param Unit 单位
// @param abil_code 技能代码
// 需要 先添加单位技能, 然后改按钮y轴-11隐藏, 然后再计时器循环0.1秒绑定, 技能id填0是取消绑定。
native KKSetCommandUnitAbility takes integer btn, unit Unit, integer abil_code returns nothing

// 物品 - 获取物品颜色
// 获取 ${Item} 的颜色
// @param Item 物品
// @return 颜色值
native DzItemGetVertexColor takes item Item returns integer

// 物品 - 物品大小
// 物品${Item} 按照${size}进行缩放
// @param Item 物品
// @param size 缩放大小
native DzItemSetSize takes item Item, real size returns nothing

// 物品 - 获取物品大小
// 获取 ${Item} 的缩放大小
// @param Item 物品
// @return 缩放大小
native DzItemGetSize takes item Item returns real

// 物品 - 模型按照X轴旋转
// 物品${Item} 按照X轴${x}进行旋转
// @param Item 物品
// @param x X轴旋转角度
// 多次调用是会乘法累计旋转的, 拾取丢弃物品会重置
native DzItemMatRotateX takes item Item, real x returns nothing

// 物品 - 模型按照Y轴旋转
// 物品${Item} 按照Y轴${y}进行旋转
// @param Item 物品
// @param y Y轴旋转角度
// 多次调用是会乘法累计旋转的, 拾取丢弃物品会重置
native DzItemMatRotateY takes item Item, real y returns nothing

// 物品 - 模型按照Z轴旋转
// 物品${Item} 按照Z轴${z}进行旋转
// @param Item 物品
// @param z Z轴旋转角度
// 多次调用是会乘法累计旋转的, 拾取丢弃物品会重置
native DzItemMatRotateZ takes item Item, real z returns nothing

// 物品 - 模型按照XYZ轴缩放
// 物品${Item} 按照X轴${x},Y轴${y},Z轴${z} 进行缩放
// @param Item 物品
// @param x X轴缩放
// @param y Y轴缩放
// @param z Z轴缩放
// 多次调用是会乘法累计缩放的, 拾取丢弃物品会重置
native DzItemMatScale takes item Item, real x, real y, real z returns nothing

// 物品 - 模型重置旋转缩
// 物品${Item} 模型重置旋转缩
// @param Item 物品
// 旋转清零,缩放重置为1
native DzItemMatReset takes item Item returns nothing

// 物品 - 当前选择的物品(异步)
// 获取主控物品
// @return 当前选中的物品
// 获取的物品是异步的,请谨慎操作
native DzGetLastSelectedItem takes nothing returns item

// 模型粒子2的缩放倍数
// ${Widget} 模型粒子2的缩放 ${scale}倍数
// @param Widget 对象(单位/特效/物品)
// @param scale 缩放倍数
// 每次调用是乘法计算 需要填大于0的数值,填0会直接导致之后的计算失效
native DzSetPariticle2Size takes agent Widget, real scale returns nothing

// 单位 - 修改单位碰撞体积
// 修改单位${Unit} 的碰撞体积为${size}
// @param Unit 单位
// @param size 碰撞体积大小
// 修改之后移动一下单位或者重新设置一下位置就会刷新了
native DzSetUnitCollisionSize takes unit Unit, real size returns nothing

// 单位 - 获取单位的碰撞体积
// 获取 ${Unit} 的碰撞体积
// @param Unit 单位
// @return 碰撞体积大小
native DzGetUnitCollisionSize takes unit Unit returns real

// 替换贴图
// 替换${Handle} 新的贴图${TexturePath} 为指定 TexId${ReplaceId}
// @param Handle 对象(单位/物品/特效)
// @param TexturePath 贴图路径
// @param ReplaceId 贴图ID索引
// 只能替换模型中有Replaceable ID x 贴图的模型,ID为索引。不会替换大头像中的模型
native DzSetWidgetTexture takes agent Handle, string TexturePath, integer ReplaceId returns nothing

// 单位 - 修改单位选择圈缩放
// 修改单位${Unit} 的选择圈缩放为${scale}
// @param Unit 单位
// @param scale 缩放大小
// 可以0隐藏或者显示修改指定单位的选择圈大小
native DzSetUnitSelectScale takes unit Unit, real scale returns nothing

// 单位 - 设置单位是否忽略点击
// 设置单位${Unit} 的点击球是否忽略${ignore}
// @param Unit 单位
// @param ignore 是否忽略点击
// true为忽略, false会恢复,删除蝗虫技能后, 隐藏显示单位, 再设置忽略点击false, 关闭打开碰撞 即完美删除蝗虫。
native DzSetUnitHitIgnore takes unit Unit, boolean ignore returns nothing

// 特效 - 特效绑定特效
// 给特效${Handle}的附加点${AttachName} 绑定特效 ${eff}
// @param Handle 特效
// @param AttachName 附加点名称
// @param eff 要绑定的特效
native DzEffectBindEffect takes agent Handle, string AttachName, effect eff returns nothing

function KKConvertInt2AbilId takes integer i returns integer
	return i
endfunction

function KKConvertAbilId2Int takes integer i returns integer
	return i
endfunction

function KKConvertInt2Color takes integer i returns integer
	return i
endfunction

function KKConvertColor2Int takes integer i returns integer
	return i
endfunction


// 界面 - 设置Frame控件忽略点击事件
// 设置Frame控件${frame}忽略点击事件为${ignore}
// @param frame Frame控件
// @param ignore 是否忽略
// 只能用在Frame类型的控件, 对SimpleFrame类型的控件无效, 忽略后可以鼠标穿透地面, 不忽略则会挡住鼠标点击。
native DzFrameSetIgnoreTrackEvents takes integer frame, boolean ignore returns nothing

// 界面 - 创建ui模型控件
// 创建ui模型控件 指定父控件${parent_frame}
// @param parent_frame 父控件
// @return ui模型控件
// 用来显示3d模型用的,需要手动设置镜头参数,旋转缩放才能正确显示。
native DzFrameAddModel takes integer parent_frame returns integer

// 界面 - ui模型 - 设置模型文件
// 设置ui模型控件${model_frame}的文件路径为${model_file}, 队伍颜色id为${team_color_id}
// @param model_frame ui模型控件
// @param model_file 模型文件路径
// @param team_color_id 队伍颜色ID(0-15,0为红色)
// 只能是ui模型控件, 队伍颜色id是0~15 0为红色
native DzFrameSetModel2 takes integer model_frame, string model_file, integer team_color_id returns nothing

// 界面 - ui模型 - 添加绑定特效
// 为ui模型控件${model_frame}绑定特效, 附加点${attach_point}, 特效模型文件路径${model_file}
// @param model_frame ui模型控件
// @param attach_point 附加点名称
// @param model_file 特效模型文件路径
// @return 特效控件
// 重置模型后自动失效,只能是ui模型控件, 返回effect_frame
native DzFrameAddModelEffect takes integer model_frame, string attach_point, string model_file returns integer

// 界面 - ui模型 - 移除绑定特效
// 为ui模型控件${model_frame}移除绑定的特效${effect_frame}
// @param model_frame ui模型控件
// @param effect_frame 特效控件
// effect_frame只能是ui模型添加绑定特效的返回值
native DzFrameRemoveModelEffect takes integer model_frame, integer effect_frame returns nothing

// 界面 - ui模型 - 播放动画指定索引
// ui模型控件${model_frame}播放动画指定索引${anim_index}
// @param model_frame ui模型控件
// @param anim_index 动画索引
// 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelAnimationByIndex takes integer model_frame, integer anim_index returns nothing

// 界面 - ui模型 - 播放动画指定动画名
// ui模型控件${model_frame}播放动画指定动画名${animation}
// @param model_frame ui模型控件
// @param animation 动画名称
// 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelAnimation takes integer model_frame, string animation returns nothing

// 界面 - ui模型 - 设置场景内镜头源点
// ui模型控件${model_frame} 设置镜头源点 x轴${x},y轴${y},z轴${z}
// @param model_frame ui模型控件
// @param x X轴坐标
// @param y Y轴坐标
// @param z Z轴坐标
// 只能是ui模型控件
native DzFrameSetModelCameraSource takes integer model_frame, real x, real y, real z returns nothing

// 界面 - ui模型 - 设置场景内镜头目标点
// ui模型控件${model_frame}设置镜头目标点 x轴${x},y轴${y},z轴${z}
// @param model_frame ui模型控件
// @param x X轴坐标
// @param y Y轴坐标
// @param z Z轴坐标
// 只能是ui模型控件
native DzFrameSetModelCameraTarget takes integer model_frame, real x, real y, real z returns nothing

// 界面 - ui模型 - 设置缩放大小
// ui模型控件${model_frame} 设置 缩放${size}
// @param model_frame ui模型控件
// @param size 缩放大小
// 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelSize takes integer model_frame, real size returns nothing

// 界面 - ui模型 - 获取缩放大小
// 获取ui模型控件${model_frame}的缩放大小
// @param model_frame ui模型控件
// @return 缩放大小
// 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameGetModelSize takes integer model_frame returns real

// 界面 - ui模型 - 设置场景内的坐标(X Y Z)
// ui模型控件${model_frame} 设置 X轴${x}, Y轴${y}, Z轴${z}
// @param model_frame ui模型控件
// @param x X轴坐标
// @param y Y轴坐标
// @param z Z轴坐标
// 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelPosition takes integer model_frame, real x, real y, real z returns nothing

// 界面 - ui模型 - 设置场景内的坐标X轴
// ui模型控件${model_frame} 设置 X轴${x}
// @param model_frame ui模型控件
// @param x X轴坐标
// 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelX takes integer model_frame, real x returns nothing

// 界面 - ui模型 - 获取场景内的坐标X轴
// 获取ui模型控件${model_frame}场景内的坐标X轴
// @param model_frame ui模型控件
// @return X轴坐标
// 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameGetModelX takes integer model_frame returns real

// 界面 - ui模型 - 设置场景内的坐标Y轴
// ui模型控件${model_frame} 设置 Y轴${y}
// @param model_frame ui模型控件
// @param y Y轴坐标
// 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelY takes integer model_frame, real y returns nothing

// 界面 - ui模型 - 获取场景内的坐标Y轴
// 获取ui模型控件${model_frame}场景内的坐标Y轴
// @param model_frame ui模型控件
// @return Y轴坐标
// 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameGetModelY takes integer model_frame returns real

// 界面 - ui模型 - 设置场景内的坐标Z轴
// ui模型控件${model_frame} 设置 Z轴${z}
// @param model_frame ui模型控件
// @param z Z轴坐标
// 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelZ takes integer model_frame, real z returns nothing

// 界面 - ui模型 - 获取场景内的坐标Z轴
// 获取ui模型控件${model_frame}场景内的坐标Z轴
// @param model_frame ui模型控件
// @return Z轴坐标
// 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameGetModelZ takes integer model_frame returns real

// 界面 - ui模型 - 设置动画播放速度
// ui模型控件${model_frame} 设置 动画播放速度${speed}
// @param model_frame ui模型控件
// @param speed 播放速度倍率
// 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelSpeed takes integer model_frame, real speed returns nothing

// 界面 - ui模型 - 获取动画播放速度
// 获取ui模型控件${model_frame}场景内的动画播放速度
// @param model_frame ui模型控件
// @return 播放速度倍率
// 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameGetModelSpeed takes integer model_frame returns real

// 界面 - ui模型 - 设置矩阵缩放
// ui模型控件${model_frame} 设置 矩阵缩放 (X轴${x}, Y轴${y}, Z轴${z})
// @param model_frame ui模型控件
// @param x X轴缩放
// @param y Y轴缩放
// @param z Z轴缩放
// 每次调用累计乘法计算缩放, 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelScale takes integer model_frame, real x, real y, real z returns nothing

// 界面 - ui模型 - 设置矩阵重置
// ui模型控件${model_frame} 设置矩阵重置
// @param model_frame ui模型控件
// 缩放重置为1, 旋转清零, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelMatReset takes integer model_frame returns nothing

// 界面 - ui模型 - 设置矩阵旋转X轴
// ui模型控件${model_frame} 设置矩阵旋转X轴${x}
// @param model_frame ui模型控件
// @param x X轴旋转角度
// 每次调用累计乘法计算, 不想累计的重置后再设置, 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelRotateX takes integer model_frame, real x returns nothing

// 界面 - ui模型 - 设置矩阵旋转Y轴
// ui模型控件${model_frame} 设置矩阵旋转Y轴${y}
// @param model_frame ui模型控件
// @param y Y轴旋转角度
// 每次调用累计乘法计算, 不想累计的重置后再设置, 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelRotateY takes integer model_frame, real y returns nothing

// 界面 - ui模型 - 设置矩阵旋转Z轴
// ui模型控件${model_frame} 设置矩阵旋转Z轴${z}
// @param model_frame ui模型控件
// @param z Z轴旋转角度
// 每次调用累计乘法计算, 不想累计的重置后再设置, 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelRotateZ takes integer model_frame, real z returns nothing

// 界面 - ui模型 - 设置模型颜色
// ui模型控件${model_frame} 设置模型颜色${color}
// @param model_frame ui模型控件
// @param color 颜色值(包含透明通道)
// 包含透明通道, 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelColor takes integer model_frame, integer color returns nothing

// 界面 - ui模型 - 获取颜色
// 获取ui模型控件 ${model_frame} 的颜色
// @param model_frame ui模型控件
// @return 颜色值
// 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameGetModelColor takes integer model_frame returns integer

// 界面 - ui模型 - 替换模型id贴图
// ui模型控件${model_frame} 设置贴图路径${texture_file}, 指定id${replace_texutre_id}
// @param model_frame ui模型控件
// @param texture_file 贴图路径
// @param replace_texutre_id 贴图ID索引
// id是指模型里指定的纹理id, 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelTexture takes integer model_frame, string texture_file, integer replace_texutre_id returns nothing

// 界面 - ui模型 - 设置粒子2缩放大小
// ui模型控件${model_frame} 设置粒子2缩放大小${scale}
// @param model_frame ui模型控件
// @param scale 缩放倍数
// 必须是有粒子2的模型, 缩放是乘法计算需要大于0, 设置模型后会重置, 可以是ui模型控件、SPRITE、MODEL类型的控件
native DzFrameSetModelParticle2Size takes integer model_frame, real scale returns nothing

// 界面 - 获取游戏外界面底层
// 获取游戏外界面底层
// @return GlueUI控件
// 返回GlueUI, 从config房间界面到加载界面完成 都属于GlueUI, 进入游戏后属于GameUI
native DzGetGlueUI takes nothing returns integer

// 界面 - 获取鼠标控件
// 获取鼠标控件
// @return 鼠标控件
// 返回的是SPRITE模型控件,可以通过缩放大小为0来隐藏鼠标, 需要注意的是游戏内跟游戏外鼠标UI不一样,可以游戏开始0秒之后再获取使用。
native DzFrameGetMouse takes nothing returns integer

// 界面 - 获取控件绑定的整数
// 获取控件${frame}绑定的整数
// @param frame 控件
// @return 绑定的整数值
// 相当于获取 <<新建Frame [Tag]:DzCreateFrameByTagName>> 函数最后一个参数
native DzFrameGetContext takes integer frame returns integer

// 界面 - 获取控件的全局名字
// 获取控件${frame}的全局名字
// @param frame 控件
// @return 全局名字
// 相当于获取 <<新建Frame [Tag]:DzCreateFrameByTagName>> 函数第2个参数
native DzFrameGetName takes integer frame returns string

// 界面 - 设置控件全局名字跟绑定整数
// 设置控件${frame} 全局名字${name} 绑定整数${context}
// @param frame 控件
// @param name 全局名字
// @param context 绑定的整数
// 相当于修改 <<新建Frame [Tag]:DzCreateFrameByTagName>> 函数的第2个参数,跟最后一个参数,全局名字不能重复,否则退出游戏时会崩溃,可以使用修改后的名字跟整数查找控件,支持Frame、SimpleFrame、SimpleTexture、SimpleStringFont
native DzFrameSetNameContext takes integer frame, string name, integer context returns nothing

// 界面 - 设置文本控件字间距
// 设置文本控件${text_frame} 设置字间距${spacing}
// @param text_frame 文本控件
// @param spacing 字间距
// 只能TEXT类型控件使用
native DzFrameSetTextFontSpacing takes integer text_frame, real spacing returns nothing

// 界面 - 获取技能/物品按钮的冷却模型控件
// 获取技能/物品按钮${cmd_btn}的冷却模型控件
// @param cmd_btn 技能/物品按钮
// @return 冷却模型控件
// 获取技能或者物品按钮上面的 冷却模型控件,相当于是SPRITE类型的控件
native KKCommandGetCooldownModel takes integer cmd_btn returns integer

// 界面 - 设置技能/物品按钮的冷却模型缩放大小
// 设置技能/物品按钮${cmd_btn}的冷却模型缩放大小${size}
// @param cmd_btn 技能/物品按钮
// @param size 缩放大小
// 只能技能/物品按钮使用, 修改按钮大小后,需要手动缩放一次cd模型的缩放比例
native KKCommandSetCooldownModelSize takes integer cmd_btn, real size returns nothing

// 界面 - 设置技能/物品按钮的冷却模型缩放指定宽高比例
// 设置技能/物品按钮${cmd_btn}的冷却模型缩放宽比例${width}, 高比例${height}
// @param cmd_btn 技能/物品按钮
// @param width 宽度缩放比例
// @param height 高度缩放比例
// 只能技能/物品按钮使用, 修改按钮大小后,需要手动缩放一次cd模型的缩放比例
native KKCommandSetCooldownModelSize2 takes integer cmd_btn, real width, real height returns nothing

// 物品 - 玩家当前选择的物品(同步)
// 获取玩家${p}当前选择的物品(同步)
// @param p 玩家
// @return 选中的物品
// 返回值是同步的。每次选择物品后会延迟0.1秒刷新返回值。
native DzGetPlayerLastSelectedItem takes player p returns item

// 获取当前缓存模型的数量
// 获取当前缓存模型的数量
// @return 缓存模型数量
// 返回值异步的,用来检测当前游戏模型数量用的
native DzGetCacheModelCount takes nothing returns integer

// 游戏 - 限制最高帧数
// 限制最高帧数 为${max_fps}
// @param max_fps 最高帧数
// 跟解锁上限不同,只能60之内, 例如30帧用来模拟卡顿的游戏环境
native DzSetMaxFps takes integer max_fps returns nothing

// 界面 - 允许查看指定单位技能
// 允许查看指定单位${u}的技能, 是否开启${is_enable}
// @param u 单位
// @param is_enable 是否开启
// 开启后可以看友军或敌军单位的技能
native DzEnableDrawSkillPanel takes unit u, boolean is_enable returns nothing

// 界面 - 允许查看指定玩家单位技能
// 允许查看指定玩家${p}的单位技能, 是否开启${is_enable}
// @param p 玩家
// @param is_enable 是否开启
// 开启后可以看友军或敌军单位的技能
native DzEnableDrawSkillPanelByPlayer takes player p, boolean is_enable returns nothing

// 特效 - 设置特效迷雾可见
// 设置特效${eff}在迷雾里可见${is_visible}
// @param eff 特效
// @param is_visible 是否可见
// 只能对创建到地面的特效使用。迷雾即非视野 非黑色阴影的区域
native DzSetEffectFogVisible takes effect eff, boolean is_visible returns nothing

// 特效 - 设置特效黑色阴影可见
// 设置特效${eff}在黑色阴影里可见${is_visible}
// @param eff 特效
// @param is_visible 是否可见
// 只能对创建到地面的特效使用。黑色阴影即未解锁的区域
native DzSetEffectMaskVisible takes effect eff, boolean is_visible returns nothing

// 世界坐标 - 绑定Frame到单位实时位置
// 绑定Frame${frame}到单位${u}的实时位置, 偏移世界坐标(X${world_x}, Y${world_y}, Z${world_z}) 偏移屏幕坐标(X${screen_x}, Y${screen_y}) 战争迷雾可见${fog_visible} 有单位视野可见${unit_visible} 单位死亡可见${dead_visible}
// @param frame 控件
// @param u 单位
// @param world_x 世界坐标X偏移
// @param world_y 世界坐标Y偏移
// @param world_z 世界坐标Z偏移
// @param screen_x 屏幕坐标X偏移
// @param screen_y 屏幕坐标Y偏移
// @param fog_visible 战争迷雾可见
// @param unit_visible 有单位视野可见
// @param dead_visible 单位死亡可见
// 绑定后会清除控件锚点, 每帧设置控件中心坐标为 世界坐标+偏移 转屏幕坐标 +偏移后的位置, 超出屏幕，或者不满足条件的情况下会对控件隐藏, 在删除单位，或者删除控件前解除绑定。
native DzFrameBindWidget takes integer frame, widget u, real world_x, real world_y, real world_z, real screen_x, real screen_y, boolean fog_visible, boolean unit_visible, boolean dead_visible returns nothing

// 世界坐标 - 绑定Frame到世界坐标实时位置
// 绑定Frame${frame}世界坐标(X${world_x}, Y${world_y}, Z${world_z}) 偏移屏幕坐标(X${screen_x}, Y${screen_y}) 战争迷雾可见${fog_visible}
// @param frame 控件
// @param world_x 世界坐标X
// @param world_y 世界坐标Y
// @param world_z 世界坐标Z
// @param screen_x 屏幕坐标X偏移
// @param screen_y 屏幕坐标Y偏移
// @param fog_visible 战争迷雾可见
// 绑定后会清除控件锚点, 每帧设置控件中心坐标为 世界坐标 转屏幕坐标 +偏移后的位置, 超出屏幕，或者不满足条件的情况下会对控件隐藏, 在删除控件前解除绑定。
native DzFrameBindWorldPos takes integer frame, real world_x, real world_y, real world_z, real screen_x, real screen_y, boolean fog_visible returns nothing

// 世界坐标 - 解除Frame的绑定
// 解除Frame${frame}的绑定
// @param frame 控件
// 解除绑定后不会再刷新位置跟改变隐藏显示
native DzFrameUnBind takes integer frame returns nothing

// 世界坐标 - 绑定Frame到物品实时位置
// 绑定Frame${frame}到物品${u}的实时位置, 偏移世界坐标(X${world_x}, Y${world_y}, Z${world_z}) 偏移屏幕坐标(X${screen_x}, Y${screen_y}) 战争迷雾可见${fog_visible} 物品隐藏时一起隐藏${item_visible}
// @param frame 控件
// @param u 物品
// @param world_x 世界坐标X偏移
// @param world_y 世界坐标Y偏移
// @param world_z 世界坐标Z偏移
// @param screen_x 屏幕坐标X偏移
// @param screen_y 屏幕坐标Y偏移
// @param fog_visible 战争迷雾可见
// @param item_visible 物品隐藏时一起隐藏
// 绑定后会清除控件锚点, 每帧设置控件中心坐标为 世界坐标+偏移 转屏幕坐标 +偏移后的位置, 超出屏幕，或者不满足条件的情况下会对控件隐藏, 在删除物品，或者删除控件前解除绑定。
function KKFrameBindItem takes integer frame, widget u, real world_x, real world_y, real world_z, real screen_x, real screen_y, boolean fog_visible, boolean item_visible returns nothing
	call DzFrameBindWidget(frame, u, world_x, world_y, world_z, screen_x, screen_y, fog_visible, item_visible, true)
	set u=null
endfunction

// 界面 - 屏蔽所有单位指向UI跟血条
// 屏蔽所有单位指向UI跟血条
// 屏蔽会保留选择圈，开局调用一次后即可屏蔽所有单位的，以便重写血条
native DzDisableUnitPreselectUi takes nothing returns nothing

// 界面 - 屏蔽所有物品指向UI
// 屏蔽所有物品指向UI
// 屏蔽会保留选择圈，开局调用一次后即可屏蔽所有物品的，以便写物品地面UI
native DzDisableItemPreselectUi takes nothing returns nothing

// 界面 - 获取下层Frame
// 获取下层Frame
// @return 下层Frame
native DzFrameGetLowerLevelFrame takes nothing returns integer

// 界面 - 设置复选框勾选状态
// 设置复选框${check_box_frame}的勾选状态为${checked}
// @param check_box_frame 复选框
// @param checked 勾选状态
// 只能对CHECKBOX、GLUECHECKBOX 类型使用
native DzFrameSetCheckBoxState takes integer check_box_frame, boolean checked returns nothing

// 界面 - 获取复选框勾选状态
// 获取复选框${check_box_frame}的勾选状态
// @param check_box_frame 复选框
// @return 勾选状态
native DzFrameGetCheckBoxState takes integer check_box_frame returns boolean

// 界面 - 判断Frame是否获得焦点
// 判断Frame${frame}是否获得焦点
// @param frame 控件
// @return 是否获得焦点
native DzFrameIsFocus takes integer frame returns boolean

// 界面 - 设置编辑框激活状态
// 设置编辑框${frame}激活状态${is_active}
// @param frame 编辑框
// @param is_active 激活状态
// true可以主动调用激活焦点的同时激活输入法, false关闭输入法, 只能对EDITBOX、GLUEEDITBOX类型使用
native DzFrameSetEditBoxActive takes integer frame, boolean is_active returns nothing

// 界面 - 设置编辑框禁用输入法
// 设置编辑框${frame}是否禁用输入法${is_disable}
// @param frame 编辑框
// @param is_disable 是否禁用输入法
// true禁用输入法, 禁用后只能输入英文字母跟数字, 不禁用可以打中文, 只能对EDITBOX、GLUEEDITBOX类型使用
native DzFrameSetEditBoxDisableIme takes integer frame, boolean is_disable returns nothing

// 硬件 - 判断是否窗口模式
// 判断是否窗口模式
// @return 是否窗口模式
native DzIsWindowMode takes nothing returns boolean

// 硬件 - 判断窗口是否激活
// 判断窗口是否激活
// @return 窗口是否激活
native DzIsWindowActive takes nothing returns boolean

// 硬件 - 设置游戏窗口位置
// 设置游戏窗口位置 屏幕X轴${x}, 屏幕Y轴${y}
// @param x 屏幕X轴坐标
// @param y 屏幕Y轴坐标
// 只有窗口模式才有效，屏幕XY轴是指用户屏幕 0,0 为右上角
native DzWindowSetPoint takes integer x, integer y returns nothing

// 硬件 - 设置游戏窗口大小
// 设置游戏窗口大小 屏幕宽度${width}, 高度${height}
// @param width 窗口宽度
// @param height 窗口高度
// 只有窗口模式才有效, 改变大小之后 可以通过屏幕大小 设置窗口位置来居中
native DzWindowSetSize takes integer width, integer height returns nothing

// 硬件 - 获取屏幕宽度
// 获取屏幕宽度
// @return 屏幕宽度
native DzGetSystemMetricsWidth takes nothing returns integer

// 硬件 - 获取屏幕高度
// 获取屏幕高度
// @return 屏幕高度
native DzGetSystemMetricsHeight takes nothing returns integer

// 装饰物 - 获取地形装饰物数量
// 获取地形装饰物数量
// @return 装饰物数量
native DzGetDoodadsCount takes nothing returns integer

// 装饰物 - 设置地形装饰物矩阵缩放
// 装饰物${doodads_index}设置 X轴${x}, Y轴${y}, Z轴${z}缩放
// @param doodads_index 装饰物索引
// @param x X轴缩放
// @param y Y轴缩放
// @param z Z轴缩放
// 每次调用是乘法计算， 需要填大于0的数值，填0会直接导致之后的计算失效
native DzSetDoodadsMatScale takes integer doodads_index, real x, real y, real z returns nothing

// 装饰物 - 设置地形装饰物矩阵旋转X轴
// 装饰物${doodads_index}设置 X轴${x}旋转
// @param doodads_index 装饰物索引
// @param x X轴旋转角度
// 每次调用是乘法计算
native DzSetDoodadsMatRotateX takes integer doodads_index, real x returns nothing

// 装饰物 - 设置地形装饰物矩阵旋转Y轴
// 装饰物${doodads_index}设置 Y轴${y}旋转
// @param doodads_index 装饰物索引
// @param y Y轴旋转角度
// 每次调用是乘法计算
native DzSetDoodadsMatRotateY takes integer doodads_index, real y returns nothing

// 装饰物 - 设置地形装饰物矩阵旋转Z轴
// 装饰物${doodads_index}设置 Z轴${z}旋转
// @param doodads_index 装饰物索引
// @param z Z轴旋转角度
// 每次调用是乘法计算
native DzSetDoodadsMatRotateZ takes integer doodads_index, real z returns nothing

// 装饰物 - 设置地形装饰物矩阵重置
// 装饰物${doodads_index}矩阵重置
// @param doodads_index 装饰物索引
// 将缩放重置为1，将旋转角度重置为0
native DzSetDoodadsMatReset takes integer doodads_index returns nothing


#endif

