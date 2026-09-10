import { Hero } from './components/Hero'
import { About } from './components/About'
import { TechArsenal } from './components/TechArsenal'
import { Projects } from './components/Projects'
import { Gallery } from './components/Gallery'
import { Navigation } from './components/Navigation'
import { Experience } from './components/Experience'
import { Contact } from './components/Contact'
import { AlpineWorld } from './components/alpine/AlpineWorld'
import { SceneMotionProvider } from './components/alpine/SceneMotionProvider'

function App() {
  return <SceneMotionProvider>
    <a className="skip-link" href="#main">Skip to content</a>
    <AlpineWorld />
    <Navigation />
    <main id="main">
      <Hero />
      <Projects />
      <About />
      <Experience />
      <TechArsenal />
      <Gallery />
      <Contact />
    </main>
  </SceneMotionProvider>
}

export default App
