import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Login from "./pages/Login";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Therapy from "./pages/Therapy";
import Game from "./pages/Game";
import Assistant from "./pages/Assistant";
import Progress from "./pages/Progress";
import Checkin from "./pages/Checkin";
import Patients from "./pages/Patients";
import Learn from "./pages/Learn";
import Lifestyle from "./pages/Lifestyle";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useState } from "react";

function Inner() {
  const { user, theme } = useApp();
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (!user) return <Login />;

  const pages = {
    dashboard: <Dashboard />,
    therapy: <Therapy />,
    game: <Game />,
    assistant: <Assistant />,
    progress: <Progress />,
    checkin: <Checkin />,
    patients: <Patients />,
    learn: <Learn />,
    lifestyle: <Lifestyle />,
    report: <Report />,
    settings: <Settings />,
    profile: <Profile />,
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${theme === "dark" ? "bg-[#020c12] text-[#c8e8f5]" : "bg-[#f0f6fa] text-[#1a3a4a]"}`}>
      <Topbar setActivePage={setActivePage} />
      <div className="flex flex-1 overflow-hidden">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-1 overflow-y-auto p-5">
          {pages[activePage] || <Dashboard />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}