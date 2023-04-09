import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";
import Flag from "../../shared/images/Flag.svg";
import Warning from "../../shared/images/Warning.svg";
interface FrontPageProps {}

const FrontPage: FC<FrontPageProps> = () => {
  const history = useNavigate();

  const handleRegisterClick = () => {
    history("/register");
  };

  return (
    <div>
      <NavigationBar />
      <div className="hero min-h-screen bg-primary">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src={Flag}
            className="max-w-[10rem] rounded-lg shadow-2xl"
            alt={"Romunia fictive flag"}
          />
          <div>
            <h1 className="text-5xl font-bold">Welcome to the website of Romunia government!</h1>
            <p className="py-6">
              Our website is build with the latest technologies for the best user experience and the
              comfort of our citizens. If you desire to immigrate to Romunia, you can register for
              citizenship and we will contact you as soon as possible.
            </p>
            <p className="flex-column flex gap-6">
              <img src={Warning} className="w-10" alt={"Warning"} /> Due to the political situation
              in our country, we are exposed to cyber attacks. Please be careful we have hackers
              among us. HAPPY HACKING!
            </p>
            <button className="btn-primary btn mt-10" onClick={handleRegisterClick}>
              Sign up
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FrontPage;
