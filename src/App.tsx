// src/App.jsx
import { useState } from "react";
import TimerControl from "./components/TimerControl";
import HistoryList from "./components/HistoryList";

function App() {
  const [newLog, setNewLog] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Aplikasi Menyusui</h1>
      <TimerControl onNewLog={setNewLog} />
      <HistoryList newLogTrigger={newLog} />
    </div>
  );
}

export default App;
