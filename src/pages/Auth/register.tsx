import Stepper from "../Registration/Stepper";

const Register = () => {
  return (
    <>
      <div className="bg-white-900   h-screen">
        <div className="m-auto">
          <h1 className="text-center text-sm">Account Creation</h1>
        </div>

        <Stepper />
      </div>
    </>
  );
};

export default Register;
