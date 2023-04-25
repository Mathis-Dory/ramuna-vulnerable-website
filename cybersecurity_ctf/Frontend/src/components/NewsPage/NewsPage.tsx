import React, { FC, useEffect, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  TextField,
  Dialog,
} from "@mui/material";
import { apiRequest } from "../../shared/utils/Axios";
import { toast } from "react-toastify";
import { Spinner } from "../../shared/utils/Spinner";
import { isAdminRole, isLoggedIn } from "../../shared/utils/Login";

interface NewsPageProps {}

interface GetNews {
  title: string;
  body: string;
  binaryData?: BinaryData | null;
  id: number;
  created_at: string;
  updated_at: string;
}

interface BinaryData {
  type: string;
  data: number[];
}

const NewsPage: FC<NewsPageProps> = () => {
  const [news, setNews] = useState<GetNews[]>([]);
  const [admin, setAdmin] = useState(false);
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<null | Blob>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNews, setFilteredNews] = useState<GetNews[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      setIsSpinnerOpen(true);
      try {
        const response = await apiRequest({
          method: "GET",
          url: `/news/allNews`,
        });
        setNews(response.data as GetNews[]);
        setIsSpinnerOpen(false);
      } catch (error: any) {
        setIsSpinnerOpen(false);
        if (error.data.message === "No news found in the database.") {
          setNews([]);
        } else {
          toast.error("Error getting news. Please try again.");
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      getAdminStatus();
    }
  }, []);

  const getAdminStatus = async () => {
    const adminStatus = await isAdminRole();
    setAdmin(adminStatus);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile as File);
      } else {
        alert("File type not supported. Please select an image file.");
      }
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setTitle("");
    setBody("");
    setFile(null);
  };
  const handleCreatePost = async () => {
    setIsSpinnerOpen(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      if (file) {
        formData.append("file", file);
      }

      const token = localStorage.getItem("token");
      await apiRequest({
        method: "POST",
        url: "/news/postNews",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const createdNews = {
        title: title,
        body: body,
        binaryData: null,
        id: news.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setNews([createdNews, ...news]);
      handleCloseModal();
      setTitle("");
      setBody("");
      setFile(null);
      toast.success("Post created successfully.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error: any) {
      toast.error("Error creating post. Please try again.", {
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
    setIsSpinnerOpen(false);
  };

  const handleCreateNewPost = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    setFilteredNews(news.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.body.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [news, searchQuery]);



  return (
    <div className="bg-primary">
      <NavigationBar />
      {admin ? (
        <div className="flex w-full justify-end p-10">
          <button className="btn-secondary btn" onClick={handleCreateNewPost}>
            Create new post
          </button>
        </div>
      ) : null}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: 8,
          minHeight: "100vh",
        }}
      >
        <h1 className="text-4xl text-secondary underline">Latest news</h1>
        <div className="p-4">
        <TextField
            label="Search"
            variant="filled"
            className="bg-white p-4"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
        />
        </div>
        {news.length === 0 ? (
          <h2 className="p-12 text-3xl">
            Sorry, there are no news for the moment. Come back later.
          </h2>
        ) : (
          <Grid
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              justifyContent: "center",
            }}
          >
            {filteredNews.map((item, index) => (
              <Grid key={index} className="pl-6 pr-6">
                <Card key={index} className="mt-[4rem]">
                  {item.binaryData && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        item.binaryData &&
                        URL.createObjectURL(
                          new Blob([new Uint8Array(item.binaryData.data)], {
                            type: item.binaryData.type,
                          }),
                        )
                      }
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.body}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="create-new-post"
        aria-describedby="create-a-new-post-form"
        maxWidth="xl"
        fullWidth={true}
      >
        <Box className="p-4">
          <Typography component="h2" variant="h6" sx={{ textAlign: "center", paddingBottom: 2 }}>
            Create a new post
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="title"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            sx={{ paddingBottom: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            name="body"
            label="Body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            sx={{ paddingBottom: 2 }}
          />
          <Button variant="contained" component="label" sx={{ paddingBottom: 2 }}>
            Upload Image
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.gif"
              hidden
              name="file"
              onChange={handleFileChange}
            />
          </Button>
          <div className="flex justify-end pt-8">
            <Button variant="contained" onClick={handleCloseModal} sx={{ marginRight: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreatePost}
              color="primary"
              disabled={isSpinnerOpen}
            >
              Create post
            </Button>
          </div>
        </Box>
      </Dialog>
      <Footer />
      <Spinner isOpen={isSpinnerOpen} />
    </div>
  );
};

export default NewsPage;
