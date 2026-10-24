# 0.3.4 · 修复普通Node环境安装后无法加载

修复0.3.3的npm包直接使用src/index.ts作为入口，在没有TypeScript加载器的生产环境中报ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING的问题。不是用户API、模型配置或安装操作错误。

发布包改为预编译的ESM JavaScript入口dist/index.js，只使用Node内置运行模块，无需用户安装tsx、TypeScript、构建工具或额外运行依赖。配套发布dist/ENV_PROMPT.md，保证提示词相对路径正确；浏览器界面仍预先编译。

保留0.3.3的使用引导、分析联动草稿检查、云端/本地模型选项、安慰字符迁移和侧栏状态灯，保持包名、World ID及数据目录。升级保留配置、表情库和表达记录。

验证：78项单元+14项集成（共92项）、类型检查、构建、官方扩展检查通过。新增真实npm打包产物回归：解入全新node_modules，清除加载器环境变量，原生Node关闭TypeScript类型剥离，仍能导入、构造、启动、搜索表情、读取提示词、显示状态灯数据及停止。此测试不依赖开发环境的tsx。

Windows、原版Coopanion0.2.8；保留experimental / high-cost标签。新增云端服务真实账户联调与实际主动使用率仍待验证，不承诺每次检查或采纳，也不保证身体同步与第三方TTS过滤。
