import mascot from "../assets/images/underboss-mascot.png";

export default function BrandMark({ size = "md", showName = true, className = "" }) {
  const sizes = {
    sm: { img: 48, title: "1rem" },
    md: { img: 120, title: "1.25rem" },
    lg: { img: 200, title: "2.5rem" },
  };

  const config = sizes[size] || sizes.md;

  return (
    <div className={`brand-mark brand-mark-${size} ${className}`.trim()}>
      <img
        src={mascot}
        alt="UnderbossHQ mascot"
        className="brand-mark-image"
        width={config.img}
        height={config.img}
      />
      {showName && (
        <div className="brand-mark-text">
          <span className="brand-mark-title">UnderbossHQ</span>
          {size === "lg" && (
            <span className="brand-mark-tagline">TGM Bot Control Panel</span>
          )}
        </div>
      )}
    </div>
  );
}
