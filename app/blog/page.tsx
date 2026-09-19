import type {Metadata} from 'next';
import {BlogPreview} from '@/components/moving/journal';
export const metadata:Metadata={title:'Conteúdos',description:'Movimento, nutrição, rotina e novidades. Conteúdos do universo Moving.',alternates:{canonical:'/blog'}};
export default function Page(){return <main id="main" className="page-enter"><section className="internal-hero"><span className="eyebrow">Conteúdo para acompanhar você.</span><h1 className="display">ENTRE UM RITMO<br/>E OUTRO, INSPIRE-SE.</h1><p>Movimento, nutrição e novidades da Moving.</p></section><BlogPreview full/></main>;}
