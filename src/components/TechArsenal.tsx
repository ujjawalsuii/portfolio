import { skillCategories } from '../data/portfolio'
import { SectionHeading } from './SectionHeading'

export const TechArsenal = () => (
  <section className="skills-section section-shell content-section" id="skills">
    <SectionHeading number="04" label="Proficiency" title="Technical Arsenal." meta="06 / Disciplines" />
    <div className="skills-grid">
      {skillCategories.map((category, index) => (
        <article className="skill-category" key={category.title}>
          <div className="skill-category-top"><category.icon size={25} strokeWidth={1.25} /><span className="mono">{String(index + 1).padStart(2, '0')}</span></div>
          <h3>{category.title}</h3>
          <ul>{category.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </article>
      ))}
    </div>
  </section>
)
