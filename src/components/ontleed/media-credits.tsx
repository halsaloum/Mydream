import { ArrowUpRight, Film } from 'lucide-react';
import { LESSON_VIDEOS } from '@/content/ontleed/media';

export function MediaCredits() {
  return <section className="o-media-credits" aria-labelledby="o-media-credits-title">
    <span className="o-eyebrow">BEELD BIJ DE UITLEG</span>
    <h2 id="o-media-credits-title">Verder kijken.</h2>
    <p>Deze Nederlandstalige video’s staan als extra uitleg bij passende lessen. Elke video heeft een kijkvraag om het verband met je eigen voorbeeld te leggen. De oorspronkelijke makers blijven bij de video’s vermeld.</p>
    <ul className="o-video-source-list">{LESSON_VIDEOS.map(video => <li key={video.id}>
      <Film size={19} aria-hidden="true"/>
      <a href={video.watchUrl} target="_blank" rel="noreferrer"><span>{video.title}<small>{video.creator} · YouTube</small></span><ArrowUpRight size={17} aria-hidden="true"/></a>
    </li>)}</ul>
    <div className="o-illustration-credit">
      <h3>Illustraties met een herkenbare stijl</h3>
      <p>De illustraties bij Woord, Zin en Alinea zijn van <a href="https://undraw.co/" target="_blank" rel="noreferrer">Katerina Limpitsouni / unDraw</a>, gebruikt volgens de <a href="https://undraw.co/license" target="_blank" rel="noreferrer">unDraw-licentie</a>. Ze zijn lokaal opgeslagen en brengen lezen, leren en schrijven in beeld.</p>
    </div>
  </section>;
}
