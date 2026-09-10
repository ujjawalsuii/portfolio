import { experiences } from '../data/portfolio'
import { SectionHeading } from './SectionHeading'

const kindLabels: Record<string, string> = { work: 'Professional', project: 'Project', leadership: 'Leadership' }
export const Experience = () => (
  <section className="experience-section section-shell content-section" id="experience">
    <SectionHeading number="03" label="Journey" title="Experience." meta="2024 — 2026" />
    <div className="experience-layout">
      <aside className="experience-aside"><span className="mono">The timeline</span><p>Discipline.<br />Then delivery.</p><div className="timeline-key mono"><span>Professional</span><span>Projects</span><span>Leadership</span></div><span className="aside-rule" /></aside>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <article className={`timeline-entry kind-${exp.kind}`} key={`${exp.title}-${exp.date}`}>
            <div className="timeline-meta mono"><span>{exp.date}</span><span className="kind-badge">{kindLabels[exp.kind]}</span>{exp.status === 'ongoing' && <span>Ongoing</span>}</div>
            <div className="timeline-title"><h3>{exp.title}</h3><span className="mono">{String(index + 1).padStart(2, '0')}</span></div>
            <p className="timeline-subtitle">{exp.subtitle}</p>
            <p className="timeline-description">{exp.desc}</p>
            <div className="tags">{exp.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  </section>
)
