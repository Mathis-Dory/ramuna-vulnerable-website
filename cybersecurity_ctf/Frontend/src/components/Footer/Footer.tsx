import React, { FC } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const history = useNavigate();

  const handleContactClick = () => {
    history("/contact");
  };
  const handleHomeClick = () => {
    history("/");
  };

  const handleCitizenshipClick = () => {
    history("/citizenship");
  };

  const handleNewsClick = () => {
    history("/news");
  };
  function Copyright(props: any) {
    return (
      <Typography variant="body2" color="white" align="center" {...props}>
        {"Copyright © "}
        <span color="inherit">Ramuna</span> {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }
  return (
    <footer className="footer bg-black p-10 text-base-content">
      <div>
        <span className="footer-title">Quick links</span>
        <span className="link-hover link" onClick={handleHomeClick}>
          Home
        </span>
        <span className="link-hover link" onClick={handleNewsClick}>News</span>
        <span className="link-hover link" onClick={handleCitizenshipClick}>Citizenship</span>
        <span className="link-hover link" onClick={handleContactClick}>
          Contact
        </span>
      </div>
      <div>
        <span className="footer-title">Social</span>
        <div className="grid grid-flow-col gap-4">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
            </svg>
          </span>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
          </a>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </span>
        </div>
        <Copyright sx={{ mt: 5 }} />
      </div>
    </footer>
  );
};

export default Footer;
