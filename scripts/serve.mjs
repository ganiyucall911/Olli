import {createServer} from '../server/http.mjs';
createServer().listen(3018,'127.0.0.1',()=>console.log('Olli: http://127.0.0.1:3018'));
