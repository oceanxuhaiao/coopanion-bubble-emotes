# Coopanion 0.2.8 compatibility / 兼容说明

Owner: `compat/coopanion-0.2.8.json` and `packages/cortico-world-desktop-pet`.

扩展0.2.4以官方Coopanion 0.2.8源码为适配目标：

- Coopanion：`3dd0892c2d70a026253ab980af392302b88ff8b1`（tag `v0.2.8`）。
- Cortico：`ace4c640af07f21c15f81116c370fda0fe828389`，包版本0.2.6，World API 6。
- 原版0.2.8仍没有本扩展使用的presentation schema 1气泡入口。仅安装npm包可管理表情库，头顶混排还需要下面的宿主补丁。

## 源码安装

在官方0.2.8源码及其固定的Cortico子模块就绪后，对Coopanion仓库执行：

```powershell
git apply --check <扩展包目录>/compat/coopanion-bubble-emotes-host-0.2.8.patch
git apply <扩展包目录>/compat/coopanion-bubble-emotes-host-0.2.8.patch
pnpm install --frozen-lockfile
pnpm run build:cortico
```

`--check`失败时停止；不要强行应用旧0.2.6补丁或用旧版world.ts覆盖新版。补丁只修改桌宠包、相关测试和说明，不修改Cortico子模块，也不撤回0.2.8的窗口连接凭证、动态名字、语音后端生命周期及电脑操作改动。构建产物不等于已经安装；使用者应通过自己的构建/打包流程更新桌宠宿主并保留原文件备份。

安装扩展0.2.4、启用World `bubble-emotes`，并在受控配置中保留`worlds.desktop-pet.bubbleEmotes: true`。保留原素材目录，不覆盖用户配置或整个数据目录。主程序升级后应重新检查宿主气泡能力，不根据侧栏入口存在就认为支持。更新后重新启动宿主及管理页面，加载新模块和版本化前端资源。

轻核语音：随包提供的解析适配针对0.4.11验证，仅朗读正文、跳过emoji和素材元数据。其他语音版本需要验证；本包不自动修改第三方语音源码。

`coopanion-bubble-emotes-host.patch`默认指向0.2.8补丁。`coopanion-bubble-emotes-host-0.2.6.patch`只保留给旧基线，不能用于0.2.8。`coopanion-0.2.8.json`包含原始及补丁后文件SHA256（按UTF-8/LF文本归一化），供审计，不是主程序自动安装契约。

## English

Extension 0.2.4 targets the official Coopanion v0.2.8 commit and its pinned Cortico revision above, using World API 6. Stock 0.2.8 does not expose this extension's presentation-schema-1 head bubbles. Apply the version-specific host patch to the exact source baseline, check it before applying, build the app, enable the extension and opt into `worlds.desktop-pet.bubbleEmotes`. The patch preserves 0.2.8 window credentials, dynamic bot names, voice backend lifecycle and computer-use changes. It does not modify Cortico. Preserve existing library data and configuration; never replace the new host with 0.2.6 source files. Third-party speech adapters require their own version checks. This package does not patch an installed app automatically.
