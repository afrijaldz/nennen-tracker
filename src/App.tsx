// src/App.jsx
import { useState } from "react";
import TimerControl from "./components/TimerControl";
import HistoryList from "./components/HistoryList";

function App() {
  const [newLog, setNewLog] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-md mx-auto relative">
      <h1 className="text-2xl font-bold text-center mb-6">Aplikasi Menyusui</h1>
      <TimerControl onNewLog={setNewLog} />
      <div className="mb-20">
        <HistoryList newLogTrigger={newLog} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-lg ">
        <footer className="text-center text-gray-500 text-xs">
          v.0.0.4 &copy; {new Date().getFullYear()} Aplikasi Menyusui
        </footer>
        <div className="text-center text-xs text-gray-500 mt-1 ">
          Made with ❤️ by Ijul
        </div>
      </div>
    </div>
  );
}

export default App;
