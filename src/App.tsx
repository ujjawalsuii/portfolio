import { useState } from 'react'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { TechArsenal } from './components/TechArsenal'
import { Projects } from './components/Projects'
import { Gallery } from './components/Gallery'
import { Navigation } from './components/Navigation'
import { CustomCursor } from './components/CustomCursor'
import { Experience } from './components/Experience'
import { Contact } from './components/Contact'
import { LoadingScreen } from './components/LoadingScreen'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="app-container" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}>
        <CustomCursor />
        <Navigation />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <TechArsenal />
          <Gallery />
          <Contact />
        </main>
      </div>
    </>
  )
}

export default App
