import React, { FC, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { Spinner } from "../../shared/utils/Spinner";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../shared/utils/Axios";
import { toast } from "react-toastify";
import { isLoggedIn } from "../../shared/utils/Login";
import { DropzoneInputProps, DropzoneRootProps, useDropzone } from "react-dropzone";

interface RegistrationPageProps {}

interface Application {
  name: string;
  email: string;
  files: File[];
}

const RegistrationPage: FC<RegistrationPageProps> = () => {
  const history = useNavigate();
  const [formValues, setFormValues] = useState<Application>({
    name: "",
    email: "",
    files: [],
  });
  const [alert, setAlert] = useState<{
    message: string;
    severity: "error" | "success" | "warning" | "info";
  } | null>(null);
  const setErrorMessage = (message: string, severity: "error" | "success" | "warning" | "info") => {
    setAlert({ message, severity });
  };
  const [, setIsSubmitted] = useState(false);
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);

  const handleSignUpClick = () => {
    history("/signUp");
  };
  const onDrop = (acceptedFiles: File[]) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      files: [...prevValues.files, ...acceptedFiles],
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [], "application/pdf": [] },
    multiple: true,
    maxSize: 10485760, // 10MB
    onDrop,
  });

  const renderDropzone = (rootProps: DropzoneRootProps, inputProps: DropzoneInputProps) => (
    <div {...rootProps} className="boerder-solid  border-4 p-8">
      <input {...inputProps} />
      {isDragActive ? (
        <p>Drop files here...</p>
      ) : (
        <p>Drag and drop files here, or click to select files</p>
      )}
    </div>
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValues.files.length) {
      setErrorMessage("Please upload your documents.", "error");
      return;
    }
    setIsSpinnerOpen(true);
    try {
      // Send form data to server using Axios.
      const formData = new FormData();
      formValues.files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("name", formValues.name);
      const token = localStorage.getItem("token");
      const response = await apiRequest({
        method: "POST",
        url: `requests/postRequest`,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast.success("Your request has been sent successfully !", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during the upload, please try again !", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsSpinnerOpen(false);
    }
  };

  return (
    <div>
      <NavigationBar />
      {isLoggedIn() ? (
        <div className="bg-primary">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "40rem",
            }}
          >
            {alert && (
              <Alert severity={alert.severity} onClose={() => setAlert(null)}>
                <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
                {alert.message}
              </Alert>
            )}
            <h1 className="p-12 text-4xl text-secondary">Apply for Citizenship</h1>
            <form className="mt-2 flex flex-col items-center" onSubmit={handleSubmit}>
              {renderDropzone(getRootProps(), getInputProps())}
              <div className="mb-6 mt-6">
                {formValues.files.map((file) => (
                  <p key={file.name}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                ))}
              </div>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
            <p className="mt-6 p-4">
              In order to apply for the Ramuna citizenship, please upload your passport and the
              proof of residence. Note that you can apply only once at time, after you click the
              submit button you will not be able to upload new documents. If you want to upload new
              documents, please contact the Ramuna government.
            </p>
            <p className="mt-6 p-4">
              Your application will receive the pending status and need to be reviewed by the admin.
              Once the admin has reviewed your application, you will receive an email with the
              status of your application.
            </p>
          </Box>
        </div>
      ) : (
        <>
          <div className="hero min-h-screen bg-error">
            <div className="hero-content flex-col lg:flex-row-reverse">
              <div>
                <h1 className="text-5xl font-bold">
                  You do not have access to this page, you must have an account first !
                </h1>
                <p className="py-6">
                  In order to apply for the citizenship, you must have an account and sign in. If
                  you do not have an account, you can create one by clicking the button below.
                </p>

                <button className="btn-secondary btn mt-10" onClick={handleSignUpClick}>
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
      <Spinner isOpen={isSpinnerOpen} />
    </div>
  );
};

export default RegistrationPage;
