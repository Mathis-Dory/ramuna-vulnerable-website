
import React, { FC, useEffect, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { Spinner } from "../../shared/utils/Spinner";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../shared/utils/Axios";
import { toast } from "react-toastify";
import { getCurrentUser, isAdminRole, isLoggedIn } from "../../shared/utils/Login";
import { DropzoneInputProps, DropzoneRootProps, useDropzone } from "react-dropzone";
import { User } from "../../shared/utils/Type";
import AdminRegistrationPage from "./AdminRegistrationPage";

interface RegistrationPageProps {}

const MAX_PDF_FILES = 1;
const MAX_IMAGE_FILES = 1;

interface Application {
    name: string;
    email: string;
    status?: string;
    files: { pdf: File[]; image: File[] };
}

const RegistrationPage: FC<RegistrationPageProps> = () => {
    const history = useNavigate();
    const token = localStorage.getItem("token");
    const [formValues, setFormValues] = useState<Application>({
        name: "",
        email: "",
        files: { pdf: [], image: [] },
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
    const [application, setApplication] = useState<Application[] | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        setIsSpinnerOpen(true);
        if (isLoggedIn()) {
            getAdminStatus();
        }
        setIsSpinnerOpen(false);
    }, []);

    useEffect(() => {
        setIsSpinnerOpen(true);
        if (isLoggedIn() && !admin) {
            getApplication();
            loadCurrentUser();
        }
        setIsSpinnerOpen(false);
    }, []);

    const getAdminStatus = async () => {
        const adminStatus = await isAdminRole();
        setAdmin(adminStatus);
    };

    const loadCurrentUser = async () => {
        try {
            const response = await getCurrentUser();
            setCurrentUser(response as User);
        } catch (error: any) {
            setIsSpinnerOpen(false);
            const errorServer = "Not able to retrieve current user.";
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

    const getApplication = async () => {
        try {
            const response = await apiRequest({
                method: "GET",
                url: `/requests/requestsHistory`,
                headers: { Authorization: `Bearer ${token}` },
            });
            if ((response.data as Application[]).length === 0) {
                setApplication(null);
            }
            else{
                setApplication(response.data as Application[]);
            }
        } catch (error: any) {
            setIsSpinnerOpen(false);
            const errorServer = "Server error when retrieving application.";
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
    const onDrop = (acceptedFiles: File[]) => {
        const pdfFiles = acceptedFiles.filter((file) => file.type === "application/pdf");
        const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));

        setFormValues((prevValues) => ({
            ...prevValues,
            files: {
                pdf: [...prevValues.files.pdf, ...pdfFiles],
                image: [...prevValues.files.image, ...imageFiles],
            },
        }));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [], "application/pdf": [] },
        multiple: true,
        maxSize: 10485760, // 10MB
        onDrop,
    });

    const renderDropzone = (rootProps: DropzoneRootProps, inputProps: DropzoneInputProps) => (
        <div {...rootProps} className="border-4  border-solid p-8">
            <input {...inputProps} />
            {isDragActive ? (
                <p>Drop files here...</p>
            ) : (
                <p>Drag and drop files here, or click to select files</p>
            )}
        </div>
    );

    const handleClearDropzone = () => {
        setFormValues((prevValues) => ({
            ...prevValues,
            files: { pdf: [], image: [] },
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formValues.files.pdf.length === 0 || formValues.files.image.length === 0) {
            setErrorMessage("Please upload one PDF and one image.", "error");
            return;
        }
        if (formValues.files.pdf.length > MAX_PDF_FILES) {
            setErrorMessage(`Please upload no more than ${MAX_PDF_FILES} PDF files.`, "error");
            return;
        }
        if (formValues.files.image.length > MAX_IMAGE_FILES) {
            setErrorMessage(`Please upload no more than ${MAX_IMAGE_FILES} image files.`, "error");
            return;
        }
        setIsSpinnerOpen(true);
        try {
            // Send form data to server using Axios.
            const formData = new FormData();

            // Loop through the PDF files
            formValues.files.pdf.slice(0, MAX_PDF_FILES).forEach((file) => {
                formData.append('files[]', file, 'pdf');
            });

            // Loop through the image files
            formValues.files.image.slice(0, MAX_IMAGE_FILES).forEach((file) => {
                formData.append('files[]', file, 'image');
            });
            formData.append("name", currentUser?.firstName + " " + currentUser?.lastName);
            formData.append("email", currentUser?.email || "");
           await apiRequest({
                method: "POST",
                url: `requests/postRequest`,
                data: formData,
                headers: { Authorization: `Bearer ${token}` },
            });
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
                history("/");
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
                admin ? (
                    <AdminRegistrationPage />
                ) : (application != null ? (application[0].status === "pending" ? (<div className="hero min-h-screen bg-primary">
                        <div className="hero-content flex-col lg:flex-row-reverse">
                            <div className="p-12 m-12">
                                <h1 className="text-5xl font-bold text-secondary">
                                     Your application is currently being processed.
                                </h1>
                                <p className="py-6">
                                    You will receive an email when your application is processed.
                                </p>
                            </div>
                        </div>
                    </div>): ( <div className="hero min-h-screen bg-primary"><div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="p-12 m-12">
                            <h1 className="text-5xl font-bold text-error">
                                Your application is rejected.
                            </h1>
                            <p className="py-6">
                               Contact support to try again.
                            </p>
                        </div>
                    </div></div>)) : (
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
                            <h1 className="p-12 text-4xl text-secondary underline">Apply for citizenship</h1>
                            <form className="mt-2 flex flex-col items-center" onSubmit={handleSubmit}>
                                {renderDropzone(getRootProps(), getInputProps())}
                                <div className="mb-6 mt-6">
                                    <p className="text-secondary">
                                        Please upload your proof of residence (PDF) and your passport (image).{" "}
                                        <span className="text-error">Max file size: 10MB.</span>
                                    </p>
                                    <ul>
                                        <li>{formValues.files.pdf.length} PDF file(s) uploaded</li>
                                        <li>{formValues.files.image.length} image(s) uploaded</li>
                                    </ul>
                                    {formValues.files.pdf.slice(0, MAX_PDF_FILES).map((file) => (
                                        <p key={file.name}>
                                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    ))}
                                    {formValues.files.image.slice(0, MAX_IMAGE_FILES).map((file) => (
                                        <p key={file.name}>
                                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                    <Button
                                        className="btn-warning"
                                        onClick={handleClearDropzone}
                                        variant="contained"
                                        color="warning"
                                    >
                                        Clear documents
                                    </Button>
                                </div>
                            </form>
                            <p className="mt-6 p-4">
                                In order to apply for the Ramuna citizenship, please upload your passport and the
                                proof of residence. Note that you can apply only once at time, after you click the
                                submit button you will not be able to upload new documents. If you want to upload
                                new documents, please contact the Ramuna government.
                            </p>
                            <p className="mt-6 p-4">
                                Your application will receive the pending status and need to be reviewed by the
                                admin. Once the admin has reviewed your application, you will receive an email with
                                the status of your application.
                            </p>
                        </Box>
                    </div>)
                )
            ) : (
                <div className="hero min-h-screen bg-error">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div>
                            <h1 className="text-5xl font-bold">
                                You do not have access to this page, you must have an account first !
                            </h1>
                            <p className="py-6">
                                In order to apply for the citizenship, you must have an account and sign in. If you
                                do not have an account, you can create one by clicking the button below.
                            </p>

                            <button className="btn-secondary btn mt-10" onClick={handleSignUpClick}>
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
            <Spinner isOpen={isSpinnerOpen} />
        </div>
    );
};

export default RegistrationPage;
