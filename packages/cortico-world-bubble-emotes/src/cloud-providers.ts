/** Fixed official endpoints; no arbitrary URL or credential forwarding. */
export const CLOUD_PROVIDERS={
 deepseek:{label:'DeepSeek',url:'https://api.deepseek.com/chat/completions',models:['deepseek-flash','deepseek-chat']},
 openai:{label:'OpenAI',url:'https://api.openai.com/v1/chat/completions',models:['gpt-4.1-mini','gpt-4o-mini']},
 qwen:{label:'通义千问（百炼北京）',url:'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',models:['qwen-plus','qwen-flash']},
 moonshot:{label:'Kimi',url:'https://api.moonshot.cn/v1/chat/completions',models:['kimi-k2.5','kimi-k2-turbo-preview']},
 glm:{label:'智谱 GLM',url:'https://open.bigmodel.cn/api/paas/v4/chat/completions',models:['glm-4.7-flash','glm-4.5-air']}
}as const;
export type CloudProvider=keyof typeof CLOUD_PROVIDERS;
export const cloudProvider=(value:string)=>Object.hasOwn(CLOUD_PROVIDERS,value)?CLOUD_PROVIDERS[value as CloudProvider]:undefined;
export function cloudOptions(provider:CloudProvider,tokens:number){return provider==='openai'?{max_completion_tokens:tokens}:provider==='qwen'?{max_tokens:tokens,enable_thinking:false}:provider==='moonshot'?{max_tokens:tokens,thinking:{type:'disabled'}}:{max_tokens:tokens,thinking:{type:'disabled'}};}
