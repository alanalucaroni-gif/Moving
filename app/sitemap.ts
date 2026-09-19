import type {MetadataRoute} from 'next';
import {site} from '@/data/site';
import {products} from '@/data/products';
import articles from '@/data/articles.json';
export default function sitemap():MetadataRoute.Sitemap{return ['','/produtos','/a-moving','/quem-somos','/blog','/contato','/onde-comprar','/politicas-de-privacidade','/politicas-de-cookies','/como-comprar',...products.map(p=>'/produtos/'+p.slug),...articles.map(a=>'/blog/'+a.slug)].map(path=>({url:site.origin+path,changeFrequency:'monthly',priority:path===''?1:.7}));}
