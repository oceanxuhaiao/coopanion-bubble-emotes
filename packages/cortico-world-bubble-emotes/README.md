# 表情

> 0.3.2 更新：加入可选的表达记录与模型分析，修复密钥管理、反馈调度及反复分析失败处理。主动使用表情的效果仍未通过验收；保留 experimental / high-cost 标签。

## 表达记录（可选）

在扩展的“表达记录”页选择分析方式，再点“开始记录与分析”。默认不开启，不读取旧聊天。每条记录分开显示原话、代码识别的实际emoji，以及AI事后判断的情绪、适用性与简短说明；这些不是桌宠原始思考或未使用表情的真实原因。判断可能错误，可点“判断对了／判断错了”并补充说明。反馈只保存在本机，不自动训练模型。近期漏用且有合适表情的分析会产生限频建议；标记判断错误会撤回尚未送达的建议。

已移除“宿主后台分析”。选择“通过云端 API 分析”，填写 DeepSeek / OpenAI 的服务商 API Key 和模型名称，保存后再开启；或选择本机 Ollama。云端设置独立于 Coopanion，不能复用 ChatGPT 订阅登录。DeepSeek 默认模型 deepseek-flash；OpenAI 请填写支持 Chat Completions、JSON 输出的可用模型。密钥通过官方 WorldContext secret/storeSecret 存入部署 .env，不回显、不写进表达记录。旧 analysis-cloud.json 的密钥仅在官方写入并回读成功后移除；失败保留原文件。停用密钥只停用引用，.env 和历史备份可能仍含凭证；彻底撤销须在服务商侧操作。切换服务商不会沿用另一服务商密钥。开启后每条新发言及表情库摘要会发送给所选服务商并产生 API 用量；不上传旧聊天。保存设置会暂停记录。云端自动化采用模拟响应，真实账号仍待联调。

最多保留100条本地明文记录，待分析队列上限8条，逐条处理；忙时仍记录事实，可手动重试。可暂停、清空。超过4000字符的发言截取并标记，默认不自动分析。清空/暂停后，迟到分析结果不会恢复已清空的记录。模型不可用或结果格式错误时明确显示失败。主要判断与已观测表情冲突时显示“待复核”，不伪装成成功、不用于提醒；可选表情建议无效时仅忽略该建议并标注，保留有效主要判断。相同错误连续失败会显示次数和调整设置提示，可跳过这条，保留原话并停止自动处理；以后仍可手动重新分析。不使用关键词猜测兜底。重新分析会清除该条本次反馈。

记录是已提交发言的本地归档，不是屏幕显示、身体同步或语音播放证明。分析完成后可为近期漏用发言提供一次随正常轮次送达的建议，两分钟限频且两分钟过期；不额外唤醒，不补发原话。禁用表情、暂停记录、清空、较新表情发言或判断错误会取消建议。中性、语境不足或无建议表情的记录不触发。既有十条纯文字频率补救保留，共用待送达与限频状态。

诊断分别显示超时、连接、鉴权、限流、格式、语义校验和响应超限，并记录次数、耗时。旧错误无法追溯分类，手动重试后可生成新诊断。反馈区分未排队、已排队、已成文、宿主确认送达、过期和取消；送达后下一条发言是否有表情仅是观察，不代表因果采纳。云端分析每小时最多60次请求，跨重启保留窗口；超限不自动重试。响应按32,000字节限制读取（模型列表256,000字节），不保存原始服务错误或响应。

表达补救机制仅通过公开只读事件库统计挂载后新增的桌宠自身发言。连续10条没有emoji时，最多每10分钟向下一次正常对话附带一次提醒；不会额外唤醒、重发或孤立补发表情。若提醒投递前已出现emoji、全部素材已禁用或扩展已停止，提醒作废。它不识别整句情绪，也不保证模型一定采用建议或证明屏幕已显示。

![表情标志](assets/icon.svg)

让桌宠的问候带上笑意，也让安慰多一点温度。37 个 emoji 与语境提示，把开心、思考和陪伴写进气泡。原版 Coopanion 0.2.8 安装启用即可，无需修改主程序。

0.3.2适用于**原版Coopanion 0.2.8**。安装、启用扩展后即可通过原生`pet_say.script`在气泡中显示普通Unicode emoji；无需修改主程序、安装字体或更换语音解析器。字体覆盖决定具体字形能否显示，不保证所有系统字体都支持全部emoji。

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

Version 0.3.2 supplies 37 Unicode emoji across 30 meanings for stock Coopanion 0.2.8. Install and enable this World, then put emoji directly in the existing pet_say.script. No host patch, external service, extra API key or model download is required. The built-in desktop pet must be enabled and connected. Glyph availability depends on system fonts.

Image import/sending, stickers, rich head bubbles, custom rendering, special presentation/emoji/expression fields, host patches and speech adapters are removed. Body labels are optional script-marker suggestions, without confirmed synchronization. Third-party speech filtering is not guaranteed; stock soft-voice 0.4.11 retains emoji in its TTS input. Existing library data and legacy image files remain on disk, while image entries are inactive and hidden. Upgrading does not automatically undo old host or speech modifications. Model expression frequency and contextual correctness remain experimental.


0.3.2 adds optional expression records and cloud/Ollama review. Cloud review requires a separately configured API key stored through the host deployment secret API; it does not automatically reuse the chat connection. Recording is off by default. Calls may incur cost. Invalid optional suggestions are omitted with notice; conflicting primary judgments require review. Proactive emoji-use improvement has not passed behavioral acceptance.
