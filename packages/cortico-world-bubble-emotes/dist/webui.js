// packages/cortico-world-bubble-emotes/web/draft-status.ts
function mountDraftStatus(ctx, parent) {
  const { ui, signal } = ctx, box = ui.h("details", "be-card"), summary = ui.h("summary", null, "\u8349\u7A3F\u68C0\u67E5\u8BB0\u5F55");
  box.append(summary, ui.h("p", "be-muted", "\u968F\u8868\u8FBE\u8BB0\u5F55\u4E0E\u5206\u6790\u540C\u6B65\u542F\u505C\uFF0C\u65E0\u9700\u5355\u72EC\u8BBE\u7F6E\u3002\u68C0\u67E5\u4EC5\u7ED9\u5EFA\u8BAE\uFF1B\u4E2D\u6027\u51B2\u7A81\u4FDD\u7559\u539F\u7A3F\uFF0C\u6A21\u578B\u7ED3\u5408\u5F53\u524D\u8BED\u5883\u51B3\u5B9A\uFF0C\u4E0D\u673A\u68B0\u7167\u6284\u3002\u53EF\u80FD\u7ED5\u8FC7\u68C0\u67E5\uFF0C\u4E0D\u80FD\u4FDD\u8BC1\u6BCF\u6B21\u90FD\u4F7F\u7528\u8868\u60C5\u3002"));
  const list = ui.h("div");
  box.append(list);
  parent.append(box);
  let busy = false;
  async function refresh() {
    if (busy || signal.aborted) return;
    busy = true;
    try {
      const s = await ctx.invoke("state");
      if (signal.aborted) return;
      summary.textContent = "\u8349\u7A3F\u68C0\u67E5 \xB7 " + (s.draftMode?.enabled ? "\u5DF2\u968F\u5206\u6790\u542F\u7528" : "\u5206\u6790\u6682\u505C\u65F6\u5173\u95ED");
      list.replaceChildren();
      const rows = s.draftMode?.history ?? [];
      if (!rows.length) list.append(ui.h("p", "be-muted", "\u6682\u65E0\u8349\u7A3F\u68C0\u67E5\u8BB0\u5F55\u3002"));
      const labels = { reviewed: "\u5DF2\u5206\u6790", needs_review: "\u5F85\u590D\u6838", unavailable: "\u672A\u5B8C\u6210", cancelled: "\u5DF2\u53D6\u6D88" };
      for (const r of rows.slice(-5).reverse()) list.append(ui.h("p", "be-muted", new Date(r.at).toLocaleTimeString() + " \xB7 " + (labels[r.status] ?? "\u672A\u5B8C\u6210") + " \xB7 " + (r.changed ? "\u5EFA\u8BAE\u8865\u5145\u8868\u60C5" : "\u4FDD\u7559\u539F\u7A3F") + " \xB7 " + (r.durationMs / 1e3).toFixed(1) + "\u79D2"));
    } catch {
      summary.textContent = "\u8349\u7A3F\u68C0\u67E5\u8BB0\u5F55\u6682\u4E0D\u53EF\u7528";
    } finally {
      busy = false;
    }
  }
  void refresh();
  ctx.interval(() => {
    void refresh();
  }, 5e3);
}

// packages/cortico-world-bubble-emotes/src/cloud-providers.ts
var CLOUD_PROVIDERS = {
  deepseek: { label: "DeepSeek", url: "https://api.deepseek.com/chat/completions", models: ["deepseek-flash", "deepseek-chat"] },
  openai: { label: "OpenAI", url: "https://api.openai.com/v1/chat/completions", models: ["gpt-4.1-mini", "gpt-4o-mini"] },
  qwen: { label: "\u901A\u4E49\u5343\u95EE\uFF08\u767E\u70BC\u5317\u4EAC\uFF09", url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", models: ["qwen-plus", "qwen-flash"] },
  moonshot: { label: "Kimi", url: "https://api.moonshot.cn/v1/chat/completions", models: ["kimi-k2.5", "kimi-k2-turbo-preview"] },
  glm: { label: "\u667A\u8C31 GLM", url: "https://open.bigmodel.cn/api/paas/v4/chat/completions", models: ["glm-4.7-flash", "glm-4.5-air"] }
};

// packages/cortico-world-bubble-emotes/web/cloud-controls.ts
function populateProviders(ui, provider) {
  for (const [v, p] of Object.entries(CLOUD_PROVIDERS)) {
    const o = ui.h("option", null, p.label);
    o.value = v;
    provider.append(o);
  }
}
function mountCloudModels(ui, parent, provider, model, signal, id) {
  const presets = ui.h("select");
  presets.setAttribute("aria-label", "\u5E38\u7528\u4E91\u7AEF\u6A21\u578B");
  const note = ui.h("p", "be-muted", "\u9009\u62E9\u5E38\u7528\u6A21\u578B\uFF0C\u6216\u5728\u6A21\u578B\u540D\u79F0\u4E2D\u624B\u52A8\u586B\u5199\u3002\u53EF\u7528\u6027\u53CA\u4EF7\u683C\u4EE5\u670D\u52A1\u5546\u8D26\u6237\u4E3A\u51C6\uFF0C\u4FDD\u5B58\u540E\u8BF7\u6D4B\u8BD5\u8FDE\u63A5\u3002");
  parent.append(presets, note);
  function refresh() {
    presets.replaceChildren();
    const options = CLOUD_PROVIDERS[provider.value]?.models ?? [];
    for (const value of ["", ...options]) {
      const o = ui.h("option", null, value || "\u5E38\u7528\u6A21\u578B / \u624B\u52A8\u586B\u5199");
      o.value = value;
      presets.append(o);
    }
    presets.value = options.includes(model.value) ? model.value : "";
  }
  provider.addEventListener("change", () => {
    const p = CLOUD_PROVIDERS[provider.value];
    model.value = p?.models[0] ?? "";
    refresh();
    model.dispatchEvent(new model.ownerDocument.defaultView.Event("input", { bubbles: true }));
  }, { signal });
  presets.addEventListener("change", () => {
    if (presets.value) {
      model.value = presets.value;
      model.dispatchEvent(new model.ownerDocument.defaultView.Event("input", { bubbles: true }));
    }
  }, { signal });
  model.addEventListener("input", refresh, { signal });
  refresh();
  return { refresh, presets, note };
}

// packages/cortico-world-bubble-emotes/web/styles.ts
var styles = `
.be-library .be-consent{display:flex;gap:10px;align-items:flex-start;margin:14px 0}.be-library .be-consent input{flex:none;margin-top:4px}
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

// packages/cortico-world-bubble-emotes/web/guide.ts
var guidePanel = { mount(ctx) {
  const { ui, root, signal } = ctx;
  root.classList.add("be-library");
  root.append(ui.h("style", null, styles));
  const page = ui.h("div", "be-page");
  root.append(page);
  page.append(ui.h("h2", null, "\u8BA9\u8868\u60C5\u966A\u4F60\u5F00\u59CB"), ui.h("p", "be-muted", "\u63A8\u8350\u914D\u7F6E\u5206\u6790 API \u5E76\u5F00\u542F\u8868\u8FBE\u8BB0\u5F55\u4E0E\u5206\u6790\uFF0C\u81EA\u52A8\u542F\u7528\u8349\u7A3F\u68C0\u67E5\u3002\u76F4\u63A5\u4F7F\u7528\u8868\u60C5\u5E93\u4E5F\u53EF\u4EE5\uFF0C\u4F46\u7F3A\u5C11\u5206\u6790\u4E0E\u68C0\u67E5\uFF0C\u4E0D\u80FD\u4FDD\u8BC1\u8868\u60C5\u4F7F\u7528\u7684\u7A33\u5B9A\u6027\uFF1B\u914D\u7F6E\u540E\u4ECD\u4E0D\u4FDD\u8BC1\u6BCF\u6B21\u91C7\u7EB3\u5EFA\u8BAE\u3002"));
  const status = ui.h("p", "be-habit", "\u6B63\u5728\u8BFB\u53D6\u72B6\u6001\u2026"), message = ui.h("p", "be-message");
  message.setAttribute("role", "status");
  message.hidden = true;
  page.append(status, message);
  const choices = ui.h("section", "be-card"), basic = ui.button("\u76F4\u63A5\u4F7F\u7528\u8868\u60C5\u5E93"), analysis = ui.button("\u8BBE\u7F6E\u5206\u6790\u4E0E\u53CD\u9988", { variant: "primary" });
  choices.append(ui.h("h3", null, "\u9009\u62E9\u9002\u5408\u4F60\u7684\u65B9\u5F0F"), ui.h("p", "be-muted", "\u76F4\u63A5\u4F7F\u7528\uFF1A\u65E0\u9700\u989D\u5916API\u6216\u6A21\u578B\u3002\u53EF\u5728\u300C\u8868\u60C5\u5E93\u300D\u641C\u7D22\u3001\u542F\u505C\u8868\u60C5\u3002"), basic, ui.h("p", "be-muted", "\u63A8\u8350\uFF1A\u914D\u7F6E API \u540E\uFF0C\u68C0\u67E5\u53D1\u9001\u524D\u8349\u7A3F\u5E76\u5206\u6790\u65B0\u7684\u53D1\u8A00\uFF0C\u5E2E\u52A9\u51CF\u5C11\u6F0F\u7528\u3002"), analysis);
  page.append(choices);
  mountDraftStatus(ctx, page);
  const setup = ui.h("section", "be-card");
  setup.hidden = true;
  page.append(setup);
  setup.append(ui.h("h3", null, "1 \xB7 \u9009\u62E9\u5206\u6790\u65B9\u5F0F"));
  const backend = ui.h("select"), provider = ui.h("select"), model = ui.h("input"), key = ui.h("input"), detect = ui.button("\u68C0\u6D4B\u672C\u673A\u6A21\u578B");
  for (const [v, n] of [["cloud", "\u4E91\u7AEFAPI"], ["ollama", "\u672C\u673AOllama"]]) {
    const o = ui.h("option", null, n);
    o.value = v;
    backend.append(o);
  }
  populateProviders(ui, provider);
  backend.setAttribute("aria-label", "\u5206\u6790\u65B9\u5F0F");
  provider.setAttribute("aria-label", "\u4E91\u7AEF\u670D\u52A1");
  model.setAttribute("aria-label", "\u5206\u6790\u6A21\u578B");
  model.placeholder = "\u6A21\u578B\u540D\u79F0";
  key.type = "password";
  key.autocomplete = "off";
  key.placeholder = "API Key\uFF0C\u5DF2\u4FDD\u5B58\u65F6\u53EF\u7559\u7A7A";
  key.setAttribute("aria-label", "API Key");
  const field = (label, node) => {
    const el = ui.h("label", "be-field");
    el.append(ui.h("span", null, label), node);
    return el;
  };
  const providerField = field("\u4E91\u7AEF\u670D\u52A1", provider), keyField = field("API Key", key);
  setup.append(field("\u5206\u6790\u65B9\u5F0F", backend), providerField, field("\u6A21\u578B\u540D\u79F0", model), keyField, detect, ui.h("p", "be-muted", "\u4E91\u7AEF\u9700\u72EC\u7ACBAPI Key\u548CAPI\u989D\u5EA6\uFF0C\u4E0D\u81EA\u52A8\u590D\u7528\u804A\u5929\u8FDE\u63A5\uFF0CChatGPT\u8BA2\u9605\u4E0D\u4EE3\u66FFAPI\u989D\u5EA6\u3002\u672C\u673AOllama\u9700\u5148\u8FD0\u884C\u670D\u52A1\u5E76\u5B89\u88C5\u6A21\u578B\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u4E0B\u8F7D\u3002"));
  const cloudChoices = ui.h("div");
  setup.append(cloudChoices);
  const cloudPicker = mountCloudModels(ui, cloudChoices, provider, model, signal, "guide");
  const localStatus = ui.h("p", "be-muted"), localModels = ui.h("select");
  localModels.setAttribute("aria-label", "\u68C0\u6D4B\u5230\u7684\u672C\u673A\u6A21\u578B");
  localModels.hidden = true;
  setup.append(localStatus, localModels);
  localModels.addEventListener("change", () => {
    model.value = localModels.value;
    edited();
  }, { signal });
  const save = ui.button("\u4FDD\u5B58\u8BBE\u7F6E\uFF08\u6682\u505C\u5206\u6790\uFF09"), test = ui.button("\u6D4B\u8BD5\u5DF2\u4FDD\u5B58\u7684\u8FDE\u63A5");
  setup.append(ui.h("h3", null, "2 \xB7 \u4FDD\u5B58\u5E76\u6D4B\u8BD5"), save, test, ui.h("p", "be-muted", "\u6D4B\u8BD5\u53EA\u53D1\u9001\u56FA\u5B9A\u6D4B\u8BD5\u6587\u672C\uFF0C\u4E0D\u8BFB\u53D6\u804A\u5929\uFF1B\u4E91\u7AEF\u6D4B\u8BD5\u4E5F\u53EF\u80FD\u4EA7\u751FAPI\u7528\u91CF\u3002"));
  const consent = ui.h("input");
  consent.type = "checkbox";
  const consentLabel = ui.h("label", "be-consent");
  consentLabel.append(consent, ui.h("span", null, "\u6211\u4E86\u89E3\uFF1A\u5F00\u542F\u540E\u4EC5\u6536\u96C6\u65B0\u7684\u684C\u5BA0\u53D1\u8A00\uFF0C\u6700\u591A100\u6761\u672C\u5730\u660E\u6587\u8BB0\u5F55\uFF1B\u539F\u8BDD\u3001\u53D1\u9001\u524D\u8349\u7A3F\u3001\u5F53\u524D\u8BED\u5883\u4E0E\u8868\u60C5\u5E93\u6458\u8981\u4EA4\u7ED9\u6240\u9009\u6A21\u578B\uFF0C\u4E91\u7AEF\u53EF\u80FD\u6536\u8D39\u5E76\u589E\u52A0\u7B49\u5F85\u3002\u5F00\u542F\u5206\u6790\u5373\u540C\u65F6\u542F\u7528\u8349\u7A3F\u68C0\u67E5\u3002\u65E0\u9700\u5BFC\u5165\u6216\u5F00\u542F\u5BBF\u4E3B\u5386\u53F2\u804A\u5929\u8BB0\u5F55\u3002"));
  const start = ui.button("\u5F00\u542F\u5206\u6790\u4E0E\u53CD\u9988", { variant: "primary" }), pause = ui.button("\u6682\u505C\u5206\u6790");
  start.disabled = true;
  setup.append(ui.h("h3", null, "3 \xB7 \u786E\u8BA4\u540E\u5F00\u542F"), consentLabel, start, pause, ui.h("p", "be-muted", "\u53EF\u968F\u65F6\u5728\u300C\u8868\u8FBE\u8BB0\u5F55\u300D\u6682\u505C\u3001\u6E05\u7A7A\u6216\u8DF3\u8FC7\u3002\u5206\u6790\u662F\u4E8B\u540E\u8BC4\u4EF7\uFF0C\u4E0D\u662F\u684C\u5BA0\u7684\u5185\u90E8\u601D\u8003\uFF1B\u4E3B\u6A21\u578B\u53EF\u80FD\u4E0D\u91C7\u7EB3\u5EFA\u8BAE\u3002"));
  let tested = false, dirty = false;
  function notify(text, bad = false) {
    if (signal.aborted) return;
    message.hidden = false;
    message.textContent = text;
    message.classList.toggle("be-error", bad);
  }
  function fail(e) {
    notify(String(e.message ?? e), true);
  }
  function gate() {
    start.disabled = !tested || dirty || !consent.checked;
    test.disabled = dirty;
  }
  function visible() {
    providerField.hidden = keyField.hidden = backend.value !== "cloud";
    detect.hidden = backend.value !== "ollama";
    cloudChoices.hidden = backend.value !== "cloud";
    localStatus.hidden = backend.value !== "ollama";
    localModels.hidden = backend.value !== "ollama" || !localModels.options.length;
  }
  function edited() {
    dirty = true;
    tested = false;
    gate();
    visible();
  }
  for (const node of [backend, provider, model, key]) node.addEventListener("input", edited, { signal });
  backend.addEventListener("change", () => {
    model.value = backend.value === "cloud" && provider.value === "deepseek" ? "deepseek-flash" : "";
    edited();
  }, { signal });
  provider.addEventListener("change", () => {
    key.value = "";
    edited();
  }, { signal });
  consent.addEventListener("change", gate, { signal });
  async function refresh(initial = false) {
    const data = await ctx.invoke("state");
    if (signal.aborted) return;
    status.textContent = data.storageError || data.cloud.error ? "\u914D\u7F6E\u5F02\u5E38 \xB7 " + (data.storageError || data.cloud.error) : data.settings.enabled ? "\u5206\u6790\u4E0E\u8349\u7A3F\u68C0\u67E5\u6B63\u5728\u8FD0\u884C \xB7 " + (data.settings.backend === "cloud" ? "\u4E91\u7AEFAPI" : "\u672C\u673AOllama") : "\u5206\u6790\u4E0E\u53CD\u9988\u672A\u5F00\u542F \xB7 \u8868\u60C5\u5E93\u53EF\u76F4\u63A5\u4F7F\u7528";
    if (initial) {
      backend.value = data.settings.backend;
      provider.value = data.cloud.provider;
      model.value = data.settings.backend === "cloud" ? data.cloud.model : data.settings.model;
      setup.hidden = data.guideChoice !== "analysis" && !data.settings.enabled;
      cloudPicker.refresh();
      visible();
    }
    pause.disabled = !data.settings.enabled;
  }
  basic.addEventListener("click", () => {
    void ctx.invoke("guide", ["basic"]).then(() => {
      setup.hidden = true;
      notify("\u5DF2\u9009\u62E9\u57FA\u7840\u4F7F\u7528\uFF0C\u5206\u6790\u5DF2\u6682\u505C\u3002\u70B9\u51FB\u4E0A\u65B9\u300C\u8868\u60C5\u5E93\u300D\u7BA1\u7406\u8868\u60C5\u3002");
      return refresh();
    }).catch(fail);
  }, { signal });
  analysis.addEventListener("click", () => {
    void ctx.invoke("guide", ["analysis"]).then(() => {
      setup.hidden = false;
      return refresh();
    }).catch(fail);
  }, { signal });
  save.addEventListener("click", () => {
    save.disabled = true;
    tested = false;
    void (async () => {
      if (backend.value === "cloud") await ctx.invoke("cloud", [{ provider: provider.value, model: model.value, apiKey: key.value }]);
      await ctx.invoke("configure", [{ enabled: false, backend: backend.value, model: backend.value === "ollama" ? model.value : "" }]);
      key.value = "";
      dirty = false;
      gate();
      notify("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u5206\u6790\u4FDD\u6301\u6682\u505C\u3002\u4E0B\u4E00\u6B65\u6D4B\u8BD5\u8FDE\u63A5\u3002");
      await refresh();
    })().catch(fail).finally(() => save.disabled = false);
  }, { signal });
  test.addEventListener("click", () => {
    test.disabled = true;
    void ctx.invoke("test").then((r) => {
      tested = r.ok;
      notify(r.message, !r.ok);
      gate();
    }).catch(fail).finally(() => {
      test.disabled = dirty;
    });
  }, { signal });
  detect.addEventListener("click", () => {
    detect.disabled = true;
    detect.textContent = "\u6B63\u5728\u68C0\u6D4B\u2026";
    localStatus.textContent = "\u6B63\u5728\u8FDE\u63A5\u672C\u673A Ollama\uFF0C\u8BF7\u7A0D\u5019\u2026";
    void ctx.invoke("models").then((r) => {
      if (signal.aborted) return;
      localModels.replaceChildren();
      for (const name of r.models ?? []) {
        const o = ui.h("option", null, name);
        o.value = name;
        localModels.append(o);
      }
      localStatus.textContent = r.error || ((r.models ?? []).length ? "\u68C0\u6D4B\u5230 " + r.models.length + " \u4E2A\u6A21\u578B\uFF0C\u8BF7\u9009\u62E9\u540E\u4FDD\u5B58\u3002" : "Ollama \u5DF2\u8FDE\u63A5\uFF0C\u4F46\u6CA1\u6709\u5DF2\u5B89\u88C5\u7684\u6A21\u578B\uFF1B\u8BF7\u5148\u5728 Ollama \u5B89\u88C5\u6A21\u578B\u540E\u91CD\u65B0\u68C0\u6D4B\u3002");
      if (r.models?.length) {
        model.value = r.models.includes(model.value) ? model.value : r.models[0];
        localModels.value = model.value;
        edited();
      }
      visible();
    }).catch((e) => {
      localStatus.textContent = "\u68C0\u6D4B\u5931\u8D25\uFF0C\u8BF7\u786E\u8BA4 Ollama \u6B63\u5728\u8FD0\u884C\u3002";
      fail(e);
    }).finally(() => {
      detect.disabled = false;
      detect.textContent = "\u68C0\u6D4B\u672C\u673A\u6A21\u578B";
    });
  }, { signal });
  start.addEventListener("click", () => {
    start.disabled = true;
    void ctx.invoke("enableGuided", [consent.checked]).then(() => {
      tested = false;
      notify("\u5DF2\u5F00\u542F\u8868\u8FBE\u5206\u6790\u4E0E\u8349\u7A3F\u68C0\u67E5\uFF0C\u7B49\u5F85\u684C\u5BA0\u4E0B\u4E00\u53E5\u65B0\u53D1\u8A00\u3002\u7ED3\u679C\u8BF7\u5230\u300C\u8868\u8FBE\u8BB0\u5F55\u300D\u67E5\u770B\u3002");
      return refresh();
    }).catch(fail).finally(gate);
  }, { signal });
  pause.addEventListener("click", () => {
    void ctx.invoke("state").then((s) => ctx.invoke("configure", [{ ...s.settings, enabled: false }])).then(() => refresh()).catch(fail);
  }, { signal });
  visible();
  void refresh(true).catch(fail);
  ctx.interval(() => {
    void refresh().catch(fail);
  }, 5e3);
} };

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
  page.append(ui.h("h2", null, "\u8868\u8FBE\u8BB0\u5F55"), ui.h("p", "be-muted", "\u770B\u770B\u4E00\u53E5\u8BDD\u4F20\u8FBE\u4E86\u4EC0\u4E48\u5FC3\u60C5\uFF0C\u8868\u60C5\u7528\u5F97\u662F\u5426\u5408\u9002\u3002\u5F00\u542F\u5206\u6790\u540E\u81EA\u52A8\u542F\u7528\u53D1\u9001\u524D\u8349\u7A3F\u68C0\u67E5\uFF1B\u5206\u6790\u4EC5\u4F9B\u5EFA\u8BAE\uFF0C\u4E0D\u662F\u684C\u5BA0\u539F\u59CB\u51B3\u7B56\u7406\u7531\u3002"));
  mountDraftStatus(ctx, page);
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
  populateProviders(ui, provider);
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
  page.append(cloud, ui.h("p", "be-muted", "\u4E91\u7AEF\u5206\u6790\u9700\u5355\u72EC\u586B\u5199\u670D\u52A1\u5546 API Key\uFF0CChatGPT \u8BA2\u9605\u4E0D\u80FD\u4EE3\u66FF API \u989D\u5EA6\u3002\u5F00\u542F\u5206\u6790\u5373\u540C\u6B65\u542F\u7528\u8349\u7A3F\u68C0\u67E5\uFF0C\u5C06\u628A\u65B0\u53D1\u8A00\u3001\u53D1\u9001\u524D\u8349\u7A3F\u3001\u5F53\u524D\u8BED\u5883\u548C\u8868\u60C5\u5E93\u6458\u8981\u4EA4\u7ED9\u670D\u52A1\u5546\uFF0C\u53EF\u80FD\u4EA7\u751F API \u8D39\u7528\u4E0E\u7B49\u5F85\u3002\u5BC6\u94A5\u7531\u5BBF\u4E3B\u90E8\u7F72 .env \u7BA1\u7406\uFF0C\u4E0D\u56DE\u663E\uFF1B\u505C\u7528\u4E0D\u4F1A\u64A4\u9500\u670D\u52A1\u5546\u5BC6\u94A5\uFF1B\u8BB0\u5F55\u9ED8\u8BA4\u5173\u95ED\u3002"));
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
  const cloudPicker = mountCloudModels(ui, cloud, provider, cloudModel, signal, "records");
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
        cloudPicker.refresh();
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
      status.textContent = (settings.enabled ? "\u6B63\u5728\u8BB0\u5F55 \xB7 \u8349\u7A3F\u68C0\u67E5\u5DF2\u542F\u7528" : "\u5DF2\u6682\u505C") + " \xB7 " + data.rows.length + " / 100 \u6761" + (settings.backend === "cloud" && !data.cloud.keyConfigured ? " \xB7 \u8BF7\u5148\u914D\u7F6E\u4E91\u7AEF API Key" : "");
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
    notify("\u6B63\u5728\u68C0\u6D4B\u672C\u673A Ollama \u6A21\u578B\uFF0C\u8BF7\u7A0D\u5019\u2026");
    void ctx.invoke("models").then((data) => {
      if (signal.aborted) return;
      model.replaceChildren(placeholder);
      for (const name of data.models) {
        const o = ui.h("option", null, name);
        o.value = name;
        model.append(o);
      }
      notify(data.error || (data.models.length ? "\u5DF2\u68C0\u6D4B\u5230\u6A21\u578B\uFF0C\u8BF7\u9009\u62E9\u540E\u5F00\u542F\uFF1B\u5DF2\u5F00\u542F\u65F6\u53EF\u6682\u505C\u540E\u5207\u6362\u3002" : "Ollama \u5DF2\u8FDE\u63A5\u4F46\u672A\u5B89\u88C5\u6A21\u578B\uFF0C\u8BF7\u5148\u5B89\u88C5\u540E\u91CD\u65B0\u68C0\u6D4B\u3002"), !!data.error);
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
var bundle = { panels: { guide: guidePanel, records: recordsPanel, library: { mount(ctx) {
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
