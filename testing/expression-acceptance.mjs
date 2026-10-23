// Release gate: absence of evidence is never evidence of successful display.
export function evaluateExpression(sample, { required = true } = {}) {
  const replies = sample.replies ?? [];
  const observed = replies.flatMap(r => r.emojis ?? []);
  const reasons = [];
  if (!replies.length) reasons.push('no_reply');
  if (observed.some(e => (sample.forbiddenEmojis ?? []).includes(e))) reasons.push('semantic_conflict');
  if (sample.requiredEmoji && !observed.includes(sample.requiredEmoji)) reasons.push('expected_emoji_missing');
  if (required && sample.acceptedEmojis?.length && !observed.some(e => sample.acceptedEmojis.includes(e))) reasons.push('compatible_emoji_missing');
  const confirmed = replies.some(reply => {
    if (!reply.presentationId) return false;
    return (sample.toolCalls ?? []).some(call => {
      let receipt = call.receipt;
      try { if (typeof receipt === 'string') receipt = JSON.parse(receipt); } catch { return false; }
      if (receipt?.requestId !== reply.presentationId || receipt?.status !== 'shown') return false;
      return (reply.emojis?.length ?? 0) > 0 || call.segments?.some(s => s.kind === 'sticker');
    });
  });
  if (required && !observed.length && !confirmed) reasons.push('visual_missing');
  if (required && !confirmed) reasons.push('correlated_shown_receipt_missing');
  return { status: reasons.length ? 'FAIL' : 'PASS', reasons, confirmedDisplay: confirmed };
}
