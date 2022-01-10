"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildrenTypes = exports.getParentTypes = exports.TypeExtends = exports.isType = exports.isBaseType = exports.types = exports.Types = exports.StatementTypes = void 0;
const defaultVersion = "1.32";
const statemType = ["boolean", "integer", "real", "string", "handle"];
const baseType = [...statemType, "code"];
const type_1_20 = ["agent", "event", "player", "widget", "unit", "destructable", "item", "ability", "buff", "force", "group", "trigger", "triggercondition", "triggeraction", "timer", "location", "region", "rect", "boolexpr", "sound", "conditionfunc", "filterfunc", "unitpool", "itempool", "race", "alliancetype", "racepreference", "gamestate", "igamestate", "fgamestate", "playerstate", "playerscore", "playergameresult", "unitstate", "aidifficulty", "eventid", "gameevent", "playerevent", "playerunitevent", "unitevent", "limitop", "widgetevent", "dialogevent", "unittype", "gamespeed", "gamedifficulty", "gametype", "mapflag", "mapvisibility", "mapsetting", "mapdensity", "mapcontrol", "playerslotstate", "volumegroup", "camerafield", "camerasetup", "playercolor", "placement", "startlocprio", "raritycontrol", "blendmode", "texmapflags", "effect", "effecttype", "weathereffect", "terraindeformation", "fogstate", "fogmodifier", "dialog", "button", "quest", "questitem", "defeatcondition", "timerdialog", "leaderboard", "multiboard", "multiboarditem", "trackable", "gamecache", "version", "itemtype", "texttag", "attacktype", "damagetype", "weapontype", "soundtype", "lightning", "pathingtype", "image", "ubersplat"];
const type_1_24 = ["hashtable"];
const type_1_29 = ["mousebuttontype"];
const type_1_30 = ["animtype", "subanimtype"];
const type_1_31 = ["framehandle", "originframetype", "framepointtype", "textaligntype", "frameeventtype", "oskeytype", "abilityintegerfield", "abilityrealfield", "abilitybooleanfield", "abilitystringfield", "abilityintegerlevelfield", "abilityreallevelfield", "abilitybooleanlevelfield", "abilitystringlevelfield", "abilityintegerlevelarrayfield", "abilityreallevelarrayfield", "abilitybooleanlevelarrayfield", "abilitystringlevelarrayfield", "unitintegerfield", "unitrealfield", "unitbooleanfield", "unitstringfield", "unitweaponintegerfield", "unitweaponrealfield", "unitweaponbooleanfield", "unitweaponstringfield", "itemintegerfield", "itemrealfield", "itembooleanfield", "itemstringfield", "movetype", "targetflag", "armortype", "heroattribute", "defensetype", "regentype", "unitcategory", "pathingflag"];
const type_1_32 = ["minimapicon", "commandbuttoneffect"];
function types(version = defaultVersion, containsCode = false) {
    const types = containsCode ? baseType : statemType;
    if (!version) {
        version = defaultVersion;
    }
    if (version == "1.32") {
        types.push(...type_1_32, ...type_1_31, ...type_1_30, ...type_1_29, ...type_1_24, ...type_1_20);
    }
    else if (version == "1.31") {
        types.push(...type_1_31, ...type_1_30, ...type_1_29, ...type_1_24, ...type_1_20);
    }
    else if (version == "1.30") {
        types.push(...type_1_30, ...type_1_29, ...type_1_24, ...type_1_20);
    }
    else if (version == "1.29") {
        types.push(...type_1_29, ...type_1_24, ...type_1_20);
    }
    else if (version == "1.24") {
        types.push(...type_1_24, ...type_1_20);
    }
    else if (version == "1.20") {
        types.push(...type_1_20);
    }
    return types;
}
exports.types = types;
function isBaseType(type) {
    return baseType.includes(type);
}
exports.isBaseType = isBaseType;
function isType(type, version = defaultVersion) {
    return types(version).includes(type);
}
exports.isType = isType;
const StatementTypes = types(defaultVersion, false);
exports.StatementTypes = StatementTypes;
const Types = types(defaultVersion, true);
exports.Types = Types;
const TypeExtends = {
    "boolean": [],
    "int": [],
    "real": [
        "int"
    ],
    "string": [],
    "code": [
        "nothing"
    ],
    "handle": [],
    "agent": [
        "handle"
    ],
    "player": [
        "agent",
        "handle"
    ],
    "unit": [
        "widget"
    ],
    "item": [
        "widget"
    ],
    "buff": [
        "ability"
    ],
    "group": [
        "agent",
        "handle"
    ],
    "triggercondition": [
        "agent",
        "handle"
    ],
    "timer": [
        "agent",
        "handle"
    ],
    "region": [
        "agent",
        "handle"
    ],
    "boolexpr": [
        "agent",
        "handle"
    ],
    "conditionfunc": [
        "boolexpr",
        "agent",
        "handle"
    ],
    "unitpool": [
        "handle"
    ],
    "race": [
        "handle"
    ],
    "racepreference": [
        "handle"
    ],
    "igamestate": [
        "gamestate"
    ],
    "playerstate": [
        "handle"
    ],
    "playergameresult": [
        "handle"
    ],
    "aidifficulty": [
        "handle"
    ],
    "eventid": [
        "handle"
    ],
    "playerevent": [
        "eventid",
        "handle"
    ],
    "unitevent": [
        "eventid",
        "handle"
    ],
    "widgetevent": [
        "eventid",
        "handle"
    ],
    "unittype": [
        "handle"
    ],
    "gamespeed": [
        "handle"
    ],
    "gametype": [
        "handle"
    ],
    "mapvisibility": [
        "handle"
    ],
    "mapdensity": [
        "handle"
    ],
    "minimapicon": [
        "handle"
    ],
    "volumegroup": [
        "handle"
    ],
    "camerasetup": [
        "handle"
    ],
    "placement": [
        "handle"
    ],
    "raritycontrol": [
        "handle"
    ],
    "texmapflags": [
        "handle"
    ],
    "effecttype": [
        "handle"
    ],
    "terraindeformation": [
        "handle"
    ],
    "fogmodifier": [
        "agent",
        "handle"
    ],
    "button": [
        "agent",
        "handle"
    ],
    "questitem": [
        "agent",
        "handle"
    ],
    "timerdialog": [
        "agent",
        "handle"
    ],
    "multiboard": [
        "agent",
        "handle"
    ],
    "trackable": [
        "agent",
        "handle"
    ],
    "version": [
        "handle"
    ],
    "texttag": [
        "handle"
    ],
    "damagetype": [
        "handle"
    ],
    "soundtype": [
        "handle"
    ],
    "pathingtype": [
        "handle"
    ],
    "animtype": [
        "handle"
    ],
    "image": [
        "handle"
    ],
    "hashtable": [
        "agent",
        "handle"
    ],
    "originframetype": [
        "handle"
    ],
    "textaligntype": [
        "handle"
    ],
    "oskeytype": [
        "handle"
    ],
    "abilityrealfield": [
        "handle"
    ],
    "abilitystringfield": [
        "handle"
    ],
    "abilityreallevelfield": [
        "handle"
    ],
    "abilitystringlevelfield": [
        "handle"
    ],
    "abilityreallevelarrayfield": [
        "handle"
    ],
    "abilitystringlevelarrayfield": [
        "handle"
    ],
    "unitrealfield": [
        "handle"
    ],
    "unitstringfield": [
        "handle"
    ],
    "unitweaponrealfield": [
        "handle"
    ],
    "unitweaponstringfield": [
        "handle"
    ],
    "itemrealfield": [
        "handle"
    ],
    "itemstringfield": [
        "handle"
    ],
    "targetflag": [
        "handle"
    ],
    "heroattribute": [
        "handle"
    ],
    "regentype": [
        "handle"
    ],
    "pathingflag": [
        "handle"
    ]
};
exports.TypeExtends = TypeExtends;
function getParentTypes(type) {
    var _a;
    return (_a = TypeExtends[type]) !== null && _a !== void 0 ? _a : [];
}
exports.getParentTypes = getParentTypes;
function getChildrenTypes(type) {
    const keys = Object.keys(TypeExtends);
    return keys.filter(key => {
        return TypeExtends[key] && TypeExtends[key].includes(type);
    });
}
exports.getChildrenTypes = getChildrenTypes;
