import React, { FC } from "react";
import Flag from "../../shared/images/Flag.svg";
import { useNavigate } from "react-router-dom";
interface NavigationBarProps {}

const NavigationBar: FC<NavigationBarProps> = () => {
  const history = useNavigate();

  const handleFrontpageClick = () => {
    history("/");
  };
  const handleRegisterClick = () => {
    history("/register");
  };
  return (
    <div className="navbar flex h-[6rem] justify-around bg-secondary">
      <div className="flex">
        <span className="max-w-[5rem] text-xs normal-case text-primary md:max-w-[10rem]  md:text-lg">
          Romunia Government
        </span>
        <img src={Flag} alt="Flag" className="hidden h-14 md:block" />
      </div>
      <div className="navbar-start flex justify-center lg:hidden">
        <div className="color-primary dropdown">
          <label tabIndex={0} className="btn-ghost btn text-black lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-secondary p-2 text-primary shadow"
          >
            <li onClick={handleFrontpageClick}>
              <span>Homepage</span>
            </li>
            <li tabIndex={0}>
              <span className="justify-between">Registration</span>
            </li>
            <li>
              <span>Contact</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-primary">
          <li onClick={handleFrontpageClick}>
            <span>Home</span>
          </li>
          <li tabIndex={0}>
            <span>Citizenship registration</span>
          </li>
          <li>
            <span>Contact</span>
          </li>
        </ul>
      </div>
      <div className="navbar-end max-w-[5rem] md:max-w-[10rem]">
        <span
          className="btn-ghost btn max-w-[5rem] text-xs text-primary md:max-w-[10rem] md:text-sm"
          onClick={handleRegisterClick}
        >
          Sign in / Sign up
        </span>
      </div>
    </div>
  );
};

export default NavigationBar;
