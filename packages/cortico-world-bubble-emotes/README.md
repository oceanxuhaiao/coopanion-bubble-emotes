# 表情与表情包 · Bubble Emotes 0.2.2（本地验证版）

Coopanion 桌宠的 emoji 表情与 PNG 表情包扩展，提供 37 个基础表情、30 类语义，以及适用场景、禁忌、别名、例句和身体表情建议。支持单独表情、文字混排、PNG 表情包导入审核，语音适配跳过视觉内容。

**实验版 / Windows / 需要额外宿主支持。官方原版 Coopanion 0.2.8 不具备 presentation schema 1 头顶混排气泡，单独安装本包不能开启该能力。** 本项目并非 Coopanion 官方扩展；本包不自动修改主程序或其他扩展。

## 安装

1. 使用 [GitHub 仓库](https://github.com/oceanxuhaiao/coopanion-bubble-emotes) 的宿主补丁构建支持 presentation schema 1 的桌宠宿主。0.2.4补丁基线：Coopanion 0.2.8（3dd0892c2d70a026253ab980af392302b88ff8b1），Cortico子模块ace4c640af07f21c15f81116c370fda0fe828389；安装步骤见[兼容说明](compat/HOST-COMPATIBILITY.md)。补丁也随 npm 包附在 compat/ 目录中。
2. 在 Coopanion 高级模式“扩展”中安装 npm 包 cortico-world-bubble-emotes，重启后在 World 总览启用 bubble-emotes。
3. 侧栏“表情与表情包 / Bubble Emotes”进入表情库，可搜索中文名称、阅读用法、导入与审核 PNG。

要求 Node.js 22+、World API 6。PNG 单图最多 2 MiB、2048×2048，一次最多四张、合计 4 MiB；不支持 GIF/APNG/JPEG/WebP。新导入图片默认未审核，检查完整图像与文字后设置 reviewed:true；enabled 控制单项启用。

## 表情如何使用

例：平静 😌 / neutral，思考 🤔 / thinking，担心 😟 / worried，害怕 😨 / scared，生气 😠 / angry。中性 😐 与平静、困倦 🥱 与睡着 😴 分开标注。

模型使用 bubble_emotes_search 按意图检索，bubble_emotes_prepare 读取语义说明和准备示例，再调用 pet_say.presentation 展示。图片使用工具返回的真实 blob handle。语境规则提供给当前对话模型判断，没有训练模型，也不保证零误配；严肃场景可只回复文字。完整使用表见 compat/EMOJI-GUIDE.md。

宿主根据实际 face、动作和命令确认后显示气泡；拖拽、未知身体状态或不兼容变化会取消。内置鲸鱼/Coo 提供 19 种身体表达建议，其他形象需校验词表。可选配置 worlds.desktop-pet.bubbleEmotes:true 启用旧动作脚本兼容。明确的表情展示指令允许本次身体调整/唤醒，普通聊天不会自动唤醒。

## 语音和更新

结构化气泡的语音仅提取 text，忽略 emoji、图片、文件名与替代文本。轻核语音 0.4.11 的源码适配见 compat/soft-voice-parser.js，需由使用者或该扩展维护者在相应版本源码中采用；本包不会自动安装该适配。解析器回归已验证，未宣称覆盖所有第三方语音版本及引擎试听。

表情库位于宿主 ctx.dataDir/bubble-emotes/，包括 schemaVersion:1 的 library.json、备份与按 SHA-256 保存的图片；更新包不会覆盖用户素材。catalogVersion 迁移补齐缺失基础项和缺失用法字段，保留已有编辑和禁用设置。由旧预览版升级时将 worlds.bubble_emotes 配置迁移为 worlds.bubble-emotes。

## English

Experimental Windows World for Coopanion emoji and static PNG stickers, with 37 emotes across 30 semantic categories, contextual usage examples and body-expression suggestions. Stock Coopanion 0.2.8 is insufficient: build the included host patch first. The patched renderer checks the observed face before display and projects text only for speech. Third-party soft-voice needs the provided source adapter. Semantic selection is performed by the conversation model and can be wrong. Library migrations preserve edits and imports.

AGPL-3.0-or-later. Unicode characters render through the system font; no vendor emoji artwork is distributed. Host-derived files retain the upstream license and notices.

## 本地0.2.2调整

表达偏好跟随Coopanion习惯中的none/poke/all/custom：安静克制、默认自然、积极活泼；自定义仅已选且已获即时回应的触碰更主动，文字/语音按自然偏好。它不会新增触发回应或睡眠唤醒权限。表情库页只读显示当前习惯和近期表达结果，不提供第二套模式。

基础emoji可直接一次pet_say.presentation；自定义素材仍走审核/检索/真实blob句柄。宿主将习惯摘要随新消息提供给模型，并保留最多50条不含正文的内存诊断。旧宿主界面会提示能力不足；仍需安装配套宿主补丁。

库写入使用library.json.lock互斥，提交前读取最新索引；异常退出留下锁时，关闭所有共享数据实例后才人工清除stale lock。不要在仍有写入者时删除。用户素材和禁用设置不被重置。PNG新增CRC与有界解压/扫描线检查，并非对浏览器所有颜色配置处理的安全证明。

本版本仅本地验证，尚未推送npm/GitHub/市场；第二阶段自动目录选择契约仍待实施。

0.2.2补充：常用emoji可用pet_say({script:"Thanks.",emoji:"🙏",expression:"neutral"})平铺参数，一次完成发送和身体校验，不必拼requestId/segments。这是明确选择emoji的便捷写法，不是根据emotion自动读取私有库。只有模型已给出emoji才做相容身体映射；普通关键词不触发表情添加。复杂混排仍使用presentation。


本地0.2.3内置🫂拥抱图案，表情库与配套宿主的头顶气泡无需系统字形即可显示。气泡修复需要更新宿主web/presentation.js和emoji-art.js并重新加载桌宠。
Local 0.2.3 bundles original artwork for 🫂 in the library and patched head bubbles. Update the companion host presentation.js and emoji-art.js and reload the pet; no system font download is required.

当前本地版本0.2.4已针对Coopanion 0.2.8重新移植宿主补丁。旧0.2.6基线保留为单独补丁；不能用旧文件覆盖0.2.8。适配验证不等于模型主动使用表情的硬指标已通过。
