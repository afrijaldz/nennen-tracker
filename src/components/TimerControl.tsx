// src/components/TimerControl.jsx
import { useEffect, useRef, useState } from "react";
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
  const [startTime, setStartTime] = useState<Date | null>();
  const [duration, setDuration] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      const intervalId = intervalRef.current;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const handleStart = (selectedSide: "left" | "right") => {
    setSide(selectedSide);
    setStartTime(new Date());
    setDuration(null);
    setElapsedSeconds(0);
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStop = async () => {
    if (!startTime || !side) return;

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = null;

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
          <p className="mb-2">Mulai pada: {startTime.toLocaleTimeString()}</p>
          <p className="text-2xl font-mono mt-2">
            {formatDuration(elapsedSeconds)}
          </p>
          <button
            className="bg-green-600 text-white py-2 px-6 rounded-xl mt-3"
            onClick={handleStop}
          >
            Selesai
          </button>
        </div>
      )}
      {duration && (
        <p className="mt-4 text-green-700">Tersimpan: {duration} menit</p>
      )}
    </div>
  );
}
