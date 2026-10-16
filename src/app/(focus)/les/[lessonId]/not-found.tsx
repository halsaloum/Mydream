import Link from 'next/link';
import '@/components/ontleed/ontleed.css';
export default function RetiredLesson() { return <div className="ontleed o-focus"><main className="o-player-main"><div className="o-empty"><span className="o-eyebrow">EEN NIEUWE LEERLIJN</span><h1>Deze les heeft een nieuwe plek gekregen.</h1><p>De eerdere taallessen zijn vervangen. Ontdek de uitgebreide route van woord tot volle zin.</p><Link className="o-button" href="/lessen">Bekijk de nieuwe lessen</Link></div></main></div>; }
