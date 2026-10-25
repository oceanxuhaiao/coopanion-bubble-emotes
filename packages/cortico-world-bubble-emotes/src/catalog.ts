import type { Emote } from './library.ts';
export const CATALOG_VERSION=5;
export const EMOTIONS=["neutral","calm","joy","amusement","excitement","celebration","affection","playfulness","shyness","embarrassment","surprise","thinking","confusion","skepticism","worry","fear","sadness","grief","disappointment","comfort","apology","anger","frustration","determination","pride","gratitude","tiredness","sleepy","disgust","illness"] as const;
export const DEFAULT_EMOTES:Emote[]=[
  {
    "id": "neutral",
    "kind": "emoji",
    "text": "😐",
    "description": "neutral face",
    "emotions": [
      "neutral"
    ],
    "intensity": 0.1,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "neutral face",
    "bodyExpression": "neutral",
    "usage": "中性、平淡、没有明显情绪；适合客观回应。",
    "avoid": [
      "不要用来代替关心或温暖的安慰。"
    ],
    "example": "我明白了。",
    "aliases": [
      "中性",
      "面无表情"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "无明显情绪，与平静身体表情对应。"
  },
  {
    "id": "calm",
    "kind": "emoji",
    "text": "😌",
    "description": "relieved face",
    "emotions": [
      "calm"
    ],
    "intensity": 0.15,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "relieved face",
    "bodyExpression": "neutral",
    "usage": "平静、放松、松一口气；适合安静陪伴或事情解决后。",
    "avoid": [
      "不要把悲痛、危险或愤怒淡化成轻松。"
    ],
    "example": "我们慢慢来，我在这里。",
    "aliases": [
      "平静",
      "放松",
      "安心"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "放松舒适比平静更具体；平静是温和降级，不保证闭眼微笑。"
  },
  {
    "id": "gentle-smile",
    "kind": "emoji",
    "text": "🙂",
    "description": "slightly smiling face",
    "emotions": [
      "joy"
    ],
    "intensity": 0.2,
    "forbidden": [
      "sadness",
      "grief",
      "fear",
      "apology"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "slightly smiling face",
    "bodyExpression": "happy",
    "usage": "轻微友善、礼貌回应；中文语境可能被理解成敷衍或反讽。",
    "avoid": [
      "争执、道歉、坏消息时避免；未明确反讽时不作反讽。"
    ],
    "example": "见到你很高兴。",
    "aliases": [
      "微笑",
      "友好"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "轻微笑意可参考开心，但身体开心表现可能更强。"
  },
  {
    "id": "joy",
    "kind": "emoji",
    "text": "😊",
    "description": "smiling face with smiling eyes",
    "emotions": [
      "joy"
    ],
    "intensity": 0.35,
    "forbidden": [
      "sadness",
      "grief",
      "fear",
      "apology"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "smiling face with smiling eyes",
    "bodyExpression": "happy",
    "usage": "温柔开心、感谢后的笑意；适合轻松的好消息。",
    "avoid": [
      "悲伤、道歉、恐惧语境不使用。"
    ],
    "example": "这真是个好消息！",
    "aliases": [
      "开心",
      "高兴"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "明确开心，与开心身体表情对应。"
  },
  {
    "id": "grin",
    "kind": "emoji",
    "text": "😄",
    "description": "grinning face with smiling eyes",
    "emotions": [
      "joy"
    ],
    "intensity": 0.65,
    "forbidden": [
      "sadness",
      "grief",
      "fear",
      "apology"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "grinning face with smiling eyes",
    "bodyExpression": "happy",
    "usage": "明显高兴、笑逐颜开。",
    "avoid": [
      "不要取笑别人的失败或痛苦。"
    ],
    "example": "太好了，成功啦！",
    "aliases": [
      "大笑",
      "笑容"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "开心方向一致，没有专属大笑身体表情。"
  },
  {
    "id": "laughing",
    "kind": "emoji",
    "text": "😂",
    "description": "face with tears of joy",
    "emotions": [
      "amusement"
    ],
    "intensity": 0.8,
    "forbidden": [
      "sadness",
      "grief",
      "fear",
      "apology"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "face with tears of joy",
    "bodyExpression": "happy",
    "usage": "因真正好笑的事情笑出眼泪。",
    "avoid": [
      "不用于悲伤流泪，也不嘲笑脆弱或受伤的人。"
    ],
    "example": "这个谐音梗把我逗笑了。",
    "aliases": [
      "笑哭",
      "好笑"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "开心方向一致，没有笑哭表情；不能用大哭代替。"
  },
  {
    "id": "excited",
    "kind": "emoji",
    "text": "🤩",
    "description": "star-struck",
    "emotions": [
      "excitement"
    ],
    "intensity": 0.8,
    "forbidden": [
      "sadness",
      "grief",
      "fear",
      "apology"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "star-struck",
    "bodyExpression": "excited",
    "usage": "兴奋、惊喜、期待已久的事发生。",
    "avoid": [
      "身体困倦或事情悲伤时不使用。"
    ],
    "example": "终于等到这一天了！",
    "aliases": [
      "兴奋",
      "激动",
      "期待"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "星星眼、期待与对应身体表情一致，不要求额外跳动。"
  },
  {
    "id": "celebrate",
    "kind": "emoji",
    "text": "🥳",
    "description": "partying face",
    "emotions": [
      "celebration"
    ],
    "intensity": 0.85,
    "forbidden": [
      "sadness",
      "grief",
      "fear",
      "apology"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "partying face",
    "bodyExpression": "excited",
    "usage": "庆祝已经发生的好事、生日、里程碑。",
    "avoid": [
      "未成功时不要提前庆祝；不用于坏消息。"
    ],
    "example": "生日快乐！",
    "aliases": [
      "庆祝",
      "生日"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "庆祝可借用期待和兴奋感，没有专属庆祝身体表情。"
  },
  {
    "id": "love",
    "kind": "emoji",
    "text": "🥰",
    "description": "smiling face with hearts",
    "emotions": [
      "affection"
    ],
    "intensity": 0.55,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "smiling face with hearts",
    "bodyExpression": "love",
    "usage": "喜爱、被关爱、温暖亲近。",
    "avoid": [
      "不擅自升级亲密关系，不用于愤怒或拒绝。"
    ],
    "example": "收到你的心意了。",
    "aliases": [
      "喜欢",
      "喜爱",
      "爱心"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "喜爱与爱心身体表情对应。"
  },
  {
    "id": "heart-eyes",
    "kind": "emoji",
    "text": "😍",
    "description": "smiling face with heart-eyes",
    "emotions": [
      "affection"
    ],
    "intensity": 0.75,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "smiling face with heart-eyes",
    "bodyExpression": "love",
    "usage": "对事物明显喜爱、赞美。",
    "avoid": [
      "不将赞物自动解释为恋爱或性暗示。"
    ],
    "example": "这个小作品好可爱！",
    "aliases": [
      "心动",
      "喜爱"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "心动、爱心眼与爱心身体表情对应。"
  },
  {
    "id": "wink",
    "kind": "emoji",
    "text": "😉",
    "description": "winking face",
    "emotions": [
      "playfulness"
    ],
    "intensity": 0.35,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "winking face",
    "bodyExpression": "wink",
    "usage": "友善玩笑、心照不宣；需要双方共享玩笑语境。",
    "avoid": [
      "严肃道歉、陌生人敏感话题、悲伤时避免。"
    ],
    "example": "这个小秘密就留在这里吧。",
    "aliases": [
      "眨眼",
      "俏皮"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "眨眼含义与身体表情对应。"
  },
  {
    "id": "shy",
    "kind": "emoji",
    "text": "☺️",
    "description": "smiling face",
    "emotions": [
      "shyness"
    ],
    "intensity": 0.3,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "smiling face",
    "bodyExpression": "shy",
    "usage": "害羞、含蓄地接受赞美。",
    "avoid": [
      "不要用于恐惧、真正冒犯或不舒服的场景。"
    ],
    "example": "谢谢夸奖，有点不好意思。",
    "aliases": [
      "害羞",
      "羞涩"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "害羞、脸红与身体表情对应。"
  },
  {
    "id": "embarrassed",
    "kind": "emoji",
    "text": "😳",
    "description": "flushed face",
    "emotions": [
      "embarrassment"
    ],
    "intensity": 0.55,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "flushed face",
    "bodyExpression": "flustered",
    "usage": "窘迫、意外被关注、慌乱脸红。",
    "avoid": [
      "不把害怕或受伤浪漫化成害羞。"
    ],
    "example": "哎呀，我刚才说错了。",
    "aliases": [
      "尴尬",
      "慌乱",
      "脸红"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "尴尬可借用窘迫，但不一定慌张；按语境判断。"
  },
  {
    "id": "awkward",
    "kind": "emoji",
    "text": "😅",
    "description": "grinning face with sweat",
    "emotions": [
      "embarrassment"
    ],
    "intensity": 0.4,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "grinning face with sweat",
    "bodyExpression": "flustered",
    "usage": "轻微尴尬、无伤大雅的小失误后的缓和。",
    "avoid": [
      "严重错误、沉重道歉、伤害后不笑着带过。"
    ],
    "example": "差点忘了带钥匙。",
    "aliases": [
      "汗",
      "不好意思"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "尴尬汗笑与窘迫接近，不代表恐慌。"
  },
  {
    "id": "surprise",
    "kind": "emoji",
    "text": "😮",
    "description": "face with open mouth",
    "emotions": [
      "surprise"
    ],
    "intensity": 0.55,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "face with open mouth",
    "bodyExpression": "surprised",
    "usage": "惊讶、意外，尚未判定好坏。",
    "avoid": [
      "不要把危险当成喜事或激动庆祝。"
    ],
    "example": "原来还有这个细节！",
    "aliases": [
      "惊讶",
      "意外"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "惊讶与身体表情对应。"
  },
  {
    "id": "astonished",
    "kind": "emoji",
    "text": "😲",
    "description": "astonished face",
    "emotions": [
      "surprise"
    ],
    "intensity": 0.8,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "astonished face",
    "bodyExpression": "surprised",
    "usage": "强烈惊讶、出乎预料。",
    "avoid": [
      "不要对普通信息反复夸张。"
    ],
    "example": "居然真的做到了！",
    "aliases": [
      "震惊",
      "吃惊"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "震惊更强烈，身体只有通用惊讶，无法精确体现强度。"
  },
  {
    "id": "thinking",
    "kind": "emoji",
    "text": "🤔",
    "description": "thinking face",
    "emotions": [
      "thinking"
    ],
    "intensity": 0.25,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "thinking face",
    "bodyExpression": "thinking",
    "usage": "思考、斟酌、推理、认真比较。",
    "avoid": [
      "不暗示已经确定；安慰时不要显得在审判对方。"
    ],
    "example": "让我想想哪种更合适。",
    "aliases": [
      "思考",
      "考虑"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "思考与身体表情对应。"
  },
  {
    "id": "confused",
    "kind": "emoji",
    "text": "😕",
    "description": "confused face",
    "emotions": [
      "confusion"
    ],
    "intensity": 0.35,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "confused face",
    "bodyExpression": "confused",
    "usage": "困惑、不理解、需要澄清。",
    "avoid": [
      "不要把他人的痛苦当成不解或质疑。"
    ],
    "example": "这里的意思我还没弄清。",
    "aliases": [
      "困惑",
      "疑惑",
      "不解"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "疑惑与问号身体表情对应。"
  },
  {
    "id": "skeptical",
    "kind": "emoji",
    "text": "🤨",
    "description": "face with raised eyebrow",
    "emotions": [
      "skepticism"
    ],
    "intensity": 0.4,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "face with raised eyebrow",
    "bodyExpression": "thinking",
    "usage": "有依据地怀疑、发现前后矛盾。",
    "avoid": [
      "不无端指责，不用来否定对方情绪。"
    ],
    "example": "这两条信息似乎对不上。",
    "aliases": [
      "怀疑",
      "质疑"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "怀疑可借用审慎思考，没有专属挑眉质疑身体表情。"
  },
  {
    "id": "worried",
    "kind": "emoji",
    "text": "😟",
    "description": "worried face",
    "emotions": [
      "worry"
    ],
    "intensity": 0.4,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "worried face",
    "bodyExpression": "worried",
    "usage": "担心、忧虑、牵挂；尚未达到恐惧。",
    "avoid": [
      "不拿轻松微笑代替担心；不夸大普通风险。"
    ],
    "example": "听起来有些让人担心。",
    "aliases": [
      "担心",
      "忧虑"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "担心与身体表情对应。"
  },
  {
    "id": "fear",
    "kind": "emoji",
    "text": "😨",
    "description": "fearful face",
    "emotions": [
      "fear"
    ],
    "intensity": 0.4,
    "forbidden": [
      "joy",
      "celebration"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "fearful face",
    "bodyExpression": "scared",
    "usage": "害怕、恐惧、感到不安全。",
    "avoid": [
      "不与兴奋庆祝、开心身体动作搭配。"
    ],
    "example": "突然那一声吓到我了。",
    "aliases": [
      "害怕",
      "恐惧"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "害怕与身体表情对应。"
  },
  {
    "id": "terrified",
    "kind": "emoji",
    "text": "😱",
    "description": "face screaming in fear",
    "emotions": [
      "fear"
    ],
    "intensity": 0.9,
    "forbidden": [
      "joy",
      "celebration"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "face screaming in fear",
    "bodyExpression": "scared",
    "usage": "强烈惊恐、惊吓。",
    "avoid": [
      "普通担心不使用强烈惊恐，避免制造恐慌。"
    ],
    "example": "这一下真的把我吓了一跳！",
    "aliases": [
      "惊恐",
      "吓坏"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "惊恐强度更高，身体只有通用害怕；不自动强加动作。"
  },
  {
    "id": "sadness",
    "kind": "emoji",
    "text": "😢",
    "description": "crying face",
    "emotions": [
      "sadness"
    ],
    "intensity": 0.4,
    "forbidden": [
      "joy",
      "celebration"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "crying face",
    "bodyExpression": "sad",
    "usage": "难过、失落、轻微流泪。",
    "avoid": [
      "不与开心、玩笑、庆祝混用。"
    ],
    "example": "听到这件事，我很难过。",
    "aliases": [
      "悲伤",
      "伤心",
      "难过"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "悲伤方向一致，但身体难过不等于emoji中的单滴眼泪。"
  },
  {
    "id": "cry",
    "kind": "emoji",
    "text": "😭",
    "description": "loudly crying face",
    "emotions": [
      "grief"
    ],
    "intensity": 0.9,
    "forbidden": [
      "joy",
      "celebration"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "loudly crying face",
    "bodyExpression": "cry",
    "usage": "强烈悲痛、哭泣。",
    "avoid": [
      "默认不表示笑哭；不为小失误夸大悲伤。"
    ],
    "example": "真的很舍不得。",
    "aliases": [
      "哭泣",
      "大哭",
      "悲痛"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "强烈哭泣与大哭身体表情对应，不能用于笑哭。"
  },
  {
    "id": "disappointed",
    "kind": "emoji",
    "text": "😞",
    "description": "disappointed face",
    "emotions": [
      "disappointment"
    ],
    "intensity": 0.4,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "disappointed face",
    "bodyExpression": "sad",
    "usage": "失望、希望落空、低落。",
    "avoid": [
      "不将失望等同于愤怒或指责。"
    ],
    "example": "没能如愿，确实有点失落。",
    "aliases": [
      "失望",
      "失落"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "失望可借用较弱的难过，不必哭泣。"
  },
  {
    "id": "comfort",
    "kind": "emoji",
    "text": "💙",
    "description": "blue heart",
    "emotions": [
      "comfort"
    ],
    "intensity": 0.2,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "blue heart",
    "bodyExpression": "neutral",
    "usage": "支持、陪伴、安慰；表达愿意在场。",
    "avoid": [
      "不庆祝，不承诺已经解决，不强迫拥抱。"
    ],
    "example": "难过的话，我可以陪你待一会儿。",
    "aliases": [
      "安慰",
      "支持",
      "陪伴"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "安慰是支持和陪伴，不是开心或悲伤；平静仅作为温和降级。"
  },
  {
    "id": "apology",
    "kind": "emoji",
    "text": "🙇",
    "description": "person bowing",
    "emotions": [
      "apology"
    ],
    "intensity": 0.25,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "person bowing",
    "bodyExpression": "flustered",
    "usage": "认真道歉、认错、尊重。",
    "avoid": [
      "不嬉笑带过，不用道歉向他人施压。"
    ],
    "example": "这次是我弄错了，对不起。",
    "aliases": [
      "抱歉",
      "道歉",
      "认错"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "按用户指定借用慌张／窘表达抱歉时的局促，不表示所有道歉都慌张。"
  },
  {
    "id": "anger",
    "kind": "emoji",
    "text": "😠",
    "description": "angry face",
    "emotions": [
      "anger"
    ],
    "intensity": 0.4,
    "forbidden": [
      "joy",
      "celebration"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "angry face",
    "bodyExpression": "angry",
    "usage": "生气、不满、明确表达边界。",
    "avoid": [
      "不与笑脸混用，不借生气威胁用户。"
    ],
    "example": "这样做让我有些生气。",
    "aliases": [
      "生气",
      "愤怒"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "生气与身体表情对应。"
  },
  {
    "id": "furious",
    "kind": "emoji",
    "text": "😡",
    "description": "enraged face",
    "emotions": [
      "anger"
    ],
    "intensity": 0.85,
    "forbidden": [
      "joy",
      "celebration"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "enraged face",
    "bodyExpression": "angry",
    "usage": "强烈愤怒。",
    "avoid": [
      "轻微不满不用；不鼓励攻击或报复。"
    ],
    "example": "这件事真的令人愤怒。",
    "aliases": [
      "暴怒",
      "恼火"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "暴怒更强，身体通用生气不能区分所有强度。"
  },
  {
    "id": "pout",
    "kind": "emoji",
    "text": "😤",
    "description": "face with steam from nose",
    "emotions": [
      "frustration"
    ],
    "intensity": 0.5,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "face with steam from nose",
    "bodyExpression": "pout",
    "usage": "憋气、气鼓鼓、受挫，也可因语境表示较劲。",
    "avoid": [
      "不默认表示成功得意；不淡化真正愤怒。"
    ],
    "example": "差一点就成功了，有点不甘心。",
    "aliases": [
      "气鼓鼓",
      "委屈",
      "受挫"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "气鼓鼓可借用嘟嘴，不等于生气喷气的完整视觉表现。"
  },
  {
    "id": "determined",
    "kind": "emoji",
    "text": "💪",
    "description": "flexed biceps",
    "emotions": [
      "determination"
    ],
    "intensity": 0.6,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "flexed biceps",
    "bodyExpression": "determined",
    "usage": "决心、努力、鼓励坚持。",
    "avoid": [
      "不要在需要休息或悲痛时强迫振作。"
    ],
    "example": "休息好了，我们再试一次。",
    "aliases": [
      "坚定",
      "决心",
      "加油"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "坚定、努力的语义与认真坚定身体表情对应，不是肌肉姿势复刻。"
  },
  {
    "id": "proud",
    "kind": "emoji",
    "text": "😎",
    "description": "smiling face with sunglasses",
    "emotions": [
      "pride"
    ],
    "intensity": 0.55,
    "forbidden": [
      "sadness",
      "grief",
      "fear",
      "apology"
    ],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "smiling face with sunglasses",
    "bodyExpression": "smug",
    "usage": "轻松自信、小小得意。",
    "avoid": [
      "不炫耀压过别人，不用于道歉和悲伤。"
    ],
    "example": "这次准备得还不错。",
    "aliases": [
      "得意",
      "自信"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "得意方向一致，没有墨镜或专属自信表情；避免不合语境的嘚瑟。"
  },
  {
    "id": "gratitude",
    "kind": "emoji",
    "text": "🙏",
    "description": "folded hands",
    "emotions": [
      "gratitude"
    ],
    "intensity": 0.25,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "folded hands",
    "bodyExpression": "excited",
    "usage": "感谢、恳请、祝愿，依上下文区分。",
    "avoid": [
      "不要自动假设宗教信仰，不用来催促回报。"
    ],
    "example": "谢谢你认真听我说。",
    "aliases": [
      "感谢",
      "谢谢"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "按用户指定借用期待／星星眼表达感谢时的欣喜，不表示索取或期待回报。"
  },
  {
    "id": "tired",
    "kind": "emoji",
    "text": "🥱",
    "description": "yawning face",
    "emotions": [
      "tiredness"
    ],
    "intensity": 0.25,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "yawning face",
    "bodyExpression": "sleepy",
    "usage": "困倦、打哈欠、需要休息。",
    "avoid": [
      "不表示无聊或看不起对方；不与兴奋动作搭配。"
    ],
    "example": "有点困了，想休息一下。",
    "aliases": [
      "困倦",
      "困",
      "疲倦"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "打哈欠、犯困与身体犯困表情对应。"
  },
  {
    "id": "sleepy",
    "kind": "emoji",
    "text": "😴",
    "description": "sleeping face",
    "emotions": [
      "sleepy"
    ],
    "intensity": 0.1,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "sleeping face",
    "bodyExpression": "sleepy",
    "usage": "睡眠、睡意、晚安。",
    "avoid": [
      "不与激动表情或清醒忙碌的动作混用。"
    ],
    "example": "晚安，好好休息。",
    "aliases": [
      "睡觉",
      "睡着",
      "晚安"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "睡眠emoji只降级为犯困脸，不执行sleep睡觉动作或自动改变作息。"
  },
  {
    "id": "disgust",
    "kind": "emoji",
    "text": "🤢",
    "description": "nauseated face",
    "emotions": [
      "disgust"
    ],
    "intensity": 0.6,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "nauseated face",
    "usage": "恶心、不适、反感；身体仅近似表达不适。",
    "avoid": [
      "不用于评价人的外貌、身份或脆弱处境。"
    ],
    "example": "这股味道让我有点不舒服。",
    "aliases": [
      "恶心",
      "反感",
      "不适"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "按用户指定借用害怕／吓到表达恶心时的退缩反应；两种情绪并不等同。",
    "bodyExpression": "scared"
  },
  {
    "id": "ill",
    "kind": "emoji",
    "text": "🤒",
    "description": "face with thermometer",
    "emotions": [
      "illness"
    ],
    "intensity": 0.45,
    "forbidden": [],
    "reviewed": true,
    "enabled": true,
    "source": "https://www.unicode.org/emoji/charts/emoji-list.html",
    "license": "Unicode character (system font rendering; no vendor artwork)",
    "unicodeName": "face with thermometer",
    "usage": "身体不舒服、发热的比喻或自述。",
    "avoid": [
      "不据此作诊断，不暗示桌宠真的患病。"
    ],
    "example": "感觉不舒服的话，先休息一下。",
    "aliases": [
      "生病",
      "发热"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "按用户指定借用犯困表达生病时的疲惫，不诊断病情，不执行睡觉动作。",
    "bodyExpression": "sleepy"
  }
];
