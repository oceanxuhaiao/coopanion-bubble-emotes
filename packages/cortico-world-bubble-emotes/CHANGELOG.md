## 0.3.2

- 新增可选“表达记录”：记录实际 emoji、模型事后情绪判断与人工反馈，默认关闭，不读取旧聊天。
- 支持独立 DeepSeek / OpenAI API 和本机 Ollama 分析；凭证通过宿主官方 secret/storeSecret 管理。停用引用不等于撤销服务商凭证。
- 修复过期反馈阻塞新建议，增加票据和宿主送达诊断；限频捎带建议，不补发、不额外唤醒。
- 分类展示失败原因、耗时和重复次数，支持待复核、忽略无效可选建议和跳过记录；不无限重试。
- 云端每小时最多60次请求，响应大小有界读取；记录最多100条，队列上限8条。
- 验证：61项自动化检查、类型检查、构建、官方扩展检查和4条真实本机模型分析烟测通过。云端真实账号兼容性仍待验证。
- 限制：主动使用表情的效果未通过行为验收；中性评论仍可能误加表情。保留 experimental、high-cost，不承诺逐句覆盖、身体严格同步或第三方语音过滤。

## 0.3.2-dev.6（未发布）

- 分离主要分析结论和可选表情建议校验，忽略无效或不需要的建议并明确标注。
- 主要判断与观测冲突标为待复核，不用于提醒；格式及连接等故障仍如实报错。
- 显示同原因连续失败次数，支持跳过并保留原话，不增加自动重试或历史模型调用。
- 61项自动化检查及4条真实本机模型分析烟测通过；不代表主动表情行为验收通过。

## 0.3.2-dev.5（未发布）

- 通过官方部署秘密接口保存凭证，旧凭证验证迁移成功后才从数据文件移除。停用引用不宣称删除部署凭证。
- 修复过期反馈阻塞及旧回调清除新任务；增加反馈票据和宿主送达关联。
- 增加脱敏错误分类、次数和耗时、后续发言观察、每小时60次云端调用上限及流式响应大小限制。
- 46项单元测试、10项集成与打包测试；真实本机端点36条对照未通过行为验收，视频夹具仍受限。不宣称主动使用已改善。

## 0.3.2-dev.4（未发布）

- 将新完成的有效漏用分析接入限频反馈，只在正常对话中提醒。
- 过期、错误反馈、较新表情发言及不可用条目取消待送达建议，不补发或唤醒。
- 不保证模型采纳，真实用户场景仍需验收。

## 0.3.2-dev.3（未发布）

- 移除宿主后台分析，新增独立 DeepSeek / OpenAI API 分析。
- 密钥不回显，保存配置暂停记录，旧 host 设置迁移为关闭。保留 Ollama。
- 云端真实账号待联调，未宣称主动使用改善。

## 0.3.2-dev.2 (unreleased)

- Add opt-in expression records with observed Unicode emoji, asynchronous post-hoc AI assessment and human feedback.
- Use the public host cognition interface where available, or an explicitly selected installed Ollama model through loopback. Missing analysis remains unavailable, never a keyword-based substitute.
- Keep at most 100 local rows, bound the analysis backlog, support pause/clear, discard late results and validate model output against observations and enabled emoji.
- Do not feed assessments/feedback into reminders or change native sending. Existing dev.1 frequency fallback is independent.

## 0.3.2-dev.1 (unreleased)

- Shorten common guidance and expose eight enabled reviewed direct choices.
- Add a bounded cross-scene usage fallback using public desktop-pet.self records: after ten plain recorded replies, piggyback one reminder with a ten-minute cooldown. Never wake, resend, classify emotions or claim actual display.
- Ignore history on mount, cancel stale reminders when emoji appear, and read only new pet output records.
- Remains experimental and unreleased pending behavior acceptance; no automatic sending middleware.

## 0.3.2-dev.0 (unreleased)

- Inject current enabled reviewed common emoji into the host prefix; familiar choices need only pet_say.
- Clarify optional lookup and inspection tools; no send interception, automatic correction or usage-rate guarantee.
- Add isolated model acceptance cases and stock direct-send transport coverage. Release remains gated on measured behavior.

## 0.3.1

- Rename the display title to 表情 and refresh the description.
- Add an original, font-independent SVG logo through cortico.icon.
- Keep the stock-compatible Unicode-only feature scope unchanged.

## 0.3.0

- BREAKING: target stock Coopanion 0.2.8 with Unicode emoji written directly in pet_say.script.
- Remove picture import/sending, sticker/rich-bubble paths, renderer hooks, host patches and speech adapters from the published package.
- Preserve legacy image records and files without exposing or sending them. Retain Unicode edits and disabled states.
- Replace the untouched default comfort glyph with 💙 for broader font coverage.
- Remove guarantees of confirmed body synchronization and third-party speech filtering; stock soft-voice 0.4.11 retains emoji in speech input.

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
