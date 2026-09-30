import { useCallback, useEffect, useState } from 'react'
import { slides } from './slides'

function Visual({ v }: { v: { label: string; caption: string; img: string } }) {
  const [ok, setOk] = useState(true)
  return (
    <figure className="visual">
      {ok ? <img src={`/figures/${v.img}`} alt={`${v.label}: ${v.caption}`} onError={() => setOk(false)} />
          : <div className="ph" role="img" aria-label={`Placeholder for ${v.label}`}>[ {v.label} ]</div>}
      <figcaption><strong>{v.label}.</strong> {v.caption}</figcaption>
    </figure>
  )
}

export default function App() {
  const [i, setI] = useState(0)
  const go = useCallback((d: number) => setI(n => Math.min(slides.length - 1, Math.max(0, n + d))), [])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) go(1)
      if (['ArrowLeft', 'PageUp'].includes(e.key)) go(-1)
      if (e.key === 'Home') setI(0)
      if (e.key === 'End') setI(slides.length - 1)
      if (e.key === 'f') document.documentElement.requestFullscreen?.()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [go])
  const s = slides[i]
  return (
    <main className="deck">
      <div className="ref">Reference: {s.ref}</div>
      <section key={i} className="slide fade" aria-live="polite">
        <h1>{s.title}</h1>
        <div className={s.visual ? 'body two' : 'body'}>
          <ul>{s.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          {s.visual && <Visual v={s.visual} />}
        </div>
      </section>
      <footer>
        <button onClick={() => go(-1)} disabled={i === 0} aria-label="Previous slide">Previous</button>
        <span>{i + 1} / {slides.length}</span>
        <button onClick={() => go(1)} disabled={i === slides.length - 1} aria-label="Next slide">Next</button>
      </footer>
      <div className="bar" style={{ width: `${((i + 1) / slides.length) * 100}%` }} />
    </main>
  )
}
