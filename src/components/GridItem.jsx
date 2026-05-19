export default function GridItem({ children, style = {} }) {
  return (
    <div
      className="grid-item"
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  );
}
