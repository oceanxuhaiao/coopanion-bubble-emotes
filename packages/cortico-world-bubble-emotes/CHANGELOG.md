## 0.2.4

- Port the companion host patch to official Coopanion 0.2.8 and its pinned Cortico 0.2.6 / World API 6.
- Preserve window credentials, dynamic bot names and voice backend lifecycle while integrating rich bubbles, habit preferences and offline hugging artwork.
- Ship separate 0.2.8 and legacy 0.2.6 patches with an explicit compatibility manifest; retain experimental and external-setup warnings.
- Validate extension, storage, rendering, body-state, speech and video-comment acceptance rules against the 0.2.8 framework.

## 0.2.3

- Require a compatible visual emote for an already-warranted emotional video comment; neutral narration may remain text-only. Preserve existing comment frequency and body safety.

- Bundle original hugging artwork for 🫂 so library previews and patched head bubbles do not depend on system glyph coverage.
- Keep emoji meaning, reveal timing, body gates and text-only speech unchanged.
- Use a new asset version to avoid stale immutable browser caches.

## 0.2.1

- Fix World/page ID to bubble-emotes so the page passes the actual WebUI ID validator and appears in the World sidebar.
- Add a readable Chinese label and registration regression check. Migrate the old enabled configuration during local upgrade; library data is unchanged.

## 0.2.0

- Expand to 37 emoji and 30 semantic categories with usage, avoid rules, aliases, examples and body suggestions.
- Add intensity-sorted search, prepared emoji presentation examples and searchable library cards.
- Migrate additively while preserving edits, disabled entries and imported stickers.
- Cover 19 built-in body expressions; fix neutral hold and awake sleepy display in the host.

## 0.1.2

- Add fear and anger emotes, preserving existing library edits during upgrades.
- Require synchronized visual replies for sadness, fear and anger demonstrations.
- Host accepts redundant script with authoritative presentation and ignores empty text nodes; TTS remains text-only.

<!-- Owner: src/definition.ts -->
# Changelog

## 0.1.1

- The host binds live figure and state; model-supplied stale hints no longer block replies.
- Emote requests include visual nodes, and failed displays call for a plain-text reply.
- Sticker guidance uses the actual attachment handle rather than the library filename.

## 0.1.0

- Reviewed Unicode emotes and a persistent PNG library with editable labels.
- Context-labelled search and attachment preparation tools.
- Library import, preview, approval and disable controls in the World panel.
- Requires the presentation-schema-1 host changes; stock Coopanion 0.2.6 is unsupported.




## 0.2.2（本地验证版，未发布）

- 表情偏好只读跟随“习惯 → 回应模式”，没有新增模式配置；自定义遵守触碰授权与合并规则。
- 基础emoji优先一次pet_say.presentation，日常问候/感谢/陪伴/思考不再强制搜索准备。
- 宿主提供能力与习惯快照、有限近期结果；消息携带当前偏好，列表页只读显示来源与失败分类。
- 修复共享目录写入覆盖、导入失败孤立图片、元数据长度、emoji节点内容、PNG结构/CRC/限量扫描线校验。
- 本次未提供“只传emotion自动选库”的第二阶段接口；仍需配套宿主，未声明干净电脑/全部语音版本已验证。

- Add flat pet_say script/emoji/expression shorthand sharing the existing body checks and text-only speech; no automatic private-catalog selection.
- Normalize explicit legacy body-id markers and already-selected trailing emoji as compatibility fallbacks, without classifying prose keywords.
