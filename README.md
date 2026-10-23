# 普通emoji表情库 / Emoji Library

**0.3.0：原版Coopanion 0.2.8安装启用即可使用，无需宿主补丁。**

37个基础Unicode emoji、30类含义，支持中文搜索、使用说明、名称/用法编辑和启停。通过原生pet_say.script发送，例如`{"script":"我在这里，慢慢来。😌"}`；也可单独发送普通emoji。

```powershell
npm install cortico-world-bubble-emotes@0.3.0
```

安装、启用World `bubble-emotes`后按主程序提示重新加载。桌宠需要正常启用并连接。没有额外服务、API Key、模型或字体安装依赖；具体字形可用性由系统字体决定。

## 功能范围

0.3.0已移除图片导入/发送、图片表情包、头顶图文富混排、额外气泡渲染器、宿主补丁和语音替换文件。普通文字与emoji字符可在同一个script中显示。

不保证严格身体同步，不保证第三方TTS跳过emoji（原版轻核语音0.4.11会保留emoji输入）。现有图片记录与文件保留但停用，旧宿主/语音改动不会自动撤回。需要恢复原版时使用官方更新或匹配备份，并保留用户数据。模型漏发表情与语义误配仍可能发生。

- [完整包说明与升级注意](packages/cortico-world-bubble-emotes/README.md)
- [原版兼容验证报告](docs/STOCK-0.3.0.md)：17项测试通过，使用未修改的0.2.8代码与真实本机socket验证标准发送链路；不冒称实际模型行为或音频全流程已验收。
- [npm](https://www.npmjs.com/package/cortico-world-bubble-emotes/v/0.3.0) · [GitHub Release](https://github.com/oceanxuhaiao/coopanion-bubble-emotes/releases/tag/v0.3.0)

历史0.2.x的补丁和图片功能仅在旧tag/release中保留，不能当作新版功能。旧版开发记录不代表新版支持范围。

## English

Version 0.3.0 supplies Unicode emoji meanings for stock Coopanion 0.2.8. Install and enable the World, then use existing pet_say.script. No host patch, external service, API key or extra runtime dependency. Pictures, sticker sending, rich bubbles, renderer hooks and speech adapters are removed. System fonts determine glyph coverage. Confirmed body synchronization and third-party emoji filtering are not guaranteed. Legacy image files remain on disk but are inactive; upgrading does not undo old host or voice modifications. Experimental model behavior remains subject to missing or inappropriate emoji selections.
