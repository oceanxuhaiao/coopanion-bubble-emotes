export type AnalysisErrorCode='timeout'|'connection'|'http_auth'|'http_limit'|'http_service'|'format'|'semantic_validation'|'response_limit'|'budget';
export class AnalysisError extends Error {
  constructor(public code:AnalysisErrorCode){super(code);}
}
export const analysisErrors:Record<AnalysisErrorCode,string>={
  timeout:'分析超过45秒，请稍后重试或选择响应更快的模型',
  connection:'无法连接分析服务，请检查服务是否运行及网络',
  http_auth:'API Key 无效或权限不足，请检查云端设置',
  http_limit:'云端限流或额度不足，请稍后手动重试',
  http_service:'分析服务请求失败，请检查模型与服务状态',
  format:'模型没有返回有效的分析JSON，请手动重试',
  semantic_validation:'分析结论与实际表情或可用表情语义冲突，请手动重试',
  response_limit:'模型响应超过大小限制，已停止读取',
  budget:'已达到每小时60次云端请求上限；稍后手动重试',
};
export async function responseJson(response:Response,maxBytes=32000):Promise<any>{
  if(!response.ok){try{await response.body?.cancel();}catch{}throw new AnalysisError(response.status===401||response.status===403?'http_auth':response.status===429?'http_limit':'http_service');}
  const reader=response.body?.getReader();if(!reader)throw new AnalysisError('format');
  let size=0;const parts:string[]=[],decoder=new TextDecoder();
  try{while(true){const{value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){try{await reader.cancel();}catch{}throw new AnalysisError('response_limit');}parts.push(decoder.decode(value,{stream:true}));}parts.push(decoder.decode());}
  finally{reader.releaseLock();}
  try{return JSON.parse(parts.join(''));}catch{throw new AnalysisError('format');}
}
