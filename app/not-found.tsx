import {MagneticButton} from '@/components/moving/shared';
import Link from 'next/link';
export default function NotFound(){return <main id="main" className="error-page"><span className="eyebrow">Esse caminho saiu do ritmo.</span><div className="error-code" aria-hidden="true">404</div><h1 className="display">VAMOS VOLTAR<br/>AO MOVIMENTO?</h1><p>A página que você procura não foi encontrada.</p><MagneticButton href="/produtos">Encontrar minha Moving</MagneticButton><Link href="/" className="text-link">Voltar ao início ↗</Link></main>;}
