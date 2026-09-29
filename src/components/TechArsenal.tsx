import { SectionHeading } from './SectionHeading'
import { stackCategories, stackRoles, stratumOf } from './alpine/route'

// Categories read surface to bedrock, matching the strata of the exploded mountain beside them.
export const TechArsenal = () => (
  <section className="skills-section section-shell content-section" id="skills">
    <SectionHeading number="04" label="Proficiency" title="Technical Arsenal." meta="06 / Disciplines" />
    <p className="skills-stack-note mono">The stack, surface to bedrock.<br /><span>Hover a layer to trace it.</span></p>
    <div className="skills-grid">
      {stackCategories.map(category => {
        const layer = stratumOf(category.title)
        return <article data-depth data-stratum={layer} className="skill-category" key={category.title}>
          <div className="skill-category-top"><category.icon size={25} strokeWidth={1.25} /><span className="mono">Layer {String(layer + 1).padStart(2, '0')} · {stackRoles[layer]}</span></div>
          <h3>{category.title}</h3>
          <ul>{category.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </article>
      })}
    </div>
  </section>
)
