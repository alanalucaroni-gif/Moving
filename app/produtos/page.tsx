import type {Metadata} from 'next';
import {ProductRail} from '@/components/moving/experience';
export const metadata:Metadata={title:'Produtos',description:'Explore as linhas Moving por sabor, formato e ritmo. Garrafas, latas e sachês para acompanhar seu dia.',alternates:{canonical:'/produtos'}};
export default function Page(){return <main id="main" className="page-enter"><h1 className="sr-only">Produtos Moving</h1><ProductRail full/></main>;}
