import type {Metadata} from 'next';
import {ProductRail,AboutPreview,SocialWall} from '@/components/moving/experience';
import {RhythmChapters,FlowManifesto,RhythmStudio} from '@/components/moving/reference-home';
import {LiquidOpening} from '@/components/moving/liquid-opening';
import {StoreLocator,Newsletter} from '@/components/moving/conversion';
import {BlogPreview} from '@/components/moving/journal';
import {FAQAccordion} from '@/components/moving/shared';
export const metadata:Metadata={alternates:{canonical:'/'}};
export default function Home(){return <main id="main" className="page-enter moving-editorial"><LiquidOpening/><RhythmChapters/><FlowManifesto/><RhythmStudio/><ProductRail/><AboutPreview/><SocialWall/><StoreLocator/><BlogPreview/><Newsletter/><FAQAccordion/></main>;}
