/** Original DOM components using Olli's approved graphite visual system. */
export function element(tag,{className,text,attributes={}}={}){
 const node=document.createElement(tag);
 if(className)node.className=className;
 if(text!==undefined)node.textContent=text;
 for(const [key,value] of Object.entries(attributes))node.setAttribute(key,String(value));
 return node;
}
export function action(text,{onClick,disabled=false,label,type='button',variant='secondary'}={}){
 const button=element('button',{className:'olli-action olli-action--'+variant,text});
 button.type=type;button.disabled=disabled;
 if(label)button.setAttribute('aria-label',label);
 if(onClick)button.addEventListener('click',onClick);
 return button;
}
export function icon(name,{size=24}={}){
 if(!/^[a-z-]+$/.test(name))throw Error('Invalid local icon name');
 const img=element('img',{attributes:{src:'/src/assets/icons/'+name+'.svg',alt:'',width:size,height:size}});
 return img;
}
export function panel({title,description,iconName}={}){
 const node=element('section',{className:'card olli-panel'});
 if(iconName){const badge=element('span',{className:'olli-panel-icon',attributes:{'aria-hidden':'true'}});badge.append(icon(iconName));node.append(badge);}
 if(title)node.append(element('h3',{text:title}));
 if(description)node.append(element('p',{text:description}));
 return node;
}
export function status(text){return element('p',{className:'notice olli-status',text,attributes:{role:'status'}});}
export function field({label,placeholder='',multiline=false,value='',maxLength=500,disabled=false}={}){
 const node=element(multiline?'textarea':'input',{className:'olli-field',attributes:{'aria-label':label}});
 node.placeholder=placeholder;node.value=value;node.maxLength=maxLength;node.disabled=disabled;
 return node;
}
export function appButton(feature,onClick){
 const button=action('',{onClick,label:feature.name});button.className='olli-app';
 button.dataset.app=feature.id;button.dataset.label=feature.name;
 button.append(icon(feature.icon),element('span',{text:feature.name}));return button;
}
