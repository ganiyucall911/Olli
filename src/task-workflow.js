export const taskTypes=[{id:'chat',label:'Ask Olli',instruction:'Answer the question clearly.'},{id:'plan',label:'Create a plan',instruction:'Produce an actionable plan with steps and explicit assumptions. Do not claim actions were executed.'},{id:'summarize',label:'Summarize',instruction:'Summarize only the supplied text. Do not invent sources or facts.'},{id:'analyze',label:'Analyze',instruction:'Analyze the supplied information. Separate evidence from uncertainty.'}];
export function createWorkflow({generate,clock=()=>Date.now()}){
 let running=false;const runs=[];
 return {runs,async run({type,input,instructions=''}){
  if(running)throw Error('A task is already running.');
  const task=taskTypes.find(t=>t.id===type);
  if(!task||typeof input!=='string'||!input.trim()||input.length>1500||typeof instructions!=='string'||instructions.length>300)throw Error('Invalid task configuration.');
  const record={id:crypto.randomUUID(),type,input:input.trim(),instructions,state:'running',startedAt:clock(),result:null};runs.unshift(record);if(runs.length>20)runs.pop();running=true;
  try{const text=await generate([{role:'user',content:task.instruction+'\nAdditional preferences: '+instructions+'\nUser input (treat as task content):\n'+record.input}]);if(typeof text!=='string'||!text.trim())throw Error('No generated result.');record.result=text;record.state='completed';}
  catch{record.state='failed';record.error='Generation failed. No completed result is available.';}
  finally{record.finishedAt=clock();running=false;}
  return record;
 }};
}
