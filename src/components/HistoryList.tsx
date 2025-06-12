// src/components/HistoryList.jsx
import { useEffect, useState } from "react";
import { getHistory } from "../services/storage";
import type { History } from "../types/history";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HistoryList({ newLogTrigger }: { newLogTrigger: any }) {
  const [logs, setLogs] = useState<History[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const allLogs = await getHistory();
      setLogs(
        allLogs.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        )
      );
    };
    fetchLogs();
  }, [newLogTrigger]);

  return (
    <div className="p-4 mt-6 bg-gray-50 rounded-2xl shadow-inner">
      <h3 className="text-lg font-bold mb-3">Riwayat Menyusui</h3>
      {logs.length === 0 && <p>Belum ada catatan.</p>}
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="bg-white p-3 rounded-xl shadow-sm">
            <p>
              <strong>{log.side === "left" ? "Kiri" : "Kanan"}</strong> -{" "}
              {log.durationMinutes} menit
            </p>
            <p className="text-sm text-gray-500">
              {new Date(log.startTime).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
