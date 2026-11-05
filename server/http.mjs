import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createGitHubHandler} from './github.mjs';
import {createChatHandler} from './chat.mjs';
export function createServer({root=process.cwd(),chat=createChatHandler(),github=createGitHubHandler()}={}) {
  root=path.resolve(root);
  const server=http.createServer(async(req,res)=>{
    try {
      const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(name==='/api/github/repository'){await github(req,res);return;}
      if(name==='/api/chat'){await chat(req,res);return;}
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
      // Serve only frontend assets: never expose server modules, tests or secrets.
      if(name!=='/'&&name!=='/index.html'&&!/^\/src\/[a-zA-Z0-9_./-]+\.(js|css|svg)$/.test(name)){res.writeHead(404).end();return;}
      const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
      if(!file.startsWith(root+path.sep)){res.writeHead(404).end();return;}
      const data=await readFile(file);
      res.setHeader('Content-Type',file.endsWith('.svg')?'image/svg+xml':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');
      res.setHeader('X-Content-Type-Options','nosniff');res.end(req.method==='HEAD'?undefined:data);
    }catch{res.writeHead(404).end();}
  });
  server.requestTimeout=20000;server.headersTimeout=10000;
  return server;
}
