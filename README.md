# 表情

![表情](packages/cortico-world-bubble-emotes/assets/icon.svg)

当前版本 **0.3.2**，适用原版 Coopanion 0.2.8。37个Unicode emoji，支持单独发送或与文字同句。无需宿主补丁。

新增默认关闭的表达记录、可选云端/Ollama分析、人工反馈、分类诊断、待复核与跳过。密钥经宿主官方部署秘密接口保存。云端需要另外配置API Key并产生费用，不会自动复用桌宠聊天连接。

**主动表情使用效果仍未通过行为验收，保留experimental / high-cost标签。** 不支持图片表情包或富气泡，不保证严格身体同步和第三方语音过滤。

- [安装和功能说明](packages/cortico-world-bubble-emotes/README.md)
- [更新说明](docs/RELEASE-0.3.2.md)
- [npm](https://www.npmjs.com/package/cortico-world-bubble-emotes)

验证：本地50项单元测试、11项原版集成/打包检查，类型、构建及官方扩展规范检查通过。4条真实本机模型合成分析完成；云端账号真实联调尚未完成，主动使用效果没有达标。

## 开发

需要Node.js 22以上。类型和单元测试采用Coopanion 0.2.8所带框架：将官方目标源码检出至 `upstream/Coopanion-0.2.8` 并安装其开发依赖，再在本仓库执行 `npm ci --ignore-scripts`、`npm run typecheck`、`npm test`、`npm run build`。上游源码、依赖、私有部署、凭证和本地集成夹具不随本仓库发布；上述11项本地集成检查并非仅凭此仓库即可重放。

包运行时由Coopanion解析cortico模块，无新增生产依赖。旧版图片与补丁记录只属历史，不是0.3.2功能。
