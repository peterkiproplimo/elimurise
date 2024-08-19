import React, { useState } from "react";
import "./stepper.css";
import { TiTick } from "react-icons/ti";
import Register from "./register_account";
import SchoolInfo from "./school_info";
import Button from "../../base-components/Button";
import Packages from "./packages";
const Stepper = () => {
  const steps = [
    "Pricing Packages",
    "Customer Info",
    "School Info",
    "Billing Info",
    "Payment",
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const stepContent = [
    <Packages setCurrentStep={setCurrentStep} />,
    <Register setCurrentStep={setCurrentStep} />,
    <SchoolInfo setCurrentStep={setCurrentStep} />,
    <div key="3">Content for Payment</div>,
    <div key="4">Content for Step 4</div>,
  ];
  return (
    <>
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

      <div className="step-content mt-4">{stepContent[currentStep - 1]}</div>

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
