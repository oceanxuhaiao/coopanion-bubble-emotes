export const styles = `
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
