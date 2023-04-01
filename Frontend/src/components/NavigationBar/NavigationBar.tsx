import React, { FC } from "react";
import Flag from "../../shared/images/Flag.svg";
interface NavigationBarProps {}

const NavigationBar: FC<NavigationBarProps> = () => (
  <div className="navbar bg-secondary">
    <div className="navbar-start">
      <div className="color-primary dropdown">
        <label tabIndex={0} className="color-primary btn-ghost btn lg:hidden">
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
          className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-primary p-2 shadow"
        >
          <li>
            <a>Homepage</a>
          </li>
          <li tabIndex={0}>
            <a className="justify-between">Registration</a>
          </li>
          <li>
            <a>Contact</a>
          </li>
        </ul>
      </div>
      <a className="btn-ghost btn text-xl normal-case text-primary">Romunia Official Website</a>
      <img src={Flag} alt="Flag" className="h-14" />
    </div>
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1 text-primary">
        <li>
          <a>Home</a>
        </li>
        <li tabIndex={0}>
          <a>Citizenship registration</a>
        </li>
        <li>
          <a>Contact</a>
        </li>
      </ul>
    </div>
    <div className="navbar-end">
      <a className="btn-ghost btn text-primary">Login</a>
    </div>
  </div>
);

export default NavigationBar;
