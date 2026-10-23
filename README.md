# Coopanion 表情与表情包 / Bubble Emotes

版本 **0.2.4**，适配 **Coopanion 0.2.8**。37个基础emoji、30类语义、PNG表情包、中文卡片表情库、文字与表情混排、身体状态同步和语音正文过滤。

**第三方实验扩展。原版0.2.8需要配套宿主补丁，单独安装npm包不能开启头顶混排气泡。** 安装前阅读[兼容与构建说明](HOST-COMPATIBILITY.md)，不要用0.2.6源码覆盖0.2.8。用户素材、审核与禁用状态继续保留。

```powershell
npm install cortico-world-bubble-emotes@0.2.4
```

启用World `bubble-emotes`，按兼容说明更新宿主并显式开启气泡配置。表达偏好跟随Coopanion「习惯」设置；情绪明确的视频评论要求合适的视觉表情，中性叙述允许纯文字，不增加评论次数。模型语义选择仍可能出错，尚未证明主动表情使用率满足全部硬指标。

- [包说明](packages/cortico-world-bubble-emotes/README.md)
- [表情含义与用法](EMOJI-GUIDE.md)
- [兼容测试报告](docs/COMPATIBILITY-0.2.8.md)：772通过、1跳过，4条上游形象导入测试因worker退出未完成；未修改官方0.2.8上同样复现。
- [npm](https://www.npmjs.com/package/cortico-world-bubble-emotes) · [GitHub Releases](https://github.com/oceanxuhaiao/coopanion-bubble-emotes/releases)

搜索关键词：表情、表情包、emoji、stickers。

## 开发验证

Node.js 22+。在本仓库下将官方Coopanion v0.2.8及固定子模块放到`upstream/Coopanion-0.2.8`，先按HOST-COMPATIBILITY.md应用0.2.8补丁、安装依赖并构建宿主。然后在本仓库根目录运行：

```powershell
npm ci --ignore-scripts
npm run build
npm run typecheck
npm test
npx vitest run --config testing/vitest.audit.config.ts
```

随包轻核语音解析适配针对0.4.11；其他版本需单独验证。本包不会自动修改主程序或第三方语音扩展。

## English

Experimental Windows emoji and sticker World, adapted for Coopanion 0.2.8 / Cortico World API 6. Rich head bubbles require the version-specific companion host patch; installing this npm package alone is insufficient. Read the compatibility guide and test report before installing. Existing assets and review/disabled states persist across upgrades. Offline original hugging artwork avoids missing system glyphs for 🫂. Speech uses text only. Context selection is performed by the conversation model and can fail; automated acceptance tests do not prove a 100% real-model usage rate. This release does not automatically patch the app or third-party speech extensions.
