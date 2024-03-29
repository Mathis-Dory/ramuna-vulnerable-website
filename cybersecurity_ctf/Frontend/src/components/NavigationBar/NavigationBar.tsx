import React, { FC } from "react";
import Flag from "../../shared/images/Flag.svg";
import { useNavigate } from "react-router-dom";
import { deleteTokens, isLoggedIn } from "../../shared/utils/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
interface NavigationBarProps {}

const NavigationBar: FC<NavigationBarProps> = () => {
  const history = useNavigate();

  const handleLogoutClick = () => {
    deleteTokens();
    history("/");
  };

  const handleFrontpageClick = () => {
    history("/");
  };
  const handleSignUpClick = () => {
    history("/signUp");
  };

  const handleContactClick = () => {
    history("/contact");
  };

  const handleRegistrationClick = () => {
    history("/citizenship");
  };
  const handleNewsClick = () => {
    history("/news");
  };
  return (
    <div className="navbar flex h-[6rem] justify-around bg-secondary">
      <div className="flex">
        <span className="max-w-[5rem] text-xs normal-case text-primary md:max-w-[10rem]  md:text-lg">
          Ramuna Government
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
            <li onClick={handleNewsClick}>
              <span>News</span>
            </li>
            <li tabIndex={0} onClick={handleRegistrationClick}>
              <span className="justify-between">Citizenship request</span>
            </li>
            <li onClick={handleContactClick}>
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
          <li onClick={handleNewsClick}>
            <span>News</span>
          </li>
          <li tabIndex={0} onClick={handleRegistrationClick}>
            <span>Citizenship request</span>
          </li>
          <li onClick={handleContactClick}>
            <span>Contact</span>
          </li>
        </ul>
      </div>
      <div className="navbar-end max-w-[5rem] md:max-w-[10rem]">
        {isLoggedIn() ? (
          <>
            <div className="flex gap-6">
              <span className="flex items-center text-primary md:text-sm">
                Welcome {localStorage.getItem("userName")}
              </span>
              <IconButton
                color="primary"
                aria-label="Logout"
                component="label"
                onClick={handleLogoutClick}
              >
                <LogoutIcon />
              </IconButton>
            </div>
          </>
        ) : (
          <span
            className="btn-ghost btn max-w-[5rem] text-xs text-primary md:max-w-[10rem] md:text-sm"
            onClick={handleSignUpClick}
          >
            Sign in / Sign up
          </span>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
