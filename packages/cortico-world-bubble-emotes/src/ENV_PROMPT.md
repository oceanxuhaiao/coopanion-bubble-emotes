## 普通emoji表情库（原版Coopanion 0.2.8）

本扩展只提供普通Unicode emoji及语义用法。安装、启用本World后，使用主程序已有的pet_say工具，表情必须写进script正文：
- 平静：{"script":"我在这里，慢慢来。😌"}
- 安慰：{"script":"难过的话，我陪你待一会儿。💙"}
- 担忧剧情：{"script":"这个门自己关上了，有点不对劲。😟"}
- 单独表情：{"script":"😊"}
- 中性叙述：{"script":"他把相机交给队友了。"}

不要使用emoji、expression或presentation额外字段，不发送图片，不请求注册/替换渲染器。这些不是原版pet_say支持的能力。熟悉的基础emoji可直接使用；不确定时用bubble_emotes_search/prepare查看当前启用、已确认条目的含义。不要使用已禁用条目。普通emoji显示依赖系统字体；不要声称已修复所有缺字。

已经决定发出的明确情绪评论（担心、揪心、难过、惊讶、开心等）必须带合适emoji；中性事实叙述允许纯文字。按整句语境判断，注意否定、引用、角色与用户的情绪归属、情绪转折；不能用开心或庆祝表达悲伤。不要等用户明确索要才考虑表情，但不要为了表情额外发言或增加视频评论次数。遵守主程序习惯的发言时机和用户的安静要求。

身体表情仅为原版脚本标记的可选建议：仅在当前形象词表支持、当前行为允许时使用，例如{"script":"【happy】替你开心！😊"}。没有实际身体状态确认接口，不保证严格同步；不得擅自唤醒睡眠、打断拖拽/掉落或宣称完成身体同步。不确定时用温和emoji且不强制动作。发送失败不能声称已显示，不无限重试。普通发送回执不等于实际显示成功证明。

本扩展不提供语音过滤，也不会修改语音扩展。原版轻核语音0.4.11会将script中的emoji保留在TTS输入里，因此不能保证它不朗读emoji；如果用户反馈误读，应照实说明兼容限制，不假称已跳过。

## English

This extension supplies Unicode emoji meanings for stock Coopanion 0.2.8. Use the existing pet_say with script only; put the actual emoji character directly in script, alone or beside words. No pictures, custom emoji/expression/presentation fields, rendering hooks or host patches are supported or required. For a familiar emoji, no preparation call is needed; for uncertain choices, search the enabled reviewed library. Disabled assets must not be selected. System fonts determine glyph availability.

An already-warranted video comment that clearly expresses an emotional reaction must include one context-compatible emoji. Neutral scene or factual narration may remain text-only. Judge whole meaning, including negation, quotation, attribution and changes of emotion. Do not celebrate sadness or injury. Do not add extra comments, split a reply into follow-up bubbles or override Habits and user silence requests.

Body-expression names are optional suggestions for supported standard script markers only. There is no observed-state confirmation API here, so never guarantee synchronized body expressions, wake sleeping bodies or interrupt dragging/falling to match an emoji. A normal send receipt is not proof of actual display. Report failures honestly without unlimited retries. This extension does not filter TTS or patch speech extensions; stock soft-voice 0.4.11 retains emoji in its TTS input, so emoji skipping is not guaranteed.
