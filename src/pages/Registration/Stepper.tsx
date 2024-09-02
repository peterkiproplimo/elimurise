import React, { useEffect, useState } from "react";
import "./stepper.css";
import { TiTick } from "react-icons/ti";
import Register from "./register_account";
import SchoolInfo from "./school_info";
import Button from "../../base-components/Button";
import Packages from "./packages";
import Payment from "./payments";
const Stepper = () => {
  const steps = ["Personal Info", "Pricing Packages", "School Info", "Payment"];

  const [currentStep, setCurrentStep] = useState(1);
  useEffect(() => {
    const setStep = () => {
      const item = localStorage.getItem("step");
      if (item) {
        setCurrentStep(Number(item));
      }
    };
    setStep();
  }, []);
  useEffect(() => {
    const setStep = () => {
      localStorage.setItem("step", currentStep.toString());
    };
    setStep();
  }, [currentStep]);
  const [complete, setComplete] = useState(false);
  const stepContent = [
    <Register setCurrentStep={setCurrentStep} />,
    <Packages setCurrentStep={setCurrentStep} />,
    <SchoolInfo setCurrentStep={setCurrentStep} />,
    <Payment setCurrentStep={setCurrentStep} />,
  ];
  return (
    <>
      <div className="w-1/2 m-auto">
        <div className="flex justify-between">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`step-item ${currentStep === i + 1 && "active"} ${
                (i + 1 < currentStep || complete) && "complete"
              } `}
            >
              <div className="step">
                {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
              </div>
              <p className="text-black-500">{step}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="step-content mt-4   md:w-12/12 lg:w-12/12 m-auto">
        {stepContent[currentStep - 1]}
      </div>

      {/* {!complete && (
        <Button
          className="btn mt-4"
          onClick={() => {
            currentStep === steps.length
              ? setComplete(true)
              : setCurrentStep((prev) => prev + 1);
          }}
        >
          {currentStep === steps.length ? "Finish" : "Next"}
        </Button>
      )} */}
    </>
  );
};

export default Stepper;
