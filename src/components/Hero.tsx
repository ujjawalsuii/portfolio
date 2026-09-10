import { ArrowDown, ArrowUpRight } from 'lucide-react'

export const Hero = () => (
  <section className="alpine-hero" id="home" aria-labelledby="hero-title">
    <div className="hero-scene">
      <div className="alpine-photo" aria-hidden="true">
        <picture>
          <source media="(max-width: 640px)" srcSet={`${import.meta.env.BASE_URL}alpine-original.jpeg`} />
          <img src={`${import.meta.env.BASE_URL}alpine-panorama.webp`} alt="" width="1672" height="941" fetchPriority="high" />
        </picture>
      </div>
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-scene-content section-shell">
        <div className="hero-topline mono"><span>Welcome / Portfolio</span><span>Computing Science<br />University of Alberta</span></div>
        <div className="alpine-title-block">
          <p className="hero-role mono"><span className="hero-rule" />The Architect<span className="hero-disciplines">AI / Systems / Web</span></p>
          <h1 id="hero-title"><span>UJJAWAL</span><span>PRATAP<span className="alpine-period">.</span></span></h1>
          <p className="hero-manifesto">Engineered with Discipline.<br /><span>Driven by Impact.</span></p>
        </div>
        <div className="hero-scene-footer">
          <p>Final-year Computing Science at the University of Alberta.<br /><span>Building high-performance systems with elite discipline.</span></p>
          <a href="#projects" className="hero-explore"><span className="mono">Explore the work</span><span className="round-link"><ArrowDown size={23} strokeWidth={1.25} /></span></a>
        </div>
        <span className="hero-side-note mono" aria-hidden="true">Absolute focus. Continuous improvement.</span>
      </div>
    </div>
    <div className="hero-proof section-shell">
      <div className="proof-strip">
        <a href="#experience"><strong>99<span>/100</span></strong><span className="mono">Lighthouse performance</span></a>
        <a href="#projects"><strong>Top 5</strong><span className="mono">TELUS hackathon</span></a>
        <a href="#about"><strong>$10,000</strong><span className="mono">Regional Excellence Scholarship</span></a>
        <a href="#about" className="proof-about"><span className="mono">The person<br />behind the work</span><ArrowUpRight size={23} strokeWidth={1.25} /></a>
      </div>
    </div>
  </section>
)
