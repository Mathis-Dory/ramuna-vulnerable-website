import React, { FC, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";
import { Alert, AlertTitle, Avatar, Box, Button, Grid, TextField, Typography } from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
interface ContactPageProps {}

const ContactPage: FC<ContactPageProps> = () => {
  const history = useNavigate();
  const validateEmail = (email: string): boolean => {
    // Email validation logic, can be improved to be more strict.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMessage = (message: string): boolean => {
    const messageRegex = /^(?!\s*$)[a-zA-Z.+\s'-]+$/;
    return messageRegex.test(message);
  };

  const [alert, setAlert] = useState<{
    message: string;
    severity: "error" | "success" | "warning" | "info";
  } | null>(null);
  const setErrorMessage = (message: string, severity: "error" | "success" | "warning" | "info") => {
    setAlert({ message, severity });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.", "error");
      return;
    }
    if (!validateMessage(message)) {
      setErrorMessage("Your message length is not valid !", "error");
      return;
    }

    toast.success("Message sent !", {
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
  };
  return (
    <div>
      <NavigationBar />
      <div className="min-h-screen">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="mb-6"
      >
        {alert && (
          <Alert severity={alert.severity} onClose={() => setAlert(null)}>
            <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
            {alert.message}
          </Alert>
        )}
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <ContactSupportIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Contact us
        </Typography>
        <form onSubmit={handleSubmit} className="mt-8 max-w-lg">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Your email"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="name"
                label="Your Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-message"
                name="message"
                required
                fullWidth
                id="message"
                label="Your message"
                autoFocus
                multiline
                rows={8}
              />
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Send
            </Button>
          </Grid>
        </form>
      </Box>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
