import {panel,status,action,field,appButton} from './components/ui.js';
import {renderLocalChat} from './local-chat.js';
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
function notice(message) { content.append(status(message)); }
function load(){try{items=parseLists(localStorage.getItem('olli.lists'));}catch{items=[];}}
function save(){try{localStorage.setItem('olli.lists',JSON.stringify(items));return true;}catch{notice('Browser storage is unavailable. Changes are only kept for this session.');return false;}}
function render(){
 const feature=features.find(f=>f.id===active);
 document.querySelector('#window-title').textContent=feature.name;
 document.querySelectorAll('[data-app]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.app===active)));
 content.replaceChildren();
 content.dataset.view=active;
 const label=document.createElement('p');label.className='eyebrow';label.textContent='YOUR OLLI WORKSPACE';
 const heading=document.createElement('h2');heading.textContent=active==='chat'?'What shall we do today?':feature.name;
 const desc=document.createElement('p');desc.className='description';desc.textContent=feature.description;content.append(label,heading,desc);
 if(active==='lists'){renderLists();return;}
 if(active==='chat'){renderLocalChat(content);return;}
 const card=panel({title:'Connection required',iconName:feature.icon,description:active==='payments'?'Payment links and receipts are planned. No charges, purchases or card processing are available.':'This feature is part of Olli’s agreed scope, but its service is not connected in this fresh build.'});
 content.append(card);
 notice('No API calls or code execution are enabled. Secrets must never be entered in chat.');
}
function renderLists(){
 const form=document.createElement('form');form.className='list-form';const input=field({label:'New list item',placeholder:'Add something to your list'});input.required=true;const add=action('Add item',{type:'submit',variant:'primary'});form.append(input,add);form.onsubmit=e=>{e.preventDefault();const text=input.value.trim();if(!text)return;if(items.length>=500){notice('This list is limited to 500 items.');return;}items.push({text,done:false});render();save();content.querySelector('input').focus();};content.append(form);
 const ul=document.createElement('ul');ul.className='list';items.forEach((item,index)=>{const li=document.createElement('li');const label=document.createElement('label');const check=document.createElement('input');check.type='checkbox';check.checked=item.done;check.onchange=()=>{items[index].done=check.checked;save();};const text=document.createElement('span');text.textContent=item.text;label.append(check,text);const remove=action('Remove',{label:'Remove '+item.text});remove.onclick=()=>{items.splice(index,1);render();save();};li.append(label,remove);ul.append(li);});content.append(ul);if(!items.length)notice('Your list is empty. Add your first item above.');notice('Local to this browser—not an account or cloud backup.');
}
for(const f of features){
 document.querySelector('#apps').append(appButton(f,()=>openApp(f.id)));
 const dockButton=appButton(f,()=>openApp(f.id));dockButton.title=f.name;document.querySelector('#dock').append(dockButton);
}
document.querySelector('#status').onclick=()=>{notice(executionStatus().reason);content.focus();};load();render();

if('serviceWorker' in navigator && window.isSecureContext){navigator.serviceWorker.register('/sw.js').catch(()=>{/* Offline installation unavailable; normal online use remains available. */});}
