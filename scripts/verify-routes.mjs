import { createRequire } from 'node:module';
import { readFile, stat, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(import.meta.resolve('wrangler'));
const { Miniflare } = require('miniflare');
const products = JSON.parse(await readFile('data/products-source.json','utf8'));
const articles = JSON.parse(await readFile('data/articles.json','utf8'));
const slug = s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const routes = ['/', '/produtos','/a-moving','/quem-somos','/blog','/contato','/onde-comprar','/politicas-de-privacidade','/politicas-de-cookies','/como-comprar',...products.filter(p=>p.flavor!=='Açaí').map(p=>'/produtos/'+p.image.split('/')[4]+'-'+slug(p.flavor==='Pink Limonade'?'Pink Lemonade':p.flavor)),...articles.map(a=>'/blog/'+a.slug)];
const mime={'.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm'};
const modulePaths=(await readdir('dist/server',{recursive:true})).filter(f=>f.endsWith('.js')).sort((a,b)=>a==='index.js'?-1:b==='index.js'?1:a.localeCompare(b));
const worker=new Miniflare({modules:modulePaths.map(f=>({type:'ESModule',path:path.resolve('dist/server',f)})),modulesRoot:path.resolve('dist/server'),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],serviceBindings:{ASSETS:async req=>{const url=new URL(req.url);const file=path.resolve('dist/client','.'+decodeURIComponent(url.pathname));if(!file.startsWith(path.resolve('dist/client')+path.sep))return new Response('',{status:404});try{const data=await readFile(file);return new Response(data,{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}});}catch{return new Response('',{status:404});}}}});
const results=[];
try {
 for(const route of routes){const response=await worker.dispatchFetch('http://moving.test'+route);const html=await response.text();const record={route,status:response.status,h1:(html.match(/<h1\b/g)||[]).length,main:html.includes('id="main"'),title:(html.match(/<title>(.*?)<\/title>/)||[])[1],bytes:html.length};results.push(record);if(response.status!==200||!record.main||record.h1!==1)console.log('FAIL',record,html.slice(0,500));}
 for(const route of ['/sitemap.xml','/robots.txt']){const r=await worker.dispatchFetch('http://moving.test'+route);results.push({route,status:r.status,expected:200});}
 const missing=await worker.dispatchFetch('http://moving.test/isso-nao-existe');results.push({route:'/isso-nao-existe',status:missing.status,expected:404});
 for(const [route,init,expected] of [
 ['/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'invalid',consent:true})},400],
 ['/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'qa@example.com',consent:true})},503],
 ['/api/contato',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'QA',email:'qa@example.com',message:'Teste sem envio externo.',consent:true})},503],
 ['/api/revendedores?cep=123',{},400],['/api/revendedores?cep=01454901',{},503]
 ]){const r=await worker.dispatchFetch('http://moving.test'+route,init);results.push({route,status:r.status,expected,message:await r.text()});}
 await mkdir('docs',{recursive:true});await writeFile('docs/route-checks.json',JSON.stringify(results,null,2));
 const failures=results.filter(r=>r.status!==(r.expected||200)||('h1'in r&&(r.h1!==1||!r.main)));
 console.log(JSON.stringify({routes:routes.length,checks:results.length,failures},null,2));process.exitCode=failures.length?1:0;
}finally{await worker.dispose();}
