export default function Panel({ children, style = {} }) {
  return (
    <div
      className="card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
