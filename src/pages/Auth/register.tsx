import Stepper from "../Registration/Stepper";
import { useLocation } from "react-router-dom";

const Register = () => {
  return (
    <>
      <div className="bg-white-900   h-screen">
        <div className="m-auto">
          <h1 className="text-center text-3xl p-3 font-bold">
            Account Creation
          </h1>
        </div>

        <Stepper />
      </div>
    </>
  );
};

export default Register;
