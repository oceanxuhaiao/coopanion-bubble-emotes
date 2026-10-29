# 表达助手 · 情绪与表情

0.4.0。37个Unicode emoji、30类情绪及可编辑的“情绪 → emoji → 身体心情”映射。目标宿主为原版Coopanion0.2.8、World API6，无需主程序补丁。

## 草稿自检

无需额外API地址、密钥或模型。桌宠当前聊天模型在回复前判断文字情绪、emoji适宜性和使用情况，将draft、context和结构化assessment提交给bubble_emotes_review_draft。扩展校验并返回finalDraft与可选身体标记，由主模型决定是否发送一条原生pet_say.script。

这是当前主模型自检，不是独立模型复核；扩展不读取宿主模型密钥、不发起独立模型请求、不保证模型每次检查或采纳。自检仍占用正常聊天上下文与工具调用用量。无需WorldHost.cognition。

表情库的“草稿与身体设置”提供两个开关。新安装默认启用草稿检查；已有draft-settings.json保留原值；从尚无此设置文件的旧版升级时使用新版默认值。不采集桌宠发言、不跟踪采纳，不保存草稿、检查摘要或历史，不提供表达记录、人工反馈、校准或频率提醒。只在draft-settings.json保存两个开关。

移除表达记录功能不会删除历史文件。已有expression-records.json、analysis-cloud.json和部署.env原样保留，当前扩展不读取或更新这些文件。主程序自身的对话或工具日志由主程序管理，不属于本扩展的保存范围。独立API配置与连接测试入口已移除。

## 表情库与身体表现

常见emoji直接写入pet_say.script；bubble_emotes_search/prepare用于查看启用且审核过的用法。禁用、未审核或禁用情绪的条目不作为建议。中性事实、纯引用和语境不明不机械配表情，不增加发言机会。

内置Coo/大肥鱼的19种表情可生成句首【happy】等原生标记，不执行睡觉、跑动、跳舞等动作。实时姿态仍未知，仅对核实过的内置原生保护生成候选；明确限制、断开、隐藏、缺失/过期状态、第三方形象和原稿已有标记时降级。自定义身体映射仍只建议。身体协调可单独关闭，不保证动画显示或第三方语音跳过emoji。

不支持图片导入、表情包、富气泡或自定义presentation字段。保留旧图片文件，不作为当前可发送素材。升级不会自动修复或撤销历史主程序/语音补丁。

## 安装与验证

通过官方扩展市场或本地目录安装接口安装，启用World bubble-emotes并按宿主提示重启。包使用编译JavaScript入口，无需tsx或TypeScript运行依赖。

保留experimental / high-cost标签。自动化检查覆盖草稿校验、无发言采集、无草稿存储、原版工具与面板。真实主动调用率、判断准确性和动画时序仍待行为验收，不保证100%覆盖。

## English

The current chat model submits a structured draft self-check. The extension validates it and suggests emoji and supported native faces without collecting speech or storing drafts/check history. No separate model connection, speech records, feedback calibration or usage reminders. Only draft-check and body-coordination switches are saved. Legacy data and credential files remain untouched. This is self-review, not independent review; stock Coopanion0.2.8 / World API6, with no guaranteed rendering.
