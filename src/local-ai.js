export const MODEL_ID='SmolLM2-135M-Instruct-q0f32-MLC';
let engine;
export async function loadModel(onProgress){
 if(!navigator.gpu)throw Error('WebGPU is unavailable in this browser. Try a supported browser/device.');
 const adapter=await navigator.gpu.requestAdapter();if(!adapter)throw Error('No compatible GPU adapter was found.');
 if(!engine){const {CreateMLCEngine}=await import('@mlc-ai/web-llm');engine=await CreateMLCEngine(MODEL_ID,{initProgressCallback:p=>onProgress(p.text),logLevel:'ERROR'});}
 return engine;
}
export async function reply(messages){
 if(!engine)throw Error('Load the local model first.');
 const result=await engine.chat.completions.create({messages:[{role:'system',content:'You are Olli. You are a small browser-local language model. No tools or external accounts are connected. Do not claim to take actions. Never request credentials or payment details.'},...messages.slice(-6)],max_tokens:128,temperature:0.4});
 const text=result.choices?.[0]?.message?.content;if(!text)throw Error('The model returned no text.');return text;
}
