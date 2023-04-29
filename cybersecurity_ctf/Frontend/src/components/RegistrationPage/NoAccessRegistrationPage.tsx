import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

interface NoAccessRegistrationPageProps {}

const NoAccessRegistrationPage: FC<NoAccessRegistrationPageProps> = () => {
  const history = useNavigate();
  const handleSignUpClick = () => {
    history("/signUp");
  };
  return (
    <div className="hero min-h-screen bg-error">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div>
          <h1 className="text-5xl font-bold">
            You do not have access to this page, you must have an account first !
          </h1>
          <p className="py-6">
            In order to apply for the citizenship, you must have an account and sign in. If you do
            not have an account, you can create one by clicking the button below.
          </p>

          <button className="btn-secondary btn mt-10" onClick={handleSignUpClick}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoAccessRegistrationPage;
