import React, { FC } from "react";
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

interface RegisterPageProps {}
const RegisterPage: FC<RegisterPageProps> = () => {
  countries.registerLocale(enLocale);

  const countryObj = countries.getNames("en", { select: "official" });
  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return { label: value, value: key };
  });
  const [sex, setSex] = React.useState("");
  const [citizenship, setCitizenship] = React.useState("");

  const handleChangeSex = (event: SelectChangeEvent) => {
    setSex(event.target.value as string);
  };

  const handleChangeCitizenship = (event: SelectChangeEvent) => {
    setCitizenship(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("submit");
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form onSubmit={handleSubmit} className="max-w-lg">
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
                  onChange={handleChangeCitizenship}
                >
                  {!!countryArr?.length &&
                    countryArr.map(({ label, value }) => (
                      <MenuItem value={value}>{label}</MenuItem>
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
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Footer />
    </div>
  );
};

export default RegisterPage;
