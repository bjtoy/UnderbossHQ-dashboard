export default function Table({
  columns = [],
  data = [],
  renderRow = null,
  style = {},
}) {
  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        background: "#0d0d0d",
        ...style,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "600px",
        }}
      >
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--red-neon)",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "14px",
                }}
              >
                No data available
              </td>
            </tr>
          )}

          {data.length > 0 &&
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  background:
                    rowIndex % 2 === 0
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.06)",
                }}
              >
                {renderRow ? (
                  renderRow(row)
                ) : (
                  row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        padding: "12px 14px",
                        fontSize: "14px",
                        color: "#fff",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cell}
                    </td>
                  ))
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
