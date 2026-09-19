import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {products} from '@/data/products';
import {site} from '@/data/site';
import {ProductDetail} from '@/components/moving/product-detail';
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return products.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const p=products.find(p=>p.slug===slug);if(!p)return {title:'Produto não encontrado'};return {title:p.name+' — '+p.flavor,description:p.name+', '+p.flavor+', '+p.amount+'. '+p.attributes.join('. ')+'.',alternates:{canonical:'/produtos/'+slug},openGraph:{title:p.name+' — '+p.flavor,description:p.attributes.join(' · ')}};}
export default async function Page({params}:Props){const {slug}=await params;const p=products.find(p=>p.slug===slug);if(!p)notFound();return <main id="main" className="page-enter"><ProductDetail product={p}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.name+' — '+p.flavor,image:site.origin+p.image,description:p.attributes.join(', '),brand:{'@type':'Brand',name:'Moving'},url:site.origin+'/produtos/'+p.slug,additionalProperty:[{'@type':'PropertyValue',name:'Conteúdo',value:p.amount},{'@type':'PropertyValue',name:'Sabor',value:p.flavor}]})}}/></main>;}
