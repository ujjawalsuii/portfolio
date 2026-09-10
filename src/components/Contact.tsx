import { ArrowUp, ArrowUpRight, Download, Github, Linkedin } from 'lucide-react'

export const Contact = () => (
  <section id="contact" className="contact-section">
    <div className="section-shell">
      <p className="mono">06 / Get in Touch</p>
      <div className="contact-heading"><h2>Let's Build<br />Something Great</h2><a href="mailto:ujjawalpratap1234@gmail.com" className="round-link" aria-label="Email Ujjawal"><ArrowUpRight size={42} strokeWidth={1} /></a></div>
      <div className="contact-details">
        <div><p>Whether you have a project in mind, want to collaborate, or just want to connect, I'm always open to discussing new opportunities.</p><a className="contact-email" href="mailto:ujjawalpratap1234@gmail.com">ujjawalpratap1234@gmail.com <ArrowUpRight size={23} /></a></div>
        <div className="contact-links">
          <a href="https://linkedin.com/in/ujjawalps2006" target="_blank" rel="noreferrer"><span><Linkedin size={18} />LinkedIn</span><ArrowUpRight size={20} /></a>
          <a href="https://github.com/ujjawalsuii" target="_blank" rel="noreferrer"><span><Github size={18} />GitHub</span><ArrowUpRight size={20} /></a>
          <a href={`${import.meta.env.BASE_URL}CV.pdf`} download><span><Download size={18} />Download Resume</span><ArrowUpRight size={20} /></a>
        </div>
      </div>
      <footer className="site-footer"><a className="wordmark" href="#home" aria-label="Ujjawal Pratap, home">u<span className="wordmark-slash">/</span>p.</a><p>"Discipline is the bridge between goals and accomplishment."</p><a href="#home" className="mono">Back to top <ArrowUp size={15} /></a></footer>
    </div>
  </section>
)
