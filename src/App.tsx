import { Hero } from './components/Hero'
import { Showcase } from './components/showcase/Showcase'
import { About } from './components/About'
import { TechArsenal } from './components/TechArsenal'
import { Projects } from './components/Projects'
import { Gallery } from './components/Gallery'
import { Navigation } from './components/Navigation'
import { Experience } from './components/Experience'
import { Contact } from './components/Contact'

function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation />
    <main id="main">
      <Hero />
      <Projects />
      <About />
      <Experience />
      <TechArsenal />
      <Showcase />
      <Gallery />
      <Contact />
    </main>
  </>
}

export default App
