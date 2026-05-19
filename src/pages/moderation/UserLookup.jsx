import { useState } from "react";
import { api } from "../../api/api";
import WarningsList from "./WarningsList";

export default function UserLookup() {
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  async function handleAction(type) {
    if (!userId) {
      setActionMessage("Enter a user ID first.");
      return;
    }

    setLoadingAction(true);
    setActionMessage("");

    let res;

    const payload = {
      userId,
      reason: reason || "No reason provided",
    };

    if (type === "warn") res = await api.bot.mod.warn(payload);
    if (type === "kick") res = await api.bot.mod.kick(payload);
    if (type === "ban") res = await api.bot.mod.ban(payload);

    if (!res || res.error) {
      setActionMessage(res?.error || "Action failed");
    } else {
      setActionMessage(`Successfully executed: ${type.toUpperCase()}`);
    }

    setLoadingAction(false);
  }

  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-xl font-bold mb-4 text-white">User Lookup</h1>

      {/* USER ID INPUT */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-300">Discord User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
          className="w-full p-2 bg-gray-800 border border-gray-700 text-gray-200"
        />
      </div>

      {/* REASON INPUT */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-300">Reason (optional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for action"
          className="w-full p-2 bg-gray-800 border border-gray-700 text-gray-200"
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => handleAction("warn")}
          disabled={loadingAction}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          Warn
        </button>

        <button
          onClick={() => handleAction("kick")}
          disabled={loadingAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Kick
        </button>

        <button
          onClick={() => handleAction("ban")}
          disabled={loadingAction}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
        >
          Ban
        </button>
      </div>

      {/* ACTION RESULT */}
      {actionMessage && (
        <div className="mb-4 text-sm text-gray-300">{actionMessage}</div>
      )}

      {/* WARNINGS LIST */}
      <WarningsList userId={userId} />
    </div>
  );
}
