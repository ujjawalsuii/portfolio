type Props = { number: string; label: string; title: string; meta?: string }
export const SectionHeading = ({ number, label, title, meta }: Props) => (
  <div className="section-heading">
    <p className="section-index mono"><span>{number}</span><span>{label}</span></p>
    <div className="section-heading-title"><h2>{title}</h2>{meta && <span className="mono">{meta}</span>}</div>
  </div>
)
