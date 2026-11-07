import {createRemoteJWKSet,jwtVerify} from 'jose';
export const MODEL='@cf/meta/llama-3.1-8b-instruct';
const json=(status,body)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
let certs,certURL;
export async function authenticate(request,env){
 const domain=new URL(env.ACCESS_TEAM_DOMAIN);
 if(domain.protocol!=='https:'||!domain.hostname.endsWith('.cloudflareaccess.com')||domain.pathname!=='/'||domain.search||domain.username||domain.password)throw Error('Invalid Access issuer');
 const issuer=domain.origin;const url=issuer+'/cdn-cgi/access/certs';
 if(certURL!==url){certs=createRemoteJWKSet(new URL(url));certURL=url;}
 const {payload}=await jwtVerify(request.headers.get('cf-access-jwt-assertion')||'',certs,{issuer,audience:env.ACCESS_AUD,algorithms:['RS256'],requiredClaims:['sub','exp','iat']});
 if(!payload.sub)throw Error('Missing user');return payload.sub;
}
export function createWorker({verify=authenticate}={}){return {async fetch(request,env){
 const url=new URL(request.url);
 if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
 if(url.pathname!=='/api/chat')return json(404,{error:'Not found.'});
 if(request.method!=='POST')return json(405,{error:'POST required.'});
 if(!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD||!env.AI||env.OLLI_AI_ENABLED!=='1')return json(503,{error:'Hosted AI not activated.'});
 try{await verify(request,env);}catch{return json(401,{error:'Sign in through the configured Cloudflare Access application.'});}
 const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return json(403,{error:'Cross-origin request denied.'});
 if((request.headers.get('content-type')||'').split(';')[0]!=='application/json')return json(415,{error:'JSON required.'});
 if(Number(request.headers.get('content-length'))>32768)return json(413,{error:'Request too large.'});
 let raw='';if(!request.body)return json(400,{error:'Missing body.'});
 const reader=request.body.getReader();const chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>32768){void reader.cancel().catch(()=>{});return json(413,{error:'Request too large.'});}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.byteLength;}raw=new TextDecoder().decode(bytes);}catch{return json(400,{error:'Unreadable body.'});}finally{reader.releaseLock();}
 let data;try{data=JSON.parse(raw);}catch{return json(400,{error:'Invalid JSON.'});}
 if(!Array.isArray(data?.messages)||data.messages.length<1||data.messages.length>12)return json(400,{error:'Provide 1–12 messages.'});
 if(data.messages.some(m=>!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>4000)||data.messages.at(-1).role!=='user')return json(400,{error:'Invalid messages.'});
 try{
 const result=await env.AI.run(MODEL,{messages:[{role:'system',content:'You are Olli. Be honest and concise. You have no connected tools or accounts. Never claim actions or ask for secrets or card details.'},...data.messages.map(({role,content})=>({role,content}))],max_tokens:256,stream:false});
 if(typeof result?.response!=='string'||!result.response.trim()||result.response.length>16000)return json(502,{error:'Invalid model result.'});
 return json(200,{message:{role:'assistant',content:result.response},model:MODEL});
 }catch{return json(503,{error:'AI unavailable or allowance exhausted. No fallback attempted.'});}
}};}
export default createWorker();
