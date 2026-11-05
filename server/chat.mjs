import { timingSafeEqual } from 'node:crypto';
export const BODY_LIMIT = 32768;
const RESPONSE_LIMIT = 131072;
export class ChatError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function configFromEnv(env = process.env) {
  let endpoint;
  try { endpoint = new URL(env.OLLI_CHAT_ENDPOINT); } catch { return null; }
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.hash || endpoint.search) return null;
  if (env.OLLI_CHAT_FREE_CONFIRMED !== '1' || !env.OLLI_CHAT_API_KEY || !env.OLLI_CHAT_MODEL || (env.OLLI_CHAT_TOKEN || '').length < 32) return null;
  return { endpoint: endpoint.href, key: env.OLLI_CHAT_API_KEY, model: env.OLLI_CHAT_MODEL, token: env.OLLI_CHAT_TOKEN };
}
export async function boundedText(stream, max) {
  if (!stream) throw new ChatError(502, 'Empty upstream response.');
  const reader = stream.getReader(); const chunks = []; let length = 0;
  try {
    while (true) { const {done, value} = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > max) { void reader.cancel().catch(()=>{}); throw new ChatError(502, 'Upstream response exceeds the safe limit.'); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}
export function validateMessages(body) {
  if (!body || !Array.isArray(body.messages) || !body.messages.length || body.messages.length > 20) throw new ChatError(400, 'Provide 1–20 messages.');
  const messages = body.messages.map(m => {
    if (!m || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 8000) throw new ChatError(400, 'Invalid message.');
    return {role:m.role, content:m.content};
  });
  if (messages.at(-1).role !== 'user') throw new ChatError(400, 'The last message must be from the user.');
  return messages;
}
export async function modelReply(messages, config, fetchImpl = fetch, timeout = 15000) {
  const abort = new AbortController();
  const timer = setTimeout(()=>abort.abort(), timeout);
  try {
    const response = await fetchImpl(config.endpoint, {method:'POST', redirect:'error', signal:abort.signal,
      headers:{'Content-Type':'application/json', Authorization:`Bearer ${config.key}`},
      body:JSON.stringify({model:config.model, stream:false, max_tokens:1024, messages:[{role:'system',content:'You are Olli. Be honest and concise. No tools or external accounts are connected. Never claim to execute code, access accounts or complete actions. Never request secrets or card details.'},...messages]})});
    if (!response.ok) { if(response.body) void response.body.cancel().catch(()=>{}); throw new ChatError(response.status===429?429:502,'Model service unavailable. No fallback was attempted.'); }
    let data;
    try { data = JSON.parse(await boundedText(response.body, RESPONSE_LIMIT)); } catch(e) { if(e instanceof ChatError)throw e; throw new ChatError(502,'Invalid model response.'); }
    const text=data?.choices?.[0]?.message?.content;
    if(typeof text!=='string'||!text.trim()||text.length>16000)throw new ChatError(502,'Invalid model response.');
    return text;
  } catch(e) { if(e instanceof ChatError)throw e; throw new ChatError(abort.signal.aborted?504:502,abort.signal.aborted?'Model request timed out.':'Model service unavailable.'); }
  finally {clearTimeout(timer);}
}
export function createChatHandler({config = configFromEnv(), fetchImpl = fetch, timeout} = {}) {
  return async (req,res) => {
    const send=(status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));};
    try {
      if(req.method!=='POST'){send(405,{error:'POST required.'});return;}
      if(!config){send(503,{error:'Chat is not configured. No provider request was made.'});return;}
      const supplied=Buffer.from(req.headers.authorization||''); const expected=Buffer.from('Bearer '+config.token);
      if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected)){send(401,{error:'Unauthorized.'});return;}
      // API-only access until session authentication is implemented. No browser-origin requests.
      if(req.headers.origin){send(403,{error:'Browser requests are not enabled.'});return;}
      if((req.headers['content-type']||'').split(';')[0]!=='application/json'){send(415,{error:'JSON required.'});return;}
      if(Number(req.headers['content-length'])>BODY_LIMIT){send(413,{error:'Request too large.'});return;}
      const chunks=[];let length=0;
      for await(const chunk of req){length+=chunk.length;if(length>BODY_LIMIT){send(413,{error:'Request too large.'});return;}chunks.push(chunk);}
      let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new ChatError(400,'Invalid JSON.');}
      const messages=validateMessages(data);
      send(200,{message:{role:'assistant',content:await modelReply(messages,config,fetchImpl,timeout)}});
    }catch(e){if(!res.writableEnded)send(e instanceof ChatError?e.status:500,{error:e instanceof ChatError?e.message:'Request failed.'});}
  };
}
