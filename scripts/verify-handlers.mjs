import ts from 'typescript';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const load=async name=>{const source=await readFile('app/api/'+name+'/route.ts','utf8');const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));};
const results=[];const originalFetch=globalThis.fetch;const envKeys=['NEWSLETTER_ENDPOINT','CONTACT_ENDPOINT','STORE_LOCATOR_ENDPOINT','FORMS_API_KEY'];const old=Object.fromEntries(envKeys.map(k=>[k,process.env[k]]));
const post=(value)=>new Request('https://moving.test/api/test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
try{
 const newsletter=await load('newsletter'),contact=await load('contato'),stores=await load('revendedores');
 process.env.NEWSLETTER_ENDPOINT='https://integration.test/newsletter';process.env.CONTACT_ENDPOINT='https://integration.test/contact';process.env.STORE_LOCATOR_ENDPOINT='https://integration.test/stores';
 globalThis.fetch=async()=>Response.json({accepted:true});
 assert.equal((await newsletter.POST(post({email:'qa@example.com',consent:true}))).status,200);results.push('Newsletter confirma apenas com sucesso do serviço');
 assert.equal((await newsletter.POST(post({email:'qa@example.com',consent:false}))).status,400);results.push('Newsletter exige consentimento');
 assert.equal((await contact.POST(post({name:'Teste',email:'qa@example.com',message:'Mensagem apenas para teste local.',consent:true}))).status,200);results.push('Contato confirma sucesso real do transporte simulado');
 assert.equal((await contact.POST(post({name:'X',email:'x',message:'curta',consent:true}))).status,400);results.push('Contato rejeita entrada inválida');
 globalThis.fetch=async()=>new Response('',{status:500});assert.equal((await newsletter.POST(post({email:'qa@example.com',consent:true}))).status,502);results.push('Falha do provedor não vira sucesso');
 globalThis.fetch=async()=>Response.json({stores:[]});let r=await stores.GET(new Request('https://moving.test/api/revendedores?cep=01454901'));assert.deepEqual(await r.json(),{stores:[]});results.push('Localizador distingue resultado vazio');
 globalThis.fetch=async()=>Response.json({stores:[{name:'Fixture de teste',address:'Endereço somente de teste',url:'javascript:alert(1)'}]});r=await stores.GET(new Request('https://moving.test/api/revendedores?cep=01454901'));assert.deepEqual(await r.json(),{stores:[{name:'Fixture de teste',address:'Endereço somente de teste'}]});results.push('Localizador retorna registros e rejeita URL insegura');
 globalThis.fetch=async()=>Response.json({unexpected:true});assert.equal((await stores.GET(new Request('https://moving.test/api/revendedores?cep=01454901'))).status,502);results.push('Contrato incorreto do localizador resulta em erro');
 await writeFile('docs/handler-checks.json',JSON.stringify({passed:results.length,checks:results,externalRequests:0},null,2));console.log(JSON.stringify({passed:results.length,externalRequests:0}));
}finally{globalThis.fetch=originalFetch;for(const k of envKeys){if(old[k]===undefined)delete process.env[k];else process.env[k]=old[k];}}
