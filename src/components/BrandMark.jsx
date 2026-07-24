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
          <span
            className="brand-mark-title"
            style={size !== "lg" && size !== "md" ? { fontSize: config.title } : undefined}
          >
            UnderbossHQ
          </span>
          {subtitle ? (
            <span
              className={
                size === "lg" ? "brand-mark-tagline" : "brand-mark-page-label"
              }
            >
              {subtitle}
            </span>
          ) : size === "lg" ? (
            <span className="brand-mark-tagline">Discord server management</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
