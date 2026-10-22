<!-- Owner: parser.js -->
# 轻核语音文本提取适配

`parser.js` 对应 `cortico-world-soft-voice` 的 `world/src/parser.js`，供该扩展源码维护者集成；没有自动覆盖已安装文件。

保留原导出 speechText 与 petSayFromEntry：普通 script 移除动作标记和 Unicode 表情；结构化 presentation 只提取 kind=text 的文字，忽略 emoji/sticker、alt、文件名和附件句柄。纯表情返回 null，沿用上游“不创建语音任务”的行为。失败的工具调用也返回 null。

检查依据为 2026-10-22 读取的 scarlet20252025-cloud/coopanion-soft-voice 源码；尚未运行 Qwen3-TTS 引擎，未验证其可选气泡同步桥对新 presentation 消息的支持。因此不能宣称已安装的轻核语音无需更新即可完整兼容。

源码：https://github.com/scarlet20252025-cloud/coopanion-soft-voice/blob/main/world/src/parser.js
