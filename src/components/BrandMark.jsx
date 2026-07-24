import mascot from "../assets/brandMascot.js";

export default function BrandMark({
  size = "md",
  showName = true,
  subtitle = null,
  className = "",
}) {
  const sizes = {
    sidebar: { img: 48, title: "1.45rem" },
    sm: { img: 48, title: "1rem" },
    header: { img: 64, title: "2rem" },
    md: { img: 120, title: "1.25rem" },
    lg: { img: 200, title: "2.5rem" },
    hero: { img: 220, title: null },
  };

  const config = sizes[size] || sizes.md;
  const useClassTitleSize = size === "lg" || size === "md" || size === "hero";

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
          <span
            className="brand-mark-title"
            style={!useClassTitleSize ? { fontSize: config.title } : undefined}
          >
            UnderbossHQ
          </span>
          {subtitle ? (
            <span
              className={
                size === "hero" || size === "lg"
                  ? "brand-mark-tagline"
                  : "brand-mark-page-label"
              }
            >
              {subtitle}
            </span>
          ) : size === "lg" || size === "hero" ? (
            <span className="brand-mark-tagline">Gaming community server management</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
