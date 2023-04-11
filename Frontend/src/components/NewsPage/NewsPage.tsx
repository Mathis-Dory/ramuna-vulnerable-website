import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface NewsPageProps {}

interface News {
  title: string;
  body: string;
  image?: string;
}

const NewsPage: FC<NewsPageProps> = () => {
  const history = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const getNewsData = async () => {
    try {
      const response = await apiRequest({
        method: "GET",
        url: `/news/allNews`,
      });
      setNews(response.data as News[]);
      setIsSpinnerOpen(false);
    } catch (error: any) {
      setIsSpinnerOpen(false);
      const errorServer = "Unable to get news.";
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

  const handleCloseModal = () => {
    setOpenModal(false);
    setTitle("");
    setBody("");
    setImage(null);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleCreatePost = async () => {
    setIsSpinnerOpen(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      if (image) {
        formData.append("image", image);
      }
      await apiRequest({
        method: "POST",
        url: "/news/postNews",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleCloseModal();
      getNewsData();
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

  useEffect(() => {
    setIsSpinnerOpen(true);
    getNewsData();
  }, []);

  const handleCreateNewPost = () => {
    setOpenModal(true);
  };

  return (
    <div className="bg-primary">
      <NavigationBar />
      <div className="flex w-full justify-end p-10">
        <button className="btn-secondary btn" onClick={handleCreateNewPost}>
          Create new post
        </button>
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Latest news
        </Typography>
        <Grid
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            justifyContent: "center",
          }}
        >
          {news.map((item, index) => (
            <Grid className="pl-6 pr-6">
              <Card key={index} className="mt-[4rem]">
                {item.image && <CardMedia component="img" height="300" image={item.image} />}
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
      </Box>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="create-new-post"
        aria-describedby="create-a-new-post-form"
        maxWidth="xl"
        fullWidth={true}
        sx={{ padding: 4 }}
      >
        <Box>
          <Typography component="h2" variant="h6" sx={{ textAlign: "center", paddingY: "4rem" }}>
            Create a new post
          </Typography>
          <Box component="form" sx={{ mt: 4, paddingX: "4rem" }}>
            <TextField
              id="post-title"
              label="Post Title"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              id="post-message"
              label="Post Message"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: 2 }}>
                <Typography variant="subtitle1">Upload Image</Typography>
              </Box>
              <Box>
                <Button variant="contained" component="label">
                  Choose File
                  <input type="file" hidden />
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
              <Button variant="contained" onClick={() => setOpenModal(false)} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleCreatePost}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
      <Footer />
      <Spinner isOpen={isSpinnerOpen} />
    </div>
  );
};

export default NewsPage;
