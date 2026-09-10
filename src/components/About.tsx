import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { PortfolioImage } from './PortfolioImage'

export const About = () => (
  <section id="about" className="about-section">
    <div className="section-shell content-section">
      <SectionHeading number="02" label="The Architect" title="About Me." />
      <div className="about-layout">
        <figure className="about-photo"><PortfolioImage source="Me.jpg" alt="Ujjawal Pratap" loading="lazy" sizes="(max-width: 540px) 90vw, 30vw" /><figcaption className="mono">Ujjawal Pratap <span>↗</span></figcaption></figure>
        <div className="about-copy">
          <p className="about-intro">I'm a final-year Computing Science student at the <strong>University of Alberta</strong>, on a <strong>$10,000 Regional Excellence Scholarship</strong>&nbsp;— but my journey isn't just about code.</p>
          <div className="about-paragraphs">
            <p>I've shipped production software for a paying client as sole developer, and placed <strong>top 5 at the TELUS hackathon</strong> building an AI health platform.</p>
            <p>Whether optimizing a C-based Ray Tracer or pushing for a <strong>225lb bench press</strong>, I apply the same philosophy: absolute focus and continuous improvement.</p>
            <p>Influenced by the mentality of greats like Ronaldo and Verstappen, I believe in speed, precision, and resilience.</p>
          </div>
          <div className="about-values">
            <div><span className="mono">01 / The Mindset</span><p>I solve problems with the intensity of a competitor.</p></div>
            <div><span className="mono">02 / The Mission</span><p>Leverage technology to support my family and build real value.</p></div>
            <div><span className="mono">03 / The Balance</span><p>Sim Racing, photography, and the gym.</p></div>
          </div>
          <a className="text-link" href={`${import.meta.env.BASE_URL}CV.pdf`} download>Download Resume <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </div>
  </section>
)
