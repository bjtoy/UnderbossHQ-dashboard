export default function NotAuthorized() {
  return (
    <div
      className="app-container"
      style={{
        textAlign: "center",
        marginTop: "120px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: "520px",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "var(--glow-purple)",
        }}
      >
        <h1
          className="header-title"
          style={{
            fontSize: "46px",
            marginBottom: "10px",
            textShadow: "none",
          }}
        >
          Access Denied
        </h1>

        <p
          style={{
            marginTop: "10px",
            marginBottom: "30px",
            color: "var(--text-secondary)",
            textShadow: "none",
            fontSize: "16px",
          }}
        >
          You don’t have permission to view this page.
        </p>

        <a
          href="/"
          className="btn"
          style={{
            padding: "12px 28px",
            fontSize: "15px",
            display: "inline-block",
          }}
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
