// src/components/TimerControl.jsx
import { useEffect, useState } from "react";
import { saveHistory } from "../services/storage";
import { v4 as uuidv4 } from "uuid";
import type { History } from "../types/history";

function formatDuration(seconds: number): string {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TimerControl({ onNewLog }: { onNewLog: any }) {
  const [side, setSide] = useState<"left" | "right" | null>();
  const [startTime, setStartTime] = useState<Date | null>(() => {
    const savedTime = localStorage.getItem("startTime");
    return savedTime ? new Date(savedTime) : null;
  });
  const [duration, setDuration] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: number | undefined;

    if (startTime) {
      interval = setInterval(() => {
        const now = Date.now();

        setElapsedSeconds(
          Math.floor((now - new Date(startTime).getTime()) / 1000)
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime]);

  const handleStart = (selectedSide: "left" | "right") => {
    setSide(selectedSide);
    setStartTime(new Date());
    setDuration(null);

    localStorage.setItem("startTime", new Date().toISOString());
    localStorage.setItem("side", selectedSide);
  };

  const handleStop = async () => {
    if (!startTime || !side) return;

    const endTime = new Date();
    const minutes = Math.round(
      (endTime.getTime() - startTime.getTime()) / 60000
    );

    const log: History = {
      id: uuidv4(),
      side,
      startTime: startTime.toISOString(),
      durationMinutes: minutes,
    };

    await saveHistory(log);
    if (onNewLog) {
      onNewLog(log);
    }

    setSide(null);
    setStartTime(null);
    setDuration(minutes);
    setElapsedSeconds(0);
    localStorage.removeItem("startTime");
    localStorage.removeItem("side");
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4">Catatan Menyusui</h2>
      {!startTime ? (
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-xl"
            onClick={() => handleStart("left")}
          >
            Mulai Kiri
          </button>
          <button
            className="bg-pink-500 text-white py-2 px-4 rounded-xl"
            onClick={() => handleStart("right")}
          >
            Mulai Kanan
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">
            Menyusui di sisi:{" "}
            <strong>{side === "left" ? "Kiri" : "Kanan"}</strong>
          </p>
          <p className="mb-2">
            Mulai pada:{" "}
            {startTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              dayPeriod: "short",
            })}
          </p>
          <p className="text-2xl font-mono mt-2">
            {formatDuration(elapsedSeconds)}
          </p>
          <div className="flex justify-center items-center mt-4">
            <button
              className="bg-green-600 text-white py-2 px-6 rounded-xl grow cursor-pointer"
              onClick={handleStop}
            >
              Selesai
            </button>
            <button
              className="py-2 px-6 rounded-xl cursor-pointer"
              onClick={() => {
                setStartTime(null);
                setDuration(null);
                setElapsedSeconds(0);
                localStorage.removeItem("startTime");
                localStorage.removeItem("side");
              }}
            >
              <span className="text-xs text-gray-500 ml-2">Reset Timer</span>
            </button>
          </div>
        </div>
      )}

      {duration !== null && duration > 0 && (
        <div>
          <p className="mt-4 text-green-700">Tersimpan: {duration} menit</p>
        </div>
      )}
    </div>
  );
}
