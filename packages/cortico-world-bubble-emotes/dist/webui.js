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

// packages/cortico-world-bubble-emotes/web/client.ts
var bundle = { panels: { library: { mount(ctx) {
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
