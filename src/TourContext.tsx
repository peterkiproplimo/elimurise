import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Define the context type
type TourContextType = {
  runTour: boolean;
  setRunTour: (value: boolean) => void;
  currentStepIndex: number;
  currentSteps: { target: string; content: string }[];
  handleStepChange: (stepIndex: number) => void;
};

// Create the context with a default value of null
const TourContext = createContext<TourContextType | null>(null);

// Hook to use the context
export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};

// TourProvider component
export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [runTour, setRunTour] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    {},
    // {
    //   path: "/home",
    //   steps: [
    //     { target: ".home-step-1", content: "Welcome to the Home Page!" },
    //     {
    //       target: ".home-step-2",
    //       content: "Here you can view recent activity.",
    //     },
    //   ],
    // },
    // {
    //   path: "/home/stream",
    //   steps: [
    //     {
    //       target: ".stream-step-1",
    //       content: "This is the streams creation page.",
    //     },
    //   ],
    // },
    // {
    //   path: "/home/settings",
    //   steps: [
    //     { target: ".setting-step-1", content: "Welcome to the settings page!" },
    //   ],
    // },
  ];

  const handleStepChange = (stepIndex: number) => {
    const step = steps[currentStepIndex];
    if (stepIndex === step.steps.length) {
      const nextIndex = currentStepIndex + 1;
      if (steps[nextIndex]) {
        setCurrentStepIndex(nextIndex);
        navigate(steps[nextIndex].path);
      } else {
        setRunTour(false); // End the tour
      }
    }
  };

  return (
    <TourContext.Provider
      value={{
        runTour,
        setRunTour,
        currentStepIndex,
        currentSteps:
          steps.find((s) => s.path === location.pathname)?.steps || [],
        handleStepChange,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
