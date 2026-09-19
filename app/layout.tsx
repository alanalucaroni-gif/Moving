import type { Metadata } from "next";
import "./globals.css";
import "./reference-home.css";
import {Header,Footer} from '@/components/moving/shared';
import {MotionProvider} from '@/components/moving/motion';
import {site} from '@/data/site';

export const metadata: Metadata = {
  metadataBase:new URL(site.origin),
  title:{default:'Moving — Qual é o seu ritmo de hoje?',template:'%s | Moving'},
  description:'Proteína, hidratação e sabor para acompanhar cada movimento. Encontre sua Moving entre seis linhas de bebidas funcionais.',
  openGraph:{title:'Moving — Qual é o seu ritmo de hoje?',description:'Proteína, hidratação e sabor para acompanhar cada movimento.',locale:'pt_BR',type:'website',siteName:'Moving'},
  icons: {
    icon: "/assets/moving/logo/icomoving.png",
    shortcut: "/assets/moving/logo/icomoving.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased"><MotionProvider><Header/>{children}<Footer/></MotionProvider><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:site.name,legalName:site.company,url:site.official,email:site.email,sameAs:site.social.map(s=>s.url),taxID:site.cnpj})}}/></body>
    </html>
  );
}
