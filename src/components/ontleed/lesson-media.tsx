'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, CirclePlay, Play, X } from 'lucide-react';
import type { LessonVideo } from '@/content/ontleed/media';
import './lesson-media.css';

export function LessonVideos({ videos }: { videos: readonly LessonVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.location.hash === '#lesvideo') sectionRef.current?.scrollIntoView({ block: 'start' });
  }, []);
  if (videos.length === 0) return null;
  return <section id="lesvideo" ref={sectionRef} className="o-lesson-videos" aria-labelledby={headingId}>
    <header className="o-lesson-videos-heading">
      <span className="o-lesson-videos-symbol" aria-hidden="true"><CirclePlay size={23}/></span>
      <div><h2 id={headingId}>Even meekijken</h2><p>Een andere uitleg bij wat je net onderzocht. Kijk wanneer het jou helpt.</p></div>
      <span className="o-video-optional">Optioneel</span>
    </header>
    <div className={`o-lesson-video-list ${activeId ? 'has-active-video' : ''}`}>
      {videos.map(video => <VideoCard key={video.id} video={video} active={activeId === video.id} onOpen={() => setActiveId(video.id)} onClose={() => setActiveId(null)}/>)}
    </div>
  </section>;
}

function VideoCard({ video, active, onOpen, onClose }: { video: LessonVideo; active: boolean; onOpen: () => void; onClose: () => void }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const titleId = useId();
  const previewRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (active) closeRef.current?.focus(); }, [active]);
  function closeVideo() {
    onClose();
    setTimeout(() => previewRef.current?.focus(), 0);
  }
  return <article className={`o-lesson-video ${active ? 'is-active' : ''}`} aria-labelledby={titleId}>
    {active ? <div className="o-video-open-player">
      <div className="o-video-player-top"><span>YouTube · {video.creator}</span><button type="button" className="o-video-close" ref={closeRef} onClick={closeVideo} aria-label="Video sluiten"><X size={16}/> Sluiten</button></div>
      <VideoFrame key={video.id} video={video}/>
    </div> : <button type="button" className="o-video-preview" ref={previewRef} onClick={onOpen} aria-label={`Bekijk ${video.title}`}>
      {!thumbnailFailed ? (
        // A remote publisher thumbnail stays remote; it is not copied into the app.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/mqdefault.jpg`} alt={`Videovoorbeeld: ${video.title}`} loading="lazy" decoding="async" onError={() => setThumbnailFailed(true)}/>
      ) : <span className="o-video-thumbnail-fallback">Video bekijken</span>}
      <span className="o-video-play" aria-hidden="true"><Play size={20} fill="currentColor"/></span>
      <span className="o-video-preview-caption" aria-hidden="true">Bekijk de uitleg</span>
    </button>}
    <div className="o-video-description">
      <p className="o-video-creator">{video.creator}<span aria-hidden="true"> · </span>YouTube</p>
      <h3 id={titleId}>{video.title}</h3>
      <p className="o-video-summary">{video.description}</p>
      <p className="o-video-focus-question"><strong>Let hierop</strong><span>{video.focusQuestion}</span></p>
      <a className="o-video-external" href={video.watchUrl} target="_blank" rel="noopener noreferrer">Open op YouTube <ArrowUpRight size={15}/></a>
      {active && <p className="o-video-fallback-note">Werkt de speler hier niet? Open de video via de link hierboven.</p>}
    </div>
  </article>;
}

function VideoFrame({ video }: { video: LessonVideo }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');
  return <div className="o-video-frame" aria-busy={status === 'loading'}>
    {status === 'failed' ? <div className="o-video-load-error" role="status"><CirclePlay size={32}/><strong>De speler kon niet worden geladen.</strong><span>Je kunt de video hieronder op YouTube openen.</span></div> : <>
      {status === 'loading' && <p className="o-video-loading" role="status">Videospeler laden…</p>}
      <iframe title={video.title} src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?rel=0`} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setStatus('loaded')} onErrorCapture={() => setStatus('failed')}/>
    </>}
  </div>;
}
