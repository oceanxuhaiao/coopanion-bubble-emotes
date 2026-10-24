## 0.3.4

修复0.3.3的npm包直接使用src/index.ts作为入口，在没有TypeScript加载器的生产环境中报ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING的问题。不是用户API、模型配置或安装操作错误。

发布包改为预编译的ESM JavaScript入口dist/index.js，只使用Node内置运行模块，无需用户安装tsx、TypeScript、构建工具或额外运行依赖。配套发布dist/ENV_PROMPT.md，保证提示词相对路径正确；浏览器界面仍预先编译。

保留0.3.3的使用引导、分析联动草稿检查、云端/本地模型选项、安慰字符迁移和侧栏状态灯，保持包名、World ID及数据目录。升级保留配置、表情库和表达记录。

验证：78项单元+14项集成（共92项）、类型检查、构建、官方扩展检查通过。新增真实npm打包产物回归：解入全新node_modules，清除加载器环境变量，原生Node关闭TypeScript类型剥离，仍能导入、构造、启动、搜索表情、读取提示词、显示状态灯数据及停止。此测试不依赖开发环境的tsx。

Windows、原版Coopanion0.2.8；保留experimental / high-cost标签。新增云端服务真实账户联调与实际主动使用率仍待验证，不承诺每次检查或采纳，也不保证身体同步与第三方TTS过滤。

## 0.3.4-dev.0（未发布）

- 修复npm包直接以TypeScript为运行入口，导致没有TS加载器的普通Node宿主报ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING。发布包改用编译好的dist/index.js，仅依赖Node内置模块，并配套发布提示词资产。
- 增加真实tarball置于全新node_modules、关闭类型剥离且无tsx的原生Node加载回归，覆盖构造/启动、工具、表情库、提示词路径、状态灯和停止。

## 0.3.3

新增使用引导：表情库可直接使用，推荐配置分析API，保存、测试并确认数据与费用后开启分析。草稿检查与表达记录分析同步启停，移除独立开关；旧配置原本已开启分析时同步启用，原本暂停的不自动开启。

草稿检查只给建议，不代发、不拦截原生气泡；保留中性冲突、失败或超时保留原稿的保护，主模型需结合当前语境独立判断，不能机械照抄。开启后新发言、草稿及语境可能交给所选云端模型并产生额外用量与等待；共用每小时60次云端请求额度。

云端增加通义千问、Kimi、智谱GLM，连同DeepSeek和OpenAI提供常用模型及手动填写，密钥仍通过宿主官方接口分服务商保存。Ollama检测增加进度、就地结果和模型列表，区分无模型及连接失败，不自动下载。

修复旧表情库已标记升级但安慰仍使用缺字形🫂的迁移遗漏，兼容历史格式，改为💙并保留用户设置。侧栏新增表情库、表达分析、草稿检查三盏原生实时状态灯及悬停说明，监测不额外调用模型。

验证：91项自动化测试、类型检查、构建、官方扩展检查通过。本地原版Coopanion0.2.8安装并加载，真实Ollama模型检测及宿主状态灯接口已验证。新增云端服务仅有模拟协议测试，真实账户兼容性仍待联调；主动使用率没有新的实际行为验收，不承诺每次检查或采纳。保留experimental / high-cost。

保留原npm包名和World ID，保留配置、表情库、记录；适用Windows原版Coopanion0.2.8。无宿主补丁、图片发送或图文富气泡，不保证身体严格同步和第三方TTS过滤。

## 0.3.3-dev.4（未发布）

- 使用宿主官方WebUI lamps接口提供表情库、表达分析、草稿检查三盏侧栏实时状态灯，支持可用、处理中、异常、暂停四态及悬停说明。
- 状态来自本地配置和实际处理结果，不额外调用模型或探测网络，不将保存API Key等同连接成功；最近失败在后续成功后恢复，暂停/停止变灰，表情库读取错误不影响面板声明。

## 0.3.3-dev.3（未发布）

- 草稿检查随已配置的表达记录与分析同步启停，移除独立可选开关；保留检查摘要、中性冲突和不机械照抄保护。已开启分析的旧配置升级后同步启用检查，不开启原本关闭的分析。
- 引导推荐配置 API，说明基础表情库缺少分析检查、无法保证表情使用稳定性，以及配置后仍可能漏用。
- 云端增加通义千问、Kimi、智谱 GLM，提供五种服务的常用模型及手填入口；官方地址固定，密钥隔离，新增服务真实账户仍待联调。
- Ollama 检测在按钮旁显示进度与结果，自动填入模型并支持列表选择，区分未安装模型和连接失败，不自动下载。

## 0.3.3-dev.2（未发布）

- 修复旧内置安慰仍为🫂时的迁移遗漏：覆盖不同历史描述，以及已标记catalogVersion=2的库，改用兼容性更好的💙。
- 保留自定义描述、用法、情绪标签、启停及确认状态；不替换用户另选的字符或自定义来源素材。迁移前保留原库备份，重复启动不再改写。

## 0.3.3-dev.1（未发布）

- 新增默认关闭的可选草稿检查，可在使用引导或表达记录页展开并确认后开启；独立于事后记录开关，复用已配置的分析模型。
- 检查工具只返回建议，不发送、不拦截原生气泡。模型需结合当前语境判断，不能机械照抄；中性判为漏用、判断冲突、失败或超时均保留原稿。
- 草稿600字、语境400字、单次15秒、同时仅一项检查；与事后分析共用每小时60次云端请求额度。仅保留最近20次状态摘要，不归档草稿和语境正文。
- 修改分析连接后需要重新开启。尚不能保证模型每次主动调用或采用建议，不能据此宣称主动使用率已改善。

## 0.3.3-dev.0（未发布）

- 新增首页使用引导，基础模式无需配置，分析模式保存、测试连接并确认数据/费用后手动开启。
- 固定文本测试不读取历史，不自动开启；显示运行与配置异常状态，支持返回引导和暂停。

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

