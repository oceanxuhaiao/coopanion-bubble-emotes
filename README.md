# Coopanion 表情与表情包 · Bubble Emotes

独立 World 扩展，37 个 emoji、30 类语义、PNG 表情包和身体表情同步。当前版本 0.2.1，Windows 实验版。

**需要支持 presentation schema 1 的桌宠宿主。官方原版 Coopanion 0.2.6 只安装 npm 包不能完整使用。**

- [扩展安装、语音适配与数据更新说明](packages/cortico-world-bubble-emotes/README.md)
- [宿主补丁构建](HOST-COMPATIBILITY.md)
- [基础表情含义、禁忌与例句](EMOJI-GUIDE.md)
- [npm 包](https://www.npmjs.com/package/cortico-world-bubble-emotes)

源码位于 packages/cortico-world-bubble-emotes，语音适配位于 integrations/soft-voice。patches/ 包含固定上游基线的宿主补丁，未发布修改后的主程序二进制。第三方形象必须提供实际身体状态回报。

语义选择由模型结合用法说明判断，未进行模型微调，不保证零误配。通过测试：表情库与语音过滤、World 页面注册、19 种内置身体表达映射、气泡状态转换。没有声称覆盖所有模型、语音引擎或系统字体。

此仓库不包含用户聊天记录、运行配置、令牌或导入素材。AGPL-3.0-or-later，保留上游派生文件的原许可。仅使用 Unicode 字符，不分发厂商 emoji 图片。

English: Experimental Coopanion emoji and sticker World with contextual guidance and body synchronization. Requires the provided host patch; stock 0.2.6 alone is insufficient. See the package README for setup and limitations.
