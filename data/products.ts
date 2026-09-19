import source from './products-source.json';

export type FamilyId = 'hydro-pro-powder'|'hydro-protein'|'hydro-protein-pro'|'juice-protein'|'energy-pro'|'protein-booster';
export type Family = {id:FamilyId; name:string; short:string; rhythm:string; verb:string; description:string; color:string; attributes:string[]; format:string; amount:string; protein:string; photo:string;};
const lifestyle='/assets/moving/lifestyle/';
export const families:Family[] = [
 {id:'hydro-pro-powder',name:'Hydro Protein PRO Sachê',short:'Hydro PRO em pó',rhythm:'Para viver em movimento.',verb:'VIVER EM MOVIMENTO',description:'Proteína, creatina e eletrólitos. Uma fórmula 3 em 1, em um sachê leve que vai com você.',color:'#7BD84B',attributes:['20 g de proteína','3 g de creatina','Eletrólitos'],format:'Sachê',amount:'30 g',protein:'20 g',photo:lifestyle+'sache-cardbg.webp'},
 {id:'hydro-protein',name:'Hydro Protein',short:'Hydro Protein',rhythm:'Para manter o ritmo.',verb:'MANTER O RITMO',description:'Hidratação e proteína no mesmo movimento. Isotônico proteico, pronto para acompanhar seu dia.',color:'#38BFEF',attributes:['20 g de proteína','BCAA + eletrólitos','Zero açúcar','90 kcal em 500 ml'],format:'Garrafa',amount:'500 ml',protein:'20 g',photo:lifestyle+'hydro.webp'},
 {id:'hydro-protein-pro',name:'Hydro Protein PRO',short:'Hydro Protein PRO',rhythm:'Para ir além.',verb:'IR ALÉM',description:'Seu próximo movimento, com proteína, creatina e eletrólitos em uma só garrafa.',color:'#7857FF',attributes:['30 g de proteína','3 g de creatina','Eletrólitos','500 ml'],format:'Garrafa',amount:'500 ml',protein:'30 g',photo:lifestyle+'hydrow234w.webp'},
 {id:'juice-protein',name:'Juice Protein',short:'Juice Protein',rhythm:'Para seguir leve.',verb:'SEGUIR LEVE',description:'Suco proteico prebiótico. Sabor de fruta e praticidade para os pequenos cuidados da rotina.',color:'#FF6B22',attributes:['15 g de proteína','5,7 g de fibras prebióticas','Sem açúcar adicionado'],format:'Garrafa',amount:'300 ml',protein:'15 g',photo:lifestyle+'juice-bg.webp'},
 {id:'energy-pro',name:'Energy Pro',short:'Energy Pro',rhythm:'Para ligar o modo energia.',verb:'MODO ENERGIA',description:'O seu dia pede energia? Proteína e cafeína se encontram em uma bebida cheia de sabor.',color:'#F5E642',attributes:['15 g de proteína','100 mg de cafeína','Vitaminas do complexo B','Coenzima Q10 + BCAA'],format:'Lata',amount:'310 ml',protein:'15 g',photo:lifestyle+'675628873_122264217818138908_4832072219570380971_n-1.webp'},
 {id:'protein-booster',name:'Protein Booster',short:'Protein Booster',rhythm:'Para dar aquele boost.',verb:'DAR AQUELE BOOST',description:'Pronto para beber. Pronto para ir com você. Proteína e praticidade para o ritmo da vida real.',color:'#F33F78',attributes:['20 g de proteína','Coenzima Q10','BCAA','Vitaminas do complexo B'],format:'Lata',amount:'310 ml',protein:'20 g',photo:lifestyle+'proteinsfffr231.webp'},
];
export type Product = {slug:string;familyId:FamilyId;name:string;flavor:string;color:string;image:string;buyUrl:string|null;amount:string;format:string;protein:string;attributes:string[];reviewStatus:'source-verified';source:string;ingredients:null;nutrition:null;warnings:null;};
export function slugify(s:string){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
export function flavorColor(flavor:string){const f=slugify(flavor);if(/uva|acai/.test(f))return '#7857FF';if(/tangerina|laranja|pessego/.test(f))return '#FF6B22';if(/tropical|abacaxi/.test(f))return '#F5E642';if(/vermelhas|morango|pink|melancia/.test(f))return '#F33F78';return '#7BD84B';}
export const products:Product[]=source.filter(p=>p.flavor!=='Açaí').map(p=>{
 const familyId=p.image.split('/')[4] as FamilyId;const f=families.find(f=>f.id===familyId)!;
 const flavor=p.flavor==='Pink Limonade'?'Pink Lemonade':p.flavor;
 return {slug:familyId+'-'+slugify(flavor),familyId,name:f.name,flavor,color:flavorColor(flavor),image:p.image,buyUrl:familyId==='hydro-protein-pro'&&flavor==='Uva'?null:p.buyUrl,amount:f.amount,format:f.format,protein:f.protein,attributes:f.attributes,reviewStatus:'source-verified',source:'https://movingpro.com.br/',ingredients:null,nutrition:null,warnings:null};
});
export const getFamily=(id:FamilyId)=>families.find(f=>f.id===id)!;
export const familyProducts=(id:FamilyId)=>products.filter(p=>p.familyId===id);
export const heroProducts=[products.find(p=>p.familyId==='hydro-pro-powder'&&p.flavor==='Limão')!,products.find(p=>p.familyId==='hydro-protein-pro'&&p.flavor==='Tangerina')!,products.find(p=>p.familyId==='protein-booster'&&p.flavor==='Morango e Acerola')!];
