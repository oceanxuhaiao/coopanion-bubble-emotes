// packages/cortico-world-bubble-emotes/web/styles.ts
var styles = `
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

// packages/cortico-world-bubble-emotes/web/emoji-art.js
var huggingSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><path fill="#dce9ff" d="M40 74C25 65 7 52 7 32a18 18 0 0 1 33-9 18 18 0 0 1 33 9c0 20-18 33-33 42Z"/><circle cx="28" cy="24" r="12" fill="#4389db"/><circle cx="52" cy="24" r="12" fill="#69b9ed"/><path fill="#4389db" d="M11 50c0-12 7-20 17-20 11 0 18 9 18 22v16H25c-8 0-14-7-14-18Z"/><path fill="#69b9ed" d="M69 50c0-12-7-20-17-20-11 0-18 9-18 22v16h21c8 0 14-7 14-18Z"/><path d="M20 43c2 12 17 16 33 9" fill="none" stroke="#246bbb" stroke-width="11" stroke-linecap="round"/><path d="M60 42c-2 12-17 20-33 17" fill="none" stroke="#8ad1f5" stroke-width="11" stroke-linecap="round"/></svg>';
var huggingSrc = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(huggingSvg);
function emojiArtwork(text) {
  return /^🫂\ufe0f?$/u.test(text) ? huggingSrc : void 0;
}
function renderEmojiText(root, text) {
  const doc = root.ownerDocument, nodes = [];
  for (const part of text.split(/(🫂\ufe0f?)/u)) {
    const src = emojiArtwork(part);
    if (!src) {
      nodes.push(doc.createTextNode(part));
      continue;
    }
    const image = doc.createElement("img");
    image.src = src;
    image.alt = part;
    image.title = "\u62E5\u62B1";
    image.className = "emoji-art";
    image.style.cssText = "display:inline-block;width:1.15em;height:1.15em;vertical-align:-0.15em;object-fit:contain;";
    nodes.push(image);
  }
  root.replaceChildren(...nodes);
}

// packages/cortico-world-bubble-emotes/web/client.ts
var emotionLabels = {
  neutral: "\u4E2D\u6027",
  calm: "\u5E73\u9759",
  joy: "\u5F00\u5FC3",
  amusement: "\u597D\u7B11",
  excitement: "\u6FC0\u52A8",
  celebration: "\u5E86\u795D",
  affection: "\u559C\u7231",
  playfulness: "\u4FCF\u76AE",
  shyness: "\u5BB3\u7F9E",
  embarrassment: "\u5C34\u5C2C",
  surprise: "\u60CA\u8BB6",
  thinking: "\u601D\u8003",
  confusion: "\u56F0\u60D1",
  skepticism: "\u6000\u7591",
  worry: "\u62C5\u5FC3",
  fear: "\u5BB3\u6015",
  sadness: "\u60B2\u4F24",
  grief: "\u60B2\u75DB",
  disappointment: "\u5931\u843D",
  comfort: "\u5B89\u6170",
  apology: "\u9053\u6B49",
  anger: "\u751F\u6C14",
  frustration: "\u70E6\u607C",
  determination: "\u575A\u5B9A",
  pride: "\u81EA\u8C6A",
  gratitude: "\u611F\u8C22",
  tiredness: "\u75B2\u60EB",
  sleepy: "\u56F0\u5026",
  disgust: "\u5ACC\u5F03",
  illness: "\u4E0D\u8212\u670D"
};
var bundle = { panels: { library: { mount(ctx) {
  const { ui, root, signal } = ctx;
  root.classList.add("be-library");
  root.append(ui.h("style", null, styles));
  const page = ui.h("div", "be-page");
  root.append(page);
  const header = ui.h("div", "be-header"), intro = ui.h("div");
  intro.append(ui.h("h2", null, "\u8BA9\u5FC3\u60C5\uFF0C\u591A\u4E00\u79CD\u8868\u8FBE"), ui.h("p", "be-muted", "\u7BA1\u7406\u684C\u5BA0\u4F1A\u4F7F\u7528\u7684\u8868\u60C5\uFF0C\u4E5F\u53EF\u4EE5\u6DFB\u52A0\u81EA\u5DF1\u7684\u8868\u60C5\u5305\u3002"));
  const add = ui.button("\uFF0B \u6DFB\u52A0\u8868\u60C5\u5305", { variant: "primary" });
  header.append(intro, add);
  page.append(header);
  const habit = ui.h("p", "be-habit", "\u6B63\u5728\u8BFB\u53D6\u4E60\u60EF\u8BBE\u7F6E\u2026");
  habit.setAttribute("role", "status");
  page.append(habit);
  const capability = ui.h("p", "be-warning");
  capability.hidden = true;
  page.append(capability);
  const msg = ui.h("p", "be-message");
  msg.setAttribute("role", "status");
  msg.setAttribute("aria-live", "polite");
  msg.hidden = true;
  const notify = (text, error = false) => {
    if (signal.aborted) return;
    msg.textContent = text;
    msg.hidden = false;
    msg.classList.toggle("be-error", error);
  };
  const fail = (error) => notify("\u64CD\u4F5C\u672A\u5B8C\u6210\uFF1A" + String(error.message ?? error), true);
  const diagnostics = ui.h("details", "be-diagnostics"), recent = ui.h("p", "be-muted");
  diagnostics.append(ui.h("summary", null, "\u8FD0\u884C\u8BE6\u60C5"), recent);
  let habitLoading = false;
  async function refreshHabit() {
    if (habitLoading || signal.aborted) return;
    habitLoading = true;
    try {
      const response = await fetch("/api/webui/providers/world%3Adesktop-pet/panels/pet/state", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: '{"args":[]}', signal });
      if (!response.ok) throw new Error("unavailable");
      const state = await response.json();
      if (signal.aborted) return;
      capability.hidden = state.presentationCapabilities?.schema === 1;
      capability.textContent = capability.hidden ? "" : "\u5F53\u524D\u4E3B\u7A0B\u5E8F\u5C1A\u4E0D\u652F\u6301\u5934\u9876\u8868\u60C5\u6C14\u6CE1\u3002\u8868\u60C5\u5E93\u4ECD\u53EF\u7BA1\u7406\uFF1B\u8BF7\u6309\u5B89\u88C5\u8BF4\u660E\u66F4\u65B0\u4E3B\u7A0B\u5E8F\u7684\u6C14\u6CE1\u7EC4\u4EF6\u3002";
      const labels = { none: "\u5B89\u9759", poke: "\u9ED8\u8BA4", all: "\u79EF\u6781", custom: "\u81EA\u5B9A\u4E49" };
      const mode = state.wake?.wakeOn;
      if (!labels[mode]) throw new Error("unknown");
      habit.textContent = "\u8868\u8FBE\u504F\u597D\u8DDF\u968F\u300C\u4E60\u60EF\u300D \xB7 " + labels[mode] + "\u6A21\u5F0F";
      const statuses = { shown: "\u5DF2\u663E\u793A", cancelled: "\u5DF2\u53D6\u6D88", ended: "\u5DF2\u7ED3\u675F", rejected: "\u672A\u663E\u793A", legacy_queued: "\u666E\u901A\u56DE\u590D\u5DF2\u6392\u961F", attachments_only: "\u4EC5\u5728\u5BF9\u8BDD\u9875\u663E\u793A", validating: "\u6B63\u5728\u786E\u8BA4\u8EAB\u4F53\u72B6\u6001" };
      const reasons = { sleeping: "\u7761\u7720\u672A\u83B7\u5524\u9192\u8BB8\u53EF", state_unknown: "\u8EAB\u4F53\u72B6\u6001\u672A\u77E5", "state-unknown": "\u8EAB\u4F53\u72B6\u6001\u672A\u77E5", "body-interrupted": "\u8EAB\u4F53\u4E92\u52A8\u4E2D", "figure-changed": "\u5DF2\u6362\u5F62\u8C61", "body-changed": "\u8EAB\u4F53\u72B6\u6001\u6539\u53D8", "transition-timeout": "\u52A8\u4F5C\u8FC7\u6E21\u8D85\u65F6", display_timeout: "\u663E\u793A\u8D85\u65F6", aborted: "\u8BF7\u6C42\u53D6\u6D88", not_selected: "\u672A\u9009\u62E9\u8868\u60C5", closed: "\u6C14\u6CE1\u5DF2\u5173\u95ED" };
      const history = state.expression?.recent;
      recent.textContent = Array.isArray(history) && history.length ? history.slice(-3).map((e) => (statuses[e.status] ?? "\u72B6\u6001\u5F85\u786E\u8BA4") + (e.reason ? "\uFF08" + (reasons[e.reason] ?? "\u6682\u65E0\u8BE6\u7EC6\u8BF4\u660E") + "\uFF09" : "")).join("\uFF1B") : "\u6682\u65E0\u8FD1\u671F\u663E\u793A\u8BB0\u5F55\u3002";
    } catch {
      if (!signal.aborted) {
        habit.textContent = "\u4E60\u60EF\u72B6\u6001\u6682\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002";
        recent.textContent = "\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u8FD0\u884C\u8BE6\u60C5\u3002";
      }
    } finally {
      habitLoading = false;
    }
  }
  void refreshHabit();
  ctx.interval(() => {
    void refreshHabit();
  }, 5e3);
  function field(label, input) {
    const wrap = ui.h("label", "be-field");
    wrap.append(ui.h("span", null, label), input);
    return wrap;
  }
  function textInput(label, placeholder = "", value = "") {
    const input = ui.h("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.value = value;
    return { input, el: field(label, input) };
  }
  function emotionSelect(value) {
    const select = ui.h("select");
    for (const [key, label] of Object.entries(emotionLabels)) {
      const option = ui.h("option", null, label);
      option.value = key;
      select.append(option);
    }
    select.value = value;
    return select;
  }
  const importPanel = ui.h("details", "be-import");
  const importSummary = ui.h("summary", null, "\u6DFB\u52A0\u81EA\u5DF1\u7684\u8868\u60C5\u5305");
  importPanel.append(importSummary);
  const importForm = ui.h("form", "be-form");
  const file = ui.h("input");
  file.type = "file";
  file.accept = "image/png";
  const name = textInput("\u540D\u79F0", "\u4F8B\u5982\uFF1A\u62B1\u62B1\u4F60");
  name.input.required = true;
  name.input.maxLength = 80;
  const description = ui.h("textarea");
  description.rows = 2;
  description.required = true;
  description.maxLength = 500;
  description.placeholder = "\u63CF\u8FF0\u753B\u9762\u3001\u542B\u4E49\u53CA\u56FE\u4E2D\u6587\u5B57\uFF0C\u5E2E\u52A9\u684C\u5BA0\u6B63\u786E\u4F7F\u7528";
  const emotion = emotionSelect("comfort");
  const source = textInput("\u6765\u6E90", "\u4F8B\u5982\uFF1A\u81EA\u5DF1\u7ED8\u5236\uFF0C\u6216\u539F\u4F5C\u8005\u7684\u9875\u9762");
  source.input.required = true;
  source.input.maxLength = 2e3;
  const license = textInput("\u4F7F\u7528\u8BB8\u53EF", "\u4F8B\u5982\uFF1A\u672C\u4EBA\u539F\u521B\uFF0C\u5141\u8BB8\u4F7F\u7528");
  license.input.required = true;
  license.input.maxLength = 2e3;
  const upload = ui.button("\u5BFC\u5165\uFF0C\u7A0D\u540E\u786E\u8BA4", { variant: "primary" });
  upload.type = "submit";
  const cancel = ui.button("\u6536\u8D77");
  cancel.type = "button";
  cancel.addEventListener("click", () => {
    importPanel.open = false;
    add.focus();
  }, { signal });
  const importActions = ui.h("div", "be-actions");
  importActions.append(upload, cancel);
  importForm.append(ui.h("p", "be-muted", "\u652F\u6301 PNG\uFF0C\u6700\u5927 2 MB\u3002\u5BFC\u5165\u540E\u9700\u5148\u67E5\u770B\u56FE\u7247\u5E76\u786E\u8BA4\u5185\u5BB9\uFF0C\u684C\u5BA0\u624D\u4F1A\u4F7F\u7528\u3002"), field("\u9009\u62E9\u56FE\u7247", file), name.el, field("\u542B\u4E49\u4E0E\u56FE\u4E2D\u6587\u5B57", description), field("\u9002\u5408\u8868\u8FBE", emotion), source.el, license.el, importActions);
  importPanel.append(importForm);
  page.append(importPanel, msg);
  add.addEventListener("click", () => {
    importPanel.open = true;
    file.focus();
  }, { signal });
  const toolbar = ui.h("div", "be-toolbar"), filter = ui.h("input", "be-search");
  filter.type = "search";
  filter.placeholder = "\u641C\u7D22\u8868\u60C5\u3001\u5FC3\u60C5\u6216\u542B\u4E49";
  filter.setAttribute("aria-label", "\u641C\u7D22\u8868\u60C5");
  const tabs = ui.h("div", "be-tabs");
  tabs.setAttribute("role", "group");
  tabs.setAttribute("aria-label", "\u8868\u60C5\u5206\u7C7B");
  let category = "all";
  const tabButtons = [];
  const count = ui.h("p", "be-count"), list = ui.h("div", "be-grid"), empty = ui.h("div", "be-empty", "\u6CA1\u6709\u627E\u5230\u8868\u60C5\uFF0C\u8BD5\u8BD5\u5176\u4ED6\u5173\u952E\u8BCD\u6216\u5206\u7C7B\u3002");
  empty.hidden = true;
  const filterRows = () => {
    let visible = 0;
    for (const row of Array.from(list.children)) {
      row.hidden = !(row.dataset.search ?? "").includes(filter.value.trim().toLowerCase()) || !(category === "all" || row.dataset.kind === category || category === "pending" && row.dataset.reviewed === "false");
      if (!row.hidden) visible++;
    }
    count.textContent = `\u5171 ${list.children.length} \u4E2A\u8868\u60C5 \xB7 \u5F53\u524D\u663E\u793A ${visible} \u4E2A`;
    empty.hidden = visible > 0;
    for (const { key, button } of tabButtons) button.setAttribute("aria-pressed", String(key === category));
  };
  for (const [key, label] of [["all", "\u5168\u90E8"], ["emoji", "\u57FA\u7840\u8868\u60C5"], ["sticker", "\u8868\u60C5\u5305"], ["pending", "\u5F85\u786E\u8BA4"]]) {
    const button = ui.button(label);
    button.addEventListener("click", () => {
      category = key;
      filterRows();
    }, { signal });
    tabs.append(button);
    tabButtons.push({ key, button });
  }
  filter.addEventListener("input", filterRows, { signal });
  toolbar.append(filter, tabs);
  page.append(toolbar, count, list, empty, diagnostics);
  async function update(id, patch) {
    const current = (await ctx.invoke("list")).find((e) => e.id === id);
    if (!current) throw new Error("\u8868\u60C5\u5DF2\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5");
    await ctx.invoke("update", [{ ...current, ...patch }]);
    await refresh();
  }
  async function refresh() {
    const entries = await ctx.invoke("list");
    if (signal.aborted) return;
    list.replaceChildren();
    for (const e of entries) {
      const row = ui.h("section", "be-card");
      row.dataset.id = e.id;
      row.dataset.kind = e.kind;
      row.dataset.reviewed = String(e.reviewed);
      row.dataset.search = [e.id, e.description, e.usage, ...e.aliases ?? [], ...e.emotions.map((k) => emotionLabels[k] ?? k)].join(" ").toLowerCase();
      const visual = ui.h("div", "be-visual", e.kind === "emoji" ? e.text : "\u25A7");
      if (e.kind === "emoji") renderEmojiText(visual, e.text ?? "");
      visual.setAttribute("aria-label", e.kind === "emoji" ? "\u8868\u60C5" : "\u8868\u60C5\u5305\u9884\u89C8");
      const title = ui.h("h3", null, e.aliases?.[0] || e.id), status = ui.h("span", e.reviewed ? "be-badge" : "be-badge be-pending", e.reviewed ? e.enabled ? "\u5DF2\u542F\u7528" : "\u5DF2\u505C\u7528" : "\u5F85\u786E\u8BA4");
      const heading = ui.h("div", "be-card-heading");
      heading.append(title, status);
      const meaning = ui.h("p", "be-meaning", e.usage ?? e.description);
      const actions = ui.h("div", "be-actions"), toggle = ui.button(e.enabled ? "\u505C\u7528" : "\u542F\u7528");
      toggle.setAttribute("aria-label", (e.enabled ? "\u505C\u7528" : "\u542F\u7528") + " " + (e.aliases?.[0] || e.id));
      toggle.disabled = !e.reviewed;
      toggle.addEventListener("click", () => {
        toggle.disabled = true;
        void update(e.id, { enabled: !e.enabled }).then(() => notify("\u5DF2\u66F4\u65B0\u8868\u60C5\u72B6\u6001")).catch(fail).finally(() => {
          if (!signal.aborted) toggle.disabled = !e.reviewed;
        });
      }, { signal });
      const details = ui.h("details", "be-edit"), summary = ui.h("summary", null, e.reviewed ? "\u4F7F\u7528\u8BF4\u660E\u4E0E\u7F16\u8F91" : "\u67E5\u770B\u5E76\u786E\u8BA4");
      details.append(summary);
      const editor = ui.h("form", "be-form");
      if (e.example) editor.append(ui.h("p", "be-example", "\u4F8B\u5982\uFF1A" + e.example));
      if (e.avoid?.length) editor.append(ui.h("p", "be-muted", "\u4E0D\u9002\u5408\uFF1A" + e.avoid.join(" ")));
      const label = textInput("\u540D\u79F0", "", e.aliases?.[0] || e.id);
      label.input.required = true;
      label.input.maxLength = 80;
      const desc = ui.h("textarea");
      desc.rows = 3;
      desc.value = e.description;
      desc.required = true;
      desc.maxLength = 500;
      const usage = ui.h("textarea");
      usage.rows = 2;
      usage.value = e.usage ?? "";
      usage.maxLength = 500;
      editor.append(label.el, field("\u542B\u4E49\u4E0E\u56FE\u4E2D\u6587\u5B57", desc), field("\u9002\u5408\u4EC0\u4E48\u65F6\u5019\u4F7F\u7528", usage));
      const advanced = ui.h("details", "be-advanced");
      advanced.append(ui.h("summary", null, "\u66F4\u591A\u8BBE\u7F6E"));
      const emotions = ui.h("div", "be-emotions");
      emotions.setAttribute("role", "group");
      emotions.setAttribute("aria-label", "\u9002\u5408\u8868\u8FBE\u7684\u5FC3\u60C5");
      const choices = [];
      for (const [key, text] of Object.entries(emotionLabels)) {
        const input = ui.h("input");
        input.type = "checkbox";
        input.checked = e.emotions.includes(key);
        choices.push({ key, input });
        const choice = ui.h("label");
        choice.append(input, ui.h("span", null, text));
        emotions.append(choice);
      }
      const exclusions = ui.h("details");
      exclusions.append(ui.h("summary", null, "\u4E0D\u9002\u5408\u8868\u8FBE\u7684\u5FC3\u60C5"));
      const forbiddenGroup = ui.h("div", "be-emotions"), forbiddenChoices = [];
      for (const [key, text] of Object.entries(emotionLabels)) {
        const input = ui.h("input");
        input.type = "checkbox";
        input.checked = e.forbidden.includes(key);
        forbiddenChoices.push({ key, input });
        const choice = ui.h("label");
        choice.append(input, ui.h("span", null, text));
        forbiddenGroup.append(choice);
      }
      exclusions.append(forbiddenGroup);
      const strength = ui.h("input");
      strength.type = "range";
      strength.min = "0";
      strength.max = "1";
      strength.step = "any";
      strength.value = String(e.intensity);
      strength.setAttribute("aria-label", "\u8868\u8FBE\u5F3A\u5EA6");
      const origin = textInput("\u6765\u6E90", "", e.source), permission = textInput("\u4F7F\u7528\u8BB8\u53EF", "", e.license);
      origin.input.required = true;
      permission.input.required = true;
      origin.input.maxLength = permission.input.maxLength = 2e3;
      advanced.append(ui.h("p", "be-muted", "\u9002\u5408\u8868\u8FBE\u7684\u5FC3\u60C5\uFF08\u81F3\u5C11\u9009\u62E9\u4E00\u9879\uFF09"), emotions, exclusions, field("\u8868\u8FBE\u5F3A\u5EA6\uFF1A\u8F7B\u67D4 \u2192 \u5F3A\u70C8", strength), origin.el, permission.el);
      editor.append(advanced);
      const reviewed = ui.h("input");
      reviewed.type = "checkbox";
      reviewed.checked = e.reviewed;
      const review = ui.h("label", "be-review");
      review.append(reviewed, ui.h("span", null, "\u6211\u5DF2\u68C0\u67E5\u56FE\u7247\u548C\u6587\u5B57\uFF0C\u786E\u8BA4\u542B\u4E49\u4E0E\u4F7F\u7528\u8BB8\u53EF"));
      editor.append(review);
      const save = ui.button("\u4FDD\u5B58\u8BBE\u7F6E", { variant: "primary" });
      save.type = "submit";
      editor.append(save);
      details.append(editor);
      let loaded = e.kind === "emoji";
      async function preview() {
        if (loaded || signal.aborted) return;
        try {
          const p = await ctx.invoke("preview", [e.id]);
          if (signal.aborted) return;
          if (p.src) {
            const image = ui.h("img");
            image.src = p.src;
            image.alt = e.description;
            visual.replaceChildren(image);
            loaded = true;
          }
        } catch (err) {
          visual.textContent = "\u9884\u89C8\u6682\u4E0D\u53EF\u7528";
          fail(err);
        }
      }
      if (e.kind === "sticker") {
        const view = ui.button("\u67E5\u770B\u56FE\u7247");
        view.addEventListener("click", () => {
          void preview();
        }, { signal });
        actions.append(view);
        details.addEventListener("toggle", () => {
          if (details.open) void preview();
        }, { signal });
      }
      actions.append(toggle);
      editor.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!editor.reportValidity()) return;
        void (async () => {
          save.disabled = true;
          try {
            const selected = choices.filter((c) => c.input.checked).map((c) => c.key);
            if (!selected.length) throw new Error("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u79CD\u5FC3\u60C5");
            if (e.kind === "sticker" && reviewed.checked && !loaded) throw new Error("\u8BF7\u5148\u67E5\u770B\u56FE\u7247\uFF0C\u518D\u786E\u8BA4\u5185\u5BB9");
            await update(e.id, { aliases: [label.input.value.trim(), ...(e.aliases ?? []).slice(1)], description: desc.value.trim(), usage: usage.value.trim(), emotions: selected, forbidden: forbiddenChoices.filter((c) => c.input.checked).map((c) => c.key), intensity: Number(strength.value), source: origin.input.value.trim(), license: permission.input.value.trim(), reviewed: reviewed.checked });
            notify("\u5DF2\u4FDD\u5B58");
          } catch (err) {
            fail(err);
          } finally {
            save.disabled = false;
          }
        })();
      }, { signal });
      row.append(visual, heading, meaning, actions, details);
      list.append(row);
    }
    filterRows();
  }
  importForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!importForm.reportValidity()) return;
    void (async () => {
      upload.disabled = true;
      try {
        const f = file.files?.[0];
        if (!f || f.size > 2 * 1024 * 1024) throw new Error("\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC7 2 MB \u7684 PNG \u56FE\u7247");
        const raw = new Uint8Array(await f.arrayBuffer());
        let binary = "";
        for (const b of raw) binary += String.fromCharCode(b);
        if (signal.aborted) return;
        const metadata = { id: "sticker-" + crypto.randomUUID(), aliases: [name.input.value.trim()], description: description.value.trim(), emotions: [emotion.value], intensity: 0.3, forbidden: [], source: source.input.value.trim(), license: license.input.value.trim() };
        await ctx.invoke("import", [{ base64: btoa(binary), metadata }]);
        await refresh();
        importForm.reset();
        importPanel.open = false;
        category = "pending";
        filter.value = "";
        filterRows();
        notify("\u5DF2\u5BFC\u5165\u3002\u5728\u300C\u5F85\u786E\u8BA4\u300D\u4E2D\u67E5\u770B\u56FE\u7247\u5E76\u786E\u8BA4\u540E\uFF0C\u684C\u5BA0\u624D\u4F1A\u4F7F\u7528\u3002");
      } catch (err) {
        fail(err);
      } finally {
        upload.disabled = false;
      }
    })();
  }, { signal });
  void refresh().catch(fail);
} } } };
var client_default = bundle;
export {
  client_default as default
};
