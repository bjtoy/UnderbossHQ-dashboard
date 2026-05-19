export default function StatCard({ label, value }) {
  return (
    <div className="card">
      <h3>{label}</h3>
      <div className="value">{value ?? "—"}</div>
    </div>
  );
}
