import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
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

  const getNewsData = async () => {
    try {
      const response = await apiRequest({
        method: "GET",
        url: `/news`,
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

  useEffect(() => {
    setIsSpinnerOpen(true);
    getNewsData();
  }, []);

  return (
    <div>
      <NavigationBar />
      {news.map((item, index) => (
        <Card key={index}>
          {item.image && <CardMedia component="img" height="200" image={item.image} />}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.body}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Footer />
      <Spinner isOpen={isSpinnerOpen} />
    </div>
  );
};

export default NewsPage;
