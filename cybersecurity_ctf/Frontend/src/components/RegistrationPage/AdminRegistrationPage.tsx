import React, { FC, useEffect, useState } from "react";
import {Spinner} from "../../shared/utils/Spinner";
import { toast } from "react-toastify";
import {apiRequest} from "../../shared/utils/Axios";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button} from "@mui/material";
import {User} from "../../shared/utils/Type";

interface AdminRegistrationPageProps {}



interface Document {
    id: string;
    type: string;
    documentType: string;
    status: string;
    rawData: {
        type: string;
        data: number[];
    };
    requestId: string;
}

interface Request {
    [key: string]: {
        id: string;
        status: string;
        userId: string;
        asigneeId: number;
        documents: Document[];
    };
}


type ResponseFormatted = {
    id: string;
    email: string;
    user: string;
    status: string;
    userId: string;
    asigneeId: number;
    documents: Document[];
};

const AdminRegistrationPage: FC<AdminRegistrationPageProps> = () => {
    const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
    const [applications, setApplications] = useState<ResponseFormatted[]>([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        setIsSpinnerOpen(true);
        try {
            const response = await apiRequest({
                method: "GET",
                url: "/requests/admin/assigned",
                headers: { Authorization: `Bearer ${token}` },
            });
            const responseFormattedArray: ResponseFormatted[] = await Promise.all((response.data as Request[]).map(async (request) => {
                const { id, status, userId, asigneeId, documents } = request[Object.keys(request)[0]];
                const { email, user } = await getUser(userId);
                return {
                    id,
                    status,
                    userId,
                    asigneeId,
                    documents,
                    email,
                    user,
                };
            }));
            setApplications(responseFormattedArray);

            setIsSpinnerOpen(false);
        } catch (err) {
            console.log("error", err);
            const errorServer = "Not able to retrieve the applications of the users.";
            toast.error(errorServer);
            setIsSpinnerOpen(false);
        }
    };

    const getUser = async (id: string): Promise<{ email: string, user: string }> => {
        setIsSpinnerOpen(true);
        try {
            const response = await apiRequest({
                method: "GET",
                url: `/users/${id}`,
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsSpinnerOpen(false);
            return {email:(response.data as User[])[0].email, user:(response.data as User[])[0].firstName + " " + (response.data as User[])[0].lastName};
        } catch (err) {
            console.log("error", err);
            const errorServer = "Not able to retrieve users";
            toast.error(errorServer);
            setIsSpinnerOpen(false);
            return {email: "undefined", user: "undefined"};
        }
    }
    const handleStatusChange = (id: string, status: string) => {
        // logic to update the status of the request with the given id
    }


    const handleDownload = async (id: string, type: string) => {
        try {
            const response = await apiRequest<ArrayBuffer>({
                method: "GET",
                url: `/documents/download/${id}`,
                responseType: "arraybuffer",
                headers: { Authorization: `Bearer ${token}` },
            });

            // Create a Blob object from the ArrayBuffer
            const blobData = new Blob([response.data], { type });

            // Create a URL for the blob
            const url = window.URL.createObjectURL(blobData);

            // Create a download link
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `file.${type.split("/")[1]}`);
            document.body.appendChild(link);
            link.click();

            // Cleanup the URL object
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            toast.error("Failed to download the document");
        }
    };

    return (
        <div className="hero min-h-screen bg-primary flex flex-col p-8">
            <h1 className="text-4xl text-secondary underline">Admin panel</h1>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="p-12 m-12">
                    {applications.length === 0 ? (
                        <div>
                            <h1 className="text-2xl text-white">No applications to show</h1>
                        </div>
                    ) : (
                        <>
                            {applications && applications.length > 0 && (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>User</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Documents</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {applications ? (
                                                applications.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.id}</TableCell>
                                                        <TableCell>{item.user}</TableCell>
                                                        <TableCell>{item.email}</TableCell>
                                                        <TableCell>{item.status}</TableCell>
                                                        <TableCell>
                                                            <div>
                                                                {item.documents.map((doc) => (
                                                                    <div key={doc.id}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            style={{ width: "150px", margin: "5px", padding: "10px" }}
                                                                            onClick={() => handleDownload(doc.id, doc.type)}
                                                                        >
                                                                            {doc.documentType}
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                style={{ width: "100px", margin: "5px", padding: "10px" }}
                                                                onClick={() => handleStatusChange(item.id, "approved")}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                style={{ width: "100px", margin: "5px", padding: "10px" }}
                                                                onClick={() => handleStatusChange(item.id, "rejected")}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4}>No applications found</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Spinner isOpen={isSpinnerOpen} />
        </div>
    );


};

export default AdminRegistrationPage;
