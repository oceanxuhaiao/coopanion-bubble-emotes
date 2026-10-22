## 0.2.1

- Fix World/page ID to bubble-emotes so the page passes the actual WebUI ID validator and appears in the World sidebar.
- Add a readable Chinese label and registration regression check. Migrate the old enabled configuration during local upgrade; library data is unchanged.

## 0.2.0

- Expand to 37 emoji and 30 semantic categories with usage, avoid rules, aliases, examples and body suggestions.
- Add intensity-sorted search, prepared emoji presentation examples and searchable library cards.
- Migrate additively while preserving edits, disabled entries and imported stickers.
- Cover 19 built-in body expressions; fix neutral hold and awake sleepy display in the host.

## 0.1.2

- Add fear and anger emotes, preserving existing library edits during upgrades.
- Require synchronized visual replies for sadness, fear and anger demonstrations.
- Host accepts redundant script with authoritative presentation and ignores empty text nodes; TTS remains text-only.

<!-- Owner: src/definition.ts -->
# Changelog

## 0.1.1

- The host binds live figure and state; model-supplied stale hints no longer block replies.
- Emote requests include visual nodes, and failed displays call for a plain-text reply.
- Sticker guidance uses the actual attachment handle rather than the library filename.

## 0.1.0

- Reviewed Unicode emotes and a persistent PNG library with editable labels.
- Context-labelled search and attachment preparation tools.
- Library import, preview, approval and disable controls in the World panel.
- Requires the presentation-schema-1 host changes; stock Coopanion 0.2.6 is unsupported.



