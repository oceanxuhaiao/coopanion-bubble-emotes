import {existsSync, readFileSync, writeFileSync, renameSync, unlinkSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import type {WorldContext, WorldSection} from 'cortico/world.ts';

export type SecretStore = Pick<WorldContext<WorldSection>, 'secret' | 'storeSecret'>;
const unavailable: SecretStore = {secret:()=>'', storeSecret:()=>{throw Error('宿主未提供部署密钥存储');}};
const secretName = (provider:string)=>`CORTICO_BUBBLE_EMOTES_${provider.toUpperCase()}_API_KEY`;
type CloudConfig = {provider:'deepseek'|'openai';model:string;keyEnabled:boolean};

/** Only non-secret connection metadata belongs in the World data directory. */
export class CloudSettings {
  config:CloudConfig={provider:'deepseek',model:'deepseek-flash',keyEnabled:false};
  error='';
  constructor(private file:string,private secrets:SecretStore=unavailable){
    if(!existsSync(file))return;
    try{
      const legacy=JSON.parse(readFileSync(file,'utf8'));
      this.validate(legacy);
      if('apiKey' in legacy){
        this.validateKey(legacy.apiKey);
        if(legacy.apiKey)this.storeVerified(legacy.provider,legacy.apiKey);
        const config={provider:legacy.provider,model:legacy.model,keyEnabled:!!legacy.apiKey};
        this.write(config); // Failed migration retains the original credential file.
        this.config=config;
      }else this.config={provider:legacy.provider,model:legacy.model,keyEnabled:legacy.keyEnabled===true};
    }catch{this.error='云端设置或密钥迁移未完成；原文件保留，请重新填写并保存云端设置。';}
  }
  private validate(v:any){if(!v||!['deepseek','openai'].includes(v.provider)||typeof v.model!=='string'||!v.model.trim()||v.model.length>120||/[\r\n]/.test(v.model))throw Error('云端设置无效');}
  private validateKey(key:unknown){if(typeof key!=='string'||key.length>512||/\s/.test(key))throw Error('API Key 格式无效');}
  private storeVerified(provider:string,key:string){
    try{this.secrets.storeSecret(secretName(provider),key);if(this.secrets.secret(secretName(provider))!==key)throw Error();}
    catch{throw Error('部署密钥保存未完成；没有清除原凭证，请检查宿主设置');}
  }
  private write(config:CloudConfig){const tmp=this.file+'.'+randomUUID()+'.tmp';try{writeFileSync(tmp,JSON.stringify(config),{mode:0o600});renameSync(tmp,this.file);}finally{if(existsSync(tmp))unlinkSync(tmp);}}
  key(){if(this.error||!this.config.keyEnabled)return '';try{return this.secrets.secret(secretName(this.config.provider));}catch{return '';}}
  state(){return{provider:this.config.provider,model:this.config.model,keyConfigured:!!this.key(),error:this.error};}
  configure(raw:unknown){
    const v=raw as any;this.validate(v);this.validateKey(v.apiKey??'');
    const config:CloudConfig={provider:v.provider,model:v.model.trim(),keyEnabled:!v.clearKey&&(!!v.apiKey||(v.provider===this.config.provider&&this.config.keyEnabled))};
    if(v.apiKey&&!v.clearKey)this.storeVerified(v.provider,v.apiKey);
    this.write(config);this.config=config;this.error='';
  }
}
