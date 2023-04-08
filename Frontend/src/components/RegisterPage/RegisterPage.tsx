import React, { FC, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { apiRequest } from "../../shared/utils/Axios";
import { Spinner } from "../../shared/utils/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface RegisterPageProps {}
countries.registerLocale(enLocale);

const validateEmail = (email: string): boolean => {
  // Email validation logic, can be improved to be more strict.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePasswordLength = (password: string): boolean => {
  // Password validation logic.
  return password.length >= 8;
};
const validatePasswordMatch = (password: string, repeatPassword: string): boolean => {
  // Password validation logic.
  return password === repeatPassword;
};

const RegisterPage: FC<RegisterPageProps> = () => {
  const countryObj = countries.getNames("en", { select: "official" });
  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return { label: value, value: key };
  });
  const history = useNavigate();

  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [sex, setSex] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [alert, setAlert] = useState<{
    message: string;
    severity: "error" | "success" | "warning" | "info";
  } | null>(null);
  const setErrorMessage = (message: string, severity: "error" | "success" | "warning" | "info") => {
    setAlert({ message, severity });
  };

  const handleChangeSex = (event: SelectChangeEvent) => {
    setSex(event.target.value as string);
  };

  const handleChangeCitizenship = (event: SelectChangeEvent) => {
    setCitizenship(event.target.value as string);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.", "error");

      return;
    }

    if (!validatePasswordLength(password)) {
      setErrorMessage("Password must be at least 8 characters long.", "error");
      return;
    }

    if (!validatePasswordMatch(password, repeatPassword)) {
      setErrorMessage("Passwords do not match.", "error");
      return;
    }

    const formDataWithoutRepeatPassword = Array.from(formData.entries())
      .filter(([name]) => name !== "repeatPassword")
      .reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {});

    // Submit the form data to the server.
    setIsSpinnerOpen(true);
    try {
      await apiRequest({
        method: "POST",
        url: `/users/signUp`,
        data: formDataWithoutRepeatPassword,
      });
      setIsSpinnerOpen(false);
      toast.success("Registration success!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      history("/");
    } catch (error) {
      console.error(error);
      setIsSpinnerOpen(false);
      toast.error("Registration failed!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div>
      <NavigationBar />
      {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert(null)}>
          <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
          {alert.message}
        </Alert>
      )}

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form onSubmit={handleSubmit} className="mt-8 max-w-lg">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className="w-full">
                <InputLabel id="sexLabel">Sex</InputLabel>
                <Select
                  required
                  labelId="sexLabel"
                  label="Sex"
                  id="sex"
                  name="sex"
                  value={sex}
                  fullWidth
                  onChange={handleChangeSex}
                >
                  <MenuItem value={"M"}>Male</MenuItem>
                  <MenuItem value={"F"}>Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className="w-full">
                <InputLabel id="citizenshipLabel">Citizenship</InputLabel>
                <Select
                  required
                  labelId="citizenshipLabel"
                  label="Citizenship"
                  id="citizenship"
                  value={citizenship}
                  fullWidth
                  name="citizenship"
                  onChange={handleChangeCitizenship}
                >
                  {countryArr?.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="repeatPassword"
                label="Repeat Password"
                type="password"
                id="repeatPassword"
                autoComplete="repeat-password"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="center" className="mb-10 mt-10 h-14">
            <Grid item>
              <Link href="#" variant="body2">
                {/* TODO: Add route to signIn page */} Already have an account? Sign in
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

export default RegisterPage;
