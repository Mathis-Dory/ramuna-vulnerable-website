import * as React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface SpinnerProps {
  isOpen: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ isOpen }) => {
  return (
    <Backdrop open={isOpen} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
