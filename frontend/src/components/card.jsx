export default function Card({ title, subtitle, right, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle || right) && (
        <div className="cardTop">
          <div>
            {title && <h3 className="cardTitle">{title}</h3>}
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>

          {right && <div>{right}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
