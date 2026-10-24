// packages/cortico-world-bubble-emotes/web/styles.ts
var styles = `
.be-library [hidden]{display:none!important}.be-library .be-record-controls{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0 12px;align-items:center}.be-library .be-record-controls select{width:auto;max-width:100%}.be-library .be-record-list{display:grid;gap:16px}.be-library .be-record p{margin:8px 0}.be-library .be-record-text{white-space:pre-wrap;font-size:16px}.be-library .be-record textarea{margin-top:12px}.be-library .be-record button[aria-pressed=true]{border-color:var(--be-accent);color:var(--be-accent)}
.be-library{--be-ink:#25283d;--be-muted:#777b8e;--be-line:#e8e9f1;--be-accent:#515bfa;--be-surface:#fff;color:var(--be-ink)}
.be-library .be-page{max-width:1100px;margin:0 auto;padding:8px 0 32px;font-size:14px;line-height:1.6}
.be-library [hidden]{display:none!important}
.be-library .be-header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:12px}
.be-library h2{font-size:23px;letter-spacing:-.5px;margin:0 0 4px;font-weight:650;color:var(--be-ink)}
.be-library p{margin:0}.be-library .be-muted{color:var(--be-muted);font-size:13px}
.be-library .be-habit{font-size:12px;color:var(--be-muted);margin:0 0 24px}
.be-library .be-toolbar{display:flex;align-items:center;gap:16px;justify-content:space-between;flex-wrap:wrap}
.be-library input:not([type=checkbox]):not([type=range]),.be-library textarea,.be-library select{box-sizing:border-box;width:100%;min-width:0;border:1px solid var(--be-line);background:var(--be-surface);color:var(--be-ink);border-radius:9px;padding:9px 11px;font:inherit;line-height:1.5}
.be-library .be-search{flex:1;max-width:360px;min-width:180px!important}
.be-library textarea{resize:vertical}.be-library input[type=range]{width:100%}
.be-library .be-tabs{display:flex;gap:4px;padding:4px;background:#ebedf5;border-radius:10px}
.be-library button{font:inherit;font-size:13px;line-height:1.5;cursor:pointer;border-radius:8px;padding:7px 12px;border:1px solid var(--be-line);background:var(--be-surface);color:var(--be-ink);white-space:normal}
.be-library button.primary{background:var(--be-accent);color:#fff;border-color:var(--be-accent)}
.be-library .be-tabs button{background:transparent;border:0;color:var(--be-muted);padding:6px 10px}
.be-library .be-tabs button[aria-pressed=true]{background:var(--be-surface);color:var(--be-accent);box-shadow:0 1px 4px #27294b0c}
.be-library button:hover{filter:brightness(.97)}.be-library button:disabled{opacity:.45;cursor:default}
.be-library :is(button,input,textarea,select,summary):focus-visible{outline:2px solid var(--be-accent);outline-offset:3px}
.be-library .be-count{font-size:12px;color:var(--be-muted);margin:14px 0}
.be-library .be-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:16px;align-items:start}
.be-library .be-card{border:1px solid var(--be-line);border-radius:15px;background:var(--be-surface);padding:20px;min-width:0;overflow-wrap:anywhere}
.be-library .be-visual{height:68px;display:flex;align-items:center;justify-content:flex-start;font-size:43px;font-family:"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif;margin-bottom:13px;background:transparent}
.be-library .be-visual img{max-width:100%;max-height:68px;object-fit:contain;border-radius:6px}
.be-library .be-card-heading{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:8px}
.be-library h3{font-size:15px;font-weight:650;margin:0;color:var(--be-ink)}
.be-library .be-badge{font-size:11px;color:#777b8e;background:#f0f2f8;padding:2px 7px;border-radius:20px;white-space:nowrap}
.be-library .be-pending{background:#fff2d7;color:#94611b}
.be-library .be-meaning{font-size:13px;color:var(--be-muted);min-height:42px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.be-library .be-actions{display:flex;align-items:center;gap:8px;margin-top:16px;flex-wrap:wrap}
.be-library summary{cursor:pointer;color:var(--be-muted);font-size:12px;line-height:1.6;user-select:none}
.be-library .be-edit{border-top:1px solid var(--be-line);padding-top:12px;margin-top:16px}
.be-library .be-form{display:flex;flex-direction:column;gap:14px;margin-top:16px}
.be-library .be-field{display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--be-muted)}
.be-library .be-field input,.be-library .be-field textarea,.be-library .be-field select{font-size:13px}
.be-library .be-advanced{border:1px solid var(--be-line);border-radius:8px;padding:10px}.be-library .be-advanced[open]>*+*{margin-top:12px}
.be-library .be-emotions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;font-size:12px}
.be-library .be-emotions label,.be-library .be-review{display:flex;gap:7px;align-items:flex-start}
.be-library input[type=checkbox]{accent-color:var(--be-accent);flex:none;margin-top:4px}
.be-library .be-review{font-size:12px;color:var(--be-muted)}
.be-library .be-example{font-size:13px;background:#f5f6ff;padding:10px;border-radius:8px}
.be-library .be-import{border:1px solid var(--be-line);border-radius:12px;padding:18px;background:var(--be-surface);margin-bottom:20px}
.be-library .be-import:not([open]){display:none}.be-library .be-import>.be-form{max-width:600px}
.be-library .be-import>summary{font-size:15px;font-weight:600;color:var(--be-ink)}
.be-library .be-message,.be-library .be-warning{border-radius:10px;padding:12px 15px;margin-bottom:18px;background:#edf7f2;color:#28734e;font-size:13px}
.be-library .be-error,.be-library .be-warning{background:#fff4e1;color:#8c5b20}
.be-library .be-empty{padding:48px 16px;text-align:center;color:var(--be-muted);border:1px dashed var(--be-line);border-radius:12px}
.be-library .be-diagnostics{margin-top:24px}.be-library .be-diagnostics p{margin-top:10px}
@media(max-width:600px){.be-library .be-header{align-items:flex-start;flex-direction:column;gap:12px}.be-library h2{font-size:20px}.be-library .be-search{max-width:none}.be-library .be-tabs{width:100%;justify-content:space-between}.be-library .be-grid{grid-template-columns:1fr}.be-library .be-card{padding:16px}}
@media(prefers-color-scheme:dark){.be-library{--be-ink:#e2e4f2;--be-muted:#a3a9bf;--be-line:#373b50;--be-surface:#242737;--be-accent:#777eff}.be-library .be-tabs,.be-library .be-badge{background:#303448}.be-library .be-example{background:#303448}.be-library .be-pending{background:#493c28;color:#f3cc82}}
`;

// packages/cortico-world-bubble-emotes/web/records.ts
var emotions = { neutral: "\u4E2D\u6027", calm: "\u5E73\u9759\u3001\u653E\u677E", joy: "\u5F00\u5FC3", amusement: "\u597D\u7B11", excitement: "\u5174\u594B", celebration: "\u5E86\u795D", affection: "\u559C\u6B22", playfulness: "\u4FCF\u76AE", shyness: "\u5BB3\u7F9E", embarrassment: "\u5C34\u5C2C", surprise: "\u60CA\u8BB6", thinking: "\u601D\u8003", confusion: "\u7591\u60D1", skepticism: "\u6000\u7591", worry: "\u62C5\u5FC3", fear: "\u5BB3\u6015", sadness: "\u96BE\u8FC7", grief: "\u60B2\u75DB", disappointment: "\u5931\u671B", comfort: "\u5B89\u6170\u3001\u966A\u4F34", apology: "\u6B49\u610F", anger: "\u751F\u6C14", frustration: "\u6CAE\u4E27", determination: "\u575A\u5B9A", pride: "\u81EA\u8C6A", gratitude: "\u611F\u8C22", tiredness: "\u75B2\u60EB", sleepy: "\u56F0\u5026", disgust: "\u53CD\u611F", illness: "\u4E0D\u9002", uncertain: "\u8BED\u5883\u4E0D\u8DB3\uFF0C\u6682\u4E0D\u786E\u5B9A" };
var verdicts = { appropriate: "\u4F7F\u7528\u5408\u9002", missing: "\u53EF\u80FD\u6F0F\u7528", unnecessary: "\u4E0D\u4F7F\u7528\u4E5F\u5408\u7406", inappropriate: "\u53EF\u80FD\u4E0D\u5339\u914D", uncertain: "\u6682\u4E0D\u80FD\u5224\u65AD" };
var states = { pending: "\u7B49\u5F85\u5206\u6790", analyzing: "\u6B63\u5728\u5206\u6790", unavailable: "\u6682\u672A\u5206\u6790", error: "\u5206\u6790\u672A\u5B8C\u6210", deferred: "\u5F85\u624B\u52A8\u5206\u6790", needs_review: "\u5F85\u590D\u6838", skipped: "\u5DF2\u8DF3\u8FC7" };
var recordsPanel = { mount(ctx) {
  const { ui, root, signal } = ctx;
  root.classList.add("be-library");
  root.append(ui.h("style", null, styles));
  const page = ui.h("div", "be-page");
  root.append(page);
  page.append(ui.h("h2", null, "\u8868\u8FBE\u8BB0\u5F55"), ui.h("p", "be-muted", "\u770B\u770B\u4E00\u53E5\u8BDD\u4F20\u8FBE\u4E86\u4EC0\u4E48\u5FC3\u60C5\uFF0C\u8868\u60C5\u7528\u5F97\u662F\u5426\u5408\u9002\u3002\u5206\u6790\u662F\u4E8B\u540E\u5224\u65AD\uFF0C\u4E0D\u662F\u684C\u5BA0\u539F\u59CB\u51B3\u7B56\u7406\u7531\u3002"));
  const controls = ui.h("div", "be-record-controls"), backend = ui.h("select"), model = ui.h("select"), detect = ui.button("\u68C0\u6D4B\u672C\u673A\u6A21\u578B"), toggle = ui.button("\u5F00\u59CB\u8BB0\u5F55\u4E0E\u5206\u6790", { variant: "primary" }), clear = ui.button("\u6E05\u7A7A\u8BB0\u5F55");
  backend.setAttribute("aria-label", "\u5206\u6790\u65B9\u5F0F");
  model.setAttribute("aria-label", "\u672C\u673A\u5206\u6790\u6A21\u578B");
  for (const [value, label] of [["cloud", "\u901A\u8FC7\u4E91\u7AEF API \u5206\u6790"], ["ollama", "\u901A\u8FC7\u672C\u673A Ollama \u5206\u6790"]]) {
    const o = ui.h("option", null, label);
    o.value = value;
    backend.append(o);
  }
  const placeholder = ui.h("option", null, "\u8BF7\u9009\u62E9\u5DF2\u5B89\u88C5\u6A21\u578B");
  placeholder.value = "";
  model.append(placeholder);
  const cloud = ui.h("div", "be-record-controls"), provider = ui.h("select"), cloudModel = ui.h("input"), key = ui.h("input"), save = ui.button("\u4FDD\u5B58\u4E91\u7AEF\u8BBE\u7F6E"), removeKey = ui.button("\u505C\u7528\u5DF2\u4FDD\u5B58\u5BC6\u94A5");
  for (const [v, n] of [["deepseek", "DeepSeek"], ["openai", "OpenAI"]]) {
    const o = ui.h("option", null, n);
    o.value = v;
    provider.append(o);
  }
  provider.setAttribute("aria-label", "\u4E91\u7AEF\u670D\u52A1");
  cloudModel.setAttribute("aria-label", "\u4E91\u7AEF\u6A21\u578B");
  cloudModel.placeholder = "\u6A21\u578B\u540D\u79F0";
  cloudModel.value = "deepseek-flash";
  key.type = "password";
  key.autocomplete = "off";
  key.placeholder = "API Key\uFF08\u4FDD\u5B58\u540E\u4E0D\u56DE\u663E\uFF09";
  key.setAttribute("aria-label", "API Key");
  provider.addEventListener("change", () => {
    cloudModel.value = provider.value === "deepseek" ? "deepseek-flash" : "";
    key.value = "";
  }, { signal });
  cloud.append(provider, cloudModel, key, save, removeKey);
  page.append(cloud, ui.h("p", "be-muted", "\u4E91\u7AEF\u5206\u6790\u9700\u5355\u72EC\u586B\u5199\u670D\u52A1\u5546 API Key\uFF0CChatGPT \u8BA2\u9605\u4E0D\u80FD\u4EE3\u66FF API \u989D\u5EA6\u3002\u5F00\u542F\u540E\u5C06\u628A\u672C\u6761\u53D1\u8A00\u548C\u8868\u60C5\u5E93\u6458\u8981\u53D1\u9001\u7ED9\u6240\u9009\u670D\u52A1\u5546\uFF0C\u4EA7\u751F API \u8D39\u7528\u3002\u5BC6\u94A5\u7531\u5BBF\u4E3B\u90E8\u7F72 .env \u7BA1\u7406\uFF0C\u4E0D\u56DE\u663E\uFF1B\u505C\u7528\u4E0D\u4F1A\u64A4\u9500\u670D\u52A1\u5546\u5BC6\u94A5\uFF1B\u8BB0\u5F55\u9ED8\u8BA4\u5173\u95ED\u3002"));
  controls.append(backend, model, detect, toggle, clear);
  page.append(controls, ui.h("p", "be-muted", "\u4EC5\u6536\u96C6\u5F00\u542F\u540E\u7684\u65B0\u53D1\u8A00\uFF0C\u6700\u591A\u4FDD\u7559100\u6761\u672C\u5730\u8BB0\u5F55\u3002AI\u5206\u6790\u4F1A\u628A\u672C\u6761\u539F\u8BDD\u548C\u8868\u60C5\u5E93\u6458\u8981\u4EA4\u7ED9\u6240\u9009\u6A21\u578B\uFF0C\u53EF\u80FD\u4EA7\u751F\u7528\u91CF\uFF1B\u4E0D\u4F1A\u81EA\u52A8\u4E0B\u8F7D\u6A21\u578B\uFF0C\u53D1\u73B0\u8FD1\u671F\u6F0F\u7528\u4E14\u6709\u5408\u9002\u8868\u60C5\u65F6\uFF0C\u4F1A\u5728\u540E\u7EED\u6B63\u5E38\u5BF9\u8BDD\u4E2D\u7ED9\u684C\u5BA0\u4E00\u6B21\u9650\u9891\u5EFA\u8BAE\uFF0C\u4E0D\u4F1A\u8865\u53D1\u65E7\u8BDD\u6216\u81EA\u52A8\u6DFB\u52A0\u8868\u60C5\u3002"));
  const message = ui.h("p", "be-message");
  message.hidden = true;
  message.setAttribute("role", "status");
  const status = ui.h("p", "be-count"), list = ui.h("div", "be-record-list");
  page.append(message, status, list);
  const drafts = /* @__PURE__ */ new Map();
  let settings = { enabled: false, backend: "cloud", model: "" }, initialized = false, signature = "", refreshing = false;
  function notify(text, bad = false) {
    if (signal.aborted) return;
    message.hidden = false;
    message.textContent = text;
    message.classList.toggle("be-error", bad);
  }
  function fail(e) {
    notify(String(e.message ?? e), true);
  }
  function showBackend() {
    model.hidden = backend.value !== "ollama";
    detect.hidden = backend.value !== "ollama";
    cloud.hidden = backend.value !== "cloud";
  }
  backend.addEventListener("change", showBackend, { signal });
  showBackend();
  async function refresh() {
    if (refreshing || signal.aborted) return;
    refreshing = true;
    try {
      const data = await ctx.invoke("state");
      if (signal.aborted) return;
      settings = data.settings;
      if (!initialized) {
        backend.value = settings.backend;
        provider.value = data.cloud.provider;
        cloudModel.value = data.cloud.model;
        key.placeholder = data.cloud.keyConfigured ? "\u5DF2\u4FDD\u5B58\u5BC6\u94A5\uFF0C\u7559\u7A7A\u4FDD\u7559" : "\u8BF7\u8F93\u5165 API Key";
        model.value = settings.model;
        if (settings.model && !model.value) {
          const o = ui.h("option", null, settings.model);
          o.value = settings.model;
          model.append(o);
          model.value = settings.model;
        }
        showBackend();
        initialized = true;
      }
      toggle.textContent = settings.enabled ? "\u6682\u505C\u8BB0\u5F55\u4E0E\u5206\u6790" : "\u5F00\u59CB\u8BB0\u5F55\u4E0E\u5206\u6790";
      status.textContent = (settings.enabled ? "\u6B63\u5728\u8BB0\u5F55" : "\u5DF2\u6682\u505C") + " \xB7 " + data.rows.length + " / 100 \u6761" + (settings.backend === "cloud" && !data.cloud.keyConfigured ? " \xB7 \u8BF7\u5148\u914D\u7F6E\u4E91\u7AEF API Key" : "");
      if (data.storageError || data.cloud.error) notify(data.storageError || data.cloud.error, true);
      if (data.diagnostics?.observationTruncated) status.textContent += " \xB7 \u79EF\u538B\u89C2\u5BDF\u7A97\u53E3\u5DF2\u622A\u65AD\uFF0C\u53EA\u7EDF\u8BA1\u6700\u8FD1100\u6761";
      if (data.diagnostics) status.textContent += " \xB7 \u4E91\u7AEF\u8BF7\u6C42 " + data.diagnostics.cloudCallsLastHour + "/" + data.diagnostics.cloudHourlyLimit + " \u6B21/\u5C0F\u65F6";
      const next = JSON.stringify(data.rows);
      if (next === signature || list.contains(root.ownerDocument.activeElement) && root.ownerDocument.activeElement?.tagName === "TEXTAREA") return;
      signature = next;
      list.replaceChildren();
      if (!data.rows.length) list.append(ui.h("p", "be-empty", settings.enabled ? "\u7B49\u5F85\u684C\u5BA0\u7684\u4E0B\u4E00\u53E5\u53D1\u8A00\u3002" : "\u5F00\u542F\u540E\u4F1A\u8BB0\u5F55\u65B0\u7684\u53D1\u8A00\uFF0C\u4E0D\u8BFB\u53D6\u65E7\u804A\u5929\u3002"));
      for (const row of data.rows) {
        const card = ui.h("section", "be-card be-record");
        card.dataset.recordId = row.id;
        const head = ui.h("div", "be-card-heading");
        head.append(ui.h("span", "be-muted", new Date(row.at).toLocaleString()), ui.h("span", "be-badge", row.state === "done" ? verdicts[row.analysis.verdict] : states[row.state]));
        card.append(head, ui.h("p", "be-record-text", row.text), ui.h("p", "be-muted", "\u5B9E\u9645\u8868\u60C5\uFF1A" + (row.emoji.length ? row.emoji.join(" ") : "\u672A\u4F7F\u7528")));
        if (row.diagnostics) card.append(ui.h("p", "be-muted", "\u5206\u6790\u6B21\u6570\uFF1A" + row.diagnostics.attempts + (row.diagnostics.durationMs !== void 0 ? " \xB7 \u8017\u65F6 " + (row.diagnostics.durationMs / 1e3).toFixed(1) + " \u79D2" : "") + (row.diagnostics.errorCode ? " \xB7 \u539F\u56E0\uFF1A" + row.diagnostics.errorCode : "")));
        if (row.hint) {
          const labels = { queued: "\u7B49\u5F85\u6B63\u5E38\u5BF9\u8BDD", rendered: "\u5DF2\u6210\u6587\uFF0C\u5F85\u5BBF\u4E3B\u786E\u8BA4", delivered: "\u5BBF\u4E3B\u5DF2\u786E\u8BA4\u9001\u8FBE", discarded: "\u5DF2\u4E22\u5F03", expired: "\u5DF2\u8FC7\u671F", cancelled: "\u5DF2\u53D6\u6D88", skipped: "\u672A\u6392\u961F" };
          card.append(ui.h("p", "be-muted", "\u53CD\u9988\u72B6\u6001\uFF1A" + labels[row.hint.state] + " \xB7 " + row.hint.reason));
          if (row.hint.followup) card.append(ui.h("p", "be-muted", "\u9001\u8FBE\u540E\u9996\u6761\u53D1\u8A00\uFF1A" + (row.hint.followup.hasEmoji ? "\u5305\u542B\u8868\u60C5" : "\u6CA1\u6709\u8868\u60C5") + "\uFF08\u4EC5\u89C2\u5BDF\uFF0C\u4E0D\u4EE3\u8868\u5EFA\u8BAE\u88AB\u91C7\u7EB3\uFF09"));
        }
        if (row.notice) card.append(ui.h("p", "be-muted", row.notice));
        if ((row.diagnostics?.repeatCount ?? 0) >= 2) card.append(ui.h("p", "be-muted", "\u76F8\u540C\u539F\u56E0\u5DF2\u8FDE\u7EED\u5931\u8D25 " + row.diagnostics.repeatCount + " \u6B21\uFF0C\u539F\u6837\u91CD\u8BD5\u53EF\u80FD\u4ECD\u5931\u8D25\u3002\u8BF7\u68C0\u67E5\u670D\u52A1\u6216\u8C03\u6574\u6A21\u578B\uFF0C\u4E5F\u53EF\u4EE5\u8DF3\u8FC7\u8FD9\u6761\u3002"));
        if (row.truncated) card.append(ui.h("p", "be-muted", "\u957F\u53D1\u8A00\u5DF2\u622A\u53D6\uFF0C\u5206\u6790\u53EF\u80FD\u7F3A\u5C11\u8BED\u5883\u3002"));
        if (row.analysis) {
          card.append(ui.h("p", null, "\u60C5\u7EEA\u5224\u65AD\uFF1A" + (emotions[row.analysis.emotion] ?? "\u6682\u4E0D\u786E\u5B9A")), ui.h("p", "be-muted", "\u5206\u6790\u8BF4\u660E\uFF1A" + row.analysis.explanation));
          if (row.analysis.suggestion) card.append(ui.h("p", null, "\u53EF\u8003\u8651\uFF1A" + row.analysis.suggestion));
          card.append(ui.h("p", "be-muted", "\u4E8B\u540E\u5206\u6790 \xB7 " + (row.analyzer ?? "AI\u6A21\u578B")));
          const feedback = ui.h("div", "be-actions"), yes = ui.button("\u5224\u65AD\u5BF9\u4E86"), no = ui.button("\u5224\u65AD\u9519\u4E86"), note = ui.h("textarea");
          note.rows = 2;
          note.maxLength = 200;
          note.placeholder = "\u53EF\u9009\uFF1A\u6307\u51FA\u54EA\u91CC\u5224\u65AD\u9519\u4E86\uFF0C\u4F8B\u5982\u5F15\u7528\u3001\u5426\u5B9A\u6216\u60C5\u7EEA\u5F52\u5C5E";
          note.setAttribute("aria-label", "\u5224\u65AD\u53CD\u9988\u8BF4\u660E");
          note.value = drafts.get(row.id) ?? row.feedback?.note ?? "";
          note.addEventListener("input", () => drafts.set(row.id, note.value), { signal });
          const send = (correct) => {
            yes.disabled = no.disabled = true;
            void ctx.invoke("feedback", [row.id, correct, note.value]).then(() => {
              signature = "";
              notify("\u53CD\u9988\u5DF2\u4FDD\u5B58\uFF1B\u4E0D\u4F1A\u636E\u6B64\u8BAD\u7EC3\u6A21\u578B\uFF1B\u6807\u8BB0\u5224\u65AD\u9519\u8BEF\u4F1A\u4F7F\u5C1A\u672A\u9001\u8FBE\u7684\u672C\u6761\u5EFA\u8BAE\u5931\u6548\u3002");
            }).catch(fail).finally(() => {
              yes.disabled = no.disabled = false;
              void refresh();
            });
          };
          yes.addEventListener("click", () => send(true), { signal });
          no.addEventListener("click", () => send(false), { signal });
          if (row.feedback) {
            yes.setAttribute("aria-pressed", String(row.feedback.correct));
            no.setAttribute("aria-pressed", String(!row.feedback.correct));
            card.append(ui.h("p", "be-muted", row.feedback.correct ? "\u5DF2\u53CD\u9988\uFF1A\u5224\u65AD\u5BF9\u4E86" : "\u5DF2\u53CD\u9988\uFF1A\u5224\u65AD\u9519\u4E86\uFF0C\u5F85\u590D\u6838"));
          }
          feedback.append(yes, no);
          card.append(note, feedback);
        } else if (row.error) card.append(ui.h("p", "be-muted", row.error + (row.state === "error" && !row.diagnostics ? "\uFF08\u65E7\u8BB0\u5F55\u672A\u4FDD\u5B58\u9519\u8BEF\u5206\u7C7B\uFF0C\u53EF\u624B\u52A8\u91CD\u8BD5\u83B7\u53D6\u8BCA\u65AD\uFF09" : "")));
        if (!["pending", "analyzing"].includes(row.state)) {
          const retry = ui.button(row.state === "needs_review" ? "\u66F4\u6362\u6A21\u578B\u540E\u91CD\u65B0\u5224\u65AD" : row.analysis ? "\u91CD\u65B0\u5206\u6790\uFF08\u6E05\u9664\u672C\u6B21\u53CD\u9988\uFF09" : (row.diagnostics?.repeatCount ?? 0) >= 2 ? "\u8C03\u6574\u8BBE\u7F6E\u540E\u91CD\u8BD5" : "\u5206\u6790\u8FD9\u53E5\u8BDD");
          retry.disabled = !settings.enabled;
          retry.addEventListener("click", () => {
            retry.disabled = true;
            void ctx.invoke("retry", [row.id]).then(() => {
              signature = "";
              return refresh();
            }).catch(fail).finally(() => retry.disabled = !settings.enabled);
          }, { signal });
          card.append(retry);
        }
        if (["error", "needs_review", "unavailable", "deferred"].includes(row.state)) {
          const skip = ui.button("\u8DF3\u8FC7\u8FD9\u6761");
          skip.addEventListener("click", () => {
            skip.disabled = true;
            void ctx.invoke("skip", [row.id]).then(() => {
              signature = "";
              return refresh();
            }).catch(fail).finally(() => skip.disabled = false);
          }, { signal });
          card.append(skip);
        }
        list.append(card);
      }
    } catch (e) {
      fail(e);
    } finally {
      refreshing = false;
    }
  }
  detect.addEventListener("click", () => {
    detect.disabled = true;
    void ctx.invoke("models").then((data) => {
      if (signal.aborted) return;
      model.replaceChildren(placeholder);
      for (const name of data.models) {
        const o = ui.h("option", null, name);
        o.value = name;
        model.append(o);
      }
      notify(data.error || "\u9009\u62E9\u4E00\u4E2A\u6A21\u578B\uFF0C\u518D\u5F00\u59CB\u8BB0\u5F55\uFF1B\u5DF2\u5F00\u542F\u65F6\u53EF\u6682\u505C\u540E\u5207\u6362\u3002", !!data.error);
    }).catch(fail).finally(() => detect.disabled = false);
  }, { signal });
  save.addEventListener("click", () => {
    save.disabled = true;
    void ctx.invoke("cloud", [{ provider: provider.value, model: cloudModel.value, apiKey: key.value }]).then(() => {
      key.value = "";
      key.placeholder = "\u5BC6\u94A5\u5DF2\u4FDD\u5B58\uFF0C\u7559\u7A7A\u4FDD\u7559";
      notify("\u4E91\u7AEF\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u8BB0\u5F55\u5DF2\u6682\u505C\uFF1B\u70B9\u51FB\u5F00\u59CB\u540E\u53D1\u9001\u65B0\u53D1\u8A00\u7ED9\u4E91\u7AEF\u5206\u6790\u3002");
      return refresh();
    }).catch(fail).finally(() => save.disabled = false);
  }, { signal });
  removeKey.addEventListener("click", () => {
    void ctx.invoke("cloud", [{ provider: provider.value, model: cloudModel.value, clearKey: true }]).then(() => {
      key.value = "";
      key.placeholder = "\u8BF7\u8F93\u5165 API Key";
      notify("\u5BC6\u94A5\u5F15\u7528\u5DF2\u505C\u7528\uFF0C\u8BB0\u5F55\u5DF2\u6682\u505C\u3002\u90E8\u7F72 .env \u4E2D\u4ECD\u4FDD\u7559\u51ED\u8BC1\uFF1B\u5F7B\u5E95\u64A4\u9500\u8BF7\u5230\u670D\u52A1\u5546\u7BA1\u7406\u9875\u9762\u3002");
      return refresh();
    }).catch(fail);
  }, { signal });
  toggle.addEventListener("click", () => {
    toggle.disabled = true;
    void ctx.invoke("configure", [{ enabled: !settings.enabled, backend: backend.value, model: model.value }]).then(() => {
      signature = "";
      return refresh();
    }).catch(fail).finally(() => toggle.disabled = false);
  }, { signal });
  const confirmClear = ui.button("\u786E\u8BA4\u6E05\u7A7A\u8FD9100\u6761\u4EE5\u5185\u7684\u8BB0\u5F55");
  confirmClear.hidden = true;
  controls.append(confirmClear);
  clear.addEventListener("click", () => confirmClear.hidden = !confirmClear.hidden, { signal });
  confirmClear.addEventListener("click", () => {
    confirmClear.disabled = true;
    void ctx.invoke("clear").then(() => {
      drafts.clear();
      signature = "";
      confirmClear.hidden = true;
      notify("\u8BB0\u5F55\u5DF2\u6E05\u7A7A\u3002");
      return refresh();
    }).catch(fail).finally(() => confirmClear.disabled = false);
  }, { signal });
  void refresh();
  ctx.interval(() => {
    void refresh();
  }, 2500);
} };

// packages/cortico-world-bubble-emotes/web/client.ts
var bundle = { panels: { records: recordsPanel, library: { mount(ctx) {
  const { ui, root, signal } = ctx;
  root.classList.add("be-library");
  root.append(ui.h("style", null, styles));
  const page = ui.h("div", "be-page");
  root.append(page);
  const header = ui.h("div", "be-header"), intro = ui.h("div");
  intro.append(ui.h("h2", null, "\u7ED9\u5FC3\u60C5\u52A0\u4E00\u4E2A\u8868\u60C5"), ui.h("p", "be-muted", "\u76F4\u63A5\u7528\u4E8E\u539F\u7248\u684C\u5BA0\u6C14\u6CE1\uFF0C\u65E0\u9700\u4FEE\u6539\u4E3B\u7A0B\u5E8F\u3002"));
  header.append(intro);
  page.append(header);
  const habit = ui.h("p", "be-habit", "\u56DE\u5E94\u65B9\u5F0F\u7531\u4E3B\u7A0B\u5E8F\u300C\u4E60\u60EF\u300D\u7BA1\u7406\u3002");
  page.append(habit);
  let loading = false;
  async function refreshHabit() {
    if (loading || signal.aborted) return;
    loading = true;
    try {
      const r = await fetch("/api/webui/providers/world%3Adesktop-pet/panels/pet/state", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: '{"args":[]}', signal });
      if (!r.ok) throw Error();
      const s = await r.json();
      if (signal.aborted) return;
      const labels = { none: "\u5B89\u9759", poke: "\u9ED8\u8BA4", all: "\u79EF\u6781", custom: "\u81EA\u5B9A\u4E49" };
      habit.textContent = labels[s.wake?.wakeOn] ? "\u5F53\u524D\u4E60\u60EF \xB7 " + labels[s.wake.wakeOn] + "\u6A21\u5F0F" : "\u56DE\u5E94\u65B9\u5F0F\u7531\u4E3B\u7A0B\u5E8F\u300C\u4E60\u60EF\u300D\u7BA1\u7406\u3002";
    } catch {
      if (!signal.aborted) habit.textContent = "\u4E60\u60EF\u72B6\u6001\u6682\u4E0D\u53EF\u7528\uFF1B\u53EF\u7EE7\u7EED\u7BA1\u7406\u8868\u60C5\u3002";
    } finally {
      loading = false;
    }
  }
  void refreshHabit();
  ctx.interval(() => {
    void refreshHabit();
  }, 5e3);
  const notice = ui.h("details", "be-diagnostics");
  notice.append(ui.h("summary", null, "\u529F\u80FD\u8303\u56F4"), ui.h("p", "be-muted", "\u4EC5\u652F\u6301\u666E\u901Aemoji\u5B57\u7B26\uFF0C\u4E0D\u652F\u6301\u56FE\u7247\u548C\u8868\u60C5\u5305\u3002\u663E\u793A\u4F9D\u8D56\u7CFB\u7EDF\u5B57\u4F53\uFF0C\u52A8\u4F5C\u4EC5\u4E3A\u5EFA\u8BAE\uFF1B\u4E0D\u786E\u8BA4\u8EAB\u4F53\u540C\u6B65\uFF0C\u4E5F\u4E0D\u4FDD\u8BC1\u7B2C\u4E09\u65B9\u8BED\u97F3\u4F1A\u8DF3\u8FC7emoji\u3002\u65E7\u56FE\u7247\u7D20\u6750\u4FDD\u7559\uFF0C\u4F46\u4E0D\u5728\u65B0\u7248\u4E2D\u4F7F\u7528\u3002"));
  page.append(notice);
  const filter = ui.h("input", "be-search");
  filter.type = "search";
  filter.placeholder = "\u641C\u7D22\u8868\u60C5\u3001\u5FC3\u60C5\u6216\u542B\u4E49";
  filter.setAttribute("aria-label", "\u641C\u7D22\u8868\u60C5");
  const count = ui.h("p", "be-count"), message = ui.h("p", "be-message");
  message.hidden = true;
  message.setAttribute("role", "status");
  message.setAttribute("aria-live", "polite");
  const list = ui.h("div", "be-grid"), empty = ui.h("p", "be-empty", "\u6CA1\u6709\u627E\u5230\u8868\u60C5\uFF0C\u8BD5\u8BD5\u5176\u4ED6\u5173\u952E\u8BCD\u3002");
  empty.hidden = true;
  page.append(filter, count, message, list, empty);
  function notify(text, error = false) {
    if (signal.aborted) return;
    message.textContent = text;
    message.hidden = false;
    message.classList.toggle("be-error", error);
  }
  function fail(error) {
    notify("\u64CD\u4F5C\u672A\u5B8C\u6210\uFF1A" + String(error.message ?? error), true);
  }
  function filterRows() {
    let visible = 0;
    for (const row of Array.from(list.children)) {
      row.hidden = !(row.dataset.search ?? "").includes(filter.value.trim().toLowerCase());
      if (!row.hidden) visible++;
    }
    count.textContent = `\u5171 ${list.children.length} \u4E2A\u8868\u60C5 \xB7 \u5F53\u524D\u663E\u793A ${visible} \u4E2A`;
    empty.hidden = visible > 0;
  }
  filter.addEventListener("input", filterRows, { signal });
  function field(label, input) {
    const wrap = ui.h("label", "be-field");
    wrap.append(ui.h("span", null, label), input);
    return wrap;
  }
  async function update(id, patch) {
    const entries = await ctx.invoke("list");
    const current = entries.find((e) => e.id === id);
    if (!current) throw Error("\u8868\u60C5\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5");
    await ctx.invoke("update", [{ ...current, ...patch }]);
    await refresh();
  }
  async function refresh() {
    const entries = await ctx.invoke("list");
    if (signal.aborted) return;
    list.replaceChildren();
    for (const e of entries.filter((e2) => e2.kind === "emoji")) {
      const row = ui.h("section", "be-card");
      row.dataset.id = e.id;
      row.dataset.search = [e.id, e.description, e.usage, ...e.aliases ?? [], ...e.emotions].join(" ").toLowerCase();
      const visual = ui.h("div", "be-visual", e.text), heading = ui.h("div", "be-card-heading"), title = ui.h("h3", null, e.aliases?.[0] || e.id), badge = ui.h("span", "be-badge", !e.reviewed ? "\u672A\u786E\u8BA4" : e.enabled ? "\u5DF2\u542F\u7528" : "\u5DF2\u505C\u7528");
      heading.append(title, badge);
      const meaning = ui.h("p", "be-meaning", e.usage ?? e.description), actions = ui.h("div", "be-actions"), toggle = ui.button(e.enabled ? "\u505C\u7528" : "\u542F\u7528");
      toggle.disabled = !e.reviewed;
      toggle.setAttribute("aria-label", (e.enabled ? "\u505C\u7528" : "\u542F\u7528") + " " + (e.aliases?.[0] || e.id));
      toggle.addEventListener("click", () => {
        toggle.disabled = true;
        void update(e.id, { enabled: !e.enabled }).then(() => notify("\u5DF2\u66F4\u65B0")).catch(fail).finally(() => {
          if (!signal.aborted) toggle.disabled = !e.reviewed;
        });
      }, { signal });
      actions.append(toggle);
      const details = ui.h("details", "be-edit");
      details.append(ui.h("summary", null, "\u4F7F\u7528\u8BF4\u660E\u4E0E\u7F16\u8F91"));
      const form = ui.h("form", "be-form");
      if (e.example) form.append(ui.h("p", "be-example", "\u4F8B\u5982\uFF1A" + e.example));
      if (e.avoid?.length) form.append(ui.h("p", "be-muted", "\u4E0D\u9002\u5408\uFF1A" + e.avoid.join(" ")));
      const name = ui.h("input");
      name.value = e.aliases?.[0] || e.id;
      name.required = true;
      name.maxLength = 80;
      const usage = ui.h("textarea");
      usage.rows = 3;
      usage.value = e.usage ?? e.description;
      usage.required = true;
      usage.maxLength = 500;
      const reviewed = ui.h("input");
      reviewed.type = "checkbox";
      reviewed.checked = e.reviewed;
      const review = ui.h("label", "be-review");
      review.append(reviewed, ui.h("span", null, "\u5DF2\u786E\u8BA4\u542B\u4E49\u4E0E\u4F7F\u7528\u573A\u666F"));
      const save = ui.button("\u4FDD\u5B58\u8BBE\u7F6E", { variant: "primary" });
      save.type = "submit";
      form.append(field("\u540D\u79F0", name), field("\u9002\u5408\u4EC0\u4E48\u65F6\u5019\u4F7F\u7528", usage), review, save);
      details.append(form);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        save.disabled = true;
        void update(e.id, { aliases: [name.value.trim(), ...(e.aliases ?? []).slice(1)], usage: usage.value.trim(), reviewed: reviewed.checked }).then(() => notify("\u5DF2\u4FDD\u5B58")).catch(fail).finally(() => {
          save.disabled = false;
        });
      }, { signal });
      row.append(visual, heading, meaning, actions, details);
      list.append(row);
    }
    filterRows();
  }
  void refresh().catch(fail);
} } } };
var client_default = bundle;
export {
  client_default as default
};
