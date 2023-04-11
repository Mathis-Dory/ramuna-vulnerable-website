import React, { FC, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Spinner } from "../../shared/utils/Spinner";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../shared/utils/Axios";
import { toast } from "react-toastify";

interface SignInPageProps {}

const validateEmail = (email: string): boolean => {
  // Email validation logic, can be improved to be more strict.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePasswordLength = (password: string): boolean => {
  // Password validation logic.
  return password.length >= 8;
};

const SignInPage: FC<SignInPageProps> = () => {
  const history = useNavigate();
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    severity: "error" | "success" | "warning" | "info";
  } | null>(null);
  const setErrorMessage = (message: string, severity: "error" | "success" | "warning" | "info") => {
    setAlert({ message, severity });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.", "error");
      return;
    }
    if (!validatePasswordLength(password)) {
      setErrorMessage("The password must contains at least 8 characters", "error");
      return;
    }

    const formDataJson = Array.from(data.entries()).reduce(
      (acc, [name, value]) => ({ ...acc, [name]: value }),
      {},
    );
    setIsSpinnerOpen(true);
    try {
      const response = await apiRequest({
        method: "POST",
        url: `users/signIn`,
        data: formDataJson,
      });
      const token = (response.data as { token: string }).token;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", (response.data as { userId: string }).userId);
      localStorage.setItem("userName", (response.data as { userName: string }).userName);
      setIsSpinnerOpen(false);
      toast.success("Sign In success!", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      history("/");
    } catch (error: any) {
      setIsSpinnerOpen(false);
      const errorServer =
        error.response.data.message === "Incorrect email or password!"
          ? "Incorrect email or password!"
          : "Sign in failed !";
      toast.error(errorServer, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleSignUpClick = () => {
    history("/signUp");
  };

  return (
    <div>
      <NavigationBar />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {alert && (
          <Alert severity={alert.severity} onClose={() => setAlert(null)}>
            <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
            {alert.message}
          </Alert>
        )}
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form onSubmit={handleSubmit} className="mt-8 max-w-lg">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent="center" className="mb-10 mt-10 h-14">
            <Grid item>
              <Link onClick={handleSignUpClick} variant="body2">
                No account yet? Sign up
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Footer />
      <Spinner isOpen={isSpinnerOpen} />
    </div>
  );
};

export default SignInPage;
