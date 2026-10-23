# 普通emoji表情库 / Emoji Library

0.3.0适用于**原版Coopanion 0.2.8**。安装、启用扩展后即可通过原生`pet_say.script`在气泡中显示普通Unicode emoji；无需修改主程序、安装字体或更换语音解析器。字体覆盖决定具体字形能否显示，不保证所有系统字体都支持全部emoji。

## 安装和使用

在Coopanion扩展市场搜索“表情”，安装`cortico-world-bubble-emotes`并启用World `bubble-emotes`；按主程序提示重新启动以加载扩展。已经随主程序安装的桌宠功能需要正常启用、窗口连接。无需宿主补丁、外部服务、额外API Key或模型文件。

模型使用已有工具：

```json
{"script":"我在这里，慢慢来。😌"}
```

也可以只发`{"script":"😊"}`。表情库支持搜索含义、查看使用/避免语境、编辑名称与用法、启停表情。30类语义、37个基础emoji。明确情绪的视频评论应带恰当emoji，中性叙述允许纯文字；不增加发言次数。选择由当前模型判断，可能漏发或误配，不承诺100%主动使用率。

## 0.3.0功能范围

已移除图片导入和发送、图片表情包、头顶图文混排、自定义气泡渲染、`presentation`与额外`emoji/expression`字段、宿主补丁及语音解析适配器。普通文字与emoji字符可以放在同一script中；这属于原生文字显示。

身体动作只提供原生脚本标记的可选含义建议，不确认实际身体状态，不保证严格同步。语音由用户已有的语音扩展控制：**本扩展不保证emoji被TTS跳过**；未修改的轻核语音0.4.11会把emoji保留在语音输入中。需要严格跳过emoji时，必须使用语音扩展自身提供并已验证的过滤功能，本包不能替它实现。

从0.2.x升级时，保留原索引、图片文件、自定义用法与禁用状态，旧图片条目不再出现在界面/检索结果，也不能发送。默认安慰字符由缺字的🫂调整为💙；仅迁移仍保留默认描述/Unicode名称的原条目，其余自定义字符不改。旧版的主程序补丁或语音源码改动不会被新版自动安装或撤回；若希望回到官方原版，请使用主程序官方更新/原备份恢复，保留用户数据，勿用旧版文件覆盖新版。

## English

Version 0.3.0 supplies 37 Unicode emoji across 30 meanings for stock Coopanion 0.2.8. Install and enable this World, then put emoji directly in the existing pet_say.script. No host patch, external service, extra API key or model download is required. The built-in desktop pet must be enabled and connected. Glyph availability depends on system fonts.

Image import/sending, stickers, rich head bubbles, custom rendering, special presentation/emoji/expression fields, host patches and speech adapters are removed. Body labels are optional script-marker suggestions, without confirmed synchronization. Third-party speech filtering is not guaranteed; stock soft-voice 0.4.11 retains emoji in its TTS input. Existing library data and legacy image files remain on disk, while image entries are inactive and hidden. Upgrading does not automatically undo old host or speech modifications. Model expression frequency and contextual correctness remain experimental.
