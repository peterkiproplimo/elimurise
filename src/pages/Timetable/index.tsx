// App.tsx
import * as ApiService from "../../services/auth";
import React, { useState } from "react";
import Timetable from "./Timetable";
import TimeSlots from "./TimeSlots";
import SpecialPrograms from "./SpecialPrograms"; // Import the new component

function App() {
  const [activeTab, setActiveTab] = useState("timetable");
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300 font-sans`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Timetable Management
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("timetable")}
                className={`py-4 px-6 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "timetable"
                    ? "border-b-2 border-teal-500 text-teal-600 dark:text-teal-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Timetable
              </button>
              <button
                onClick={() => setActiveTab("timeslots")}
                className={`py-4 px-6 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "timeslots"
                    ? "border-b-2 border-teal-500 text-teal-600 dark:text-teal-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Time Slots
              </button>
              <button
                onClick={() => setActiveTab("specialprograms")}
                className={`py-4 px-6 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "specialprograms"
                    ? "border-b-2 border-teal-500 text-teal-600 dark:text-teal-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Special Programs
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "timetable" && (
              <div className="animate-fade-in">
                <Timetable />
              </div>
            )}
            {activeTab === "timeslots" && (
              <div className="animate-fade-in">
                <TimeSlots />
              </div>
            )}
            {activeTab === "specialprograms" && (
              <div className="animate-fade-in">
                <SpecialPrograms />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
