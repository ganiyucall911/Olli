import {panel,status as statusComponent,action,field,element} from './components/ui.js';
import {loadModel,reply,MODEL_ID} from './local-ai.js';
import {createWorkflow,taskTypes} from './task-workflow.js';
const state={ready:false,loading:false,status:'Not loaded',draft:'',type:'chat',instructions:''};
const workflow=createWorkflow({generate:reply});
export function renderLocalChat(content){
 const busy=state.loading||workflow.runs.some(r=>r.state==='running');
 const card=panel({title:'AI on your device',iconName:'message-square',description:'SmolLM2 135M runs locally after an opt-in model download (hundreds of MB). Device GPU, memory and internet data required. No tools or external accounts are connected.'});
 const progress=statusComponent(state.status);progress.dataset.modelStatus='true';
 const load=action(state.ready?'Model loaded':state.loading?'Loading…':'Download & load AI',{disabled:state.ready||busy});card.append(progress,load);content.append(card);
 const config=panel({title:'Configure your task',description:'Choose a text task and optional instructions. Runs happen on this device, not as a deployed background agent.'});
 const label=element('label',{text:'Task type'});const select=element('select',{attributes:{'aria-label':'Task type'}});select.disabled=busy;
 for(const task of taskTypes){const option=element('option',{text:task.label,attributes:{value:task.id}});option.selected=task.id===state.type;select.append(option);}select.onchange=()=>state.type=select.value;label.append(select);
 const preferences=field({label:'Agent instructions',placeholder:'Optional tone, format or task preferences',value:state.instructions,maxLength:300,disabled:busy});preferences.oninput=()=>state.instructions=preferences.value;config.append(label,preferences);content.append(config);
 for(const run of workflow.runs){const result=panel({title:taskTypes.find(t=>t.id===run.type).label});result.setAttribute('role','log');result.setAttribute('aria-label','Task '+run.state);result.append(statusComponent(run.state==='running'?'Running on this device…':run.state==='completed'?'Completed · '+Math.max(0,run.finishedAt-run.startedAt)+' ms':'Failed · no result produced'),element('p',{text:'Input: '+run.input}));if(run.result)result.append(element('p',{text:run.result}));if(run.error)result.append(element('p',{text:run.error}));content.append(result);}
 const form=element('form');const input=field({multiline:true,label:'Message Olli',placeholder:'Describe your task or paste text to process',value:state.draft,maxLength:1500,disabled:!state.ready||busy});input.oninput=()=>state.draft=input.value;const send=action(busy?'Working…':'Run task',{type:'submit',variant:'primary',disabled:!state.ready||busy});form.append(input,send);content.append(form);
 const refresh=()=>{if(content.dataset.view==='chat'){content.querySelectorAll('.card,form').forEach(e=>e.remove());renderLocalChat(content);}};
 load.onclick=async()=>{state.loading=true;state.status='Checking device and downloading actual model files…';refresh();try{await loadModel(text=>{state.status=text;if(content.dataset.view==='chat'){const s=content.querySelector('[data-model-status]');if(s)s.textContent=text;}});state.ready=true;state.status='Loaded locally: '+MODEL_ID;}catch{state.status='Model could not load. Check WebGPU support, memory and model download access. No substitute result was generated.';}finally{state.loading=false;refresh();}};
 form.onsubmit=async e=>{e.preventDefault();const text=state.draft.trim();if(!text||!state.ready||busy)return;const promise=workflow.run({type:state.type,input:text,instructions:state.instructions});state.draft='';refresh();const run=await promise;if(run.state==='failed')state.draft=text;state.status=run.state==='completed'?'Generated locally. Check important answers.':'Task failed; your input was restored.';refresh();};
}
