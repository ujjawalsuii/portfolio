import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/portfolio'
import { SectionHeading } from './SectionHeading'

export const Projects = () => (
  <section className="projects-section section-shell content-section" id="projects">
    <SectionHeading number="01" label="Selected works" title="Projects." meta="07 / Selected works" />
    <div className="project-list">
      {projects.map((project, index) => (
        <a className={`project-row ${index === 0 ? 'project-featured' : ''}`} key={project.name} href={project.link} target="_blank" rel="noreferrer">
          <span className="project-number mono">{String(index + 1).padStart(2, '0')}</span>
          <div className="project-identity"><p className="project-subtitle mono">{project.subtitle}</p><h3>{project.name}</h3><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          <div className="project-description"><p>{project.desc}</p>{index === 0 && <span className="project-feature-note mono">Sole developer · Live production</span>}</div>
          <span className="project-arrow"><ArrowUpRight strokeWidth={1.3} size={30} /></span>
        </a>
      ))}
    </div>
  </section>
)
