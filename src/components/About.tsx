import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { PortfolioImage } from './PortfolioImage'
import { profileIntro, profileParagraphs, topSkills } from '../data/profile'

export const About = () => (
  <section id="about" className="about-section">
    <div className="section-shell content-section">
      <SectionHeading number="02" label="The Architect" title="About Me." />
      <div className="about-layout">
        <figure data-depth className="about-photo"><PortfolioImage source="Me.jpg" alt="Ujjawal Pratap" loading="lazy" sizes="(max-width: 540px) 90vw, 30vw" /><figcaption className="mono">Ujjawal Pratap <span>↗</span></figcaption></figure>
        <div className="about-copy">
          <p className="about-intro">{profileIntro}</p>
          <div className="about-paragraphs">{profileParagraphs.map(paragraph => <p key={paragraph.slice(0, 30)}>{paragraph}</p>)}</div>
          <div className="about-top-skills"><h3 className="mono">Top skills</h3><ul>{topSkills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>
          <a className="text-link" href={`${import.meta.env.BASE_URL}CV.pdf`} download>Download Resume <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </div>
  </section>
)
