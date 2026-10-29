import type {BodySnapshot} from './body-coordination.ts';

/** Stock 0.2.8 exposes preferences, not live posture. wakeOn is not a quiet-state flag. */
export function readBodySnapshot(raw: unknown, observedAt = Date.now()): BodySnapshot | undefined {
 if (!raw || typeof raw !== 'object') return;
 const s = raw as Record<string, any>;
 if (typeof s.connected !== 'boolean' || typeof s.skin?.figure !== 'string') return;
 return {
  figure:s.skin.figure, connected:s.connected, onDesktop:typeof s.onDesktop==='boolean'?s.onDesktop:undefined,
  quiet:'unknown', posture:'unknown', observedAt,
  // The audited built-in kit rejects busy expressions and does not wake for these faces.
  faceProtection:['coo','whale'].includes(s.skin.figure)?'builtin-kit':undefined,
 };
}
