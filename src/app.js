import {features,executionStatus,parseLists} from './features.js';
const content=document.querySelector('#content');
let active='chat', items=[];
const windowEl=document.querySelector('.window'), launchpad=document.querySelector('#launchpad'), launcher=document.querySelector('#launcher-toggle');
function toggleLauncher(show){launchpad.hidden=!show;launcher.setAttribute('aria-expanded',String(show));if(show)document.querySelector('#app-search').focus();else launcher.focus();}
function openApp(id){active=id;windowEl.hidden=false;toggleLauncher(false);render();content.focus();}
launcher.onclick=()=>toggleLauncher(launchpad.hidden);
document.querySelector('#app-search').oninput=e=>document.querySelectorAll('#apps button').forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(e.target.value.toLowerCase()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!launchpad.hidden)toggleLauncher(false);});
document.querySelector('#minimize-window').onclick=()=>{windowEl.hidden=true;launcher.focus();};
document.querySelector('#close-window').onclick=()=>{windowEl.hidden=true;toggleLauncher(true);};
document.querySelector('#maximize-window').onclick=e=>{const full=windowEl.classList.toggle('maximized');e.currentTarget.setAttribute('aria-label',full?'Restore window size':'Maximize window');};
function notice(message) { const el=document.createElement('p');el.className='notice';el.setAttribute('role','status');el.textContent=message;content.append(el); }
function load(){try{items=parseLists(localStorage.getItem('olli.lists'));}catch{items=[];}}
function save(){try{localStorage.setItem('olli.lists',JSON.stringify(items));return true;}catch{notice('Browser storage is unavailable. Changes are only kept for this session.');return false;}}
function render(){
 const feature=features.find(f=>f.id===active);
 document.querySelector('#window-title').textContent=feature.name;
 document.querySelectorAll('[data-app]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.app===active)));
 content.replaceChildren();
 const label=document.createElement('p');label.className='eyebrow';label.textContent='YOUR OLLI WORKSPACE';
 const heading=document.createElement('h2');heading.textContent=active==='chat'?'What shall we do today?':feature.name;
 const desc=document.createElement('p');desc.className='description';desc.textContent=feature.description;content.append(label,heading,desc);
 if(active==='lists'){renderLists();return;}
 const card=document.createElement('div');card.className='card';
 const title=document.createElement('h3');title.textContent=active==='chat'?'Your workspace is ready. Your AI is not connected.':'Connection required';
 const p=document.createElement('p');p.textContent=active==='payments'?'Payment links and receipts are planned. No charges, purchases or card processing are available.':'This feature is part of Olli’s agreed scope, but its service is not connected in this fresh build.';
 card.append(title,p);content.append(card);
 if(active==='chat'){
 const form=document.createElement('form');const input=document.createElement('textarea');input.placeholder='Connect an AI provider before sending a message';input.setAttribute('aria-label','Message Olli');input.disabled=true;const button=document.createElement('button');button.textContent='Not connected';button.disabled=true;form.append(input,button);content.append(form);
 }
 notice('No API calls or code execution are enabled. Secrets must never be entered in chat.');
}
function renderLists(){
 const form=document.createElement('form');form.className='list-form';const input=document.createElement('input');input.placeholder='Add something to your list';input.setAttribute('aria-label','New list item');input.maxLength=500;input.required=true;const add=document.createElement('button');add.textContent='Add item';form.append(input,add);form.onsubmit=e=>{e.preventDefault();const text=input.value.trim();if(!text)return;if(items.length>=500){notice('This list is limited to 500 items.');return;}items.push({text,done:false});render();save();content.querySelector('input').focus();};content.append(form);
 const ul=document.createElement('ul');ul.className='list';items.forEach((item,index)=>{const li=document.createElement('li');const label=document.createElement('label');const check=document.createElement('input');check.type='checkbox';check.checked=item.done;check.onchange=()=>{items[index].done=check.checked;save();};const text=document.createElement('span');text.textContent=item.text;label.append(check,text);const remove=document.createElement('button');remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+item.text);remove.onclick=()=>{items.splice(index,1);render();save();};li.append(label,remove);ul.append(li);});content.append(ul);if(!items.length)notice('Your list is empty. Add your first item above.');notice('Local to this browser—not an account or cloud backup.');
}
for(const f of features){const button=document.createElement('button');button.dataset.app=f.id;button.dataset.label=f.name;const icon=document.createElement('img');icon.src='/src/assets/icons/'+f.icon+'.svg';icon.alt='';icon.width=24;icon.height=24;const name=document.createElement('span');name.textContent=f.name;button.append(icon,name);button.onclick=()=>openApp(f.id);document.querySelector('#apps').append(button);const dockButton=button.cloneNode(true);dockButton.title=f.name;dockButton.setAttribute('aria-label',f.name);dockButton.onclick=()=>openApp(f.id);document.querySelector('#dock').append(dockButton);}
document.querySelector('#status').onclick=()=>{notice(executionStatus().reason);content.focus();};load();render();
