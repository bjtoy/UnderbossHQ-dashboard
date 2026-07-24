const INGEST_URL =
  "http://127.0.0.1:7462/ingest/7a2235d5-10ce-41e6-9f5f-7af06973e277";
const SESSION_ID = "71ac38";

export function debugLog({
  location,
  message,
  data = {},
  hypothesisId = "",
  runId = "post-fix",
}) {
  const payload = {
    sessionId: SESSION_ID,
    runId,
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  };

  fetch(INGEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": SESSION_ID,
    },
    body: JSON.stringify(payload),
  }).catch(() => {});

  if (import.meta.env.DEV) {
    fetch("/__agent_debug_log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }
}
