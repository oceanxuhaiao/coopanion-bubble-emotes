// src/config.ts
var BUBBLE_EMOTES_DEFAULTS = { enabled: false };

// src/analysis-response.ts
var AnalysisError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
  code;
};
async function responseJson(response, maxBytes = 32e3) {
  if (!response.ok) {
    try {
      await response.body?.cancel();
    } catch {
    }
    throw new AnalysisError(response.status === 401 || response.status === 403 ? "http_auth" : response.status === 429 ? "http_limit" : "http_service");
  }
  const reader = response.body?.getReader();
  if (!reader) throw new AnalysisError("format");
  let size = 0;
  const parts = [], decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        try {
          await reader.cancel();
        } catch {
        }
        throw new AnalysisError("response_limit");
      }
      parts.push(decoder.decode(value, { stream: true }));
    }
    parts.push(decoder.decode());
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(parts.join(""));
  } catch {
    throw new AnalysisError("format");
  }
}

// src/body-snapshot.ts
function readBodySnapshot(raw, observedAt = Date.now()) {
  if (!raw || typeof raw !== "object") return;
  const s = raw;
  if (typeof s.connected !== "boolean" || typeof s.skin?.figure !== "string") return;
  return {
    figure: s.skin.figure,
    connected: s.connected,
    onDesktop: typeof s.onDesktop === "boolean" ? s.onDesktop : void 0,
    quiet: "unknown",
    posture: "unknown",
    observedAt,
    // The audited built-in kit rejects busy expressions and does not wake for these faces.
    faceProtection: ["coo", "whale"].includes(s.skin.figure) ? "builtin-kit" : void 0
  };
}

// src/expression-policy.ts
var EXPRESSION_POLICY = "Judge emoji suitability separately from whether words already convey emotion. Clear pet-authored amusement, teasing, praise, surprise, concern or comfort is emotional commentary even while describing a video or song. If a suitable enabled emoji fits and none is used, choose missing; text being understandable, low intensity, quotation inside a comment, or not strictly needing decoration is NOT by itself a reason for unnecessary. Keep genuinely neutral factual narration plain. Pure quotation without a pet reaction, unclear attribution, negation, sensitive suffering or unsuitable tone must not be mechanically decorated. Return expressionIntent: emotional_commentary|neutral_narration|uncertain and emojiSuitability: suitable|avoid|uncertain. These fields concern the current whole utterance, not just a quoted word. Missing should include one exact suitable available emoji. Never claim there are no materials without checking available.";
function applyExpressionPolicy(result, raw, used, entries) {
  if (result.needsReview) return result;
  const analysis = { ...result.analysis };
  let notice = result.notice;
  if (!used.length && analysis.emotion === "neutral" && analysis.verdict === "missing") return { analysis: { emotion: "uncertain", verdict: "uncertain", explanation: "\u4E2D\u6027\u53D9\u8FF0\u4E0E\u6F0F\u7528\u5224\u5B9A\u51B2\u7A81\uFF0C\u4FDD\u7559\u7EAF\u6587\u5B57\u3002" }, needsReview: true, notice: "\u4E2D\u6027\u51B2\u7A81\u4FDD\u62A4\uFF0C\u672A\u8865\u8868\u60C5\u3002" };
  if (!used.length && (raw?.emojiSuitability === "avoid" || raw?.emojiSuitability === "uncertain" || raw?.expressionIntent === "neutral_narration" || raw?.expressionIntent === "uncertain") && analysis.verdict === "missing") return { analysis: { emotion: analysis.emotion, verdict: "uncertain", explanation: "\u8BED\u5883\u88AB\u6807\u8BB0\u4E3A\u4E2D\u6027\u3001\u4E0D\u9002\u5B9C\u6216\u4E0D\u786E\u5B9A\uFF0C\u4FDD\u7559\u7EAF\u6587\u5B57\uFF0C\u7B49\u5F85\u590D\u6838\u3002" }, needsReview: true, notice: "\u8868\u60C5\u9002\u5B9C\u6027\u4E0E\u6F0F\u7528\u5224\u65AD\u51B2\u7A81\uFF0C\u4E0D\u751F\u6210\u8865\u5145\u5EFA\u8BAE\u3002" };
  if (!used.length && analysis.emotion !== "neutral" && analysis.emotion !== "uncertain" && analysis.verdict === "unnecessary" && raw?.expressionIntent === "emotional_commentary" && raw?.emojiSuitability === "suitable") {
    analysis.verdict = "missing";
    analysis.explanation = ("\u660E\u786E\u60C5\u7EEA\u8BC4\u8BBA\u4E14\u9002\u5408emoji\uFF0C\u6309\u5F53\u524D\u5224\u636E\u5EFA\u8BAE\u8865\u5145\u8868\u60C5\u3002\u539F\u5206\u6790\uFF1A" + analysis.explanation).slice(0, 500);
    notice = "\u660E\u786E\u60C5\u7EEA\u8BC4\u8BBA\u4E14\u9002\u5408\u8868\u60C5\uFF1B\u4E0D\u80FD\u4EC5\u56E0\u6587\u5B57\u5DF2\u80FD\u8868\u8FBE\u60C5\u7EEA\u800C\u5224\u5B9A\u4E0D\u9700\u8981\u3002";
  }
  if (!used.length && analysis.verdict === "missing" && analysis.emotion !== "neutral" && analysis.emotion !== "uncertain" && !analysis.suggestion && raw?.emojiSuitability !== "avoid") {
    const options = entries.filter((e) => e.kind === "emoji" && e.enabled && e.reviewed && e.text && e.emotions.includes(analysis.emotion) && !e.forbidden.includes(analysis.emotion) && e.intensity <= 0.8).sort((a, b) => a.intensity - b.intensity || a.id.localeCompare(b.id));
    if (options.length) {
      analysis.suggestion = options[0].text;
      notice = [notice, "\u6F0F\u7528\u5224\u65AD\u5DF2\u6709\uFF0C\u4F46\u672A\u8FD4\u56DE\u6709\u6548\u5EFA\u8BAE\uFF1B\u4ECE\u5F53\u524D\u540C\u60C5\u7EEA\u6620\u5C04\u8865\u5145\u6700\u4F4E\u5F3A\u5EA6\u53EF\u7528\u5019\u9009\uFF0C\u4ECD\u9700\u72EC\u7ACB\u5224\u65AD\u8BED\u5883\u3002"].filter(Boolean).join(" ");
    } else notice = [notice, "\u6F0F\u7528\u5224\u65AD\u6CA1\u6709\u5408\u9002\u7684\u4FDD\u5B88\u5019\u9009\uFF08\u542F\u7528\u3001\u5BA1\u6838\u3001\u60C5\u7EEA\u3001\u7981\u7528\u6216\u5F3A\u5EA6\u9650\u5236\uFF09\uFF0C\u672A\u5F3A\u884C\u8865\u8868\u60C5\u3002"].filter(Boolean).join(" ");
  }
  return { ...result, analysis, notice };
}

// src/world.ts
import { fileURLToPath } from "node:url";

// src/body-mapping.ts
var BODY_EXPRESSIONS = { neutral: "\u5E73\u9759", happy: "\u5F00\u5FC3", wink: "\u7728\u773C", love: "\u559C\u6B22\uFF0F\u7231\u5FC3", shy: "\u5BB3\u7F9E", surprised: "\u60CA\u8BB6", angry: "\u751F\u6C14", sad: "\u96BE\u8FC7", sleepy: "\u72AF\u56F0", thinking: "\u601D\u8003", smug: "\u5F97\u610F", pout: "\u561F\u5634", worried: "\u62C5\u5FC3", determined: "\u8BA4\u771F\uFF0F\u575A\u5B9A", flustered: "\u614C\u5F20\uFF0F\u7A98", scared: "\u5BB3\u6015", excited: "\u671F\u5F85\uFF0F\u661F\u661F\u773C", cry: "\u5927\u54ED", confused: "\u7591\u60D1" };

// src/emoji.ts
var emojiUnit = new RegExp("^(?:\\p{RGI_Emoji}|\\p{Extended_Pictographic}\\uFE0F?)$", "v");
var segments = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function isEmojiContent(text) {
  const parts = [...segments.segment(text.trim())].map((s) => s.segment);
  return parts.length > 0 && parts.some((s) => !/^\s+$/u.test(s)) && parts.every((s) => /^\s+$/u.test(s) || emojiUnit.test(s));
}

// src/library.ts
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, copyFileSync, openSync, closeSync, unlinkSync } from "node:fs";
import { join } from "node:path";

// src/catalog.ts
var CATALOG_VERSION = 5;
var EMOTIONS = ["neutral", "calm", "joy", "amusement", "excitement", "celebration", "affection", "playfulness", "shyness", "embarrassment", "surprise", "thinking", "confusion", "skepticism", "worry", "fear", "sadness", "grief", "disappointment", "comfort", "apology", "anger", "frustration", "determination", "pride", "gratitude", "tiredness", "sleepy", "disgust", "illness"];
var DEFAULT_EMOTES = [
  {
    "id": "neutral",
    "kind": "emoji",
    "text": "\u{1F610}",
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
    "usage": "\u4E2D\u6027\u3001\u5E73\u6DE1\u3001\u6CA1\u6709\u660E\u663E\u60C5\u7EEA\uFF1B\u9002\u5408\u5BA2\u89C2\u56DE\u5E94\u3002",
    "avoid": [
      "\u4E0D\u8981\u7528\u6765\u4EE3\u66FF\u5173\u5FC3\u6216\u6E29\u6696\u7684\u5B89\u6170\u3002"
    ],
    "example": "\u6211\u660E\u767D\u4E86\u3002",
    "aliases": [
      "\u4E2D\u6027",
      "\u9762\u65E0\u8868\u60C5"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u65E0\u660E\u663E\u60C5\u7EEA\uFF0C\u4E0E\u5E73\u9759\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "calm",
    "kind": "emoji",
    "text": "\u{1F60C}",
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
    "usage": "\u5E73\u9759\u3001\u653E\u677E\u3001\u677E\u4E00\u53E3\u6C14\uFF1B\u9002\u5408\u5B89\u9759\u966A\u4F34\u6216\u4E8B\u60C5\u89E3\u51B3\u540E\u3002",
    "avoid": [
      "\u4E0D\u8981\u628A\u60B2\u75DB\u3001\u5371\u9669\u6216\u6124\u6012\u6DE1\u5316\u6210\u8F7B\u677E\u3002"
    ],
    "example": "\u6211\u4EEC\u6162\u6162\u6765\uFF0C\u6211\u5728\u8FD9\u91CC\u3002",
    "aliases": [
      "\u5E73\u9759",
      "\u653E\u677E",
      "\u5B89\u5FC3"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u653E\u677E\u8212\u9002\u6BD4\u5E73\u9759\u66F4\u5177\u4F53\uFF1B\u5E73\u9759\u662F\u6E29\u548C\u964D\u7EA7\uFF0C\u4E0D\u4FDD\u8BC1\u95ED\u773C\u5FAE\u7B11\u3002"
  },
  {
    "id": "gentle-smile",
    "kind": "emoji",
    "text": "\u{1F642}",
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
    "usage": "\u8F7B\u5FAE\u53CB\u5584\u3001\u793C\u8C8C\u56DE\u5E94\uFF1B\u4E2D\u6587\u8BED\u5883\u53EF\u80FD\u88AB\u7406\u89E3\u6210\u6577\u884D\u6216\u53CD\u8BBD\u3002",
    "avoid": [
      "\u4E89\u6267\u3001\u9053\u6B49\u3001\u574F\u6D88\u606F\u65F6\u907F\u514D\uFF1B\u672A\u660E\u786E\u53CD\u8BBD\u65F6\u4E0D\u4F5C\u53CD\u8BBD\u3002"
    ],
    "example": "\u89C1\u5230\u4F60\u5F88\u9AD8\u5174\u3002",
    "aliases": [
      "\u5FAE\u7B11",
      "\u53CB\u597D"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u8F7B\u5FAE\u7B11\u610F\u53EF\u53C2\u8003\u5F00\u5FC3\uFF0C\u4F46\u8EAB\u4F53\u5F00\u5FC3\u8868\u73B0\u53EF\u80FD\u66F4\u5F3A\u3002"
  },
  {
    "id": "joy",
    "kind": "emoji",
    "text": "\u{1F60A}",
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
    "usage": "\u6E29\u67D4\u5F00\u5FC3\u3001\u611F\u8C22\u540E\u7684\u7B11\u610F\uFF1B\u9002\u5408\u8F7B\u677E\u7684\u597D\u6D88\u606F\u3002",
    "avoid": [
      "\u60B2\u4F24\u3001\u9053\u6B49\u3001\u6050\u60E7\u8BED\u5883\u4E0D\u4F7F\u7528\u3002"
    ],
    "example": "\u8FD9\u771F\u662F\u4E2A\u597D\u6D88\u606F\uFF01",
    "aliases": [
      "\u5F00\u5FC3",
      "\u9AD8\u5174"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u660E\u786E\u5F00\u5FC3\uFF0C\u4E0E\u5F00\u5FC3\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "grin",
    "kind": "emoji",
    "text": "\u{1F604}",
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
    "usage": "\u660E\u663E\u9AD8\u5174\u3001\u7B11\u9010\u989C\u5F00\u3002",
    "avoid": [
      "\u4E0D\u8981\u53D6\u7B11\u522B\u4EBA\u7684\u5931\u8D25\u6216\u75DB\u82E6\u3002"
    ],
    "example": "\u592A\u597D\u4E86\uFF0C\u6210\u529F\u5566\uFF01",
    "aliases": [
      "\u5927\u7B11",
      "\u7B11\u5BB9"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u5F00\u5FC3\u65B9\u5411\u4E00\u81F4\uFF0C\u6CA1\u6709\u4E13\u5C5E\u5927\u7B11\u8EAB\u4F53\u8868\u60C5\u3002"
  },
  {
    "id": "laughing",
    "kind": "emoji",
    "text": "\u{1F602}",
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
    "usage": "\u56E0\u771F\u6B63\u597D\u7B11\u7684\u4E8B\u60C5\u7B11\u51FA\u773C\u6CEA\u3002",
    "avoid": [
      "\u4E0D\u7528\u4E8E\u60B2\u4F24\u6D41\u6CEA\uFF0C\u4E5F\u4E0D\u5632\u7B11\u8106\u5F31\u6216\u53D7\u4F24\u7684\u4EBA\u3002"
    ],
    "example": "\u8FD9\u4E2A\u8C10\u97F3\u6897\u628A\u6211\u9017\u7B11\u4E86\u3002",
    "aliases": [
      "\u7B11\u54ED",
      "\u597D\u7B11"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u5F00\u5FC3\u65B9\u5411\u4E00\u81F4\uFF0C\u6CA1\u6709\u7B11\u54ED\u8868\u60C5\uFF1B\u4E0D\u80FD\u7528\u5927\u54ED\u4EE3\u66FF\u3002"
  },
  {
    "id": "excited",
    "kind": "emoji",
    "text": "\u{1F929}",
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
    "usage": "\u5174\u594B\u3001\u60CA\u559C\u3001\u671F\u5F85\u5DF2\u4E45\u7684\u4E8B\u53D1\u751F\u3002",
    "avoid": [
      "\u8EAB\u4F53\u56F0\u5026\u6216\u4E8B\u60C5\u60B2\u4F24\u65F6\u4E0D\u4F7F\u7528\u3002"
    ],
    "example": "\u7EC8\u4E8E\u7B49\u5230\u8FD9\u4E00\u5929\u4E86\uFF01",
    "aliases": [
      "\u5174\u594B",
      "\u6FC0\u52A8",
      "\u671F\u5F85"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u661F\u661F\u773C\u3001\u671F\u5F85\u4E0E\u5BF9\u5E94\u8EAB\u4F53\u8868\u60C5\u4E00\u81F4\uFF0C\u4E0D\u8981\u6C42\u989D\u5916\u8DF3\u52A8\u3002"
  },
  {
    "id": "celebrate",
    "kind": "emoji",
    "text": "\u{1F973}",
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
    "usage": "\u5E86\u795D\u5DF2\u7ECF\u53D1\u751F\u7684\u597D\u4E8B\u3001\u751F\u65E5\u3001\u91CC\u7A0B\u7891\u3002",
    "avoid": [
      "\u672A\u6210\u529F\u65F6\u4E0D\u8981\u63D0\u524D\u5E86\u795D\uFF1B\u4E0D\u7528\u4E8E\u574F\u6D88\u606F\u3002"
    ],
    "example": "\u751F\u65E5\u5FEB\u4E50\uFF01",
    "aliases": [
      "\u5E86\u795D",
      "\u751F\u65E5"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u5E86\u795D\u53EF\u501F\u7528\u671F\u5F85\u548C\u5174\u594B\u611F\uFF0C\u6CA1\u6709\u4E13\u5C5E\u5E86\u795D\u8EAB\u4F53\u8868\u60C5\u3002"
  },
  {
    "id": "love",
    "kind": "emoji",
    "text": "\u{1F970}",
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
    "usage": "\u559C\u7231\u3001\u88AB\u5173\u7231\u3001\u6E29\u6696\u4EB2\u8FD1\u3002",
    "avoid": [
      "\u4E0D\u64C5\u81EA\u5347\u7EA7\u4EB2\u5BC6\u5173\u7CFB\uFF0C\u4E0D\u7528\u4E8E\u6124\u6012\u6216\u62D2\u7EDD\u3002"
    ],
    "example": "\u6536\u5230\u4F60\u7684\u5FC3\u610F\u4E86\u3002",
    "aliases": [
      "\u559C\u6B22",
      "\u559C\u7231",
      "\u7231\u5FC3"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u559C\u7231\u4E0E\u7231\u5FC3\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "heart-eyes",
    "kind": "emoji",
    "text": "\u{1F60D}",
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
    "usage": "\u5BF9\u4E8B\u7269\u660E\u663E\u559C\u7231\u3001\u8D5E\u7F8E\u3002",
    "avoid": [
      "\u4E0D\u5C06\u8D5E\u7269\u81EA\u52A8\u89E3\u91CA\u4E3A\u604B\u7231\u6216\u6027\u6697\u793A\u3002"
    ],
    "example": "\u8FD9\u4E2A\u5C0F\u4F5C\u54C1\u597D\u53EF\u7231\uFF01",
    "aliases": [
      "\u5FC3\u52A8",
      "\u559C\u7231"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u5FC3\u52A8\u3001\u7231\u5FC3\u773C\u4E0E\u7231\u5FC3\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "wink",
    "kind": "emoji",
    "text": "\u{1F609}",
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
    "usage": "\u53CB\u5584\u73A9\u7B11\u3001\u5FC3\u7167\u4E0D\u5BA3\uFF1B\u9700\u8981\u53CC\u65B9\u5171\u4EAB\u73A9\u7B11\u8BED\u5883\u3002",
    "avoid": [
      "\u4E25\u8083\u9053\u6B49\u3001\u964C\u751F\u4EBA\u654F\u611F\u8BDD\u9898\u3001\u60B2\u4F24\u65F6\u907F\u514D\u3002"
    ],
    "example": "\u8FD9\u4E2A\u5C0F\u79D8\u5BC6\u5C31\u7559\u5728\u8FD9\u91CC\u5427\u3002",
    "aliases": [
      "\u7728\u773C",
      "\u4FCF\u76AE"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u7728\u773C\u542B\u4E49\u4E0E\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "shy",
    "kind": "emoji",
    "text": "\u263A\uFE0F",
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
    "usage": "\u5BB3\u7F9E\u3001\u542B\u84C4\u5730\u63A5\u53D7\u8D5E\u7F8E\u3002",
    "avoid": [
      "\u4E0D\u8981\u7528\u4E8E\u6050\u60E7\u3001\u771F\u6B63\u5192\u72AF\u6216\u4E0D\u8212\u670D\u7684\u573A\u666F\u3002"
    ],
    "example": "\u8C22\u8C22\u5938\u5956\uFF0C\u6709\u70B9\u4E0D\u597D\u610F\u601D\u3002",
    "aliases": [
      "\u5BB3\u7F9E",
      "\u7F9E\u6DA9"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u5BB3\u7F9E\u3001\u8138\u7EA2\u4E0E\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "embarrassed",
    "kind": "emoji",
    "text": "\u{1F633}",
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
    "usage": "\u7A98\u8FEB\u3001\u610F\u5916\u88AB\u5173\u6CE8\u3001\u614C\u4E71\u8138\u7EA2\u3002",
    "avoid": [
      "\u4E0D\u628A\u5BB3\u6015\u6216\u53D7\u4F24\u6D6A\u6F2B\u5316\u6210\u5BB3\u7F9E\u3002"
    ],
    "example": "\u54CE\u5440\uFF0C\u6211\u521A\u624D\u8BF4\u9519\u4E86\u3002",
    "aliases": [
      "\u5C34\u5C2C",
      "\u614C\u4E71",
      "\u8138\u7EA2"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u5C34\u5C2C\u53EF\u501F\u7528\u7A98\u8FEB\uFF0C\u4F46\u4E0D\u4E00\u5B9A\u614C\u5F20\uFF1B\u6309\u8BED\u5883\u5224\u65AD\u3002"
  },
  {
    "id": "awkward",
    "kind": "emoji",
    "text": "\u{1F605}",
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
    "usage": "\u8F7B\u5FAE\u5C34\u5C2C\u3001\u65E0\u4F24\u5927\u96C5\u7684\u5C0F\u5931\u8BEF\u540E\u7684\u7F13\u548C\u3002",
    "avoid": [
      "\u4E25\u91CD\u9519\u8BEF\u3001\u6C89\u91CD\u9053\u6B49\u3001\u4F24\u5BB3\u540E\u4E0D\u7B11\u7740\u5E26\u8FC7\u3002"
    ],
    "example": "\u5DEE\u70B9\u5FD8\u4E86\u5E26\u94A5\u5319\u3002",
    "aliases": [
      "\u6C57",
      "\u4E0D\u597D\u610F\u601D"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u5C34\u5C2C\u6C57\u7B11\u4E0E\u7A98\u8FEB\u63A5\u8FD1\uFF0C\u4E0D\u4EE3\u8868\u6050\u614C\u3002"
  },
  {
    "id": "surprise",
    "kind": "emoji",
    "text": "\u{1F62E}",
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
    "usage": "\u60CA\u8BB6\u3001\u610F\u5916\uFF0C\u5C1A\u672A\u5224\u5B9A\u597D\u574F\u3002",
    "avoid": [
      "\u4E0D\u8981\u628A\u5371\u9669\u5F53\u6210\u559C\u4E8B\u6216\u6FC0\u52A8\u5E86\u795D\u3002"
    ],
    "example": "\u539F\u6765\u8FD8\u6709\u8FD9\u4E2A\u7EC6\u8282\uFF01",
    "aliases": [
      "\u60CA\u8BB6",
      "\u610F\u5916"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u60CA\u8BB6\u4E0E\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "astonished",
    "kind": "emoji",
    "text": "\u{1F632}",
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
    "usage": "\u5F3A\u70C8\u60CA\u8BB6\u3001\u51FA\u4E4E\u9884\u6599\u3002",
    "avoid": [
      "\u4E0D\u8981\u5BF9\u666E\u901A\u4FE1\u606F\u53CD\u590D\u5938\u5F20\u3002"
    ],
    "example": "\u5C45\u7136\u771F\u7684\u505A\u5230\u4E86\uFF01",
    "aliases": [
      "\u9707\u60CA",
      "\u5403\u60CA"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u9707\u60CA\u66F4\u5F3A\u70C8\uFF0C\u8EAB\u4F53\u53EA\u6709\u901A\u7528\u60CA\u8BB6\uFF0C\u65E0\u6CD5\u7CBE\u786E\u4F53\u73B0\u5F3A\u5EA6\u3002"
  },
  {
    "id": "thinking",
    "kind": "emoji",
    "text": "\u{1F914}",
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
    "usage": "\u601D\u8003\u3001\u659F\u914C\u3001\u63A8\u7406\u3001\u8BA4\u771F\u6BD4\u8F83\u3002",
    "avoid": [
      "\u4E0D\u6697\u793A\u5DF2\u7ECF\u786E\u5B9A\uFF1B\u5B89\u6170\u65F6\u4E0D\u8981\u663E\u5F97\u5728\u5BA1\u5224\u5BF9\u65B9\u3002"
    ],
    "example": "\u8BA9\u6211\u60F3\u60F3\u54EA\u79CD\u66F4\u5408\u9002\u3002",
    "aliases": [
      "\u601D\u8003",
      "\u8003\u8651"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u601D\u8003\u4E0E\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "confused",
    "kind": "emoji",
    "text": "\u{1F615}",
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
    "usage": "\u56F0\u60D1\u3001\u4E0D\u7406\u89E3\u3001\u9700\u8981\u6F84\u6E05\u3002",
    "avoid": [
      "\u4E0D\u8981\u628A\u4ED6\u4EBA\u7684\u75DB\u82E6\u5F53\u6210\u4E0D\u89E3\u6216\u8D28\u7591\u3002"
    ],
    "example": "\u8FD9\u91CC\u7684\u610F\u601D\u6211\u8FD8\u6CA1\u5F04\u6E05\u3002",
    "aliases": [
      "\u56F0\u60D1",
      "\u7591\u60D1",
      "\u4E0D\u89E3"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u7591\u60D1\u4E0E\u95EE\u53F7\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "skeptical",
    "kind": "emoji",
    "text": "\u{1F928}",
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
    "usage": "\u6709\u4F9D\u636E\u5730\u6000\u7591\u3001\u53D1\u73B0\u524D\u540E\u77DB\u76FE\u3002",
    "avoid": [
      "\u4E0D\u65E0\u7AEF\u6307\u8D23\uFF0C\u4E0D\u7528\u6765\u5426\u5B9A\u5BF9\u65B9\u60C5\u7EEA\u3002"
    ],
    "example": "\u8FD9\u4E24\u6761\u4FE1\u606F\u4F3C\u4E4E\u5BF9\u4E0D\u4E0A\u3002",
    "aliases": [
      "\u6000\u7591",
      "\u8D28\u7591"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u6000\u7591\u53EF\u501F\u7528\u5BA1\u614E\u601D\u8003\uFF0C\u6CA1\u6709\u4E13\u5C5E\u6311\u7709\u8D28\u7591\u8EAB\u4F53\u8868\u60C5\u3002"
  },
  {
    "id": "worried",
    "kind": "emoji",
    "text": "\u{1F61F}",
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
    "usage": "\u62C5\u5FC3\u3001\u5FE7\u8651\u3001\u7275\u6302\uFF1B\u5C1A\u672A\u8FBE\u5230\u6050\u60E7\u3002",
    "avoid": [
      "\u4E0D\u62FF\u8F7B\u677E\u5FAE\u7B11\u4EE3\u66FF\u62C5\u5FC3\uFF1B\u4E0D\u5938\u5927\u666E\u901A\u98CE\u9669\u3002"
    ],
    "example": "\u542C\u8D77\u6765\u6709\u4E9B\u8BA9\u4EBA\u62C5\u5FC3\u3002",
    "aliases": [
      "\u62C5\u5FC3",
      "\u5FE7\u8651"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u62C5\u5FC3\u4E0E\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "fear",
    "kind": "emoji",
    "text": "\u{1F628}",
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
    "usage": "\u5BB3\u6015\u3001\u6050\u60E7\u3001\u611F\u5230\u4E0D\u5B89\u5168\u3002",
    "avoid": [
      "\u4E0D\u4E0E\u5174\u594B\u5E86\u795D\u3001\u5F00\u5FC3\u8EAB\u4F53\u52A8\u4F5C\u642D\u914D\u3002"
    ],
    "example": "\u7A81\u7136\u90A3\u4E00\u58F0\u5413\u5230\u6211\u4E86\u3002",
    "aliases": [
      "\u5BB3\u6015",
      "\u6050\u60E7"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u5BB3\u6015\u4E0E\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "terrified",
    "kind": "emoji",
    "text": "\u{1F631}",
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
    "usage": "\u5F3A\u70C8\u60CA\u6050\u3001\u60CA\u5413\u3002",
    "avoid": [
      "\u666E\u901A\u62C5\u5FC3\u4E0D\u4F7F\u7528\u5F3A\u70C8\u60CA\u6050\uFF0C\u907F\u514D\u5236\u9020\u6050\u614C\u3002"
    ],
    "example": "\u8FD9\u4E00\u4E0B\u771F\u7684\u628A\u6211\u5413\u4E86\u4E00\u8DF3\uFF01",
    "aliases": [
      "\u60CA\u6050",
      "\u5413\u574F"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u60CA\u6050\u5F3A\u5EA6\u66F4\u9AD8\uFF0C\u8EAB\u4F53\u53EA\u6709\u901A\u7528\u5BB3\u6015\uFF1B\u4E0D\u81EA\u52A8\u5F3A\u52A0\u52A8\u4F5C\u3002"
  },
  {
    "id": "sadness",
    "kind": "emoji",
    "text": "\u{1F622}",
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
    "usage": "\u96BE\u8FC7\u3001\u5931\u843D\u3001\u8F7B\u5FAE\u6D41\u6CEA\u3002",
    "avoid": [
      "\u4E0D\u4E0E\u5F00\u5FC3\u3001\u73A9\u7B11\u3001\u5E86\u795D\u6DF7\u7528\u3002"
    ],
    "example": "\u542C\u5230\u8FD9\u4EF6\u4E8B\uFF0C\u6211\u5F88\u96BE\u8FC7\u3002",
    "aliases": [
      "\u60B2\u4F24",
      "\u4F24\u5FC3",
      "\u96BE\u8FC7"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u60B2\u4F24\u65B9\u5411\u4E00\u81F4\uFF0C\u4F46\u8EAB\u4F53\u96BE\u8FC7\u4E0D\u7B49\u4E8Eemoji\u4E2D\u7684\u5355\u6EF4\u773C\u6CEA\u3002"
  },
  {
    "id": "cry",
    "kind": "emoji",
    "text": "\u{1F62D}",
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
    "usage": "\u5F3A\u70C8\u60B2\u75DB\u3001\u54ED\u6CE3\u3002",
    "avoid": [
      "\u9ED8\u8BA4\u4E0D\u8868\u793A\u7B11\u54ED\uFF1B\u4E0D\u4E3A\u5C0F\u5931\u8BEF\u5938\u5927\u60B2\u4F24\u3002"
    ],
    "example": "\u771F\u7684\u5F88\u820D\u4E0D\u5F97\u3002",
    "aliases": [
      "\u54ED\u6CE3",
      "\u5927\u54ED",
      "\u60B2\u75DB"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u5F3A\u70C8\u54ED\u6CE3\u4E0E\u5927\u54ED\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\uFF0C\u4E0D\u80FD\u7528\u4E8E\u7B11\u54ED\u3002"
  },
  {
    "id": "disappointed",
    "kind": "emoji",
    "text": "\u{1F61E}",
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
    "usage": "\u5931\u671B\u3001\u5E0C\u671B\u843D\u7A7A\u3001\u4F4E\u843D\u3002",
    "avoid": [
      "\u4E0D\u5C06\u5931\u671B\u7B49\u540C\u4E8E\u6124\u6012\u6216\u6307\u8D23\u3002"
    ],
    "example": "\u6CA1\u80FD\u5982\u613F\uFF0C\u786E\u5B9E\u6709\u70B9\u5931\u843D\u3002",
    "aliases": [
      "\u5931\u671B",
      "\u5931\u843D"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u5931\u671B\u53EF\u501F\u7528\u8F83\u5F31\u7684\u96BE\u8FC7\uFF0C\u4E0D\u5FC5\u54ED\u6CE3\u3002"
  },
  {
    "id": "comfort",
    "kind": "emoji",
    "text": "\u{1F499}",
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
    "usage": "\u652F\u6301\u3001\u966A\u4F34\u3001\u5B89\u6170\uFF1B\u8868\u8FBE\u613F\u610F\u5728\u573A\u3002",
    "avoid": [
      "\u4E0D\u5E86\u795D\uFF0C\u4E0D\u627F\u8BFA\u5DF2\u7ECF\u89E3\u51B3\uFF0C\u4E0D\u5F3A\u8FEB\u62E5\u62B1\u3002"
    ],
    "example": "\u96BE\u8FC7\u7684\u8BDD\uFF0C\u6211\u53EF\u4EE5\u966A\u4F60\u5F85\u4E00\u4F1A\u513F\u3002",
    "aliases": [
      "\u5B89\u6170",
      "\u652F\u6301",
      "\u966A\u4F34"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u5B89\u6170\u662F\u652F\u6301\u548C\u966A\u4F34\uFF0C\u4E0D\u662F\u5F00\u5FC3\u6216\u60B2\u4F24\uFF1B\u5E73\u9759\u4EC5\u4F5C\u4E3A\u6E29\u548C\u964D\u7EA7\u3002"
  },
  {
    "id": "apology",
    "kind": "emoji",
    "text": "\u{1F647}",
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
    "usage": "\u8BA4\u771F\u9053\u6B49\u3001\u8BA4\u9519\u3001\u5C0A\u91CD\u3002",
    "avoid": [
      "\u4E0D\u5B09\u7B11\u5E26\u8FC7\uFF0C\u4E0D\u7528\u9053\u6B49\u5411\u4ED6\u4EBA\u65BD\u538B\u3002"
    ],
    "example": "\u8FD9\u6B21\u662F\u6211\u5F04\u9519\u4E86\uFF0C\u5BF9\u4E0D\u8D77\u3002",
    "aliases": [
      "\u62B1\u6B49",
      "\u9053\u6B49",
      "\u8BA4\u9519"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u6309\u7528\u6237\u6307\u5B9A\u501F\u7528\u614C\u5F20\uFF0F\u7A98\u8868\u8FBE\u62B1\u6B49\u65F6\u7684\u5C40\u4FC3\uFF0C\u4E0D\u8868\u793A\u6240\u6709\u9053\u6B49\u90FD\u614C\u5F20\u3002"
  },
  {
    "id": "anger",
    "kind": "emoji",
    "text": "\u{1F620}",
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
    "usage": "\u751F\u6C14\u3001\u4E0D\u6EE1\u3001\u660E\u786E\u8868\u8FBE\u8FB9\u754C\u3002",
    "avoid": [
      "\u4E0D\u4E0E\u7B11\u8138\u6DF7\u7528\uFF0C\u4E0D\u501F\u751F\u6C14\u5A01\u80C1\u7528\u6237\u3002"
    ],
    "example": "\u8FD9\u6837\u505A\u8BA9\u6211\u6709\u4E9B\u751F\u6C14\u3002",
    "aliases": [
      "\u751F\u6C14",
      "\u6124\u6012"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u751F\u6C14\u4E0E\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "furious",
    "kind": "emoji",
    "text": "\u{1F621}",
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
    "usage": "\u5F3A\u70C8\u6124\u6012\u3002",
    "avoid": [
      "\u8F7B\u5FAE\u4E0D\u6EE1\u4E0D\u7528\uFF1B\u4E0D\u9F13\u52B1\u653B\u51FB\u6216\u62A5\u590D\u3002"
    ],
    "example": "\u8FD9\u4EF6\u4E8B\u771F\u7684\u4EE4\u4EBA\u6124\u6012\u3002",
    "aliases": [
      "\u66B4\u6012",
      "\u607C\u706B"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u66B4\u6012\u66F4\u5F3A\uFF0C\u8EAB\u4F53\u901A\u7528\u751F\u6C14\u4E0D\u80FD\u533A\u5206\u6240\u6709\u5F3A\u5EA6\u3002"
  },
  {
    "id": "pout",
    "kind": "emoji",
    "text": "\u{1F624}",
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
    "usage": "\u618B\u6C14\u3001\u6C14\u9F13\u9F13\u3001\u53D7\u632B\uFF0C\u4E5F\u53EF\u56E0\u8BED\u5883\u8868\u793A\u8F83\u52B2\u3002",
    "avoid": [
      "\u4E0D\u9ED8\u8BA4\u8868\u793A\u6210\u529F\u5F97\u610F\uFF1B\u4E0D\u6DE1\u5316\u771F\u6B63\u6124\u6012\u3002"
    ],
    "example": "\u5DEE\u4E00\u70B9\u5C31\u6210\u529F\u4E86\uFF0C\u6709\u70B9\u4E0D\u7518\u5FC3\u3002",
    "aliases": [
      "\u6C14\u9F13\u9F13",
      "\u59D4\u5C48",
      "\u53D7\u632B"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u6C14\u9F13\u9F13\u53EF\u501F\u7528\u561F\u5634\uFF0C\u4E0D\u7B49\u4E8E\u751F\u6C14\u55B7\u6C14\u7684\u5B8C\u6574\u89C6\u89C9\u8868\u73B0\u3002"
  },
  {
    "id": "determined",
    "kind": "emoji",
    "text": "\u{1F4AA}",
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
    "usage": "\u51B3\u5FC3\u3001\u52AA\u529B\u3001\u9F13\u52B1\u575A\u6301\u3002",
    "avoid": [
      "\u4E0D\u8981\u5728\u9700\u8981\u4F11\u606F\u6216\u60B2\u75DB\u65F6\u5F3A\u8FEB\u632F\u4F5C\u3002"
    ],
    "example": "\u4F11\u606F\u597D\u4E86\uFF0C\u6211\u4EEC\u518D\u8BD5\u4E00\u6B21\u3002",
    "aliases": [
      "\u575A\u5B9A",
      "\u51B3\u5FC3",
      "\u52A0\u6CB9"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u575A\u5B9A\u3001\u52AA\u529B\u7684\u8BED\u4E49\u4E0E\u8BA4\u771F\u575A\u5B9A\u8EAB\u4F53\u8868\u60C5\u5BF9\u5E94\uFF0C\u4E0D\u662F\u808C\u8089\u59FF\u52BF\u590D\u523B\u3002"
  },
  {
    "id": "proud",
    "kind": "emoji",
    "text": "\u{1F60E}",
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
    "usage": "\u8F7B\u677E\u81EA\u4FE1\u3001\u5C0F\u5C0F\u5F97\u610F\u3002",
    "avoid": [
      "\u4E0D\u70AB\u8000\u538B\u8FC7\u522B\u4EBA\uFF0C\u4E0D\u7528\u4E8E\u9053\u6B49\u548C\u60B2\u4F24\u3002"
    ],
    "example": "\u8FD9\u6B21\u51C6\u5907\u5F97\u8FD8\u4E0D\u9519\u3002",
    "aliases": [
      "\u5F97\u610F",
      "\u81EA\u4FE1"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u5F97\u610F\u65B9\u5411\u4E00\u81F4\uFF0C\u6CA1\u6709\u58A8\u955C\u6216\u4E13\u5C5E\u81EA\u4FE1\u8868\u60C5\uFF1B\u907F\u514D\u4E0D\u5408\u8BED\u5883\u7684\u561A\u745F\u3002"
  },
  {
    "id": "gratitude",
    "kind": "emoji",
    "text": "\u{1F64F}",
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
    "usage": "\u611F\u8C22\u3001\u6073\u8BF7\u3001\u795D\u613F\uFF0C\u4F9D\u4E0A\u4E0B\u6587\u533A\u5206\u3002",
    "avoid": [
      "\u4E0D\u8981\u81EA\u52A8\u5047\u8BBE\u5B97\u6559\u4FE1\u4EF0\uFF0C\u4E0D\u7528\u6765\u50AC\u4FC3\u56DE\u62A5\u3002"
    ],
    "example": "\u8C22\u8C22\u4F60\u8BA4\u771F\u542C\u6211\u8BF4\u3002",
    "aliases": [
      "\u611F\u8C22",
      "\u8C22\u8C22"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u6309\u7528\u6237\u6307\u5B9A\u501F\u7528\u671F\u5F85\uFF0F\u661F\u661F\u773C\u8868\u8FBE\u611F\u8C22\u65F6\u7684\u6B23\u559C\uFF0C\u4E0D\u8868\u793A\u7D22\u53D6\u6216\u671F\u5F85\u56DE\u62A5\u3002"
  },
  {
    "id": "tired",
    "kind": "emoji",
    "text": "\u{1F971}",
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
    "usage": "\u56F0\u5026\u3001\u6253\u54C8\u6B20\u3001\u9700\u8981\u4F11\u606F\u3002",
    "avoid": [
      "\u4E0D\u8868\u793A\u65E0\u804A\u6216\u770B\u4E0D\u8D77\u5BF9\u65B9\uFF1B\u4E0D\u4E0E\u5174\u594B\u52A8\u4F5C\u642D\u914D\u3002"
    ],
    "example": "\u6709\u70B9\u56F0\u4E86\uFF0C\u60F3\u4F11\u606F\u4E00\u4E0B\u3002",
    "aliases": [
      "\u56F0\u5026",
      "\u56F0",
      "\u75B2\u5026"
    ],
    "bodyMatch": "direct",
    "bodyMatchReason": "\u6253\u54C8\u6B20\u3001\u72AF\u56F0\u4E0E\u8EAB\u4F53\u72AF\u56F0\u8868\u60C5\u5BF9\u5E94\u3002"
  },
  {
    "id": "sleepy",
    "kind": "emoji",
    "text": "\u{1F634}",
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
    "usage": "\u7761\u7720\u3001\u7761\u610F\u3001\u665A\u5B89\u3002",
    "avoid": [
      "\u4E0D\u4E0E\u6FC0\u52A8\u8868\u60C5\u6216\u6E05\u9192\u5FD9\u788C\u7684\u52A8\u4F5C\u6DF7\u7528\u3002"
    ],
    "example": "\u665A\u5B89\uFF0C\u597D\u597D\u4F11\u606F\u3002",
    "aliases": [
      "\u7761\u89C9",
      "\u7761\u7740",
      "\u665A\u5B89"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u7761\u7720emoji\u53EA\u964D\u7EA7\u4E3A\u72AF\u56F0\u8138\uFF0C\u4E0D\u6267\u884Csleep\u7761\u89C9\u52A8\u4F5C\u6216\u81EA\u52A8\u6539\u53D8\u4F5C\u606F\u3002"
  },
  {
    "id": "disgust",
    "kind": "emoji",
    "text": "\u{1F922}",
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
    "usage": "\u6076\u5FC3\u3001\u4E0D\u9002\u3001\u53CD\u611F\uFF1B\u8EAB\u4F53\u4EC5\u8FD1\u4F3C\u8868\u8FBE\u4E0D\u9002\u3002",
    "avoid": [
      "\u4E0D\u7528\u4E8E\u8BC4\u4EF7\u4EBA\u7684\u5916\u8C8C\u3001\u8EAB\u4EFD\u6216\u8106\u5F31\u5904\u5883\u3002"
    ],
    "example": "\u8FD9\u80A1\u5473\u9053\u8BA9\u6211\u6709\u70B9\u4E0D\u8212\u670D\u3002",
    "aliases": [
      "\u6076\u5FC3",
      "\u53CD\u611F",
      "\u4E0D\u9002"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u6309\u7528\u6237\u6307\u5B9A\u501F\u7528\u5BB3\u6015\uFF0F\u5413\u5230\u8868\u8FBE\u6076\u5FC3\u65F6\u7684\u9000\u7F29\u53CD\u5E94\uFF1B\u4E24\u79CD\u60C5\u7EEA\u5E76\u4E0D\u7B49\u540C\u3002",
    "bodyExpression": "scared"
  },
  {
    "id": "ill",
    "kind": "emoji",
    "text": "\u{1F912}",
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
    "usage": "\u8EAB\u4F53\u4E0D\u8212\u670D\u3001\u53D1\u70ED\u7684\u6BD4\u55BB\u6216\u81EA\u8FF0\u3002",
    "avoid": [
      "\u4E0D\u636E\u6B64\u4F5C\u8BCA\u65AD\uFF0C\u4E0D\u6697\u793A\u684C\u5BA0\u771F\u7684\u60A3\u75C5\u3002"
    ],
    "example": "\u611F\u89C9\u4E0D\u8212\u670D\u7684\u8BDD\uFF0C\u5148\u4F11\u606F\u4E00\u4E0B\u3002",
    "aliases": [
      "\u751F\u75C5",
      "\u53D1\u70ED"
    ],
    "bodyMatch": "approximate",
    "bodyMatchReason": "\u6309\u7528\u6237\u6307\u5B9A\u501F\u7528\u72AF\u56F0\u8868\u8FBE\u751F\u75C5\u65F6\u7684\u75B2\u60EB\uFF0C\u4E0D\u8BCA\u65AD\u75C5\u60C5\uFF0C\u4E0D\u6267\u884C\u7761\u89C9\u52A8\u4F5C\u3002",
    "bodyExpression": "sleepy"
  }
];

// src/library.ts
var asEmotion = (v) => {
  if (!EMOTIONS.includes(v)) throw new Error("Unknown emotion.");
  return v;
};
function validateEmote(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Expected emote metadata.");
  if (JSON.stringify(raw).length > 16384) throw new Error("Emote metadata exceeds 16 KiB of JSON text.");
  const r = raw;
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(r.id) || !["emoji", "sticker"].includes(r.kind) || typeof r.description !== "string" || !r.description.trim() || r.description.length > 500) throw new Error("Invalid emote identity.");
  if (!Array.isArray(r.emotions) || !r.emotions.length || !Array.isArray(r.forbidden)) throw new Error("Missing emotion labels.");
  for (const key of ["unicodeName", "bodyExpression", "usage", "example"]) if (r[key] !== void 0 && (typeof r[key] !== "string" || r[key].length > 500)) throw new Error("Invalid usage metadata.");
  for (const key of ["avoid", "aliases"]) if (r[key] !== void 0 && (!Array.isArray(r[key]) || r[key].length > 20 || r[key].some((v) => typeof v !== "string" || v.length > 500))) throw new Error("Invalid usage labels.");
  if (r.bodyMatch !== void 0) {
    if (!["direct", "approximate", "none"].includes(r.bodyMatch) || typeof r.bodyMatchReason !== "string" || !r.bodyMatchReason.trim() || r.bodyMatchReason.length > 500) throw Error("Invalid body mapping.");
    if (r.bodyMatch === "none" ? r.bodyExpression !== void 0 : !Object.hasOwn(BODY_EXPRESSIONS, r.bodyExpression ?? "")) throw Error("Body mapping must use one of the 19 built-in expressions.");
  }
  r.emotions.forEach(asEmotion);
  r.forbidden.forEach(asEmotion);
  if (!Number.isFinite(r.intensity) || r.intensity < 0 || r.intensity > 1 || typeof r.reviewed !== "boolean" || typeof r.enabled !== "boolean") throw new Error("Invalid intensity or review state.");
  if (typeof r.source !== "string" || !r.source.trim() || r.source.length > 2e3 || typeof r.license !== "string" || !r.license.trim() || r.license.length > 2e3) throw new Error("Source and license required.");
  if (r.kind === "emoji" && (typeof r.text !== "string" || !r.text.length || r.text.length > 32 || !isEmojiContent(r.text))) throw new Error("Expected Unicode emoji.");
  if (r.kind === "sticker" && (!/^[a-f0-9]{64}\.png$/.test(r.file ?? "") || r.sha256 !== r.file?.slice(0, -4))) throw new Error("Invalid sticker filename.");
  return structuredClone(r);
}
var EmoteLibrary = class {
  data;
  root;
  index;
  constructor(dataDir) {
    this.root = join(dataDir, "bubble-emotes");
    this.index = join(this.root, "library.json");
    mkdirSync(this.root, { recursive: true });
    this.withLock(() => {
      if (existsSync(this.index)) {
        const raw = JSON.parse(readFileSync(this.index, "utf8"));
        if (raw.schemaVersion !== 1 || !Array.isArray(raw.emotes)) throw new Error("Unsupported library schema; restore a matching backup before writing.");
        this.data = { schemaVersion: 1, catalogVersion: raw.catalogVersion, emotes: raw.emotes.map(validateEmote) };
        if ((raw.catalogVersion ?? 0) < 3) {
          const old = this.data.emotes.find((e) => e.id === "comfort" && e.kind === "emoji" && e.text === "\u{1FAC2}" && ["Unicode", "https://www.unicode.org/emoji/charts/emoji-list.html"].includes(e.source) && (e.unicodeName === "people hugging" || !e.unicodeName && ["people hugging", "A supportive hug, without celebration"].includes(e.description)));
          if (old) {
            old.text = "\u{1F499}";
            if (old.description === "people hugging") old.description = "blue heart";
            old.unicodeName = "blue heart";
            if (JSON.stringify(old.aliases) === JSON.stringify(["\u5B89\u6170", "\u62E5\u62B1", "\u966A\u4F34"])) old.aliases = ["\u5B89\u6170", "\u652F\u6301", "\u966A\u4F34"];
          }
        }
        if ((raw.catalogVersion ?? 0) < 5) {
          const previous = { "apology": { "text": "\u{1F647}", "bodyMatch": "approximate", "bodyExpression": "neutral", "bodyMatchReason": "\u6CA1\u6709\u6B49\u610F\u8138\uFF0C\u91C7\u7528\u5E73\u9759\u964D\u7EA7\uFF1B\u62B1\u6B49\u4E0D\u5FC5\u7136\u96BE\u8FC7\uFF0C\u97A0\u8EAC\u5C5E\u4E8E\u53E6\u884C\u5224\u65AD\u7684\u52A8\u4F5C\u3002" }, "gratitude": { "text": "\u{1F64F}", "bodyMatch": "approximate", "bodyExpression": "neutral", "bodyMatchReason": "\u611F\u8C22\u65E0\u4E13\u5C5E\u8EAB\u4F53\u8868\u60C5\uFF0C\u5E73\u9759\u4EC5\u4F5C\u4E3A\u514B\u5236\u964D\u7EA7\u3002" }, "disgust": { "text": "\u{1F922}", "bodyMatch": "none", "bodyExpression": null, "bodyMatchReason": "\u5185\u7F6E19\u79CD\u8868\u60C5\u6CA1\u6709\u6076\u5FC3\u3001\u53CD\u80C3\uFF1B\u4E0D\u518D\u5F3A\u914D\u62C5\u5FC3\uFF0C\u4E0D\u8981\u6C42\u6539\u53D8\u8EAB\u4F53\u8868\u60C5\u3002" }, "ill": { "text": "\u{1F912}", "bodyMatch": "none", "bodyExpression": null, "bodyMatchReason": "\u5185\u7F6E19\u79CD\u8868\u60C5\u6CA1\u6709\u751F\u75C5\u3001\u53D1\u70E7\uFF1B\u4E0D\u518D\u5F3A\u914D\u62C5\u5FC3\uFF0C\u4E0D\u8981\u6C42\u6539\u53D8\u8EAB\u4F53\u8868\u60C5\u3002" } };
          for (const entry of this.data.emotes) {
            const prior = previous[entry.id], seed = DEFAULT_EMOTES.find((e) => e.id === entry.id);
            if (prior && seed && entry.text === prior.text && ["Unicode", "https://www.unicode.org/emoji/charts/emoji-list.html"].includes(entry.source) && entry.bodyMatch === prior.bodyMatch && (entry.bodyExpression ?? null) === prior.bodyExpression && entry.bodyMatchReason === prior.bodyMatchReason) {
              entry.bodyMatch = seed.bodyMatch;
              entry.bodyExpression = seed.bodyExpression;
              entry.bodyMatchReason = seed.bodyMatchReason;
            }
          }
        }
        if ((raw.catalogVersion ?? 0) < CATALOG_VERSION) {
          for (const seed of DEFAULT_EMOTES) {
            const old = this.data.emotes.find((e) => e.id === seed.id);
            if (!old) this.data.emotes.push(structuredClone(seed));
            else {
              if (old.bodyMatch === void 0) {
                const legacy = { apology: "sad", gratitude: "neutral", disgust: "worried", ill: "worried" }[seed.id] ?? seed.bodyExpression;
                const standard = ["Unicode", "https://www.unicode.org/emoji/charts/emoji-list.html"].includes(old.source) && old.text === seed.text && (old.bodyExpression === void 0 || old.bodyExpression === legacy);
                if (standard) {
                  old.bodyMatch = seed.bodyMatch;
                  old.bodyMatchReason = seed.bodyMatchReason;
                  old.bodyExpression = seed.bodyExpression;
                } else if (old.bodyExpression && Object.hasOwn(BODY_EXPRESSIONS, old.bodyExpression)) {
                  old.bodyMatch = "approximate";
                  old.bodyMatchReason = "\u4FDD\u7559\u539F\u6709\u8EAB\u4F53\u8868\u60C5\u6620\u5C04\uFF1B\u81EA\u5B9A\u4E49\u7D20\u6750\u6216\u6620\u5C04\u5C1A\u672A\u786E\u8BA4\u8BED\u4E49\uFF0C\u8BF7\u7ED3\u5408\u8BED\u5883\u590D\u6838\u3002";
                }
              }
              for (const key of ["unicodeName", "usage", "avoid", "example", "aliases"]) {
                if (old[key] === void 0) Object.assign(old, { [key]: structuredClone(seed[key]) });
              }
            }
          }
          this.data.catalogVersion = CATALOG_VERSION;
          this.save();
        }
      } else {
        this.data = { schemaVersion: 1, catalogVersion: CATALOG_VERSION, emotes: structuredClone(DEFAULT_EMOTES) };
        this.save();
      }
    });
  }
  withLock(fn) {
    let fd;
    try {
      fd = openSync(this.index + ".lock", "wx");
    } catch (error) {
      if (error.code === "EEXIST") throw new Error("Emote library is busy. If a writer crashed, close all instances and remove the stale library.json.lock before retrying.");
      throw error;
    }
    try {
      return fn();
    } finally {
      closeSync(fd);
      unlinkSync(this.index + ".lock");
    }
  }
  readIndex() {
    const raw = JSON.parse(readFileSync(this.index, "utf8"));
    if (raw.schemaVersion !== 1 || !Array.isArray(raw.emotes)) throw new Error("Unsupported library schema.");
    return { ...raw, emotes: raw.emotes.map(validateEmote) };
  }
  list() {
    this.data = this.readIndex();
    return structuredClone(this.data.emotes);
  }
  search(emotion, maxIntensity = 1, query = "") {
    return this.list().filter((e) => e.kind === "emoji" && e.enabled && e.reviewed && e.intensity <= maxIntensity && e.emotions.includes(emotion) && !e.forbidden.includes(emotion) && (!query || [e.id, e.description, e.usage ?? "", ...e.aliases ?? []].some((value) => value.toLowerCase().includes(query.toLowerCase())))).sort((a, b) => a.intensity - b.intensity || a.id.localeCompare(b.id));
  }
  get(id) {
    this.data = this.readIndex();
    const e = this.data.emotes.find((e2) => e2.id === id);
    if (!e) throw new Error("Unknown emote.");
    return structuredClone(e);
  }
  put(raw) {
    return this.withLock(() => this.putLocked(raw));
  }
  putLocked(raw) {
    const e = validateEmote(raw);
    if (e.kind !== "emoji") throw new Error("Only Unicode emoji can be edited in this version.");
    this.data = this.readIndex();
    const before = this.data;
    this.data = { ...this.data, emotes: [...this.data.emotes.filter((p) => p.id !== e.id), e] };
    try {
      this.save();
    } catch (error) {
      this.data = before;
      throw error;
    }
    return e;
  }
  save() {
    if (existsSync(this.index)) copyFileSync(this.index, `${this.index}.bak`);
    const temp = `${this.index}.${randomUUID()}.tmp`;
    writeFileSync(temp, JSON.stringify(this.data, null, 2), "utf8");
    renameSync(temp, this.index);
  }
};

// src/body-coordination.ts
function coordinateBody(script, emotion, verdict, conflict, entries, enabled, snapshot) {
  const body = { state: enabled ? "blocked" : "off", reason: enabled ? "\u7B49\u5F85\u5224\u65AD" : "\u8EAB\u4F53\u534F\u8C03\u5DF2\u5173\u95ED", display: "unknown" };
  const done = (reason) => ({ script, body: { ...body, reason } });
  if (!enabled) return done("\u8EAB\u4F53\u534F\u8C03\u5DF2\u5173\u95ED\uFF0C\u4FDD\u7559\u6587\u5B57\u4E0Eemoji\u68C0\u67E5");
  if (conflict || emotion === "neutral" || emotion === "uncertain" || ["uncertain", "inappropriate"].includes(verdict)) return done("\u4E2D\u6027\u3001\u5224\u65AD\u51B2\u7A81\u3001\u8BED\u5883\u4E0D\u8DB3\u6216\u5DF2\u6709\u8868\u60C5\u4E0D\u5339\u914D\uFF0C\u4FDD\u7559\u539F\u7A3F");
  const list = entries.filter((e) => e.kind === "emoji" && e.enabled && e.reviewed && e.emotions.includes(emotion) && !e.forbidden.includes(emotion));
  const selected = list.filter((e) => e.text && script.includes(e.text));
  const signatures = new Set(selected.map((e) => e.bodyExpression ?? "none"));
  if (signatures.size > 1) return done("\u591A\u4E2Aemoji\u7684\u8EAB\u4F53\u5EFA\u8BAE\u51B2\u7A81\uFF0C\u4FDD\u7559\u539F\u7A3F");
  const entry = selected.find((e) => e.bodyMatch !== "none" && e.bodyExpression && Object.hasOwn(BODY_EXPRESSIONS, e.bodyExpression));
  if (!entry?.bodyExpression) return done("\u6CA1\u6709\u5DF2\u786E\u8BA4\u4E14\u53EF\u7528\u4E8E\u8BE5\u8BED\u5883\u7684\u5185\u7F6E\u8EAB\u4F53\u6620\u5C04");
  body.suggested = entry.bodyExpression;
  body.match = entry.bodyMatch ?? "approximate";
  body.figure = snapshot?.figure;
  const approved = DEFAULT_EMOTES.find((e) => e.id === entry.id && e.text === entry.text && e.bodyExpression === entry.bodyExpression && e.bodyMatch === entry.bodyMatch);
  if (!approved) return done("\u4F7F\u7528\u81EA\u5B9A\u4E49\u8EAB\u4F53\u5FC3\u60C5\u5EFA\u8BAE\uFF0C\u4ECD\u9700\u7ED3\u5408\u8BED\u5883\u5224\u65AD\uFF0C\u4E0D\u81EA\u52A8\u8FFD\u52A0\u6807\u8BB0");
  if (/【[^】]*】|<[^<>\n]{1,80}>|＜[^＜＞\n]{1,80}＞/u.test(script)) return done("\u539F\u7A3F\u5DF2\u6709\u8EAB\u4F53\u6216\u52A8\u4F5C\u6807\u8BB0\uFF0C\u4E0D\u81EA\u52A8\u8986\u76D6\u6216\u8FFD\u52A0");
  if (!snapshot || !Number.isFinite(snapshot.observedAt) || Date.now() - snapshot.observedAt > 2e3 || snapshot.observedAt > Date.now() + 1e3) return done("\u8EAB\u4F53\u72B6\u6001\u672A\u77E5\u6216\u5DF2\u8FC7\u671F\uFF0C\u53EA\u7ED9\u5EFA\u8BAE\uFF0C\u4E0D\u8FFD\u52A0\u6807\u8BB0");
  if (!["coo", "whale"].includes(snapshot.figure)) return done("\u5F53\u524D\u5F62\u8C61\u672A\u9A8C\u8BC1\u652F\u6301\uFF0C\u4FDD\u7559\u539F\u7A3F");
  if (!snapshot.connected) return done("\u684C\u5BA0\u7A97\u53E3\u672A\u8FDE\u63A5\uFF0C\u4FDD\u7559\u539F\u7A3F");
  if (snapshot.onDesktop === false) return done("\u684C\u5BA0\u7A97\u53E3\u672A\u663E\u793A\uFF0C\u4FDD\u7559\u539F\u7A3F");
  if (snapshot.quiet === true) return done("\u5B89\u9759\u72B6\u6001\u5DF2\u5F00\u542F\uFF0C\u4EC5\u4E0D\u8FFD\u52A0\u8EAB\u4F53\u6807\u8BB0\uFF0Cemoji\u5EFA\u8BAE\u4FDD\u7559");
  if (snapshot.posture === "sleeping" || snapshot.posture === "interacting") return done(snapshot.posture === "sleeping" ? "\u7761\u7720\u4F18\u5148\uFF0C\u4E0D\u5524\u9192" : "\u7528\u6237\u4E92\u52A8\u4F18\u5148\uFF0C\u4E0D\u6253\u65AD");
  if ((snapshot.quiet === "unknown" || snapshot.posture === "unknown") && snapshot.faceProtection !== "builtin-kit") return done("\u65E0\u6CD5\u786E\u8BA4\u5B9E\u65F6\u8EAB\u4F53\u72B6\u6001\u6216\u539F\u751F\u8868\u60C5\u4FDD\u62A4\uFF0C\u53EA\u7ED9\u5EFA\u8BAE\uFF0C\u4E0D\u8FFD\u52A0\u6807\u8BB0");
  body.state = "suggested";
  body.reason = snapshot.faceProtection === "builtin-kit" ? "\u5DF2\u751F\u6210\u5185\u7F6E\u8868\u60C5\u6807\u8BB0\uFF1B\u5B9E\u65F6\u59FF\u6001\u672A\u786E\u8BA4\uFF0C\u7761\u7720\u4E0E\u5FD9\u788C\u5904\u7406\u4EA4\u7ED9\u539F\u751F\u64AD\u653E\u5668\uFF0C\u4E0D\u6267\u884C\u5524\u9192\u6216\u72EC\u7ACB\u52A8\u4F5C\uFF1B\u672A\u53D1\u9001\u3001\u672A\u786E\u8BA4\u663E\u793A" : "\u540C\u4E00\u5019\u9009\u7A3F\u5EFA\u8BAE\u5185\u7F6E\u8EAB\u4F53\u8868\u60C5\uFF0C\u4E3B\u6A21\u578B\u4ECD\u9700\u7ED3\u5408\u5F53\u524D\u8BED\u5883\u51B3\u5B9A\uFF1B\u672A\u53D1\u9001\u3001\u672A\u786E\u8BA4\u663E\u793A";
  return { script: "\u3010" + body.suggested + "\u3011" + script, body };
}

// src/draft-review.ts
import { mkdirSync as mkdirSync2, readFileSync as readFileSync2, existsSync as existsSync2, writeFileSync as writeFileSync2, renameSync as renameSync2, unlinkSync as unlinkSync2 } from "node:fs";
import { join as join2, dirname } from "node:path";
import { randomUUID as randomUUID2 } from "node:crypto";
var segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
var actualEmoji = (text) => [...new Set([...segmenter.segment(text)].map((s) => s.segment).filter((s) => s.trim() && isEmojiContent(s)))];
function parseAssessment(raw, used, entries) {
  if (typeof raw !== "string" || raw.length > 32e3) throw Error("\u5206\u6790\u8FD4\u56DE\u8FC7\u957F\u6216\u4E0D\u53EF\u7528");
  const obj = JSON.parse(raw.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, ""));
  if (!obj || typeof obj !== "object" || ![...EMOTIONS, "uncertain"].includes(obj.emotion) || !["appropriate", "missing", "unnecessary", "inappropriate", "uncertain"].includes(obj.verdict) || typeof obj.explanation !== "string" || !obj.explanation.trim() || obj.explanation.length > 500) throw Error("\u5206\u6790\u683C\u5F0F\u4E0D\u6B63\u786E");
  if (!used.length && ["appropriate", "inappropriate"].includes(obj.verdict) || used.length && ["missing", "unnecessary"].includes(obj.verdict)) throw Error("\u5206\u6790\u4E0E\u5B9E\u9645\u8868\u60C5\u4F7F\u7528\u60C5\u51B5\u51B2\u7A81");
  if (obj.suggestion !== void 0 && (typeof obj.suggestion !== "string" || !entries.some((e) => e.kind === "emoji" && e.enabled && e.reviewed && e.text === obj.suggestion && e.emotions.includes(obj.emotion) && !e.forbidden.includes(obj.emotion)))) throw Error("\u5EFA\u8BAE\u8868\u60C5\u4E0D\u5728\u5F53\u524D\u53EF\u7528\u8BED\u4E49\u8303\u56F4\u5185");
  return { emotion: obj.emotion, verdict: obj.verdict, explanation: obj.explanation.trim(), ...["missing", "inappropriate"].includes(obj.verdict) && obj.suggestion ? { suggestion: obj.suggestion } : {} };
}
function reviewAssessment(raw, used, entries) {
  if (typeof raw !== "string" || raw.length > 32e3) throw Error("\u5206\u6790\u8FD4\u56DE\u8FC7\u957F\u6216\u4E0D\u53EF\u7528");
  const obj = JSON.parse(raw.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, ""));
  if (!obj || !["appropriate", "missing", "unnecessary", "inappropriate", "uncertain"].includes(obj.verdict)) throw Error("\u5206\u6790\u683C\u5F0F\u4E0D\u6B63\u786E");
  const core = { ...obj };
  delete core.suggestion;
  parseAssessment(JSON.stringify({ ...core, verdict: "uncertain" }), used, entries);
  const conflict = !used.length && ["appropriate", "inappropriate"].includes(obj.verdict) || used.length && ["missing", "unnecessary"].includes(obj.verdict);
  if (conflict) return { analysis: { emotion: "uncertain", verdict: "uncertain", explanation: "\u6A21\u578B\u7684\u4F7F\u7528\u5224\u5B9A\u4E0E\u5B9E\u9645\u8868\u60C5\u8BB0\u5F55\u51B2\u7A81\uFF0C\u672C\u6B21\u65E0\u6CD5\u53EF\u9760\u5224\u65AD\u3002" }, needsReview: true, notice: "\u4E3B\u8981\u7ED3\u8BBA\u4E0E\u89C2\u6D4B\u4E8B\u5B9E\u51B2\u7A81\uFF1B\u5F85\u590D\u6838\uFF0C\u4E0D\u7528\u4E8E\u8868\u60C5\u63D0\u9192\u3002" };
  const analysis = parseAssessment(JSON.stringify(core), used, entries);
  if (obj.suggestion === void 0) return { analysis };
  if (!["missing", "inappropriate"].includes(obj.verdict)) return { analysis, notice: "\u672C\u6B21\u5224\u65AD\u65E0\u9700\u5EFA\u8BAE\u8868\u60C5\uFF0C\u5DF2\u5FFD\u7565\u591A\u4F59\u5EFA\u8BAE\u3002" };
  try {
    return { analysis: parseAssessment(raw, used, entries) };
  } catch {
    return { analysis, notice: "\u53EF\u9009\u8868\u60C5\u5EFA\u8BAE\u4E0D\u5728\u5F53\u524D\u53EF\u7528\u8BED\u4E49\u8303\u56F4\uFF0C\u5DF2\u5FFD\u7565\uFF1B\u4E3B\u8981\u5224\u65AD\u4FDD\u7559\u3002" };
  }
}
var DraftReview = class {
  constructor(dataDir, entries, bodySnapshot) {
    this.entries = entries;
    this.bodySnapshot = bodySnapshot;
    this.file = join2(dataDir, "bubble-emotes", "draft-settings.json");
    if (existsSync2(this.file)) try {
      const text = readFileSync2(this.file, "utf8");
      if (text.length > 2e3) throw Error();
      const d = JSON.parse(text);
      if (d.version !== 1 || typeof d.enabled !== "boolean" || typeof d.bodyEnabled !== "boolean") throw Error();
      this.enabled = d.enabled;
      this.bodyEnabled = d.bodyEnabled;
    } catch {
      this.storageError = "\u8349\u7A3F\u8BBE\u7F6E\u65E0\u6CD5\u8BFB\u53D6\uFF0C\u539F\u6587\u4EF6\u4FDD\u7559\u3002";
      this.enabled = false;
    }
  }
  entries;
  bodySnapshot;
  file;
  enabled = true;
  bodyEnabled = true;
  stopped = false;
  storageError = "";
  generation = 0;
  busy = false;
  abort;
  save() {
    if (this.storageError) throw Error(this.storageError);
    mkdirSync2(dirname(this.file), { recursive: true });
    const tmp = this.file + "." + randomUUID2() + ".tmp";
    try {
      writeFileSync2(tmp, JSON.stringify({ version: 1, enabled: this.enabled, bodyEnabled: this.bodyEnabled }), "utf8");
      renameSync2(tmp, this.file);
    } finally {
      if (existsSync2(tmp)) unlinkSync2(tmp);
    }
  }
  state() {
    return { settings: { enabled: this.enabled }, reviewMode: "main-model-self-check", bodyCoordination: { enabled: this.bodyEnabled, scope: "\u5185\u7F6ECoo/\u5927\u80A5\u9C7C19\u79CD\u8EAB\u4F53\u8868\u60C5\uFF1B\u7531\u539F\u751F\u64AD\u653E\u5668\u4FDD\u62A4\uFF0C\u4E0D\u6267\u884C\u5524\u9192\u6216\u72EC\u7ACB\u52A8\u4F5C" }, draftMode: { enabled: this.draftActive(), busy: this.busy }, storageError: this.storageError };
  }
  configure(raw) {
    const v = raw;
    if (!v || typeof v.enabled !== "boolean" || Object.keys(v).some((k) => k !== "enabled")) throw Error("\u8349\u7A3F\u8BBE\u7F6E\u65E0\u6548");
    this.generation++;
    this.abort?.abort();
    this.enabled = v.enabled;
    this.save();
    return this.state();
  }
  configureBody(value) {
    if (typeof value !== "boolean") throw Error("\u8EAB\u4F53\u534F\u8C03\u5F00\u5173\u65E0\u6548");
    this.generation++;
    this.abort?.abort();
    this.bodyEnabled = value;
    this.save();
    return this.state();
  }
  bodyActive() {
    return this.bodyEnabled && this.draftActive();
  }
  draftActive() {
    return this.enabled && !this.stopped && !this.storageError;
  }
  statusLamp() {
    return { label: "\u8349\u7A3F\u68C0\u67E5", state: this.stopped ? "offline" : this.storageError ? "error" : !this.enabled ? "offline" : this.busy ? "loading" : "online", hint: this.storageError || "\u5F53\u524D\u4E3B\u6A21\u578B\u81EA\u68C0\uFF0C\u4E0D\u662F\u72EC\u7ACB\u590D\u6838\uFF1B\u4E0D\u4FDD\u5B58\u8349\u7A3F\u6216\u53D1\u8A00" };
  }
  async reviewDraft(raw, callerSignal) {
    const v = raw;
    if (!v || typeof v.draft !== "string" || !v.draft.trim() || v.draft.length > 600 || typeof v.context !== "string" || v.context.length > 400) throw Error("\u8349\u7A3F\u6700\u591A600\u5B57\u3001\u8BED\u5883\u6700\u591A400\u5B57");
    if (!this.draftActive()) return { status: "disabled", sent: false, instruction: "\u8349\u7A3F\u68C0\u67E5\u672A\u5F00\u542F\uFF1B\u81EA\u884C\u51B3\u5B9A\u662F\u5426\u53D1\u8A00\u3002" };
    if (this.busy) return { status: "busy", sent: false };
    if (callerSignal?.aborted) return { status: "cancelled", sent: false };
    this.busy = true;
    this.abort = new AbortController();
    const gen = this.generation;
    try {
      const signal = AbortSignal.any([this.abort.signal, AbortSignal.timeout(2e3), ...callerSignal ? [callerSignal] : []]);
      if (!v.assessment || typeof v.assessment !== "object" || !["emotional_commentary", "neutral_narration", "uncertain"].includes(v.assessment.expressionIntent) || !["suitable", "avoid", "uncertain"].includes(v.assessment.emojiSuitability)) throw Error("\u7F3A\u5C11\u7ED3\u6784\u5316\u4E3B\u6A21\u578B\u81EA\u68C0");
      const used = actualEmoji(v.draft), checked = applyExpressionPolicy(reviewAssessment(JSON.stringify(v.assessment), used, this.entries()), v.assessment, used, this.entries());
      const a = checked.analysis, conflict = !!checked.needsReview, added = !conflict && a.verdict === "missing" && !!a.suggestion && !used.length;
      const snapshot = this.bodyEnabled ? await this.bodySnapshot?.(signal).catch(() => void 0) : void 0;
      if (signal.aborted || gen !== this.generation || !this.draftActive()) throw Error("cancelled");
      const body = coordinateBody(added ? v.draft + " " + a.suggestion : v.draft, a.emotion, a.verdict, conflict, this.entries(), this.bodyEnabled, snapshot);
      return { status: conflict ? "needs_review" : "reviewed", source: "main-model-self-check", analysis: a, body: body.body, notice: checked.notice, originalDraft: v.draft, finalDraft: body.script, changed: body.script !== v.draft, sent: false, instruction: "This is the current main model self-check, not an independent review. Read finalDraft and decide whether one reply remains warranted. Retain its emoji and suggested leading face only while the CURRENT meaning still fits; blocked/off prohibits a face marker, not the emoji. Never add motions, wake a pet or repeat a sent reply. This tool sends nothing, stores no draft/history and does not intercept pet_say." };
    } catch {
      return { status: gen !== this.generation || this.stopped || callerSignal?.aborted ? "cancelled" : "unavailable", finalDraft: v.draft, changed: false, sent: false, error: "\u81EA\u68C0\u65E0\u6548\u6216\u5DF2\u53D6\u6D88\uFF0C\u4FDD\u7559\u539F\u7A3F\u3002" };
    } finally {
      this.busy = false;
    }
  }
  stop() {
    this.stopped = true;
    this.generation++;
    this.abort?.abort();
  }
};

// src/world.ts
var BUBBLE_EMOTES_TOOL_DECLS = [
  { name: "bubble_emotes_search", tags: ["read"], description: "Optional lookup for uncertain or uncommon emoji. For familiar choices use the direct guide without search/prepare. When draft review is enabled, review the candidate before pet_say. Find enabled, reviewed Unicode emoji by intended meaning. Read usage, avoid rules and examples; judge context, negation, quotation and emotional changes. Pictures are not supported. Use a selected emoji directly in pet_say.script; no other fields or host patches are needed.", parameters: { type: "object", properties: { emotion: { enum: [...EMOTIONS] }, maxIntensity: { type: "number", minimum: 0, maximum: 1 }, query: { type: "string", maxLength: 80 } }, required: ["emotion"], additionalProperties: false } },
  { name: "bubble_emotes_prepare", tags: ["read"], description: "Optional inspection by ID, not a sending prerequisite. Search results and the direct guide already contain usable emoji. Read one enabled, reviewed Unicode emoji and its usage. Put the emoji character itself in the standard pet_say.script, alone or beside words. Body expressions are optional script-marker suggestions, not confirmed synchronization. No images, rich presentation, renderer registration or special emoji fields are supported.", parameters: { type: "object", properties: { id: { type: "string" }, emotion: { enum: [...EMOTIONS] } }, required: ["id", "emotion"], additionalProperties: false } },
  { name: "bubble_emotes_review_draft", tags: ["read"], barrierAfter: true, interruptible: true, description: "Validate a pre-send SELF-CHECK supplied by the current main model. No independent model/API call. Judge the exact draft and current context, then submit assessment with expressionIntent, emojiSuitability, emotion, verdict and explanation. No emoji: missing/unnecessary/uncertain; with emoji: appropriate/inappropriate/uncertain. Follow the expression policy in the environment; do not fabricate independent review. Read finalDraft and decide whether one reply remains warranted. The extension does not collect speech or store drafts. Body advice uses audited built-in faces, not motions. This tool sends nothing and never intercepts pet_say.", parameters: { type: "object", properties: { draft: { type: "string", maxLength: 600 }, context: { type: "string", maxLength: 400 }, assessment: { type: "object", properties: { expressionIntent: { enum: ["emotional_commentary", "neutral_narration", "uncertain"] }, emojiSuitability: { enum: ["suitable", "avoid", "uncertain"] }, emotion: { enum: [...EMOTIONS, "uncertain"] }, verdict: { enum: ["appropriate", "missing", "unnecessary", "inappropriate", "uncertain"] }, explanation: { type: "string", maxLength: 500 }, suggestion: { type: "string", maxLength: 32 } }, required: ["expressionIntent", "emojiSuitability", "emotion", "verdict", "explanation"], additionalProperties: false } }, required: ["draft", "context", "assessment"], additionalProperties: false } }
];
var BubbleEmotesWorld = class {
  constructor(dataDir, _legacySecrets) {
    this.dataDir = dataDir;
  }
  dataDir;
  id = "bubble-emotes";
  library = null;
  draftReview = null;
  async start(_host) {
    this.library = new EmoteLibrary(this.dataDir);
    this.draftReview = new DraftReview(this.dataDir, () => this.lib.list(), (signal) => this.bodySnapshot(signal));
  }
  async bodySnapshot(signal) {
    try {
      const r = await fetch("http://127.0.0.1:17788/api/webui/providers/world%3Adesktop-pet/panels/pet/state", { method: "POST", headers: { "Content-Type": "application/json" }, body: '{"args":[]}', redirect: "error", signal: AbortSignal.any([signal, AbortSignal.timeout(1e3)]) });
      if (!r.ok) return;
      return readBodySnapshot(await responseJson(r));
    } catch {
      return;
    }
  }
  async stop() {
    this.draftReview?.stop();
    this.draftReview = null;
    this.library = null;
  }
  envPromptVars() {
    const intents = ["joy", "celebration", "sadness", "comfort", "thinking", "worry", "calm", "affection"];
    const entries = this.library?.list() ?? [];
    const rows = intents.flatMap((emotion) => {
      const e = entries.filter((e2) => e2.kind === "emoji" && e2.enabled && e2.reviewed && e2.emotions.includes(emotion) && !e2.forbidden.includes(emotion)).sort((a, b) => a.intensity - b.intensity || a.id.localeCompare(b.id))[0];
      return e ? [JSON.stringify({ intent: emotion, emoji: e.text, usage: e.usage ?? e.description, avoid: e.avoid ?? [] })] : [];
    });
    return { "bubbleEmotes.draftMode": this.draftReview?.draftActive() ? (this.draftReview.bodyActive() ? "Body coordination is enabled, but apply markers ONLY if review body.state is suggested; blocked means no marker. Keep a suggested leading marker in the final script while its current emotion still fits; never replace it with a motion. " : "Body coordination is disabled; this extension must not add body markers. ") + "Main-model SELF-CHECK is ENABLED, with no independent analysis API. Before an independently warranted reply, judge its expressionIntent, emojiSuitability, emotion and emoji verdict using the policy below; call bubble_emotes_review_draft with the exact draft, short current context and your structured assessment. Read its advisory result, then judge whether to send one native pet_say.script. Do not blindly copy; neutral conflicts keep plain. No extra speaking opportunities." : "Draft review is OFF. Do not call bubble_emotes_review_draft. Ordinary emoji can be used directly; no preparation required.", "bubbleEmotes.reviewPolicy": EXPRESSION_POLICY, "bubbleEmotes.directGuide": rows.length ? rows.join("\n") : "No enabled reviewed common emoji. Do not invent a replacement or use disabled entries." };
  }
  get lib() {
    if (!this.library) throw new Error("World is not mounted.");
    return this.library;
  }
  activeEntry(id) {
    const e = this.lib.get(id);
    if (e.kind !== "emoji") throw new Error("Image assets are not supported in this version.");
    return e;
  }
  tools() {
    return BUBBLE_EMOTES_TOOL_DECLS.map((decl) => ({ ...decl, handler: async (args, ctx) => {
      try {
        if (decl.name === "bubble_emotes_review_draft") {
          if (!this.draftReview) throw Error("World is not mounted.");
          return { text: JSON.stringify(await this.draftReview.reviewDraft(args, ctx.signal)) };
        }
        const emotion = asEmotion(args.emotion);
        if (decl.name === "bubble_emotes_search") {
          const max = args.maxIntensity === void 0 ? 1 : Number(args.maxIntensity);
          if (!Number.isFinite(max) || max < 0 || max > 1) throw new Error("Invalid maximum intensity.");
          return { text: JSON.stringify(this.lib.search(emotion, max, typeof args.query === "string" ? args.query : "")) };
        }
        const e = this.activeEntry(String(args.id));
        if (!e.enabled || !e.reviewed || !e.emotions.includes(emotion) || e.forbidden.includes(emotion)) throw new Error("Emote unavailable for this intent.");
        return { text: JSON.stringify({ emote: e, suggestedSay: { script: e.text }, next: "Use pet_say with script only. Write the chosen Unicode emoji directly into that script. For mixed words and emoji, compose one script. Never send image attachments or custom presentation fields. Do not claim body synchronization or third-party speech filtering." }) };
      } catch (err) {
        return { text: err.message, failed: true };
      }
    } }));
  }
  webUi() {
    let libraryLamp = { label: "\u8868\u60C5\u5E93", state: "offline", hint: "\u6269\u5C55\u5C1A\u672A\u542F\u52A8\u6216\u5DF2\u505C\u6B62" };
    if (this.library) try {
      const available = this.library.list().filter((e) => e.kind === "emoji" && e.enabled && e.reviewed).length;
      libraryLamp = { label: "\u8868\u60C5\u5E93", state: available ? "online" : "offline", hint: available ? "\u53EF\u7528\u8868\u60C5 " + available + " \u4E2A\uFF1B\u4E0D\u4EE3\u8868\u6C14\u6CE1\u5DF2\u663E\u793A" : "\u6CA1\u6709\u542F\u7528\u4E14\u5DF2\u786E\u8BA4\u7684\u8868\u60C5" };
    } catch {
      libraryLamp = { label: "\u8868\u60C5\u5E93", state: "error", hint: "\u8868\u60C5\u5E93\u8BFB\u53D6\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E\u6587\u4EF6" };
    }
    const lamps = [libraryLamp, this.draftReview?.statusLamp() ?? { label: "\u8349\u7A3F\u68C0\u67E5", state: "offline", hint: "\u6269\u5C55\u5C1A\u672A\u542F\u52A8\u6216\u5DF2\u505C\u6B62" }];
    return {
      label: "\u8868\u8FBE\u52A9\u624B \xB7 \u60C5\u7EEA\u4E0E\u8868\u60C5",
      lamps,
      panels: [{ id: "library", title: "\u8868\u60C5\u5E93", getMethods: ["list", "preview", "state"] }],
      invoke: async (panel, method, args) => {
        if (panel !== "library") throw new Error("Unknown panel.");
        if (["state", "configure", "bodyCoordination"].includes(method)) {
          const review = this.draftReview;
          if (!review) throw Error("\u8349\u7A3F\u68C0\u67E5\u5C1A\u672A\u52A0\u8F7D");
          if (method === "state") return review.state();
          if (method === "bodyCoordination") return review.configureBody(args[0]);
          if (method === "configure") return review.configure(args[0]);
          throw Error("\u672A\u77E5\u8349\u7A3F\u8BBE\u7F6E\u64CD\u4F5C");
        }
        if (method === "list") return this.lib.list().filter((e) => e.kind === "emoji");
        if (method === "preview") return { text: this.activeEntry(String(args[0])).text };
        if (method === "update") {
          const raw = args[0];
          const current = this.activeEntry(String(raw?.id));
          if (raw?.kind !== "emoji") throw new Error("Only Unicode emoji are supported.");
          const merged = { ...current, ...raw, kind: "emoji" };
          if (merged.bodyMatch === "none") delete merged.bodyExpression;
          return this.lib.put(merged);
        }
        throw new Error("Unsupported method: this version manages Unicode emoji only.");
      },
      promptDocs: [{ key: "worlds.bubble-emotes.envPrompt", title: "\u4F7F\u7528\u8BF4\u660E", description: "\u539F\u7248\u684C\u5BA0\u7684\u666E\u901Aemoji\u7528\u6CD5\u4E0E\u9650\u5236\u3002", path: fileURLToPath(new URL("./ENV_PROMPT.md", import.meta.url)), role: "envPrompt" }]
    };
  }
};

// src/definition.ts
var describeTools = (decls, summaries) => decls.map(({ name, description, parameters, tags }) => ({ name, description, parameters, tags, summary: summaries[name] }));
var BUBBLE_EMOTES = {
  id: "bubble-emotes",
  label: "\u8868\u8FBE\u52A9\u624B \xB7 \u60C5\u7EEA\u4E0E\u8868\u60C5",
  defaults: () => ({ ...BUBBLE_EMOTES_DEFAULTS }),
  create: (ctx) => new BubbleEmotesWorld(ctx.dataDir),
  describe: { tools: describeTools(BUBBLE_EMOTES_TOOL_DECLS, {
    bubble_emotes_search: { zh: "\u6309\u8868\u8FBE\u610F\u56FE\u68C0\u7D22\u5DF2\u5BA1\u6838\u7684\u8868\u60C5\u3002", en: "Searches reviewed emotes by intended meaning." },
    bubble_emotes_review_draft: { zh: "\u6821\u9A8C\u5F53\u524D\u4E3B\u6A21\u578B\u63D0\u4EA4\u7684\u8349\u7A3F\u81EA\u68C0\uFF0C\u4E0D\u4FDD\u5B58\u53D1\u8A00\u6216\u8349\u7A3F\uFF0C\u4E0D\u8C03\u7528\u72EC\u7ACB\u5206\u6790API\u3002", en: "Validates a main-model draft self-check without storing speech or drafts." },
    bubble_emotes_prepare: { zh: "\u8BFB\u53D6\u666E\u901Aemoji\u53CA\u5176\u4F7F\u7528\u8BF4\u660E\u3002", en: "Reads a Unicode emoji and its usage." }
  }), events: [] }
};
var definition_default = BUBBLE_EMOTES;
export {
  definition_default as default
};
