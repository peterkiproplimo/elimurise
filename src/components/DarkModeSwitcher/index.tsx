import { selectDarkMode, setDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector, useAppDispatch } from "../../stores/hooks";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";

function Main() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);

  const setDarkModeClass = () => {
    const el = document.querySelectorAll("html")[0];
    darkMode ? el.classList.add("dark") : el.classList.remove("dark");
  };

  const switchMode = () => {
    dispatch(setDarkMode(!darkMode));
    localStorage.setItem("darkMode", (!darkMode).toString());
    setDarkModeClass();
  };

  setDarkModeClass();

  return (
    <>
      {/* BEGIN: Dark Mode Switcher */}
      <div
        className="fixed bottom-0 right-0 z-50 flex items-center justify-center w-12 h-12 mb-10 mr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl"
        onClick={switchMode}
      >
        <div
          className={clsx([
            "flex items-center justify-center w-full h-full transition-all duration-300",
            {
              "text-primary": !darkMode,
              "text-yellow-500": darkMode,
            },
          ])}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </div>
      </div>
      {/* END: Dark Mode Switcher */}
    </>
  );
}

export default Main;
