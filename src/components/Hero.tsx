import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { PortfolioImage } from './PortfolioImage'

export const Hero = () => (
  <section className="hero section-shell" id="home" aria-labelledby="hero-title">
    <div className="hero-topline mono"><span>Welcome / Portfolio</span><span>Computing Science · University of Alberta</span></div>
    <div className="hero-composition">
      <div className="hero-type">
        <p className="hero-role mono">The Architect <span aria-hidden="true">+</span> AI / Systems / Web</p>
        <h1 id="hero-title"><span>UJJAWAL</span><span>PRATAP<span className="name-period">.</span></span></h1>
        <div className="hero-statement"><p>Engineered with Discipline.<br /><span>Driven by Impact.</span></p><a href="#projects" className="round-link" aria-label="Explore projects"><ArrowDown size={28} strokeWidth={1.5} /></a></div>
      </div>
      <figure className="hero-portrait">
        <div className="portrait-image"><PortfolioImage source="Me.jpg" alt="Ujjawal Pratap" fetchPriority="high" sizes="(max-width: 540px) 29vw, 30vw" /><span className="portrait-corner" aria-hidden="true">↗</span></div>
        <figcaption className="mono"><span>Ujjawal Pratap</span><span>01 / The person</span></figcaption>
      </figure>
    </div>
    <div className="hero-bottom"><p>Final-year Computing Science at the University of Alberta.<br /><span>Building high-performance systems with elite discipline.</span></p><a className="text-link" href="#about">Explore <ArrowUpRight size={18} /></a></div>
    <div className="proof-strip">
      <a href="#experience"><strong>99<span>/100</span></strong><span className="mono">Lighthouse performance</span></a>
      <a href="#projects"><strong>Top 5</strong><span className="mono">TELUS hackathon</span></a>
      <a href="#about"><strong>$10,000</strong><span className="mono">Regional Excellence Scholarship</span></a>
      <span className="proof-note mono">Absolute focus.<br />Continuous improvement.<ArrowDown size={20} /></span>
    </div>
  </section>
)
