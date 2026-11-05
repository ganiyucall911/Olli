import {boundedText} from './chat.mjs';
export function createGitHubHandler({fetchImpl=fetch}={}){
 return async(req,res)=>{
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  if(req.method!=='GET'){send(405,{error:'GET required.'});return;}
  const url=new URL(req.url,'http://localhost');const repo=url.searchParams.get('repo')||'';
  if(!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.-]{1,100}$/.test(repo)||repo.split('/')[1]==='..'){send(400,{error:'Provide owner/repository.'});return;}
  const abort=new AbortController();const timer=setTimeout(()=>abort.abort(),8000);
  try{
   const r=await fetchImpl('https://api.github.com/repos/'+repo,{redirect:'error',signal:abort.signal,headers:{Accept:'application/vnd.github+json','User-Agent':'Olli-public-repository-reader','X-GitHub-Api-Version':'2022-11-28'}});
   if(!r.ok){if(r.body)void r.body.cancel().catch(()=>{});send(r.status===404?404:r.status===403||r.status===429?429:502,{error:r.status===404?'Public repository not found.':r.status===403||r.status===429?'GitHub allowance unavailable. Try later; no paid fallback.':'GitHub unavailable.'});return;}
   const data=JSON.parse(await boundedText(r.body,131072));
   if(data.private!==false||typeof data.full_name!=='string'){send(502,{error:'Invalid public repository response.'});return;}
   send(200,{repository:{name:data.full_name,description:typeof data.description==='string'?data.description.slice(0,2000):null,defaultBranch:data.default_branch,language:data.language,stars:data.stargazers_count,openIssues:data.open_issues_count,url:'https://github.com/'+repo},source:'GitHub public API',access:'public-read-only'});
  }catch{send(abort.signal.aborted?504:502,{error:'GitHub lookup unavailable.'});}finally{clearTimeout(timer);}
 };
}
