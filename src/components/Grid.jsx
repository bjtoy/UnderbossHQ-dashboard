export default function Grid({ children, style = {} }) {
  return (
    <div
      className="dashboard-grid"
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  );
}
