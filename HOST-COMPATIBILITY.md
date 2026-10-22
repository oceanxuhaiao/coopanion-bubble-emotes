# 宿主兼容与构建

Coopanion 基线 f30ab6b6ca0fd17e4a66ce290dbec76839ea6399（0.2.6），Cortico 子模块 d54a0d83400a038a557aa0914b8f624719b32b2d。要求 Node.js 22+ 和 Windows 构建环境。补丁修改 desktop-pet World 的工具、渲染与身体状态确认，不修改 Cortico 子模块。

在仓库根目录执行：

```powershell
git clone https://github.com/Pal-AI-Lab/Coopanion.git upstream/Coopanion
git -C upstream/Coopanion checkout f30ab6b6ca0fd17e4a66ce290dbec76839ea6399
git -C upstream/Coopanion submodule update --init --recursive
git -C upstream/Coopanion apply --check ../../patches/coopanion-bubble-emotes-host.patch
git -C upstream/Coopanion apply ../../patches/coopanion-bubble-emotes-host.patch
cd upstream/Coopanion
npx --yes pnpm@11.28.6 install --ignore-scripts --frozen-lockfile
npx --yes pnpm@11.28.6 run build:cortico
```

Electron 二进制如未下载，执行 node node_modules/electron/install.js；主程序构建/打包命令遵循该固定版本的 README 与 package.json。先备份独立部署数据，不把开发构建覆盖在其他人的安装目录中。

返回本仓库根目录：

```powershell
npm ci --ignore-scripts
npm run build
npm test
npm run typecheck
```

根 tsconfig/vitest 的 cortico 路径指向克隆的固定源码。宿主检查还需在其 vendor/cortico 中安装锁定依赖，并遵循上游的 typecheck/test 命令；中文路径下的 Vite URL 问题可能需要使用 ASCII 工作目录。

构建好的宿主中安装 cortico-world-bubble-emotes，启用 World bubble-emotes。可选配置 worlds.desktop-pet.bubbleEmotes:true 将旧脚本的明确身体表情转换成同步气泡。直接调用 pet_say.presentation 不依赖该兼容开关。

轻核语音 0.4.11 的文本提取适配是 integrations/soft-voice/parser.js（npm 包 compat/ 同样附带）。需针对对应源码版本应用，其他版本不保证兼容。只读取 text 并跳过 emoji、图片与元数据。不会自动替换第三方扩展。
