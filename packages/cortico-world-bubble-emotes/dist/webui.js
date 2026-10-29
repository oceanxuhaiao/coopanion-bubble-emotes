// src/catalog.ts
var EMOTIONS = ["neutral", "calm", "joy", "amusement", "excitement", "celebration", "affection", "playfulness", "shyness", "embarrassment", "surprise", "thinking", "confusion", "skepticism", "worry", "fear", "sadness", "grief", "disappointment", "comfort", "apology", "anger", "frustration", "determination", "pride", "gratitude", "tiredness", "sleepy", "disgust", "illness"];

// web/emotion-labels.ts
var EMOTION_LABELS = { neutral: "\u4E2D\u6027", calm: "\u5E73\u9759\u3001\u653E\u677E", joy: "\u5F00\u5FC3", amusement: "\u597D\u7B11", excitement: "\u5174\u594B", celebration: "\u5E86\u795D", affection: "\u559C\u6B22", playfulness: "\u4FCF\u76AE", shyness: "\u5BB3\u7F9E", embarrassment: "\u5C34\u5C2C", surprise: "\u60CA\u8BB6", thinking: "\u601D\u8003", confusion: "\u7591\u60D1", skepticism: "\u6000\u7591", worry: "\u62C5\u5FC3", fear: "\u5BB3\u6015", sadness: "\u96BE\u8FC7", grief: "\u60B2\u75DB", disappointment: "\u5931\u671B", comfort: "\u5B89\u6170\u3001\u966A\u4F34", apology: "\u6B49\u610F", anger: "\u751F\u6C14", frustration: "\u6CAE\u4E27", determination: "\u575A\u5B9A", pride: "\u81EA\u8C6A", gratitude: "\u611F\u8C22", tiredness: "\u75B2\u60EB", sleepy: "\u56F0\u5026", disgust: "\u53CD\u611F", illness: "\u4E0D\u9002", uncertain: "\u8BED\u5883\u4E0D\u8DB3\uFF0C\u6682\u4E0D\u786E\u5B9A" };

// src/body-mapping.ts
var BODY_EXPRESSIONS = { neutral: "\u5E73\u9759", happy: "\u5F00\u5FC3", wink: "\u7728\u773C", love: "\u559C\u6B22\uFF0F\u7231\u5FC3", shy: "\u5BB3\u7F9E", surprised: "\u60CA\u8BB6", angry: "\u751F\u6C14", sad: "\u96BE\u8FC7", sleepy: "\u72AF\u56F0", thinking: "\u601D\u8003", smug: "\u5F97\u610F", pout: "\u561F\u5634", worried: "\u62C5\u5FC3", determined: "\u8BA4\u771F\uFF0F\u575A\u5B9A", flustered: "\u614C\u5F20\uFF0F\u7A98", scared: "\u5BB3\u6015", excited: "\u671F\u5F85\uFF0F\u661F\u661F\u773C", cry: "\u5927\u54ED", confused: "\u7591\u60D1" };
var BODY_MATCH_LABELS = { direct: "\u76F4\u63A5\u5BF9\u5E94", approximate: "\u8FD1\u4F3C\u5BF9\u5E94", none: "\u65E0\u5408\u9002\u5BF9\u5E94" };

// web/draft-settings.ts
function mountDraftSettings(ctx, parent) {
  const { ui, signal } = ctx, box = ui.h("details", "be-diagnostics");
  box.append(ui.h("summary", null, "\u8349\u7A3F\u4E0E\u8EAB\u4F53\u8BBE\u7F6E"));
  const status = ui.h("p", "be-muted"), message = ui.h("p", "be-message"), toggle = ui.button("\u8BFB\u53D6\u8349\u7A3F\u68C0\u67E5\u8BBE\u7F6E"), body = ui.button("\u8BFB\u53D6\u8EAB\u4F53\u534F\u8C03\u8BBE\u7F6E");
  message.setAttribute("role", "status");
  box.append(status, toggle, body, message);
  parent.append(box);
  let enabled = false, bodyEnabled = false;
  const fail = (e) => {
    message.textContent = String(e.message ?? e);
  };
  async function refresh() {
    const s = await ctx.invoke("state");
    if (signal.aborted) return;
    enabled = s.settings.enabled;
    bodyEnabled = s.bodyCoordination.enabled;
    status.textContent = s.storageError || (s.draftMode.enabled ? "\u8349\u7A3F\u68C0\u67E5\u5DF2\u5F00\u542F" : "\u8349\u7A3F\u68C0\u67E5\u5DF2\u6682\u505C");
    toggle.textContent = enabled ? "\u6682\u505C\u8349\u7A3F\u68C0\u67E5" : "\u5F00\u542F\u8349\u7A3F\u68C0\u67E5";
    body.textContent = bodyEnabled ? "\u5173\u95ED\u8EAB\u4F53\u534F\u8C03" : "\u5F00\u542F\u8EAB\u4F53\u534F\u8C03";
  }
  toggle.addEventListener("click", () => {
    toggle.disabled = true;
    void ctx.invoke("configure", [{ enabled: !enabled }]).then(() => refresh()).catch(fail).finally(() => toggle.disabled = false);
  }, { signal });
  body.addEventListener("click", () => {
    body.disabled = true;
    void ctx.invoke("bodyCoordination", [!bodyEnabled]).then(() => refresh()).catch(fail).finally(() => body.disabled = false);
  }, { signal });
  void refresh().catch(fail);
  ctx.interval(() => {
    void refresh().catch(fail);
  }, 5e3);
}

// web/styles.ts
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

.be-mapping-chain{line-height:1.7;padding:10px 12px;border-radius:10px;background:var(--be-soft,#f3f4ff);overflow-wrap:anywhere}
.be-emotion-group{border:1px solid #dce0e8;border-radius:10px;padding:12px;display:flex;flex-wrap:wrap;gap:8px;min-width:0}
.be-emotion-option{display:inline-flex;align-items:center;gap:4px;font-size:13px}
.be-emotion-option input{width:auto!important;margin:0}
.be-form select{max-width:100%;padding:8px;border:1px solid #dce0e8;border-radius:8px}
`;

// web/client.ts
var bundle = { panels: { library: { mount(ctx) {
  const { ui, root, signal } = ctx;
  root.classList.add("be-library");
  root.append(ui.h("style", null, styles));
  const page = ui.h("div", "be-page");
  root.append(page);
  const header = ui.h("div", "be-header"), intro = ui.h("div");
  intro.append(ui.h("h2", null, "\u7ED9\u5FC3\u60C5\u52A0\u4E00\u4E2A\u8868\u60C5"), ui.h("p", "be-muted", "\u76F4\u63A5\u7528\u4E8E\u539F\u7248\u684C\u5BA0\u6C14\u6CE1\u3002\u8EAB\u4F53\u6620\u5C04\u9762\u5411\u5185\u7F6E19\u79CD\u8868\u60C5\uFF0C\u4EC5\u4F9B\u53C2\u8003\uFF0C\u4E0D\u81EA\u52A8\u6267\u884C\u52A8\u4F5C\u3002"));
  header.append(intro);
  page.append(header);
  mountDraftSettings(ctx, page);
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
      let emotionChecks2 = function(title2, values) {
        const group = ui.h("fieldset", "be-emotion-group"), legend = ui.h("legend", null, title2);
        group.append(legend);
        const checks = /* @__PURE__ */ new Map();
        for (const emotion of EMOTIONS) {
          const label = ui.h("label", "be-emotion-option"), input = ui.h("input");
          input.type = "checkbox";
          input.checked = values.includes(emotion);
          input.value = emotion;
          label.append(input, ui.h("span", null, EMOTION_LABELS[emotion] ?? emotion));
          group.append(label);
          checks.set(emotion, input);
        }
        return { group, values: () => [...checks].filter(([, input]) => input.checked).map(([emotion]) => emotion) };
      };
      var emotionChecks = emotionChecks2;
      const row = ui.h("section", "be-card");
      row.dataset.id = e.id;
      row.dataset.search = [e.id, e.description, e.usage, ...e.aliases ?? [], ...e.emotions, ...e.emotions.map((x) => EMOTION_LABELS[x]), e.bodyMatch ? BODY_MATCH_LABELS[e.bodyMatch] : "", BODY_EXPRESSIONS[e.bodyExpression] ?? ""].join(" ").toLowerCase();
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
      const mapping = ui.h("p", "be-muted", (e.bodyMatch ? BODY_MATCH_LABELS[e.bodyMatch] : "\u672A\u5206\u7C7B") + " \xB7 " + (e.bodyExpression ? BODY_EXPRESSIONS[e.bodyExpression] ?? "\u975E\u5185\u7F6E\u8868\u60C5" : "\u4E0D\u6307\u5B9A\u8EAB\u4F53\u8868\u60C5"));
      mapping.dataset.bodyMatch = e.bodyMatch ?? "unknown";
      mapping.title = e.bodyMatchReason ?? "\u65E7\u81EA\u5B9A\u4E49\u6620\u5C04\u5C1A\u672A\u5206\u7C7B";
      const details = ui.h("details", "be-edit");
      details.append(ui.h("summary", null, "\u4F7F\u7528\u8BF4\u660E\u4E0E\u7F16\u8F91"));
      const form = ui.h("form", "be-form");
      if (e.bodyMatchReason) form.append(ui.h("p", "be-muted", "\u6620\u5C04\u8BF4\u660E\uFF1A" + e.bodyMatchReason));
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
      const chain = ui.h("p", "be-mapping-chain", e.emotions.map((x) => EMOTION_LABELS[x] ?? x).join("\u3001") + " \u2192 " + e.text + " \u2192 " + (e.bodyExpression ? BODY_EXPRESSIONS[e.bodyExpression] : "\u4E0D\u6307\u5B9A\u8EAB\u4F53\u5FC3\u60C5"));
      const mappingEdit = ui.h("details", "be-edit");
      mappingEdit.append(ui.h("summary", null, "\u7F16\u8F91\u6620\u5C04"));
      const mappingForm = ui.h("form", "be-form");
      const allowed = emotionChecks2("\u9002\u7528\u60C5\u7EEA\uFF08\u81F3\u5C11\u9009\u4E00\u9879\uFF09", e.emotions), forbidden = emotionChecks2("\u7981\u7528\u60C5\u7EEA\uFF08\u4F18\u5148\u4E8E\u9002\u7528\u60C5\u7EEA\uFF09", e.forbidden);
      const target = ui.h("select");
      target.setAttribute("aria-label", "\u8EAB\u4F53\u5FC3\u60C5");
      for (const [value, label] of [["", "\u4E0D\u6307\u5B9A\u8EAB\u4F53\u5FC3\u60C5"], ...Object.entries(BODY_EXPRESSIONS)]) {
        const option = ui.h("option", null, label);
        option.value = value;
        target.append(option);
      }
      target.value = e.bodyExpression ?? "";
      const match = ui.h("select");
      match.setAttribute("aria-label", "\u5BF9\u5E94\u7A0B\u5EA6");
      for (const [value, label] of Object.entries(BODY_MATCH_LABELS)) {
        const option = ui.h("option", null, label);
        option.value = value;
        match.append(option);
      }
      match.value = e.bodyMatch ?? (target.value ? "approximate" : "none");
      const reason = ui.h("textarea");
      reason.rows = 2;
      reason.maxLength = 500;
      reason.required = true;
      reason.value = e.bodyMatchReason ?? "\u7528\u6237\u81EA\u5B9A\u4E49\u6620\u5C04\uFF0C\u8BF7\u7ED3\u5408\u8BED\u5883\u4F7F\u7528\u3002";
      const sync = () => {
        if (!target.value) {
          match.value = "none";
          match.disabled = true;
        } else {
          match.disabled = false;
          if (match.value === "none") match.value = "approximate";
        }
      };
      target.addEventListener("change", sync, { signal });
      sync();
      const mappingSave = ui.button("\u4FDD\u5B58\u6620\u5C04", { variant: "primary" });
      mappingSave.type = "submit";
      mappingForm.append(allowed.group, forbidden.group, field("\u8EAB\u4F53\u5FC3\u60C5", target), field("\u5BF9\u5E94\u7A0B\u5EA6", match), field("\u6620\u5C04\u8BF4\u660E", reason), ui.h("p", "be-muted", "\u81EA\u5B9A\u4E49\u8EAB\u4F53\u6620\u5C04\u7528\u4E8E\u5EFA\u8BAE\uFF0C\u4E0D\u4FDD\u8BC1\u81EA\u52A8\u64AD\u653E\uFF1B\u7981\u7528\u60C5\u7EEA\u4F18\u5148\u3002"), mappingSave);
      mappingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const emotions = allowed.values(), blocked = forbidden.values();
        if (!emotions.length) {
          notify("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u79CD\u9002\u7528\u60C5\u7EEA", true);
          return;
        }
        if (emotions.some((x) => blocked.includes(x))) {
          notify("\u540C\u4E00\u60C5\u7EEA\u4E0D\u80FD\u540C\u65F6\u8BBE\u4E3A\u9002\u7528\u548C\u7981\u7528", true);
          return;
        }
        if (target.value && match.value === "none") {
          notify("\u8BF7\u9009\u62E9\u76F4\u63A5\u6216\u8FD1\u4F3C\u5BF9\u5E94\uFF0C\u6216\u53D6\u6D88\u8EAB\u4F53\u5FC3\u60C5", true);
          return;
        }
        if (!mappingForm.reportValidity()) return;
        mappingSave.disabled = true;
        void update(e.id, { emotions, forbidden: blocked, bodyExpression: target.value || void 0, bodyMatch: target.value ? match.value : "none", bodyMatchReason: reason.value.trim() }).then(() => notify("\u6620\u5C04\u5DF2\u4FDD\u5B58\uFF0C\u540E\u7EED\u641C\u7D22\u548C\u8349\u7A3F\u68C0\u67E5\u5C06\u4F7F\u7528\u65B0\u6620\u5C04")).catch(fail).finally(() => {
          mappingSave.disabled = false;
        });
      }, { signal });
      mappingEdit.append(mappingForm);
      row.append(visual, heading, meaning, chain, mapping, actions, mappingEdit, details);
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
