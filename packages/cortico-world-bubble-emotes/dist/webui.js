// web/client.ts
var bundle = { panels: { library: { mount(ctx) {
  const { ui, root, signal } = ctx;
  const card = ui.sheet({ title: "\u8868\u60C5\u5E93 / Emote library" });
  root.append(card.el);
  const msg = ui.h("p"), list = ui.h("div"), form = ui.h("div");
  const filter = ui.h("input");
  filter.type = "search";
  filter.placeholder = "\u641C\u7D22\u540D\u79F0\u3001\u542B\u4E49 / Search meaning";
  filter.setAttribute("aria-label", "\u641C\u7D22\u8868\u60C5 / Search emotes");
  const filterRows = () => {
    for (const row of Array.from(list.children)) row.hidden = !(row.dataset.search ?? "").includes(filter.value.trim().toLowerCase());
  };
  filter.addEventListener("input", filterRows, { signal });
  const file = ui.h("input");
  file.type = "file";
  file.accept = "image/png";
  file.setAttribute("aria-label", "PNG \u6587\u4EF6 / PNG file");
  const metadata = ui.h("textarea");
  metadata.rows = 10;
  metadata.setAttribute("aria-label", "\u7D20\u6750\u6807\u7B7E / Emote metadata");
  metadata.value = JSON.stringify({ id: "my-sticker", description: "Describe the full image and written words", emotions: ["comfort"], intensity: 0.2, forbidden: ["anger"], source: "Your source", license: "Your permission or license" }, null, 2);
  const upload = ui.button("\u5BFC\u5165 PNG\uFF08\u5F85\u5BA1\u6838\uFF09 / Import PNG (unreviewed)");
  const note = ui.h("p", null, "\u68C0\u67E5\u56FE\u7247\u4E0E\u56FE\u4E2D\u6587\u5B57\u540E\u518D\u5BA1\u6838\u3002\u9700\u8981\u652F\u6301 presentation schema 1 \u7684\u5BBF\u4E3B\u3002 / Review the image and its words before approving. Requires a presentation schema 1 host.");
  form.append(note, file, metadata, upload);
  card.body.append(form, msg, filter, list);
  const fail = (err) => {
    if (!signal.aborted) msg.textContent = String(err.message ?? err);
  };
  async function refresh() {
    const entries = await ctx.invoke("list");
    if (signal.aborted) return;
    list.replaceChildren();
    for (const e of entries) {
      const row = ui.h("section"), title = ui.h("h3", null, `${e.text ?? ""} ${e.aliases?.join(" / ") || e.id}`), preview = ui.h("div");
      row.dataset.search = [e.id, e.description, e.usage, ...e.aliases ?? [], ...e.emotions].join(" ").toLowerCase();
      const meaning = ui.h("p", null, e.usage ?? e.description);
      const avoid = ui.h("p", null, e.avoid?.length ? `\u907F\u514D / Avoid: ${e.avoid.join(" ")}` : "");
      const example = ui.h("p", null, e.example ? `\u4F8B\u53E5 / Example: ${e.example}` : "");
      const editor = ui.h("textarea");
      editor.rows = 9;
      editor.value = JSON.stringify(e, null, 2);
      editor.setAttribute("aria-label", e.id);
      const view = ui.button("\u9884\u89C8 / Preview"), save = ui.button("\u4FDD\u5B58\u6807\u7B7E\u4E0E\u5BA1\u6838\u72B6\u6001 / Save labels and review status");
      view.addEventListener("click", () => {
        void ctx.invoke("preview", [e.id]).then((p) => {
          if (signal.aborted) return;
          preview.replaceChildren();
          if (p.src) {
            const image = ui.h("img");
            image.src = p.src;
            image.alt = e.description;
            image.style.maxWidth = "160px";
            preview.append(image);
          } else preview.textContent = p.text ?? "";
        }).catch(fail);
      }, { signal });
      save.addEventListener("click", () => {
        void (async () => {
          save.disabled = true;
          try {
            await ctx.invoke("update", [JSON.parse(editor.value)]);
            await refresh();
          } catch (err) {
            fail(err);
          } finally {
            save.disabled = false;
          }
        })();
      }, { signal });
      row.append(title, meaning, avoid, example, view, preview, editor, save);
      list.append(row);
    }
    filterRows();
  }
  upload.addEventListener("click", () => {
    void (async () => {
      upload.disabled = true;
      try {
        const f = file.files?.[0];
        if (!f || f.size > 2 * 1024 * 1024) throw new Error("\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC7 2 MiB \u7684 PNG / Select a PNG up to 2 MiB");
        const raw = new Uint8Array(await f.arrayBuffer());
        let binary = "";
        for (const b of raw) binary += String.fromCharCode(b);
        if (signal.aborted) return;
        await ctx.invoke("import", [{ base64: btoa(binary), metadata: JSON.parse(metadata.value) }]);
        await refresh();
        msg.textContent = "\u5DF2\u5BFC\u5165\uFF0C\u5F85\u5BA1\u6838 / Imported, awaiting review";
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
