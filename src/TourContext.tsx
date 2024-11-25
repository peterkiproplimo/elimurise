import React, { createContext, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TourContext = createContext();

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
  const [runTour, setRunTour] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const steps = [
    {
      path: "/home",
      steps: [
        { target: ".home-step-1", content: "Welcome to the Home Page!" },
        { target: ".home-step-2", content: "Welcome to the Home Page!" },
      ],
    },
    {
      path: "/home/stream",
      steps: [
        { target: ".stream-step-1", content: "This is streams creation page." },
      ],
    },
    {
      path: "/home/settings",
      steps: [
        { target: ".setting-step-1", content: "Welcome to the settings Page!" },
      ],
    },
  ];

  const handleStepChange = (stepIndex) => {
    const step = steps[currentStepIndex];
    if (stepIndex === step.steps.length) {
      // Move to the next page
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
