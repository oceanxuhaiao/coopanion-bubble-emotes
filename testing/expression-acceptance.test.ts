import { describe, it, expect } from 'vitest';
import { evaluateExpression } from './expression-acceptance.mjs';

describe('required expression release gate', () => {
  const sample = (status = 'shown', id = 'p1') => ({
    replies: [{ emojis: ['😌'], presentationId: 'p1' }],
    toolCalls: [{ receipt: { requestId: id, status } }],
  });
  it('rejects a plain text reply', () => expect(evaluateExpression({ replies: [{ emojis: [] }] }).status).toBe('FAIL'));
  it('rejects emoji without display evidence', () => expect(evaluateExpression({ replies: [{ emojis: ['😌'] }] }).status).toBe('FAIL'));
  it.each(['cancelled', 'queued', 'error'])('rejects %s', status => expect(evaluateExpression(sample(status)).status).toBe('FAIL'));
  it('rejects an unrelated shown receipt', () => expect(evaluateExpression(sample('shown', 'other')).status).toBe('FAIL'));
  it('accepts correlated actual display', () => expect(evaluateExpression(sample()).status).toBe('PASS'));
  it('rejects conflicting emotion despite display', () => expect(evaluateExpression({ ...sample(), forbiddenEmojis: ['😌'] }).status).toBe('FAIL'));
  it('rejects missing requested emoji', () => expect(evaluateExpression({ ...sample(), requiredEmoji: '😢' }).status).toBe('FAIL'));
  it('accepts a structured sticker with correlated display', () => expect(evaluateExpression({ replies: [{ emojis: [], presentationId: 'p1' }], toolCalls: [{ segments: [{ kind: 'sticker' }], receipt: { requestId: 'p1', status: 'shown' } }] }).status).toBe('PASS'));
  it('allows plain factual text outside the required set', () => expect(evaluateExpression({ replies: [{ emojis: [] }] }, { required: false }).status).toBe('PASS'));
});
