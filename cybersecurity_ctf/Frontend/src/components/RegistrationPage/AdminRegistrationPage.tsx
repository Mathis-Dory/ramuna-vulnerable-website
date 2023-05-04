import React, { FC, useEffect, useState } from "react";
import { Spinner } from "../../shared/utils/Spinner";
import { toast } from "react-toastify";
import { apiRequest } from "../../shared/utils/Axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { User } from "../../shared/utils/Type";
import { deleteTokens, isLoggedIn, isTokenExpired } from "../../shared/utils/Login";
import { useNavigate } from "react-router-dom";

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
  const history = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      if (isTokenExpired(token as string)) {
        deleteTokens();
        history("/");
        toast.error("Please sign in again.");
        return;
      } else {
        fetchData();
      }
    } else {
      history("/");
      toast.error("Please sign in again.");
      return;
    }
  }, []);

  const fetchData = async () => {
    setIsSpinnerOpen(true);
    try {
      const response = await apiRequest({
        method: "GET",
        url: "/requests/admin/assigned",
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseFormattedArray: ResponseFormatted[] = await Promise.all(
        (response.data as Request[]).map(async (request) => {
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
        }),
      );
      setApplications(responseFormattedArray);

      setIsSpinnerOpen(false);
    } catch (err) {
      console.log("error", err);
      const errorServer = "Not able to retrieve the applications of the users.";
      toast.error(errorServer);
      setIsSpinnerOpen(false);
    }
  };

  const getUser = async (id: string): Promise<{ email: string; user: string }> => {
    setIsSpinnerOpen(true);
    if (isLoggedIn()) {
      if (isTokenExpired(token as string)) {
        deleteTokens();
        history("/");
        toast.error("Please sign in again.");
        return { email: "undefined", user: "undefined" };
      }
    } else {
      history("/");
      toast.error("Please sign in again.");
      return { email: "undefined", user: "undefined" };
    }
    try {
      const response = await apiRequest({
        method: "GET",
        url: `/users/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsSpinnerOpen(false);
      return {
        email: (response.data as User[])[0].email,
        user: (response.data as User[])[0].firstName + " " + (response.data as User[])[0].lastName,
      };
    } catch (err) {
      console.log("error", err);
      const errorServer = "Not able to retrieve users";
      toast.error(errorServer);
      setIsSpinnerOpen(false);
      return { email: "undefined", user: "undefined" };
    }
  };
  const handleStatusChange = async (id: string, status: string) => {
    setIsSpinnerOpen(true);
    if (isLoggedIn()) {
      if (isTokenExpired(token as string)) {
        deleteTokens();
        history("/");
        toast.error("Please sign in again.");
        return;
      }
    } else {
      history("/");
      toast.error("Please sign in again.");
      return;
    }

    try {
      await apiRequest({
        method: "PUT",
        url: `/requests/editRequestStatus/id/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        data: { status: status },
      });
      window.location.reload();
      const successMessage = "The request has been updated successfully.";
      toast.success(successMessage);
    } catch (err) {
      console.log("error", err);
      const errorServer = "Not able to update this request.";
      toast.error(errorServer);
      setIsSpinnerOpen(false);
    }
    setIsSpinnerOpen(false);
  };

  const handleDownload = async (id: string, type: string) => {
    setIsSpinnerOpen(true);
    if (isLoggedIn()) {
      if (isTokenExpired(token as string)) {
        deleteTokens();
        history("/");
        toast.error("Please sign in again.");
        return;
      }
    } else {
      history("/");
      toast.error("Please sign in again.");
      return;
    }
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
      setIsSpinnerOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download the document");
      setIsSpinnerOpen(false);
    }
  };

  const sortedApplications = applications.sort((a, b) => {
    if (a.status === b.status) {
      return +a.id - +b.id;
    } else if (a.status === "pending") {
      return -1;
    } else if (b.status === "pending") {
      return 1;
    } else if (a.status === "rejected") {
      return -1;
    } else if (b.status === "rejected") {
      return 1;
    } else {
      return -1;
    }
  });

  return (
    <div className="hero flex min-h-screen flex-col bg-primary p-8">
      <h1 className="text-4xl text-secondary underline">Admin panel</h1>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="m-12 p-12">
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
                        <TableCell></TableCell>
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
                        sortedApplications.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div
                                className={`mr-2 h-12 w-2 rounded ${
                                  item.status === "approved"
                                    ? "bg-green-500"
                                    : item.status === "rejected"
                                    ? "bg-red-500"
                                    : "bg-orange-500"
                                }`}
                              ></div>
                            </TableCell>
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
                              {item.status === "approved" ? (
                                <Button
                                  variant="contained"
                                  color="error"
                                  style={{ width: "100px", margin: "5px", padding: "10px" }}
                                  onClick={() => handleStatusChange(item.id, "rejected")}
                                >
                                  Reject
                                </Button>
                              ) : item.status === "pending" ? (
                                <>
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
                                </>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="success"
                                  style={{ width: "100px", margin: "5px", padding: "10px" }}
                                  onClick={() => handleStatusChange(item.id, "approved")}
                                >
                                  Approve
                                </Button>
                              )}
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
