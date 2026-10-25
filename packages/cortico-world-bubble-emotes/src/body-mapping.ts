export const BODY_EXPRESSIONS={neutral:'平静',happy:'开心',wink:'眨眼',love:'喜欢／爱心',shy:'害羞',surprised:'惊讶',angry:'生气',sad:'难过',sleepy:'犯困',thinking:'思考',smug:'得意',pout:'嘟嘴',worried:'担心',determined:'认真／坚定',flustered:'慌张／窘',scared:'害怕',excited:'期待／星星眼',cry:'大哭',confused:'疑惑'}as const;
export type BodyExpression=keyof typeof BODY_EXPRESSIONS;
export const BODY_MATCH_LABELS={direct:'直接对应',approximate:'近似对应',none:'无合适对应'}as const;
export type BodyMatch=keyof typeof BODY_MATCH_LABELS;
